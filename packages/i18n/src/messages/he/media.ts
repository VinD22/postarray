import { withHebrewPluralForms } from './catalog-helpers';

/**
 * Media derivatives: the non-generative editor and the refusals it can hit.
 * See `en/media.ts` for the vocabulary rule this file follows: never
 * "generate", "enhance", "upscale", "restore" or "fix", only "version".
 */
export const mediaMessages = withHebrewPluralForms({
  'mediaLib.derivative.heading': 'ערוך את התמונה הזו',
  'mediaLib.derivative.description':
    'חתוך, סובב, שנה גודל, שנה פורמט או דחוס. כל שינוי פועל על הפיקסלים שכבר קיימים בקובץ שלך. שום דבר שלא היה שם לא נוסף.',
  'mediaLib.derivative.originalKept':
    'המקור אף פעם לא מוחלף. כל עריכה נשמרת כגרסה נפרדת שאפשר לבחור בזמן היצירה.',
  'mediaLib.derivative.apply': 'שמור את הגרסה הזו',
  'mediaLib.derivative.applying': 'שומר את הגרסה הזו',
  'mediaLib.derivative.discard': 'בטל שינויים',
  'mediaLib.derivative.noChanges': 'עדיין אין מה לשמור. שנה ערך למעלה.',

  'mediaLib.derivative.tab.crop': 'חיתוך',
  'mediaLib.derivative.tab.transform': 'סיבוב ושינוי גודל',
  'mediaLib.derivative.tab.output': 'פורמט',

  'mediaLib.derivative.cropHint':
    'הקלד את המספרים, או השתמש במקשי החצים בכל שדה. אין כאן שום שלב שדורש עכבר.',
  'mediaLib.derivative.cropX': 'קצה שמאלי, בפיקסלים',
  'mediaLib.derivative.cropY': 'קצה עליון, בפיקסלים',
  'mediaLib.derivative.cropWidth': 'רוחב החיתוך, בפיקסלים',
  'mediaLib.derivative.cropHeight': 'גובה החיתוך, בפיקסלים',
  'mediaLib.derivative.rotate': 'סובב',
  'mediaLib.derivative.rotateNone': 'ללא סיבוב',
  'mediaLib.derivative.rotateDegrees': '{degrees} מעלות בכיוון השעון',
  'mediaLib.derivative.resizeWidth': 'רוחב חדש, בפיקסלים',
  'mediaLib.derivative.resizeHeight': 'גובה חדש, בפיקסלים',
  'mediaLib.derivative.lockRatio': 'שמור על הצורה כשאני משנה צד אחד',
  'mediaLib.derivative.format': 'שמור בתור',
  'mediaLib.derivative.formatSame': 'שמור על הפורמט הנוכחי',
  'mediaLib.derivative.quality': 'איכות',
  'mediaLib.derivative.qualityHint':
    'איכות נמוכה יותר יוצרת קובץ קטן יותר. חל על JPEG ו-WebP. PNG חסר אובדן ומתעלם מזה.',
  'mediaLib.derivative.projected': 'הגרסה הזו תהיה בגודל {width} על {height} פיקסלים.',
  'mediaLib.derivative.projectedUnavailable': 'הגודל של הגרסה הזו לא זמין עד שהיא נוצרת.',

  'mediaLib.derivative.listHeading': 'גרסאות',
  'mediaLib.derivative.original': 'מקור',
  'mediaLib.derivative.originalHint': 'תמיד נשמר. אף פעם לא נכתב מחדש.',
  'mediaLib.derivative.item': '{width} על {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'עדיין אין גרסאות ערוכות. המקור הוא הקובץ היחיד כאן.',
  'mediaLib.derivative.select': 'השתמש בגרסה הזו',
  'mediaLib.derivative.selected': 'בשימוש עבור הפוסט הזה',
  'mediaLib.derivative.useOriginal': 'השתמש במקור',
  'mediaLib.derivative.processing': 'הגרסה הזו נוצרת כרגע. היא תופיע כאן כשתהיה מוכנה.',
  'mediaLib.derivative.alreadyExists':
    'כבר עשית את העריכה המדויקת הזו בעבר, אז השתמשנו שוב בגרסה הזו במקום ליצור גרסה שנייה.',
  'mediaLib.derivative.failedTitle': 'לא ניתן היה ליצור את הגרסה הזו',
  'mediaLib.derivative.failedBody': 'שום דבר לא נשמר והמקור שלך לא נגע בו. שנה את הערכים ונסה שוב.',
  'mediaLib.derivative.openEditor': 'ערוך את {name}',

  'mediaLib.derivative.unsupportedTitle': 'עריכה פועלת רק על תמונות',
  'mediaLib.derivative.unsupportedBody':
    'וידאו, אודיו ומסמכים לא ניתן לערוך כאן. הכן את הקובץ לפני שאתה מעלה אותו. ההעלאה המקורית שלך אף פעם לא משתנה בכל מקרה.',

  'mediaLib.derivative.nonGenerative':
    'Relay לא יוצר תמונות או וידאו. העורך הזה רק חותך, מסובב, משנה גודל, ממיר ודוחס את מה שהעלית.',

  'error.media_derivative_no_operations.message': 'בחר לפחות שינוי אחד לפני שמירת גרסה.',
  'error.media_derivative_duplicate_operation.message':
    'כל סוג שינוי יכול להופיע פעם אחת. הסר את ה-{operation} השני.',
  'error.media_derivative_crop_out_of_bounds.message':
    'החיתוך הזה חורג מקצה התמונה, שגודלה {sourceWidth} על {sourceHeight} פיקסלים. הזז אותו או הקטן אותו.',
  'error.media_derivative_upscale_rejected.message':
    'העורך הזה אף פעם לא מגדיל תמונה, כי הפיקסלים הנוספים היו מומצאים ולא שלך. הגודל המקסימלי שהגרסה הזו יכולה להיות הוא {availableWidth} על {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'עריכה פועלת על תמונות JPEG, PNG, WebP ו-GIF. הקובץ הזה הוא {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'אנחנו עדיין לא יודעים את הגודל של התמונה הזו, אז לא ניתן לבדוק את השינוי מולה. נסה שוב כשהעיבוד יסתיים.',
  'error.media_derivative_format_required.message':
    'בחר פורמט לשמירה. קובץ {sourceMimeType} לא ניתן לשמור כאן חזרה בתור עצמו.',
  'error.media_derivative_quality_unsupported.message':
    'PNG חסר אובדן, אז הגדרת איכות לא תעשה כלום. הסר אותה, או שמור כ-JPEG או WebP.',
  'error.media_derivative_no_change.message': 'זה הפורמט שהקובץ הזה כבר משתמש בו.',
  'error.media_derivative_source_unavailable.message':
    'הקובץ שממנו הייתה אמורה לצאת הגרסה הזו כבר לא באחסון.',
  'error.media_derivative_preset_mismatch.message':
    'בקשת העריכה הזו לא תואמת לשינויים שהיא מתארת. שום דבר לא נוצר. נסה שוב מהעורך.',
  'error.media_derivative_empty_result.message':
    'העריכה לא הפיקה תמונה, אז שום דבר לא נשמר. המקור שלך לא נגע בו.',
  'error.media_derivative_transform_failed.message':
    'לא ניתן היה לקרוא או לכתוב את התמונה הזו. שום דבר לא נשמר והמקור שלך לא נגע בו.',
  'error.media_derivative_write_failed.message':
    'לא ניתן היה לרשום את הגרסה הזו. שום דבר לא נשמר והמקור שלך לא נגע בו.',
});
