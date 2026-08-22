/**
 * The per platform scheduler pages.
 *
 * Rules that bind this file specifically:
 *
 *  - Not one string here names a platform, states a character ceiling, a file
 *    size or a capability. Every one of those comes from the generated
 *    datasets the page reads, so a page physically cannot claim support the
 *    connectors do not have. The strings below are labels and framing only.
 *  - The framing is always "what the platform requires" and "what this product
 *    intends to support". Never "what you can publish". No connector has
 *    passed its definition of done, so nothing publishes.
 *  - Anything a platform does not document is `common.unavailable`, never a
 *    zero and never a guess.
 */
export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': '排程，依平台區分',
  'web.meta.schedule.description':
    '首發梯次中每個平台對已連線帳號的要求、其官方 API 所強制的限制，以及本產品目前對照這些要求的進度。',
  'web.meta.schedulePlatform.title': '{platform} 的排程',
  'web.meta.schedulePlatform.description':
    '{platform} 對已連線帳號的要求、其官方 API 所強制的限制，以及本產品已建置完成的部分。',

  /* ---------------------------------------------------------------------- */
  /* Index                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': '排程，依平台區分',
  'web.schedule.index.lede':
    '首發梯次中每個平台各一個頁面。每個頁面都會說明該平台對已連線帳號的要求、其官方 API 所強制的限制，以及建置進度。每個數字都附有其來源文件，以及有人閱讀該文件的日期。',
  'web.schedule.index.listLabel': '首發梯次中的平台',
  'web.schedule.index.cohortNote':
    '此梯次是本產品正在建置以支援的平台集合，這是一項計畫，而非可用清單。',
  'web.schedule.index.limitsKnown': '已記錄限制',
  'web.schedule.index.limitsUnknown': '尚未記錄限制',

  /* ---------------------------------------------------------------------- */
  /* Platform page                                                          */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': '{platform} 的排程',
  'web.schedule.platform.lede':
    '{platform} 對已連線帳號的要求、其官方 API 所強制的限制，以及本產品目前已對照建置完成的部分。',

  'web.schedule.notice.title': '目前尚未有內容發布到 {platform}',
  'web.schedule.notice.body':
    '尚無任何連接器通過其完成定義，也沒有任何連接器在正式環境中通過驗證。此頁面說明的是該平台的要求，以及本產品打算支援的內容，並非描述一個正在運作的排程功能。',

  'web.schedule.requirements.title': '{platform} 的要求',
  'web.schedule.requirements.accountTypes': '帳號類型',
  'web.schedule.requirements.restriction': '平台限制',
  'web.schedule.requirements.cost': 'API 成本',
  'web.schedule.requirements.unavailable.title': '尚無經過審閱的連接器紀錄',
  'web.schedule.requirements.unavailable.body':
    '此平台是在上一輪連接器研究之後才加入此梯次，因此尚無記載其帳號要求的日期紀錄可供顯示。當有人閱讀官方文件並記錄下來後，它就會出現在此處。',
  'web.schedule.requirements.apiSource': '官方 API 文件',
  'web.schedule.requirements.policySource': '平台政策',

  /* ---------------------------------------------------------------------- */
  /* Limits                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': '{platform} 強制執行的限制',
  'web.schedule.limits.lede':
    '以新連線且未取得提升資格的帳號為準讀取。平台可以在不通知任何人的情況下提高或降低這些限制中的任何一項，這正是每組限制都附有讀取日期的原因。',
  'web.schedule.limits.unavailable.title': '{platform} 尚未記錄限制',
  'web.schedule.limits.unavailable.body':
    '此版本尚未提供此平台的轉接器，因此沒有已記錄的上限可供顯示。捏造的數字會比完全沒有還糟。',
  'web.schedule.limits.sourceLabel': '官方平台文件',

  'web.schedule.limits.text': '內文文字',
  'web.schedule.limits.title_field': '標題欄位',
  'web.schedule.limits.countingUnit': '字元如何計算',
  'web.schedule.limits.links': '連結如何計算',
  'web.schedule.limits.images': '每則貼文的圖片數',
  'web.schedule.limits.videos': '每則貼文的影片數',
  'web.schedule.limits.videoDuration': '影片長度',
  'web.schedule.limits.imageBytes': '最大圖片檔案',
  'web.schedule.limits.gifBytes': '最大動態圖片檔案',
  'web.schedule.limits.videoBytes': '最大影片檔案',
  'web.schedule.limits.documentBytes': '最大文件檔案',
  'web.schedule.limits.altText': '替代文字',
  'web.schedule.limits.mimeTypes': '接受的檔案類型',
  'web.schedule.limits.markdown': '格式化標記',

  'web.schedule.value.characters': '{count, plural, other {# 個字元}}',
  'web.schedule.value.files': '{count, plural, =0 {無} other {# 個檔案}}',
  'web.schedule.value.durationRange': '{min} 到 {max} 之間',
  'web.schedule.value.durationMax': '最長 {max}',
  'web.schedule.value.markdownYes': '支援',
  'web.schedule.value.markdownNo': '以純文字形式發布',

  'web.schedule.unit.utf16': '以 UTF-16 編碼單位計算，這是大多數編輯器回報字元數的方式。',
  'web.schedule.unit.grapheme': '以字素計算，因此由多個編碼點組成的表情符號，仍只計為一個字元。',
  'web.schedule.unit.weighted': '以加權方式計算，其中大多數非拉丁字元的計算值為二，而非一。',

  'web.schedule.link.none': '連結不會計入上限。',
  'web.schedule.link.actual': '連結的計算值，正好等於它所佔用的字元數。',
  'web.schedule.link.fixed':
    '每個連結都會被改寫為平台的縮網址，無論其實際長度為何，都計為 {count, plural, other {# 個字元}}。',

  /* ---------------------------------------------------------------------- */
  /* Capability state                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': '{platform} 已建置的功能',
  'web.schedule.capabilities.lede':
    '此內容是從連接器登錄產生，而非在此手動寫入。「平台未提供」是關於該平台的事實，屬於最終定論；「尚未建置」是關於本產品的事實，是在尚無任何連接器通過其完成定義時，誠實呈現的預設狀態。',
  'web.schedule.capabilities.unavailable.title': '{platform} 尚無功能紀錄',
  'web.schedule.capabilities.unavailable.body':
    '此版本中沒有轉接器，因此登錄中沒有可回報的內容。一旦有實際內容可說明，此列就會出現在功能矩陣中。',
  'web.schedule.capabilities.matrixLink': '閱讀完整功能矩陣',

  'web.schedule.next.title': '接下來可以前往哪裡',
  'web.schedule.next.body':
    '功能矩陣將每個平台與每項功能整合在一張表格中。使用情境頁面則描述本產品正在圍繞建構的工作流程。',

  /* ---------------------------------------------------------------------- */
  /* Post specs cluster (/specs)                                            */
  /* ---------------------------------------------------------------------- */

  'web.meta.specs.title': '貼文規格，依平台區分',
  'web.meta.specs.description':
    '首發梯次中每個平台對單一貼文強制執行的限制，這些內容是從連接器程式碼產生，每一項都附有其來源的官方文件，以及有人閱讀該文件的日期。',
  'web.meta.specsPlatform.title': '{platform} 的貼文規格',
  'web.meta.specsPlatform.description':
    '{platform} 已記錄的每項限制：內容為何、該數字所來自的官方文件，以及有人閱讀該文件的日期。',

  'web.specs.index.title': '貼文規格，依平台區分',
  'web.specs.index.lede':
    '每個平台的每項限制各有一個頁面。每個頁面都會說明已記錄的數值、其來源文件，以及有人閱讀該文件的日期。此處沒有任何內容是手動輸入的：這些數值是從連接器程式碼產生，因此只有資料集中確實有該數值時，才會存在頁面。',
  'web.specs.index.listLabel': '已記錄限制的平台',
  'web.specs.index.count': '{count, plural, other {# 項已記錄限制}}',
  'web.specs.index.missingTitle': '為何某個平台可能不在此列',
  'web.specs.index.missingBody':
    '只有在此版本已提供該平台的轉接器，且產生的資料集中至少有一個數值時，該平台才會出現。沒有任何記錄的平台不會有頁面，因為建立在捏造數字上的頁面，會比完全沒有頁面更糟。',
  'web.specs.index.methodTitle': '這些數值來自哪裡',
  'web.specs.index.methodBody':
    '此資料集是從連接器功能程式碼重新產生的，正是用來衡量草稿的同一套程式碼。這些數值是以新連線且未取得提升資格的帳號為準讀取。',

  'web.specs.platform.listLabel': '此平台已記錄的限制',
  'web.specs.platform.limitsTitle': '{platform} 已記錄的內容',
  'web.specs.platform.limitsBody':
    '每一列都連結到一個獨立說明其數值的頁面，並附有其來源文件。此平台未記載的限制，不會有對應的列，也不會有頁面。',

  'web.specs.detail.valueTitle': '已記錄的數值',
  'web.specs.detail.sourceLabel': '官方平台文件',
  'web.specs.detail.freshnessTitle': '此資訊的時效性',
  'web.specs.detail.freshnessBody':
    '平台可以在不公告的情況下提高或降低限制。上方的數值是以新連線且未取得提升資格的帳號為準讀取，來源旁的日期則是有人最後一次閱讀該文件的日期。',
  'web.specs.detail.checkTitle': '對照此限制檢查實際貼文',
  'web.specs.detail.checkBody':
    '發布前檢查工具會在瀏覽器中，對照某平台已記錄的每項限制來衡量草稿與媒體檔案，且不會上傳任何內容。從此頁面開啟時，會預先選取此平台。',
  'web.specs.detail.checkLink': '為此平台開啟發布前檢查工具',
  'web.specs.detail.siblingTitle': '此平台已記錄的其他所有內容',
  'web.specs.detail.siblingBody': '同一份產生資料集中的其他數值，來源方式相同。',
  'web.specs.detail.scheduleLink': '閱讀完整的平台頁面',

  'web.specs.notice.title': '這是平台限制，而非正在運作的排程功能',
  'web.specs.notice.body':
    '尚無任何連接器通過其完成定義。此頁面說明的是該平台強制執行的內容，並不代表本產品已在那裡發布。',

  'web.specs.constraint.characterLimit.name': '字元上限',
  'web.specs.constraint.characterLimit.title': '{platform} 字元上限',
  'web.specs.constraint.characterLimit.lede':
    '{platform} 透過其官方 API 接受單一貼文的最長內文文字，此數值是從發布前檢查工具用來衡量草稿的同一份產生資料集中讀取。',
  'web.specs.constraint.characterLimit.description':
    '{platform} 對單一貼文的內文文字上限，並附有其來源的官方文件與有人閱讀該文件的日期。',

  'web.specs.constraint.titleLimit.name': '標題長度上限',
  'web.specs.constraint.titleLimit.title': '{platform} 標題長度上限',
  'web.specs.constraint.titleLimit.lede':
    '{platform} API 所提供的獨立標題欄位所接受的最長標題，此數值是從發布前檢查工具用來衡量草稿的同一份產生資料集中讀取。',
  'web.specs.constraint.titleLimit.description':
    '{platform} 強制執行的標題欄位上限，並附有其來源的官方文件與有人閱讀該文件的日期。',

  'web.specs.constraint.imageSize.name': '圖片大小上限',
  'web.specs.constraint.imageSize.title': '{platform} 圖片大小上限',
  'web.specs.constraint.imageSize.lede':
    '{platform} 透過其官方 API 接受的最大靜態圖片檔案，此數值是從發布前檢查工具用來衡量檔案的同一份產生資料集中讀取。',
  'web.specs.constraint.imageSize.description':
    '{platform} 接受的最大圖片檔案，並附有其來源的官方文件與有人閱讀該文件的日期。',

  'web.specs.constraint.videoSize.name': '影片大小上限',
  'web.specs.constraint.videoSize.title': '{platform} 影片大小上限',
  'web.specs.constraint.videoSize.lede':
    '{platform} 透過其官方 API 接受的最大影片檔案，此數值是從發布前檢查工具用來衡量檔案的同一份產生資料集中讀取。',
  'web.specs.constraint.videoSize.description':
    '{platform} 接受的最大影片檔案，並附有其來源的官方文件與有人閱讀該文件的日期。',

  'web.specs.constraint.videoLength.name': '影片長度上限',
  'web.specs.constraint.videoLength.title': '{platform} 影片長度上限',
  'web.specs.constraint.videoLength.lede':
    '透過官方 API 發布到 {platform} 的影片允許的最長長度，此數值是從發布前檢查工具用來衡量檔案的同一份產生資料集中讀取。',
  'web.specs.constraint.videoLength.description':
    '發布到 {platform} 的影片可以有多長，並附有其來源的官方文件與有人閱讀該文件的日期。',

  'web.specs.constraint.imageCount.name': '每則貼文的圖片數',
  'web.specs.constraint.imageCount.title': '{platform} 每則貼文的圖片數',
  'web.specs.constraint.imageCount.lede':
    '{platform} 透過其官方 API 接受單一貼文中的圖片數量，此數值是從發布前檢查工具用來衡量草稿的同一份產生資料集中讀取。',
  'web.specs.constraint.imageCount.description':
    '{platform} 上一則貼文可容納多少張圖片，並附有其來源的官方文件與有人閱讀該文件的日期。',

  'web.specs.constraint.altTextLimit.name': '替代文字上限',
  'web.specs.constraint.altTextLimit.title': '{platform} 替代文字上限',
  'web.specs.constraint.altTextLimit.lede':
    '{platform} 透過其官方 API 接受附加圖片的最長替代文字，此數值是從發布前檢查工具用來衡量草稿的同一份產生資料集中讀取。',
  'web.specs.constraint.altTextLimit.description':
    '{platform} 對附加圖片強制執行的替代文字上限，並附有其來源的官方文件與有人閱讀該文件的日期。',

  'web.specs.constraint.fileTypes.name': '接受的檔案類型',
  'web.specs.constraint.fileTypes.title': '{platform} 接受的檔案類型',
  'web.specs.constraint.fileTypes.lede':
    '{platform} 透過其官方 API 接受的媒體類型，此內容是從發布前檢查工具用來衡量檔案的同一份產生資料集中讀取。',
  'web.specs.constraint.fileTypes.description':
    '{platform} 接受哪些媒體類型，並附有其來源的官方文件與有人閱讀該文件的日期。',
} as const;
