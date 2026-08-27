/**
 * The in-page product demonstration: the hero demonstration on the home page
 * and the guided walkthrough at `/demo`.
 *
 * Rules that bind this file specifically:
 *
 *  - Every panel on those surfaces is built from the real design system, so a
 *    reader is looking at the interface rather than at a drawing of it. The
 *    copy must therefore never describe something the interface does not do.
 *  - The content is sample content for a company that does not exist, and it
 *    says so in words, in the caption a screen reader reads with the figure.
 *  - No number here is an engagement number. There is no follower count, no
 *    reach figure and no score, because the product has no such data and a
 *    demonstration that invents one is a fabricated dashboard.
 *  - Nothing publishes today. No connector has passed provider verification,
 *    so the demonstration stops at the point the product stops: a scheduled
 *    post, an approval, and a receipt whose publishing half is unavailable.
 *  - The demonstration submits nothing. It has no form, no destination and no
 *    account behind it, and the copy must not suggest otherwise.
 */
export const webDemoMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata and navigation                                                 */
  /* ---------------------------------------------------------------------- */

  'web.meta.demo.title': 'ดูวิธีการทำงานของ Post Array',
  'web.meta.demo.description':
    'ทัวร์แนะนำขั้นตอนการเผยแพร่ ตั้งแต่โปรเจกต์ใหม่ไปจนถึงใบเสร็จ แสดงในอินเทอร์เฟซจริงพร้อมเนื้อหาตัวอย่าง ยังไม่มีอะไรเผยแพร่ในตอนนี้ และทัวร์นี้บอกว่าเส้นแบ่งนั้นอยู่ตรงไหน',

  'web.demo.nav.label': 'ดูมันทำงาน',
  'web.demo.nav.summary':
    'ทัวร์แนะนำผลิตภัณฑ์ตามลำดับที่คุณจะพบมัน สร้างจากอินเทอร์เฟซจริงพร้อมเนื้อหาตัวอย่าง',

  /* ---------------------------------------------------------------------- */
  /* The frame every demonstration panel sits in                             */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': 'การสาธิต',
  'web.demo.frame.sample':
    'การสาธิตที่สร้างจากอินเทอร์เฟซจริง เต็มไปด้วยเนื้อหาตัวอย่างสำหรับบริษัทที่ไม่มีอยู่จริง ไม่ใช่บัญชีจริง ไม่มีสิ่งใดที่นี่ส่งอะไรออกไป',

  'web.demo.control.pause': 'หยุดการสาธิตชั่วคราว',
  'web.demo.control.play': 'เล่นการสาธิต',
  'web.demo.control.replay': 'เล่นการสาธิตอีกครั้ง',

  /* ---------------------------------------------------------------------- */
  /* The home page hero demonstration                                        */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.viewCta': 'ดูเดโม',
  'web.demo.hero.projectsLine':
    'บัญชีเดียวดูแลได้หลายธุรกิจ แต่ละโปรเจ็กต์คือธุรกิจของตัวเอง มีบัญชีที่เชื่อมต่อ ปฏิทิน และการอนุมัติเป็นของตัวเอง และคุณสลับระหว่างกันได้จากเมนูเดียว เหมือนสลับพร็อพเพอร์ตี้ในคอนโซลการค้นหา',
  'web.demo.hero.projectsChip': '{count, plural, other {# บัญชี}}',
  'web.demo.hero.caption':
    'ฉบับร่างหนึ่งฉบับกลายเป็นหนึ่งเวอร์ชันต่อแพลตฟอร์ม ได้เวลาหนึ่ง และปรากฏบนสัปดาห์นั้น เนื้อหาตัวอย่าง ไม่ใช่บัญชีจริง',
  'web.demo.hero.more': 'ดูขั้นตอนการทำงานทั้งหมด',

  /* ---------------------------------------------------------------------- */
  /* The walkthrough page                                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': 'มันทำงานอย่างไร ตามลำดับที่คุณจะพบมัน',
  'web.demo.lede':
    'เก้าขั้นตอน จากพื้นที่ทำงานที่ว่างเปล่าไปจนถึงบันทึกสิ่งที่เกิดขึ้น แต่ละขั้นตอนแสดงพื้นผิวที่คุณจะเห็นจริง ๆ พร้อมเนื้อหาตัวอย่างอยู่ในนั้น ไม่มีอะไรบนหน้านี้เคลื่อนไหวเอง คุณจึงอ่านได้ตามจังหวะของคุณเอง',
  'web.demo.notice.title': 'นี่คือการสาธิต ไม่ใช่บัญชีจริง',
  'web.demo.notice.body':
    'ทุกแผงที่นี่คืออินเทอร์เฟซของผลิตภัณฑ์พร้อมเนื้อหาตัวอย่างอยู่ในนั้น ยังไม่มีการเชื่อมต่อใดผ่านการยืนยันจากผู้ให้บริการ จึงยังไม่มีอะไรถูกเผยแพร่ไปยังแพลตฟอร์มใดผ่านผลิตภัณฑ์นี้ในวันนี้ ตรงไหนที่ขั้นตอนหยุด หน้านี้จะบอกแทนที่จะวาดต่อ',
  'web.demo.contents.title': 'เก้าขั้นตอน',
  'web.demo.stepLabel': 'ขั้นตอนที่ {position} จาก {total}',
  'web.demo.next': 'ถัดไป: {step}',
  'web.demo.closing.pricing': 'ดูราคา',
  'web.demo.closing.title': 'นั่นคือวงจรทั้งหมด',
  'web.demo.closing.body':
    'ไม่มีอะไรข้างต้นเป็นแบบจำลองของผลิตภัณฑ์ที่เราหวังจะสร้าง มันคืออินเทอร์เฟซตามที่เป็นอยู่จริง โดยระบุครึ่งด้านการเผยแพร่อย่างตรงไปตรงมาว่ายังไม่เสร็จสมบูรณ์',

  /* ---------------------------------------------------------------------- */
  /* The nine steps                                                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': 'สร้างโปรเจกต์',
  'web.demo.step.project.body':
    'โปรเจกต์หนึ่งเก็บบัญชี ฉบับร่าง การอนุมัติ และเขตเวลา ทุกการสืบค้นในผลิตภัณฑ์นี้ถูกจำกัดขอบเขตให้อยู่ในโปรเจกต์เดียว ทั้งในบริการแอปพลิเคชันและอีกครั้งในฐานข้อมูล ดังนั้นลูกค้ารายหนึ่งจึงไม่มีทางเห็นลูกค้าอีกรายโดยไม่ตั้งใจ',

  'web.demo.step.connect.title': 'เชื่อมต่อบัญชี',
  'web.demo.step.connect.body':
    'การเชื่อมต่อทำผ่าน API ทางการของแพลตฟอร์มเท่านั้น และจะบอกคุณว่าแพลตฟอร์มต้องการอะไรจากบัญชีก่อนที่คุณจะเริ่ม วันนี้การเชื่อมต่อทุกตัวหยุดอยู่ที่ขั้นตอนการยืนยัน นั่นคือเหตุผลที่แต่ละแถวด้านล่างระบุไว้เช่นนั้นแทนที่จะแสดงเครื่องหมายถูกสีเขียว',

  'web.demo.step.compose.title': 'เขียนครั้งเดียว ปรับให้เหมาะกับแต่ละแพลตฟอร์ม',
  'web.demo.step.compose.body':
    'คุณเขียนฉบับร่างต้นแบบ การเลือกบัญชีหนึ่งจะเปิดการปรับแก้เฉพาะสำหรับบัญชีนั้นเท่านั้น พร้อมขีดจำกัดของตัวเองและตัวอย่างของตัวเอง ไม่มีสิ่งใดที่คุณเขียนสำหรับ LinkedIn เปลี่ยนสิ่งที่ X ได้รับ และการตรวจสอบใต้แต่ละเวอร์ชันจะทำงานก่อนที่จะกำหนดเวลาอะไรเลย',

  'web.demo.step.variants.title': 'ดูสิ่งที่แต่ละบัญชีได้รับจริง ๆ',
  'web.demo.step.variants.body':
    'ฉบับร่างหนึ่งฉบับกลายเป็นหนึ่งเวอร์ชันต่อบัญชี แต่ละเวอร์ชันเขียนขึ้นสำหรับแพลตฟอร์มที่มันไปถึง: ข้อความสั้นกว่าสำหรับ X บันทึกการเปิดตัวฉบับเต็มสำหรับ LinkedIn คำบรรยายและข้อความแสดงแทนสำหรับ Instagram คุณแก้ไขเวอร์ชันใดก็ได้โดยไม่กระทบเวอร์ชันอื่น และแต่ละเวอร์ชันพกการตรวจสอบที่ใช้กับมันไปด้วย',

  'web.demo.step.schedule.title': 'ให้เวลามัน หรือส่งให้คิว',
  'web.demo.step.schedule.body':
    'เวลาหนึ่งถูกเก็บเป็นช่วงเวลาบวกเขตเวลาของโปรเจกต์ ไม่เคยเป็นเวลาท้องถิ่นเปล่า ๆ ดังนั้นการเปลี่ยนเวลาตามฤดูกาลจะไม่ทำให้อะไรขยับใต้คุณ คิวคือเส้นทางอีกแบบหนึ่ง: มันเลือกช่วงเวลาถัดไปที่กฎของคุณอนุญาต',

  'web.demo.step.calendar.title': 'เฝ้าดูปฏิทิน',
  'web.demo.step.calendar.body':
    'สัปดาห์แสดงแพลตฟอร์ม บัญชี สถานะ และเวลาของแต่ละโพสต์ การย้ายโพสต์หนึ่งทำได้ทั้งด้วยปุ่มและการลากวาง ปฏิทินจึงใช้งานได้เต็มที่จากแป้นพิมพ์',

  'web.demo.step.receipt.title': 'อ่านใบเสร็จภายหลัง',
  'web.demo.step.receipt.body':
    'ทุกความพยายามเขียนใบเสร็จที่แก้ไขไม่ได้หนึ่งใบ: ใครเขียนมัน ใครอนุมัติมัน ภายใต้นโยบายใด ในช่วงเวลาใด ครึ่งด้านการเผยแพร่ของบันทึกนั้นถูกเขียนโดยการรันการเผยแพร่ ซึ่งเป็นส่วนที่ยังไม่มีอยู่จริง',

  /* ---------------------------------------------------------------------- */
  /* Panel labels                                                            */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': 'โปรเจกต์',
  'web.demo.project.zone': 'เขตเวลา: {zone}',
  'web.demo.project.scope': 'ฉบับร่าง บัญชี การอนุมัติ และใบเสร็จเป็นของโปรเจกต์นี้และไม่มีที่อื่น',

  'web.demo.accounts.label': 'บัญชีในโปรเจกต์นี้',
  'web.demo.accounts.state': 'การยืนยันยังไม่เสร็จสิ้น',
  'web.demo.accounts.note':
    'แต่ละแถวจะพกสถานะโทเคน สิทธิ์ที่ได้รับ และการโพสต์ที่สำเร็จครั้งล่าสุด ไม่มีแถวใดในนั้นเผยแพร่ได้ในวันนี้',

  'web.demo.master.label': 'ฉบับร่างต้นแบบ',
  'web.demo.master.project': 'ในโปรเจกต์ {project}',

  'web.demo.variants.label': 'สิ่งที่แต่ละบัญชีได้รับ',

  'web.demo.schedule.label': 'กำหนดเวลาแล้ว',
  'web.demo.schedule.value': '{when} ตามเขตเวลา {zone}',
  'web.demo.schedule.approval': 'ต้องมีการอนุมัติหนึ่งครั้งก่อนที่จะส่งอะไรออกไปได้',
  'web.demo.schedule.queue':
    'คิวคือเส้นทางอีกแบบหนึ่ง: มันเลือกช่วงเวลาถัดไปที่กฎของคุณอนุญาต ตามเขตเวลานี้',

  'web.demo.week.label': 'สัปดาห์นี้',
  'web.demo.week.caption': 'สามโพสต์เดียวกันบนปฏิทิน อ่านตามเขตเวลาของโปรเจกต์',
  'web.demo.week.empty': 'ยังไม่มีอะไรกำหนดเวลา',

  'web.demo.receipt.label': 'ใบเสร็จจนถึงตอนนี้',
  'web.demo.receipt.pending':
    'สิ่งที่ถูกส่งออกไป แพลตฟอร์มตอบว่าอย่างไร รหัสโพสต์ภายนอก และลิงก์ถาวร ล้วนถูกเขียนโดยการรันการเผยแพร่ สิ่งเหล่านี้ยังคงไม่พร้อมใช้งานจนกว่าการเชื่อมต่อหนึ่งจะผ่านการยืนยันจากผู้ให้บริการ',
  'web.demo.receipt.field.externalId': 'รหัสโพสต์ภายนอก',
  'web.demo.receipt.field.permalink': 'ลิงก์ถาวร',

  /* ---------------------------------------------------------------------- */
  /* Sample content                                                          */
  /*                                                                         */
  /* Northbound Tools is the sample company the marketing pages already use.  */
  /* Its handles sit on the reserved `.example` domain and its people are     */
  /* first names with no surname, so nothing here can be mistaken for a real  */
  /* customer, a real account or a real endorsement.                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools (ตัวอย่าง)',
  'web.demo.sample.actor': 'Ada สมาชิกทีมตัวอย่าง',
  'web.demo.sample.approver': 'Ravi ผู้ตรวจทานตัวอย่าง',
  'web.demo.sample.policy': 'ต้องมีการอนุมัติหนึ่งครั้งก่อนส่ง',
  'web.demo.sample.master':
    'Northbound 2.4 เปิดตัวแล้ววันนี้ การนำเข้าเร็วขึ้น การค้นหามีปุ่มลัดแป้นพิมพ์ และข้อบกพร่องเรื่องการส่งออกที่สองท่านรายงานได้รับการแก้ไขแล้ว',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'Northbound 2.4 เปิดตัวแล้ว การนำเข้าเร็วขึ้น การค้นหาด้วยปุ่มลัด และข้อบกพร่องเรื่องการส่งออกนั้นได้รับการแก้ไขแล้ว',
  'web.demo.sample.x.check': 'จำนวนตัวอักษรและลำดับของชุดโพสต์',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    'Northbound 2.4 เปิดตัวแล้ววันนี้ บันทึกการเปิดตัวอธิบายการเปลี่ยนแปลงด้านการนำเข้าและการแก้ไขการส่งออกโดยละเอียด',
  'web.demo.sample.linkedin.check': 'บทบาทองค์กรและความยาวโพสต์',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    'ภาพเปิดตัวเดียวกัน พร้อมคำบรรยายที่เขียนสำหรับฟีดและข้อความแสดงแทนที่เขียนโดยคน',
  'web.demo.sample.instagram.check': 'ประเภทบัญชี สัดส่วนภาพ และข้อความแสดงแทน',

  /* ---------------------------------------------------------------------- */
  /* The nine scene product tour                                             */
  /*                                                                         */
  /* The step names are the indicator's button labels, so they are short      */
  /* enough to sit in a row of nine and specific enough to be worth clicking. */
  /* They are also the labels of the stacked walkthrough a reader gets with   */
  /* reduced motion or no JavaScript, which is the same tour with the timing  */
  /* taken out rather than a reduced version of it.                           */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': 'ขั้นตอนของทัวร์',
  'web.demo.tour.jump': 'แสดงขั้นตอนที่ {position}: {step}',
  'web.demo.tour.step.project': 'สร้างโปรเจกต์',
  'web.demo.tour.step.connect': 'เชื่อมต่อบัญชี',
  'web.demo.tour.step.compose': 'เขียนครั้งเดียว',
  'web.demo.tour.step.variants': 'ปรับให้เหมาะกับแต่ละแพลตฟอร์ม',
  'web.demo.tour.step.validate': 'ตรวจสอบมัน',
  'web.demo.tour.step.schedule': 'ให้เวลามัน',
  'web.demo.tour.step.week': 'ดูสัปดาห์นี้',
  'web.demo.tour.step.publish': 'เผยแพร่และบันทึก',
  'web.demo.tour.step.digest': 'อ่านสรุปประจำสัปดาห์',

  /* ---------------------------------------------------------------------- */
  /* Checks (step 5)                                                         */
  /*                                                                         */
  /* Only checks the composer genuinely runs today: the per account character */
  /* limit (`validation.text_too_long`), alt text on every image             */
  /* (`validation.alt_text_missing`), and whether a first comment is allowed  */
  /* on the account it was written for (the `firstComment` capability).       */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': 'การตรวจสอบก่อนกำหนดเวลา',
  'web.demo.validate.check.length': 'ขีดจำกัดตัวอักษร แยกตามบัญชี',
  'web.demo.validate.check.lengthDetail':
    'แต่ละเวอร์ชันถูกวัดเทียบกับขีดจำกัดที่แพลตฟอร์มให้กับบัญชีนั้น',
  'web.demo.validate.check.altText': 'ข้อความแสดงแทนทุกภาพ',
  'web.demo.validate.check.altTextDetail':
    'ภาพที่ไม่มีคำอธิบาย หรือไม่ได้ทำเครื่องหมายว่าเป็นการตกแต่ง จะหยุดการกำหนดเวลา',
  'web.demo.validate.check.firstComment': 'ความคิดเห็นแรกที่อนุญาตที่นี่',
  'web.demo.validate.check.firstCommentDetail':
    'ความคิดเห็นแรกจะเสนอให้เฉพาะบัญชีที่แพลตฟอร์มของบัญชีนั้นรองรับเท่านั้น',
  'web.demo.validate.note':
    'สิ่งเหล่านี้ทำงานในตัวเขียนโพสต์ก่อนที่จะกำหนดเวลาอะไรเลย และอีกครั้งก่อนที่จะส่งอะไรออกไป',

  /* ---------------------------------------------------------------------- */
  /* Publish and receipt (step 8)                                            */
  /*                                                                         */
  /* The steps a scheduled post has really passed are completed. Everything   */
  /* the publish run would write is pending, because no connector has passed  */
  /* provider verification, so there is no publish run to write it.           */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': 'การเผยแพร่และบันทึกของมัน',
  'web.demo.live.step.approved': 'อนุมัติโดย {approver}',
  'web.demo.live.step.queued': 'เข้าคิวสำหรับช่วงเวลาของมันแล้ว',
  'web.demo.live.step.sent': 'ส่งไปยังแพลตฟอร์มแล้ว',
  'web.demo.live.step.confirmed': 'แพลตฟอร์มยืนยันแล้ว',
  'web.demo.live.badge.pending': 'ยังไม่เผยแพร่',
  'web.demo.live.badge.live': 'เผยแพร่แล้ว',
  'web.demo.live.pending':
    'สองขั้นตอนสุดท้ายถูกเขียนโดยการรันการเผยแพร่ ยังไม่มีการเชื่อมต่อใดผ่านการยืนยันจากผู้ให้บริการ จึงยังคงค้างอยู่ และรหัสโพสต์ภายนอกกับลิงก์ถาวรก็ยังไม่พร้อมใช้งาน',

  /* ---------------------------------------------------------------------- */
  /* The weekly digest (step 9)                                              */
  /*                                                                         */
  /* Sentences about what the product did, never engagement figures. There is */
  /* no reach, no impression count and no score here, because the product has */
  /* none to read and a digest that invented one would be a fabricated        */
  /* dashboard with a friendlier voice.                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': 'สัปดาห์ของคุณ เป็นประโยค',
  'web.demo.digest.sample': 'ตัวอย่าง',
  'web.demo.digest.line.variants': 'สามเวอร์ชันเฉพาะแพลตฟอร์มถูกส่งออกจากฉบับร่างเดียวในสัปดาห์นี้',
  'web.demo.digest.line.earliest': 'เช้าวันอังคารคือช่วงเวลาแรกสุดของคุณ',
  'web.demo.digest.line.approval': 'ทุกเวอร์ชันได้รับการอนุมัติก่อนเข้าคิว',
  'web.demo.digest.line.alt': 'ทุกภาพพกข้อความแสดงแทนที่เขียนโดยคน',
  'web.demo.digest.footer': 'การวิเคราะห์แบบสดจะปรากฏที่นี่เมื่อโพสต์ของคุณเผยแพร่',

  /* ---------------------------------------------------------------------- */
  /* The three added walkthrough steps                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': 'ตรวจสอบก่อนกำหนดเวลา',
  'web.demo.step.validate.body':
    'ตัวเขียนโพสต์วัดแต่ละเวอร์ชันเทียบกับบัญชีที่มันเขียนขึ้นสำหรับ: ขีดจำกัดตัวอักษรจริงของบัญชีนั้น ข้อความแสดงแทนทุกภาพ และแพลตฟอร์มเปิดให้มีความคิดเห็นแรกหรือไม่ เวอร์ชันที่ไม่ผ่านการตรวจสอบจะกำหนดเวลาไม่ได้',

  'web.demo.step.publish.title': 'เผยแพร่ และเก็บบันทึกไว้',
  'web.demo.step.publish.body':
    'การรันการเผยแพร่จะส่งแต่ละเวอร์ชันตามช่วงเวลาของมัน บันทึกสิ่งที่แพลตฟอร์มตอบกลับ และเขียนใบเสร็จที่แก้ไขไม่ได้หนึ่งใบ การรันนั้นเป็นส่วนที่ยังไม่มีอยู่จริง สองขั้นตอนสุดท้ายด้านล่างจึงค้างอยู่แทนที่จะถูกวาดว่าเสร็จสมบูรณ์',

  'web.demo.step.digest.title': 'อ่านสรุปประจำสัปดาห์',
  'web.demo.step.digest.body':
    'สรุปนี้อธิบายสิ่งที่ผลิตภัณฑ์ทำเป็นประโยค: กี่เวอร์ชันถูกส่งออกจากฉบับร่างเดียว ช่วงเวลาใดเร็วที่สุด อะไรได้รับการอนุมัติ มันไม่พกตัวเลขการมีส่วนร่วมใด เพราะการวิเคราะห์มาจากแพลตฟอร์มหลังจากโพสต์เผยแพร่แล้ว และยังไม่มีอะไรเผยแพร่เลย',
} as const;
