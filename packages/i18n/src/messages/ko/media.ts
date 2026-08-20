/**
 * Media derivatives: the non-generative editor and the refusals it can hit.
 * See `en/media.ts` for the vocabulary rule this file follows: never
 * "generate", "enhance", "upscale", "restore" or "fix", only "version".
 */
export const mediaMessages = {
  'mediaLib.derivative.heading': '이 사진 편집',
  'mediaLib.derivative.description':
    '자르기, 회전, 크기 조정, 형식 변경 또는 압축을 할 수 있습니다. 모든 변경은 이미 파일에 있는 픽셀에만 적용됩니다. 원래 없던 것은 추가되지 않습니다.',
  'mediaLib.derivative.originalKept':
    '원본은 절대 교체되지 않습니다. 각 편집은 구성할 때 선택할 수 있는 별도 버전으로 저장됩니다.',
  'mediaLib.derivative.apply': '이 버전 저장',
  'mediaLib.derivative.applying': '이 버전 저장 중',
  'mediaLib.derivative.discard': '변경 사항 취소',
  'mediaLib.derivative.noChanges': '아직 저장할 내용이 없습니다. 위의 값을 변경하세요.',

  'mediaLib.derivative.tab.crop': '자르기',
  'mediaLib.derivative.tab.transform': '회전 및 크기 조정',
  'mediaLib.derivative.tab.output': '형식',

  'mediaLib.derivative.cropHint':
    '숫자를 입력하거나 아무 필드에서나 화살표 키를 사용하세요. 마우스가 필요한 단계는 없습니다.',
  'mediaLib.derivative.cropX': '왼쪽 가장자리(픽셀)',
  'mediaLib.derivative.cropY': '위쪽 가장자리(픽셀)',
  'mediaLib.derivative.cropWidth': '자르기 너비(픽셀)',
  'mediaLib.derivative.cropHeight': '자르기 높이(픽셀)',
  'mediaLib.derivative.rotate': '회전',
  'mediaLib.derivative.rotateNone': '회전 없음',
  'mediaLib.derivative.rotateDegrees': '시계 방향으로 {degrees}도',
  'mediaLib.derivative.resizeWidth': '새 너비(픽셀)',
  'mediaLib.derivative.resizeHeight': '새 높이(픽셀)',
  'mediaLib.derivative.lockRatio': '한쪽을 바꿀 때 비율 유지',
  'mediaLib.derivative.format': '다른 형식으로 저장',
  'mediaLib.derivative.formatSame': '현재 형식 유지',
  'mediaLib.derivative.quality': '품질',
  'mediaLib.derivative.qualityHint':
    '품질을 낮추면 파일이 작아집니다. JPEG와 WebP에 적용됩니다. PNG는 무손실이며 이 설정을 무시합니다.',
  'mediaLib.derivative.projected': '이 버전은 {width}x{height} 픽셀이 됩니다.',
  'mediaLib.derivative.projectedUnavailable': '이 버전의 크기는 만들어지기 전까지 알 수 없습니다.',

  'mediaLib.derivative.listHeading': '버전',
  'mediaLib.derivative.original': '원본',
  'mediaLib.derivative.originalHint': '항상 보존됩니다. 절대 덮어쓰지 않습니다.',
  'mediaLib.derivative.item': '{width}x{height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': '아직 편집된 버전이 없습니다. 여기에는 원본만 있습니다.',
  'mediaLib.derivative.select': '이 버전 사용',
  'mediaLib.derivative.selected': '이 게시물에 사용 중',
  'mediaLib.derivative.useOriginal': '원본 사용',
  'mediaLib.derivative.processing': '이 버전을 만드는 중입니다. 준비되면 여기에 표시됩니다.',
  'mediaLib.derivative.alreadyExists':
    '이전에 이미 정확히 같은 편집을 하셨으므로, 두 번째 버전을 만드는 대신 그 버전을 다시 사용했습니다.',
  'mediaLib.derivative.failedTitle': '이 버전을 만들 수 없습니다',
  'mediaLib.derivative.failedBody':
    '아무것도 저장되지 않았으며 원본은 그대로입니다. 값을 변경한 후 다시 시도하세요.',
  'mediaLib.derivative.openEditor': '{name} 편집',

  'mediaLib.derivative.unsupportedTitle': '편집은 사진에만 적용됩니다',
  'mediaLib.derivative.unsupportedBody':
    '동영상, 오디오, 문서는 여기서 편집할 수 없습니다. 업로드하기 전에 파일을 준비하세요. 원본 업로드 파일은 어떤 경우에도 변경되지 않습니다.',

  'mediaLib.derivative.nonGenerative':
    'Relay는 이미지나 동영상을 생성하지 않습니다. 이 편집기는 업로드한 항목을 자르고, 회전하고, 크기를 조정하고, 변환하고, 압축하기만 합니다.',

  'error.media_derivative_no_operations.message': '버전을 저장하기 전에 변경 사항을 하나 이상 선택하세요.',
  'error.media_derivative_duplicate_operation.message':
    '각 종류의 변경은 한 번만 나타날 수 있습니다. 두 번째 {operation}을(를) 제거하세요.',
  'error.media_derivative_crop_out_of_bounds.message':
    '이 자르기 영역이 {sourceWidth}x{sourceHeight} 픽셀인 사진의 가장자리를 벗어납니다. 위치를 옮기거나 크기를 줄이세요.',
  'error.media_derivative_upscale_rejected.message':
    '이 편집기는 사진을 절대 확대하지 않습니다. 추가되는 픽셀은 실제가 아니라 만들어진 것이기 때문입니다. 이 버전이 가질 수 있는 최대 크기는 {availableWidth}x{availableHeight}입니다.',
  'error.media_derivative_source_unsupported.message':
    '편집은 JPEG, PNG, WebP, GIF 사진에서만 작동합니다. 이 파일은 {mimeType}입니다.',
  'error.media_derivative_dimensions_unknown.message':
    '아직 이 사진의 크기를 알 수 없어 변경 사항을 확인할 수 없습니다. 처리가 끝나면 다시 시도하세요.',
  'error.media_derivative_format_required.message':
    '저장할 형식을 선택하세요. {sourceMimeType} 파일은 여기서 같은 형식으로 다시 저장할 수 없습니다.',
  'error.media_derivative_quality_unsupported.message':
    'PNG는 무손실이므로 품질 설정은 아무 효과가 없습니다. 설정을 제거하거나 JPEG 또는 WebP로 저장하세요.',
  'error.media_derivative_no_change.message': '이 파일이 이미 사용 중인 형식입니다.',
  'error.media_derivative_source_unavailable.message': '이 버전의 원본이 될 파일이 더 이상 저장소에 없습니다.',
  'error.media_derivative_preset_mismatch.message':
    '이 편집 요청이 설명하는 변경 사항과 일치하지 않습니다. 아무것도 만들어지지 않았습니다. 편집기에서 다시 시도하세요.',
  'error.media_derivative_empty_result.message':
    '편집 결과로 사진이 만들어지지 않아 아무것도 저장되지 않았습니다. 원본은 그대로입니다.',
  'error.media_derivative_transform_failed.message':
    '이 사진을 읽거나 쓸 수 없습니다. 아무것도 저장되지 않았으며 원본은 그대로입니다.',
  'error.media_derivative_write_failed.message':
    '이 버전을 기록할 수 없습니다. 아무것도 저장되지 않았으며 원본은 그대로입니다.',
} as const;
