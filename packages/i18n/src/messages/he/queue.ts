import { withHebrewPluralForms } from './catalog-helpers';

/**
 * Queue rules and slot reservations. See `en/queue.ts`: the `queue.reason.*`
 * keys are read back by a person and, years later, by an audit, so they
 * report exactly what happened, including the daylight-saving cases.
 */
export const queueMessages = withHebrewPluralForms({
  'queue.title': 'תור הפרסום',
  'queue.subtitle': 'מתי הפרויקט הזה מוכן לפרסם, ובאיזה מרווח. שום דבר לא מתפרסם בלי שאדם מאשר את הזמן.',

  'queue.rules.heading': 'כללי תור',
  'queue.rules.empty': 'עדיין אין כללי תור. עד שתוסיף אחד, החריץ הבא הוא פשוט השעה הפנויה הראשונה.',
  'queue.rules.create': 'כלל תור חדש',
  'queue.rules.count': '{count, plural, =0 {אין כללים} one {# כלל} other {# כללים}}',
  'queue.rules.enabled': 'בשימוש',
  'queue.rules.disabled': 'מושהה',
  'queue.rules.archived': 'בארכיון',
  'queue.rules.edit': 'ערוך כלל',
  'queue.rules.archive': 'העבר כלל לארכיון',
  'queue.rules.archiveHelp':
    'העברה לארכיון עוצרת הצעות עתידיות. חריצים ששמורים כבר שומרים על הזמן והסיבה שלהם.',

  'queue.field.name': 'שם הכלל',
  'queue.field.nameHelp': 'שם שתזהה מאוחר יותר, למשל בקרים בימי חול.',
  'queue.field.timeZone': 'אזור זמן',
  'queue.field.timeZoneHelp': 'חלונות, הספירה היומית ותאריכי חסימה כולם נקראים באזור הזה.',
  'queue.field.minimumGap': 'מרווח מינימלי',
  'queue.field.minimumGapHelp': 'דקות בין שני פוסטים. אפס פירושו שאין כלל מרווח.',
  'queue.field.maximumPerDay': 'מקסימום ליום',
  'queue.field.maximumPerDayHelp': 'השאר ריק כדי שלא תהיה מגבלה יומית. אפס פירושו שהכלל הזה לא מציע כלום.',
  'queue.field.maximumPerDayUnlimited': 'אין מגבלה יומית',
  'queue.field.priority': 'עדיפות',
  'queue.field.priorityHelp': 'הכלל בעדיפות הגבוהה ביותר שיכול להציע חריץ הוא זה שבשימוש.',
  'queue.field.enabled': 'השתמש בכלל הזה',

  'queue.windows.heading': 'חלונות שבועיים',
  'queue.windows.help':
    'בחר את השעות המקומיות שבהן הפרויקט הזה יכול לפרסם. השתמש בשדות היום והשעה, או בכפתורים ברשת.',
  'queue.windows.empty': 'עדיין אין חלונות. כלל בלי חלון לעולם לא יכול להציע חריץ.',
  'queue.windows.add': 'הוסף חלון',
  'queue.windows.remove': 'הסר חלון',
  'queue.windows.entry': '{weekday}, מ-{start} עד {end}',
  'queue.windows.start': 'מ',
  'queue.windows.end': 'עד',
  'queue.windows.weekday': 'יום',
  'queue.windows.toggleCell': '{weekday} בשעה {hour}',
  'queue.windows.gridLabel': 'זמינות שבועית, כפתור אחד לכל יום ושעה',

  'queue.weekday.1': 'יום שני',
  'queue.weekday.2': 'יום שלישי',
  'queue.weekday.3': 'יום רביעי',
  'queue.weekday.4': 'יום חמישי',
  'queue.weekday.5': 'יום שישי',
  'queue.weekday.6': 'שבת',
  'queue.weekday.7': 'יום ראשון',

  'queue.blackouts.heading': 'תאריכי חסימה',
  'queue.blackouts.help': 'תאריכים שבהם הפרויקט הזה לא יפרסם, נקראים באזור הזמן של הכלל.',
  'queue.blackouts.empty': 'אין תאריכי חסימה.',
  'queue.blackouts.add': 'הוסף חסימה',
  'queue.blackouts.remove': 'הסר חסימה',
  'queue.blackouts.from': 'היום הראשון',
  'queue.blackouts.to': 'היום האחרון',
  'queue.blackouts.entry': '{from} עד {to}',

  'queue.connections.heading': 'חשבונות',
  'queue.connections.all': 'כל חשבון בפרויקט הזה',
  'queue.connections.scoped': '{count, plural, one {# חשבון} other {# חשבונות}} שהכלל הזה חל עליהם',

  'queue.slot.heading': 'החריץ הבא בתור',
  'queue.slot.action': 'השתמש בחריץ הבא בתור',
  'queue.slot.proposed': '{local} באזור {timeZone}',
  'queue.slot.utc': 'זה {utc} ב-UTC.',
  'queue.slot.why': 'למה הזמן הזה',
  'queue.slot.accept': 'השתמש בזמן הזה',
  'queue.slot.release': 'בחר זמן אחר',
  'queue.slot.expires': 'ההצעה הזו נשמרת עד {expires}.',
  'queue.slot.unavailable': 'חריץ בתור לא זמין כרגע.',
  'queue.slot.pending': 'מחפש את החריץ הבא.',
  'queue.slot.accepted': 'מתוזמן ל-{local} באזור {timeZone}.',
  'queue.slot.notAutomatic': 'שום דבר לא מתוזמן עד שתבחר את הזמן הזה.',

  'queue.reason.noRulesConfigured': 'לפרויקט הזה אין כללי תור מוגדרים, אז לא הוחל שום חלון.',
  'queue.reason.fallbackFirstFreeHour': 'השעה הפנויה הראשונה מעכשיו שימשה במקום זאת.',
  'queue.reason.matchedRule': 'הכלל {name} בחר את הזמן הזה, באזור {zone}.',
  'queue.reason.matchedWindow': 'הוא נופל בחלון מ-{start} עד {end} באזור {zone}.',
  'queue.reason.minimumGap': 'הוא במרחק של לפחות {minutes} דקות מכל פוסט אחר.',
  'queue.reason.noMinimumGap': 'הכלל הזה לא קובע מרווח מינימלי בין פוסטים.',
  'queue.reason.dailyCap': 'היום הזה מכיל לכל היותר {limit} פוסטים, והוא עוד לא מלא.',
  'queue.reason.dailyCapUnlimited': 'הכלל הזה לא קובע מגבלה יומית.',
  'queue.reason.blackoutSkipped': '{days, plural, one {# יום חסימה} other {# ימי חסימה}} דולגו כדי להגיע אליו.',
  'queue.reason.dstNonexistentSkipped':
    'הזמן הראשון בחלון לא קיים בתאריך הזה באזור {zone}, אז נעשה שימוש בזמן הבא שכן קיים.',
  'queue.reason.dstAmbiguousFirst':
    'הזמן המקומי הזה קורה פעמיים באזור {zone} בתאריך הזה. נעשה שימוש במופע הראשון.',
  'queue.reason.priorityChosen': 'לכלל הזה יש עדיפות {priority}, הגבוהה ביותר שיכלה להציע.',
  'queue.reason.connectionScoped': 'הכלל הזה מכסה {count, plural, one {# חשבון} other {# חשבונות}}.',
  'queue.reason.horizonExhausted': 'לא נמצא חלון פנוי בתוך {days} ימים.',
});
