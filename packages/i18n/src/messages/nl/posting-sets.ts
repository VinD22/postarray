/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 *
 * Three features that all answer "who is this going to, and when", grouped in
 * one namespace so their vocabulary stays consistent. The hold copy is the part
 * most worth reading twice: pausing stops work that has not happened, and every
 * sentence here has to say that plainly rather than implying a post can be
 * pulled back off a platform.
 */
export const postingSetMessages = {
  /* ------------------------------------------------------------- the hold */
  'calendar.hold.action': 'Pauzeren',
  'calendar.hold.resumeAction': 'Hervatten',
  'calendar.hold.badge': 'Gepauzeerd',
  'calendar.hold.badgeBilling': 'Gepauzeerd wegens facturering',
  'calendar.hold.term': 'Pauze',
  'calendar.hold.byPerson': 'Door jou gepauzeerd op {date}.',
  'calendar.hold.byBilling': 'Gepauzeerd op {date} omdat deze werkruimte volledige toegang verloor.',
  'calendar.hold.none': 'Niet gepauzeerd',

  'calendar.hold.confirmTitle': 'Dit bericht pauzeren?',
  'calendar.hold.confirmBody':
    'Dit bericht blijft staan waar het staat en wordt niet gepubliceerd om {time}. Je kunt het op elk moment daarvoor hervatten, of een nieuw tijdstip kiezen als dat al is verstreken.',
  'calendar.hold.confirmScope':
    'Pauzeren stopt wat nog niet is gebeurd. Alles wat al op een platform is gepubliceerd, blijft gepubliceerd, en pauzeren verwijdert of bewerkt het niet.',
  'calendar.hold.confirmNoteLabel': 'Waarom pauzeer je dit? (optioneel)',
  'calendar.hold.confirmNoteHint':
    'Bewaard in het auditlogboek voor je team. Wordt niet naar een platform verzonden.',
  'calendar.hold.confirm': 'Pauzeer dit bericht',
  'calendar.hold.cancel': 'Laat het gepland staan',

  'calendar.hold.resumeTitle': 'Dit bericht hervatten?',
  'calendar.hold.resumeBody': 'Het wordt gepubliceerd om {time}, in {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'Dat tijdstip is verstreken',
  'calendar.hold.resumeMissedBody':
    'Dit bericht stond gepland voor {time} terwijl het gepauzeerd was. Kies een nieuw tijdstip zodat het niet meteen wordt gepubliceerd zodra je hervat.',
  'calendar.hold.resumeTimeLabel': 'Nieuw publicatietijdstip',
  'calendar.hold.resumeConfirm': 'Hervatten',

  'calendar.hold.paused': 'Gepauzeerd. Wordt niet gepubliceerd totdat je het hervat.',
  'calendar.hold.resumed': 'Hervat. Wordt gepubliceerd om {time}.',

  'calendar.hold.blocked.published':
    'Dit bericht is al gepubliceerd. Pauzeren kan het niet van het platform terughalen.',
  'calendar.hold.blocked.inFlight':
    'Dit bericht wordt op dit moment verzonden. Het is te laat om het te pauzeren, en halverwege stoppen zou het gedeeltelijk gepubliceerd kunnen achterlaten.',
  'calendar.hold.blocked.finished': 'Dit bericht is al afgerond, dus er is niets te pauzeren.',
  'calendar.hold.blocked.billing':
    'Dit bericht staat in de wacht omdat deze werkruimte volledige toegang verloor. Het hervatten is een factureringskwestie, geen planningskwestie.',
  'calendar.hold.blocked.billingAction': 'Ga naar facturering',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Publicatiesets',
  'set.lede':
    'Een opgeslagen antwoord op ‘aan wie stuur ik dit, en hoe’. Een Set toepassen kopieert de instellingen ervan naar een nieuw concept.',
  'set.appliedOnce':
    'Een Set wordt maar één keer gelezen, op het moment dat je hem toepast. Hem later bewerken verandert waarmee het volgende bericht begint. Concepten en geplande berichten die je er al van hebt gemaakt, blijven precies zoals ze zijn.',
  'set.empty.title': 'Nog geen Sets',
  'set.empty.body': 'Maak er een aan om te stoppen met het opnieuw opbouwen van dezelfde accountlijst voor elk bericht.',
  'set.create': 'Nieuwe Set',
  'set.edit': 'Set bewerken',
  'set.archive': 'Set archiveren',
  'set.archived': 'Gearchiveerd',
  'set.archivedNote': 'Gearchiveerde Sets zijn verborgen in de kiezer. Berichten die ervan zijn gemaakt, blijven ongewijzigd.',
  'set.showArchived': 'Toon gearchiveerde',
  'set.saved': 'Set opgeslagen.',
  'set.archivedToast': 'Set gearchiveerd. Berichten die er al van zijn gemaakt, blijven ongewijzigd.',

  'set.field.name': 'Naam',
  'set.field.nameHint': 'Waar je later naar zoekt in de kiezer. Eén per merk.',
  'set.field.description': 'Beschrijving',
  'set.field.descriptionHint': 'Optioneel. Waarvoor deze Set is.',
  'set.field.targets': 'Accounts',
  'set.field.targetsHint': 'Elk account waarmee een bericht dat van deze Set is gemaakt, begint.',
  'set.field.targetCount': '{count, plural, =0 {Geen accounts} one {# account} other {# accounts}}',
  'set.field.signature': 'Handtekening',
  'set.field.signatureNone': 'Geen handtekening',
  'set.field.approval': 'Goedkeuring',
  'set.field.approvalHint':
    'De goedkeuring die een bericht dat van deze Set is gemaakt, nodig heeft voordat het kan worden gepubliceerd.',
  'set.field.schedule': 'Wanneer publiceren',

  'set.approval.none': 'Geen goedkeuring nodig',
  'set.approval.single_approver': 'Eén aangewezen goedkeurder',
  'set.approval.any_approver': 'Elke goedkeurder',
  'set.approval.named_approver': 'Een specifieke goedkeurder',
  'set.approval.policy_auto': 'Wat het werkruimtebeleid zegt',

  'set.slot.next_free_slot': 'Volgend vrij tijdstip uit de wachtrij',
  'set.slot.next_free_slotHint':
    'Gebruikt de wachtrijregels van dit merk om een tijdstip voor te stellen. Het stelt voor; jij accepteert.',
  'set.slot.pick_time': 'Vraag mij om een tijdstip',
  'set.slot.pick_timeHint': 'Het toepassen van de Set laat het tijdstip leeg zodat jij het kiest.',
  'set.slot.draft_only': 'Laat het als concept staan',
  'set.slot.draft_onlyHint': 'Het toepassen van de Set raakt de planning helemaal niet aan.',
  'set.slot.noRules':
    'Dit merk heeft nog geen wachtrijregels, dus de wachtrij zal het eerste vrije uur voorstellen en dat ook zeggen.',
  'set.slot.rulesLink': 'Wachtrijregels',

  'set.defaults.title': 'Standaardwaarden per platform',
  'set.defaults.body':
    'Beginwaarden die naar elk nieuw bericht worden gekopieerd. Je kunt ze later allemaal aanpassen in de opsteller.',
  'set.defaults.add': 'Platform toevoegen',
  'set.defaults.remove': 'Standaardwaarden voor {platform} verwijderen',
  'set.defaults.privacy': 'Privacy',
  'set.defaults.privacyNone': 'Platformstandaard',
  'set.defaults.bodyPrefix': 'Tekst vóór het bericht',
  'set.defaults.bodySuffix': 'Tekst na het bericht',
  'set.defaults.requireAltText': 'Alt-tekst verplicht op elke afbeelding',
  'set.defaults.requireAltTextHint':
    'Een bericht dat van deze Set is gemaakt, kan pas voor dit platform worden gepland als elke afbeelding alt-tekst heeft.',
  'set.defaults.empty': 'Geen standaardwaarden per platform. Elk account start vanuit het hoofdbericht.',

  'set.error.nameTaken': 'Een andere Set in dit merk gebruikt die naam al.',
  'set.error.archived': 'Deze Set is gearchiveerd. Herstel hem voordat je hem bewerkt.',
  'set.error.duplicateTarget': 'Dat account zit al in deze Set.',
  'set.error.duplicatePlatform': 'Deze Set heeft al standaardwaarden voor dat platform.',

  /* --------------------------------------------------- remembered targets */
  'targetMemory.setting.title': 'Accounts onthouden tussen berichten',
  'targetMemory.setting.body':
    'Als dit aan staat, begint de opsteller elk nieuw bericht met de accounts die die persoon de vorige keer koos in dit merk. Het staat uit totdat je het aanzet.',
  'targetMemory.setting.stored':
    'Alleen de lijst met accounts wordt bewaard, en alleen voor de persoon die ze koos. Er wordt geen bijschrift, geen tijd, geen privacy-instelling en geen goedkeuringsstatus opgeslagen, en niemand anders in het merk kan jouw lijst zien.',
  'targetMemory.setting.offNote': 'Zolang dit uit staat, wordt er helemaal niets opgeslagen.',
  'targetMemory.setting.turnOffWarning':
    'Dit uitzetten verwijdert elke opgeslagen selectie in dit merk, voor iedereen.',
  'targetMemory.setting.enabled': 'Aan',
  'targetMemory.setting.disabled': 'Uit',
  'targetMemory.setting.saved': 'Instelling opgeslagen.',
  'targetMemory.setting.cleared': 'Instelling opgeslagen. Opgeslagen selecties in dit merk zijn verwijderd.',

  'targetMemory.composer.restored':
    '{count, plural, one {Gestart met # account van de vorige keer.} other {Gestart met # accounts van de vorige keer.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {# account die je de vorige keer gebruikte, is weggelaten omdat het aandacht nodig heeft.} other {# accounts die je de vorige keer gebruikte, zijn weggelaten omdat ze aandacht nodig hebben.}}',
  'targetMemory.composer.droppedAll':
    'Geen van de accounts die je de vorige keer gebruikte, is nu beschikbaar, dus er is niets voorgeselecteerd.',
  'targetMemory.composer.undo': 'Selectie wissen',
  'targetMemory.composer.forget': 'Stop met mijn accounts onthouden',
  'targetMemory.composer.forgotten': 'Je opgeslagen selectie is verwijderd.',
  'targetMemory.composer.reviewAccounts': 'Accounts bekijken',
} as const;
