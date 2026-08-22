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

  'web.meta.useCases.title': 'Případy užití',
  'web.meta.useCases.description':
    'Tři pracovní postupy, kolem kterých je tento produkt budován: vedení několika klientů na jednom místě, schvalování práce před jejím zveřejněním a přenesení jednoho nápadu na několik platforem bez jeho přepisování.',
  'web.meta.useCase.clients.title': 'Správa více klientů',
  'web.meta.useCase.clients.description':
    'Oddělené značky, oddělené propojené účty, oddělená schvalování a oddělené reportování pro týmy publikující jménem jiných lidí.',
  'web.meta.useCase.approvals.title': 'Schvalovací postupy',
  'web.meta.useCase.approvals.description':
    'Jak se z konceptu stává schválený příspěvek: kdo jej kontroluje, co ruší schválení a proč stejné pravidlo platí na každém povrchu.',
  'web.meta.useCase.crossPlatform.title': 'Publikování na více platformách',
  'web.meta.useCase.crossPlatform.description':
    'Jeden hlavní koncept, jedna upravená verze pro každou platformu, ověřená proti zaznamenaným limitům každé platformy dříve, než je cokoli naplánováno.',

  /* ---------------------------------------------------------------------- */
  /* Shared furniture                                                       */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': 'Případy užití',
  'web.useCases.index.lede':
    'Tři pracovní postupy, kolem kterých je tento produkt budován. Každá stránka říká, kolik tento postup dnes stojí tým, jak je produkt navržen, aby si s ním poradil, a které části jsou skutečně postavené.',
  'web.useCases.index.listLabel': 'Případy užití',

  'web.useCases.notice.title': 'Toto popisuje návrh, ne fungující službu',
  'web.useCases.notice.body':
    'Žádný konektor není ověřen v produkci, takže z této stránky se zatím nikam nic nepublikuje. Kde je část postupu postavená, tam to říká. Kde není, říká to také.',

  'web.useCases.section.problem': 'Problém',
  'web.useCases.section.approach': 'Jak je produkt navržen',
  'web.useCases.section.today': 'Co je skutečně postavené',
  'web.useCases.section.related': 'Související',

  /* ---------------------------------------------------------------------- */
  /* Managing multiple clients                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': 'Správa více klientů',
  'web.useCases.clients.lede':
    'Práce pro jednoho klienta by nikdy neměla být jediné špatné kliknutí od publika jiného klienta.',
  'web.useCases.clients.problem':
    'Většina týmů odděluje klienty tím, že jsou opatrné. Jeden sdílený účet obsahuje každou propojenou stránku, jeden kalendář obsahuje každý plán, a jedinou věcí mezi konceptem klienta a špatným publikem je osoba, která se v 18 hodin dívá na obrazovku. Když někdo odejde z týmu, oddělení odchází spolu se zvykem.',
  'web.useCases.clients.approach1':
    'Značka je jednotkou oddělení. Propojené účty, koncepty, fronty, média a potvrzení patří značce a člen vidí jen značky, do kterých byl přidán.',
  'web.useCases.clients.approach2':
    'Oddělení je vynucováno třikrát: při ověřování, v aplikační službě, která akci autorizuje, a v samotné databázi prostřednictvím zabezpečení na úrovni řádků. Přihlášení nikdy není považováno za oprávnění.',
  'web.useCases.clients.approach3':
    'Reportování se řídí stejnou hranicí, takže report pro jednotlivého klienta je výchozí podobou, ne tabulkou, kterou někdo ručně sestavuje.',
  'web.useCases.clients.today':
    'Značky, členství omezené na značku a bezpečnostní pravidla na úrovni řádků za nimi jsou postavené a otestované, včetně testů, které se pokoušejí o čtení napříč značkami a ověřují, že selžou. Plány jsou dimenzovány podle toho, kolik značek tým potřebuje. Z žádné značky se zatím na žádnou platformu nic nepublikuje.',

  /* ---------------------------------------------------------------------- */
  /* Approval workflows                                                     */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': 'Schvalovací postupy',
  'web.useCases.approvals.lede':
    'Schválení má cenu jen tehdy, když to, co bylo schváleno, je to, co jde ven.',
  'web.useCases.approvals.problem':
    'Schválení obvykle žijí mimo nástroj, který publikuje. Snímek obrazovky jde klientovi, klient odpoví ano, a pak se text změní. Schválení teď odkazuje na koncept, který nikdo nemá, a nástroj o tom neví, takže publikuje to, co dostal naposledy.',
  'web.useCases.approvals.approach1':
    'Schválení je připojeno přesně k obsahu, který byl zkontrolován. Úprava schváleného konceptu ruší schválení a říká, které pole se změnilo, místo aby potichu přeneslo staré rozhodnutí dál.',
  'web.useCases.approvals.approach2':
    'Kontrolor může schválit, požádat o změny nebo odmítnout, a komentář je vyžadován pro cokoli jiného než schválení, takže autor nikdy nemusí hádat, co opravit.',
  'web.useCases.approvals.approach3':
    'Pravidlo žije ve sdílené aplikační vrstvě, takže webová aplikace, REST API, MCP server, CLI a webhooky je všechny dodržují. Žádný povrch nemá zkratku kolem kontroly.',
  'web.useCases.approvals.today':
    'Stavy schválení, kontrolní povrch, pravidla opětovného schvalování a auditní události za nimi jsou postavené. Co postavené není, je poslední krok, protože žádný konektor neprošel svou definicí hotovo, takže schválený příspěvek zatím nemá kam jít.',

  /* ---------------------------------------------------------------------- */
  /* Cross-platform publishing                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': 'Publikování na více platformách',
  'web.useCases.crossPlatform.lede':
    'Jeden nápad, jedna úprava a verze pro každou platformu, která respektuje to, co tato platforma skutečně přijímá.',
  'web.useCases.crossPlatform.problem':
    'Publikování stejného textu všude vytváří verzi, která je na jedné platformě zkrácená, na jiné jí chybí požadovaný titulek a na třetí nese odkaz, který tiše odstraní. Alternativa, ruční přepisování pětkrát, je místo, kam práce skutečně jde.',
  'web.useCases.crossPlatform.approach1':
    'Hlavní koncept obsahuje nápad. Každý vybraný účet dostane svou vlastní verzi a úprava hlavního konceptu se použije jen tam, kde se hodí, a jasně říká, které cíle ji nemohly přijmout a proč.',
  'web.useCases.crossPlatform.approach2':
    'Validace probíhá proti zaznamenaným limitům pro každou platformu, počítaným tak, jak je počítá daná platforma, takže limit znaků se kontroluje v grafémech tam, kde platforma používá grafémy, a ve vážených jednotkách tam, kde používá ty.',
  'web.useCases.crossPlatform.approach3':
    'Každý limit platformy zobrazený kdekoli na tomto webu je generován z registru konektorů a nese dokument, ze kterého pochází, a datum, kdy jej někdo přečetl.',
  'web.useCases.crossPlatform.today':
    'Editor, verze pro jednotlivé cíle, validační pravidla a generovaná sada limitů jsou postavené. Krok publikování ne: žádný konektor není ověřen v produkci, takže ověřený koncept lze naplánovat interně, ale nemůže se dostat na platformu.',
} as const;
