import { withHebrewPluralForms } from './catalog-helpers';

/**
 * The free tools on the public site. See `en/web-tools.ts`: every number
 * comes from the generated connector dataset, every calculation runs in the
 * reader's browser, and a missing limit is stated as unavailable, never a
 * guess.
 */
export const webToolsMessages = withHebrewPluralForms({
  'web.meta.tools.title': 'כלי פרסום חינמיים',
  'web.meta.tools.description':
    'כלים קטנים ופרטיים לאנשים שמפרסמים בכמה פלטפורמות: בדיקת מגבלות לכל פלטפורמה, בונה UTM, בדיקת אורך כותרת ל-YouTube ומתכנן אזורי זמן.',
  'web.meta.tools.preflight.title': 'בודק טרום-פרסום',
  'web.meta.tools.preflight.description':
    'בדוק טיוטה אחת מול מגבלות הטקסט והמדיה המפורסמות של עשר פלטפורמות, עם המקור והתאריך שבו כל מגבלה נקראה.',
  'web.meta.tools.utm.title': 'בונה קישורי UTM',
  'web.meta.tools.utm.description':
    'הרכב כתובת URL מתויגת לקמפיין וראה מה כל פרמטר UTM אומר. פועל לגמרי בדפדפן שלך.',
  'web.meta.tools.youtubeTitle.title': 'בודק אורך כותרת YouTube',
  'web.meta.tools.youtubeTitle.description':
    'מדוד כותרת YouTube מול התקרה המתועדת, נספרת כפי שאדם סופר תווים.',
  'web.meta.tools.timeZone.title': 'מתכנן אזורי זמן ושעון קיץ',
  'web.meta.tools.timeZone.description':
    'ראה זמן פרסום אחד בכמה אזורי קהל ומצא את השבועות שבהם שינוי שעון קיץ מזיז את השעה המקומית.',
  'web.meta.tools.engagementRate.title': 'מחשבון שיעור מעורבות',
  'web.meta.tools.engagementRate.description':
    'חלק אינטראקציות בטווח הגעה, עוקבים או חשיפות. שלושה חישובים פשוטים, בלי אמת מידה מומצאת.',

  'web.tools.index.title': 'כלים חינמיים',
  'web.tools.index.summary':
    'מחשבונים קטנים שבנויים על אותם נתוני מגבלות פלטפורמה שהמחברים שלנו קוראים.',
  'web.tools.index.lede':
    'ארבעה כלים קטנים, בנויים על אותם נתוני מגבלות פלטפורמה שהמחברים שלנו משתמשים בהם. בלי חשבון, בלי העלאה, בלי מעקב אחרי מה שאתה כותב.',
  'web.tools.index.dataTitle': 'מאיפה המספרים מגיעים',
  'web.tools.index.dataBody':
    'כל מגבלה נוצרת מקוד היכולות של המחבר במאגר הזה, וכל שורת פלטפורמה נושאת את דף התיעוד הרשמי שממנו היא הגיעה ואת התאריך שבו מישהו קרא את הדף הזה.',
  'web.tools.index.honesty':
    'הכלים האלה לא מפרסמים כלום. אף מחבר עדיין לא השלים אימות ספק, כך ששום דבר כאן לא מחבר חשבון.',
  'web.tools.shared.privacyTitle': 'זה פועל בדפדפן שלך',
  'web.tools.shared.privacyBody':
    'כל מה שאתה כותב נשאר בדף הזה. אין בקשה לשרת, אין אחסון ואין אירוע אנליטיקה שנושא את הטקסט שלך.',
  'web.tools.shared.sourceLink': 'תיעוד הפלטפורמה',
  'web.tools.shared.sourceRead': 'נקרא ב-{date}',
  'web.tools.shared.unavailable': 'לא זמין',
  'web.tools.shared.unavailableWhy':
    'אנחנו עדיין לא מספקים מחבר לפלטפורמה הזו, אז אין לנו מגבלה מאומתת להציג. אנחנו מעדיפים לא לומר כלום מאשר לנחש.',
  'web.tools.shared.copy': 'העתק',
  'web.tools.shared.copied': 'הועתק',
  'web.tools.shared.copyFailed': 'הדפדפן שלך חסם את ההעתקה. בחר את הטקסט והעתק אותו.',
  'web.tools.shared.faqTitle': 'שאלות',
  'web.tools.shared.baselineTitle': 'איזה חשבון המספרים האלה מתארים',
  'web.tools.shared.baselineBody':
    'המקרה השמרני: חשבון שזה עתה חובר בלי כשירות מוגברת. חלק מהפלטפורמות מעלות תקרה ברגע שערוץ או עסק מאומתים, ובמקום שזה קורה הדף אומר זאת.',
  'web.tools.shared.otherTools': 'כלים אחרים',

  'web.tools.preflight.name': 'בודק טרום-פרסום',
  'web.tools.preflight.summary':
    'טיוטה אחת, נבדקת מול מגבלות הטקסט והמדיה של עשר פלטפורמות בבת אחת.',
  'web.tools.utm.name': 'בונה קישורי UTM',
  'web.tools.utm.summary': 'בנה כתובת URL מתויגת לקמפיין בלי לפגוע במחרוזת השאילתה שכבר הייתה לה.',
  'web.tools.youtubeTitle.name': 'בודק אורך כותרת YouTube',
  'web.tools.youtubeTitle.summary': 'מדוד כותרת בדרך שבה אדם סופר תווים.',
  'web.tools.timeZone.name': 'מתכנן אזורי זמן ושעון קיץ',
  'web.tools.timeZone.summary': 'זמן פרסום אחד בכמה אזורי קהל, עם שינויי שעון הקיץ מסומנים.',
  'web.tools.engagementRate.name': 'מחשבון שיעור מעורבות',
  'web.tools.engagementRate.summary':
    'אינטראקציות חלקי טווח הגעה, עוקבים או חשיפות. שום דבר לא מתברר, שום דבר לא נמדד מול אמת מידה.',

  'web.tools.preflight.title': 'בודק טרום-פרסום',
  'web.tools.preflight.lede':
    'הדבק טיוטה, בחר את הפלטפורמות שאתה מפרסם בהן, וראה אילו יידחו אותה לפני שתגלה זאת משגיאת API.',
  'web.tools.preflight.explainer.title': 'למה מונה תווים לא מספיק',
  'web.tools.preflight.explainer.body':
    'פלטפורמות לא מסכימות על מה זה תו. חלקן סופרות יחידות קוד, אז אמוג׳י אחד עולה שניים. חלקן סופרות גרפמות, אז דגל או אמוג׳י משפחה עולה אחד. חלקן כותבות מחדש כל קישור לרוחב קבוע, אז כתובת URL של 200 תווים עולה כמו אחת של 20. הכלי הזה מיישם כל כלל פלטפורמה בנפרד.',
  'web.tools.preflight.explainer.counting':
    'הטיוטה נמדדת עם המחלק (segmenter) של Intl בדפדפן, שמחלק את הטקסט ליחידות שקורא היה קורא להן תווים, ואז מתואם לפי כלל הפלטפורמה.',
  'web.tools.preflight.field.draft.label': 'הטיוטה שלך',
  'web.tools.preflight.field.draft.help':
    'הדבק את גוף הפוסט. קישורים מזוהים אוטומטית כדי שהעלות שלהם תיושם לכל פלטפורמה.',
  'web.tools.preflight.field.platforms.label': 'פלטפורמות לבדיקה',
  'web.tools.preflight.field.platforms.help': 'בחר כמה שאתה מפרסם בהן.',
  'web.tools.preflight.field.mediaKind.label': 'מדיה מצורפת',
  'web.tools.preflight.field.mediaKind.none': 'ללא מדיה',
  'web.tools.preflight.field.mediaKind.image': 'תמונות',
  'web.tools.preflight.field.mediaKind.video': 'סרטון אחד',
  'web.tools.preflight.field.mediaCount.label': 'כמה תמונות',
  'web.tools.preflight.field.byteSize.label': 'גודל קובץ במגה-בייט',
  'web.tools.preflight.field.byteSize.help': 'הקובץ הבודד הגדול ביותר. השאר ריק כדי לדלג.',
  'web.tools.preflight.field.duration.label': 'אורך הווידאו בשניות',
  'web.tools.preflight.field.duration.help': 'השאר ריק כדי לדלג על בדיקת המשך.',
  'web.tools.preflight.field.width.label': 'רוחב המדיה בפיקסלים',
  'web.tools.preflight.field.height.label': 'גובה המדיה בפיקסלים',
  'web.tools.preflight.field.dimensions.help':
    'אופציונלי. משמש רק כדי להראות את יחס התמונה שהיית מפרסם.',
  'web.tools.preflight.results.title': 'תוצאה לפי פלטפורמה',
  'web.tools.preflight.results.empty': 'בחר לפחות פלטפורמה אחת כדי לראות תוצאה.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {שום דבר לא חוסם} other {# ייכשלו}}, {warning, plural, =0 {אין אזהרות} other {# כדאי לבדוק}}.',
  'web.tools.preflight.status.pass': 'מתאים',
  'web.tools.preflight.status.warning': 'כדאי לבדוק',
  'web.tools.preflight.status.fail': 'ייכשל',
  'web.tools.preflight.status.unavailable': 'לא זמין',
  'web.tools.preflight.count.label':
    '{count} מתוך {limit} {unit, select, grapheme {תווים} utf16 {יחידות קוד} weighted {תווים משוקללים} other {תווים}}',
  'web.tools.preflight.finding.textOver':
    'חורג מהמגבלה ב-{over, plural, one {תו #} other {# תווים}}.',
  'web.tools.preflight.finding.textNear': 'במרחק {remaining} תווים מהמגבלה.',
  'web.tools.preflight.finding.textFits': 'הגוף מתאים.',
  'web.tools.preflight.finding.linkFixed':
    'כל קישור נכתב מחדש לרוחב קבוע, אז כל אחד עולה {cost} תווים לא משנה מה האורך האמיתי שלו.',
  'web.tools.preflight.finding.linkActual': 'קישורים נספרים לפי התווים שהם תופסים.',
  'web.tools.preflight.finding.imagesOver':
    'הפלטפורמה הזו מקבלת {limit, plural, =0 {אפס תמונות} one {תמונה #} other {# תמונות}} בפוסט אחד.',
  'web.tools.preflight.finding.videosOver':
    'הפלטפורמה הזו מקבלת {limit, plural, =0 {אפס סרטונים} one {סרטון #} other {# סרטונים}} בפוסט אחד.',
  'web.tools.preflight.finding.bytesOver': 'הקובץ גדול מהתקרה של {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    'אין תקרת בייטים מפורסמת לסוג המדיה הזה, אז הגודל לא נבדק.',
  'web.tools.preflight.finding.durationOver': 'ארוך מהתקרה של {limit} שניות.',
  'web.tools.preflight.finding.durationUnder': 'קצר מהמינימום של {limit} שניות.',
  'web.tools.preflight.finding.durationUnknown': 'אין תקרת משך מפורסמת, אז האורך לא נבדק.',
  'web.tools.preflight.finding.altText': 'טקסט חלופי מתקבל עד {limit} תווים, כדאי להשתמש בו.',
  'web.tools.preflight.finding.ratio': 'היית מפרסם ביחס של בערך {ratio} ל-1.',
  'web.tools.preflight.faq.counting.q': 'איך אתם סופרים תווים?',
  'web.tools.preflight.faq.counting.a':
    'לפי גרפמה, באמצעות המחלק של Intl בדפדפן, שזו היחידה שקורא מתכוון אליה בתו. במקום שבו פלטפורמה מתעדת כלל שונה, כמו ספירת יחידות קוד או חיוב רוחב קבוע לקישור, הכלל הזה מיושם מעליו.',
  'web.tools.preflight.faq.accuracy.q': 'עד כמה המגבלות האלה עדכניות?',
  'web.tools.preflight.faq.accuracy.a':
    'כל מגבלה נוצרת מקוד המחבר במאגר שלנו במקום להיות מוקלדת בדף, וכל שורת פלטפורמה מציגה את המסמך הרשמי שממנו היא הגיעה ואת התאריך שבו מישהו קרא אותו. אם פלטפורמה משנה מספר, התיקון הוא שינוי קוד אחד וכל כלי כאן עוקב אחריו.',
  'web.tools.preflight.faq.privacy.q': 'האם הטיוטה שלי מועלית?',
  'web.tools.preflight.faq.privacy.a':
    'לא. הבדיקה פועלת בדפדפן שלך. אין בקשה שנושאת את הטקסט שלך, שום דבר לא נשמר, וסגירת הלשונית מספיקה כדי למחוק אותה.',
  'web.tools.preflight.faq.publish.q': 'האם הכלי הזה יכול לפרסם בשבילי?',
  'web.tools.preflight.faq.publish.a':
    'לא היום. אף מחבר לא השלים אימות ספק, אז שום דבר באתר הזה עדיין לא מתפרסם לפלטפורמה. הדף הזה הוא בדיקת מגבלות, לא עורך.',

  'web.tools.utm.title': 'בונה קישורי UTM',
  'web.tools.utm.lede':
    'הוסף פרמטרים לקמפיין לכתובת URL בלי לאבד את מחרוזת השאילתה שכבר הייתה לה, ובלי לנחש איזה פרמטר אומר מה.',
  'web.tools.utm.explainer.title': 'למה כל פרמטר משמש',
  'web.tools.utm.explainer.body':
    'פרמטרי UTM נקראים על ידי כלי אנליטיקה, לא על ידי הפלטפורמה שבה אתה מפרסם. הם נוסעים בכתובת ה-URL, אז כל מי שרואה את הקישור רואה אותם. שמור עליהם קצרים, באותיות קטנות ועקביים, כי שני איותים של אותו קמפיין הופכים לשתי שורות בדוח.',
  'web.tools.utm.field.url.label': 'כתובת URL יעד',
  'web.tools.utm.field.url.help': 'הדף שאליו אתה רוצה שאנשים יגיעו, כולל https.',
  'web.tools.utm.field.url.invalid': 'זה לא מנותח ככתובת URL של http או https.',
  'web.tools.utm.field.source.label': 'מקור הקמפיין',
  'web.tools.utm.field.source.help': 'מאיפה הגיע הקליק. למשל שם פלטפורמה.',
  'web.tools.utm.field.medium.label': 'אמצעי הקמפיין',
  'web.tools.utm.field.medium.help': 'סוג הקישור. למשל רשתות חברתיות, אימייל או הפניה.',
  'web.tools.utm.field.campaign.label': 'שם הקמפיין',
  'web.tools.utm.field.campaign.help': 'ההשקה, המבצע או הנושא שאליו שייך הקישור הזה.',
  'web.tools.utm.field.term.label': 'מונח הקמפיין',
  'web.tools.utm.field.term.help': 'אופציונלי. באופן מסורתי מילת המפתח בתשלום.',
  'web.tools.utm.field.content.label': 'תוכן הקמפיין',
  'web.tools.utm.field.content.help':
    'אופציונלי. מפריד בין שני קישורים לאותו דף, למשל שתי גרסאות של פוסט.',
  'web.tools.utm.result.title': 'כתובת ה-URL המתויגת שלך',
  'web.tools.utm.result.empty': 'הזן כתובת URL יעד כדי לראות את התוצאה.',
  'web.tools.utm.result.label': 'כתובת URL מורכבת',
  'web.tools.utm.result.preserved':
    'מחרוזת השאילתה שכבר הייתה בכתובת ה-URL שלך נשמרת בדיוק כפי שהקלדת אותה.',
  'web.tools.utm.result.replaced':
    'כתובת ה-URL שלך כבר נשאה אחד מהפרמטרים האלה. הערך שהזנת כאן מחליף אותו.',
  'web.tools.utm.faq.encoding.q': 'מה קורה לרווחים ולסימנים דיאקריטיים?',
  'web.tools.utm.faq.encoding.a':
    'הם מקודדים באחוזים, וזה מה שגורם לקישור לשרוד הדבקה לתוך פוסט. רווח הופך לסימן פלוס ואות עם סימן דיאקריטי הופכת לצורתה המקודדת, וכלי אנליטיקה מפענחים את שניהם בחזרה.',
  'web.tools.utm.faq.existing.q': 'האם זה ישבור כתובת URL שכבר יש לה פרמטרים?',
  'web.tools.utm.faq.existing.a':
    'לא. פרמטרים קיימים נשמרים בסדר המקורי שלהם, ורק פרמטר UTM שמילאת נוסף או מוחלף. קטע בסוף כתובת ה-URL נשאר בסוף.',
  'web.tools.utm.faq.privacy.q': 'האם כתובת ה-URL שלי נשלחת לאיזשהו מקום?',
  'web.tools.utm.faq.privacy.a': 'לא. כתובת ה-URL מורכבת בדפדפן שלך ואף פעם לא עוזבת את הדף הזה.',

  'web.tools.youtubeTitle.title': 'בודק אורך כותרת YouTube',
  'web.tools.youtubeTitle.lede':
    'כותרת שארוכה בתו אחד מדי נדחית בהעלאה. כותרת שפשוט ארוכה נחתכת במקום שלא בחרת.',
  'web.tools.youtubeTitle.explainer.title': 'שתי מגבלות שונות',
  'web.tools.youtubeTitle.explainer.body':
    'התקרה הקשה היא מה שנקודת הקצה של ההעלאה מקבלת. איפה מוצגת כותרת זו שאלה נפרדת: תוצאת חיפוש, סרגל צד וטלפון כולם חותכים כותרת בנקודה שונה, ואף אחת מנקודות החיתוך האלה לא מתפרסמת. הכלי הזה קובע את התקרה המתועדת ומראה לך את הצורה של הכותרת שלך, ולא ממציא מספר חיתוך.',
  'web.tools.youtubeTitle.field.title.label': 'כותרת הווידאו',
  'web.tools.youtubeTitle.field.title.help': 'נספר לפי גרפמה, אז אמוג׳י עולה אחד.',
  'web.tools.youtubeTitle.result.count': '{count} מתוך {limit} תווים',
  'web.tools.youtubeTitle.result.over':
    'חורג ב-{over, plural, one {תו #} other {# תווים}}. ההעלאה הייתה נדחית.',
  'web.tools.youtubeTitle.result.fits': 'בתוך התקרה המתועדת.',
  'web.tools.youtubeTitle.result.front':
    '{count} התווים הראשונים נושאים את המשקל הרב ביותר, כי זה בערך מה שיש מקום עבורו בפריסה צרה. שלך מתחיל כך: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'מגבלת הכותרת לא זמינה בגרסה הזו, אז שום דבר לא נבדק כאן.',
  'web.tools.youtubeTitle.faq.limit.q': 'מאיפה מגיעה המגבלה?',
  'web.tools.youtubeTitle.faq.limit.a':
    'מהמסמך הרשמי של videos insert, נוצר לדף הזה מאותו קוד מחבר שהמעלה שלנו היה משתמש בו. התאריך שבו מישהו קרא לאחרונה את הדף הזה מוצג לצד המספר.',
  'web.tools.youtubeTitle.faq.truncation.q': 'איפה בדיוק YouTube חותך כותרת?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'זה תלוי במשטח ובאזור התצוגה, ו-YouTube לא מפרסם ספירת תווים בשביל זה. אנחנו מציגים את התקרה, שמתועדת, ואנחנו לא מדפיסים מספר חיתוך שיהיה ניחוש.',
  'web.tools.youtubeTitle.faq.emoji.q': 'האם אמוג׳י נספר כתו אחד?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'במונה הזה כן, כי אנחנו סופרים גרפמות. פלטפורמה שסופרת יחידות קוד באופן פנימי עשויה לגבות יותר עבור אותו אמוג׳י, ולכן בודק הטרום-פרסום מיישם כל כלל פלטפורמה בנפרד.',

  'web.tools.timeZone.title': 'מתכנן אזורי זמן ושעון קיץ',
  'web.tools.timeZone.lede':
    'חריץ שבועי שנראה יציב ביומן שלך זז עבור חצי מהקהל שלך פעמיים בשנה. זה מראה איפה ומתי.',
  'web.tools.timeZone.explainer.title': 'למה שעה מקומית קבועה היא לא זמן קבוע',
  'web.tools.timeZone.explainer.body':
    'זמן אומר משהו רק כשמצורף אליו אזור. אזורים משנים את ההיסט שלהם בתאריכים שונים לפי מדינה, ושני אזורים שמרוחקים חמש שעות בינואר יכולים להיות מרוחקים ארבע שעות באפריל. לוח זמנים ששמור כרגע ועוד אזור שורד את זה. לוח זמנים ששמור כשעה מקומית לא.',
  'web.tools.timeZone.field.date.label': 'תאריך',
  'web.tools.timeZone.field.time.label': 'שעה',
  'web.tools.timeZone.field.zone.label': 'האזור שלך',
  'web.tools.timeZone.field.audience.label': 'אזורי קהל',
  'web.tools.timeZone.field.audience.help': 'בחר את האזורים שבהם הקוראים שלך באמת נמצאים.',
  'web.tools.timeZone.result.title': 'אותו רגע, בכל מקום שבחרת',
  'web.tools.timeZone.result.empty': 'בחר לפחות אזור קהל אחד.',
  'web.tools.timeZone.result.shift':
    'שינוי שעון קיץ נופל בין התאריך הזה ובין אותו יום בשבוע ארבעה שבועות מאוחר יותר, אז השעה המקומית זזה.',
  'web.tools.timeZone.result.stable': 'אין שינוי היסט בארבעת השבועות הקרובים.',
  'web.tools.timeZone.result.later': 'ארבעה שבועות מאוחר יותר, {time}.',
  'web.tools.timeZone.result.invalidDate': 'הזן תאריך ושעה כדי לראות את ההשוואה.',
  'web.tools.timeZone.faq.dst.q': 'לאיזה כיוון השעה זזה?',
  'web.tools.timeZone.faq.dst.a':
    'זה תלוי באזור ובכיוון השינוי, ולכן הטבלה מציגה את השעה המקומית האמיתית ארבעה שבועות קדימה במקום לתאר את הכלל. ההיסט לכל אזור נקרא ממסד הנתונים של אזורי הזמן של הדפדפן שלך.',
  'web.tools.timeZone.faq.storage.q': 'איך פוסט מתוזמן צריך לשמור את הזמן שלו?',
  'web.tools.timeZone.faq.storage.a':
    'כרגע ועוד אזור ה-IANA שהאדם בחר, אף פעם לא כזמן מקומי נאיבי. זה מה שאנחנו עושים בפנים, ולכן פוסט שתוזמן לפני שינוי שעון עדיין נוחת בשעה המקומית המיועדת.',

  'web.tools.engagementRate.title': 'מחשבון שיעור מעורבות',
  'web.tools.engagementRate.lede':
    'הקלד את המספרים שהלוח שלך כבר מראה לך. זה מחלק אותם בשלוש דרכים ועוצר שם: בלי אמת מידה, בלי סף "טוב", שום דבר שאין לנו באמת.',
  'web.tools.engagementRate.explainer.title': 'למה שלושה מכנים, לא אחד',
  'web.tools.engagementRate.explainer.body':
    'טווח הגעה, עוקבים וחשיפות עונים על שאלות שונות. שיעור לפי טווח הגעה אומר לך איך הגיבו האנשים שבאמת ראו את הפוסט. שיעור לפי עוקבים אומר לך איזה חלק מהקהל שלך התערב, בין אם הפוסט הגיע לכולם ובין אם לא. שיעור לפי חשיפות סופר כל צפייה, כולל חזרות. השוואה של שיעור שחושב בדרך אחת מול שיעור שחושב בדרך אחרת היא מקור נפוץ למספר מעורבות שנראה שגוי.',
  'web.tools.engagementRate.field.interactions.label': 'אינטראקציות',
  'web.tools.engagementRate.field.interactions.help':
    'לייקים, תגובות, שיתופים ושמירות ביחד, מהפוסט שאתה מודד.',
  'web.tools.engagementRate.field.reach.label': 'טווח הגעה',
  'web.tools.engagementRate.field.reach.help': 'חשבונות שראו את הפוסט לפחות פעם אחת.',
  'web.tools.engagementRate.field.followers.label': 'עוקבים',
  'web.tools.engagementRate.field.followers.help': 'גודל החשבון בזמן הפוסט.',
  'web.tools.engagementRate.field.impressions.label': 'חשיפות',
  'web.tools.engagementRate.field.impressions.help': 'סך הצפיות, כולל אדם שראה פעמיים.',
  'web.tools.engagementRate.result.title': 'שיעור מעורבות, בשלוש דרכים',
  'web.tools.engagementRate.result.empty': 'לא זמין',
  'web.tools.engagementRate.result.note':
    'אין שיעור טוב אוניברסלי להשוואה. זה תלוי בפלטפורמה, בפורמט, בגודל הקהל ובענף, וכל מספר בודד שמוצע כאמת מידה הוא ניחוש שהתלבש כנתונים.',
  'web.tools.engagementRate.basis.reach': 'לפי טווח הגעה',
  'web.tools.engagementRate.basis.followers': 'לפי עוקבים',
  'web.tools.engagementRate.basis.impressions': 'לפי חשיפות',
  'web.tools.engagementRate.faq.formula.q': 'מה הנוסחה בפועל?',
  'web.tools.engagementRate.faq.formula.a':
    'אינטראקציות חלקי המכנה שבחרת, מוצג כאחוז. אינטראקציות כאן פירושן לייקים, תגובות, שיתופים ושמירות ביחד; חלק מהפלטפורמות מדווחות עליהן בנפרד, ובמקרה כזה חבר אותן בעצמך לפני שאתה מקליד את הסכום.',
  'web.tools.engagementRate.faq.basis.q': 'באיזה מכנה עליי להשתמש?',
  'web.tools.engagementRate.faq.basis.a':
    'איזה שהפלטפורמה שלך מדווחת יחד עם הפוסט, כך ששני המספרים הגיעו מאותו חלון מדידה. השוואה של שיעור לפי טווח הגעה בפוסט אחד מול שיעור לפי עוקבים בפוסט אחר אינה השוואה הוגנת גם אם שניהם נקראים שיעור מעורבות.',
});
