import { withHebrewPluralForms } from './catalog-helpers';

/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 * See `en/posting-sets.ts`: pausing stops work that has not happened yet and
 * never retracts a post that already went out.
 */
export const postingSetMessages = withHebrewPluralForms({
  'calendar.hold.action': 'השהה',
  'calendar.hold.resumeAction': 'המשך',
  'calendar.hold.badge': 'מושהה',
  'calendar.hold.badgeBilling': 'הושהה עקב חיוב',
  'calendar.hold.term': 'השהיה',
  'calendar.hold.byPerson': 'הושהה על ידך ב-{date}.',
  'calendar.hold.byBilling': 'הושהה ב-{date} כי סביבת העבודה הזו איבדה גישה מלאה.',
  'calendar.hold.none': 'לא מושהה',

  'calendar.hold.confirmTitle': 'להשהות את הפוסט הזה?',
  'calendar.hold.confirmBody':
    'הפוסט הזה יישאר איפה שהוא ולא יצא ב-{time}. תוכל להמשיך אותו בכל שלב לפני כן, או לבחור זמן חדש אם הזמן הזה כבר עבר.',
  'calendar.hold.confirmScope':
    'השהיה עוצרת את מה שעדיין לא קרה. כל מה שכבר פורסם בפלטפורמה נשאר מפורסם, וההשהיה לא מוחקת או עורכת אותו.',
  'calendar.hold.confirmNoteLabel': 'למה אתה משהה את זה? (אופציונלי)',
  'calendar.hold.confirmNoteHint': 'נשמר ברישום הביקורת עבור הצוות שלך. לא נשלח לאף פלטפורמה.',
  'calendar.hold.confirm': 'השהה את הפוסט הזה',
  'calendar.hold.cancel': 'השאר מתוזמן',

  'calendar.hold.resumeTitle': 'להמשיך את הפוסט הזה?',
  'calendar.hold.resumeBody': 'הוא יצא ב-{time}, באזור {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'הזמן הזה כבר עבר',
  'calendar.hold.resumeMissedBody':
    'הפוסט הזה היה אמור לצאת ב-{time} בזמן שהיה מושהה. בחר זמן חדש כדי שהוא לא יצא ברגע שתמשיך אותו.',
  'calendar.hold.resumeTimeLabel': 'זמן פרסום חדש',
  'calendar.hold.resumeConfirm': 'המשך',

  'calendar.hold.paused': 'מושהה. הוא לא יצא עד שתמשיך אותו.',
  'calendar.hold.resumed': 'הומשך. הוא יוצא ב-{time}.',

  'calendar.hold.blocked.published': 'הפוסט הזה כבר יצא. השהיה לא יכולה להחזיר אותו מהפלטפורמה.',
  'calendar.hold.blocked.inFlight':
    'הפוסט הזה נשלח ממש עכשיו. מאוחר מדי להשהות אותו, ועצירה באמצע עלולה להשאיר אותו מפורסם חלקית.',
  'calendar.hold.blocked.finished': 'הפוסט הזה כבר הסתיים, אז אין מה להשהות.',
  'calendar.hold.blocked.billing':
    'הפוסט הזה בהשהיה כי סביבת העבודה איבדה גישה מלאה. המשך הוא עניין של חיוב, לא של תזמון.',
  'calendar.hold.blocked.billingAction': 'עבור לחיוב',

  'set.title': 'ערכות פרסום',
  'set.lede':
    'תשובה שמורה לשאלה "למי אני מפרסם את זה, ואיך". החלת ערכה מעתיקה את ההגדרות שלה לטיוטה חדשה.',
  'set.appliedOnce':
    'ערכה נקראת פעם אחת, כשאתה מחיל אותה. עריכתה מאוחר יותר משנה את נקודת ההתחלה של הפוסט הבא. טיוטות ופוסטים מתוזמנים שכבר יצרת ממנה נשארים בדיוק כפי שהם.',
  'set.empty.title': 'עדיין אין ערכות',
  'set.empty.body': 'צור אחת כדי להפסיק לבנות מחדש את אותה רשימת חשבונות לכל פוסט.',
  'set.create': 'ערכה חדשה',
  'set.edit': 'ערוך ערכה',
  'set.archive': 'העבר ערכה לארכיון',
  'set.archived': 'בארכיון',
  'set.archivedNote': 'ערכות בארכיון מוסתרות מהבורר. פוסטים שנוצרו מהן לא משתנים.',
  'set.showArchived': 'הצג ארכיון',
  'set.saved': 'הערכה נשמרה.',
  'set.archivedToast': 'הערכה הועברה לארכיון. פוסטים שכבר נוצרו ממנה לא משתנים.',

  'set.field.name': 'שם',
  'set.field.nameHint': 'מה שתחפש בבורר. אחד לכל פרויקט.',
  'set.field.description': 'תיאור',
  'set.field.descriptionHint': 'אופציונלי. למה הערכה הזו מיועדת.',
  'set.field.targets': 'חשבונות',
  'set.field.targetsHint': 'כל חשבון שפוסט שנוצר מהערכה הזו מתחיל איתו.',
  'set.field.targetCount': '{count, plural, =0 {אין חשבונות} one {# חשבון} other {# חשבונות}}',
  'set.field.signature': 'חתימה',
  'set.field.signatureNone': 'ללא חתימה',
  'set.field.approval': 'אישור',
  'set.field.approvalHint': 'האישור שפוסט שנוצר מהערכה הזו צריך לפני שהוא יכול להתפרסם.',
  'set.field.schedule': 'מתי לפרסם',

  'set.approval.none': 'לא נדרש אישור',
  'set.approval.single_approver': 'מאשר אחד בשם',
  'set.approval.any_approver': 'כל מאשר',
  'set.approval.named_approver': 'מאשר ספציפי',
  'set.approval.policy_auto': 'מה שמדיניות סביבת העבודה אומרת',

  'set.slot.next_free_slot': 'החריץ הפנוי הבא מהתור',
  'set.slot.next_free_slotHint':
    'משתמש בכללי התור של הפרויקט הזה כדי להציע זמן. הוא מציע; אתה מאשר.',
  'set.slot.pick_time': 'בקש ממני זמן',
  'set.slot.pick_timeHint': 'החלת הערכה משאירה את הזמן ריק כדי שתבחר.',
  'set.slot.draft_only': 'השאר כטיוטה',
  'set.slot.draft_onlyHint': 'החלת הערכה לא נוגעת בלוח הזמנים בכלל.',
  'set.slot.noRules':
    'לפרויקט הזה עדיין אין כללי תור, אז התור יציע את השעה הפנויה הראשונה ויגיד זאת.',
  'set.slot.rulesLink': 'כללי תור',

  'set.defaults.title': 'ברירות מחדל לכל פלטפורמה',
  'set.defaults.body': 'ערכי התחלה שמועתקים לכל פוסט חדש. תוכל לשנות כל אחד מהם אחר כך בעורך.',
  'set.defaults.add': 'הוסף פלטפורמה',
  'set.defaults.remove': 'הסר ברירות מחדל עבור {platform}',
  'set.defaults.privacy': 'פרטיות',
  'set.defaults.privacyNone': 'ברירת מחדל של הפלטפורמה',
  'set.defaults.bodyPrefix': 'טקסט לפני הפוסט',
  'set.defaults.bodySuffix': 'טקסט אחרי הפוסט',
  'set.defaults.requireAltText': 'דרוש טקסט חלופי בכל תמונה',
  'set.defaults.requireAltTextHint':
    'פוסט שנוצר מהערכה הזו לא יכול להיות מתוזמן לפלטפורמה הזו עד שלכל תמונה יש טקסט חלופי.',
  'set.defaults.empty': 'אין ברירות מחדל לפלטפורמות. כל חשבון מתחיל מהפוסט הראשי.',

  'set.error.nameTaken': 'ערכה אחרת בפרויקט הזה כבר משתמשת בשם הזה.',
  'set.error.archived': 'הערכה הזו בארכיון. שחזר אותה לפני העריכה.',
  'set.error.duplicateTarget': 'החשבון הזה כבר בערכה הזו.',
  'set.error.duplicatePlatform': 'לערכה הזו כבר יש ברירות מחדל לפלטפורמה הזו.',

  'targetMemory.setting.title': 'זכור חשבונות בין פוסטים',
  'targetMemory.setting.body':
    'כשזה מופעל, העורך מתחיל כל פוסט חדש עם החשבונות שהאדם הזה בחר בפעם הקודמת בפרויקט הזה. זה כבוי אלא אם תפעיל אותו.',
  'targetMemory.setting.stored':
    'רק רשימת החשבונות נשמרת, ורק עבור האדם שבחר אותם. שום כיתוב, זמן, הגדרת פרטיות או מצב אישור לא נשמרים, ואף אחד אחר בפרויקט לא יכול לראות את הרשימה שלך.',
  'targetMemory.setting.offNote': 'כל עוד זה כבוי, שום דבר לא נשמר בכלל.',
  'targetMemory.setting.turnOffWarning': 'כיבוי זה מוחק כל בחירה שמורה בפרויקט הזה, עבור כולם.',
  'targetMemory.setting.enabled': 'פועל',
  'targetMemory.setting.disabled': 'כבוי',
  'targetMemory.setting.saved': 'ההגדרה נשמרה.',
  'targetMemory.setting.cleared': 'ההגדרה נשמרה. בחירות שמורות בפרויקט הזה נמחקו.',

  'targetMemory.composer.restored':
    '{count, plural, one {התחיל עם # חשבון מהפעם הקודמת.} other {התחיל עם # חשבונות מהפעם הקודמת.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {# חשבון שהשתמשת בו בפעם הקודמת הושמט כי הוא דורש תשומת לב.} other {# חשבונות שהשתמשת בהם בפעם הקודמת הושמטו כי הם דורשים תשומת לב.}}',
  'targetMemory.composer.droppedAll':
    'אף אחד מהחשבונות שהשתמשת בהם בפעם הקודמת לא זמין כרגע, אז שום דבר לא נבחר מראש.',
  'targetMemory.composer.undo': 'נקה בחירה',
  'targetMemory.composer.forget': 'הפסק לזכור את החשבונות שלי',
  'targetMemory.composer.forgotten': 'הבחירה השמורה שלך נמחקה.',
  'targetMemory.composer.reviewAccounts': 'סקור חשבונות',
});
