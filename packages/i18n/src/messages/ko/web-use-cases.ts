/**
 * The three project-led use case pages. See `en/web-use-cases.ts`: these
 * describe workflows and what is actually built, never a live publishing
 * claim.
 */
export const webUseCaseMessages = {
  'web.meta.useCases.title': '사용 사례',
  'web.meta.useCases.description':
    '이 제품이 만들어지는 기반이 되는 세 가지 워크플로: 여러 클라이언트를 한곳에서 관리하기, 게시되기 전에 작업 승인받기, 다시 작성하지 않고 하나의 아이디어를 여러 플랫폼으로 확장하기.',
  'web.meta.useCase.clients.title': '여러 클라이언트 관리',
  'web.meta.useCase.clients.description':
    '다른 사람을 대신해 게시하는 팀을 위한 별도의 프로젝트, 별도의 연결된 계정, 별도의 승인, 별도의 리포팅.',
  'web.meta.useCase.approvals.title': '승인 워크플로',
  'web.meta.useCase.approvals.description':
    '초안이 승인된 게시물이 되는 과정: 누가 검토하는지, 무엇이 승인을 무효화하는지, 왜 모든 화면에서 동일한 규칙이 적용되는지.',
  'web.meta.useCase.crossPlatform.title': '크로스 플랫폼 게시',
  'web.meta.useCase.crossPlatform.description':
    '마스터 초안 하나, 플랫폼별로 조정된 버전 하나, 무엇이든 예약되기 전에 각 플랫폼의 기록된 한도에 따라 검증됩니다.',

  'web.useCases.index.title': '사용 사례',
  'web.useCases.index.lede':
    '이 제품이 만들어지는 기반이 되는 세 가지 워크플로입니다. 각 페이지는 오늘날 팀에게 이 워크플로가 어떤 비용을 초래하는지, 제품이 이를 처리하도록 어떻게 설계되었는지, 실제로 무엇이 구축되었는지를 설명합니다.',
  'web.useCases.index.listLabel': '사용 사례',

  'web.useCases.notice.title': '이것은 설계를 설명하는 것이며, 실행 중인 서비스가 아닙니다',
  'web.useCases.notice.body':
    '제공업체 검증을 완료한 커넥터가 없으므로, 이 페이지의 어떤 것도 아직 어디에도 게시되지 않습니다. 워크플로의 일부가 구축된 경우 그렇게 표시됩니다. 구축되지 않은 경우도 마찬가지로 표시됩니다.',

  'web.useCases.section.problem': '문제',
  'web.useCases.section.approach': '제품 설계 방식',
  'web.useCases.section.today': '실제로 구축된 것',
  'web.useCases.section.related': '관련 항목',

  'web.useCases.clients.title': '여러 클라이언트 관리',
  'web.useCases.clients.lede':
    '한 클라이언트를 위한 작업이 잘못된 클릭 한 번으로 다른 클라이언트의 잠재고객에게 노출되어서는 절대 안 됩니다.',
  'web.useCases.clients.problem':
    '대부분의 팀은 주의를 기울여 클라이언트를 분리합니다. 하나의 공유 계정이 모든 연결된 페이지를 담고, 하나의 캘린더가 모든 일정을 담으며, 클라이언트 초안과 잘못된 잠재고객 사이를 막아 주는 유일한 것은 오후 6시에 화면을 보고 있는 사람뿐입니다. 누군가 팀을 떠나면, 그 분리도 그 사람의 습관과 함께 사라집니다.',
  'web.useCases.clients.approach1':
    '프로젝트가 분리의 단위입니다. 연결된 계정, 초안, 대기열, 미디어, 영수증은 프로젝트에 속하며, 구성원은 자신이 추가된 프로젝트만 볼 수 있습니다.',
  'web.useCases.clients.approach2':
    '분리는 세 번 적용됩니다. 인증 단계, 작업을 승인하는 애플리케이션 서비스, 그리고 행 수준 보안을 통한 데이터베이스 자체입니다. 로그인했다는 사실이 권한으로 취급되는 일은 없습니다.',
  'web.useCases.clients.approach3':
    '리포팅도 같은 경계를 따르므로, 클라이언트별 보고서는 누군가 수작업으로 만드는 스프레드시트가 아니라 기본 형태입니다.',
  'web.useCases.clients.today':
    '프로젝트, 프로젝트 범위의 멤버십, 그 뒤에 있는 행 수준 보안 정책은 구축되고 테스트되었습니다. 프로젝트 간 읽기를 시도해 실패하는지 확인하는 테스트도 포함됩니다. 요금제는 팀에 필요한 프로젝트 수에 따라 규모가 정해집니다. 어떤 프로젝트에서도 아직 플랫폼에 게시되는 것은 없습니다.',

  'web.useCases.approvals.title': '승인 워크플로',
  'web.useCases.approvals.lede': '승인은 승인된 것이 실제로 게시되는 것과 같을 때만 의미가 있습니다.',
  'web.useCases.approvals.problem':
    '승인은 보통 게시 도구 밖에서 이루어집니다. 스크린샷이 클라이언트에게 전달되고, 클라이언트가 좋다고 답하면, 그다음 문구가 바뀝니다. 이제 승인은 아무도 가지고 있지 않은 초안을 가리키게 되고, 도구는 이를 알지 못한 채 마지막으로 전달받은 것을 그대로 게시합니다.',
  'web.useCases.approvals.approach1':
    '승인은 검토된 정확한 콘텐츠에 연결됩니다. 승인된 초안을 편집하면 승인이 무효화되고 어떤 필드가 바뀌었는지 알려 줄 뿐, 이전 결정을 조용히 그대로 이어가지 않습니다.',
  'web.useCases.approvals.approach2':
    '검토자는 승인, 수정 요청, 거부 중 하나를 선택할 수 있으며, 승인이 아닌 모든 경우에는 코멘트가 필요하므로 작성자가 무엇을 고쳐야 할지 추측할 필요가 없습니다.',
  'web.useCases.approvals.approach3':
    '이 규칙은 공유 애플리케이션 계층에 있으므로 웹 앱, REST API, MCP 서버, CLI, 웹훅 모두가 이를 따릅니다. 어떤 화면에도 검토를 건너뛰는 지름길은 없습니다.',
  'web.useCases.approvals.today':
    '승인 상태, 검토 화면, 재승인 규칙, 그 뒤의 감사 이벤트는 구축되었습니다. 구축되지 않은 것은 마지막 단계입니다. 어떤 커넥터도 완료 기준을 통과하지 못했기 때문에 승인된 게시물이 아직 갈 곳이 없습니다.',

  'web.useCases.crossPlatform.title': '크로스 플랫폼 게시',
  'web.useCases.crossPlatform.lede':
    '하나의 아이디어, 하나의 편집, 그리고 해당 플랫폼이 실제로 받아들이는 것을 존중하는 플랫폼별 버전.',
  'web.useCases.crossPlatform.problem':
    '같은 텍스트를 모든 곳에 게시하면 한 플랫폼에서는 잘리고, 다른 플랫폼에서는 필수 제목이 빠지고, 세 번째 플랫폼에서는 링크가 조용히 제거되는 버전이 만들어집니다. 그 대안인 다섯 번의 수작업 재작성이야말로 실제로 작업 시간이 소요되는 지점입니다.',
  'web.useCases.crossPlatform.approach1':
    '마스터 초안이 아이디어를 담습니다. 선택된 각 계정은 자체 버전을 받으며, 마스터에 대한 편집은 적용 가능한 곳에만 적용되고 어떤 대상이 이를 받을 수 없었는지와 그 이유를 명확히 알려 줍니다.',
  'web.useCases.crossPlatform.approach2':
    '검증은 각 플랫폼의 기록된 한도에 따라 해당 플랫폼이 세는 방식 그대로 실행됩니다. 따라서 문자 상한은 플랫폼이 자소를 사용하는 곳에서는 자소 단위로, 가중치 단위를 사용하는 곳에서는 가중치 단위로 확인됩니다.',
  'web.useCases.crossPlatform.approach3':
    '이 사이트 어디에 표시되든 모든 플랫폼 한도는 커넥터 레지스트리에서 생성되며, 출처가 된 문서와 사람이 이를 읽은 날짜를 함께 담습니다.',
  'web.useCases.crossPlatform.today':
    '컴포저, 대상별 버전, 검증 규칙, 생성된 한도 데이터셋은 구축되었습니다. 게시 단계는 구축되지 않았습니다. 제공업체 검증을 통과한 커넥터가 없으므로 검증된 초안은 내부적으로 예약할 수는 있지만 플랫폼에 도달할 수는 없습니다.',
} as const;
