/** Japanese beta catalog. */
export const analyticsMessages = {
  'analytics.title': '分析',
  'analytics.subtitle':
    '何が起こったのか、それがどれほど新鮮なのか、そして次に何をテストする価値があるのか​​。',
  'analytics.range.7d': '過去 7 日間',
  'analytics.range.30d': '過去 30 日間',
  'analytics.range.90d': '過去90日間',
  'analytics.range.custom': 'カスタム範囲',
  'analytics.range.limitedByProvider':
    '{provider}せいぜい戻ってくる{days, plural, other {# 日}}このアカウントの履歴。',
  'analytics.account.select': 'アカウントを選択してください',
  'analytics.compareTo': 'と比較して{baseline}',
  'analytics.baseline.trailingMedian': '前回の中央値{count, plural, other {# 件の比較可能な投稿}}',
  'analytics.metric.followers': 'フォロワー',
  'analytics.metric.subscribers': '購読者',
  'analytics.metric.profileViews': '縦断ビュー',
  'analytics.metric.impressions': '感想',
  'analytics.metric.reach': '到着',
  'analytics.metric.views': 'ビュー',
  'analytics.metric.videoViews': 'ビデオの再生回数',
  'analytics.metric.watchTime': '視聴時間',
  'analytics.metric.averageViewDuration': '平均視聴時間',
  'analytics.metric.averageViewPercentage': '平均視聴率',
  'analytics.metric.likes': 'いいねとリアクション',
  'analytics.metric.comments': 'コメントと返信',
  'analytics.metric.shares': '共有、再投稿、引用',
  'analytics.metric.saves': '保存とブックマーク',
  'analytics.metric.linkClicks': 'リンクのクリック数',
  'analytics.metric.clickThroughRate': 'クリックスルー率',
  'analytics.metric.engagementRate': 'エンゲージメント率',
  'analytics.metric.publishedCount': '公開された投稿',
  'analytics.metric.followerChange': 'フォロワーの変更',
  'analytics.definition.title': 'どうやって{metric}定義されています',
  'analytics.definition.provider': '報告者{provider}として{providerField}。',
  'analytics.definition.denominator.label': '分母：{denominator}。',
  'analytics.definition.unit': 'ユニット：{unit}。',
  'analytics.definition.normalized':
    'プロバイダーの値から正規化されます。生の値が保持され、利用可能になります。',
  'analytics.definition.notComparable':
    '{provider}そして{otherProvider}これを別の方法で定義します。注意して比較してください。',
  'analytics.value.unavailable': '利用不可',
  'analytics.value.unavailableReason.permission':
    'このアカウントは、このメトリクスに必要な権限を付与していません。',
  'analytics.value.unavailableReason.unsupported': '{provider}この指標は報告されません。',
  'analytics.value.unavailableReason.tooEarly':
    '{provider}この指標は後で公開します。後でもう一度確認してください{time}。',
  'analytics.value.unavailableReason.syncFailed':
    '最後の同期は失敗しました。再試行中のため、推定数値は表示されません。',
  'analytics.freshness.synced': '同期済み{relativeTime}',
  'analytics.freshness.stale': '最後に成功した同期{relativeTime}。これは古い可能性があります。',
  'analytics.freshness.coverage':
    '{covered}の{total}この範囲の投稿には現在のデータが含まれています。',
  'analytics.feedback.title': 'これが示唆すること',
  'analytics.feedback.aboveBaseline':
    'この投稿が届きました{percent}もっと{metric}よりも{baseline}。',
  'analytics.feedback.belowBaseline':
    'この投稿が届きました{percent}少ない{metric}よりも{baseline}。',
  'analytics.feedback.notComparableFormats':
    'ここでは画像投稿と動画投稿を直接比較することはできません。',
  'analytics.feedback.smallSample':
    'サンプルは少ないです。結論を出す前に、同じフックをもう一度テストしてください。',
  'analytics.feedback.association':
    '最初のコメントの遅延が から変更された後、コメントが増加しました。{before}に{after}。これは関連性であり、原因の証明ではありません。',
  'analytics.feedback.nextTest': '次に何をテストするか',
  'analytics.feedback.doNotInfer': 'これで分からないこと',
  'analytics.feedback.noScore':
    'ここには単一のクロスプラットフォームスコアはありません。信頼できる定義を持つメトリクスを選択してください。',
  'analytics.experiment.title': '実験',
  'analytics.experiment.hypothesis': '仮説',
  'analytics.experiment.variants': 'バリエーション',
  'analytics.experiment.successMetric': '成功指標',
  'analytics.experiment.window': '測定ウィンドウ',
  'analytics.experiment.status.running': 'まで実行中{date}',
  'analytics.experiment.status.complete': '完了',
  'analytics.experiment.tagBeforePublishing':
    '公開する前に実験にタグを付けて、事後的に比較が行われないようにします。',
  'analytics.experiment.caveats': '注意事項',
  'analytics.export.title': '輸出',
  'analytics.export.csv': 'CSVをダウンロード',
  'analytics.export.json': 'JSONをダウンロード',
  'analytics.export.providerRestriction':
    '{provider}データの結合または保存方法を制限します。一部のフィールドは含まれていません。',
  'analytics.links.title': '追跡されたリンク',
  'analytics.links.subtitle':
    'ファーストパーティのリダイレクト測定。これらは、リンクをクリックしたプラットフォームのレポートとは別のシリーズです。',
  'analytics.links.destination': '行き先',
  'analytics.links.shortUrl': '短縮URL',
  'analytics.links.totalRequests': 'リクエストの合計',
  'analytics.links.humanClicks': '重複排除されたクリック数',
  'analytics.links.suspectedBots': '疑わしいボット',
  'analytics.links.referrerClass': '参照元',
  'analytics.links.deviceClass': 'デバイス',
  'analytics.links.country': '国',
  'analytics.links.lastEvent': 'ラストクリック{relativeTime}',
  'analytics.links.privacyNote':
    '大まかな位置とデバイス クラスのみを保持します。生の IP アドレスは、悪用や重複検出のために一時的に保存され、その後破棄されます。',
  'analytics.links.separateSources':
    'これらのクリック数をプラットフォームが報告する数値に加算しないでください。彼らはさまざまなものを数えます。',
} as const;
