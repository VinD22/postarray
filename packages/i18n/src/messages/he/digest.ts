import { withHebrewPluralForms } from './catalog-helpers';

/**
 * The weekly digest email. Only the `email.digest.*` keys are translated here
 * (the `digest.*` in-app keys are outside this locale's current coverage and
 * fall back to English).
 */
export const digestMessages = withHebrewPluralForms({
  'email.digest.subject': 'השבוע שלך ב-{workspaceName}',
  'email.digest.intro':
    'הנה מה שאנחנו יכולים לראות עבור {workspaceName} בין {windowStart} ל-{windowEnd}.',
  'email.digest.noData':
    'לא הצלחנו למדוד שום דבר השבוע. כשמספר חסר, הוא חסר כי לא הצלחנו לקרוא אותו, לא כי הוא היה אפס.',
  'email.digest.footer':
    'אתה מקבל את זה כי הסיכום השבועי מופעל עבור {workspaceName}. כבה אותו בהגדרות סביבת העבודה.',
});
