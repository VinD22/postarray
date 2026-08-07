import { ID_PREFIXES, isId } from '@relay/contracts';

import { DATABASE_ERROR_CODES, DatabaseError } from '../errors';
import type { RelayPrismaClient } from '../client';

import { isGlobalModel, isTenantModel, isUnregisteredModel } from './model-registry';

/**
 * Workspace-scoped repository access.
 *
 * `withWorkspace(prisma, workspaceId)` returns a proxy that behaves like the
 * Prisma client with three differences:
 *
 *   1. Every query against a tenant model gets `workspaceId` merged into its
 *      `where`, and every create gets it merged into its `data`.
 *   2. Passing a *different* `workspaceId` explicitly is a thrown error, not a
 *      silent override. A caller doing that has a bug worth surfacing.
 *   3. Raw SQL is refused. A raw statement cannot be scoped by this layer, so it
 *      has to be written deliberately against the unscoped client where a
 *      reviewer will see it.
 *
 * This is a convenience and a lint, not the security boundary. Row level
 * security in `migrations/0020_rls_policies.sql` is the boundary. In particular
 * this proxy does not walk nested writes (`create: { brand: { connect: … } }`);
 * a nested connect that crosses a tenant is caught by RLS and by the foreign
 * keys, which is why the database enforcement exists in the first place.
 */

export type WorkspaceScopedClient = Omit<
  RelayPrismaClient,
  | '$connect'
  | '$disconnect'
  | '$on'
  | '$extends'
  | '$queryRaw'
  | '$queryRawUnsafe'
  | '$executeRaw'
  | '$executeRawUnsafe'
>;

const READ_OPERATIONS = new Set([
  'findUnique',
  'findUniqueOrThrow',
  'findFirst',
  'findFirstOrThrow',
  'findMany',
  'count',
  'aggregate',
  'groupBy',
]);

const WHERE_WRITE_OPERATIONS = new Set(['update', 'updateMany', 'delete', 'deleteMany']);

const CREATE_OPERATIONS = new Set(['create', 'createMany', 'createManyAndReturn']);

const REFUSED_CLIENT_METHODS = new Set([
  '$queryRaw',
  '$queryRawUnsafe',
  '$executeRaw',
  '$executeRawUnsafe',
  '$extends',
]);

/**
 * The Prisma client is a runtime-generated object, so reaching into it needs one
 * documented structural type rather than a scatter of casts. Nothing outside
 * this file uses it.
 */
type DelegateRecord = Record<string, unknown>;
type ClientRecord = Record<string, unknown>;
type ArgsRecord = Record<string, unknown>;
type PrismaOperation = (args?: unknown) => unknown;

export function withWorkspace(
  prisma: RelayPrismaClient | WorkspaceScopedClient,
  workspaceId: string,
): WorkspaceScopedClient {
  assertUsableWorkspaceId(workspaceId);

  const target = prisma as unknown as ClientRecord;

  const proxy = new Proxy(target, {
    get(source, property): unknown {
      if (typeof property !== 'string') {
        return Reflect.get(source, property);
      }

      if (REFUSED_CLIENT_METHODS.has(property)) {
        throw new DatabaseError(
          DATABASE_ERROR_CODES.tenantModelUnscoped,
          `${property} cannot be workspace scoped. Use the unscoped client and filter explicitly.`,
          { workspaceId, method: property },
        );
      }

      if (property === '$transaction') {
        return createScopedTransaction(source, workspaceId);
      }

      const value = Reflect.get(source, property);

      if (property.startsWith('$') || typeof value !== 'object' || value === null) {
        return typeof value === 'function' ? value.bind(source) : value;
      }

      if (isUnregisteredModel(property)) {
        throw new DatabaseError(
          DATABASE_ERROR_CODES.tenantModelUnscoped,
          `Model "${property}" is not registered in model-registry.ts. Declare whether it is tenant owned before querying it.`,
          { workspaceId, model: property },
        );
      }

      if (isGlobalModel(property)) {
        // Global catalogs and identity tables. No filter to inject, and no
        // reason to block a read.
        return value;
      }

      return wrapDelegate(value as DelegateRecord, property, workspaceId);
    },
  });

  return proxy as unknown as WorkspaceScopedClient;
}

/**
 * Guard for code paths that receive a bare client. Throws when a tenant model is
 * about to be used without a scope, which is the failure the proxy exists to
 * prevent but that a direct `prisma.contentItem` call would slip past.
 */
export function assertWorkspaceScoped(model: string, workspaceId: string | undefined): void {
  if (!isTenantModel(model)) return;
  if (workspaceId === undefined || workspaceId === '') {
    throw new DatabaseError(
      DATABASE_ERROR_CODES.tenantModelUnscoped,
      `Model "${model}" is tenant owned and cannot be queried without a workspace scope.`,
      { model },
    );
  }
}

function assertUsableWorkspaceId(workspaceId: string): void {
  if (typeof workspaceId !== 'string' || workspaceId.trim() === '') {
    throw new DatabaseError(
      DATABASE_ERROR_CODES.workspaceScopeMissing,
      'withWorkspace requires a workspace id.',
    );
  }
  if (!isId(ID_PREFIXES.workspace, workspaceId)) {
    throw new DatabaseError(
      DATABASE_ERROR_CODES.workspaceScopeMissing,
      'withWorkspace requires a valid Relay workspace identifier.',
      { workspaceId },
    );
  }
}

function wrapDelegate(
  delegate: DelegateRecord,
  model: string,
  workspaceId: string,
): DelegateRecord {
  return new Proxy(delegate, {
    get(source, property): unknown {
      if (typeof property !== 'string') {
        return Reflect.get(source, property);
      }

      const operation = Reflect.get(source, property);
      if (typeof operation !== 'function') {
        return operation;
      }

      const bound = (operation as PrismaOperation).bind(source);

      // These wrappers are async so a scope violation surfaces as a rejected
      // promise. Prisma operations are thenable, and a synchronous throw would
      // slip past a caller's .catch() and surface somewhere unrelated.
      if (READ_OPERATIONS.has(property) || WHERE_WRITE_OPERATIONS.has(property)) {
        return async (args?: unknown) => bound(scopeWhere(args, model, workspaceId, property));
      }

      if (CREATE_OPERATIONS.has(property)) {
        return async (args?: unknown) => bound(scopeCreate(args, model, workspaceId));
      }

      if (property === 'upsert') {
        return async (args?: unknown) => bound(scopeUpsert(args, model, workspaceId));
      }

      return bound;
    },
  });
}

function scopeWhere(
  args: unknown,
  model: string,
  workspaceId: string,
  operation: string,
): ArgsRecord {
  const next: ArgsRecord = { ...asRecord(args) };
  next['where'] = mergeWorkspaceId(next['where'], model, workspaceId, `${operation}.where`);

  // update and updateMany also carry a data payload that must not move the row.
  if (operation === 'update' || operation === 'updateMany') {
    const data = next['data'];
    if (data !== undefined) {
      next['data'] = mergeWorkspaceId(data, model, workspaceId, `${operation}.data`);
    }
  }

  return next;
}

function scopeCreate(args: unknown, model: string, workspaceId: string): ArgsRecord {
  const next: ArgsRecord = { ...asRecord(args) };
  const data = next['data'];

  if (Array.isArray(data)) {
    next['data'] = data.map((entry) =>
      mergeWorkspaceId(entry, model, workspaceId, 'createMany.data'),
    );
    return next;
  }

  next['data'] = mergeWorkspaceId(data, model, workspaceId, 'create.data');
  return next;
}

function scopeUpsert(args: unknown, model: string, workspaceId: string): ArgsRecord {
  const next: ArgsRecord = { ...asRecord(args) };
  next['where'] = mergeWorkspaceId(next['where'], model, workspaceId, 'upsert.where');
  next['create'] = mergeWorkspaceId(next['create'], model, workspaceId, 'upsert.create');
  if (next['update'] !== undefined) {
    next['update'] = mergeWorkspaceId(next['update'], model, workspaceId, 'upsert.update');
  }
  return next;
}

function mergeWorkspaceId(
  value: unknown,
  model: string,
  workspaceId: string,
  location: string,
): ArgsRecord {
  const record = asRecord(value);
  const existing = record['workspaceId'];

  if (existing !== undefined && existing !== workspaceId) {
    throw new DatabaseError(
      DATABASE_ERROR_CODES.workspaceScopeConflict,
      `${model}.${location} named a different workspace than the active scope.`,
      { model, location, scope: workspaceId, requested: String(existing) },
    );
  }

  return { ...record, workspaceId };
}

function asRecord(value: unknown): ArgsRecord {
  if (value === undefined || value === null) return {};
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new DatabaseError(
      DATABASE_ERROR_CODES.workspaceScopeConflict,
      'Expected a Prisma arguments object.',
    );
  }
  return value as ArgsRecord;
}

function createScopedTransaction(source: ClientRecord, workspaceId: string) {
  const original = Reflect.get(source, '$transaction');
  if (typeof original !== 'function') {
    throw new DatabaseError(
      DATABASE_ERROR_CODES.tenantModelUnscoped,
      'The underlying client does not support $transaction.',
      { workspaceId },
    );
  }
  const bound = original.bind(source) as (arg: unknown, options?: unknown) => Promise<unknown>;

  return (arg: unknown, options?: unknown): Promise<unknown> => {
    if (typeof arg === 'function') {
      const callback = arg as (tx: WorkspaceScopedClient) => Promise<unknown>;
      return bound((tx: unknown) => {
        const scoped = withWorkspace(tx as RelayPrismaClient, workspaceId);
        return callback(scoped);
      }, options);
    }
    // Array form: the promises were already built from a scoped delegate.
    return bound(arg, options);
  };
}
