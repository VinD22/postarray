/**
 * Web catalog for settings, the developer portal, billing and the Growth
 * Advisor.
 *
 * This file only adds what the web screens need on top of the intent catalogs
 * in `settings.ts`, `developer.ts`, `billing.ts` and `growth.ts`. Everything
 * here lives under a `.ui.` segment so a key can never collide with one of
 * those files when the catalogs are merged.
 *
 * Several strings are mandated word for word and must not be softened:
 *  - `billing.ui.annualFraming` states the saving in currency, never a percent.
 *  - `billing.ui.cancelConfirmedBeforeConversion` must read
 *    "Canceled. You will not be charged."
 *  - the media generation boundary paragraph is NOT restated here. It already
 *    exists as `billing.mediaGeneration.explanation`, and the Tool Radar
 *    renders that same key so there is one sentence to review and translate.
 */
export const webSettingsMessages = {
  /* ------------------------------------------------------------------ shell */

  'settings.ui.subtitle': 'Alles dat deze werkruimte configureert. Niets hier publiceert iets.',
  'settings.ui.nav.label': 'Instellingen secties',
  'settings.ui.index.help':
    'Kies een sectie. Elke wijziging wordt aan u toegeschreven en verschijnt in het auditlogboek.',

  'settings.ui.section.members': 'Leden en rollen',
  'settings.ui.section.membersSummary':
    'Wie bevindt zich in deze werkruimte en wat kan elke persoon doen?',
  'settings.ui.section.projects': 'Projecten',
  'settings.ui.section.projectsSummary':
    'Stem, publiek, goedgekeurde claims, geblokkeerde termen, landregels, domeinen en de woordenlijst.',
  'settings.ui.section.agents': 'Agenten en API',
  'settings.ui.section.agentsSummary':
    'Serviceaccounts, scopes, limieten, inloggegevens, activiteit en de dry run-speeltuin.',
  'settings.ui.section.apps': 'Ontwikkelaar-apps',
  'settings.ui.section.appsSummary':
    'OAuth-applicaties van derden, toelatingslijsten omleiden, toestemming en subsidies.',
  'settings.ui.section.webhooks': 'Webhaken',
  'settings.ui.section.webhooksSummary':
    'Ondertekende uitgaande gebeurtenissen, leveringslogboeken, herlevering en geheime rotatie.',
  'settings.ui.section.billing': 'Facturering',
  'settings.ui.section.billingSummary':
    'Plan, proefperiode, interval, gemeten providergebruik, facturen en opzegging.',
  'settings.ui.section.referrals': 'Verwijzing en affiliate',
  'settings.ui.section.referralsSummary':
    'Uw bekendgemaakte verwijzingslink, toegeschreven aanmeldingen en commissiestatus.',
  'settings.ui.section.localization': 'Lokalisatie',
  'settings.ui.section.localizationSummary':
    'Interfacetaal, inhoudstalen, markten, tijdzone en tijdformaat.',
  'settings.ui.section.security': 'Beveiliging',
  'settings.ui.section.securitySummary':
    'Sessies, tweefactorauthenticatie, inloggegevens, agenten, webhooks en app-subsidies.',
  'settings.ui.section.data': 'Gegevenscontroles',
  'settings.ui.section.dataSummary':
    'Exporteer, trek een verbinding in, verwijder een project, verwijder content of sluit het account.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': '{section} laden',
  'settings.ui.state.errorTitle': 'We kunnen {section} niet laden',
  'settings.ui.state.errorRetry': 'Probeer het opnieuw',
  'settings.ui.state.savingAnnouncement': '{section} opslaan',
  'settings.ui.state.savedAnnouncement': '{section} opgeslagen',
  'settings.ui.state.saveFailedAnnouncement':
    '{section} is niet opgeslagen. Jouw inbreng is er nog steeds.',
  'settings.ui.state.offlineTitle': 'Je bent offline',
  'settings.ui.state.offlineBody':
    'Je kunt deze pagina lezen. Wijzigingen kunnen pas worden opgeslagen als de verbinding weer tot stand is gebracht.',
  'settings.ui.state.permissionTitle': 'U heeft geen toegang tot {section}',
  'settings.ui.state.permissionBody':
    'Deze sectie verandert hoe de werkruimte zich gedraagt, dus deze wordt beperkt per rol.',
  'settings.ui.state.permissionRequirements': 'Wat je nodig hebt',
  'settings.ui.state.permissionContact':
    'Een eigenaar of beheerder van deze werkruimte kan deze verlenen. Ze staan ​​vermeld onder Leden en rollen.',
  'settings.ui.state.rateLimitTitle': 'Teveel veranderingen in korte tijd',
  'settings.ui.state.rateLimitCause':
    'Deze werkruimte heeft de schrijflimiet voor instellingenwijzigingen bereikt.',
  'settings.ui.state.rateLimitReset': 'Limiet opnieuw ingesteld',
  'settings.ui.state.rateLimitAlternative':
    'Niets dat je hebt bewaard, is verloren gegaan. Alleen-lezen-acties werken nog steeds terwijl u wacht.',
  'settings.ui.state.rateLimitUsage': 'Instellingen schrijft dit uur',
  'settings.ui.state.rateLimitUsageText': '{used} of {limit} gebruikt',
  'settings.ui.state.unsavedTitle': 'U heeft niet-opgeslagen wijzigingen',
  'settings.ui.state.unsavedBody': 'Bewaar ze voordat u deze sectie verlaat.',
  'settings.ui.state.readOnlyTitle': 'Deze werkruimte is alleen-lezen',
  'settings.ui.state.readOnlyBody':
    'Facturering is achterstallig. Uw inhoud, bonnen en verbindingen zijn intact. Instellingen kunnen worden gelezen maar niet gewijzigd.',

  'settings.ui.state.referenceLabel': 'Ondersteuning referentie',

  'settings.ui.attribution': 'Gewijzigd door {name} {relativeTime}',
  'settings.ui.attributionNever': 'Niet veranderd sinds de oprichting ervan',
  'settings.ui.copyFailed':
    'Uw browser heeft de kopie geblokkeerd. Selecteer de tekst en kopieer deze handmatig.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'Elke uitnodiging, rolwijziging en verwijdering wordt geregistreerd met uw naam en tijdstip.',
  'settings.ui.members.tableCaption': 'Mensen in deze werkruimte, met rol en reikwijdte',
  'settings.ui.members.column.person': 'Persoon',
  'settings.ui.members.column.role': 'Rol',
  'settings.ui.members.column.scope': 'Reikwijdte',
  'settings.ui.members.column.approvals': 'Goedkeuringen',
  'settings.ui.members.column.lastActive': 'Laatst actief',
  'settings.ui.members.column.actions': 'Acties',
  'settings.ui.members.scopeAll': 'Alle projecten en accounts',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {# project} other {# projecten}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Kan goedkeuren',
  'settings.ui.members.approvals.cannotApprove': 'Kan niet goedkeuren',
  'settings.ui.members.approvals.canApproveOwnProjects':
    'Kan goedkeuren voor de vermelde projecten',
  'settings.ui.members.lastActiveNever': 'Heeft zich nog niet aangemeld',
  'settings.ui.members.changeRole': 'Verander de rol voor {name}',
  'settings.ui.members.remove': '{name} verwijderen',
  'settings.ui.members.lastOwnerTitle': 'Een werkruimte heeft minimaal één eigenaar',
  'settings.ui.members.lastOwnerBody':
    'Maak eerst iemand anders eigenaar, dan wordt deze wijziging beschikbaar.',
  'settings.ui.members.inviteTitle': 'Nodig iemand uit voor deze werkruimte',
  'settings.ui.members.inviteBody':
    'Ze ontvangen een e-mail met een link. De uitnodiging vervalt na zeven dagen en u kunt deze vóór die tijd intrekken.',
  'settings.ui.members.inviteRole': 'Rol',
  'settings.ui.members.inviteScope': 'Projecten waarin ze kunnen werken',
  'settings.ui.members.inviteScopeAll': 'Elk project in deze werkruimte',
  'settings.ui.members.inviteScopeSelected': 'Alleen de projecten die ik selecteer',
  'settings.ui.members.inviteApprovals': 'Kan goedkeuringsverzoeken beslissen',
  'settings.ui.members.inviteApprovalsHelp':
    'Alleen rollen waarin beoordeling al is opgenomen, kunnen dit krijgen. Het staat los van bewerken.',
  'settings.ui.members.inviteSubmit': 'Uitnodiging verzenden',
  'settings.ui.members.invitePending': 'Uitgenodigd {relativeTime} door {name}',
  'settings.ui.members.inviteRevoke': 'Uitnodiging intrekken',
  'settings.ui.members.inviteResend': 'Verstuur de uitnodiging opnieuw',
  'settings.ui.members.emptyTitle': 'Jij bent de enige persoon hier',
  'settings.ui.members.emptyBody':
    'Nodig de mensen uit die de resultaten schrijven, goedkeuren of lezen. Ieder krijgt een rol en een projectbereik.',
  'settings.ui.members.emptyExample':
    'Een veel voorkomende vorm: één eigenaar voor de facturering, één goedkeurder per project en redacteuren die opstellen maar nooit publiceren.',
  'settings.ui.members.roleReferenceTitle': 'Wat elke rol kan doen',
  'settings.ui.members.roleReferenceCaption': 'Rollen en de acties die elke rol toestaat',
  'settings.ui.members.roleColumn.role': 'Rol',
  'settings.ui.members.roleColumn.can': 'Kan doen',
  'settings.ui.members.roleColumn.cannot': 'Kan niet',
  'settings.ui.members.roleCannot.owner': 'Er wordt niets achtergehouden aan een eigenaar.',
  'settings.ui.members.roleCannot.admin': 'Wijzig de facturering of verwijder de werkruimte.',
  'settings.ui.members.roleCannot.manager':
    'Wijzig facturering, rollen of verwijdering van werkruimte.',
  'settings.ui.members.roleCannot.editor':
    'Verbindingen goedkeuren, plannen, publiceren of wijzigen.',
  'settings.ui.members.roleCannot.approver': 'Wijzig verbindingen, regels of facturering.',
  'settings.ui.members.roleCannot.analyst': 'Alles maken, bewerken, goedkeuren of publiceren.',
  'settings.ui.members.roleCannot.viewer': 'Verander helemaal niets.',
  'settings.ui.members.removeTitle': 'Verwijder {name} uit deze werkruimte',
  'settings.ui.members.removeConsequence.access':
    'Ze verliezen onmiddellijk de toegang, op elk oppervlak.',
  'settings.ui.members.removeConsequence.drafts':
    'Concepten die ze hebben geschreven, blijven in de werkruimte staan en blijven bewerkbaar.',
  'settings.ui.members.removeConsequence.audit':
    'Hun eerdere acties blijven in het auditlogboek en op bonnen staan.',
  'settings.ui.members.removeConsequence.approvals':
    'Goedkeuringsaanvragen die erop wachten, keren terug naar de wachtrij voor een andere goedkeurder.',

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'Een project hanteert de regels waaraan inhoud wordt getoetst: wat je mag beweren, wat je niet mag zeggen en hoe elke taal is geschreven.',
  'settings.ui.projects.listCaption': 'Projecten in deze werkruimte',
  'settings.ui.projects.column.project': 'Project',
  'settings.ui.projects.column.locales': 'Inhoud talen',
  'settings.ui.projects.column.accounts': 'Rekeningen',
  'settings.ui.projects.column.updated': 'Bijgewerkt',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Geen accounts} one {# account} other {# accounts}}',
  'settings.ui.projects.emptyTitle': 'Nog geen projecten',
  'settings.ui.projects.emptyBody':
    'Een project groepeert accounts, goedkeuringsregels en taalregels. De meeste teams beginnen met één en voegen er een tweede aan toe als een klant of een markt andere regels nodig heeft.',
  'settings.ui.projects.emptyExample':
    'Voorbeeld: project "Acme EU", talen Engels en Duits, geblokkeerde term "gegarandeerd", vermelding "Betaald partnerschap" op Instagram.',
  'settings.ui.projects.voiceHelp':
    'Hoe dit project klinkt. Wordt gebruikt wanneer u om herschrijving vraagt ​​en wanneer claims worden gecontroleerd.',
  'settings.ui.projects.audienceHelp': 'Voor wie is de content bedoeld, per markt.',
  'settings.ui.projects.approvedClaimsHelp':
    'Verklaringen die een recensent heeft goedgekeurd. Alles buiten deze lijst wordt vóór goedkeuring gemarkeerd, niet na publicatie.',
  'settings.ui.projects.blockedTermsHelp':
    'Woorden die de planning voor dit project blokkeren. Eén per regel.',
  'settings.ui.projects.domainsHelp':
    'Domeinen waarnaar dit project kan linken en waar doorheen kan worden ingekort. Alleen geverifieerde domeinen kunnen in de samensteller worden geselecteerd.',
  'settings.ui.projects.domainVerified': 'Geverifieerde {date}',
  'settings.ui.projects.domainPending': 'DNS-record nog niet gezien',
  'settings.ui.projects.domainVerificationUnavailable': 'Verificatie is nog niet gebouwd',
  'settings.ui.projects.disclosureUnavailable':
    'Standaard openbaarmaking per kanaal is nog niet gebouwd. Voeg de vereiste openbaarmaking toe in het bericht totdat dit is uitgebracht.',
  'settings.ui.projects.glossaryUnavailable':
    'De werkruimteglossarium is nog niet gebouwd. Stem, doelgroep, goedgekeurde beweringen en geblokkeerde termen hierboven worden opgeslagen en gehandhaafd.',
  'settings.ui.projects.localeRulesUnavailable':
    'Schrijfregels per taal zijn nog niet gebouwd. Werkruimtetalen en markten blijven beschikbaar onder Lokalisatie.',
  'settings.ui.projects.disclosureHelp':
    'Standaard toegepast in de componist voor de platforms die u hier kiest. Het kan per bericht worden gewijzigd voordat het wordt goedgekeurd.',
  'settings.ui.projects.glossaryHelp':
    'Productnamen, juridische termen en alles wat een vertaling ongewijzigd moet overleven.',
  'settings.ui.projects.glossaryCaption': 'Beschermde termen en hoe ze per taal worden afgehandeld',
  'settings.ui.projects.glossaryEmpty':
    'Nog geen beschermde termen. Voeg productnamen en juridische termen toe die niet vertaald of opnieuw geformuleerd mogen worden.',
  'settings.ui.projects.localeRulesHelp':
    'Regels per inhoudstaal. Ze worden toegepast wanneer u de tekst aanpast of transcreëert, en aan de recensent getoond.',
  'settings.ui.projects.saveProject': 'Project opslaan',
  'settings.ui.projects.capacityTitle': 'Projectcapaciteit',
  'settings.ui.projects.capacityHelp':
    'Het basisplan van $29 omvat 3 actieve projecten. Een werkruimte kan recht hebben op tot 20 zonder een ander account te maken.',
  'settings.ui.projects.capacitySummary': '{used} van {limit}',
  'settings.ui.projects.atLimitTitle': 'Deze werkruimte heeft elke projectplek gebruikt',
  'settings.ui.projects.atLimitBody':
    'Archiveer een inactief project of wijzig het recht van de werkruimte voordat je er nog een toevoegt. De huidige limiet is {limit}.',
  'settings.ui.projects.listLabel': 'Kies een project om te bewerken',
  'settings.ui.projects.detailsTitle': 'Projectdetails',
  'settings.ui.projects.projectMeta':
    '{accounts, plural, =0 {Geen kanalen} one {# kanaal} other {# kanalen}} · Bijgewerkt {updated}',
  'settings.ui.projects.archiveAction': 'Project archiveren',
  'settings.ui.projects.archiveTitle': '{project} archiveren?',
  'settings.ui.projects.archiveBody':
    'Dit inactieve project verlaat de actieve werkruimte en maakt één projectplek vrij.',
  'settings.ui.projects.archiveChannels':
    'De gekoppelde kanalen verschijnen niet langer in actieve projectstromen.',
  'settings.ui.projects.archiveHistory':
    'Concepten, gepubliceerde berichten, ontvangstbevestigingen en auditgeschiedenis blijven bewaard.',
  'settings.ui.projects.archiveLastDisabled': 'Houd minstens één actief project in de werkruimte.',
  'settings.ui.projects.archiveConnectedDisabled':
    'Ontkoppel de kanalen van dit project voordat je het archiveert.',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'Drie afzonderlijke instellingen: de taal van deze app, de talen waarin u publiceert en de markten waarvoor u schrijft. Het veranderen van de één verandert nooit de ander.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Kies een interfacetaal voor deze app. Inhoudstalen zijn afzonderlijk en al beschikbaar.',
  'settings.ui.localization.marketHelp':
    'Een markt verandert voorbeelden, juridische onthullingen en oproepen tot actie. Het verandert niets aan de taal van een bericht.',
  'settings.ui.localization.previewTitle': 'Hoe datums en cijfers worden gelezen',
  'settings.ui.localization.previewDate': 'Datum',
  'settings.ui.localization.previewTime': 'Tijd',
  'settings.ui.localization.previewNumber': 'Nummer',
  'settings.ui.localization.previewCurrency': 'Valuta',
  'settings.ui.localization.weekStartHelp': 'Gebruikt door de kalenderweekweergave.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'Alles wat op deze werkruimte kan inwerken, op één plek: uw sessies, inloggegevens, agenten, webhooks en de apps waartoe u toegang heeft verleend.',
  'settings.ui.security.sessionsCaption': 'Ingelogde sessies voor uw account',
  'settings.ui.security.sessionColumn.device': 'Apparaat en browser',
  'settings.ui.security.sessionColumn.location': 'Geschatte locatie',
  'settings.ui.security.sessionColumn.lastSeen': 'Laatst gebruikt',
  'settings.ui.security.sessionCurrent': 'Deze sessie',
  'settings.ui.security.sessionRevokeAll': 'Meld u elke andere sessie af',
  'settings.ui.security.sessionLocationUnknown': 'Locatie niet geregistreerd',
  'settings.ui.security.mfaOn': 'Tweefactorauthenticatie staat aan',
  'settings.ui.security.mfaOff': 'Tweefactorauthenticatie staat uit',
  'settings.ui.security.mfaBody':
    'Er is nog een tweede factor nodig voordat u de facturering kunt wijzigen, een serviceaccount kunt maken, een account opnieuw kunt koppelen en uw inloggegevens kunt intrekken.',
  'settings.ui.security.credentialsTitle': 'API-sleutels',
  'settings.ui.security.credentialsBody':
    'Sleutels die eigendom zijn van deze werkruimte. Ze staan ​​los van app-subsidies en van uw eigen sessie.',
  'settings.ui.security.agentsTitle': 'Serviceaccounts',
  'settings.ui.security.webhooksTitle': 'Webhook-eindpunten',
  'settings.ui.security.grantsTitle': 'Apps die u heeft toegestaan',
  'settings.ui.security.grantsBody':
    'Als u een app intrekt, worden de tokens onmiddellijk stopgezet. Uw eigen verbindingen en geplande berichten worden niet beïnvloed.',
  'settings.ui.security.grantScopes': 'Toegekende machtigingen',
  'settings.ui.security.socialPermissionsTitle': 'Machtigingen voor sociale accounts',
  'settings.ui.security.socialPermissionsBody':
    'Wat elk verbonden account Post Array heeft toegestaan te doen, op basis van de capaciteitsmomentopname die is gemaakt tijdens de verbinding.',
  'settings.ui.security.viewInSection': 'Beheer in {section}',
  'settings.ui.security.emptySessions': 'Alleen deze sessie is aangemeld.',
  'settings.ui.security.emptyGrants':
    'Geen enkele app van derden heeft toegang tot deze werkruimte. Apps verschijnen hier nadat u ze hebt toegestaan ​​op een toestemmingsscherm.',
  'settings.ui.security.revokeGrantTitle': 'Toegang voor {app} intrekken',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'De toegang- en vernieuwingstokens werken onmiddellijk niet meer.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Plaatst het al gepland, blijft gepland. Annuleer ze afzonderlijk als u wilt dat ze worden stopgezet.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'De app kan opnieuw om toegang vragen, maar u kunt dit ook weigeren.',

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'Take your data out, remove one thing, or close the account. Every destructive action names exactly what it touches first.',
  'settings.ui.data.exportTitle': 'Export',
  'settings.ui.data.exportBody':
    'A portable archive of content, schedules, receipts, analytics and audit events, plus your uploaded media.',
  'settings.ui.data.exportJson': 'Structured JSON',
  'settings.ui.data.exportCsv': 'Spreadsheet CSV',
  'settings.ui.data.exportMedia': 'Media archive',
  'settings.ui.data.exportJsonHelp':
    'One file per record type. Documented and stable across versions.',
  'settings.ui.data.exportCsvHelp': 'Posts, receipts and metrics as flat tables for a spreadsheet.',
  'settings.ui.data.exportMediaHelp':
    'The original files you uploaded or imported, with checksums.',
  'settings.ui.data.exportStart': 'Prepare export',
  'settings.ui.data.exportRunning':
    'Preparing your export. It keeps running if you close this page.',
  'settings.ui.data.exportReady': 'Export ready, prepared {date}',
  'settings.ui.data.exportDownload': 'Download export',
  'settings.ui.data.exportExpires': 'The download link expires {date}.',
  'settings.ui.data.deleteTitle': 'Delete',
  'settings.ui.data.deleteBody':
    'Choose the smallest thing that solves your problem. Each option below says what survives.',
  'settings.ui.data.deleteConnection': 'Revoke one social connection',
  'settings.ui.data.deleteConnectionHelp':
    'Removes Post Array access to that account. The workspace, its content and its receipts stay.',
  'settings.ui.data.deleteProject': 'Archiveer een project',
  'settings.ui.data.deleteProjectHelp':
    'Verwijdert het project, de regels en het glossarium ervan. Content die eronder is gepubliceerd, behoudt de bijbehorende ontvangstbevestigingen.',
  'settings.ui.data.deleteContent': 'Delete content and media',
  'settings.ui.data.deleteContentHelp':
    'Removes drafts and stored files. It does not remove anything already published on a platform.',
  'settings.ui.data.deleteAccount': 'Close this workspace',
  'settings.ui.data.deleteAccountHelp':
    'Cancels scheduled jobs, revokes every connection, removes stored media and closes the workspace.',
  'settings.ui.data.scheduledJobsTitle': 'Scheduled work that will be canceled first',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {Nothing is scheduled right now} one {# scheduled post} other {# scheduled posts}}',
  'settings.ui.data.cancelJobsFirst': 'Cancel scheduled posts now',
  'settings.ui.data.cancelJobsDone': 'Scheduled posts canceled. Nothing will publish.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'Type the workspace name to confirm',
  'settings.ui.data.deleteConsequence.jobs':
    'Every scheduled post is canceled before anything is removed.',
  'settings.ui.data.deleteConsequence.connections':
    'Every social connection is revoked at the provider.',
  'settings.ui.data.deleteConsequence.media': 'Stored media is deleted and cannot be recovered.',
  'settings.ui.data.deleteConsequence.receipts':
    'Publication receipts are kept for the retention period stated in the Terms, then removed.',
  'settings.ui.data.deleteConsequence.published':
    'Posts already live on a platform are not deleted. Remove those on the platform.',
  'settings.ui.data.exportFirst': 'Export your data before you delete it.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'Deel Post Array met een bekendgemaakte link. De Commissie is nooit afhankelijk van een positieve beoordeling.',
  'settings.ui.referral.linkLabel': 'Uw verwijzingslink',
  'settings.ui.referral.tableCaption': 'Toegekende aanmeldingen en hun commissiestatus',
  'settings.ui.referral.column.signup': 'Aanmelden',
  'settings.ui.referral.column.date': 'Datum',
  'settings.ui.referral.column.state': 'Commissie',
  'settings.ui.referral.column.amount': 'Bedrag',
  'settings.ui.referral.emptyTitle': 'Nog geen toegeschreven aanmeldingen',
  'settings.ui.referral.emptyBody':
    'Aanmeldingen verschijnen hier zodra iemand via uw link een proefperiode start. Bedragen blijven in behandeling totdat de teruggaveperiode sluit.',
  'settings.ui.referral.emptyExample':
    'Voorbeeldrij: acme.example, proef gestart op 12 juni, in behandeling tot 12 juli, daarna goedgekeurd.',
  'settings.ui.referral.termsLink': 'Lees de partnervoorwaarden',
  'settings.ui.referral.balance': 'Goedgekeurde commissie',
  'settings.ui.referral.balanceUnavailableReason':
    'Het provisieboek is voor deze periode nog niet afgestemd.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'Een serviceaccount is een benoemde identiteit voor een agent, een script of een workflow. Het heeft zijn eigen reikwijdte, zijn eigen grenzen en zijn eigen audittrail.',
  'developer.ui.agents.emptyTitle': 'Nog geen serviceaccounts',
  'developer.ui.agents.emptyBody':
    'Maak er één voor elke automatisering die u uitvoert. Afzonderlijke accounts betekenen dat u er één kunt intrekken zonder de andere te stoppen.',
  'developer.ui.agents.emptyExample':
    'Voorbeeld: "Content agent", project Acme EU, mag maximaal 6 berichten per dag opstellen en plannen tussen 07:00 en 22:00 uur, en publiceert nooit onmiddellijk.',
  'developer.ui.agents.step.identity': 'Naam en doel',
  'developer.ui.agents.step.scope': 'Wat het kan bereiken',
  'developer.ui.agents.step.limits': 'Grenzen',
  'developer.ui.agents.purpose': 'Waar deze rekening voor is',
  'developer.ui.agents.purposeHelp':
    'Eén zin. Het verschijnt naast elke actie die dit account onderneemt in het auditlogboek.',
  'developer.ui.agents.scopeHelp':
    'Een scope kent zichzelf precies toe. Niets impliceert hier iets anders.',
  'developer.ui.agents.limitsHelp':
    'Limieten worden afgedwongen door de API, niet door de agent. Een agent kan zijn eigen limiet niet verhogen.',
  'developer.ui.agents.quietHours': 'Rustige uren',
  'developer.ui.agents.quietHoursHelp':
    'Het account kan niet plannen of publiceren binnen deze uren, in de tijdzone van de werkruimte.',
  'developer.ui.agents.lookAheadHelp': 'Hoe ver in de toekomst het een bericht kan plaatsen.',
  'developer.ui.agents.cadenceHelp':
    'De meeste externe publicaties die het op één dag kan veroorzaken.',
  'developer.ui.agents.expiry': 'Verlopen van legitimatie',
  'developer.ui.agents.expiryHelp': 'Een korter leven is veiliger. Je kunt op elk moment roteren.',
  'developer.ui.agents.summaryTitle': 'Voordat u het maakt',
  'developer.ui.agents.summaryAccounts': 'Accounts die het kan bereiken',
  'developer.ui.agents.summaryMaxActions':
    'Maximaal {count, plural, one {# externe publicatie} other {# externe publicaties}} per dag.',
  'developer.ui.agents.summaryApproval': 'Goedkeuringsgedrag',
  'developer.ui.agents.summaryCreate': 'Serviceaccount aanmaken',
  'developer.ui.agents.detailTitle': 'Servicerekening',
  'developer.ui.agents.statusActive': 'Actief',
  'developer.ui.agents.statusStopped': 'Gestopt',
  'developer.ui.agents.statusExpired': 'Referentie verlopen',
  'developer.ui.agents.stoppedBody':
    'Dit account is gestopt. Elk telefoontje dat wordt gepleegd, wordt met een duidelijke reden geweigerd. Niets dat het creëerde, werd verwijderd.',
  'developer.ui.agents.killTitle': 'Stop {name}',
  'developer.ui.agents.killConsequence.calls':
    'Elke API-, MCP- en CLI-aanroep vanuit dit account wordt in één keer geweigerd.',
  'developer.ui.agents.killConsequence.scheduled':
    'Plaatst het al gepland, blijft gepland. Annuleer ze uit de kalender als je wilt dat ze worden stopgezet.',
  'developer.ui.agents.killConsequence.reversible': 'Je kunt er later opnieuw mee beginnen.',
  'developer.ui.agents.resume': 'Start deze agent opnieuw',
  'developer.ui.agents.rotate': 'Referentie roteren',
  'developer.ui.agents.rotateTitle': 'Roteer de referentie voor {name}',
  'developer.ui.agents.rotateConsequence.old':
    'De huidige referentie werkt onmiddellijk niet meer.',
  'developer.ui.agents.rotateConsequence.new': 'De nieuwe wordt één keer getoond, op deze pagina.',
  'developer.ui.agents.rotateConsequence.clients':
    'Alles wat de oude waarde gebruikt, mislukt totdat u deze bijwerkt.',
  'developer.ui.agents.credentialStored': 'Ik heb deze identificatie opgeslagen',
  'developer.ui.agents.credentialLabel': 'Serviceaccountreferentie',
  'developer.ui.agents.credentialWarning':
    'Dit is de enige keer dat deze identificatie wordt getoond',
  'developer.ui.agents.credentialWarningBody':
    'Kopieer het nu naar je geheime winkel. We houden alleen een hasj bij, dus deze kunnen we niet nogmaals laten zien. Door te roteren ontstaat er een nieuwe.',
  'developer.ui.agents.credentialConsumed':
    'De identificatie wordt niet langer weergegeven. Draai het als je het niet hebt opgeslagen.',
  'developer.ui.agents.credentialReveal': 'Toon legitimatie',
  'developer.ui.agents.credentialHide': 'Referentie verbergen',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read': 'Bekijk uw verbonden accounts en wat ze allemaal kunnen doen',
  'developer.ui.scope.accounts_write': 'Hernoem accounts en wijzig hoe ze zijn gegroepeerd',
  'developer.ui.scope.drafts_read': 'Lees uw concepten en hun varianten',
  'developer.ui.scope.drafts_write': 'Concepten maken en bewerken',
  'developer.ui.scope.posts_schedule': 'Plan goedgekeurde inhoud in uw accounts',
  'developer.ui.scope.posts_publish': 'Publiceer onmiddellijk naar uw accounts',
  'developer.ui.scope.posts_cancel': 'Annuleer geplande berichten',
  'developer.ui.scope.analytics_read': 'Lees analyses voor uw accounts',
  'developer.ui.scope.media_read': 'Bekijk de bestanden in uw bibliotheek',
  'developer.ui.scope.media_write': 'Upload en bewerk bestanden in uw bibliotheek',
  'developer.ui.scope.rules_read': 'Lees uw automatiseringsregels',
  'developer.ui.scope.rules_write': 'Maak en wijzig automatiseringsregels die kunnen publiceren',
  'developer.ui.scope.growth_read': 'Lees je groeiplannen',
  'developer.ui.scope.growth_write': 'Groeiplannen maken en bewerken',
  'developer.ui.scope.webhooks_manage': 'Maak en wijzig webhookeindpunten',
  'developer.ui.scope.billing_read': 'Lees uw abonnement, proefstatus en gebruik',
  'developer.ui.scope.connections_admin': 'Verbind en ontkoppel sociale accounts',

  'developer.ui.activity.caption': 'Recente tool-oproepen, met de oproepen die werden geweigerd',
  'developer.ui.activity.column.time': 'Tijd',
  'developer.ui.activity.column.tool': 'Gereedschap of route',
  'developer.ui.activity.column.outcome': 'Resultaat',
  'developer.ui.activity.column.subject': 'Onderwerp',
  'developer.ui.activity.outcome.ok': 'Toegestaan',
  'developer.ui.activity.outcome.denied': 'Geweigerd',
  'developer.ui.activity.outcome.failed': 'Mislukt',
  'developer.ui.activity.filterDenied': 'Alleen geweigerde pogingen weergeven',
  'developer.ui.activity.deniedExplain':
    'Een geweigerde poging is de manier waarop een verkeerd geconfigureerde agent zichzelf laat zien. Deze rijen worden bewaard en niet verborgen.',
  'developer.ui.activity.emptyTitle': 'Er zijn nog geen gesprekken opgenomen',
  'developer.ui.activity.emptyBody':
    'Oproepen verschijnen hier binnen een paar seconden nadat ze zijn gedaan, inclusief de oproepen die zijn geweigerd.',
  'developer.ui.activity.emptyExample':
    'Voorbeeldrij: 12:03, draft_post, Toegestaan, draft voor X-account @acme.',

  'developer.ui.setup.help':
    'Plak dit in de client waarmee u verbinding maakt. Vervang de tijdelijke aanduiding voor de referentie door de waarde die u hebt opgeslagen.',
  'developer.ui.setup.credentialPlaceholder':
    'Het fragment gebruikt een tijdelijke aanduiding. Leg nooit de echte inloggegevens vast in een repository.',
  'developer.ui.setup.copySnippet': 'Kopieer het fragment voor {client}',
  'developer.ui.setup.snippetCopied': 'Fragment gekopieerd',
  'developer.ui.setup.tabLabel': 'Fragmenten van clientinstallaties',

  'developer.ui.playground.help':
    'Aanroepen worden uitgevoerd tegen een geplaatste kopie van deze werkruimte. Er wordt geen aanbieder gecontacteerd en er staat niets gepland.',
  'developer.ui.playground.tool': 'Gereedschap',
  'developer.ui.playground.arguments': 'Argumenten',
  'developer.ui.playground.argumentsHelp': 'JSON. Dezelfde body die de echte API accepteert.',
  'developer.ui.playground.result': 'Resultaat',
  'developer.ui.playground.resultEmpty':
    'Voer een tool uit om te zien welk antwoord het zou retourneren.',
  'developer.ui.playground.invalidJson':
    'Dit is nog geen geldige JSON en kan dus niet worden verzonden.',
  'developer.ui.playground.deniedByApproval':
    'Goedkeuringsniveau {level} staat deze aanroep niet toe. De proefsessie weigert het precies zoals de API zou doen.',
  'developer.ui.playground.announceResult': 'Droogloop voltooid. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'Registreer een applicatie zodat andere mensen deze toegang kunnen verlenen tot hun werkruimte. Elke app heeft zijn eigen identiteit, zijn eigen toelatingslijst voor omleidingen en zijn eigen audittrail.',
  'developer.ui.apps.emptyTitle': 'Geen apps geregistreerd',
  'developer.ui.apps.emptyBody':
    'Registreer een app wanneer een ander product namens een Post Array-gebruiker moet handelen. Gebruik voor uw eigen automatisering in plaats daarvan een serviceaccount.',
  'developer.ui.apps.emptyExample':
    'Voorbeeld: "Acme Publisher", vertrouwelijke client, redirect https://acme.example/oauth/callback, scopes accounts:read en drafts:write.',
  'developer.ui.apps.typeHelp':
    'Een vertrouwelijke client draait op een server die u beheert en die geheim kan worden gehouden. Een openbare client is een browser of een desktop-app en gebruikt PKCE zonder geheim.',
  'developer.ui.apps.redirectAdd': 'Voeg een omleidings-URI toe',
  'developer.ui.apps.redirectRemove': '{uri} verwijderen',
  'developer.ui.apps.redirectInvalid':
    'Voer een volledige https-URI in, zonder jokerteken en zonder querytekenreeks. Het moet exact overeenkomen met de waarde die uw app verzendt.',
  'developer.ui.apps.linksTitle': 'Gepubliceerde links',
  'developer.ui.apps.linksHelp':
    'Deze verschijnen op het toestemmingsscherm. Een gebruiker die hen niet kan bereiken, verleent geen toegang.',
  'developer.ui.apps.linkUnreachable':
    'We konden deze URL niet bereiken toen we de laatste keer controleerden, {date}.',
  'developer.ui.apps.linkReachable': 'Bereikbaar, gecontroleerd {date}',
  'developer.ui.apps.scopesTitle': 'Machtigingen waar deze app mogelijk om vraagt',
  'developer.ui.apps.scopesHelp':
    'Vraag om het minste wat je nodig hebt. Een gebruiker ziet leesrechten en vervolgrechten als twee afzonderlijke groepen.',
  'developer.ui.apps.scopeGroup.read': 'Leesrechten',
  'developer.ui.apps.scopeGroup.reversible': 'Wijzigingen die u ongedaan kunt maken',
  'developer.ui.apps.scopeGroup.consequential': 'Vervolgrechten',
  'developer.ui.apps.scopeGroupHelp.read':
    'Hiermee kan de app gegevens bekijken. Er verandert niets.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Hiermee kan de app dingen binnen Post Array maken of bewerken. Niets bereikt een platform.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Deze kunnen een bericht op een echt account veroorzaken of wijzigen wie uw accounts kan bereiken. Ze worden altijd apart vermeld en nooit gebundeld.',
  'developer.ui.apps.noBundling':
    'Er is geen gecombineerd toegangsbereik. Facturatie en aansluitingsbeheer worden altijd op naam gevraagd.',
  'developer.ui.apps.secretTitle': 'Klantgeheim',
  'developer.ui.apps.secretWarning': 'Dit is de enige keer dat het clientgeheim wordt getoond',
  'developer.ui.apps.secretWarningBody':
    'Bewaar het nu in uw geheime manager aan de serverzijde. Wij houden alleen een hasj over. Als je het kwijtraakt, draai het dan: je kunt het niet meer onthullen.',
  'developer.ui.apps.secretConsumed':
    'Het geheim wordt niet langer weergegeven. Draai het als je het niet hebt opgeslagen.',
  'developer.ui.apps.secretStored': 'Ik heb dit geheim opgeslagen',
  'developer.ui.apps.secretPublicClient':
    'Een publieke opdrachtgever heeft geen geheim. Het maakt gebruik van de autorisatiecodestroom met PKCE.',
  'developer.ui.apps.rotateTitle': 'Roteer het clientgeheim voor {app}',
  'developer.ui.apps.rotateConsequence.old': 'Het huidige geheim werkt onmiddellijk niet meer.',
  'developer.ui.apps.rotateConsequence.grants':
    'Bestaande gebruikersrechten worden niet ingetrokken.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Uw servers kunnen de tokens niet vernieuwen totdat u de nieuwe waarde implementeert.',
  'developer.ui.apps.consentPreviewTitle': 'Voorbeeld van toestemmingsscherm',
  'developer.ui.apps.consentPreviewHelp':
    'Dit is wat een gebruiker ziet. Het wordt gegenereerd op basis van het app-record en kan dus niet meer beloven dan waar de app om vraagt.',
  'developer.ui.apps.consentPreviewSample':
    'Alleen voorbeeld. Er wordt niets toegekend en er wordt geen token uitgegeven.',
  'developer.ui.apps.grantsCaption': "Workspace's die deze app toegang hebben verleend",
  'developer.ui.apps.grantColumn.workspace': 'Workspace',
  'developer.ui.apps.grantColumn.scopes': 'Bereik',
  'developer.ui.apps.grantColumn.granted': 'Toegegeven',
  'developer.ui.apps.grantColumn.lastUsed': 'Laatst gebruikt',
  'developer.ui.apps.grantsEmpty': 'Niemand heeft deze app nog toegang verleend.',
  'developer.ui.apps.logsCaption':
    'Recente verzoeken, waarbij geheimen en payloads zijn verwijderd',
  'developer.ui.apps.logColumn.time': 'Tijd',
  'developer.ui.apps.logColumn.route': 'Route',
  'developer.ui.apps.logColumn.status': 'Status',
  'developer.ui.apps.logColumn.workspace': 'Workspace',
  'developer.ui.apps.logsRedacted':
    'Verzoek- en antwoordteksten worden opgeslagen zonder inloggegevens, tokens en gebruikersinhoud.',
  'developer.ui.apps.sandboxTitle': 'Sandbox-referenties',
  'developer.ui.apps.sandboxBody':
    'Een aparte client-ID en werkruimte met geplaatste gegevens. Bellen ermee bereikt nooit een provider.',
  'developer.ui.apps.rateLimitLabel': 'Tarieflimiet',
  'developer.ui.apps.rateLimitUsage': '{used} van {limit} vraagt dit uur aan',
  'developer.ui.apps.disable': 'Schakel app uit',
  'developer.ui.apps.enable': 'App inschakelen',
  'developer.ui.apps.disabledBody':
    'Deze app is uitgeschakeld. Bestaande tokens worden geweigerd en er kan geen nieuwe toekenning worden gestart. Subsidies worden bewaard, zodat u deze weer kunt inschakelen.',
  'developer.ui.apps.deleteTitle': '{app} verwijderen',
  'developer.ui.apps.deleteConsequence.grants':
    'Elke subsidie wordt ingetrokken en elk token werkt niet meer.',
  'developer.ui.apps.deleteConsequence.logs':
    'Verzoeklogboeken worden bewaard gedurende de bewaartermijn van de audit.',
  'developer.ui.apps.deleteConsequence.irreversible':
    'De client-ID kan niet opnieuw worden gebruikt.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Ondertekende HTTPS-leveringen voor de evenementen die u kiest. Elke levering wordt gelogd met zijn reactie en elke levering kan opnieuw worden verzonden.',
  'developer.ui.webhooks.emptyTitle': 'Nog geen eindpunten',
  'developer.ui.webhooks.emptyBody':
    'Voeg een eindpunt toe om publicatieresultaten, goedkeuringsbeslissingen en verbindingsstatus in uw eigen systemen te ontvangen.',
  'developer.ui.webhooks.emptyExample':
    'Voorbeeld: https://hooks.acme.example/relay, geabonneerd op post.published, post.failed en connection.action_required.',
  'developer.ui.webhooks.create': 'Voeg een eindpunt toe',
  'developer.ui.webhooks.url': 'Eindpunt-URL',
  'developer.ui.webhooks.urlHelp':
    'Alleen HTTPS. We volgen geen omleidingen en we proberen geen 2xx opnieuw.',
  'developer.ui.webhooks.eventsTitle': 'Evenementen',
  'developer.ui.webhooks.eventsHelp':
    'Kies de evenementen die u afhandelt. Door alles naar een eindpunt te sturen dat het meeste ervan negeert, zijn fouten moeilijker te zien.',
  'developer.ui.webhooks.eventsAll': 'Elke gebeurtenis',
  'developer.ui.webhooks.eventsSelected': 'Alleen de evenementen die ik selecteer',
  'developer.ui.webhooks.eventsCount': '{count, plural, one {# evenement} other {# evenementen}}',
  'developer.ui.webhooks.eventGroup.connections': 'Verbindingen',
  'developer.ui.webhooks.eventGroup.content': 'Inhoud en goedkeuring',
  'developer.ui.webhooks.eventGroup.publishing': 'Publiceren',
  'developer.ui.webhooks.eventGroup.automation': 'Automatisering en feeds',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'Projecten en accounts',
  'developer.ui.webhooks.scopeAll': 'Elk project en account',
  'developer.ui.webhooks.scopeSelected': 'Alleen degene die ik selecteer',
  'developer.ui.webhooks.secretTitle': 'Ondertekening geheim',
  'developer.ui.webhooks.secretBody':
    'Controleer de handtekeningkop voordat u een hoofdtekst parseert. Ontdubbel de leverings-ID, die stabiel blijft bij nieuwe pogingen.',
  'developer.ui.webhooks.secretRotateTitle': 'Draai het ondertekeningsgeheim',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Beide geheimen worden 24 uur lang geaccepteerd, zodat u ze kunt inzetten zonder een levering te laten vallen.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Na dat venster wordt alleen het nieuwe geheim gebruikt.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Verzendt één ondertekende voorbeeldgebeurtenis gemarkeerd als test, zodat uw ontvanger deze veilig kan negeren.',
  'developer.ui.webhooks.testDeliverySent':
    'Proeflevering verzonden. Het resultaat verschijnt in het onderstaande logboek.',
  'developer.ui.webhooks.deliveriesCaption':
    'Recente leveringen en de reactie die iedereen ontving',
  'developer.ui.webhooks.deliveryColumn.time': 'Gevraagd',
  'developer.ui.webhooks.deliveryColumn.event': 'Evenement',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Poging',
  'developer.ui.webhooks.deliveryColumn.response': 'Reactie',
  'developer.ui.webhooks.deliveryColumn.status': 'Status',
  'developer.ui.webhooks.deliveryStatus.pending': 'Wachten',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Geleverd',
  'developer.ui.webhooks.deliveryStatus.failed': 'Mislukt, zal het opnieuw proberen',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Mislukt, geen nieuwe pogingen meer',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Niet verzonden, eindpunt uitgeschakeld',
  'developer.ui.webhooks.deliveryNoResponse': 'Geen reactie ontvangen',
  'developer.ui.webhooks.deliveryNextAttempt': 'Volgende poging {relativeTime}',
  'developer.ui.webhooks.inspect': 'Levering controleren',
  'developer.ui.webhooks.inspectTitle': 'Levering {id}',
  'developer.ui.webhooks.inspectRequest': 'Lichaam aanvragen',
  'developer.ui.webhooks.inspectResponse': 'Reactie lichaam',
  'developer.ui.webhooks.redeliver': 'Verstuur deze levering opnieuw',
  'developer.ui.webhooks.redeliverHelp':
    'Dezelfde gebeurtenis-ID wordt opnieuw verzonden terwijl de herleveringsvlag is ingesteld, zodat een idempotente ontvanger deze veilig negeert.',
  'developer.ui.webhooks.redelivered': 'In de wachtrij voor herlevering.',
  'developer.ui.webhooks.failureTitle': 'Dit eindpunt faalt',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# levering op rij mislukt} other {# levering op rij mislukt}}. Na opeenvolgende mislukkingen van {limit} wordt het eindpunt uitgeschakeld en wordt een actie-item opgeslagen.',
  'developer.ui.webhooks.disabledTitle': 'Dit eindpunt is uitgeschakeld na herhaalde fouten',
  'developer.ui.webhooks.disabledBody':
    'We zijn gestopt met het verzenden ervan, zodat uw wachtrij niet vol raakt. Repareer de ontvanger, stuur een testbezorging en schakel deze vervolgens opnieuw in.',
  'developer.ui.webhooks.lastSuccessLabel': 'Laatste succes',
  'developer.ui.webhooks.lastSuccessNever': 'Geen enkele levering is ooit gelukt',
  'developer.ui.webhooks.deleteTitle': 'Verwijder dit eindpunt',
  'developer.ui.webhooks.deleteConsequence.stop': 'Er wordt niets meer naar deze URL verzonden.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'Leveringslogboeken worden bewaard gedurende de bewaartermijn van de audit.',

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'One plan, two intervals. Polar is the merchant of record: it holds the payment method, issues invoices and handles cancellation.',
  'billing.ui.statusHeading': 'Current status',
  'billing.ui.planHeading': 'Plan',
  'billing.ui.intervalHeading': 'Billing interval',
  'billing.ui.usageHeading': 'Metered provider usage',
  'billing.ui.invoicesHeading': 'Invoices',
  'billing.ui.cancelHeading': 'Cancellation',
  'billing.ui.trialDaysRemaining':
    'Trial, {count, plural, =0 {ends today} one {# day remaining} other {# days remaining}}',
  'billing.ui.convertsOn': 'Converts on {date} to {amount} per {interval}.',
  'billing.ui.dueToday': '$0 due today',
  'billing.ui.conversionLabel': 'Converts',
  'billing.ui.channelsLabel': 'Active channels',
  'billing.ui.paymentMethodPolar': 'Payment method held by Polar',
  'billing.ui.paymentMethodDescriptor': '{project} ending {last4}, expires {expiry}',
  'billing.ui.paymentMethodMissing': 'No payment method on file yet',
  'billing.ui.cancelBeforeDate': 'Cancel before {date} and you will not be charged.',
  'billing.ui.annualFraming': '$25/month billed annually. Save $48/year.',
  'billing.ui.monthlyOption': '$29 per month',
  'billing.ui.annualOption': '$300 per year',
  'billing.ui.intervalChangeHelp':
    'Changing the interval takes effect at the next renewal. Polar prorates it and shows the exact amount before you confirm.',
  'billing.ui.intervalChangedAnnouncement': 'Billing interval set to {interval}.',
  'billing.ui.allowanceChannels':
    '30 active social channels. A channel is one connected account, page or channel.',
  'billing.ui.allowanceChannelsUsage': '{used} of {limit} active channels',
  'billing.ui.allowanceFairUse':
    'Fair use means anti spam, rate and provider cost controls. They apply the same way to every subscriber and are published, not discretionary.',
  'billing.ui.allowanceMetered':
    'X and some other providers charge per operation. Those charges are passed through at cost and are not part of the plan price.',
  'billing.ui.allowanceNoMedia':
    'Image generation and video generation are not included and are not sold. Post Array does not generate media.',
  'billing.ui.readFairUse': 'Read the fair use policy',
  'billing.ui.readMeteredPolicy': 'Read how metered usage is billed',
  'billing.ui.usageCaption': 'Metered provider usage this period, billed at cost',
  'billing.ui.usageColumn.item': 'Item',
  'billing.ui.usageColumn.quantity': 'Quantity',
  'billing.ui.usageColumn.unitPrice': 'Unit price',
  'billing.ui.usageColumn.amount': 'Amount',
  'billing.ui.usageTotal': 'Total this period',
  'billing.ui.usagePeriod': 'Period {start} to {end}',
  'billing.ui.usageSource': 'Prices published by the provider. Verified {date}.',
  'billing.ui.usageReconciled': 'Reconciled against the provider invoice on {date}.',
  'billing.ui.usagePending': 'Not reconciled yet. The final amount can move slightly.',
  'billing.ui.usageUnavailableReason':
    'The provider has not returned usage for this period yet. It is normally available within 24 hours.',
  'billing.ui.usageEmpty': 'No metered usage this period.',
  'billing.ui.spendAlert': 'Spend alert',
  'billing.ui.spendAlertHelp':
    'We email you when metered usage passes this amount in a billing period.',
  'billing.ui.spendAlertPause': 'Also pause metered actions when the alert is reached',
  'billing.ui.balanceLabel': 'Usage balance',
  'billing.ui.balanceHelp': 'Metered usage is drawn from this balance and invoiced by Polar.',
  'billing.ui.invoicesCaption': 'Invoices issued by Polar',
  'billing.ui.invoiceColumn.date': 'Date',
  'billing.ui.invoiceColumn.description': 'Description',
  'billing.ui.invoiceColumn.amount': 'Amount',
  'billing.ui.invoiceColumn.state': 'State',
  'billing.ui.invoiceState.paid': 'Paid',
  'billing.ui.invoiceState.open': 'Open',
  'billing.ui.invoiceState.uncollectible': 'Not collected',
  'billing.ui.invoiceState.refunded': 'Refunded',
  'billing.ui.invoicesEmpty': 'No invoice yet. The first one is issued when the trial converts.',
  'billing.ui.invoicesInPortal': 'Every invoice and receipt is available in the Polar portal.',
  'billing.ui.portalHelp':
    'The portal is where you change the payment method, download invoices and cancel. It opens in a new tab.',
  'billing.ui.pastDueHeading': 'Payment overdue',
  'billing.ui.pastDueBody':
    'The last payment did not go through. Update the payment method in the Polar portal to keep publishing.',
  'billing.ui.gracePolicy':
    'Scheduled posts keep running until {date}. After that the workspace becomes read only: nothing is deleted and nothing is published.',
  'billing.ui.cancelBody':
    'Cancelling is one action and takes effect at the end of the period you have paid for. There is no call to make and no form to fill in.',
  'billing.ui.cancelStart': 'Cancel subscription',
  'billing.ui.cancelDialogTitle': 'Cancel this subscription',
  'billing.ui.cancelConsequence.noCharge':
    'You will not be charged. Nothing is taken today or on {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'You keep every feature until {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Drafts, receipts, media and analytics stay in this workspace.',
  'billing.ui.cancelConsequence.scheduled':
    'Posts scheduled after {date} will not publish. Cancel or reschedule them before then.',
  'billing.ui.cancelConsequence.restart': 'You can start the subscription again at any time.',
  'billing.ui.cancelConfirm': 'Cancel subscription',
  'billing.ui.cancelKeep': 'Keep subscription',
  'billing.ui.cancelConfirmedBeforeConversion': 'Canceled. You will not be charged.',
  'billing.ui.cancelConfirmedAfterConversion': 'Canceled. Access continues until {date}.',
  'billing.ui.cancelAnnouncement': 'Subscription canceled.',
  'billing.ui.canceledNotice': 'This subscription is canceled.',
  'billing.ui.resume': 'Start the subscription again',
  'billing.ui.noSubscriptionTitle': 'No subscription on this workspace',
  'billing.ui.noSubscriptionExample':
    'Monthly is $29. Annual is $300, which is $25/month billed annually. Save $48/year.',
  'billing.ui.overChannelLimitAction': 'Review connected channels',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'Beantwoord een korte intake, bevestig wat we begrepen hebben en ontvang een plan dat u item voor item kunt accepteren. Het stelt werk voor. Het plant of publiceert nooit iets op eigen kracht.',
  'growth.ui.step.intake': 'Inname',
  'growth.ui.step.confirm': 'Bevestig',
  'growth.ui.step.plan': 'Plannen',
  'growth.ui.stepIndicator': 'Stap {current} van {total}: {name}',
  'growth.ui.intake.section.product': 'Product',
  'growth.ui.intake.section.audience': 'Publiek en markten',
  'growth.ui.intake.section.objective': 'Doelstelling',
  'growth.ui.intake.section.capacity': 'Kanalen en capaciteit',
  'growth.ui.intake.section.limits': 'Wat is verboden terrein',
  'growth.ui.intake.help':
    'Hier wordt niets voor u geraden. Alles wat u leeg laat, wordt gemarkeerd als ontbrekend en niet als ingevuld.',
  'growth.ui.intake.productNameHelp': 'De naam die u gebruikt bij klanten.',
  'growth.ui.intake.siteUrlHelp':
    'We lezen de pagina die u ons geeft als bronmateriaal. Je bevestigt elk feit dat we eruit halen.',
  'growth.ui.intake.descriptionHelp': 'Wat je verkoopt en voor wie het is, in je eigen woorden.',
  'growth.ui.intake.marketsHelp': "Landen of regio's. Eén per regel.",
  'growth.ui.intake.localesHelp': 'De talen waarin u gaat publiceren.',
  'growth.ui.intake.objectiveHelp': 'Waar je meer van wilt in het volgende kwartaal.',
  'growth.ui.intake.conversionHelp':
    'De actie die je daadwerkelijk kunt meten. Een aanmelding, een demo, een aankoop.',
  'growth.ui.intake.proofHelp':
    'Casestudies, benchmarks die u heeft uitgevoerd, screenshots waarvan u de eigenaar bent, rechten die u al heeft. Eén per regel.',
  'growth.ui.intake.proofNone': 'Ik heb nog geen goedgekeurd bewijs',
  'growth.ui.intake.proofNoneEffect':
    'Het plan zal klantresultaten en resultaatclaims volledig vermijden.',
  'growth.ui.intake.channelsHelp': 'De accounts van waaruit u al publiceert.',
  'growth.ui.intake.capacityHelp':
    'Wees eerlijk. Een plan dat u niet kunt uitvoeren, is geen plan.',
  'growth.ui.intake.competitorsHelp': 'Optioneel. Eén per regel.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Claims die u niet mag indienen om juridische of beleidsredenen. Eén per regel.',
  'growth.ui.intake.prohibitedTopicsHelp': 'Onderwerpen waar je vanaf moet blijven. Eén per regel.',
  'growth.ui.intake.submit': 'Bekijk wat we hebben begrepen',
  'growth.ui.intake.savedAnnouncement': 'Bedrijfsprofiel opgeslagen.',
  'growth.ui.intake.requiredMissing':
    'Vul de velden in die als verplicht zijn gemarkeerd voordat u verdergaat.',

  'growth.ui.confirm.factsTitle': 'Feiten die u bevestigde',
  'growth.ui.confirm.factsHelp': 'Deze kunnen in kopie worden gebruikt.',
  'growth.ui.confirm.assumptionsTitle': 'Aannames die we hebben gedaan',
  'growth.ui.confirm.assumptionsHelp':
    'Dit zijn geen feiten. Zij geven vorm aan het plan, maar worden nooit een claim in een post.',
  'growth.ui.confirm.missingTitle': 'Ontbreekt',
  'growth.ui.confirm.missingHelp':
    'Het plan omzeilt elk van deze aspecten en zegt dat waar het er toe doet.',
  'growth.ui.confirm.confidence.label': 'Vertrouwen: {level}',
  'growth.ui.confirm.confidence.low': 'laag',
  'growth.ui.confirm.confidence.medium': 'middelmatig',
  'growth.ui.confirm.confidence.high': 'hoog',
  'growth.ui.confirm.promote': 'Bevestig als een feit',
  'growth.ui.confirm.correct': 'Corrigeer dit',
  'growth.ui.confirm.correctLabel': 'Jouw correctie',
  'growth.ui.confirm.generate': 'Genereer het plan',
  'growth.ui.confirm.announcement': 'Bedrijfsprofiel bevestigd.',

  'growth.ui.plan.generatingBody':
    'Dit duurt een paar seconden. U kunt deze pagina verlaten: het plan eindigt vanzelf.',
  'growth.ui.plan.stateDraft': 'Concept, niet goedgekeurd',
  'growth.ui.plan.stateApproved': 'Goedgekeurd',
  'growth.ui.plan.stateSuperseded': 'Vervangen door een nieuwere versie',
  'growth.ui.plan.newVersionNotice':
    'Bij een vernieuwing wordt versie {version} aangemaakt en wordt de goedgekeurde versie ongewijzigd gelaten.',
  'growth.ui.plan.emptyTitle': 'Nog geen plan',
  'growth.ui.plan.emptyBody':
    'Vul het bedrijfsprofiel in en wij bouwen een plan op basis van de feiten die u bevestigt.',
  'growth.ui.plan.emptyExample':
    'Een plan bevat een strategie, vier weken aan instructies, één UGC-campagne, door catalogi ondersteunde kansen en maximaal vijf tools.',
  'growth.ui.plan.tabsLabel': 'Plan secties',
  'growth.ui.plan.modelNote': 'Gegenereerd door {model}, prompt {promptVersion}, op {date}.',

  'growth.ui.strategy.snapshotTitle': 'Zakelijke momentopname',
  'growth.ui.strategy.channelPriority': 'Prioriteit {rank}',
  'growth.ui.strategy.channelFormats': 'Native formaten',
  'growth.ui.strategy.pillarProof': 'Een bewijs dat deze pijler op steunt',
  'growth.ui.strategy.pillarProofNone': 'Geen goedgekeurd bewijs. Houd deze pijler beschrijvend.',
  'growth.ui.strategy.cadenceCaption': 'Berichten per week per kanaal',
  'growth.ui.strategy.cadenceColumn.channel': 'Kanaal',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Berichten per week',
  'growth.ui.strategy.cadenceTotal': 'Totaal per week',
  'growth.ui.strategy.capacityWarning':
    'Deze cadans is {planned} berichten per week tegen een aangegeven capaciteit van {capacity} uur. Verlaag deze of verhoog de capaciteit in het profiel.',
  'growth.ui.strategy.measurementBody':
    'Vergeleken met je eigen volgende berichten op hetzelfde kanaal en hetzelfde format. Er wordt geen externe benchmark gebruikt, omdat deze niet vergelijkbaar is met uw account.',
  'growth.ui.strategy.localeAdaptations': 'Taal opmerkingen',

  'growth.ui.fourWeek.caption': 'Voorgestelde overzichten per week en dag',
  'growth.ui.fourWeek.column.date': 'Datum',
  'growth.ui.fourWeek.column.channel': 'Kanaal',
  'growth.ui.fourWeek.column.pillar': 'Pijler',
  'growth.ui.fourWeek.column.format': 'Formaat',
  'growth.ui.fourWeek.column.brief': 'Kort',
  'growth.ui.fourWeek.column.cta': 'Oproep tot actie',
  'growth.ui.fourWeek.column.measurement': 'Metingslabel',
  'growth.ui.fourWeek.column.actions': 'Acties',
  'growth.ui.fourWeek.approvalRequired': 'Goedkeuring vereist voordat het kan worden gepubliceerd',
  'growth.ui.fourWeek.approvalNotRequired': 'Er is geen goedkeuring vereist voor dit account',
  'growth.ui.fourWeek.noCta': 'Geen oproep tot actie',
  'growth.ui.fourWeek.weekEmpty': 'Er zijn geen slips voorgesteld voor deze week.',
  'growth.ui.fourWeek.acceptedCount': '{accepted} of {total}-briefings geaccepteerd als concept',
  'growth.ui.fourWeek.acceptAnnouncement': 'Concept gemaakt op basis van deze opdracht.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Kalendervoorstel toegevoegd voor {date}.',

  'growth.ui.ugc.promptAngle': 'Invalshoek {number}',
  'growth.ui.ugc.checklistTitle': 'Rechten, toestemming en openbaarmaking',
  'growth.ui.ugc.checklistHelp':
    'Doorloop dit met elke deelnemer voordat er iets wordt gepubliceerd. Toestemming om te verschijnen is geen toestemming om te adverteren.',
  'growth.ui.ugc.incentiveNone': 'Geen vergoeding aangeboden',
  'growth.ui.ugc.incentiveDisclosure':
    'Een vergoeding moet worden vermeld bij elke post die eruit voortkomt, door jou en door de deelnemer.',
  'growth.ui.ugc.honesty':
    'Dit plant een campagne die je zelf uitvoert met echte mensen. Post Array zoekt geen creators, neemt geen contact met hen op, schrijft geen testimonials en maakt geen klantcontent.',

  'growth.ui.opportunities.caption':
    'Geverifieerde vacatures uit de catalogus, gerangschikt op basis van uw profiel',
  'growth.ui.opportunities.column.opportunity': 'Gelegenheid',
  'growth.ui.opportunities.column.type': 'Typ',
  'growth.ui.opportunities.column.audience': 'Publiek',
  'growth.ui.opportunities.column.fit': 'Waarom dit past',
  'growth.ui.opportunities.column.requirements': 'Vereisten',
  'growth.ui.opportunities.column.rules': 'Regels voor zelfpromotie',
  'growth.ui.opportunities.column.cost': 'Kosten',
  'growth.ui.opportunities.column.effort': 'Inspanning',
  'growth.ui.opportunities.column.verified': 'Laatst geverifieerd',
  'growth.ui.opportunities.column.actions': 'Acties',
  'growth.ui.opportunities.costFree': 'Gratis',
  'growth.ui.opportunities.effort.low': 'Laag',
  'growth.ui.opportunities.effort.medium': 'Middelmatig',
  'growth.ui.opportunities.effort.high': 'Hoog',
  'growth.ui.opportunities.noRequiredAsset': 'Geen activa vereist',
  'growth.ui.opportunities.prepareTitle': 'Bereid een inzending voor {name} voor',
  'growth.ui.opportunities.prepareRules': 'Hun regels, geciteerd',
  'growth.ui.opportunities.prepareChecklist': 'Wat je klaar moet hebben',
  'growth.ui.opportunities.prepareManual':
    'Deze geef je zelf aan op hun site. Post Array vult geen formulieren in, maakt geen accounts aan en e-mailt niemand.',
  'growth.ui.opportunities.pitchTitle': 'Pitch ontwerp',
  'growth.ui.opportunities.pitchHelp':
    'Bewerk het voordat u het verzendt. Er worden alleen de feiten gebruikt die u hebt bevestigd.',
  'growth.ui.opportunities.submittedOn': '{date} ingediend',
  'growth.ui.opportunities.staleTitle': 'Sommige invoer moet opnieuw worden geverifieerd',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# inzending is voorbij de beoordelingsdatum} other {# inzendingen zijn voorbij de beoordelingsdatum}}. Controleer de actuele regels op de site voordat u erop vertrouwt.',
  'growth.ui.opportunities.emptyExample':
    'Een catalogusrij bevat de officiële URL, het publiek, de inzendingsregels die van de site worden geciteerd, de kosten, de moeite en de datum waarop iemand deze voor het laatst heeft gecontroleerd.',

  'growth.ui.tools.shown': '{shown} of {max} weergegeven',
  'growth.ui.tools.fewerThanMax':
    'Alleen {count, plural, one {# tool komt overeen} other {# tools match}} deze workflow met een huidige beoordeling. We laten er liever minder zien dan dat we de lijst aanvullen.',
  'growth.ui.tools.emptyTitle': 'Er is nog geen beoordeelde tool die bij deze workflow past',
  'growth.ui.tools.emptyBody':
    'Elke inzending heeft een gecontroleerde prijs, gecontroleerde rechtenvoorwaarden en een benoemde beperking nodig voordat deze hier verschijnt.',
  'growth.ui.tools.emptyExample':
    'Een vermelding vermeldt waar het het beste voor is, waarom het bij uw plan past, wat het niet kan, welke vaardigheden het nodig heeft, hoe de output terugkomt in Post Array en wanneer de prijs voor het laatst is gecontroleerd.',
  'growth.ui.tools.openSite': 'Open de officiële site voor {name}',
  'growth.ui.tools.stale': 'De beoordelingsdatum is voorbij. Uitgesloten van gegenereerde plannen.',

  'growth.ui.item.explainTitle': 'Waarom dit werd voorgesteld',
  'growth.ui.item.explainEvidence': 'Waar het op gebaseerd is',
  'growth.ui.item.explainNoEvidence':
    'Dit kwam voort uit de doelstelling en de kanaalregels, en niet uit een bevestigd feit over uw bedrijf.',
  'growth.ui.item.dismissTitle': 'Wijs deze suggestie af',
  'growth.ui.item.dismissBody':
    'Vertel ons waarom. De reden wordt bij het plan opgeslagen en geeft vorm aan de volgende versie.',
  'growth.ui.item.dismissReasonLabel': 'Reden',
  'growth.ui.item.dismissReason.notRelevant': 'Niet relevant voor dit bedrijf',
  'growth.ui.item.dismissReason.noCapacity': 'Wij hebben de capaciteit niet',
  'growth.ui.item.dismissReason.wrongAudience': 'Verkeerd publiek',
  'growth.ui.item.dismissReason.alreadyDone': 'Wij doen dit al',
  'growth.ui.item.dismissReason.policy': 'Tegen ons beleid of onze claims',
  'growth.ui.item.dismissReason.other': 'Iets anders',
  'growth.ui.item.dismissNote': 'Alles wat je wilt toevoegen',
  'growth.ui.item.dismissed': 'Ontslagen. Het blijft zichtbaar, dus je kunt het ongedaan maken.',
  'growth.ui.item.undoDismiss': 'Afwijzen ongedaan maken',

  'growth.ui.export.title': 'Exporteer dit plan',
  'growth.ui.export.formatLabel': 'Formaat',
  'growth.ui.export.copy': 'Kopiëren naar klembord',
  'growth.ui.export.download': 'Bestand downloaden',
  'growth.ui.export.copied': 'Plan gekopieerd naar het klembord.',
  'growth.ui.export.schemaNote':
    'Alle drie de formaten komen uit één gevalideerd schema, versie {version}. De gestructureerde weergaven zijn veilig voor broncontrole en bevatten geen geheimen.',
  'growth.ui.export.previewLabel': 'Voorbeeld exporteren',
} as const;
