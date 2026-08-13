export const webComparisonMessages = {
  'web.comparison.eyebrow': '对比',

  'web.comparison.state.yes': '是',
  'web.comparison.state.no': '否',
  'web.comparison.state.partial': '部分',
  'web.comparison.state.notVerified': '未核实',

  'web.comparison.label.claim': '说法',
  'web.comparison.label.sourceRead': '阅读于 {date}',
  'web.comparison.label.checked': '每一行均于 {date} 核对',
  'web.comparison.label.nextReview': '下次核对到期日：{date}',
  'web.comparison.label.backToIndex': '所有对比',

  'web.comparison.table.title': '各选项的功能',
  'web.comparison.table.caption': '每行一个说法，每个答案背后都附有来源',

  'web.comparison.bestFor.title': '哪一个更适合',
  'web.comparison.bestFor.ours': '在以下情况下选择本产品',
  'web.comparison.bestFor.alternative': '在以下情况下选择 {name}',

  'web.comparison.notDo.title': '本产品不做的事情',
  'web.comparison.notDo.body':
    '这些语句是从决定其内容的代码中读取的，而非手动输入，因此本节不会偏离本产品今天的实际情况。',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {尚无连接器完成提供商验证，因此今天没有任何内容通过本产品发布到任何平台。} other {已有 # 个连接器完成提供商验证。该组中的其他所有平台仍处于意向阶段。}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {尚无语言完成人工审核，因此界面中的每种语言都标记为测试版。} other {已有 # 种语言完成人工审核。其他每种语言均标记为测试版。}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {每个价格档位均已确定并带有实际价格。} other {仍有 # 个价格档位为尚未确定的占位符，无法购买。}}',

  'web.comparison.notVerified.title': '“未核实”是什么意思',
  'web.comparison.notVerified.body':
    '当在核对当天无法从另一选项的官方公开文档中读取该事实时，单元格会标注为“未核实”。绝不凭记忆填写，也绝不从他人撰写的摘要中复制。',

  'web.comparison.method.title': '此页面是如何制作的',
  'web.comparison.method.body':
    '每一行都是一条说法，附有其来源文档以及有人阅读它的日期。没有竞品截图，没有复制的功能措辞，也没有虚构的弱点。',
  'web.comparison.method.cadence':
    '每项对比至少每 90 天重新核对一次，并在某平台或选项发生某行所述的变化时立即核对。',

  'web.comparison.questions.title': '问题',
  'web.comparison.sources.title': '本页引用的来源',

  'web.comparison.index.title': '已发布的对比',
  'web.comparison.index.body':
    '每个页面将本产品与一类可从官方文档中读取事实的替代方案进行比较。只有当某个具名产品的当前事实可以从其自身的公开页面中读取时，才会为其创建页面，而不会提前创建。',
  'web.comparison.index.checked': '核对于 {date}',
} as const;
