export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* 元数据                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': '排期，逐平台说明',
  'web.meta.schedule.description':
    '发布组中每个平台对已连接账户的要求、其官方 API 所强制执行的限制，以及本产品在这些方面的进展。',
  'web.meta.schedulePlatform.title': '{platform} 的排期',
  'web.meta.schedulePlatform.description':
    '{platform} 对已连接账户的要求、其官方 API 所强制执行的限制，以及本产品已构建了哪些部分。',

  /* ---------------------------------------------------------------------- */
  /* 索引                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': '排期，逐平台说明',
  'web.schedule.index.lede':
    '发布组中每个平台各有一个页面。每个页面均说明该平台对已连接账户的要求、其官方 API 所强制执行的限制，以及构建进展。每个数字都附有其来源文档以及有人阅读它的日期。',
  'web.schedule.index.listLabel': '发布组中的平台',
  'web.schedule.index.cohortNote':
    '发布组是本产品正为之构建的平台集合，是一份计划，而非可用性列表。',
  'web.schedule.index.limitsKnown': '限制已记录',
  'web.schedule.index.limitsUnknown': '限制尚未记录',

  /* ---------------------------------------------------------------------- */
  /* 平台页面                                                                */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': '{platform} 的排期',
  'web.schedule.platform.lede':
    '{platform} 对已连接账户的要求、其官方 API 所强制执行的限制，以及本产品迄今为止已针对哪些方面完成了构建。',

  'web.schedule.notice.title': '目前尚无任何内容发布到 {platform}',
  'web.schedule.notice.body':
    '没有任何连接器通过其完成度定义，也没有任何连接器在生产环境中通过验证。此页面描述该平台的要求以及本产品打算支持的内容，并不描述一个可正常工作的排期系统。',

  'web.schedule.requirements.title': '{platform} 的要求',
  'web.schedule.requirements.accountTypes': '账户类型',
  'web.schedule.requirements.restriction': '平台限制',
  'web.schedule.requirements.cost': 'API 成本',
  'web.schedule.requirements.unavailable.title': '尚无经审阅的连接器记录',
  'web.schedule.requirements.unavailable.body':
    '此平台是在最近一次连接器调研之后加入发布组的，因此没有关于其账户要求的带日期记录可供展示。一旦有人阅读官方文档并记录下来，此内容就会出现在此处。',
  'web.schedule.requirements.apiSource': '官方 API 文档',
  'web.schedule.requirements.policySource': '平台政策',

  /* ---------------------------------------------------------------------- */
  /* 限制                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': '{platform} 强制执行的限制',
  'web.schedule.limits.lede':
    '针对没有提升资格的新连接账户读取。平台可以在不通知任何人的情况下提高或降低其中任何一项，这也是为什么每组数据都附有读取日期的原因。',
  'web.schedule.limits.unavailable.title': '{platform} 的限制尚未记录',
  'web.schedule.limits.unavailable.body':
    '此构建版本未提供该平台的适配器，因此没有已记录的上限可供展示。虚构的数字会比没有数字更糟。',
  'web.schedule.limits.sourceLabel': '官方平台文档',

  'web.schedule.limits.text': '正文文本',
  'web.schedule.limits.title_field': '标题字段',
  'web.schedule.limits.countingUnit': '字符如何计数',
  'web.schedule.limits.links': '链接如何计数',
  'web.schedule.limits.images': '每篇帖子的图片数',
  'web.schedule.limits.videos': '每篇帖子的视频数',
  'web.schedule.limits.videoDuration': '视频时长',
  'web.schedule.limits.imageBytes': '最大图片',
  'web.schedule.limits.gifBytes': '最大动图',
  'web.schedule.limits.videoBytes': '最大视频',
  'web.schedule.limits.documentBytes': '最大文档',
  'web.schedule.limits.altText': '替代文本',
  'web.schedule.limits.mimeTypes': '接受的文件类型',
  'web.schedule.limits.markdown': '格式标记',

  'web.schedule.value.characters': '{count, plural, other {# 个字符}}',
  'web.schedule.value.files': '{count, plural, =0 {无} other {# 个文件}}',
  'web.schedule.value.durationRange': '{min} 至 {max} 之间',
  'web.schedule.value.durationMax': '最多 {max}',
  'web.schedule.value.markdownYes': '支持',
  'web.schedule.value.markdownNo': '以纯字符形式发布',

  'web.schedule.unit.utf16': '按 UTF-16 代码单元计算，这是大多数编辑器所报告的字符计数方式。',
  'web.schedule.unit.grapheme': '按字素计算，因此由多个码位组成的表情符号仍只计为一个字符。',
  'web.schedule.unit.weighted': '按加权方案计算，大多数非拉丁字符计为两个而非一个。',

  'web.schedule.link.none': '链接不计入上限。',
  'web.schedule.link.actual': '链接的成本恰好等于其所占用的字符数。',
  'web.schedule.link.fixed':
    '每个链接都会被重写为平台的短链接，无论其实际长度如何，都计为 {count, plural, other {# 个字符}}。',

  /* ---------------------------------------------------------------------- */
  /* 能力状态                                                                */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': '{platform} 已构建的内容',
  'web.schedule.capabilities.lede':
    '由连接器注册表生成，而非在此处手动撰写。“平台未提供”是关于该平台的事实，且是最终结论。“尚未构建”是关于本产品的事实，在没有任何连接器通过其完成度定义之前，这是诚实的默认状态。',
  'web.schedule.capabilities.unavailable.title': '{platform} 尚无能力记录',
  'web.schedule.capabilities.unavailable.body':
    '此构建版本中没有适配器，因此注册表没有可报告的内容。一旦有实际内容可说，此行就会出现在能力矩阵中。',
  'web.schedule.capabilities.matrixLink': '阅读完整能力矩阵',

  'web.schedule.next.title': '接下来可以去哪里',
  'web.schedule.next.body':
    '能力矩阵在一张表格中列出了每个平台和每项能力。使用场景页面描述了本产品正围绕其构建的工作流程。',
} as const;
