/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Comporre',
  'composer.titleWithBrand': 'Componi per {brand}',
  'composer.master.label': 'Bozza principale',
  'composer.master.description':
    "Scrivi una volta qui. Le modifiche compatibili raggiungono ogni target selezionato. Apri una destinazione per scrivere una versione che riceverà solo l'account.",
  'composer.master.globalEdit': 'Modifica globale',
  'composer.master.placeholder': 'Cosa vuoi pubblicare?',
  'composer.brief.label': 'Breve',
  'composer.brief.placeholder': "Descrivi l'idea, il pubblico e il risultato che desideri.",
  'composer.sources.label': 'Riferimenti alla fonte',
  'composer.sources.empty': 'Nessuna fonte allegata.',
  'composer.campaign.label': 'Campagna',
  'composer.campaign.none': 'Nessuna campagna',
  'composer.contentLocale.label': 'Linguaggio dei contenuti',
  'composer.contentLocale.help':
    "La lingua della posta. Questo è separato dalla lingua dell'interfaccia.",
  'composer.market.label': 'Mercato del pubblico',

  'composer.targets.title': 'Obiettivi',
  'composer.targets.count':
    '{count, plural, =0 {Nessun account selezionato} one {# account} many {# account} other {# account}}',
  'composer.targets.publishSummary':
    "{count, plural, one {Questo pubblicherà su # account} many {Questo pubblicherà su # account} other {Questo pubblicherà su # account}} {when, select, ora {now} programmato {all'orario previsto} other {}}",
  'composer.targets.add': 'Aggiungi account',
  'composer.targets.empty': 'Seleziona almeno un account su cui pubblicare.',
  'composer.targets.state.ready': 'Pronto',
  'composer.targets.state.inherited': 'Ereditato dal maestro',
  'composer.targets.state.overridden': 'Sostituito',
  'composer.targets.state.warning': 'Controlla prima di pubblicare',
  'composer.targets.state.error': 'Ha bisogno di una soluzione',
  'composer.targets.state.approvalNeeded': "Necessaria l'approvazione",
  'composer.targets.overrideBadge': 'Sostituisci',
  'composer.targets.resetConfirm.title': 'Reimpostare questo obiettivo nella bozza principale?',
  'composer.targets.resetConfirm.body':
    'La copia, il supporto e le impostazioni modificati per {account} verranno sostituiti dalla bozza principale. Gli altri bersagli non sono interessati.',
  'composer.targets.divergence':
    '{count, plural, one {# target differiscono dalla bozza principale} many {# target differiscono dalla bozza principale} other {# target differiscono dalla bozza principale}}',

  'composer.applyToAll.title': 'Applicare a tutti i target',
  'composer.applyToAll.compatible':
    '{count, plural, one {# campo è compatibile con ogni target selezionato} many {# campi sono compatibili con ogni target selezionato} other {# campi sono compatibili con ogni target selezionato}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# campo non può essere applicato e rimane per target} many {# campi non può essere applicato e rimane per target} other {# campi non può essere applicato e rimane per target}}',
  'composer.applyToAll.creates':
    "L'applicazione crea una versione esplicita per ogni destinazione.",

  'composer.editor.label': 'Pubblica testo',
  'composer.editor.characterCount': '{used} di caratteri {limit}',
  'composer.editor.characterCountOver': '{over} oltre il limite di caratteri {limit}',
  'composer.editor.characterCountUnknown': 'Limite di caratteri non disponibile per questo account',
  'composer.editor.remaining':
    '{count, plural, one {# carattere rimasto} many {# carattere rimasto} other {# carattere rimasto}}',
  'composer.editor.hashtagCount':
    '{count, plural, one {# hashtag} many {# hashtag} other {# hashtag}}',
  'composer.editor.formatting': 'Formattazione',
  'composer.editor.emoji': 'Emoji',
  'composer.editor.mention': 'Menzione',
  'composer.editor.link': 'Collegamento',

  'composer.mentions.search': 'Cerca persone, pagine e aziende',
  'composer.mentions.searching': 'Ricerca {provider}',
  'composer.mentions.resolved': 'Contrassegnato con {label} su {provider}',
  'composer.mentions.unresolved':
    'Questa menzione non è stata ancora abbinata a un account {provider}. Verrà pubblicato come testo normale finché non selezioni un risultato.',
  'composer.mentions.noResults': 'Nessun account corrispondente su {provider}.',
  'composer.mentions.unsupported': 'Il tagging nativo non è disponibile per questo account.',

  'composer.destination.label': 'Destinazione',
  'composer.destination.placeholder': 'Scegli dove pubblicare',
  'composer.destination.community': 'Comunità',
  'composer.destination.board': 'Consiglio',
  'composer.destination.group': 'Gruppo',
  'composer.destination.page': 'Pagina',
  'composer.destination.organization': 'Organizzazione',
  'composer.destination.channel': 'Canale',
  'composer.destination.refresh': 'Aggiorna destinazioni',
  'composer.destination.lastRefreshed': 'Destinazioni aggiornate {relativeTime}',

  'composer.media.title': 'Media',
  'composer.media.count': '{count, plural, one {# file} many {# file} other {# file}}',
  'composer.media.dropHint': 'Trascina i file qui o sfoglia la tua libreria.',
  'composer.media.inheritFromMaster': 'Utilizzando il supporto principale',
  'composer.media.overridden': 'Questo target utilizza i propri media',
  'composer.media.altText.label': 'Testo alternativo',
  'composer.media.altText.placeholder':
    "Descrivi l'immagine per le persone che utilizzano uno screen reader.",
  'composer.media.altText.missing': 'Manca il testo alternativo.',
  'composer.media.altText.waive': 'Questa immagine non necessita di testo alternativo',
  'composer.media.altText.generate': 'Scrivi il testo alternativo',
  'composer.media.crop': 'Ritaglia',
  'composer.media.resize': 'Ridimensionare',
  'composer.media.rotate': 'Ruota',
  'composer.media.compress': 'Comprimi',
  'composer.media.convertFormat': 'Converti formato',
  'composer.media.thumbnail': 'Miniatura',
  'composer.media.aspectPreset': 'Preimpostazione della piattaforma',
  'composer.media.original': 'Originale',
  'composer.media.originalPreserved':
    'Il file originale viene mantenuto. Le modifiche creano una nuova versione.',
  'composer.media.uploading': 'Caricamento di {name}',
  'composer.media.processing': 'Preparazione di {name}',
  'composer.media.rights.label': 'Diritti e consenso',
  'composer.media.rights.confirm':
    'Ho il diritto di pubblicare questo media, comprese le persone, la musica, i loghi e i marchi in esso contenuti.',

  'composer.sequence.title': 'Commenti e discussione',
  'composer.sequence.root': 'Posta principale',
  'composer.sequence.item': 'Articolo {position}',
  'composer.sequence.add': 'Aggiungi un commento o un elemento della discussione',
  'composer.sequence.delayLabel': "Ritardo dopo l'elemento precedente",
  'composer.sequence.delayImmediate': 'Immediatamente',
  'composer.sequence.delayMinutes':
    '{count, plural, one {# minuto} many {# minuti} other {# minuti}}',
  'composer.sequence.delayCustom': 'Ritardo personalizzato',
  'composer.sequence.accountLabel': 'Pubblica questo elemento come',
  'composer.sequence.unsupported':
    'Questo account non supporta gli elementi di follow-up pianificati.',

  'composer.repeat.title': 'Ripeti',
  'composer.repeat.off': 'Non ripetere',
  'composer.repeat.everyDays':
    '{count, plural, one {Ogni giorno} many {Ogni # giorni} other {Ogni # giorni}}',
  'composer.repeat.endLabel': 'Smettila di ripetere',
  'composer.repeat.endOnDate': 'Ad un appuntamento',
  'composer.repeat.endAfterCount': 'Dopo una serie di post',
  'composer.repeat.endRequired': 'Scegli una data di fine o un numero di ripetizioni.',
  'composer.repeat.summary':
    'Ripete {cadence} fino a {end}. Ogni evento riceve la propria approvazione e ricevuta.',

  'composer.links.title': 'Collegamenti',
  'composer.links.keepOriginal': "Mantieni l'URL originale",
  'composer.links.track': 'Sostituisci con un collegamento breve tracciato',
  'composer.links.utm': 'Parametri UTM',
  'composer.links.domain': 'Collega dominio',
  'composer.links.finalUrl': 'Questo verrà pubblicato come {url}',
  'composer.links.frozenAtApproval':
    "L'URL breve e la destinazione esatti vengono congelati nella versione approvata.",

  'composer.signature.title': 'Firma',
  'composer.signature.none': 'Nessuna firma',
  'composer.signature.autoApplied':
    'La firma {name} è stata aggiunta automaticamente. Puoi cambiarlo.',

  'composer.set.title': 'Imposta',
  'composer.set.startFrom': 'Iniziare da un insieme',
  'composer.set.continueWithout': 'Continua senza un set',
  'composer.set.applied': 'Set applicato {name}. Questa bozza è ora indipendente dal Set.',

  'composer.validation.title': 'Validazione',
  'composer.validation.clean': 'Nessun problema trovato per i target selezionati.',
  'composer.validation.issueCount':
    '{count, plural, one {# problema} many {# problemi} other {# problemi}} su {targets, plural, one {# target} many {# target} other {# target}}',
  'composer.validation.blocking': 'Questo deve essere risolto prima della pianificazione.',
  'composer.validation.warning': 'Controllalo prima di pubblicare.',
  'composer.validation.revalidated':
    'Ricontrollato rispetto ai limiti attuali della piattaforma {relativeTime}.',

  'composer.preview.title': 'Anteprima',
  'composer.preview.forAccount': 'Anteprima per {account} su {provider}',
  'composer.preview.approximate':
    'Questa anteprima utilizza le regole della piattaforma che abbiamo registrato. Il post pubblicato può differire se cambia la piattaforma.',
  'composer.preview.unavailable':
    "Per questo account non è ancora disponibile un'anteprima vera e propria.",

  'composer.cost.title': 'Costo stimato del fornitore',
  'composer.cost.estimate': "{provider} stima {amount} dell'utilizzo dell'API per questo post.",
  'composer.cost.linkSurcharge':
    '{provider} addebita di più per i post che contengono un URL. La rimozione del collegamento riduce la stima.',
  'composer.cost.bulkWarning':
    "{count, plural, one {# pubblicazione} many {# pubblicazioni} other {# pubblicazioni}} in un'unica azione. Rivedi il preventivo prima di continuare.",
  'composer.cost.reconciled': "L'utilizzo effettivo viene riconciliato dopo la pubblicazione.",
  'composer.cost.none': 'Nessun costo del fornitore misurato per questo post.',

  'composer.autosave.saving': 'Risparmiare',
  'composer.autosave.saved': 'Salvato {relativeTime}',
  'composer.autosave.offline':
    'Non in linea. La tua bozza viene conservata su questo dispositivo e verrà sincronizzata.',
  'composer.autosave.conflict':
    '{name} ha modificato questa bozza mentre stavi scrivendo. Esamina entrambe le versioni prima di salvare.',
  'composer.autosave.failed': 'Impossibile salvare. Il tuo testo è ancora qui. Nuovo tentativo.',

  'composer.ai.title': 'Assistere',
  'composer.ai.makeConcise': 'Rendi più conciso',
  'composer.ai.adaptForPlatform': 'Adatta per {provider}',
  'composer.ai.transcreate': 'Transcrea in {language}',
  'composer.ai.checkClaims': 'Controlla i reclami',
  'composer.ai.writeAltText': 'Scrivi il testo alternativo',
  'composer.ai.suggestHooks': 'Suggerisci ganci',
  'composer.ai.suggestCta': "Suggerisci un invito all'azione",
  'composer.ai.diffTitle': 'Modifica proposta',
  'composer.ai.diffHelp': 'Non cambia nulla finché non lo accetti.',
  'composer.ai.working': 'Ci sto lavorando',
  'composer.ai.sources':
    'Basato su {count, plural, one {# source} many {# source} other {# source}} che hai approvato',
  'composer.ai.uncertain':
    'Questa frase non ha un equivalente pulito in {language}. Rivedilo con un madrelingua prima di pubblicarlo.',

  'composer.schedule.title': 'Programma',
  'composer.schedule.dateLabel': 'Data',
  'composer.schedule.timeLabel': 'Tempo',
  'composer.schedule.timeZoneLabel': 'Fuso orario',
  'composer.schedule.nextFreeSlot': 'Prossimo spazio libero',
  'composer.schedule.localAndUtc': '{local} in {timeZone}. {utc} UTC.',
  'composer.schedule.dstWarning':
    'Gli orologi cambiano in {timeZone} in questa data. Questo post viene pubblicato su {local}, ovvero {utc} UTC.',
  'composer.schedule.pastWarning': 'Quel tempo è passato. Scegli un orario successivo.',
  'composer.schedule.confirmTitle': 'Conferma prima della pianificazione',
  'composer.schedule.confirmPublishNow': 'Conferma prima di pubblicare ora',
  'composer.schedule.approverLabel': 'Approvatore',
  'composer.schedule.policyLabel': 'Politica di approvazione',
  'composer.schedule.duplicateWarning':
    'Contenuto simile è stato pubblicato su {account} {relativeTime}. Pubblicarlo nuovamente può violare le regole della piattaforma sui contenuti duplicati.',
  'composer.schedule.cadenceWarning':
    '{account} ha già {count, plural, one {# post} many {# post} other {# post}} programmato quel giorno.',
} as const;
