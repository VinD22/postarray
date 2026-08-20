import { a11yMessages } from './a11y';
import { actionMessages } from './actions';
import { analyticsMessages } from './analytics';
import { authMessages } from './auth';
import { automationMessages } from './automation';
import { billingMessages } from './billing';
import { calendarMessages } from './calendar';
import { commonMessages } from './common';
import { composerMessages } from './composer';
import { connectionMessages } from './connections';
import { developerMessages } from './developer';
import { digestMessages } from './digest';
import { emailMessages } from './email';
import { errorMessages } from './errors';
import { growthMessages } from './growth';
import { importMessages } from './import';
import { mediaMessages } from './media';
import { navMessages } from './nav';
import { onboardingMessages } from './onboarding';
import { queueMessages } from './queue';
import { postingSetMessages } from './posting-sets';
import { receiptMessages } from './receipt';
import { settingsMessages } from './settings';
import { stateMessages } from './states';
import { statusMessages } from './status';
import { validationMessages } from './validation';
import { webAnalyticsMessages } from './web-analytics';
import { webBlogMessages } from './web-blog';
import { webCalendarMessages } from './web-calendar';
import { webComparisonMessages } from './web-comparisons';
import { webComposerMessages } from './web-composer';
import { webDemoMessages } from './web-demo';
import { webMarketingMessages } from './web-marketing';
import { webPlatformsMessages } from './web-platforms';
import { webSettingsMessages } from './web-settings';
import { webShellMessages } from './web-shell';
import { webToolsMessages } from './web-tools';
import { webUseCaseMessages } from './web-use-cases';
import { withoutBetaEnglishFallbacks } from '../beta-fallbacks';

/**
 * `settings.ui.projects.*` and `growth.ui.ugc.*` live inside `web-settings.ts`
 * alongside other B5-controlled copy (billing, security, data controls) that
 * must stay on the reviewed English source. This locale has a real, human
 * quality translation of those two prefixes specifically, so they are picked
 * back out after the general B5 filter removes the rest of the namespace.
 */
const webSettingsProjectAndUgcOverrides = Object.fromEntries(
  Object.entries(webSettingsMessages).filter(
    ([key]) => key.startsWith('settings.ui.projects.') || key.startsWith('growth.ui.ugc.'),
  ),
);

/** Thai beta catalog. B5-controlled copy falls back to reviewed English. */
export const th = {
  ...navMessages,
  ...actionMessages,
  ...commonMessages,
  ...composerMessages,
  ...webComposerMessages,
  ...calendarMessages,
  ...receiptMessages,
  ...connectionMessages,
  ...webCalendarMessages,
  ...analyticsMessages,
  ...automationMessages,
  ...queueMessages,
  ...postingSetMessages,
  ...webAnalyticsMessages,
  ...growthMessages,
  ...importMessages,
  ...mediaMessages,
  ...withoutBetaEnglishFallbacks(settingsMessages, 'th'),
  ...developerMessages,
  ...emailMessages,
  ...digestMessages,
  ...authMessages,
  ...onboardingMessages,
  ...errorMessages,
  ...validationMessages,
  ...stateMessages,
  ...statusMessages,
  ...a11yMessages,
  ...withoutBetaEnglishFallbacks(webMarketingMessages, 'th'),
  ...withoutBetaEnglishFallbacks(webSettingsMessages, 'th'),
  ...webSettingsProjectAndUgcOverrides,
  ...webShellMessages,
  ...webBlogMessages,
  ...webToolsMessages,
  ...webPlatformsMessages,
  ...webUseCaseMessages,
  ...webComparisonMessages,
  ...webDemoMessages,
} as const;

export type ThaiCatalog = typeof th;

export {
  a11yMessages,
  actionMessages,
  analyticsMessages,
  authMessages,
  automationMessages,
  billingMessages,
  calendarMessages,
  commonMessages,
  composerMessages,
  connectionMessages,
  developerMessages,
  digestMessages,
  emailMessages,
  errorMessages,
  growthMessages,
  importMessages,
  mediaMessages,
  navMessages,
  onboardingMessages,
  queueMessages,
  postingSetMessages,
  receiptMessages,
  settingsMessages,
  stateMessages,
  statusMessages,
  validationMessages,
  webMarketingMessages,
  webSettingsMessages,
  webShellMessages,
  webComposerMessages,
  webCalendarMessages,
  webAnalyticsMessages,
  webBlogMessages,
  webToolsMessages,
  webPlatformsMessages,
  webUseCaseMessages,
  webComparisonMessages,
  webDemoMessages,
};
