/** Thai beta translations for the weekly digest and its email. */
export const digestMessages = {
  'digest.title': 'สัปดาห์นี้',
  'digest.subtitle': 'สิ่งที่เรามองเห็นได้ตั้งแต่ {windowStart} ถึง {windowEnd}',
  'digest.empty': 'ยังไม่มีอะไรให้สรุปสำหรับสัปดาห์นี้ เผยแพร่บางอย่างแล้วจะแสดงที่นี่',
  'digest.regenerate': 'สร้างสัปดาห์นี้ใหม่',
  'digest.generating': 'กำลังสร้างสรุปสัปดาห์นี้',
  'digest.source.deterministic': 'เขียนจากบันทึกการเผยแพร่และการวัดผลของคุณเอง โดยไม่ใช้ผู้ช่วยเขียน',
  'digest.source.ai': 'ผู้ช่วยเขียนจากบันทึกของคุณเอง ตัวเลขทุกตัวผ่านการตรวจสอบกับบันทึกเหล่านั้นแล้ว',
  'digest.unavailable.aiOff': 'ผู้ช่วยเขียนปิดอยู่ จึงแสดงเวอร์ชันปกติ ไม่มีข้อมูลใดหายไป',
  'digest.unavailable.rejected': 'เวอร์ชันจากผู้ช่วยไม่ตรงกับข้อมูลของคุณ จึงถูกทิ้ง และแสดงเวอร์ชันปกติแทน',
  'digest.headline.published':
    '{published, plural, =0 {ไม่มีโพสต์ที่เสร็จสมบูรณ์} one {โพสต์เสร็จสมบูรณ์ # โพสต์} other {โพสต์เสร็จสมบูรณ์ # โพสต์}} ระหว่าง {windowStart} ถึง {windowEnd}',
  'digest.headline.nothingPublished': 'ไม่มีการเผยแพร่ระหว่าง {windowStart} ถึง {windowEnd}',
  'digest.outcome.published':
    '{count, plural, one {โพสต์ # โพสต์เสร็จสมบูรณ์บน {provider}} other {โพสต์ # โพสต์เสร็จสมบูรณ์บน {provider}}}',
  'digest.outcome.partial':
    '{count, plural, one {โพสต์ # โพสต์ไปถึงปลายทางบางแห่งบน {provider} แต่ไม่ถึงปลายทางอื่น} other {โพสต์ # โพสต์ไปถึงปลายทางบางแห่งบน {provider} แต่ไม่ถึงปลายทางอื่น}}',
  'digest.outcome.failed':
    '{count, plural, one {โพสต์ # โพสต์ไม่สามารถเผยแพร่บน {provider}} other {โพสต์ # โพสต์ไม่สามารถเผยแพร่บน {provider}}}',
  'digest.metrics.noneYet': 'ยังไม่มีข้อมูลการวัดผลสำหรับสัปดาห์นี้ นั่นหมายความว่าเรายังไม่รู้ว่าโพสต์ทำผลงานอย่างไร ไม่ได้หมายความว่าผลงานแย่',
  'digest.freshness.statement':
    '{label, select, fresh {การวัดผลซิงค์ล่าสุดเมื่อ {lastObservedAt}} stale {การวัดผลไม่ได้ซิงค์ตั้งแต่ {lastObservedAt} ดังนั้นตัวเลขด้านบนอาจไม่เป็นปัจจุบัน} other {ยังไม่มีอะไรซิงค์ จึงยังไม่มีข้อมูลที่วัดได้ด้านบน}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'สิ่งที่ควรรู้: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'อีเมลสรุปรายสัปดาห์',
  'digest.settings.description': 'อีเมลสั้น ๆ ทุกสัปดาห์เกี่ยวกับสิ่งที่เผยแพร่และสิ่งที่เราวัดผลได้ เปิดใช้งานเป็นค่าเริ่มต้น',
  'digest.settings.enabled': 'ส่งสรุปรายสัปดาห์',
  'email.digest.subject': 'สัปดาห์ของคุณใน {workspaceName}',
  'email.digest.intro':
    'นี่คือสิ่งที่เราเห็นสำหรับ {workspaceName} ระหว่าง {windowStart} ถึง {windowEnd}',
  'email.digest.noData':
    'เราไม่สามารถวัดผลอะไรได้ในสัปดาห์นี้ เมื่อตัวเลขใดหายไป นั่นเป็นเพราะเราอ่านมันไม่ได้ ไม่ใช่เพราะมันเป็นศูนย์',
  'email.digest.footer':
    'คุณได้รับอีเมลนี้เพราะสรุปรายสัปดาห์เปิดใช้งานอยู่สำหรับ {workspaceName} ปิดการใช้งานได้ในการตั้งค่าพื้นที่ทำงาน',
} as const;
