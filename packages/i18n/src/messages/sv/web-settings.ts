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

  'settings.ui.subtitle':
    'Allt som konfigurerar denna arbetsyta. Ingenting här publicerar någonting.',
  'settings.ui.nav.label': 'Inställningar',
  'settings.ui.index.help':
    'Välj ett avsnitt. Varje ändring tillskrivs dig och visas i granskningsloggen.',

  'settings.ui.section.members': 'Medlemmar och roller',
  'settings.ui.section.membersSummary':
    'Vem finns i denna arbetsyta och vad varje person kan göra.',
  'settings.ui.section.projects': 'Projekt',
  'settings.ui.section.projectsSummary':
    'Röst, publik, godkända anspråk, blockerade termer, språkregler, domäner och ordlistan.',
  'settings.ui.section.agents': 'Agenter och API',
  'settings.ui.section.agentsSummary':
    'Tjänstekonton, omfattningar, gränser, referenser, aktivitet och torrkörningslekplatsen.',
  'settings.ui.section.apps': 'Utvecklarappar',
  'settings.ui.section.appsSummary':
    'Tredje parts OAuth-applikationer, omdirigeringsgodkännandelistor, samtycke och anslag.',
  'settings.ui.section.webhooks': 'Webhooks',
  'settings.ui.section.webhooksSummary':
    'Signerade utgående händelser, leveransloggar, återleverans och hemlig rotation.',
  'settings.ui.section.billing': 'Billing',
  'settings.ui.section.billingSummary':
    'Plan, trial, interval, metered provider usage, invoices and cancellation.',
  'settings.ui.section.referrals': 'Remiss och affiliate',
  'settings.ui.section.referralsSummary':
    'Din avslöjade hänvisningslänk, tillskrivna registreringar och provisionsstatus.',
  'settings.ui.section.localization': 'Lokalisering',
  'settings.ui.section.localizationSummary':
    'Gränssnittsspråk, innehållsspråk, marknader, tidszon och tidsformat.',
  'settings.ui.section.security': 'Säkerhet',
  'settings.ui.section.securitySummary':
    'Sessioner, tvåfaktorsautentisering, referenser, agenter, webhooks och appbidrag.',
  'settings.ui.section.data': 'Datakontroller',
  'settings.ui.section.dataSummary':
    'Exportera, återkalla en anslutning, ta bort ett projekt, radera innehåll eller stäng kontot.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Laddar {section}',
  'settings.ui.state.errorTitle': 'Vi kunde inte ladda {section}',
  'settings.ui.state.errorRetry': 'Försök igen',
  'settings.ui.state.savingAnnouncement': 'Sparar {section}',
  'settings.ui.state.savedAnnouncement': '{section} sparad',
  'settings.ui.state.saveFailedAnnouncement':
    '{section} sparades inte. Din input finns fortfarande kvar.',
  'settings.ui.state.offlineTitle': 'Du är offline',
  'settings.ui.state.offlineBody':
    'Du kan läsa den här sidan. Ändringar kan inte sparas förrän anslutningen kommer tillbaka.',
  'settings.ui.state.permissionTitle': 'Du har inte tillgång till {section}',
  'settings.ui.state.permissionBody':
    'Det här avsnittet ändrar hur arbetsytan beter sig, så den är begränsad av roll.',
  'settings.ui.state.permissionRequirements': 'Vad du behöver',
  'settings.ui.state.permissionContact':
    'En ägare eller en administratör av denna arbetsyta kan bevilja den. De är listade under Medlemmar och roller.',
  'settings.ui.state.rateLimitTitle': 'För många förändringar på kort tid',
  'settings.ui.state.rateLimitCause':
    'Den här arbetsytan nådde skrivgränsen för ändringar av inställningar.',
  'settings.ui.state.rateLimitReset': 'Återställ gräns',
  'settings.ui.state.rateLimitAlternative':
    'Inget du sparat gick förlorat. Skrivskyddade åtgärder fungerar fortfarande medan du väntar.',
  'settings.ui.state.rateLimitUsage': 'Inställningar skriver denna timme',
  'settings.ui.state.rateLimitUsageText': '{used} av {limit} används',
  'settings.ui.state.unsavedTitle': 'Du har osparade ändringar',
  'settings.ui.state.unsavedBody': 'Spara dem innan du lämnar det här avsnittet.',
  'settings.ui.state.readOnlyTitle': 'Den här arbetsytan är skrivskyddad',
  'settings.ui.state.readOnlyBody':
    'Fakturering har förfallit. Ditt innehåll, dina kvitton och dina anslutningar är intakta. Inställningar kan läsas men inte ändras.',

  'settings.ui.state.referenceLabel': 'Supportreferens',

  'settings.ui.attribution': 'Ändrad med {name} {relativeTime}',
  'settings.ui.attributionNever': 'Inte ändrat sedan det skapades',
  'settings.ui.copyFailed':
    'Din webbläsare blockerade kopian. Markera texten och kopiera den manuellt.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'Varje inbjudan, rollbyte och borttagning registreras med ditt namn och tid.',
  'settings.ui.members.tableCaption': 'Människor i den här arbetsplatsen, med roll och omfattning',
  'settings.ui.members.column.person': 'Person',
  'settings.ui.members.column.role': 'Roll',
  'settings.ui.members.column.scope': 'Omfattning',
  'settings.ui.members.column.approvals': 'Godkännanden',
  'settings.ui.members.column.lastActive': 'Senast aktiv',
  'settings.ui.members.column.actions': 'Åtgärder',
  'settings.ui.members.scopeAll': 'Alla projekt och konton',
  'settings.ui.members.scopeLimited': '{count, plural, one {# projekt} other {# projekt}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Kan godkänna',
  'settings.ui.members.approvals.cannotApprove': 'Kan inte godkänna',
  'settings.ui.members.approvals.canApproveOwnProjects': 'Kan godkänna de angivna projekten',
  'settings.ui.members.lastActiveNever': 'Har inte loggat in ännu',
  'settings.ui.members.changeRole': 'Byt roll för {name}',
  'settings.ui.members.remove': 'Ta bort {name}',
  'settings.ui.members.lastOwnerTitle': 'En arbetsyta behåller minst en ägare',
  'settings.ui.members.lastOwnerBody':
    'Gör någon annan till ägare först, sedan blir denna ändring tillgänglig.',
  'settings.ui.members.inviteTitle': 'Bjud in någon till den här arbetsytan',
  'settings.ui.members.inviteBody':
    'De får ett mejl med en länk. Inbjudan går ut efter sju dagar och du kan återkalla den innan dess.',
  'settings.ui.members.inviteRole': 'Roll',
  'settings.ui.members.inviteScope': 'Projekt de kan arbeta i',
  'settings.ui.members.inviteScopeAll': 'Alla projekt i denna arbetsyta',
  'settings.ui.members.inviteScopeSelected': 'Bara de projekt jag väljer',
  'settings.ui.members.inviteApprovals': 'Kan besluta om godkännandeförfrågningar',
  'settings.ui.members.inviteApprovalsHelp':
    'Endast roller som redan inkluderar granskning kan ges detta. Det är separat från redigering.',
  'settings.ui.members.inviteSubmit': 'Skicka inbjudan',
  'settings.ui.members.invitePending': 'Inbjuden {relativeTime} av {name}',
  'settings.ui.members.inviteRevoke': 'Återkalla inbjudan',
  'settings.ui.members.inviteResend': 'Skicka inbjudan igen',
  'settings.ui.members.emptyTitle': 'Du är den enda personen här',
  'settings.ui.members.emptyBody':
    'Bjud in personerna som skriver, godkänner eller läser resultat. Var och en får en roll och ett projektomfång.',
  'settings.ui.members.emptyExample':
    'En vanlig form: en ägare för fakturering, en godkännare per projekt och redaktörer som skriver ut men aldrig publicerar.',
  'settings.ui.members.roleReferenceTitle': 'Vad varje roll kan göra',
  'settings.ui.members.roleReferenceCaption': 'Roller och de handlingar var och en tillåter',
  'settings.ui.members.roleColumn.role': 'Roll',
  'settings.ui.members.roleColumn.can': 'Kan göra',
  'settings.ui.members.roleColumn.cannot': 'Kan inte göra',
  'settings.ui.members.roleCannot.owner': 'Ingenting undanhålls en ägare.',
  'settings.ui.members.roleCannot.admin': 'Ändra fakturering eller ta bort arbetsytan.',
  'settings.ui.members.roleCannot.manager':
    'Ändra fakturering, roller eller radering av arbetsyta.',
  'settings.ui.members.roleCannot.editor':
    'Godkänn, schemalägg, publicera eller ändra anslutningar.',
  'settings.ui.members.roleCannot.approver': 'Ändra anslutningar, regler eller fakturering.',
  'settings.ui.members.roleCannot.analyst':
    'Skapa, redigera, godkänn eller publicera vad som helst.',
  'settings.ui.members.roleCannot.viewer': 'Ändra någonting alls.',
  'settings.ui.members.removeTitle': 'Ta bort {name} från den här arbetsytan',
  'settings.ui.members.removeConsequence.access': 'De förlorar åtkomst direkt, på alla ytor.',
  'settings.ui.members.removeConsequence.drafts':
    'Utkast de skrev stannar i arbetsytan och förblir redigerbara.',
  'settings.ui.members.removeConsequence.audit':
    'Deras tidigare handlingar finns kvar i granskningsloggen och på kvitton.',
  'settings.ui.members.removeConsequence.approvals':
    'Godkännandeförfrågningar som väntar på dem återgår till kön för en annan godkännare.',

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'Ett projekt bär reglerna som innehåll kontrolleras mot: vad du får hävda, vad du inte får säga och hur varje språk är skrivet.',
  'settings.ui.projects.listCaption': 'Projekt i denna arbetsyta',
  'settings.ui.projects.column.project': 'Projekt',
  'settings.ui.projects.column.locales': 'Innehållsspråk',
  'settings.ui.projects.column.accounts': 'konton',
  'settings.ui.projects.column.updated': 'Uppdaterad',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Inga konton} one {# konto} other {# konton}}',
  'settings.ui.projects.emptyTitle': 'Inga projekt än',
  'settings.ui.projects.emptyBody':
    'Ett projekt grupperar konton, godkännanderegler och språkregler. De flesta team börjar med ett och lägger till ytterligare ett när en kund eller en marknad behöver andra regler.',
  'settings.ui.projects.emptyExample':
    'Exempel: projekt "Acme EU", språk engelska och tyska, blockerad term "garanterad", avslöjande "Betalt partnerskap" på för Instagram.',
  'settings.ui.projects.voiceHelp':
    'Hur det här projektet låter. Används när du ber om en omskrivning och när anspråk kontrolleras.',
  'settings.ui.projects.audienceHelp': 'Vem innehållet är till för, per marknad.',
  'settings.ui.projects.approvedClaimsHelp':
    'Uttalanden som en granskare har tagit bort. Allt utanför den här listan flaggas före godkännande, inte efter publicering.',
  'settings.ui.projects.blockedTermsHelp':
    'Ord som blockerar schemaläggning för detta projekt. En per rad.',
  'settings.ui.projects.domainsHelp':
    'Domäner som detta projekt kan länka till och förkorta genom. Endast verifierade domäner kan väljas i kompositören.',
  'settings.ui.projects.domainVerified': 'Verifierad {date}',
  'settings.ui.projects.domainPending': 'DNS-posten har inte setts ännu',
  'settings.ui.projects.domainVerificationUnavailable': 'Verifiering är inte byggd än',
  'settings.ui.projects.disclosureUnavailable':
    'Standardvärden för avslöjande per kanal är inte byggda än. Lägg till det obligatoriska avslöjandet i inlägget tills detta släpps.',
  'settings.ui.projects.glossaryUnavailable':
    'Arbetsytans ordlista är inte byggd än. Röst, målgrupp, godkända påståenden och blockerade termer ovan sparas och tillämpas.',
  'settings.ui.projects.localeRulesUnavailable':
    'Skrivregler per språk är inte byggda än. Arbetsytans språk och marknader förblir tillgängliga under Lokalisering.',
  'settings.ui.projects.disclosureHelp':
    'Tillämpas som standard i kompositören för de plattformar du väljer här. Det kan ändras per inlägg innan godkännande.',
  'settings.ui.projects.glossaryHelp':
    'Produktnamn, juridiska termer och allt som måste överleva en översättning oförändrat.',
  'settings.ui.projects.glossaryCaption': 'Skyddade termer och hur var och en hanteras per språk',
  'settings.ui.projects.glossaryEmpty':
    'Inga skyddade villkor ännu. Lägg till produktnamn och juridiska termer som inte får översättas eller omformuleras.',
  'settings.ui.projects.localeRulesHelp':
    'Regler per innehållsspråk. De tillämpas när du anpassar eller omskapar och visas för granskaren.',
  'settings.ui.projects.saveProject': 'Spara projekt',
  'settings.ui.projects.capacityTitle': 'Projektkapacitet',
  'settings.ui.projects.capacityHelp':
    'Grundplanen på 29 USD inkluderar 3 aktiva projekt. En arbetsyta kan berättigas till upp till 20 utan att skapa ett annat konto.',
  'settings.ui.projects.capacitySummary': '{used} av {limit}',
  'settings.ui.projects.atLimitTitle': 'Denna arbetsyta har använt varje projektplats',
  'settings.ui.projects.atLimitBody':
    'Arkivera ett inaktivt projekt eller ändra arbetsytans rättighet innan du lägger till ett till. Den aktuella gränsen är {limit}.',
  'settings.ui.projects.listLabel': 'Välj ett projekt att redigera',
  'settings.ui.projects.detailsTitle': 'Projektdetaljer',
  'settings.ui.projects.projectMeta':
    '{accounts, plural, =0 {Inga kanaler} one {# kanal} other {# kanaler}} · Uppdaterad {updated}',
  'settings.ui.projects.archiveAction': 'Arkivera projekt',
  'settings.ui.projects.archiveTitle': 'Arkivera {project}?',
  'settings.ui.projects.archiveBody':
    'Detta inaktiva projekt lämnar den aktiva arbetsytan och frigör en projektplats.',
  'settings.ui.projects.archiveChannels':
    'Dess anslutna kanaler slutar visas i aktiva projektflöden.',
  'settings.ui.projects.archiveHistory':
    'Utkast, publicerade inlägg, kvitton och granskningshistorik behålls.',
  'settings.ui.projects.archiveLastDisabled': 'Behåll minst ett aktivt projekt i arbetsytan.',
  'settings.ui.projects.archiveConnectedDisabled':
    'Koppla bort detta projekts kanaler innan du arkiverar det.',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'Tre separata inställningar: språket för den här appen, språken du publicerar på och marknaderna du skriver för. Att förändra en förändrar aldrig en annan.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Välj ett gränssnittsspråk för den här appen. Innehållsspråk är separata och redan tillgängliga.',
  'settings.ui.localization.marketHelp':
    'En marknad förändrar exempel, juridiska upplysningar och uppmaningar. Det ändrar inte språket i ett inlägg.',
  'settings.ui.localization.previewTitle': 'Hur datum och siffror kommer att läsa',
  'settings.ui.localization.previewDate': 'Datum',
  'settings.ui.localization.previewTime': 'Tid',
  'settings.ui.localization.previewNumber': 'Nummer',
  'settings.ui.localization.previewCurrency': 'Valuta',
  'settings.ui.localization.weekStartHelp': 'Används av kalenderveckovyn.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'Allt som kan agera på denna arbetsyta, på ett ställe: dina sessioner, referenser, agenter, webhooks och apparna du har beviljat åtkomst till.',
  'settings.ui.security.sessionsCaption': 'Inloggade sessioner för ditt konto',
  'settings.ui.security.sessionColumn.device': 'Enhet och webbläsare',
  'settings.ui.security.sessionColumn.location': 'Ungefärlig plats',
  'settings.ui.security.sessionColumn.lastSeen': 'Senast använd',
  'settings.ui.security.sessionCurrent': 'Denna session',
  'settings.ui.security.sessionRevokeAll': 'Logga ut varannan session',
  'settings.ui.security.sessionLocationUnknown': 'Platsen registreras inte',
  'settings.ui.security.mfaOn': 'Tvåfaktorsautentisering är på',
  'settings.ui.security.mfaOff': 'Tvåfaktorsautentisering är avstängd',
  'settings.ui.security.mfaBody':
    'En andra faktor krävs innan faktureringsändringar, skapande av tjänstekonton, återanslutning av ett konto och återkallande av autentiseringsuppgifter.',
  'settings.ui.security.credentialsTitle': 'API-nycklar',
  'settings.ui.security.credentialsBody':
    'Nycklar som ägs av denna arbetsyta. De är separata från app-bidrag och från din egen session.',
  'settings.ui.security.agentsTitle': 'Servicekonton',
  'settings.ui.security.webhooksTitle': 'Webhook-slutpunkter',
  'settings.ui.security.grantsTitle': 'Appar som du har tillåtit',
  'settings.ui.security.grantsBody':
    'Om du återkallar en app stoppas dess tokens omedelbart. Dina egna anslutningar och schemalagda inlägg påverkas inte.',
  'settings.ui.security.grantScopes': 'Beviljade behörigheter',
  'settings.ui.security.socialPermissionsTitle': 'Behörigheter för sociala konton',
  'settings.ui.security.socialPermissionsBody':
    'Vad varje anslutet konto har tillåtit Post Array att göra, från kapacitetsögonblicksbilden som togs vid anslutningstillfället.',
  'settings.ui.security.viewInSection': 'Hantera i {section}',
  'settings.ui.security.emptySessions': 'Endast denna session är inloggad.',
  'settings.ui.security.emptyGrants':
    'Ingen app från tredje part har åtkomst till den här arbetsytan. Appar visas här efter att du har tillåtit dem på en samtyckesskärm.',
  'settings.ui.security.revokeGrantTitle': 'Återkalla åtkomst för {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Dess åtkomst- och uppdateringstoken slutar fungera omedelbart.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Inlägg det redan planerat stanna schemalagda. Avbryt dem separat om du vill att de ska stoppas.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'Appen kan be om åtkomst igen, och du kan vägra.',

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
  'settings.ui.data.deleteProject': 'Arkivera ett projekt',
  'settings.ui.data.deleteProjectHelp':
    'Tar bort projektet, dess regler och dess ordlista. Innehåll publicerat under det behåller sina kvitton.',
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
    'Dela relä med en avslöjad länk. Kommissionen är aldrig villkorad av en positiv granskning.',
  'settings.ui.referral.linkLabel': 'Din hänvisningslänk',
  'settings.ui.referral.tableCaption': 'Tillskrivna registreringar och deras provisionsstatus',
  'settings.ui.referral.column.signup': 'Registrera dig',
  'settings.ui.referral.column.date': 'Datum',
  'settings.ui.referral.column.state': 'kommissionen',
  'settings.ui.referral.column.amount': 'Belopp',
  'settings.ui.referral.emptyTitle': 'Inga tillskrivna registreringar ännu',
  'settings.ui.referral.emptyBody':
    'Registreringar visas här när någon startar en testversion via din länk. Beloppen förblir vilande tills återbetalningsfönstret stängs.',
  'settings.ui.referral.emptyExample':
    'Exempelrad: acme.example, startade en testversion 12 juni, väntande till 12 juli, och godkändes sedan.',
  'settings.ui.referral.termsLink': 'Läs partnervillkoren',
  'settings.ui.referral.balance': 'Godkänd kommission',
  'settings.ui.referral.balanceUnavailableReason':
    'Provisionsreskontran har inte avstämts för denna period ännu.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'Ett tjänstkonto är en namngiven identitet för en agent, ett skript eller ett arbetsflöde. Den har sina egna omfattningar, sina egna gränser och sin egen revisionsspår.',
  'developer.ui.agents.emptyTitle': 'Inga tjänstekonton ännu',
  'developer.ui.agents.emptyBody':
    'Skapa en för varje automatisering du kör. Separata konton innebär att du kan återkalla ett utan att stoppa de andra.',
  'developer.ui.agents.emptyExample':
    'Exempel: "Innehållsagent", projekt Acme EU, kan utarbeta och schemalägga upp till 6 inlägg om dagen mellan 07:00 och 22:00, publicerar aldrig omedelbart.',
  'developer.ui.agents.step.identity': 'Namn och syfte',
  'developer.ui.agents.step.scope': 'Vad den kan nå',
  'developer.ui.agents.step.limits': 'Gränser',
  'developer.ui.agents.purpose': 'Vad detta konto är till för',
  'developer.ui.agents.purposeHelp':
    'En mening. Den visas bredvid varje åtgärd som detta konto utför i granskningsloggen.',
  'developer.ui.agents.scopeHelp':
    'En räckvidd ger precis sig själv. Inget här innebär något annat.',
  'developer.ui.agents.limitsHelp':
    'Begränsningar upprätthålls av API:et, inte av agenten. En agent kan inte höja sin egen gräns.',
  'developer.ui.agents.quietHours': 'Tysta timmar',
  'developer.ui.agents.quietHoursHelp':
    'Kontot kan inte schemalägga eller publicera inom dessa tider, i arbetsytans tidszon.',
  'developer.ui.agents.lookAheadHelp': 'Hur långt in i framtiden kan det placera ett inlägg.',
  'developer.ui.agents.cadenceHelp': 'De mest externa publikationerna det kan orsaka på en dag.',
  'developer.ui.agents.expiry': 'Autentiseringsuppgifter löper ut',
  'developer.ui.agents.expiryHelp': 'Ett kortare liv är säkrare. Du kan rotera när som helst.',
  'developer.ui.agents.summaryTitle': 'Innan du skapar den',
  'developer.ui.agents.summaryAccounts': 'Konton den kan nå',
  'developer.ui.agents.summaryMaxActions':
    'Högst {count, plural, one {# extern publikation} other {# externa publikationer}} per dag.',
  'developer.ui.agents.summaryApproval': 'Godkännande beteende',
  'developer.ui.agents.summaryCreate': 'Skapa servicekonto',
  'developer.ui.agents.detailTitle': 'Servicekonto',
  'developer.ui.agents.statusActive': 'Aktiv',
  'developer.ui.agents.statusStopped': 'Slutade',
  'developer.ui.agents.statusExpired': 'Autentiseringsuppgifterna har löpt ut',
  'developer.ui.agents.stoppedBody':
    'Detta konto är stoppat. Varje samtal den gör avvisas med en klar anledning. Inget det skapade togs bort.',
  'developer.ui.agents.killTitle': 'Stoppa {name}',
  'developer.ui.agents.killConsequence.calls':
    'Varje API-, MCP- och CLI-anrop från detta konto avvisas på en gång.',
  'developer.ui.agents.killConsequence.scheduled':
    'Inlägg det redan planerat stanna schemalagda. Avbryt dem från kalendern om du vill att de ska stoppas.',
  'developer.ui.agents.killConsequence.reversible': 'Du kan starta det igen senare.',
  'developer.ui.agents.resume': 'Starta den här agenten igen',
  'developer.ui.agents.rotate': 'Rotera autentiseringsuppgifter',
  'developer.ui.agents.rotateTitle': 'Vrid autentiseringsuppgifterna för {name}',
  'developer.ui.agents.rotateConsequence.old': 'Den aktuella referensen slutar fungera omedelbart.',
  'developer.ui.agents.rotateConsequence.new': 'Den nya visas en gång på denna sida.',
  'developer.ui.agents.rotateConsequence.clients':
    'Allt som använder det gamla värdet misslyckas tills du uppdaterar det.',
  'developer.ui.agents.credentialStored': 'Jag har lagrat denna referens',
  'developer.ui.agents.credentialLabel': 'Tjänstkontouppgifter',
  'developer.ui.agents.credentialWarning': 'Detta är den enda gången som denna referens visas',
  'developer.ui.agents.credentialWarningBody':
    'Kopiera den till din hemliga butik nu. Vi behåller bara en hash, så vi kan inte visa den igen. Att rotera skapar en ny.',
  'developer.ui.agents.credentialConsumed':
    'Autentiseringsuppgifterna visas inte längre. Vrid den om du inte har lagrat den.',
  'developer.ui.agents.credentialReveal': 'Visa autentiseringsuppgifter',
  'developer.ui.agents.credentialHide': 'Dölj autentiseringsuppgifter',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read': 'Se dina anslutna konton och vad var och en kan göra',
  'developer.ui.scope.accounts_write': 'Byt namn på konton och ändra hur de grupperas',
  'developer.ui.scope.drafts_read': 'Läs dina utkast och deras varianter',
  'developer.ui.scope.drafts_write': 'Skapa och redigera utkast',
  'developer.ui.scope.posts_schedule': 'Schemalägg godkänt innehåll till dina konton',
  'developer.ui.scope.posts_publish': 'Publicera på dina konton omedelbart',
  'developer.ui.scope.posts_cancel': 'Avbryt schemalagda inlägg',
  'developer.ui.scope.analytics_read': 'Läs analyser för dina konton',
  'developer.ui.scope.media_read': 'Se filerna i ditt bibliotek',
  'developer.ui.scope.media_write': 'Ladda upp och redigera filer i ditt bibliotek',
  'developer.ui.scope.rules_read': 'Läs dina automatiseringsregler',
  'developer.ui.scope.rules_write': 'Skapa och ändra automatiseringsregler som kan publiceras',
  'developer.ui.scope.growth_read': 'Läs dina tillväxtplaner',
  'developer.ui.scope.growth_write': 'Skapa och redigera tillväxtplaner',
  'developer.ui.scope.webhooks_manage': 'Skapa och ändra webhook-slutpunkter',
  'developer.ui.scope.billing_read': 'Läs din plan, teststatus och användning',
  'developer.ui.scope.connections_admin': 'Anslut och koppla bort sociala konton',

  'developer.ui.activity.caption': 'Senaste verktygsanrop, med de som avvisades',
  'developer.ui.activity.column.time': 'Tid',
  'developer.ui.activity.column.tool': 'Verktyg eller rutt',
  'developer.ui.activity.column.outcome': 'Resultat',
  'developer.ui.activity.column.subject': 'Ämne',
  'developer.ui.activity.outcome.ok': 'Tillåtet',
  'developer.ui.activity.outcome.denied': 'Nekad',
  'developer.ui.activity.outcome.failed': 'Misslyckades',
  'developer.ui.activity.filterDenied': 'Visa endast nekade försök',
  'developer.ui.activity.deniedExplain':
    'Ett nekat försök är hur en felkonfigurerad agent visar sig. Dessa rader hålls, inte dolda.',
  'developer.ui.activity.emptyTitle': 'Inga samtal har spelats in ännu',
  'developer.ui.activity.emptyBody':
    'Samtal visas här inom några sekunder efter att de inträffat, inklusive de som avvisades.',
  'developer.ui.activity.emptyExample':
    'Exempelrad: 12:03, draft_post, Tillåtet, utkast för X-konto @acme.',

  'developer.ui.setup.help':
    'Klistra in detta i klienten du ansluter. Ersätt autentiseringsplatshållaren med värdet du lagrade.',
  'developer.ui.setup.credentialPlaceholder':
    'Utdraget använder en platshållare. Överlåt aldrig den verkliga legitimationen till ett arkiv.',
  'developer.ui.setup.copySnippet': 'Kopiera utdrag för {client}',
  'developer.ui.setup.snippetCopied': 'Utdraget har kopierats',
  'developer.ui.setup.tabLabel': 'Klientkonfigurationskodavsnitt',

  'developer.ui.playground.help':
    'Samtal körs mot en seedad kopia av denna arbetsyta. Ingen leverantör kontaktas och ingenting är schemalagt.',
  'developer.ui.playground.tool': 'Verktyg',
  'developer.ui.playground.arguments': 'Argument',
  'developer.ui.playground.argumentsHelp': 'JSON. Samma kropp som det verkliga API:et accepterar.',
  'developer.ui.playground.result': 'Resultat',
  'developer.ui.playground.resultEmpty': 'Kör ett verktyg för att se svaret det skulle returnera.',
  'developer.ui.playground.invalidJson':
    'Detta är inte giltigt JSON ännu, så det kan inte skickas.',
  'developer.ui.playground.deniedByApproval':
    'Godkännandenivå {level} tillåter inte detta samtal. Torrkörningen vägrar det precis som API:et skulle.',
  'developer.ui.playground.announceResult': 'Torrkörningen avslutad. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'Registrera en applikation så att andra kan ge den åtkomst till sin arbetsyta. Varje app har sin egen identitet, sin egen godkännandelista för omdirigering och sin egen revisionsspår.',
  'developer.ui.apps.emptyTitle': 'Inga appar registrerade',
  'developer.ui.apps.emptyBody':
    'Registrera en app när en annan produkt behöver agera på uppdrag av en Post Array-användare. För din egen automatisering, använd istället ett tjänstekonto.',
  'developer.ui.apps.emptyExample':
    'Exempel: "Acme Publisher", konfidentiell klient, omdirigering https://acme.example/oauth/callback, scopes accounts:read och drafts:write.',
  'developer.ui.apps.typeHelp':
    'En konfidentiell klient körs på en server som du kontrollerar och kan hålla en hemlighet. En offentlig klient är en webbläsare eller en stationär app och använder PKCE utan en hemlighet.',
  'developer.ui.apps.redirectAdd': 'Lägg till en omdirigerings-URI',
  'developer.ui.apps.redirectRemove': 'Ta bort {uri}',
  'developer.ui.apps.redirectInvalid':
    'Ange en fullständig https URI utan jokertecken och ingen frågesträng. Det måste matcha värdet som din app skickar exakt.',
  'developer.ui.apps.linksTitle': 'Publicerade länkar',
  'developer.ui.apps.linksHelp':
    'Dessa visas på samtyckesskärmen. En användare som inte kan nå dem kommer inte att ge åtkomst.',
  'developer.ui.apps.linkUnreachable':
    'Vi kunde inte nå den här webbadressen när vi senast kontrollerade, {date}.',
  'developer.ui.apps.linkReachable': 'Nåbar, markerad {date}',
  'developer.ui.apps.scopesTitle': 'Behörigheter som den här appen kan begära',
  'developer.ui.apps.scopesHelp':
    'Be om det minsta du behöver. En användare ser läsbehörigheter och följdbehörigheter som två separata grupper.',
  'developer.ui.apps.scopeGroup.read': 'Läsbehörigheter',
  'developer.ui.apps.scopeGroup.reversible': 'Ändringar du kan ångra',
  'developer.ui.apps.scopeGroup.consequential': 'Följdbehörigheter',
  'developer.ui.apps.scopeGroupHelp.read': 'Dessa låter appen titta på data. Ingenting förändras.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Dessa låter appen skapa eller redigera saker i Post Array. Ingenting når en plattform.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Dessa kan orsaka ett inlägg på ett riktigt konto, eller ändra vem som kan nå dina konton. De listas alltid separat och paketeras aldrig.',
  'developer.ui.apps.noBundling':
    'Det finns inget kombinerat tillträdesområde. Fakturering och anslutningsadministration efterfrågas alltid med namn.',
  'developer.ui.apps.secretTitle': 'Klienthemlighet',
  'developer.ui.apps.secretWarning': 'Detta är den enda gången klienthemligheten visas',
  'developer.ui.apps.secretWarningBody':
    'Lagra det i din hemliga hanterare på serversidan nu. Vi behåller bara en hash. Om du tappar det, rotera det: det finns inget sätt att avslöja det igen.',
  'developer.ui.apps.secretConsumed':
    'Hemligheten visas inte längre. Vrid den om du inte har lagrat den.',
  'developer.ui.apps.secretStored': 'Jag har lagrat denna hemlighet',
  'developer.ui.apps.secretPublicClient':
    'En offentlig klient har ingen hemlighet. Den använder auktoriseringskodflödet med PKCE.',
  'developer.ui.apps.rotateTitle': 'Rotera klienthemligheten för {app}',
  'developer.ui.apps.rotateConsequence.old': 'Den nuvarande hemligheten slutar fungera omedelbart.',
  'developer.ui.apps.rotateConsequence.grants': 'Befintliga användarbidrag återkallas inte.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Dina servrar misslyckas med att uppdatera tokens förrän du distribuerar det nya värdet.',
  'developer.ui.apps.consentPreviewTitle': 'Förhandsgranskning av samtyckesskärmen',
  'developer.ui.apps.consentPreviewHelp':
    'Detta är vad en användare ser. Den genereras från appposten, så den kan inte lova mer än appen ber om.',
  'developer.ui.apps.consentPreviewSample':
    'Endast förhandsgranskning. Ingenting beviljas och ingen token utfärdas.',
  'developer.ui.apps.grantsCaption': 'Arbetsytor som har beviljat den här appen åtkomst',
  'developer.ui.apps.grantColumn.workspace': 'Arbetsyta',
  'developer.ui.apps.grantColumn.scopes': 'Omfattningar',
  'developer.ui.apps.grantColumn.granted': 'Beviljas',
  'developer.ui.apps.grantColumn.lastUsed': 'Senast använd',
  'developer.ui.apps.grantsEmpty': 'Ingen har beviljat den här appen åtkomst ännu.',
  'developer.ui.apps.logsCaption':
    'Senaste förfrågningar, med hemligheter och nyttolaster borttagna',
  'developer.ui.apps.logColumn.time': 'Tid',
  'developer.ui.apps.logColumn.route': 'Rutt',
  'developer.ui.apps.logColumn.status': 'Status',
  'developer.ui.apps.logColumn.workspace': 'Arbetsyta',
  'developer.ui.apps.logsRedacted':
    'Begäran och svarsorgan lagras med autentiseringsuppgifter, tokens och användarinnehåll borttaget.',
  'developer.ui.apps.sandboxTitle': 'Inloggningsuppgifter för sandlåda',
  'developer.ui.apps.sandboxBody':
    'Ett separat klient-ID och arbetsyta med seedad data. Samtal som görs med den når aldrig en leverantör.',
  'developer.ui.apps.rateLimitLabel': 'Prisgräns',
  'developer.ui.apps.rateLimitUsage': '{used} av {limit} begär denna timme',
  'developer.ui.apps.disable': 'Inaktivera appen',
  'developer.ui.apps.enable': 'Aktivera appen',
  'developer.ui.apps.disabledBody':
    'Den här appen är inaktiverad. Befintliga tokens vägras och inget nytt bidrag kan påbörjas. Bidrag behålls så att du kan aktivera det igen.',
  'developer.ui.apps.deleteTitle': 'Ta bort {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Varje bidrag återkallas och varje token slutar fungera.',
  'developer.ui.apps.deleteConsequence.logs':
    'Begäran loggar förs under revisionens lagringsperiod.',
  'developer.ui.apps.deleteConsequence.irreversible': 'Klient-ID:t kan inte återanvändas.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Signerade HTTPS-leveranser för de händelser du väljer. Varje leverans loggas med sitt svar, och eventuell leverans kan skickas igen.',
  'developer.ui.webhooks.emptyTitle': 'Inga slutpunkter ännu',
  'developer.ui.webhooks.emptyBody':
    'Lägg till en slutpunkt för att få publiceringsresultat, godkännandebeslut och anslutningshälsa i dina egna system.',
  'developer.ui.webhooks.emptyExample':
    'Exempel: https://hooks.acme.example/relay, prenumererade på post.published, post.failed och connection.action_required.',
  'developer.ui.webhooks.create': 'Lägg till en slutpunkt',
  'developer.ui.webhooks.url': 'Endpoint URL',
  'developer.ui.webhooks.urlHelp':
    'Endast HTTPS. Vi följer inga omdirigeringar och vi försöker inte igen en 2xx.',
  'developer.ui.webhooks.eventsTitle': 'Händelser',
  'developer.ui.webhooks.eventsHelp':
    'Välj de händelser du hanterar. Att skicka allt till en slutpunkt som ignorerar det mesta gör misslyckanden svårare att se.',
  'developer.ui.webhooks.eventsAll': 'Varje händelse',
  'developer.ui.webhooks.eventsSelected': 'Bara de händelser jag väljer',
  'developer.ui.webhooks.eventsCount': '{count, plural, one {# händelse} other {# händelser}}',
  'developer.ui.webhooks.eventGroup.connections': 'Anslutningar',
  'developer.ui.webhooks.eventGroup.content': 'Innehåll och godkännande',
  'developer.ui.webhooks.eventGroup.publishing': 'Publicering',
  'developer.ui.webhooks.eventGroup.automation': 'Automation och foder',
  'developer.ui.webhooks.eventGroup.workspace': 'Arbetsyta',
  'developer.ui.webhooks.scopeTitle': 'Projekt och konton',
  'developer.ui.webhooks.scopeAll': 'Varje projekt och konto',
  'developer.ui.webhooks.scopeSelected': 'Bara de jag väljer',
  'developer.ui.webhooks.secretTitle': 'Undertecknande hemlighet',
  'developer.ui.webhooks.secretBody':
    'Verifiera signaturhuvudet innan du analyserar en brödtext. Deduplicera på leverans-id:t, som är stabilt över försök.',
  'developer.ui.webhooks.secretRotateTitle': 'Rotera signeringshemligheten',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Båda hemligheterna accepteras i 24 timmar så att du kan distribuera utan att tappa en leverans.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Efter det fönstret används bara den nya hemligheten.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Skickar en signerad exempelhändelse markerad som ett test, så att din mottagare kan ignorera den på ett säkert sätt.',
  'developer.ui.webhooks.testDeliverySent':
    'Provleverans skickad. Resultatet visas i loggen nedan.',
  'developer.ui.webhooks.deliveriesCaption': 'De senaste leveranserna och svaret var och en fick',
  'developer.ui.webhooks.deliveryColumn.time': 'Begärt',
  'developer.ui.webhooks.deliveryColumn.event': 'Händelse',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Försök',
  'developer.ui.webhooks.deliveryColumn.response': 'Svar',
  'developer.ui.webhooks.deliveryColumn.status': 'Status',
  'developer.ui.webhooks.deliveryStatus.pending': 'Väntar',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Levereras',
  'developer.ui.webhooks.deliveryStatus.failed': 'Misslyckades, kommer att försöka igen',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Misslyckades, inga fler försök',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Ej skickat, slutpunkt inaktiverad',
  'developer.ui.webhooks.deliveryNoResponse': 'Inget svar mottaget',
  'developer.ui.webhooks.deliveryNextAttempt': 'Nästa försök {relativeTime}',
  'developer.ui.webhooks.inspect': 'Inspektera leveransen',
  'developer.ui.webhooks.inspectTitle': 'Leverans {id}',
  'developer.ui.webhooks.inspectRequest': 'Begäran kropp',
  'developer.ui.webhooks.inspectResponse': 'Svarskropp',
  'developer.ui.webhooks.redeliver': 'Skicka denna leverans igen',
  'developer.ui.webhooks.redeliverHelp':
    'Samma händelse-id skickas igen med återleveransflaggan inställd, så en idempotent mottagare ignorerar det säkert.',
  'developer.ui.webhooks.redelivered': 'Kö för återleverans.',
  'developer.ui.webhooks.failureTitle': 'Denna slutpunkt misslyckas',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# leverans i rad misslyckades} other {# leveranser i rad misslyckades}}. Efter {limit} på varandra följande misslyckanden inaktiveras slutpunkten och en åtgärd arkiveras.',
  'developer.ui.webhooks.disabledTitle':
    'Denna slutpunkt inaktiverades efter upprepade misslyckanden',
  'developer.ui.webhooks.disabledBody':
    'Vi slutade skicka till den så din kö fylls inte upp. Fixa mottagaren, skicka en testleverans och aktivera den igen.',
  'developer.ui.webhooks.lastSuccessLabel': 'Sista framgången',
  'developer.ui.webhooks.lastSuccessNever': 'Ingen leverans har någonsin lyckats',
  'developer.ui.webhooks.deleteTitle': 'Ta bort denna slutpunkt',
  'developer.ui.webhooks.deleteConsequence.stop': 'Inget mer skickas till denna URL.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'Leveransloggar förs under revisionens lagringsperiod.',

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
    'Svara på ett kort intag, bekräfta vad vi förstått och få en plan du kan acceptera punkt för punkt. Den föreslår arbete. Den schemalägger eller publicerar aldrig något på egen hand.',
  'growth.ui.step.intake': 'Intag',
  'growth.ui.step.confirm': 'Bekräfta',
  'growth.ui.step.plan': 'Planera',
  'growth.ui.stepIndicator': 'Steg {current} av {total}: {name}',
  'growth.ui.intake.section.product': 'Produkt',
  'growth.ui.intake.section.audience': 'Publik och marknader',
  'growth.ui.intake.section.objective': 'Målsättning',
  'growth.ui.intake.section.capacity': 'Kanaler och kapacitet',
  'growth.ui.intake.section.limits': 'Vad är förbjudet',
  'growth.ui.intake.help':
    'Inget här är gissat för dig. Allt du lämnar tomt markeras som saknat snarare än ifyllt.',
  'growth.ui.intake.productNameHelp': 'Namnet du använder med kunder.',
  'growth.ui.intake.siteUrlHelp':
    'Vi läser sidan du ger oss som källmaterial. Du bekräftar varje fakta vi tar från det.',
  'growth.ui.intake.descriptionHelp': 'Vad du säljer och vem det är till för, med dina egna ord.',
  'growth.ui.intake.marketsHelp': 'Länder eller regioner. En per rad.',
  'growth.ui.intake.localesHelp': 'Språken du kommer att publicera på.',
  'growth.ui.intake.objectiveHelp': 'Vad du vill ha mer av under nästa kvartal.',
  'growth.ui.intake.conversionHelp':
    'Handlingen du faktiskt kan mäta. En registrering, en demo, ett köp.',
  'growth.ui.intake.proofHelp':
    'Fallstudier, benchmarks du körde, skärmdumpar du äger, behörigheter du redan har. En per rad.',
  'growth.ui.intake.proofNone': 'Jag har inget godkänt bevis än',
  'growth.ui.intake.proofNoneEffect':
    'Planen kommer att undvika kundresultat och resultatanspråk helt.',
  'growth.ui.intake.channelsHelp': 'De konton du redan publicerar från.',
  'growth.ui.intake.capacityHelp': 'Var ärlig. En plan du inte kan köra är inte en plan.',
  'growth.ui.intake.competitorsHelp': 'Valfritt. En per rad.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Anspråk som du inte får göra av juridiska eller policyskäl. En per rad.',
  'growth.ui.intake.prohibitedTopicsHelp': 'Ämnen att hålla sig borta från. En per rad.',
  'growth.ui.intake.submit': 'Granska vad vi förstod',
  'growth.ui.intake.savedAnnouncement': 'Företagsprofilen har sparats.',
  'growth.ui.intake.requiredMissing':
    'Fyll i fälten markerade som obligatoriska innan du fortsätter.',

  'growth.ui.confirm.factsTitle': 'Fakta du bekräftat',
  'growth.ui.confirm.factsHelp': 'Dessa kan användas i kopia.',
  'growth.ui.confirm.assumptionsTitle': 'Antaganden vi gjort',
  'growth.ui.confirm.assumptionsHelp':
    'Detta är inte fakta. De formar planen men de blir aldrig ett anspråk i ett inlägg.',
  'growth.ui.confirm.missingTitle': 'Saknas',
  'growth.ui.confirm.missingHelp':
    'Planen arbetar kring var och en av dessa och säger så där det spelar roll.',
  'growth.ui.confirm.confidence.label': 'Självförtroende: {level}',
  'growth.ui.confirm.confidence.low': 'låg',
  'growth.ui.confirm.confidence.medium': 'medium',
  'growth.ui.confirm.confidence.high': 'hög',
  'growth.ui.confirm.promote': 'Bekräfta som ett faktum',
  'growth.ui.confirm.correct': 'Rätta till detta',
  'growth.ui.confirm.correctLabel': 'Din rättelse',
  'growth.ui.confirm.generate': 'Skapa planen',
  'growth.ui.confirm.announcement': 'Företagsprofilen bekräftad.',

  'growth.ui.plan.generatingBody':
    'Detta tar några sekunder. Du kan lämna den här sidan: planen slutar av sig själv.',
  'growth.ui.plan.stateDraft': 'Utkast, ej godkänt',
  'growth.ui.plan.stateApproved': 'Godkänd',
  'growth.ui.plan.stateSuperseded': 'Ersatt av en nyare version',
  'growth.ui.plan.newVersionNotice':
    'En uppdatering skapar version {version} och lämnar den godkända versionen orörd.',
  'growth.ui.plan.emptyTitle': 'Ingen plan än',
  'growth.ui.plan.emptyBody':
    'Fyll i företagsprofilen så bygger vi en plan utifrån de fakta du bekräftar.',
  'growth.ui.plan.emptyExample':
    'En plan innehåller en strategi, fyra veckors kort, en UGC-kampanj, katalogstödda möjligheter och upp till fem verktyg.',
  'growth.ui.plan.tabsLabel': 'Plansektioner',
  'growth.ui.plan.modelNote': 'Genereras av {model}, uppmaning {promptVersion}, på {date}.',

  'growth.ui.strategy.snapshotTitle': 'Business ögonblicksbild',
  'growth.ui.strategy.channelPriority': 'Prioritet {rank}',
  'growth.ui.strategy.channelFormats': 'Inbyggda format',
  'growth.ui.strategy.pillarProof': 'Bevis på att denna pelare lutar sig mot',
  'growth.ui.strategy.pillarProofNone': 'Inget godkänt bevis. Håll denna pelare beskrivande.',
  'growth.ui.strategy.cadenceCaption': 'Inlägg per vecka per kanal',
  'growth.ui.strategy.cadenceColumn.channel': 'Kanal',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Inlägg per vecka',
  'growth.ui.strategy.cadenceTotal': 'Totalt per vecka',
  'growth.ui.strategy.capacityWarning':
    'Denna kadens är {planned} inlägg i veckan mot en angiven kapacitet på {capacity} timmar. Minska den eller höj kapaciteten i profilen.',
  'growth.ui.strategy.measurementBody':
    'Jämfört med dina egna avslutande inlägg på samma kanal och format. Inget externt riktmärke används, eftersom inget är jämförbart med ditt konto.',
  'growth.ui.strategy.localeAdaptations': 'Språkanteckningar',

  'growth.ui.fourWeek.caption': 'Föreslagna briefer per vecka och dag',
  'growth.ui.fourWeek.column.date': 'Datum',
  'growth.ui.fourWeek.column.channel': 'Kanal',
  'growth.ui.fourWeek.column.pillar': 'Pelare',
  'growth.ui.fourWeek.column.format': 'Format',
  'growth.ui.fourWeek.column.brief': 'Kort',
  'growth.ui.fourWeek.column.cta': 'Uppmaning till handling',
  'growth.ui.fourWeek.column.measurement': 'Mättagg',
  'growth.ui.fourWeek.column.actions': 'Åtgärder',
  'growth.ui.fourWeek.approvalRequired': 'Godkännande krävs innan den kan publiceras',
  'growth.ui.fourWeek.approvalNotRequired': 'Inget godkännande krävs för detta konto',
  'growth.ui.fourWeek.noCta': 'Ingen uppmaning till handling',
  'growth.ui.fourWeek.weekEmpty': 'Inga trosor föreslås för denna vecka.',
  'growth.ui.fourWeek.acceptedCount': '{accepted} av {total} briefar accepterade som utkast',
  'growth.ui.fourWeek.acceptAnnouncement': 'Utkast skapat från denna brief.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Kalenderförslag tillagt för {date}.',

  'growth.ui.ugc.promptAngle': 'Vinkel {number}',
  'growth.ui.ugc.checklistTitle': 'Rättigheter, samtycke och information',
  'growth.ui.ugc.checklistHelp':
    'Gå igenom detta med varje deltagare innan något publiceras. Samtycke till att medverka är inte samtycke till att marknadsföra.',
  'growth.ui.ugc.incentiveNone': 'Ingen ersättning erbjuds',
  'growth.ui.ugc.incentiveDisclosure':
    'En ersättning måste anges i varje inlägg som blir resultatet, av både dig och deltagaren.',
  'growth.ui.ugc.honesty':
    'Detta planerar en kampanj som du driver med riktiga personer. Post Array hittar inte skapare, kontaktar dem inte, skriver inte omdömen och skapar inte kundinnehåll.',

  'growth.ui.opportunities.caption':
    'Verifierade möjligheter från katalogen, rangordnade efter passform med din profil',
  'growth.ui.opportunities.column.opportunity': 'Möjlighet',
  'growth.ui.opportunities.column.type': 'Typ',
  'growth.ui.opportunities.column.audience': 'Publik',
  'growth.ui.opportunities.column.fit': 'Varför detta passar',
  'growth.ui.opportunities.column.requirements': 'Krav',
  'growth.ui.opportunities.column.rules': 'Regler för självreklam',
  'growth.ui.opportunities.column.cost': 'Kostnad',
  'growth.ui.opportunities.column.effort': 'Ansträngning',
  'growth.ui.opportunities.column.verified': 'Senast verifierad',
  'growth.ui.opportunities.column.actions': 'Åtgärder',
  'growth.ui.opportunities.costFree': 'Gratis',
  'growth.ui.opportunities.effort.low': 'Låg',
  'growth.ui.opportunities.effort.medium': 'Medium',
  'growth.ui.opportunities.effort.high': 'Hög',
  'growth.ui.opportunities.noRequiredAsset': 'Ingen tillgång krävs',
  'growth.ui.opportunities.prepareTitle': 'Förbered en inlämning för {name}',
  'growth.ui.opportunities.prepareRules': 'Deras regler, citerade',
  'growth.ui.opportunities.prepareChecklist': 'Vad ska man ha klart',
  'growth.ui.opportunities.prepareManual':
    'Du skickar in detta själv på deras sida. Post Array fyller inte i formulär, skapar konton eller mailar någon.',
  'growth.ui.opportunities.pitchTitle': 'Pitch utkast',
  'growth.ui.opportunities.pitchHelp':
    'Redigera den innan du skickar den. Den använder bara de fakta du bekräftat.',
  'growth.ui.opportunities.submittedOn': 'Skickat {date}',
  'growth.ui.opportunities.staleTitle': 'Vissa poster behöver verifieras på nytt',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# post har passerat dess recensionsdatum} other {# poster har passerat deras recensionsdatum}}. Kontrollera de aktuella reglerna på webbplatsen innan du litar på dem.',
  'growth.ui.opportunities.emptyExample':
    'En katalograd innehåller den officiella webbadressen, publiken, inlämningsreglerna som citeras från webbplatsen, kostnaden, ansträngningen och det datum då en person senast kontrollerade den.',

  'growth.ui.tools.shown': '{shown} av {max} visas',
  'growth.ui.tools.fewerThanMax':
    'Endast {count, plural, one {# verktyg matchar} other {# verktyg matchar}} detta arbetsflöde med en aktuell granskning. Vi vill hellre visa färre än att fylla på listan.',
  'growth.ui.tools.emptyTitle': 'Inget granskat verktyg passar detta arbetsflöde ännu',
  'growth.ui.tools.emptyBody':
    'Varje inlägg behöver ett kontrollerat pris, kontrollerade rättighetsvillkor och en namngiven begränsning innan den visas här.',
  'growth.ui.tools.emptyExample':
    'En post säger vad den är bäst för, varför den passar din plan, vad den inte kan göra, de kunskaper den behöver, hur utmatningen kommer tillbaka till Post Array och när priset senast kontrollerades.',
  'growth.ui.tools.openSite': 'Öppna den officiella webbplatsen för {name}',
  'growth.ui.tools.stale': 'Efter granskningsdatumet. Utesluten från genererade planer.',

  'growth.ui.item.explainTitle': 'Varför detta föreslogs',
  'growth.ui.item.explainEvidence': 'Vad den bygger på',
  'growth.ui.item.explainNoEvidence':
    'Detta kom från målet och kanalreglerna, inte från ett bekräftat faktum om ditt företag.',
  'growth.ui.item.dismissTitle': 'Avvisa detta förslag',
  'growth.ui.item.dismissBody':
    'Berätta varför. Anledningen lagras med planen och formar nästa version.',
  'growth.ui.item.dismissReasonLabel': 'Anledning',
  'growth.ui.item.dismissReason.notRelevant': 'Inte relevant för denna verksamhet',
  'growth.ui.item.dismissReason.noCapacity': 'Vi har inte kapacitet',
  'growth.ui.item.dismissReason.wrongAudience': 'Fel publik',
  'growth.ui.item.dismissReason.alreadyDone': 'Vi gör redan det här',
  'growth.ui.item.dismissReason.policy': 'Mot vår policy eller anspråk',
  'growth.ui.item.dismissReason.other': 'Något annat',
  'growth.ui.item.dismissNote': 'Allt du vill lägga till',
  'growth.ui.item.dismissed': 'Avskedad. Den förblir synlig så att du kan ångra den.',
  'growth.ui.item.undoDismiss': 'Ångra avvisa',

  'growth.ui.export.title': 'Exportera denna plan',
  'growth.ui.export.formatLabel': 'Format',
  'growth.ui.export.copy': 'Kopiera till urklipp',
  'growth.ui.export.download': 'Ladda ner filen',
  'growth.ui.export.copied': 'Plan kopierad till urklipp.',
  'growth.ui.export.schemaNote':
    'Alla tre formaten kommer från ett validerat schema, version {version}. De strukturerade vyerna är säkra för källkontroll och innehåller inga hemligheter.',
  'growth.ui.export.previewLabel': 'Exportera förhandsgranskning',
} as const;
