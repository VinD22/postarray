/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Navigazione primaria',
  'a11y.region.main': 'Contenuto principale',
  'a11y.region.composer': 'Composer',
  'a11y.region.preview': 'Anteprima',
  'a11y.region.validation': 'Problemi di convalida',
  'a11y.region.targets': 'Account target',
  'a11y.region.notifications': 'Notifiche',

  'a11y.announce.saved': 'Bozza salvata',
  'a11y.announce.saving': 'Salvataggio bozza',
  'a11y.announce.saveFailed': 'Impossibile salvare la bozza. Il tuo testo è ancora qui.',
  'a11y.announce.offline': 'Sei offline. Le modifiche vengono mantenute su questo dispositivo.',
  'a11y.announce.online': 'Di nuovo in linea',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Nessun problema di convalida} one {# problema di convalida} many {# problemi di convalida} other {# problemi di convalida}}',
  'a11y.announce.validationCleared': 'Tutti i problemi di convalida risolti',
  'a11y.announce.targetSelected':
    '{account} selezionato. {count, plural, one {# target} many {# target} other {# target}} in totale.',
  'a11y.announce.targetOverridden': '{account} ora ha la sua versione',
  'a11y.announce.targetReset': '{account} ripristina la bozza principale',
  'a11y.announce.uploadProgress': '{name}, {percent} caricati',
  'a11y.announce.uploadComplete': '{name} caricato',
  'a11y.announce.uploadFailed': 'Impossibile caricare {name}',
  'a11y.announce.scheduled': 'Previsto per {time} tra {timeZone}',
  'a11y.announce.rescheduled': 'Spostato in {time} in {timeZone}',
  'a11y.announce.publishing': 'Editoria',
  'a11y.announce.published':
    '{count, plural, one {Pubblicato su # account} many {Pubblicato su # account} other {Pubblicato su # account}}',
  'a11y.announce.publishPartial':
    'Pubblicato su {published} degli account {total}. {failed, plural, one {# account richiede attenzione} many {# account richiedono attenzione} other {# account richiedono attenzione}}.',
  'a11y.announce.publishFailed': 'Pubblicazione non riuscita. Il tuo contenuto è preservato.',
  'a11y.announce.approvalRequested': 'Approvazione richiesta da {approver}',
  'a11y.announce.approved': 'Approvato',
  'a11y.announce.connectionAdded': '{account} connesso',
  'a11y.announce.connectionRemoved': '{account} disconnesso',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Filtri cancellati} one {# filtro applicato} many {# filtri applicati} other {# filtri applicati}}, {results, plural, one {# risultato} many {# risultati} other {# risultati}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Copiato negli appunti',
  'a11y.announce.suggestionApplied': 'Suggerimento applicato',
  'a11y.announce.suggestionRejected': 'Suggerimento rifiutato',

  'a11y.label.closeDialog': 'Chiudi la finestra di dialogo',
  'a11y.label.openMenu': 'Apri il menu',
  'a11y.label.sortBy': 'Ordina per {field}',
  'a11y.label.sortAscending': 'Ordinato in ordine crescente',
  'a11y.label.sortDescending': 'Ordinato in modo decrescente',
  'a11y.label.removeTarget': 'Rimuovi {account} dai bersagli',
  'a11y.label.removeMedia': 'Rimuovere {name}',
  'a11y.label.editAltText': 'Modifica il testo alternativo per {name}',
  'a11y.label.mediaPreview': 'Anteprima di {name}',
  'a11y.label.playVideo': 'Gioca a {name}',
  'a11y.label.pauseVideo': 'Pausa {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {niente in programma} one {# post} many {# post} other {# post}}',
  'a11y.label.postSummary': '{account} su {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} di caratteri {limit} utilizzati',
  'a11y.label.requiredField': 'Obbligatorio',
  'a11y.label.externalLink': 'Si apre in una nuova scheda',
  'a11y.label.loadingRegion': 'Caricamento contenuto',
  'a11y.label.expandRow': 'Mostra dettagli per {name}',
  'a11y.label.collapseRow': 'Nascondi dettagli per {name}',
  'a11y.languagePicker.label': "Scegli la lingua dell'interfaccia",
  'a11y.languagePicker.filterLabel': 'Filtra le lingue',
  'a11y.languagePicker.announceChanged':
    "La lingua dell'interfaccia è stata modificata in {language}",

  'a11y.keyboard.hint.calendar':
    'Usa i tasti freccia per spostarti tra gli slot. Premi Invio per aprire un post. Premi la barra spaziatrice, quindi i tasti freccia per riprogrammare.',
  'a11y.keyboard.hint.composer':
    'Premi Control e le parentesi quadre per spostarti tra i bersagli. Premi Control e I per passare al numero successivo.',
  'a11y.keyboard.hint.dialog': 'Premi Esc per chiudere.',
  'a11y.keyboard.shortcutsTitle': 'Scorciatoie da tastiera',

  'a11y.table.alternative': 'Visualizzazione tabella',
  'a11y.table.alternativeHint': 'La stessa pianificazione di una tabella ordinabile.',
  'a11y.motion.reduced': 'Le animazioni vengono ridotte a causa delle impostazioni del sistema.',
} as const;
