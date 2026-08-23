import { withHebrewPluralForms } from './catalog-helpers';

/** Hebrew beta translations for the weekly digest and its email. */
export const digestMessages = withHebrewPluralForms({
  'digest.title': 'השבוע הזה',
  'digest.subtitle': 'מה שאנחנו יכולים לראות מ-{windowStart} עד {windowEnd}.',
  'digest.empty': 'עדיין אין מה לסכם לשבוע הזה. פרסם משהו והוא יופיע כאן.',
  'digest.regenerate': 'בנה מחדש את השבוע הזה',
  'digest.generating': 'בונה את סיכום השבוע',
  'digest.source.deterministic': 'נכתב מרשומות הפרסום ומהמדידות שלך, בלי עוזר הכתיבה.',
  'digest.source.ai': 'נכתב על ידי העוזר מהרשומות שלך. כל מספר נבדק מולן.',
  'digest.unavailable.aiOff': 'עוזר הכתיבה כבוי, לכן זו הגרסה הפשוטה. שום דבר לא חסר בה.',
  'digest.unavailable.rejected': 'גרסת העוזר לא תאמה את הנתונים שלך ולכן נמחקה. זו הגרסה הפשוטה.',
  'digest.headline.published':
    '{published, plural, =0 {אין פוסטים שהושלמו} one {פוסט # הושלם} two {שני פוסטים הושלמו} other {# פוסטים הושלמו}} בין {windowStart} ל-{windowEnd}.',
  'digest.headline.nothingPublished': 'לא פורסם דבר בין {windowStart} ל-{windowEnd}.',
  'digest.outcome.published':
    '{count, plural, one {פוסט # הושלם ב-{provider}} two {שני פוסטים הושלמו ב-{provider}} other {# פוסטים הושלמו ב-{provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {פוסט # הגיע לחלק מהיעדים ב-{provider} ולא לאחרים} two {שני פוסטים הגיעו לחלק מהיעדים ב-{provider} ולא לאחרים} other {# פוסטים הגיעו לחלק מהיעדים ב-{provider} ולא לאחרים}}.',
  'digest.outcome.failed':
    '{count, plural, one {פוסט # לא יצא ב-{provider}} two {שני פוסטים לא יצאו ב-{provider}} other {# פוסטים לא יצאו ב-{provider}}}.',
  'digest.metrics.noneYet': 'עדיין לא הגיעו מדידות לשבוע הזה. זה אומר שאנחנו לא יודעים איך הפוסטים הצליחו, לא שהם הצליחו גרוע.',
  'digest.freshness.statement':
    '{label, select, fresh {המדידות סונכרנו לאחרונה ב-{lastObservedAt}.} stale {המדידות לא סונכרנו מאז {lastObservedAt}, לכן המספרים למעלה עשויים להיות מיושנים.} other {עדיין לא סונכרן דבר, לכן אין למעלה נתונים שנמדדו.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'כדאי לדעת: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'סיכום שבועי באימייל',
  'digest.settings.description': 'אימייל קצר בכל שבוע עם מה שפורסם ומה שיכולנו למדוד. מופעל כברירת מחדל.',
  'digest.settings.enabled': 'שלח את הסיכום השבועי',
  'email.digest.subject': 'השבוע שלך ב-{workspaceName}',
  'email.digest.intro':
    'הנה מה שאנחנו יכולים לראות עבור {workspaceName} בין {windowStart} ל-{windowEnd}.',
  'email.digest.noData':
    'לא הצלחנו למדוד שום דבר השבוע. כשמספר חסר, הוא חסר כי לא הצלחנו לקרוא אותו, לא כי הוא היה אפס.',
  'email.digest.footer':
    'אתה מקבל את זה כי הסיכום השבועי מופעל עבור {workspaceName}. כבה אותו בהגדרות סביבת העבודה.',
});
