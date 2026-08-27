import { API_VERSION, type RelayError } from '@relay/contracts';
import type { ProblemJson } from '@relay/contracts';
import { DEFAULT_LOCALE, createTranslator, en } from '@relay/i18n';
import type { Translator } from '@relay/i18n';

/**
 * Output.
 *
 * Every sentence a person reads comes from the `@relay/i18n` catalog, resolved
 * through the message key the error already carries. Everything else the CLI
 * prints is machine vocabulary: field names, identifiers, states and codes,
 * which are the same in every locale and are what a script greps for.
 *
 * Two renderings of the same result. `--json` is a contract: the envelope shape
 * never changes, `ok` is always present, and an error is always the RFC 9457
 * problem document the API produced, so a script never has to parse prose.
 *
 * Human output goes to stdout, diagnostics go to stderr, and the JSON envelope
 * goes to stdout alone so `relay ... --json | jq` always works.
 */

export interface JsonEnvelope {
  readonly ok: boolean;
  readonly apiVersion: string;
  readonly command: string;
  readonly correlationId: string | null;
  readonly data: unknown;
  readonly error: ProblemJson | null;
  /** Populated by `--dry-run`. Empty when the command really ran. */
  readonly plannedExternalActions: readonly PlannedExternalAction[];
}

/**
 * One thing that would happen outside Post Array. `--dry-run` prints exactly this
 * list, so "what will this actually do" is answerable before it does it.
 */
export interface PlannedExternalAction {
  readonly action:
    | 'create_post'
    | 'create_comment'
    | 'schedule_post'
    | 'cancel_post'
    | 'create_short_link'
    | 'none';
  readonly provider: string;
  readonly connectionId: string;
  readonly accountLabel: string;
  readonly whenInstant: string | null;
  readonly ianaTimeZone: string | null;
  readonly requiresApproval: boolean;
  readonly requiresHumanConfirmation: boolean;
  readonly estimatedCostMinor: number | null;
  readonly currency: string | null;
}

export interface Writer {
  out(line: string): void;
  err(line: string): void;
}

export const processWriter: Writer = {
  out: (line: string) => {
    process.stdout.write(`${line}\n`);
  },
  err: (line: string) => {
    process.stderr.write(`${line}\n`);
  },
};

/** Collects output instead of printing it. Used by every test. */
export function createMemoryWriter(): Writer & {
  readonly stdout: readonly string[];
  readonly stderr: readonly string[];
} {
  const stdout: string[] = [];
  const stderr: string[] = [];
  return {
    out: (line: string) => {
      stdout.push(line);
    },
    err: (line: string) => {
      stderr.push(line);
    },
    get stdout(): readonly string[] {
      return stdout;
    },
    get stderr(): readonly string[] {
      return stderr;
    },
  };
}

export interface RenderInput {
  readonly command: string;
  readonly json: boolean;
  readonly writer: Writer;
  readonly correlationId?: string | null;
  readonly plannedExternalActions?: readonly PlannedExternalAction[];
  /** Locale-bound translator for human diagnostics. JSON never uses this. */
  readonly translator?: Translator;
}

export function renderSuccess(input: RenderInput, data: unknown, human: readonly string[]): void {
  if (input.json) {
    const envelope: JsonEnvelope = {
      ok: true,
      apiVersion: API_VERSION,
      command: input.command,
      correlationId: input.correlationId ?? null,
      data,
      error: null,
      plannedExternalActions: input.plannedExternalActions ?? [],
    };
    input.writer.out(JSON.stringify(envelope));
    return;
  }
  for (const line of human) {
    input.writer.out(line);
  }
}

export function renderFailure(input: RenderInput, error: RelayError): void {
  const problem = error.toProblemJson();
  if (input.json) {
    const envelope: JsonEnvelope = {
      ok: false,
      apiVersion: API_VERSION,
      command: input.command,
      correlationId: input.correlationId ?? problem.correlationId ?? null,
      data: null,
      error: problem,
      plannedExternalActions: input.plannedExternalActions ?? [],
    };
    input.writer.out(JSON.stringify(envelope));
    return;
  }
  input.writer.err(`error=${problem.code} messageKey=${problem.messageKey}`);
  const sentence = describe(problem.messageKey, undefined, input.translator);
  if (sentence.length > 0) {
    input.writer.err(sentence);
  }
  if (problem.correlationId !== undefined) {
    input.writer.err(`reference ${problem.correlationId}`);
  }
  const detail = problem.detail;
  if (detail !== undefined && Object.keys(detail).length > 0) {
    input.writer.err(JSON.stringify(detail));
  }
}

const translator: Translator = createTranslator(DEFAULT_LOCALE, en);

/** Resolve a message key to a sentence, or nothing when the key is unknown. */
export function describe(
  messageKey: string,
  values?: Readonly<Record<string, string | number | boolean | null | undefined>>,
  activeTranslator: Translator = translator,
): string {
  return activeTranslator.format(messageKey, values);
}

const COLUMN_GAP = '  ';

/** A plain aligned table. No colour, no box drawing, pipe friendly. */
export function renderTable(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
): readonly string[] {
  const widths = headers.map((header, index) =>
    Math.max(header.length, ...rows.map((row) => (row[index] ?? '').length), 0),
  );
  const format = (cells: readonly string[]): string =>
    cells
      .map((cell, index) => cell.padEnd(widths[index] ?? cell.length))
      .join(COLUMN_GAP)
      .trimEnd();
  return [format(headers), format(widths.map((width) => '-'.repeat(width))), ...rows.map(format)];
}

/** Render the dry-run plan for a human. */
export function renderPlan(actions: readonly PlannedExternalAction[]): readonly string[] {
  if (actions.length === 0) {
    return ['plan externalActions=0'];
  }
  const rows = actions.map((action) => [
    action.action,
    action.provider,
    action.accountLabel,
    action.whenInstant ?? 'now',
    action.ianaTimeZone ?? '',
    action.requiresHumanConfirmation ? 'confirmation' : action.requiresApproval ? 'approval' : '',
    action.estimatedCostMinor === null || action.currency === null
      ? ''
      : `${action.estimatedCostMinor} ${action.currency}`,
  ]);
  return [
    `plan externalActions=${actions.length}`,
    ...renderTable(
      ['action', 'provider', 'account', 'when', 'zone', 'gate', 'estimated cost'],
      rows,
    ),
  ];
}
