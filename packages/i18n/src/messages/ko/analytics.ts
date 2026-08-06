/** Korean beta catalog. */
export const analyticsMessages = {
  'analytics.title': '해석학',
  'analytics.subtitle':
    '무슨 일이 일어났는지, 얼마나 신선한지, 다음에 테스트할 가치가 있는 것은 무엇인지 알아보세요.',
  'analytics.range.7d': '지난 7일',
  'analytics.range.30d': '지난 30일',
  'analytics.range.90d': '지난 90일',
  'analytics.range.custom': '맞춤 범위',
  'analytics.range.limitedByProvider':
    '{provider}최대로 반환{days, plural, other {# 날}}이 계정의 기록입니다.',
  'analytics.account.select': '계정을 선택하세요',
  'analytics.compareTo': '비교{baseline}',
  'analytics.baseline.trailingMedian': '이전의 중앙값{count, plural, other {# 비교 가능한 게시물}}',
  'analytics.metric.followers': '추종자',
  'analytics.metric.subscribers': '구독자',
  'analytics.metric.profileViews': '프로필 보기',
  'analytics.metric.impressions': '노출수',
  'analytics.metric.reach': '도달하다',
  'analytics.metric.views': '조회수',
  'analytics.metric.videoViews': '비디오 조회수',
  'analytics.metric.watchTime': '시청 시간',
  'analytics.metric.averageViewDuration': '평균 시청 지속 시간',
  'analytics.metric.averageViewPercentage': '평균 시청률',
  'analytics.metric.likes': '좋아요 및 반응',
  'analytics.metric.comments': '댓글 및 답글',
  'analytics.metric.shares': '공유, 재게시 및 인용',
  'analytics.metric.saves': '저장 및 북마크',
  'analytics.metric.linkClicks': '링크 클릭',
  'analytics.metric.clickThroughRate': '클릭률',
  'analytics.metric.engagementRate': '참여율',
  'analytics.metric.publishedCount': '게시된 게시물',
  'analytics.metric.followerChange': '팔로어 변경',
  'analytics.definition.title': '어떻게{metric}정의된다',
  'analytics.definition.provider': '보고자:{provider}~처럼{providerField}.',
  'analytics.definition.denominator.label': '분모:{denominator}.',
  'analytics.definition.unit': '단위:{unit}.',
  'analytics.definition.normalized':
    '공급자 값에서 정규화되었습니다. 원시 값이 유지되고 사용 가능합니다.',
  'analytics.definition.notComparable':
    '{provider}그리고{otherProvider}이것을 다르게 정의하십시오. 주의 깊게 비교하십시오.',
  'analytics.value.unavailable': '없는',
  'analytics.value.unavailableReason.permission':
    '이 계정은 이 측정항목에 필요한 권한을 부여하지 않았습니다.',
  'analytics.value.unavailableReason.unsupported': '{provider}이 측정항목을 보고하지 않습니다.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider}나중에 이 측정항목을 게시합니다. 이후 다시 확인{time}.',
  'analytics.value.unavailableReason.syncFailed':
    '마지막 동기화에 실패했습니다. 재시도 중이므로 추측된 숫자가 표시되지 않습니다.',
  'analytics.freshness.synced': '동기화됨{relativeTime}',
  'analytics.freshness.stale':
    '마지막으로 성공한 동기화{relativeTime}. 이는 오래된 것일 수 있습니다.',
  'analytics.freshness.coverage': '{covered}~의{total}이 범위의 게시물에는 최신 데이터가 있습니다.',
  'analytics.feedback.title': '이것이 시사하는 바',
  'analytics.feedback.aboveBaseline': '이 게시물을 받았습니다{percent}더{metric}~보다{baseline}.',
  'analytics.feedback.belowBaseline':
    '이 게시물을 받았습니다{percent}보다 적은{metric}~보다{baseline}.',
  'analytics.feedback.notComparableFormats':
    '이미지 게시물과 비디오 게시물은 여기서 직접적으로 비교할 수 없습니다.',
  'analytics.feedback.smallSample':
    '표본이 작습니다. 결론을 내리기 전에 동일한 후크를 다시 테스트하십시오.',
  'analytics.feedback.association':
    '첫 번째 댓글 지연이 다음에서 변경된 후 댓글이 증가했습니다.{before}에게{after}. 이는 연관성이 아니라 원인 증명이 아닙니다.',
  'analytics.feedback.nextTest': '다음에 테스트할 내용',
  'analytics.feedback.doNotInfer': '이것이 보여주지 않는 것',
  'analytics.feedback.noScore':
    '여기에는 단일 크로스 플랫폼 점수가 없습니다. 신뢰할 수 있는 정의가 포함된 측정항목을 선택하세요.',
  'analytics.experiment.title': '실험',
  'analytics.experiment.hypothesis': '가설',
  'analytics.experiment.variants': '변형',
  'analytics.experiment.successMetric': '성공 지표',
  'analytics.experiment.window': '측정 창',
  'analytics.experiment.status.running': '실행 기간:{date}',
  'analytics.experiment.status.complete': '완벽한',
  'analytics.experiment.tagBeforePublishing':
    '게시하기 전에 실험에 태그를 지정하면 사후 비교가 이루어지지 않습니다.',
  'analytics.experiment.caveats': '주의사항',
  'analytics.export.title': '내보내다',
  'analytics.export.csv': 'CSV 다운로드',
  'analytics.export.json': 'JSON 다운로드',
  'analytics.export.providerRestriction':
    '{provider}데이터를 결합하거나 저장하는 방법을 제한합니다. 일부 필드는 포함되지 않습니다.',
  'analytics.links.title': '추적된 링크',
  'analytics.links.subtitle':
    '자사 리디렉션 측정. 이는 플랫폼이 보고하는 링크 클릭과는 별개의 시리즈입니다.',
  'analytics.links.destination': '목적지',
  'analytics.links.shortUrl': '단축 URL',
  'analytics.links.totalRequests': '총 요청수',
  'analytics.links.humanClicks': '중복 제거된 클릭수',
  'analytics.links.suspectedBots': '의심되는 봇',
  'analytics.links.referrerClass': '추천인',
  'analytics.links.deviceClass': '장치',
  'analytics.links.country': '국가',
  'analytics.links.lastEvent': '마지막 클릭{relativeTime}',
  'analytics.links.privacyNote':
    '대략적인 위치와 장치 클래스만 유지합니다. 원시 IP 주소는 남용 및 중복 감지를 위해 잠시 보관된 후 삭제됩니다.',
  'analytics.links.separateSources':
    '플랫폼 보고 수치에 이러한 클릭수를 추가하지 마세요. 그들은 다른 것을 계산합니다.',
} as const;
