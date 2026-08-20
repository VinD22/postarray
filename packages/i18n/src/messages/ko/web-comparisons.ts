/**
 * The comparison pages' chrome. See `en/web-comparisons.ts` for what belongs
 * here versus the claims themselves, which are not translated in this file.
 */
export const webComparisonMessages = {
  'web.comparison.eyebrow': '비교',

  'web.comparison.state.yes': '예',
  'web.comparison.state.no': '아니요',
  'web.comparison.state.partial': '부분적으로',
  'web.comparison.state.notVerified': '확인되지 않음',

  'web.comparison.label.claim': '주장',
  'web.comparison.label.sourceRead': '{date} 확인함',
  'web.comparison.label.checked': '모든 행을 {date}에 확인함',
  'web.comparison.label.nextReview': '다음 확인 예정일 {date}',
  'web.comparison.label.backToIndex': '모든 비교',

  'web.comparison.table.title': '각 옵션이 하는 일',
  'web.comparison.table.caption': '각 답변 뒤에 출처가 있는, 행당 하나의 주장',

  'web.comparison.bestFor.title': '어느 쪽이 맞는지',
  'web.comparison.bestFor.ours': '다음의 경우 이 제품을 선택하세요',
  'web.comparison.bestFor.alternative': '다음의 경우 {name}을(를) 선택하세요',

  'web.comparison.notDo.title': '이 제품이 하지 않는 일',
  'web.comparison.notDo.body':
    '이 문장들은 손으로 입력한 것이 아니라 이를 결정하는 코드에서 읽어옵니다. 따라서 이 섹션은 오늘 제품이 실제로 어떤 모습인지에서 벗어날 수 없습니다.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {제공업체 검증을 완료한 커넥터가 없으므로, 오늘 이 제품을 통해 어떤 플랫폼에도 아무것도 게시되지 않습니다.} other {커넥터 #개가 제공업체 검증을 완료했습니다. 코호트의 다른 모든 플랫폼은 아직 의도 단계입니다.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {사람의 검토를 완료한 언어가 없으므로, 인터페이스의 모든 언어가 베타로 표시됩니다.} other {언어 #개가 사람의 검토를 완료했습니다. 다른 모든 언어는 베타로 표시됩니다.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {모든 요금제 등급이 결정되었으며 실제 가격이 책정되어 있습니다.} other {요금제 등급 #개는 아직 결정되지 않은 자리 표시자이며 구매할 수 없습니다.}}',

  'web.comparison.notVerified.title': '"확인되지 않음"의 의미',
  'web.comparison.notVerified.body':
    '확인 당일 다른 옵션의 공식 공개 문서에서 해당 사실을 확인할 수 없을 때 셀에 "확인되지 않음"이라고 표시됩니다. 기억에 의존해 채워 넣는 일은 절대 없으며, 다른 사람이 작성한 요약에서 그대로 가져오는 일도 없습니다.',

  'web.comparison.method.title': '이 페이지는 어떻게 만들어지나요',
  'web.comparison.method.body':
    '모든 행은 출처 문서와 사람이 이를 확인한 날짜가 함께 표시되는 하나의 주장입니다. 경쟁사 스크린샷도, 복사한 기능 문구도, 지어낸 약점도 없습니다.',
  'web.comparison.method.cadence':
    '모든 비교는 최소 90일마다 다시 확인되며, 플랫폼이나 옵션이 어떤 행에 명시된 내용을 바꾸면 즉시 다시 확인됩니다.',

  'web.comparison.questions.title': '질문',
  'web.comparison.sources.title': '이 페이지에서 인용한 출처',

  'web.comparison.index.title': '게시된 비교',
  'web.comparison.index.body':
    '각 페이지는 이 제품을 공식 문서에서 사실을 확인할 수 있는 대안 카테고리와 비교합니다. 특정 제품은 현재 사실을 자체 공개 페이지에서 확인할 수 있을 때에만 페이지가 만들어지며, 그 전에는 만들어지지 않습니다.',
  'web.comparison.index.checked': '{date} 확인함',
} as const;
