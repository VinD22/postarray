import { withHebrewPluralForms } from './catalog-helpers';

/**
 * The per platform scheduler pages. Only the `web.schedule.*`,
 * `web.meta.schedule.*` and `web.meta.schedulePlatform.*` keys are
 * translated here; the `/specs` cluster (`web.specs.*`, `web.meta.specs.*`,
 * `web.meta.specsPlatform.*`) in `en/web-platforms.ts` is out of this
 * locale's current coverage and falls back to English. See `en/web-platforms.ts`
 * for the rule this file follows: no string here may name a platform, a
 * character ceiling, a file size or a capability; those come only from the
 * generated dataset the page reads.
 */
export const webPlatformsMessages = withHebrewPluralForms({
  'web.meta.schedule.title': 'תזמון, פלטפורמה אחר פלטפורמה',
  'web.meta.schedule.description':
    'מה כל פלטפורמה בקבוצת ההשקה דורשת מחשבון מחובר, המגבלות שה-API הרשמי שלה אוכף, ועד כמה המוצר הזה התקדם מולן.',
  'web.meta.schedulePlatform.title': 'תזמון עבור {platform}',
  'web.meta.schedulePlatform.description':
    '{platform} דורשת מחשבון מחובר, המגבלות שה-API הרשמי שלה אוכף, ואילו חלקים מזה המוצר הזה בנה.',

  'web.schedule.index.title': 'תזמון, פלטפורמה אחר פלטפורמה',
  'web.schedule.index.lede':
    'דף אחד לכל פלטפורמה בקבוצת ההשקה. כל דף קובע מה הפלטפורמה מבקשת מחשבון מחובר, המגבלות שה-API הרשמי שלה אוכף, והיכן הבנייה עומדת. כל מספר נושא את המסמך שממנו הוא הגיע ואת התאריך שבו מישהו קרא אותו.',
  'web.schedule.index.listLabel': 'פלטפורמות בקבוצת ההשקה',
  'web.schedule.index.cohortNote':
    'הקבוצה היא סט הפלטפורמות שהמוצר הזה נבנה עבורן. זו תוכנית, לא רשימת זמינות.',
  'web.schedule.index.limitsKnown': 'מגבלות תועדו',
  'web.schedule.index.limitsUnknown': 'מגבלות עדיין לא תועדו',

  'web.schedule.platform.title': 'תזמון עבור {platform}',
  'web.schedule.platform.lede':
    'מה {platform} מבקשת מחשבון מחובר, המגבלות שה-API הרשמי שלה אוכף, ואילו מהן המוצר הזה בנה עד כה.',

  'web.schedule.notice.title': 'שום דבר עדיין לא מתפרסם ב-{platform}',
  'web.schedule.notice.body':
    'אף מחבר לא עבר את הגדרת המוכנות שלו, ואף אחד לא מאומת בסביבת הייצור. הדף הזה מתאר מה הפלטפורמה דורשת ומה המוצר הזה מתכוון לתמוך בו. הוא לא מתאר מתזמן פעיל.',

  'web.schedule.requirements.title': 'מה {platform} דורשת',
  'web.schedule.requirements.accountTypes': 'סוג חשבון',
  'web.schedule.requirements.restriction': 'הגבלת פלטפורמה',
  'web.schedule.requirements.cost': 'עלות API',
  'web.schedule.requirements.unavailable.title': 'עדיין אין רשומת מחבר שנבדקה',
  'web.schedule.requirements.unavailable.body':
    'הפלטפורמה הזו הצטרפה לקבוצה אחרי סבב המחקר האחרון על מחברים, אז אין רשומה מתוארכת של דרישות החשבון שלה להציג. היא תופיע כאן ברגע שמישהו יקרא את התיעוד הרשמי ויתעד אותו.',
  'web.schedule.requirements.apiSource': 'תיעוד API רשמי',
  'web.schedule.requirements.policySource': 'מדיניות הפלטפורמה',

  'web.schedule.limits.title': 'מגבלות ש-{platform} אוכפת',
  'web.schedule.limits.lede':
    'נקרא עבור חשבון שזה עתה חובר ללא כשירות מוגברת. פלטפורמה יכולה להעלות או להוריד כל אחת מהמגבלות האלה בלי להודיע לאף אחד, ולכן כל סט נושא את התאריך שבו הוא נקרא.',
  'web.schedule.limits.unavailable.title': 'מגבלות לא תועדו עבור {platform}',
  'web.schedule.limits.unavailable.body':
    'בגרסה הזו אין מתאם לפלטפורמה הזו, אז אין תקרה מתועדת להציג. מספר מומצא היה גרוע יותר מכלום.',
  'web.schedule.limits.sourceLabel': 'תיעוד רשמי של הפלטפורמה',

  'web.schedule.limits.text': 'טקסט גוף ההודעה',
  'web.schedule.limits.title_field': 'שדה כותרת',
  'web.schedule.limits.countingUnit': 'איך תווים נספרים',
  'web.schedule.limits.links': 'איך קישורים נספרים',
  'web.schedule.limits.images': 'תמונות לכל פוסט',
  'web.schedule.limits.videos': 'סרטונים לכל פוסט',
  'web.schedule.limits.videoDuration': 'אורך וידאו',
  'web.schedule.limits.imageBytes': 'התמונה הגדולה ביותר',
  'web.schedule.limits.gifBytes': 'התמונה המונפשת הגדולה ביותר',
  'web.schedule.limits.videoBytes': 'הווידאו הגדול ביותר',
  'web.schedule.limits.documentBytes': 'המסמך הגדול ביותר',
  'web.schedule.limits.altText': 'טקסט חלופי',
  'web.schedule.limits.mimeTypes': 'סוגי קבצים מתקבלים',
  'web.schedule.limits.markdown': 'סימני עיצוב',

  'web.schedule.value.characters': '{count, plural, one {# תו} other {# תווים}}',
  'web.schedule.value.files': '{count, plural, =0 {אין} one {# קובץ} other {# קבצים}}',
  'web.schedule.value.durationRange': 'בין {min} ל-{max}',
  'web.schedule.value.durationMax': 'עד {max}',
  'web.schedule.value.markdownYes': 'מתקבל',
  'web.schedule.value.markdownNo': 'מתפרסם כתווים רגילים',

  'web.schedule.unit.utf16': 'לפי יחידת קוד UTF-16, וזה מה שרוב העורכים מדווחים כספירת תווים.',
  'web.schedule.unit.grapheme': 'לפי גרפמה, כך שאמוג׳י שמורכב מכמה נקודות קוד עדיין עולה תו אחד.',
  'web.schedule.unit.weighted':
    'לפי שיטה משוקללת שבה רוב התווים שאינם לטיניים עולים שניים במקום אחד.',

  'web.schedule.link.none': 'קישורים לא נספרים כנגד התקרה.',
  'web.schedule.link.actual': 'קישור עולה בדיוק את התווים שהוא תופס.',
  'web.schedule.link.fixed':
    'כל קישור נכתב מחדש לקיצור של הפלטפורמה ועולה {count, plural, one {# תו} other {# תווים}} ללא קשר לאורכו האמיתי.',

  'web.schedule.capabilities.title': 'מה נבנה עבור {platform}',
  'web.schedule.capabilities.lede':
    '"לא מוצע על ידי הפלטפורמה" היא עובדה על הפלטפורמה, והיא סופית. "עדיין לא נבנה" היא עובדה על המוצר הזה וברירת המחדל הכנה כל עוד אף מחבר לא עבר את הגדרת המוכנות שלו. זה נוצר ממרשם המחברים, לא נכתב כאן ביד.',
  'web.schedule.capabilities.unavailable.title': 'עדיין אין רשומת יכולת עבור {platform}',
  'web.schedule.capabilities.unavailable.body':
    'אין מתאם בגרסה הזו, אז למרשם אין מה לדווח. השורה תופיע במטריצת היכולות ברגע שיהיה משהו אמיתי לומר.',
  'web.schedule.capabilities.matrixLink': 'קרא את מטריצת היכולות המלאה',

  'web.schedule.next.title': 'לאן ללכת הלאה',
  'web.schedule.next.body':
    'מטריצת היכולות נושאת כל פלטפורמה וכל יכולת בטבלה אחת. דפי תרחישי השימוש מתארים את תהליכי העבודה שסביבם המוצר הזה נבנה.',
});
