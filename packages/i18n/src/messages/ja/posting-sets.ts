export const postingSetMessages = {
  /* ------------------------------------------------------------- 一時停止 */
  'calendar.hold.action': '一時停止',
  'calendar.hold.resumeAction': '再開',
  'calendar.hold.badge': '一時停止中',
  'calendar.hold.badgeBilling': '請求により一時停止中',
  'calendar.hold.term': '一時停止',
  'calendar.hold.byPerson': '{date}にあなたが一時停止しました。',
  'calendar.hold.byBilling': 'ワークスペースが完全なアクセス権を失ったため、{date}に一時停止されました。',
  'calendar.hold.none': '一時停止していません',

  'calendar.hold.confirmTitle': 'この投稿を一時停止しますか?',
  'calendar.hold.confirmBody':
    'この投稿はそのまま留まり、{time}には送信されません。それまでいつでも再開できます。またはその時刻がすでに過ぎている場合は新しい時刻を選べます。',
  'calendar.hold.confirmScope':
    '一時停止はまだ起きていないことを止めます。すでにプラットフォームに公開されたものはそのまま公開され続け、一時停止によって削除も編集もされません。',
  'calendar.hold.confirmNoteLabel': 'なぜこれを一時停止しますか?(任意)',
  'calendar.hold.confirmNoteHint':
    'チームの監査記録に保存されます。どのプラットフォームにも送信されません。',
  'calendar.hold.confirm': 'この投稿を一時停止',
  'calendar.hold.cancel': '予定のままにする',

  'calendar.hold.resumeTitle': 'この投稿を再開しますか?',
  'calendar.hold.resumeBody': '{timeZone}の{time}に送信されます。',
  'calendar.hold.resumeMissedTitle': 'その時刻は過ぎています',
  'calendar.hold.resumeMissedBody':
    'この投稿は一時停止中に{time}が予定時刻でした。再開した瞬間に送信されないよう、新しい時刻を選んでください。',
  'calendar.hold.resumeTimeLabel': '新しい公開時刻',
  'calendar.hold.resumeConfirm': '再開',

  'calendar.hold.paused': '一時停止しました。再開するまで送信されません。',
  'calendar.hold.resumed': '再開しました。{time}に送信されます。',

  'calendar.hold.blocked.published':
    'この投稿はすでに送信済みです。一時停止してもプラットフォームから取り戻すことはできません。',
  'calendar.hold.blocked.inFlight':
    'この投稿は現在送信中です。一時停止するには遅すぎ、途中で止めると部分的にしか公開されない状態になる恐れがあります。',
  'calendar.hold.blocked.finished': 'この投稿はすでに完了しているため、一時停止するものがありません。',
  'calendar.hold.blocked.billing':
    'ワークスペースが完全なアクセス権を失ったため、この投稿は一時停止中です。再開するには請求の問題を解決する必要があり、スケジュールの問題ではありません。',
  'calendar.hold.blocked.billingAction': '請求設定へ',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Posting Sets',
  'set.lede':
    '「これを誰に、どのように投稿するか」を保存した答え。Setを適用すると、その設定が新しい下書きにコピーされます。',
  'set.appliedOnce':
    'Setは適用した時に一度だけ読み込まれます。後で編集しても、次の投稿の開始内容が変わるだけです。すでにそこから作成した下書きや予定投稿は、そのまま変わりません。',
  'set.empty.title': 'まだSetがありません',
  'set.empty.body': '投稿ごとに同じアカウントリストを作り直すのをやめるために、Setを作成しましょう。',
  'set.create': '新しいSet',
  'set.edit': 'Setを編集',
  'set.archive': 'Setをアーカイブ',
  'set.archived': 'アーカイブ済み',
  'set.archivedNote': 'アーカイブされたSetはセレクターに表示されません。そこから作成された投稿は変わりません。',
  'set.showArchived': 'アーカイブ済みを表示',
  'set.saved': 'Setを保存しました。',
  'set.archivedToast': 'Setをアーカイブしました。すでに作成された投稿は変わりません。',

  'set.field.name': '名前',
  'set.field.nameHint': 'セレクターで探すときの名前。プロジェクトごとに1つ。',
  'set.field.description': '説明',
  'set.field.descriptionHint': '任意。このSetが何のためのものか。',
  'set.field.targets': 'アカウント',
  'set.field.targetsHint': 'このSetから作成された投稿が開始する全アカウント。',
  'set.field.targetCount': '{count, plural, other {アカウント#件}}',
  'set.field.signature': '署名',
  'set.field.signatureNone': '署名なし',
  'set.field.approval': '承認',
  'set.field.approvalHint': 'このSetから作成された投稿が公開前に必要とする承認。',
  'set.field.schedule': '公開時期',

  'set.approval.none': '承認不要',
  'set.approval.single_approver': '指定された1名の承認者',
  'set.approval.any_approver': '任意の承認者',
  'set.approval.named_approver': '特定の承認者',
  'set.approval.policy_auto': 'ワークスペースのポリシーに従う',

  'set.slot.next_free_slot': 'キューの次の空き枠',
  'set.slot.next_free_slotHint':
    'このプロジェクトのキュールールを使って時刻を提案します。提案するだけで、承認するのはあなたです。',
  'set.slot.pick_time': '時刻を尋ねる',
  'set.slot.pick_timeHint': 'Setを適用すると、あなたが選ぶために時刻は空欄のままになります。',
  'set.slot.draft_only': '下書きのままにする',
  'set.slot.draft_onlyHint': 'Setを適用してもスケジュールにはまったく影響しません。',
  'set.slot.noRules':
    'このプロジェクトにはまだキュールールがないため、キューは最初の空き時間を提案し、そう伝えます。',
  'set.slot.rulesLink': 'キュールール',

  'set.defaults.title': 'プラットフォームごとの既定値',
  'set.defaults.body':
    '新しい投稿ごとにコピーされる初期値。後でコンポーザーでいつでも変更できます。',
  'set.defaults.add': 'プラットフォームを追加',
  'set.defaults.remove': '{platform}の既定値を削除',
  'set.defaults.privacy': '公開範囲',
  'set.defaults.privacyNone': 'プラットフォームの既定値',
  'set.defaults.bodyPrefix': '投稿前のテキスト',
  'set.defaults.bodySuffix': '投稿後のテキスト',
  'set.defaults.requireAltText': 'すべての画像に代替テキストを必須にする',
  'set.defaults.requireAltTextHint':
    'このSetから作成された投稿は、すべての画像に代替テキストが付くまでこのプラットフォームに予定できません。',
  'set.defaults.empty': 'プラットフォームごとの既定値はありません。すべてのアカウントはマスター投稿から開始します。',

  'set.error.nameTaken': 'このプロジェクトの別のSetがすでにその名前を使用しています。',
  'set.error.archived': 'このSetはアーカイブされています。編集する前に復元してください。',
  'set.error.duplicateTarget': 'そのアカウントはすでにこのSetに含まれています。',
  'set.error.duplicatePlatform': 'このSetにはすでにそのプラットフォームの既定値があります。',

  /* --------------------------------------------------- 記憶されたターゲット */
  'targetMemory.setting.title': '投稿間でアカウントを記憶する',
  'targetMemory.setting.body':
    'これをオンにすると、コンポーザーはこのプロジェクトでその人が前回選んだアカウントから新しい投稿を開始します。オンにしない限りオフのままです。',
  'targetMemory.setting.stored':
    '保存されるのはアカウントのリストのみで、それを選んだ本人のためだけに保存されます。キャプション、時刻、公開範囲の設定、承認状態は一切保存されず、プロジェクト内の他の誰もあなたのリストを見ることはできません。',
  'targetMemory.setting.offNote': 'これがオフの間は、何も保存されません。',
  'targetMemory.setting.turnOffWarning':
    'これをオフにすると、このプロジェクト内の全員の保存済み選択がすべて削除されます。',
  'targetMemory.setting.enabled': 'オン',
  'targetMemory.setting.disabled': 'オフ',
  'targetMemory.setting.saved': '設定を保存しました。',
  'targetMemory.setting.cleared': '設定を保存しました。このプロジェクトの保存済み選択は削除されました。',

  'targetMemory.composer.restored':
    '前回の{count, plural, other {#件のアカウント}}から開始しました。',
  'targetMemory.composer.droppedSome':
    '前回使用した{count, plural, other {#件のアカウント}}は、確認が必要なため除外されました。',
  'targetMemory.composer.droppedAll':
    '前回使用したアカウントは現在どれも利用できないため、何も事前選択されませんでした。',
  'targetMemory.composer.undo': '選択をクリア',
  'targetMemory.composer.forget': 'アカウントの記憶を停止する',
  'targetMemory.composer.forgotten': '保存された選択は削除されました。',
  'targetMemory.composer.reviewAccounts': 'アカウントを確認',
} as const;
