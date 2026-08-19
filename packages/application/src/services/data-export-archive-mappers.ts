type NullableDate = Date | null;

interface WorkspaceRow {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly ownerUserId: string;
  readonly status: string;
  readonly defaultLocale: string;
  readonly defaultTimeZone: string;
  readonly contentLocales: readonly string[];
  readonly markets: readonly string[];
  readonly weekStart: number;
  readonly hourCycle: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface MembershipRow {
  readonly id: string;
  readonly userId: string;
  readonly role: string;
  readonly state: string;
  readonly projectScope: unknown;
  readonly invitedAt: NullableDate;
  readonly acceptedAt: NullableDate;
  readonly removedAt: NullableDate;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly displayName: string | null;
  };
}

interface ProjectRow {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly voice: unknown;
  readonly audience: unknown;
  readonly approvedClaims: unknown;
  readonly blockedTerms: unknown;
  readonly domains: unknown;
  readonly defaultTimeZone: string | null;
  readonly archivedAt: NullableDate;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface CampaignRow {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly objective: string | null;
  readonly tags: unknown;
  readonly startsAt: NullableDate;
  readonly endsAt: NullableDate;
  readonly archivedAt: NullableDate;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface ContentItemRow {
  readonly id: string;
  readonly projectId: string;
  readonly campaignId: string | null;
  readonly title: string | null;
  readonly brief: string | null;
  readonly state: string;
  readonly approvalPolicy: string;
  readonly currentVersionId: string | null;
  readonly approvedVersionId: string | null;
  readonly scheduledAt: NullableDate;
  readonly scheduledTimeZone: string | null;
  readonly approvedAt: NullableDate;
  readonly publishedAt: NullableDate;
  readonly canceledAt: NullableDate;
  readonly repeatEveryDays: number | null;
  readonly repeatUntil: NullableDate;
  readonly repeatCount: number | null;
  readonly repeatOfItemId: string | null;
  readonly surface: string;
  readonly creationMethod: string;
  readonly createdByUserId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface ContentVersionRow {
  readonly id: string;
  readonly contentItemId: string;
  readonly version: number;
  readonly body: string;
  readonly contentHash: string;
  readonly locale: string;
  readonly creationMethod: string;
  readonly sourceIds: unknown;
  readonly createdByUserId: string | null;
  readonly createdAt: Date;
}

interface PostVariantRow {
  readonly id: string;
  readonly contentItemId: string;
  readonly contentVersionId: string;
  readonly connectionId: string;
  readonly destinationId: string | null;
  readonly provider: string;
  readonly locale: string;
  readonly body: string;
  readonly mediaAssetIds: unknown;
  readonly signatureId: string | null;
  readonly inheritedFields: unknown;
  readonly overriddenFields: unknown;
  readonly state: string;
  readonly capabilitySnapshotVersion: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface ConnectionRow {
  readonly id: string;
  readonly projectId: string | null;
  readonly provider: string;
  readonly accountType: string;
  readonly displayName: string;
  readonly handle: string | null;
  readonly avatarUrl: string | null;
  readonly profileUrl: string | null;
  readonly status: string;
  readonly statusReason: string | null;
  readonly grantedScopes: unknown;
  readonly capabilityVersion: string | null;
  readonly capabilitiesRefreshedAt: NullableDate;
  readonly connectedAt: Date;
  readonly disconnectedAt: NullableDate;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface MediaRow {
  readonly id: string;
  readonly projectId: string | null;
  readonly kind: string;
  readonly mimeType: string;
  readonly byteSize: bigint;
  readonly checksumSha256: string;
  readonly width: number | null;
  readonly height: number | null;
  readonly durationMs: number | null;
  readonly altText: string | null;
  readonly rights: unknown;
  readonly originKind: string;
  readonly originUrl: string | null;
  readonly scanState: string;
  readonly retentionExpiresAt: Date;
  readonly storageDeletedAt: NullableDate;
  readonly deletedAt: NullableDate;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface PublishJobRow {
  readonly id: string;
  readonly contentItemId: string;
  readonly contentVersionId: string;
  readonly postVariantId: string | null;
  readonly connectionId: string;
  readonly approvalRequestId: string | null;
  readonly approvalPolicy: string;
  readonly scheduledFor: Date;
  readonly scheduledTimeZone: string;
  readonly state: string;
  readonly attemptCount: number;
  readonly lastErrorClass: string | null;
  readonly lastErrorCode: string | null;
  readonly surface: string;
  readonly dispatchedAt: NullableDate;
  readonly completedAt: NullableDate;
  readonly canceledAt: NullableDate;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface ReceiptRow {
  readonly id: string;
  readonly publishJobId: string;
  readonly contentVersionId: string;
  readonly connectionId: string;
  readonly provider: string;
  readonly externalPostId: string;
  readonly permalink: string | null;
  readonly contentHash: string;
  readonly mediaChecksums: unknown;
  readonly publishedShortLinks: unknown;
  readonly publishedAt: Date;
  readonly dispatchedAt: NullableDate;
  readonly scheduledFor: NullableDate;
  readonly scheduledTimeZone: string | null;
  readonly surface: string;
  readonly approvedByUserId: string | null;
  readonly approvalPolicy: string;
  readonly costActualMinor: number | null;
  readonly costCurrency: string | null;
  readonly deletedExternallyAt: NullableDate;
  readonly lastAnalyticsSyncAt: NullableDate;
  readonly createdAt: Date;
}

interface AuditRow {
  readonly id: string;
  readonly actorType: string;
  readonly actorId: string | null;
  readonly surface: string;
  readonly action: string;
  readonly targetType: string;
  readonly targetId: string | null;
  readonly beforeHash: string | null;
  readonly afterHash: string | null;
  readonly correlationId: string | null;
  readonly createdAt: Date;
}

export interface DataExportArchiveRows {
  readonly workspace: WorkspaceRow;
  readonly memberships: readonly MembershipRow[];
  readonly projects: readonly ProjectRow[];
  readonly campaigns: readonly CampaignRow[];
  readonly contentItems: readonly ContentItemRow[];
  readonly versions: readonly ContentVersionRow[];
  readonly variants: readonly PostVariantRow[];
  readonly connections: readonly ConnectionRow[];
  readonly media: readonly MediaRow[];
  readonly jobs: readonly PublishJobRow[];
  readonly receipts: readonly ReceiptRow[];
  readonly audits: readonly AuditRow[];
  readonly exportId: string;
  readonly generatedAt: string;
}
