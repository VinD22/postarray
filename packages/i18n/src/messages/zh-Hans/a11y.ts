/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': '主要导航',
  'a11y.region.breadcrumb': '面包屑导航',
  'a11y.region.main': '主要内容',
  'a11y.region.composer': '作曲家',
  'a11y.region.preview': '预览',
  'a11y.region.validation': '验证问题',
  'a11y.region.targets': '目标账户',
  'a11y.region.notifications': '通知',

  'a11y.announce.saved': '草稿已保存',
  'a11y.announce.saving': '保存草稿',
  'a11y.announce.saveFailed': '无法保存草稿。你的文字还在这里。',
  'a11y.announce.offline': '您已离线。更改保留在此设备上。',
  'a11y.announce.online': '重新上线',
  'a11y.announce.validationCount':
    '{count, plural, =0 {No validation issues} other {# validation issues}}',
  'a11y.announce.validationCleared': '所有验证问题均已解决',
  'a11y.announce.targetSelected': '{account} 已选择。 {count, plural, other {# targets}} 总共。',
  'a11y.announce.targetOverridden': '{account} 现在有自己的版本',
  'a11y.announce.targetReset': '{account} 重置为主草稿',
  'a11y.announce.uploadProgress': '{name}, {percent} 已上传',
  'a11y.announce.uploadComplete': '{name} 已上传',
  'a11y.announce.uploadFailed': '{name} 上传失败',
  'a11y.announce.scheduled': '预定于 {time} 在 {timeZone}',
  'a11y.announce.rescheduled': '移至 {time} 在 {timeZone}',
  'a11y.announce.publishing': '出版',
  'a11y.announce.published': '{count, plural, other {Published to # accounts}}',
  'a11y.announce.publishPartial':
    '发布到 {published} 的 {total} 账户。 {failed, plural, other {# accounts need attention}}。',
  'a11y.announce.publishFailed': '发布失败。您的内容将被保留。',
  'a11y.announce.approvalRequested': '请求批准 {approver}',
  'a11y.announce.approved': '已批准',
  'a11y.announce.connectionAdded': '{account} 已连接',
  'a11y.announce.connectionRemoved': '{account} 断开连接',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Filters cleared} other {# filters applied}}, {results, plural, other {# results}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': '复制到剪贴板',
  'a11y.announce.suggestionApplied': '建议已采纳',
  'a11y.announce.suggestionRejected': '建议被拒绝',

  'a11y.label.closeDialog': '关闭对话框',
  'a11y.label.openMenu': '打开菜单',
  'a11y.label.sortBy': '排序依据 {field}',
  'a11y.label.sortAscending': '升序排序',
  'a11y.label.sortDescending': '降序排序',
  'a11y.label.removeTarget': '删除 {account} 从目标',
  'a11y.label.removeMedia': '删除 {name}',
  'a11y.label.editAltText': '编辑替代文本 {name}',
  'a11y.label.mediaPreview': '预览 {name}',
  'a11y.label.playVideo': '玩 {name}',
  'a11y.label.pauseVideo': '暂停 {name}',
  'a11y.label.calendarCell': '{date}, {count, plural, =0 {nothing scheduled} other {# posts}}',
  'a11y.label.postSummary': '{account} 上 {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} 的 {limit} 使用的字符',
  'a11y.label.requiredField': '必填',
  'a11y.label.externalLink': '在新选项卡中打开',
  'a11y.label.loadingRegion': '加载内容',
  'a11y.label.expandRow': '显示详细信息 {name}',
  'a11y.label.collapseRow': '隐藏详细信息 {name}',
  'a11y.languagePicker.label': '选择界面语言',
  'a11y.languagePicker.filterLabel': '过滤语言',
  'a11y.languagePicker.announceChanged': '界面语言更改为 {language}',

  'a11y.keyboard.hint.calendar':
    '使用箭头键在插槽之间移动。按 Enter 键打开帖子。按空格键，然后按箭头键重新安排。',
  'a11y.keyboard.hint.composer':
    '按 Control 和括号键可在目标之间移动。按 Control 和 I 转到下一期。',
  'a11y.keyboard.hint.dialog': '按 Esc 键关闭。',
  'a11y.keyboard.shortcutsTitle': '键盘快捷键',

  'a11y.table.alternative': '表格视图',
  'a11y.table.alternativeHint': '与可排序表相同的时间表。',
  'a11y.motion.reduced': '由于您的系统设置，动画会减少。',
} as const;
