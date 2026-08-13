export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* メタデータ                                                             */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'プラットフォームごとの予定',
  'web.meta.schedulePlatform.title': '{platform}の予定',
  'web.meta.schedule.description':
    'ローンチコホートの各プラットフォームが接続済みアカウントに要求する内容、その公式APIが課す制限、そしてこの製品がそれらに対してどこまで到達しているか。',
  'web.meta.schedulePlatform.description':
    '{platform}が接続済みアカウントに要求する内容、その公式APIが課す制限、そしてこの製品がどの部分を構築したか。',

  /* ---------------------------------------------------------------------- */
  /* インデックス                                                           */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'プラットフォームごとの予定',
  'web.schedule.index.lede':
    'ローンチコホートの各プラットフォームに1ページずつ。それぞれ、プラットフォームが接続済みアカウントに求めること、その公式APIが課す制限、そして構築の現状を記載しています。すべての数字には、それがどの文書から来たか、いつ人が読んだかが付いています。',
  'web.schedule.index.listLabel': 'ローンチコホートのプラットフォーム',
  'web.schedule.index.cohortNote':
    'コホートとは、この製品が構築対象としているプラットフォームの集合です。これは計画であり、利用可能一覧ではありません。',
  'web.schedule.index.limitsKnown': '制限を記録済み',
  'web.schedule.index.limitsUnknown': 'まだ制限を記録していません',

  /* ---------------------------------------------------------------------- */
  /* プラットフォームページ                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': '{platform}の予定',
  'web.schedule.platform.lede':
    '{platform}が接続済みアカウントに求めること、その公式APIが課す制限、そしてこの製品がこれまでにどの部分に対して構築したか。',

  'web.schedule.notice.title': '{platform}にはまだ何も公開されていません',
  'web.schedule.notice.body':
    'このプロダクトの完成定義を満たしたコネクターはまだなく、本番環境で検証されたものもありません。このページはプラットフォームが要求する内容と、この製品がサポートを意図している内容を説明しています。動作するスケジューラーを説明しているわけではありません。',

  'web.schedule.requirements.title': '{platform}が要求する内容',
  'web.schedule.requirements.accountTypes': 'アカウントの種類',
  'web.schedule.requirements.restriction': 'プラットフォームの制約',
  'web.schedule.requirements.cost': 'APIコスト',
  'web.schedule.requirements.unavailable.title': 'まだレビュー済みのコネクター記録がありません',
  'web.schedule.requirements.unavailable.body':
    'このプラットフォームは前回のコネクター調査後にコホートに加わったため、アカウント要件の日付付き記録がまだありません。人が公式ドキュメントを読み記録した時点でここに表示されます。',
  'web.schedule.requirements.apiSource': '公式APIドキュメント',
  'web.schedule.requirements.policySource': 'プラットフォームポリシー',

  /* ---------------------------------------------------------------------- */
  /* 制限                                                                   */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': '{platform}が課す制限',
  'web.schedule.limits.lede':
    '昇格した資格を持たない新規接続アカウントに対して読み取られています。プラットフォームは誰にも知らせずこれらの値を上げ下げできるため、各セットにはそれが読み取られた日付が付いています。',
  'web.schedule.limits.unavailable.title': '{platform}の制限は記録されていません',
  'web.schedule.limits.unavailable.body':
    'このビルドにはこのプラットフォームのアダプターがないため、表示すべき記録済みの上限がありません。作り話の数字は何もないより悪いものです。',
  'web.schedule.limits.sourceLabel': '公式プラットフォームドキュメント',

  'web.schedule.limits.text': '本文テキスト',
  'web.schedule.limits.title_field': 'タイトルフィールド',
  'web.schedule.limits.countingUnit': '文字の数え方',
  'web.schedule.limits.links': 'リンクの数え方',
  'web.schedule.limits.images': '投稿あたりの画像数',
  'web.schedule.limits.videos': '投稿あたりの動画数',
  'web.schedule.limits.videoDuration': '動画の長さ',
  'web.schedule.limits.imageBytes': '最大画像サイズ',
  'web.schedule.limits.gifBytes': '最大アニメーション画像サイズ',
  'web.schedule.limits.videoBytes': '最大動画サイズ',
  'web.schedule.limits.documentBytes': '最大文書サイズ',
  'web.schedule.limits.altText': '代替テキスト',
  'web.schedule.limits.mimeTypes': '対応ファイル形式',
  'web.schedule.limits.markdown': '書式記号',

  'web.schedule.value.characters': '{count, plural, other {#文字}}',
  'web.schedule.value.files': '{count, plural, =0 {なし} other {#ファイル}}',
  'web.schedule.value.durationRange': '{min}から{max}の間',
  'web.schedule.value.durationMax': '{max}まで',
  'web.schedule.value.markdownYes': '対応',
  'web.schedule.value.markdownNo': 'プレーンな文字として公開',

  'web.schedule.unit.utf16':
    'UTF-16コード単位による計算。ほとんどのエディターが文字数として報告する方式です。',
  'web.schedule.unit.grapheme':
    '書記素単位による計算。複数のコードポイントで構成される絵文字も1文字としてカウントされます。',
  'web.schedule.unit.weighted':
    'ほとんどの非ラテン文字が1ではなく2としてカウントされる重み付き方式による計算。',

  'web.schedule.link.none': 'リンクは上限に対してカウントされません。',
  'web.schedule.link.actual': 'リンクは占める文字数そのままでカウントされます。',
  'web.schedule.link.fixed':
    'すべてのリンクはプラットフォームの短縮URLに書き換えられ、実際の長さに関わらず{count, plural, other {#文字}}としてカウントされます。',

  /* ---------------------------------------------------------------------- */
  /* 機能の状態                                                             */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': '{platform}向けに構築済みの機能',
  'web.schedule.capabilities.lede':
    'コネクターレジストリから生成されたもので、ここに直接書かれたものではありません。「プラットフォームが提供していない」はプラットフォームに関する事実であり確定的です。「まだ構築されていない」はこの製品に関する事実であり、コネクターが完成定義を満たしていない間の正直な既定値です。',
  'web.schedule.capabilities.unavailable.title': '{platform}の機能記録はまだありません',
  'web.schedule.capabilities.unavailable.body':
    'このビルドにはアダプターがないため、レジストリには報告する内容がありません。実際に伝える内容ができ次第、この行は機能マトリックスに表示されます。',
  'web.schedule.capabilities.matrixLink': '完全な機能マトリックスを読む',

  'web.schedule.next.title': '次にどこへ行くか',
  'web.schedule.next.body':
    '機能マトリックスにはすべてのプラットフォームとすべての機能が1つの表にまとまっています。ユースケースページでは、この製品が構築対象としているワークフローを説明しています。',
} as const;
