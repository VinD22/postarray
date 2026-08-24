/** Korean beta catalog. */
export const validationMessages = {
  'validation.text_required.message': '{provider}이 게시물 유형에 대한 텍스트가 필요합니다.',
  'validation.text_too_long.message': '{over, plural, other {#자 제한을 초과했습니다.{account}}}',
  'validation.text_too_long.hint': '{provider}허용한다{limit}이 계정의 문자입니다.',
  'validation.text_too_short.message': '{provider}최소한 필요하다{min}여기 문자.',
  'validation.title_required.message': '{provider}제목이 필요합니다.',
  'validation.title_too_long.message': '제목이 넘었네{limit}글자 수 제한.',
  'validation.description_too_long.message': '설명은 끝났습니다{limit}글자 수 제한.',
  'validation.media_required.message':
    '{provider}이 게시물 유형에는 이미지나 동영상이 하나 이상 필요합니다.',
  'validation.media_count_exceeded.message':
    '{provider}기껏해야 받아들인다{limit, plural, other {# 파일}}여기. 이 게시물에는{count}.',
  'validation.media_type_unsupported.message': '{provider}받아들이지 않는다{mimeType}파일.',
  'validation.media_aspect_ratio_unsupported.message':
    '이 파일은{actual}.{provider}사이의 비율이 필요합니다{min}그리고{max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    '이 문제를 해결하려면 플랫폼 사전 설정으로 자르세요.',
  'validation.media_resolution_too_low.message':
    '이 파일은{actual}.{provider}최소한 필요하다{required}.',
  'validation.media_duration_too_long.message':
    '이 영상은{actual}.{provider}최대 허용{limit}이 계정에 대해.',
  'validation.media_duration_too_short.message':
    '이 영상은{actual}.{provider}최소한 필요하다{limit}.',
  'validation.media_file_too_large.message': '이 파일은{actual}.{provider}최대 허용{limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider}동일한 게시물에 이미지와 동영상을 게시할 수 없습니다.',
  'validation.media_unavailable.message':
    '첨부된 파일을 더 이상 사용할 수 없습니다. 게시물에서 제거하거나 다시 업로드하세요.',
  'validation.alt_text_missing.message':
    '대체 텍스트가 없습니다.{count, plural, other {# 이미지}}.',
  'validation.alt_text_missing.hint': '이미지를 설명하거나 장식용으로 표시하세요.',
  'validation.thumbnail_unsupported.message':
    '{provider}여기서는 맞춤 미리보기 이미지를 허용하지 않습니다.',
  'validation.destination_required.message': '게시 위치를 선택하세요.{provider}.',
  'validation.destination_unsupported.message':
    '{destination}님이 이 게시물 유형을 허용하지 않습니다.{provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, other {#개의 멘션이 실제 계정과 일치하지 않았습니다.}}.',
  'validation.mention_unresolved.hint':
    '검색 결과에서 계정을 선택하거나 언급을 삭제하세요. 일반 텍스트는 기본 태그로 게시되지 않습니다.',
  'validation.hashtag_count_exceeded.message':
    '{count}해시태그.{provider}보다 더 중요하다{limit}스팸으로.',
  'validation.link_not_allowed.message': '{provider}이 필드에는 링크가 허용되지 않습니다.',
  'validation.link_destination_unverified.message':
    '링크 도메인{domain}이 작업공간에 대해서는 확인되지 않았습니다.',
  'validation.privacy_setting_required.message':
    '{provider}게시하기 전에 명시적인 개인 정보 보호 선택이 필요합니다.',
  'validation.privacy_setting_required.hint':
    '기본값은 없습니다. 이 게시물을 볼 수 있는 사람을 선택하세요.',
  'validation.disclosure_required.message':
    '이 게시물에는 프로젝트 규칙에 따른 공개가 필요합니다.{market}.',
  'validation.first_comment_unsupported.message':
    '{provider}이 계정에 대해 예약된 첫 번째 댓글을 지원하지 않습니다.',
  'validation.thread_unsupported.message': '{provider}이 계정에 대한 스레드를 지원하지 않습니다.',
  'validation.repeat_end_required.message':
    '반복 게시물에는 종료 날짜 또는 반복 횟수가 필요합니다.',
  'validation.schedule_in_past.message': '그 시간이 지나갔어{timeZone}.',
  'validation.schedule_too_far_ahead.message':
    '게시물은 최대 {limit} 후까지 예약할 수 있으며, 업로드한 미디어도 같은 기간 동안 보관됩니다.',
  'validation.schedule_outside_quiet_hours.message':
    '이는 설정된 조용한 시간에 속합니다.{project}.',
  'validation.duplicate_within_window.message':
    '매우 유사한 콘텐츠가 이미 예약되었거나 게시되었습니다.{account}이내에{window}.',
  'validation.blocked_term_present.message': '텍스트에 차단된 용어가 포함되어 있습니다.{project}.',
  'validation.unsupported_claim.message': '이 주장은 승인된 주장에 없습니다.{project}.',
  'validation.unsupported_claim.hint': '증거와 함께 승인된 주장에 추가하거나 문장을 바꿔보세요.',
  'validation.cadence_exceeded.message':
    '{account}출판할 것이다{count, plural, other {#회}}그 날, 한도를 초과해서{limit}.',
  'validation.connection_paused.message': '{account}일시중지되어 게시되지 않습니다.',
  'validation.account_type_invalid.message':
    '{account}계정 유형이 아닙니다{provider}이 게시물 유형에는 필요합니다.',
  'validation.severity.error': '수정해야 함',
  'validation.severity.warning': '이것을 확인하세요',
  'validation.severity.info': '귀하의 정보를 위해',
  'validation.field.required': '이 필드는 필수입니다.',
  'validation.field.tooShort': '최소한 사용하세요{min, plural, other {#자}}.',
  'validation.field.tooLong': '최대 사용{max, plural, other {#자}}.',
  'validation.field.invalidEmail': '유효한 이메일 주소를 입력하세요.',
  'validation.field.invalidUrl': 'https를 포함한 전체 URL을 입력하세요.',
  'validation.field.invalidDate': '유효한 날짜를 입력하세요.',
  'validation.field.invalidTime': '유효한 시간을 입력하세요.',
  'validation.field.invalidNumber': '숫자를 입력하세요.',
  'validation.field.outOfRange': '사이의 값을 입력하세요.{min}그리고{max}.',
  'validation.field.mustMatch': '이 두 값은 일치해야 합니다.',
  'validation.field.alreadyTaken': '이미 사용 중입니다.',
  'validation.field.unsafeValue': '여기서는 해당 값이 허용되지 않습니다.',
} as const;
