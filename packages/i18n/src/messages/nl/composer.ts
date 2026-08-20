/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Componeren',
  'composer.titleWithProject': 'Componeer voor {project}',
  'composer.master.label': 'Hoofdontwerp',
  'composer.master.description':
    'Schrijf hier een keer. Compatibele wijzigingen bereiken elk geselecteerd doel. Open een doel om een ​​versie te schrijven die alleen dat account zal ontvangen.',
  'composer.master.globalEdit': 'Globale bewerking',
  'composer.master.placeholder': 'Wat wil je publiceren?',
  'composer.brief.label': 'Kort',
  'composer.brief.placeholder': 'Beschrijf het idee, het publiek en het gewenste resultaat.',
  'composer.sources.label': 'Bronreferenties',
  'composer.sources.empty': 'Geen bronnen bijgevoegd.',
  'composer.campaign.label': 'Campagne',
  'composer.campaign.none': 'Geen campagne',
  'composer.contentLocale.label': 'Inhoudelijke taal',
  'composer.contentLocale.help': 'De taal van het bericht. Dit staat los van uw interfacetaal.',
  'composer.market.label': 'Publieksmarkt',

  'composer.targets.title': 'Doelstellingen',
  'composer.targets.count':
    '{count, plural, =0 {Geen accounts geselecteerd} one {# account} other {# accounts}}',
  'composer.targets.publishSummary':
    '{count, plural, one {Dit wordt gepubliceerd op # account} other {Dit wordt gepubliceerd op # accounts}} {when, select, nu {now} gepland {op de geplande tijd} other {}}',
  'composer.targets.add': 'Voeg accounts toe',
  'composer.targets.empty': 'Selecteer ten minste één account om naar te publiceren.',
  'composer.targets.state.ready': 'Klaar',
  'composer.targets.state.inherited': 'Geërfd van meester',
  'composer.targets.state.overridden': 'Overschreven',
  'composer.targets.state.warning': 'Controleer voordat u publiceert',
  'composer.targets.state.error': 'Heeft een oplossing nodig',
  'composer.targets.state.approvalNeeded': 'Goedkeuring nodig',
  'composer.targets.overrideBadge': 'Overschrijven',
  'composer.targets.resetConfirm.title': 'Dit doel resetten naar het hoofdconcept?',
  'composer.targets.resetConfirm.body':
    'De kopie, media en instellingen die u voor {account} hebt gewijzigd, worden vervangen door het hoofdconcept. Andere doelen worden niet beïnvloed.',
  'composer.targets.divergence':
    '{count, plural, one {# doel verschilt van het hoofdconcept} other {# doelen verschillen van het hoofdconcept}}',

  'composer.applyToAll.title': 'Toepassen op alle doelen',
  'composer.applyToAll.compatible':
    '{count, plural, one {# veld is compatibel met elk geselecteerd doel} other {# velden zijn compatibel met elk geselecteerd doel}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# veld kan niet worden toegepast en blijft per doel} other {# velden kunnen niet worden toegepast en blijft per doel}}',
  'composer.applyToAll.creates':
    'Door toe te passen wordt voor elk doel een expliciete versie gemaakt.',

  'composer.editor.label': 'Tekst plaatsen',
  'composer.editor.characterCount': '{used} van {limit}-tekens',
  'composer.editor.characterCountOver': '{over}-tekens overschrijden de tekenlimiet van {limit}',
  'composer.editor.characterCountUnknown': 'Tekenlimiet niet beschikbaar voor dit account',
  'composer.editor.remaining': '{count, plural, one {# teken over} other {# tekens over}}',
  'composer.editor.hashtagCount': '{count, plural, one {# hashtag} other {# hashtags}}',
  'composer.editor.formatting': 'Opmaak',
  'composer.editor.emoji': 'Emoji',
  'composer.editor.mention': 'Vermeld',
  'composer.editor.link': 'Koppeling',

  'composer.mentions.search': "Zoek mensen, pagina's en bedrijven",
  'composer.mentions.searching': 'Zoeken naar {provider}',
  'composer.mentions.resolved': 'Getagd {label} op {provider}',
  'composer.mentions.unresolved':
    'Deze vermelding is nog niet gekoppeld aan een {provider}-account. Het wordt gepubliceerd als platte tekst totdat u een resultaat selecteert.',
  'composer.mentions.noResults': 'Geen overeenkomende accounts op {provider}.',
  'composer.mentions.unsupported': 'Native tagging is niet beschikbaar voor dit account.',

  'composer.destination.label': 'Bestemming',
  'composer.destination.placeholder': 'Kies waar dit wordt gepubliceerd',
  'composer.destination.community': 'Gemeenschap',
  'composer.destination.board': 'Bord',
  'composer.destination.group': 'Groep',
  'composer.destination.page': 'Pagina',
  'composer.destination.organization': 'Organisatie',
  'composer.destination.channel': 'Kanaal',
  'composer.destination.refresh': 'Bestemmingen vernieuwen',
  'composer.destination.lastRefreshed': 'Bestemmingen vernieuwd {relativeTime}',

  'composer.media.title': 'Media',
  'composer.media.count': '{count, plural, one {# bestand} other {# bestanden}}',
  'composer.media.dropHint': 'Sleep bestanden hierheen of blader door uw bibliotheek.',
  'composer.media.inheritFromMaster': 'Gebruik van de mastermedia',
  'composer.media.overridden': 'Dit doelwit gebruikt zijn eigen media',
  'composer.media.altText.label': 'Alt-tekst',
  'composer.media.altText.placeholder':
    'Beschrijf de afbeelding voor mensen die een schermlezer gebruiken.',
  'composer.media.altText.missing': 'Alt-tekst ontbreekt.',
  'composer.media.altText.waive': 'Deze afbeelding heeft geen alt-tekst nodig',
  'composer.media.altText.generate': 'Schrijf alt-tekst',
  'composer.media.crop': 'Bijsnijden',
  'composer.media.resize': 'Formaat wijzigen',
  'composer.media.rotate': 'Draaien',
  'composer.media.compress': 'Comprimeren',
  'composer.media.convertFormat': 'Formaat converteren',
  'composer.media.thumbnail': 'Miniatuur',
  'composer.media.aspectPreset': 'Platformvoorinstelling',
  'composer.media.original': 'Origineel',
  'composer.media.originalPreserved':
    'Het originele bestand wordt bewaard. Bewerkingen creëren een nieuwe versie.',
  'composer.media.uploading': '{name} uploaden',
  'composer.media.processing': '{name} voorbereiden',
  'composer.media.rights.label': 'Rechten en toestemming',
  'composer.media.rights.confirm':
    "Ik heb de rechten om deze media te publiceren, inclusief alle mensen, muziek, logo's en merken daarin.",

  'composer.sequence.title': 'Opmerkingen en draad',
  'composer.sequence.root': 'Hoofdpost',
  'composer.sequence.item': 'Artikel {position}',
  'composer.sequence.add': 'Voeg commentaar of draaditem toe',
  'composer.sequence.delayLabel': 'Vertraging na het vorige item',
  'composer.sequence.delayImmediate': 'Onmiddellijk',
  'composer.sequence.delayMinutes': '{count, plural, one {# minuut} other {# minuten}}',
  'composer.sequence.delayCustom': 'Aangepaste vertraging',
  'composer.sequence.accountLabel': 'Publiceer dit item als',
  'composer.sequence.unsupported': 'Dit account ondersteunt geen geplande vervolgitems.',

  'composer.repeat.title': 'Herhaal',
  'composer.repeat.off': 'Herhaal niet',
  'composer.repeat.everyDays': '{count, plural, one {Elke dag} other {Elke # dagen}}',
  'composer.repeat.endLabel': 'Houd op met herhalen',
  'composer.repeat.endOnDate': 'Op een date',
  'composer.repeat.endAfterCount': 'Na een aantal berichten',
  'composer.repeat.endRequired': 'Kies een einddatum of een aantal herhalingen.',
  'composer.repeat.summary':
    'Herhaalt {cadence} tot {end}. Elke gebeurtenis krijgt zijn eigen goedkeuring en ontvangstbewijs.',

  'composer.links.title': 'Koppelingen',
  'composer.links.keepOriginal': 'Behoud de originele URL',
  'composer.links.track': 'Vervangen door een getraceerde korte link',
  'composer.links.utm': 'UTM-parameters',
  'composer.links.domain': 'Domein koppelen',
  'composer.links.finalUrl': 'Dit wordt gepubliceerd als {url}',
  'composer.links.frozenAtApproval':
    'De exacte korte URL en bestemming worden bevroren in de goedgekeurde versie.',

  'composer.signature.title': 'Handtekening',
  'composer.signature.none': 'Geen handtekening',
  'composer.signature.autoApplied':
    'Handtekening {name} is automatisch toegevoegd. Je kunt het veranderen.',

  'composer.set.title': 'Stelt in',
  'composer.set.startFrom': 'Begin met een set',
  'composer.set.continueWithout': 'Ga verder zonder een set',
  'composer.set.applied': 'Toegepaste set {name}. Dit ontwerp is nu onafhankelijk van de Set.',

  'composer.validation.title': 'Validatie',
  'composer.validation.clean': 'Er zijn geen problemen gevonden voor de geselecteerde doelen.',
  'composer.validation.issueCount':
    '{count, plural, one {# probleem} other {# problemen}} in {targets, plural, one {# doel} other {# doelen}}',
  'composer.validation.blocking': 'Dit moet vóór de planning worden opgelost.',
  'composer.validation.warning': 'Controleer dit voordat u publiceert.',
  'composer.validation.revalidated':
    'Opnieuw gecontroleerd aan de hand van de huidige platformlimieten {relativeTime}.',

  'composer.preview.title': 'Voorbeeld',
  'composer.preview.forAccount': 'Preview voor {account} op {provider}',
  'composer.preview.approximate':
    'In deze preview worden de platformregels gebruikt die we hebben vastgelegd. Het gepubliceerde bericht kan verschillen als het platform verandert.',
  'composer.preview.unavailable': 'Er is nog geen echte preview beschikbaar voor dit account.',

  'composer.cost.title': 'Geschatte kosten van de provider',
  'composer.cost.estimate': '{provider} schat het API-gebruik van {amount} voor dit bericht.',
  'composer.cost.linkSurcharge':
    '{provider} brengt meer in rekening voor berichten die een URL bevatten. Als u de koppeling verwijdert, wordt de schatting verlaagd.',
  'composer.cost.bulkWarning':
    '{count, plural, one {# publicatie} other {# publicaties}} in één actie. Controleer de schatting voordat u doorgaat.',
  'composer.cost.reconciled': 'Het werkelijke gebruik wordt na publicatie afgestemd.',
  'composer.cost.none': 'Geen gemeten providerkosten voor dit bericht.',

  'composer.autosave.saving': 'Opslaan',
  'composer.autosave.saved': '{relativeTime} opgeslagen',
  'composer.autosave.offline':
    'Offline. Je concept wordt op dit apparaat bewaard en gesynchroniseerd.',
  'composer.autosave.conflict':
    '{name} heeft dit concept bewerkt terwijl u aan het schrijven was. Controleer beide versies voordat u ze opslaat.',
  'composer.autosave.failed': 'Kan niet opslaan. Je tekst staat er nog. Opnieuw proberen.',

  'composer.ai.title': 'Assisteren',
  'composer.ai.makeConcise': 'Maak het beknopter',
  'composer.ai.adaptForPlatform': 'Aanpassen voor {provider}',
  'composer.ai.transcreate': 'Transcreëren naar {language}',
  'composer.ai.checkClaims': 'Controleer claims',
  'composer.ai.writeAltText': 'Schrijf alt-tekst',
  'composer.ai.suggestHooks': 'Stel haken voor',
  'composer.ai.suggestCta': 'Stel een call-to-action voor',
  'composer.ai.diffTitle': 'Voorgestelde wijziging',
  'composer.ai.diffHelp': 'Er verandert niets totdat u het accepteert.',
  'composer.ai.working': 'Er wordt aan gewerkt',
  'composer.ai.sources':
    'Gebaseerd op {count, plural, one {# bron} other {# bronnen}} die u heeft goedgekeurd',
  'composer.ai.uncertain':
    'Deze zin heeft geen zuiver equivalent in {language}. Bespreek het met een moedertaalspreker voordat u het publiceert.',

  'composer.schedule.title': 'Schema',
  'composer.schedule.dateLabel': 'Datum',
  'composer.schedule.timeLabel': 'Tijd',
  'composer.schedule.timeZoneLabel': 'Tijdzone',
  'composer.schedule.nextFreeSlot': 'Volgende gratis slot',
  'composer.schedule.localAndUtc': '{local} in {timeZone}. {utc} UTC.',
  'composer.schedule.dstWarning':
    'De klokken veranderen op deze datum in {timeZone}. Dit bericht draait op {local}, wat {utc} UTC is.',
  'composer.schedule.pastWarning': 'Die tijd is voorbij. Kies een later tijdstip.',
  'composer.schedule.confirmTitle': 'Bevestig vóór het plannen',
  'composer.schedule.confirmPublishNow': 'Bevestig voordat u nu publiceert',
  'composer.schedule.approverLabel': 'Goedkeurder',
  'composer.schedule.policyLabel': 'Goedkeuringsbeleid',
  'composer.schedule.duplicateWarning':
    'Er is soortgelijke inhoud gepubliceerd als {account} {relativeTime}. Als u het opnieuw publiceert, kan dit in strijd zijn met de platformregels inzake dubbele inhoud.',
  'composer.schedule.cadenceWarning':
    '{account} heeft al {count, plural, one {# post} other {# posts}} gepland voor die dag.',
} as const;
