import { withHebrewPluralForms } from './catalog-helpers';

export const validationMessages = withHebrewPluralForms({
  'validation.text_required.message': '{provider} צריך קצת טקסט עבור סוג הפוסט הזה.',
  'validation.text_too_long.message':
    '{over, plural, one {# תו מעבר למגבלה עבור {account}} other {# תווים מעבר למגבלה עבור {account}}}',
  'validation.text_too_long.hint': '{provider} מאפשר {limit} תווים עבור חשבון זה.',
  'validation.text_too_short.message': '{provider} צריך כאן לפחות {min} תווים.',
  'validation.title_required.message': '{provider} צריך כותרת.',
  'validation.title_too_long.message': 'הכותרת חורגת ממגבלת התווים {limit}.',
  'validation.description_too_long.message': 'התיאור חורג ממגבלת התווים {limit}.',
  'validation.media_required.message':
    '{provider} צריך לפחות תמונה או סרטון אחד עבור סוג הפוסט הזה.',
  'validation.media_count_exceeded.message':
    '{provider} מקבל לכל היותר {limit, plural, one {# file} other {# files}} כאן. לפוסט הזה יש {count}.',
  'validation.media_type_unsupported.message': '{provider} אינו מקבל קבצי {mimeType}.',
  'validation.media_aspect_ratio_unsupported.message':
    'הקובץ הזה הוא {actual}. {provider} צריך יחס בין {min} ל-{max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'חתוך אותו עם הפלטפורמה הקבועה מראש כדי לתקן זאת.',
  'validation.media_resolution_too_low.message':
    'הקובץ הזה הוא {actual}. {provider} צריך לפחות {required}.',
  'validation.media_duration_too_long.message':
    'הסרטון הזה הוא {actual}. {provider} מקבל עד {limit} עבור חשבון זה.',
  'validation.media_duration_too_short.message':
    'הסרטון הזה הוא {actual}. {provider} צריך לפחות {limit}.',
  'validation.media_file_too_large.message': 'הקובץ הזה הוא {actual}. {provider} מקבל עד {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} לא יכול לפרסם תמונות ווידאו באותו פוסט.',
  'validation.alt_text_missing.message':
    'חסר טקסט חלופי ב-{count, plural, one {# תמונה} other {# תמונות}}.',
  'validation.alt_text_missing.hint': 'תאר את התמונה, או סמן אותה כדקורטיבית.',
  'validation.thumbnail_unsupported.message':
    '{provider} אינו מקבל כאן תמונה ממוזערת מותאמת אישית.',
  'validation.destination_required.message': 'בחר היכן זה יפורסם ב-{provider}.',
  'validation.destination_unsupported.message':
    '{destination} אינו מקבל את סוג הפוסט הזה ב-{provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# אזכור לא הותאם לחשבון אמיתי} other {# אזכורים לא הותאמו לחשבונות אמיתיים}}.',
  'validation.mention_unresolved.hint':
    'בחר את החשבון מתוצאות החיפוש, או הסר את האזכור. טקסט רגיל לעולם אינו מפרסם כתג מקורי.',
  'validation.hashtag_count_exceeded.message':
    '{count} hashtags. {provider} סופר יותר מ{limit} כדואר זבל.',
  'validation.link_not_allowed.message': '{provider} אינו מאפשר קישורים בשדה זה.',
  'validation.link_destination_unverified.message':
    'תחום הקישור {domain} אינו מאומת עבור סביבת עבודה זו.',
  'validation.privacy_setting_required.message': '{provider} דורש בחירת פרטיות מפורשת לפני הפרסום.',
  'validation.privacy_setting_required.hint': 'אין ברירת מחדל. בחר מי יכול לראות את הפוסט הזה.',
  'validation.disclosure_required.message': 'פוסט זה זקוק לחשיפה במסגרת כללי המותג עבור {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} אינו תומך בהערה ראשונה מתוזמנת עבור חשבון זה.',
  'validation.thread_unsupported.message': '{provider} אינו תומך בשרשורים עבור חשבון זה.',
  'validation.repeat_end_required.message': 'פוסט חוזר צריך תאריך סיום או מספר חזרות.',
  'validation.schedule_in_past.message': 'הזמן הזה חלף ב-{timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'זה רחוק יותר מהמבט קדימה של {limit} שהוגדר עבור אישור זה.',
  'validation.schedule_outside_quiet_hours.message': 'זה נופל בשעות השקט שנקבעו עבור {brand}.',
  'validation.duplicate_within_window.message':
    'תוכן דומה מאוד כבר מתוזמן או פורסם עבור {account} בתוך {window}.',
  'validation.blocked_term_present.message': 'הטקסט מכיל מונח חסום עבור {brand}.',
  'validation.unsupported_claim.message': 'תביעה זו אינה בתביעות המאושרות עבור {brand}.',
  'validation.unsupported_claim.hint': 'הוסף אותו לטענות שאושרו עם ראיות, או ניסוח מחדש את המשפט.',
  'validation.cadence_exceeded.message':
    '{account} יפרסם את {count, plural, one {# time} other {# פעמים}} באותו יום, מעבר למגבלה של {limit}.',
  'validation.connection_paused.message': '{account} מושהה ולא יפורסם.',
  'validation.account_type_invalid.message':
    '{account} אינו סוג החשבון ש{provider} דורש עבור סוג הפוסט הזה.',
  'validation.severity.error': 'חייב לתקן',
  'validation.severity.warning': 'בדוק את זה',
  'validation.severity.info': 'לידיעתך',
  'validation.field.required': 'שדה זה חובה.',
  'validation.field.tooShort': 'השתמש לפחות ב-{min, plural, one {# תו} other {# תווים}}.',
  'validation.field.tooLong': 'השתמש לכל היותר {max, plural, one {# תו} other {# תווים}}.',
  'validation.field.invalidEmail': 'הזן כתובת אימייל חוקית.',
  'validation.field.invalidUrl': 'הזן כתובת URL מלאה, כולל https.',
  'validation.field.invalidDate': 'הזן תאריך חוקי.',
  'validation.field.invalidTime': 'הזן שעה חוקית.',
  'validation.field.invalidNumber': 'הזן מספר.',
  'validation.field.outOfRange': 'הזן ערך בין {min} ל-{max}.',
  'validation.field.mustMatch': 'שני הערכים הללו חייבים להתאים.',
  'validation.field.alreadyTaken': 'זה כבר בשימוש.',
  'validation.field.unsafeValue': 'הערך הזה אסור כאן.',
});
