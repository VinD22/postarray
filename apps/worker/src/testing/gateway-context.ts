import type { WorkerGatewayFactoryContext } from '../main';
import { createWorkerGateway as createPrelaunchGateway } from '../prelaunch-gateway';
import type { WorkerActivities } from '../activities/types';

export let lastGatewayContext: WorkerGatewayFactoryContext | null = null;

export function createWorkerGateway(context: WorkerGatewayFactoryContext): WorkerActivities {
  lastGatewayContext = context;
  return createPrelaunchGateway();
}
