import {
  pendingGrantEnvelopeFromRow,
  pendingGrantEnvelopeToRow,
  type OAuthPendingDiscoveryPort,
  type OAuthPendingDiscoveryRecord,
} from '@relay/application';
import { withWorkspaceContext, type Prisma, type RelayPrismaClient } from '@relay/database';

function prismaBytes(value: Uint8Array): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(value.byteLength));
  bytes.set(value);
  return bytes;
}

export function createOAuthPendingDiscoveryStore(
  prisma: RelayPrismaClient,
): OAuthPendingDiscoveryPort {
  return {
    async create(input): Promise<void> {
      const envelope = pendingGrantEnvelopeToRow(input.grant);
      await withWorkspaceContext(
        prisma,
        { workspaceId: input.workspaceId, role: 'service_role' },
        async (db) => {
          await db.oAuthPendingDiscovery.create({
            data: {
              transactionId: input.transactionId,
              workspaceId: input.workspaceId,
              brandId: input.brandId,
              provider: input.provider,
              stateHash: input.stateHash,
              accounts: input.accounts as unknown as Prisma.InputJsonValue,
              ...envelope,
              grantCiphertext: prismaBytes(envelope.grantCiphertext),
              grantNonce: prismaBytes(envelope.grantNonce),
              grantAuthTag: prismaBytes(envelope.grantAuthTag),
              grantWrappedDataKey: prismaBytes(envelope.grantWrappedDataKey),
              expiresAt: new Date(input.expiresAt),
            },
          });
        },
      );
    },
    async find(input): Promise<OAuthPendingDiscoveryRecord | null> {
      return await withWorkspaceContext(
        prisma,
        { workspaceId: input.workspaceId, role: 'service_role' },
        async (db) => {
          const row = await db.oAuthPendingDiscovery.findFirst({
            where: { transactionId: input.transactionId },
          });
          if (row === null) return null;
          return {
            transactionId: row.transactionId,
            workspaceId: row.workspaceId,
            brandId: row.brandId,
            provider: row.provider,
            stateHash: row.stateHash,
            accounts: row.accounts as unknown as OAuthPendingDiscoveryRecord['accounts'],
            grant: pendingGrantEnvelopeFromRow(row),
            expiresAt: row.expiresAt.toISOString(),
            consumedAt: row.consumedAt?.toISOString() ?? null,
          };
        },
      );
    },
  };
}
