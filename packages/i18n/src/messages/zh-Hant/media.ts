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
  'mediaLib.derivative.heading': '編輯這張圖片',
  'mediaLib.derivative.description':
    '裁切、旋轉、調整尺寸、變更格式或壓縮。每項變更都作用於你檔案中既有的像素，不會新增原本沒有的內容。',
  'mediaLib.derivative.originalKept': '原始檔案永遠不會被取代。每次編輯都會另存為一個版本，供你在撰寫貼文時選用。',
  'mediaLib.derivative.apply': '儲存此版本',
  'mediaLib.derivative.applying': '正在儲存此版本',
  'mediaLib.derivative.discard': '捨棄變更',
  'mediaLib.derivative.noChanges': '目前沒有可儲存的內容，請先變更上方的數值。',

  'mediaLib.derivative.tab.crop': '裁切',
  'mediaLib.derivative.tab.transform': '旋轉與調整尺寸',
  'mediaLib.derivative.tab.output': '格式',

  'mediaLib.derivative.cropHint': '請輸入數字，或在任一欄位使用方向鍵。此處沒有任何步驟需要用到滑鼠。',
  'mediaLib.derivative.cropX': '左邊界（像素）',
  'mediaLib.derivative.cropY': '上邊界（像素）',
  'mediaLib.derivative.cropWidth': '裁切寬度（像素）',
  'mediaLib.derivative.cropHeight': '裁切高度（像素）',
  'mediaLib.derivative.rotate': '旋轉',
  'mediaLib.derivative.rotateNone': '不旋轉',
  'mediaLib.derivative.rotateDegrees': '順時針 {degrees} 度',
  'mediaLib.derivative.resizeWidth': '新寬度（像素）',
  'mediaLib.derivative.resizeHeight': '新高度（像素）',
  'mediaLib.derivative.lockRatio': '變更一邊時保持形狀比例',
  'mediaLib.derivative.format': '另存為',
  'mediaLib.derivative.formatSame': '維持目前格式',
  'mediaLib.derivative.quality': '品質',
  'mediaLib.derivative.qualityHint': '較低的品質會產生較小的檔案。此設定適用於 JPEG 與 WebP。PNG 為無損格式，此設定對其無效。',
  'mediaLib.derivative.projected': '此版本將會是 {width} x {height} 像素。',
  'mediaLib.derivative.projectedUnavailable': '此版本製作完成前，尺寸資訊尚無法使用。',

  // ==================================================== the versions list ====
  'mediaLib.derivative.listHeading': '版本',
  'mediaLib.derivative.original': '原始檔案',
  'mediaLib.derivative.originalHint': '永久保留，絕不會被覆寫。',
  'mediaLib.derivative.item': '{width} x {height}，{mimeType}，{size}',
  'mediaLib.derivative.empty': '尚無已編輯的版本，這裡只有原始檔案。',
  'mediaLib.derivative.select': '使用此版本',
  'mediaLib.derivative.selected': '此貼文正在使用',
  'mediaLib.derivative.useOriginal': '使用原始檔案',
  'mediaLib.derivative.processing': '此版本正在製作中，完成後會出現在這裡。',
  'mediaLib.derivative.alreadyExists': '你先前已進行過完全相同的編輯，因此我們重複使用了該版本，而非再建立一次。',
  'mediaLib.derivative.failedTitle': '無法製作此版本',
  'mediaLib.derivative.failedBody': '未儲存任何內容，你的原始檔案未受影響。請變更數值後再試一次。',
  'mediaLib.derivative.openEditor': '編輯 {name}',

  'mediaLib.derivative.unsupportedTitle': '編輯功能僅適用於圖片',
  'mediaLib.derivative.unsupportedBody': '此處無法編輯影片、音訊與文件，請在上傳前先行準備好檔案。無論如何，你上傳的原始檔案都不會被變更。',

  'mediaLib.derivative.nonGenerative':
    'Relay 不會生成圖片或影片。此編輯工具只會裁切、旋轉、調整尺寸、轉換與壓縮你上傳的內容。',

  // ==================================================== refusals ====
  'error.media_derivative_no_operations.message': '請先選擇至少一項變更，再儲存版本。',
  'error.media_derivative_duplicate_operation.message': '每種變更類型只能出現一次，請移除第二個 {operation}。',
  'error.media_derivative_crop_out_of_bounds.message':
    '該裁切範圍超出圖片邊界，圖片尺寸為 {sourceWidth} x {sourceHeight} 像素。請移動或縮小裁切範圍。',
  'error.media_derivative_upscale_rejected.message':
    '此編輯工具絕不會放大圖片，因為多出來的像素會是憑空生成而非你原本擁有的。此版本可達到的最大尺寸為 {availableWidth} x {availableHeight}。',
  'error.media_derivative_source_unsupported.message': '編輯功能僅適用於 JPEG、PNG、WebP 與 GIF 圖片，此檔案為 {mimeType}。',
  'error.media_derivative_dimensions_unknown.message': '我們尚不知道此圖片的尺寸，因此無法對照該變更進行檢查。請在處理完成後再試一次。',
  'error.media_derivative_format_required.message': '請選擇要另存的格式，此處無法將 {sourceMimeType} 檔案另存為相同格式。',
  'error.media_derivative_quality_unsupported.message': 'PNG 為無損格式，品質設定不會產生任何效果。請移除該設定，或另存為 JPEG 或 WebP。',
  'error.media_derivative_no_change.message': '此檔案已是該格式。',
  'error.media_derivative_source_unavailable.message': '此版本原本要使用的來源檔案，已不在儲存空間中。',
  'error.media_derivative_preset_mismatch.message': '此編輯請求與其描述的變更不符，未製作任何內容。請從編輯工具重新開始。',
  'error.media_derivative_empty_result.message': '此編輯未產生任何圖片，因此未儲存任何內容，你的原始檔案未受影響。',
  'error.media_derivative_transform_failed.message': '無法讀取或寫入此圖片，未儲存任何內容，你的原始檔案未受影響。',
  'error.media_derivative_write_failed.message': '無法記錄此版本，未儲存任何內容，你的原始檔案未受影響。',
} as const;
