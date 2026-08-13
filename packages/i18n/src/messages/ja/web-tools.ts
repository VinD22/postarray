export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* メタデータ                                                             */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': '無料の公開ツール',
  'web.meta.tools.description':
    '複数のプラットフォームに投稿する人のための小さなプライベートツール: プラットフォームごとの制限チェック、UTMビルダー、YouTubeタイトル長チェック、タイムゾーンプランナー。',
  'web.meta.tools.preflight.title': '投稿事前チェッカー',
  'web.meta.tools.preflight.description':
    '10のプラットフォームの公開済みテキスト・メディア制限に対して下書きをチェックし、各制限の出典と読み取った日付を表示します。',
  'web.meta.tools.utm.title': 'UTMリンクビルダー',
  'web.meta.tools.utm.description':
    'タグ付きキャンペーンURLを作成し、各UTMパラメーターの意味を確認できます。すべてブラウザ内で動作します。',
  'web.meta.tools.youtubeTitle.title': 'YouTubeタイトル長チェッカー',
  'web.meta.tools.youtubeTitle.description':
    '人が文字を数える方法で、YouTubeのタイトルを文書化された上限と照合して測定します。',
  'web.meta.tools.timeZone.title': 'タイムゾーン・夏時間プランナー',
  'web.meta.tools.timeZone.description':
    '1つの投稿時刻を複数の読者タイムゾーンで確認し、夏時間の切り替えでローカル時刻がずれる週を見つけます。',
  'web.meta.tools.engagementRate.title': 'エンゲージメント率計算機',
  'web.meta.tools.engagementRate.description':
    'インタラクション数をリーチ、フォロワー、インプレッションで割ります。作り話の基準値なしの、3つのシンプルな計算です。',

  /* ---------------------------------------------------------------------- */
  /* ツール共通の要素                                                       */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': '無料ツール',
  'web.tools.index.summary':
    '当社のコネクターが読み取るのと同じプラットフォーム制限データに基づく小さな計算機。',
  'web.tools.index.lede':
    '当社のコネクターが使用するのと同じプラットフォーム制限データに基づく4つの小さなツール。アカウント不要、アップロード不要、入力内容の追跡もありません。',
  'web.tools.index.dataTitle': '数字の出所',
  'web.tools.index.dataBody':
    '各制限はこのリポジトリのコネクター機能コードから生成されており、各プラットフォームの行には、それがどの公式ドキュメントページから来たか、いつ人がそのページを読んだかが付いています。',
  'web.tools.index.honesty':
    'これらのツールは何も公開しません。プロバイダー検証を完了したコネクターはまだないため、ここではアカウントを接続しません。',
  'web.tools.shared.privacyTitle': 'これはあなたのブラウザ内で動作します',
  'web.tools.shared.privacyBody':
    '入力したものはすべてこのページ内に留まります。サーバーへのリクエストも、保存も、あなたのテキストを運ぶ分析イベントもありません。',
  'web.tools.shared.sourceLink': 'プラットフォームのドキュメント',
  'web.tools.shared.sourceRead': '{date}に確認',
  'web.tools.shared.unavailable': '利用不可',
  'web.tools.shared.unavailableWhy':
    'このプラットフォーム用のコネクターはまだ提供していないため、表示できる検証済みの制限がありません。推測するより、何も言わない方を選びます。',
  'web.tools.shared.copy': 'コピー',
  'web.tools.shared.copied': 'コピーしました',
  'web.tools.shared.copyFailed': 'ブラウザがコピーをブロックしました。テキストを選択してコピーしてください。',
  'web.tools.shared.faqTitle': '質問',
  'web.tools.shared.baselineTitle': 'これらの数字がどのアカウントを表しているか',
  'web.tools.shared.baselineBody':
    '控えめなケース: 昇格した資格を持たない新規接続アカウント。一部のプラットフォームはチャンネルやビジネスが認証されると上限を引き上げるため、その場合はページにその旨を記載しています。',
  'web.tools.shared.otherTools': '他のツール',

  /* ---------------------------------------------------------------------- */
  /* ツール名と一行要約                                                     */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': '投稿事前チェッカー',
  'web.tools.preflight.summary':
    '10のプラットフォームのテキスト・メディア制限に対して、1つの下書きを一度にチェックします。',
  'web.tools.utm.name': 'UTMリンクビルダー',
  'web.tools.utm.summary': '元々あったクエリ文字列を壊すことなく、タグ付きキャンペーンURLを作成します。',
  'web.tools.youtubeTitle.name': 'YouTubeタイトル長チェッカー',
  'web.tools.youtubeTitle.summary': '人が数える方法でタイトルを測定します。',
  'web.tools.timeZone.name': 'タイムゾーン・夏時間プランナー',
  'web.tools.timeZone.summary':
    '複数の読者タイムゾーンでの1つの投稿時刻、夏時間の切り替えをマーク付きで表示します。',
  'web.tools.engagementRate.name': 'エンゲージメント率計算機',
  'web.tools.engagementRate.summary':
    'インタラクション数をリーチ、フォロワー、インプレッションで割ります。何も照会せず、何も基準値として使いません。',

  /* ---------------------------------------------------------------------- */
  /* 投稿事前チェッカー                                                     */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': '投稿事前チェッカー',
  'web.tools.preflight.lede':
    '下書きを貼り付け、投稿先のプラットフォームを選ぶと、APIエラーで知る前に、どれが拒否するかがわかります。',
  'web.tools.preflight.explainer.title': '文字数カウンターだけでは不十分な理由',
  'web.tools.preflight.explainer.body':
    'プラットフォームによって文字の定義が異なります。コード単位を数えるプラットフォームでは絵文字1つが2文字分としてカウントされることがあります。書記素を数えるプラットフォームでは、旗や家族の絵文字も1文字としてカウントされます。すべてのリンクを固定幅に書き換えるプラットフォームでは、200文字のURLも20文字のURLと同じコストになります。このツールは各プラットフォームのルールを個別に適用します。',
  'web.tools.preflight.explainer.counting':
    '下書きはブラウザのIntlセグメンターで測定され、読者が文字と呼ぶ単位にテキストを分割してから、プラットフォームのルールに合わせて調整されます。',
  'web.tools.preflight.field.draft.label': 'あなたの下書き',
  'web.tools.preflight.field.draft.help':
    '投稿本文を貼り付けてください。リンクは自動的に検出され、その分のコストがプラットフォームごとに適用されます。',
  'web.tools.preflight.field.platforms.label': 'チェックするプラットフォーム',
  'web.tools.preflight.field.platforms.help': '投稿する分だけ選んでください。',
  'web.tools.preflight.field.mediaKind.label': '添付メディア',
  'web.tools.preflight.field.mediaKind.none': 'メディアなし',
  'web.tools.preflight.field.mediaKind.image': '画像',
  'web.tools.preflight.field.mediaKind.video': '動画1本',
  'web.tools.preflight.field.mediaCount.label': '画像の枚数',
  'web.tools.preflight.field.byteSize.label': 'ファイルサイズ(メガバイト)',
  'web.tools.preflight.field.byteSize.help': '最大の単一ファイル。スキップする場合は空欄のままにしてください。',
  'web.tools.preflight.field.duration.label': '動画の長さ(秒)',
  'web.tools.preflight.field.duration.help': '長さのチェックをスキップする場合は空欄のままにしてください。',
  'web.tools.preflight.field.width.label': 'メディアの幅(ピクセル)',
  'web.tools.preflight.field.height.label': 'メディアの高さ(ピクセル)',
  'web.tools.preflight.field.dimensions.help':
    '任意。公開しようとしているアスペクト比を表示するためだけに使われます。',
  'web.tools.preflight.results.title': 'プラットフォームごとの結果',
  'web.tools.preflight.results.empty': '結果を見るには少なくとも1つのプラットフォームを選んでください。',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {ブロックするものはありません} other {#件が失敗します}}、{warning, plural, =0 {警告なし} other {#件要確認}}。',
  'web.tools.preflight.status.pass': '収まる',
  'web.tools.preflight.status.warning': '確認する価値あり',
  'web.tools.preflight.status.fail': '失敗する',
  'web.tools.preflight.status.unavailable': '利用不可',
  'web.tools.preflight.count.label':
    '{limit}{unit, select, grapheme {文字} utf16 {コード単位} weighted {重み付き文字} other {文字}}中{count}',
  'web.tools.preflight.finding.textOver': '制限を{over, plural, other {#文字}}超えています。',
  'web.tools.preflight.finding.textNear': '制限まであと{remaining}文字です。',
  'web.tools.preflight.finding.textFits': '本文は収まります。',
  'web.tools.preflight.finding.linkFixed':
    'すべてのリンクは固定幅に書き換えられるため、実際の長さに関わらず各リンクは{cost}文字としてカウントされます。',
  'web.tools.preflight.finding.linkActual': 'リンクは占める文字数どおりにカウントされます。',
  'web.tools.preflight.finding.imagesOver':
    'このプラットフォームは1投稿あたり{limit, plural, =0 {画像を受け付けません} other {画像#枚}}まで受け付けます。',
  'web.tools.preflight.finding.videosOver':
    'このプラットフォームは1投稿あたり{limit, plural, =0 {動画を受け付けません} other {動画#本}}まで受け付けます。',
  'web.tools.preflight.finding.bytesOver': 'ファイルが{limit}の上限を超えています。',
  'web.tools.preflight.finding.bytesUnknown':
    'このメディア種別について公開されているバイト上限がないため、サイズはチェックされていません。',
  'web.tools.preflight.finding.durationOver': '{limit}秒の上限より長くなっています。',
  'web.tools.preflight.finding.durationUnder': '{limit}秒の最小値より短くなっています。',
  'web.tools.preflight.finding.durationUnknown':
    '公開されている長さの上限がないため、長さはチェックされていません。',
  'web.tools.preflight.finding.altText':
    '代替テキストは{limit}文字まで受け付けられます。使う価値があります。',
  'web.tools.preflight.finding.ratio': 'およそ{ratio}対1のアスペクト比で公開することになります。',
  'web.tools.preflight.faq.counting.q': '文字はどう数えていますか?',
  'web.tools.preflight.faq.counting.a':
    'ブラウザのIntlセグメンターを使い、読者が文字と呼ぶ単位である書記素で数えています。プラットフォームがコード単位を数える、リンクごとに固定幅を課すなど別のルールを文書化している場合は、そのルールを上乗せして適用します。',
  'web.tools.preflight.faq.accuracy.q': 'これらの制限はどのくらい最新ですか?',
  'web.tools.preflight.faq.accuracy.a':
    '各制限はページに手打ちされたものではなく、私たちのリポジトリのコネクターコードから生成されており、各プラットフォームの行にはそれがどの公式文書から来たか、いつ人が読んだかが表示されます。プラットフォームが数字を変更すれば、修正はコード変更1回で済み、ここのすべてのツールがそれに従います。',
  'web.tools.preflight.faq.privacy.q': '下書きはどこかにアップロードされますか?',
  'web.tools.preflight.faq.privacy.a':
    'いいえ。チェックはあなたのブラウザ内で実行されます。あなたのテキストを運ぶリクエストはなく、何も保存されず、タブを閉じるだけで破棄するのに十分です。',
  'web.tools.preflight.faq.publish.q': 'このツールで私の代わりに公開できますか?',
  'web.tools.preflight.faq.publish.a':
    'まだできません。プロバイダー検証を完了したコネクターはないため、このサイトのどれもまだプラットフォームに公開しません。このページは制限チェックであり、コンポーザーではありません。',

  /* ---------------------------------------------------------------------- */
  /* UTMビルダー                                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'UTMリンクビルダー',
  'web.tools.utm.lede':
    '元々あったクエリ文字列を失うことなく、また各パラメーターの意味を推測することなく、URLにキャンペーンパラメーターを追加します。',
  'web.tools.utm.explainer.title': '各パラメーターの用途',
  'web.tools.utm.explainer.body':
    'UTMパラメーターは、投稿先のプラットフォームではなく分析ツールによって読み取られます。URL内を移動するため、リンクを見た人には見えてしまいます。同じキャンペーンの表記が2つあるとレポートで2行になってしまうため、短く、小文字で、一貫性のある表記にしてください。',
  'web.tools.utm.field.url.label': '送信先URL',
  'web.tools.utm.field.url.help': 'httpsを含む、人々を誘導したいページ。',
  'web.tools.utm.field.url.invalid': 'それはhttpまたはhttpsのURLとして解釈できません。',
  'web.tools.utm.field.source.label': 'キャンペーンソース',
  'web.tools.utm.field.source.help': 'クリックがどこから来たか。例えばプラットフォーム名。',
  'web.tools.utm.field.medium.label': 'キャンペーンメディア',
  'web.tools.utm.field.medium.help': 'リンクの種類。例えばsocial、email、referralなど。',
  'web.tools.utm.field.campaign.label': 'キャンペーン名',
  'web.tools.utm.field.campaign.help': 'このリンクが属するローンチ、プロモーション、またはテーマ。',
  'web.tools.utm.field.term.label': 'キャンペーンターム',
  'web.tools.utm.field.term.help': '任意。伝統的には有料キーワードです。',
  'web.tools.utm.field.content.label': 'キャンペーンコンテンツ',
  'web.tools.utm.field.content.help':
    '任意。同じページへの2つのリンクを区別します。例えば投稿の2つのバージョンなど。',
  'web.tools.utm.result.title': 'タグ付きURL',
  'web.tools.utm.result.empty': '結果を見るには送信先URLを入力してください。',
  'web.tools.utm.result.label': '生成されたURL',
  'web.tools.utm.result.preserved':
    'あなたのURLに元々あったクエリ文字列は、入力したとおりそのまま保持されます。',
  'web.tools.utm.result.replaced':
    'あなたのURLにはすでにこれらのパラメーターのうち1つがありました。ここで入力した値がそれを置き換えます。',
  'web.tools.utm.faq.encoding.q': 'スペースやアクセント記号はどうなりますか?',
  'web.tools.utm.faq.encoding.a':
    'パーセントエンコードされます。これにより、投稿に貼り付けてもリンクが機能し続けます。スペースはプラス記号になり、アクセント付き文字はエンコードされた形式になり、分析ツールは両方をデコードして戻します。',
  'web.tools.utm.faq.existing.q': 'すでにパラメーターがあるURLを壊してしまいますか?',
  'web.tools.utm.faq.existing.a':
    'いいえ。既存のパラメーターは元の順序で保持され、入力したUTMパラメーターだけが追加または置き換えられます。URLの末尾のフラグメントは末尾に残ります。',
  'web.tools.utm.faq.privacy.q': '私のURLはどこかに送信されますか?',
  'web.tools.utm.faq.privacy.a':
    'いいえ。URLはあなたのブラウザ内で生成され、このページから出ることはありません。',

  /* ---------------------------------------------------------------------- */
  /* YouTubeタイトル長チェッカー                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'YouTubeタイトル長チェッカー',
  'web.tools.youtubeTitle.lede':
    '1文字超過したタイトルはアップロード時に拒否されます。単に長いだけのタイトルは、あなたが選んでいない場所で切り詰められます。',
  'web.tools.youtubeTitle.explainer.title': '2つの異なる制限',
  'web.tools.youtubeTitle.explainer.body':
    'ハードな上限は、アップロードエンドポイントが受け付ける値です。タイトルがどこに表示されるかは別の問題です。検索結果、サイドバー、スマートフォンではそれぞれ異なる位置でタイトルが切り詰められ、そのどの切り取り位置も公開されていません。このツールは文書化された上限を示し、あなたのタイトルの形を表示しますが、作り話の切り詰め数字を作り出すことはありません。',
  'web.tools.youtubeTitle.field.title.label': '動画タイトル',
  'web.tools.youtubeTitle.field.title.help': '書記素で数えるため、絵文字は1文字としてカウントされます。',
  'web.tools.youtubeTitle.result.count': '{limit}文字中{count}',
  'web.tools.youtubeTitle.result.over':
    '{over, plural, other {#文字}}超過しています。アップロードは拒否されます。',
  'web.tools.youtubeTitle.result.fits': '文書化された上限内に収まっています。',
  'web.tools.youtubeTitle.result.front':
    '最初の{count}文字が最も重要です。それが狭いレイアウトに収まるおおよその量だからです。あなたのタイトルの冒頭: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'このビルドではタイトルの制限が利用できないため、ここでは何もチェックされません。',
  'web.tools.youtubeTitle.faq.limit.q': 'この制限はどこから来ていますか?',
  'web.tools.youtubeTitle.faq.limit.a':
    '当社のアップロードが使用するのと同じコネクターコードからこのページ上で生成された、公式のvideos.insertリファレンスからです。人がそのページを最後に読んだ日付が数字の横に表示されています。',
  'web.tools.youtubeTitle.faq.truncation.q': 'YouTubeは正確にどこでタイトルを切り詰めますか?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'それは表示面とビューポートによって異なり、YouTubeはそのための文字数を公開していません。私たちは文書化されている上限を表示し、推測になる切り詰め数字は出力しません。',
  'web.tools.youtubeTitle.faq.emoji.q': '絵文字は1文字としてカウントされますか?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'このカウンターではそうです。書記素を数えているためです。内部でコード単位を数えるプラットフォームでは同じ絵文字により多くのコストがかかることがあり、そのため事前チェッカーは各プラットフォームのルールを個別に適用します。',

  /* ---------------------------------------------------------------------- */
  /* タイムゾーン・夏時間プランナー                                         */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'タイムゾーン・夏時間プランナー',
  'web.tools.timeZone.lede':
    'カレンダー上で安定して見える週次の枠も、読者の半分にとっては年に2回ずれてしまいます。これはどこで、いつずれるかを示します。',
  'web.tools.timeZone.explainer.title': '固定のローカル時刻が固定の時刻ではない理由',
  'web.tools.timeZone.explainer.body':
    '時刻はタイムゾーンが付いて初めて意味を持ちます。タイムゾーンは国によって異なる日にオフセットを変更するため、1月に5時間差だった2つの地域が4月には4時間差になることがあります。瞬間とタイムゾーンとして保存されたスケジュールはこれに耐えます。ローカル時刻として保存されたスケジュールは耐えられません。',
  'web.tools.timeZone.field.date.label': '日付',
  'web.tools.timeZone.field.time.label': '時刻',
  'web.tools.timeZone.field.zone.label': 'あなたのタイムゾーン',
  'web.tools.timeZone.field.audience.label': '読者のタイムゾーン',
  'web.tools.timeZone.field.audience.help': '読者が実際にいるタイムゾーンを選んでください。',
  'web.tools.timeZone.result.title': '選んだすべてのタイムゾーンでの同じ瞬間',
  'web.tools.timeZone.result.empty': '少なくとも1つの読者タイムゾーンを選んでください。',
  'web.tools.timeZone.result.shift':
    'この日付から4週間後の同じ曜日までの間に夏時間の切り替えがあるため、ローカル時刻がずれます。',
  'web.tools.timeZone.result.stable': '今後4週間はオフセットの変更はありません。',
  'web.tools.timeZone.result.later': '4週間後、{time}。',
  'web.tools.timeZone.result.invalidDate': '比較を見るには日付と時刻を入力してください。',
  'web.tools.timeZone.faq.dst.q': '時刻はどちら向きにずれますか?',
  'web.tools.timeZone.faq.dst.a':
    'それはタイムゾーンと変更の方向によって異なるため、表はルールを説明するのではなく、4週間後の実際のローカル時刻を表示します。各タイムゾーンのオフセットはあなたのブラウザのタイムゾーンデータベースから読み取られています。',
  'web.tools.timeZone.faq.storage.q': '予定投稿はどのように時刻を保存すべきですか?',
  'web.tools.timeZone.faq.storage.a':
    '瞬間とその人が選んだIANAタイムゾーンとして保存すべきで、素朴なローカル時刻としては保存すべきではありません。それが私たちの内部での方法であり、時計の切り替え前に予定された投稿でも、意図されたローカル時刻に届く理由です。',

  /* ---------------------------------------------------------------------- */
  /* エンゲージメント率計算機                                               */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': 'エンゲージメント率計算機',
  'web.tools.engagementRate.lede':
    'あなた自身のダッシュボードがすでに表示している数字を入力してください。これはそれを3通りに割るだけで止まります。基準値なし、「良い」しきい値なし、実際に持っていないものは何もありません。',
  'web.tools.engagementRate.explainer.title': '分母が1つではなく3つある理由',
  'web.tools.engagementRate.explainer.body':
    'リーチ、フォロワー、インプレッションはそれぞれ異なる質問に答えます。リーチによる率は、実際に投稿を見た人々がどう反応したかを示します。フォロワーによる率は、投稿が全員に届いたかどうかに関わらず、読者全体のうちどれだけの割合が関わったかを示します。インプレッションによる率は、2回見た人も含めたすべての表示回数をカウントします。ある方法で計算した率を別の方法で計算した率と比較することは、エンゲージメントの数字がおかしく見える一般的な原因です。',
  'web.tools.engagementRate.field.interactions.label': 'インタラクション',
  'web.tools.engagementRate.field.interactions.help':
    '測定している投稿における、いいね、コメント、共有、保存を合計した数。',
  'web.tools.engagementRate.field.reach.label': 'リーチ',
  'web.tools.engagementRate.field.reach.help': '少なくとも1回投稿を見たアカウント数。',
  'web.tools.engagementRate.field.followers.label': 'フォロワー',
  'web.tools.engagementRate.field.followers.help': '投稿時点でのアカウントの規模。',
  'web.tools.engagementRate.field.impressions.label': 'インプレッション',
  'web.tools.engagementRate.field.impressions.help': '2回見た人も含めた総表示回数。',
  'web.tools.engagementRate.result.title': 'エンゲージメント率、3通り',
  'web.tools.engagementRate.result.empty': '利用不可',
  'web.tools.engagementRate.result.note':
    '比較できる普遍的な良い率というものは存在しません。プラットフォーム、フォーマット、読者の規模、業界によって異なり、基準値として提示される単一の数字はすべて、データを装った推測です。',
  'web.tools.engagementRate.basis.reach': 'リーチ基準',
  'web.tools.engagementRate.basis.followers': 'フォロワー基準',
  'web.tools.engagementRate.basis.impressions': 'インプレッション基準',
  'web.tools.engagementRate.faq.formula.q': '実際の計算式は何ですか?',
  'web.tools.engagementRate.faq.formula.a':
    'あなたが選んだ分母でインタラクション数を割り、パーセンテージとして表示します。ここでのインタラクションとは、いいね、コメント、共有、保存を合計したものです。一部のプラットフォームはこれらを別々に報告するため、その場合は合計を入力する前にご自身で足し合わせてください。',
  'web.tools.engagementRate.faq.basis.q': 'どの分母を使うべきですか?',
  'web.tools.engagementRate.faq.basis.a':
    'あなたのプラットフォームが投稿と一緒に報告しているものを使い、その後も常に同じものを使い続けてください。そうすることで、後の比較が公平になります。投稿ごとに分母を切り替えることは、追跡している率が実際には変わっていないのに変わったように見える最も一般的な原因です。',
} as const;
