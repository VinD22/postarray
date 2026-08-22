/**
 * Queue rules and slot reservations.
 *
 * The reason keys are the ones the slot finder emits. They are the sentences a
 * person reads before they accept a proposed time, and the sentences an audit
 * reads back years later, so they say what actually happened rather than
 * congratulating anyone.
 */
export const queueMessages = {
  'queue.title': 'คิวการโพสต์',
  'queue.subtitle':
    'เมื่อไรที่โปรเจกต์นี้พร้อมจะโพสต์ และห่างกันแค่ไหน ไม่มีอะไรถูกโพสต์โดยไม่มีคนยอมรับเวลานั้น',

  'queue.rules.heading': 'กฎของคิว',
  'queue.rules.empty':
    'ยังไม่มีกฎของคิว จนกว่าคุณจะเพิ่มกฎหนึ่งข้อ ช่วงเวลาถัดไปก็เป็นเพียงชั่วโมงว่างแรกที่พบ',
  'queue.rules.create': 'สร้างกฎของคิวใหม่',
  'queue.rules.count': '{count, plural, =0 {ไม่มีกฎ} other {# กฎ}}',
  'queue.rules.enabled': 'กำลังใช้งาน',
  'queue.rules.disabled': 'หยุดชั่วคราว',
  'queue.rules.archived': 'เก็บเข้าคลังแล้ว',
  'queue.rules.edit': 'แก้ไขกฎ',
  'queue.rules.archive': 'เก็บกฎเข้าคลัง',
  'queue.rules.archiveHelp':
    'การเก็บเข้าคลังจะหยุดข้อเสนอในอนาคต ช่วงเวลาที่จองไว้แล้วจะยังคงเวลาและเหตุผลของตนไว้',

  'queue.field.name': 'ชื่อกฎ',
  'queue.field.nameHelp': 'ชื่อที่คุณจะจำได้ในภายหลัง เช่น เช้าวันธรรมดา',
  'queue.field.timeZone': 'เขตเวลา',
  'queue.field.timeZoneHelp': 'ช่วงเวลา จำนวนต่อวัน และวันที่ห้ามโพสต์ ทั้งหมดถูกอ่านในเขตเวลานี้',
  'queue.field.minimumGap': 'ระยะห่างขั้นต่ำ',
  'queue.field.minimumGapHelp': 'จำนวนนาทีระหว่างสองโพสต์ ศูนย์หมายถึงไม่มีกฎการเว้นระยะ',
  'queue.field.maximumPerDay': 'สูงสุดต่อวัน',
  'queue.field.maximumPerDayHelp':
    'เว้นว่างไว้หากไม่มีขีดจำกัดต่อวัน ศูนย์หมายถึงกฎนี้ไม่เสนอเวลาใดเลย',
  'queue.field.maximumPerDayUnlimited': 'ไม่จำกัดต่อวัน',
  'queue.field.priority': 'ระดับความสำคัญ',
  'queue.field.priorityHelp': 'กฎที่มีระดับความสำคัญสูงสุดที่เสนอช่วงเวลาได้จะถูกใช้',
  'queue.field.enabled': 'ใช้กฎนี้',

  'queue.windows.heading': 'ช่วงเวลารายสัปดาห์',
  'queue.windows.help':
    'เลือกชั่วโมงตามเวลาท้องถิ่นที่โปรเจกต์นี้อาจโพสต์ได้ ใช้ช่องวันและเวลา หรือปุ่มบนตาราง',
  'queue.windows.empty': 'ยังไม่มีช่วงเวลา กฎที่ไม่มีช่วงเวลาจะไม่มีวันเสนอช่วงเวลาได้',
  'queue.windows.add': 'เพิ่มช่วงเวลา',
  'queue.windows.remove': 'ลบช่วงเวลา',
  'queue.windows.entry': '{weekday}, {start} ถึง {end}',
  'queue.windows.start': 'จาก',
  'queue.windows.end': 'ถึง',
  'queue.windows.weekday': 'วัน',
  'queue.windows.toggleCell': '{weekday} เวลา {hour}',
  'queue.windows.gridLabel': 'ความพร้อมใช้งานรายสัปดาห์ หนึ่งปุ่มต่อหนึ่งวันและหนึ่งชั่วโมง',

  'queue.weekday.1': 'วันจันทร์',
  'queue.weekday.2': 'วันอังคาร',
  'queue.weekday.3': 'วันพุธ',
  'queue.weekday.4': 'วันพฤหัสบดี',
  'queue.weekday.5': 'วันศุกร์',
  'queue.weekday.6': 'วันเสาร์',
  'queue.weekday.7': 'วันอาทิตย์',

  'queue.blackouts.heading': 'วันที่ห้ามโพสต์',
  'queue.blackouts.help': 'วันที่โปรเจกต์นี้จะไม่โพสต์ อ่านตามเขตเวลาของกฎ',
  'queue.blackouts.empty': 'ไม่มีวันที่ห้ามโพสต์',
  'queue.blackouts.add': 'เพิ่มวันที่ห้ามโพสต์',
  'queue.blackouts.remove': 'ลบวันที่ห้ามโพสต์',
  'queue.blackouts.from': 'วันแรก',
  'queue.blackouts.to': 'วันสุดท้าย',
  'queue.blackouts.entry': '{from} ถึง {to}',

  'queue.connections.heading': 'บัญชี',
  'queue.connections.all': 'ทุกบัญชีในโปรเจกต์นี้',
  'queue.connections.scoped': '{count, plural, other {# บัญชี}} ที่กฎนี้ใช้บังคับ',

  'queue.slot.heading': 'ช่วงเวลาถัดไปในคิว',
  'queue.slot.action': 'ใช้ช่วงเวลาถัดไปในคิว',
  'queue.slot.proposed': '{local} ตามเขตเวลา {timeZone}',
  'queue.slot.utc': 'นั่นคือ {utc} ตามเวลา UTC',
  'queue.slot.why': 'ทำไมถึงเป็นเวลานี้',
  'queue.slot.accept': 'ใช้เวลานี้',
  'queue.slot.release': 'เลือกเวลาอื่น',
  'queue.slot.expires': 'ข้อเสนอนี้ถูกกันไว้จนถึง {expires}',
  'queue.slot.unavailable': 'ขณะนี้ไม่มีช่วงเวลาในคิวที่พร้อมใช้งาน',
  'queue.slot.pending': 'กำลังหาช่วงเวลาถัดไป',
  'queue.slot.accepted': 'กำหนดเวลาไว้ที่ {local} ตามเขตเวลา {timeZone}',
  'queue.slot.notAutomatic': 'ไม่มีอะไรถูกกำหนดเวลาจนกว่าคุณจะเลือกเวลานี้',

  'queue.reason.noRulesConfigured':
    'โปรเจกต์นี้ยังไม่มีการตั้งค่ากฎของคิว จึงไม่มีช่วงเวลาใดถูกนำมาใช้',
  'queue.reason.fallbackFirstFreeHour': 'ชั่วโมงว่างแรกนับจากตอนนี้ถูกใช้แทน',
  'queue.reason.matchedRule': 'กฎ {name} เลือกเวลานี้ ตามเขตเวลา {zone}',
  'queue.reason.matchedWindow': 'เวลานี้อยู่ในช่วง {start} ถึง {end} ตามเขตเวลา {zone}',
  'queue.reason.minimumGap': 'เวลานี้ห่างจากทุกโพสต์อื่นอย่างน้อย {minutes} นาที',
  'queue.reason.noMinimumGap': 'กฎนี้ไม่ได้กำหนดระยะห่างขั้นต่ำระหว่างโพสต์',
  'queue.reason.dailyCap': 'วันนั้นมีโพสต์ได้สูงสุด {limit} โพสต์ และยังไม่เต็ม',
  'queue.reason.dailyCapUnlimited': 'กฎนี้ไม่ได้กำหนดขีดจำกัดต่อวัน',
  'queue.reason.blackoutSkipped':
    '{days, plural, other {ข้าม # วันที่ห้ามโพสต์}} เพื่อไปถึงเวลานี้',
  'queue.reason.dstNonexistentSkipped':
    'เวลาแรกในช่วงนี้ไม่มีอยู่จริงในวันนั้นตามเขตเวลา {zone} จึงใช้เวลาถัดไปที่มีอยู่จริงแทน',
  'queue.reason.dstAmbiguousFirst':
    'เวลาท้องถิ่นนั้นเกิดขึ้นสองครั้งตามเขตเวลา {zone} ในวันนั้น จึงใช้ครั้งแรกที่เกิดขึ้น',
  'queue.reason.priorityChosen': 'กฎนี้มีระดับความสำคัญ {priority} ซึ่งสูงสุดที่สามารถเสนอได้',
  'queue.reason.connectionScoped': 'กฎนี้ครอบคลุม {count, plural, other {# บัญชี}}',
  'queue.reason.horizonExhausted': 'ไม่มีช่วงเวลาว่างภายใน {days} วัน',
} as const;
