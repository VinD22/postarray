/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'Nog niets gepland',
  'empty.calendar.body':
    'Schrijf je eerste bericht en kies een tijdstip. Je kunt het later wijzigen.',
  'empty.calendar.action': 'Stel een bericht samen',
  'empty.drafts.title': 'Geen concepten',
  'empty.drafts.body': 'Concepten die u opslaat, verschijnen hier met hun doelen en problemen.',
  'empty.connections.title': 'Geen accounts gekoppeld',
  'empty.connections.body':
    'Koppel een account om erop te publiceren. We laten u eerst de exacte rechten zien.',
  'empty.connections.action': 'Koppel een account',
  'empty.analytics.title': 'Nog geen statistieken',
  'empty.analytics.body':
    'Statistieken verschijnen nadat je eerste bericht lang genoeg live is geweest zodat het platform erover kan rapporteren.',
  'empty.analytics.noPermission':
    'Dit account heeft geen analysetoegang verleend. Maak opnieuw verbinding om het toe te voegen.',
  'empty.approvals.title': 'Er wacht niets op je',
  'empty.approvals.body': 'Goedkeuringsverzoeken voor uw projecten verschijnen hier.',
  'empty.library.title': 'Je bibliotheek is leeg',
  'empty.library.body': 'Upload afbeeldingen en video, of importeer ze vanaf een URL of de API.',
  'empty.library.action': 'Media uploaden',
  'empty.automation.title': 'Nog geen regels',
  'empty.automation.body':
    'Een regel reageert ergens op en stelt een actie voor. Elke regel toont zijn limieten voordat u hem inschakelt.',
  'empty.webhooks.title': 'Geen eindpunten',
  'empty.webhooks.body':
    'Voeg een eindpunt toe om ondertekende gebeurtenissen over publicatie en verbindingen te ontvangen.',
  'empty.searchResults.title': 'Geen resultaten voor {query}',
  'empty.searchResults.body': 'Controleer de spelling of wis een filter.',
  'empty.filtered.title': 'Niets komt overeen met deze filters',
  'empty.filtered.action': 'Wis filters',
  'empty.auditLog.title': 'Nog geen activiteit',
  'empty.receipts.title': 'Nog geen ontvangstbewijzen',
  'empty.receipts.body':
    'Bij elke publicatie hoort een ontvangstbewijs dat u kunt inzien en delen.',

  'loading.default': 'Laden',
  'loading.calendar': 'Uw agenda laden',
  'loading.analytics': 'Statistieken laden',
  'loading.preview': 'Het voorbeeld bouwen',
  'loading.validating': 'Controle op de huidige platformlimieten',
  'loading.publishing': 'Publiceren naar {provider}',
  'loading.uploading': '{name} uploaden',
  'loading.uploadProgress': '{percent} geüpload',
  'loading.connecting': 'Verbinding maken met {provider}',
  'loading.savingDraft': 'Uw concept opslaan',
  'loading.generatingPlan': 'Het bouwen van uw plan',
  'loading.longRunning': 'Dit duurt langer dan normaal. Het loopt nog steeds.',

  'offline.banner': 'Je bent offline. Wijzigingen worden op dit apparaat bewaard.',
  'offline.draftSafe': 'Je tocht is veilig. Het wordt gesynchroniseerd wanneer u weer online bent.',
  'offline.publishDisabled':
    'Publiceren heeft verbinding nodig. Dit wordt niet stil in de wachtrij gezet.',
  'offline.scheduleQueued':
    'Dit planningsverzoek wordt op dit apparaat in de wachtrij geplaatst en wordt verzonden zodra u weer online bent.',
  'offline.reconnected': 'Terug online. Uw wijzigingen synchroniseren.',
  'offline.syncConflict':
    'Sommige wijzigingen konden niet automatisch worden samengevoegd. Controleer ze voordat u ze opslaat.',

  'permission.denied.title': 'U heeft hier geen toegang toe',
  'permission.denied.role': 'Hiervoor is de rol {role} nodig. Jij bent {currentRole}.',
  'permission.denied.scope': 'Deze referentie heeft de reikwijdte {scope} nodig.',
  'permission.denied.contactOwner': 'Vraag {owner} om deze te verlenen.',
  'permission.denied.projectScope': 'Uw toegang is beperkt tot {projects}.',
  'permission.readOnly': 'Deze werkruimte is momenteel alleen-lezen.',
  'permission.mfaRequired': 'Bevestig met tweefactorauthenticatie om door te gaan.',

  'rateLimit.title': 'Even vertragen',
  'rateLimit.body': 'U heeft {count}-verzoeken gedaan in {window}. De limiet is {limit}.',
  'rateLimit.resetsAt': 'Dit wordt gereset op {time}.',
  'rateLimit.cheaperAlternative':
    'Door nu te plannen in plaats van te publiceren, wordt deze limiet vermeden.',
  'rateLimit.providerCost':
    '{provider} kosten per bewerking. Deze actie wordt geschat op {amount}.',

  'incident.providerDegraded':
    '{provider} heeft problemen. Geplande berichten blijven opnieuw proberen.',
  'incident.providerDown':
    '{provider} is niet beschikbaar. Niets gaat verloren en niets wordt gedupliceerd.',
  'incident.isolated': 'Andere platforms blijven onaangetast.',
  'incident.statusPage': 'Live status per connector en oppervlak',
  'incident.startedAt': '{relativeTime} gestart',

  'translation.incomplete':
    'Sommige tekst op dit scherm is nog niet vertaald in {language} en wordt in het Engels weergegeven.',
  'translation.beta': 'Deze taal is in bèta. Rapporteer alles wat verkeerd leest.',

  'confirm.discardChanges.title': 'Uw wijzigingen annuleren?',
  'confirm.discardChanges.body': 'Dit kan niet ongedaan worden gemaakt.',
  'confirm.deleteItem.title': '{name} verwijderen?',
  'confirm.deleteItem.body': 'Dit kan niet ongedaan worden gemaakt.',
  'confirm.cancelScheduled.title': 'Dit geplande bericht annuleren?',
  'confirm.cancelScheduled.body':
    'Het zal niet publiceren. Het concept blijft hier staan, zodat u het opnieuw kunt inplannen.',
  'confirm.publishNow.title': 'Nu publiceren?',
  'confirm.publishNow.body':
    '{count, plural, one {Dit wordt onmiddellijk gepubliceerd naar # account} other {Dit wordt onmiddellijk gepubliceerd naar # accounts}}. Het kan niet worden teruggeroepen van Post Array.',
  'confirm.typeToConfirm': 'Typ {word} om te bevestigen.',
} as const;
