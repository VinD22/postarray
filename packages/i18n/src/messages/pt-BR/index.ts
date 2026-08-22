import { a11yMessages } from './a11y';
import { actionMessages } from './actions';
import { analyticsMessages } from './analytics';
import { assistantMessages } from './assistant';
import { assistantWebMessages } from './assistant-web';
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
 * Brazilian Portuguese beta catalog. B5-controlled copy intentionally falls
 * back to English, except the eleven content namespaces listed in
 * `LOCALE_FILLED_PREFIXES` (beta-fallbacks.ts), which this locale carries in
 * full: email, import, media, posting-sets, queue, web-blog,
 * web-comparisons, web-demo, web-platforms, web-tools, web-use-cases.
 */
export const ptBR = {
  ...a11yMessages,
  ...actionMessages,
  ...analyticsMessages,
  ...withoutBetaEnglishFallbacks(authMessages, 'pt-BR'),
  ...automationMessages,
  ...billingMessages,
  ...calendarMessages,
  ...commonMessages,
  ...composerMessages,
  ...connectionMessages,
  ...developerMessages,
  ...emailMessages,
  ...errorMessages,
  ...growthMessages,
  ...importMessages,
  ...mediaMessages,
  ...navMessages,
  ...withoutBetaEnglishFallbacks(assistantMessages, 'pt-BR'),
  ...withoutBetaEnglishFallbacks(assistantWebMessages, 'pt-BR'),
  ...onboardingMessages,
  ...postingSetMessages,
  ...queueMessages,
  ...receiptMessages,
  ...withoutBetaEnglishFallbacks(settingsMessages, 'pt-BR'),
  ...stateMessages,
  ...statusMessages,
  ...validationMessages,
  ...webAnalyticsMessages,
  ...webBlogMessages,
  ...webCalendarMessages,
  ...webComparisonMessages,
  ...withoutBetaEnglishFallbacks(webComposerMessages, 'pt-BR'),
  ...webDemoMessages,
  ...withoutBetaEnglishFallbacks(webMarketingMessages, 'pt-BR'),
  ...webPlatformsMessages,
  ...withoutBetaEnglishFallbacks(webSettingsMessages, 'pt-BR'),
  ...webShellMessages,
  ...webToolsMessages,
  ...webUseCaseMessages,
} as const;
