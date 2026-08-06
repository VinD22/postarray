/** Korean beta catalog. */
export const stateMessages = {
  'state.draft.label': '초안',
  'state.draft.description': '이 작업공간에 있는 사용자만 볼 수 있습니다. 예정된 것은 없습니다.',
  'state.validation_needed.label': '검증 필요',
  'state.validation_needed.description':
    '하나 이상의 대상에 이를 예약하려면 먼저 해결해야 하는 문제가 있습니다.',
  'state.approval_requested.label': '승인이 요청되었습니다.',
  'state.approval_requested.description': '기다리는 중{approver}결정하다.',
  'state.approved.label': '승인됨',
  'state.approved.description': '승인자{approver}. 이제 예약하거나 게시할 수 있습니다.',
  'state.scheduled.label': '예정됨',
  'state.scheduled.description': '게시{time}~에{timeZone}.',
  'state.preparing_media.label': '미디어 준비',
  'state.preparing_media.description': '플랫폼용 파일 업로드 및 변환.',
  'state.dispatching.label': '파견',
  'state.dispatching.description': '다음으로 보내는 중{provider}지금.',
  'state.provider_processing.label': '공급자 처리',
  'state.provider_processing.description':
    '{provider}업로드를 수락했으며 아직 처리 중입니다. 라이브가 되면 확인합니다.',
  'state.published.label': '게시됨',
  'state.published.description': '라이브{provider}~부터{time}.',
  'state.partially_published.label': '부분적으로 게시됨',
  'state.partially_published.description':
    '{published, plural, other {#개의 타겟이 게시되었습니다.}},{failed, plural, other {# 실패}}. 게시된 게시물은 라이브 상태이며 롤백되지 않았습니다.',
  'state.action_required.label': '조치 필요',
  'state.action_required.description': '당신이 뭔가를 할 때까지 이것은 계속될 수 없습니다.',
  'state.retry_scheduled.label': '재시도 예정',
  'state.retry_scheduled.description':
    '시도{attempt}~의{max}에서 실행됩니다{time}. 아무것도 중복되지 않습니다.',
  'state.failed_permanently.label': '실패한',
  'state.failed_permanently.description':
    '이 작업은 다시 시도되지 않습니다. 귀하의 콘텐츠는 보존되며 그 이유는 영수증에 나와 있습니다.',
  'state.canceled.label': '취소',
  'state.canceled.description': '취소자:{actor}~에{date}. 아무것도 출판되지 않았습니다.',
  'state.deleted_externally.label': '플랫폼에서 삭제됨',
  'state.deleted_externally.description':
    '이 게시물은 더 이상 게시되지 않습니다.{provider}. 영수증과 전송되기 전에 수집된 지표가 유지됩니다.',
  'state.approval.not_required.label': '승인이 필요하지 않습니다.',
  'state.approval.not_required.description':
    '이러한 대상에 대한 정책에는 승인이 필요하지 않습니다.',
  'state.approval.requested.label': '요청됨',
  'state.approval.requested.description': '보낸 사람{approver}{relativeTime}.',
  'state.approval.in_review.label': '검토 중',
  'state.approval.in_review.description': '{approver}지금 이걸 보고 있어요.',
  'state.approval.approved.label': '승인됨',
  'state.approval.approved.description': '승인자{approver}~에{date}.',
  'state.approval.changes_requested.label': '변경 요청됨',
  'state.approval.changes_requested.description': '{approver}변경 사항을 요청했습니다.{date}.',
  'state.approval.rejected.label': '거부됨',
  'state.approval.rejected.description': '거부자:{approver}~에{date}.',
  'state.approval.expired.label': '만료됨',
  'state.approval.expired.description': '이 요청은 다음 날짜에 만료되었습니다.{date}결정도 없이.',
  'state.approval.withdrawn.label': '빼는',
  'state.approval.withdrawn.description': '작성자는 이 요청을 철회했습니다.{date}.',
  'state.summary.targets':
    '{ready, plural, other {# 타겟 준비됨}},{blocked, plural, other {# 차단됨}}',
  'state.changedAt': '변경됨{relativeTime}',
} as const;
