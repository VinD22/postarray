/**
 * The three project-led use case pages.
 *
 * These describe workflows, not capabilities. The rule that binds every string
 * here: a sentence may describe how the product is designed and what has been
 * built, and may never imply that anything reaches a platform. Nothing
 * publishes, so "what works today" is written in the past and present tense of
 * the build, not of a live service.
 */
export const webUseCaseMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.useCases.title': '使用情境',
  'web.meta.useCases.description':
    '本產品正在圍繞建構的三種工作流程：在同一處管理多個客戶、在內容發布前完成核准，以及將一個構想帶到多個平台而不必重寫。',
  'web.meta.useCase.clients.title': '管理多個客戶',
  'web.meta.useCase.clients.description':
    '獨立的專案、獨立的連線帳號、獨立的核准與獨立的報表，適合代表他人發布內容的團隊。',
  'web.meta.useCase.approvals.title': '核准工作流程',
  'web.meta.useCase.approvals.description':
    '草稿如何成為已核准的貼文：由誰審閱、什麼情況會讓核准失效，以及為何同一項規則在每個介面都成立。',
  'web.meta.useCase.crossPlatform.title': '跨平台發布',
  'web.meta.useCase.crossPlatform.description':
    '一份主要草稿、每個平台各一個適配版本，並在排程前對照每個平台已記錄的限制進行驗證。',

  /* ---------------------------------------------------------------------- */
  /* Shared furniture                                                       */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': '使用情境',
  'web.useCases.index.lede':
    '本產品正在圍繞建構的三種工作流程。每個頁面都會說明這項工作流程今日對團隊造成什麼成本、產品的設計方式，以及實際已建置完成的部分。',
  'web.useCases.index.listLabel': '使用情境',

  'web.useCases.notice.title': '這說明的是一種設計，而非正在運作的服務',
  'web.useCases.notice.body':
    '目前沒有任何連接器在正式環境中通過驗證，因此本頁面目前尚未發布任何內容到任何地方。工作流程中已建置完成的部分會如實說明，尚未建置的部分也會如實說明。',

  'web.useCases.section.problem': '問題',
  'web.useCases.section.approach': '產品的設計方式',
  'web.useCases.section.today': '實際已建置完成的部分',
  'web.useCases.section.related': '相關內容',

  /* ---------------------------------------------------------------------- */
  /* Managing multiple clients                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': '管理多個客戶',
  'web.useCases.clients.lede': '一位客戶的工作，絕不該只差一次誤按，就落入另一位客戶的受眾眼前。',
  'web.useCases.clients.problem':
    '大多數團隊靠謹慎來區隔客戶。一個共用帳號裡放著每個已連線的頁面，一份行事曆放著每個排程，唯一擋在客戶草稿與錯誤受眾之間的，是傍晚六點時盯著螢幕的那個人。當有人離開團隊時，這種區隔也會隨著那個習慣一起消失。',
  'web.useCases.clients.approach1':
    '專案就是區隔的單位。已連線帳號、草稿、佇列、媒體與收據都屬於某個專案，成員只能看到自己被加入的專案。',
  'web.useCases.clients.approach2':
    '這種區隔會被執行三次：在身分驗證時、在授權該動作的應用程式服務中，以及在資料庫本身透過資料列層級安全性。已登入絕不會被視為一種權限。',
  'web.useCases.clients.approach3':
    '報表也遵循同樣的邊界，因此每個客戶各自的報表是預設形式，而不是有人手動彙整的試算表。',
  'web.useCases.clients.today':
    '專案、以專案為範圍的成員資格，以及背後的資料列層級安全性政策都已建置並經過測試，包含嘗試跨專案讀取並確認其會失敗的測試。方案的規模是依團隊所需的專案數量來設定。目前尚未有任何專案發布內容到任何平台。',

  /* ---------------------------------------------------------------------- */
  /* Approval workflows                                                     */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': '核准工作流程',
  'web.useCases.approvals.lede': '唯有被核准的內容就是真正發布的內容時，核准才有意義。',
  'web.useCases.approvals.problem':
    '核准通常發生在發布工具之外。螢幕截圖傳給客戶，客戶回覆同意，接著文案又改了。此時核准所指的草稿已經沒有人擁有，而工具完全不知情，於是它就發布了最後拿到的任何內容。',
  'web.useCases.approvals.approach1':
    '核准會附著在確實被審閱過的內容上。編輯已核准的草稿會讓該核准失效，並說明哪個欄位變更了，而不是悄悄地把舊決定沿用下去。',
  'web.useCases.approvals.approach2':
    '審閱者可以核准、要求修改或拒絕，除了核准以外的任何決定都需要留言，讓作者不必猜測該修改什麼。',
  'web.useCases.approvals.approach3':
    '此規則位於共用的應用程式層，因此網頁應用程式、REST API、MCP 伺服器、CLI 與 webhook 都必須遵守。沒有任何介面能繞過審閱。',
  'web.useCases.approvals.today':
    '核准狀態、審閱介面、重新核准的規則，以及背後的稽核事件都已建置完成。尚未建置的是最後一步，因為目前沒有任何連接器通過其完成定義，因此一則已核准的貼文目前尚無處可去。',

  /* ---------------------------------------------------------------------- */
  /* Cross-platform publishing                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': '跨平台發布',
  'web.useCases.crossPlatform.lede':
    '一個構想、一次編輯，以及每個平台各自尊重該平台實際接受內容的版本。',
  'web.useCases.crossPlatform.problem':
    '在每處都發布相同文字，會產生在某平台被截斷、在另一平台缺少必要標題，並在第三個平台被悄悄移除連結的版本。另一個選擇（手動重寫五次）正是工作量真正流向的地方。',
  'web.useCases.crossPlatform.approach1':
    '一份主要草稿承載構想。每個選定的帳號都有自己的版本，對主要草稿的編輯只會套用到合適之處，並清楚說明哪些目標無法採用該編輯，以及原因。',
  'web.useCases.crossPlatform.approach2':
    '驗證是依照每個平台已記錄的限制執行，並以該平台實際的計算方式計算，因此字元上限會在使用字素的平台以字素檢查，在使用加權單位的平台則以加權單位檢查。',
  'web.useCases.crossPlatform.approach3':
    '本網站任何地方顯示的每一項平台限制，都是從連接器登錄產生，並附有其來源文件與有人閱讀該文件的日期。',
  'web.useCases.crossPlatform.today':
    '撰寫工具、各目標的版本、驗證規則，以及產生的限制資料集都已建置完成。發布這一步則尚未完成：目前沒有任何連接器在正式環境中通過驗證，因此已通過驗證的草稿只能在內部排程，尚無法送達任何平台。',
} as const;
