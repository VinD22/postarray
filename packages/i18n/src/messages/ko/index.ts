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
import { webToolsMessages } from './web-tools';
import { webUseCaseMessages } from './web-use-cases';
import { webSettingsMessages } from './web-settings';
import { webShellMessages } from './web-shell';
import { withoutBetaEnglishFallbacks } from '../beta-fallbacks';

/** Korean beta catalog. B5-controlled legal, billing, and consent copy falls back to reviewed English. */
export const ko = {
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
  ...withoutBetaEnglishFallbacks(settingsMessages),
  ...developerMessages,
  ...authMessages,
  ...onboardingMessages,
  ...errorMessages,
  ...validationMessages,
  ...stateMessages,
  ...statusMessages,
  ...a11yMessages,
  ...withoutBetaEnglishFallbacks(webMarketingMessages),
  ...withoutBetaEnglishFallbacks(webSettingsMessages),
  ...webShellMessages,
  ...digestMessages,
  ...emailMessages,
  ...mediaMessages,
  ...webBlogMessages,
  ...webComparisonMessages,
  ...webUseCaseMessages,
  ...queueMessages,
  ...postingSetMessages,
  ...importMessages,
  ...webPlatformsMessages,
  ...webDemoMessages,
  ...webToolsMessages,
} as const;

export type KoreanCatalog = typeof ko;

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
  mediaMessages,
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
  webBlogMessages,
  webComparisonMessages,
  webComposerMessages,
  webCalendarMessages,
  webAnalyticsMessages,
};
