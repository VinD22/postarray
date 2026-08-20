/**
 * The blog's page chrome. See `en/web-blog.ts` for what belongs here versus
 * article prose, which is not translated in this file.
 */
export const webBlogMessages = {
  'web.blog.meta.title': '게시 운영에 관한 글',
  'web.blog.meta.description':
    '게시 주기, 예약 모델, 시간대, 플랫폼별 조정, 클라이언트 작업을 별도 프로젝트로 운영하는 방법에 관한 글입니다.',

  'web.blog.title': '글',
  'web.blog.lede':
    '게시 작업의 원리에 관한 노트입니다. 일정 규모를 어떻게 정하는지, 한 주가 밀렸을 때 대기열이 어떻게 동작하는지, 플랫폼마다 실제로 무엇이 다른지, 클라이언트 작업이 어떻게 분리된 상태를 유지하는지를 다룹니다.',

  'web.blog.notice.prelaunch.title': '이 글들은 문제에 관한 것이며, 아직 사용할 수 있는 제품에 관한 것이 아닙니다',
  'web.blog.notice.prelaunch.body':
    '여기에 있는 커넥터 중 제공업체 검증을 완료한 것은 없으므로, 오늘 이 제품을 통해 어떤 플랫폼에도 아무것도 게시되지 않습니다. 아래의 모든 플랫폼 규칙에는 출처가 된 공식 문서와 사람이 그것을 읽은 날짜가 함께 표시됩니다.',

  'web.blog.cluster.cadence': '게시 주기',
  'web.blog.cluster.scheduling': '예약',
  'web.blog.cluster.adaptation': '플랫폼별 조정',
  'web.blog.cluster.operations': '에이전시 운영',
  'web.blog.cluster.developers': 'API를 통한 통합',

  'web.blog.label.published': '{date} 게시됨',
  'web.blog.label.updated': '{date} 업데이트됨',
  'web.blog.label.writtenBy': '작성자: {name}',
  'web.blog.label.reviewedBy': '검토자: {name}',
  'web.blog.label.sources': '출처',
  'web.blog.label.sourceRead': '{date} 확인함',
  'web.blog.label.cluster': '주제',
  'web.blog.label.articleList': '글 목록',
  'web.blog.label.backToIndex': '전체 글 보기',
  'web.blog.label.count': '{count, plural, other {글 #개}}',

  'web.blog.byline.editorial.name': '게시 연구 데스크',
  'web.blog.byline.editorial.role': '이 글들을 작성하고 관리합니다',
  'web.blog.byline.platform.name': '플랫폼 문서 데스크',
  'web.blog.byline.platform.role': '모든 플랫폼 문장을 공식 출처와 대조해 확인합니다',

  'web.blog.feed.title': '게시 운영에 관한 글',
  'web.blog.feed.description':
    '게시 주기, 예약 모델, 시간대, 플랫폼별 조정, 에이전시 운영에 관한 새 글입니다.',
  'web.blog.feed.label': 'RSS 피드',

  'web.blog.empty.title': '아직 이곳에 게시된 것이 없습니다',
  'web.blog.empty.body': '첫 글을 작성하고 있습니다. 게시되면 피드에 표시됩니다.',

  'web.blog.label.language': '다음 언어로 읽기',
  'web.blog.label.notTranslated': '이 글은 아직 회원님의 언어로 작성되지 않았습니다. 영어 버전을 표시합니다.',
  'web.blog.label.languageCount': '{count, plural, other {#개 언어}}',
} as const;
