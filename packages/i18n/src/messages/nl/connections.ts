/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'Verbindingen',
  'connection.subtitle':
    "De accounts, pagina's en kanalen waarnaar deze werkruimte kan publiceren.",
  'connection.add': 'Koppel een account',
  'connection.count': '{used, plural, one {# actief kanaal} other {# actieve kanalen}} van {limit}',
  'connection.limitReached':
    'Deze werkruimte gebruikt alle {limit}-kanalen. Koppel de ene los voordat u de andere aansluit.',

  'connection.account.label': 'Rekening',
  'connection.account.type.profile': 'Profiel',
  'connection.account.type.page': 'Pagina',
  'connection.account.type.channel': 'Kanaal',
  'connection.account.type.group': 'Groep',
  'connection.account.type.organization': 'Organisatie',
  'connection.account.type.business': 'Zakelijke rekening',
  'connection.account.type.creator': 'Creator-account',
  'connection.connectedBy': 'Verbonden door {name} op {date}',
  'connection.lastPublished': 'Laatst gepubliceerde {relativeTime}',
  'connection.lastPublishedNever': 'Er is nog niets gepubliceerd vanaf dit account',
  'connection.lastAnalyticsSync': 'Analytics gesynchroniseerd {relativeTime}',

  'connection.status.healthy': 'Werken',
  'connection.status.expiringSoon': 'Verloopt {relativeTime}',
  'connection.status.expired': 'Toegang verlopen',
  'connection.status.revoked': 'Toegang ingetrokken',
  'connection.status.paused': 'Gepauzeerd',
  'connection.status.permissionMissing': 'Ontbrekende toestemming',
  'connection.status.reviewPending': 'Wachten op platformbeoordeling',
  'connection.status.unknown': 'Gezondheid niet beschikbaar',

  'connection.token.expiresAt': 'Toegang vervalt {date}',
  'connection.token.expiryUnknown': '{provider} vertelt ons niet wanneer deze toegang verloopt.',

  'connection.permissions.title': 'Machtigingen',
  'connection.permissions.granted': 'Toegegeven',
  'connection.permissions.missing': 'Niet verleend',
  'connection.permissions.explainBeforeOAuth':
    'Post Array zal {provider} om deze machtigingen vragen. U kunt op elk moment de verbinding verbreken.',
  'connection.permissions.whyNeeded': 'Waarom dit nodig is',

  'connection.reconnect.title': 'Maak opnieuw verbinding met {account}',
  'connection.reconnect.body':
    'Geplande berichten voor dit account worden in de wacht gezet totdat er opnieuw verbinding wordt gemaakt. Er gaat niets verloren.',
  'connection.disconnect.title': '{account} ontkoppelen?',
  'connection.disconnect.body':
    'Geplande berichten voor dit account worden niet gepubliceerd. Reeds verzamelde ontvangstbewijzen en analyses blijven in deze werkruimte.',
  'connection.pause.body':
    'Een onderbroken account behoudt zijn geschiedenis en planning, maar publiceert pas nadat u het hebt hervat.',

  'connection.incident.invalidToken':
    '{provider} heeft de opgeslagen toegang voor {account} afgewezen. Maak opnieuw verbinding om de publicatie te herstellen.',
  'connection.incident.permissionLost':
    '{account} verleent niet langer {permission}. Maak opnieuw verbinding en accepteer die toestemming.',
  'connection.incident.roleLost':
    'Uw {provider}-gebruiker heeft niet langer een rol op {account}. Vraag een beheerder van die pagina om deze te herstellen.',
  'connection.incident.accountTypeInvalid':
    'Instagram heeft een professioneel account nodig. Schakel {account} over naar een bedrijfs- of makersaccount en maak vervolgens opnieuw verbinding.',
  'connection.incident.reviewRestricted':
    '{provider} heeft deze app beperkt in afwachting van beoordeling. Berichten van {account} publiceren privé totdat de beoordeling is voltooid.',

  'connection.group.title': 'Klantgroepen',
  'connection.group.description':
    'Groepeer accounts op klant of project om elk scherm te filteren.',
  'connection.group.assign': 'Verplaats naar groep',
  'connection.group.none': 'Niet gegroepeerd',
  'connection.group.moveNote':
    'Als u een account verplaatst, blijven de berichten, ontvangstbewijzen en analyses behouden.',

  'connection.oauth.starting': '{provider} openen',
  'connection.oauth.returned': 'De verbinding voltooien',
  'connection.oauth.chooseAccounts': 'Kies welke accounts u wilt koppelen',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'Er kunnen geen accounts op deze {provider}-login worden aangesloten. {reason}',
  'connection.oauth.canceled': 'De verbinding is verbroken op {provider}. Er veranderde niets.',
  'connection.oauth.alreadyConnected': '{account} is al verbonden met deze werkruimte.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} is verbonden met een andere werkruimte. Koppel hem daar eerst los.',

  'capability.title': 'Wat dit account ondersteunt',
  'capability.matrix.title': 'Platformmogelijkheden',
  'capability.matrix.subtitle':
    'Gegenereerd op basis van de connectordefinities die we handmatig onderhouden en beoordelen.',
  'capability.level.supported': 'Ondersteund',
  'capability.level.unsupported': 'Niet aangeboden door het platform',
  'capability.level.not_implemented': 'Nog niet gebouwd',
  'capability.level.requires_review': 'Platformbeoordeling vereist',
  'capability.level.beta': 'Bèta',
  'capability.level.unknown': 'Niet beschikbaar',
  'capability.explain.supported': 'Post Array kan dit vandaag voor deze rekening doen.',
  'capability.explain.unsupported':
    '{provider} biedt dit niet aan via zijn officiële API, dus geen enkele tool kan dit veilig doen.',
  'capability.explain.not_implemented':
    '{provider} biedt dit aan, maar Post Array heeft het nog niet gebouwd. Het staat op de connectorroadmap.',
  'capability.explain.requires_review':
    '{provider} verleent dit alleen nadat zij de app of het account heeft beoordeeld. Het blijft niet beschikbaar totdat de beoordeling is geslaagd.',
  'capability.explain.beta':
    'Dit werkt, met limieten die we nog niet hebben geverifieerd. Controleer het resultaat voordat u erop vertrouwt.',
  'capability.explain.unknown':
    'We kunnen de huidige rechten voor dit account niet lezen. Maak opnieuw verbinding om ze te vernieuwen.',
  'capability.lastChecked': '{relativeTime} gecontroleerd',
  'capability.feature.text': 'Tekstberichten',
  'capability.feature.image': 'Afbeeldingen',
  'capability.feature.carousel': 'Carrousels',
  'capability.feature.video': 'Video',
  'capability.feature.document': 'Documenten',
  'capability.feature.firstComment': 'Geplande eerste reactie',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'Inheemse vermeldingen',
  'capability.feature.destinations': 'Bestemming selectie',
  'capability.feature.privacy': 'Privacycontroles',
  'capability.feature.thumbnail': 'Aangepaste miniatuur',
  'capability.feature.altText': 'Alt-tekst',
  'capability.feature.analytics': 'Analyse',
  'capability.feature.delete': 'Een gepubliceerd bericht verwijderen',
  'capability.feature.commentCount': 'Commentaar telt',
  'capability.feature.commentReplies': 'Reacties lezen en beantwoorden',
  'capability.feature.disclosure': 'Automatisering openbaarmaking',
} as const;
