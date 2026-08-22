/**
 * The free tools on the public site.
 *
 * These pages exist because this repository already knows every launch cohort
 * platform's real publishing limits from its connector capability code. A tool
 * here may therefore state a number, but only a number the generated dataset
 * carries, always beside the official source and the date a person read it.
 *
 * Rules that bind this file specifically:
 *
 *  - A tool never claims the product publishes anywhere. Nothing in the launch
 *    cohort is verified for production yet, and these pages say so.
 *  - Every calculation described here runs in the reader's browser. Copy that
 *    promises privacy must stay true of the component that renders it.
 *  - No tool writes, rewrites, suggests or scores content. No tool looks up a
 *    handle, a follower count or anything else that would need an unofficial
 *    endpoint.
 *  - A limit we do not have is "unavailable". Never zero, never a guess.
 */
export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': '免費發布工具',
  'web.meta.tools.description':
    '為在多個平台發文的人提供的小型私密工具：各平台限制檢查、UTM 連結產生器、YouTube 標題長度檢查，以及時區規劃工具。',
  'web.meta.tools.preflight.title': '貼文發布前檢查工具',
  'web.meta.tools.preflight.description':
    '將一則草稿對照十個平台的文字與媒體限制進行檢查，並附有每項限制的來源與讀取日期。',
  'web.meta.tools.utm.title': 'UTM 連結產生器',
  'web.meta.tools.utm.description':
    '組合帶有標籤的行銷活動 URL，並了解每個 UTM 參數的意義，完全在你的瀏覽器中運作。',
  'web.meta.tools.youtubeTitle.title': 'YouTube 標題長度檢查工具',
  'web.meta.tools.youtubeTitle.description':
    '依照人類計算字元的方式，對照官方文件記載的上限來衡量 YouTube 標題。',
  'web.meta.tools.timeZone.title': '時區與夏令時間規劃工具',
  'web.meta.tools.timeZone.description':
    '在多個受眾時區檢視同一個發布時間，並找出因夏令時間變動而使本地時間移動的週次。',
  'web.meta.tools.engagementRate.title': '互動率計算工具',
  'web.meta.tools.engagementRate.description':
    '將互動次數除以觸及、追蹤者或曝光次數，三種簡單計算方式，沒有捏造的基準值。',

  /* ---------------------------------------------------------------------- */
  /* Shared tool furniture                                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': '免費工具',
  'web.tools.index.summary': '以我們的連接器所讀取的相同平台限制資料為基礎的小型計算工具。',
  'web.tools.index.lede':
    '四個小型工具，以我們的連接器所使用的相同平台限制資料為基礎。不需帳號、不需上傳，也不會追蹤你輸入的內容。',
  'web.tools.index.dataTitle': '這些數字從何而來',
  'web.tools.index.dataBody':
    '每項限制都是從此程式碼庫中的連接器功能程式碼產生，每一列平台都附有其來源的官方文件頁面，以及有人閱讀該頁面的日期。',
  'web.tools.index.honesty':
    '這些工具不會發布任何內容。目前尚無任何連接器完成供應商驗證，因此此處尚無任何工具能連線帳號。',
  'web.tools.shared.privacyTitle': '此工具在你的瀏覽器中運作',
  'web.tools.shared.privacyBody':
    '你輸入的所有內容都只留在此頁面上，沒有任何伺服器請求、沒有儲存，也沒有任何分析事件會帶走你的文字。',
  'web.tools.shared.sourceLink': '平台文件',
  'web.tools.shared.sourceRead': '閱讀於 {date}',
  'web.tools.shared.unavailable': '無法使用',
  'web.tools.shared.unavailableWhy':
    '我們尚未提供此平台的連接器，因此沒有已驗證的限制可顯示。我們寧可什麼都不說，也不願用猜的。',
  'web.tools.shared.copy': '複製',
  'web.tools.shared.copied': '已複製',
  'web.tools.shared.copyFailed': '你的瀏覽器封鎖了複製功能，請自行選取文字並複製。',
  'web.tools.shared.faqTitle': '常見問題',
  'web.tools.shared.baselineTitle': '這些數字描述的是哪種帳號',
  'web.tools.shared.baselineBody':
    '最保守的情況：一個新連線且未取得提升資格的帳號。有些平台會在頻道或企業通過驗證後提高上限，若有此情況，頁面會加以說明。',
  'web.tools.shared.otherTools': '其他工具',

  /* ---------------------------------------------------------------------- */
  /* Tool names and one line summaries, shared by the index and the footer   */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': '貼文發布前檢查工具',
  'web.tools.preflight.summary': '一則草稿，同時對照十個平台的文字與媒體限制進行檢查。',
  'web.tools.utm.name': 'UTM 連結產生器',
  'web.tools.utm.summary': '在不破壞原有查詢字串的情況下，組合帶有標籤的行銷活動 URL。',
  'web.tools.youtubeTitle.name': 'YouTube 標題長度檢查工具',
  'web.tools.youtubeTitle.summary': '依照人類計算字元的方式，衡量一個標題。',
  'web.tools.timeZone.name': '時區與夏令時間規劃工具',
  'web.tools.timeZone.summary': '在多個受眾時區檢視同一個發布時間，並標示出夏令時間的變動。',
  'web.tools.engagementRate.name': '互動率計算工具',
  'web.tools.engagementRate.summary':
    '互動次數除以觸及、追蹤者或曝光次數，不查詢任何資料，也不做任何基準比較。',

  /* ---------------------------------------------------------------------- */
  /* Post preflight checker                                                  */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': '貼文發布前檢查工具',
  'web.tools.preflight.lede':
    '貼上一則草稿，選擇你要發布的平台，搶先看看哪些平台會拒絕它，而不是等到 API 回傳錯誤才發現。',
  'web.tools.preflight.explainer.title': '為何字元計數器還不夠',
  'web.tools.preflight.explainer.body':
    '各平台對「一個字元」的定義並不一致。有些以編碼單位計算，因此一個表情符號會佔用兩個單位；有些以字素計算，因此一面旗幟或一個家庭表情符號只算一個；有些會將每個連結改寫為固定寬度，因此 200 字元的 URL 與 20 字元的 URL 佔用的字元數相同。此工具會分別套用每個平台的規則。',
  'web.tools.preflight.explainer.counting':
    '此草稿是用瀏覽器的 Intl 分段器來衡量，該分段器會將文字拆解成讀者所稱的「字元」單位，再依照平台規則進行調整。',
  'web.tools.preflight.field.draft.label': '你的草稿',
  'web.tools.preflight.field.draft.help':
    '貼上貼文內文，連結會自動被偵測，以便依各平台套用其相應的計算成本。',
  'web.tools.preflight.field.platforms.label': '要檢查的平台',
  'web.tools.preflight.field.platforms.help': '你發布到多少平台，就選多少。',
  'web.tools.preflight.field.mediaKind.label': '附加的媒體',
  'web.tools.preflight.field.mediaKind.none': '無媒體',
  'web.tools.preflight.field.mediaKind.image': '圖片',
  'web.tools.preflight.field.mediaKind.video': '一部影片',
  'web.tools.preflight.field.mediaCount.label': '圖片數量',
  'web.tools.preflight.field.byteSize.label': '檔案大小（MB）',
  'web.tools.preflight.field.byteSize.help': '最大的單一檔案，留空可略過此項。',
  'web.tools.preflight.field.duration.label': '影片長度（秒）',
  'web.tools.preflight.field.duration.help': '留空可略過長度檢查。',
  'web.tools.preflight.field.width.label': '媒體寬度（像素）',
  'web.tools.preflight.field.height.label': '媒體高度（像素）',
  'web.tools.preflight.field.dimensions.help': '選填。僅用於顯示你將發布的長寬比。',
  'web.tools.preflight.results.title': '各平台的結果',
  'web.tools.preflight.results.empty': '請至少選擇一個平台以查看結果。',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {沒有阻擋項目} other {# 項將會失敗}}，{warning, plural, =0 {沒有警告} other {# 項值得留意}}。',
  'web.tools.preflight.status.pass': '符合限制',
  'web.tools.preflight.status.warning': '值得留意',
  'web.tools.preflight.status.fail': '將會失敗',
  'web.tools.preflight.status.unavailable': '無法使用',
  'web.tools.preflight.count.label':
    '{count} / {limit} {unit, select, grapheme {字元} utf16 {編碼單位} weighted {加權字元} other {字元}}',
  'web.tools.preflight.finding.textOver': '超出限制 {over, plural, other {# 個字元}}。',
  'web.tools.preflight.finding.textNear': '距離限制還剩 {remaining} 個字元。',
  'web.tools.preflight.finding.textFits': '內文符合限制。',
  'web.tools.preflight.finding.linkFixed':
    '每個連結都會被改寫為固定寬度，因此無論實際長度為何，每個連結都計為 {cost} 個字元。',
  'web.tools.preflight.finding.linkActual': '連結的計算值，等於它所佔用的字元數。',
  'web.tools.preflight.finding.imagesOver':
    '此平台單則貼文接受 {limit, plural, =0 {沒有任何圖片} other {# 張圖片}}。',
  'web.tools.preflight.finding.videosOver':
    '此平台單則貼文接受 {limit, plural, =0 {沒有任何影片} other {# 部影片}}。',
  'web.tools.preflight.finding.bytesOver': '此檔案大於 {limit} 的上限。',
  'web.tools.preflight.finding.bytesUnknown': '此媒體類型尚無公開的位元組上限，因此未檢查大小。',
  'web.tools.preflight.finding.durationOver': '超過 {limit} 秒的上限。',
  'web.tools.preflight.finding.durationUnder': '短於 {limit} 秒的最短長度。',
  'web.tools.preflight.finding.durationUnknown': '尚無公開的長度上限，因此未檢查長度。',
  'web.tools.preflight.finding.altText': '替代文字最多可接受 {limit} 個字元，值得善加利用。',
  'web.tools.preflight.finding.ratio': '你將以約 {ratio} 比 1 的比例發布。',
  'web.tools.preflight.faq.counting.q': '你們如何計算字元？',
  'web.tools.preflight.faq.counting.a':
    '以字素計算，使用瀏覽器的 Intl 分段器，這也是讀者所理解的「字元」單位。若某平台記載了不同規則，例如以編碼單位計算，或對每個連結收取固定寬度，就會在此基礎上再套用該規則。',
  'web.tools.preflight.faq.accuracy.q': '這些限制的資訊有多即時？',
  'web.tools.preflight.faq.accuracy.a':
    '每項限制都是從我們程式碼庫中的連接器程式碼產生，而非手動輸入到頁面上，每一列平台都會顯示其來源的官方文件，以及有人閱讀該文件的日期。若某平台變更了數字，只需修改一處程式碼，此處的每個工具就會跟著更新。',
  'web.tools.preflight.faq.privacy.q': '我的草稿會被上傳嗎？',
  'web.tools.preflight.faq.privacy.a':
    '不會。此檢查在你的瀏覽器中運作，沒有任何請求會帶走你的文字，不會儲存任何內容，關閉分頁就足以將它捨棄。',
  'web.tools.preflight.faq.publish.q': '這個工具能幫我發布嗎？',
  'web.tools.preflight.faq.publish.a':
    '目前還不行。尚無任何連接器完成供應商驗證，因此此網站目前尚未透過任何工具發布到任何平台。此頁面是限制檢查工具，而非撰寫工具。',

  /* ---------------------------------------------------------------------- */
  /* UTM builder                                                             */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'UTM 連結產生器',
  'web.tools.utm.lede':
    '在不遺失原有查詢字串的情況下，為 URL 加上行銷活動參數，也不必猜測每個參數代表什麼意思。',
  'web.tools.utm.explainer.title': '每個參數的用途',
  'web.tools.utm.explainer.body':
    'UTM 參數是由分析工具讀取的，而不是由你所發布的平台讀取。它們會隨著 URL 一起傳遞，因此任何看到連結的人也都會看到它們。請保持簡短、小寫且一致，因為同一個活動的兩種拼寫方式，會在報表中變成兩個不同的列。',
  'web.tools.utm.field.url.label': '目的地 URL',
  'web.tools.utm.field.url.help': '你希望使用者到達的頁面，包含 https。',
  'web.tools.utm.field.url.invalid': '這無法解析為有效的 http 或 https URL。',
  'web.tools.utm.field.source.label': '行銷活動來源',
  'web.tools.utm.field.source.help': '點擊來自何處，例如一個平台名稱。',
  'web.tools.utm.field.medium.label': '行銷活動媒介',
  'web.tools.utm.field.medium.help': '連結的類型，例如社群、電子郵件或推薦連結。',
  'web.tools.utm.field.campaign.label': '行銷活動名稱',
  'web.tools.utm.field.campaign.help': '此連結所屬的發布、促銷活動或主題。',
  'web.tools.utm.field.term.label': '行銷活動關鍵字',
  'web.tools.utm.field.term.help': '選填。傳統上用於付費關鍵字。',
  'web.tools.utm.field.content.label': '行銷活動內容',
  'web.tools.utm.field.content.help':
    '選填。用於區分指向同一頁面的兩個連結，例如同一則貼文的兩個版本。',
  'web.tools.utm.result.title': '你的標籤 URL',
  'web.tools.utm.result.empty': '請輸入目的地 URL 以查看結果。',
  'web.tools.utm.result.label': '組合出的 URL',
  'web.tools.utm.result.preserved': 'URL 中原有的查詢字串會完全依照你輸入的樣子保留下來。',
  'web.tools.utm.result.replaced': '你的 URL 已包含其中一個參數，你在此輸入的值會取代它。',
  'web.tools.utm.faq.encoding.q': '空格與重音符號會發生什麼事？',
  'web.tools.utm.faq.encoding.a':
    '它們會被進行百分比編碼，這正是讓連結能在貼到貼文中後仍正常運作的原因。空格會變成加號，帶重音的字母則會變成其編碼後的形式，分析工具會將這兩者解碼還原。',
  'web.tools.utm.faq.existing.q': '這會破壞已經帶有參數的 URL 嗎？',
  'web.tools.utm.faq.existing.a':
    '不會。既有的參數會依原本順序保留，只有你填入的 UTM 參數才會被新增或取代。URL 結尾的片段標記仍會留在結尾。',
  'web.tools.utm.faq.privacy.q': '我的 URL 會被傳送到別處嗎？',
  'web.tools.utm.faq.privacy.a': '不會。此 URL 是在你的瀏覽器中組合而成，永遠不會離開此頁面。',

  /* ---------------------------------------------------------------------- */
  /* YouTube title length checker                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'YouTube 標題長度檢查工具',
  'web.tools.youtubeTitle.lede':
    '只要多一個字元，標題就會在上傳時被拒絕。只是偏長的標題，則會在你未曾選擇的位置被截斷。',
  'web.tools.youtubeTitle.explainer.title': '兩種不同的限制',
  'web.tools.youtubeTitle.explainer.body':
    '硬性上限是上傳端點所接受的範圍。而標題會在哪裡顯示則是另一個問題：搜尋結果、側邊欄與手機各自會在不同的位置截斷標題，且這些截斷點沒有一個是公開記載的。此工具說明的是文件記載的上限，並呈現你標題的形狀，不會捏造截斷的字數。',
  'web.tools.youtubeTitle.field.title.label': '影片標題',
  'web.tools.youtubeTitle.field.title.help': '以字素計算，因此一個表情符號計為一個字元。',
  'web.tools.youtubeTitle.result.count': '{count} / {limit} 個字元',
  'web.tools.youtubeTitle.result.over': '超出 {over, plural, other {# 個字元}}，上傳將會被拒絕。',
  'web.tools.youtubeTitle.result.fits': '在文件記載的上限內。',
  'web.tools.youtubeTitle.result.front':
    '前 {count} 個字元的權重最高，因為那大致就是窄版版面所能容納的範圍。你的標題開頭為：{preview}',
  'web.tools.youtubeTitle.result.unavailable':
    '此版本中無法取得標題限制，因此此處不會進行任何檢查。',
  'web.tools.youtubeTitle.faq.limit.q': '此限制從何而來？',
  'web.tools.youtubeTitle.faq.limit.a':
    '來自官方的 videos insert 參考文件，並由我們上傳工具會使用的相同連接器程式碼產生到此頁面。有人最後一次閱讀該頁面的日期，會顯示在數字旁邊。',
  'web.tools.youtubeTitle.faq.truncation.q': 'YouTube 究竟會在哪裡截斷標題？',
  'web.tools.youtubeTitle.faq.truncation.a':
    '這取決於顯示介面與檢視畫面，而 YouTube 並未公開為此設定的字元數。我們顯示的是已記載的上限，並不會印出一個純屬猜測的截斷數字。',
  'web.tools.youtubeTitle.faq.emoji.q': '一個表情符號算作一個字元嗎？',
  'web.tools.youtubeTitle.faq.emoji.a':
    '在此計數器中，是的，因為我們是以字素計算。內部以編碼單位計算的平台，對同一個表情符號可能收取更多字元數，這也是發布前檢查工具會分別套用每個平台規則的原因。',

  /* ---------------------------------------------------------------------- */
  /* Time zone and daylight saving planner                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': '時區與夏令時間規劃工具',
  'web.tools.timeZone.lede':
    '在你的行事曆上看起來穩定的每週時段，每年會有兩次讓一半的受眾感到時間移動了。此工具會顯示何時、何地會發生這種情況。',
  'web.tools.timeZone.explainer.title': '為何固定的本地時間並非固定的時刻',
  'web.tools.timeZone.explainer.body':
    '一個時間只有在附上時區時才有意義。各時區在不同國家會於不同日期改變其偏移量，一月時相差五小時的兩個地區，到了四月可能只相差四小時。以「一個時刻加上一個時區」儲存的排程能撐過這種變化，以「本地時間」儲存的排程則不能。',
  'web.tools.timeZone.field.date.label': '日期',
  'web.tools.timeZone.field.time.label': '時間',
  'web.tools.timeZone.field.zone.label': '你的時區',
  'web.tools.timeZone.field.audience.label': '受眾時區',
  'web.tools.timeZone.field.audience.help': '選擇你讀者實際所在的時區。',
  'web.tools.timeZone.result.title': '同一個時刻，在你所選的每個地方',
  'web.tools.timeZone.result.empty': '請至少選擇一個受眾時區。',
  'web.tools.timeZone.result.shift':
    '此日期與四週後同一個星期幾之間，會發生一次夏令時間變動，因此本地時間會移動。',
  'web.tools.timeZone.result.stable': '未來四週內偏移量不會改變。',
  'web.tools.timeZone.result.later': '四週後為 {time}。',
  'web.tools.timeZone.result.invalidDate': '請輸入日期與時間以查看比較結果。',
  'web.tools.timeZone.faq.dst.q': '時間會往哪個方向移動？',
  'web.tools.timeZone.faq.dst.a':
    '這取決於時區與變動方向，這也是表格會顯示四週後實際本地時間，而非描述規則的原因。每個時區的偏移量都是從你瀏覽器的時區資料庫讀取。',
  'web.tools.timeZone.faq.storage.q': '已排程的貼文應該如何儲存其時間？',
  'web.tools.timeZone.faq.storage.a':
    '以「一個時刻加上該使用者選擇的 IANA 時區」儲存，絕不能只是單純的本地時間。這正是我們內部的做法，也是為何一則在時鐘變動前排程的貼文，仍會在預定的本地時間送達。',

  /* ---------------------------------------------------------------------- */
  /* Engagement rate calculator                                              */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': '互動率計算工具',
  'web.tools.engagementRate.lede':
    '輸入你自己的儀表板已經顯示給你的數字。此工具只會將它們用三種方式相除，然後就停在那裡：沒有基準值、沒有「好」的門檻、沒有任何我們實際上沒有的資料。',
  'web.tools.engagementRate.explainer.title': '為何是三種分母，而非一種',
  'web.tools.engagementRate.explainer.body':
    '觸及、追蹤者與曝光次數回答的是不同的問題。以觸及計算的比率，說明的是實際看到貼文的人做出了什麼反應；以追蹤者計算的比率，說明的是不論貼文是否觸及所有人，你的受眾中有多少比例產生了互動；以曝光次數計算的比率，則會計入包括重複瀏覽在內的每一次瀏覽。將以一種方式計算的比率，拿來和以另一種方式計算的比率相比，是造成互動數字看起來不對勁的常見原因。',
  'web.tools.engagementRate.field.interactions.label': '互動次數',
  'web.tools.engagementRate.field.interactions.help':
    '你正在衡量的這則貼文中，按讚、留言、分享與收藏加總後的數字。',
  'web.tools.engagementRate.field.reach.label': '觸及',
  'web.tools.engagementRate.field.reach.help': '至少看過此貼文一次的帳號數。',
  'web.tools.engagementRate.field.followers.label': '追蹤者',
  'web.tools.engagementRate.field.followers.help': '發布此貼文當時的帳號規模。',
  'web.tools.engagementRate.field.impressions.label': '曝光次數',
  'web.tools.engagementRate.field.impressions.help': '總瀏覽次數，包含同一人看過兩次的情況。',
  'web.tools.engagementRate.result.title': '互動率，三種計算方式',
  'web.tools.engagementRate.result.empty': '無法使用',
  'web.tools.engagementRate.result.note':
    '沒有一個放諸四海皆準的良好比率可供比較。它取決於平台、格式、受眾規模與產業，任何被當作基準值提出的單一數字，其實都是包裝成資料的猜測。',
  'web.tools.engagementRate.basis.reach': '依觸及計算',
  'web.tools.engagementRate.basis.followers': '依追蹤者計算',
  'web.tools.engagementRate.basis.impressions': '依曝光次數計算',
  'web.tools.engagementRate.faq.formula.q': '實際的公式是什麼？',
  'web.tools.engagementRate.faq.formula.a':
    '互動次數除以你所選的分母，以百分比呈現。此處的互動次數是指按讚、留言、分享與收藏加總後的數字；若某些平台是分開回報這些數據，請你自行加總後再輸入總數。',
  'web.tools.engagementRate.faq.basis.q': '我該使用哪一種分母？',
  'web.tools.engagementRate.faq.basis.a':
    '使用該平台隨貼文一併回報的那一種，讓兩個數字來自相同的衡量期間。將某則貼文以觸及計算的比率，拿來與另一則貼文以追蹤者計算的比率相比，即使兩者都稱為互動率，也並不是公平的比較。',
} as const;
