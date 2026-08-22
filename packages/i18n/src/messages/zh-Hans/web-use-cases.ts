export const webUseCaseMessages = {
  'web.meta.useCases.title': '使用场景',
  'web.meta.useCases.description':
    '本产品正围绕三种工作流程构建：在一处管理多个客户、在发布前让工作获得批准，以及将一个创意投放到多个平台而无需重写。',
  'web.meta.useCase.clients.title': '管理多个客户',
  'web.meta.useCase.clients.description':
    '为代表他人发布内容的团队提供独立的项目、独立的已连接账户、独立的审批和独立的报告。',
  'web.meta.useCase.approvals.title': '审批工作流',
  'web.meta.useCase.approvals.description':
    '草稿如何成为已批准的帖子：由谁审核、什么会使审批失效，以及为何同一规则在每个界面上都成立。',
  'web.meta.useCase.crossPlatform.title': '跨平台发布',
  'web.meta.useCase.crossPlatform.description':
    '一个主草稿，为每个平台适配的一个版本，在安排任何计划之前均针对各平台已记录的限制进行验证。',

  'web.useCases.index.title': '使用场景',
  'web.useCases.index.lede':
    '本产品正围绕三种工作流程构建。每个页面都说明该工作流程今天给团队带来的成本、产品被设计成如何处理它，以及哪些部分已经实际构建完成。',
  'web.useCases.index.listLabel': '使用场景',

  'web.useCases.notice.title': '这描述的是一种设计，而非正在运行的服务',
  'web.useCases.notice.body':
    '没有任何连接器在生产环境中通过验证，因此此页面上的任何内容目前都不会发布到任何地方。工作流程中已构建的部分会如实说明，尚未构建的部分同样会如实说明。',

  'web.useCases.section.problem': '问题',
  'web.useCases.section.approach': '产品的设计方式',
  'web.useCases.section.today': '实际已构建的内容',
  'web.useCases.section.related': '相关内容',

  'web.useCases.clients.title': '管理多个客户',
  'web.useCases.clients.lede': '一个客户的工作绝不应该因为一次点击失误就送达另一个客户的受众。',
  'web.useCases.clients.problem':
    '大多数团队靠小心谨慎来隔离客户。一个共享账户持有每一个已连接的页面，一个日历持有每一个排期，在客户草稿与错误受众之间，唯一的屏障是那个在晚上六点盯着屏幕的人。当有人离开团队时，这种隔离也会随着那份习惯一起消失。',
  'web.useCases.clients.approach1':
    '项目是隔离的单位。已连接账户、草稿、队列、媒体和收据都归属于某个项目，成员只能看到自己被加入的项目。',
  'web.useCases.clients.approach2':
    '这种隔离被强制执行三次：在身份验证时、在授权操作的应用服务中，以及在数据库本身通过行级安全实现。已登录绝不会被视为拥有权限。',
  'web.useCases.clients.approach3':
    '报告遵循同样的边界，因此按客户划分的报告是默认形态，而不是有人手动拼凑的电子表格。',
  'web.useCases.clients.today':
    '项目、限定在项目范围内的成员资格，以及其背后的行级安全策略均已构建并经过测试，其中包括尝试跨项目读取并确保其失败的测试。方案根据团队所需的项目数量而定。目前尚无任何项目向任何平台发布任何内容。',

  'web.useCases.approvals.title': '审批工作流',
  'web.useCases.approvals.lede': '只有当被批准的内容正是最终发布的内容时，审批才有意义。',
  'web.useCases.approvals.problem':
    '审批通常发生在发布工具之外。截图被发送给客户，客户回复“可以”，然后文案又被更改。此时审批所指向的草稿已不属于任何人，而工具对此一无所知，于是它会发布最后一次收到的任何内容。',
  'web.useCases.approvals.approach1':
    '审批与被审核的确切内容绑定。编辑已批准的草稿会使审批失效，并说明哪个字段发生了变化，而不是悄悄延续旧的决定。',
  'web.useCases.approvals.approach2':
    '审核者可以批准、要求修改或拒绝，除批准外的任何操作都需要评论，因此作者永远不必猜测该修正什么。',
  'web.useCases.approvals.approach3':
    '此规则存在于共享的应用层中，因此网页应用、REST API、MCP 服务器、CLI 和 webhook 都会遵守它。没有任何界面拥有绕过审核的捷径。',
  'web.useCases.approvals.today':
    '审批状态、审核界面、重新审批规则及其背后的审计事件均已构建完成。尚未构建的是最后一步，因为没有任何连接器通过其完成度定义，所以已批准的帖子目前尚无发布去处。',

  'web.useCases.crossPlatform.title': '跨平台发布',
  'web.useCases.crossPlatform.lede':
    '一个创意，一次编辑，以及为每个平台生成的、尊重该平台实际接受内容的版本。',
  'web.useCases.crossPlatform.problem':
    '在各处发布相同的文本会导致某个版本在一个平台上被截断、在另一个平台上缺少必填标题，而在第三个平台上被悄悄剥除了链接。另一种选择（手动重写五遍）正是工作实际耗费精力的地方。',
  'web.useCases.crossPlatform.approach1':
    '主草稿承载创意。每个被选中的账户都拥有自己的版本，对主草稿的编辑只会应用到适用之处，并明确说明哪些目标无法应用及原因。',
  'web.useCases.crossPlatform.approach2':
    '验证针对每个平台已记录的限制进行，按该平台的计数方式计数，因此字符上限在平台使用字素计数时以字素核对，在使用加权单位时以加权单位核对。',
  'web.useCases.crossPlatform.approach3':
    '本网站任何地方展示的每一项平台限制都由连接器注册表生成，并附有其来源文档以及有人阅读它的日期。',
  'web.useCases.crossPlatform.today':
    '创作器、按目标生成的版本、验证规则以及生成的限制数据集均已构建完成。发布步骤尚未构建：没有连接器在生产环境中通过验证，因此已验证的草稿只能在内部排期，无法送达任何平台。',
} as const;
