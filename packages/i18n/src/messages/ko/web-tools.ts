/**
 * The free tools on the public site. See `en/web-tools.ts`: every number
 * comes from the generated connector dataset, every calculation runs in the
 * reader's browser, and a missing limit is stated as unavailable, never a
 * guess.
 */
export const webToolsMessages = {
  'web.meta.tools.title': '무료 게시 도구',
  'web.meta.tools.description':
    '여러 플랫폼에 게시하는 사람들을 위한 소규모 개인 도구입니다. 플랫폼별 한도 확인, UTM 빌더, YouTube 제목 길이 확인, 시간대 플래너.',
  'web.meta.tools.preflight.title': '게시 사전 점검기',
  'web.meta.tools.preflight.description':
    '초안 하나를 열 개 플랫폼의 게시된 텍스트 및 미디어 한도와 대조해 확인하며, 각 한도의 출처와 읽은 날짜를 함께 제공합니다.',
  'web.meta.tools.utm.title': 'UTM 링크 빌더',
  'web.meta.tools.utm.description':
    '태그가 붙은 캠페인 URL을 작성하고 각 UTM 매개변수가 무엇을 의미하는지 확인하세요. 전적으로 브라우저에서 실행됩니다.',
  'web.meta.tools.youtubeTitle.title': 'YouTube 제목 길이 확인기',
  'web.meta.tools.youtubeTitle.description':
    'YouTube 제목을 문서화된 상한과 대조해, 사람이 문자를 세는 방식으로 측정합니다.',
  'web.meta.tools.timeZone.title': '시간대 및 서머타임 플래너',
  'web.meta.tools.timeZone.description':
    '여러 대상 시간대에서 하나의 게시 시간을 확인하고, 서머타임 변경으로 현지 시간이 바뀌는 주를 찾아보세요.',
  'web.meta.tools.engagementRate.title': '참여율 계산기',
  'web.meta.tools.engagementRate.description':
    '상호작용을 도달, 팔로워 또는 노출수로 나눕니다. 세 가지 단순 계산이며, 지어낸 기준값은 없습니다.',

  'web.tools.index.title': '무료 도구',
  'web.tools.index.summary': '저희 커넥터가 읽는 것과 동일한 플랫폼 한도 데이터를 기반으로 만든 소규모 계산기입니다.',
  'web.tools.index.lede':
    '저희 커넥터가 사용하는 것과 동일한 플랫폼 한도 데이터를 기반으로 만든 네 가지 소규모 도구입니다. 계정 없음, 업로드 없음, 입력 내용 추적 없음.',
  'web.tools.index.dataTitle': '수치의 출처',
  'web.tools.index.dataBody':
    '각 한도는 이 저장소의 커넥터 기능 코드에서 생성되며, 각 플랫폼 행에는 출처가 된 공식 문서 페이지와 사람이 그 페이지를 읽은 날짜가 함께 표시됩니다.',
  'web.tools.index.honesty':
    '이 도구들은 아무것도 게시하지 않습니다. 어떤 커넥터도 아직 제공업체 검증을 완료하지 않았으므로, 여기서는 어떤 것도 계정을 연결하지 않습니다.',
  'web.tools.shared.privacyTitle': '이것은 사용자의 브라우저에서 실행됩니다',
  'web.tools.shared.privacyBody':
    '입력하는 모든 내용은 이 페이지에 남아 있습니다. 서버로의 요청도, 저장도, 텍스트를 담은 분석 이벤트도 없습니다.',
  'web.tools.shared.sourceLink': '플랫폼 문서',
  'web.tools.shared.sourceRead': '{date} 확인함',
  'web.tools.shared.unavailable': '사용할 수 없음',
  'web.tools.shared.unavailableWhy':
    '이 플랫폼용 커넥터를 아직 제공하지 않으므로 보여줄 검증된 한도가 없습니다. 추측하기보다는 아무 말도 하지 않는 편을 택합니다.',
  'web.tools.shared.copy': '복사',
  'web.tools.shared.copied': '복사됨',
  'web.tools.shared.copyFailed': '브라우저가 복사를 차단했습니다. 텍스트를 선택해 복사하세요.',
  'web.tools.shared.faqTitle': '질문',
  'web.tools.shared.baselineTitle': '이 수치가 설명하는 계정',
  'web.tools.shared.baselineBody':
    '보수적인 경우입니다. 상향된 자격이 없는, 방금 연결된 계정 기준입니다. 일부 플랫폼은 채널이나 비즈니스가 인증되면 상한을 올리며, 그런 경우 페이지에 그렇게 표시됩니다.',
  'web.tools.shared.otherTools': '다른 도구',

  'web.tools.preflight.name': '게시 사전 점검기',
  'web.tools.preflight.summary': '초안 하나를 열 개 플랫폼의 텍스트 및 미디어 한도와 동시에 대조해 확인합니다.',
  'web.tools.utm.name': 'UTM 링크 빌더',
  'web.tools.utm.summary': '기존 쿼리 문자열을 훼손하지 않고 태그가 붙은 캠페인 URL을 만드세요.',
  'web.tools.youtubeTitle.name': 'YouTube 제목 길이 확인기',
  'web.tools.youtubeTitle.summary': '사람이 문자를 세는 방식으로 제목을 측정합니다.',
  'web.tools.timeZone.name': '시간대 및 서머타임 플래너',
  'web.tools.timeZone.summary': '서머타임 변경이 표시된, 여러 대상 시간대에서의 하나의 게시 시간입니다.',
  'web.tools.engagementRate.name': '참여율 계산기',
  'web.tools.engagementRate.summary': '도달, 팔로워 또는 노출수로 나눈 상호작용입니다. 조회도, 기준값 비교도 없습니다.',

  'web.tools.preflight.title': '게시 사전 점검기',
  'web.tools.preflight.lede':
    '초안을 붙여넣고 게시할 플랫폼을 선택하면, API 오류로 알게 되기 전에 어떤 플랫폼이 거부할지 확인할 수 있습니다.',
  'web.tools.preflight.explainer.title': '문자 카운터만으로 충분하지 않은 이유',
  'web.tools.preflight.explainer.body':
    '플랫폼마다 문자의 정의가 다릅니다. 일부는 코드 단위를 세므로 이모지 하나가 2로 계산됩니다. 일부는 자소를 세므로 국기나 가족 이모지가 1로 계산됩니다. 일부는 모든 링크를 고정 폭으로 다시 작성하므로 200자 URL이 20자 URL과 같은 비용이 듭니다. 이 도구는 각 플랫폼 규칙을 개별적으로 적용합니다.',
  'web.tools.preflight.explainer.counting':
    '초안은 브라우저의 Intl 세그먼터로 측정됩니다. 이는 텍스트를 독자가 문자라고 부를 단위로 나눈 뒤 플랫폼 규칙에 맞게 조정합니다.',
  'web.tools.preflight.field.draft.label': '내 초안',
  'web.tools.preflight.field.draft.help':
    '게시물 본문을 붙여넣으세요. 링크는 자동으로 감지되어 플랫폼별로 비용이 적용됩니다.',
  'web.tools.preflight.field.platforms.label': '확인할 플랫폼',
  'web.tools.preflight.field.platforms.help': '게시하는 만큼 선택하세요.',
  'web.tools.preflight.field.mediaKind.label': '첨부된 미디어',
  'web.tools.preflight.field.mediaKind.none': '미디어 없음',
  'web.tools.preflight.field.mediaKind.image': '이미지',
  'web.tools.preflight.field.mediaKind.video': '동영상 1개',
  'web.tools.preflight.field.mediaCount.label': '이미지 개수',
  'web.tools.preflight.field.byteSize.label': '메가바이트 단위 파일 크기',
  'web.tools.preflight.field.byteSize.help': '가장 큰 단일 파일입니다. 건너뛰려면 비워 두세요.',
  'web.tools.preflight.field.duration.label': '초 단위 동영상 길이',
  'web.tools.preflight.field.duration.help': '길이 확인을 건너뛰려면 비워 두세요.',
  'web.tools.preflight.field.width.label': '픽셀 단위 미디어 너비',
  'web.tools.preflight.field.height.label': '픽셀 단위 미디어 높이',
  'web.tools.preflight.field.dimensions.help': '선택 사항입니다. 게시할 종횡비를 표시하는 데만 사용됩니다.',
  'web.tools.preflight.results.title': '플랫폼별 결과',
  'web.tools.preflight.results.empty': '결과를 보려면 플랫폼을 하나 이상 선택하세요.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {막는 항목 없음} other {#개 실패 예상}}, {warning, plural, =0 {경고 없음} other {#개 확인 필요}}.',
  'web.tools.preflight.status.pass': '적합함',
  'web.tools.preflight.status.warning': '확인할 가치 있음',
  'web.tools.preflight.status.fail': '실패 예상',
  'web.tools.preflight.status.unavailable': '사용할 수 없음',
  'web.tools.preflight.count.label':
    '{limit}자 중 {count}자 ({unit, select, grapheme {자소} utf16 {코드 단위} weighted {가중 문자} other {문자}})',
  'web.tools.preflight.finding.textOver': '한도를 {over, plural, other {#자}} 초과합니다.',
  'web.tools.preflight.finding.textNear': '한도까지 {remaining}자 남았습니다.',
  'web.tools.preflight.finding.textFits': '본문이 한도 내에 있습니다.',
  'web.tools.preflight.finding.linkFixed':
    '모든 링크는 고정 폭으로 다시 작성되므로 실제 길이와 관계없이 각각 {cost}자로 계산됩니다.',
  'web.tools.preflight.finding.linkActual': '링크는 차지하는 문자 수만큼 계산됩니다.',
  'web.tools.preflight.finding.imagesOver':
    '이 플랫폼은 게시물 하나에 {limit, plural, =0 {이미지를 허용하지 않습니다} other {이미지 #개를 허용합니다}}.',
  'web.tools.preflight.finding.videosOver':
    '이 플랫폼은 게시물 하나에 {limit, plural, =0 {동영상을 허용하지 않습니다} other {동영상 #개를 허용합니다}}.',
  'web.tools.preflight.finding.bytesOver': '파일이 {limit} 상한보다 큽니다.',
  'web.tools.preflight.finding.bytesUnknown':
    '이 미디어 종류에 대해 공개된 바이트 상한이 없어 크기를 확인하지 않았습니다.',
  'web.tools.preflight.finding.durationOver': '{limit}초 상한보다 깁니다.',
  'web.tools.preflight.finding.durationUnder': '{limit}초 최소값보다 짧습니다.',
  'web.tools.preflight.finding.durationUnknown': '공개된 길이 상한이 없어 길이를 확인하지 않았습니다.',
  'web.tools.preflight.finding.altText': '대체 텍스트는 최대 {limit}자까지 허용되므로 사용할 가치가 있습니다.',
  'web.tools.preflight.finding.ratio': '약 {ratio}:1 비율로 게시하게 됩니다.',
  'web.tools.preflight.faq.counting.q': '문자를 어떻게 세나요?',
  'web.tools.preflight.faq.counting.a':
    '브라우저의 Intl 세그먼터를 사용해 자소 단위로 셉니다. 이는 독자가 문자라고 생각하는 단위입니다. 플랫폼이 코드 단위로 세거나 링크당 고정 폭을 부과하는 등 다른 규칙을 문서화한 경우, 그 규칙이 그 위에 적용됩니다.',
  'web.tools.preflight.faq.accuracy.q': '이 한도는 얼마나 최신인가요?',
  'web.tools.preflight.faq.accuracy.a':
    '각 한도는 페이지에 직접 입력하는 대신 저희 저장소의 커넥터 코드에서 생성되며, 각 플랫폼 행에는 출처가 된 공식 문서와 사람이 이를 읽은 날짜가 표시됩니다. 플랫폼이 수치를 변경하면 수정은 코드 변경 한 번이며, 여기의 모든 도구가 이를 따라갑니다.',
  'web.tools.preflight.faq.privacy.q': '제 초안이 업로드되나요?',
  'web.tools.preflight.faq.privacy.a':
    '아니요. 확인은 브라우저에서 실행됩니다. 텍스트를 담은 요청이 없고, 아무것도 저장되지 않으며, 탭을 닫는 것만으로 폐기됩니다.',
  'web.tools.preflight.faq.publish.q': '이 도구가 저 대신 게시할 수 있나요?',
  'web.tools.preflight.faq.publish.a':
    '오늘은 아닙니다. 어떤 커넥터도 제공업체 검증을 완료하지 않았으므로, 이 사이트의 어떤 것도 아직 플랫폼에 게시되지 않습니다. 이 페이지는 컴포저가 아니라 한도 확인 도구입니다.',

  'web.tools.utm.title': 'UTM 링크 빌더',
  'web.tools.utm.lede':
    '기존 쿼리 문자열을 잃지 않고, 어떤 매개변수가 무엇을 의미하는지 추측할 필요 없이 URL에 캠페인 매개변수를 추가하세요.',
  'web.tools.utm.explainer.title': '각 매개변수의 용도',
  'web.tools.utm.explainer.body':
    'UTM 매개변수는 게시하는 플랫폼이 아니라 분석 도구가 읽습니다. URL 안에 담겨 이동하므로 링크를 보는 사람은 누구나 이를 볼 수 있습니다. 짧고, 소문자로, 일관되게 유지하세요. 같은 캠페인의 두 가지 표기는 보고서에서 두 개의 행이 되기 때문입니다.',
  'web.tools.utm.field.url.label': '대상 URL',
  'web.tools.utm.field.url.help': 'https를 포함해, 사람들이 도달하기를 원하는 페이지입니다.',
  'web.tools.utm.field.url.invalid': '이는 http 또는 https URL로 파싱되지 않습니다.',
  'web.tools.utm.field.source.label': '캠페인 소스',
  'web.tools.utm.field.source.help': '클릭이 시작된 곳입니다. 예: 플랫폼 이름.',
  'web.tools.utm.field.medium.label': '캠페인 매체',
  'web.tools.utm.field.medium.help': '링크의 종류입니다. 예: 소셜, 이메일, 리퍼럴.',
  'web.tools.utm.field.campaign.label': '캠페인 이름',
  'web.tools.utm.field.campaign.help': '이 링크가 속한 출시, 프로모션 또는 테마입니다.',
  'web.tools.utm.field.term.label': '캠페인 용어',
  'web.tools.utm.field.term.help': '선택 사항입니다. 전통적으로 유료 키워드입니다.',
  'web.tools.utm.field.content.label': '캠페인 콘텐츠',
  'web.tools.utm.field.content.help':
    '선택 사항입니다. 같은 페이지로 가는 두 링크를 구분합니다. 예: 게시물의 두 가지 버전.',
  'web.tools.utm.result.title': '태그가 붙은 URL',
  'web.tools.utm.result.empty': '결과를 보려면 대상 URL을 입력하세요.',
  'web.tools.utm.result.label': '작성된 URL',
  'web.tools.utm.result.preserved': 'URL에 이미 있던 쿼리 문자열은 입력한 그대로 유지됩니다.',
  'web.tools.utm.result.replaced': 'URL에 이미 이 매개변수 중 하나가 있었습니다. 여기서 입력한 값이 이를 대체합니다.',
  'web.tools.utm.faq.encoding.q': '공백과 억양 부호는 어떻게 되나요?',
  'web.tools.utm.faq.encoding.a':
    '퍼센트 인코딩되며, 이는 링크가 게시물에 붙여넣어져도 살아남게 하는 방식입니다. 공백은 더하기 기호가 되고 억양 부호가 있는 문자는 인코딩된 형태가 되며, 분석 도구가 둘 다 다시 디코딩합니다.',
  'web.tools.utm.faq.existing.q': '이미 매개변수가 있는 URL을 손상시키나요?',
  'web.tools.utm.faq.existing.a':
    '아니요. 기존 매개변수는 원래 순서대로 유지되며, 입력한 UTM 매개변수만 추가되거나 대체됩니다. URL 끝에 있는 프래그먼트는 끝에 그대로 남습니다.',
  'web.tools.utm.faq.privacy.q': '제 URL이 어딘가로 전송되나요?',
  'web.tools.utm.faq.privacy.a': '아니요. URL은 브라우저에서 작성되며 이 페이지를 절대 벗어나지 않습니다.',

  'web.tools.youtubeTitle.title': 'YouTube 제목 길이 확인기',
  'web.tools.youtubeTitle.lede':
    '한 글자만 초과해도 긴 제목은 업로드 시 거부됩니다. 그냥 긴 제목은 원치 않는 지점에서 잘립니다.',
  'web.tools.youtubeTitle.explainer.title': '두 가지 다른 한도',
  'web.tools.youtubeTitle.explainer.body':
    '엄격한 상한은 업로드 엔드포인트가 허용하는 값입니다. 제목이 어디에 표시되는지는 별개의 문제입니다. 검색 결과, 사이드바, 휴대폰은 각각 다른 지점에서 제목을 자르며, 이 잘림 지점들은 어느 것도 공개되지 않습니다. 이 도구는 문서화된 상한을 명시하고 제목의 형태를 보여주며, 잘림 수치를 지어내지 않습니다.',
  'web.tools.youtubeTitle.field.title.label': '동영상 제목',
  'web.tools.youtubeTitle.field.title.help': '자소 단위로 계산되므로 이모지는 1로 계산됩니다.',
  'web.tools.youtubeTitle.result.count': '{limit}자 중 {count}자',
  'web.tools.youtubeTitle.result.over': '{over, plural, other {#자}} 초과합니다. 업로드가 거부됩니다.',
  'web.tools.youtubeTitle.result.fits': '문서화된 상한 이내입니다.',
  'web.tools.youtubeTitle.result.front':
    '처음 {count}자가 가장 큰 비중을 차지합니다. 좁은 레이아웃에서 대략 그만큼의 공간이 있기 때문입니다. 제목은 이렇게 시작합니다: {preview}',
  'web.tools.youtubeTitle.result.unavailable': '이 빌드에서는 제목 한도를 사용할 수 없어 여기서는 아무것도 확인되지 않습니다.',
  'web.tools.youtubeTitle.faq.limit.q': '한도는 어디서 오나요?',
  'web.tools.youtubeTitle.faq.limit.a':
    '저희 업로더가 사용할 것과 동일한 커넥터 코드에서 이 페이지로 생성된, 공식 videos insert 참조 문서에서 옵니다. 누군가 그 페이지를 마지막으로 읽은 날짜가 수치 옆에 표시됩니다.',
  'web.tools.youtubeTitle.faq.truncation.q': 'YouTube는 정확히 어디서 제목을 자르나요?',
  'web.tools.youtubeTitle.faq.truncation.a':
    '이는 화면과 뷰포트에 따라 다르며, YouTube는 이를 위한 문자 수를 공개하지 않습니다. 저희는 문서화된 상한을 보여주며, 추측이 될 잘림 수치를 인쇄하지 않습니다.',
  'web.tools.youtubeTitle.faq.emoji.q': '이모지는 문자 하나로 계산되나요?',
  'web.tools.youtubeTitle.faq.emoji.a':
    '이 카운터에서는 그렇습니다. 자소를 세기 때문입니다. 내부적으로 코드 단위를 세는 플랫폼은 같은 이모지에 더 많은 비용을 부과할 수 있으며, 그래서 사전 점검기는 각 플랫폼 규칙을 개별적으로 적용합니다.',

  'web.tools.timeZone.title': '시간대 및 서머타임 플래너',
  'web.tools.timeZone.lede':
    '캘린더에서 안정적으로 보이는 주간 슬롯도 청중의 절반에게는 1년에 두 번 바뀝니다. 이 도구는 어디서, 언제인지 보여줍니다.',
  'web.tools.timeZone.explainer.title': '고정된 현지 시간이 고정된 시각이 아닌 이유',
  'web.tools.timeZone.explainer.body':
    '시간대가 함께 있어야만 시각은 의미가 있습니다. 시간대는 국가마다 다른 날짜에 오프셋을 변경하며, 1월에는 5시간 차이 나던 두 지역이 4월에는 4시간 차이가 될 수 있습니다. 순간(instant)에 시간대를 더해 저장한 일정은 이를 견뎌냅니다. 현지 시각으로 저장한 일정은 그렇지 않습니다.',
  'web.tools.timeZone.field.date.label': '날짜',
  'web.tools.timeZone.field.time.label': '시각',
  'web.tools.timeZone.field.zone.label': '내 시간대',
  'web.tools.timeZone.field.audience.label': '대상 시간대',
  'web.tools.timeZone.field.audience.help': '독자가 실제로 있는 시간대를 선택하세요.',
  'web.tools.timeZone.result.title': '선택한 모든 곳에서의 같은 순간',
  'web.tools.timeZone.result.empty': '대상 시간대를 하나 이상 선택하세요.',
  'web.tools.timeZone.result.shift':
    '이 날짜와 4주 후 같은 요일 사이에 서머타임 변경이 있어 현지 시각이 바뀝니다.',
  'web.tools.timeZone.result.stable': '앞으로 4주 동안 오프셋 변경이 없습니다.',
  'web.tools.timeZone.result.later': '4주 후, {time}.',
  'web.tools.timeZone.result.invalidDate': '비교를 보려면 날짜와 시각을 입력하세요.',
  'web.tools.timeZone.faq.dst.q': '시간은 어느 방향으로 움직이나요?',
  'web.tools.timeZone.faq.dst.a':
    '이는 시간대와 변경 방향에 따라 다르므로, 표는 규칙을 설명하는 대신 4주 후의 실제 현지 시각을 보여줍니다. 각 시간대의 오프셋은 사용자 브라우저의 시간대 데이터베이스에서 읽습니다.',
  'web.tools.timeZone.faq.storage.q': '예약된 게시물은 시간을 어떻게 저장해야 하나요?',
  'web.tools.timeZone.faq.storage.a':
    '사람이 선택한 순간과 IANA 시간대로 저장해야 하며, 단순한 현지 시각으로는 절대 저장하지 않습니다. 저희가 내부적으로 하는 방식이 바로 이것이며, 그래서 시계 변경 전에 예약된 게시물도 여전히 의도한 현지 시각에 나갑니다.',

  'web.tools.engagementRate.title': '참여율 계산기',
  'web.tools.engagementRate.lede':
    '이미 자신의 대시보드가 보여주는 숫자를 입력하세요. 이 도구는 그것을 세 가지 방식으로 나누고 거기서 멈춥니다. 기준값 없음, "좋은" 임계값 없음, 실제로 갖고 있지 않은 것은 아무것도 없습니다.',
  'web.tools.engagementRate.explainer.title': '분모가 하나가 아니라 세 개인 이유',
  'web.tools.engagementRate.explainer.body':
    '도달, 팔로워, 노출수는 서로 다른 질문에 답합니다. 도달 기준 비율은 게시물을 실제로 본 사람들이 어떻게 반응했는지 알려줍니다. 팔로워 기준 비율은 게시물이 모두에게 도달했든 아니든 청중 중 얼마나 참여했는지 알려줍니다. 노출수 기준 비율은 반복을 포함해 모든 조회를 셉니다. 한 방식으로 계산한 비율을 다른 방식으로 계산한 비율과 비교하는 것은 잘못돼 보이는 참여 수치의 흔한 원인입니다.',
  'web.tools.engagementRate.field.interactions.label': '상호작용',
  'web.tools.engagementRate.field.interactions.help':
    '측정하려는 게시물의 좋아요, 댓글, 공유, 저장을 모두 더한 값입니다.',
  'web.tools.engagementRate.field.reach.label': '도달',
  'web.tools.engagementRate.field.reach.help': '게시물을 한 번 이상 본 계정입니다.',
  'web.tools.engagementRate.field.followers.label': '팔로워',
  'web.tools.engagementRate.field.followers.help': '게시 시점의 계정 규모입니다.',
  'web.tools.engagementRate.field.impressions.label': '노출수',
  'web.tools.engagementRate.field.impressions.help': '두 번 본 사람을 포함한 총 조회수입니다.',
  'web.tools.engagementRate.result.title': '참여율, 세 가지 방식',
  'web.tools.engagementRate.result.empty': '사용할 수 없음',
  'web.tools.engagementRate.result.note':
    '비교할 만한 보편적인 좋은 비율은 없습니다. 플랫폼, 형식, 청중 규모, 업종에 따라 다르며, 기준값으로 제시되는 단일 수치는 데이터로 포장된 추측일 뿐입니다.',
  'web.tools.engagementRate.basis.reach': '도달 기준',
  'web.tools.engagementRate.basis.followers': '팔로워 기준',
  'web.tools.engagementRate.basis.impressions': '노출수 기준',
  'web.tools.engagementRate.faq.formula.q': '실제 공식은 무엇인가요?',
  'web.tools.engagementRate.faq.formula.a':
    '선택한 분모로 상호작용을 나눈 값을 백분율로 표시합니다. 여기서 상호작용은 좋아요, 댓글, 공유, 저장을 모두 더한 것을 의미합니다. 일부 플랫폼은 이를 개별적으로 보고하므로, 그 경우 합계를 입력하기 전에 직접 더하세요.',
  'web.tools.engagementRate.faq.basis.q': '어떤 분모를 사용해야 하나요?',
  'web.tools.engagementRate.faq.basis.a':
    '플랫폼이 게시물과 함께 보고하는 것을 사용해, 두 수치가 같은 측정 기간에서 나오도록 하세요. 한 게시물의 도달 기준 비율을 다른 게시물의 팔로워 기준 비율과 비교하는 것은 둘 다 참여율이라고 불리더라도 공정한 비교가 아닙니다.',
} as const;
