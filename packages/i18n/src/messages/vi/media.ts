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
  'mediaLib.derivative.heading': 'Chỉnh sửa ảnh này',
  'mediaLib.derivative.description':
    'Cắt, xoay, đổi kích thước, đổi định dạng hoặc nén. Mọi thay đổi đều tác động lên các pixel đã có sẵn trong tệp của bạn. Không có gì được thêm vào mà trước đó chưa từng có.',
  'mediaLib.derivative.originalKept':
    'Bản gốc không bao giờ bị thay thế. Mỗi lần chỉnh sửa được lưu thành một phiên bản riêng mà bạn có thể chọn khi soạn bài.',
  'mediaLib.derivative.apply': 'Lưu phiên bản này',
  'mediaLib.derivative.applying': 'Đang lưu phiên bản này',
  'mediaLib.derivative.discard': 'Bỏ thay đổi',
  'mediaLib.derivative.noChanges': 'Chưa có gì để lưu. Hãy thay đổi một giá trị ở trên.',

  'mediaLib.derivative.tab.crop': 'Cắt',
  'mediaLib.derivative.tab.transform': 'Xoay và đổi kích thước',
  'mediaLib.derivative.tab.output': 'Định dạng',

  'mediaLib.derivative.cropHint':
    'Gõ số, hoặc dùng phím mũi tên trong bất kỳ ô nào. Không có bước nào ở đây cần dùng chuột.',
  'mediaLib.derivative.cropX': 'Cạnh trái, tính bằng pixel',
  'mediaLib.derivative.cropY': 'Cạnh trên, tính bằng pixel',
  'mediaLib.derivative.cropWidth': 'Chiều rộng vùng cắt, tính bằng pixel',
  'mediaLib.derivative.cropHeight': 'Chiều cao vùng cắt, tính bằng pixel',
  'mediaLib.derivative.rotate': 'Xoay',
  'mediaLib.derivative.rotateNone': 'Không xoay',
  'mediaLib.derivative.rotateDegrees': '{degrees} độ theo chiều kim đồng hồ',
  'mediaLib.derivative.resizeWidth': 'Chiều rộng mới, tính bằng pixel',
  'mediaLib.derivative.resizeHeight': 'Chiều cao mới, tính bằng pixel',
  'mediaLib.derivative.lockRatio': 'Giữ nguyên tỷ lệ khi tôi đổi một cạnh',
  'mediaLib.derivative.format': 'Lưu dưới dạng',
  'mediaLib.derivative.formatSame': 'Giữ định dạng hiện tại',
  'mediaLib.derivative.quality': 'Chất lượng',
  'mediaLib.derivative.qualityHint':
    'Chất lượng thấp hơn cho tệp nhỏ hơn. Áp dụng cho JPEG và WebP. PNG không mất dữ liệu và bỏ qua thiết lập này.',
  'mediaLib.derivative.projected': 'Phiên bản này sẽ có kích thước {width} x {height} pixel.',
  'mediaLib.derivative.projectedUnavailable':
    'Kích thước của phiên bản này chưa khả dụng cho đến khi nó được tạo xong.',

  // ==================================================== the versions list ====
  'mediaLib.derivative.listHeading': 'Các phiên bản',
  'mediaLib.derivative.original': 'Bản gốc',
  'mediaLib.derivative.originalHint': 'Luôn được giữ lại. Không bao giờ bị ghi đè.',
  'mediaLib.derivative.item': '{width} x {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Chưa có phiên bản chỉnh sửa nào. Bản gốc là tệp duy nhất ở đây.',
  'mediaLib.derivative.select': 'Dùng phiên bản này',
  'mediaLib.derivative.selected': 'Đang dùng cho bài đăng này',
  'mediaLib.derivative.useOriginal': 'Dùng bản gốc',
  'mediaLib.derivative.processing': 'Phiên bản này đang được tạo. Nó sẽ xuất hiện ở đây khi sẵn sàng.',
  'mediaLib.derivative.alreadyExists':
    'Bạn đã thực hiện đúng chỉnh sửa này trước đây, nên chúng tôi dùng lại phiên bản đó thay vì tạo một bản thứ hai.',
  'mediaLib.derivative.failedTitle': 'Không thể tạo phiên bản này',
  'mediaLib.derivative.failedBody':
    'Không có gì được lưu và bản gốc của bạn không bị ảnh hưởng. Hãy thay đổi các giá trị và thử lại.',
  'mediaLib.derivative.openEditor': 'Chỉnh sửa {name}',

  'mediaLib.derivative.unsupportedTitle': 'Chỉnh sửa chỉ hoạt động với ảnh',
  'mediaLib.derivative.unsupportedBody':
    'Video, âm thanh và tài liệu không thể chỉnh sửa ở đây. Hãy chuẩn bị tệp trước khi bạn tải lên. Bản gốc bạn đã tải lên không bao giờ thay đổi dù thế nào.',

  'mediaLib.derivative.nonGenerative':
    'Relay không tạo ra ảnh hay video. Trình chỉnh sửa này chỉ cắt, xoay, đổi kích thước, chuyển đổi và nén những gì bạn đã tải lên.',

  // ==================================================== refusals ====
  'error.media_derivative_no_operations.message': 'Hãy chọn ít nhất một thay đổi trước khi lưu một phiên bản.',
  'error.media_derivative_duplicate_operation.message':
    'Mỗi loại thay đổi chỉ có thể xuất hiện một lần. Hãy xóa {operation} thứ hai.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Vùng cắt đó vượt ra ngoài mép ảnh, vốn có kích thước {sourceWidth} x {sourceHeight} pixel. Hãy di chuyển hoặc thu nhỏ vùng cắt.',
  'error.media_derivative_upscale_rejected.message':
    'Trình chỉnh sửa này không bao giờ phóng to một bức ảnh, vì các pixel thêm vào sẽ là bịa đặt chứ không phải của bạn. Kích thước lớn nhất phiên bản này có thể đạt là {availableWidth} x {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'Chỉnh sửa chỉ hoạt động với ảnh JPEG, PNG, WebP và GIF. Tệp này là {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Chúng tôi chưa biết kích thước của ảnh này, nên chưa thể kiểm tra thay đổi so với nó. Hãy thử lại khi xử lý hoàn tất.',
  'error.media_derivative_format_required.message':
    'Hãy chọn một định dạng để lưu. Một tệp {sourceMimeType} không thể được lưu lại thành chính nó ở đây.',
  'error.media_derivative_quality_unsupported.message':
    'PNG không mất dữ liệu, nên thiết lập chất lượng sẽ không có tác dụng gì. Hãy bỏ nó, hoặc lưu dưới dạng JPEG hay WebP.',
  'error.media_derivative_no_change.message': 'Đó là định dạng tệp này đang dùng rồi.',
  'error.media_derivative_source_unavailable.message':
    'Tệp mà phiên bản này sẽ được tạo từ đó không còn trong bộ nhớ lưu trữ.',
  'error.media_derivative_preset_mismatch.message':
    'Yêu cầu chỉnh sửa này không khớp với các thay đổi mà nó mô tả. Không có gì được tạo. Hãy thử lại từ trình chỉnh sửa.',
  'error.media_derivative_empty_result.message':
    'Việc chỉnh sửa không tạo ra ảnh nào, nên không có gì được lưu. Bản gốc của bạn không bị ảnh hưởng.',
  'error.media_derivative_transform_failed.message':
    'Không thể đọc hoặc ghi ảnh này. Không có gì được lưu và bản gốc của bạn không bị ảnh hưởng.',
  'error.media_derivative_write_failed.message':
    'Không thể ghi lại phiên bản này. Không có gì được lưu và bản gốc của bạn không bị ảnh hưởng.',
} as const;
