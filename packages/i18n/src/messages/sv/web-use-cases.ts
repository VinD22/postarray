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

  'web.meta.useCases.title': 'Användningsfall',
  'web.meta.useCases.description':
    'Tre arbetsflöden som denna produkt byggs kring: att driva flera kunder på ett ställe, få arbete godkänt innan det går ut, och ta en idé till flera plattformar utan att skriva om den.',
  'web.meta.useCase.clients.title': 'Hantera flera kunder',
  'web.meta.useCase.clients.description':
    'Separata projekt, separata anslutna konton, separata godkännanden och separat rapportering, för team som publicerar å andra personers vägnar.',
  'web.meta.useCase.approvals.title': 'Godkännandeflöden',
  'web.meta.useCase.approvals.description':
    'Hur ett utkast blir ett godkänt inlägg: vem granskar det, vad ogiltigförklarar ett godkännande, och varför samma regel gäller på varje yta.',
  'web.meta.useCase.crossPlatform.title': 'Publicering på flera plattformar',
  'web.meta.useCase.crossPlatform.description':
    'Ett huvudutkast, en anpassad version per plattform, validerad mot varje plattforms registrerade gränser innan något schemaläggs.',

  /* ---------------------------------------------------------------------- */
  /* Shared furniture                                                       */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': 'Användningsfall',
  'web.useCases.index.lede':
    'Tre arbetsflöden som denna produkt byggs kring. Varje sida säger vad arbetsflödet kostar ett team idag, hur produkten är utformad för att hantera det, och vilka delar som faktiskt är byggda.',
  'web.useCases.index.listLabel': 'Användningsfall',

  'web.useCases.notice.title': 'Detta beskriver en design, inte en fungerande tjänst',
  'web.useCases.notice.body':
    'Ingen anslutning är verifierad i produktion, så inget på denna sida publicerar någonstans än. Där en del av arbetsflödet är byggt, står det. Där det inte är det, står det också.',

  'web.useCases.section.problem': 'Problemet',
  'web.useCases.section.approach': 'Hur produkten är utformad',
  'web.useCases.section.today': 'Vad som faktiskt är byggt',
  'web.useCases.section.related': 'Relaterat',

  /* ---------------------------------------------------------------------- */
  /* Managing multiple clients                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': 'Hantera flera kunder',
  'web.useCases.clients.lede':
    'Arbete för en kund ska aldrig vara ett felklick från en annan kunds publik.',
  'web.useCases.clients.problem':
    'De flesta team separerar kunder genom att vara försiktiga. Ett delat konto rymmer varje ansluten sida, en kalender rymmer varje schema, och det enda som står mellan en kunds utkast och fel publik är personen som tittar på skärmen klockan sex på kvällen. När någon lämnar teamet, försvinner separationen med vanan.',
  'web.useCases.clients.approach1':
    'Ett projekt är separationsenheten. Anslutna konton, utkast, köer, media och kvitton hör till ett projekt, och en medlem ser bara de projekt de har lagts till i.',
  'web.useCases.clients.approach2':
    'Separationen upprätthålls tre gånger: vid autentisering, i applikationstjänsten som auktoriserar åtgärden, och i själva databasen genom radnivåsäkerhet. Att vara inloggad behandlas aldrig som behörighet.',
  'web.useCases.clients.approach3':
    'Rapportering följer samma gräns, så en rapport per kund är standardformen snarare än ett kalkylblad någon sätter ihop för hand.',
  'web.useCases.clients.today':
    'Projekt, projektbegränsat medlemskap och säkerhetspolicyerna på radnivå bakom dem är byggda och testade, inklusive tester som försöker läsa över projekt och verifierar att de misslyckas. Planer dimensioneras efter hur många projekt ett team behöver. Inget publiceras än till en plattform från något projekt.',

  /* ---------------------------------------------------------------------- */
  /* Approval workflows                                                     */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': 'Godkännandeflöden',
  'web.useCases.approvals.lede':
    'Ett godkännande är bara värt något om det som godkändes är det som går ut.',
  'web.useCases.approvals.problem':
    'Godkännanden lever oftast utanför verktyget som publicerar. En skärmdump går till en kund, kunden svarar ja, och sedan ändras texten. Godkännandet syftar nu på ett utkast ingen har, och verktyget vet inget om det, så det publicerar vad det senast fick.',
  'web.useCases.approvals.approach1':
    'Ett godkännande är kopplat till exakt det innehåll som granskades. Att redigera ett godkänt utkast ogiltigförklarar godkännandet och säger vilket fält som ändrades, i stället för att tyst föra det gamla beslutet vidare.',
  'web.useCases.approvals.approach2':
    'En granskare kan godkänna, begära ändringar eller avslå, och en kommentar krävs för allt utom godkännande, så författaren behöver aldrig gissa vad som ska rättas.',
  'web.useCases.approvals.approach3':
    'Regeln lever i det delade applikationslagret, så webbappen, REST-API:et, MCP-servern, CLI:t och webhooks följer den alla. Ingen yta har en genväg runt granskningen.',
  'web.useCases.approvals.today':
    'Godkännandestatusarna, granskningsytan, reglerna för ny godkännande och revisionshändelserna bakom dem är byggda. Vad som inte är byggt är det sista steget, eftersom ingen anslutning har klarat sin definition of done, så ett godkänt inlägg har ännu ingenstans att gå.',

  /* ---------------------------------------------------------------------- */
  /* Cross-platform publishing                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': 'Publicering på flera plattformar',
  'web.useCases.crossPlatform.lede':
    'En idé, en redigering och en version per plattform som respekterar vad den plattformen faktiskt accepterar.',
  'web.useCases.crossPlatform.problem':
    'Att publicera samma text överallt ger en version som trunkeras på en plattform, saknar en obligatorisk titel på en annan, och bär en länk som en tredje tyst tar bort. Alternativet, att skriva om för hand fem gånger, är dit arbetet egentligen går.',
  'web.useCases.crossPlatform.approach1':
    'Ett huvudutkast rymmer idén. Varje valt konto får sin egen version, och en redigering av huvudutkastet tillämpas bara där den passar, och säger tydligt vilka mål som inte kunde ta emot den och varför.',
  'web.useCases.crossPlatform.approach2':
    'Validering körs mot de registrerade gränserna för varje plattform, räknade på det sätt plattformen räknar, så en teckengräns kontrolleras i grafem där plattformen använder grafem och i viktade enheter där den använder sådana.',
  'web.useCases.crossPlatform.approach3':
    'Varje plattformsgräns som visas någonstans på denna webbplats genereras från connectorregistret och bär dokumentet den kommer från och datumet en person läste det.',
  'web.useCases.crossPlatform.today':
    'Redigeraren, versionerna per mål, valideringsreglerna och den genererade gränsuppsättningen är byggda. Publiceringssteget är det inte: ingen anslutning är verifierad i produktion, så ett validerat utkast kan schemaläggas internt men kan inte nå en plattform.',
} as const;
