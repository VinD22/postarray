import type { Translator } from '@relay/i18n';

/**
 * Commander help is a human-facing surface, but command and option names are
 * part of the CLI contract. Keep every sentence behind a stable catalog key;
 * the English fallback keeps older catalog builds usable while translations
 * are added to `@relay/i18n`.
 */
export const CLI_HELP = {
  root: { key: 'developer.title' },
  optionJson: { key: 'cli.help.option.json' },
  optionProfile: { key: 'cli.help.option.profile' },
  optionApiUrl: { key: 'cli.help.option.apiUrl' },
  optionWorkspaceId: { key: 'cli.help.option.workspaceId' },
  optionLocale: { key: 'common.language' },
  optionDryRun: { key: 'cli.help.option.dryRun' },
  optionYes: { key: 'cli.help.option.yes' },

  authGroup: { key: 'auth.signIn.title' },
  authLogin: { key: 'auth.signIn.title' },
  authFlow: { key: 'cli.help.auth.flow' },
  authScopes: { key: 'cli.help.auth.scopes' },
  authWorkspace: { key: 'cli.help.auth.workspace' },
  authLogout: { key: 'cli.help.auth.logout' },
  authWhoami: { key: 'cli.help.auth.whoami' },

  accountsGroup: { key: 'connection.title' },
  accountsList: { key: 'connection.title' },
  accountsCapabilities: { key: 'capability.title' },
  pageSize: { key: 'common.page' },

  postsGroup: { key: 'composer.title' },
  postsValidate: { key: 'cli.help.posts.validate' },
  postsExistingDraft: { key: 'cli.help.posts.existingDraft' },
  postsPreview: { key: 'cli.help.posts.preview' },
  postsSchedule: { key: 'cli.help.posts.schedule' },
  postsPublish: { key: 'cli.help.posts.publish' },
  postsConfirm: { key: 'cli.help.posts.confirm' },
  postsStatus: { key: 'cli.help.posts.status' },
  postsCancel: { key: 'cli.help.posts.cancel' },
  postsList: { key: 'cli.help.posts.list' },

  mediaGroup: { key: 'library.title' },
  mediaList: { key: 'cli.help.media.list' },
  mediaKind: { key: 'cli.help.media.kind' },
  mediaGet: { key: 'cli.help.media.get' },
  mediaUpload: { key: 'cli.help.media.upload' },
  mediaImport: { key: 'cli.help.media.import' },

  calendarGroup: { key: 'calendar.title' },
  calendarList: { key: 'cli.help.calendar.list' },
  eventsWatch: { key: 'cli.help.events.watch' },
  eventsFollow: { key: 'cli.help.events.follow' },
  eventsNoReconnect: { key: 'cli.help.events.noReconnect' },
  eventsSince: { key: 'cli.help.events.since' },
  eventsType: { key: 'cli.help.events.type' },

  receiptsGroup: { key: 'receipt.title' },
  receiptsGet: { key: 'cli.help.receipts.get' },
  analyticsGroup: { key: 'analytics.title' },
  analyticsPost: { key: 'cli.help.analytics.post' },
  analyticsAccount: { key: 'cli.help.analytics.account' },

  growthGroup: { key: 'growth.title' },
  growthPlan: { key: 'growth.plan.title' },
  growthPlanGet: { key: 'cli.help.growth.planGet' },
  growthPlanExport: { key: 'cli.help.growth.planExport' },
  growthFormat: { key: 'cli.help.growth.format' },
  rulesGroup: { key: 'automation.title' },
  rulesList: { key: 'cli.help.rules.list' },
  rulesTest: { key: 'cli.help.rules.test' },

  linksGroup: { key: 'analytics.links.title' },
  linksCreate: { key: 'cli.help.links.create' },
  linksStats: { key: 'cli.help.links.stats' },
  reportingTimeZone: { key: 'common.timeZone' },
  configGroup: { key: 'settings.title' },
  configSet: { key: 'cli.help.config.set' },
  configUnset: { key: 'cli.help.config.unset' },
  configGet: { key: 'cli.help.config.get' },
} as const;

export type CliHelpId = keyof typeof CLI_HELP;

export function localizeHelp(translator: Translator, id: CliHelpId): string {
  const entry = CLI_HELP[id];
  return translator.format(entry.key);
}
