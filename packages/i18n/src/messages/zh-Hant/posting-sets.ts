/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 *
 * Three features that all answer "who is this going to, and when", grouped in
 * one namespace so their vocabulary stays consistent. The hold copy is the part
 * most worth reading twice: pausing stops work that has not happened, and every
 * sentence here has to say that plainly rather than implying a post can be
 * pulled back off a platform.
 */
export const postingSetMessages = {
  /* ------------------------------------------------------------- the hold */
  'calendar.hold.action': '暫停',
  'calendar.hold.resumeAction': '繼續',
  'calendar.hold.badge': '已暫停',
  'calendar.hold.badgeBilling': '因帳務問題暫停',
  'calendar.hold.term': '暫留',
  'calendar.hold.byPerson': '你已於 {date} 暫停。',
  'calendar.hold.byBilling': '此工作區於 {date} 失去完整存取權限，因此已暫停。',
  'calendar.hold.none': '未暫停',

  'calendar.hold.confirmTitle': '要暫停此貼文嗎？',
  'calendar.hold.confirmBody':
    '此貼文會維持原狀，不會在 {time} 發布。你可以在該時間之前隨時繼續發布，若該時間已過，也可以另選新的時間。',
  'calendar.hold.confirmScope':
    '暫停只會阻止尚未發生的事。已發布到平台上的內容仍會維持已發布狀態，暫停不會刪除或編輯它。',
  'calendar.hold.confirmNoteLabel': '你為什麼要暫停此貼文？（選填）',
  'calendar.hold.confirmNoteHint': '會保留在團隊的稽核紀錄中，不會傳送給任何平台。',
  'calendar.hold.confirm': '暫停此貼文',
  'calendar.hold.cancel': '維持排程',

  'calendar.hold.resumeTitle': '要繼續發布此貼文嗎？',
  'calendar.hold.resumeBody': '它將於 {timeZone} 的 {time} 發布。',
  'calendar.hold.resumeMissedTitle': '該時間已經過去',
  'calendar.hold.resumeMissedBody': '此貼文原訂於暫停期間的 {time} 發布，請選擇新的時間，以免你一繼續就立即發布。',
  'calendar.hold.resumeTimeLabel': '新的發布時間',
  'calendar.hold.resumeConfirm': '繼續',

  'calendar.hold.paused': '已暫停。在你繼續之前，不會發布。',
  'calendar.hold.resumed': '已繼續。將於 {time} 發布。',

  'calendar.hold.blocked.published': '此貼文已經發布，暫停無法將它從平台上收回。',
  'calendar.hold.blocked.inFlight': '此貼文正在發送中，現在暫停已經太遲，若中途停止，可能導致只發布了一部分。',
  'calendar.hold.blocked.finished': '此貼文已經完成，因此沒有可暫停的內容。',
  'calendar.hold.blocked.billing': '此貼文因工作區失去完整存取權限而被暫留，繼續發布屬於帳務事項，而非排程事項。',
  'calendar.hold.blocked.billingAction': '前往帳務頁面',

  /* ------------------------------------------------------- posting sets */
  'set.title': '發文組合',
  'set.lede': '一個已儲存的答案，回答「我要發給誰，以及怎麼發」。套用組合會將其設定複製到新的草稿中。',
  'set.appliedOnce':
    '組合只會在你套用時被讀取一次。之後編輯它，只會改變下一則貼文的起始內容。已用它建立的草稿與已排程貼文，會維持完全不變。',
  'set.empty.title': '尚無組合',
  'set.empty.body': '建立一個組合，就不必每次發文都重新建立相同的帳號清單。',
  'set.create': '新增組合',
  'set.edit': '編輯組合',
  'set.archive': '封存組合',
  'set.archived': '已封存',
  'set.archivedNote': '已封存的組合會從選擇器中隱藏，已用其建立的貼文不受影響。',
  'set.showArchived': '顯示已封存項目',
  'set.saved': '組合已儲存。',
  'set.archivedToast': '組合已封存。已用其建立的貼文不受影響。',

  'set.field.name': '名稱',
  'set.field.nameHint': '你之後在選擇器中會尋找的名稱，每個專案各一個。',
  'set.field.description': '說明',
  'set.field.descriptionHint': '選填。此組合的用途為何。',
  'set.field.targets': '帳號',
  'set.field.targetsHint': '此組合建立的貼文，一開始會包含的每個帳號。',
  'set.field.targetCount': '{count, plural, =0 {沒有帳號} other {# 個帳號}}',
  'set.field.signature': '簽名檔',
  'set.field.signatureNone': '沒有簽名檔',
  'set.field.approval': '核准',
  'set.field.approvalHint': '以此組合建立的貼文，在發布前需要的核准方式。',
  'set.field.schedule': '何時發布',

  'set.approval.none': '不需要核准',
  'set.approval.single_approver': '一位指定核准者',
  'set.approval.any_approver': '任何核准者',
  'set.approval.named_approver': '一位特定核准者',
  'set.approval.policy_auto': '依工作區政策決定',

  'set.slot.next_free_slot': '佇列中的下一個空檔',
  'set.slot.next_free_slotHint': '使用此專案的佇列規則提供一個時間。它只是建議，由你來確認。',
  'set.slot.pick_time': '請系統詢問我時間',
  'set.slot.pick_timeHint': '套用組合時，會讓時間留白供你自行選擇。',
  'set.slot.draft_only': '維持為草稿即可',
  'set.slot.draft_onlyHint': '套用組合時，完全不會動到排程。',
  'set.slot.noRules': '此專案尚無佇列規則，因此佇列會提供最早的空檔並說明此情況。',
  'set.slot.rulesLink': '佇列規則',

  'set.defaults.title': '各平台預設值',
  'set.defaults.body': '複製到每則新貼文的起始值。之後你可以在撰寫工具中變更其中任何一項。',
  'set.defaults.add': '新增平台',
  'set.defaults.remove': '移除 {platform} 的預設值',
  'set.defaults.privacy': '隱私設定',
  'set.defaults.privacyNone': '平台預設值',
  'set.defaults.bodyPrefix': '貼文前置文字',
  'set.defaults.bodySuffix': '貼文後置文字',
  'set.defaults.requireAltText': '要求每張圖片都有替代文字',
  'set.defaults.requireAltTextHint': '在每張圖片都有替代文字之前，以此組合建立的貼文無法排程至該平台。',
  'set.defaults.empty': '沒有任何平台預設值，每個帳號都會從主要貼文開始。',

  'set.error.nameTaken': '此專案中已有其他組合使用該名稱。',
  'set.error.archived': '此組合已封存，請先還原再編輯。',
  'set.error.duplicateTarget': '該帳號已在此組合中。',
  'set.error.duplicatePlatform': '此組合已有該平台的預設值。',

  /* --------------------------------------------------- remembered targets */
  'targetMemory.setting.title': '在貼文之間記住帳號',
  'targetMemory.setting.body':
    '啟用後，撰寫工具會以該使用者在此專案中上次選擇的帳號，作為每則新貼文的起始選項。除非你開啟，否則預設為關閉。',
  'targetMemory.setting.stored':
    '僅會保存帳號清單，且僅限選擇該清單的使用者。不會儲存任何內容、時間、隱私設定或核准狀態，專案中其他人也無法看到你的清單。',
  'targetMemory.setting.offNote': '關閉時，完全不會儲存任何內容。',
  'targetMemory.setting.turnOffWarning': '關閉此功能，會刪除此專案中每個人已儲存的所有選擇。',
  'targetMemory.setting.enabled': '開啟',
  'targetMemory.setting.disabled': '關閉',
  'targetMemory.setting.saved': '設定已儲存。',
  'targetMemory.setting.cleared': '設定已儲存。此專案中已儲存的選擇已被刪除。',

  'targetMemory.composer.restored': '{count, plural, other {已以上次的 # 個帳號開始。}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, other {你上次使用的 # 個帳號因需要處理而未被納入。}}',
  'targetMemory.composer.droppedAll': '你上次使用的帳號目前皆無法使用，因此未預先選取任何帳號。',
  'targetMemory.composer.undo': '清除選擇',
  'targetMemory.composer.forget': '停止記住我的帳號',
  'targetMemory.composer.forgotten': '你已儲存的選擇已被刪除。',
  'targetMemory.composer.reviewAccounts': '檢閱帳號',
} as const;
