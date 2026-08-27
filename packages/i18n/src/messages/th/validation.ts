/** th beta catalog namespace. */
export const validationMessages = {
  'validation.text_required.message': '{provider} ต้องการข้อความสำหรับโพสต์ประเภทนี้',
  'validation.text_too_long.message':
    '{over, plural, one {# character over the limit for {account}} other {# characters over the limit for {account}}}',
  'validation.text_too_long.hint': '{provider} อนุญาต {limit} อักขระสำหรับบัญชีนี้',
  'validation.text_too_short.message': '{provider} ต้องมีอักขระอย่างน้อย {min} ตัวที่นี่',
  'validation.title_required.message': '{provider} ต้องมีชื่อ',
  'validation.title_too_long.message': 'ชื่อมีความยาวเกินจำนวนอักขระสูงสุด {limit} ตัว',
  'validation.description_too_long.message': 'คำอธิบายมีความยาวเกินขีดจำกัดอักขระ {limit} ตัว',
  'validation.media_required.message':
    '{provider} ต้องมีรูปภาพหรือวิดีโออย่างน้อยหนึ่งภาพสำหรับโพสต์ประเภทนี้',
  'validation.media_count_exceeded.message':
    '{provider} accepts at most {limit, plural, one {# file} other {# files}} here. This post has {count}.',
  'validation.media_type_unsupported.message': '{provider} ไม่ยอมรับไฟล์ {mimeType}',
  'validation.media_aspect_ratio_unsupported.message':
    'ไฟล์นี้คือ {actual} {provider} ต้องมีอัตราส่วนระหว่าง {min} และ {max}',
  'validation.media_aspect_ratio_unsupported.hint':
    'ครอบตัดด้วยแพลตฟอร์มที่ตั้งไว้ล่วงหน้าเพื่อแก้ไขปัญหานี้',
  'validation.media_resolution_too_low.message':
    'ไฟล์นี้คือ {actual} {provider} ต้องการอย่างน้อย {required}',
  'validation.media_duration_too_long.message':
    'วิดีโอนี้คือ {actual} {provider} ยอมรับได้ถึง {limit} สำหรับบัญชีนี้',
  'validation.media_duration_too_short.message':
    'วิดีโอนี้คือ {actual} {provider} ต้องการอย่างน้อย {limit}',
  'validation.media_file_too_large.message': 'ไฟล์นี้คือ {actual} {provider} ยอมรับได้ถึง {limit}',
  'validation.media_mixed_types_unsupported.message':
    '{provider} ไม่สามารถเผยแพร่รูปภาพและวิดีโอในโพสต์เดียวกันได้',
  'validation.media_unavailable.message':
    'ไฟล์แนบไฟล์หนึ่งไม่พร้อมใช้งานอีกต่อไป ให้ลบออกจากโพสต์หรืออัปโหลดใหม่',
  'validation.alt_text_missing.message':
    'Alt text is missing on {count, plural, one {# image} other {# images}}.',
  'validation.alt_text_missing.hint': 'อธิบายภาพหรือทำเครื่องหมายเป็นการตกแต่ง',
  'validation.thumbnail_unsupported.message': '{provider} ไม่ยอมรับภาพขนาดย่อที่กำหนดเองที่นี่',
  'validation.destination_required.message': 'เลือกว่าจะเผยแพร่ที่ใดใน {provider}',
  'validation.destination_unsupported.message':
    '{destination} ไม่ยอมรับการโพสต์ประเภทนี้ใน {provider}',
  'validation.mention_unresolved.message':
    '{count, plural, one {# mention has not been matched to a real account} other {# mentions have not been matched to real accounts}}.',
  'validation.mention_unresolved.hint':
    'เลือกบัญชีจากผลการค้นหา หรือลบการกล่าวถึง ข้อความธรรมดาจะไม่เผยแพร่เป็นแท็กเนทิฟ',
  'validation.hashtag_count_exceeded.message':
    'แฮชแท็ก {count} {provider} นับมากกว่า {limit} ว่าเป็นสแปม',
  'validation.link_not_allowed.message': '{provider} ไม่อนุญาตให้มีลิงก์ในช่องนี้',
  'validation.link_destination_unverified.message':
    'โดเมนลิงก์ {domain} ไม่ได้รับการตรวจสอบสำหรับพื้นที่ทำงานนี้',
  'validation.privacy_setting_required.message':
    '{provider} จำเป็นต้องมีตัวเลือกความเป็นส่วนตัวที่ชัดเจนก่อนที่จะเผยแพร่',
  'validation.privacy_setting_required.hint': 'ไม่มีค่าเริ่มต้น เลือกผู้ที่สามารถเห็นโพสต์นี้',
  'validation.disclosure_required.message':
    'โพสต์นี้จำเป็นต้องเปิดเผยภายใต้กฎของโปรเจกต์สำหรับ {market}',
  'validation.first_comment_unsupported.message':
    '{provider} ไม่สนับสนุนการแสดงความคิดเห็นแรกตามกำหนดการสำหรับบัญชีนี้',
  'validation.thread_unsupported.message': '{provider} ไม่รองรับเธรดสำหรับบัญชีนี้',
  'validation.repeat_end_required.message': 'โพสต์ที่ซ้ำต้องมีวันที่สิ้นสุดหรือจำนวนการโพสต์ซ้ำ',
  'validation.schedule_in_past.message': 'เวลานั้นผ่านไปแล้วใน {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'สามารถตั้งเวลาโพสต์ล่วงหน้าได้สูงสุด {limit} ซึ่งเป็นระยะเวลาเดียวกับที่เก็บไฟล์สื่อที่อัปโหลด',
  'validation.schedule_outside_quiet_hours.message':
    'ซึ่งอยู่ภายในชั่วโมงเงียบที่กำหนดไว้สำหรับ {project}',
  'validation.duplicate_within_window.message':
    'เนื้อหาที่คล้ายกันมากได้รับการกำหนดเวลาหรือเผยแพร่แล้วสำหรับ {account} ภายใน {window}',
  'validation.blocked_term_present.message': 'ข้อความนี้มีคำที่ถูกบล็อกสำหรับ {project}',
  'validation.unsupported_claim.message':
    'การอ้างสิทธิ์นี้ไม่อยู่ในการอ้างสิทธิ์ที่ได้รับอนุมัติสำหรับ {project}',
  'validation.unsupported_claim.hint':
    'เพิ่มลงในคำกล่าวอ้างที่ได้รับอนุมัติพร้อมหลักฐาน หรือเปลี่ยนประโยคใหม่',
  'validation.cadence_exceeded.message':
    '{account} would publish {count, plural, one {# time} other {# times}} that day, over the limit of {limit}.',
  'validation.connection_paused.message': '{account} ถูกหยุดชั่วคราวและจะไม่เผยแพร่',
  'validation.account_type_invalid.message':
    '{account} ไม่ใช่ประเภทบัญชี {provider} ที่จำเป็นสำหรับประเภทโพสต์นี้',
  'validation.severity.error': 'ต้องแก้ไข',
  'validation.severity.warning': 'ตรวจสอบสิ่งนี้',
  'validation.severity.info': 'สำหรับข้อมูลของคุณ',
  'validation.field.required': 'ต้องระบุข้อมูลในช่องนี้',
  'validation.field.tooShort':
    'Use at least {min, plural, one {# character} other {# characters}}.',
  'validation.field.tooLong': 'Use at most {max, plural, one {# character} other {# characters}}.',
  'validation.field.invalidEmail': 'ป้อนที่อยู่อีเมลที่ถูกต้อง',
  'validation.field.invalidUrl': 'ป้อน URL แบบเต็ม รวมถึง https',
  'validation.field.invalidDate': 'ป้อนวันที่ที่ถูกต้อง',
  'validation.field.invalidTime': 'ป้อนเวลาที่ถูกต้อง',
  'validation.field.invalidNumber': 'ป้อนตัวเลข',
  'validation.field.outOfRange': 'ป้อนค่าระหว่าง {min} ถึง {max}',
  'validation.field.mustMatch': 'ค่าทั้งสองนี้จะต้องตรงกัน',
  'validation.field.alreadyTaken': 'นั้นมีการใช้งานอยู่แล้ว',
  'validation.field.unsafeValue': 'ไม่อนุญาตให้ใช้ค่าดังกล่าวที่นี่',
} as const;
