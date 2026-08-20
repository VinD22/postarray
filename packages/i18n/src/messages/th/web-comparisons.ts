/**
 * The comparison pages' chrome.
 *
 * What belongs here: state words, section headings, labels, and the three
 * disclosure sentences whose numbers are read at render time from the code
 * that decides them. What deliberately does not: the claims themselves. A
 * comparison table is several hundred words of dated, sourced content per
 * page, and the English catalog is merged into one object that every page load
 * resolves, so those claims live in typed modules under
 * `apps/web/src/features/comparisons/entries` and are loaded per slug.
 *
 * The `web.compare.*` namespace is the older `/compare` index. This namespace
 * is the per comparison page, kept separate so the index copy that beta locales
 * already carry is not disturbed.
 */
export const webComparisonMessages = {
  'web.comparison.eyebrow': 'การเปรียบเทียบ',

  'web.comparison.state.yes': 'ใช่',
  'web.comparison.state.no': 'ไม่',
  'web.comparison.state.partial': 'บางส่วน',
  'web.comparison.state.notVerified': 'ยังไม่ยืนยัน',

  'web.comparison.label.claim': 'ข้อความอ้างสิทธิ์',
  'web.comparison.label.sourceRead': 'อ่านเมื่อ {date}',
  'web.comparison.label.checked': 'ตรวจสอบทุกแถวเมื่อ {date}',
  'web.comparison.label.nextReview': 'ตรวจสอบครั้งถัดไปเมื่อ {date}',
  'web.comparison.label.backToIndex': 'การเปรียบเทียบทั้งหมด',

  'web.comparison.table.title': 'แต่ละตัวเลือกทำอะไรได้บ้าง',
  'web.comparison.table.caption': 'หนึ่งข้อความอ้างสิทธิ์ต่อหนึ่งแถว พร้อมแหล่งที่มาของแต่ละคำตอบ',

  'web.comparison.bestFor.title': 'ตัวไหนเหมาะกับคุณ',
  'web.comparison.bestFor.ours': 'เลือกผลิตภัณฑ์นี้เมื่อ',
  'web.comparison.bestFor.alternative': 'เลือก {name} เมื่อ',

  'web.comparison.notDo.title': 'สิ่งที่ผลิตภัณฑ์นี้ไม่ทำ',
  'web.comparison.notDo.body':
    'ประโยคเหล่านี้ถูกอ่านจากโค้ดที่กำหนดมันขึ้น ไม่ใช่พิมพ์ขึ้นเอง ดังนั้นส่วนนี้จึงไม่มีทางคลาดเคลื่อนไปจากสิ่งที่ผลิตภัณฑ์เป็นอยู่จริงในวันนี้',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {ยังไม่มีการเชื่อมต่อใดผ่านการยืนยันจากผู้ให้บริการ จึงยังไม่มีอะไรถูกเผยแพร่ไปยังแพลตฟอร์มใดผ่านผลิตภัณฑ์นี้ในวันนี้} other {การเชื่อมต่อ # รายการผ่านการยืนยันจากผู้ให้บริการแล้ว แพลตฟอร์มอื่นทั้งหมดในกลุ่มยังคงเป็นเพียงความตั้งใจ}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {ยังไม่มีภาษาใดผ่านการตรวจทานโดยมนุษย์ ทุกภาษาในอินเทอร์เฟซจึงถูกติดป้ายว่าอยู่ในช่วงทดลอง} other {ภาษา # ภาษาผ่านการตรวจทานโดยมนุษย์แล้ว ทุกภาษาอื่นถูกติดป้ายว่าอยู่ในช่วงทดลอง}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {ทุกระดับราคาได้รับการตัดสินใจแล้วและมีราคาจริง} other {ระดับราคา # ระดับยังเป็นเพียงตัวยึดตำแหน่งที่ยังไม่ตัดสินใจและซื้อไม่ได้}}',

  'web.comparison.notVerified.title': '"ยังไม่ยืนยัน" หมายความว่าอย่างไร',
  'web.comparison.notVerified.body':
    'ช่องหนึ่งจะระบุว่ายังไม่ยืนยันเมื่อไม่สามารถอ่านข้อเท็จจริงนั้นได้จากเอกสารสาธารณะทางการของตัวเลือกอีกฝั่งในวันที่ตรวจสอบ ข้อมูลนี้ไม่เคยถูกเติมจากความจำ และไม่เคยคัดลอกจากบทสรุปที่คนอื่นเขียนไว้',

  'web.comparison.method.title': 'หน้านี้ถูกจัดทำขึ้นอย่างไร',
  'web.comparison.method.body':
    'แต่ละแถวคือหนึ่งข้อความอ้างสิทธิ์ พร้อมเอกสารที่มันมาจากและวันที่มีคนอ่านเอกสารนั้น ไม่มีภาพหน้าจอของคู่แข่ง ไม่มีการคัดลอกถ้อยคำฟีเจอร์ และไม่มีจุดอ่อนที่ถูกสร้างขึ้นมาเอง',
  'web.comparison.method.cadence':
    'การเปรียบเทียบแต่ละรายการถูกตรวจสอบซ้ำอย่างน้อยทุก 90 วัน และทันทีเมื่อแพลตฟอร์มหรือตัวเลือกใดเปลี่ยนสิ่งที่แถวหนึ่งได้ระบุไว้',

  'web.comparison.questions.title': 'คำถาม',
  'web.comparison.sources.title': 'แหล่งที่มาที่อ้างอิงในหน้านี้',

  'web.comparison.index.title': 'การเปรียบเทียบที่เผยแพร่แล้ว',
  'web.comparison.index.body':
    'แต่ละหน้าเปรียบเทียบผลิตภัณฑ์นี้กับกลุ่มทางเลือกที่ข้อเท็จจริงของมันสามารถอ่านได้จากเอกสารทางการ ผลิตภัณฑ์ที่ถูกระบุชื่อจะมีหน้าของตัวเองเมื่อข้อเท็จจริงปัจจุบันของมันสามารถอ่านได้จากหน้าสาธารณะของตัวเอง และไม่ใช่ก่อนหน้านั้น',
  'web.comparison.index.checked': 'ตรวจสอบเมื่อ {date}',
} as const;
