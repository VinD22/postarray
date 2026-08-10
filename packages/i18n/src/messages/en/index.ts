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
import { emailMessages } from './email';
import { errorMessages } from './errors';
import { growthMessages } from './growth';
import { importMessages } from './import';
import { navMessages } from './nav';
import { onboardingMessages } from './onboarding';
import { queueMessages } from './queue';
import { postingSetMessages } from './posting-sets';
import { receiptMessages } from './receipt';
import { settingsMessages } from './settings';
import { stateMessages } from './states';
import { statusMessages } from './status';
import { validationMessages } from './validation';
import { webMarketingMessages } from './web-marketing';
import { webAnalyticsMessages } from './web-analytics';
import { webCalendarMessages } from './web-calendar';
import { webComposerMessages } from './web-composer';
import { webSettingsMessages } from './web-settings';
import { webShellMessages } from './web-shell';
import { webBlogMessages } from './web-blog';
import { webToolsMessages } from './web-tools';
// C5 platform and use case pages.
import { webPlatformsMessages } from './web-platforms';
import { webUseCaseMessages } from './web-use-cases';

/**
 * The English catalog. This is the source of truth for every user visible
 * string in the product, and the type from which `MessageKey` is derived.
 *
 * Keys are intent based and stable. Never key a message by its English text.
 * Values are ICU MessageFormat. Never concatenate two messages.
 */
export const en = {
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
  ...billingMessages,
  ...settingsMessages,
  ...developerMessages,
  ...emailMessages,
  ...authMessages,
  ...onboardingMessages,
  ...errorMessages,
  ...validationMessages,
  ...stateMessages,
  ...statusMessages,
  ...a11yMessages,
  ...webMarketingMessages,
  ...webSettingsMessages,
  ...webShellMessages,
  ...webBlogMessages,
  ...webToolsMessages,
  ...webPlatformsMessages,
  ...webUseCaseMessages,
} as const;

/** Every message key in the product. */
export type MessageKey = keyof typeof en;

/** The English catalog type. A translated catalog is a partial of this. */
export type EnglishCatalog = typeof en;

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
  emailMessages,
  errorMessages,
  growthMessages,
  importMessages,
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
};
