/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Kalender',
  'calendar.view.day': 'dag',
  'calendar.view.week': 'Vecka',
  'calendar.view.month': 'Månad',
  'calendar.view.list': 'Lista',
  'calendar.view.label': 'Kalendervy',
  'calendar.today': 'Idag',
  'calendar.goToDate': 'Gå till dejten',
  'calendar.previousPeriod': 'Föregående period',
  'calendar.nextPeriod': 'Nästa period',
  'calendar.timeZoneNote': 'Tiderna visas i {timeZone}.',
  'calendar.weekOf': 'Vecka {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount': '{count, plural, =0 {Inget schemalagt} one {# inlägg} other {# inlägg}}',
  'calendar.slotOverflow': '{count, plural, one {# more} other {# more}}',
  'calendar.newPostAt': 'Nytt inlägg på {time}',

  'calendar.filter.project': 'Projekt',
  'calendar.filter.account': 'konto',
  'calendar.filter.platform': 'Plattform',
  'calendar.filter.status': 'Status',
  'calendar.filter.locale': 'Innehållsspråk',
  'calendar.filter.campaign': 'Kampanj',
  'calendar.filter.applied': '{count, plural, one {# filter tillämpat} other {# filter tillämpat}}',

  'calendar.drag.instructions':
    'Dra ett inlägg till en ny plats, eller välj det och använd piltangenterna för att flytta det.',
  'calendar.drag.confirmTitle': 'Flytta detta inlägg?',
  'calendar.drag.confirmBody': 'Från {from} till {to} i {timeZone}.',
  'calendar.drag.dstNotice':
    'Klockorna växlar mellan dessa tider i {timeZone}. Den nya tiden är {utc} UTC.',
  'calendar.drag.publishedNotice':
    'Det här inlägget är redan publicerat. Om du flyttar den ändras endast den lokala posten. Att publicera det igen är en separat åtgärd.',
  'calendar.drag.conflictNotice':
    '{account} har redan {count, plural, one {# inlägg} other {# inlägg}} inom en timme efter den nya tiden.',

  'calendar.queue.title': 'Kö',
  'calendar.queue.upcoming': 'Kommande',
  'calendar.queue.needsApproval': 'Väntar på godkännande',
  'calendar.queue.drafts': 'Utkast',
  'calendar.queue.published': 'Publicerad',
  'calendar.queue.failed': 'Misslyckades',
  'calendar.queue.nextSlot': 'Nästa lediga plats är {time}.',

  'calendar.post.publishesAt': 'Publicerar {time} i {timeZone}',
  'calendar.post.publishedAt': 'Publicerad {time}',
  'calendar.post.targetCount': '{count, plural, one {# konto} other {# konton}}',
  'calendar.post.mediaType.text': 'Text',
  'calendar.post.mediaType.image': 'Bild',
  'calendar.post.mediaType.carousel': 'Karusell',
  'calendar.post.mediaType.video': 'Video',
  'calendar.post.mediaType.document': 'Dokument',

  'actionCenter.title': 'Actioncenter',
  'actionCenter.description': 'Allt som behöver ett beslut eller en fix, i en kö.',
  'actionCenter.empty': 'Inget behöver uppmärksamhet just nu.',
  'actionCenter.item.connectionExpiring':
    '{account} måste återanslutas innan {date} annars misslyckas schemalagda inlägg.',
  'actionCenter.item.connectionActionRequired':
    '{account} behöver uppmärksamhet på {provider} innan den kan publiceras igen.',
  'actionCenter.item.validationFailed':
    'Ett utkast till {account} klarar inte {provider} validering.',
  'actionCenter.item.approvalOverdue': 'En begäran om godkännande har väntat sedan {date}.',
  'actionCenter.item.scheduleConflict':
    '{account} har inlägg schemalagda nära varandra den {date}.',
  'actionCenter.item.providerIncident':
    '{provider} rapporterar ett problem. Schemalagda inlägg kommer att försöka igen.',
  'actionCenter.item.commentFailed':
    'Huvudinlägget publicerades, men ett uppföljningsobjekt för {account} misslyckades.',
  'actionCenter.item.analyticsStale': 'Analytics för {account} har inte uppdaterats sedan {date}.',
  'actionCenter.item.rssStalled':
    'Flödet {name} har inte returnerat en giltig artikel sedan {date}.',
  'actionCenter.item.webhookFailing':
    'Leveranser till {endpoint} har misslyckats {count, plural, one {# gång} other {# gånger}} i rad.',
  'actionCenter.item.usageBalance':
    'En uppmätt åtgärd för {provider} behöver en användningsbalans innan den kan köras.',

  'approval.title': 'Godkännanden',
  'approval.requestTitle': 'Begäran om godkännande',
  'approval.requestedBy': 'Begärt av {name} {relativeTime}',
  'approval.requestedFrom': 'Väntar på {name}',
  'approval.policy.none': 'Inget godkännande krävs för dessa mål.',
  'approval.policy.anyApprover': 'Alla godkännare kan godkänna detta.',
  'approval.policy.namedApprover': '{name} måste godkänna detta.',
  'approval.policy.everyApprover': 'Varje godkännare måste godkänna detta.',
  'approval.decision.approvedBy': 'Godkänd av {name} den {date}',
  'approval.decision.rejectedBy': 'Avvisades av {name} den {date}',
  'approval.decision.changesRequestedBy': 'Ändringar begärda av {name} den {date}',
  'approval.comment.label': 'Anmärkning till författaren',
  'approval.comment.placeholder': 'Säg vad som behöver förändras och varför.',
  'approval.reapproval.needed':
    'Detta inlägg ändrades efter godkännande. Den behöver godkännande igen innan den kan publiceras.',
  'approval.reapproval.reason.content': 'Innehållet förändrades.',
  'approval.reapproval.reason.account': 'Målkontona ändrades.',
  'approval.reapproval.reason.media': 'Media förändrades.',
  'approval.reapproval.reason.schedule': 'Publiceringstiden ändrades.',
  'approval.reapproval.reason.privacy': 'The privacy or disclosure settings changed.',
  'approval.reapproval.reason.locale': 'Innehållsspråket ändrades.',
  'approval.expiresAt': 'Denna begäran upphör att gälla {date}.',
} as const;
