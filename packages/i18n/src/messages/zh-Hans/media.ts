export const mediaMessages = {
  'mediaLib.derivative.heading': '编辑此图片',
  'mediaLib.derivative.description':
    '裁剪、旋转、调整大小、更改格式或压缩。每次更改都作用于文件中已有的像素，不会添加原本没有的内容。',
  'mediaLib.derivative.originalKept':
    '原图永远不会被替换。每次编辑都会保存为一个单独的版本，供您在创作时选择。',
  'mediaLib.derivative.apply': '保存此版本',
  'mediaLib.derivative.applying': '正在保存此版本',
  'mediaLib.derivative.discard': '放弃更改',
  'mediaLib.derivative.noChanges': '尚无可保存的内容。请在上方更改一个值。',

  'mediaLib.derivative.tab.crop': '裁剪',
  'mediaLib.derivative.tab.transform': '旋转与调整大小',
  'mediaLib.derivative.tab.output': '格式',

  'mediaLib.derivative.cropHint':
    '输入数字，或在任意字段中使用方向键。此处的任何步骤都不需要使用鼠标。',
  'mediaLib.derivative.cropX': '左边缘，以像素为单位',
  'mediaLib.derivative.cropY': '上边缘，以像素为单位',
  'mediaLib.derivative.cropWidth': '裁剪宽度，以像素为单位',
  'mediaLib.derivative.cropHeight': '裁剪高度，以像素为单位',
  'mediaLib.derivative.rotate': '旋转',
  'mediaLib.derivative.rotateNone': '不旋转',
  'mediaLib.derivative.rotateDegrees': '顺时针旋转 {degrees} 度',
  'mediaLib.derivative.resizeWidth': '新宽度，以像素为单位',
  'mediaLib.derivative.resizeHeight': '新高度，以像素为单位',
  'mediaLib.derivative.lockRatio': '更改一边时保持形状',
  'mediaLib.derivative.format': '保存为',
  'mediaLib.derivative.formatSame': '保持当前格式',
  'mediaLib.derivative.quality': '质量',
  'mediaLib.derivative.qualityHint':
    '较低的质量会生成较小的文件。适用于 JPEG 和 WebP。PNG 为无损格式，会忽略此设置。',
  'mediaLib.derivative.projected': '此版本的尺寸将为 {width} × {height} 像素。',
  'mediaLib.derivative.projectedUnavailable':
    '此版本生成之前，其尺寸不可用。',

  'mediaLib.derivative.listHeading': '版本',
  'mediaLib.derivative.original': '原图',
  'mediaLib.derivative.originalHint': '始终保留，从不被覆盖。',
  'mediaLib.derivative.item': '{width} × {height}，{mimeType}，{size}',
  'mediaLib.derivative.empty': '尚无编辑版本。原图是此处唯一的文件。',
  'mediaLib.derivative.select': '使用此版本',
  'mediaLib.derivative.selected': '正用于此帖子',
  'mediaLib.derivative.useOriginal': '使用原图',
  'mediaLib.derivative.processing': '此版本正在生成中，就绪后会显示在此处。',
  'mediaLib.derivative.alreadyExists':
    '您之前已进行过完全相同的编辑，因此我们复用了该版本，而不是生成第二个。',
  'mediaLib.derivative.failedTitle': '无法生成此版本',
  'mediaLib.derivative.failedBody':
    '没有保存任何内容，您的原图未受影响。请更改数值后重试。',
  'mediaLib.derivative.openEditor': '编辑 {name}',

  'mediaLib.derivative.unsupportedTitle': '编辑功能仅适用于图片',
  'mediaLib.derivative.unsupportedBody':
    '视频、音频和文档无法在此处编辑。请在上传前准备好文件。无论哪种情况，您原始上传的内容都不会更改。',

  'mediaLib.derivative.nonGenerative':
    'Relay 不生成图片或视频。此编辑器只对您上传的内容进行裁剪、旋转、调整大小、转换和压缩。',

  'error.media_derivative_no_operations.message': '保存版本前请至少选择一项更改。',
  'error.media_derivative_duplicate_operation.message':
    '每种更改只能出现一次，请删除第二个 {operation}。',
  'error.media_derivative_crop_out_of_bounds.message':
    '该裁剪范围超出了图片边缘，图片尺寸为 {sourceWidth} × {sourceHeight} 像素。请移动或缩小裁剪范围。',
  'error.media_derivative_upscale_rejected.message':
    '此编辑器绝不会放大图片，因为额外的像素将是凭空生成的，而非您原有的内容。此版本的最大尺寸为 {availableWidth} × {availableHeight}。',
  'error.media_derivative_source_unsupported.message':
    '编辑功能仅适用于 JPEG、PNG、WebP 和 GIF 图片。此文件为 {mimeType}。',
  'error.media_derivative_dimensions_unknown.message':
    '我们尚不知道此图片的尺寸，因此无法核实更改。请在处理完成后重试。',
  'error.media_derivative_format_required.message':
    '请选择要保存的格式。{sourceMimeType} 文件在此处无法以其自身格式重新保存。',
  'error.media_derivative_quality_unsupported.message':
    'PNG 为无损格式，因此质量设置不会产生任何效果。请移除该设置，或改为保存为 JPEG 或 WebP。',
  'error.media_derivative_no_change.message': '这已经是此文件当前使用的格式。',
  'error.media_derivative_source_unavailable.message':
    '此版本原本要生成自的文件已不在存储中。',
  'error.media_derivative_preset_mismatch.message':
    '此编辑请求与其所描述的更改不匹配。未生成任何内容，请从编辑器重试。',
  'error.media_derivative_empty_result.message':
    '此次编辑未产生图片，因此未保存任何内容。您的原图未受影响。',
  'error.media_derivative_transform_failed.message':
    '此图片无法被读取或写入。未保存任何内容，您的原图未受影响。',
  'error.media_derivative_write_failed.message':
    '此版本无法被记录。未保存任何内容，您的原图未受影响。',
} as const;
