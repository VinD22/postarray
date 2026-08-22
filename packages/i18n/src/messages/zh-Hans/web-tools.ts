export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* 元数据                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': '免费发布工具',
  'web.meta.tools.description':
    '为在多个平台发布内容的人提供的小巧私密工具：按平台限制检查、UTM 构建器、YouTube 标题长度检查器和时区规划器。',
  'web.meta.tools.preflight.title': '发布前检查工具',
  'web.meta.tools.preflight.description':
    '将一份草稿对照十个平台已发布的文本和媒体限制进行检查，并附有每项限制的来源和读取日期。',
  'web.meta.tools.utm.title': 'UTM 链接构建器',
  'web.meta.tools.utm.description':
    '构建带标记的活动 URL，并查看每个 UTM 参数的含义。完全在您的浏览器中运行。',
  'web.meta.tools.youtubeTitle.title': 'YouTube 标题长度检查器',
  'web.meta.tools.youtubeTitle.description':
    '按照人们计数字符的方式，对照已记录的上限来测量 YouTube 标题。',
  'web.meta.tools.timeZone.title': '时区与夏令时规划器',
  'web.meta.tools.timeZone.description':
    '在多个受众时区中查看同一个发布时间，并找出夏令时变化会改变本地时间的那些周。',
  'web.meta.tools.engagementRate.title': '互动率计算器',
  'web.meta.tools.engagementRate.description':
    '将互动数除以覆盖人数、粉丝数或展示次数。三项简单计算，没有虚构的基准值。',

  /* ---------------------------------------------------------------------- */
  /* 共享工具框架                                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': '免费工具',
  'web.tools.index.summary': '基于我们连接器所读取的同一平台限制数据构建的小型计算器。',
  'web.tools.index.lede':
    '四个小工具，基于我们连接器所使用的同一平台限制数据构建。无需账户、无需上传、不追踪您所输入的内容。',
  'web.tools.index.dataTitle': '这些数字从何而来',
  'web.tools.index.dataBody':
    '每项限制都从本代码库中的连接器能力代码生成，每个平台行都附有其来源的官方文档页面以及有人阅读该页面的日期。',
  'web.tools.index.honesty':
    '这些工具不会发布任何内容。尚无连接器完成提供商验证，因此此处不会连接任何账户。',
  'web.tools.shared.privacyTitle': '这在您的浏览器中运行',
  'web.tools.shared.privacyBody':
    '您输入的所有内容都留在此页面上。没有服务器请求、没有存储，也没有携带您文本内容的分析事件。',
  'web.tools.shared.sourceLink': '平台文档',
  'web.tools.shared.sourceRead': '阅读于 {date}',
  'web.tools.shared.unavailable': '不可用',
  'web.tools.shared.unavailableWhy':
    '我们尚未为此平台提供连接器，因此没有经过验证的限制可供展示。我们宁愿什么都不说，也不愿猜测。',
  'web.tools.shared.copy': '复制',
  'web.tools.shared.copied': '已复制',
  'web.tools.shared.copyFailed': '您的浏览器阻止了复制操作。请选中文本后手动复制。',
  'web.tools.shared.faqTitle': '常见问题',
  'web.tools.shared.baselineTitle': '这些数字描述的是哪种账户',
  'web.tools.shared.baselineBody':
    '保守情形：一个没有提升资格的新连接账户。有些平台在频道或企业通过验证后会提高上限，出现这种情况时页面会如实说明。',
  'web.tools.shared.otherTools': '其他工具',

  /* ---------------------------------------------------------------------- */
  /* 工具名称与一句话摘要                                                    */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': '发布前检查工具',
  'web.tools.preflight.summary': '一份草稿，一次性对照十个平台的文本和媒体限制进行检查。',
  'web.tools.utm.name': 'UTM 链接构建器',
  'web.tools.utm.summary': '在不破坏已有查询字符串的情况下构建带标记的活动 URL。',
  'web.tools.youtubeTitle.name': 'YouTube 标题长度检查器',
  'web.tools.youtubeTitle.summary': '按照人们计数字符的方式测量标题。',
  'web.tools.timeZone.name': '时区与夏令时规划器',
  'web.tools.timeZone.summary': '在多个受众时区中查看同一个发布时间，并标出夏令时变化。',
  'web.tools.engagementRate.name': '互动率计算器',
  'web.tools.engagementRate.summary':
    '互动数除以覆盖人数、粉丝数或展示次数。不查找任何数据，也不进行任何基准比较。',

  /* ---------------------------------------------------------------------- */
  /* 发布前检查工具                                                          */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': '发布前检查工具',
  'web.tools.preflight.lede':
    '粘贴一份草稿，选择您要发布的平台，在从 API 错误中得知之前先查看哪些平台会拒绝它。',
  'web.tools.preflight.explainer.title': '为何仅靠字符计数器还不够',
  'web.tools.preflight.explainer.body':
    '各平台对“字符”的定义并不一致。有些按代码单元计数，因此一个表情符号计为两个字符。有些按字素计数，因此一面旗帜或一个家庭表情符号计为一个字符。有些会将每个链接重写为固定宽度，因此一个 200 字符的 URL 与一个 20 字符的 URL 成本相同。此工具会分别应用每个平台的规则。',
  'web.tools.preflight.explainer.counting':
    '草稿使用浏览器的 Intl 分段器进行测量，该分段器会将文本拆分为读者所理解的“字符”单位，然后根据平台规则进行调整。',
  'web.tools.preflight.field.draft.label': '您的草稿',
  'web.tools.preflight.field.draft.help':
    '粘贴帖子正文。链接会被自动识别，以便按平台分别应用其成本。',
  'web.tools.preflight.field.platforms.label': '要检查的平台',
  'web.tools.preflight.field.platforms.help': '选择您发布内容的所有平台。',
  'web.tools.preflight.field.mediaKind.label': '附加的媒体',
  'web.tools.preflight.field.mediaKind.none': '无媒体',
  'web.tools.preflight.field.mediaKind.image': '图片',
  'web.tools.preflight.field.mediaKind.video': '一段视频',
  'web.tools.preflight.field.mediaCount.label': '图片数量',
  'web.tools.preflight.field.byteSize.label': '文件大小（MB）',
  'web.tools.preflight.field.byteSize.help': '单个最大文件。留空则跳过此项。',
  'web.tools.preflight.field.duration.label': '视频时长（秒）',
  'web.tools.preflight.field.duration.help': '留空则跳过时长检查。',
  'web.tools.preflight.field.width.label': '媒体宽度（像素）',
  'web.tools.preflight.field.height.label': '媒体高度（像素）',
  'web.tools.preflight.field.dimensions.help': '可选。仅用于显示您将要发布的宽高比。',
  'web.tools.preflight.results.title': '各平台的结果',
  'web.tools.preflight.results.empty': '请至少选择一个平台以查看结果。',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {没有阻碍项} other {# 项将会失败}}，{warning, plural, =0 {没有警告} other {# 项值得留意}}。',
  'web.tools.preflight.status.pass': '符合',
  'web.tools.preflight.status.warning': '值得检查',
  'web.tools.preflight.status.fail': '将会失败',
  'web.tools.preflight.status.unavailable': '不可用',
  'web.tools.preflight.count.label':
    '{count} / {limit} {unit, select, grapheme {字符} utf16 {代码单元} weighted {加权字符} other {字符}}',
  'web.tools.preflight.finding.textOver': '超出上限 {over, plural, other {# 个字符}}。',
  'web.tools.preflight.finding.textNear': '距离上限还剩 {remaining} 个字符。',
  'web.tools.preflight.finding.textFits': '正文符合要求。',
  'web.tools.preflight.finding.linkFixed':
    '每个链接都会被重写为固定宽度，因此无论其实际长度如何，每个链接都计为 {cost} 个字符。',
  'web.tools.preflight.finding.linkActual': '链接按其所占用的字符数计算。',
  'web.tools.preflight.finding.imagesOver':
    '此平台在一篇帖子中接受 {limit, plural, =0 {不接受图片} other {# 张图片}}。',
  'web.tools.preflight.finding.videosOver':
    '此平台在一篇帖子中接受 {limit, plural, =0 {不接受视频} other {# 段视频}}。',
  'web.tools.preflight.finding.bytesOver': '该文件超过了 {limit} 的上限。',
  'web.tools.preflight.finding.bytesUnknown': '此媒体类型没有已发布的字节上限，因此未检查大小。',
  'web.tools.preflight.finding.durationOver': '超过了 {limit} 秒的上限。',
  'web.tools.preflight.finding.durationUnder': '短于 {limit} 秒的最短要求。',
  'web.tools.preflight.finding.durationUnknown': '没有已发布的时长上限，因此未检查长度。',
  'web.tools.preflight.finding.altText': '替代文本最多可接受 {limit} 个字符，值得使用。',
  'web.tools.preflight.finding.ratio': '您将以约 {ratio} 比 1 的比例发布。',
  'web.tools.preflight.faq.counting.q': '你们如何计数字符？',
  'web.tools.preflight.faq.counting.a':
    '按字素计数，使用浏览器的 Intl 分段器，这是读者所理解的“字符”单位。当某平台记录了不同的规则时，例如计数代码单元或对每个链接收取固定宽度，该规则会在此基础上叠加应用。',
  'web.tools.preflight.faq.accuracy.q': '这些限制的时效性如何？',
  'web.tools.preflight.faq.accuracy.a':
    '每项限制都从我们代码库中的连接器代码生成，而不是手动输入到页面中，每个平台行都会显示其来源的官方文档以及有人阅读它的日期。如果某个平台更改了数字，修复方式就是一次代码变更，此处的每个工具都会随之更新。',
  'web.tools.preflight.faq.privacy.q': '我的草稿会被上传吗？',
  'web.tools.preflight.faq.privacy.a':
    '不会。检查在您的浏览器中进行，没有携带您文本内容的请求，不会存储任何内容，关闭标签页即可将其丢弃。',
  'web.tools.preflight.faq.publish.q': '此工具能替我发布吗？',
  'web.tools.preflight.faq.publish.a':
    '目前还不能。没有任何连接器完成提供商验证，因此此网站的任何内容目前都不会发布到任何平台。此页面是一个限制检查工具，而不是创作器。',

  /* ---------------------------------------------------------------------- */
  /* UTM 构建器                                                              */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'UTM 链接构建器',
  'web.tools.utm.lede':
    '在不丢失 URL 原有查询字符串、也不猜测每个参数含义的情况下，为 URL 添加活动参数。',
  'web.tools.utm.explainer.title': '每个参数的用途',
  'web.tools.utm.explainer.body':
    'UTM 参数由分析工具读取，而不是由您发布的平台读取。它们会随 URL 传递，因此任何看到该链接的人都能看到它们。请保持简短、小写且一致，因为同一活动的两种拼写方式会在报告中变成两行数据。',
  'web.tools.utm.field.url.label': '目标 URL',
  'web.tools.utm.field.url.help': '您希望人们到达的页面，须包含 https。',
  'web.tools.utm.field.url.invalid': '该内容无法解析为 http 或 https URL。',
  'web.tools.utm.field.source.label': '活动来源',
  'web.tools.utm.field.source.help': '点击来自何处，例如某个平台的名称。',
  'web.tools.utm.field.medium.label': '活动媒介',
  'web.tools.utm.field.medium.help': '链接的类型，例如社交、邮件或引荐。',
  'web.tools.utm.field.campaign.label': '活动名称',
  'web.tools.utm.field.campaign.help': '此链接所属的发布、推广或主题。',
  'web.tools.utm.field.term.label': '活动关键词',
  'web.tools.utm.field.term.help': '可选。传统上指付费关键词。',
  'web.tools.utm.field.content.label': '活动内容',
  'web.tools.utm.field.content.help':
    '可选。用于区分指向同一页面的两个链接，例如一篇帖子的两个版本。',
  'web.tools.utm.result.title': '您的带标记 URL',
  'web.tools.utm.result.empty': '请输入目标 URL 以查看结果。',
  'web.tools.utm.result.label': '生成的 URL',
  'web.tools.utm.result.preserved': '您的 URL 原有的查询字符串会完全按您输入的样子保留。',
  'web.tools.utm.result.replaced': '您的 URL 已包含这些参数中的一个，您在此处输入的值会将其替换。',
  'web.tools.utm.faq.encoding.q': '空格和重音符号会怎样处理？',
  'web.tools.utm.faq.encoding.a':
    '它们会被进行百分号编码，这使得链接在粘贴到帖子中后仍能正常工作。空格会变成加号，带重音的字母会变成其编码形式，分析工具会将两者解码还原。',
  'web.tools.utm.faq.existing.q': '这会破坏已经带有参数的 URL 吗？',
  'web.tools.utm.faq.existing.a':
    '不会。现有参数会按其原始顺序保留，只有您填写的 UTM 参数会被添加或替换。URL 末尾的片段标识符仍会保留在末尾。',
  'web.tools.utm.faq.privacy.q': '我的 URL 会被发送到某处吗？',
  'web.tools.utm.faq.privacy.a': '不会。URL 在您的浏览器中生成，从不离开此页面。',

  /* ---------------------------------------------------------------------- */
  /* YouTube 标题长度检查器                                                  */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'YouTube 标题长度检查器',
  'web.tools.youtubeTitle.lede':
    '超出一个字符的标题在上传时会被拒绝。仅仅是偏长的标题则会在您未选择的位置被截断。',
  'web.tools.youtubeTitle.explainer.title': '两种不同的限制',
  'web.tools.youtubeTitle.explainer.body':
    '硬性上限是上传接口所接受的限制。标题在哪里显示则是另一个问题：搜索结果、侧边栏和手机各自在不同的位置截断标题，而这些截断点都不是公开发布的。此工具说明已记录的上限，并展示您标题的形状，不会虚构一个截断数字。',
  'web.tools.youtubeTitle.field.title.label': '视频标题',
  'web.tools.youtubeTitle.field.title.help': '按字素计数，因此一个表情符号计为一个字符。',
  'web.tools.youtubeTitle.result.count': '{count} / {limit} 个字符',
  'web.tools.youtubeTitle.result.over': '超出 {over, plural, other {# 个字符}}。上传将被拒绝。',
  'web.tools.youtubeTitle.result.fits': '在已记录的上限之内。',
  'web.tools.youtubeTitle.result.front':
    '前 {count} 个字符权重最大，因为这大约是窄版布局所能容纳的空间。您的标题开头为：{preview}',
  'web.tools.youtubeTitle.result.unavailable':
    '此构建版本中标题限制不可用，因此此处不进行任何检查。',
  'web.tools.youtubeTitle.faq.limit.q': '此限制从何而来？',
  'web.tools.youtubeTitle.faq.limit.a':
    '来自官方 videos insert 参考文档，由我们上传程序所使用的同一连接器代码生成到此页面中。有人最后一次阅读该页面的日期会显示在数字旁边。',
  'web.tools.youtubeTitle.faq.truncation.q': 'YouTube 究竟会在何处截断标题？',
  'web.tools.youtubeTitle.faq.truncation.a':
    '这取决于展示界面和视口，YouTube 并未为此发布字符计数。我们展示的是已记录的上限，不会打印一个属于猜测的截断数字。',
  'web.tools.youtubeTitle.faq.emoji.q': '表情符号计为一个字符吗？',
  'web.tools.youtubeTitle.faq.emoji.a':
    '在此计数器中是的，因为我们按字素计数。内部按代码单元计数的平台可能会对同一表情符号收取更高的成本，这就是为什么发布前检查工具会分别应用每个平台的规则。',

  /* ---------------------------------------------------------------------- */
  /* 时区与夏令时规划器                                                      */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': '时区与夏令时规划器',
  'web.tools.timeZone.lede':
    '在您日历中看似固定的每周时段，每年会为您一半的受众移动两次。此工具展示何时何地会发生这种情况。',
  'web.tools.timeZone.explainer.title': '为何固定的本地时间并非固定的时间',
  'web.tools.timeZone.explainer.body':
    '一个时间只有附带时区才有意义。各时区在因国家而异的日期上改变其偏移量，一月相差五小时的两个地区在四月可能只相差四小时。以“时刻加时区”存储的排期不受此影响，而以本地小时存储的排期则会受影响。',
  'web.tools.timeZone.field.date.label': '日期',
  'web.tools.timeZone.field.time.label': '时间',
  'web.tools.timeZone.field.zone.label': '您的时区',
  'web.tools.timeZone.field.audience.label': '受众时区',
  'web.tools.timeZone.field.audience.help': '选择您的读者实际所在的时区。',
  'web.tools.timeZone.result.title': '同一时刻，在您选择的每个地方',
  'web.tools.timeZone.result.empty': '请至少选择一个受众时区。',
  'web.tools.timeZone.result.shift':
    '在此日期与四周后的同一星期几之间会发生夏令时变化，因此本地时间会移动。',
  'web.tools.timeZone.result.stable': '接下来四周内没有偏移变化。',
  'web.tools.timeZone.result.later': '四周后，为 {time}。',
  'web.tools.timeZone.result.invalidDate': '请输入日期和时间以查看比较结果。',
  'web.tools.timeZone.faq.dst.q': '时间会朝哪个方向变化？',
  'web.tools.timeZone.faq.dst.a':
    '这取决于时区以及变化的方向，这也是为什么表格展示四周后的实际本地时间，而不是描述规则本身。每个时区的偏移量均从您浏览器的时区数据库中读取。',
  'web.tools.timeZone.faq.storage.q': '已排期的帖子应如何存储其时间？',
  'web.tools.timeZone.faq.storage.a':
    '以“时刻加上该用户选择的 IANA 时区”的形式存储，绝不以简单的本地时间形式存储。这正是我们内部的做法，也是为什么在时钟变化之前排期的帖子仍会落在预期本地时间的原因。',

  /* ---------------------------------------------------------------------- */
  /* 互动率计算器                                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': '互动率计算器',
  'web.tools.engagementRate.lede':
    '输入您自己后台已经显示的数字。这会以三种方式进行除法计算，并到此为止：没有基准值，没有“良好”阈值，没有任何我们实际并不掌握的数据。',
  'web.tools.engagementRate.explainer.title': '为何是三种分母，而非一种',
  'web.tools.engagementRate.explainer.body':
    '覆盖人数、粉丝数和展示次数回答的是不同的问题。按覆盖人数计算的比率告诉您实际看到该帖子的人是如何反应的。按粉丝数计算的比率告诉您有多大比例的受众产生了互动，无论帖子是否触达了所有人。按展示次数计算的比率则计入每一次浏览，包括重复浏览。将以一种方式计算的比率与以另一种方式计算的比率进行比较，是导致互动率数字看起来不对劲的常见原因。',
  'web.tools.engagementRate.field.interactions.label': '互动数',
  'web.tools.engagementRate.field.interactions.help':
    '将来自您所测量帖子的点赞、评论、分享和收藏相加。',
  'web.tools.engagementRate.field.reach.label': '覆盖人数',
  'web.tools.engagementRate.field.reach.help': '至少看到该帖子一次的账户数。',
  'web.tools.engagementRate.field.followers.label': '粉丝数',
  'web.tools.engagementRate.field.followers.help': '发帖时的账户规模。',
  'web.tools.engagementRate.field.impressions.label': '展示次数',
  'web.tools.engagementRate.field.impressions.help': '总浏览次数，包括同一人看过两次的情况。',
  'web.tools.engagementRate.result.title': '互动率，三种方式',
  'web.tools.engagementRate.result.empty': '不可用',
  'web.tools.engagementRate.result.note':
    '没有一个普遍适用的良好比率可供比较。这取决于平台、内容形式、受众规模和行业，任何被作为基准提出的单一数字，都是包装成数据的猜测。',
  'web.tools.engagementRate.basis.reach': '按覆盖人数',
  'web.tools.engagementRate.basis.followers': '按粉丝数',
  'web.tools.engagementRate.basis.impressions': '按展示次数',
  'web.tools.engagementRate.faq.formula.q': '实际公式是什么？',
  'web.tools.engagementRate.faq.formula.a':
    '互动数除以您所选择的分母，以百分比形式显示。此处的互动数是指点赞、评论、分享和收藏的总和；有些平台会分别报告这些数据，此时请在输入总数之前自行相加。',
  'web.tools.engagementRate.faq.basis.q': '我应该使用哪个分母？',
  'web.tools.engagementRate.faq.basis.a':
    '使用您的平台随帖子一同报告的那个分母，这样两个数字就来自同一个测量窗口。将一篇帖子按覆盖人数计算的比率与另一篇帖子按粉丝数计算的比率进行比较并不公平，即便两者都被称为互动率。',
} as const;
