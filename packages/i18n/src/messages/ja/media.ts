export const mediaMessages = {
  // ==================================================== エディター ====
  'mediaLib.derivative.heading': 'この画像を編集',
  'mediaLib.derivative.description':
    'トリミング、回転、サイズ変更、フォーマット変更、圧縮ができます。すべての変更はファイル内にすでにあるピクセルに対して行われます。存在しなかったものが追加されることはありません。',
  'mediaLib.derivative.originalKept':
    'オリジナルは決して置き換えられません。各編集は、作成時に選べる別バージョンとして保存されます。',
  'mediaLib.derivative.apply': 'このバージョンを保存',
  'mediaLib.derivative.applying': 'このバージョンを保存中',
  'mediaLib.derivative.discard': '変更を破棄',
  'mediaLib.derivative.noChanges': '保存する変更がまだありません。上の値を変更してください。',

  'mediaLib.derivative.tab.crop': 'トリミング',
  'mediaLib.derivative.tab.transform': '回転とサイズ変更',
  'mediaLib.derivative.tab.output': 'フォーマット',

  'mediaLib.derivative.cropHint':
    '数値を入力するか、どのフィールドでも矢印キーを使用できます。マウスが必要な手順はここにはありません。',
  'mediaLib.derivative.cropX': '左端、ピクセル単位',
  'mediaLib.derivative.cropY': '上端、ピクセル単位',
  'mediaLib.derivative.cropWidth': 'トリミング幅、ピクセル単位',
  'mediaLib.derivative.cropHeight': 'トリミング高さ、ピクセル単位',
  'mediaLib.derivative.rotate': '回転',
  'mediaLib.derivative.rotateNone': '回転なし',
  'mediaLib.derivative.rotateDegrees': '時計回りに{degrees}度',
  'mediaLib.derivative.resizeWidth': '新しい幅、ピクセル単位',
  'mediaLib.derivative.resizeHeight': '新しい高さ、ピクセル単位',
  'mediaLib.derivative.lockRatio': '片側を変更したとき形状を保持する',
  'mediaLib.derivative.format': '保存形式',
  'mediaLib.derivative.formatSame': '現在のフォーマットを維持',
  'mediaLib.derivative.quality': '画質',
  'mediaLib.derivative.qualityHint':
    '画質を下げるとファイルが小さくなります。JPEGとWebPに適用されます。PNGは可逆圧縮のため無視されます。',
  'mediaLib.derivative.projected': 'このバージョンは{width}×{height}ピクセルになります。',
  'mediaLib.derivative.projectedUnavailable':
    'このバージョンのサイズは作成されるまで利用できません。',

  // ==================================================== バージョン一覧 ====
  'mediaLib.derivative.listHeading': 'バージョン',
  'mediaLib.derivative.original': 'オリジナル',
  'mediaLib.derivative.originalHint': '常に保持されます。上書きされることはありません。',
  'mediaLib.derivative.item': '{width}×{height}、{mimeType}、{size}',
  'mediaLib.derivative.empty':
    'まだ編集済みのバージョンはありません。オリジナルがここにある唯一のファイルです。',
  'mediaLib.derivative.select': 'このバージョンを使用',
  'mediaLib.derivative.selected': 'この投稿で使用中',
  'mediaLib.derivative.useOriginal': 'オリジナルを使用',
  'mediaLib.derivative.processing':
    'このバージョンは作成中です。準備ができるとここに表示されます。',
  'mediaLib.derivative.alreadyExists':
    '以前まったく同じ編集を行っているため、2つ目を作成する代わりにそのバージョンを再利用しました。',
  'mediaLib.derivative.failedTitle': 'このバージョンは作成できませんでした',
  'mediaLib.derivative.failedBody':
    '何も保存されておらず、オリジナルは変更されていません。値を変更して再試行してください。',
  'mediaLib.derivative.openEditor': '{name}を編集',

  'mediaLib.derivative.unsupportedTitle': '編集は画像のみに対応しています',
  'mediaLib.derivative.unsupportedBody':
    '動画、音声、文書はここでは編集できません。アップロード前にファイルを準備してください。いずれにしても、元のアップロードは変更されません。',

  'mediaLib.derivative.nonGenerative':
    'このツールは画像や動画を生成しません。このエディターはアップロードしたものをトリミング、回転、サイズ変更、変換、圧縮するだけです。',

  // ==================================================== 拒否 ====
  'error.media_derivative_no_operations.message':
    'バージョンを保存する前に少なくとも1つの変更を選んでください。',
  'error.media_derivative_duplicate_operation.message':
    '各種類の変更は1回だけ指定できます。2つ目の{operation}を削除してください。',
  'error.media_derivative_crop_out_of_bounds.message':
    'そのトリミングは画像({sourceWidth}×{sourceHeight}ピクセル)の端を超えています。移動するか小さくしてください。',
  'error.media_derivative_upscale_rejected.message':
    'このエディターは画像を拡大することはありません。追加のピクセルは実物ではなく作り出されたものになるためです。このバージョンの最大サイズは{availableWidth}×{availableHeight}です。',
  'error.media_derivative_source_unsupported.message':
    '編集はJPEG、PNG、WebP、GIF画像に対応しています。このファイルは{mimeType}です。',
  'error.media_derivative_dimensions_unknown.message':
    'この画像のサイズがまだわからないため、変更を照合できません。処理が完了したら再試行してください。',
  'error.media_derivative_format_required.message':
    '保存するフォーマットを選んでください。{sourceMimeType}ファイルはここではそのまま保存できません。',
  'error.media_derivative_quality_unsupported.message':
    'PNGは可逆圧縮のため、画質設定は何の効果もありません。設定を削除するか、JPEGまたはWebPで保存してください。',
  'error.media_derivative_no_change.message':
    'それはこのファイルがすでに使用しているフォーマットです。',
  'error.media_derivative_source_unavailable.message':
    'このバージョンの元になるファイルはストレージにもう存在しません。',
  'error.media_derivative_preset_mismatch.message':
    'この編集リクエストは説明されている変更と一致しません。何も作成されませんでした。エディターからやり直してください。',
  'error.media_derivative_empty_result.message':
    'この編集は画像を生成しなかったため、何も保存されませんでした。オリジナルは変更されていません。',
  'error.media_derivative_transform_failed.message':
    'この画像を読み込みまたは書き込みできませんでした。何も保存されておらず、オリジナルは変更されていません。',
  'error.media_derivative_write_failed.message':
    'このバージョンを記録できませんでした。何も保存されておらず、オリジナルは変更されていません。',
} as const;
