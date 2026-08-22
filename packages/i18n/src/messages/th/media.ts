/**
 * Media derivatives: the non-generative editor and the refusals it can hit.
 *
 * Two groups. `mediaLib.derivative.*` is what a person reads while cropping,
 * rotating, resizing, converting or compressing a file they already uploaded.
 * `error.media_derivative_*.message` is what the application boundary says when it
 * refuses a plan, and every one of those sentences names the reason and the
 * next step rather than reporting that something failed.
 *
 * The vocabulary is deliberate. Nothing here says generate, enhance, upscale,
 * restore or fix, because Relay does not do any of those and copy that hinted
 * otherwise would be the first half of a promise the product cannot keep. The
 * word used throughout is "version": an edit adds one, and the original stays
 * exactly where it was.
 */
export const mediaMessages = {
  // ==================================================== the editor ====
  'mediaLib.derivative.heading': 'แก้ไขภาพนี้',
  'mediaLib.derivative.description':
    'ครอบตัด หมุน ปรับขนาด เปลี่ยนรูปแบบ หรือบีบอัด การเปลี่ยนแปลงทุกอย่างทำงานกับพิกเซลที่มีอยู่แล้วในไฟล์ของคุณ ไม่มีสิ่งใดถูกเพิ่มเข้ามาที่ไม่เคยมีอยู่',
  'mediaLib.derivative.originalKept':
    'ต้นฉบับจะไม่ถูกแทนที่เลย การแก้ไขแต่ละครั้งจะถูกบันทึกเป็นเวอร์ชันแยกต่างหากที่คุณเลือกได้เมื่อเขียนโพสต์',
  'mediaLib.derivative.apply': 'บันทึกเวอร์ชันนี้',
  'mediaLib.derivative.applying': 'กำลังบันทึกเวอร์ชันนี้',
  'mediaLib.derivative.discard': 'ยกเลิกการเปลี่ยนแปลง',
  'mediaLib.derivative.noChanges': 'ยังไม่มีอะไรให้บันทึก เปลี่ยนค่าด้านบนก่อน',

  'mediaLib.derivative.tab.crop': 'ครอบตัด',
  'mediaLib.derivative.tab.transform': 'หมุนและปรับขนาด',
  'mediaLib.derivative.tab.output': 'รูปแบบ',

  'mediaLib.derivative.cropHint':
    'พิมพ์ตัวเลข หรือใช้ปุ่มลูกศรในช่องใดก็ได้ ไม่มีขั้นตอนใดที่นี่จำเป็นต้องใช้เมาส์',
  'mediaLib.derivative.cropX': 'ขอบซ้าย เป็นพิกเซล',
  'mediaLib.derivative.cropY': 'ขอบบน เป็นพิกเซล',
  'mediaLib.derivative.cropWidth': 'ความกว้างของการครอบตัด เป็นพิกเซล',
  'mediaLib.derivative.cropHeight': 'ความสูงของการครอบตัด เป็นพิกเซล',
  'mediaLib.derivative.rotate': 'หมุน',
  'mediaLib.derivative.rotateNone': 'ไม่หมุน',
  'mediaLib.derivative.rotateDegrees': '{degrees} องศาตามเข็มนาฬิกา',
  'mediaLib.derivative.resizeWidth': 'ความกว้างใหม่ เป็นพิกเซล',
  'mediaLib.derivative.resizeHeight': 'ความสูงใหม่ เป็นพิกเซล',
  'mediaLib.derivative.lockRatio': 'คงสัดส่วนไว้เมื่อฉันเปลี่ยนด้านใดด้านหนึ่ง',
  'mediaLib.derivative.format': 'บันทึกเป็น',
  'mediaLib.derivative.formatSame': 'คงรูปแบบปัจจุบันไว้',
  'mediaLib.derivative.quality': 'คุณภาพ',
  'mediaLib.derivative.qualityHint':
    'คุณภาพที่ต่ำลงทำให้ไฟล์เล็กลง ใช้ได้กับ JPEG และ WebP ส่วน PNG ไม่มีการสูญเสียข้อมูลและจะไม่สนใจค่านี้',
  'mediaLib.derivative.projected': 'เวอร์ชันนี้จะมีขนาด {width} x {height} พิกเซล',
  'mediaLib.derivative.projectedUnavailable':
    'ขนาดของเวอร์ชันนี้จะยังไม่พร้อมใช้งานจนกว่าจะสร้างเสร็จ',

  // ==================================================== the versions list ====
  'mediaLib.derivative.listHeading': 'เวอร์ชันต่าง ๆ',
  'mediaLib.derivative.original': 'ต้นฉบับ',
  'mediaLib.derivative.originalHint': 'เก็บไว้เสมอ ไม่ถูกเขียนทับเลย',
  'mediaLib.derivative.item': '{width} x {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'ยังไม่มีเวอร์ชันที่แก้ไข ต้นฉบับเป็นไฟล์เดียวที่นี่',
  'mediaLib.derivative.select': 'ใช้เวอร์ชันนี้',
  'mediaLib.derivative.selected': 'กำลังใช้สำหรับโพสต์นี้',
  'mediaLib.derivative.useOriginal': 'ใช้ต้นฉบับ',
  'mediaLib.derivative.processing': 'กำลังสร้างเวอร์ชันนี้อยู่ จะปรากฏที่นี่เมื่อพร้อม',
  'mediaLib.derivative.alreadyExists':
    'คุณเคยแก้ไขแบบเดียวกันนี้มาก่อนแล้ว เราจึงใช้เวอร์ชันเดิมนั้นซ้ำแทนที่จะสร้างอีกชุดหนึ่ง',
  'mediaLib.derivative.failedTitle': 'ไม่สามารถสร้างเวอร์ชันนี้ได้',
  'mediaLib.derivative.failedBody':
    'ไม่มีอะไรถูกบันทึกและต้นฉบับของคุณไม่ถูกแตะต้อง เปลี่ยนค่าแล้วลองใหม่',
  'mediaLib.derivative.openEditor': 'แก้ไข {name}',

  'mediaLib.derivative.unsupportedTitle': 'การแก้ไขใช้ได้กับภาพเท่านั้น',
  'mediaLib.derivative.unsupportedBody':
    'วิดีโอ เสียง และเอกสารไม่สามารถแก้ไขที่นี่ได้ ให้เตรียมไฟล์ก่อนอัปโหลด ต้นฉบับที่คุณอัปโหลดจะไม่ถูกเปลี่ยนแปลงไม่ว่ากรณีใด',

  'mediaLib.derivative.nonGenerative':
    'Relay ไม่สร้างภาพหรือวิดีโอขึ้นมาใหม่ เครื่องมือแก้ไขนี้ทำได้เพียงครอบตัด หมุน ปรับขนาด แปลงรูปแบบ และบีบอัดสิ่งที่คุณอัปโหลดเท่านั้น',

  // ==================================================== refusals ====
  'error.media_derivative_no_operations.message':
    'เลือกการเปลี่ยนแปลงอย่างน้อยหนึ่งอย่างก่อนบันทึกเวอร์ชัน',
  'error.media_derivative_duplicate_operation.message':
    'การเปลี่ยนแปลงแต่ละประเภทปรากฏได้เพียงครั้งเดียว ให้ลบ {operation} ตัวที่สองออก',
  'error.media_derivative_crop_out_of_bounds.message':
    'การครอบตัดนั้นเลยขอบภาพไป ซึ่งมีขนาด {sourceWidth} x {sourceHeight} พิกเซล ให้ย้ายหรือลดขนาดลง',
  'error.media_derivative_upscale_rejected.message':
    'เครื่องมือแก้ไขนี้ไม่เคยขยายภาพให้ใหญ่ขึ้น เพราะพิกเซลที่เพิ่มเข้ามาจะเป็นการสร้างขึ้นมาเอง ไม่ใช่ของคุณจริง ขนาดใหญ่ที่สุดที่เวอร์ชันนี้ทำได้คือ {availableWidth} x {availableHeight}',
  'error.media_derivative_source_unsupported.message':
    'การแก้ไขใช้ได้กับภาพ JPEG, PNG, WebP และ GIF ไฟล์นี้เป็น {mimeType}',
  'error.media_derivative_dimensions_unknown.message':
    'เรายังไม่ทราบขนาดของภาพนี้ จึงยังตรวจสอบการเปลี่ยนแปลงเทียบกับมันไม่ได้ ลองใหม่อีกครั้งเมื่อการประมวลผลเสร็จสิ้น',
  'error.media_derivative_format_required.message':
    'เลือกรูปแบบที่จะบันทึกเป็น ไฟล์ {sourceMimeType} ไม่สามารถบันทึกกลับเป็นตัวเองได้ที่นี่',
  'error.media_derivative_quality_unsupported.message':
    'PNG ไม่มีการสูญเสียข้อมูล ดังนั้นการตั้งค่าคุณภาพจะไม่มีผลใด ๆ ให้ลบออก หรือบันทึกเป็น JPEG หรือ WebP แทน',
  'error.media_derivative_no_change.message': 'นั่นคือรูปแบบที่ไฟล์นี้ใช้อยู่แล้ว',
  'error.media_derivative_source_unavailable.message':
    'ไฟล์ที่เวอร์ชันนี้จะถูกสร้างจากไม่มีอยู่ในพื้นที่จัดเก็บอีกต่อไป',
  'error.media_derivative_preset_mismatch.message':
    'คำขอแก้ไขนี้ไม่ตรงกับการเปลี่ยนแปลงที่มันอธิบาย ไม่มีอะไรถูกสร้างขึ้น ลองใหม่จากเครื่องมือแก้ไข',
  'error.media_derivative_empty_result.message':
    'การแก้ไขไม่ได้สร้างภาพขึ้นมา จึงไม่มีอะไรถูกบันทึก ต้นฉบับของคุณไม่ถูกแตะต้อง',
  'error.media_derivative_transform_failed.message':
    'ไม่สามารถอ่านหรือเขียนภาพนี้ได้ ไม่มีอะไรถูกบันทึกและต้นฉบับของคุณไม่ถูกแตะต้อง',
  'error.media_derivative_write_failed.message':
    'ไม่สามารถบันทึกเวอร์ชันนี้ได้ ไม่มีอะไรถูกบันทึกและต้นฉบับของคุณไม่ถูกแตะต้อง',
} as const;
