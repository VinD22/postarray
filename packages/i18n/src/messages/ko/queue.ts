/**
 * Queue rules and slot reservations. See `en/queue.ts`: the `queue.reason.*`
 * keys are read back by a person and, years later, by an audit, so they
 * report exactly what happened, including the daylight-saving cases.
 */
export const queueMessages = {
  'queue.title': '게시 대기열',
  'queue.subtitle':
    '이 프로젝트가 언제, 어떤 간격으로 게시할지를 나타냅니다. 사람이 시간을 수락하지 않으면 아무것도 게시되지 않습니다.',

  'queue.rules.heading': '대기열 규칙',
  'queue.rules.empty': '아직 대기열 규칙이 없습니다. 규칙을 추가하기 전까지 다음 슬롯은 단순히 가장 빠른 빈 시간입니다.',
  'queue.rules.create': '새 대기열 규칙',
  'queue.rules.count': '{count, plural, other {규칙 #개}}',
  'queue.rules.enabled': '사용 중',
  'queue.rules.disabled': '일시 중지됨',
  'queue.rules.archived': '보관됨',
  'queue.rules.edit': '규칙 편집',
  'queue.rules.archive': '규칙 보관',
  'queue.rules.archiveHelp': '보관하면 향후 제안이 중단됩니다. 이미 예약된 슬롯은 시간과 사유를 그대로 유지합니다.',

  'queue.field.name': '규칙 이름',
  'queue.field.nameHelp': '나중에 알아볼 수 있는 이름, 예를 들어 평일 아침.',
  'queue.field.timeZone': '시간대',
  'queue.field.timeZoneHelp': '윈도, 일일 개수, 차단 날짜는 모두 이 시간대로 읽힙니다.',
  'queue.field.minimumGap': '최소 간격',
  'queue.field.minimumGapHelp': '두 게시물 사이의 분입니다. 0은 간격 규칙이 없다는 뜻입니다.',
  'queue.field.maximumPerDay': '일일 최대',
  'queue.field.maximumPerDayHelp':
    '일일 한도를 두지 않으려면 비워 두세요. 0은 이 규칙이 아무것도 제안하지 않는다는 뜻입니다.',
  'queue.field.maximumPerDayUnlimited': '일일 한도 없음',
  'queue.field.priority': '우선순위',
  'queue.field.priorityHelp': '슬롯을 제안할 수 있는 규칙 중 우선순위가 가장 높은 규칙이 사용됩니다.',
  'queue.field.enabled': '이 규칙 사용',

  'queue.windows.heading': '주간 윈도',
  'queue.windows.help':
    '이 프로젝트가 게시할 수 있는 현지 시간을 선택하세요. 요일과 시간 필드를 사용하거나 그리드의 버튼을 사용하세요.',
  'queue.windows.empty': '아직 윈도가 없습니다. 윈도가 없는 규칙은 슬롯을 제안할 수 없습니다.',
  'queue.windows.add': '윈도 추가',
  'queue.windows.remove': '윈도 제거',
  'queue.windows.entry': '{weekday}, {start}~{end}',
  'queue.windows.start': '시작',
  'queue.windows.end': '종료',
  'queue.windows.weekday': '요일',
  'queue.windows.toggleCell': '{weekday} {hour}시',
  'queue.windows.gridLabel': '주간 가능 시간, 요일과 시간마다 버튼 하나',

  'queue.weekday.1': '월요일',
  'queue.weekday.2': '화요일',
  'queue.weekday.3': '수요일',
  'queue.weekday.4': '목요일',
  'queue.weekday.5': '금요일',
  'queue.weekday.6': '토요일',
  'queue.weekday.7': '일요일',

  'queue.blackouts.heading': '차단 날짜',
  'queue.blackouts.help': '이 프로젝트가 게시하지 않을 날짜이며, 규칙의 시간대로 읽힙니다.',
  'queue.blackouts.empty': '차단 날짜가 없습니다.',
  'queue.blackouts.add': '차단 날짜 추가',
  'queue.blackouts.remove': '차단 날짜 제거',
  'queue.blackouts.from': '첫날',
  'queue.blackouts.to': '마지막 날',
  'queue.blackouts.entry': '{from}부터 {to}까지',

  'queue.connections.heading': '계정',
  'queue.connections.all': '이 프로젝트의 모든 계정',
  'queue.connections.scoped': '이 규칙이 적용되는 계정 {count, plural, other {#개}}',

  'queue.slot.heading': '다음 대기열 슬롯',
  'queue.slot.action': '다음 대기열 슬롯 사용',
  'queue.slot.proposed': '{timeZone} 기준 {local}',
  'queue.slot.utc': 'UTC로는 {utc}입니다.',
  'queue.slot.why': '이 시간인 이유',
  'queue.slot.accept': '이 시간 사용',
  'queue.slot.release': '다른 시간 선택',
  'queue.slot.expires': '이 제안은 {expires}까지 유지됩니다.',
  'queue.slot.unavailable': '지금은 대기열 슬롯을 사용할 수 없습니다.',
  'queue.slot.pending': '다음 슬롯을 찾는 중입니다.',
  'queue.slot.accepted': '{timeZone} 기준 {local}로 예약되었습니다.',
  'queue.slot.notAutomatic': '이 시간을 선택하기 전까지는 아무것도 예약되지 않습니다.',

  'queue.reason.noRulesConfigured': '이 프로젝트에는 설정된 대기열 규칙이 없어 어떤 윈도도 적용되지 않았습니다.',
  'queue.reason.fallbackFirstFreeHour': '대신 지금 이후 가장 빠른 빈 시간이 사용되었습니다.',
  'queue.reason.matchedRule': '{zone} 시간대에서 {name} 규칙이 이 시간을 선택했습니다.',
  'queue.reason.matchedWindow': '{zone} 시간대의 {start}~{end} 윈도에 해당합니다.',
  'queue.reason.minimumGap': '다른 모든 게시물로부터 최소 {minutes}분 떨어져 있습니다.',
  'queue.reason.noMinimumGap': '이 규칙은 게시물 사이 최소 간격을 설정하지 않습니다.',
  'queue.reason.dailyCap': '그날은 최대 {limit}개의 게시물을 담을 수 있으며, 아직 다 차지 않았습니다.',
  'queue.reason.dailyCapUnlimited': '이 규칙은 일일 한도를 설정하지 않습니다.',
  'queue.reason.blackoutSkipped':
    '여기에 도달하기 위해 차단일 {days, plural, other {#일}}을(를) 건너뛰었습니다.',
  'queue.reason.dstNonexistentSkipped':
    '{zone} 시간대에서는 윈도의 첫 시간이 그 날짜에 존재하지 않아, 존재하는 다음 시간이 사용되었습니다.',
  'queue.reason.dstAmbiguousFirst':
    '{zone} 시간대에서는 그 현지 시간이 해당 날짜에 두 번 발생합니다. 첫 번째 발생이 사용되었습니다.',
  'queue.reason.priorityChosen':
    '이 규칙은 제안 가능한 규칙 중 가장 높은 우선순위인 {priority}를 가지고 있습니다.',
  'queue.reason.connectionScoped': '이 규칙은 계정 {count, plural, other {#개}}에 적용됩니다.',
  'queue.reason.horizonExhausted': '{days}일 이내에 빈 윈도를 찾지 못했습니다.',
} as const;
