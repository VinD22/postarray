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
import { webMarketingMessages } from './web-marketing';
import { webAnalyticsMessages } from './web-analytics';
import { webBlogMessages } from './web-blog';
import { webCalendarMessages } from './web-calendar';
import { webComparisonMessages } from './web-comparisons';
import { webComposerMessages } from './web-composer';
import { webDemoMessages } from './web-demo';
import { webPlatformsMessages } from './web-platforms';
import { webSettingsMessages } from './web-settings';
import { webShellMessages } from './web-shell';
import { webToolsMessages } from './web-tools';
import { webUseCaseMessages } from './web-use-cases';
import { withoutBetaEnglishFallbacks } from '../beta-fallbacks';

/**
 * The Polish beta catalog. This is the source of truth for every user visible
 * string in the product, and the type from which `MessageKey` is derived.
 *
 * Keys are intent based and stable. Never key a message by its English text.
 * Values are ICU MessageFormat. Never concatenate two messages.
 */
/**
 * Polish is a beta interface locale. Legal, billing, and consent statements
 * intentionally stay out of this catalog until they have human translation
 * review. The translator falls back to the controlling English copy for them.
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

export const pl = {
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
  // `billing.*` is English fallback pending legal/commercial review.
  // `settings.data.*` includes privacy and consent controls.
  ...withoutBetaEnglishFallbacks(settingsMessages, 'pl'),
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
  // The legal and price/trial sections are English fallback pending review.
  ...withoutBetaEnglishFallbacks(webMarketingMessages, 'pl'),
  ...webPlatformsMessages,
  ...withoutBetaEnglishFallbacks(webSettingsMessages, 'pl'),
  ...restoredProjectAndUgcSettings,
  ...webShellMessages,
  ...webToolsMessages,
  ...webUseCaseMessages,
} as const;

/** Every message key in the product. */
export type MessageKey = keyof typeof pl;

/** The Polish catalog type. A translated catalog is a partial of this. */
export type PolishCatalog = typeof pl;

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
