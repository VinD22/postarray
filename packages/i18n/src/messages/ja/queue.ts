export const queueMessages = {
  'queue.title': '投稿キュー',
  'queue.subtitle':
    'このプロジェクトがいつ、どのくらいの間隔で投稿できるか。人が承認しない限り何も投稿されません。',

  'queue.rules.heading': 'キュールール',
  'queue.rules.empty':
    'まだキュールールがありません。追加するまでは、次の枠は単純に最初の空き時間になります。',
  'queue.rules.create': '新しいキュールール',
  'queue.rules.count': '{count, plural, other {ルール#件}}',
  'queue.rules.enabled': '使用中',
  'queue.rules.disabled': '一時停止中',
  'queue.rules.archived': 'アーカイブ済み',
  'queue.rules.edit': 'ルールを編集',
  'queue.rules.archive': 'ルールをアーカイブ',
  'queue.rules.archiveHelp':
    'アーカイブすると今後の提案が止まります。すでに予約済みの枠はその時刻と理由を保持します。',

  'queue.field.name': 'ルール名',
  'queue.field.nameHelp': '後で見分けられる名前、例えば「平日の朝」など。',
  'queue.field.timeZone': 'タイムゾーン',
  'queue.field.timeZoneHelp': '時間枠、1日あたりの件数、休止日はすべてこのゾーンで読み取られます。',
  'queue.field.minimumGap': '最小間隔',
  'queue.field.minimumGapHelp': '投稿間の分数。0は間隔ルールなしを意味します。',
  'queue.field.maximumPerDay': '1日の最大件数',
  'queue.field.maximumPerDayHelp':
    '1日の上限を設けない場合は空欄のままにします。0はこのルールが何も提案しないことを意味します。',
  'queue.field.maximumPerDayUnlimited': '1日の上限なし',
  'queue.field.priority': '優先度',
  'queue.field.priorityHelp': '枠を提供できる最も優先度の高いルールが使用されます。',
  'queue.field.enabled': 'このルールを使用する',

  'queue.windows.heading': '週次の時間枠',
  'queue.windows.help':
    'このプロジェクトが投稿できるローカル時間を選びます。曜日と時刻のフィールド、またはグリッド上のボタンを使用してください。',
  'queue.windows.empty': 'まだ時間枠がありません。時間枠のないルールは決して枠を提供できません。',
  'queue.windows.add': '時間枠を追加',
  'queue.windows.remove': '時間枠を削除',
  'queue.windows.entry': '{weekday}、{start}から{end}まで',
  'queue.windows.start': '開始',
  'queue.windows.end': '終了',
  'queue.windows.weekday': '曜日',
  'queue.windows.toggleCell': '{weekday}の{hour}',
  'queue.windows.gridLabel': '週次の空き状況、曜日と時間ごとに1つのボタン',

  'queue.weekday.1': '月曜日',
  'queue.weekday.2': '火曜日',
  'queue.weekday.3': '水曜日',
  'queue.weekday.4': '木曜日',
  'queue.weekday.5': '金曜日',
  'queue.weekday.6': '土曜日',
  'queue.weekday.7': '日曜日',

  'queue.blackouts.heading': '休止日',
  'queue.blackouts.help':
    'このプロジェクトが投稿しない日付。ルールのタイムゾーンで読み取られます。',
  'queue.blackouts.empty': '休止日はありません。',
  'queue.blackouts.add': '休止日を追加',
  'queue.blackouts.remove': '休止日を削除',
  'queue.blackouts.from': '開始日',
  'queue.blackouts.to': '終了日',
  'queue.blackouts.entry': '{from}から{to}まで',

  'queue.connections.heading': 'アカウント',
  'queue.connections.all': 'このプロジェクトの全アカウント',
  'queue.connections.scoped': 'このルールが適用される{count, plural, other {#件のアカウント}}',

  'queue.slot.heading': '次のキュー枠',
  'queue.slot.action': '次のキュー枠を使用',
  'queue.slot.proposed': '{timeZone}で{local}',
  'queue.slot.utc': 'UTCでは{utc}です。',
  'queue.slot.why': 'この時刻が選ばれた理由',
  'queue.slot.accept': 'この時刻を使用',
  'queue.slot.release': '別の時刻を選ぶ',
  'queue.slot.expires': 'この提案は{expires}まで保持されます。',
  'queue.slot.unavailable': '現在キュー枠を利用できません。',
  'queue.slot.pending': '次の枠を検索中です。',
  'queue.slot.accepted': '{timeZone}で{local}に予定されています。',
  'queue.slot.notAutomatic': 'この時刻を選択するまで何も予定されません。',

  'queue.reason.noRulesConfigured':
    'このプロジェクトにはキュールールが設定されていないため、時間枠は適用されませんでした。',
  'queue.reason.fallbackFirstFreeHour': '現時点から最初の空き時間が使用されました。',
  'queue.reason.matchedRule': 'ルール「{name}」がこの時刻を{zone}で選びました。',
  'queue.reason.matchedWindow': '{zone}の{start}から{end}までの時間枠に収まります。',
  'queue.reason.minimumGap': '他のすべての投稿から少なくとも{minutes}分離れています。',
  'queue.reason.noMinimumGap': 'このルールは投稿間の最小間隔を設定していません。',
  'queue.reason.dailyCap': 'その日は最大{limit}件までで、まだ満杯ではありません。',
  'queue.reason.dailyCapUnlimited': 'このルールは1日の上限を設定していません。',
  'queue.reason.blackoutSkipped':
    'ここに到達するために{days, plural, other {休止日#日}}がスキップされました。',
  'queue.reason.dstNonexistentSkipped':
    '時間枠の最初の時刻はその日付の{zone}に存在しないため、存在する次の時刻が使用されました。',
  'queue.reason.dstAmbiguousFirst':
    'そのローカル時刻はその日付の{zone}で2回発生します。最初の発生が使用されました。',
  'queue.reason.priorityChosen':
    'このルールは優先度{priority}を持ち、提供可能な中で最も高いものでした。',
  'queue.reason.connectionScoped':
    'このルールは{count, plural, other {#件のアカウント}}を対象としています。',
  'queue.reason.horizonExhausted': '{days}日以内に空いている時間枠がありませんでした。',
} as const;
