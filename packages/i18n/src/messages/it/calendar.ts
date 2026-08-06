/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Calendario',
  'calendar.view.day': 'Giorno',
  'calendar.view.week': 'Settimana',
  'calendar.view.month': 'Mese',
  'calendar.view.list': 'Elenco',
  'calendar.view.label': 'Visualizzazione del calendario',
  'calendar.today': 'Oggi',
  'calendar.goToDate': 'Vai ad oggi',
  'calendar.previousPeriod': 'Periodo precedente',
  'calendar.nextPeriod': 'Prossimo periodo',
  'calendar.timeZoneNote': 'I tempi sono mostrati in {timeZone}.',
  'calendar.weekOf': 'Settimana di {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount':
    '{count, plural, =0 {Niente in programma} one {# post} many {# post} other {# post}}',
  'calendar.slotOverflow': '{count, plural, one {# altro} many {# altro} other {# altro}}',
  'calendar.newPostAt': 'Nuovo post su {time}',

  'calendar.filter.brand': 'Brand',
  'calendar.filter.account': 'Conto',
  'calendar.filter.platform': 'Piattaforma',
  'calendar.filter.status': 'Stato',
  'calendar.filter.locale': 'Linguaggio dei contenuti',
  'calendar.filter.campaign': 'Campagna',
  'calendar.filter.applied':
    '{count, plural, one {# filtro applicato} many {# filtri applicati} other {# filtri applicati}}',

  'calendar.drag.instructions':
    'Trascina un post in un nuovo slot oppure selezionalo e utilizza i tasti freccia per spostarlo.',
  'calendar.drag.confirmTitle': 'Spostare questo post?',
  'calendar.drag.confirmBody': 'Da {from} a {to} in {timeZone}.',
  'calendar.drag.dstNotice':
    'Gli orologi cambiano tra questi orari in {timeZone}. Il nuovo orario è {utc} UTC.',
  'calendar.drag.publishedNotice':
    "Questo post è già pubblicato. Lo spostamento modifica solo il record locale. Pubblicarlo nuovamente è un'azione separata.",
  'calendar.drag.conflictNotice':
    "{account} ha già {count, plural, one {# post} many {# post} other {# post}} entro un'ora dal nuovo orario.",

  'calendar.queue.title': 'Coda',
  'calendar.queue.upcoming': 'Prossimamente',
  'calendar.queue.needsApproval': 'In attesa di approvazione',
  'calendar.queue.drafts': 'Bozze',
  'calendar.queue.published': 'Pubblicato',
  'calendar.queue.failed': 'Fallito',
  'calendar.queue.nextSlot': 'Il prossimo slot gratuito è {time}.',

  'calendar.post.publishesAt': 'Pubblica {time} in {timeZone}',
  'calendar.post.publishedAt': 'Pubblicato {time}',
  'calendar.post.targetCount':
    '{count, plural, one {# account} many {# account} other {# account}}',
  'calendar.post.mediaType.text': 'Testo',
  'calendar.post.mediaType.image': 'Immagine',
  'calendar.post.mediaType.carousel': 'Carosello',
  'calendar.post.mediaType.video': 'Video',
  'calendar.post.mediaType.document': 'Documento',

  'actionCenter.title': 'Centro operativo',
  'actionCenter.description':
    "Tutto ciò che necessita di una decisione o di una soluzione, in un'unica coda.",
  'actionCenter.empty': 'Niente ha bisogno di attenzione in questo momento.',
  'actionCenter.item.connectionExpiring':
    '{account} deve essere ricollegato prima di {date} altrimenti i post pianificati falliranno.',
  'actionCenter.item.connectionActionRequired':
    '{account} richiede attenzione su {provider} prima di poter pubblicare nuovamente.',
  'actionCenter.item.validationFailed':
    'Una bozza per {account} non supera la convalida {provider}.',
  'actionCenter.item.approvalOverdue': 'Una richiesta di approvazione è in attesa da {date}.',
  'actionCenter.item.scheduleConflict': '{account} ha post programmati ravvicinati su {date}.',
  'actionCenter.item.providerIncident':
    '{provider} sta segnalando un problema. I post pianificati verranno riprovati.',
  'actionCenter.item.commentFailed':
    'Il post principale è stato pubblicato, ma un elemento successivo per {account} non è riuscito.',
  'actionCenter.item.analyticsStale':
    'Le analisi per {account} non sono state aggiornate da {date}.',
  'actionCenter.item.rssStalled': 'Il feed {name} non ha restituito un elemento valido dal {date}.',
  'actionCenter.item.webhookFailing':
    'Le consegne a {endpoint} non sono riuscite {count, plural, one {# volta} many {# volte} other {# volte}} di seguito.',
  'actionCenter.item.usageBalance':
    "Un'azione a consumo per {provider} necessita di un saldo di utilizzo prima di poter essere eseguita.",

  'approval.title': 'Approvazioni',
  'approval.requestTitle': 'Richiesta di approvazione',
  'approval.requestedBy': 'Richiesto da {name} {relativeTime}',
  'approval.requestedFrom': 'In attesa di {name}',
  'approval.policy.none': 'Nessuna approvazione richiesta per questi obiettivi.',
  'approval.policy.anyApprover': 'Qualsiasi approvatore può approvarlo.',
  'approval.policy.namedApprover': '{name} deve approvarlo.',
  'approval.policy.everyApprover': 'Ogni approvatore deve approvarlo.',
  'approval.decision.approvedBy': 'Approvato da {name} su {date}',
  'approval.decision.rejectedBy': 'Rifiutato da {name} su {date}',
  'approval.decision.changesRequestedBy': 'Modifiche richieste da {name} su {date}',
  'approval.comment.label': "Nota per l'autore",
  'approval.comment.placeholder': 'Dire cosa deve cambiare e perché.',
  'approval.reapproval.needed':
    "Questo post è cambiato dopo l'approvazione. È necessaria nuovamente l'approvazione prima di poter pubblicare.",
  'approval.reapproval.reason.content': 'Il contenuto è cambiato.',
  'approval.reapproval.reason.account': 'Gli account di destinazione sono cambiati.',
  'approval.reapproval.reason.media': 'I media sono cambiati.',
  'approval.reapproval.reason.schedule': "L'ora di pubblicazione è cambiata.",
  'approval.reapproval.reason.privacy':
    'Le impostazioni sulla privacy o sulla divulgazione sono cambiate.',
  'approval.reapproval.reason.locale': 'La lingua del contenuto è cambiata.',
  'approval.expiresAt': 'Questa richiesta scade il {date}.',
} as const;
