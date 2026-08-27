/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'Facebook',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Threads',
  'web.provider.bluesky': 'Bluesky',
  'web.provider.mastodon': 'Mastodon',
  'web.provider.telegram': 'Telegram',
  'web.provider.reddit': 'Reddit',
  'web.provider.wordpress': 'WordPress',
  'web.provider.medium': 'Medium',
  'web.provider.devto': 'Dev.to',
  'web.provider.pinterest': 'Pinterest',
  'web.provider.discord': 'Discord',
  'web.provider.slack': 'Slack',
  'web.connection.requirement.mastodon':
    'Mastodon verbindt met een toegangstoken die je op je eigen instance maakt, niet met je wachtwoord.',
  'web.connection.requirement.telegram':
    'Post Array plaatst als bot. Voeg de bot toe aan het kanaal of de groep waar je wilt publiceren.',
  'web.connection.requirement.reddit':
    'Schrijven op Reddit vereist een goedgekeurde app en elke post heeft een titel en een subreddit nodig.',
  'web.connection.requirement.wordpress':
    'Post Array publiceert via de REST API van de site met een app-wachtwoord dat je in WordPress maakt.',
  'web.connection.requirement.medium':
    'Medium verbindt via OAuth en Post Array publiceert openbare verhalen in Markdown.',
  'web.connection.requirement.devto':
    'Dev.to verbindt met een API-sleutel uit je Dev.to-instellingen.',
  'web.connection.requirement.pinterest':
    'Schrijven op Pinterest vereist goedgekeurde app-toegang en een pin heeft een afbeelding en een eigen bord nodig.',
  'web.connection.requirement.discord':
    'Post Array plaatst als bot. Voeg de bot toe aan de servers en kanalen waar je wilt publiceren.',
  'web.connection.requirement.slack':
    'Post Array plaatst als app. Voeg de app toe aan de kanalen waar je wilt publiceren.',
  'web.provider.fake': 'Testconnector',

  'web.accountType.personal_profile': 'Persoonlijk profiel',
  'web.accountType.creator_profile': 'Creator-account',
  'web.accountType.business_profile': 'Zakelijke rekening',
  'web.accountType.page': 'Pagina',
  'web.accountType.organization': 'Organisatie',
  'web.accountType.channel': 'Kanaal',
  'web.accountType.group': 'Groep',
  'web.accountType.board': 'Bord',
  'web.accountType.community': 'Gemeenschap',
  'web.accountType.publication': 'Publicatie',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Alles wat gepland is, wacht op goedkeuring, gepubliceerd of geblokkeerd, op één plek.',
  'web.calendar.view.agenda': 'Agenda',
  'web.calendar.view.table': 'Tafel',
  'web.calendar.view.switchLabel': 'Kies hoe het schema wordt ingedeeld',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} naar {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': '{range} wordt weergegeven in {timeZone}',
  'web.calendar.timeZone.workspace': 'Workspace tijdzone: {timeZone}',
  'web.calendar.timeZone.change': 'Wijziging in de werkruimte-instellingen',
  'web.calendar.jumpToDate': 'Ga naar een datum',
  'web.calendar.nowLabel': 'Nu',
  'web.calendar.allDayHeading': 'Nog geen exacte tijd',

  'web.calendar.filter.group': 'Klantengroep',
  'web.calendar.filter.anyProject': 'Elk project',
  'web.calendar.filter.anyAccount': 'Elke rekening',
  'web.calendar.filter.anyPlatform': 'Elk platform',
  'web.calendar.filter.anyStatus': 'Elke status',
  'web.calendar.filter.anyLocale': 'Elke inhoudstaal',
  'web.calendar.filter.anyCampaign': 'Welke campagne dan ook',
  'web.calendar.filter.anyGroup': 'Elke groep',
  'web.calendar.filter.regionLabel': 'Filter het schema',
  'web.calendar.bucket.scheduled': 'Gepland',
  'web.calendar.bucket.draft': 'Concepten en goedkeuringen',
  'web.calendar.bucket.published': 'Gepubliceerd',
  'web.calendar.bucket.failed': 'Heeft aandacht nodig',
  'web.calendar.filter.summary':
    '{count, plural, =0 {Geen filters} one {# filter} other {# filters}}, {results, plural, =0 {geen berichten} one {# bericht} other {# berichten}}',

  'web.calendar.grid.label': 'Schemaraster voor {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Niets bij {time} op {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {Toon nog # berichten} other {Toon nog # berichten}}',
  'web.calendar.month.label': 'Maandraster voor {month}',
  'web.calendar.agenda.label': 'Agenda voor {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Niets gepland',

  'web.calendar.table.caption': 'Elk bericht in {range}, gesorteerd op publicatietijd.',
  'web.calendar.table.column.time': 'Tijd',
  'web.calendar.table.column.account': 'Rekening',
  'web.calendar.table.column.content': 'Inhoud',
  'web.calendar.table.column.language': 'Taal',
  'web.calendar.table.column.media': 'Media',
  'web.calendar.table.column.status': 'Status',
  'web.calendar.table.column.approver': 'Goedkeurder',
  'web.calendar.table.column.campaign': 'Campagne',
  'web.calendar.table.column.actions': 'Acties',
  'web.calendar.table.rowMenu': 'Acties voor {title}',
  'web.calendar.table.noApprover': 'Geen goedkeuring nodig',
  'web.calendar.table.noCampaign': 'Geen campagne',

  'web.calendar.entry.untitled': 'Naamloos concept',
  'web.calendar.entry.language': 'Taal {locale}',
  'web.calendar.entry.openDetail': 'Open {title}',
  'web.calendar.entry.selected': '{title} geselecteerd. {hint}',
  'web.calendar.detail.title': 'Geplande post',
  'web.calendar.detail.close': 'Sluit dit bericht',

  'web.calendar.keyboard.title': 'Verplaats een bericht met het toetsenbord',
  'web.calendar.keyboard.body':
    'Focus op een bericht en druk op Enter om het te openen. Druk op M om een ​​post op te pakken, gebruik vervolgens de pijltjestoetsen om deze één vakje te verplaatsen en Enter om te bevestigen. Druk op Escape om het terug te plaatsen.',
  'web.calendar.keyboard.pickUp': 'Verplaats dit bericht',
  'web.calendar.keyboard.grabbed':
    '{title} opgehaald van {from}. Pijltjestoetsen verplaatsen. Enter bevestigt. Ontsnappen wordt geannuleerd.',
  'web.calendar.keyboard.moved': 'Voorgestelde tijd {to}. Enter bevestigt.',
  'web.calendar.keyboard.released': '{title} teruggezet op {from}.',
  'web.calendar.keyboard.stepMinutes': 'Elke stap duurt {minutes} minuten.',

  'web.calendar.reschedule.title': 'Dit bericht verplaatsen?',
  'web.calendar.reschedule.subject': '{account} op {provider}',
  'web.calendar.reschedule.from': 'Van {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'Naar {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Bericht verplaatsen',
  'web.calendar.reschedule.dstTitle': 'Tussen deze twee tijden wisselen de klokken',
  'web.calendar.reschedule.dstBody':
    'De offset in {timeZone} is {fromOffset} op de oude tijd en {toOffset} op de nieuwe tijd. Het lokale uur dat u hebt gekozen, wordt behouden, zodat de UTC onmiddellijk verschuift.',
  'web.calendar.reschedule.conflictTitle': 'Andere berichten zijn dichtbij deze tijd',
  'web.calendar.reschedule.conflictBody':
    '{account} heeft al {count, plural, one {# post} other {# posts}} binnen {window} van de nieuwe tijd.',
  'web.calendar.reschedule.campaignTitle': 'Campagneconflict',
  'web.calendar.reschedule.campaignBody':
    'Campagne {campaign} loopt van {start} tot {end}. De nieuwe tijd valt buiten dat venster.',
  'web.calendar.reschedule.leadTimeTitle': 'Dit is zeer binnenkort',
  'web.calendar.reschedule.leadTimeBody':
    'De nieuwe tijd is vanaf nu {duration}. {provider} heeft {required} nodig om media voor dit berichttype voor te bereiden.',
  'web.calendar.reschedule.pastTitle': 'Die tijd is voorbij',
  'web.calendar.reschedule.pastBody': 'Kies een tijdstip in de toekomst of publiceer nu.',

  'web.calendar.published.title': 'Dit bericht is al gepubliceerd',
  'web.calendar.published.body':
    'Er bestaat een bericht op {provider} op {permalinkLabel}. Het verplaatsen van de ingang in Post Array verplaatst de post op het perron niet. Kies wat je wilt dat er gebeurt.',
  'web.calendar.published.optionLocal': 'Werk alleen het lokale record bij',
  'web.calendar.published.optionLocalHint':
    'Op het ontvangstbewijs wordt de werkelijke publicatietijd vermeld. Alleen de planningspost beweegt, zodat uw agenda aansluit bij uw plan.',
  'web.calendar.published.optionNew': 'Plan een nieuw bericht op het nieuwe tijdstip',
  'web.calendar.published.optionNewHint':
    'Hierdoor ontstaat er een tweede, aparte externe post. Degene die al op {provider} staat, blijft online.',
  'web.calendar.published.optionLabel': 'Wat zou er moeten gebeuren',

  'web.calendar.attention.title':
    '{count, plural, one {# bericht heeft een beslissing of een oplossing nodig} other {# berichten hebben een beslissing of een oplossing nodig}}',
  'web.calendar.attention.body': 'Ze blijven hier en in het actiecentrum totdat ze zijn opgelost.',
  'web.calendar.attention.open': 'Open het actiecentrum',
  'web.calendar.attention.showOnly': 'Laat alleen deze zien',

  'web.calendar.loading': 'Het schema laden',
  'web.calendar.error.title': 'Het schema kan niet worden geladen',
  'web.calendar.error.body':
    'Er is niets veranderd wat gepland is. Je berichten worden nog steeds op de geplande tijden gepubliceerd.',
  'web.calendar.error.retry': 'Probeer het opnieuw',
  'web.calendar.empty.example':
    '09:30 Europe/Berlin, X @acme, "Geplande eerste reacties zijn live", Gepland, 1 afbeelding',
  'web.calendar.emptyFiltered.body':
    'Geen enkel bericht in {range} komt overeen met deze filters. Vergroot het bereik of wis een filter.',
  'web.calendar.offline.title': 'Je bent offline',
  'web.calendar.offline.body':
    'Het onderstaande schema is het laatste exemplaar dat op dit apparaat is geladen. Opnieuw plannen en publiceren zijn niet beschikbaar totdat de verbinding terugkeert.',
  'web.calendar.rateLimited.cause':
    'Deze werkruimte leest de agenda vaker dan het huidige venster toestaat.',
  'web.calendar.rateLimited.resetLabel': 'Je kunt het opnieuw proberen',
  'web.calendar.rateLimited.resetUnknown':
    '{provider} heeft niet gezegd wanneer dit wordt gereset.',
  'web.calendar.permission.requirementsLabel': 'Vereiste reikwijdte',
  'web.calendar.permission.title': 'Je kunt deze kalender niet zien',
  'web.calendar.permission.body':
    'Agendatoegang wordt verleend per project. Uw account staat niet op de projecten in deze weergave.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Kalender',
  'web.receipt.breadcrumb.post': 'Post',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Het publicatiebewijs laden',
  'web.receipt.notFound.title': 'Geen ontvangstbewijs met die referentie',
  'web.receipt.notFound.body':
    'Er bestaat een ontvangstbewijs zodra een post is verzonden. Controleer de referentie of open het bericht vanuit de kalender.',
  'web.receipt.error.title': 'De bon kon niet worden geladen',
  'web.receipt.error.body':
    'Het ontvangstbewijs is onveranderlijk en wordt hierdoor niet beïnvloed. Er werd niets opnieuw gepubliceerd.',

  'web.receipt.section.summary': 'Wat is er gebeurd',
  'web.receipt.section.timeline': 'Tijdlijn van evenementen',
  'web.receipt.section.items': 'Rootpost en vervolgitems',
  'web.receipt.section.attempts': 'Pogingen',
  'web.receipt.section.provenance': 'Herkomst',
  'web.receipt.section.cost': 'Gebruik van de provider',
  'web.receipt.section.analytics': 'Analytics-synchronisatie',
  'web.receipt.section.targets': 'Doelstellingen in deze campagne',

  'web.receipt.item.root': 'Rootpost',
  'web.receipt.item.comment': 'Commentaar {position}',
  'web.receipt.item.thread': 'Draaddeel {position}',
  'web.receipt.item.delay': 'Voert {delay} uit na de rootpost',
  'web.receipt.item.noDelay': 'Wordt uitgevoerd met de hoofdpost',
  'web.receipt.item.pending': 'Nog niet begonnen',
  'web.receipt.item.rootUnaffected':
    'De hoofdpost is live. Een vervolgitem dat mislukt, verandert daar nooit iets aan.',

  'web.receipt.attempt.heading': 'Probeer {number}',
  'web.receipt.attempt.startedAt': '{time} gestart',
  'web.receipt.attempt.startedLabel': 'Gestart',
  'web.receipt.attempt.responseSummary': 'Gezuiverde reactie van de provider',
  'web.receipt.attempt.duration': 'Nam {duration}',
  'web.receipt.attempt.httpStatus': 'HTTP-status',
  'web.receipt.attempt.providerRequestId': 'Referentie van het verzoek van de provider',
  'web.receipt.attempt.retryable': 'Automatisch opnieuw geprobeerd',
  'web.receipt.attempt.notRetryable': 'Niet automatisch opnieuw geprobeerd',
  'web.receipt.attempt.nextRetry': 'Volgende poging tot {time}',
  'web.receipt.attempt.nextRetryLabel': 'Volgende poging',
  'web.receipt.attempt.showResponse': 'Toon het opgeschoonde antwoord van de provider',
  'web.receipt.attempt.hideResponse': 'Verberg het opgeschoonde antwoord van de provider',
  'web.receipt.attempt.none': 'Eén poging, geen mislukkingen.',

  'web.receipt.provenance.capabilityVersion': 'Momentopname van mogelijkheden',
  'web.receipt.provenance.capabilityHint':
    'De momentopname gebruikt bij goedkeuring en opnieuw gecontroleerd vóór verzending.',
  'web.receipt.provenance.accountType': 'Accounttype',
  'web.receipt.provenance.externalAccount': 'Externe accountreferentie',
  'web.receipt.provenance.workflow': 'Workflow-referentie',
  'web.receipt.provenance.createdAt': 'Ontvangstbewijs geschreven {time}',

  'web.receipt.approval.notRequired': 'Voor dit doel was geen goedkeuring vereist.',
  'web.receipt.approval.policy': 'Beleid {policy}',
  'web.receipt.approval.unknownPolicy': 'Beleidsreferentie niet vastgelegd',

  'web.receipt.cost.currency': 'Geladen in {currency}',
  'web.receipt.cost.estimatedLabel': 'Geschat vóór publicatie',
  'web.receipt.cost.actualLabel': 'Verzoend feitelijk',
  'web.receipt.provenance.writtenLabel': 'Ontvangst geschreven',
  'web.receipt.cost.reconciledAt': 'Afgestemd op {time}',
  'web.receipt.cost.notMetered':
    '{provider} brengt voor dit berichttype geen kosten in rekening per bewerking.',

  'web.receipt.analytics.never': 'Analytics is nog niet gesynchroniseerd voor dit bericht.',
  'web.receipt.analytics.explain':
    "Aanbieders verzamelen hun eigen schema's. Het onderstaande tijdstip is het moment waarop Post Array ze voor het laatst heeft gelezen, niet het moment waarop de cijfers waar waren.",

  'web.receipt.export.download': 'Download de bon',
  'web.receipt.export.copyReference': 'Kopieer de ontvangstreferentie',
  'web.receipt.export.denied':
    'Voor het delen van een ontvangstbewijs is de rol van eigenaar, beheerder of goedkeurder nodig. Jij bent {role}.',

  'web.receipt.partial.retryFailedOnly': 'Probeer alleen de doelen die zijn mislukt opnieuw',
  'web.receipt.partial.retryHint':
    'Een nieuwe poging raakt nooit een doelwit dat al een externe post heeft opgeleverd.',

  'web.receipt.remediation.user_action_required':
    'Hiervoor is een wijziging in Post Array of {provider} nodig voordat deze weer kan worden uitgevoerd.',
  'web.receipt.remediation.content_invalid':
    'Bewerk de inhoud zodat deze de {provider}-validatie doorstaat en plan deze vervolgens opnieuw.',
  'web.receipt.remediation.transient_provider':
    '{provider} heeft een tijdelijke fout geretourneerd. Post Array probeerde het opnieuw volgens zijn eigen schema.',
  'web.receipt.remediation.permanent_provider':
    '{provider} weigerde dit definitief. Als u dezelfde inhoud opnieuw probeert, verandert het antwoord niet.',
  'web.receipt.remediation.internal':
    'Dit was een fout van onze kant. Het is opgenomen met onderstaande referentie.',
  'web.receipt.remediation.unknown':
    '{provider} heeft iets geretourneerd waarvoor we geen regel hebben. Het opgeschoonde antwoord staat hieronder.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Rekeningen',
  'web.connection.tab.capabilities': 'Capaciteitsmatrix',
  'web.connection.tab.groups': 'Klantgroepen',
  'web.connection.loading': 'Verbonden accounts laden',
  'web.connection.error.title': 'Verbonden accounts konden niet worden geladen',
  'web.connection.error.body':
    'De publicatie wordt niet beïnvloed. Geplande berichten lopen nog steeds tegen de opgeslagen toegang.',
  'web.connection.list.label': 'Verbonden accounts',
  'web.connection.empty.example':
    'X, @acme, persoonlijk profiel, verbonden op 12 juni door Ana Ruiz, publicatie en statistieken, voor het laatst gepubliceerd op 6 augustus',
  'web.connection.filter.provider': 'Platform',
  'web.connection.filter.health': 'Gezondheid',
  'web.connection.filter.group': 'Klantengroep',
  'web.connection.filter.anyHealth': 'Elke gezondheid',
  'web.connection.healthFilter.healthy': 'Werken',
  'web.connection.healthFilter.expiring_soon': 'Verloopt binnenkort',
  'web.connection.healthFilter.expired': 'Toegang verlopen',
  'web.connection.healthFilter.revoked': 'Toegang ingetrokken',
  'web.connection.healthFilter.permission_missing': 'Ontbrekende toestemming',
  'web.connection.healthFilter.review_pending': 'Wachten op platformbeoordeling',
  'web.connection.healthFilter.paused': 'Gepauzeerd',
  'web.connection.healthFilter.unknown': 'Gezondheid niet beschikbaar',

  'web.connection.row.summaryLabel': 'Wat dit account kan doen',
  'web.connection.row.expand': 'Toon het volledige overzicht voor {account}',
  'web.connection.row.collapse': 'Verberg het volledige overzicht voor {account}',
  'web.connection.row.metered': 'Gemeten per operatie. Geschatte {amount} per geplaatst bericht.',
  'web.connection.row.limitationHeading': 'Beperkingen voor dit account',
  'web.connection.row.noLimitations': 'Geen productie- of bètabeperking voor dit account.',
  'web.connection.row.beta': 'Bèta-connector',
  'web.connection.row.betaBody':
    'Deze connector werkt, met limieten die we nog niet hebben geverifieerd. Controleer het gepubliceerde bericht voordat u erop vertrouwt.',

  'web.connection.detail.expiryLabel': 'De toegang verloopt',
  'web.connection.health.expiresIn': 'Toegang vervalt {relativeTime}, op {date}',
  'web.connection.health.noExpiry':
    'Deze toegang verloopt niet volgens een schema dat {provider} ons vertelt.',
  'web.connection.health.checkedAt': 'Gezondheid gecontroleerd {relativeTime}',

  'web.connection.action.inspect': 'Inspecteer machtigingen',
  'web.connection.action.viewCapabilities': 'Kijk wat het ondersteunt',
  'web.connection.action.moveGroup': 'Ga naar een andere groep',
  'web.connection.action.menu': 'Meer acties voor {account}',

  'web.connection.pause.title': '{account} pauzeren?',
  'web.connection.resume.title': '{account} hervatten?',
  'web.connection.resume.body':
    'Geplande berichten voor dit account worden opnieuw gepubliceerd op de geplande tijden. Berichten waarvan de tijd al is verstreken, worden niet met terugwerkende kracht geactiveerd.',
  'web.connection.disconnect.confirmWord': 'ONTKOPPEL',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# geplande post} other {# geplande posts}} voor dit account wordt niet gepubliceerd.',
  'web.connection.disconnect.consequence.published':
    'Reeds gepubliceerde berichten blijven op {provider}. Post Array verwijdert ze niet.',
  'web.connection.disconnect.consequence.analytics':
    'Reeds verzamelde statistieken blijven in deze werkruimte en worden niet meer bijgewerkt.',

  'web.connection.connect.title': 'Koppel een account',
  'web.connection.connect.chooseProvider': 'Welk platform',
  'web.connection.connect.permissionHeading': 'Waar Post Array {provider} om zal vragen',
  'web.connection.connect.requirementHeading': 'Voordat u verdergaat',
  'web.connection.connect.continue': 'Ga verder naar {provider}',
  'web.connection.connect.handoffNote':
    'Het volgende scherm is {provider}, niet Post Array. Post Array ziet nooit uw wachtwoord.',
  'web.connection.connect.noWriteWithoutApproval':
    'Als u een account koppelt, wordt er niets gepubliceerd. Elk bericht volgt nog steeds dit goedkeuringsbeleid voor werkruimten.',
  'web.connection.projectScope.title': 'Kanalen voor {project}',
  'web.connection.projectScope.body':
    'Nieuwe kanalen koppelen aan dit project. Wissel van project via de bovenbalk om een andere set te beheren.',
  'web.connection.projectMissing.title': 'Maak een project voordat je een kanaal koppelt',
  'web.connection.projectMissing.body':
    'Projecten houden kanalen, media, concepten en planningen van verschillende producten of klanten gescheiden.',

  'web.connection.requirement.instagram':
    'Voor publiceren op Instagram is een professioneel account nodig, dat wil zeggen een bedrijfs- of makersaccount dat aan een Facebook-pagina is gekoppeld.',
  'web.connection.requirement.facebook':
    'Post Array publiceert naar Facebook Pages. Een persoonlijk profiel kan geen publicatiedoel zijn.',
  'web.connection.requirement.linkedin':
    'Om voor een organisatie te publiceren heeft u een contentbeheerderrol op die LinkedIn-pagina nodig.',
  'web.connection.requirement.youtube':
    'Totdat Google de app-audit voltooit, worden uploads van dit project als privé gepubliceerd. Je kunt achteraf de zichtbaarheid op YouTube wijzigen.',
  'web.connection.requirement.tiktok':
    'TikTok vereist dat je voor elke post zelf het publiek kiest. Post Array kan er geen voor u selecteren.',
  'web.connection.requirement.x':
    'X kosten per operatie. Een bericht met een URL kost meer dan een bericht met platte tekst, en de schatting wordt weergegeven voordat u plant.',
  'web.connection.requirement.threads':
    'Threads publishing gebruikt het account dat is gekoppeld aan je professionele Instagram-account.',
  'web.connection.requirement.bluesky':
    'Bluesky maakt verbinding met een app-wachtwoord dat is aangemaakt in uw Bluesky-instellingen, niet met uw accountwachtwoord.',
  'web.connection.requirement.generic':
    'Je hebt toestemming nodig om vanaf het platform zelf op dit account te posten. Post Array kan deze niet toekennen.',

  'web.connection.purpose.publish': 'Publiceer de berichten die u plant in Post Array.',
  'web.connection.purpose.readPosts':
    'Een bericht teruglezen dat Post Array heeft gepubliceerd, zodat het ontvangstbewijs kan bewijzen dat het live is.',
  'web.connection.purpose.identity':
    'Toont de exacte accountnaam in Post Array, zodat u nooit naar de verkeerde publiceert.',
  'web.connection.purpose.analytics':
    'De statistieken lezen die dit platform rapporteert voor uw eigen berichten.',
  'web.connection.purpose.refresh':
    'Toegang behouden zodat een gepland bericht niet van de ene op de andere dag mislukt.',
  'web.connection.purpose.chooseDestination':
    "Een overzicht van de pagina's en kanalen die u als publicatiedoel kunt kiezen.",

  'web.connection.permissions.title': 'Machtigingen op {account}',
  'web.connection.permissions.scopeColumn': 'Toestemming',
  'web.connection.permissions.stateColumn': 'Staat',
  'web.connection.permissions.purposeColumn': 'Waar Post Array het voor gebruikt',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {# toestemming ontbreekt} other {# toestemming ontbreekt}}. Maak opnieuw verbinding en accepteer het om de onderstaande functies te herstellen.',
  'web.connection.permissions.snapshot': 'Lees van {provider} {relativeTime}',

  'web.connection.capability.title': 'Capaciteitsmatrix',
  'web.connection.capability.subtitle':
    'Gegenereerd op basis van de connectordefinities met versiebeheer in deze build en vervolgens met de hand beoordeeld. Het zijn dezelfde gegevens die de componist en de openbare mogelijkhedenpagina gebruiken.',
  'web.connection.capability.tableLabel': 'Mogelijkheden per platform',
  'web.connection.capability.featureColumn': 'Vermogen',
  'web.connection.capability.legendTitle': 'Hoe dit te lezen',
  'web.connection.capability.legend.supported':
    'Post Array kan dit vandaag nog doen voor een aangesloten account van het juiste type.',
  'web.connection.capability.legend.not_implemented':
    'Het platform biedt dit en Post Array heeft het nog niet gebouwd. Het staat op de connectorroadmap.',
  'web.connection.capability.legend.unsupported':
    'Het platform biedt dit niet aan via de officiële API, dus geen enkele tool kan dit veilig doen.',
  'web.connection.capability.legend.requires_review':
    'Gebouwd, en het platform verleent het pas nadat het de app of het account heeft beoordeeld.',
  'web.connection.capability.versionLabel': 'Connectordefinities',
  'web.connection.capability.version': 'Connectordefinities versie {version}',
  'web.connection.capability.observedAt': 'Momentopname leest {relativeTime}',
  'web.connection.capability.forAccount': 'Getoond voor {account}',
  'web.connection.capability.noSnapshot':
    'Er is nog geen capaciteitsmomentopname voor dit account. Maak opnieuw verbinding om er een te lezen.',
  'web.connection.capability.cellLabel': '{feature} op {provider}: {state}',

  'web.connection.group.title': 'Klantgroepen',
  'web.connection.group.listLabel': 'Klantgroepen',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Geen accounts} one {# account} other {# accounts}}',
  'web.connection.group.create': 'Maak een groep',
  'web.connection.group.nameLabel': 'Groepsnaam',
  'web.connection.group.namePlaceholder': 'Acme EU',
  'web.connection.group.moveTitle': 'Verplaats {account}',
  'web.connection.group.moveLabel': 'Verplaats naar',
  'web.connection.group.moveConfirm': 'Account verplaatsen',
  'web.connection.group.movedAnnouncement': '{account} verplaatst naar {group}',
  'web.connection.group.filterCalendarHint':
    'Een groep filtert de agenda en analyses. Als u een account verplaatst, blijven alle berichten, ontvangstbewijzen en statistieken die het al heeft, behouden.',
  'web.connection.group.empty.title': 'Nog geen klantgroepen',
  'web.connection.group.empty.body':
    'Een groep is een klant of een project. Groepeer accounts om de agenda en analyses per klant te filteren.',

  'web.connection.incident.title': 'Deze rekening heeft aandacht nodig',
  'web.connection.incident.remediationHeading': 'Wat te doen',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# gepland bericht is in de wacht gezet} other {# geplande berichten zijn in de wacht gezet}} voor dit account.',
  'web.connection.incident.nothingLost': 'Niets gaat verloren en niets wordt gedupliceerd.',
} as const;
