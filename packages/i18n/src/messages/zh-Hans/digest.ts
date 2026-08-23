/** Simplified Chinese beta translations for the weekly digest and its email. */
export const digestMessages = {
  'digest.title': '本周',
  'digest.subtitle': '这是我们从 {windowStart} 到 {windowEnd} 能看到的内容。',
  'digest.empty': '本周还没有可总结的内容。发布一些内容后，它会显示在这里。',
  'digest.regenerate': '重新生成本周摘要',
  'digest.generating': '正在生成本周摘要',
  'digest.source.deterministic':
    '根据您的发布记录和自有测量数据生成，没有使用写作助手。',
  'digest.source.ai': '由助手根据您的记录生成。每个数字都已与这些记录核对。',
  'digest.unavailable.aiOff': '写作助手已关闭，因此这是普通版本。没有遗漏任何内容。',
  'digest.unavailable.rejected': '助手版本与您的数据不匹配，因此已丢弃。这是普通版本。',
  'digest.headline.published':
    '{published, plural, =0 {没有完成任何帖子} one {完成了 # 个帖子} other {完成了 # 个帖子}}，时间在 {windowStart} 到 {windowEnd} 之间。',
  'digest.headline.nothingPublished': '{windowStart} 到 {windowEnd} 之间没有发布任何内容。',
  'digest.outcome.published':
    '{count, plural, one {在 {provider} 上完成了 # 个帖子} other {在 {provider} 上完成了 # 个帖子}}。',
  'digest.outcome.partial':
    '{count, plural, one {在 {provider} 上有 # 个帖子到达了部分目标，但没有到达其他目标} other {在 {provider} 上有 # 个帖子到达了部分目标，但没有到达其他目标}}。',
  'digest.outcome.failed':
    '{count, plural, one {在 {provider} 上有 # 个帖子未能发布} other {在 {provider} 上有 # 个帖子未能发布}}。',
  'digest.metrics.noneYet':
    '本周还没有测量数据。这表示我们不知道这些帖子表现如何，并不表示它们表现不好。',
  'digest.freshness.statement':
    '{label, select, fresh {测量数据上次于 {lastObservedAt} 同步。} stale {自 {lastObservedAt} 以来测量数据未同步，因此上面的数字可能已经过时。} other {尚未同步任何内容，因此上面没有已测量的数据。}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': '值得了解：{confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': '每周摘要邮件',
  'digest.settings.description': '每周发送一封简短邮件，说明发布了什么以及我们测量到了什么。默认开启。',
  'digest.settings.enabled': '发送每周摘要',
  'email.digest.subject': '{workspaceName} 的本周摘要',
  'email.digest.intro': '以下是我们在 {windowStart} 到 {windowEnd} 期间能看到的 {workspaceName} 情况。',
  'email.digest.noData':
    '我们本周无法测量任何内容。缺少数字是因为我们无法读取它，而不是因为它等于零。',
  'email.digest.footer':
    '您收到这封邮件，是因为 {workspaceName} 已开启每周摘要。您可以在工作区设置中关闭它。',
} as const;
