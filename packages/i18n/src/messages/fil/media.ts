/**
 * Media derivatives: the non-generative editor and the refusals it can hit.
 *
 * Two groups. `mediaLib.derivative.*` is what a person reads while cropping,
 * rotating, resizing, converting or compressing a file they already uploaded.
 * `error.media_derivative_*.message` is what the application boundary says when it
 * refuses a plan, and every one of those sentences names the reason and the
 * next step rather than reporting that something failed.
 *
 * The vocabulary is deliberate. Nothing here says generate, enhance, upscale,
 * restore or fix, because Post Array does not do any of those and copy that hinted
 * otherwise would be the first half of a promise the product cannot keep. The
 * word used throughout is "version": an edit adds one, and the original stays
 * exactly where it was.
 */
export const mediaMessages = {
  // ==================================================== the editor ====
  'mediaLib.derivative.heading': 'I-edit ang larawang ito',
  'mediaLib.derivative.description':
    'Mag-crop, mag-rotate, mag-resize, magpalit ng format, o mag-compress. Ang bawat pagbabago ay gumagana sa mga pixel na nasa file mo na. Walang idinaragdag na wala roon dati.',
  'mediaLib.derivative.originalKept':
    'Hindi kailanman pinapalitan ang orihinal. Ang bawat edit ay nase-save bilang hiwalay na bersyon na mapipili mo kapag nag-compose.',
  'mediaLib.derivative.apply': 'I-save ang bersyong ito',
  'mediaLib.derivative.applying': 'Sine-save ang bersyong ito',
  'mediaLib.derivative.discard': 'Ibasura ang mga pagbabago',
  'mediaLib.derivative.noChanges': 'Wala pang ise-save. Baguhin ang isang value sa itaas.',

  'mediaLib.derivative.tab.crop': 'Crop',
  'mediaLib.derivative.tab.transform': 'I-rotate at i-resize',
  'mediaLib.derivative.tab.output': 'Format',

  'mediaLib.derivative.cropHint':
    'I-type ang mga numero, o gamitin ang arrow key sa alinmang field. Walang hakbang dito ang kailangan ng mouse.',
  'mediaLib.derivative.cropX': 'Kaliwang gilid, sa pixel',
  'mediaLib.derivative.cropY': 'Itaas na gilid, sa pixel',
  'mediaLib.derivative.cropWidth': 'Lapad ng crop, sa pixel',
  'mediaLib.derivative.cropHeight': 'Taas ng crop, sa pixel',
  'mediaLib.derivative.rotate': 'I-rotate',
  'mediaLib.derivative.rotateNone': 'Walang pag-ikot',
  'mediaLib.derivative.rotateDegrees': '{degrees} degree pakanan',
  'mediaLib.derivative.resizeWidth': 'Bagong lapad, sa pixel',
  'mediaLib.derivative.resizeHeight': 'Bagong taas, sa pixel',
  'mediaLib.derivative.lockRatio': 'Panatilihin ang hugis kapag binago ko ang isang gilid',
  'mediaLib.derivative.format': 'I-save bilang',
  'mediaLib.derivative.formatSame': 'Panatilihin ang kasalukuyang format',
  'mediaLib.derivative.quality': 'Kalidad',
  'mediaLib.derivative.qualityHint':
    'Nagreresulta ang mas mababang kalidad sa mas maliit na file. Gumagana ito sa JPEG at WebP. Walang nawawalang data ang PNG at binabalewala nito ito.',
  'mediaLib.derivative.projected': 'Magiging {width} sa {height} pixel ang bersyong ito.',
  'mediaLib.derivative.projectedUnavailable':
    "Hindi pa available ang laki ng bersyong ito hangga't hindi pa ito nagagawa.",

  // ==================================================== the versions list ====
  'mediaLib.derivative.listHeading': 'Mga bersyon',
  'mediaLib.derivative.original': 'Orihinal',
  'mediaLib.derivative.originalHint': 'Palaging pinapanatili. Hindi kailanman na-o-overwrite.',
  'mediaLib.derivative.item': '{width} sa {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Wala pang na-edit na bersyon. Ang orihinal lang ang file dito.',
  'mediaLib.derivative.select': 'Gamitin ang bersyong ito',
  'mediaLib.derivative.selected': 'Ginagamit para sa post na ito',
  'mediaLib.derivative.useOriginal': 'Gamitin ang orihinal',
  'mediaLib.derivative.processing': 'Ginagawa ang bersyong ito. Lalabas ito dito kapag handa na.',
  'mediaLib.derivative.alreadyExists':
    'Nagawa mo na ang eksaktong edit na ito noon, kaya ginamit namin ulit ang bersyong iyon sa halip na gumawa ng ikalawa.',
  'mediaLib.derivative.failedTitle': 'Hindi magawa ang bersyong ito',
  'mediaLib.derivative.failedBody':
    'Walang na-save at hindi nagalaw ang orihinal mo. Baguhin ang mga value at subukan ulit.',
  'mediaLib.derivative.openEditor': 'I-edit ang {name}',

  'mediaLib.derivative.unsupportedTitle': 'Gumagana lang ang pag-edit sa mga larawan',
  'mediaLib.derivative.unsupportedBody':
    'Hindi mae-edit dito ang video, audio, at dokumento. Ihanda ang file bago mo ito i-upload. Hindi rin nagbabago ang orihinal mong upload sa anumang kaso.',

  'mediaLib.derivative.nonGenerative':
    'Hindi gumagawa ang Post Array ng mga larawan o video. Ang editor na ito ay nag-c-crop, nag-r-rotate, nag-r-resize, nag-c-convert, at nag-c-compress lang sa in-upload mo.',

  // ==================================================== refusals ====
  'error.media_derivative_no_operations.message':
    'Pumili ng kahit isang pagbabago bago mag-save ng bersyon.',
  'error.media_derivative_duplicate_operation.message':
    'Isang beses lang lalabas ang bawat uri ng pagbabago. Alisin ang ikalawang {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Lumalampas sa gilid ng larawan ang crop na iyon, na may sukat na {sourceWidth} sa {sourceHeight} pixel. Ilipat ito o paliitin.',
  'error.media_derivative_upscale_rejected.message':
    'Hindi kailanman pinapalaki ng editor na ito ang isang larawan, dahil ang mga karagdagang pixel ay gagawin lang, hindi mo talaga. Ang pinakamalaking magiging sukat ng bersyong ito ay {availableWidth} sa {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'Gumagana lang ang pag-edit sa mga larawang JPEG, PNG, WebP, at GIF. Ang file na ito ay {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Hindi pa namin alam ang sukat ng larawang ito, kaya hindi pa namin ma-check ang pagbabago laban dito. Subukan ulit kapag tapos na ang pagproseso.',
  'error.media_derivative_format_required.message':
    'Pumili ng format na ise-save. Hindi mase-save dito ang isang {sourceMimeType} file bilang sarili nito.',
  'error.media_derivative_quality_unsupported.message':
    'Walang nawawalang data ang PNG, kaya walang magagawa ang setting ng kalidad. Alisin ito, o mag-save bilang JPEG o WebP.',
  'error.media_derivative_no_change.message': 'Iyan na ang format na ginagamit na ng file na ito.',
  'error.media_derivative_source_unavailable.message':
    'Wala na sa storage ang file na pagmumulan sana ng bersyong ito.',
  'error.media_derivative_preset_mismatch.message':
    'Hindi tumutugma ang kahilingan sa pag-edit na ito sa mga pagbabagong inilalarawan nito. Walang nagawa. Subukan ulit mula sa editor.',
  'error.media_derivative_empty_result.message':
    'Walang nagawang larawan ang edit, kaya walang na-save. Hindi nagalaw ang orihinal mo.',
  'error.media_derivative_transform_failed.message':
    'Hindi mabasa o maisulat ang larawang ito. Walang na-save at hindi nagalaw ang orihinal mo.',
  'error.media_derivative_write_failed.message':
    'Hindi maitala ang bersyong ito. Walang na-save at hindi nagalaw ang orihinal mo.',
} as const;
