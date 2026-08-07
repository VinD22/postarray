/**
 * The settings sections, in the order the design specifies.
 *
 * Settings is deliberately one destination with sections rather than entries in
 * the primary navigation: none of these answer a daily question, and putting
 * them in the nav would push the six that do off the screen.
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
    id: 'brands',
    href: '/settings/brands',
    titleKey: 'settings.ui.section.brands',
    summaryKey: 'settings.ui.section.brandsSummary',
    availability: 'available',
  },
  {
    id: 'agents',
    href: '/settings/agents',
    titleKey: 'settings.ui.section.agents',
    summaryKey: 'settings.ui.section.agentsSummary',
    availability: 'not_implemented',
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
    id: 'referrals',
    href: '/settings/referrals',
    titleKey: 'settings.ui.section.referrals',
    summaryKey: 'settings.ui.section.referralsSummary',
    availability: 'not_implemented',
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
