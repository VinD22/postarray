import { withHebrewPluralForms } from './catalog-helpers';

/**
 * The blog's page chrome. See `en/web-blog.ts` for what belongs here versus
 * article prose, which is not translated in this file.
 */
export const webBlogMessages = withHebrewPluralForms({
  'web.blog.meta.title': 'כתיבה על תפעול פרסום',
  'web.blog.meta.description':
    'מאמרים על קצב פרסום, מודלים לתזמון, אזורי זמן, התאמה לפי פלטפורמה וניהול עבודת לקוחות כפרויקטים נפרדים.',

  'web.blog.title': 'כתיבה',
  'web.blog.lede':
    'הערות על המכניקה של עבודת הפרסום: איך גודל לוח הזמנים נקבע, איך תור מתנהג כשהשבוע מחליק, מה באמת שונה בין פלטפורמות, ואיך עבודת לקוחות נשארת מופרדת.',

  'web.blog.notice.prelaunch.title': 'המאמרים האלה עוסקים בבעיה, לא במוצר שאפשר כבר להשתמש בו',
  'web.blog.notice.prelaunch.body':
    'אף מחבר כאן לא השלים אימות ספק, כך שדבר לא מתפרסם היום לאף פלטפורמה דרך המוצר הזה. כל כלל פלטפורמה למטה נושא את המסמך הרשמי שממנו הוא נלקח ואת התאריך שבו מישהו קרא אותו.',

  'web.blog.cluster.cadence': 'קצב',
  'web.blog.cluster.scheduling': 'תזמון',
  'web.blog.cluster.adaptation': 'התאמה לפי פלטפורמה',
  'web.blog.cluster.operations': 'תפעול סוכנות',
  'web.blog.cluster.developers': 'שילוב דרך ה-API',

  'web.blog.label.published': 'פורסם {date}',
  'web.blog.label.updated': 'עודכן {date}',
  'web.blog.label.writtenBy': 'נכתב על ידי {name}',
  'web.blog.label.reviewedBy': 'נבדק על ידי {name}',
  'web.blog.label.sources': 'מקורות',
  'web.blog.label.sourceRead': 'נקרא {date}',
  'web.blog.label.cluster': 'נושא',
  'web.blog.label.articleList': 'מאמרים',
  'web.blog.label.backToIndex': 'כל המאמרים',
  'web.blog.label.count': '{count, plural, =0 {אין עדיין מאמרים} one {# מאמר} other {# מאמרים}}',

  'web.blog.byline.editorial.name': 'מדור מחקר הפרסום',
  'web.blog.byline.editorial.role': 'כותב ומתחזק את המאמרים האלה',
  'web.blog.byline.platform.name': 'מדור תיעוד הפלטפורמות',
  'web.blog.byline.platform.role': 'בודק כל משפט על פלטפורמה מול המקור הרשמי שלו',

  'web.blog.feed.title': 'כתיבה על תפעול פרסום',
  'web.blog.feed.description':
    'מאמרים חדשים על קצב פרסום, מודלים לתזמון, אזורי זמן, התאמה לפי פלטפורמה ותפעול סוכנויות.',
  'web.blog.feed.label': 'פיד RSS',

  'web.blog.empty.title': 'שום דבר לא פורסם כאן עדיין',
  'web.blog.empty.body': 'המאמרים הראשונים נכתבים כרגע. הפיד יישא אותם כשהם יעלו.',

  'web.blog.label.language': 'קרא את זה ב',
  'web.blog.label.notTranslated': 'המאמר הזה עדיין לא נכתב בשפה שלך. מוצגת הגרסה באנגלית.',
  'web.blog.label.languageCount': '{count, plural, one {# שפה} other {# שפות}}',
});
