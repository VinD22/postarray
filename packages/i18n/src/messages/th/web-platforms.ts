/**
 * The per platform scheduler pages.
 *
 * Rules that bind this file specifically:
 *
 *  - Not one string here names a platform, states a character ceiling, a file
 *    size or a capability. Every one of those comes from the generated
 *    datasets the page reads, so a page physically cannot claim support the
 *    connectors do not have. The strings below are labels and framing only.
 *  - The framing is always "what the platform requires" and "what this product
 *    intends to support". Never "what you can publish". No connector has
 *    passed its definition of done, so nothing publishes.
 *  - Anything a platform does not document is `common.unavailable`, never a
 *    zero and never a guess.
 */
export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'การกำหนดเวลา แยกตามแพลตฟอร์ม',
  'web.meta.schedule.description':
    'สิ่งที่แต่ละแพลตฟอร์มในกลุ่มเปิดตัวต้องการจากบัญชีที่เชื่อมต่อแล้ว ขีดจำกัดที่ API ทางการของแพลตฟอร์มบังคับใช้ และผลิตภัณฑ์นี้สร้างมาถึงจุดไหนแล้วเทียบกับสิ่งเหล่านั้น',
  'web.meta.schedulePlatform.title': 'การกำหนดเวลาสำหรับ {platform}',
  'web.meta.schedulePlatform.description':
    'สิ่งที่ {platform} ต้องการจากบัญชีที่เชื่อมต่อแล้ว ขีดจำกัดที่ API ทางการของมันบังคับใช้ และส่วนไหนของสิ่งเหล่านั้นที่ผลิตภัณฑ์นี้สร้างขึ้นแล้ว',

  /* ---------------------------------------------------------------------- */
  /* Index                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'การกำหนดเวลา แยกตามแพลตฟอร์ม',
  'web.schedule.index.lede':
    'หนึ่งหน้าต่อหนึ่งแพลตฟอร์มในกลุ่มเปิดตัว แต่ละหน้าระบุสิ่งที่แพลตฟอร์มนั้นขอจากบัญชีที่เชื่อมต่อแล้ว ขีดจำกัดที่ API ทางการของมันบังคับใช้ และการสร้างอยู่ที่ไหนแล้ว ทุกตัวเลขมาพร้อมเอกสารที่มันมาจากและวันที่มีคนอ่านเอกสารนั้น',
  'web.schedule.index.listLabel': 'แพลตฟอร์มในกลุ่มเปิดตัว',
  'web.schedule.index.cohortNote':
    'กลุ่มเปิดตัวคือชุดแพลตฟอร์มที่ผลิตภัณฑ์นี้กำลังถูกสร้างขึ้นมารองรับ เป็นแผนงาน ไม่ใช่รายการที่พร้อมใช้งาน',
  'web.schedule.index.limitsKnown': 'บันทึกขีดจำกัดแล้ว',
  'web.schedule.index.limitsUnknown': 'ยังไม่ได้บันทึกขีดจำกัด',

  /* ---------------------------------------------------------------------- */
  /* Platform page                                                          */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'การกำหนดเวลาสำหรับ {platform}',
  'web.schedule.platform.lede':
    'สิ่งที่ {platform} ขอจากบัญชีที่เชื่อมต่อแล้ว ขีดจำกัดที่ API ทางการของมันบังคับใช้ และส่วนไหนของสิ่งเหล่านั้นที่ผลิตภัณฑ์นี้สร้างขึ้นแล้วจนถึงตอนนี้',

  'web.schedule.notice.title': 'ยังไม่มีอะไรถูกเผยแพร่ไปยัง {platform}',
  'web.schedule.notice.body':
    'ยังไม่มีการเชื่อมต่อใดผ่านคำนิยามความสำเร็จของมัน และไม่มีการเชื่อมต่อใดได้รับการยืนยันในสภาพแวดล้อมจริง หน้านี้อธิบายสิ่งที่แพลตฟอร์มต้องการและสิ่งที่ผลิตภัณฑ์นี้ตั้งใจจะรองรับ ไม่ได้อธิบายตัวกำหนดเวลาที่ทำงานอยู่จริง',

  'web.schedule.requirements.title': '{platform} ต้องการอะไรบ้าง',
  'web.schedule.requirements.accountTypes': 'ประเภทบัญชี',
  'web.schedule.requirements.restriction': 'ข้อจำกัดของแพลตฟอร์ม',
  'web.schedule.requirements.cost': 'ต้นทุน API',
  'web.schedule.requirements.unavailable.title': 'ยังไม่มีบันทึกการเชื่อมต่อที่ผ่านการตรวจทาน',
  'web.schedule.requirements.unavailable.body':
    'แพลตฟอร์มนี้เข้าร่วมกลุ่มเปิดตัวหลังจากรอบการวิจัยการเชื่อมต่อครั้งล่าสุด จึงยังไม่มีบันทึกที่ระบุวันที่เกี่ยวกับข้อกำหนดบัญชีของมันให้แสดง มันจะปรากฏที่นี่เมื่อมีคนอ่านเอกสารทางการและบันทึกไว้แล้ว',
  'web.schedule.requirements.apiSource': 'เอกสาร API ทางการ',
  'web.schedule.requirements.policySource': 'นโยบายของแพลตฟอร์ม',

  /* ---------------------------------------------------------------------- */
  /* Limits                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'ขีดจำกัดที่ {platform} บังคับใช้',
  'web.schedule.limits.lede':
    'อ่านสำหรับบัญชีที่เพิ่งเชื่อมต่อโดยไม่มีสิทธิ์ที่ยกระดับ แพลตฟอร์มอาจเพิ่มหรือลดขีดจำกัดใด ๆ เหล่านี้โดยไม่แจ้งใคร นั่นเป็นเหตุผลที่แต่ละชุดขีดจำกัดมาพร้อมวันที่มันถูกอ่าน',
  'web.schedule.limits.unavailable.title': 'ยังไม่ได้บันทึกขีดจำกัดสำหรับ {platform}',
  'web.schedule.limits.unavailable.body':
    'บิลด์นี้ยังไม่มีตัวปรับใช้สำหรับแพลตฟอร์มนี้ จึงยังไม่มีเพดานที่บันทึกไว้ให้แสดง ตัวเลขที่สร้างขึ้นเองจะแย่กว่าการไม่มีเลย',
  'web.schedule.limits.sourceLabel': 'เอกสารทางการของแพลตฟอร์ม',

  'web.schedule.limits.text': 'ข้อความเนื้อหา',
  'web.schedule.limits.title_field': 'ช่องชื่อเรื่อง',
  'web.schedule.limits.countingUnit': 'วิธีนับตัวอักษร',
  'web.schedule.limits.links': 'วิธีนับลิงก์',
  'web.schedule.limits.images': 'จำนวนภาพต่อโพสต์',
  'web.schedule.limits.videos': 'จำนวนวิดีโอต่อโพสต์',
  'web.schedule.limits.videoDuration': 'ความยาวของวิดีโอ',
  'web.schedule.limits.imageBytes': 'ภาพที่ใหญ่ที่สุด',
  'web.schedule.limits.gifBytes': 'ภาพเคลื่อนไหวที่ใหญ่ที่สุด',
  'web.schedule.limits.videoBytes': 'วิดีโอที่ใหญ่ที่สุด',
  'web.schedule.limits.documentBytes': 'เอกสารที่ใหญ่ที่สุด',
  'web.schedule.limits.altText': 'ข้อความแสดงแทน',
  'web.schedule.limits.mimeTypes': 'ประเภทไฟล์ที่รองรับ',
  'web.schedule.limits.markdown': 'เครื่องหมายจัดรูปแบบ',

  'web.schedule.value.characters': '{count, plural, other {# ตัวอักษร}}',
  'web.schedule.value.files': '{count, plural, =0 {ไม่มี} other {# ไฟล์}}',
  'web.schedule.value.durationRange': 'ระหว่าง {min} ถึง {max}',
  'web.schedule.value.durationMax': 'ไม่เกิน {max}',
  'web.schedule.value.markdownYes': 'รองรับ',
  'web.schedule.value.markdownNo': 'เผยแพร่เป็นตัวอักษรธรรมดา',

  'web.schedule.unit.utf16':
    'นับเป็นหน่วยรหัส UTF-16 ซึ่งเป็นวิธีที่ตัวแก้ไขข้อความส่วนใหญ่รายงานจำนวนตัวอักษร',
  'web.schedule.unit.grapheme':
    'นับเป็นกราฟีม ดังนั้นอิโมจิที่ประกอบด้วยหลายจุดรหัสจึงยังคงนับเป็นหนึ่งตัวอักษร',
  'web.schedule.unit.weighted':
    'นับตามระบบถ่วงน้ำหนัก ที่ตัวอักษรที่ไม่ใช่ละตินส่วนใหญ่นับเป็นสองแทนที่จะเป็นหนึ่ง',

  'web.schedule.link.none': 'ลิงก์ไม่ถูกนับรวมในเพดาน',
  'web.schedule.link.actual': 'ลิงก์นับตรงตามจำนวนตัวอักษรที่มันใช้พื้นที่จริง',
  'web.schedule.link.fixed':
    'ลิงก์ทุกอันจะถูกเขียนใหม่เป็นตัวย่อของแพลตฟอร์มและนับ {count, plural, other {# ตัวอักษร}} ไม่ว่าความยาวจริงจะเป็นเท่าใด',

  /* ---------------------------------------------------------------------- */
  /* Capability state                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'สิ่งที่ถูกสร้างแล้วสำหรับ {platform}',
  'web.schedule.capabilities.lede':
    'สร้างขึ้นจากทะเบียนการเชื่อมต่อ ไม่ได้เขียนที่นี่ "แพลตฟอร์มไม่รองรับ" คือข้อเท็จจริงเกี่ยวกับแพลตฟอร์มและถือเป็นข้อสรุปสุดท้าย "ยังไม่ถูกสร้าง" คือข้อเท็จจริงเกี่ยวกับผลิตภัณฑ์นี้และเป็นค่าเริ่มต้นที่ตรงไปตรงมาในระหว่างที่ยังไม่มีการเชื่อมต่อใดผ่านคำนิยามความสำเร็จของมัน',
  'web.schedule.capabilities.unavailable.title': 'ยังไม่มีบันทึกความสามารถสำหรับ {platform}',
  'web.schedule.capabilities.unavailable.body':
    'ยังไม่มีตัวปรับใช้ในบิลด์นี้ ทะเบียนจึงยังไม่มีอะไรให้รายงาน แถวนี้จะปรากฏในตารางความสามารถทันทีที่มีสิ่งจริงให้พูดถึง',
  'web.schedule.capabilities.matrixLink': 'ดูตารางความสามารถทั้งหมด',

  'web.schedule.next.title': 'จะไปต่อที่ไหน',
  'web.schedule.next.body':
    'ตารางความสามารถรวมทุกแพลตฟอร์มและทุกความสามารถไว้ในตารางเดียว หน้ากรณีการใช้งานอธิบายขั้นตอนการทำงานที่ผลิตภัณฑ์นี้กำลังถูกสร้างขึ้นมารองรับ',

  /* ---------------------------------------------------------------------- */
  /* Post specs cluster (/specs)                                            */
  /* ---------------------------------------------------------------------- */

  'web.meta.specs.title': 'ข้อกำหนดโพสต์ แยกตามแพลตฟอร์ม',
  'web.meta.specs.description':
    'ขีดจำกัดที่แต่ละแพลตฟอร์มในกลุ่มเปิดตัวบังคับใช้กับหนึ่งโพสต์ สร้างขึ้นจากโค้ดการเชื่อมต่อ แต่ละรายการมาพร้อมเอกสารทางการที่มันมาจากและวันที่มีคนอ่านเอกสารนั้น',
  'web.meta.specsPlatform.title': 'ข้อกำหนดโพสต์สำหรับ {platform}',
  'web.meta.specsPlatform.description':
    'ทุกขีดจำกัดที่บันทึกไว้สำหรับ {platform}: มันคืออะไร เอกสารทางการที่ตัวเลขนั้นมาจาก และวันที่มีคนอ่านเอกสารนั้น',

  'web.specs.index.title': 'ข้อกำหนดโพสต์ แยกตามแพลตฟอร์ม',
  'web.specs.index.lede':
    'หนึ่งหน้าต่อหนึ่งขีดจำกัด ต่อหนึ่งแพลตฟอร์ม แต่ละหน้าระบุค่าที่บันทึกไว้ เอกสารทางการที่มันมาจาก และวันที่มีคนอ่านเอกสารนั้น ไม่มีอะไรที่นี่พิมพ์ขึ้นเอง: ค่าต่าง ๆ ถูกสร้างขึ้นจากโค้ดการเชื่อมต่อ หน้าหนึ่งจึงมีอยู่ก็ต่อเมื่อชุดข้อมูลนั้นมีค่าจริง',
  'web.specs.index.listLabel': 'แพลตฟอร์มที่มีขีดจำกัดบันทึกไว้',
  'web.specs.index.count': '{count, plural, other {# ขีดจำกัดที่บันทึกไว้}}',
  'web.specs.index.missingTitle': 'ทำไมแพลตฟอร์มหนึ่งอาจไม่ปรากฏที่นี่',
  'web.specs.index.missingBody':
    'แพลตฟอร์มหนึ่งจะปรากฏก็ต่อเมื่อบิลด์นี้มีตัวปรับใช้สำหรับมันและชุดข้อมูลที่สร้างขึ้นมีค่าอย่างน้อยหนึ่งค่า แพลตฟอร์มที่ไม่มีอะไรบันทึกไว้จะไม่มีหน้า เพราะหน้าที่สร้างจากตัวเลขที่สร้างขึ้นเองจะแย่กว่าไม่มีหน้าเลย',
  'web.specs.index.methodTitle': 'ค่าเหล่านี้มาจากไหน',
  'web.specs.index.methodBody':
    'ชุดข้อมูลถูกสร้างใหม่จากโค้ดความสามารถของการเชื่อมต่อ ซึ่งเป็นโค้ดเดียวกับที่ใช้วัดฉบับร่าง ค่าต่าง ๆ ถูกอ่านสำหรับบัญชีที่เพิ่งเชื่อมต่อโดยไม่มีสิทธิ์ที่ยกระดับ',

  'web.specs.platform.listLabel': 'ขีดจำกัดที่บันทึกไว้สำหรับแพลตฟอร์มนี้',
  'web.specs.platform.limitsTitle': 'สิ่งที่บันทึกไว้สำหรับ {platform}',
  'web.specs.platform.limitsBody':
    'แต่ละแถวเชื่อมโยงไปยังหน้าที่ระบุค่าของตัวเองพร้อมเอกสารที่มันมาจาก ขีดจำกัดที่แพลตฟอร์มนี้ไม่ได้บันทึกไว้ในเอกสารจะไม่มีแถวและไม่มีหน้า',

  'web.specs.detail.valueTitle': 'ค่าที่บันทึกไว้',
  'web.specs.detail.sourceLabel': 'เอกสารทางการของแพลตฟอร์ม',
  'web.specs.detail.freshnessTitle': 'ข้อมูลนี้ทันสมัยแค่ไหน',
  'web.specs.detail.freshnessBody':
    'แพลตฟอร์มอาจเพิ่มหรือลดขีดจำกัดโดยไม่ประกาศ ค่าด้านบนถูกอ่านสำหรับบัญชีที่เพิ่งเชื่อมต่อโดยไม่มีสิทธิ์ที่ยกระดับ และวันที่ข้างแหล่งที่มาคือวันที่มีคนอ่านเอกสารนั้นครั้งล่าสุด',
  'web.specs.detail.checkTitle': 'ตรวจสอบโพสต์จริงเทียบกับสิ่งนี้',
  'web.specs.detail.checkBody':
    'ตัวตรวจสอบก่อนโพสต์วัดฉบับร่างและไฟล์สื่อเทียบกับทุกขีดจำกัดที่บันทึกไว้สำหรับแพลตฟอร์มหนึ่ง ในเบราว์เซอร์เอง โดยไม่อัปโหลดอะไรเลย การเปิดจากหน้านี้จะเลือกแพลตฟอร์มนี้ไว้ล่วงหน้า',
  'web.specs.detail.checkLink': 'เปิดตัวตรวจสอบก่อนโพสต์สำหรับแพลตฟอร์มนี้',
  'web.specs.detail.siblingTitle': 'ทุกอย่างอื่นที่บันทึกไว้สำหรับแพลตฟอร์มนี้',
  'web.specs.detail.siblingBody':
    'ค่าอื่น ๆ ในชุดข้อมูลที่สร้างขึ้นเดียวกัน มีแหล่งที่มาแบบเดียวกัน',
  'web.specs.detail.scheduleLink': 'อ่านหน้าแพลตฟอร์มฉบับเต็ม',

  'web.specs.notice.title': 'ขีดจำกัดของแพลตฟอร์ม ไม่ใช่ตัวกำหนดเวลาที่ทำงานอยู่จริง',
  'web.specs.notice.body':
    'ยังไม่มีการเชื่อมต่อใดผ่านคำนิยามความสำเร็จของมัน หน้านี้ระบุสิ่งที่แพลตฟอร์มบังคับใช้ ไม่ได้บอกว่าผลิตภัณฑ์นี้เผยแพร่ไปที่นั่นแล้ว',

  'web.specs.constraint.characterLimit.name': 'ขีดจำกัดตัวอักษร',
  'web.specs.constraint.characterLimit.title': 'ขีดจำกัดตัวอักษรของ {platform}',
  'web.specs.constraint.characterLimit.lede':
    'ข้อความเนื้อหาที่ยาวที่สุดที่ {platform} ยอมรับในหนึ่งโพสต์ผ่าน API ทางการของมัน อ่านจากชุดข้อมูลที่สร้างขึ้นเดียวกันกับที่ตัวตรวจสอบก่อนโพสต์ใช้วัดฉบับร่าง',
  'web.specs.constraint.characterLimit.description':
    'เพดานข้อความเนื้อหาที่ {platform} บังคับใช้กับหนึ่งโพสต์ พร้อมเอกสารทางการที่ตัวเลขนั้นมาจากและวันที่มีคนอ่านเอกสารนั้น',

  'web.specs.constraint.titleLimit.name': 'ขีดจำกัดความยาวชื่อเรื่อง',
  'web.specs.constraint.titleLimit.title': 'ขีดจำกัดความยาวชื่อเรื่องของ {platform}',
  'web.specs.constraint.titleLimit.lede':
    'ชื่อเรื่องที่ยาวที่สุดที่ {platform} ยอมรับในช่องชื่อเรื่องแยกต่างหากที่ API ของมันเปิดให้ใช้ อ่านจากชุดข้อมูลที่สร้างขึ้นเดียวกันกับที่ตัวตรวจสอบก่อนโพสต์ใช้วัดฉบับร่าง',
  'web.specs.constraint.titleLimit.description':
    'เพดานช่องชื่อเรื่องที่ {platform} บังคับใช้ พร้อมเอกสารทางการที่ตัวเลขนั้นมาจากและวันที่มีคนอ่านเอกสารนั้น',

  'web.specs.constraint.imageSize.name': 'ขีดจำกัดขนาดภาพ',
  'web.specs.constraint.imageSize.title': 'ขีดจำกัดขนาดภาพของ {platform}',
  'web.specs.constraint.imageSize.lede':
    'ไฟล์ภาพนิ่งที่ใหญ่ที่สุดที่ {platform} ยอมรับผ่าน API ทางการของมัน อ่านจากชุดข้อมูลที่สร้างขึ้นเดียวกันกับที่ตัวตรวจสอบก่อนโพสต์ใช้วัดไฟล์',
  'web.specs.constraint.imageSize.description':
    'ไฟล์ภาพที่ใหญ่ที่สุดที่ {platform} ยอมรับ พร้อมเอกสารทางการที่ตัวเลขนั้นมาจากและวันที่มีคนอ่านเอกสารนั้น',

  'web.specs.constraint.videoSize.name': 'ขีดจำกัดขนาดวิดีโอ',
  'web.specs.constraint.videoSize.title': 'ขีดจำกัดขนาดวิดีโอของ {platform}',
  'web.specs.constraint.videoSize.lede':
    'ไฟล์วิดีโอที่ใหญ่ที่สุดที่ {platform} ยอมรับผ่าน API ทางการของมัน อ่านจากชุดข้อมูลที่สร้างขึ้นเดียวกันกับที่ตัวตรวจสอบก่อนโพสต์ใช้วัดไฟล์',
  'web.specs.constraint.videoSize.description':
    'ไฟล์วิดีโอที่ใหญ่ที่สุดที่ {platform} ยอมรับ พร้อมเอกสารทางการที่ตัวเลขนั้นมาจากและวันที่มีคนอ่านเอกสารนั้น',

  'web.specs.constraint.videoLength.name': 'ขีดจำกัดความยาววิดีโอ',
  'web.specs.constraint.videoLength.title': 'ขีดจำกัดความยาววิดีโอของ {platform}',
  'web.specs.constraint.videoLength.lede':
    'วิดีโอที่โพสต์ไปยัง {platform} ผ่าน API ทางการของมันได้รับอนุญาตให้ยาวได้เท่าใด อ่านจากชุดข้อมูลที่สร้างขึ้นเดียวกันกับที่ตัวตรวจสอบก่อนโพสต์ใช้วัดไฟล์',
  'web.specs.constraint.videoLength.description':
    'วิดีโอที่โพสต์ไปยัง {platform} อาจยาวได้เท่าใด พร้อมเอกสารทางการที่ตัวเลขนั้นมาจากและวันที่มีคนอ่านเอกสารนั้น',

  'web.specs.constraint.imageCount.name': 'จำนวนภาพต่อโพสต์',
  'web.specs.constraint.imageCount.title': 'จำนวนภาพต่อโพสต์ของ {platform}',
  'web.specs.constraint.imageCount.lede':
    'จำนวนภาพที่ {platform} ยอมรับในหนึ่งโพสต์ผ่าน API ทางการของมัน อ่านจากชุดข้อมูลที่สร้างขึ้นเดียวกันกับที่ตัวตรวจสอบก่อนโพสต์ใช้วัดฉบับร่าง',
  'web.specs.constraint.imageCount.description':
    'มีภาพกี่ภาพที่ใส่ได้ในหนึ่งโพสต์บน {platform} พร้อมเอกสารทางการที่ตัวเลขนั้นมาจากและวันที่มีคนอ่านเอกสารนั้น',

  'web.specs.constraint.altTextLimit.name': 'ขีดจำกัดข้อความแสดงแทน',
  'web.specs.constraint.altTextLimit.title': 'ขีดจำกัดข้อความแสดงแทนของ {platform}',
  'web.specs.constraint.altTextLimit.lede':
    'ข้อความแสดงแทนที่ยาวที่สุดที่ {platform} ยอมรับสำหรับภาพที่แนบมาผ่าน API ทางการของมัน อ่านจากชุดข้อมูลที่สร้างขึ้นเดียวกันกับที่ตัวตรวจสอบก่อนโพสต์ใช้วัดฉบับร่าง',
  'web.specs.constraint.altTextLimit.description':
    'เพดานข้อความแสดงแทนที่ {platform} บังคับใช้กับภาพที่แนบมา พร้อมเอกสารทางการที่ตัวเลขนั้นมาจากและวันที่มีคนอ่านเอกสารนั้น',

  'web.specs.constraint.fileTypes.name': 'ประเภทไฟล์ที่รองรับ',
  'web.specs.constraint.fileTypes.title': 'ประเภทไฟล์ที่ {platform} รองรับ',
  'web.specs.constraint.fileTypes.lede':
    'ประเภทสื่อที่ {platform} ยอมรับผ่าน API ทางการของมัน อ่านจากชุดข้อมูลที่สร้างขึ้นเดียวกันกับที่ตัวตรวจสอบก่อนโพสต์ใช้วัดไฟล์',
  'web.specs.constraint.fileTypes.description':
    'ประเภทสื่อใดบ้างที่ {platform} ยอมรับ พร้อมเอกสารทางการที่รายการนั้นมาจากและวันที่มีคนอ่านเอกสารนั้น',
} as const;
