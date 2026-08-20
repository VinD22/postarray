/**
 * Bulk CSV import.
 *
 * Two groups of strings. The `import.error.*` keys are the ones the parser and
 * the apply step emit: they are stored on a row, rendered in the report and
 * written into the downloadable CSV, so they have to make sense to someone
 * reading a spreadsheet rather than a screen. Everything else is the wizard.
 *
 * The copy says drafts wherever drafts are what happens, and it says schedule
 * only on the step where a person chooses it. Nothing here promises that a post
 * reaches a platform.
 */
export const importMessages = {
  'import.title': '從 CSV 匯入貼文',
  'import.subtitle': '上傳試算表，先確認它會做什麼，再決定是否套用。上傳只會檢查檔案，不會建立任何內容。',

  'import.step.upload': '上傳',
  'import.step.columns': '欄位',
  'import.step.review': '檢閱',
  'import.step.apply': '套用',
  'import.step.results': '結果',
  'import.step.position': '第 {current} 步，共 {total} 步',

  'import.upload.heading': '選擇 CSV 檔案',
  'import.upload.help': '僅限 CSV。不會讀取 .xlsx 等試算表檔案，請先將你的試算表匯出為 CSV。',
  'import.upload.field': 'CSV 檔案',
  'import.upload.fieldHelp': '選擇檔案，或將資料列貼到下方欄位中。',
  'import.upload.paste': '或貼上 CSV 文字',
  'import.upload.pasteHelp': '請包含標題列。在建立任何內容前，一切都會先經過檢查。',
  'import.upload.project': '專案',
  'import.upload.projectHelp': '同一個檔案中的每一列都屬於此專案。',
  'import.upload.submit': '檢查此檔案',
  'import.upload.submitting': '正在讀取檔案',
  'import.upload.allowPast': '允許已過去的時間',
  'import.upload.allowPastHelp': '預設為關閉。日期在過去的資料列會被回報，讓你自行修正，而不會被自動調整。',
  'import.upload.tooLarge': '該檔案超過 {limit} 個字元。請將它拆分後再試一次。',
  'import.upload.duplicate': '這是你先前已上傳過的相同檔案，因此你看到的是那次匯入，而非第二份副本。',

  'import.template.heading': '各欄位的意義',
  'import.template.download': '下載 CSV 範本',
  'import.template.required': '必要欄位',
  'import.template.optional': '選填欄位',
  'import.column.external_row_id': '此資料列的自訂 ID，必須在檔案內是唯一的。',
  'import.column.project': '此資料列所屬的專案名稱或 ID。',
  'import.column.targets': '可為 set: 開頭加上目標組合 ID，或以直線分隔的帳號 ID 清單。',
  'import.column.caption': '貼文內容文字。',
  'import.column.scheduled_local_time': '本地日期與時間，格式如 2026-09-01T10:00。',
  'import.column.time_zone': '判讀本地時間所用的 IANA 時區，例如 Europe/Berlin。',
  'import.column.media': '媒體 ID、sha256: 加上你已擁有媒體的校驗碼，或供伺服器擷取的 https 位址。',
  'import.column.title': '標題，適用於使用標題欄位的目的地。',
  'import.column.destination': '帳號內的頁面、看板或頻道。',
  'import.column.privacy': '目的地所需的隱私設定值。',
  'import.column.first_comment': '貼文發布後作為第一則留言發布的文字。',
  'import.column.approval_policy': '要附加到每則草稿上的核准政策。',
  'import.column.perPlatform':
    '以平台名稱命名的 caption_ 或 title_ 欄位，只會覆寫該平台，例如 caption_instagram。',

  'import.columns.heading': '欄位檢查',
  'import.columns.ok': '所有必要欄位皆已齊全。',
  'import.columns.missing': '{count, plural, other {缺少 # 個必要欄位}}',
  'import.columns.unknown': '{count, plural, other {有 # 個欄位無法辨識，已略過}}',
  'import.columns.present': '找到的欄位',

  'import.review.heading': '此檔案將執行的動作',
  'import.review.counts':
    '{valid, plural, =0 {沒有已就緒的資料列} other {# 列已就緒}}，{invalid, plural, =0 {沒有需要處理的} other {# 列需要處理}}。',
  'import.review.empty': '此檔案中未讀取到任何資料列。',
  'import.review.rowsHeading': '資料列',
  'import.review.filterAll': '所有資料列',
  'import.review.filterValid': '已就緒',
  'import.review.filterInvalid': '需要處理',
  'import.review.filterFailed': '失敗',
  'import.review.downloadErrors': '將問題下載為 CSV',
  'import.review.parsedWith': '以剖析器 {version} 讀取',

  'import.table.row': '資料列 ID',
  'import.table.line': '行號',
  'import.table.state': '狀態',
  'import.table.caption': '內容',
  'import.table.time': '已排程',
  'import.table.problems': '問題',
  'import.table.draft': '草稿',
  'import.table.noProblems': '無',

  'import.state.pending': '尚未檢查',
  'import.state.valid': '已就緒',
  'import.state.invalid': '需要處理',
  'import.state.applied': '已建立草稿',
  'import.state.skipped': '已完成過',
  'import.state.failed': '失敗',

  'import.job.state.uploaded': '已上傳',
  'import.job.state.validating': '檢查中',
  'import.job.state.validated': '已檢查',
  'import.job.state.applying': '套用中',
  'import.job.state.applied': '已套用',
  'import.job.state.failed': '無法讀取',

  'import.apply.heading': '要對已就緒的資料列做什麼？',
  'import.apply.drafts': '建立草稿',
  'import.apply.draftsHelp': '預設選項。每一列已就緒的資料都會成為可開啟、編輯與核准的草稿，不會排程任何內容。',
  'import.apply.scheduled': '建立草稿並排程',
  'import.apply.scheduledHelp':
    '每一列已就緒的資料都會成為草稿，並採用檔案中寫定的時間。只有在時間正確時才選擇此選項。',
  'import.apply.confirm': '套用 {count, plural, other {# 列}}',
  'import.apply.confirmScheduled': '建立並排程 {count, plural, other {# 列}}',
  'import.apply.running': '正在套用資料列',
  'import.apply.safeToRepeat': '重複套用兩次是安全的。已建立草稿的資料列不會受到影響。',

  'import.results.heading': '結果',
  'import.results.applied': '{count, plural, other {已建立 # 則草稿}}',
  'import.results.skipped': '{count, plural, other {# 列先前已完成}}',
  'import.results.failed': '{count, plural, other {# 列失敗}}',
  'import.results.retry': '再次套用剩餘的資料列',
  'import.results.openDrafts': '開啟草稿',
  'import.results.unavailable': '無法使用',

  'import.history.heading': '先前的匯入紀錄',
  'import.history.empty': '尚無匯入紀錄。',
  'import.history.open': '開啟',

  'import.a11y.rowsTable': '清單資料列及其問題',
  'import.a11y.stepList': '匯入步驟',
  'import.a11y.uploadedFile': '已選取的檔案：{filename}',

  'import.error.emptyFile': '該檔案中沒有任何資料列。',
  'import.error.missingColumn': '缺少 {column} 欄位。',
  'import.error.unknownColumn': '{column} 欄位無法辨識，已被忽略。',
  'import.error.duplicateRowId': '資料列 ID {value} 在此檔案中被使用了多次。',
  'import.error.required': '此欄位不可為空白。',
  'import.error.invalidCell': '此欄位不是我們能夠讀取的格式。',
  'import.error.rowShape': '此行有 {actual} 個欄位，但標題有 {expected} 個。',
  'import.error.invalidLocalTime': '時間 {value} 不是有效的本地日期與時間，例如 2026-09-01T10:00。',
  'import.error.invalidTimeZone': '時區 {value} 不是有效的 IANA 時區名稱。',
  'import.error.nonexistentLocalTime': '時間 {value} 在 {zone} 中並不存在，時鐘會跳過這段時間。',
  'import.error.ambiguousLocalTime': '時間 {value} 在 {zone} 的當日會出現兩次，請選擇其他時間。',
  'import.error.scheduleInPast': '{zone} 時區的 {value} 時間已經過去。',
  'import.error.invalidTargets': '值 {value} 並非已儲存的目標組合，也不是帳號 ID 清單。',
  'import.error.invalidMedia': '值 {value} 並非媒體 ID、sha256 校驗碼或 https 位址。',
  'import.error.mediaNotFound': '此工作區中沒有符合 {value} 的媒體。',
  'import.error.mediaImportStarted': '正在擷取 {value} 的媒體。待其進入媒體庫後，請再次套用此檔案。',
  'import.error.unknownVariantTarget': '此資料列沒有 {provider} 帳號，因此未使用 {provider} 的內容。',
  'import.error.applyFailed': '無法套用此資料列。參考代碼：{code}。',
  'import.error.alreadyApplied': '此資料列先前已建立草稿，因此未被變更。',
  'import.error.tooManyRows': '檔案僅會讀取前 {limit} 列。',
} as const;
