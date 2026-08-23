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
import { postingSetMessages } from './posting-sets';
import { queueMessages } from './queue';
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
 * Dutch is a beta interface locale. Legal, billing, and consent statements
 * intentionally remain in the reviewed English source until human review.
 *
 * `settings.ui.projects.*` and `growth.ui.ugc.*` live inside
 * `webSettingsMessages`, whose other content (billing, security) still needs
 * the reviewed English source, so the general B5 filter below strips both
 * prefixes along with the rest. This locale has translated both, so they are
 * restored explicitly after the filter runs.
 */
const restoredProjectAndUgcSettings = Object.fromEntries(
  Object.entries(webSettingsMessages).filter(
    ([key]) => key.startsWith('settings.ui.projects.') || key.startsWith('growth.ui.ugc.'),
  ),
);

export const nl = {
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
  ...webAnalyticsMessages,
  ...growthMessages,
  ...withoutBetaEnglishFallbacks(settingsMessages, 'nl'),
  ...developerMessages,
  ...digestMessages,
  ...authMessages,
  ...onboardingMessages,
  ...emailMessages,
  ...errorMessages,
  ...importMessages,
  ...mediaMessages,
  ...postingSetMessages,
  ...queueMessages,
  ...validationMessages,
  ...stateMessages,
  ...statusMessages,
  ...a11yMessages,
  ...webBlogMessages,
  ...webComparisonMessages,
  ...webDemoMessages,
  ...withoutBetaEnglishFallbacks(webMarketingMessages, 'nl'),
  ...webPlatformsMessages,
  ...withoutBetaEnglishFallbacks(webSettingsMessages, 'nl'),
  ...restoredProjectAndUgcSettings,
  ...webShellMessages,
  ...webToolsMessages,
  ...webUseCaseMessages,
} as const;

export type DutchCatalog = typeof nl;

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
  errorMessages,
  growthMessages,
  navMessages,
  onboardingMessages,
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
};
