/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Publicatie ontvangst',
  'receipt.subtitle': 'Precies wat er is gepubliceerd, waar, wanneer en onder wiens goedkeuring.',
  'receipt.target': '{account} op {provider}',
  'receipt.externalId': 'Externe post-ID',
  'receipt.permalink': 'Permanente link',
  'receipt.permalinkUnavailable': '{provider} retourneert geen permalink voor dit berichttype.',
  'receipt.contentVersion': 'Inhoud versie',
  'receipt.contentHash': 'Controlesom van de inhoud',
  'receipt.mediaVersion': 'Mediaversie',
  'receipt.idempotencyKey': 'Idempotentie referentie',
  'receipt.correlationId': 'Correlatiereferentie',

  'receipt.surface.label': 'Gemaakt van',
  'receipt.surface.web': 'Web-app',
  'receipt.surface.api': 'REST-API',
  'receipt.surface.mcp': 'MCP-server',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'RSS-autopost',
  'receipt.surface.automation': 'Automatiseringsregel',
  'receipt.surface.webhook': 'Inkomende webhook',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Serviceaccount {name}',
  'receipt.actor.oauthApp': '{app} treedt op voor {name}',
  'receipt.actor.system': 'Relay',

  'receipt.timeline.title': 'Tijdlijn',
  'receipt.timeline.created': 'Concept gemaakt door {actor}',
  'receipt.timeline.approvalRequested': 'Goedkeuring aangevraagd bij {approver}',
  'receipt.timeline.approved': 'Goedgekeurd door {actor} onder beleid {policy}',
  'receipt.timeline.scheduled': 'Gepland voor {local} in {timeZone}',
  'receipt.timeline.revalidated': 'Inloggegevens en platformlimieten opnieuw gecontroleerd',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# bestand voorbereid voor het platform} other {# bestanden voorbereid voor het platform}}',
  'receipt.timeline.dispatched': 'Verzonden naar {provider}',
  'receipt.timeline.providerAccepted': '{provider} heeft de post geaccepteerd',
  'receipt.timeline.providerProcessing': '{provider} verwerkt nog steeds de media',
  'receipt.timeline.published': 'Gepubliceerd als {externalId}',
  'receipt.timeline.commentPublished': 'Vervolgitem {position} gepubliceerd',
  'receipt.timeline.retryScheduled': 'Probeer {attempt} opnieuw, gepland voor {time}',
  'receipt.timeline.failed': 'Poging {attempt} is mislukt',
  'receipt.timeline.canceled': 'Geannuleerd door {actor}',
  'receipt.timeline.analyticsSynced': 'Analytics gesynchroniseerd',
  'receipt.timeline.deletedExternally': 'Het bericht staat niet meer op {provider}',

  'receipt.times.scheduled': 'Geplande tijd',
  'receipt.times.dispatched': 'Verzendingstijd',
  'receipt.times.published': 'Publiceer tijd',
  'receipt.times.latency': '{duration} na de geplande tijd verzonden.',

  'receipt.attempts.title': 'Pogingen',
  'receipt.attempts.count': '{count, plural, one {# poging} other {# pogingen}}',
  'receipt.attempts.classification': 'Classificatie',
  'receipt.attempts.providerResponse': 'Reactie van de aanbieder',
  'receipt.attempts.responseRedacted':
    'Het antwoord van de provider wordt opgeslagen, waarbij de tokens en persoonlijke gegevens worden verwijderd.',
  'receipt.attempts.remediation': 'Wat nu te doen',

  'receipt.cost.estimated': 'Geschatte {amount}',
  'receipt.cost.actual': 'Afgestemd op {amount}',
  'receipt.cost.pending': 'Het daadwerkelijke gebruik is nog niet afgestemd.',

  'receipt.partial.title': 'Gedeeltelijk gepubliceerd',
  'receipt.partial.body':
    '{published, plural, one {# doel gepubliceerd} other {# doelstellingen gepubliceerd}}. {failed, plural, one {# doel mislukt} other {# doelen mislukt}}. De gepubliceerde berichten bestaan ​​nog steeds op het platform.',
  'receipt.partial.doNotRollback':
    'We verwijderen geen bericht dat al is gepubliceerd. Verwijder het op het platform als u dat wilt.',

  'receipt.export.title': 'Deel deze bon',
  'receipt.export.pdf': 'Downloaden als PDF',
  'receipt.export.json': 'Downloaden als JSON',
  'receipt.export.permissionNote':
    'Alleen eigenaren, beheerders en goedkeurders kunnen een betalingsbewijs delen.',

  'receipt.analytics.lastSync': 'Analytics laatst gesynchroniseerd {relativeTime}.',
  'receipt.analytics.nextSync': 'Volgende synchronisatie rond {time}.',
} as const;
