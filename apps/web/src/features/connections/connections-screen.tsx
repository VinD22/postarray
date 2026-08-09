'use client';

/**
 * The connections screen.
 *
 * Three tabs on one route: the accounts themselves, the capability matrix
 * generated from the connector definitions, and the customer groups that
 * filter the calendar and analytics.
 *
 * Accounts that need a person sort to the top and keep their remediation
 * sentence inline. Nothing here is hidden behind a hover or a tooltip: an
 * incident is a paragraph, a limitation is a sentence, and a capability is a
 * badge with a word.
 */

import { useMemo, useState, type ReactNode } from 'react';
import { Plug, Plus } from 'lucide-react';
import {
  Button,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Label,
  LoadingState,
  Notice,
  OfflineBanner,
  PageHeader,
  PermissionDenied,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SkeletonList,
  TabsContent,
  useAnnouncer,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { ApiError } from '@/lib/api/error';
import type { ConnectionHealth, ProviderId } from '@/lib/api/types';
import { useSession } from '@/lib/auth/session-context';
import { CapabilityMatrixView } from './capability-matrix-view';
import { buildCapabilityMatrix } from './capability-matrix';
import { ConnectDialog } from './connect-dialog';
import { ConnectionRow } from './connection-row';
import { ConnectionsTabs } from './connections-tabs';
import { GroupList, MoveGroupDialog } from './connection-groups';
import { PermissionsSheet } from './permissions-sheet';
import { OAuthAccountSelectionPanel } from './oauth-account-selection';
import { OAuthCallbackNotice } from './oauth-callback-notice';
import { useProviderName } from './provider';
import { sortByUrgency } from './health';
import {
  useAllCapabilities,
  useAvailableProviders,
  useBeginConnection,
  useConnectionCapabilities,
  useConnectionRows,
  useCreateGroup,
  useCustomerGroups,
  useDisconnectConnection,
  useMoveConnectionGroup,
  usePauseConnection,
  useReconnectConnection,
  useResumeConnection,
} from './use-connections';
import type { ConnectionRow as Row, PermissionView } from './types';

const ANY = '__any__';

const HEALTH_FILTERS: readonly ConnectionHealth[] = [
  'healthy',
  'expiring_soon',
  'expired',
  'revoked',
  'permission_missing',
  'review_pending',
  'paused',
  'unknown',
];

export interface ConnectionsScreenProps {
  /** Route pattern for one connection. `{id}` is the connection id. */
  connectionHrefPattern: string;
  /**
   * Scopes each provider asks for, with the purpose sentence key. Supplied by
   * the server so the pre-OAuth explainer describes the real consent screen
   * rather than a hard-coded guess.
   */
  permissionsByProvider?: Readonly<Record<string, readonly PermissionView[]>>;
}

export function ConnectionsScreen({
  connectionHrefPattern,
  permissionsByProvider = {},
}: ConnectionsScreenProps): ReactNode {
  const t = useTranslations();
  const providerName = useProviderName();
  const { announce } = useAnnouncer();
  const { project } = useSession();

  const { query: connections, rows } = useConnectionRows(
    project === null ? {} : { brandId: project.id },
  );
  const groups = useCustomerGroups();

  const pause = usePauseConnection();
  const resume = useResumeConnection();
  const disconnect = useDisconnectConnection();
  const beginConnection = useBeginConnection();
  const connectableProviders = useAvailableProviders();
  const reconnect = useReconnectConnection();
  const createGroup = useCreateGroup();
  const moveGroup = useMoveConnectionGroup();

  const [activeTab, setActiveTab] = useState<string>('accounts');
  const [providerFilter, setProviderFilter] = useState<string>(ANY);
  const [healthFilter, setHealthFilter] = useState<string>(ANY);
  const [groupFilter, setGroupFilter] = useState<string>(ANY);

  const [connectOpen, setConnectOpen] = useState(false);
  const [permissionsRow, setPermissionsRow] = useState<Row | null>(null);
  const [moveRow, setMoveRow] = useState<Row | null>(null);
  const [disconnectRow, setDisconnectRow] = useState<Row | null>(null);
  const [pauseRow, setPauseRow] = useState<Row | null>(null);

  const capabilities = useConnectionCapabilities(permissionsRow?.id ?? null);

  // A fresh [] each render would change the identity of every dependent hook.
  const groupList = useMemo(() => groups.data ?? [], [groups.data]);

  const groupById = useMemo(() => {
    const map = new Map<string, string>();
    for (const group of groupList) {
      map.set(group.id, group.name);
      for (const connectionId of group.connectionIds) map.set(`c:${connectionId}`, group.id);
    }
    return map;
  }, [groupList]);

  /** A row's group, whether it came on the row or from the group membership. */
  const groupIdFor = (row: Row): string | null =>
    row.customerGroupId ?? groupById.get(`c:${row.id}`) ?? null;

  const filtered = useMemo(() => {
    const result = rows.filter((row) => {
      if (providerFilter !== ANY && row.provider !== providerFilter) return false;
      if (healthFilter !== ANY && row.health !== healthFilter) return false;
      if (groupFilter !== ANY && groupIdFor(row) !== groupFilter) return false;
      return true;
    });
    return sortByUrgency(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, providerFilter, healthFilter, groupFilter, groupById]);

  const availableProviders = useMemo(
    () => [...new Set(rows.map((row) => row.provider))].sort(),
    [rows],
  );

  const connectionIds = useMemo(() => rows.map((row) => row.id), [rows]);
  const allCapabilities = useAllCapabilities(connectionIds);
  const matrix = useMemo(
    () => buildCapabilityMatrix(allCapabilities.data ?? []),
    [allCapabilities.data],
  );

  /** The provider consent screen replaces this tab, so nothing is lost. */
  const goToProvider = (result: { authorizationUrl: string }): void => {
    if (typeof window !== 'undefined' && result.authorizationUrl) {
      window.location.assign(result.authorizationUrl);
    }
  };

  const startConnect = (provider: ProviderId): void => {
    if (project === null) return;
    beginConnection.mutate(
      { provider, brandId: project.id, returnUrl: '/connections' },
      { onSuccess: goToProvider },
    );
  };

  const startReconnect = (row: Row): void => {
    reconnect.mutate({ connectionId: row.id }, { onSuccess: goToProvider });
  };

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title={t('connection.title')}
        description={t('connection.subtitle')}
        actions={
          <Button
            variant="primary"
            iconStart={<Plus aria-hidden="true" className="size-4" />}
            disabled={project === null}
            onClick={() => setConnectOpen(true)}
          >
            {t('connection.add')}
          </Button>
        }
      />

      <div className="px-4 pt-4 md:px-6">
        {project === null ? (
          <Notice
            tone="warning"
            title={t('web.connection.projectMissing.title')}
            description={t('web.connection.projectMissing.body')}
          />
        ) : (
          <Notice
            tone="info"
            title={t('web.connection.projectScope.title', { project: project.name })}
            description={t('web.connection.projectScope.body')}
          />
        )}
        <OAuthCallbackNotice />
        <OAuthAccountSelectionPanel />
      </div>

      <ConnectionsTabs
        value={activeTab}
        onValueChange={setActiveTab}
        label={t('connection.title')}
        className="flex flex-1 flex-col"
        listWrapperClassName="px-4 md:px-6"
        tabs={[
          { value: 'accounts', label: t('web.connection.tab.accounts') },
          { value: 'capabilities', label: t('web.connection.tab.capabilities') },
          { value: 'groups', label: t('web.connection.tab.groups') },
        ]}
      >
        <TabsContent value="accounts" className="flex flex-1 flex-col">
          <div className="flex flex-wrap items-end gap-3 px-4 pb-3 md:px-6">
            <FilterSelect
              label={t('web.connection.filter.provider')}
              anyLabel={t('web.calendar.filter.anyPlatform')}
              value={providerFilter}
              onChange={setProviderFilter}
              items={availableProviders.map((provider) => ({
                value: provider,
                label: providerName(provider),
              }))}
            />
            <FilterSelect
              label={t('web.connection.filter.health')}
              anyLabel={t('web.connection.filter.anyHealth')}
              value={healthFilter}
              onChange={setHealthFilter}
              items={HEALTH_FILTERS.map((health) => ({
                value: health,
                label: t(`web.connection.healthFilter.${health}`),
              }))}
            />
            {groupList.length > 0 ? (
              <FilterSelect
                label={t('web.connection.filter.group')}
                anyLabel={t('web.calendar.filter.anyGroup')}
                value={groupFilter}
                onChange={setGroupFilter}
                items={groupList.map((group) => ({ value: group.id, label: group.name }))}
              />
            ) : null}
          </div>

          <ConnectionsBody
            query={connections}
            rows={filtered}
            totalCount={rows.length}
            groupNameFor={(row) => {
              const id = groupIdFor(row);
              return id ? (groupById.get(id) ?? null) : null;
            }}
            connectionHrefPattern={connectionHrefPattern}
            onConnect={() => setConnectOpen(true)}
            onReconnect={startReconnect}
            onPause={setPauseRow}
            onResume={(row) => resume.mutate(row.id)}
            onDisconnect={setDisconnectRow}
            onInspectPermissions={setPermissionsRow}
            onMoveGroup={setMoveRow}
          />
        </TabsContent>

        <TabsContent value="capabilities" className="px-4 pb-8 md:px-6">
          {allCapabilities.isPending ? (
            <LoadingState label={t('web.connection.loading')}>
              <SkeletonList rows={5} avatar={false} />
            </LoadingState>
          ) : allCapabilities.isError ? (
            <ErrorState
              title={t('web.connection.error.title')}
              description={t('web.connection.error.body')}
              onRetry={() => void allCapabilities.refetch()}
              retryLabel={t('action.retry')}
            />
          ) : (
            <CapabilityMatrixView matrix={matrix} />
          )}
        </TabsContent>

        <TabsContent value="groups" className="px-4 pb-8 md:px-6">
          {groups.isError ? (
            <ErrorState
              title={t('web.connection.error.title')}
              description={t('web.connection.error.body')}
              onRetry={() => void groups.refetch()}
              retryLabel={t('action.retry')}
            />
          ) : (
            <GroupList
              groups={groupList}
              rows={rows.map((row) => ({ ...row, customerGroupId: groupIdFor(row) }))}
              creating={createGroup.isPending}
              onCreate={(name) => createGroup.mutate({ name })}
            />
          )}
        </TabsContent>
      </ConnectionsTabs>

      {/* ---- Dialogs and sheets ------------------------------------------ */}

      <ConnectDialog
        open={connectOpen}
        onOpenChange={setConnectOpen}
        permissionsByProvider={permissionsByProvider}
        availableProviders={connectableProviders.data ?? []}
        projectName={project?.name ?? null}
        starting={beginConnection.isPending}
        onBegin={startConnect}
      />

      <PermissionsSheet
        row={permissionsRow}
        snapshot={capabilities.data ?? null}
        open={permissionsRow !== null}
        onOpenChange={(open) => {
          if (!open) setPermissionsRow(null);
        }}
        onReconnect={startReconnect}
      />

      <MoveGroupDialog
        row={moveRow}
        groups={groupList}
        open={moveRow !== null}
        onOpenChange={(open) => {
          if (!open) setMoveRow(null);
        }}
        submitting={moveGroup.isPending}
        onMove={(row, groupId) => {
          moveGroup.mutate(
            {
              connectionId: row.id,
              fromGroupId: groupIdFor(row),
              toGroupId: groupId,
              groups: groupList,
            },
            { onSuccess: () => setMoveRow(null) },
          );
        }}
      />

      {/* Pausing is reversible and says exactly what stops. */}
      <ConfirmDialog
        open={pauseRow !== null}
        onOpenChange={(open) => {
          if (!open) setPauseRow(null);
        }}
        title={t('web.connection.pause.title', { account: pauseRow?.displayName ?? '' })}
        description={t('connection.pause.body')}
        confirmLabel={t('action.pause')}
        cancelLabel={t('action.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={() => {
          if (!pauseRow) return;
          pause.mutate(pauseRow.id);
          setPauseRow(null);
        }}
      />

      {/* Disconnecting stops scheduled posts. It enumerates every consequence
          and asks for the word, because the external effects are not undoable. */}
      <ConfirmDialog
        open={disconnectRow !== null}
        onOpenChange={(open) => {
          if (!open) setDisconnectRow(null);
        }}
        tone="destructive"
        title={t('connection.disconnect.title', { account: disconnectRow?.displayName ?? '' })}
        description={t('connection.disconnect.body')}
        consequences={
          disconnectRow
            ? [
                {
                  id: 'scheduled',
                  text: t('web.connection.disconnect.consequence.scheduled', {
                    count: disconnectRow.scheduledPostCount ?? 0,
                  }),
                },
                {
                  id: 'published',
                  text: t('web.connection.disconnect.consequence.published', {
                    provider: providerName(disconnectRow.provider),
                  }),
                },
                {
                  id: 'analytics',
                  text: t('web.connection.disconnect.consequence.analytics'),
                },
              ]
            : []
        }
        confirmationPhrase={t('web.connection.disconnect.confirmWord')}
        confirmationLabel={t('confirm.typeToConfirm', {
          word: t('web.connection.disconnect.confirmWord'),
        })}
        confirmLabel={t('action.disconnect')}
        cancelLabel={t('action.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={() => {
          if (!disconnectRow) return;
          const account = disconnectRow.displayName;
          disconnect.mutate(disconnectRow.id, {
            onSuccess: () => {
              announce(t('a11y.announce.connectionRemoved', { account }));
              setDisconnectRow(null);
            },
          });
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------------- */

interface ConnectionsBodyProps {
  query: ReturnType<typeof useConnectionRows>['query'];
  rows: readonly Row[];
  totalCount: number;
  groupNameFor: (row: Row) => string | null;
  connectionHrefPattern: string;
  onConnect: () => void;
  onReconnect: (row: Row) => void;
  onPause: (row: Row) => void;
  onResume: (row: Row) => void;
  onDisconnect: (row: Row) => void;
  onInspectPermissions: (row: Row) => void;
  onMoveGroup: (row: Row) => void;
}

function ConnectionsBody(props: ConnectionsBodyProps): ReactNode {
  const t = useTranslations();
  const { query } = props;

  if (query.isPending) {
    return (
      <div className="px-4 md:px-6">
        <LoadingState label={t('web.connection.loading')}>
          <SkeletonList rows={4} />
        </LoadingState>
      </div>
    );
  }

  if (query.isError) {
    const error = ApiError.is(query.error) ? query.error : null;

    if (error?.isOffline) {
      return (
        <div className="px-4 md:px-6">
          <OfflineBanner
            title={t('web.calendar.offline.title')}
            description={t('web.calendar.offline.body')}
            actions={
              <Button variant="secondary" size="sm" onClick={() => void query.refetch()}>
                {t('action.refresh')}
              </Button>
            }
          />
        </div>
      );
    }

    if (error?.isAuthorization) {
      return (
        <div className="px-4 md:px-6">
          <PermissionDenied
            title={t('permission.denied.title')}
            description={t('permission.denied.role', {
              role: 'admin',
              currentRole: String(error.details.currentRole ?? t('common.unknown')),
            })}
          />
        </div>
      );
    }

    return (
      <div className="px-4 md:px-6">
        <ErrorState
          title={t('web.connection.error.title')}
          description={t('web.connection.error.body')}
          onRetry={() => void query.refetch()}
          retryLabel={t('action.retry')}
          retrying={query.isFetching}
          {...(error?.correlationId
            ? { reference: { label: t('receipt.correlationId'), value: error.correlationId } }
            : {})}
        />
      </div>
    );
  }

  if (props.rows.length === 0) {
    return (
      <div className="px-4 md:px-6">
        {props.totalCount === 0 ? (
          <EmptyState
            illustration={
              <span className="border-border-strong inline-flex size-12 items-center justify-center rounded-full border-2 border-dashed">
                <Plug aria-hidden="true" className="size-5" />
              </span>
            }
            title={t('empty.connections.title')}
            description={t('empty.connections.body')}
            example={t('web.connection.empty.example')}
            action={
              <Button variant="cta" onClick={props.onConnect}>
                {t('empty.connections.action')}
              </Button>
            }
          />
        ) : (
          <Notice tone="neutral" title={t('empty.filtered.title')} />
        )}
      </div>
    );
  }

  return (
    <ul aria-label={t('web.connection.list.label')} className="flex flex-col">
      {props.rows.map((row) => (
        <ConnectionRow
          key={row.id}
          row={row}
          groupName={props.groupNameFor(row)}
          detailHref={props.connectionHrefPattern.replace('{id}', row.id)}
          onReconnect={props.onReconnect}
          onPause={props.onPause}
          onResume={props.onResume}
          onDisconnect={props.onDisconnect}
          onInspectPermissions={props.onInspectPermissions}
          onMoveGroup={props.onMoveGroup}
        />
      ))}
    </ul>
  );
}

function FilterSelect({
  label,
  anyLabel,
  value,
  onChange,
  items,
}: {
  label: string;
  anyLabel: string;
  value: string;
  onChange: (value: string) => void;
  items: readonly { value: string; label: string }[];
}): ReactNode {
  const id = `connection-filter-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="flex w-[11rem] flex-col gap-1">
      <Label htmlFor={id} className="text-label text-text-tertiary">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} size="sm" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{anyLabel}</SelectItem>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
