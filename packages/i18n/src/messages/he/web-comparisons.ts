import { withHebrewPluralForms } from './catalog-helpers';

/**
 * The comparison pages' chrome. See `en/web-comparisons.ts` for what belongs
 * here versus the claims themselves, which are not translated in this file.
 */
export const webComparisonMessages = withHebrewPluralForms({
  'web.comparison.eyebrow': 'השוואה',

  'web.comparison.state.yes': 'כן',
  'web.comparison.state.no': 'לא',
  'web.comparison.state.partial': 'חלקית',
  'web.comparison.state.notVerified': 'לא מאומת',

  'web.comparison.label.claim': 'טענה',
  'web.comparison.label.sourceRead': 'נקרא {date}',
  'web.comparison.label.checked': 'כל שורה נבדקה ב-{date}',
  'web.comparison.label.nextReview': 'הבדיקה הבאה ב-{date}',
  'web.comparison.label.backToIndex': 'כל ההשוואות',

  'web.comparison.table.title': 'מה כל אפשרות עושה',
  'web.comparison.table.caption': 'טענה אחת לשורה, עם המקור מאחורי כל תשובה',

  'web.comparison.bestFor.title': 'מה מתאים',
  'web.comparison.bestFor.ours': 'בחר במוצר הזה כאשר',
  'web.comparison.bestFor.alternative': 'בחר ב-{name} כאשר',

  'web.comparison.notDo.title': 'מה המוצר הזה לא עושה',
  'web.comparison.notDo.body':
    'המשפטים האלה נקראים מהקוד שקובע אותם, לא מוקלדים ביד, כך שהחלק הזה לא יכול לסטות ממה שהמוצר באמת הוא היום.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {אף מחבר לא השלים אימות ספק, כך שדבר לא מתפרסם היום לאף פלטפורמה דרך המוצר הזה.} one {# מחבר השלים אימות ספק. כל פלטפורמה אחרת בקבוצה עדיין בכוונה בלבד.} other {# מחברים השלימו אימות ספק. כל פלטפורמה אחרת בקבוצה עדיין בכוונה בלבד.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {אף שפה לא השלימה בדיקה אנושית, כך שכל שפה בממשק מסומנת כבטא.} one {# שפה השלימה בדיקה אנושית. כל שפה אחרת מסומנת כבטא.} other {# שפות השלימו בדיקה אנושית. כל שפה אחרת מסומנת כבטא.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {כל דרגת תמחור הוחלטה ונושאת מחיר אמיתי.} one {# דרגת תמחור עדיין ממלאת מקום שלא הוחלט עליו ולא ניתן לרכוש אותה.} other {# דרגות תמחור עדיין ממלאות מקום שלא הוחלט עליו ולא ניתן לרכוש אותן.}}',

  'web.comparison.notVerified.title': 'מה המשמעות של "לא מאומת"',
  'web.comparison.notVerified.body':
    'תא אומר "לא מאומת" כשלא ניתן היה לקרוא את העובדה בתיעוד הציבורי הרשמי של האפשרות האחרת ביום הבדיקה. הוא אף פעם לא ממולא מהזיכרון, ואף פעם לא מועתק מסיכום שמישהו אחר כתב.',

  'web.comparison.method.title': 'איך הדף הזה נבנה',
  'web.comparison.method.body':
    'כל שורה היא טענה אחת, עם המסמך שממנו היא הגיעה והתאריך שבו מישהו קרא אותו. אין צילומי מסך של מתחרים, אין ניסוח פיצ׳רים מועתק ואין חולשות מומצאות.',
  'web.comparison.method.cadence':
    'כל השוואה נבדקת מחדש לפחות פעם ב-90 יום, ומיד כשפלטפורמה או אפשרות משנה משהו שמצוין בשורה.',

  'web.comparison.questions.title': 'שאלות',
  'web.comparison.sources.title': 'מקורות שצוינו בדף הזה',

  'web.comparison.index.title': 'השוואות שפורסמו',
  'web.comparison.index.body':
    'כל דף משווה את המוצר הזה לקטגוריה של חלופה שאת העובדות שלה אפשר לקרוא מתיעוד רשמי. מוצר בעל שם מקבל דף כשהעובדות הנוכחיות שלו אפשר לקרוא מהדפים הציבוריים שלו עצמו, ולא לפני כן.',
  'web.comparison.index.checked': 'נבדק {date}',
});
