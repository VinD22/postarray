/** Japanese beta translations for the weekly digest and its email. */
export const digestMessages = {
  'digest.title': '今週',
  'digest.subtitle': '{windowStart}から{windowEnd}までに確認できる内容です。',
  'digest.empty': '今週はまだ要約するものがありません。何かを公開すると、ここに表示されます。',
  'digest.regenerate': '今週を再作成',
  'digest.generating': '今週の概要を作成しています',
  'digest.source.deterministic':
    '公開記録と独自の測定値だけをもとに、文章アシスタントを使わずに作成しています。',
  'digest.source.ai':
    '独自の記録をもとにアシスタントが作成しました。すべての数値は記録と照合済みです。',
  'digest.unavailable.aiOff':
    '文章アシスタントがオフのため、これは通常版です。欠けている情報はありません。',
  'digest.unavailable.rejected':
    'アシスタント版はデータと一致しなかったため破棄されました。これは通常版です。',
  'digest.headline.published':
    '{published, plural, =0 {完了した投稿はありません} one {#件の投稿が完了しました} other {#件の投稿が完了しました}}。期間は{windowStart}から{windowEnd}です。',
  'digest.headline.nothingPublished': '{windowStart}から{windowEnd}の間に公開されたものはありません。',
  'digest.outcome.published':
    '{count, plural, one {プラットフォーム {provider}で#件の投稿が完了しました} other {プラットフォーム {provider}で#件の投稿が完了しました}}。',
  'digest.outcome.partial':
    '{count, plural, one {プラットフォーム {provider}で#件の投稿は一部の宛先に届き、他の宛先には届きませんでした} other {プラットフォーム {provider}で#件の投稿は一部の宛先に届き、他の宛先には届きませんでした}}。',
  'digest.outcome.failed':
    '{count, plural, one {プラットフォーム {provider}で#件の投稿を公開できませんでした} other {プラットフォーム {provider}で#件の投稿を公開できませんでした}}。',
  'digest.metrics.noneYet':
    '今週の測定値はまだ届いていません。これは投稿の成果が悪かったという意味ではなく、成果がまだ分からないという意味です。',
  'digest.freshness.statement':
    '{label, select, fresh {測定値は{lastObservedAt}に最後に同期されました。} stale {測定値は{lastObservedAt}以降同期されていないため、上の数値は古い可能性があります。} other {まだ何も同期されていないため、上には測定値がありません。}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': '知っておきたいこと: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': '週次サマリーのメール',
  'digest.settings.description':
    '公開された内容と測定できた内容を知らせる短いメールを毎週送ります。初期設定ではオンです。',
  'digest.settings.enabled': '週次サマリーを送信する',
  'email.digest.subject': '{workspaceName}の今週',
  'email.digest.intro':
    '{windowStart}から{windowEnd}までの{workspaceName}について確認できる内容です。',
  'email.digest.noData':
    '今週は何も測定できませんでした。数値がないのは、0だったからではなく読み取れなかったからです。',
  'email.digest.footer':
    '{workspaceName}で週次サマリーがオンになっているため、このメールが届いています。ワークスペース設定でオフにできます。',
} as const;
