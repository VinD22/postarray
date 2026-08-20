/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 *
 * Three features that all answer "who is this going to, and when", grouped in
 * one namespace so their vocabulary stays consistent. The hold copy is the part
 * most worth reading twice: pausing stops work that has not happened, and every
 * sentence here has to say that plainly rather than implying a post can be
 * pulled back off a platform.
 */
export const postingSetMessages = {
  /* ------------------------------------------------------------- the hold */
  'calendar.hold.action': 'หยุดชั่วคราว',
  'calendar.hold.resumeAction': 'ดำเนินการต่อ',
  'calendar.hold.badge': 'หยุดชั่วคราวแล้ว',
  'calendar.hold.badgeBilling': 'หยุดชั่วคราวโดยระบบเรียกเก็บเงิน',
  'calendar.hold.term': 'การหยุดพัก',
  'calendar.hold.byPerson': 'คุณหยุดชั่วคราวเมื่อ {date}',
  'calendar.hold.byBilling': 'หยุดชั่วคราวเมื่อ {date} เพราะพื้นที่ทำงานนี้สูญเสียสิทธิ์การเข้าถึงเต็มรูปแบบ',
  'calendar.hold.none': 'ไม่ได้หยุดชั่วคราว',

  'calendar.hold.confirmTitle': 'หยุดโพสต์นี้ชั่วคราวหรือไม่',
  'calendar.hold.confirmBody':
    'โพสต์นี้จะยังอยู่ที่เดิมและจะไม่ถูกส่งออกไปเมื่อถึง {time} คุณสามารถดำเนินการต่อได้ทุกเมื่อก่อนถึงเวลานั้น หรือเลือกเวลาใหม่หากเวลานั้นผ่านไปแล้ว',
  'calendar.hold.confirmScope':
    'การหยุดชั่วคราวจะหยุดเฉพาะสิ่งที่ยังไม่เกิดขึ้น สิ่งที่เผยแพร่ไปยังแพลตฟอร์มแล้วจะยังคงเผยแพร่อยู่ และการหยุดชั่วคราวไม่ได้ลบหรือแก้ไขมัน',
  'calendar.hold.confirmNoteLabel': 'ทำไมคุณถึงหยุดโพสต์นี้ชั่วคราว (ไม่บังคับ)',
  'calendar.hold.confirmNoteHint': 'เก็บไว้ในบันทึกการตรวจสอบสำหรับทีมของคุณ ไม่ถูกส่งไปยังแพลตฟอร์มใด',
  'calendar.hold.confirm': 'หยุดโพสต์นี้ชั่วคราว',
  'calendar.hold.cancel': 'ให้คงกำหนดเวลาไว้',

  'calendar.hold.resumeTitle': 'ดำเนินการโพสต์นี้ต่อหรือไม่',
  'calendar.hold.resumeBody': 'มันจะถูกส่งออกไปเมื่อ {time} ตามเขตเวลา {timeZone}',
  'calendar.hold.resumeMissedTitle': 'เวลานั้นผ่านไปแล้ว',
  'calendar.hold.resumeMissedBody':
    'โพสต์นี้ครบกำหนดเมื่อ {time} ขณะที่ถูกหยุดชั่วคราวอยู่ เลือกเวลาใหม่เพื่อไม่ให้มันถูกส่งออกทันทีที่คุณดำเนินการต่อ',
  'calendar.hold.resumeTimeLabel': 'เวลาเผยแพร่ใหม่',
  'calendar.hold.resumeConfirm': 'ดำเนินการต่อ',

  'calendar.hold.paused': 'หยุดชั่วคราวแล้ว จะไม่ถูกส่งออกจนกว่าคุณจะดำเนินการต่อ',
  'calendar.hold.resumed': 'ดำเนินการต่อแล้ว จะถูกส่งออกเมื่อ {time}',

  'calendar.hold.blocked.published':
    'โพสต์นี้ถูกส่งออกไปแล้ว การหยุดชั่วคราวไม่สามารถดึงมันกลับจากแพลตฟอร์มได้',
  'calendar.hold.blocked.inFlight':
    'โพสต์นี้กำลังถูกส่งออกอยู่ในขณะนี้ สายเกินไปที่จะหยุดชั่วคราว และการหยุดกลางคันอาจทำให้มันเผยแพร่ไปเพียงบางส่วน',
  'calendar.hold.blocked.finished': 'โพสต์นี้เสร็จสิ้นแล้ว จึงไม่มีอะไรให้หยุดชั่วคราว',
  'calendar.hold.blocked.billing':
    'โพสต์นี้ถูกพักไว้เพราะพื้นที่ทำงานสูญเสียสิทธิ์การเข้าถึงเต็มรูปแบบ การดำเนินการต่อเป็นเรื่องของการเรียกเก็บเงิน ไม่ใช่การกำหนดเวลา',
  'calendar.hold.blocked.billingAction': 'ไปที่การเรียกเก็บเงิน',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'ชุดการโพสต์',
  'set.lede':
    'คำตอบที่บันทึกไว้สำหรับ "ฉันกำลังโพสต์สิ่งนี้ให้ใคร และอย่างไร" การนำชุดไปใช้จะคัดลอกการตั้งค่าของมันลงในฉบับร่างใหม่',
  'set.appliedOnce':
    'ชุดหนึ่งจะถูกอ่านเพียงครั้งเดียว เมื่อคุณนำไปใช้ การแก้ไขในภายหลังจะเปลี่ยนเฉพาะสิ่งที่โพสต์ถัดไปเริ่มต้นจาก ฉบับร่างและโพสต์ที่กำหนดเวลาแล้วซึ่งคุณสร้างจากมันไปแล้วจะยังคงเหมือนเดิมทุกประการ',
  'set.empty.title': 'ยังไม่มีชุด',
  'set.empty.body': 'สร้างชุดหนึ่งเพื่อไม่ต้องสร้างรายชื่อบัญชีเดิมซ้ำทุกครั้งที่โพสต์',
  'set.create': 'สร้างชุดใหม่',
  'set.edit': 'แก้ไขชุด',
  'set.archive': 'เก็บชุดเข้าคลัง',
  'set.archived': 'เก็บเข้าคลังแล้ว',
  'set.archivedNote': 'ชุดที่เก็บเข้าคลังจะถูกซ่อนจากตัวเลือก โพสต์ที่สร้างจากชุดเหล่านั้นไม่เปลี่ยนแปลง',
  'set.showArchived': 'แสดงรายการที่เก็บเข้าคลัง',
  'set.saved': 'บันทึกชุดแล้ว',
  'set.archivedToast': 'เก็บชุดเข้าคลังแล้ว โพสต์ที่สร้างจากชุดนี้ไปแล้วไม่เปลี่ยนแปลง',

  'set.field.name': 'ชื่อ',
  'set.field.nameHint': 'สิ่งที่คุณจะมองหาในตัวเลือก หนึ่งชื่อต่อหนึ่งโปรเจกต์',
  'set.field.description': 'คำอธิบาย',
  'set.field.descriptionHint': 'ไม่บังคับ ใช้ทำอะไรกับชุดนี้',
  'set.field.targets': 'บัญชี',
  'set.field.targetsHint': 'ทุกบัญชีที่โพสต์ซึ่งสร้างจากชุดนี้จะเริ่มต้นด้วย',
  'set.field.targetCount': '{count, plural, =0 {ไม่มีบัญชี} other {# บัญชี}}',
  'set.field.signature': 'ลายเซ็น',
  'set.field.signatureNone': 'ไม่มีลายเซ็น',
  'set.field.approval': 'การอนุมัติ',
  'set.field.approvalHint': 'การอนุมัติที่โพสต์ซึ่งสร้างจากชุดนี้ต้องผ่านก่อนจึงจะเผยแพร่ได้',
  'set.field.schedule': 'จะเผยแพร่เมื่อไร',

  'set.approval.none': 'ไม่ต้องอนุมัติ',
  'set.approval.single_approver': 'ผู้อนุมัติที่ระบุชื่อหนึ่งคน',
  'set.approval.any_approver': 'ผู้อนุมัติคนใดก็ได้',
  'set.approval.named_approver': 'ผู้อนุมัติที่ระบุเจาะจง',
  'set.approval.policy_auto': 'ตามที่นโยบายของพื้นที่ทำงานกำหนด',

  'set.slot.next_free_slot': 'ช่วงเวลาว่างถัดไปจากคิว',
  'set.slot.next_free_slotHint':
    'ใช้กฎของคิวในโปรเจกต์นี้เพื่อเสนอเวลา มันเป็นเพียงข้อเสนอ คุณเป็นผู้ยอมรับ',
  'set.slot.pick_time': 'ให้ถามฉันหาเวลา',
  'set.slot.pick_timeHint': 'การนำชุดไปใช้จะเว้นเวลาว่างไว้ให้คุณเลือกเอง',
  'set.slot.draft_only': 'ให้เป็นฉบับร่างเท่านั้น',
  'set.slot.draft_onlyHint': 'การนำชุดไปใช้จะไม่แตะกำหนดเวลาเลย',
  'set.slot.noRules':
    'โปรเจกต์นี้ยังไม่มีกฎของคิว คิวจะเสนอชั่วโมงว่างแรกและจะแจ้งให้ทราบเช่นนั้น',
  'set.slot.rulesLink': 'กฎของคิว',

  'set.defaults.title': 'ค่าเริ่มต้นตามแต่ละแพลตฟอร์ม',
  'set.defaults.body': 'ค่าตั้งต้นที่ถูกคัดลอกลงในโพสต์ใหม่แต่ละรายการ คุณเปลี่ยนค่าใด ๆ ในตัวเขียนโพสต์ภายหลังได้',
  'set.defaults.add': 'เพิ่มแพลตฟอร์ม',
  'set.defaults.remove': 'ลบค่าเริ่มต้นของ {platform}',
  'set.defaults.privacy': 'ความเป็นส่วนตัว',
  'set.defaults.privacyNone': 'ค่าเริ่มต้นของแพลตฟอร์ม',
  'set.defaults.bodyPrefix': 'ข้อความก่อนโพสต์',
  'set.defaults.bodySuffix': 'ข้อความหลังโพสต์',
  'set.defaults.requireAltText': 'บังคับให้มีข้อความแสดงแทนทุกภาพ',
  'set.defaults.requireAltTextHint':
    'โพสต์ที่สร้างจากชุดนี้จะกำหนดเวลาให้แพลตฟอร์มนั้นไม่ได้จนกว่าทุกภาพจะมีข้อความแสดงแทน',
  'set.defaults.empty': 'ไม่มีค่าเริ่มต้นตามแพลตฟอร์ม ทุกบัญชีเริ่มต้นจากโพสต์หลัก',

  'set.error.nameTaken': 'มีอีกชุดหนึ่งในโปรเจกต์นี้ใช้ชื่อนั้นอยู่แล้ว',
  'set.error.archived': 'ชุดนี้ถูกเก็บเข้าคลังแล้ว ให้กู้คืนก่อนแก้ไข',
  'set.error.duplicateTarget': 'บัญชีนั้นอยู่ในชุดนี้อยู่แล้ว',
  'set.error.duplicatePlatform': 'ชุดนี้มีค่าเริ่มต้นสำหรับแพลตฟอร์มนั้นอยู่แล้ว',

  /* --------------------------------------------------- remembered targets */
  'targetMemory.setting.title': 'จดจำบัญชีระหว่างการโพสต์',
  'targetMemory.setting.body':
    'เมื่อเปิดใช้งาน ตัวเขียนโพสต์จะเริ่มต้นโพสต์ใหม่แต่ละรายการด้วยบัญชีที่คนนั้นเลือกครั้งล่าสุดในโปรเจกต์นี้ ปิดไว้จนกว่าคุณจะเปิดเอง',
  'targetMemory.setting.stored':
    'จะเก็บไว้เฉพาะรายชื่อบัญชี และเฉพาะสำหรับคนที่เลือกไว้เท่านั้น ไม่มีการเก็บข้อความ เวลา การตั้งค่าความเป็นส่วนตัว หรือสถานะการอนุมัติใด ๆ และไม่มีใครอื่นในโปรเจกต์เห็นรายชื่อของคุณ',
  'targetMemory.setting.offNote': 'ขณะที่ปิดอยู่ จะไม่มีการเก็บอะไรเลย',
  'targetMemory.setting.turnOffWarning':
    'การปิดการใช้งานนี้จะลบทุกการเลือกที่บันทึกไว้ในโปรเจกต์นี้ สำหรับทุกคน',
  'targetMemory.setting.enabled': 'เปิด',
  'targetMemory.setting.disabled': 'ปิด',
  'targetMemory.setting.saved': 'บันทึกการตั้งค่าแล้ว',
  'targetMemory.setting.cleared': 'บันทึกการตั้งค่าแล้ว การเลือกที่บันทึกไว้ในโปรเจกต์นี้ถูกลบแล้ว',

  'targetMemory.composer.restored': '{count, plural, other {เริ่มต้นด้วย # บัญชีจากครั้งก่อน}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, other {# บัญชีที่คุณใช้ครั้งก่อนถูกตัดออก เพราะต้องการการดูแล}}',
  'targetMemory.composer.droppedAll':
    'ไม่มีบัญชีใดที่คุณใช้ครั้งก่อนพร้อมใช้งานในตอนนี้ จึงไม่มีการเลือกล่วงหน้าให้',
  'targetMemory.composer.undo': 'ล้างการเลือก',
  'targetMemory.composer.forget': 'หยุดจดจำบัญชีของฉัน',
  'targetMemory.composer.forgotten': 'การเลือกที่บันทึกไว้ของคุณถูกลบแล้ว',
  'targetMemory.composer.reviewAccounts': 'ตรวจทานบัญชี',
} as const;
