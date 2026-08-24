import { withHebrewPluralForms } from './catalog-helpers';

/**
 * The in-page product demonstration. See `en/web-demo.ts`: sample content
 * only, no engagement numbers, nothing here submits anything, and the
 * publishing half stays honestly marked unavailable. "Northbound Tools",
 * "Ada" and "Ravi" are the fixed sample identity and are kept exactly as in
 * English, matching the other translated catalogs.
 */
export const webDemoMessages = withHebrewPluralForms({
  'web.meta.demo.title': 'ראה איך Post Array עובד',
  'web.meta.demo.description':
    'סיור מודרך בתהליך הפרסום, מפרויקט חדש ועד לקבלה, מוצג בממשק האמיתי עם תוכן לדוגמה. שום דבר עדיין לא מתפרסם, והסיור אומר איפה הגבול הזה.',

  'web.demo.nav.label': 'ראה איך זה עובד',
  'web.demo.nav.summary':
    'סיור מודרך במוצר בסדר שבו אתה פוגש אותו, בנוי מהממשק האמיתי עם תוכן לדוגמה.',

  'web.demo.frame.badge': 'הדגמה',
  'web.demo.frame.sample':
    'הדגמה שבנויה מהממשק האמיתי, מלאה בתוכן לדוגמה עבור חברה שלא קיימת. לא חשבון פעיל. שום דבר כאן לא שולח כלום.',

  'web.demo.control.pause': 'השהה את ההדגמה',
  'web.demo.control.play': 'הפעל את ההדגמה',
  'web.demo.control.replay': 'הפעל את ההדגמה שוב',

  'web.demo.hero.viewCta': 'לצפות בהדגמה',
  'web.demo.hero.projectsLine':
    'חשבון אחד מנהל כמה עסקים. כל פרויקט הוא עסק בפני עצמו, עם חשבונות מחוברים משלו, לוח שנה משלו ואישורים משלו, ועוברים ביניהם מתפריט אחד, כמו שמחליפים נכס בקונסולת חיפוש.',
  'web.demo.hero.projectsChip': '{count, plural, one {חשבון אחד} other {# חשבונות}}',
  'web.demo.hero.caption':
    'טיוטה אחת הופכת לגרסה לכל פלטפורמה, מקבלת זמן ונוחתת בשבוע. תוכן לדוגמה, לא חשבון פעיל.',
  'web.demo.hero.more': 'עבור על כל תהליך העבודה',

  'web.demo.title': 'איך זה עובד, בסדר שבו אתה פוגש את זה',
  'web.demo.lede':
    'תשעה שלבים, מסביבת עבודה ריקה ועד לרשומה של מה שקרה. כל אחד מציג את המשטח שבו היית באמת מסתכל, עם תוכן לדוגמה בו. שום דבר בדף הזה לא זז מעצמו, כך שתוכל לקרוא אותו בקצב שלך.',
  'web.demo.notice.title': 'זו הדגמה, לא חשבון פעיל',
  'web.demo.notice.body':
    'כל פאנל כאן הוא ממשק המוצר עם תוכן לדוגמה בו. אף מחבר לא עבר אימות ספק, כך שדבר לא מתפרסם היום לאף פלטפורמה דרך המוצר הזה. במקום שבו תהליך העבודה נעצר, הדף אומר זאת במקום לצייר את השאר.',
  'web.demo.contents.title': 'תשעת השלבים',
  'web.demo.stepLabel': 'שלב {position} מתוך {total}',
  'web.demo.next': 'הבא: {step}',
  'web.demo.closing.pricing': 'ראה כמה זה עולה',
  'web.demo.closing.title': 'זה כל המעגל',
  'web.demo.closing.body':
    'שום דבר למעלה אינו דוגמית של מוצר שאנחנו מקווים לבנות. זה הממשק כפי שהוא היום, עם חצי הפרסום מסומן בכנות כלא גמור.',

  'web.demo.step.project.title': 'צור פרויקט',
  'web.demo.step.project.body':
    'פרויקט מחזיק חשבונות, טיוטות, אישורים ואזור זמן. כל שאילתה במוצר מוגבלת לאחד, בשירות האפליקציה ושוב במסד הנתונים, כך שלקוח לא יכול לראות לקוח אחר בטעות.',

  'web.demo.step.connect.title': 'חבר חשבון',
  'web.demo.step.connect.body':
    'החיבור פועל רק דרך ה-API הרשמיים של הפלטפורמות, ואומר לך מה הפלטפורמה דורשת מהחשבון לפני שאתה מתחיל. היום כל מחבר נעצר באימות, ולכן כל שורה למטה אומרת זאת במקום להראות סימן ירוק.',

  'web.demo.step.compose.title': 'כתוב פעם אחת, התאם לכל פלטפורמה',
  'web.demo.step.compose.body':
    'אתה כותב טיוטת אב. בחירת חשבון אחד פותחת דריסה עבור החשבון הזה בלבד, עם המגבלות שלו וההצגה המקדימה שלו. שום דבר שכתבת עבור LinkedIn לא משנה את מה ש-X מקבל, והבדיקות שמתחת לכל גרסה רצות לפני שמשהו מתוזמן.',

  'web.demo.step.variants.title': 'ראה מה כל חשבון באמת מקבל',
  'web.demo.step.variants.body':
    'טיוטה אחת הופכת לגרסה אחת לכל חשבון, כל אחת כתובה לפלטפורמה שאליה היא הולכת: שורה קצרה יותר ל-X, פתק השחרור המלא ל-LinkedIn, כיתוב וטקסט חלופי ל-Instagram. אתה עורך כל אחת מהן בלי לגעת באחרות, וכל גרסה נושאת את הבדיקה שחלה עליה.',

  'web.demo.step.schedule.title': 'תן לזה זמן, או תמסור את זה לתור',
  'web.demo.step.schedule.body':
    'זמן נשמר כרגע בתוספת אזור הזמן של הפרויקט, אף פעם לא כזמן מקומי נאיבי, כך ששינוי שעון קיץ לא מזיז שום דבר תחתיך. התור הוא הדרך השנייה: הוא לוקח את החריץ הבא שהכללים שקבעת מאפשרים.',

  'web.demo.step.calendar.title': 'צפה בלוח השנה',
  'web.demo.step.calendar.body':
    'השבוע מציג את הפלטפורמה, החשבון, המצב והזמן של כל פוסט. הזזת אחד היא גם כפתור וגם גרירה, כך שהלוח שנה שמיש לחלוטין מהמקלדת.',

  'web.demo.step.receipt.title': 'קרא את הקבלה אחר כך',
  'web.demo.step.receipt.body':
    'כל ניסיון כותב קבלה בלתי ניתנת לשינוי: מי כתב אותה, מי אישר אותה, תחת איזו מדיניות, באיזה רגע. חצי הפרסום של הרשומה הזו נכתב על ידי ריצת הפרסום, החלק שעדיין לא קיים.',

  'web.demo.project.label': 'פרויקט',
  'web.demo.project.zone': 'אזור זמן: {zone}',
  'web.demo.project.scope': 'טיוטות, חשבונות, אישורים וקבלות שייכים לפרויקט הזה ולשום מקום אחר.',

  'web.demo.accounts.label': 'חשבונות בפרויקט הזה',
  'web.demo.accounts.state': 'האימות לא הושלם',
  'web.demo.accounts.note':
    'כל שורה הייתה נושאת את בריאות האסימון, ההרשאות שניתנו והפוסט המוצלח האחרון. אף אחד מהם לא יכול לפרסם היום.',

  'web.demo.master.label': 'טיוטת אב',
  'web.demo.master.project': 'בפרויקט {project}',

  'web.demo.variants.label': 'מה כל חשבון מקבל',

  'web.demo.schedule.label': 'מתוזמן',
  'web.demo.schedule.value': '{when} באזור {zone}',
  'web.demo.schedule.approval': 'נדרש אישור אחד לפני שאפשר לשלוח משהו.',
  'web.demo.schedule.queue':
    'התור הוא הדרך השנייה: הוא בוחר את החריץ הבא שהכללים שלך מאפשרים, באזור הזמן הזה.',

  'web.demo.week.label': 'השבוע',
  'web.demo.week.caption': 'אותם שלושה פוסטים בלוח השנה, נקראים באזור הזמן של הפרויקט.',
  'web.demo.week.empty': 'שום דבר לא מתוזמן',

  'web.demo.receipt.label': 'הקבלה עד כה',
  'web.demo.receipt.pending':
    'מה שנשלח, מה שהפלטפורמה ענתה, מזהה הפוסט החיצוני והקישור הקבוע נכתבים על ידי ריצת הפרסום. הם נשארים לא זמינים עד שמחבר עובר אימות ספק.',
  'web.demo.receipt.field.externalId': 'מזהה פוסט חיצוני',
  'web.demo.receipt.field.permalink': 'קישור קבוע',

  'web.demo.sample.project': 'Northbound Tools (לדוגמה)',
  'web.demo.sample.actor': 'Ada, חברת צוות לדוגמה',
  'web.demo.sample.approver': 'Ravi, בודק לדוגמה',
  'web.demo.sample.policy': 'אישור אחד לפני שליחה',
  'web.demo.sample.master':
    'Northbound 2.4 יצא היום. ייבוא מהיר יותר, לחיפוש יש קיצור מקלדת, ותקלת הייצוא ששניים מכם דיווחו עליה תוקנה.',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'Northbound 2.4 יצא. ייבוא מהיר יותר, חיפוש במקלדת, ותקלת הייצוא ההיא תוקנה.',
  'web.demo.sample.x.check': 'ספירת תווים וסדר השרשור',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    'Northbound 2.4 יצא היום. פתק השחרור מסביר במלואם את שינויי הייבוא ותיקון הייצוא.',
  'web.demo.sample.linkedin.check': 'תפקיד בארגון ואורך הפוסט',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    'אותה תמונת שחרור, עם כיתוב שנכתב לפיד וטקסט חלופי שנכתב על ידי אדם.',
  'web.demo.sample.instagram.check': 'סוג חשבון, יחס תמונה וטקסט חלופי',

  'web.demo.tour.stepsLabel': 'שלבי הסיור',
  'web.demo.tour.jump': 'הצג שלב {position}: {step}',
  'web.demo.tour.step.project': 'צור פרויקט',
  'web.demo.tour.step.connect': 'חבר חשבונות',
  'web.demo.tour.step.compose': 'כתוב פעם אחת',
  'web.demo.tour.step.variants': 'התאם לכל פלטפורמה',
  'web.demo.tour.step.validate': 'בדוק את זה',
  'web.demo.tour.step.schedule': 'תן לזה זמן',
  'web.demo.tour.step.week': 'ראה את השבוע',
  'web.demo.tour.step.publish': 'פרסם ותעד',
  'web.demo.tour.step.digest': 'קרא את הסיכום',

  'web.demo.validate.label': 'בדיקות לפני תזמון',
  'web.demo.validate.check.length': 'מגבלת תווים, לכל חשבון',
  'web.demo.validate.check.lengthDetail': 'כל גרסה נמדדת מול המגבלה שהפלטפורמה נותנת לחשבון הזה.',
  'web.demo.validate.check.altText': 'טקסט חלופי בכל תמונה',
  'web.demo.validate.check.altTextDetail':
    'תמונה ללא תיאור, או ללא סימון כדקורטיבית, עוצרת את התזמון.',
  'web.demo.validate.check.firstComment': 'תגובה ראשונה מותרת כאן',
  'web.demo.validate.check.firstCommentDetail':
    'תגובה ראשונה מוצעת רק בחשבונות שהפלטפורמה שלהם תומכת בכך.',
  'web.demo.validate.note': 'אלה רצות בעורך לפני שמשהו מתוזמן, ושוב לפני שמשהו נשלח.',

  'web.demo.live.label': 'הפרסום והרשומה שלו',
  'web.demo.live.step.approved': 'אושר על ידי {approver}',
  'web.demo.live.step.queued': 'בתור לחריץ שלו',
  'web.demo.live.step.sent': 'נשלח לפלטפורמה',
  'web.demo.live.step.confirmed': 'אושר על ידי הפלטפורמה',
  'web.demo.live.badge.pending': 'לא פורסם',
  'web.demo.live.badge.live': 'חי',
  'web.demo.live.pending':
    'שני השלבים האחרונים נכתבים על ידי ריצת הפרסום. אף מחבר עדיין לא עבר אימות ספק, כך שהם נשארים ממתינים ומזהה הפוסט החיצוני והקישור הקבוע נשארים לא זמינים.',

  'web.demo.digest.label': 'השבוע שלך, במשפטים',
  'web.demo.digest.sample': 'לדוגמה',
  'web.demo.digest.line.variants': 'שלוש גרסאות ילידיות לפלטפורמה יצאו מטיוטה אחת השבוע.',
  'web.demo.digest.line.earliest': 'בוקר יום שלישי היה החריץ המוקדם ביותר שלך.',
  'web.demo.digest.line.approval': 'כל גרסה אושרה לפני שנכנסה לתור.',
  'web.demo.digest.line.alt': 'כל תמונה נשאה טקסט חלופי שנכתב על ידי אדם.',
  'web.demo.digest.footer': 'ניתוחים חיים מופיעים כאן ככל שהפוסטים שלך מתפרסמים.',

  'web.demo.step.validate.title': 'בדוק את זה לפני שהוא מתוזמן',
  'web.demo.step.validate.body':
    'העורך מודד כל גרסה מול החשבון שהיא נכתבה עבורו: מגבלת התווים שיש לחשבון הזה באמת, טקסט חלופי בכל תמונה, ואם הפלטפורמה בכלל מציעה תגובה ראשונה. גרסה שנכשלת בבדיקה לא יכולה להיות מתוזמנת.',

  'web.demo.step.publish.title': 'פרסם, ושמור את הרשומה',
  'web.demo.step.publish.body':
    'ריצת פרסום שולחת כל גרסה ברגע שלה, מתעדת מה הפלטפורמה ענתה, וכותבת קבלה בלתי ניתנת לשינוי. הריצה הזו היא החלק שעדיין לא קיים, כך ששני השלבים האחרונים למטה ממתינים ולא מצוירים כגמורים.',

  'web.demo.step.digest.title': 'קרא את הסיכום השבועי',
  'web.demo.step.digest.body':
    'הסיכום מתאר מה המוצר עשה במשפטים: כמה גרסאות יצאו מטיוטה אחת, איזה חריץ היה המוקדם ביותר, מה אושר. הוא לא נושא שום נתוני מעורבות, כי ניתוחים מגיעים מהפלטפורמות אחרי שפוסט מתפרסם ושום דבר עדיין לא מתפרסם.',
});
