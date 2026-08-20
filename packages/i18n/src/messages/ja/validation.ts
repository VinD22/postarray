/** Japanese beta catalog. */
export const validationMessages = {
  'validation.text_required.message': '{provider}この投稿タイプにはテキストが必要です。',
  'validation.text_too_long.message': '{over, plural, other {# 文字が制限を超えています{account}}}',
  'validation.text_too_long.hint': '{provider}許可します{limit}このアカウントのキャラクター。',
  'validation.text_too_short.message': '{provider}少なくとも必要です{min}ここの文字。',
  'validation.title_required.message': '{provider}タイトルが必要です。',
  'validation.title_too_long.message': 'タイトルは以上です{limit}文字数制限。',
  'validation.description_too_long.message': '説明は以上です{limit}文字数制限。',
  'validation.media_required.message':
    '{provider}この投稿タイプには少なくとも 1 つの画像または動画が必要です。',
  'validation.media_count_exceeded.message':
    '{provider}最大でも受け入れます{limit, plural, other {# 個のファイル}}ここ。この投稿には、{count}。',
  'validation.media_type_unsupported.message': '{provider}受け入れません{mimeType}ファイル。',
  'validation.media_aspect_ratio_unsupported.message':
    'このファイルは{actual}。{provider}間の比率が必要です{min}そして{max}。',
  'validation.media_aspect_ratio_unsupported.hint':
    'これを修正するには、プラットフォーム プリセットを使用してトリミングします。',
  'validation.media_resolution_too_low.message':
    'このファイルは{actual}。{provider}少なくとも必要です{required}。',
  'validation.media_duration_too_long.message':
    'このビデオは{actual}。{provider}まで受け入れます{limit}このアカウントの場合。',
  'validation.media_duration_too_short.message':
    'このビデオは{actual}。{provider}少なくとも必要です{limit}。',
  'validation.media_file_too_large.message':
    'このファイルは{actual}。{provider}まで受け入れます{limit}。',
  'validation.media_mixed_types_unsupported.message':
    '{provider}画像と動画を同じ投稿で公開することはできません。',
  'validation.alt_text_missing.message':
    '代替テキストが欠落しています{count, plural, other {# 枚の画像}}。',
  'validation.alt_text_missing.hint': '画像について説明するか、装飾としてマークを付けます。',
  'validation.thumbnail_unsupported.message':
    '{provider}ここではカスタム サムネイルを受け入れません。',
  'validation.destination_required.message': 'これを公開する場所を選択してください{provider}。',
  'validation.destination_unsupported.message':
    '{destination}ではこの投稿タイプは受け付けられません{provider}。',
  'validation.mention_unresolved.message':
    '{count, plural, other {# 件のメンションが実際のアカウントと一致していません}}。',
  'validation.mention_unresolved.hint':
    '検索結果からアカウントを選択するか、メンションを削除します。プレーン テキストはネイティブ タグとして公開されることはありません。',
  'validation.hashtag_count_exceeded.message':
    '{count}ハッシュタグ。{provider}以上を数えます{limit}スパムとして。',
  'validation.link_not_allowed.message': '{provider}このフィールドではリンクを許可しません。',
  'validation.link_destination_unverified.message':
    'リンクドメイン{domain}このワークスペースでは検証されていません。',
  'validation.privacy_setting_required.message':
    '{provider}公開前に明示的なプライバシーの選択が必要です。',
  'validation.privacy_setting_required.hint':
    'デフォルトはありません。この投稿を閲覧できる人を選択してください。',
  'validation.disclosure_required.message':
    'この投稿は、ブランド ルールに基づいて開示が必要です。{market}。',
  'validation.first_comment_unsupported.message':
    '{provider}は、このアカウントのスケジュールされた最初のコメントをサポートしていません。',
  'validation.thread_unsupported.message':
    '{provider}は、このアカウントのスレッドをサポートしていません。',
  'validation.repeat_end_required.message': '繰り返し投稿には終了日または繰り返し回数が必要です。',
  'validation.schedule_in_past.message': 'そんな時代が過ぎてしまいました{timeZone}。',
  'validation.schedule_too_far_ahead.message':
    'これはそれよりもさらに先のことです{limit}この資格情報に対して先読みセットを設定します。',
  'validation.schedule_outside_quiet_hours.message':
    'これは、設定された静かな時間帯に該当します。{project}。',
  'validation.duplicate_within_window.message':
    '非常に類似したコンテンツがすでにスケジュールまたは公開されています{account}内で{window}。',
  'validation.blocked_term_present.message':
    'テキストには禁止されている用語が含まれています{project}。',
  'validation.unsupported_claim.message':
    'この主張は、以下の承認された主張には含まれていません。{project}。',
  'validation.unsupported_claim.hint':
    '証拠とともに承認された主張にそれを追加するか、文を言い直してください。',
  'validation.cadence_exceeded.message':
    '{account}出版するだろう{count, plural, other {# 回}}あの日、限界を超えて{limit}。',
  'validation.connection_paused.message': '{account}は一時停止されており、公開されません。',
  'validation.account_type_invalid.message':
    '{account}アカウントの種類ではありません{provider}この投稿タイプには必須です。',
  'validation.severity.error': '修正する必要があります',
  'validation.severity.warning': 'これをチェックしてください',
  'validation.severity.info': 'ご参考までに',
  'validation.field.required': 'この項目は必須です。',
  'validation.field.tooShort': '少なくとも使用してください{min, plural, other {# 文字}}。',
  'validation.field.tooLong': 'せいぜい使用{max, plural, other {# 文字}}。',
  'validation.field.invalidEmail': '有効な電子メール アドレスを入力してください。',
  'validation.field.invalidUrl': 'https を含む完全な URL を入力します。',
  'validation.field.invalidDate': '有効な日付を入力してください。',
  'validation.field.invalidTime': '有効な時間を入力してください。',
  'validation.field.invalidNumber': '数字を入力してください。',
  'validation.field.outOfRange': '間の値を入力してください{min}そして{max}。',
  'validation.field.mustMatch': 'これら 2 つの値は一致する必要があります。',
  'validation.field.alreadyTaken': 'それはすでに使用されています。',
  'validation.field.unsafeValue': 'ここではその値は許可されません。',
} as const;
