/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 * See `en/posting-sets.ts`: pausing stops work that has not happened yet and
 * never retracts a post that already went out.
 */
export const postingSetMessages = {
  'calendar.hold.action': '일시중지',
  'calendar.hold.resumeAction': '재개',
  'calendar.hold.badge': '일시중지됨',
  'calendar.hold.badgeBilling': '결제 문제로 일시중지됨',
  'calendar.hold.term': '보류',
  'calendar.hold.byPerson': '{date}에 회원님이 일시중지함.',
  'calendar.hold.byBilling': '이 작업공간이 전체 액세스 권한을 잃어 {date}에 일시중지됨.',
  'calendar.hold.none': '일시중지되지 않음',

  'calendar.hold.confirmTitle': '이 게시물을 일시중지하시겠습니까?',
  'calendar.hold.confirmBody':
    '이 게시물은 현재 상태를 유지하며 {time}에 게시되지 않습니다. 그 전까지 언제든 재개할 수 있으며, 그 시간이 이미 지났다면 새 시간을 선택할 수 있습니다.',
  'calendar.hold.confirmScope':
    '일시중지는 아직 일어나지 않은 일을 멈춥니다. 이미 플랫폼에 게시된 것은 그대로 게시된 상태로 남으며, 일시중지가 이를 삭제하거나 수정하지 않습니다.',
  'calendar.hold.confirmNoteLabel': '왜 일시중지하시나요? (선택 사항)',
  'calendar.hold.confirmNoteHint': '팀을 위한 감사 기록에 보관됩니다. 어떤 플랫폼에도 전송되지 않습니다.',
  'calendar.hold.confirm': '이 게시물 일시중지',
  'calendar.hold.cancel': '예약 상태 유지',

  'calendar.hold.resumeTitle': '이 게시물을 재개하시겠습니까?',
  'calendar.hold.resumeBody': '{timeZone} 기준 {time}에 게시됩니다.',
  'calendar.hold.resumeMissedTitle': '해당 시간이 지났습니다',
  'calendar.hold.resumeMissedBody':
    '이 게시물은 일시중지되어 있는 동안 {time}에 게시될 예정이었습니다. 재개하는 순간 바로 게시되지 않도록 새 시간을 선택하세요.',
  'calendar.hold.resumeTimeLabel': '새 게시 시간',
  'calendar.hold.resumeConfirm': '재개',

  'calendar.hold.paused': '일시중지됨. 재개할 때까지 게시되지 않습니다.',
  'calendar.hold.resumed': '재개됨. {time}에 게시됩니다.',

  'calendar.hold.blocked.published':
    '이 게시물은 이미 게시되었습니다. 일시중지로는 플랫폼에서 게시물을 되돌릴 수 없습니다.',
  'calendar.hold.blocked.inFlight':
    '이 게시물은 지금 전송 중입니다. 일시중지하기에는 이미 늦었으며, 중간에 멈추면 일부만 게시된 상태로 남을 수 있습니다.',
  'calendar.hold.blocked.finished': '이 게시물은 이미 완료되어 일시중지할 것이 없습니다.',
  'calendar.hold.blocked.billing':
    '이 게시물은 작업공간이 전체 액세스 권한을 잃어 보류 중입니다. 재개는 예약이 아니라 결제 문제입니다.',
  'calendar.hold.blocked.billingAction': '결제로 이동',

  'set.title': '게시 세트',
  'set.lede': '"이것을 누구에게, 어떻게 게시할지"에 대한 저장된 답변입니다. 세트를 적용하면 그 설정이 새 초안에 복사됩니다.',
  'set.appliedOnce':
    '세트는 적용할 때 한 번 읽힙니다. 나중에 세트를 편집하면 다음 게시물이 시작되는 값이 바뀝니다. 이미 세트로 만든 초안과 예약된 게시물은 그대로 유지됩니다.',
  'set.empty.title': '아직 세트가 없습니다',
  'set.empty.body': '매번 같은 계정 목록을 다시 만들지 않도록 세트를 만드세요.',
  'set.create': '새 세트',
  'set.edit': '세트 편집',
  'set.archive': '세트 보관',
  'set.archived': '보관됨',
  'set.archivedNote': '보관된 세트는 선택 목록에서 숨겨집니다. 세트로 만든 게시물은 변경되지 않습니다.',
  'set.showArchived': '보관된 항목 표시',
  'set.saved': '세트가 저장되었습니다.',
  'set.archivedToast': '세트가 보관되었습니다. 이미 만든 게시물은 변경되지 않습니다.',

  'set.field.name': '이름',
  'set.field.nameHint': '선택 목록에서 찾을 이름입니다. 프로젝트당 하나.',
  'set.field.description': '설명',
  'set.field.descriptionHint': '선택 사항입니다. 이 세트의 용도.',
  'set.field.targets': '계정',
  'set.field.targetsHint': '이 세트로 만든 게시물이 시작하는 모든 계정입니다.',
  'set.field.targetCount': '{count, plural, other {계정 #개}}',
  'set.field.signature': '서명',
  'set.field.signatureNone': '서명 없음',
  'set.field.approval': '승인',
  'set.field.approvalHint': '이 세트로 만든 게시물이 게시되기 전에 필요한 승인입니다.',
  'set.field.schedule': '게시 시점',

  'set.approval.none': '승인 불필요',
  'set.approval.single_approver': '지정된 승인자 1명',
  'set.approval.any_approver': '아무 승인자',
  'set.approval.named_approver': '특정 승인자',
  'set.approval.policy_auto': '작업공간 정책에 따름',

  'set.slot.next_free_slot': '대기열의 다음 빈 슬롯',
  'set.slot.next_free_slotHint': '이 프로젝트의 대기열 규칙을 사용해 시간을 제안합니다. 제안만 하며, 수락은 회원님이 합니다.',
  'set.slot.pick_time': '시간을 물어봐 주세요',
  'set.slot.pick_timeHint': '세트를 적용해도 시간은 비워 두어 직접 선택할 수 있습니다.',
  'set.slot.draft_only': '초안으로 남겨두기',
  'set.slot.draft_onlyHint': '세트를 적용해도 일정은 전혀 건드리지 않습니다.',
  'set.slot.noRules': '이 프로젝트에는 아직 대기열 규칙이 없으므로, 대기열은 가장 빠른 빈 시간을 제안하고 그렇게 안내합니다.',
  'set.slot.rulesLink': '대기열 규칙',

  'set.defaults.title': '플랫폼별 기본값',
  'set.defaults.body': '새 게시물마다 복사되는 초기 값입니다. 이후 컴포저에서 언제든 변경할 수 있습니다.',
  'set.defaults.add': '플랫폼 추가',
  'set.defaults.remove': '{platform} 기본값 제거',
  'set.defaults.privacy': '공개 범위',
  'set.defaults.privacyNone': '플랫폼 기본값',
  'set.defaults.bodyPrefix': '게시물 앞에 붙는 텍스트',
  'set.defaults.bodySuffix': '게시물 뒤에 붙는 텍스트',
  'set.defaults.requireAltText': '모든 이미지에 대체 텍스트 요구',
  'set.defaults.requireAltTextHint':
    '이 세트로 만든 게시물은 모든 이미지에 대체 텍스트가 있을 때까지 이 플랫폼에 예약할 수 없습니다.',
  'set.defaults.empty': '플랫폼별 기본값이 없습니다. 모든 계정은 마스터 게시물에서 시작합니다.',

  'set.error.nameTaken': '이 프로젝트의 다른 세트가 이미 그 이름을 사용하고 있습니다.',
  'set.error.archived': '이 세트는 보관되어 있습니다. 편집하기 전에 복원하세요.',
  'set.error.duplicateTarget': '그 계정은 이미 이 세트에 있습니다.',
  'set.error.duplicatePlatform': '이 세트에는 이미 해당 플랫폼의 기본값이 있습니다.',

  'targetMemory.setting.title': '게시물 간 계정 기억',
  'targetMemory.setting.body':
    '이 기능이 켜져 있으면 컴포저는 새 게시물마다 이 프로젝트에서 그 사람이 지난번에 선택한 계정으로 시작합니다. 켜지 않는 한 꺼져 있습니다.',
  'targetMemory.setting.stored':
    '계정 목록만 저장되며, 그것도 선택한 사람에 한해서만 저장됩니다. 문구, 시간, 공개 범위 설정, 승인 상태는 저장되지 않으며, 프로젝트의 다른 누구도 회원님의 목록을 볼 수 없습니다.',
  'targetMemory.setting.offNote': '이 기능이 꺼져 있는 동안에는 아무것도 저장되지 않습니다.',
  'targetMemory.setting.turnOffWarning': '이 기능을 끄면 이 프로젝트의 저장된 모든 선택 항목이 모든 사람에 대해 삭제됩니다.',
  'targetMemory.setting.enabled': '켜짐',
  'targetMemory.setting.disabled': '꺼짐',
  'targetMemory.setting.saved': '설정이 저장되었습니다.',
  'targetMemory.setting.cleared': '설정이 저장되었습니다. 이 프로젝트에 저장된 선택 항목이 삭제되었습니다.',

  'targetMemory.composer.restored': '{count, plural, other {지난번 계정 #개로 시작함.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, other {지난번에 사용한 계정 #개는 주의가 필요해 제외되었습니다.}}',
  'targetMemory.composer.droppedAll':
    '지난번에 사용한 계정 중 지금 사용할 수 있는 것이 없어, 미리 선택된 항목이 없습니다.',
  'targetMemory.composer.undo': '선택 지우기',
  'targetMemory.composer.forget': '내 계정 기억 중지',
  'targetMemory.composer.forgotten': '저장된 선택 항목이 삭제되었습니다.',
  'targetMemory.composer.reviewAccounts': '계정 검토',
} as const;
