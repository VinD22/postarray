/**
 * The per platform scheduler pages. Only the `web.schedule.*`,
 * `web.meta.schedule.*` and `web.meta.schedulePlatform.*` keys are
 * translated here; the `/specs` cluster (`web.specs.*`, `web.meta.specs.*`,
 * `web.meta.specsPlatform.*`) in `en/web-platforms.ts` is out of this
 * locale's current coverage and falls back to English. See `en/web-platforms.ts`
 * for the rule this file follows: no string here may name a platform, a
 * character ceiling, a file size or a capability; those come only from the
 * generated dataset the page reads.
 */
export const webPlatformsMessages = {
  'web.meta.schedule.title': '플랫폼별 예약',
  'web.meta.schedule.description':
    '출시 코호트의 각 플랫폼이 연결된 계정에 요구하는 사항, 공식 API가 적용하는 한도, 그리고 이 제품이 그에 맞춰 얼마나 진행되었는지.',
  'web.meta.schedulePlatform.title': '{platform} 예약',
  'web.meta.schedulePlatform.description':
    '{platform}이(가) 연결된 계정에 요구하는 사항, 공식 API가 적용하는 한도, 그리고 이 제품이 구축한 부분.',

  'web.schedule.index.title': '플랫폼별 예약',
  'web.schedule.index.lede':
    '출시 코호트의 플랫폼마다 한 페이지씩입니다. 각 페이지는 플랫폼이 연결된 계정에 요구하는 사항, 공식 API가 적용하는 한도, 그리고 구축 현황을 명시합니다. 모든 수치에는 출처 문서와 사람이 이를 읽은 날짜가 함께 표시됩니다.',
  'web.schedule.index.listLabel': '출시 코호트의 플랫폼',
  'web.schedule.index.cohortNote':
    '코호트는 이 제품이 구축 대상으로 삼는 플랫폼 집합입니다. 이는 계획이지 사용 가능 목록이 아닙니다.',
  'web.schedule.index.limitsKnown': '기록된 한도',
  'web.schedule.index.limitsUnknown': '아직 기록되지 않은 한도',

  'web.schedule.platform.title': '{platform} 예약',
  'web.schedule.platform.lede':
    '{platform}이(가) 연결된 계정에 요구하는 사항, 공식 API가 적용하는 한도, 그리고 이 제품이 지금까지 그중 무엇을 구축했는지.',

  'web.schedule.notice.title': '{platform}에는 아직 아무것도 게시되지 않습니다',
  'web.schedule.notice.body':
    '어떤 커넥터도 완료 기준을 통과하지 못했고, 어느 것도 프로덕션에서 검증되지 않았습니다. 이 페이지는 플랫폼이 요구하는 사항과 이 제품이 지원하려는 사항을 설명합니다. 작동하는 예약 도구를 설명하는 것이 아닙니다.',

  'web.schedule.requirements.title': '{platform}의 요구 사항',
  'web.schedule.requirements.accountTypes': '계정 유형',
  'web.schedule.requirements.restriction': '플랫폼 제한',
  'web.schedule.requirements.cost': 'API 비용',
  'web.schedule.requirements.unavailable.title': '아직 검토된 커넥터 기록이 없습니다',
  'web.schedule.requirements.unavailable.body':
    '이 플랫폼은 마지막 커넥터 조사 이후 코호트에 합류했으므로, 표시할 계정 요구 사항의 날짜가 기록된 자료가 없습니다. 누군가 공식 문서를 읽고 기록하면 여기에 표시됩니다.',
  'web.schedule.requirements.apiSource': '공식 API 문서',
  'web.schedule.requirements.policySource': '플랫폼 정책',

  'web.schedule.limits.title': '{platform}이(가) 적용하는 한도',
  'web.schedule.limits.lede':
    '상향된 자격이 없는, 방금 연결한 계정을 기준으로 읽은 값입니다. 플랫폼은 누구에게도 알리지 않고 이 값들을 올리거나 내릴 수 있으므로, 각 세트에는 읽은 날짜가 함께 표시됩니다.',
  'web.schedule.limits.unavailable.title': '{platform}의 한도가 기록되지 않았습니다',
  'web.schedule.limits.unavailable.body':
    '이 빌드에는 이 플랫폼용 어댑터가 없으므로 표시할 기록된 상한이 없습니다. 지어낸 숫자는 아예 없는 것보다 더 나쁩니다.',
  'web.schedule.limits.sourceLabel': '공식 플랫폼 문서',

  'web.schedule.limits.text': '본문 텍스트',
  'web.schedule.limits.title_field': '제목 필드',
  'web.schedule.limits.countingUnit': '문자를 세는 방식',
  'web.schedule.limits.links': '링크를 세는 방식',
  'web.schedule.limits.images': '게시물당 이미지',
  'web.schedule.limits.videos': '게시물당 동영상',
  'web.schedule.limits.videoDuration': '동영상 길이',
  'web.schedule.limits.imageBytes': '최대 이미지 크기',
  'web.schedule.limits.gifBytes': '최대 애니메이션 이미지 크기',
  'web.schedule.limits.videoBytes': '최대 동영상 크기',
  'web.schedule.limits.documentBytes': '최대 문서 크기',
  'web.schedule.limits.altText': '대체 텍스트',
  'web.schedule.limits.mimeTypes': '허용되는 파일 형식',
  'web.schedule.limits.markdown': '서식 기호',

  'web.schedule.value.characters': '{count, plural, other {#자}}',
  'web.schedule.value.files': '{count, plural, =0 {없음} other {#개 파일}}',
  'web.schedule.value.durationRange': '{min}~{max}',
  'web.schedule.value.durationMax': '최대 {max}',
  'web.schedule.value.markdownYes': '허용됨',
  'web.schedule.value.markdownNo': '일반 문자로 게시됨',

  'web.schedule.unit.utf16':
    'UTF-16 코드 단위 기준이며, 대부분의 편집기가 문자 수로 보고하는 방식입니다.',
  'web.schedule.unit.grapheme': '자소 기준이므로, 여러 코드 포인트로 이루어진 이모지도 여전히 문자 하나로 계산됩니다.',
  'web.schedule.unit.weighted': '대부분의 비라틴 문자가 1이 아닌 2로 계산되는 가중치 방식입니다.',

  'web.schedule.link.none': '링크는 상한에 포함되지 않습니다.',
  'web.schedule.link.actual': '링크는 차지하는 문자 수만큼 정확히 계산됩니다.',
  'web.schedule.link.fixed':
    '모든 링크는 플랫폼의 단축 URL로 다시 작성되며, 실제 길이와 관계없이 {count, plural, other {#자}}로 계산됩니다.',

  'web.schedule.capabilities.title': '{platform}에 구축된 항목',
  'web.schedule.capabilities.lede':
    '"플랫폼에서 제공하지 않음"은 플랫폼에 대한 사실이며 최종적입니다. "아직 구축되지 않음"은 이 제품에 대한 사실이며, 어떤 커넥터도 완료 기준을 통과하지 못한 동안의 정직한 기본값입니다. 이는 커넥터 레지스트리에서 생성되며 여기에 직접 작성되지 않습니다.',
  'web.schedule.capabilities.unavailable.title': '{platform}에 대한 기능 기록이 아직 없습니다',
  'web.schedule.capabilities.unavailable.body':
    '이 빌드에는 어댑터가 없어 레지스트리가 보고할 내용이 없습니다. 실제로 알릴 내용이 생기는 즉시 이 행이 기능 매트릭스에 표시됩니다.',
  'web.schedule.capabilities.matrixLink': '전체 기능 매트릭스 보기',

  'web.schedule.next.title': '다음으로 갈 곳',
  'web.schedule.next.body':
    '기능 매트릭스는 모든 플랫폼과 모든 기능을 하나의 표에 담습니다. 사용 사례 페이지는 이 제품이 구축되는 기반이 되는 워크플로를 설명합니다.',
} as const;
