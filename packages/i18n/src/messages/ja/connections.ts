/** Japanese beta catalog. */
export const connectionMessages = {
  'connection.title': '接続',
  'connection.subtitle': 'このワークスペースが公開できるアカウント、ページ、およびチャネル。',
  'connection.add': 'アカウントを接続する',
  'connection.count': '{used, plural, other {# 個のアクティブなチャネル}}の{limit}',
  'connection.limitReached':
    'このワークスペースはすべてを使用しています{limit}チャンネル。もう一方を接続する前に、一方を切断してください。',
  'connection.account.label': 'アカウント',
  'connection.account.type.profile': 'プロフィール',
  'connection.account.type.page': 'ページ',
  'connection.account.type.channel': 'チャネル',
  'connection.account.type.group': 'グループ',
  'connection.account.type.organization': '組織',
  'connection.account.type.business': 'ビジネスアカウント',
  'connection.account.type.creator': 'クリエイターアカウント',
  'connection.connectedBy': 'によって接続されています{name}の上{date}',
  'connection.lastPublished': '最後に公開された{relativeTime}',
  'connection.lastPublishedNever': 'このアカウントからはまだ何も公開されていません',
  'connection.lastAnalyticsSync': '分析が同期されました{relativeTime}',
  'connection.status.healthy': '働く',
  'connection.status.expiringSoon': '有効期限が切れます{relativeTime}',
  'connection.status.expired': 'アクセス期限が切れました',
  'connection.status.revoked': 'アクセスが取り消されました',
  'connection.status.paused': '一時停止中',
  'connection.status.permissionMissing': '権限がありません',
  'connection.status.reviewPending': 'プラットフォームのレビュー待ち',
  'connection.status.unknown': '健康状態が利用できない',
  'connection.token.expiresAt': 'アクセスの有効期限が切れる{date}',
  'connection.token.expiryUnknown':
    '{provider}このアクセスの有効期限がいつ切れるかはわかりません。',
  'connection.permissions.title': '権限',
  'connection.permissions.granted': '付与された',
  'connection.permissions.missing': '付与されません',
  'connection.permissions.explainBeforeOAuth':
    'Relay は尋ねます{provider}これらの権限のために。いつでも切断できます。',
  'connection.permissions.whyNeeded': 'なぜこれが必要なのか',
  'connection.reconnect.title': '再接続{account}',
  'connection.reconnect.body':
    'このアカウントのスケジュールされた投稿は、再接続されるまで保留されます。何も失われません。',
  'connection.disconnect.title': '切断する{account}?',
  'connection.disconnect.body':
    'このアカウントの予約投稿は公開されません。すでに収集されたレシートと分析は、このワークスペースに残ります。',
  'connection.pause.body':
    '一時停止されたアカウントには履歴とスケジュールが保持されますが、再開するまで公開されません。',
  'connection.incident.invalidToken':
    '{provider}保存されたアクセスを拒否しました{account}。再接続して公開を復元します。',
  'connection.incident.permissionLost':
    '{account}付与されなくなりました{permission}。再接続してその許可を受け入れます。',
  'connection.incident.roleLost':
    'あなたの{provider}ユーザーには役割がなくなりました{account}。そのページの管理者に復元を依頼してください。',
  'connection.incident.accountTypeInvalid':
    'Instagram にはプロフェッショナル アカウントが必要です。スイッチ{account}ビジネス アカウントまたはクリエイター アカウントに接続してから、再接続します。',
  'connection.incident.reviewRestricted':
    '{provider}はこのアプリをレビュー保留中に制限しました。からの投稿{account}審査が完了するまで非公開で公開します。',
  'connection.group.title': '顧客グループ',
  'connection.group.description':
    'クライアントまたはプロジェクトごとにアカウントをグループ化し、すべての画面をフィルタリングします。',
  'connection.group.assign': 'グループに移動',
  'connection.group.none': 'グループ化されていない',
  'connection.group.moveNote': 'アカウントを移動しても、その投稿、領収書、分析は保持されます。',
  'connection.oauth.starting': 'オープニング{provider}',
  'connection.oauth.returned': '接続を終了する',
  'connection.oauth.chooseAccounts': '接続するアカウントを選択してください',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'これに関するアカウントはありません{provider}ログインすると接続できるようになります。{reason}',
  'connection.oauth.canceled': '接続がキャンセルされました{provider}。何も変わりませんでした。',
  'connection.oauth.alreadyConnected': '{account}はすでにこのワークスペースに接続されています。',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account}別のワークスペースに接続されています。まずはそこから外してください。',
  'capability.title': 'このアカウントがサポートしているもの',
  'capability.matrix.title': 'プラットフォームの機能',
  'capability.matrix.subtitle':
    '当社が保守および手作業でレビューしたコネクタ定義から生成されます。',
  'capability.level.supported': 'サポートされています',
  'capability.level.unsupported': 'プラットフォームによって提供されていない',
  'capability.level.not_implemented': 'まだ構築されていません',
  'capability.level.requires_review': 'プラットフォームのレビューが必要',
  'capability.level.beta': 'ベータ',
  'capability.level.unknown': '利用不可',
  'capability.explain.supported':
    'Relay は今日からこのアカウントに対してこれを行うことができます。',
  'capability.explain.unsupported':
    '{provider}はこれを公式 API を通じて提供していないため、これを安全に実行できるツールはありません。',
  'capability.explain.not_implemented':
    '{provider}はこれを提供していますが、Relay はまだそれを構築していません。これはコネクタのロードマップに記載されています。',
  'capability.explain.requires_review':
    '{provider}これは、アプリまたはアカウントをレビューした後にのみ許可されます。その審査が通るまでは利用できなくなります。',
  'capability.explain.beta':
    'これは機能しますが、制限はまだ検証が完了していません。信頼する前に結果を確認してください。',
  'capability.explain.unknown':
    'このアカウントの現在の権限を読み取ることができませんでした。再接続して更新します。',
  'capability.lastChecked': 'チェック済み{relativeTime}',
  'capability.feature.text': 'テキスト投稿',
  'capability.feature.image': '画像',
  'capability.feature.carousel': 'カルーセル',
  'capability.feature.video': 'ビデオ',
  'capability.feature.document': '書類',
  'capability.feature.firstComment': '予定されている最初のコメント',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'ネイティブメンション',
  'capability.feature.destinations': '目的地の選択',
  'capability.feature.privacy': 'プライバシー管理',
  'capability.feature.thumbnail': 'カスタムサムネイル',
  'capability.feature.altText': '代替テキスト',
  'capability.feature.analytics': '分析',
  'capability.feature.delete': '公開された投稿を削除する',
  'capability.feature.commentCount': 'コメント数',
  'capability.feature.commentReplies': 'コメントを読んで返信する',
  'capability.feature.disclosure': '自動化の開示',
} as const;
