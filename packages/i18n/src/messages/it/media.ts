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
 * restore or fix, because Relay does not do any of those and copy that hinted
 * otherwise would be the first half of a promise the product cannot keep. The
 * word used throughout is "version": an edit adds one, and the original stays
 * exactly where it was.
 */
export const mediaMessages = {
  // ==================================================== the editor ====
  'mediaLib.derivative.heading': 'Modifica questa immagine',
  'mediaLib.derivative.description':
    'Ritaglia, ruota, ridimensiona, cambia il formato o comprimi. Ogni modifica agisce sui pixel già presenti nel tuo file. Non viene aggiunto nulla che non ci fosse già.',
  'mediaLib.derivative.originalKept':
    "L'originale non viene mai sostituito. Ogni modifica viene salvata come versione separata che puoi scegliere quando componi.",
  'mediaLib.derivative.apply': 'Salva questa versione',
  'mediaLib.derivative.applying': 'Salvataggio di questa versione in corso',
  'mediaLib.derivative.discard': 'Scarta le modifiche',
  'mediaLib.derivative.noChanges': 'Ancora niente da salvare. Cambia un valore qui sopra.',

  'mediaLib.derivative.tab.crop': 'Ritaglia',
  'mediaLib.derivative.tab.transform': 'Ruota e ridimensiona',
  'mediaLib.derivative.tab.output': 'Formato',

  'mediaLib.derivative.cropHint':
    'Digita i numeri, oppure usa i tasti freccia in qualsiasi campo. Nessun passaggio qui richiede il mouse.',
  'mediaLib.derivative.cropX': 'Bordo sinistro, in pixel',
  'mediaLib.derivative.cropY': 'Bordo superiore, in pixel',
  'mediaLib.derivative.cropWidth': 'Larghezza del ritaglio, in pixel',
  'mediaLib.derivative.cropHeight': 'Altezza del ritaglio, in pixel',
  'mediaLib.derivative.rotate': 'Ruota',
  'mediaLib.derivative.rotateNone': 'Nessuna rotazione',
  'mediaLib.derivative.rotateDegrees': '{degrees} gradi in senso orario',
  'mediaLib.derivative.resizeWidth': 'Nuova larghezza, in pixel',
  'mediaLib.derivative.resizeHeight': 'Nuova altezza, in pixel',
  'mediaLib.derivative.lockRatio': 'Mantieni la forma quando cambio un lato',
  'mediaLib.derivative.format': 'Salva come',
  'mediaLib.derivative.formatSame': 'Mantieni il formato attuale',
  'mediaLib.derivative.quality': 'Qualità',
  'mediaLib.derivative.qualityHint':
    'Una qualità più bassa produce un file più piccolo. Si applica a JPEG e WebP. PNG è senza perdita e la ignora.',
  'mediaLib.derivative.projected': 'Questa versione sarà {width} per {height} pixel.',
  'mediaLib.derivative.projectedUnavailable':
    'La dimensione di questa versione non è disponibile finché non viene creata.',

  // ==================================================== the versions list ====
  'mediaLib.derivative.listHeading': 'Versioni',
  'mediaLib.derivative.original': 'Originale',
  'mediaLib.derivative.originalHint': 'Sempre conservato. Mai sovrascritto.',
  'mediaLib.derivative.item': '{width} per {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': "Ancora nessuna versione modificata. L'originale è l'unico file qui.",
  'mediaLib.derivative.select': 'Usa questa versione',
  'mediaLib.derivative.selected': 'In uso per questo post',
  'mediaLib.derivative.useOriginal': "Usa l'originale",
  'mediaLib.derivative.processing': 'Questa versione è in fase di creazione. Comparirà qui quando sarà pronta.',
  'mediaLib.derivative.alreadyExists':
    'Hai già fatto esattamente questa modifica in precedenza, quindi abbiamo riutilizzato quella versione invece di crearne una seconda.',
  'mediaLib.derivative.failedTitle': 'Non è stato possibile creare questa versione',
  'mediaLib.derivative.failedBody':
    'Non è stato salvato nulla e il tuo originale è intatto. Cambia i valori e riprova.',
  'mediaLib.derivative.openEditor': 'Modifica {name}',

  'mediaLib.derivative.unsupportedTitle': 'La modifica funziona solo con le immagini',
  'mediaLib.derivative.unsupportedBody':
    'Video, audio e documenti non possono essere modificati qui. Prepara il file prima di caricarlo. Il tuo caricamento originale non viene comunque mai modificato.',

  'mediaLib.derivative.nonGenerative':
    'Relay non genera immagini o video. Questo editor si limita a ritagliare, ruotare, ridimensionare, convertire e comprimere ciò che hai caricato.',

  // ==================================================== refusals ====
  'error.media_derivative_no_operations.message': 'Scegli almeno una modifica prima di salvare una versione.',
  'error.media_derivative_duplicate_operation.message':
    'Ogni tipo di modifica può comparire una sola volta. Rimuovi il secondo {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    "Quel ritaglio supera il bordo dell'immagine, che è {sourceWidth} per {sourceHeight} pixel. Spostalo o rimpiccioliscilo.",
  'error.media_derivative_upscale_rejected.message':
    "Questo editor non ingrandisce mai un'immagine, perché i pixel in più sarebbero inventati e non tuoi. La dimensione massima di questa versione può essere {availableWidth} per {availableHeight}.",
  'error.media_derivative_source_unsupported.message':
    'La modifica funziona con immagini JPEG, PNG, WebP e GIF. Questo file è {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    "Non conosciamo ancora le dimensioni di questa immagine, quindi non possiamo verificare la modifica rispetto ad esse. Riprova quando l'elaborazione sarà terminata.",
  'error.media_derivative_format_required.message':
    'Scegli un formato in cui salvare. Un file {sourceMimeType} non può essere salvato qui come se stesso.',
  'error.media_derivative_quality_unsupported.message':
    "PNG è senza perdita, quindi un'impostazione di qualità non avrebbe alcun effetto. Rimuovila, oppure salva come JPEG o WebP.",
  'error.media_derivative_no_change.message': 'Questo è già il formato che questo file utilizza.',
  'error.media_derivative_source_unavailable.message':
    'Il file da cui dovrebbe provenire questa versione non è più in archivio.',
  'error.media_derivative_preset_mismatch.message':
    "Questa richiesta di modifica non corrisponde alle modifiche che descrive. Non è stato creato nulla. Riprova dall'editor.",
  'error.media_derivative_empty_result.message':
    'La modifica non ha prodotto alcuna immagine, quindi non è stato salvato nulla. Il tuo originale è intatto.',
  'error.media_derivative_transform_failed.message':
    'Non è stato possibile leggere o scrivere questa immagine. Non è stato salvato nulla e il tuo originale è intatto.',
  'error.media_derivative_write_failed.message':
    'Non è stato possibile registrare questa versione. Non è stato salvato nulla e il tuo originale è intatto.',
} as const;
