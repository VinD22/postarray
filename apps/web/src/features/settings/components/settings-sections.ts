/**
 * The settings sections, in the order the design specifies.
 *
 * Settings is deliberately one destination with sections rather than entries in
 * the primary navigation: none of these answer a daily question, and putting
 * them in the nav would push the six that do off the screen.
 *
 * Only sections that exist are listed, because a navigation entry is an
 * invitation. Agents is listed again now that the service-account endpoints
 * are real and `/settings/agents` renders the connect screen rather than a
 * not-built notice. Referrals is still unlisted for the original reason: its
 * gateway still returns `not_implemented`. Its route stays reachable by URL so
 * a direct link explains itself; nothing offers it.
 */
export interface SettingsSectionDescriptor {
  readonly id: string;
  readonly href: string;
  readonly titleKey: string;
  readonly summaryKey: string;
  readonly availability: 'available' | 'not_implemented';
}

export const SETTINGS_SECTIONS: readonly SettingsSectionDescriptor[] = [
  {
    id: 'members',
    href: '/settings/members',
    titleKey: 'settings.ui.section.members',
    summaryKey: 'settings.ui.section.membersSummary',
    availability: 'available',
  },
  {
    id: 'projects',
    href: '/settings/projects',
    titleKey: 'settings.ui.section.projects',
    summaryKey: 'settings.ui.section.projectsSummary',
    availability: 'available',
  },
  {
    id: 'agents',
    href: '/settings/agents',
    titleKey: 'settings.ui.section.agents',
    summaryKey: 'settings.ui.section.agentsSummary',
    availability: 'available',
  },
  {
    id: 'developer-apps',
    href: '/settings/developer-apps',
    titleKey: 'settings.ui.section.apps',
    summaryKey: 'settings.ui.section.appsSummary',
    availability: 'available',
  },
  {
    id: 'webhooks',
    href: '/settings/webhooks',
    titleKey: 'settings.ui.section.webhooks',
    summaryKey: 'settings.ui.section.webhooksSummary',
    availability: 'available',
  },
  {
    id: 'billing',
    href: '/settings/billing',
    titleKey: 'settings.ui.section.billing',
    summaryKey: 'settings.ui.section.billingSummary',
    availability: 'available',
  },
  {
    id: 'localization',
    href: '/settings/localization',
    titleKey: 'settings.ui.section.localization',
    summaryKey: 'settings.ui.section.localizationSummary',
    availability: 'available',
  },
  {
    id: 'security',
    href: '/settings/security',
    titleKey: 'settings.ui.section.security',
    summaryKey: 'settings.ui.section.securitySummary',
    availability: 'available',
  },
  {
    id: 'data',
    href: '/settings/data',
    titleKey: 'settings.ui.section.data',
    summaryKey: 'settings.ui.section.dataSummary',
    availability: 'available',
  },
];
