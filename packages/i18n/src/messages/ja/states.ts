/** Japanese beta catalog. */
export const stateMessages = {
  'state.draft.label': '下書き',
  'state.draft.description':
    'このワークスペース内のユーザーのみが表示できます。何も予定されていません。',
  'state.validation_needed.label': '検証が必要です',
  'state.validation_needed.description':
    '1 つ以上のターゲットには、スケジュールを設定する前に修正する必要がある問題があります。',
  'state.approval_requested.label': '承認が要求されました',
  'state.approval_requested.description': '待っています{approver}決めること。',
  'state.approved.label': '承認された',
  'state.approved.description':
    '承認者{approver}。これで、スケジュールまたは公開できるようになります。',
  'state.scheduled.label': '予定されている',
  'state.scheduled.description': '発行する{time}で{timeZone}。',
  'state.preparing_media.label': 'メディアの準備',
  'state.preparing_media.description': 'プラットフォーム用のファイルのアップロードと変換。',
  'state.dispatching.label': '派遣',
  'state.dispatching.description': '送信先{provider}今。',
  'state.provider_processing.label': 'プロバイダー処理',
  'state.provider_processing.description':
    '{provider}アップロードを受け入れ、まだ処理中です。ライブのときに確認します。',
  'state.published.label': '発行済み',
  'state.published.description': '生き続ける{provider}以来{time}。',
  'state.partially_published.label': '部分的に公開',
  'state.partially_published.description':
    '{published, plural, other {# 件のターゲットが公開されました}}、{failed, plural, other {＃ 失敗した}}。公開された投稿はライブであり、ロールバックされていません。',
  'state.action_required.label': 'アクションが必要です',
  'state.action_required.description': 'これは何かをしない限り継続できません。',
  'state.retry_scheduled.label': '再試行がスケジュールされています',
  'state.retry_scheduled.description':
    '試み{attempt}の{max}で実行されます{time}。何も重複しません。',
  'state.failed_permanently.label': '失敗した',
  'state.failed_permanently.description':
    'これは再試行されません。あなたのコンテンツは保存され、その理由は領収書に記載されています。',
  'state.canceled.label': 'キャンセル',
  'state.canceled.description': 'キャンセル者{actor}の上{date}。何も出版されていませんでした。',
  'state.deleted_externally.label': 'プラットフォーム上で削除されました',
  'state.deleted_externally.description':
    'この投稿はもう掲載されていません{provider}。レシートと、送信前に収集されたメトリクスが保存されます。',
  'state.approval.not_required.label': '承認は必要ありません',
  'state.approval.not_required.description':
    'これらのターゲットのポリシーには承認は必要ありません。',
  'state.approval.requested.label': 'リクエスト済み',
  'state.approval.requested.description': '送信先{approver}{relativeTime}。',
  'state.approval.in_review.label': 'レビュー中',
  'state.approval.in_review.description': '{approver}は今これを見ています。',
  'state.approval.approved.label': '承認された',
  'state.approval.approved.description': '承認者{approver}の上{date}。',
  'state.approval.changes_requested.label': '変更要求',
  'state.approval.changes_requested.description': '{approver}～に変更を求めた{date}。',
  'state.approval.rejected.label': '拒否されました',
  'state.approval.rejected.description': '拒否されました{approver}の上{date}。',
  'state.approval.expired.label': '期限切れ',
  'state.approval.expired.description':
    'このリクエストは次の日に期限切れになりました{date}決断もせずに。',
  'state.approval.withdrawn.label': '撤回されました',
  'state.approval.withdrawn.description': '著者はこのリクエストを取り下げました{date}。',
  'state.summary.targets':
    '{ready, plural, other {# 個のターゲットが準備完了}}、{blocked, plural, other {# ブロックされました}}',
  'state.changedAt': '変更されました{relativeTime}',
} as const;
