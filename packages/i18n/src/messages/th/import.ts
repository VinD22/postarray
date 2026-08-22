/**
 * Bulk CSV import.
 *
 * Two groups of strings. The `import.error.*` keys are the ones the parser and
 * the apply step emit: they are stored on a row, rendered in the report and
 * written into the downloadable CSV, so they have to make sense to someone
 * reading a spreadsheet rather than a screen. Everything else is the wizard.
 *
 * The copy says drafts wherever drafts are what happens, and it says schedule
 * only on the step where a person chooses it. Nothing here promises that a post
 * reaches a platform.
 */
export const importMessages = {
  'import.title': 'นำเข้าโพสต์จาก CSV',
  'import.subtitle':
    'อัปโหลดสเปรดชีต ดูว่ามันจะทำอะไร แล้วค่อยตัดสินใจ การอัปโหลดเป็นเพียงการตรวจสอบไฟล์ ยังไม่สร้างอะไรทั้งสิ้น',

  'import.step.upload': 'อัปโหลด',
  'import.step.columns': 'คอลัมน์',
  'import.step.review': 'ตรวจทาน',
  'import.step.apply': 'นำไปใช้',
  'import.step.results': 'ผลลัพธ์',
  'import.step.position': 'ขั้นตอนที่ {current} จาก {total}',

  'import.upload.heading': 'เลือกไฟล์ CSV',
  'import.upload.help':
    'รองรับเฉพาะ CSV เท่านั้น ไฟล์สเปรดชีตเช่น .xlsx จะไม่ถูกอ่าน ให้ส่งออกชีตของคุณเป็น CSV ก่อน',
  'import.upload.field': 'ไฟล์ CSV',
  'import.upload.fieldHelp': 'เลือกไฟล์ หรือวางแถวข้อมูลลงในกล่องด้านล่าง',
  'import.upload.paste': 'หรือวางข้อความ CSV',
  'import.upload.pasteHelp': 'รวมแถวส่วนหัวไว้ด้วย ทุกอย่างจะถูกตรวจสอบก่อนที่จะสร้างสิ่งใด',
  'import.upload.project': 'โปรเจกต์',
  'import.upload.projectHelp': 'ทุกแถวในไฟล์เดียวจะเป็นของโปรเจกต์นี้',
  'import.upload.submit': 'ตรวจสอบไฟล์นี้',
  'import.upload.submitting': 'กำลังอ่านไฟล์',
  'import.upload.allowPast': 'อนุญาตเวลาที่ผ่านไปแล้ว',
  'import.upload.allowPastHelp':
    'ปิดไว้เป็นค่าเริ่มต้น แถวที่มีวันที่ในอดีตจะถูกรายงานให้คุณแก้ไขเอง แทนที่จะถูกย้ายให้โดยอัตโนมัติ',
  'import.upload.tooLarge': 'ไฟล์นั้นใหญ่กว่า {limit} ตัวอักษร ให้แบ่งไฟล์แล้วลองใหม่',
  'import.upload.duplicate':
    'นี่คือไฟล์เดียวกับที่คุณอัปโหลดไปก่อนหน้านี้ คุณจึงกำลังดูการนำเข้านั้นอยู่ ไม่ใช่สำเนาที่สอง',

  'import.template.heading': 'ความหมายของแต่ละคอลัมน์',
  'import.template.download': 'ดาวน์โหลดเทมเพลต CSV',
  'import.template.required': 'คอลัมน์ที่จำเป็น',
  'import.template.optional': 'คอลัมน์เสริม',
  'import.column.external_row_id': 'รหัสของคุณเองสำหรับแถวนั้น ต้องไม่ซ้ำกันภายในไฟล์',
  'import.column.project': 'ชื่อหรือรหัสโปรเจกต์ที่แถวนั้นเป็นของ',
  'import.column.targets': 'เริ่มด้วย set: ตามด้วยรหัส Set บัญชี หรือรหัสบัญชีคั่นด้วยเส้นตั้ง',
  'import.column.caption': 'ข้อความของโพสต์',
  'import.column.scheduled_local_time': 'วันที่และเวลาท้องถิ่น เขียนในรูปแบบ 2026-09-01T10:00',
  'import.column.time_zone': 'เขตเวลา IANA ที่ใช้อ่านเวลาท้องถิ่นนั้น เช่น Europe/Berlin',
  'import.column.media':
    'รหัสสื่อ, sha256: ตามด้วยเช็คซัมของสื่อที่คุณมีอยู่แล้ว หรือที่อยู่ https ให้เซิร์ฟเวอร์ดึงมา',
  'import.column.title': 'ชื่อเรื่อง สำหรับปลายทางที่ใช้ชื่อเรื่อง',
  'import.column.destination': 'หน้า บอร์ด หรือช่องภายในบัญชี',
  'import.column.privacy': 'ค่าความเป็นส่วนตัวที่ปลายทางต้องการ',
  'import.column.first_comment': 'ข้อความที่โพสต์เป็นความคิดเห็นแรกหลังจากโพสต์',
  'import.column.approval_policy': 'นโยบายการอนุมัติที่จะแนบกับฉบับร่างแต่ละรายการ',
  'import.column.perPlatform':
    'คอลัมน์ caption_ หรือ title_ ที่ตั้งชื่อตามแพลตฟอร์มจะเขียนทับเฉพาะแพลตฟอร์มนั้น เช่น caption_instagram',

  'import.columns.heading': 'การตรวจสอบคอลัมน์',
  'import.columns.ok': 'มีคอลัมน์ที่จำเป็นครบทุกคอลัมน์',
  'import.columns.missing': '{count, plural, other {ขาดคอลัมน์ที่จำเป็น # คอลัมน์}}',
  'import.columns.unknown': '{count, plural, other {# คอลัมน์ไม่ถูกรู้จักและถูกข้ามไป}}',
  'import.columns.present': 'คอลัมน์ที่พบ',

  'import.review.heading': 'ไฟล์นี้จะทำอะไรบ้าง',
  'import.review.counts':
    '{valid, plural, =0 {ไม่มีแถวใดพร้อม} other {# แถวพร้อมแล้ว}}, {invalid, plural, =0 {ไม่มีแถวที่ต้องดูแล} other {# แถวที่ต้องดูแล}}',
  'import.review.empty': 'ไม่มีแถวใดถูกอ่านจากไฟล์นี้',
  'import.review.rowsHeading': 'แถว',
  'import.review.filterAll': 'ทุกแถว',
  'import.review.filterValid': 'พร้อมแล้ว',
  'import.review.filterInvalid': 'ต้องดูแล',
  'import.review.filterFailed': 'ล้มเหลว',
  'import.review.downloadErrors': 'ดาวน์โหลดปัญหาเป็น CSV',
  'import.review.parsedWith': 'อ่านด้วยตัวแยกวิเคราะห์รุ่น {version}',

  'import.table.row': 'รหัสแถว',
  'import.table.line': 'บรรทัด',
  'import.table.state': 'สถานะ',
  'import.table.caption': 'ข้อความ',
  'import.table.time': 'กำหนดเวลาแล้ว',
  'import.table.problems': 'ปัญหา',
  'import.table.draft': 'ฉบับร่าง',
  'import.table.noProblems': 'ไม่มี',

  'import.state.pending': 'ยังไม่ตรวจสอบ',
  'import.state.valid': 'พร้อมแล้ว',
  'import.state.invalid': 'ต้องดูแล',
  'import.state.applied': 'สร้างฉบับร่างแล้ว',
  'import.state.skipped': 'ทำไปแล้ว',
  'import.state.failed': 'ล้มเหลว',

  'import.job.state.uploaded': 'อัปโหลดแล้ว',
  'import.job.state.validating': 'กำลังตรวจสอบ',
  'import.job.state.validated': 'ตรวจสอบแล้ว',
  'import.job.state.applying': 'กำลังนำไปใช้',
  'import.job.state.applied': 'นำไปใช้แล้ว',
  'import.job.state.failed': 'ไม่สามารถอ่านได้',

  'import.apply.heading': 'ควรทำอะไรกับแถวที่พร้อมแล้ว',
  'import.apply.drafts': 'สร้างฉบับร่าง',
  'import.apply.draftsHelp':
    'ค่าเริ่มต้น แต่ละแถวที่พร้อมจะกลายเป็นฉบับร่างที่คุณเปิด แก้ไข และอนุมัติได้ ยังไม่มีการกำหนดเวลาใด ๆ',
  'import.apply.scheduled': 'สร้างฉบับร่างและกำหนดเวลาให้',
  'import.apply.scheduledHelp':
    'แต่ละแถวที่พร้อมจะกลายเป็นฉบับร่างและใช้เวลาที่เขียนไว้ในไฟล์ เลือกตัวเลือกนี้เฉพาะเมื่อเวลาถูกต้อง',
  'import.apply.confirm': 'นำไปใช้ {count, plural, other {# แถว}}',
  'import.apply.confirmScheduled': 'สร้างและกำหนดเวลา {count, plural, other {# แถว}}',
  'import.apply.running': 'กำลังนำแถวไปใช้',
  'import.apply.safeToRepeat':
    'นำไปใช้ซ้ำสองครั้งได้อย่างปลอดภัย แถวที่สร้างฉบับร่างไปแล้วจะถูกปล่อยไว้เฉย ๆ',

  'import.results.heading': 'ผลลัพธ์',
  'import.results.applied': '{count, plural, other {สร้างฉบับร่างแล้ว # รายการ}}',
  'import.results.skipped': '{count, plural, other {# แถวทำไปแล้ว}}',
  'import.results.failed': '{count, plural, other {# แถวล้มเหลว}}',
  'import.results.retry': 'นำแถวที่เหลือไปใช้อีกครั้ง',
  'import.results.openDrafts': 'เปิดฉบับร่าง',
  'import.results.unavailable': 'ไม่พร้อมใช้งาน',

  'import.history.heading': 'การนำเข้าก่อนหน้านี้',
  'import.history.empty': 'ยังไม่มีการนำเข้า',
  'import.history.open': 'เปิด',

  'import.a11y.rowsTable': 'แถวของไฟล์และปัญหาของแต่ละแถว',
  'import.a11y.stepList': 'ขั้นตอนการนำเข้า',
  'import.a11y.uploadedFile': 'ไฟล์ที่เลือก: {filename}',

  'import.error.emptyFile': 'ไฟล์นั้นไม่มีแถวข้อมูลเลย',
  'import.error.missingColumn': 'ขาดคอลัมน์ {column}',
  'import.error.unknownColumn': 'คอลัมน์ {column} ไม่ถูกรู้จัก จึงถูกข้ามไป',
  'import.error.duplicateRowId': 'รหัสแถว {value} ถูกใช้มากกว่าหนึ่งครั้งในไฟล์นี้',
  'import.error.required': 'ช่องนี้ต้องไม่ว่างเปล่า',
  'import.error.invalidCell': 'ช่องนี้ไม่ได้อยู่ในรูปแบบที่เราอ่านได้',
  'import.error.rowShape': 'บรรทัดนี้มี {actual} ช่อง แต่ส่วนหัวมี {expected} ช่อง',
  'import.error.invalidLocalTime':
    'เวลา {value} ไม่ใช่วันที่และเวลาท้องถิ่นในรูปแบบเช่น 2026-09-01T10:00',
  'import.error.invalidTimeZone': 'เขตเวลา {value} ไม่ใช่ชื่อเขตเวลา IANA',
  'import.error.nonexistentLocalTime':
    'เวลา {value} ไม่มีอยู่จริงในเขตเวลา {zone} นาฬิกากระโดดข้ามช่วงนั้นไป',
  'import.error.ambiguousLocalTime':
    'เวลา {value} เกิดขึ้นสองครั้งในเขตเวลา {zone} ในวันนั้น ให้เลือกเวลาอื่น',
  'import.error.scheduleInPast': 'เวลา {value} ในเขตเวลา {zone} ผ่านไปแล้ว',
  'import.error.invalidTargets': 'ค่า {value} ไม่ใช่ Set บัญชีที่บันทึกไว้หรือรายการรหัสบัญชี',
  'import.error.invalidMedia': 'ค่า {value} ไม่ใช่รหัสสื่อ เช็คซัม sha256 หรือที่อยู่ https',
  'import.error.mediaNotFound': 'ไม่มีสื่อในพื้นที่ทำงานนี้ที่ตรงกับ {value}',
  'import.error.mediaImportStarted':
    'กำลังดึงสื่อที่ {value} ให้นำไฟล์นี้มาใช้อีกครั้งเมื่อสื่อนั้นอยู่ในไลบรารีแล้ว',
  'import.error.unknownVariantTarget':
    'แถวนี้ไม่มีบัญชี {provider} จึงไม่ได้ใช้ข้อความสำหรับ {provider}',
  'import.error.applyFailed': 'ไม่สามารถนำแถวนี้ไปใช้ได้ รหัสอ้างอิง: {code}',
  'import.error.alreadyApplied': 'แถวนี้สร้างฉบับร่างไปแล้ว จึงถูกปล่อยไว้เฉย ๆ',
  'import.error.tooManyRows': 'มีเพียง {limit} แถวแรกของไฟล์เท่านั้นที่ถูกอ่าน',
} as const;
