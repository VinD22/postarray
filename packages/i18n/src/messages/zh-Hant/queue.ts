/**
 * Queue rules and slot reservations.
 *
 * The reason keys are the ones the slot finder emits. They are the sentences a
 * person reads before they accept a proposed time, and the sentences an audit
 * reads back years later, so they say what actually happened rather than
 * congratulating anyone.
 */
export const queueMessages = {
  'queue.title': '發布佇列',
  'queue.subtitle': '此專案何時願意發布，以及間隔多久。若沒有人確認時間，就不會發布任何內容。',

  'queue.rules.heading': '佇列規則',
  'queue.rules.empty': '尚無佇列規則。在你新增規則之前，下一個時段就只是最早的空檔。',
  'queue.rules.create': '新增佇列規則',
  'queue.rules.count': '{count, plural, =0 {沒有規則} other {# 條規則}}',
  'queue.rules.enabled': '使用中',
  'queue.rules.disabled': '已暫停',
  'queue.rules.archived': '已封存',
  'queue.rules.edit': '編輯規則',
  'queue.rules.archive': '封存規則',
  'queue.rules.archiveHelp': '封存會停止未來的建議。已預留的時段仍會保留其時間與原因。',

  'queue.field.name': '規則名稱',
  'queue.field.nameHelp': '之後你能認得的名稱，例如「平日早晨」。',
  'queue.field.timeZone': '時區',
  'queue.field.timeZoneHelp': '時段、每日發布數量與封鎖日期，全都以此時區判讀。',
  'queue.field.minimumGap': '最小間隔',
  'queue.field.minimumGapHelp': '兩則貼文之間的分鐘數。0 表示不設間隔規則。',
  'queue.field.maximumPerDay': '每日上限',
  'queue.field.maximumPerDayHelp': '留空表示不設每日上限。0 表示此規則不提供任何建議。',
  'queue.field.maximumPerDayUnlimited': '每日不設上限',
  'queue.field.priority': '優先順序',
  'queue.field.priorityHelp': '能提供時段的優先順序最高的規則會被採用。',
  'queue.field.enabled': '使用此規則',

  'queue.windows.heading': '每週時段',
  'queue.windows.help': '選擇此專案可以發布的本地時間。使用日期與時間欄位，或使用網格上的按鈕。',
  'queue.windows.empty': '尚無時段。沒有時段的規則永遠無法提供任何建議。',
  'queue.windows.add': '新增時段',
  'queue.windows.remove': '移除時段',
  'queue.windows.entry': '{weekday}，{start} 到 {end}',
  'queue.windows.start': '從',
  'queue.windows.end': '到',
  'queue.windows.weekday': '星期',
  'queue.windows.toggleCell': '{weekday} {hour}',
  'queue.windows.gridLabel': '每週可用時段，每個按鈕代表一天中的一小時',

  'queue.weekday.1': '星期一',
  'queue.weekday.2': '星期二',
  'queue.weekday.3': '星期三',
  'queue.weekday.4': '星期四',
  'queue.weekday.5': '星期五',
  'queue.weekday.6': '星期六',
  'queue.weekday.7': '星期日',

  'queue.blackouts.heading': '封鎖日期',
  'queue.blackouts.help': '此專案不會發布的日期，以規則的時區判讀。',
  'queue.blackouts.empty': '沒有封鎖日期。',
  'queue.blackouts.add': '新增封鎖日期',
  'queue.blackouts.remove': '移除封鎖日期',
  'queue.blackouts.from': '起始日',
  'queue.blackouts.to': '結束日',
  'queue.blackouts.entry': '{from} 到 {to}',

  'queue.connections.heading': '帳號',
  'queue.connections.all': '此專案中的所有帳號',
  'queue.connections.scoped': '此規則適用於 {count, plural, other {# 個帳號}}',

  'queue.slot.heading': '下一個佇列時段',
  'queue.slot.action': '使用下一個佇列時段',
  'queue.slot.proposed': '{timeZone} 的 {local}',
  'queue.slot.utc': '換算為 UTC 時間即 {utc}。',
  'queue.slot.why': '為何選擇此時間',
  'queue.slot.accept': '使用此時間',
  'queue.slot.release': '選擇其他時間',
  'queue.slot.expires': '此建議會保留至 {expires}。',
  'queue.slot.unavailable': '目前沒有可用的佇列時段。',
  'queue.slot.pending': '正在尋找下一個時段。',
  'queue.slot.accepted': '已排程於 {timeZone} 的 {local}。',
  'queue.slot.notAutomatic': '在你選擇此時間之前，不會排程任何內容。',

  'queue.reason.noRulesConfigured': '此專案尚未設定任何佇列規則，因此未套用任何時段。',
  'queue.reason.fallbackFirstFreeHour': '已改用從現在起最早的空檔。',
  'queue.reason.matchedRule': '規則「{name}」以 {zone} 時區選擇了此時間。',
  'queue.reason.matchedWindow': '此時間落在 {zone} 時區的 {start} 到 {end} 時段內。',
  'queue.reason.minimumGap': '此時間與其他每則貼文至少相隔 {minutes} 分鐘。',
  'queue.reason.noMinimumGap': '此規則未設定貼文之間的最小間隔。',
  'queue.reason.dailyCap': '該日最多可有 {limit} 則貼文，且尚未額滿。',
  'queue.reason.dailyCapUnlimited': '此規則未設定每日上限。',
  'queue.reason.blackoutSkipped': '為了到達此時間，跳過了 {days, plural, other {# 個封鎖日}}。',
  'queue.reason.dstNonexistentSkipped':
    '此時段的第一個時間在 {zone} 時區的該日並不存在，因此改用了下一個實際存在的時間。',
  'queue.reason.dstAmbiguousFirst':
    '該本地時間在 {zone} 時區的當日會出現兩次，已採用第一次出現的時間。',
  'queue.reason.priorityChosen': '此規則的優先順序為 {priority}，是能提供時段中最高的。',
  'queue.reason.connectionScoped': '此規則涵蓋 {count, plural, other {# 個帳號}}。',
  'queue.reason.horizonExhausted': '在 {days} 天內找不到空檔。',
} as const;
