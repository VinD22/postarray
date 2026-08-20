/**
 * The three project-led use case pages.
 *
 * These describe workflows, not capabilities. The rule that binds every string
 * here: a sentence may describe how the product is designed and what has been
 * built, and may never imply that anything reaches a platform. Nothing
 * publishes, so "what works today" is written in the past and present tense of
 * the build, not of a live service.
 */
export const webUseCaseMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.useCases.title': 'Use cases',
  'web.meta.useCases.description':
    'Drie workflows waar dit product omheen wordt gebouwd: meerdere klanten op één plek beheren, werk laten goedkeuren voordat het naar buiten gaat, en één idee naar meerdere platforms brengen zonder het te herschrijven.',
  'web.meta.useCase.clients.title': 'Meerdere klanten beheren',
  'web.meta.useCase.clients.description':
    'Aparte merken, aparte gekoppelde accounts, aparte goedkeuringen en aparte rapportage, voor teams die publiceren namens andere mensen.',
  'web.meta.useCase.approvals.title': 'Goedkeuringsworkflows',
  'web.meta.useCase.approvals.description':
    'Hoe een concept een goedgekeurd bericht wordt: wie het beoordeelt, wat een goedkeuring ongeldig maakt, en waarom dezelfde regel op elk oppervlak geldt.',
  'web.meta.useCase.crossPlatform.title': 'Cross-platform publiceren',
  'web.meta.useCase.crossPlatform.description':
    'Eén hoofdconcept, één aangepaste versie per platform, gevalideerd tegen de vastgelegde limieten van elk platform voordat er iets wordt gepland.',

  /* ---------------------------------------------------------------------- */
  /* Shared furniture                                                       */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': 'Use cases',
  'web.useCases.index.lede':
    'Drie workflows waar dit product omheen wordt gebouwd. Elke pagina vertelt wat de workflow een team vandaag kost, hoe het product is ontworpen om ermee om te gaan, en welke delen daadwerkelijk gebouwd zijn.',
  'web.useCases.index.listLabel': 'Use cases',

  'web.useCases.notice.title': 'Dit beschrijft een ontwerp, geen draaiende dienst',
  'web.useCases.notice.body':
    'Geen enkele connector is geverifieerd in productie, dus er wordt nog nergens iets van deze pagina gepubliceerd. Waar een deel van de workflow gebouwd is, staat dat er. Waar dat niet zo is, staat dat er ook.',

  'web.useCases.section.problem': 'Het probleem',
  'web.useCases.section.approach': 'Hoe het product is ontworpen',
  'web.useCases.section.today': 'Wat daadwerkelijk gebouwd is',
  'web.useCases.section.related': 'Gerelateerd',

  /* ---------------------------------------------------------------------- */
  /* Managing multiple clients                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': 'Meerdere klanten beheren',
  'web.useCases.clients.lede':
    'Werk voor de ene klant mag nooit één verkeerde klik verwijderd zijn van het publiek van een andere klant.',
  'web.useCases.clients.problem':
    'De meeste teams scheiden klanten door voorzichtig te zijn. Eén gedeeld account bevat elke gekoppelde pagina, één agenda bevat elke planning, en het enige dat tussen het concept van een klant en het verkeerde publiek staat, is de persoon die om 18 uur naar het scherm kijkt. Als iemand het team verlaat, verdwijnt de scheiding met de gewoonte.',
  'web.useCases.clients.approach1':
    'Een merk is de eenheid van scheiding. Gekoppelde accounts, concepten, wachtrijen, media en bevestigingen horen bij een merk, en een lid ziet alleen de merken waaraan hij of zij is toegevoegd.',
  'web.useCases.clients.approach2':
    'De scheiding wordt drie keer afgedwongen: bij authenticatie, in de toepassingsservice die de actie autoriseert, en in de database zelf via beveiliging op rijniveau. Ingelogd zijn wordt nooit als toestemming behandeld.',
  'web.useCases.clients.approach3':
    'Rapportage volgt dezelfde grens, dus een rapport per klant is de standaardvorm in plaats van een spreadsheet die iemand met de hand samenstelt.',
  'web.useCases.clients.today':
    'Merken, merk-gescoopt lidmaatschap en de beveiligingsregels op rijniveau daarachter zijn gebouwd en getest, inclusief tests die lezen tussen merken proberen en verifiëren dat die mislukken. Abonnementen zijn afgestemd op hoeveel merken een team nodig heeft. Er wordt nog vanuit geen enkel merk naar een platform gepubliceerd.',

  /* ---------------------------------------------------------------------- */
  /* Approval workflows                                                     */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': 'Goedkeuringsworkflows',
  'web.useCases.approvals.lede': 'Een goedkeuring is alleen iets waard als het goedgekeurde ook is wat naar buiten gaat.',
  'web.useCases.approvals.problem':
    'Goedkeuringen leven meestal buiten de tool die publiceert. Een screenshot gaat naar een klant, de klant antwoordt ja, en dan verandert de tekst. De goedkeuring verwijst nu naar een concept dat niemand heeft, en de tool heeft geen idee, dus publiceert het wat het laatst is meegegeven.',
  'web.useCases.approvals.approach1':
    'Een goedkeuring is gekoppeld aan precies de inhoud die is beoordeeld. Het bewerken van een goedgekeurd concept maakt de goedkeuring ongeldig en zegt welk veld is veranderd, in plaats van de oude beslissing stilzwijgend voort te zetten.',
  'web.useCases.approvals.approach2':
    'Een beoordelaar kan goedkeuren, wijzigingen aanvragen of afwijzen, en een opmerking is verplicht voor alles behalve goedkeuring, zodat de auteur nooit hoeft te raden wat er moet worden opgelost.',
  'web.useCases.approvals.approach3':
    'De regel leeft in de gedeelde applicatielaag, dus de webapp, de REST-API, de MCP-server, de CLI en webhooks houden zich er allemaal aan. Geen enkel oppervlak heeft een sluiproute langs de beoordeling.',
  'web.useCases.approvals.today':
    'De goedkeuringsstatussen, het beoordelingsoppervlak, de regels voor herhaalde goedkeuring en de audit-events daarachter zijn gebouwd. Wat niet gebouwd is, is de laatste stap, omdat geen enkele connector zijn definition of done heeft gehaald, dus een goedgekeurd bericht heeft nog nergens naartoe.',

  /* ---------------------------------------------------------------------- */
  /* Cross-platform publishing                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': 'Cross-platform publiceren',
  'web.useCases.crossPlatform.lede':
    'Eén idee, één bewerking, en een versie per platform die respecteert wat dat platform daadwerkelijk accepteert.',
  'web.useCases.crossPlatform.problem':
    'Overal dezelfde tekst plaatsen levert een versie op die op het ene platform is afgekapt, op een ander een verplichte titel mist, en op een derde een link draagt die stilletjes wordt verwijderd. Het alternatief, vijf keer met de hand herschrijven, is waar het werk eigenlijk naartoe gaat.',
  'web.useCases.crossPlatform.approach1':
    'Een hoofdconcept bevat het idee. Elk geselecteerd account krijgt zijn eigen versie, en een bewerking van het hoofdconcept geldt alleen waar die past, en zegt duidelijk welke doelen het niet konden overnemen en waarom.',
  'web.useCases.crossPlatform.approach2':
    'Validatie draait tegen de vastgelegde limieten voor elk platform, geteld zoals dat platform telt, zodat een tekenlimiet wordt gecontroleerd in grafemen waar het platform grafemen gebruikt en in gewogen eenheden waar het die gebruikt.',
  'web.useCases.crossPlatform.approach3':
    'Elke platformlimiet die ergens op deze site wordt getoond, wordt gegenereerd uit het connectorregister en draagt het document waar hij vandaan komt en de datum waarop iemand het heeft gelezen.',
  'web.useCases.crossPlatform.today':
    'De opsteller, de versies per doel, de validatieregels en de gegenereerde limietenset zijn gebouwd. De publicatiestap niet: geen enkele connector is geverifieerd in productie, dus een gevalideerd concept kan intern worden gepland en kan geen platform bereiken.',
} as const;
