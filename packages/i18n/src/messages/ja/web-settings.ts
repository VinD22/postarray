/** Japanese beta catalog. */
export const webSettingsMessages = {
  'settings.ui.subtitle':
    'このワークスペースを構成するすべてのもの。ここには何も公開されていません。',
  'settings.ui.nav.label': '設定セクション',
  'settings.ui.index.help':
    'セクションを選択します。すべての変更はユーザーによるものであり、監査ログに記録されます。',
  'settings.ui.section.members': 'メンバーと役割',
  'settings.ui.section.membersSummary': 'このワークスペースには誰がいて、各人が何ができるのか。',
  'settings.ui.section.projects': 'ブランド',
  'settings.ui.section.projectsSummary':
    '音声、視聴者、承認された申し立て、ブロックされた用語、ロケール ルール、ドメイン、用語集。',
  'settings.ui.section.agents': 'エージェントとAPI',
  'settings.ui.section.agentsSummary':
    'サービス アカウント、スコープ、制限、資格情報、アクティビティ、およびドライ ラン プレイグラウンド。',
  'settings.ui.section.apps': '開発者向けアプリ',
  'settings.ui.section.appsSummary':
    'サードパーティの OAuth アプリケーション、リダイレクト許可リスト、同意および許可。',
  'settings.ui.section.webhooks': 'Webhook',
  'settings.ui.section.webhooksSummary':
    '署名付きアウトバウンドイベント、配信ログ、再配信、およびシークレットローテーション。',
  'settings.ui.section.billing': '請求する',
  'settings.ui.section.billingSummary':
    'プラン、トライアル、間隔、従量制プロバイダーの使用量、請求書、キャンセル。',
  'settings.ui.section.referrals': '紹介とアフィリエイト',
  'settings.ui.section.referralsSummary':
    '開示された紹介リンク、帰属されたサインアップ、およびコミッションステータス。',
  'settings.ui.section.localization': 'ローカリゼーション',
  'settings.ui.section.localizationSummary':
    'インターフェイス言語、コンテンツ言語、市場、タイムゾーン、および時間形式。',
  'settings.ui.section.security': '安全',
  'settings.ui.section.securitySummary':
    'セッション、2 要素認証、資格情報、エージェント、Webhook、アプリの許可。',
  'settings.ui.section.data': 'データ管理',
  'settings.ui.section.dataSummary':
    'エクスポート、接続の取り消し、ブランドの削除、コンテンツの削除、またはアカウントの閉鎖を行います。',
  'settings.ui.state.loading': '読み込み中{section}',
  'settings.ui.state.errorTitle': 'ロードできませんでした{section}',
  'settings.ui.state.errorRetry': 'もう一度やり直してください',
  'settings.ui.state.savingAnnouncement': '保存{section}',
  'settings.ui.state.savedAnnouncement': '{section}保存されました',
  'settings.ui.state.saveFailedAnnouncement':
    '{section}保存されませんでした。あなたの意見はまだここにあります。',
  'settings.ui.state.offlineTitle': 'あなたはオフラインです',
  'settings.ui.state.offlineBody':
    'このページを読むことができます。接続が戻るまで、変更は保存できません。',
  'settings.ui.state.permissionTitle': 'にアクセスできません{section}',
  'settings.ui.state.permissionBody':
    'このセクションではワークスペースの動作が変更されるため、役割によって制限されます。',
  'settings.ui.state.permissionRequirements': '必要なもの',
  'settings.ui.state.permissionContact':
    'このワークスペースの所有者または管理者がそれを付与できます。これらは「メンバーと役割」の下にリストされています。',
  'settings.ui.state.rateLimitTitle': '短期間に変化が多すぎる',
  'settings.ui.state.rateLimitCause': 'このワークスペースは設定変更の書き込み制限に達しました。',
  'settings.ui.state.rateLimitReset': 'リミットリセット',
  'settings.ui.state.rateLimitAlternative':
    '保存したものは何も失われませんでした。読み取り専用アクションは待機中も機能します。',
  'settings.ui.state.rateLimitUsage': '設定はこの時間を書き込みます',
  'settings.ui.state.rateLimitUsageText': '{used}の{limit}使用済み',
  'settings.ui.state.unsavedTitle': '未保存の変更があります',
  'settings.ui.state.unsavedBody': 'このセクションを終了する前に、これらを保存してください。',
  'settings.ui.state.readOnlyTitle': 'このワークスペースは読み取り専用です',
  'settings.ui.state.readOnlyBody':
    '請求の期限が過ぎています。コンテンツ、領収書、接続はそのままです。設定を読み取ることはできますが、変更することはできません。',
  'settings.ui.state.referenceLabel': 'サポートリファレンス',
  'settings.ui.attribution': '変更者{name}{relativeTime}',
  'settings.ui.attributionNever': '作成時から変更されていません',
  'settings.ui.copyFailed':
    'ブラウザがコピーをブロックしました。テキストを選択して手動でコピーします。',
  'settings.ui.members.description':
    'すべての招待、役割の変更、および削除は、名前と時刻とともに記録されます。',
  'settings.ui.members.tableCaption': 'このワークスペース内のメンバーと役割と範囲',
  'settings.ui.members.column.person': '人',
  'settings.ui.members.column.role': '役割',
  'settings.ui.members.column.scope': '範囲',
  'settings.ui.members.column.approvals': '承認',
  'settings.ui.members.column.lastActive': '最後にアクティブだった',
  'settings.ui.members.column.actions': 'アクション',
  'settings.ui.members.scopeAll': 'すべてのブランドとアカウント',
  'settings.ui.members.scopeLimited': '{count, plural, other {# ブランド}}:{names}',
  'settings.ui.members.approvals.canApprove': '承認できる',
  'settings.ui.members.approvals.cannotApprove': '承認できません',
  'settings.ui.members.approvals.canApproveOwnProjects': 'リストされているブランドを承認できます',
  'settings.ui.members.lastActiveNever': 'まだサインインしていません',
  'settings.ui.members.changeRole': 'の役割を変更する{name}',
  'settings.ui.members.remove': '取り除く{name}',
  'settings.ui.members.lastOwnerTitle': 'ワークスペースには少なくとも 1 人の所有者が保持されます',
  'settings.ui.members.lastOwnerBody':
    'まず他の人を所有者にしてから、この変更が利用可能になります。',
  'settings.ui.members.inviteTitle': '誰かをこのワークスペースに招待する',
  'settings.ui.members.inviteBody':
    'リンクが記載された電子メールを受信します。招待は 7 日後に期限切れになり、それまでに取り消すことができます。',
  'settings.ui.members.inviteRole': '役割',
  'settings.ui.members.inviteScope': '彼らが働けるブランド',
  'settings.ui.members.inviteScopeAll': 'このワークスペース内のすべてのブランド',
  'settings.ui.members.inviteScopeSelected': '私が選んだブランドのみ',
  'settings.ui.members.inviteApprovals': '承認リクエストを決定できる',
  'settings.ui.members.inviteApprovalsHelp':
    'すでにレビューが含まれているロールのみにこれを与えることができます。編集とは別です。',
  'settings.ui.members.inviteSubmit': '招待状を送信する',
  'settings.ui.members.invitePending': '招待されました{relativeTime}による{name}',
  'settings.ui.members.inviteRevoke': '招待を取り消す',
  'settings.ui.members.inviteResend': '招待状をもう一度送信します',
  'settings.ui.members.emptyTitle': 'ここにいるのはあなただけです',
  'settings.ui.members.emptyBody':
    '結果を書いたり、承認したり、読んだりする人を招待します。それぞれに役割とブランドの範囲が与えられます。',
  'settings.ui.members.emptyExample':
    '一般的な形式: 請求担当者が 1 名、ブランドごとに承認者が 1 名、下書きはするが公開しない編集者。',
  'settings.ui.members.roleReferenceTitle': 'それぞれの役割でできること',
  'settings.ui.members.roleReferenceCaption': '役割とそれぞれに許可されるアクション',
  'settings.ui.members.roleColumn.role': '役割',
  'settings.ui.members.roleColumn.can': 'できる',
  'settings.ui.members.roleColumn.cannot': 'できない',
  'settings.ui.members.roleCannot.owner': '所有者に何も差し控えられることはありません。',
  'settings.ui.members.roleCannot.admin': '請求を変更するか、ワークスペースを削除します。',
  'settings.ui.members.roleCannot.manager':
    '請求、ロール、またはワークスペースの削除を変更します。',
  'settings.ui.members.roleCannot.editor': '接続を承認、スケジュール、公開、または変更します。',
  'settings.ui.members.roleCannot.approver': '接続、ルール、または請求を変更します。',
  'settings.ui.members.roleCannot.analyst': '何かを作成、編集、承認、または公開します。',
  'settings.ui.members.roleCannot.viewer': '何もかも変えてください。',
  'settings.ui.members.removeTitle': '取り除く{name}このワークスペースから',
  'settings.ui.members.removeConsequence.access': 'あらゆる面で即座にアクセスできなくなります。',
  'settings.ui.members.removeConsequence.drafts':
    '彼らが書いた下書きはワークスペースに残り、編集可能なままになります。',
  'settings.ui.members.removeConsequence.audit': '彼らの過去の行動は監査ログと領収書に残ります。',
  'settings.ui.members.removeConsequence.approvals':
    '待機中の承認リクエストは、別の承認者のキューに戻ります。',
  'settings.ui.projects.description':
    'ブランドには、主張して​​よいこと、言ってはいけないこと、各言語の書き方など、コンテンツをチェックするためのルールが定められています。',
  'settings.ui.projects.listCaption': 'このワークスペースのブランド',
  'settings.ui.projects.column.project': 'Project',
  'settings.ui.projects.column.locales': 'コンテンツ言語',
  'settings.ui.projects.column.accounts': 'アカウント',
  'settings.ui.projects.column.updated': '更新されました',
  'settings.ui.projects.accountCount': '{count, plural, other {# アカウント}}',
  'settings.ui.projects.emptyTitle': 'まだブランドはありません',
  'settings.ui.projects.emptyBody':
    'ブランドは、アカウント、承認ルール、および言語ルールをグループ化します。ほとんどのチームは 1 つから始めて、クライアントや市場が異なるルールを必要とする場合に 2 つ目を追加します。',
  'settings.ui.projects.emptyExample':
    '例: ブランド「Acme EU」、言語英語とドイツ語、ブロックされた用語「保証」、Instagram の開示「有料パートナーシップ」。',
  'settings.ui.projects.voiceHelp':
    'このブランドがどう聞こえるか。リライトを要求する場合やクレームをチェックする場合に使用されます。',
  'settings.ui.projects.audienceHelp': '市場ごとのコンテンツの対象者。',
  'settings.ui.projects.approvedClaimsHelp':
    '査読者がクリアしたステートメント。このリスト以外のものには、公開後ではなく、承認前にフラグが立てられます。',
  'settings.ui.projects.blockedTermsHelp': 'このブランドのスケジュールを妨げる単語。 1 行に 1 つ。',
  'settings.ui.projects.domainsHelp':
    'このブランドがリンクしたり短縮したりできるドメイン。 Composer では検証済みのドメインのみを選択できます。',
  'settings.ui.projects.domainVerified': '確認済み{date}',
  'settings.ui.projects.domainPending': 'DNS レコードがまだ表示されていません',
  'settings.ui.projects.disclosureHelp':
    'ここで選択したプラットフォームのコンポーザーにデフォルトで適用されます。承認前に投稿ごとに変更できます。',
  'settings.ui.projects.glossaryHelp':
    '製品名、法律用語など、翻訳後も変更せずに存続する必要があるもの。',
  'settings.ui.projects.glossaryCaption': '保護された用語と言語ごとの各用語の処理方法',
  'settings.ui.projects.glossaryEmpty':
    '保護された用語はまだありません。翻訳または言い換えが禁止されている製品名と法律用語を追加します。',
  'settings.ui.projects.localeRulesHelp':
    'コンテンツ言語ごとのルール。これらは、適応または再作成するときに適用され、レビュー担当者に表示されます。',
  'settings.ui.projects.saveProject': 'ブランドを保存',
  'settings.ui.localization.description':
    '3 つの個別の設定: このアプリの言語、公開する言語、および執筆対象の市場。 1 つを変更しても、もう 1 つが変わることはありません。',
  'settings.ui.localization.interfaceOnlyEnglish':
    'このアプリのインターフェース言語を選択します。コンテンツ言語は個別に用意されており、すでに利用可能です。',
  'settings.ui.localization.marketHelp':
    '市場は例、法的開示、行動喚起を変えます。投稿の言語は変更されません。',
  'settings.ui.localization.previewTitle': '日付と数字の読み方',
  'settings.ui.localization.previewDate': '日付',
  'settings.ui.localization.previewTime': '時間',
  'settings.ui.localization.previewNumber': '番号',
  'settings.ui.localization.previewCurrency': '通貨',
  'settings.ui.localization.weekStartHelp': 'カレンダー週ビューで使用されます。',
  'settings.ui.security.description':
    'このワークスペースで動作できるすべてのもの (セッション、資格情報、エージェント、Webhook、アクセスを許可したアプリ) が 1 か所にまとめられています。',
  'settings.ui.security.sessionsCaption': 'アカウントのサインインセッション',
  'settings.ui.security.sessionColumn.device': 'デバイスとブラウザ',
  'settings.ui.security.sessionColumn.location': 'おおよその位置',
  'settings.ui.security.sessionColumn.lastSeen': '最後に使用した',
  'settings.ui.security.sessionCurrent': 'このセッション',
  'settings.ui.security.sessionRevokeAll': '1 セッションおきにサインアウトする',
  'settings.ui.security.sessionLocationUnknown': '位置が記録されていない',
  'settings.ui.security.mfaOn': '二要素認証がオンになっています',
  'settings.ui.security.mfaOff': '二要素認証がオフになっています',
  'settings.ui.security.mfaBody':
    '2 番目の要素は、請求の変更、サービス アカウントの作成、アカウントの再接続、資格情報の取り消しの前に必要です。',
  'settings.ui.security.credentialsTitle': 'APIキー',
  'settings.ui.security.credentialsBody':
    'このワークスペースが所有するキー。これらは、アプリの許可や独自のセッションとは別のものです。',
  'settings.ui.security.agentsTitle': 'サービスアカウント',
  'settings.ui.security.webhooksTitle': 'Webhook エンドポイント',
  'settings.ui.security.grantsTitle': '許可したアプリ',
  'settings.ui.security.grantsBody':
    'アプリを取り消すと、そのトークンがすぐに停止されます。あなた自身の接続とスケジュールされた投稿は影響を受けません。',
  'settings.ui.security.grantScopes': '付与された権限',
  'settings.ui.security.socialPermissionsTitle': 'ソーシャルアカウントの権限',
  'settings.ui.security.socialPermissionsBody':
    '接続時に取得された機能スナップショットから、接続された各アカウントで Relay が実行できること。',
  'settings.ui.security.viewInSection': 'で管理する{section}',
  'settings.ui.security.emptySessions': 'このセッションのみがサインインされます。',
  'settings.ui.security.emptyGrants':
    'サードパーティのアプリはこのワークスペースにアクセスできません。同意画面でアプリを許可すると、アプリがここに表示されます。',
  'settings.ui.security.revokeGrantTitle': 'のアクセスを取り消します{app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'アクセス トークンとリフレッシュ トークンはすぐに機能しなくなります。',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'すでに予定されている滞在予定を投稿します。停止したい場合は個別にキャンセルしてください。',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'アプリは再度アクセスを要求することができますが、拒否することもできます。',
  'settings.ui.data.description':
    'データを取り出すか、何かを削除するか、アカウントを閉鎖してください。すべての破壊的なアクションには、最初に触れるものが正確に指定されます。',
  'settings.ui.data.exportTitle': '輸出',
  'settings.ui.data.exportBody':
    'コンテンツ、スケジュール、レシート、分析、監査イベント、およびアップロードしたメディアのポータブル アーカイブ。',
  'settings.ui.data.exportJson': '構造化されたJSON',
  'settings.ui.data.exportCsv': 'スプレッドシートCSV',
  'settings.ui.data.exportMedia': 'メディアアーカイブ',
  'settings.ui.data.exportJsonHelp':
    'レコード タイプごとに 1 つのファイル。文書化されており、バージョン間で安定しています。',
  'settings.ui.data.exportCsvHelp':
    'スプレッドシートのフラット テーブルとしての投稿、領収書、メトリクス。',
  'settings.ui.data.exportMediaHelp':
    'アップロードまたはインポートした元のファイル (チェックサム付き)。',
  'settings.ui.data.exportStart': 'エクスポートの準備',
  'settings.ui.data.exportRunning':
    'エクスポートを準備しています。このページを閉じても実行は継続されます。',
  'settings.ui.data.exportReady': 'エクスポート準備完了、準備完了{date}',
  'settings.ui.data.exportDownload': 'ダウンロードエクスポート',
  'settings.ui.data.exportExpires': 'ダウンロードリンクの有効期限が切れます{date}。',
  'settings.ui.data.deleteTitle': '消去',
  'settings.ui.data.deleteBody':
    '問題を解決する最小のものを選択してください。以下の各オプションは、何が生き残るかを示します。',
  'settings.ui.data.deleteConnection': '1 つのソーシャル コネクションを取り消す',
  'settings.ui.data.deleteConnectionHelp':
    'そのアカウントへの Relay アクセスを削除します。ワークスペース、そのコンテンツ、およびその領収書は残ります。',
  'settings.ui.data.deleteProject': 'ブランドを削除する',
  'settings.ui.data.deleteProjectHelp':
    'ブランド、そのルール、用語集を削除します。その下で公開されたコンテンツは領収書を保持します。',
  'settings.ui.data.deleteContent': 'コンテンツとメディアを削除する',
  'settings.ui.data.deleteContentHelp':
    '下書きと保存されたファイルを削除します。プラットフォーム上ですでに公開されているものは削除されません。',
  'settings.ui.data.deleteAccount': 'このワークスペースを閉じます',
  'settings.ui.data.deleteAccountHelp':
    'スケジュールされたジョブをキャンセルし、すべての接続を取り消し、保存されているメディアを削除して、ワークスペースを閉じます。',
  'settings.ui.data.scheduledJobsTitle': '最初にキャンセルされる予定の仕事',
  'settings.ui.data.scheduledJobsCount': '{count, plural, other {# 件の投稿が予定されています}}',
  'settings.ui.data.cancelJobsFirst': '予約済みの投稿を今すぐキャンセルする',
  'settings.ui.data.cancelJobsDone':
    '予定されていた投稿がキャンセルされました。何も公開されません。',
  'settings.ui.data.deleteConfirmPhraseLabel': '確認のためにワークスペース名を入力します',
  'settings.ui.data.deleteConsequence.jobs':
    'スケジュールされた投稿はすべて、何かが削除される前にキャンセルされます。',
  'settings.ui.data.deleteConsequence.connections':
    'すべてのソーシャル接続はプロバイダーで取り消されます。',
  'settings.ui.data.deleteConsequence.media': '保存されたメディアは削除され、復元できません。',
  'settings.ui.data.deleteConsequence.receipts':
    '出版物の受領書は、規約に記載されている保存期間の間保管され、その後削除されます。',
  'settings.ui.data.deleteConsequence.published':
    'プラットフォーム上にすでに公開されている投稿は削除されません。プラットフォーム上のそれらを削除します。',
  'settings.ui.data.exportFirst': 'データを削除する前にエクスポートしてください。',
  'settings.ui.referral.description':
    'Relay を公開リンクで共有します。委員会は肯定的なレビューを条件とすることは決してありません。',
  'settings.ui.referral.linkLabel': 'あなたの紹介リンク',
  'settings.ui.referral.tableCaption': '帰属されるサインアップとそのコミッションの状態',
  'settings.ui.referral.column.signup': 'サインアップ',
  'settings.ui.referral.column.date': '日付',
  'settings.ui.referral.column.state': '手数料',
  'settings.ui.referral.column.amount': '額',
  'settings.ui.referral.emptyTitle': '属性のあるサインアップはまだありません',
  'settings.ui.referral.emptyBody':
    '誰かがあなたのリンクを通じてトライアルを開始すると、サインアップがここに表示されます。返金期間が終了するまで、金額は保留状態になります。',
  'settings.ui.referral.emptyExample':
    '行の例: acme.example、6 月 12 日にトライアルを開始し、7 月 12 日まで保留され、その後承認されました。',
  'settings.ui.referral.termsLink': 'パートナー規約を読む',
  'settings.ui.referral.balance': '承認された手数料',
  'settings.ui.referral.balanceUnavailableReason': 'この期間の手数料台帳はまだ調整されていません。',
  'developer.ui.agents.description':
    'サービス アカウントは、エージェント、スクリプト、またはワークフローの名前付き ID です。独自のスコープ、独自の制限、および独自の監査証跡があります。',
  'developer.ui.agents.emptyTitle': 'サービス アカウントはまだありません',
  'developer.ui.agents.emptyBody':
    '実行するオートメーションごとに 1 つ作成します。個別のアカウントは、他のアカウントを停止することなく 1 つを取り消すことができることを意味します。',
  'developer.ui.agents.emptyExample':
    '例: Acme EU ブランドの「コンテンツ エージェント」は、07:00 から 22:00 までに 1 日あたり最大 6 件の投稿の下書きとスケジュールを作成できますが、すぐには公開されません。',
  'developer.ui.agents.step.identity': '名前と目的',
  'developer.ui.agents.step.scope': 'それが到達できるもの',
  'developer.ui.agents.step.limits': '限界',
  'developer.ui.agents.purpose': 'このアカウントの目的',
  'developer.ui.agents.purposeHelp':
    '一文。監査ログでは、このアカウントが実行するすべてのアクションの横に表示されます。',
  'developer.ui.agents.scopeHelp':
    'スコープはそれ自体を正確に許可します。ここには他のことを意味するものは何もありません。',
  'developer.ui.agents.limitsHelp':
    '制限はエージェントではなく API によって適用されます。エージェントは自分自身の制限を引き上げることはできません。',
  'developer.ui.agents.quietHours': '静かな時間帯',
  'developer.ui.agents.quietHoursHelp':
    'アカウントは、ワークスペースのタイムゾーンでこれらの時間内にスケジュールまたは公開することはできません。',
  'developer.ui.agents.lookAheadHelp': 'どのくらい先の将来に投稿を投稿できるか。',
  'developer.ui.agents.cadenceHelp': '1 日に発生する可能性のある最も多くの外部出版物。',
  'developer.ui.agents.expiry': '資格情報の有効期限',
  'developer.ui.agents.expiryHelp': '寿命は短い方が安全です。いつでもローテーションできます。',
  'developer.ui.agents.summaryTitle': '作成する前に',
  'developer.ui.agents.summaryAccounts': 'アクセスできるアカウント',
  'developer.ui.agents.summaryMaxActions':
    'せいぜい{count, plural, other {# 社外出版物}}1日あたり。',
  'developer.ui.agents.summaryApproval': '承認行動',
  'developer.ui.agents.summaryCreate': 'サービスアカウントの作成',
  'developer.ui.agents.detailTitle': 'サービスアカウント',
  'developer.ui.agents.statusActive': 'アクティブ',
  'developer.ui.agents.statusStopped': '停止しました',
  'developer.ui.agents.statusExpired': '資格情報の有効期限が切れました',
  'developer.ui.agents.stoppedBody':
    'このアカウントは停止されています。すべての電話は明確な理由で拒否されます。作成されたものは何も削除されませんでした。',
  'developer.ui.agents.killTitle': '停止{name}',
  'developer.ui.agents.killConsequence.calls':
    'このアカウントからの API、MCP、および CLI 呼び出しはすべて一度に拒否されます。',
  'developer.ui.agents.killConsequence.scheduled':
    'すでに予定されている滞在予定を投稿します。停止したい場合は、カレンダーからキャンセルしてください。',
  'developer.ui.agents.killConsequence.reversible': '後でもう一度開始できます。',
  'developer.ui.agents.resume': 'このエージェントを再度開始します',
  'developer.ui.agents.rotate': '資格情報のローテーション',
  'developer.ui.agents.rotateTitle': '資格情報をローテーションします{name}',
  'developer.ui.agents.rotateConsequence.old': '現在の認証情報はすぐに機能しなくなります。',
  'developer.ui.agents.rotateConsequence.new': '新しいものはこのページに一度だけ表示されます。',
  'developer.ui.agents.rotateConsequence.clients':
    '古い値を使用するものはすべて、更新するまで失敗します。',
  'developer.ui.agents.credentialStored': 'この認証情報を保存しました',
  'developer.ui.agents.credentialLabel': 'サービスアカウントの認証情報',
  'developer.ui.agents.credentialWarning': 'この資格情報が表示されるのは今回だけです',
  'developer.ui.agents.credentialWarningBody':
    '今すぐ秘密ストアにコピーしてください。ハッシュのみを保持するため、再度表示することはできません。回転させると新しいものが作成されます。',
  'developer.ui.agents.credentialConsumed':
    '認証情報は表示されなくなります。保管しなかった場合は回転させてください。',
  'developer.ui.agents.credentialReveal': '資格情報を表示',
  'developer.ui.agents.credentialHide': '資格情報を隠す',
  'developer.ui.scope.accounts_read':
    '接続されているアカウントとそれぞれのアカウントで何ができるかを確認します',
  'developer.ui.scope.accounts_write': 'アカウントの名前を変更し、グループ化方法を変更する',
  'developer.ui.scope.drafts_read': '下書きとそのバリエーションを読む',
  'developer.ui.scope.drafts_write': '下書きの作成と編集',
  'developer.ui.scope.posts_schedule': '承認されたコンテンツをアカウントにスケジュールする',
  'developer.ui.scope.posts_publish': 'すぐにアカウントに公開します',
  'developer.ui.scope.posts_cancel': '予約投稿をキャンセルする',
  'developer.ui.scope.analytics_read': 'アカウントの分析を読む',
  'developer.ui.scope.media_read': 'ライブラリ内のファイルを確認する',
  'developer.ui.scope.media_write': 'ライブラリ内のファイルをアップロードして編集する',
  'developer.ui.scope.rules_read': '自動化ルールを読む',
  'developer.ui.scope.rules_write': '公開できる自動化ルールを作成および変更する',
  'developer.ui.scope.growth_read': '成長計画を読む',
  'developer.ui.scope.growth_write': '成長計画の作成と編集',
  'developer.ui.scope.webhooks_manage': 'Webhook エンドポイントの作成と変更',
  'developer.ui.scope.billing_read': 'プラン、トライアル状態、使用状況を読む',
  'developer.ui.scope.connections_admin': 'ソーシャルアカウントの接続と切断',
  'developer.ui.activity.caption': '最近のツール呼び出しと拒否されたもの',
  'developer.ui.activity.column.time': '時間',
  'developer.ui.activity.column.tool': 'ツールまたはルート',
  'developer.ui.activity.column.outcome': '結果',
  'developer.ui.activity.column.subject': '主題',
  'developer.ui.activity.outcome.ok': '許可された',
  'developer.ui.activity.outcome.denied': '拒否されました',
  'developer.ui.activity.outcome.failed': '失敗した',
  'developer.ui.activity.filterDenied': '拒否された試行のみを表示',
  'developer.ui.activity.deniedExplain':
    '拒否された試行は、設定が間違っているエージェントの存在を示します。これらの行は非表示ではなく保持されます。',
  'developer.ui.activity.emptyTitle': 'まだ通話は録音されていません',
  'developer.ui.activity.emptyBody':
    '通話が発生してから数秒以内に、拒否された通話も含めてここに表示されます。',
  'developer.ui.activity.emptyExample':
    '行の例: 12:03、draft_post、許可、X アカウント @acme のドラフト。',
  'developer.ui.setup.help':
    'これを接続しているクライアントに貼り付けます。資格情報のプレースホルダーを、保存した値に置き換えます。',
  'developer.ui.setup.credentialPlaceholder':
    'スニペットはプレースホルダーを使用します。実際の認証情報をリポジトリにコミットしないでください。',
  'developer.ui.setup.copySnippet': 'スニペットをコピーする{client}',
  'developer.ui.setup.snippetCopied': 'スニペットがコピーされました',
  'developer.ui.setup.tabLabel': 'クライアントセットアップのスニペット',
  'developer.ui.playground.help':
    '呼び出しは、このワークスペースのシードされたコピーに対して実行されます。プロバイダーには連絡がなく、何もスケジュールされていません。',
  'developer.ui.playground.tool': '道具',
  'developer.ui.playground.arguments': '引数',
  'developer.ui.playground.argumentsHelp': 'JSON。実際の API が受け入れるのと同じ本文。',
  'developer.ui.playground.result': '結果',
  'developer.ui.playground.resultEmpty': 'ツールを実行して、返される応答を確認します。',
  'developer.ui.playground.invalidJson': 'これはまだ有効な JSON ではないため、送信できません。',
  'developer.ui.playground.deniedByApproval':
    '承認レベル{level}この呼び出しは許可されません。ドライランでは、API とまったく同じように拒否されます。',
  'developer.ui.playground.announceResult': 'ドライランが終了しました。{outcome}。',
  'developer.ui.apps.description':
    'アプリケーションを登録して、他の人が自分のワークスペースへのアクセスを許可できるようにします。各アプリには独自の ID、独自のリダイレクト許可リスト、および独自の監査証跡があります。',
  'developer.ui.apps.emptyTitle': 'アプリが登録されていません',
  'developer.ui.apps.emptyBody':
    '別の製品が Relay ユーザーに代わって動作する必要がある場合は、アプリを登録します。独自の自動化には、代わりにサービス アカウントを使用してください。',
  'developer.ui.apps.emptyExample':
    '例: 「Acme Publisher」、機密クライアント、リダイレクト https://acme.example/oauth/callback、スコープ アカウント:読み取りおよびドラフト:書き込み。',
  'developer.ui.apps.typeHelp':
    '機密クライアントは、管理するサーバー上で実行され、秘密を保持できます。パブリック クライアントはブラウザーまたはデスクトップ アプリであり、シークレットなしで PKCE を使用します。',
  'developer.ui.apps.redirectAdd': 'リダイレクト URI を追加する',
  'developer.ui.apps.redirectRemove': '取り除く{uri}',
  'developer.ui.apps.redirectInvalid':
    'ワイルドカードやクエリ文字列を含まない完全な https URI を入力します。アプリが送信する値と正確に一致する必要があります。',
  'developer.ui.apps.linksTitle': '公開されたリンク',
  'developer.ui.apps.linksHelp':
    'これらは同意画面に表示されます。これらにアクセスできないユーザーはアクセスを許可されません。',
  'developer.ui.apps.linkUnreachable':
    '前回確認したときにこの URL にアクセスできませんでした。{date}。',
  'developer.ui.apps.linkReachable': '到達可能、チェック済み{date}',
  'developer.ui.apps.scopesTitle': 'このアプリが要求する可能性のある権限',
  'developer.ui.apps.scopesHelp':
    '必要最小限のものを求めてください。ユーザーには、読み取り権限と結果的な権限が 2 つの別個のグループとして認識されます。',
  'developer.ui.apps.scopeGroup.read': '読み取り権限',
  'developer.ui.apps.scopeGroup.reversible': '元に戻せる変更',
  'developer.ui.apps.scopeGroup.consequential': '必然的な権限',
  'developer.ui.apps.scopeGroupHelp.read':
    'これらにより、アプリはデータを参照できるようになります。何も変わりません。',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'これらにより、アプリは Relay 内で何かを作成または編集できるようになります。プラットフォームには何も到達しません。',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'これらにより、実際のアカウントに投稿が行われたり、アカウントにアクセスできるユーザーが変更されたりする可能性があります。これらは常に個別にリストされ、バンドルされることはありません。',
  'developer.ui.apps.noBundling':
    '結合されたアクセス スコープはありません。請求と接続の管理は常に名前で要求されます。',
  'developer.ui.apps.secretTitle': 'クライアントシークレット',
  'developer.ui.apps.secretWarning': 'クライアント シークレットが表示されるのはこのときだけです',
  'developer.ui.apps.secretWarningBody':
    '今すぐサーバー側のシークレットマネージャーに保存してください。ハッシュのみを保持します。紛失した場合は、回転させてください。再度表示する方法はありません。',
  'developer.ui.apps.secretConsumed':
    'シークレットは表示されなくなりました。保管しなかった場合は回転させてください。',
  'developer.ui.apps.secretStored': '私はこの秘密を保管しました',
  'developer.ui.apps.secretPublicClient':
    'パブリッククライアントには秘密はありません。 PKCE による認証コード フローを使用します。',
  'developer.ui.apps.rotateTitle': 'クライアントシークレットをローテーションします{app}',
  'developer.ui.apps.rotateConsequence.old': '現在のシークレットはすぐに動作を停止します。',
  'developer.ui.apps.rotateConsequence.grants': '既存のユーザー権限は取り消されません。',
  'developer.ui.apps.rotateConsequence.deploy':
    '新しい値をデプロイするまで、サーバーはトークンを更新できません。',
  'developer.ui.apps.consentPreviewTitle': '同意画面のプレビュー',
  'developer.ui.apps.consentPreviewHelp':
    'これがユーザーに表示されるものです。これはアプリのレコードから生成されるため、アプリが要求する以上のことを約束することはできません。',
  'developer.ui.apps.consentPreviewSample':
    'プレビューのみ。何も付与されず、トークンも発行されません。',
  'developer.ui.apps.grantsCaption': 'このアプリにアクセスを許可したワークスペース',
  'developer.ui.apps.grantColumn.workspace': 'Workspace',
  'developer.ui.apps.grantColumn.scopes': 'スコープ',
  'developer.ui.apps.grantColumn.granted': '付与された',
  'developer.ui.apps.grantColumn.lastUsed': '最後に使用した',
  'developer.ui.apps.grantsEmpty': 'まだ誰もこのアプリへのアクセスを許可していません。',
  'developer.ui.apps.logsCaption': 'シークレットとペイロードが削除された最近のリクエスト',
  'developer.ui.apps.logColumn.time': '時間',
  'developer.ui.apps.logColumn.route': 'ルート',
  'developer.ui.apps.logColumn.status': '状態',
  'developer.ui.apps.logColumn.workspace': 'Workspace',
  'developer.ui.apps.logsRedacted':
    'リクエストおよびレスポンスの本文は、認証情報、トークン、ユーザー コンテンツが削除された状態で保存されます。',
  'developer.ui.apps.sandboxTitle': 'サンドボックス認証情報',
  'developer.ui.apps.sandboxBody':
    'シードされたデータを含む個別のクライアント ID とワークスペース。これを使用して行われた通話はプロバイダーに到達することはありません。',
  'developer.ui.apps.rateLimitLabel': 'レート制限',
  'developer.ui.apps.rateLimitUsage': '{used}の{limit}この時間のリクエスト',
  'developer.ui.apps.disable': 'アプリを無効にする',
  'developer.ui.apps.enable': 'アプリを有効にする',
  'developer.ui.apps.disabledBody':
    'このアプリは無効になっています。既存のトークンは拒否され、新しい付与を開始することはできません。許可は保持されるため、再度有効にすることができます。',
  'developer.ui.apps.deleteTitle': '消去{app}',
  'developer.ui.apps.deleteConsequence.grants':
    'すべての付与は取り消され、すべてのトークンは機能しなくなります。',
  'developer.ui.apps.deleteConsequence.logs': 'リクエスト ログは監査保存期間中保存されます。',
  'developer.ui.apps.deleteConsequence.irreversible': 'クライアントIDは再利用できません。',
  'developer.ui.webhooks.description':
    '選択したイベントの署名付き HTTPS 配信。すべての配信はその応答とともに記録され、どの配信も再送信できます。',
  'developer.ui.webhooks.emptyTitle': 'まだエンドポイントがありません',
  'developer.ui.webhooks.emptyBody':
    'エンドポイントを追加して、公開結果、承認決定、および接続の健全性を独自のシステムで受信します。',
  'developer.ui.webhooks.emptyExample':
    '例: https://hooks.acme.example/relay、post.published、post.failed、connection.action_required をサブスクライブします。',
  'developer.ui.webhooks.create': 'エンドポイントを追加する',
  'developer.ui.webhooks.url': 'エンドポイント URL',
  'developer.ui.webhooks.urlHelp': 'HTTPSのみ。リダイレクトは追跡せず、2xx を再試行しません。',
  'developer.ui.webhooks.eventsTitle': 'イベント',
  'developer.ui.webhooks.eventsHelp':
    '扱うイベントを選択してください。ほとんどを無視するエンドポイントにすべてを送信すると、障害が見えにくくなります。',
  'developer.ui.webhooks.eventsAll': 'あらゆるイベント',
  'developer.ui.webhooks.eventsSelected': '私が選択したイベントのみ',
  'developer.ui.webhooks.eventsCount': '{count, plural, other {イベント数}}',
  'developer.ui.webhooks.eventGroup.connections': '接続',
  'developer.ui.webhooks.eventGroup.content': '内容と承認',
  'developer.ui.webhooks.eventGroup.publishing': '出版',
  'developer.ui.webhooks.eventGroup.automation': '自動化とフィード',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'ブランドとアカウント',
  'developer.ui.webhooks.scopeAll': 'あらゆるブランドとアカウント',
  'developer.ui.webhooks.scopeSelected': '私が選んだものだけ',
  'developer.ui.webhooks.secretTitle': '署名の秘密',
  'developer.ui.webhooks.secretBody':
    '本文を解析する前に、署名ヘッダーを確認してください。配信 ID の重複を排除します。これは再試行後も安定しています。',
  'developer.ui.webhooks.secretRotateTitle': '署名シークレットをローテーションする',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'どちらのシークレットも 24 時間受け入れられるため、配信をドロップすることなくデプロイできます。',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'その期間の後は、新しいシークレットのみが使用されます。',
  'developer.ui.webhooks.testDeliveryHelp':
    'テストとしてマークされた 1 つの署名付きサンプル イベントを送信するため、受信者は安全に無視できます。',
  'developer.ui.webhooks.testDeliverySent':
    'テスト配信が送信されました。結果は以下のログに表示されます。',
  'developer.ui.webhooks.deliveriesCaption': '最近の配達と各人が受け取った反応',
  'developer.ui.webhooks.deliveryColumn.time': 'リクエスト済み',
  'developer.ui.webhooks.deliveryColumn.event': 'イベント',
  'developer.ui.webhooks.deliveryColumn.attempt': '試み',
  'developer.ui.webhooks.deliveryColumn.response': '応答',
  'developer.ui.webhooks.deliveryColumn.status': '状態',
  'developer.ui.webhooks.deliveryStatus.pending': '待っている',
  'developer.ui.webhooks.deliveryStatus.succeeded': '納品済み',
  'developer.ui.webhooks.deliveryStatus.failed': '失敗しました。再試行します',
  'developer.ui.webhooks.deliveryStatus.exhausted': '失敗しました。再試行はできません',
  'developer.ui.webhooks.deliveryStatus.disabled': '送信されず、エンドポイントが無効になっています',
  'developer.ui.webhooks.deliveryNoResponse': '応答がありません',
  'developer.ui.webhooks.deliveryNextAttempt': '次の試行{relativeTime}',
  'developer.ui.webhooks.inspect': '納品検査',
  'developer.ui.webhooks.inspectTitle': '配達{id}',
  'developer.ui.webhooks.inspectRequest': 'リクエストボディ',
  'developer.ui.webhooks.inspectResponse': 'レスポンスボディ',
  'developer.ui.webhooks.redeliver': 'この配信を再度送信します',
  'developer.ui.webhooks.redeliverHelp':
    '同じイベント ID が再配信フラグを設定して再度送信されるため、冪等な受信者はそれを安全に無視します。',
  'developer.ui.webhooks.redelivered': '再配達のためにキューに入れられました。',
  'developer.ui.webhooks.failureTitle': 'このエンドポイントは失敗しています',
  'developer.ui.webhooks.failureBody':
    '{count, plural, other {# 回連続で配信に失敗しました}}。後{limit}連続して失敗すると、エンドポイントが無効になり、アクション アイテムが提出されます。',
  'developer.ui.webhooks.disabledTitle': 'このエンドポイントは失敗が繰り返された後無効になりました',
  'developer.ui.webhooks.disabledBody':
    'キューがいっぱいにならないように、送信を停止しました。受信機を修正し、テスト配信を送信してから、再度有効にします。',
  'developer.ui.webhooks.lastSuccessLabel': '最後の成功',
  'developer.ui.webhooks.lastSuccessNever': '配信が成功したことはありません',
  'developer.ui.webhooks.deleteTitle': 'このエンドポイントを削除します',
  'developer.ui.webhooks.deleteConsequence.stop': 'この URL にはそれ以上何も送信されません。',
  'developer.ui.webhooks.deleteConsequence.logs': '配信ログは監査保存期間中保存されます。',
  'billing.ui.description':
    '1 つのプラン、2 つの間隔。 Polar は記録上の販売者です。支払方法を保持し、請求書を発行し、キャンセルを処理します。',
  'billing.ui.statusHeading': '現在の状況',
  'billing.ui.planHeading': 'プラン',
  'billing.ui.intervalHeading': '請求間隔',
  'billing.ui.usageHeading': '従量制のプロバイダーの使用量',
  'billing.ui.invoicesHeading': '請求書',
  'billing.ui.cancelHeading': 'キャンセル',
  'billing.ui.trialDaysRemaining': 'トライアル、{count, plural, other {残り # 日}}',
  'billing.ui.convertsOn': '変換オン{date}に{amount}当たり{interval}。',
  'billing.ui.dueToday': '今日の期限は $0',
  'billing.ui.conversionLabel': '改宗者',
  'billing.ui.channelsLabel': 'アクティブなチャネル',
  'billing.ui.paymentMethodPolar': 'Polar が保有する支払い方法',
  'billing.ui.paymentMethodDescriptor': '{project}エンディング{last4}、有効期限が切れます{expiry}',
  'billing.ui.paymentMethodMissing': 'まだ支払い方法が登録されていません',
  'billing.ui.cancelBeforeDate': '前にキャンセルしてください{date}そして料金は請求されません。',
  'billing.ui.annualFraming': '月額 25 ドルが毎年請求されます。年間 48 ドル節約できます。',
  'billing.ui.monthlyOption': '月額 29 ドル',
  'billing.ui.annualOption': '年間 300 ドル',
  'billing.ui.intervalChangeHelp':
    '間隔の変更は次回の更新時に有効になります。 Polar はそれを日割り計算して、確認する前に正確な金額を表示します。',
  'billing.ui.intervalChangedAnnouncement': '請求間隔を次のように設定しました{interval}。',
  'billing.ui.allowanceChannels':
    '30 のアクティブなソーシャル チャネル。チャネルとは、接続されている 1 つのアカウント、ページ、またはチャネルです。',
  'billing.ui.allowanceChannelsUsage': '{used}の{limit}アクティブなチャネル',
  'billing.ui.allowanceFairUse':
    'フェアユースとは、スパム対策、料金およびプロバイダーのコスト管理を意味します。これらはすべての購読者に同じ方法で適用され、任意ではなく公開されます。',
  'billing.ui.allowanceMetered':
    'X およびその他の一部のプロバイダーは、操作ごとに料金を請求します。これらの料金は原価で引き継がれ、プラン価格の一部ではありません。',
  'billing.ui.allowanceNoMedia':
    '画像生成とビデオ生成は含まれておらず、販売されていません。 Relay はメディアを生成しません。',
  'billing.ui.readFairUse': 'フェアユースポリシーを読む',
  'billing.ui.readMeteredPolicy': '従量制使用量の請求方法を読む',
  'billing.ui.usageCaption': 'この期間の従量制プロバイダーの使用量は実費で請求されます',
  'billing.ui.usageColumn.item': 'アイテム',
  'billing.ui.usageColumn.quantity': '量',
  'billing.ui.usageColumn.unitPrice': '単価',
  'billing.ui.usageColumn.amount': '額',
  'billing.ui.usageTotal': 'この期間の合計',
  'billing.ui.usagePeriod': '期間{start}に{end}',
  'billing.ui.usageSource': 'プロバイダーが公表している価格。確認済み{date}。',
  'billing.ui.usageReconciled': 'プロバイダーの請求書と照合しました{date}。',
  'billing.ui.usagePending': 'まだ和解していない。最終的な金額は若干変動する可能性があります。',
  'billing.ui.usageUnavailableReason':
    'プロバイダーはこの期間の使用量をまだ返していません。通常24時間以内にご利用いただけます。',
  'billing.ui.usageEmpty': 'この期間は従量制による使用はありません。',
  'billing.ui.spendAlert': '支出アラート',
  'billing.ui.spendAlertHelp':
    '請求期間内に従量制使用量がこの金額を超えると、メールで通知されます。',
  'billing.ui.spendAlertPause': 'アラートに達すると、従量制アクションも一時停止します',
  'billing.ui.balanceLabel': '利用残高',
  'billing.ui.balanceHelp': '従量制の使用量はこの残高から引き出され、Polar によって請求されます。',
  'billing.ui.invoicesCaption': 'Polar が発行した請求書',
  'billing.ui.invoiceColumn.date': '日付',
  'billing.ui.invoiceColumn.description': '説明',
  'billing.ui.invoiceColumn.amount': '額',
  'billing.ui.invoiceColumn.state': '州',
  'billing.ui.invoiceState.paid': '有料',
  'billing.ui.invoiceState.open': '開ける',
  'billing.ui.invoiceState.uncollectible': '未回収',
  'billing.ui.invoiceState.refunded': '返金されました',
  'billing.ui.invoicesEmpty':
    '請求書はまだありません。最初のものはトライアルが変換されたときに発行されます。',
  'billing.ui.invoicesInPortal': 'すべての請求書と領収書は、Polar ポータルで入手できます。',
  'billing.ui.portalHelp':
    'ポータルでは、支払い方法の変更、請求書のダウンロード、キャンセルを行うことができます。新しいタブで開きます。',
  'billing.ui.pastDueHeading': '支払い期限切れ',
  'billing.ui.pastDueBody':
    '最後の支払いが完了しませんでした。公開を続けるには、Polar ポータルで支払い方法を更新してください。',
  'billing.ui.gracePolicy':
    '予約投稿は次の期限まで実行され続けます。{date}。その後、ワークスペースは読み取り専用になり、何も削除されず、何も公開されません。',
  'billing.ui.cancelBody':
    'キャンセルは 1 つのアクションであり、支払いを行った期間の終了時に有効になります。電話をかけたり、フォームに記入したりする必要はありません。',
  'billing.ui.cancelStart': 'サブスクリプションをキャンセルする',
  'billing.ui.cancelDialogTitle': 'このサブスクリプションをキャンセルする',
  'billing.ui.cancelConsequence.noCharge':
    '料金はかかりません。今日も当日も何も取られません{date}。',
  'billing.ui.cancelConsequence.accessUntil': 'まですべての機能を維持します{date}。',
  'billing.ui.cancelConsequence.dataKept':
    '下書き、領収書、メディア、分析はこのワークスペースに残ります。',
  'billing.ui.cancelConsequence.scheduled':
    '以降に予定されている投稿{date}公開しません。それまでにキャンセルするか、スケジュールを変更してください。',
  'billing.ui.cancelConsequence.restart': 'サブスクリプションはいつでも再開できます。',
  'billing.ui.cancelConfirm': 'サブスクリプションをキャンセルする',
  'billing.ui.cancelKeep': 'サブスクリプションを維持する',
  'billing.ui.cancelConfirmedBeforeConversion': 'キャンセル。料金はかかりません。',
  'billing.ui.cancelConfirmedAfterConversion': 'キャンセル。までアクセスが継続されます{date}。',
  'billing.ui.cancelAnnouncement': '定期購入がキャンセルされました。',
  'billing.ui.canceledNotice': 'このサブスクリプションはキャンセルされました。',
  'billing.ui.resume': 'サブスクリプションを再度開始する',
  'billing.ui.noSubscriptionTitle': 'このワークスペースにはサブスクリプションがありません',
  'billing.ui.noSubscriptionBody':
    '公開するには 7 日間のトライアルを開始してください。 Polar は支払い方法を収集し、現在は料金を請求しません。',
  'billing.ui.noSubscriptionExample':
    '月額は 29 ドルです。年間料金は 300 ドルで、年間で月額 25 ドルが請求されます。年間 48 ドル節約できます。',
  'billing.ui.overChannelLimitAction': '接続されているチャネルを確認する',
  'growth.ui.entryHelp':
    '短い質問に答え、理解した内容を確認し、項目ごとに受け入れられる計画を取得します。仕事を提案してくれます。独自に何かをスケジュールしたり公開したりすることはありません。',
  'growth.ui.step.intake': '摂取量',
  'growth.ui.step.confirm': '確認する',
  'growth.ui.step.plan': 'プラン',
  'growth.ui.stepIndicator': 'ステップ{current}の{total}:{name}',
  'growth.ui.intake.section.product': '製品',
  'growth.ui.intake.section.audience': '聴衆と市場',
  'growth.ui.intake.section.objective': '客観的',
  'growth.ui.intake.section.capacity': 'チャンネルと容量',
  'growth.ui.intake.section.limits': '立入禁止とは何ですか',
  'growth.ui.intake.help':
    'ここでは、あなたが推測できるものは何もありません。空白のままにすると、入力されるのではなく、欠落としてマークされます。',
  'growth.ui.intake.productNameHelp': '顧客に対して使用する名前。',
  'growth.ui.intake.siteUrlHelp':
    '資料として提供していただいたページを読ませていただきました。私たちがそこから得たすべての事実をあなたは確認します。',
  'growth.ui.intake.descriptionHelp': '何を売るのか、誰に向けて売るのかを自分の言葉で。',
  'growth.ui.intake.marketsHelp': '国または地域。 1 行に 1 つ。',
  'growth.ui.intake.localesHelp': '公開する言語。',
  'growth.ui.intake.objectiveHelp': '次の四半期にさらに強化したいこと。',
  'growth.ui.intake.conversionHelp': '実際に測定できるアクション。サインアップ、デモ、購入。',
  'growth.ui.intake.proofHelp':
    'ケーススタディ、実行したベンチマーク、所有するスクリーンショット、すでに保持している権限。 1 行に 1 つ。',
  'growth.ui.intake.proofNone': 'まだ承認された証拠がありません',
  'growth.ui.intake.proofNoneEffect':
    'この計画により、顧客からの結果や結果に関するクレームは完全に回避されます。',
  'growth.ui.intake.channelsHelp': 'すでに公開しているアカウント。',
  'growth.ui.intake.capacityHelp': '正直に言ってください。実行できない計画は計画ではありません。',
  'growth.ui.intake.competitorsHelp': 'オプション。 1 行に 1 つ。',
  'growth.ui.intake.prohibitedClaimsHelp':
    '法的または政策上の理由により、申し立てを行うことはできません。 1 行に 1 つ。',
  'growth.ui.intake.prohibitedTopicsHelp': '避けるべきトピック。 1 行に 1 つ。',
  'growth.ui.intake.submit': '理解した内容を復習する',
  'growth.ui.intake.savedAnnouncement': 'ビジネスプロフィールが保存されました。',
  'growth.ui.intake.requiredMissing': '続行する前に、必須とマークされたフィールドに入力します。',
  'growth.ui.confirm.factsTitle': 'あなたが確認した事実',
  'growth.ui.confirm.factsHelp': 'これらはコピーで使用できます。',
  'growth.ui.confirm.assumptionsTitle': '私たちが立てた仮定',
  'growth.ui.confirm.assumptionsHelp':
    'これらは事実ではありません。それらは計画を形作るものですが、投稿での主張になることはありません。',
  'growth.ui.confirm.missingTitle': 'ない',
  'growth.ui.confirm.missingHelp':
    '計画はこれらのそれぞれに基づいて機能し、重要な場合にはそのように述べています。',
  'growth.ui.confirm.confidence.label': '自信：{level}',
  'growth.ui.confirm.confidence.low': '低い',
  'growth.ui.confirm.confidence.medium': '中くらい',
  'growth.ui.confirm.confidence.high': '高い',
  'growth.ui.confirm.promote': '事実として確認する',
  'growth.ui.confirm.correct': 'これを修正してください',
  'growth.ui.confirm.correctLabel': 'あなたの訂正',
  'growth.ui.confirm.generate': '計画を作成する',
  'growth.ui.confirm.announcement': 'ビジネスプロフィールを確認しました。',
  'growth.ui.plan.generatingBody':
    'これには数秒かかります。このページから離れても構いません。計画は自動的に終了します。',
  'growth.ui.plan.stateDraft': '草案、未承認',
  'growth.ui.plan.stateApproved': '承認された',
  'growth.ui.plan.stateSuperseded': '新しいバージョンに置き換えられる',
  'growth.ui.plan.newVersionNotice':
    '更新するとバージョンが作成されます{version}承認されたバージョンはそのままにしておきます。',
  'growth.ui.plan.emptyTitle': 'まだ計画はありません',
  'growth.ui.plan.emptyBody':
    'ビジネスプロフィールをご記入ください。確認した事実に基づいて計画を作成します。',
  'growth.ui.plan.emptyExample':
    'プランには、戦略、4 週間のブリーフ、1 つの UGC キャンペーン、カタログに裏付けられた機会、および最大 5 つのツールが含まれます。',
  'growth.ui.plan.tabsLabel': '計画セクション',
  'growth.ui.plan.modelNote': '生成者{model}、 プロンプト{promptVersion}、 の上{date}。',
  'growth.ui.strategy.snapshotTitle': 'ビジネススナップショット',
  'growth.ui.strategy.channelPriority': '優先度{rank}',
  'growth.ui.strategy.channelFormats': 'ネイティブ形式',
  'growth.ui.strategy.pillarProof': 'この柱が寄りかかっている証拠',
  'growth.ui.strategy.pillarProofNone':
    '承認された証拠はありません。この柱は説明的なものにしてください。',
  'growth.ui.strategy.cadenceCaption': 'チャンネルごとの週ごとの投稿数',
  'growth.ui.strategy.cadenceColumn.channel': 'チャネル',
  'growth.ui.strategy.cadenceColumn.perWeek': '週あたりの投稿数',
  'growth.ui.strategy.cadenceTotal': '週ごとの合計',
  'growth.ui.strategy.capacityWarning':
    'このリズムは{planned}規定の容量に対して週に投稿する{capacity}何時間も。プロファイルの容量を減らすか、容量を増やします。',
  'growth.ui.strategy.measurementBody':
    '同じチャンネルとフォーマットでの自分の後続投稿と比較します。アカウントに匹敵するものがないため、外部ベンチマークは使用されません。',
  'growth.ui.strategy.localeAdaptations': '言語ノート',
  'growth.ui.fourWeek.caption': '週および日ごとに提案されたブリーフ',
  'growth.ui.fourWeek.column.date': '日付',
  'growth.ui.fourWeek.column.channel': 'チャネル',
  'growth.ui.fourWeek.column.pillar': '柱',
  'growth.ui.fourWeek.column.format': '形式',
  'growth.ui.fourWeek.column.brief': '簡単な',
  'growth.ui.fourWeek.column.cta': '行動喚起',
  'growth.ui.fourWeek.column.measurement': '計測タグ',
  'growth.ui.fourWeek.column.actions': 'アクション',
  'growth.ui.fourWeek.approvalRequired': '公開するには承認が必要です',
  'growth.ui.fourWeek.approvalNotRequired': 'このアカウントには承認は必要ありません',
  'growth.ui.fourWeek.noCta': '行動喚起なし',
  'growth.ui.fourWeek.weekEmpty': '今週提案されたブリーフはありません。',
  'growth.ui.fourWeek.acceptedCount': '{accepted}の{total}準備書面が草案として受理されました',
  'growth.ui.fourWeek.acceptAnnouncement': 'この概要から作成された草案。',
  'growth.ui.fourWeek.proposeAnnouncement': 'カレンダーの提案が追加されました{date}。',
  'growth.ui.ugc.promptAngle': '角度{number}',
  'growth.ui.ugc.checklistTitle': '権利、同意および開示',
  'growth.ui.ugc.checklistHelp':
    '何かを公開する前に、各参加者とこの問題を解決してください。出演への同意は広告への同意ではありません。',
  'growth.ui.ugc.incentiveNone': 'インセンティブは提供されません',
  'growth.ui.ugc.incentiveDisclosure':
    'インセンティブは、あなたと参加者によって、その投稿から生じるすべての投稿で開示されなければなりません。',
  'growth.ui.ugc.honesty':
    'これは、実際の人々と実行するキャンペーンを計画します。 Relay は、クリエイターを見つけたり、連絡したり、紹介文を書いたり、顧客コンテンツを作成したりすることはありません。',
  'growth.ui.opportunities.caption':
    'カタログからの検証済みの機会を、プロフィールとの適合性によってランク付けします',
  'growth.ui.opportunities.column.opportunity': '機会',
  'growth.ui.opportunities.column.type': 'タイプ',
  'growth.ui.opportunities.column.audience': '観客',
  'growth.ui.opportunities.column.fit': 'なぜこれが当てはまるのか',
  'growth.ui.opportunities.column.requirements': '要件',
  'growth.ui.opportunities.column.rules': '自己宣伝のルール',
  'growth.ui.opportunities.column.cost': '料金',
  'growth.ui.opportunities.column.effort': '努力',
  'growth.ui.opportunities.column.verified': '最終確認済み',
  'growth.ui.opportunities.column.actions': 'アクション',
  'growth.ui.opportunities.costFree': '無料',
  'growth.ui.opportunities.effort.low': '低い',
  'growth.ui.opportunities.effort.medium': '中くらい',
  'growth.ui.opportunities.effort.high': '高い',
  'growth.ui.opportunities.noRequiredAsset': 'アセットは必要ありません',
  'growth.ui.opportunities.prepareTitle': '提出物を準備する{name}',
  'growth.ui.opportunities.prepareRules': '彼らのルール（引用）',
  'growth.ui.opportunities.prepareChecklist': '準備するもの',
  'growth.ui.opportunities.prepareManual':
    'これを自分でサイトに送信します。 Relay は、フォームに記入したり、アカウントを作成したり、誰にもメールを送信したりしません。',
  'growth.ui.opportunities.pitchTitle': 'ピッチドラフト',
  'growth.ui.opportunities.pitchHelp':
    '送信する前に編集してください。あなたが確認した事実のみを使用します。',
  'growth.ui.opportunities.submittedOn': '提出済み{date}',
  'growth.ui.opportunities.staleTitle': '一部のエントリは再検証が必要です',
  'growth.ui.opportunities.staleBody':
    '{count, plural, other {# 件のエントリはレビュー日を過ぎています}}。信頼する前に、サイト上の現在のルールを確認してください。',
  'growth.ui.opportunities.emptyExample':
    'カタログの行には、公式 URL、対象読者、サイトから引用した投稿ルール、コスト、労力、最後にチェックした日付が含まれます。',
  'growth.ui.tools.shown': '{shown}の{max}示されている',
  'growth.ui.tools.fewerThanMax':
    'のみ{count, plural, other {# 個のツールが一致}}現在のレビューを含むこのワークフロー。リストを埋めるよりも、表示する数を減らしたいと考えています。',
  'growth.ui.tools.emptyTitle': 'このワークフローに適合するレビュー済みツールはまだありません',
  'growth.ui.tools.emptyBody':
    'すべてのエントリーは、ここに表示される前に、価格、権利条件、および名前付き制限を確認する必要があります。',
  'growth.ui.tools.emptyExample':
    'エントリには、それが最適な用途、それがあなたの計画に適合する理由、できないこと、必要なスキル、出力が Relay にどのように返されるか、価格が最後にチェックされた時期が記載されています。',
  'growth.ui.tools.openSite': '公式サイトを開く{name}',
  'growth.ui.tools.stale': 'レビュー日を過ぎています。生成された計画から除外されます。',
  'growth.ui.item.explainTitle': 'これが提案された理由',
  'growth.ui.item.explainEvidence': '何をベースにしているのか',
  'growth.ui.item.explainNoEvidence':
    'これは、あなたのビジネスに関する確認された事実からではなく、目的とチャネルのルールから来ています。',
  'growth.ui.item.dismissTitle': 'この提案を却下する',
  'growth.ui.item.dismissBody':
    'その理由を教えてください。理由は計画とともに保存され、次のバージョンが形成されます。',
  'growth.ui.item.dismissReasonLabel': '理由',
  'growth.ui.item.dismissReason.notRelevant': 'このビジネスとは関係ありません',
  'growth.ui.item.dismissReason.noCapacity': '私たちにはその能力がありません',
  'growth.ui.item.dismissReason.wrongAudience': '間違った聴衆',
  'growth.ui.item.dismissReason.alreadyDone': 'すでにこれを行っています',
  'growth.ui.item.dismissReason.policy': '当社のポリシーまたは主張に反する',
  'growth.ui.item.dismissReason.other': '何か他のもの',
  'growth.ui.item.dismissNote': '追加したいものは何でも',
  'growth.ui.item.dismissed': '解雇されました。表示されたままになるので、元に戻すことができます。',
  'growth.ui.item.undoDismiss': '却下を元に戻す',
  'growth.ui.export.title': 'このプランをエクスポートする',
  'growth.ui.export.formatLabel': '形式',
  'growth.ui.export.copy': 'クリップボードにコピー',
  'growth.ui.export.download': 'ファイルをダウンロードする',
  'growth.ui.export.copied': '計画がクリップボードにコピーされました。',
  'growth.ui.export.schemaNote':
    '3 つの形式はすべて、1 つの検証済みスキーマ、バージョンに由来します。{version}。構造化ビューはソース管理にとって安全であり、シークレットは含まれません。',
  'growth.ui.export.previewLabel': 'プレビューのエクスポート',
} as const;
