import { withHebrewPluralForms } from './catalog-helpers';

/**
 * Bulk CSV import. See `en/import.ts`: this says drafts wherever drafts are
 * what happens, and schedule only on the step where a person chooses it.
 */
export const importMessages = withHebrewPluralForms({
  'import.title': 'ייבוא פוסטים מקובץ CSV',
  'import.subtitle':
    'העלה גיליון אלקטרוני, קרא מה הוא יעשה, ואז החלט. ההעלאה בודקת את הקובץ. היא לא יוצרת כלום.',

  'import.step.upload': 'העלאה',
  'import.step.columns': 'עמודות',
  'import.step.review': 'סקירה',
  'import.step.apply': 'החלה',
  'import.step.results': 'תוצאות',
  'import.step.position': 'שלב {current} מתוך {total}',

  'import.upload.heading': 'בחר קובץ CSV',
  'import.upload.help':
    'CSV בלבד. קבצי גיליון אלקטרוני כמו .xlsx לא נקראים. ייצא את הגיליון שלך כ-CSV קודם.',
  'import.upload.field': 'קובץ CSV',
  'import.upload.fieldHelp': 'בחר קובץ, או הדבק את השורות בתיבה למטה.',
  'import.upload.paste': 'או הדבק טקסט CSV',
  'import.upload.pasteHelp': 'כלול את שורת הכותרת. הכול נבדק לפני שנוצר משהו.',
  'import.upload.project': 'פרויקט',
  'import.upload.projectHelp': 'כל שורה בקובץ אחד שייכת לפרויקט הזה.',
  'import.upload.submit': 'בדוק את הקובץ הזה',
  'import.upload.submitting': 'קורא את הקובץ',
  'import.upload.allowPast': 'אפשר זמנים שכבר עברו',
  'import.upload.allowPastHelp':
    'כבוי כברירת מחדל. שורה עם תאריך בעבר מדווחת כדי שתוכל לתקן אותה, במקום שהיא תוזז בשבילך.',
  'import.upload.tooLarge': 'הקובץ הזה גדול מ-{limit} תווים. פצל אותו ונסה שוב.',
  'import.upload.duplicate':
    'זה אותו קובץ שהעלית קודם, אז אתה מסתכל על הייבוא ההוא ולא על עותק שני שלו.',

  'import.template.heading': 'מה המשמעות של העמודות',
  'import.template.download': 'הורד תבנית CSV',
  'import.template.required': 'עמודות חובה',
  'import.template.optional': 'עמודות אופציונליות',
  'import.column.external_row_id': 'המזהה שלך לשורה. הוא חייב להיות ייחודי בתוך הקובץ.',
  'import.column.project': 'שם או מזהה הפרויקט שאליו שייכת השורה.',
  'import.column.targets': 'או set: ואחריו מזהה ערכת יעד, או מזהי חשבונות מופרדים בקו אנכי.',
  'import.column.caption': 'טקסט הפוסט.',
  'import.column.scheduled_local_time': 'תאריך ושעה מקומיים, כתובים כמו 2026-09-01T10:00.',
  'import.column.time_zone': 'אזור ה-IANA שבו הזמן המקומי נקרא, למשל Europe/Berlin.',
  'import.column.media':
    'מזהה מדיה, sha256: ואחריו סכום הביקורת של מדיה שכבר יש לך, או כתובת https שהשרת יביא ממנה.',
  'import.column.title': 'כותרת, במקום שבו היעד משתמש באחת.',
  'import.column.destination': 'העמוד, הלוח או הערוץ בתוך החשבון.',
  'import.column.privacy': 'ערך הפרטיות שהיעד מצפה לו.',
  'import.column.first_comment': 'טקסט שמתפרסם כתגובה הראשונה אחרי הפוסט.',
  'import.column.approval_policy': 'מדיניות האישור שתצורף לכל טיוטה.',
  'import.column.perPlatform':
    'עמודת caption_ או title_ בשם של פלטפורמה עוקפת רק את הפלטפורמה הזו, למשל caption_instagram.',

  'import.columns.heading': 'בדיקת עמודות',
  'import.columns.ok': 'כל עמודת חובה קיימת.',
  'import.columns.missing': '{count, plural, one {חסרה # עמודת חובה} other {חסרות # עמודות חובה}}',
  'import.columns.unknown':
    '{count, plural, one {עמודה # לא זוהתה ומתעלמים ממנה} other {# עמודות לא זוהו ומתעלמים מהן}}',
  'import.columns.present': 'עמודות שנמצאו',

  'import.review.heading': 'מה הקובץ הזה יעשה',
  'import.review.counts':
    '{valid, plural, =0 {אין שורות מוכנות} one {שורה # מוכנה} other {# שורות מוכנות}}, {invalid, plural, =0 {אף אחת לא דורשת תשומת לב} one {# דורשת תשומת לב} other {# דורשות תשומת לב}}.',
  'import.review.empty': 'לא נקראה אף שורה מהקובץ הזה.',
  'import.review.rowsHeading': 'שורות',
  'import.review.filterAll': 'כל השורות',
  'import.review.filterValid': 'מוכנות',
  'import.review.filterInvalid': 'דורשות תשומת לב',
  'import.review.filterFailed': 'נכשלו',
  'import.review.downloadErrors': 'הורד את הבעיות כ-CSV',
  'import.review.parsedWith': 'נקרא עם המפענח {version}',

  'import.table.row': 'מזהה שורה',
  'import.table.line': 'שורה',
  'import.table.state': 'מצב',
  'import.table.caption': 'כיתוב',
  'import.table.time': 'מתוזמן',
  'import.table.problems': 'בעיות',
  'import.table.draft': 'טיוטה',
  'import.table.noProblems': 'אין',

  'import.state.pending': 'לא נבדק',
  'import.state.valid': 'מוכן',
  'import.state.invalid': 'דורש תשומת לב',
  'import.state.applied': 'טיוטה נוצרה',
  'import.state.skipped': 'כבר בוצע',
  'import.state.failed': 'נכשל',

  'import.job.state.uploaded': 'הועלה',
  'import.job.state.validating': 'בבדיקה',
  'import.job.state.validated': 'נבדק',
  'import.job.state.applying': 'מוחל',
  'import.job.state.applied': 'הוחל',
  'import.job.state.failed': 'לא ניתן היה לקרוא',

  'import.apply.heading': 'מה צריך לקרות לשורות המוכנות?',
  'import.apply.drafts': 'צור טיוטות',
  'import.apply.draftsHelp':
    'ברירת המחדל. כל שורה מוכנה הופכת לטיוטה שאתה יכול לפתוח, לערוך ולאשר. שום דבר לא מתוזמן.',
  'import.apply.scheduled': 'צור טיוטות ותזמן אותן',
  'import.apply.scheduledHelp':
    'כל שורה מוכנה הופכת לטיוטה ולוקחת את הזמן הכתוב בקובץ. בחר את זה רק אם הזמנים נכונים.',
  'import.apply.confirm': 'החל {count, plural, one {שורה #} other {# שורות}}',
  'import.apply.confirmScheduled': 'צור ותזמן {count, plural, one {שורה #} other {# שורות}}',
  'import.apply.running': 'מחיל שורות',
  'import.apply.safeToRepeat': 'להחיל פעמיים בטוח. שורה שכבר יצרה טיוטה נשארת ללא שינוי.',

  'import.results.heading': 'תוצאות',
  'import.results.applied': '{count, plural, one {טיוטה # נוצרה} other {# טיוטות נוצרו}}',
  'import.results.skipped': '{count, plural, one {שורה # כבר בוצעה} other {# שורות כבר בוצעו}}',
  'import.results.failed': '{count, plural, one {שורה # נכשלה} other {# שורות נכשלו}}',
  'import.results.retry': 'החל את השורות הנותרות שוב',
  'import.results.openDrafts': 'פתח את הטיוטות',
  'import.results.unavailable': 'לא זמין',

  'import.history.heading': 'ייבואים קודמים',
  'import.history.empty': 'עדיין אין ייבואים.',
  'import.history.open': 'פתח',

  'import.a11y.rowsTable': 'שורות המניפסט והבעיות שלהן',
  'import.a11y.stepList': 'שלבי ייבוא',
  'import.a11y.uploadedFile': 'קובץ נבחר: {filename}',

  'import.error.emptyFile': 'לקובץ הזה אין שורות.',
  'import.error.missingColumn': 'העמודה {column} חסרה.',
  'import.error.unknownColumn': 'העמודה {column} לא זוהתה, אז מתעלמים ממנה.',
  'import.error.duplicateRowId': 'מזהה השורה {value} משמש יותר מפעם אחת בקובץ הזה.',
  'import.error.required': 'התא הזה לא יכול להיות ריק.',
  'import.error.invalidCell': 'התא הזה לא בצורה שאנחנו יכולים לקרוא.',
  'import.error.rowShape': 'לשורה הזו יש {actual} תאים אבל לכותרת יש {expected}.',
  'import.error.invalidLocalTime': 'הזמן {value} אינו תאריך ושעה מקומיים כמו 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'האזור {value} אינו שם אזור זמן IANA.',
  'import.error.nonexistentLocalTime': 'הזמן {value} לא קיים ב-{zone}. השעונים מדלגים מעליו.',
  'import.error.ambiguousLocalTime': 'הזמן {value} קורה פעמיים ב-{zone} באותו יום. בחר זמן אחר.',
  'import.error.scheduleInPast': 'הזמן {value} ב-{zone} כבר עבר.',
  'import.error.invalidTargets': 'הערך {value} אינו ערכת יעד שמורה או רשימת מזהי חשבונות.',
  'import.error.invalidMedia': 'הערך {value} אינו מזהה מדיה, סכום ביקורת sha256 או כתובת https.',
  'import.error.mediaNotFound': 'אין מדיה בסביבת העבודה הזו התואמת ל-{value}.',
  'import.error.mediaImportStarted':
    'המדיה ב-{value} נמשכת כרגע. החל את הקובץ הזה שוב ברגע שהיא בספרייה.',
  'import.error.unknownVariantTarget':
    'לשורה הזו אין חשבון {provider}, אז הכיתוב של {provider} לא נעשה בו שימוש.',
  'import.error.applyFailed': 'לא ניתן היה להחיל את השורה הזו. הפניה: {code}.',
  'import.error.alreadyApplied': 'השורה הזו כבר יצרה טיוטה, אז היא נשארה ללא שינוי.',
  'import.error.tooManyRows': 'רק {limit} השורות הראשונות של קובץ נקראות.',
});
