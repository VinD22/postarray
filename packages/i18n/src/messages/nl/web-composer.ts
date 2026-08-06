/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
  'composerWeb.pane.targets': 'Doelaccounts en sets',
  'composerWeb.pane.master': 'Hoofdconcept en gedeelde instellingen',
  'composerWeb.pane.variant': 'Versie voor het open doel',
  'composerWeb.pane.review': 'Preview, validatie, kosten en goedkeuring',
  'composerWeb.pane.showPreview': 'Voorbeeld weergeven',
  'composerWeb.pane.hidePreview': 'Voorbeeld verbergen',
  'composerWeb.pane.previewCollapsed':
    'Het voorbeeldpaneel is verborgen. Open het om het laatste bericht te controleren.',

  'composerWeb.step.targets': 'Doelstellingen',
  'composerWeb.step.write': 'Schrijf',
  'composerWeb.step.perTarget': 'Per doel',
  'composerWeb.step.review': 'Beoordeling',
  'composerWeb.step.progress': 'Stap {current} van {total}',
  'composerWeb.step.legend': 'Composer-stappen',

  'composerWeb.summary.label': 'Concept samenvatting',
  'composerWeb.summary.targets': '{count, plural, =0 {Geen doelen} one {# doel} other {# doelen}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {Geen problemen} one {# probleem} other {# problemen}}',
  'composerWeb.summary.notScheduled': 'Geen tijd gekozen',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Kosten nog niet geprijsd',
  'composerWeb.summary.openReview': 'Beoordeling openen',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Hoofdontwerp',
  'composerWeb.rail.masterHint': 'Bewerk hier om elk doel te bereiken dat nog steeds erft.',
  'composerWeb.rail.accountsHeading': 'Doelaccounts',
  'composerWeb.rail.setsHeading': 'Sets en groepen',
  'composerWeb.rail.setsHelp':
    'Een set is een opgeslagen groep accounts en standaardinstellingen. Als u er één toepast, worden de waarden ervan naar dit concept gekopieerd. Latere bewerkingen aan de set veranderen dit concept niet.',
  'composerWeb.rail.openTarget': 'Open de versie voor {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Limiet onbekend',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {geen media} one {# mediabestand} other {# mediabestanden}}',
  'composerWeb.rail.paused': 'Gepauzeerd. Het wordt pas gepubliceerd als u het hervat.',
  'composerWeb.rail.state.notBuilt': 'Nog niet gebouwd',
  'composerWeb.rail.state.unsupported': 'Aanbieder ondersteunt niet',
  'composerWeb.rail.empty': 'Nog geen accounts geselecteerd.',
  'composerWeb.rail.emptyHelp':
    'Kies de accounts die dit bericht moet bereiken. Je kunt er later meer toevoegen.',
  'composerWeb.rail.divergenceHint':
    'Open een doel om zijn eigen versie te zien. Het masterconcept is ongewijzigd.',
  'composerWeb.rail.searchLabel': 'Accounts filteren',
  'composerWeb.rail.removeTarget': '{account} verwijderen',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Globale bewerking',
  'composerWeb.globalEdit.title': 'Pas deze wijziging toe op elk geselecteerd doel',
  'composerWeb.globalEdit.description':
    'Het hoofdontwerp verandert altijd. Doelen die dit veld nog steeds erven, volgen het. Doelen met hun eigen versie behouden deze.',
  'composerWeb.globalEdit.fieldLabel': 'Veld',
  'composerWeb.globalEdit.compatibleHeading': 'Deze doelstellingen nemen de verandering op zich',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Deze doelen behouden hun eigen versie',
  'composerWeb.globalEdit.incompatibleHeading':
    'Deze doelstellingen kunnen de verandering niet aan',
  'composerWeb.globalEdit.incompatibleHelp':
    'Er wordt niets laten vallen zonder dat u dit vertelt. Elk account hieronder krijgt een expliciete versie met de aangepaste wijziging, die u achteraf kunt bewerken.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} staat {limit}-tekens toe. Deze tekst is {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} accepteert geen link in dit veld. De link blijft in het hoofdconcept en in de doelen die dit toestaan.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} accepteert {limit, plural, one {# bestand} other {# bestanden}}. Dit concept bevat {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported':
    '{account} accepteert geen {mimeType}-bestanden.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} ondersteunt geen vervolgitems, dus de reeks blijft op het hoofdconcept.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} publiceert platte tekst. De opmaakmarkeringen verschijnen als tekens.',
  'composerWeb.globalEdit.adaptedPreview': 'Wat {account} in plaats daarvan krijgt',
  'composerWeb.globalEdit.confirm': 'Pas de versies toe en maak deze',
  'composerWeb.globalEdit.nothingToApply':
    'Er verandert niets. Het masterconcept heeft deze waarde al.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Wijziging toegepast op # doel} other {Wijziging toegepast op # doelen}}. {adapted, plural, =0 {Geen doel had een aangepaste versie nodig} one {# doel heeft een aangepaste versie gekregen} other {# doelen hebben aangepaste versies gekregen}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'Dit doel heeft zijn eigen versie',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# veld verschilt van het hoofdconcept} other {# velden verschillen van het hoofdconcept}}',
  'composerWeb.override.field.body': 'Tekst plaatsen',
  'composerWeb.override.field.contentKind': 'Berichttype',
  'composerWeb.override.field.locale': 'Inhoudelijke taal',
  'composerWeb.override.field.mediaIds': 'Media',
  'composerWeb.override.field.links': 'Koppelingen',
  'composerWeb.override.field.signature': 'Handtekening',
  'composerWeb.override.field.threadItems': 'Opmerkingen en draad',
  'composerWeb.override.field.schedule': 'Schema',
  'composerWeb.override.resetField': 'Reset {field} naar master',
  'composerWeb.override.resetFieldTitle': '{field} opnieuw instellen voor {account}?',
  'composerWeb.override.resetFieldBody':
    'De versie van {field}, geschreven voor {account}, wordt verwijderd en het hoofdconcept wordt opnieuw gebruikt. Geen andere doelwijzigingen.',
  'composerWeb.override.resetAll': 'Zet elk veld terug naar master',
  'composerWeb.override.inheritNotice':
    'Dit doel volgt het masterconcept. Als u hier iets bewerkt, wordt een versie gemaakt die alleen {account} ontvangt.',
  'composerWeb.override.created': '{account} heeft nu zijn eigen {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Limieten voor {account}',
  'composerWeb.limits.text': 'Tekst van maximaal {limit}-tekens',
  'composerWeb.limits.linkCost':
    'Een link telt als {count, plural, one {# karakter} other {# karakters}}, ongeacht de lengte ervan.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Geen afbeeldingen} one {# afbeelding} other {maximaal # afbeeldingen}}',
  'composerWeb.limits.videos':
    "{count, plural, =0 {Geen video} one {# video} other {tot # video's}}",
  'composerWeb.limits.duration': 'Video tot {duration}',
  'composerWeb.limits.aspect': 'Beeldverhouding tussen {min} en {max}',
  'composerWeb.limits.fileSize': 'Bestanden tot {size}',
  'composerWeb.limits.mimeTypes': 'Geaccepteerde bestandstypen: {types}',
  'composerWeb.limits.source': 'Lees vanuit de capaciteitsmomentopname {version} {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'Een miniatuur is vereist.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider}-instellingen',
  'composerWeb.native.privacy': 'Wie kan dit zien',
  'composerWeb.native.privacyChoose': 'Kies een publiek',
  'composerWeb.native.privacyExplicit':
    '{provider} staat geen vooraf geselecteerd publiek toe. Kies er één voordat deze kan worden ingepland.',
  'composerWeb.native.community': 'Gemeenschap',
  'composerWeb.native.board': 'Bord',
  'composerWeb.native.group': 'Groep of pagina',
  'composerWeb.native.organization': 'Organisatie',
  'composerWeb.native.channel': 'Kanaal',
  'composerWeb.native.publication': 'Publicatie',
  'composerWeb.native.disclosureHeading': 'Openbaarmaking',
  'composerWeb.native.disclosureCommercial': 'Dit bericht promoot een product of dienst',
  'composerWeb.native.disclosureBranded': 'Dit bericht is branded content voor een ander bedrijf',
  'composerWeb.native.disclosureAi': 'Een deel van deze inhoud is gemaakt met een AI-tool',
  'composerWeb.native.disclosureUnsupported':
    '{provider} biedt deze openbaarmaking niet aan via zijn API. Voeg het in plaats daarvan toe aan de tekst.',
  'composerWeb.native.none':
    'Er zijn geen {provider}-instellingen van toepassing op dit berichttype.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Opgelost op {provider}',
  'composerWeb.entity.resolvedId': 'Account-ID {externalId}',
  'composerWeb.entity.plainTextWarning':
    'Niet op elkaar afgestemd. Het wordt gepubliceerd als platte tekst, wat geen native tag is op {provider}.',
  'composerWeb.entity.removeMention': 'Verwijder de vermelding {label}',
  'composerWeb.entity.addMention': 'Voeg een vermelding toe',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Geen vermeldingen} one {# vermelding} other {# vermeldingen}}, {resolved} gekoppeld aan een echt account',
  'composerWeb.entity.lookupUnsupported':
    '{provider} biedt geen zoekfunctie voor entiteiten voor dit accounttype.',
  'composerWeb.entity.lookupNotBuilt':
    'Relay heeft nog geen entiteitszoekopdracht voor {provider} gebouwd. Er wordt intussen niets geraden.',
  'composerWeb.entity.searchHint': 'Typ minimaal twee tekens en kies vervolgens een resultaat.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {Geen overeenkomsten} one {# overeenkomst} other {# overeenkomsten}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Koppelingen',
  'composerWeb.links.detected':
    '{count, plural, one {# link gevonden in dit concept} other {# links gevonden in dit concept}}',
  'composerWeb.links.noneDetected': 'Er zijn nog geen links in dit concept.',
  'composerWeb.links.modeLabel': 'Hoe deze link wordt gepubliceerd',
  'composerWeb.links.original': 'Originele URL',
  'composerWeb.links.utmSource': 'Bron',
  'composerWeb.links.utmMedium': 'Middelmatig',
  'composerWeb.links.utmCampaign': 'Campagne',
  'composerWeb.links.utmTerm': 'Termijn',
  'composerWeb.links.utmContent': 'Inhoud',
  'composerWeb.links.domainVerified': '{domain}, geverifieerd voor deze werkruimte',
  'composerWeb.links.domainDefault': 'Relay standaarddomein',
  'composerWeb.links.domainNone': 'Er is nog geen merkdomein geverifieerd.',
  'composerWeb.links.notAllowedHere': '{account} staat een link hier niet toe.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Commentaar',
  'composerWeb.sequence.kindThread': 'Draaddeel',
  'composerWeb.sequence.kindLabel': 'Artikeltype',
  'composerWeb.sequence.moveUp': 'Verplaats dit item eerder',
  'composerWeb.sequence.moveDown': 'Verplaats dit item later',
  'composerWeb.sequence.remove': 'Verwijder dit artikel',
  'composerWeb.sequence.absoluteTime': 'Draait op {time}, wat {utc} UTC is.',
  'composerWeb.sequence.partialFailure':
    'Als een item mislukt, blijft het reeds gepubliceerde bericht gepubliceerd en worden de items erna niet uitgevoerd. Je krijgt een actie-item.',
  'composerWeb.sequence.maxReached':
    '{account} accepteert {limit, plural, one {# vervolgitem} other {# vervolgitems}}.',
  'composerWeb.sequence.minDelay':
    'De kortste vertraging die {provider} hier toestaat, is {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Zelfde account als het bericht',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Geen problemen} one {# probleem} other {# problemen}} op dit item',
  'composerWeb.sequence.customMinutes': 'Minuten na het vorige item',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Herhaal dit bericht',
  'composerWeb.repeat.cadenceLabel': 'Hoe vaak',
  'composerWeb.repeat.maximum':
    'Een herhalend bericht kan maximaal {limit}-tijden worden weergegeven.',
  'composerWeb.repeat.occurrenceLabel': 'Aantal berichten',
  'composerWeb.repeat.duplicateCheck':
    'Elk exemplaar wordt gecontroleerd op dubbele inhoud voordat het wordt gepubliceerd. Een gebeurtenis die de controle niet doorstaat, wordt een actie-item in plaats van gepubliceerd.',
  'composerWeb.repeat.occurrenceList': 'Eerste gebeurtenissen',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {en # meer voorkomen} other {en # meer voorkomens}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Sets en signatuur',
  'composerWeb.set.pickerTitle': 'Begin met een set',
  'composerWeb.set.pickerDescription':
    'Een Set vult doelen, tekst en instellingen in. Het concept dat wordt gemaakt is onafhankelijk, dus als je de set later bewerkt, wordt een goedgekeurd of gepland bericht nooit gewijzigd.',
  'composerWeb.set.accountCount': '{count, plural, one {# account} other {# accounts}}',
  'composerWeb.set.apply': 'Gebruik deze set',
  'composerWeb.set.none': 'Nog geen sets opgeslagen.',
  'composerWeb.signature.pickerLabel': 'Handtekening',
  'composerWeb.signature.scope': 'Voor {brand} op {provider} in {language}',
  'composerWeb.signature.previewHeading': 'Hoe het bericht eindigt',
  'composerWeb.signature.notMatching':
    'Deze handtekening is bedoeld voor een ander merk, platform of taal en wordt daarom hier niet aangeboden.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Help mee met deze tekst',
  'composerWeb.assist.unavailableTitle': 'Tekstassistentie is niet geconfigureerd',
  'composerWeb.assist.unavailableBody':
    'Er is geen AI-gateway ingesteld voor deze werkruimte, dus de hulpacties zijn uitgeschakeld. Al het andere in de componist werkt normaal.',
  'composerWeb.assist.targetLabel': 'Geldt voor',
  'composerWeb.assist.targetMaster': 'Het meesterontwerp',
  'composerWeb.assist.targetVariant': 'De versie voor {account}',
  'composerWeb.assist.beforeLabel': 'Huidige tekst',
  'composerWeb.assist.afterLabel': 'Voorgestelde tekst',
  'composerWeb.assist.regionLabel': 'Voorgestelde tekstwijziging, nog niet toegepast',
  'composerWeb.assist.added': 'toegevoegd',
  'composerWeb.assist.removed': 'verwijderd',
  'composerWeb.assist.evidence': 'Bewijs en bronnen',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Er is geen bron gevonden voor deze bewering. Controleer het voordat u het publiceert.',
  'composerWeb.assist.failed': 'Het hulpverzoek is niet voltooid. Uw tekst is ongewijzigd.',
  'composerWeb.assist.noMediaGeneration':
    'Relay maakt geen afbeeldingen of video. Breng voltooide bestanden naar de bibliotheek en publiceer ze hier.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'Dit is de goedgekeurde versie. Als u deze bewerkt, wordt er een nieuwe versie gemaakt en wordt de goedkeuring gewist.',
  'composerWeb.autosave.pinnedAcknowledge': 'Bewerk en wis de goedkeuring',
  'composerWeb.autosave.conflictTitle': 'Twee versies van dit ontwerp',
  'composerWeb.autosave.conflictKeepMine': 'Bewaar wat ik schreef',
  'composerWeb.autosave.conflictKeepTheirs': 'Gebruik de versie van {name}',
  'composerWeb.autosave.conflictHelp':
    'Niets wordt automatisch samengevoegd. Kies per veld en sla vervolgens op.',
  'composerWeb.autosave.retry': 'Probeer opnieuw op te slaan',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Composer-snelkoppelingen',
  'composerWeb.shortcuts.nextTarget': 'Volgende doel',
  'composerWeb.shortcuts.previousTarget': 'Vorig doel',
  'composerWeb.shortcuts.nextIssue': 'Volgende nummer',
  'composerWeb.shortcuts.previousIssue': 'Vorig nummer',
  'composerWeb.shortcuts.save': 'Sla het concept nu op',
  'composerWeb.shortcuts.openSchedule': 'Open het schemablad',
  'composerWeb.shortcuts.open': 'Snelkoppelingen weergeven',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'Beoordeling',
  'composerWeb.review.contentVersion': 'Inhoudsversie {checksum}',
  'composerWeb.review.approvalPolicy': 'Beleid: {policy}',
  'composerWeb.review.approverPending': 'Wachten op een beslissing van {approver}.',
  'composerWeb.review.approverNone': 'Voor deze doelstellingen is geen goedkeuring vereist.',
  'composerWeb.review.perTargetHeading': 'Wat elk account ontvangt',
  'composerWeb.review.finalUrl': 'Gepubliceerde link',
  'composerWeb.review.privacyState': 'Publiek: {value}',
  'composerWeb.review.disclosureState': 'Openbaarmaking: {value}',
  'composerWeb.review.disclosureNone': 'Geen openbaarmakingsset',
  'composerWeb.review.mediaVersion': '{name}, versie {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# doel kan nog niet worden gepland} other {# doelen kunnen nog niet worden gepland}}',
  'composerWeb.review.offlineBlocked':
    'Plannen en publiceren hebben een verbinding nodig. Je concept is veilig op dit apparaat.',
  'composerWeb.review.publishConfirm':
    'Dit wordt meteen gepubliceerd naar {count, plural, one {# account} other {# accounts}}. Het kan vanaf hier niet ongedaan worden gemaakt.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Nieuw ontwerp',
  'composerWeb.page.loading': 'Het ontwerp, de doelen en hun limieten laden',
  'composerWeb.page.errorTitle': 'Dit concept kon niet worden geopend',
  'composerWeb.page.errorBody':
    'Er ging niets verloren. Probeer het opnieuw. Als het blijft mislukken, helpt de onderstaande referentie de ondersteuning bij het vinden van het verzoek.',
  'composerWeb.page.noConnectionsTitle': 'Koppel een account aan voordat u gaat componeren',
  'composerWeb.page.noConnectionsBody':
    'Voor een concept is minimaal één verbonden account nodig, zodat Relay de limieten, het voorbeeld en de instellingen kent die moeten worden weergegeven.',
  'composerWeb.page.noConnectionsExample':
    'Voorbeeld: als X en LinkedIn zijn verbonden, wordt één concept twee native versies met hun eigen tellers.',
  'composerWeb.page.permissionTitle': 'In deze werkruimte kunt u geen berichten maken',
  'composerWeb.page.permissionBody':
    'Voor componeren is een editorrol of hoger vereist. Een eigenaar of beheerder kan uw rol wijzigen.',
  'composerWeb.page.rateLimitTitle': 'Te veel draft saves in korte tijd',
  'composerWeb.page.rateLimitCause':
    'Deze werkruimte heeft de schrijflimiet voor het huidige venster bereikt. Uw tekst wordt ondertussen op dit apparaat bewaard.',
  'composerWeb.page.rateLimitAlternative':
    'Blijf schrijven. Het opslaan wordt automatisch hervat wanneer het venster opnieuw wordt ingesteld.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Raster',
  'mediaLib.view.list': 'Lijst',
  'mediaLib.view.label': 'Indeling',
  'mediaLib.sort.label': 'Sorteren',
  'mediaLib.sort.newest': 'Nieuwste eerst',
  'mediaLib.sort.name': 'Naam',
  'mediaLib.sort.size': 'Grootste eerst',
  'mediaLib.select': 'Selecteer {name}',
  'mediaLib.column.file': 'Bestand',
  'mediaLib.column.type': 'Typ',
  'mediaLib.column.size': 'Grootte',
  'mediaLib.column.altText': 'Alt-tekst',
  'mediaLib.column.rights': 'Rechten',
  'mediaLib.column.added': 'Toegevoegd',
  'mediaLib.openDetail': 'Open {name}',

  'mediaLib.empty.title': 'Nog geen media',
  'mediaLib.empty.body':
    'Upload de afbeeldingen en video die u al heeft, of importeer een bestand vanaf een URL. Relay controleert het type en de grootte van elk account waarnaar u publiceert.',
  'mediaLib.empty.example':
    'Voorbeeld: launch_hero.jpg, 1600 bij 900, alt-tekstset, gebruikt in 2 berichten.',
  'mediaLib.error.title': 'De bibliotheek kan niet worden geladen',
  'mediaLib.error.body': 'Uw bestanden zijn veilig. Er veranderde niets door deze mislukking.',
  'mediaLib.loading': 'Uw mediabibliotheek laden',
  'mediaLib.permission.title': 'U kunt deze werkruimtebibliotheek niet zien',
  'mediaLib.permission.body':
    'Voor het bekijken van media is de kijkersrol of hoger bij dit merk vereist. Een eigenaar of beheerder kan dit verlenen.',

  'mediaLib.upload.heading': 'Media toevoegen',
  'mediaLib.upload.browse': 'Kies bestanden',
  'mediaLib.upload.dropHint':
    'Sleep bestanden hierheen of kies ze. Uploads worden hervat als de verbinding wegvalt.',
  'mediaLib.upload.queueHeading': 'Uploads',
  'mediaLib.upload.progress': '{name}, {percent} of {size} verzonden',
  'mediaLib.upload.paused': 'Gepauzeerd. {sent} van {size} is al opgeslagen.',
  'mediaLib.upload.resume': 'Hervat het uploaden',
  'mediaLib.upload.pause': 'Uploaden onderbreken',
  'mediaLib.upload.cancel': 'Annuleer deze upload',
  'mediaLib.upload.retry': 'Probeer deze upload opnieuw',
  'mediaLib.upload.finalizing': '{name} voltooien',
  'mediaLib.upload.done': '{name} bevindt zich in uw bibliotheek',
  'mediaLib.upload.failed': '{name} is niet geëindigd. {reason}',
  'mediaLib.upload.offline':
    'Offline. Uploads gaan verder waar ze stopten wanneer u opnieuw verbinding maakt.',
  'mediaLib.upload.rejectedType':
    '{name} is {mimeType}, wat geen van de door u geselecteerde accounts accepteert.',
  'mediaLib.upload.rejectedSize':
    '{name} is {size}. De laagste limiet voor al uw accounts is {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Geaccepteerd door # van uw accounts} other {Geaccepteerd door # van uw accounts}}',
  'mediaLib.upload.rejectedBy': 'Niet geaccepteerd door {accounts}',
  'mediaLib.upload.checkedAgainst':
    'Gecontroleerd tegen de rekeningen die in dit concept zijn geselecteerd.',
  'mediaLib.upload.noTargets':
    'Er zijn geen accounts geselecteerd, dus het bestand wordt alleen gecontroleerd aan de hand van de standaardwaarden van de werkruimte.',

  'mediaLib.alt.heading': 'Alt-tekst',
  'mediaLib.alt.help':
    'Beschrijf wat belangrijk is in de afbeelding voor iemand die het niet kan zien. Meestal zijn één of twee zinnen voldoende.',
  'mediaLib.alt.count': '{used} van {limit}-tekens',
  'mediaLib.alt.requiredBy': 'Vereist door {accounts}',
  'mediaLib.alt.waive': 'Deze afbeelding bevat geen informatie',
  'mediaLib.alt.waiveReason': 'Waarom het geen beschrijving nodig heeft',
  'mediaLib.alt.waiveHelp':
    'Gebruik dit alleen ter decoratie. Een afbeelding waarvan afstand is gedaan, wordt gepubliceerd met een lege beschrijving waar het platform dit toestaat.',
  'mediaLib.alt.waived': 'Vrijgesteld door {name} op {date}. Reden: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} accepteert geen alternatieve tekst via de API voor dit account.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# bestand heeft geen alternatieve tekst} other {# bestanden hebben geen alternatieve tekst}}',

  'mediaLib.rights.heading': 'Rechten en toestemming',
  'mediaLib.rights.declared': 'Uitgegeven door {name} op {date}',
  'mediaLib.rights.undeclared':
    'Nog niet verklaard. Declareer het voordat dit bestand wordt gepubliceerd.',
  'mediaLib.rights.ownerLabel': 'Wie is de eigenaar van dit bestand',
  'mediaLib.rights.ownerSelf': 'Deze werkruimte',
  'mediaLib.rights.ownerLicensed': 'Licentie van iemand anders',
  'mediaLib.rights.ownerUgc': 'Een klant of maker gaf toestemming',
  'mediaLib.rights.licenseLabel': 'Licentie- of toestemmingsreferentie',
  'mediaLib.rights.peopleLabel': 'Er verschijnen mensen in dit bestand',
  'mediaLib.rights.peopleConsent':
    'Iedereen die wordt getoond, heeft ermee ingestemd om te worden gepubliceerd',
  'mediaLib.rights.musicLabel': 'Dit bestand bevat muziek of een soundtrack',
  'mediaLib.rights.confirm':
    "Ik heb de rechten om dit bestand te publiceren, inclusief alle mensen, muziek, logo's en merken erin.",
  'mediaLib.rights.blocking':
    'Dit bestand kan pas worden gepland als de rechten zijn gedeclareerd.',

  'mediaLib.editor.heading': 'Afbeelding bewerken',
  'mediaLib.editor.description':
    'Elke bewerking wordt opgeslagen als een nieuwe versie. Het originele bestand blijft behouden en kan worden hersteld.',
  'mediaLib.editor.tab.crop': 'Bijsnijden',
  'mediaLib.editor.tab.transform': 'Formaat wijzigen en roteren',
  'mediaLib.editor.tab.canvas': 'Doek',
  'mediaLib.editor.tab.output': 'Formaat en grootte',
  'mediaLib.editor.tab.thumbnail': 'Miniatuur',
  'mediaLib.editor.presetLabel': 'Aspect-voorinstelling',
  'mediaLib.editor.presetFree': 'Gratis',
  'mediaLib.editor.presetFor': '{ratio}, gebruikt door {accounts}',
  'mediaLib.editor.cropX': 'Bijsnijden vanaf de beginrand',
  'mediaLib.editor.cropY': 'Bijsnijden vanaf de bovenkant',
  'mediaLib.editor.cropWidth': 'Gewasbreedte',
  'mediaLib.editor.cropHeight': 'Gewashoogte',
  'mediaLib.editor.cropKeyboardHint':
    'Het bijsnijdvak is ingesteld met cijfervelden en werkt dus volledig vanaf het toetsenbord.',
  'mediaLib.editor.widthLabel': 'Breedte in pixels',
  'mediaLib.editor.heightLabel': 'Hoogte in pixels',
  'mediaLib.editor.lockRatio': 'Houd de huidige verhouding aan',
  'mediaLib.editor.rotateLabel': 'Rotatie',
  'mediaLib.editor.rotateDegrees': '{degrees} graden',
  'mediaLib.editor.flipHorizontal': 'Draai over de verticale as',
  'mediaLib.editor.flipVertical': 'Draai langs de horizontale as',
  'mediaLib.editor.canvasColor': 'Achtergrondkleur',
  'mediaLib.editor.canvasFit': 'Hoe de afbeelding op het canvas staat',
  'mediaLib.editor.canvasFitCover': 'Vul het canvas en snijd de overloop bij',
  'mediaLib.editor.canvasFitContain': 'Pas het hele plaatje aan en vul de rest op',
  'mediaLib.editor.formatLabel': 'Uitvoerformaat',
  'mediaLib.editor.qualityLabel': 'Compressiekwaliteit',
  'mediaLib.editor.qualityValue': '{value} van 100',
  'mediaLib.editor.estimatedSize': 'Geschatte uitvoer {size}, van {original}',
  'mediaLib.editor.estimatedSizeUnknown':
    'De uitvoergrootte is pas bekend zodra het bestand is verwerkt.',
  'mediaLib.editor.thumbnailHelp':
    'Kies het frame of bestand dat wordt gebruikt als videominiatuur en waar het platform er een accepteert.',
  'mediaLib.editor.thumbnailFrame': 'Kader bij {time}',
  'mediaLib.editor.save': 'Opslaan als een nieuwe versie',
  'mediaLib.editor.saving': 'Versie {version} opslaan',
  'mediaLib.editor.saved': 'Versie {version} opgeslagen. Het origineel is er nog.',
  'mediaLib.editor.discard': 'Negeer deze bewerkingen',
  'mediaLib.editor.noChanges': 'Er zijn nog geen wijzigingen om op te slaan.',
  'mediaLib.editor.revalidate':
    'Bij het opslaan wordt dit bestand opnieuw gecontroleerd voor elk account in de concepten dat er gebruik van maakt.',
  'mediaLib.editor.noGeneration':
    'Deze editor wijzigt het bestand dat u heeft geüpload. Het creëert geen nieuwe beelden.',

  'mediaLib.versions.heading': 'Versies',
  'mediaLib.versions.original': 'Origineel geüpload',
  'mediaLib.versions.current': 'Huidige versie',
  'mediaLib.versions.restore': 'Versie {version} herstellen',
  'mediaLib.versions.item': 'Versie {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'Waar dit bestand vandaan komt',
  'mediaLib.provenance.sourceUrl': 'Bron-URL',
  'mediaLib.provenance.fetchedAt': '{date} opgehaald',
  'mediaLib.provenance.declaredAuthor': 'Verklaarde auteur',
  'mediaLib.provenance.declaredLicense': 'Vermelde licentie',
  'mediaLib.provenance.contentCredentials': 'Ingebedde inhoudsreferenties',
  'mediaLib.provenance.contentCredentialsNone':
    'Dit bestand bevat geen ingebedde inhoudsreferenties. Dat is gebruikelijk en betekent niet dat er iets mis is.',
  'mediaLib.provenance.unverified':
    'Deze details komen van de bron, niet van Relay. Controleer ze voordat u erop vertrouwt.',

  'mediaLib.picker.title': 'Kies medium',
  'mediaLib.picker.description':
    'Bestanden worden gecontroleerd aan de hand van de accounts die in dit concept zijn geselecteerd.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Kies bestanden} one {Voeg # bestand toe} other {Voeg # bestanden toe}}',
  'mediaLib.picker.forMaster': 'Toevoeging aan het hoofdconcept',
  'mediaLib.picker.forVariant': 'Alleen toevoeging aan de versie voor {account}',
} as const;
