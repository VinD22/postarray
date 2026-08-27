/** Japanese beta catalog. */
export const errorMessages = {
  'error.unknown.message': '何か問題が発生したため、分類できませんでした。',
  'error.unknown.action':
    'もう一度やり直してください。引き続き発生する場合は、以下の参照情報を送信してください。',
  'error.internal.message': 'これは私たち側の問題であり、コンテンツの問題ではありません。',
  'error.internal.action':
    '作業内容が保存されます。警告を受けています。数分後にもう一度試してください。',
  'error.not_implemented.message': 'Post Array はこれをまだ構築していません。',
  'error.not_implemented.action': '出荷時については変更ログに従ってください。',
  'error.offline.message': 'あなたはオフラインです。',
  'error.offline.action':
    '下書きはこのデバイスに保存されます。接続が戻ると、パブリッシュとスケジュールが再開されます。',
  'error.network_unreachable.message': 'サーバーに到達できませんでした。',
  'error.network_unreachable.action':
    '接続を確認して、もう一度試してください。何も失われませんでした。',
  'error.request_invalid.message':
    'リクエストは私たちが受け入れることができる形ではありませんでした。',
  'error.request_invalid.action': '以下のフィールドを確認して、再度送信してください。',
  'error.validation_failed.message': '一部のフィールドは保存する前に変更する必要があります。',
  'error.validation_failed.action': '強調表示されたフィールドを修正します。',
  'error.unauthenticated.message': 'これを行うにはサインインする必要があります。',
  'error.unauthenticated.action': 'サインインすると、ここに戻ります。',
  'error.session_expired.message': 'セッションの有効期限が切れました。',
  'error.session_expired.action': '再度サインインします。下書きが保存されました。',
  'error.mfa_required.message': 'このアクションには 2 つの要素の確認が必要です。',
  'error.mfa_required.action': '続行するには、認証アプリで確認してください。',
  'error.forbidden.message': 'あなたの役割ではこのアクションは許可されていません。',
  'error.forbidden.action':
    'このワークスペースの所有者または管理者にアクセス権を依頼してください。',
  'error.insufficient_scope.message': 'この資格情報にはスコープがありません{scope}。',
  'error.insufficient_scope.action':
    'そのスコープを付与するか、すでにそのスコープを持っている資格情報を使用します。',
  'error.workspace_not_found.message': 'そのワークスペースが存在しないか、メンバーではありません。',
  'error.workspace_not_found.action': '所属するワークスペースを選択してください。',
  'error.workspace_suspended.message': 'このワークスペースは一時停止されています。',
  'error.workspace_suspended.action':
    '解決するにはサポートにお問い合わせください。データはそのままです。',
  'error.not_found.message': 'そのアイテムはもう存在しません。',
  'error.not_found.action': '削除された可能性があります。戻ってリストを更新します。',
  'error.conflict.message': 'あなたが作業している間に、他の誰かがこれを変更しました。',
  'error.conflict.action': '両方のバージョンを確認して、再度保存します。',
  'error.idempotency_key_reused.message':
    'この冪等性キーは別のリクエストですでに使用されています。',
  'error.idempotency_key_reused.action':
    '新しいキーを使用するか、元のリクエストを正確に繰り返してください。',
  'error.rate_limited.message': 'リクエストが多すぎます。',
  'error.rate_limited.action': '後でもう一度試してください{time}。',
  'error.quota_exceeded.message': 'このアクションは現在の期間の制限を超えています。',
  'error.quota_exceeded.action': '制限がリセットされる{relativeTime}。',
  'error.payment_required.message':
    'このワークスペースにはアクティブなサブスクリプションがありません。',
  'error.payment_required.action':
    'サブスクリプションを開始して再度公開します。何も削除されません。',
  'error.subscription_past_due.message': '最後の支払いが完了しませんでした。',
  'error.subscription_past_due.action': 'Polar ポータルで支払い方法を更新します。',
  'error.trial_expired.message': '裁判は次の日に終了しました{date}。',
  'error.trial_expired.action': '公開を続けるには購読を開始してください。',
  'error.post_credits_exhausted.message':
    'このワークスペースは無料の投稿をすべて使い切りました。ほかの機能はこれまでどおり使えます。',
  'error.post_credits_exhausted.action':
    '公開を続けるにはプランを選んでください。アカウントの接続は維持され、下書きと予約もそのまま残ります。',
  'error.entitlement_missing.message': 'このワークスペースはその機能にアクセスできません。',
  'error.entitlement_missing.action': '課金設定を確認するか、サポートにお問い合わせください。',
  'error.channel_limit_reached.message':
    'このワークスペースはすでにすべてを使用しています{limit}アクティブなチャンネル。',
  'error.channel_limit_reached.action': '別のチャネルを接続する前にチャネルを切断してください。',
  'error.connection_not_found.message': 'その接続はこのワークスペースには存在しません。',
  'error.connection_not_found.action':
    'アカウントへの公開を続けるには、アカウントを再度接続します。',
  'error.connection_revoked.message': '{account}にアクセスが取り消されました{provider}。',
  'error.connection_revoked.action': 'アカウントを再接続します。その後、予約投稿が再開されます。',
  'error.connection_expired.message': 'アクセス{account}期限切れ。',
  'error.connection_expired.action': 'アカウントを再接続して公開と分析を復元します。',
  'error.connection_paused.message': '{account}一時停止中です。',
  'error.connection_paused.action': '準備ができたら、接続から再開します。',
  'error.connection_permission_missing.message':
    '{account}これを行うために必要な許可を与えていません。',
  'error.connection_permission_missing.action': '再接続して受け入れる{permission}同意画面にて。',
  'error.connection_account_type_invalid.message':
    'Instagram にはプロフェッショナル アカウントが必要です。{account}個人アカウントです。',
  'error.connection_account_type_invalid.action':
    'Instagram アプリでビジネス アカウントまたはクリエイター アカウントに切り替えて、再接続します。',
  'error.connection_review_pending.message':
    '{provider}このアプリをまだレビューしています{account}。',
  'error.connection_review_pending.action':
    '投稿は審査に合格するまで非公開で公開されます。このページに変更があった場合は更新します。',
  'error.capability_unsupported.message': '{provider}はこれを公式 API を通じて提供していません。',
  'error.capability_unsupported.action': 'このアカウントがサポートする形式を使用してください。',
  'error.capability_not_implemented.message': 'Post Array はこれをビルドしていません{provider}まだ。',
  'error.capability_not_implemented.action':
    '機能ページには、各コネクタが現在実行できる機能がリストされています。',
  'error.capability_requires_review.message':
    '{provider}これは、アプリまたはアカウントをレビューした後にのみ許可されます。',
  'error.capability_requires_review.action': 'その審査が通るまでは利用できなくなります。',
  'error.content_invalid.message': '{provider}このコンテンツは受け入れられません{account}。',
  'error.content_invalid.action':
    '課題はターゲットにリストされています。修正して再試行してください。',
  'error.content_changed_after_approval.message': 'この投稿は承認後に変更されました。',
  'error.content_changed_after_approval.action': '公開する前に再度承認をリクエストしてください。',
  'error.duplicate_content.message':
    '非常によく似たコンテンツが公開されました{account}{relativeTime}。',
  'error.duplicate_content.action':
    'テキストを変更するか、後で公開します。プラットフォームは重複投稿を制限します。',
  'error.cadence_limit_reached.message':
    '{account}このワークスペースに設定された投稿頻度に達しました。',
  'error.cadence_limit_reached.action':
    'これを後のスロットにスケジュールするか、ケイデンスの制限を上げます。',
  'error.media_invalid.message': 'このファイルは公開できません{provider}。',
  'error.media_invalid.action': '正確な制限はファイルの横に表示されます。',
  'error.media_too_large.message': 'このファイルは次のサイズより大きいです{provider}受け入れます。',
  'error.media_too_large.action':
    '圧縮するか、より小さいバージョンをアップロードしてください。原本は保管されています。',
  'error.media_processing_failed.message': 'このファイルを準備できませんでした{provider}。',
  'error.media_processing_failed.action':
    'もう一度アップロードするか、別の形式を使用してください。',
  'error.media_rights_undeclared.message': 'このメディアには権利宣言がありません。',
  'error.media_rights_undeclared.action':
    '公開する権利があることを確認してください (公開する人も含めて)。',
  'error.alt_text_required.message': 'この画像には代替テキストが必要です{provider}。',
  'error.alt_text_required.action': '画像について説明するか、装飾としてマークを付けます。',
  'error.approval_required.message': 'このワークスペースは公開する前に承認が必要です。',
  'error.approval_required.action': '～からの承認をリクエストする{approver}。',
  'error.approval_expired.message': 'この投稿の承認は次の日に期限切れになりました{date}。',
  'error.approval_expired.action': '再度承認を要求してください。',
  'error.schedule_in_past.message': 'そんな時代はもう過ぎ去った{timeZone}。',
  'error.schedule_in_past.action': '後で公開するか、今すぐ公開するかを選択してください。',
  'error.schedule_conflict.message': '{account}すでに投稿が含まれています{duration}今回の。',
  'error.schedule_conflict.action':
    'そのうちの 1 つを移動するか、その間隔が意図されている場合は続行します。',
  'error.time_zone_invalid.message': 'タイムゾーンがわかりません{timeZone}。',
  'error.time_zone_invalid.action': 'リストからゾーンを選択します。',
  'error.destination_unavailable.message':
    '目的地{destination}では利用できなくなりました{provider}。',
  'error.destination_unavailable.action': '宛先リストを更新し、別の宛先を選択します。',
  'error.mention_unresolved.message': '言及は実際のものと一致していません{provider}アカウント。',
  'error.mention_unresolved.action':
    'アカウントを検索して選択するか、メンションを削除します。偽のネイティブタグを公開することはありません。',
  'error.provider_transient.message': '{provider}現在これを処理できませんでした。',
  'error.provider_transient.action': '自動的に再試行されます。何も重複しません。',
  'error.provider_permanent.message': '{provider}はこれを拒否し、再試行を受け入れません。',
  'error.provider_permanent.action': 'サニタイズされた応答は領収書に記載されています。',
  'error.provider_rate_limited.message': '{provider}このワークスペースのレートは制限されています。',
  'error.provider_rate_limited.action': '後で再試行します{time}。',
  'error.provider_unavailable.message': '{provider}応答していません。',
  'error.provider_unavailable.action':
    'ステータスページを確認してください。スケジュールされた投稿は再試行され続けます。',
  'error.provider_content_rejected.message':
    '{provider}は独自のポリシーに基づいてこのコンテンツを拒否しました。',
  'error.provider_content_rejected.action':
    '理由は領収書に書いてあります。コンテンツを編集するか、次の方法で異議を申し立ててください{provider}。',
  'error.user_action_required.message': '{account}公開する前に、あなたからの何かが必要です。',
  'error.user_action_required.action': '接続を開いて、何が不足しているかを確認します。',
  'error.short_link_destination_blocked.message': 'その目的地を短縮することはできません。',
  'error.short_link_destination_blocked.action':
    'プライベート ネットワーク、安全でないスキーム、および既知の不正な宛先はブロックされます。',
  'error.short_link_domain_unverified.message': 'ドメイン{domain}まだ検証されていません。',
  'error.short_link_domain_unverified.action':
    '設定に表示されている DNS レコードを追加し、確認します。',
  'error.rss_feed_invalid.message':
    'その URL は有効な RSS フィードまたは Atom フィードを返しませんでした。',
  'error.rss_feed_invalid.action':
    '住所を確認してください。安全に取得し、プライベート リダイレクトに従いません。',
  'error.webhook_signature_invalid.message': 'その Webhook の署名は検証されませんでした。',
  'error.webhook_signature_invalid.action':
    '送信者が現在の署名シークレットを使用していることを確認してください。ペイロードは処理されませんでした。',
  'error.webhook_delivery_failed.message': '配送先{endpoint}失敗した。',
  'error.webhook_delivery_failed.action': 'バックオフで再試行します。配信ログに応答があります。',
  'error.automation_rule_not_permitted.message':
    'このルールはプラットフォーム ルールに違反するため、作成できません。',
  'error.automation_rule_not_permitted.action':
    '自動いいね、フォロー、一方的な返信、重複した大量投稿は決して利用できません。',
  'error.ai_unavailable.message': 'ライティング アシスタントは現在利用できません。',
  'error.ai_unavailable.action':
    'あなたのテキストはそのままです。しばらくしてからもう一度お試しください。',
  'error.ai_output_invalid.message': 'アシスタントは検証できないものを返しました。',
  'error.ai_output_invalid.action':
    'ドラフトには何も適用されませんでした。もう一度やり直してください。',
  'error.ai_budget_exceeded.message':
    '現時点では、このワークスペースはアシスタントの制限に達しました。',
  'error.ai_budget_exceeded.action':
    '制限がリセットされる{relativeTime}。手書きでもまだ機能します。',
  'error.storage_unavailable.message': 'メディア ストレージにアクセスできませんでした。',
  'error.storage_unavailable.action':
    'テキストが保存されます。しばらくしてからアップロードを再試行してください。',
  'error.export_unavailable.message': 'その輸出品は生産できませんでした。',
  'error.export_unavailable.action':
    '範囲を狭くして試すか、サポートに問い合わせて参照してください。',
  'error.reference': '参照{correlationId}',
  'error.reportToSupport': 'これをサポートに送信してください',
  'error.contentPreserved': 'コンテンツは保存されます。何も出版されていませんでした。',
} as const;
