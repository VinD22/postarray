/**
 * The in-page product demonstration: the hero demonstration on the home page
 * and the guided walkthrough at `/demo`.
 *
 * Rules that bind this file specifically:
 *
 *  - Every panel on those surfaces is built from the real design system, so a
 *    reader is looking at the interface rather than at a drawing of it. The
 *    copy must therefore never describe something the interface does not do.
 *  - The content is sample content for a company that does not exist, and it
 *    says so in words, in the caption a screen reader reads with the figure.
 *  - No number here is an engagement number. There is no follower count, no
 *    reach figure and no score, because the product has no such data and a
 *    demonstration that invents one is a fabricated dashboard.
 *  - Nothing publishes today. No connector has passed provider verification,
 *    so the demonstration stops at the point the product stops: a scheduled
 *    post, an approval, and a receipt whose publishing half is unavailable.
 *  - The demonstration submits nothing. It has no form, no destination and no
 *    account behind it, and the copy must not suggest otherwise.
 */
export const webDemoMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata and navigation                                                 */
  /* ---------------------------------------------------------------------- */

  'web.meta.demo.title': '了解 Post Array 如何運作',
  'web.meta.demo.description':
    '一段引導式導覽，展示從新專案到收據的發布工作流程，以真實介面搭配範例內容呈現。目前尚未發布任何內容，此導覽會說明界線在哪裡。',

  'web.demo.nav.label': '看看它如何運作',
  'web.demo.nav.summary': '依照你會實際接觸的順序，以真實介面搭配範例內容呈現的產品導覽。',

  /* ---------------------------------------------------------------------- */
  /* The frame every demonstration panel sits in                             */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': '示範',
  'web.demo.frame.sample':
    '這是以真實介面建構、填入不存在公司的範例內容的示範，並非真實帳號，此處沒有任何內容會被送出。',

  'web.demo.control.pause': '暫停示範',
  'web.demo.control.play': '播放示範',
  'web.demo.control.replay': '重新播放示範',

  /* ---------------------------------------------------------------------- */
  /* The home page hero demonstration                                        */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.viewCta': '觀看示範',
  'web.demo.hero.projectsLine':
    '一個帳號經營多個業務。每個專案都是獨立的業務，有自己連結的帳號、自己的行事曆和自己的核准流程；你在同一個選單中切換它們，就像在搜尋主控台中切換資源一樣。',
  'web.demo.hero.projectsChip': '{count, plural, other {# 個帳號}}',
  'web.demo.hero.caption':
    '一份草稿變成每個平台各一個版本，取得一個時間，並出現在這一週中。這是範例內容，並非真實帳號。',
  'web.demo.hero.more': '走過完整的工作流程',

  /* ---------------------------------------------------------------------- */
  /* The walkthrough page                                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': '運作方式，依照你會接觸到的順序',
  'web.demo.lede':
    '九個步驟，從空白的工作區到記錄下發生了什麼事。每個步驟都會展示你實際會看到的畫面，並填入範例內容。此頁面上沒有任何內容會自行移動，因此你可以按自己的步調閱讀。',
  'web.demo.notice.title': '這是一段示範，並非真實帳號',
  'web.demo.notice.body':
    '此處每個面板都是填入範例內容的產品介面。尚無任何連接器完成供應商驗證，因此本產品今日尚未透過任何平台發布任何內容。工作流程在哪裡停止，頁面就會如實說明，而不會把後續內容畫出來。',
  'web.demo.contents.title': '九個步驟',
  'web.demo.stepLabel': '第 {position} 步，共 {total} 步',
  'web.demo.next': '下一步：{step}',
  'web.demo.closing.pricing': '查看價格',
  'web.demo.closing.title': '這就是完整的循環',
  'web.demo.closing.body':
    '以上內容並非我們希望打造的產品模型，而是介面目前的實際樣貌，並誠實標示發布這一半尚未完成。',

  /* ---------------------------------------------------------------------- */
  /* The nine steps                                                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': '建立專案',
  'web.demo.step.project.body':
    '一個專案承載帳號、草稿、核准與時區。產品中的每個查詢都限定在單一專案範圍內，在應用程式服務與資料庫中各執行一次，因此一位客戶不會意外看到另一位客戶的內容。',

  'web.demo.step.connect.title': '連線一個帳號',
  'web.demo.step.connect.body':
    '連線只會透過官方平台 API 進行，並會在你開始之前告訴你該平台對帳號有什麼要求。目前每個連接器都停在驗證這一步，這也是為何下方每一列會如實說明，而不是顯示綠色勾號。',

  'web.demo.step.compose.title': '一次撰寫，依平台各自調整',
  'web.demo.step.compose.body':
    '你撰寫一份主要草稿。選取一個帳號會開啟僅限該帳號的覆寫內容，各自擁有自己的限制與自己的預覽畫面。你為 LinkedIn 所寫的任何內容，都不會改變 X 所收到的內容，且每個版本底下的檢查都會在任何內容被排程之前執行。',

  'web.demo.step.variants.title': '查看每個帳號實際收到的內容',
  'web.demo.step.variants.body':
    '一份草稿會變成每個帳號各一個版本，每個版本都為其目標平台撰寫：X 用較短的一句話、LinkedIn 用完整的發布說明、Instagram 則有一段文案與替代文字。你可以個別編輯其中任何一個，而不會影響其他版本，且每個版本都會帶有適用於它的檢查。',

  'web.demo.step.schedule.title': '指定一個時間，或交給佇列處理',
  'web.demo.step.schedule.body':
    '時間會以「一個時刻加上專案時區」儲存，絕不會是單純的本地時間，因此夏令時間的變動不會在你不知情的情況下移動任何內容。佇列是另一條路徑：它會採用你所設定規則所允許的下一個時段。',

  'web.demo.step.calendar.title': '查看行事曆',
  'web.demo.step.calendar.body':
    '這一週會顯示每則貼文的平台、帳號、狀態與時間。移動一則貼文既可以用按鈕，也可以用拖曳，因此行事曆完全可以只用鍵盤操作。',

  'web.demo.step.receipt.title': '事後閱讀收據',
  'web.demo.step.receipt.body':
    '每一次嘗試都會寫入一份不可變更的收據：誰撰寫了它、誰核准了它、依照哪項政策、在哪個時刻。該紀錄中發布的那一半，是由發布執行程序寫入的，而這部分目前尚不存在。',

  /* ---------------------------------------------------------------------- */
  /* Panel labels                                                            */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': '專案',
  'web.demo.project.zone': '時區：{zone}',
  'web.demo.project.scope': '草稿、帳號、核准與收據都只屬於此專案，不屬於其他任何地方。',

  'web.demo.accounts.label': '此專案中的帳號',
  'web.demo.accounts.state': '驗證尚未完成',
  'web.demo.accounts.note':
    '每一列都會顯示權杖健康狀態、已授予的權限，以及最後一次成功發布的貼文。目前這些帳號都無法發布。',

  'web.demo.master.label': '主要草稿',
  'web.demo.master.project': '位於專案 {project}',

  'web.demo.variants.label': '每個帳號收到的內容',

  'web.demo.schedule.label': '已排程',
  'web.demo.schedule.value': '{zone} 的 {when}',
  'web.demo.schedule.approval': '在任何內容可以送出之前，都需要一次核准。',
  'web.demo.schedule.queue': '佇列是另一條路徑：它會依此時區內你設定規則所允許的下一個時段來選取。',

  'web.demo.week.label': '這一週',
  'web.demo.week.caption': '行事曆上相同的三則貼文，以專案時區判讀。',
  'web.demo.week.empty': '尚無已排程項目',

  'web.demo.receipt.label': '目前為止的收據',
  'web.demo.receipt.pending':
    '送出的內容、平台的回覆、外部貼文 ID 與永久連結，都是由發布執行程序寫入。在有連接器通過供應商驗證之前，這些內容都會維持無法使用的狀態。',
  'web.demo.receipt.field.externalId': '外部貼文 ID',
  'web.demo.receipt.field.permalink': '永久連結',

  /* ---------------------------------------------------------------------- */
  /* Sample content                                                          */
  /*                                                                         */
  /* Northbound Tools is the sample company the marketing pages already use.  */
  /* Its handles sit on the reserved `.example` domain and its people are     */
  /* first names with no surname, so nothing here can be mistaken for a real  */
  /* customer, a real account or a real endorsement.                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools（範例）',
  'web.demo.sample.actor': 'Ada，範例團隊成員',
  'web.demo.sample.approver': 'Ravi，範例審閱者',
  'web.demo.sample.policy': '送出前需要一次核准',
  'web.demo.sample.master':
    'Northbound 2.4 今日推出。匯入速度更快，搜尋新增了鍵盤快捷鍵，兩位使用者回報的匯出錯誤也已修復。',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'Northbound 2.4 已推出。匯入速度更快、支援鍵盤搜尋，該匯出錯誤也已修復。',
  'web.demo.sample.x.check': '字元數與串文順序',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    'Northbound 2.4 今日推出。發布說明完整解釋了匯入的變更與匯出的修復內容。',
  'web.demo.sample.linkedin.check': '組織角色與貼文長度',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    '同一張發布圖片，搭配為動態消息撰寫的文案，以及由真人撰寫的替代文字。',
  'web.demo.sample.instagram.check': '帳號類型、長寬比與替代文字',

  /* ---------------------------------------------------------------------- */
  /* The nine scene product tour                                             */
  /*                                                                         */
  /* The step names are the indicator's button labels, so they are short      */
  /* enough to sit in a row of nine and specific enough to be worth clicking. */
  /* They are also the labels of the stacked walkthrough a reader gets with   */
  /* reduced motion or no JavaScript, which is the same tour with the timing  */
  /* taken out rather than a reduced version of it.                           */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': '導覽步驟',
  'web.demo.tour.jump': '顯示第 {position} 步：{step}',
  'web.demo.tour.step.project': '建立專案',
  'web.demo.tour.step.connect': '連線帳號',
  'web.demo.tour.step.compose': '一次撰寫',
  'web.demo.tour.step.variants': '依平台調整',
  'web.demo.tour.step.validate': '檢查它',
  'web.demo.tour.step.schedule': '指定一個時間',
  'web.demo.tour.step.week': '查看這一週',
  'web.demo.tour.step.publish': '發布並記錄',
  'web.demo.tour.step.digest': '閱讀摘要',

  /* ---------------------------------------------------------------------- */
  /* Checks (step 5)                                                         */
  /*                                                                         */
  /* Only checks the composer genuinely runs today: the per account character */
  /* limit (`validation.text_too_long`), alt text on every image             */
  /* (`validation.alt_text_missing`), and whether a first comment is allowed  */
  /* on the account it was written for (the `firstComment` capability).       */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': '排程前的檢查',
  'web.demo.validate.check.length': '字元上限，依帳號區分',
  'web.demo.validate.check.lengthDetail': '每個版本都會依照平台給予該帳號的限制進行衡量。',
  'web.demo.validate.check.altText': '每張圖片的替代文字',
  'web.demo.validate.check.altTextDetail': '沒有描述、也未標示為裝飾用途的圖片，會阻擋排程。',
  'web.demo.validate.check.firstComment': '此處是否允許第一則留言',
  'web.demo.validate.check.firstCommentDetail': '第一則留言僅在其平台支援此功能的帳號上提供。',
  'web.demo.validate.note':
    '這些檢查會在任何內容被排程之前於撰寫工具中執行，並在任何內容送出之前再次執行。',

  /* ---------------------------------------------------------------------- */
  /* Publish and receipt (step 8)                                            */
  /*                                                                         */
  /* The steps a scheduled post has really passed are completed. Everything   */
  /* the publish run would write is pending, because no connector has passed  */
  /* provider verification, so there is no publish run to write it.           */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': '發布及其紀錄',
  'web.demo.live.step.approved': '由 {approver} 核准',
  'web.demo.live.step.queued': '已進入佇列等候其時段',
  'web.demo.live.step.sent': '已送至平台',
  'web.demo.live.step.confirmed': '已由平台確認',
  'web.demo.live.badge.pending': '尚未發布',
  'web.demo.live.badge.live': '已上線',
  'web.demo.live.pending':
    '最後兩個步驟是由發布執行程序寫入。尚無任何連接器完成供應商驗證，因此這兩步仍在等待中，外部貼文 ID 與永久連結也仍無法使用。',

  /* ---------------------------------------------------------------------- */
  /* The weekly digest (step 9)                                              */
  /*                                                                         */
  /* Sentences about what the product did, never engagement figures. There is */
  /* no reach, no impression count and no score here, because the product has */
  /* none to read and a digest that invented one would be a fabricated        */
  /* dashboard with a friendlier voice.                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': '你的這一週，以句子呈現',
  'web.demo.digest.sample': '範例',
  'web.demo.digest.line.variants': '本週有三個平台專屬版本，從一份草稿發送出去。',
  'web.demo.digest.line.earliest': '週二早上是你最早的時段。',
  'web.demo.digest.line.approval': '每個版本在進入佇列前都已核准。',
  'web.demo.digest.line.alt': '每張圖片都帶有真人撰寫的替代文字。',
  'web.demo.digest.footer': '當你的貼文發布後，即時分析數據會顯示在這裡。',

  /* ---------------------------------------------------------------------- */
  /* The three added walkthrough steps                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': '在排程前先檢查',
  'web.demo.step.validate.body':
    '撰寫工具會依照每個版本所撰寫的目標帳號進行衡量：該帳號實際的字元上限、每張圖片的替代文字，以及該平台是否提供第一則留言功能。任何未通過檢查的版本都無法排程。',

  'web.demo.step.publish.title': '發布，並保留紀錄',
  'web.demo.step.publish.body':
    '發布執行程序會在各自的時刻送出每個版本，記錄平台的回覆內容，並寫入一份不可變更的收據。該執行程序正是目前尚不存在的部分，因此下方最後兩個步驟仍處於等待狀態，而非被畫成已完成。',

  'web.demo.step.digest.title': '閱讀每週摘要',
  'web.demo.step.digest.body':
    '此摘要以句子說明產品做了什麼：從一份草稿發出了多少個版本、哪個時段最早、什麼內容被核准了。它不帶任何互動數據，因為分析數據要等貼文發布後才會來自各平台，而目前尚未有任何內容發布。',
} as const;
