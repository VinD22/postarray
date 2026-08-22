/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 *
 * Three features that all answer "who is this going to, and when", grouped in
 * one namespace so their vocabulary stays consistent. The hold copy is the part
 * most worth reading twice: pausing stops work that has not happened, and every
 * sentence here has to say that plainly rather than implying a post can be
 * pulled back off a platform.
 */
export const postingSetMessages = {
  /* ------------------------------------------------------------- the hold */
  'calendar.hold.action': 'Pausa',
  'calendar.hold.resumeAction': 'Riprendi',
  'calendar.hold.badge': 'In pausa',
  'calendar.hold.badgeBilling': 'In pausa per la fatturazione',
  'calendar.hold.term': 'Pausa',
  'calendar.hold.byPerson': 'Messo in pausa da te il {date}.',
  'calendar.hold.byBilling':
    "Messo in pausa il {date} perché quest'area di lavoro ha perso l'accesso completo.",
  'calendar.hold.none': 'Non in pausa',

  'calendar.hold.confirmTitle': 'Mettere in pausa questo post?',
  'calendar.hold.confirmBody':
    'Questo post resterà dove si trova e non verrà pubblicato alle {time}. Puoi riprenderlo in qualsiasi momento prima di allora, oppure scegliere un nuovo orario se quello è già passato.',
  'calendar.hold.confirmScope':
    'Mettere in pausa interrompe ciò che non è ancora successo. Tutto ciò che è già stato pubblicato su una piattaforma resta pubblicato, e la pausa non lo elimina né lo modifica.',
  'calendar.hold.confirmNoteLabel': 'Perché stai mettendo in pausa questo? (facoltativo)',
  'calendar.hold.confirmNoteHint':
    'Conservato nel registro di controllo per il tuo team. Non viene inviato a nessuna piattaforma.',
  'calendar.hold.confirm': 'Metti in pausa questo post',
  'calendar.hold.cancel': 'Lascialo programmato',

  'calendar.hold.resumeTitle': 'Riprendere questo post?',
  'calendar.hold.resumeBody': 'Verrà pubblicato alle {time}, in {timeZone}.',
  'calendar.hold.resumeMissedTitle': "Quell'orario è passato",
  'calendar.hold.resumeMissedBody':
    'Questo post era previsto per le {time} mentre era in pausa. Scegli un nuovo orario in modo che non venga pubblicato nel momento in cui riprendi.',
  'calendar.hold.resumeTimeLabel': 'Nuovo orario di pubblicazione',
  'calendar.hold.resumeConfirm': 'Riprendi',

  'calendar.hold.paused': 'In pausa. Non verrà pubblicato finché non lo riprendi.',
  'calendar.hold.resumed': 'Ripreso. Verrà pubblicato alle {time}.',

  'calendar.hold.blocked.published':
    'Questo post è già stato pubblicato. Mettere in pausa non può ritirarlo dalla piattaforma.',
  'calendar.hold.blocked.inFlight':
    'Questo post è in fase di invio in questo momento. È troppo tardi per metterlo in pausa, e interromperlo a metà potrebbe lasciarlo pubblicato solo in parte.',
  'calendar.hold.blocked.finished':
    "Questo post è già concluso, quindi non c'è nulla da mettere in pausa.",
  'calendar.hold.blocked.billing':
    "Questo post è in pausa perché quest'area di lavoro ha perso l'accesso completo. Riprenderlo è una questione di fatturazione, non di programmazione.",
  'calendar.hold.blocked.billingAction': 'Vai alla fatturazione',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Set di pubblicazione',
  'set.lede':
    'Una risposta salvata a «a chi sto pubblicando questo, e come». Applicare un Set copia le sue impostazioni in una nuova bozza.',
  'set.appliedOnce':
    'Un Set viene letto una sola volta, quando lo applichi. Modificarlo in seguito cambia da cosa inizia il prossimo post. Le bozze e i post programmati che hai già creato da esso restano esattamente come sono.',
  'set.empty.title': 'Ancora nessun Set',
  'set.empty.body':
    'Creane uno per smettere di ricostruire lo stesso elenco di account per ogni post.',
  'set.create': 'Nuovo Set',
  'set.edit': 'Modifica Set',
  'set.archive': 'Archivia Set',
  'set.archived': 'Archiviato',
  'set.archivedNote':
    'I Set archiviati sono nascosti dal selettore. I post creati da essi restano invariati.',
  'set.showArchived': 'Mostra archiviati',
  'set.saved': 'Set salvato.',
  'set.archivedToast': 'Set archiviato. I post già creati da esso restano invariati.',

  'set.field.name': 'Nome',
  'set.field.nameHint': 'Ciò che cercherai nel selettore. Uno per progetto.',
  'set.field.description': 'Descrizione',
  'set.field.descriptionHint': 'Facoltativo. A cosa serve questo Set.',
  'set.field.targets': 'Account',
  'set.field.targetsHint': 'Ogni account con cui inizia un post creato da questo Set.',
  'set.field.targetCount':
    '{count, plural, =0 {Nessun account} one {# account} many {# account} other {# account}}',
  'set.field.signature': 'Firma',
  'set.field.signatureNone': 'Nessuna firma',
  'set.field.approval': 'Approvazione',
  'set.field.approvalHint':
    "L'approvazione di cui un post creato da questo Set ha bisogno prima di poter essere pubblicato.",
  'set.field.schedule': 'Quando pubblicare',

  'set.approval.none': 'Nessuna approvazione necessaria',
  'set.approval.single_approver': 'Un approvatore designato',
  'set.approval.any_approver': 'Qualsiasi approvatore',
  'set.approval.named_approver': 'Un approvatore specifico',
  'set.approval.policy_auto': "Quello che dice la politica dell'area di lavoro",

  'set.slot.next_free_slot': 'Prossimo spazio libero dalla coda',
  'set.slot.next_free_slotHint':
    'Usa le regole della coda di questo progetto per proporre un orario. Propone; tu accetti.',
  'set.slot.pick_time': 'Chiedimi un orario',
  'set.slot.pick_timeHint': "Applicare il Set lascia l'orario vuoto perché tu lo scelga.",
  'set.slot.draft_only': 'Lascialo come bozza',
  'set.slot.draft_onlyHint': 'Applicare il Set non tocca affatto la programmazione.',
  'set.slot.noRules':
    'Questo progetto non ha ancora regole della coda, quindi la coda proporrà la prima ora libera e lo dirà.',
  'set.slot.rulesLink': 'Regole della coda',

  'set.defaults.title': 'Predefiniti per piattaforma',
  'set.defaults.body':
    'Valori iniziali copiati in ogni nuovo post. Puoi modificarne qualsiasi in seguito nel compositore.',
  'set.defaults.add': 'Aggiungi una piattaforma',
  'set.defaults.remove': 'Rimuovi predefiniti per {platform}',
  'set.defaults.privacy': 'Privacy',
  'set.defaults.privacyNone': 'Predefinito della piattaforma',
  'set.defaults.bodyPrefix': 'Testo prima del post',
  'set.defaults.bodySuffix': 'Testo dopo il post',
  'set.defaults.requireAltText': 'Richiedi testo alternativo su ogni immagine',
  'set.defaults.requireAltTextHint':
    'Un post creato da questo Set non può essere programmato su questa piattaforma finché ogni immagine non ha un testo alternativo.',
  'set.defaults.empty':
    'Nessun predefinito per piattaforma. Ogni account parte dal post principale.',

  'set.error.nameTaken': 'Un altro Set in questo progetto usa già quel nome.',
  'set.error.archived': 'Questo Set è archiviato. Ripristinalo prima di modificarlo.',
  'set.error.duplicateTarget': "Quell'account è già in questo Set.",
  'set.error.duplicatePlatform': 'Questo Set ha già dei predefiniti per quella piattaforma.',

  /* --------------------------------------------------- remembered targets */
  'targetMemory.setting.title': "Ricorda gli account tra un post e l'altro",
  'targetMemory.setting.body':
    "Quando questa opzione è attiva, il compositore avvia ogni nuovo post con gli account che quella persona ha scelto l'ultima volta in questo progetto. È disattivata finché non la attivi.",
  'targetMemory.setting.stored':
    "Viene conservato solo l'elenco degli account, e solo per la persona che li ha scelti. Nessuna didascalia, nessun orario, nessuna impostazione di privacy e nessuno stato di approvazione viene memorizzato, e nessun altro nel progetto può vedere il tuo elenco.",
  'targetMemory.setting.offNote':
    'Mentre questa opzione è disattivata, non viene memorizzato nulla.',
  'targetMemory.setting.turnOffWarning':
    'Disattivare questa opzione elimina ogni selezione salvata in questo progetto, per tutti.',
  'targetMemory.setting.enabled': 'Attivo',
  'targetMemory.setting.disabled': 'Disattivo',
  'targetMemory.setting.saved': 'Impostazione salvata.',
  'targetMemory.setting.cleared':
    'Impostazione salvata. Le selezioni salvate in questo progetto sono state eliminate.',

  'targetMemory.composer.restored':
    "{count, plural, one {Iniziato con # account dall'ultima volta.} many {Iniziato con # account dall'ultima volta.} other {Iniziato con # account dall'ultima volta.}}",
  'targetMemory.composer.droppedSome':
    "{count, plural, one {# account che hai usato l'ultima volta è stato escluso perché richiede attenzione.} many {# account che hai usato l'ultima volta sono stati esclusi perché richiedono attenzione.} other {# account che hai usato l'ultima volta sono stati esclusi perché richiedono attenzione.}}",
  'targetMemory.composer.droppedAll':
    "Nessuno degli account che hai usato l'ultima volta è disponibile ora, quindi non è stato preselezionato nulla.",
  'targetMemory.composer.undo': 'Cancella selezione',
  'targetMemory.composer.forget': 'Smetti di ricordare i miei account',
  'targetMemory.composer.forgotten': 'La tua selezione salvata è stata eliminata.',
  'targetMemory.composer.reviewAccounts': 'Rivedi account',
} as const;
