/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Kalender',
  'calendar.view.day': 'Dag',
  'calendar.view.week': 'Week',
  'calendar.view.month': 'Maand',
  'calendar.view.list': 'Lijst',
  'calendar.view.label': 'Kalenderweergave',
  'calendar.today': 'Vandaag',
  'calendar.goToDate': 'Ga naar daten',
  'calendar.previousPeriod': 'Vorige periode',
  'calendar.nextPeriod': 'Volgende periode',
  'calendar.timeZoneNote': 'De tijden worden weergegeven in {timeZone}.',
  'calendar.weekOf': 'Week van {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount': '{count, plural, =0 {Niets gepland} one {# bericht} other {# berichten}}',
  'calendar.slotOverflow': '{count, plural, one {# meer} other {# meer}}',
  'calendar.newPostAt': 'Nieuw bericht op {time}',

  'calendar.filter.project': 'Project',
  'calendar.filter.account': 'Rekening',
  'calendar.filter.platform': 'Platform',
  'calendar.filter.status': 'Status',
  'calendar.filter.locale': 'Inhoudelijke taal',
  'calendar.filter.campaign': 'Campagne',
  'calendar.filter.applied':
    '{count, plural, one {# filter toegepast} other {# filters toegepast}}',

  'calendar.drag.instructions':
    'Sleep een bericht naar een nieuw slot, of selecteer het en gebruik de pijltjestoetsen om het te verplaatsen.',
  'calendar.drag.confirmTitle': 'Dit bericht verplaatsen?',
  'calendar.drag.confirmBody': 'Van {from} naar {to} in {timeZone}.',
  'calendar.drag.dstNotice':
    'De klokken veranderen tussen deze tijden in {timeZone}. De nieuwe tijd is {utc} UTC.',
  'calendar.drag.publishedNotice':
    'Dit bericht is al gepubliceerd. Als u deze verplaatst, wordt alleen het lokale record gewijzigd. Het opnieuw publiceren is een aparte handeling.',
  'calendar.drag.conflictNotice':
    '{account} heeft al {count, plural, one {# post} other {# posts}} binnen een uur na de nieuwe tijd.',

  'calendar.queue.title': 'Wachtrij',
  'calendar.queue.upcoming': 'Aankomend',
  'calendar.queue.needsApproval': 'Wachten op goedkeuring',
  'calendar.queue.drafts': 'Concepten',
  'calendar.queue.published': 'Gepubliceerd',
  'calendar.queue.failed': 'Mislukt',
  'calendar.queue.nextSlot': 'Het volgende gratis slot is {time}.',

  'calendar.post.publishesAt': 'Publiceert {time} in {timeZone}',
  'calendar.post.publishedAt': 'Gepubliceerd {time}',
  'calendar.post.targetCount': '{count, plural, one {# account} other {# accounts}}',
  'calendar.post.mediaType.text': 'Tekst',
  'calendar.post.mediaType.image': 'Afbeelding',
  'calendar.post.mediaType.carousel': 'Carrousel',
  'calendar.post.mediaType.video': 'Video',
  'calendar.post.mediaType.document': 'Documenteren',

  'actionCenter.title': 'Actiecentrum',
  'actionCenter.description':
    'Alles dat een beslissing of een oplossing nodig heeft, in één wachtrij.',
  'actionCenter.empty': 'Er is op dit moment niets dat aandacht nodig heeft.',
  'actionCenter.item.connectionExpiring':
    '{account} moet opnieuw worden verbonden voordat {date} anders mislukt.',
  'actionCenter.item.connectionActionRequired':
    '{account} heeft aandacht nodig op {provider} voordat het opnieuw kan publiceren.',
  'actionCenter.item.validationFailed':
    'Een concept voor {account} voldoet niet aan de {provider}-validatie.',
  'actionCenter.item.approvalOverdue': 'Er wacht een goedkeuringsverzoek sinds {date}.',
  'actionCenter.item.scheduleConflict':
    '{account} heeft berichten dicht bij elkaar gepland op {date}.',
  'actionCenter.item.providerIncident':
    '{provider} meldt een probleem. Geplande berichten worden opnieuw geprobeerd.',
  'actionCenter.item.commentFailed':
    'Het hoofdbericht is gepubliceerd, maar een vervolgitem voor {account} is mislukt.',
  'actionCenter.item.analyticsStale':
    'De analyses voor {account} zijn sinds {date} niet bijgewerkt.',
  'actionCenter.item.rssStalled':
    'De feed {name} heeft sinds {date} geen geldig item geretourneerd.',
  'actionCenter.item.webhookFailing':
    'Leveringen aan {endpoint} zijn mislukt {count, plural, one {# keer} other {# keer}} op rij.',
  'actionCenter.item.usageBalance':
    'Een gemeten actie voor {provider} heeft een gebruikssaldo nodig voordat deze kan worden uitgevoerd.',

  'approval.title': 'Goedkeuringen',
  'approval.requestTitle': 'Goedkeuringsverzoek',
  'approval.requestedBy': 'Aangevraagd door {name} {relativeTime}',
  'approval.requestedFrom': 'Wachten op {name}',
  'approval.policy.none': 'Voor deze doelstellingen is geen goedkeuring vereist.',
  'approval.policy.anyApprover': 'Elke goedkeurder kan dit goedkeuren.',
  'approval.policy.namedApprover': '{name} moet dit goedkeuren.',
  'approval.policy.everyApprover': 'Elke goedkeurder moet dit goedkeuren.',
  'approval.decision.approvedBy': 'Goedgekeurd door {name} op {date}',
  'approval.decision.rejectedBy': 'Afgewezen door {name} op {date}',
  'approval.decision.changesRequestedBy': 'Wijzigingen aangevraagd door {name} op {date}',
  'approval.comment.label': 'Noot voor de auteur',
  'approval.comment.placeholder': 'Zeg wat er moet veranderen en waarom.',
  'approval.reapproval.needed':
    'Dit bericht is na goedkeuring gewijzigd. Het heeft opnieuw goedkeuring nodig voordat het kan publiceren.',
  'approval.reapproval.reason.content': 'De inhoud veranderde.',
  'approval.reapproval.reason.account': 'De doelaccounts zijn gewijzigd.',
  'approval.reapproval.reason.media': 'De media veranderden.',
  'approval.reapproval.reason.schedule': 'De publicatietijd is gewijzigd.',
  'approval.reapproval.reason.privacy':
    'De privacy- of openbaarmakingsinstellingen zijn gewijzigd.',
  'approval.reapproval.reason.locale': 'De taal van de inhoud is veranderd.',
  'approval.expiresAt': 'Dit verzoek verloopt op {date}.',
} as const;
