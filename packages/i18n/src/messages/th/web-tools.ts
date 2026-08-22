/**
 * The free tools on the public site.
 *
 * These pages exist because this repository already knows every launch cohort
 * platform's real publishing limits from its connector capability code. A tool
 * here may therefore state a number, but only a number the generated dataset
 * carries, always beside the official source and the date a person read it.
 *
 * Rules that bind this file specifically:
 *
 *  - A tool never claims the product publishes anywhere. Nothing in the launch
 *    cohort is verified for production yet, and these pages say so.
 *  - Every calculation described here runs in the reader's browser. Copy that
 *    promises privacy must stay true of the component that renders it.
 *  - No tool writes, rewrites, suggests or scores content. No tool looks up a
 *    handle, a follower count or anything else that would need an unofficial
 *    endpoint.
 *  - A limit we do not have is "unavailable". Never zero, never a guess.
 */
export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': 'เครื่องมือเผยแพร่ฟรี',
  'web.meta.tools.description':
    'เครื่องมือขนาดเล็กและเป็นส่วนตัวสำหรับผู้ที่โพสต์ในหลายแพลตฟอร์ม: การตรวจสอบขีดจำกัดของแต่ละแพลตฟอร์ม เครื่องมือสร้าง UTM การตรวจสอบความยาวชื่อวิดีโอ YouTube และตัววางแผนเขตเวลา',
  'web.meta.tools.preflight.title': 'ตัวตรวจสอบก่อนโพสต์',
  'web.meta.tools.preflight.description':
    'ตรวจสอบฉบับร่างหนึ่งฉบับเทียบกับขีดจำกัดข้อความและสื่อของสิบแพลตฟอร์ม พร้อมแหล่งที่มาและวันที่แต่ละขีดจำกัดถูกอ่าน',
  'web.meta.tools.utm.title': 'เครื่องมือสร้างลิงก์ UTM',
  'web.meta.tools.utm.description':
    'สร้าง URL แคมเปญที่ติดแท็กและดูความหมายของแต่ละพารามิเตอร์ UTM ทำงานทั้งหมดในเบราว์เซอร์ของคุณ',
  'web.meta.tools.youtubeTitle.title': 'ตัวตรวจสอบความยาวชื่อวิดีโอ YouTube',
  'web.meta.tools.youtubeTitle.description':
    'วัดชื่อวิดีโอ YouTube เทียบกับเพดานที่บันทึกในเอกสาร นับตามวิธีที่คนนับตัวอักษร',
  'web.meta.tools.timeZone.title': 'ตัววางแผนเขตเวลาและการปรับเวลาตามฤดูกาล',
  'web.meta.tools.timeZone.description':
    'ดูเวลาโพสต์เดียวกันในหลายเขตเวลาของกลุ่มเป้าหมาย และหาสัปดาห์ที่การเปลี่ยนเวลาตามฤดูกาลทำให้ชั่วโมงท้องถิ่นขยับ',
  'web.meta.tools.engagementRate.title': 'เครื่องคำนวณอัตราการมีส่วนร่วม',
  'web.meta.tools.engagementRate.description':
    'หารการมีส่วนร่วมด้วยการเข้าถึง ผู้ติดตาม หรือการแสดงผล การคำนวณธรรมดาสามแบบ ไม่มีเกณฑ์ที่สร้างขึ้นเอง',

  /* ---------------------------------------------------------------------- */
  /* Shared tool furniture                                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'เครื่องมือฟรี',
  'web.tools.index.summary':
    'เครื่องคำนวณขนาดเล็กที่สร้างจากข้อมูลขีดจำกัดแพลตฟอร์มชุดเดียวกับที่การเชื่อมต่อของเราใช้อ่าน',
  'web.tools.index.lede':
    'เครื่องมือขนาดเล็กสี่ชิ้น สร้างจากข้อมูลขีดจำกัดแพลตฟอร์มชุดเดียวกับที่การเชื่อมต่อของเราใช้ ไม่ต้องมีบัญชี ไม่ต้องอัปโหลด ไม่มีการติดตามสิ่งที่คุณพิมพ์',
  'web.tools.index.dataTitle': 'ตัวเลขเหล่านี้มาจากไหน',
  'web.tools.index.dataBody':
    'แต่ละขีดจำกัดถูกสร้างขึ้นจากโค้ดความสามารถของการเชื่อมต่อในที่เก็บโค้ดนี้ และแต่ละแถวแพลตฟอร์มมาพร้อมหน้าเอกสารทางการที่มันมาจากและวันที่มีคนอ่านหน้านั้น',
  'web.tools.index.honesty':
    'เครื่องมือเหล่านี้ไม่เผยแพร่อะไรทั้งสิ้น ยังไม่มีการเชื่อมต่อใดผ่านการยืนยันจากผู้ให้บริการ จึงยังไม่มีอะไรที่นี่เชื่อมต่อบัญชี',
  'web.tools.shared.privacyTitle': 'เครื่องมือนี้ทำงานในเบราว์เซอร์ของคุณ',
  'web.tools.shared.privacyBody':
    'ทุกอย่างที่คุณพิมพ์จะอยู่บนหน้านี้เท่านั้น ไม่มีคำขอไปยังเซิร์ฟเวอร์ ไม่มีการจัดเก็บ และไม่มีเหตุการณ์วิเคราะห์ใดที่นำข้อความของคุณไปด้วย',
  'web.tools.shared.sourceLink': 'เอกสารแพลตฟอร์ม',
  'web.tools.shared.sourceRead': 'อ่านเมื่อ {date}',
  'web.tools.shared.unavailable': 'ไม่พร้อมใช้งาน',
  'web.tools.shared.unavailableWhy':
    'เรายังไม่มีการเชื่อมต่อสำหรับแพลตฟอร์มนี้ จึงยังไม่มีขีดจำกัดที่ยืนยันแล้วให้แสดง เราขอไม่พูดอะไรดีกว่าเดามั่ว',
  'web.tools.shared.copy': 'คัดลอก',
  'web.tools.shared.copied': 'คัดลอกแล้ว',
  'web.tools.shared.copyFailed': 'เบราว์เซอร์ของคุณบล็อกการคัดลอก ให้เลือกข้อความแล้วคัดลอกเอง',
  'web.tools.shared.faqTitle': 'คำถาม',
  'web.tools.shared.baselineTitle': 'ตัวเลขเหล่านี้อธิบายบัญชีแบบไหน',
  'web.tools.shared.baselineBody':
    'กรณีที่ระมัดระวังที่สุด: บัญชีที่เพิ่งเชื่อมต่อโดยไม่มีสิทธิ์ที่ยกระดับ บางแพลตฟอร์มยกเพดานขึ้นเมื่อช่องทางหรือธุรกิจได้รับการยืนยัน และในกรณีนั้นหน้าจะระบุไว้',
  'web.tools.shared.otherTools': 'เครื่องมืออื่น',

  /* ---------------------------------------------------------------------- */
  /* Tool names and one line summaries, shared by the index and the footer   */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'ตัวตรวจสอบก่อนโพสต์',
  'web.tools.preflight.summary':
    'ฉบับร่างหนึ่งฉบับ ตรวจสอบเทียบกับขีดจำกัดข้อความและสื่อของสิบแพลตฟอร์มพร้อมกัน',
  'web.tools.utm.name': 'เครื่องมือสร้างลิงก์ UTM',
  'web.tools.utm.summary': 'สร้าง URL แคมเปญที่ติดแท็กโดยไม่ทำลายสตริงการสืบค้นที่มีอยู่แล้ว',
  'web.tools.youtubeTitle.name': 'ตัวตรวจสอบความยาวชื่อวิดีโอ YouTube',
  'web.tools.youtubeTitle.summary': 'วัดชื่อเรื่องตามวิธีที่คนนับตัวอักษร',
  'web.tools.timeZone.name': 'ตัววางแผนเขตเวลาและการปรับเวลาตามฤดูกาล',
  'web.tools.timeZone.summary':
    'เวลาโพสต์เดียวกันในหลายเขตเวลาของกลุ่มเป้าหมาย พร้อมทำเครื่องหมายการเปลี่ยนเวลาตามฤดูกาล',
  'web.tools.engagementRate.name': 'เครื่องคำนวณอัตราการมีส่วนร่วม',
  'web.tools.engagementRate.summary':
    'การมีส่วนร่วมหารด้วยการเข้าถึง ผู้ติดตาม หรือการแสดงผล ไม่มีการค้นหาใด ไม่มีการเทียบเกณฑ์ใด',

  /* ---------------------------------------------------------------------- */
  /* Post preflight checker                                                  */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'ตัวตรวจสอบก่อนโพสต์',
  'web.tools.preflight.lede':
    'วางฉบับร่าง เลือกแพลตฟอร์มที่คุณโพสต์ และดูว่าแพลตฟอร์มใดจะปฏิเสธมันก่อนที่คุณจะรู้จากข้อผิดพลาดของ API',
  'web.tools.preflight.explainer.title': 'ทำไมตัวนับตัวอักษรอย่างเดียวยังไม่พอ',
  'web.tools.preflight.explainer.body':
    'แต่ละแพลตฟอร์มไม่เห็นตรงกันว่าตัวอักษรคืออะไร บางแพลตฟอร์มนับเป็นหน่วยรหัส ทำให้อิโมจิหนึ่งตัวมีค่าเป็นสอง บางแพลตฟอร์มนับเป็นกราฟีม ทำให้ธงหรืออิโมจิครอบครัวมีค่าเป็นหนึ่ง บางแพลตฟอร์มเขียนลิงก์ทุกอันใหม่ให้มีความยาวคงที่ ทำให้ URL 200 ตัวอักษรมีค่าเท่ากับ URL 20 ตัวอักษร เครื่องมือนี้ใช้กฎของแต่ละแพลตฟอร์มแยกกัน',
  'web.tools.preflight.explainer.counting':
    'ฉบับร่างถูกวัดด้วยตัวแบ่งส่วน Intl ของเบราว์เซอร์ ซึ่งแบ่งข้อความออกเป็นหน่วยที่ผู้อ่านจะเรียกว่าตัวอักษร แล้วจึงปรับตามกฎของแต่ละแพลตฟอร์ม',
  'web.tools.preflight.field.draft.label': 'ฉบับร่างของคุณ',
  'web.tools.preflight.field.draft.help':
    'วางเนื้อหาโพสต์ ลิงก์จะถูกตรวจจับโดยอัตโนมัติเพื่อให้คำนวณค่าใช้จ่ายตามแต่ละแพลตฟอร์มได้',
  'web.tools.preflight.field.platforms.label': 'แพลตฟอร์มที่จะตรวจสอบ',
  'web.tools.preflight.field.platforms.help': 'เลือกได้มากเท่าที่คุณโพสต์',
  'web.tools.preflight.field.mediaKind.label': 'สื่อที่แนบมา',
  'web.tools.preflight.field.mediaKind.none': 'ไม่มีสื่อ',
  'web.tools.preflight.field.mediaKind.image': 'ภาพ',
  'web.tools.preflight.field.mediaKind.video': 'วิดีโอหนึ่งคลิป',
  'web.tools.preflight.field.mediaCount.label': 'จำนวนภาพ',
  'web.tools.preflight.field.byteSize.label': 'ขนาดไฟล์ เป็นเมกะไบต์',
  'web.tools.preflight.field.byteSize.help': 'ไฟล์เดี่ยวที่ใหญ่ที่สุด เว้นว่างเพื่อข้าม',
  'web.tools.preflight.field.duration.label': 'ความยาววิดีโอ เป็นวินาที',
  'web.tools.preflight.field.duration.help': 'เว้นว่างเพื่อข้ามการตรวจสอบความยาว',
  'web.tools.preflight.field.width.label': 'ความกว้างของสื่อ เป็นพิกเซล',
  'web.tools.preflight.field.height.label': 'ความสูงของสื่อ เป็นพิกเซล',
  'web.tools.preflight.field.dimensions.help':
    'ไม่บังคับ ใช้เพียงเพื่อแสดงสัดส่วนภาพที่คุณจะเผยแพร่',
  'web.tools.preflight.results.title': 'ผลลัพธ์แยกตามแพลตฟอร์ม',
  'web.tools.preflight.results.empty': 'เลือกอย่างน้อยหนึ่งแพลตฟอร์มเพื่อดูผลลัพธ์',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {ไม่มีอะไรถูกบล็อก} other {# รายการจะล้มเหลว}}, {warning, plural, =0 {ไม่มีคำเตือน} other {# รายการที่ควรดู}}',
  'web.tools.preflight.status.pass': 'พอดี',
  'web.tools.preflight.status.warning': 'ควรตรวจสอบ',
  'web.tools.preflight.status.fail': 'จะล้มเหลว',
  'web.tools.preflight.status.unavailable': 'ไม่พร้อมใช้งาน',
  'web.tools.preflight.count.label':
    '{count} จาก {limit} {unit, select, grapheme {ตัวอักษร} utf16 {หน่วยรหัส} weighted {ตัวอักษรถ่วงน้ำหนัก} other {ตัวอักษร}}',
  'web.tools.preflight.finding.textOver': 'เกินขีดจำกัดไป {over, plural, other {# ตัวอักษร}}',
  'web.tools.preflight.finding.textNear': 'เหลืออีก {remaining} ตัวอักษรก่อนถึงขีดจำกัด',
  'web.tools.preflight.finding.textFits': 'เนื้อหาพอดี',
  'web.tools.preflight.finding.linkFixed':
    'ลิงก์ทุกอันจะถูกเขียนใหม่ให้มีความยาวคงที่ ดังนั้นแต่ละอันจึงมีค่า {cost} ตัวอักษรไม่ว่าความยาวจริงจะเป็นเท่าใด',
  'web.tools.preflight.finding.linkActual': 'ลิงก์นับตรงตามจำนวนตัวอักษรที่มันใช้พื้นที่จริง',
  'web.tools.preflight.finding.imagesOver':
    'แพลตฟอร์มนี้รับ {limit, plural, =0 {ภาพไม่ได้เลย} other {# ภาพ}} ในหนึ่งโพสต์',
  'web.tools.preflight.finding.videosOver':
    'แพลตฟอร์มนี้รับ {limit, plural, =0 {วิดีโอไม่ได้เลย} other {# วิดีโอ}} ในหนึ่งโพสต์',
  'web.tools.preflight.finding.bytesOver': 'ไฟล์นี้ใหญ่กว่าเพดาน {limit}',
  'web.tools.preflight.finding.bytesUnknown':
    'ยังไม่มีเพดานขนาดไฟล์ที่เผยแพร่สำหรับสื่อประเภทนี้ จึงยังไม่ได้ตรวจสอบขนาด',
  'web.tools.preflight.finding.durationOver': 'ยาวกว่าเพดาน {limit} วินาที',
  'web.tools.preflight.finding.durationUnder': 'สั้นกว่าขั้นต่ำ {limit} วินาที',
  'web.tools.preflight.finding.durationUnknown':
    'ยังไม่มีเพดานความยาวที่เผยแพร่ จึงยังไม่ได้ตรวจสอบความยาว',
  'web.tools.preflight.finding.altText':
    'ข้อความแสดงแทนรับได้สูงสุด {limit} ตัวอักษร ควรใช้ให้คุ้มค่า',
  'web.tools.preflight.finding.ratio': 'คุณกำลังจะเผยแพร่ที่อัตราส่วนประมาณ {ratio} ต่อ 1',
  'web.tools.preflight.faq.counting.q': 'คุณนับตัวอักษรอย่างไร',
  'web.tools.preflight.faq.counting.a':
    'นับเป็นกราฟีม โดยใช้ตัวแบ่งส่วน Intl ของเบราว์เซอร์ ซึ่งเป็นหน่วยที่ผู้อ่านหมายถึงตัวอักษร ในที่ที่แพลตฟอร์มบันทึกกฎที่แตกต่างออกไป เช่น การนับเป็นหน่วยรหัสหรือคิดค่าคงที่ต่อลิงก์ กฎนั้นจะถูกนำมาใช้เพิ่มเติม',
  'web.tools.preflight.faq.accuracy.q': 'ขีดจำกัดเหล่านี้ทันสมัยแค่ไหน',
  'web.tools.preflight.faq.accuracy.a':
    'แต่ละขีดจำกัดถูกสร้างขึ้นจากโค้ดการเชื่อมต่อในที่เก็บโค้ดของเรา แทนที่จะพิมพ์ลงในหน้าเอง และแต่ละแถวแพลตฟอร์มแสดงเอกสารทางการที่มันมาจากและวันที่มีคนอ่านเอกสารนั้น หากแพลตฟอร์มเปลี่ยนตัวเลข การแก้ไขคือการเปลี่ยนโค้ดเพียงจุดเดียว และเครื่องมือทุกชิ้นที่นี่จะตามทัน',
  'web.tools.preflight.faq.privacy.q': 'ฉบับร่างของฉันถูกอัปโหลดหรือไม่',
  'web.tools.preflight.faq.privacy.a':
    'ไม่ การตรวจสอบทำงานในเบราว์เซอร์ของคุณ ไม่มีคำขอใดนำข้อความของคุณไป ไม่มีการจัดเก็บใด และการปิดแท็บก็เพียงพอที่จะทิ้งมันไป',
  'web.tools.preflight.faq.publish.q': 'เครื่องมือนี้โพสต์ให้ฉันได้ไหม',
  'web.tools.preflight.faq.publish.a':
    'ยังไม่ได้ในวันนี้ ยังไม่มีการเชื่อมต่อใดผ่านการยืนยันจากผู้ให้บริการ จึงยังไม่มีอะไรบนเว็บไซต์นี้เผยแพร่ไปยังแพลตฟอร์มใด หน้านี้เป็นตัวตรวจสอบขีดจำกัด ไม่ใช่ตัวเขียนโพสต์',

  /* ---------------------------------------------------------------------- */
  /* UTM builder                                                             */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'เครื่องมือสร้างลิงก์ UTM',
  'web.tools.utm.lede':
    'เพิ่มพารามิเตอร์แคมเปญลงใน URL โดยไม่สูญเสียสตริงการสืบค้นที่มีอยู่แล้ว และไม่ต้องเดาว่าพารามิเตอร์ไหนหมายถึงอะไร',
  'web.tools.utm.explainer.title': 'แต่ละพารามิเตอร์ใช้ทำอะไร',
  'web.tools.utm.explainer.body':
    'พารามิเตอร์ UTM ถูกอ่านโดยเครื่องมือวิเคราะห์ ไม่ใช่โดยแพลตฟอร์มที่คุณโพสต์ พารามิเตอร์เหล่านี้ติดไปกับ URL ดังนั้นใครก็ตามที่เห็นลิงก์ก็เห็นมันด้วย ควรใช้คำสั้น พิมพ์เล็ก และสม่ำเสมอ เพราะการสะกดสองแบบสำหรับแคมเปญเดียวกันจะกลายเป็นสองแถวในรายงาน',
  'web.tools.utm.field.url.label': 'URL ปลายทาง',
  'web.tools.utm.field.url.help': 'หน้าที่คุณต้องการให้ผู้คนไปถึง รวมทั้ง https',
  'web.tools.utm.field.url.invalid': 'สิ่งนั้นไม่ใช่ URL แบบ http หรือ https ที่ถูกต้อง',
  'web.tools.utm.field.source.label': 'แหล่งที่มาแคมเปญ',
  'web.tools.utm.field.source.help': 'คลิกนั้นมาจากไหน เช่น ชื่อแพลตฟอร์ม',
  'web.tools.utm.field.medium.label': 'ช่องทางแคมเปญ',
  'web.tools.utm.field.medium.help': 'ประเภทของลิงก์ เช่น โซเชียล อีเมล หรือการอ้างอิง',
  'web.tools.utm.field.campaign.label': 'ชื่อแคมเปญ',
  'web.tools.utm.field.campaign.help': 'การเปิดตัว โปรโมชัน หรือธีมที่ลิงก์นี้เป็นของ',
  'web.tools.utm.field.term.label': 'คำสำคัญแคมเปญ',
  'web.tools.utm.field.term.help': 'ไม่บังคับ ตามธรรมเนียมคือคำสำคัญแบบเสียเงิน',
  'web.tools.utm.field.content.label': 'เนื้อหาแคมเปญ',
  'web.tools.utm.field.content.help':
    'ไม่บังคับ แยกลิงก์สองอันที่ไปยังหน้าเดียวกัน เช่น สองเวอร์ชันของโพสต์',
  'web.tools.utm.result.title': 'URL ที่ติดแท็กของคุณ',
  'web.tools.utm.result.empty': 'ป้อน URL ปลายทางเพื่อดูผลลัพธ์',
  'web.tools.utm.result.label': 'URL ที่สร้างขึ้น',
  'web.tools.utm.result.preserved':
    'สตริงการสืบค้นที่มีอยู่แล้วบน URL ของคุณจะถูกเก็บไว้ตรงตามที่คุณพิมพ์',
  'web.tools.utm.result.replaced':
    'URL ของคุณมีพารามิเตอร์เหล่านี้อยู่แล้วตัวหนึ่ง ค่าที่คุณป้อนที่นี่จะแทนที่มัน',
  'web.tools.utm.faq.encoding.q': 'เกิดอะไรขึ้นกับช่องว่างและวรรณยุกต์',
  'web.tools.utm.faq.encoding.a':
    'มันถูกเข้ารหัสแบบเปอร์เซ็นต์ ซึ่งเป็นสิ่งที่ทำให้ลิงก์รอดจากการถูกวางในโพสต์ได้ ช่องว่างจะกลายเป็นเครื่องหมายบวก และตัวอักษรที่มีวรรณยุกต์จะกลายเป็นรูปแบบที่เข้ารหัสแล้ว และเครื่องมือวิเคราะห์จะถอดรหัสทั้งสองกลับ',
  'web.tools.utm.faq.existing.q': 'มันจะทำลาย URL ที่มีพารามิเตอร์อยู่แล้วหรือไม่',
  'web.tools.utm.faq.existing.a':
    'ไม่ พารามิเตอร์ที่มีอยู่จะถูกเก็บไว้ตามลำดับเดิม และมีเพียงพารามิเตอร์ UTM ที่คุณกรอกเท่านั้นที่จะถูกเพิ่มหรือแทนที่ ส่วนแฟรกเมนต์ที่ท้าย URL จะยังอยู่ที่ท้าย',
  'web.tools.utm.faq.privacy.q': 'URL ของฉันถูกส่งไปที่ไหนหรือไม่',
  'web.tools.utm.faq.privacy.a': 'ไม่ URL ถูกสร้างขึ้นในเบราว์เซอร์ของคุณและไม่เคยออกจากหน้านี้',

  /* ---------------------------------------------------------------------- */
  /* YouTube title length checker                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'ตัวตรวจสอบความยาวชื่อวิดีโอ YouTube',
  'web.tools.youtubeTitle.lede':
    'ชื่อเรื่องที่ยาวเกินไปแม้เพียงหนึ่งตัวอักษรจะถูกปฏิเสธตอนอัปโหลด ชื่อเรื่องที่แค่ยาวเฉย ๆ จะถูกตัดตรงจุดที่คุณไม่ได้เลือก',
  'web.tools.youtubeTitle.explainer.title': 'สองขีดจำกัดที่แตกต่างกัน',
  'web.tools.youtubeTitle.explainer.body':
    'เพดานตายตัวคือสิ่งที่ปลายทางการอัปโหลดยอมรับ ส่วนที่ชื่อเรื่องจะถูกแสดงเป็นอีกคำถามหนึ่ง: ผลการค้นหา แถบข้าง และโทรศัพท์ ล้วนตัดชื่อเรื่องที่จุดต่างกัน และไม่มีจุดตัดใดในนั้นถูกเผยแพร่ เครื่องมือนี้ระบุเพดานที่บันทึกในเอกสารและแสดงรูปทรงของชื่อเรื่องคุณ โดยไม่สร้างตัวเลขการตัดทอนขึ้นมาเอง',
  'web.tools.youtubeTitle.field.title.label': 'ชื่อวิดีโอ',
  'web.tools.youtubeTitle.field.title.help': 'นับเป็นกราฟีม ดังนั้นอิโมจิจึงมีค่าเป็นหนึ่ง',
  'web.tools.youtubeTitle.result.count': '{count} จาก {limit} ตัวอักษร',
  'web.tools.youtubeTitle.result.over':
    'เกินไป {over, plural, other {# ตัวอักษร}} การอัปโหลดจะถูกปฏิเสธ',
  'web.tools.youtubeTitle.result.fits': 'อยู่ในเพดานที่บันทึกในเอกสาร',
  'web.tools.youtubeTitle.result.front':
    'ตัวอักษร {count} ตัวแรกมีน้ำหนักมากที่สุด เพราะนั่นคือพื้นที่โดยประมาณที่เลย์เอาต์แคบมี ชื่อเรื่องของคุณเริ่มต้นว่า: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'ขีดจำกัดชื่อเรื่องไม่พร้อมใช้งานในบิลด์นี้ จึงยังไม่มีการตรวจสอบใดที่นี่',
  'web.tools.youtubeTitle.faq.limit.q': 'ขีดจำกัดนี้มาจากไหน',
  'web.tools.youtubeTitle.faq.limit.a':
    'จากเอกสารอ้างอิง videos insert ทางการ ถูกสร้างลงในหน้านี้จากโค้ดการเชื่อมต่อชุดเดียวกับที่ตัวอัปโหลดของเราจะใช้ วันที่มีคนอ่านหน้านั้นครั้งล่าสุดแสดงอยู่ข้างตัวเลข',
  'web.tools.youtubeTitle.faq.truncation.q': 'YouTube ตัดชื่อเรื่องตรงจุดใดกันแน่',
  'web.tools.youtubeTitle.faq.truncation.a':
    'ขึ้นอยู่กับพื้นผิวแสดงผลและวิวพอร์ต และ YouTube ไม่ได้เผยแพร่จำนวนตัวอักษรสำหรับเรื่องนี้ เราแสดงเพดานซึ่งบันทึกในเอกสาร และเราจะไม่พิมพ์ตัวเลขจุดตัดที่จะเป็นการเดามั่ว',
  'web.tools.youtubeTitle.faq.emoji.q': 'อิโมจิหนึ่งตัวนับเป็นหนึ่งตัวอักษรหรือไม่',
  'web.tools.youtubeTitle.faq.emoji.a':
    'ในตัวนับนี้ใช่ เพราะเรานับเป็นกราฟีม แพลตฟอร์มที่นับเป็นหน่วยรหัสภายในอาจคิดค่ามากกว่าสำหรับอิโมจิเดียวกัน นั่นคือเหตุผลที่ตัวตรวจสอบก่อนโพสต์ใช้กฎของแต่ละแพลตฟอร์มแยกกัน',

  /* ---------------------------------------------------------------------- */
  /* Time zone and daylight saving planner                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'ตัววางแผนเขตเวลาและการปรับเวลาตามฤดูกาล',
  'web.tools.timeZone.lede':
    'ช่วงเวลารายสัปดาห์ที่ดูมั่นคงในปฏิทินของคุณจะขยับสำหรับกลุ่มเป้าหมายครึ่งหนึ่งของคุณปีละสองครั้ง เครื่องมือนี้แสดงว่าที่ไหนและเมื่อไร',
  'web.tools.timeZone.explainer.title': 'ทำไมเวลาท้องถิ่นที่ตายตัวจึงไม่ใช่เวลาที่ตายตัว',
  'web.tools.timeZone.explainer.body':
    'เวลาหนึ่งมีความหมายก็ต่อเมื่อมีเขตเวลากำกับ เขตเวลาเปลี่ยนค่าออฟเซตในวันที่แตกต่างกันไปตามประเทศ และสองภูมิภาคที่ห่างกันห้าชั่วโมงในเดือนมกราคมอาจห่างกันเพียงสี่ชั่วโมงในเดือนเมษายน กำหนดการที่เก็บเป็นช่วงเวลาบวกเขตเวลาจะรอดจากสิ่งนั้น กำหนดการที่เก็บเป็นชั่วโมงท้องถิ่นจะไม่รอด',
  'web.tools.timeZone.field.date.label': 'วันที่',
  'web.tools.timeZone.field.time.label': 'เวลา',
  'web.tools.timeZone.field.zone.label': 'เขตเวลาของคุณ',
  'web.tools.timeZone.field.audience.label': 'เขตเวลาของกลุ่มเป้าหมาย',
  'web.tools.timeZone.field.audience.help': 'เลือกเขตเวลาที่ผู้อ่านของคุณอยู่จริง ๆ',
  'web.tools.timeZone.result.title': 'ช่วงเวลาเดียวกัน ในทุกที่ที่คุณเลือก',
  'web.tools.timeZone.result.empty': 'เลือกอย่างน้อยหนึ่งเขตเวลาของกลุ่มเป้าหมาย',
  'web.tools.timeZone.result.shift':
    'การเปลี่ยนเวลาตามฤดูกาลจะเกิดขึ้นระหว่างวันนี้กับวันเดียวกันในสัปดาห์อีกสี่สัปดาห์ต่อมา ดังนั้นชั่วโมงท้องถิ่นจะขยับ',
  'web.tools.timeZone.result.stable': 'ไม่มีการเปลี่ยนออฟเซตในสี่สัปดาห์ข้างหน้า',
  'web.tools.timeZone.result.later': 'สี่สัปดาห์ต่อมา {time}',
  'web.tools.timeZone.result.invalidDate': 'ป้อนวันที่และเวลาเพื่อดูการเปรียบเทียบ',
  'web.tools.timeZone.faq.dst.q': 'เวลาขยับไปทางไหน',
  'web.tools.timeZone.faq.dst.a':
    'ขึ้นอยู่กับเขตเวลาและทิศทางของการเปลี่ยนแปลง นั่นคือเหตุผลที่ตารางแสดงเวลาท้องถิ่นจริงในอีกสี่สัปดาห์ข้างหน้าแทนที่จะอธิบายกฎ ค่าออฟเซตของแต่ละเขตเวลาถูกอ่านจากฐานข้อมูลเขตเวลาในเบราว์เซอร์ของคุณ',
  'web.tools.timeZone.faq.storage.q': 'โพสต์ที่กำหนดเวลาแล้วควรเก็บเวลาของมันอย่างไร',
  'web.tools.timeZone.faq.storage.a':
    'เป็นช่วงเวลาบวกเขตเวลา IANA ที่คนนั้นเลือก ไม่ใช่เป็นเวลาท้องถิ่นเปล่า ๆ นั่นคือสิ่งที่เราทำภายในระบบ และนั่นคือเหตุผลที่โพสต์ที่กำหนดเวลาไว้ก่อนการเปลี่ยนนาฬิกายังคงมาถึงในชั่วโมงท้องถิ่นที่ตั้งใจไว้',

  /* ---------------------------------------------------------------------- */
  /* Engagement rate calculator                                              */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': 'เครื่องคำนวณอัตราการมีส่วนร่วม',
  'web.tools.engagementRate.lede':
    'พิมพ์ตัวเลขที่แดชบอร์ดของคุณเองแสดงให้เห็นอยู่แล้ว เครื่องมือนี้หารมันสามแบบแล้วหยุดแค่นั้น: ไม่มีเกณฑ์ ไม่มีระดับ "ดี" ไม่มีอะไรที่เราไม่ได้มีจริง',
  'web.tools.engagementRate.explainer.title': 'ทำไมจึงมีตัวหารสามแบบ ไม่ใช่แบบเดียว',
  'web.tools.engagementRate.explainer.body':
    'การเข้าถึง ผู้ติดตาม และการแสดงผล ตอบคำถามที่ต่างกัน อัตราตามการเข้าถึงบอกว่าคนที่เห็นโพสต์จริง ๆ ตอบสนองอย่างไร อัตราตามผู้ติดตามบอกว่ากลุ่มเป้าหมายของคุณส่วนไหนมีส่วนร่วม ไม่ว่าโพสต์จะเข้าถึงทุกคนหรือไม่ อัตราตามการแสดงผลนับทุกการเข้าชม รวมถึงการเข้าชมซ้ำ การเปรียบเทียบอัตราที่คำนวณแบบหนึ่งกับอัตราที่คำนวณอีกแบบเป็นสาเหตุทั่วไปที่ทำให้ตัวเลขการมีส่วนร่วมดูผิดปกติ',
  'web.tools.engagementRate.field.interactions.label': 'การมีส่วนร่วม',
  'web.tools.engagementRate.field.interactions.help':
    'ไลก์ คอมเมนต์ แชร์ และบันทึก รวมกัน จากโพสต์ที่คุณกำลังวัด',
  'web.tools.engagementRate.field.reach.label': 'การเข้าถึง',
  'web.tools.engagementRate.field.reach.help': 'บัญชีที่เห็นโพสต์อย่างน้อยหนึ่งครั้ง',
  'web.tools.engagementRate.field.followers.label': 'ผู้ติดตาม',
  'web.tools.engagementRate.field.followers.help': 'ขนาดบัญชีในขณะที่โพสต์นั้นถูกโพสต์',
  'web.tools.engagementRate.field.impressions.label': 'การแสดงผล',
  'web.tools.engagementRate.field.impressions.help':
    'จำนวนการเข้าชมทั้งหมด รวมถึงคนที่เห็นสองครั้ง',
  'web.tools.engagementRate.result.title': 'อัตราการมีส่วนร่วม สามแบบ',
  'web.tools.engagementRate.result.empty': 'ไม่พร้อมใช้งาน',
  'web.tools.engagementRate.result.note':
    'ไม่มีอัตราที่ดีในระดับสากลให้เทียบ มันขึ้นอยู่กับแพลตฟอร์ม รูปแบบ ขนาดกลุ่มเป้าหมาย และอุตสาหกรรม และตัวเลขเดี่ยวใด ๆ ที่เสนอเป็นเกณฑ์ก็เป็นเพียงการเดาที่แต่งตัวเป็นข้อมูล',
  'web.tools.engagementRate.basis.reach': 'ตามการเข้าถึง',
  'web.tools.engagementRate.basis.followers': 'ตามผู้ติดตาม',
  'web.tools.engagementRate.basis.impressions': 'ตามการแสดงผล',
  'web.tools.engagementRate.faq.formula.q': 'สูตรจริง ๆ คืออะไร',
  'web.tools.engagementRate.faq.formula.a':
    'การมีส่วนร่วมหารด้วยตัวหารที่คุณเลือก แสดงเป็นเปอร์เซ็นต์ การมีส่วนร่วมที่นี่หมายถึงไลก์ คอมเมนต์ แชร์ และบันทึก รวมกัน บางแพลตฟอร์มรายงานสิ่งเหล่านี้แยกกัน ในกรณีนั้นให้บวกเองก่อนพิมพ์ยอดรวม',
  'web.tools.engagementRate.faq.basis.q': 'ฉันควรใช้ตัวหารแบบไหน',
  'web.tools.engagementRate.faq.basis.a':
    'แบบใดก็ตามที่แพลตฟอร์มของคุณรายงานควบคู่กับโพสต์ เพื่อให้ตัวเลขทั้งสองมาจากหน้าต่างการวัดเดียวกัน การเปรียบเทียบอัตราตามการเข้าถึงของโพสต์หนึ่งกับอัตราตามผู้ติดตามของอีกโพสต์หนึ่งไม่ใช่การเปรียบเทียบที่เป็นธรรม แม้ทั้งคู่จะถูกเรียกว่าอัตราการมีส่วนร่วมก็ตาม',
} as const;
