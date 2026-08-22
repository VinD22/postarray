/**
 * The comparison pages' chrome.
 *
 * What belongs here: state words, section headings, labels, and the three
 * disclosure sentences whose numbers are read at render time from the code
 * that decides them. What deliberately does not: the claims themselves. A
 * comparison table is several hundred words of dated, sourced content per
 * page, and the English catalog is merged into one object that every page load
 * resolves, so those claims live in typed modules under
 * `apps/web/src/features/comparisons/entries` and are loaded per slug.
 *
 * The `web.compare.*` namespace is the older `/compare` index. This namespace
 * is the per comparison page, kept separate so the index copy that beta locales
 * already carry is not disturbed.
 */
export const webComparisonMessages = {
  'web.comparison.eyebrow': '比較',

  'web.comparison.state.yes': '是',
  'web.comparison.state.no': '否',
  'web.comparison.state.partial': '部分符合',
  'web.comparison.state.notVerified': '尚未驗證',

  'web.comparison.label.claim': '主張',
  'web.comparison.label.sourceRead': '閱讀於 {date}',
  'web.comparison.label.checked': '每一列皆於 {date} 檢查過',
  'web.comparison.label.nextReview': '下次檢查日期為 {date}',
  'web.comparison.label.backToIndex': '所有比較',

  'web.comparison.table.title': '各選項能做什麼',
  'web.comparison.table.caption': '每列一項主張，並附上每個答案背後的來源',

  'web.comparison.bestFor.title': '哪一個適合你',
  'web.comparison.bestFor.ours': '在以下情況選擇本產品',
  'web.comparison.bestFor.alternative': '在以下情況選擇 {name}',

  'web.comparison.notDo.title': '本產品不做的事',
  'web.comparison.notDo.body':
    '這些句子是從決定它們的程式碼中讀取而來，並非手動輸入，因此這個區塊不會偏離產品今日的真實樣貌。',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {尚無任何連接器完成供應商驗證，因此本產品目前尚未透過任何平台發布內容。} other {已有 # 個連接器完成供應商驗證，同一梯次中的其他平台仍屬計畫中。}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {尚無任何語言完成人工審閱，因此介面中的每種語言都標示為測試版。} other {已有 # 種語言完成人工審閱，其他每種語言仍標示為測試版。}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {每個定價方案皆已確定，並附有實際價格。} other {仍有 # 個定價方案尚未確定，屬於暫定項目，目前無法購買。}}',

  'web.comparison.notVerified.title': '「尚未驗證」代表什麼',
  'web.comparison.notVerified.body':
    '若在檢查當天，無法從另一個選項的官方公開文件中讀取到該事實，該欄位就會標示為尚未驗證。此欄位絕不會憑記憶填寫，也絕不會照抄別人寫的摘要。',

  'web.comparison.method.title': '此頁面如何製作',
  'web.comparison.method.body':
    '每一列都是一項主張，並附有其來源文件，以及有人閱讀該文件的日期。沒有競品的螢幕截圖，沒有照抄的功能文字，也沒有捏造的弱點。',
  'web.comparison.method.cadence':
    '每份比較至少每 90 天重新檢查一次，並在平台或選項變更了某一列所陳述的內容時，立即更新。',

  'web.comparison.questions.title': '問題',
  'web.comparison.sources.title': '本頁引用的來源',

  'web.comparison.index.title': '已發布的比較',
  'web.comparison.index.body':
    '每個頁面都會將本產品與一類其事實可從官方文件中讀取的替代方案進行比較。只有在能從其自身公開頁面讀取到目前事實時，一個具名產品才會擁有專屬頁面，而不是在此之前。',
  'web.comparison.index.checked': '檢查於 {date}',
} as const;
