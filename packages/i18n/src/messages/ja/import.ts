export const importMessages = {
  'import.title': 'CSVから投稿をインポート',
  'import.subtitle':
    'スプレッドシートをアップロードし、何が起きるかを確認してから決めてください。アップロードはファイルを確認するだけです。何も作成されません。',

  'import.step.upload': 'アップロード',
  'import.step.columns': '列',
  'import.step.review': '確認',
  'import.step.apply': '適用',
  'import.step.results': '結果',
  'import.step.position': 'ステップ {current}/{total}',

  'import.upload.heading': 'CSVファイルを選択',
  'import.upload.help':
    'CSVのみ対応。.xlsxなどのスプレッドシートファイルは読み込まれません。まずシートをCSVとしてエクスポートしてください。',
  'import.upload.field': 'CSVファイル',
  'import.upload.fieldHelp': 'ファイルを選択するか、以下のボックスに行を貼り付けてください。',
  'import.upload.paste': 'またはCSVテキストを貼り付け',
  'import.upload.pasteHelp': 'ヘッダー行を含めてください。何かが作成される前にすべてが確認されます。',
  'import.upload.project': 'プロジェクト',
  'import.upload.projectHelp': '1つのファイル内の各行はこのプロジェクトに属します。',
  'import.upload.submit': 'このファイルを確認',
  'import.upload.submitting': 'ファイルを読み込み中',
  'import.upload.allowPast': '過去の時刻を許可',
  'import.upload.allowPastHelp':
    '既定ではオフです。過去の日付を持つ行は、あなたが修正できるよう報告されます。自動的に移動されることはありません。',
  'import.upload.tooLarge': 'このファイルは{limit}文字を超えています。分割して再試行してください。',
  'import.upload.duplicate':
    'これは以前アップロードしたのと同じファイルなので、2つ目のコピーではなくそのインポートを表示しています。',

  'import.template.heading': '各列の意味',
  'import.template.download': 'CSVテンプレートをダウンロード',
  'import.template.required': '必須列',
  'import.template.optional': '任意列',
  'import.column.external_row_id': '行の独自ID。ファイル内で一意である必要があります。',
  'import.column.project': 'その行が属するプロジェクトの名前またはID。',
  'import.column.targets':
    'set: に続くターゲットセットID、または縦棒で区切られたアカウントID。',
  'import.column.caption': '投稿テキスト。',
  'import.column.scheduled_local_time': 'ローカルの日付と時刻。2026-09-01T10:00の形式で記入。',
  'import.column.time_zone': 'そのローカル時刻を読み取るIANAゾーン。例: Europe/Berlin。',
  'import.column.media':
    'メディアID、sha256: に続くすでに持っているメディアのチェックサム、またはサーバーが取得するhttpsアドレス。',
  'import.column.title': 'タイトル。宛先がタイトルを使用する場合。',
  'import.column.destination': 'アカウント内のページ、ボード、チャンネル。',
  'import.column.privacy': '宛先が期待する公開範囲の値。',
  'import.column.first_comment': '投稿後の最初のコメントとして公開されるテキスト。',
  'import.column.approval_policy': '各下書きに紐付ける承認ポリシー。',
  'import.column.perPlatform':
    'プラットフォーム名が付いたcaption_またはtitle_列は、そのプラットフォームのみを上書きします。例: caption_instagram。',

  'import.columns.heading': '列の確認',
  'import.columns.ok': 'すべての必須列が存在します。',
  'import.columns.missing': '必須列{count, plural, other {#件}}が不足しています',
  'import.columns.unknown': '{count, plural, other {列#件}}が認識されず無視されます',
  'import.columns.present': '見つかった列',

  'import.review.heading': 'このファイルが実行する内容',
  'import.review.counts':
    '{valid, plural, =0 {準備できた行はありません} other {#行が準備完了}}、{invalid, plural, =0 {確認が必要な行はありません} other {#行が確認必要}}。',
  'import.review.empty': 'このファイルからは行が読み込まれませんでした。',
  'import.review.rowsHeading': '行',
  'import.review.filterAll': 'すべての行',
  'import.review.filterValid': '準備完了',
  'import.review.filterInvalid': '確認が必要',
  'import.review.filterFailed': '失敗',
  'import.review.downloadErrors': '問題をCSVとしてダウンロード',
  'import.review.parsedWith': 'パーサー{version}で読み込み',

  'import.table.row': '行ID',
  'import.table.line': '行',
  'import.table.state': '状態',
  'import.table.caption': 'キャプション',
  'import.table.time': '予定',
  'import.table.problems': '問題',
  'import.table.draft': '下書き',
  'import.table.noProblems': 'なし',

  'import.state.pending': '未確認',
  'import.state.valid': '準備完了',
  'import.state.invalid': '確認が必要',
  'import.state.applied': '下書き作成済み',
  'import.state.skipped': '処理済み',
  'import.state.failed': '失敗',

  'import.job.state.uploaded': 'アップロード済み',
  'import.job.state.validating': '確認中',
  'import.job.state.validated': '確認済み',
  'import.job.state.applying': '適用中',
  'import.job.state.applied': '適用済み',
  'import.job.state.failed': '読み込めませんでした',

  'import.apply.heading': '準備完了の行をどうしますか?',
  'import.apply.drafts': '下書きを作成',
  'import.apply.draftsHelp':
    '既定の動作です。準備完了の各行は開いて編集し承認できる下書きになります。何も予定されません。',
  'import.apply.scheduled': '下書きを作成して予定する',
  'import.apply.scheduledHelp':
    '準備完了の各行は下書きになり、ファイルに記載された時刻を引き継ぎます。時刻が正しい場合のみ選んでください。',
  'import.apply.confirm': '{count, plural, other {#行}}を適用',
  'import.apply.confirmScheduled': '{count, plural, other {#行}}を作成して予定',
  'import.apply.running': '行を適用中',
  'import.apply.safeToRepeat':
    '2回適用しても安全です。すでに下書きを作成した行はそのままにされます。',

  'import.results.heading': '結果',
  'import.results.applied': '下書き{count, plural, other {#件}}作成',
  'import.results.skipped': '{count, plural, other {#行}}はすでに処理済みでした',
  'import.results.failed': '{count, plural, other {#行}}が失敗しました',
  'import.results.retry': '残りの行を再度適用',
  'import.results.openDrafts': '下書きを開く',
  'import.results.unavailable': '利用不可',

  'import.history.heading': '以前のインポート',
  'import.history.empty': 'まだインポートはありません。',
  'import.history.open': '開く',

  'import.a11y.rowsTable': 'マニフェストの行とその問題',
  'import.a11y.stepList': 'インポートの手順',
  'import.a11y.uploadedFile': '選択されたファイル: {filename}',

  'import.error.emptyFile': 'そのファイルには行がありません。',
  'import.error.missingColumn': '列{column}がありません。',
  'import.error.unknownColumn': '列{column}は認識されなかったため無視されます。',
  'import.error.duplicateRowId': '行ID {value}がこのファイル内で複数回使用されています。',
  'import.error.required': 'このセルは空にできません。',
  'import.error.invalidCell': 'このセルは読み取れない形式です。',
  'import.error.rowShape': 'この行には{actual}個のセルがありますが、ヘッダーには{expected}個あります。',
  'import.error.invalidLocalTime':
    '時刻{value}は2026-09-01T10:00のようなローカルの日付と時刻ではありません。',
  'import.error.invalidTimeZone': 'ゾーン{value}はIANAタイムゾーン名ではありません。',
  'import.error.nonexistentLocalTime':
    '時刻{value}は{zone}に存在しません。時計がその時刻を飛び越えます。',
  'import.error.ambiguousLocalTime':
    '時刻{value}はその日の{zone}で2回発生します。別の時刻を選んでください。',
  'import.error.scheduleInPast': '{zone}の時刻{value}はすでに過ぎています。',
  'import.error.invalidTargets':
    '値{value}は保存済みのターゲットセットでもアカウントIDのリストでもありません。',
  'import.error.invalidMedia':
    '値{value}はメディアID、sha256チェックサム、httpsアドレスのいずれでもありません。',
  'import.error.mediaNotFound': 'このワークスペースに{value}と一致するメディアはありません。',
  'import.error.mediaImportStarted':
    '{value}のメディアを取得中です。ライブラリに追加されたらこのファイルを再度適用してください。',
  'import.error.unknownVariantTarget':
    'この行には{provider}アカウントがないため、{provider}のキャプションは使用されませんでした。',
  'import.error.applyFailed': 'この行を適用できませんでした。参照: {code}。',
  'import.error.alreadyApplied': 'この行はすでに下書きを作成しているため、そのままにされました。',
  'import.error.tooManyRows': 'ファイルの最初の{limit}行のみが読み込まれます。',
} as const;
