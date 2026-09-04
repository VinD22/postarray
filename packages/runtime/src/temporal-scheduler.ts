import {
  Client,
  Connection,
  WorkflowExecutionAlreadyStartedError,
  WorkflowIdReusePolicy,
  WorkflowNotFoundError,
  type WorkflowClient,
} from '@temporalio/client';

import {
  publishWorkflowId,
  dataDeletionWorkflowId,
  dataExportWorkflowId,
  ruleWorkflowId,
  type Clock,
  type SchedulerPort,
  type SchedulerKind,
  type WorkflowActorContext,
} from '@relay/application';
import { ERROR_CODES, RelayError, type ProviderId } from '@relay/contracts';
import type { Logger } from '@relay/observability';

const PUBLISH_WORKFLOW = 'publishPostWorkflow';
const ANALYTICS_WORKFLOW = 'analyticsSyncWorkflow';
const RULE_WORKFLOW = 'automationRuleWorkflow';
const DATA_EXPORT_WORKFLOW = 'dataExportWorkflow';
const DATA_DELETION_WORKFLOW = 'dataDeletionWorkflow';
const SIX_HOURS_MS = 6 * 60 * 60_000;

export interface TemporalSchedulerOptions {
  readonly address: string;
  readonly namespace: string;
  readonly taskQueue: string;
  readonly apiKey?: string;
  readonly clock: Clock;
  readonly logger: Logger;
  readonly connect?: typeof Connection.connect;
  /** Test seam. Production always creates this from the configured connection. */
  readonly workflowClient?: WorkflowClient;
}

/** Durable scheduler used by every production surface. */
export class TemporalScheduler implements SchedulerPort {
  readonly #options: TemporalSchedulerOptions;
  readonly #connect: typeof Connection.connect;
  #connection: Promise<Connection> | null = null;
  #client: Promise<Client> | null = null;

  describeKind(): SchedulerKind {
    return 'temporal';
  }

  constructor(options: TemporalSchedulerOptions) {
    this.#options = options;
    this.#connect = options.connect ?? Connection.connect;
  }

  async schedulePublish(input: Parameters<SchedulerPort['schedulePublish']>[0]) {
    const workflowId = publishWorkflowId(input.workspaceId, input.jobId);
    try {
      const client = await this.#workflowClient();
      const handle = await client.start(PUBLISH_WORKFLOW, {
        taskQueue: this.#options.taskQueue,
        workflowId,
        workflowIdReusePolicy: WorkflowIdReusePolicy.REJECT_DUPLICATE,
        args: [input.workflowInput],
      });
      return { workflowId, runId: handle.firstExecutionRunId };
    } catch (cause) {
      if (cause instanceof WorkflowExecutionAlreadyStartedError) {
        const description = await this.#describeWorkflow(workflowId);
        if (description !== null) {
          return { workflowId, runId: description.runId };
        }
      }
      throw this.#unavailable('schedule_publish', cause);
    }
  }

  async cancelPublish(input: Parameters<SchedulerPort['cancelPublish']>[0]): Promise<void> {
    await this.#signal(publishWorkflowId(input.workspaceId, input.jobId), 'cancel', {
      reason: input.reason,
      requestedAt: this.#options.clock.now().toISOString(),
    });
  }

  async reschedulePublish(input: Parameters<SchedulerPort['reschedulePublish']>[0]): Promise<void> {
    await this.#signal(publishWorkflowId(input.workspaceId, input.jobId), 'reschedule', {
      instant: input.executeAt.toISOString(),
      ianaTimeZone: input.ianaTimeZone,
      confirmedDst: true,
    });
  }

  async signalPublish(input: Parameters<SchedulerPort['signalPublish']>[0]): Promise<void> {
    await this.#signal(
      publishWorkflowId(input.workspaceId, input.jobId),
      input.signal,
      input.payload,
    );
  }

  async scheduleAnalyticsSync(
    input: Parameters<SchedulerPort['scheduleAnalyticsSync']>[0],
  ): Promise<void> {
    const workflowId = `analytics:${input.workspaceId}:${input.connectionId}${
      input.receiptId === undefined ? '' : `:${input.receiptId}`
    }`;
    const workflowInput = {
      ctx: input.ctx,
      connectionId: input.connectionId,
      provider: input.provider,
      receiptId: input.receiptId ?? null,
      publishedAt: input.publishedAt ?? null,
      pendingOffsetsMs: [],
      steadyIntervalMs: SIX_HOURS_MS,
      iterationsThisRun: 0,
      totalIterations: 0,
    };
    await this.#startUnique(ANALYTICS_WORKFLOW, workflowId, workflowInput, input.at);
  }

  async startRuleRun(input: Parameters<SchedulerPort['startRuleRun']>[0]) {
    const workflowId = ruleWorkflowId(input.workspaceId, input.ruleId, input.runId);
    await this.#startUnique(RULE_WORKFLOW, workflowId, {
      ctx: input.ctx,
      ruleId: input.ruleId,
      runId: input.runId,
      sourceKey: input.sourceKey,
      event: input.event,
      dryRun: input.dryRun ?? false,
    });
    return { workflowId };
  }

  async scheduleDataExport(input: Parameters<SchedulerPort['scheduleDataExport']>[0]) {
    const workflowId = dataExportWorkflowId(input.workspaceId, input.exportId);
    await this.#startUnique(
      DATA_EXPORT_WORKFLOW,
      workflowId,
      { ...input.workflowInput },
      input.executeAt,
    );
    return { workflowId, runId: `${workflowId}:1` };
  }

  async scheduleDataDeletion(input: Parameters<SchedulerPort['scheduleDataDeletion']>[0]) {
    const workflowId = dataDeletionWorkflowId(input.workspaceId, input.requestId);
    await this.#startUnique(DATA_DELETION_WORKFLOW, workflowId, { ...input.workflowInput });
    return { workflowId, runId: `${workflowId}:1` };
  }

  async cancelDataDeletion(
    input: Parameters<SchedulerPort['cancelDataDeletion']>[0],
  ): Promise<void> {
    await this.#signal(
      dataDeletionWorkflowId(input.workspaceId, input.requestId),
      'cancel',
      {
        reason: input.reason,
        requestedAt: this.#options.clock.now().toISOString(),
      },
      true,
    );
  }

  async describe(input: Parameters<SchedulerPort['describe']>[0]) {
    const description = await this.#describeWorkflow(
      publishWorkflowId(input.workspaceId, input.jobId),
    );
    return description === null
      ? null
      : { status: description.status, historyLength: description.historyLength };
  }

  async close(): Promise<void> {
    if (this.#connection !== null) {
      const connection = await this.#connection.catch(() => null);
      await connection?.close();
    }
  }

  async #startUnique(
    workflowType: string,
    workflowId: string,
    input: {
      readonly ctx: WorkflowActorContext;
      readonly provider?: ProviderId;
      readonly [key: string]: unknown;
    },
    startAt?: Date,
  ): Promise<void> {
    try {
      const client = await this.#workflowClient();
      await client.start(workflowType, {
        taskQueue: this.#options.taskQueue,
        workflowId,
        workflowIdReusePolicy: WorkflowIdReusePolicy.REJECT_DUPLICATE,
        args: [input],
        ...(startAt === undefined
          ? {}
          : { startDelay: Math.max(0, startAt.getTime() - this.#options.clock.now().getTime()) }),
      });
    } catch (cause) {
      if (cause instanceof WorkflowExecutionAlreadyStartedError) return;
      throw this.#unavailable('start_workflow', cause);
    }
  }

  async #signal(
    workflowId: string,
    signal: string,
    payload?: Readonly<Record<string, unknown>>,
    ignoreNotFound = false,
  ): Promise<void> {
    try {
      const client = await this.#workflowClient();
      const handle = client.getHandle(workflowId);
      if (payload === undefined) {
        await handle.signal(signal);
      } else {
        await handle.signal(signal, payload);
      }
    } catch (cause) {
      if (ignoreNotFound && cause instanceof WorkflowNotFoundError) return;
      throw this.#unavailable('signal_workflow', cause);
    }
  }

  async #describeWorkflow(workflowId: string): Promise<{
    readonly runId: string;
    readonly status: string;
    readonly historyLength: number;
  } | null> {
    try {
      const client = await this.#workflowClient();
      const description = await client.getHandle(workflowId).describe();
      return {
        runId: description.runId,
        status: description.status.name,
        historyLength: description.historyLength,
      };
    } catch (cause) {
      if (cause instanceof WorkflowNotFoundError) return null;
      throw this.#unavailable('describe_workflow', cause);
    }
  }

  async #workflowClient(): Promise<WorkflowClient> {
    if (this.#options.workflowClient !== undefined) {
      return this.#options.workflowClient;
    }
    if (this.#client === null) {
      this.#client = this.#createClient();
    }
    return (await this.#client).workflow;
  }

  async #createClient(): Promise<Client> {
    const connection = await this.#connectionPromise();
    return new Client({ connection, namespace: this.#options.namespace });
  }

  #connectionPromise(): Promise<Connection> {
    if (this.#connection === null) {
      this.#connection = this.#connect({
        address: this.#options.address,
        tls: this.#options.apiKey !== undefined,
        ...(this.#options.apiKey === undefined ? {} : { apiKey: this.#options.apiKey }),
      });
    }
    return this.#connection;
  }

  #unavailable(operation: string, cause: unknown): RelayError {
    this.#options.logger.warn({ subsystem: 'temporal', operation }, 'scheduler.unavailable');
    return new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
      messageKey: 'error.provider_unavailable.message',
      details: { provider: 'scheduler', operation },
      cause,
    });
  }
}
