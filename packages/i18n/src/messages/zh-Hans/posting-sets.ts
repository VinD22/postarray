export const postingSetMessages = {
  'calendar.hold.action': '暂停',
  'calendar.hold.resumeAction': '恢复',
  'calendar.hold.badge': '已暂停',
  'calendar.hold.badgeBilling': '因账单被暂停',
  'calendar.hold.term': '暂停',
  'calendar.hold.byPerson': '您于 {date} 暂停。',
  'calendar.hold.byBilling': '因该工作区失去完整访问权限，已于 {date} 暂停。',
  'calendar.hold.none': '未暂停',

  'calendar.hold.confirmTitle': '暂停此帖子？',
  'calendar.hold.confirmBody':
    '此帖子将保持原状，不会在 {time} 发布。您可以在此之前的任何时间恢复它，或者如果该时间已过，可以选择新的时间。',
  'calendar.hold.confirmScope':
    '暂停会阻止尚未发生的事情。任何已经发布到平台的内容仍将保持发布状态，暂停不会删除或编辑它。',
  'calendar.hold.confirmNoteLabel': '为什么要暂停此项？（可选）',
  'calendar.hold.confirmNoteHint': '保存在团队的审计记录中，不会发送给任何平台。',
  'calendar.hold.confirm': '暂停此帖子',
  'calendar.hold.cancel': '保持计划',

  'calendar.hold.resumeTitle': '恢复此帖子？',
  'calendar.hold.resumeBody': '将于 {timeZone} 时区的 {time} 发布。',
  'calendar.hold.resumeMissedTitle': '该时间已过去',
  'calendar.hold.resumeMissedBody':
    '此帖子在被暂停期间原本应在 {time} 发布。请选择一个新时间，以免恢复后立即发布。',
  'calendar.hold.resumeTimeLabel': '新的发布时间',
  'calendar.hold.resumeConfirm': '恢复',

  'calendar.hold.paused': '已暂停。在您恢复之前不会发布。',
  'calendar.hold.resumed': '已恢复。将于 {time} 发布。',

  'calendar.hold.blocked.published': '此帖子已经发布。暂停无法将其从平台上撤回。',
  'calendar.hold.blocked.inFlight':
    '此帖子正在发送中，暂停已为时过晚，中途停止可能导致其发布不完整。',
  'calendar.hold.blocked.finished': '此帖子已经结束，因此没有可暂停的内容。',
  'calendar.hold.blocked.billing':
    '此帖子因工作区失去完整访问权限而被暂停。恢复它是账单问题，而非排期问题。',
  'calendar.hold.blocked.billingAction': '前往账单',

  'set.title': '发布集',
  'set.lede':
    '对“我要发给谁、如何发布”这一问题的已保存答案。应用某个发布集会将其设置复制到新草稿中。',
  'set.appliedOnce':
    '发布集在应用时会被读取一次。之后编辑它会改变下一篇帖子的起始设置，但已经用它创建的草稿和已排期帖子将完全保持原样。',
  'set.empty.title': '尚无发布集',
  'set.empty.body': '创建一个，以免每次发帖都要重新构建同一份账户列表。',
  'set.create': '新建发布集',
  'set.edit': '编辑发布集',
  'set.archive': '归档发布集',
  'set.archived': '已归档',
  'set.archivedNote': '已归档的发布集会从选择器中隐藏，由其创建的帖子不受影响。',
  'set.showArchived': '显示已归档',
  'set.saved': '发布集已保存。',
  'set.archivedToast': '发布集已归档。已经由其创建的帖子不受影响。',

  'set.field.name': '名称',
  'set.field.nameHint': '您日后将在选择器中查找的名称。每个项目一个。',
  'set.field.description': '描述',
  'set.field.descriptionHint': '可选，说明此发布集的用途。',
  'set.field.targets': '账户',
  'set.field.targetsHint': '由此发布集创建的帖子所起始的每个账户。',
  'set.field.targetCount': '{count, plural, =0 {无账户} other {# 个账户}}',
  'set.field.signature': '签名',
  'set.field.signatureNone': '无签名',
  'set.field.approval': '审批',
  'set.field.approvalHint': '由此发布集创建的帖子在发布前所需的审批。',
  'set.field.schedule': '何时发布',

  'set.approval.none': '无需审批',
  'set.approval.single_approver': '一位指定审批人',
  'set.approval.any_approver': '任意审批人',
  'set.approval.named_approver': '特定审批人',
  'set.approval.policy_auto': '遵循工作区策略',

  'set.slot.next_free_slot': '队列中的下一个空闲时段',
  'set.slot.next_free_slotHint': '使用此项目的队列规则来提议一个时间。它只是提议；由您来接受。',
  'set.slot.pick_time': '让我自己选择时间',
  'set.slot.pick_timeHint': '应用发布集会将时间留空，由您选择。',
  'set.slot.draft_only': '保留为草稿',
  'set.slot.draft_onlyHint': '应用发布集完全不会涉及排期。',
  'set.slot.noRules': '此项目尚无队列规则，因此队列将提议第一个空闲小时，并会说明这一点。',
  'set.slot.rulesLink': '队列规则',

  'set.defaults.title': '各平台默认设置',
  'set.defaults.body': '复制到每个新帖子中的初始值。您之后可以在创作器中更改其中任何一项。',
  'set.defaults.add': '添加平台',
  'set.defaults.remove': '移除 {platform} 的默认设置',
  'set.defaults.privacy': '隐私',
  'set.defaults.privacyNone': '平台默认',
  'set.defaults.bodyPrefix': '帖子前的文本',
  'set.defaults.bodySuffix': '帖子后的文本',
  'set.defaults.requireAltText': '要求每张图片都有替代文本',
  'set.defaults.requireAltTextHint':
    '在每张图片都有替代文本之前，由此发布集创建的帖子无法在此平台上排期。',
  'set.defaults.empty': '没有各平台默认设置。每个账户都从主帖子开始。',

  'set.error.nameTaken': '此项目中的另一个发布集已使用该名称。',
  'set.error.archived': '此发布集已归档。请先恢复它再进行编辑。',
  'set.error.duplicateTarget': '该账户已在此发布集中。',
  'set.error.duplicatePlatform': '此发布集已包含该平台的默认设置。',

  'targetMemory.setting.title': '在帖子之间记住账户',
  'targetMemory.setting.body':
    '开启后，创作器会以该用户上次在此项目中选择的账户开始每篇新帖子。默认关闭，直到您开启它。',
  'targetMemory.setting.stored':
    '仅保存账户列表，且仅针对选择它们的那位用户。不会保存任何说明文字、时间、隐私设置或审批状态，项目中的其他任何人都无法看到您的列表。',
  'targetMemory.setting.offNote': '关闭时，不会保存任何内容。',
  'targetMemory.setting.turnOffWarning': '关闭此项会删除此项目中每个人已保存的所有选择。',
  'targetMemory.setting.enabled': '开启',
  'targetMemory.setting.disabled': '关闭',
  'targetMemory.setting.saved': '设置已保存。',
  'targetMemory.setting.cleared': '设置已保存。此项目中已保存的选择已被删除。',

  'targetMemory.composer.restored': '{count, plural, other {已使用上次的 # 个账户开始。}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, other {您上次使用的 # 个账户因需要注意而被排除。}}',
  'targetMemory.composer.droppedAll': '您上次使用的账户目前都不可用，因此未预先选择任何账户。',
  'targetMemory.composer.undo': '清除选择',
  'targetMemory.composer.forget': '停止记住我的账户',
  'targetMemory.composer.forgotten': '您已保存的选择已被删除。',
  'targetMemory.composer.reviewAccounts': '查看账户',
} as const;
