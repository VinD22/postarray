/** Simplified Chinese interface messages. */
export const validationMessages = {
  'validation.text_required.message': '{provider} 需要一些用于此帖子类型的文本。',
  'validation.text_too_long.message':
    '{over, plural, one {# character over the limit for {account}} other {# characters over the limit for {account}}}',
  'validation.text_too_long.hint': '{provider} 允许此帐户使用 {limit} 个字符。',
  'validation.text_too_short.message': '{provider} 此处至少需要 {min} 个字符。',
  'validation.title_required.message': '{provider} 需要一个标题。',
  'validation.title_too_long.message': '标题超出 {limit} 字符限制。',
  'validation.description_too_long.message': '该描述超出了 {limit} 字符限制。',
  'validation.media_required.message': '对于此帖子类型，{provider} 至少需要一张图片或视频。',
  'validation.media_count_exceeded.message':
    '{provider} 最多接受 {limit, plural, one {# file} other {# files}} 。这篇文章有{count}。',
  'validation.media_type_unsupported.message': '{provider} 不接受 {mimeType} 文件。',
  'validation.media_aspect_ratio_unsupported.message':
    '该文件是 {actual}。 {provider} 需要 {min} 和 {max} 之间的比率。',
  'validation.media_aspect_ratio_unsupported.hint': '使用平台预设对其进行裁剪以解决此问题。',
  'validation.media_resolution_too_low.message':
    '该文件是 {actual}。 {provider} 至少需要 {required}。',
  'validation.media_duration_too_long.message':
    '该视频是{actual}。此帐户最多接受 {provider} {limit}。',
  'validation.media_duration_too_short.message': '该视频是{actual}。 {provider} 至少需要 {limit}。',
  'validation.media_file_too_large.message': '该文件是 {actual}。 {provider} 最多接受 {limit}。',
  'validation.media_mixed_types_unsupported.message':
    '{provider} 无法在同一篇文章中发布图像和视频。',
  'validation.alt_text_missing.message':
    '{count, plural, one {# image} other {# images}} 上缺少替代文本。',
  'validation.alt_text_missing.hint': '描述图像，或将其标记为装饰性的。',
  'validation.thumbnail_unsupported.message': '{provider} 此处不接受自定义缩略图。',
  'validation.destination_required.message': '选择此内容在 {provider} 上的发布位置。',
  'validation.destination_unsupported.message': '{destination} 不接受 {provider} 上的此帖子类型。',
  'validation.mention_unresolved.message':
    '{count, plural, one {# mention has not been matched to a real account} other {# mentions have not been matched to real accounts}}。',
  'validation.mention_unresolved.hint':
    '从搜索结果中选择帐户，或删除提及。纯文本永远不会作为本机标签发布。',
  'validation.hashtag_count_exceeded.message':
    '{count} 主题标签。 {provider} 比 {limit} 更被视为垃圾邮件。',
  'validation.link_not_allowed.message': '{provider} 不允许此字段中的链接。',
  'validation.link_destination_unverified.message': '此工作区的链接域 {domain} 未经过验证。',
  'validation.privacy_setting_required.message': '{provider} 在发布之前需要明确的隐私选择。',
  'validation.privacy_setting_required.hint': '没有默认值。选择谁可以看到此帖子。',
  'validation.disclosure_required.message': '这篇文章需要根据 {market} 的项目规则进行披露。',
  'validation.first_comment_unsupported.message': '{provider} 不支持此帐户的预定第一条评论。',
  'validation.thread_unsupported.message': '{provider} 不支持此帐户的线程。',
  'validation.repeat_end_required.message': '重复帖子需要结束日期或重复次数。',
  'validation.schedule_in_past.message': '那段时间已经在 {timeZone} 中过去了。',
  'validation.schedule_too_far_ahead.message': '这比为此凭证设置的 {limit} 前瞻更进一步。',
  'validation.schedule_outside_quiet_hours.message': '这属于为 {project} 设置的安静时段。',
  'validation.duplicate_within_window.message':
    '已在 {window} 内为 {account} 安排或发布了非常相似的内容。',
  'validation.blocked_term_present.message': '该文本包含 {project} 的屏蔽术语。',
  'validation.unsupported_claim.message': '此索赔不在 {project} 的批准索赔中。',
  'validation.unsupported_claim.hint': '将其添加到已批准的主张中并提供证据，或重新措辞句子。',
  'validation.cadence_exceeded.message':
    '{account} 将在当天发布 {count, plural, one {# time} other {# times}}，超过 {limit} 的限制。',
  'validation.connection_paused.message': '{account} 已暂停，不会发布。',
  'validation.account_type_invalid.message': '{account} 不是此帖子类型所需的帐户类型 {provider}。',
  'validation.severity.error': '必须修复',
  'validation.severity.warning': '检查这个',
  'validation.severity.info': '供你参考',
  'validation.field.required': '此字段是必需的。',
  'validation.field.tooShort': '至少使用 {min, plural, one {# character} other {# characters}}。',
  'validation.field.tooLong': '最多使用 {max, plural, one {# character} other {# characters}}。',
  'validation.field.invalidEmail': '输入有效的电子邮件地址。',
  'validation.field.invalidUrl': '输入完整的 URL，包括 https。',
  'validation.field.invalidDate': '输入有效日期。',
  'validation.field.invalidTime': '输入有效时间。',
  'validation.field.invalidNumber': '输入一个数字。',
  'validation.field.outOfRange': '输入 {min} 和 {max} 之间的值。',
  'validation.field.mustMatch': '这两个值必须匹配。',
  'validation.field.alreadyTaken': '那已经在使用了。',
  'validation.field.unsafeValue': '这里不允许使用该值。',
} as const;
