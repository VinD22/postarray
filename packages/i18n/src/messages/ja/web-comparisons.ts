export const webComparisonMessages = {
  'web.comparison.eyebrow': '比較',

  'web.comparison.state.yes': 'はい',
  'web.comparison.state.no': 'いいえ',
  'web.comparison.state.partial': '部分的',
  'web.comparison.state.notVerified': '未検証',

  'web.comparison.label.claim': '主張',
  'web.comparison.label.sourceRead': '{date}に確認',
  'web.comparison.label.checked': '{date}にすべての行を確認済み',
  'web.comparison.label.nextReview': '次回の確認予定日: {date}',
  'web.comparison.label.backToIndex': 'すべての比較',

  'web.comparison.table.title': '各選択肢ができること',
  'web.comparison.table.caption': '1行につき1つの主張と、各回答の根拠',

  'web.comparison.bestFor.title': 'どちらが合うか',
  'web.comparison.bestFor.ours': 'こんな場合はこの製品を選ぶ',
  'web.comparison.bestFor.alternative': 'こんな場合は{name}を選ぶ',

  'web.comparison.notDo.title': 'この製品ができないこと',
  'web.comparison.notDo.body':
    'これらの文はそれを決定するコードから読み取られたもので、手で書かれたものではありません。そのため、このセクションは製品の今の実態から乖離できません。',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {プロバイダー検証を完了したコネクターはまだなく、今日このプロダクトを通じてどのプラットフォームにも公開されません。} other {#件のコネクターがプロバイダー検証を完了しました。コホート内の他のすべてのプラットフォームはまだ意向段階です。}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {人によるレビューを完了した言語はまだなく、インターフェースのすべての言語はベータとラベル付けされています。} other {#言語が人によるレビューを完了しました。他のすべての言語はベータとラベル付けされています。}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {すべての料金プランが決定され、実際の価格が設定されています。} other {#件の料金プランはまだ未決定のプレースホルダーで、購入できません。}}',

  'web.comparison.notVerified.title': '「未検証」の意味',
  'web.comparison.notVerified.body':
    'あるセルが「未検証」となっているのは、確認当日に相手の選択肢の公式な公開ドキュメントからその事実を読み取れなかった場合です。記憶で埋められることはなく、他人が書いた要約から引用されることもありません。',

  'web.comparison.method.title': 'このページの作り方',
  'web.comparison.method.body':
    'すべての行は1つの主張であり、その出典元となる文書と、それを読んだ人の日付が付いています。競合のスクリーンショットや、コピーされた機能説明、作り話の弱点は一切ありません。',
  'web.comparison.method.cadence':
    'すべての比較は少なくとも90日ごとに再確認され、プラットフォームや選択肢が行の記述内容に関わる変更をした場合は即座に再確認されます。',

  'web.comparison.questions.title': '質問',
  'web.comparison.sources.title': 'このページで引用されている出典',

  'web.comparison.index.title': '公開済みの比較',
  'web.comparison.index.body':
    '各ページは、公式ドキュメントから事実を読み取れる代替製品のカテゴリーとこの製品を比較しています。名前が挙げられた製品がページを得るのは、その最新の事実が自社の公開ページから読み取れる場合に限られ、それ以前ではありません。',
  'web.comparison.index.checked': '{date}に確認',
} as const;
