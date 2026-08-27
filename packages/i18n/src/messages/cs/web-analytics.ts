/**
 * Web surface strings for Analytics, Automation Rules, RSS autopost and
 * tracked links.
 *
 * `analytics.ts` and `automation.ts` hold the domain vocabulary shared by every
 * surface (metric names, trigger sentences, provider caveats). This file holds
 * what only the web screens need: column headings, filter labels, wizard steps,
 * the sentence builder chrome and the per screen empty, error, offline,
 * permission and rate limit copy.
 *
 * Every leaf name here is new. Nothing in this file overwrites a key defined in
 * `analytics.ts` or `automation.ts`, which is asserted by `lint.test.ts`.
 */
export const webAnalyticsMessages = {
  /* ======================================================================
     Analytics shell
     ====================================================================== */
  'analytics.chart.legend': 'Řady zobrazené v tomto grafu',
  'analytics.tab.overview': 'Přehled',
  'analytics.tab.experiments': 'Experimenty',
  'analytics.tab.links': 'Sledované odkazy',
  'analytics.tab.label': 'Sekce Analytics',

  'analytics.question.baseline': 'Které příspěvky se posunuly od vaší vlastní základní linie?',
  'analytics.question.baselineHelp':
    'Každý příspěvek je porovnán s vašimi vlastními nedávnými příspěvky na stejném účtu a ve stejném formátu. Nic zde vás neporovnává s jiným pracovním prostorem nebo jinou společností.',
  'analytics.question.accounts': 'Kterým účtům je třeba věnovat pozornost?',
  'analytics.question.next': 'Co stojí za to vyzkoušet dále?',

  'analytics.filter.project': 'Projekt',
  'analytics.filter.accounts': 'Účty',
  'analytics.filter.allAccounts': 'Všechny propojené účty',
  'analytics.filter.range': 'Období',
  'analytics.filter.format': 'Formát obsahu',
  'analytics.filter.allFormats': 'Všechny formáty',
  'analytics.filter.comparePrevious': 'Porovnat s předchozím obdobím',
  'analytics.filter.applied':
    '{count, plural, =0 {Žádné filtry} one {# filtr} other {# filtry} few {# filtry} many {# filtry}} použito. {results, plural, =0 {Neodpovídají žádné příspěvky} one {# shody příspěvků} other {# shoda příspěvků} few {# shoda příspěvků} many {# shoda příspěvků}}.',

  'analytics.rankMetric.label': 'Hodnocení příspěvků podle',
  'analytics.rankMetric.help':
    'Ve štafetě není žádné kombinované skóre. Vyberte jednu metriku, jejíž definici důvěřujete, a tabulka bude uspořádána pouze podle této metriky.',
  'analytics.rankMetric.chosen': 'Hodnocení podle {metric}, jak uvádí každý poskytovatel účtu.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Povědomí',
  'analytics.outcome.awarenessHelp':
    'Kolikrát byla pošta doručena nebo viděna. Poskytovatelé to počítají jinak, takže hodnota je srovnatelná jen sama se sebou v průběhu času.',
  'analytics.outcome.consumption': 'Spotřeba',
  'analytics.outcome.consumptionHelp': 'Kolik příspěvků lidé skutečně sledovali nebo četli.',
  'analytics.outcome.interaction': 'Interakce',
  'analytics.outcome.interactionHelp':
    'Co lidé na platformě dělali: lajky, komentáře, sdílení a ukládání.',
  'analytics.outcome.conversion': 'Konverze',
  'analytics.outcome.conversionHelp':
    'Co lidé dělali poté, co opustili platformu. Na to mohou odpovědět pouze sledované odkazy a pouze pro odkazy, které jste se rozhodli sledovat.',
  'analytics.outcome.separateNote':
    'Tyto čtyři skupiny se počítají samostatně. Jejich sečtením by se jedna osoba započítala více než jednou.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Příspěvky publikované ve vybraném rozsahu, přičemž každý z nich je porovnán s vaším vlastním aktuálním výchozím stavem.',
  'analytics.table.post': 'Příspěvek',
  'analytics.table.account': 'Účet',
  'analytics.table.format': 'Formát',
  'analytics.table.published': 'Publikováno',
  'analytics.table.value': 'Hodnota',
  'analytics.table.delta': 'Proti základní linii',
  'analytics.table.sample': 'Ukázka',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Důkaz',
  'analytics.table.openEvidence': 'Ukažte důkazy pro {post}',
  'analytics.table.rowActions': 'Akce pro {post}',
  'analytics.table.openPost': 'Otevřít metriky příspěvku',
  'analytics.table.openReceipt': 'Otevřít potvrzení o publikaci',
  'analytics.table.noBaseline': 'Zatím žádná základní linie',
  'analytics.table.noBaselineReason':
    'Méně než {required} srovnatelné příspěvky. Porovnání by bylo šumem, takže žádný není zobrazen.',
  'analytics.table.sortBy': 'Seřadit podle {column}',
  'analytics.table.detailToggle': 'Podrobnosti',

  'analytics.delta.above': '{percent} nad základní úrovní',
  'analytics.delta.below': '{percent} pod základní úrovní',
  'analytics.delta.level': 'V souladu se základní linií',
  'analytics.delta.unavailable': 'Žádné srovnání',

  'analytics.evidence.title': 'Jak bylo provedeno toto srovnání',
  'analytics.evidence.baseline':
    'Základní linie: medián {metric} předchozího {count, plural, one {# srovnatelný příspěvek} other {# srovnatelné příspěvky} few {# srovnatelné příspěvky} many {# srovnatelné příspěvky}} na {account}.',
  'analytics.evidence.comparableBy':
    'Porovnatelné znamená stejný účet, stejný formát obsahu ({format}) a čas zveřejnění ve stejném období.',
  'analytics.evidence.postsUsed': 'Příspěvky použité pro základní linii',
  'analytics.evidence.excluded':
    '{count, plural, =0 {Žádné příspěvky nebyly vyloučeny} one {# příspěvek byl vyloučen} other {# příspěvky byly vyloučeny} few {# příspěvky byly vyloučeny} many {# příspěvky byly vyloučeny}}, protože pro ně tato metrika nebyla dostupná.',
  'analytics.evidence.smallSample':
    'S {count, plural, one {# příspěvek} other {# příspěvky} few {# příspěvky} many {# příspěvky}} v základní linii, jediný neobvyklý příspěvek posouvá medián o velký kus. Berte to jako signál k opětovnému testování, ne jako výsledek.',
  'analytics.evidence.confounders': 'Co to nebere v úvahu',
  'analytics.evidence.confounder.time':
    'Denní doba zveřejnění se u příspěvků v základní linii lišila.',
  'analytics.evidence.confounder.format':
    'Obrázkové příspěvky a video příspěvky zde nejsou přímo srovnatelné.',
  'analytics.evidence.confounder.followers':
    'Počet sledujících na {account} změněno uživatelem {percent} během tohoto období.',
  'analytics.evidence.confounder.paid':
    'Post Array nedokáže zjistit, zda některý z těchto příspěvků obdržel placenou distribuci.',
  'analytics.evidence.confounder.provider':
    '{provider} změnil způsob hlášení {metric} v tomto období.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'Co {metric} znamená',
  'analytics.definition.inlineHeading': 'Definice',
  'analytics.definition.observedAt': 'Pozorováno {dateTime}.',
  'analytics.definition.sourceLink': 'Dokumentace poskytovatele',
  'analytics.definition.verifiedOn': 'Zkontrolováno s dokumentací poskytovatele na {date}.',
  'analytics.definition.panelTitle': 'Definice metrik v tomto zobrazení',
  'analytics.definition.panelIntro':
    'Každé číslo na této obrazovce pochází z jednoho pojmenovaného pole poskytovatele. Níže uvedené definice se také opakují u každé hodnoty, takže nic důležitého nežije pouze v popisku.',
  'analytics.definition.aggregation.sum': 'Agregováno přidáním každého pozorování.',
  'analytics.definition.aggregation.average': 'Agregováno jako průměr.',
  'analytics.definition.aggregation.median': 'Agregováno jako medián.',
  'analytics.definition.aggregation.last': 'Nejnovější pozorování.',
  'analytics.definition.aggregation.delta': 'Změna mezi prvním a posledním pozorováním.',
  'analytics.definition.aggregation.none': 'Hlášeno jako jediné pozorování.',
  'analytics.definition.denominator.none': 'Toto je počet, nikoli sazba.',
  'analytics.definition.historyWindow':
    '{provider} zachovává {days, plural, one {# den} other {# dnů} few {# dnů} many {# dnů}} historie tohoto oboru.',
  'analytics.definition.historyWindowNone': '{provider} pro toto pole neuvádí limit historie.',

  'analytics.definition.term.providerField': 'Pole poskytovatele',
  'analytics.definition.term.unit': 'Jednotka',
  'analytics.definition.term.denominator': 'Jmenovatel',
  'analytics.definition.term.aggregation': 'Jak se agreguje',
  'analytics.definition.term.history': 'Historie, kterou poskytovatel vede',
  'analytics.definition.term.definition': 'Co tím poskytovatel říká, že to znamená',

  'analytics.unit.count': 'Počet událostí',
  'analytics.unit.seconds': 'Sekundy',
  'analytics.unit.percent': 'Procento, které již poskytovatel vypočítal',
  'analytics.unit.ratio': 'Poměrové relé vypočtené ze dvou polí poskytovatele',
  'analytics.unit.currency_minor': 'Částka peněz v menších jednotkách',

  'analytics.denominator.none': 'Toto je počet, nikoli sazba. Nemá jmenovatele.',
  'analytics.denominator.impressions': 'Děleno počtem zobrazení',
  'analytics.denominator.reach': 'Děleno dosahem',
  'analytics.denominator.views': 'Děleno podle zhlédnutí',
  'analytics.denominator.followers': 'Děleno počtem sledujících v době pozorování',
  'analytics.denominator.sessions': 'Děleno podle návštěv',

  'analytics.format.text': 'Text',
  'analytics.format.image': 'Obrázek',
  'analytics.format.carousel': 'Karusel',
  'analytics.format.video': 'Video',
  'analytics.format.short_video': 'Krátké video',
  'analytics.format.long_video': 'Dlouhé video',
  'analytics.format.document': 'Dokument',
  'analytics.format.thread': 'Vlákno',

  'analytics.value.unavailableReason.notImplemented':
    'Relé nevytvořilo mapování pro tuto metriku na {provider} zatím.',
  'analytics.value.estimated': 'Odhad',
  'analytics.value.estimatedMethod': 'Metoda: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'Odkud tato čísla pocházejí',
  'analytics.freshness.intro':
    'Poskytovatelé se shromažďují podle vlastního plánu. Nic na této obrazovce není živé.',
  'analytics.freshness.accountRow': '{account} na {provider}',
  'analytics.freshness.never': 'Nikdy nesynchronizováno',
  'analytics.freshness.nextAttempt': 'Další pokus o synchronizaci {relativeTime}.',
  'analytics.freshness.openStatus': 'Stav poskytovatele',

  'analytics.accounts.title': 'Účty, které vyžadují pozornost',
  'analytics.accounts.empty':
    'Každý připojený účet v tomto období vrátil data. Nic vás tu nepotřebuje.',
  'analytics.accounts.reason.permission':
    'Při připojení tohoto účtu nebylo uděleno oprávnění k analýze.',
  'analytics.accounts.reason.expired': 'Platnost přístupu vypršela, takže od {date}.',
  'analytics.accounts.reason.stale': 'Poslední úspěšná synchronizace byla {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# pokus o synchronizaci} other {# pokusy o synchronizaci} few {# pokusy o synchronizaci} many {# pokusy o synchronizaci}} selhalo v řadě. Zaznamenaný důvod byl {reason}.',
  'analytics.accounts.reason.noPosts': 'Na tomto účtu nebylo ve vybraném rozsahu nic publikováno.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Postřehy',
  'analytics.observations.intro':
    'Toto jsou popisy toho, co čísla ukazují. Nejsou to předpovědi a nestanovují příčinu.',
  'analytics.observations.empty':
    'Zatím není dostatek publikované historie k popisu vzoru. Zveřejněte několik dalších příspěvků na stejném účtu a formátu.',
  'analytics.observations.citedPosts': 'Na základě',
  'analytics.observations.citedPeriod': 'Období: {start} až {end}.',
  'analytics.observations.nextTestTitle': 'Test, který byste mohli spustit jako další',
  'analytics.observations.nextTestBody':
    'Publikovat {count, plural, one {# další příspěvek} other {# další příspěvky} few {# další příspěvky} many {# další příspěvky}} na {account} pouze změna {variable}, poté porovnejte stejnou metriku. Před publikováním to označte jako experiment, aby bylo srovnání naplánováno, nikoli nalezeno později.',
  'analytics.observations.tagFirst': 'Označit experiment',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} v průběhu času',
  'analytics.chart.summary':
    '{metric} na {account}, {count, plural, one {# bod} other {# body} few {# body} many {# body}} z {start} až {end}.',
  'analytics.chart.showTable': 'Zobrazit jako tabulku',
  'analytics.chart.hideTable': 'Skrýt tabulku',
  'analytics.chart.tableCaption': 'Stejná řada jako stůl.',
  'analytics.chart.columnPeriod': 'Období',
  'analytics.chart.columnValue': 'Hodnota',
  'analytics.chart.gapLabel': 'Neshromážděna žádná data',
  'analytics.chart.gapExplained':
    'Přerušení v řádku znamená, že v daném období nebylo shromážděno žádné pozorování. Neznamená to nulu.',
  'analytics.chart.annotation': 'Anotace',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'V tomto rozsahu nebyla shromážděna žádná pozorování.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Naplánujte experiment',
  'analytics.experiment.empty':
    'Zatím žádné experimenty. Experiment je srovnání, o kterém se rozhodnete před publikováním, což je jediný druh, který může odpovědět na otázku.',
  'analytics.experiment.emptyExample':
    'Příklad: publikujte stejné oznámení na X dvakrát, jednou s odkazem v příspěvku a jednou s odkazem v prvním komentáři, poté porovnejte kliknutí na odkaz za 72 hodin.',
  'analytics.experiment.name': 'Co testujete',
  'analytics.experiment.namePlaceholder': 'První komentář v 5 minutách oproti 30 minutám',
  'analytics.experiment.hypothesisPlaceholder':
    'Krátší prodleva, než první komentář získá více odpovědí na X.',
  'analytics.experiment.variantLabel': 'Varianta {index}',
  'analytics.experiment.variantDescription': 'V čem se tato varianta liší',
  'analytics.experiment.addVariant': 'Přidat variantu',
  'analytics.experiment.removeVariant': 'Odstranit variantu {index}',
  'analytics.experiment.accounts': 'Účty jsou zahrnuty',
  'analytics.experiment.windowHelp':
    'Po zveřejnění příspěvku se metriky neustále mění. Opravte okno hned, aby se srovnání neprovádělo v okamžiku, který náhodou vyhovuje jedné variantě.',
  'analytics.experiment.windowDays':
    'Měření pro {count, plural, one {# den} other {# dnů} few {# dnů} many {# dnů}} po zveřejnění každého příspěvku',
  'analytics.experiment.minSample': 'Minimální počet příspěvků na variantu',
  'analytics.experiment.minSampleHelp':
    'Pod tímto počtem je výsledek zobrazen jako neprůkazný, nikoli jako vítěz.',
  'analytics.experiment.status.planned': 'Plánováno',
  'analytics.experiment.status.collecting': 'Sbírání. {published} z {target} zveřejněné příspěvky.',
  'analytics.experiment.status.inconclusive': 'Úplné, žádný jasný rozdíl',
  'analytics.experiment.result.difference':
    '{variant} zaznamenáno {percent} více {metric} než {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'Dvě varianty jsou v rámci {percent} navzájem na {metric}. To je v rozsahu, v jakém se tyto příspěvky stejně liší.',
  'analytics.experiment.result.association':
    'Toto je asociace naměřená na {count, plural, one {# příspěvek} other {# příspěvky} few {# příspěvky} many {# příspěvky}}. Nedokazuje to, že změna způsobila rozdíl.',
  'analytics.experiment.result.unavailable':
    '{metric} nebyl k dispozici pro {count, plural, one {# příspěvek} other {# příspěvky} few {# příspěvky} many {# příspěvky}} v tomto experimentu, takže tyto příspěvky jsou vyloučeny, nikoli započítány jako nula.',
  'analytics.experiment.result.title': 'Výsledek',
  'analytics.experiment.completeNow': 'Zavřít tento experiment',
  'analytics.experiment.completeConfirm':
    'Uzavření zastaví sběr. Příspěvky zůstávají zveřejněny a čísla zůstávají k dispozici.',
  'analytics.experiment.postsTitle': 'Příspěvky v tomto experimentu',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Načítání statistik pro vybrané účty',
  'analytics.state.loadingProvider': 'Načítání {provider} analytika',
  'analytics.state.empty': 'V tomto rozsahu nebylo nic publikováno',
  'analytics.state.emptyBody':
    'Analytika popisuje příspěvky, které již byly zveřejněny. Něco publikujte nebo rozšiřte časové období.',
  'analytics.state.emptyExample':
    'Jakmile bude příspěvek aktivní, uvidíte řádek jako: X @acme, "Spustit vlákno", 12 400 zobrazení, 58 procent nad vaším mediánem z předchozích 10.',
  'analytics.state.errorTitle': 'Analytiku nelze načíst',
  'analytics.state.errorBody':
    'Není zobrazeno žádné číslo místo uhádnutého. Vaše příspěvky a účtenky zůstávají nedotčeny.',
  'analytics.state.partialTitle': '{loaded} z {total} účty vrátily data',
  'analytics.state.partialBody':
    'Účty, které odpověděly, se zobrazují s vlastní aktuálností. Zbytek je uveden s důvodem, proč tak neučinil.',
  'analytics.state.partialSucceeded': 'Vrácená data',
  'analytics.state.partialFailed': 'Nevrácená data',
  'analytics.state.offlineTitle': 'Jste offline',
  'analytics.state.offlineBody':
    'Obrázky níže byly načteny před přerušením připojení, takže jsou starší, než naznačují štítky čerstvosti.',
  'analytics.state.permissionTitle': 'V tomto pracovním prostoru nevidíte analýzy',
  'analytics.state.permissionBody':
    'Analytics potřebuje roli analytika nebo vyšší. Vlastník nebo správce tohoto pracovního prostoru to může udělit.',
  'analytics.state.rateLimitTitle': '{provider} je rychlost omezující analytické požadavky',
  'analytics.state.rateLimitCause':
    'Účet využil svůj podíl kvóty poskytovatele pro toto okno. Post Array se nesnaží opakovat, protože by to zdrželo publikování.',
  'analytics.state.rateLimitAlternative':
    'Upřesněte časové období nebo filtr účtu, který od poskytovatele požaduje méně.',
  'analytics.state.rateLimitReset': 'Požaduje životopis',
  'analytics.state.reference': 'Diagnostický odkaz',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Vytvořit sledovaný odkaz',
  'analytics.links.empty': 'Zatím žádné sledované odkazy',
  'analytics.links.emptyBody':
    'Sledovaný odkaz je krátká adresa URL přesměrovává, takže můžete vidět kliknutí, i když platforma žádné nehlásí. Původní cíl se nikdy nezmění bez záznamu auditu.',
  'analytics.links.emptyExample':
    'Příklad: relay.to/a7Kq2 přesměruje na acme.com/blog/launch s kampaní q3-launch.',
  'analytics.links.table.caption':
    'Sledované odkazy v tomto pracovním prostoru a jejich počet kliknutí první stranou.',
  'analytics.links.campaign': 'Kampaň',
  'analytics.links.created': 'Vytvořeno',
  'analytics.links.usedIn':
    '{count, plural, =0 {Zatím v příspěvku není použito} one {Použito v # příspěvek} other {Použito v # příspěvky} few {Použito v # příspěvky} many {Použito v # příspěvky}}',
  'analytics.links.state.active': 'Aktivní',
  'analytics.links.state.expired': 'Platnost vypršela {date}',
  'analytics.links.state.disabled': 'Zakázáno',
  'analytics.links.state.disabledAt': 'Zakázáno {date}. Tato krátká adresa URL již nepřesměrovává.',
  'analytics.links.state.blocked': 'Zablokováno z bezpečnostních důvodů',
  'analytics.links.state.blockedBody':
    'Toto přesměrování není dostupné, protože cíl neprošel bezpečnostní kontrolou. Změňte cíl nebo kontaktujte podporu.',
  'analytics.links.state.disabledReason':
    'Zakázáno uživatelem {actor} na {date}. Důvod zaznamenaný: {reason}.',
  'analytics.links.detailTitle': 'Sledovaný odkaz {slug}',
  'analytics.links.exactRedirect': 'Přesné přesměrování',
  'analytics.links.exactRedirectHelp':
    'Toto je cíl, kam se návštěvník právě dostane, včetně všech parametrů UTM, zobrazený celý a nezkrácený.',
  'analytics.links.editDestination': 'Změnit cíl',
  'analytics.links.editDestinationWarning':
    'Změna cíle ovlivní všechna místa, kde byl tento odkaz již publikován. Přehledy za období před změnou uchovávají cíl, který byl v danou chvíli aktivní.',
  'analytics.links.editDestinationAudit':
    'Změna je zaznamenána v protokolu auditu s vaším jménem, starým a novým cílem.',
  'analytics.links.destinationHistory': 'Historie destinace',
  'analytics.links.destinationHistoryRow': '{destination}, aktivní od {start} až {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, aktivní od {start}',
  'analytics.links.domainLabel': 'Krátká doména',
  'analytics.links.domainDefault': 'Výchozí doména relé',
  'analytics.links.domainVerified': 'Ověřeno DNS na {date}',
  'analytics.links.domainPending': 'Čekání na DNS záznam',
  'analytics.links.domainPendingHelp':
    'Přidejte TXT záznam níže na {domain}, poté znovu zkontrolujte. Dokud to neověří, nelze tuto doménu vybrat pro nový odkaz.',
  'analytics.links.domainFailed': 'Záznam DNS se neshodoval na {date}',
  'analytics.links.domainCheck': 'Znovu zkontrolujte DNS',
  'analytics.links.expiry': 'Vypršení platnosti',
  'analytics.links.expiryNone': 'Není nastavena doba platnosti',
  'analytics.links.expiryHelp':
    'Po vypršení odkaz vrátí obyčejnou stránku s oznámením, že skončil. Nikdy není tiše namířeno někam jinam.',
  'analytics.links.disable': 'Zakázat tento odkaz',
  'analytics.links.disableTitle': 'Zakázat {slug}?',
  'analytics.links.disableBody':
    'Návštěvníci se dostanou na stránku s oznámením, že odkaz již není dostupný. Publikované příspěvky stále obsahují krátkou adresu URL, takže ji uvidí každý, kdo na ni klikne.',
  'analytics.links.disableReason': 'Důvod pro deaktivaci',
  'analytics.links.enable': 'Znovu povolte tento odkaz',
  'analytics.links.abuseTitle': 'Oznámit zneužití tohoto odkazu',
  'analytics.links.abuseBody':
    'Pokud se tato krátká adresa URL používá k něčemu, co jste nezamýšleli, nahlaste to a přesměrování bude pozastaveno, dokud nebude přezkoumáno.',
  'analytics.links.abuseAction': 'Nahlásit tento odkaz',
  'analytics.links.measurementLabel': 'Měření přesměrování první stranou',
  'analytics.links.measurementExplained':
    'Přenos počítá požadavek, když je služba přesměrování požádána o tuto adresu URL. Deduplikované kliknutí odstraní opakované požadavky od stejného návštěvníka v krátkém okně a požadavky odpovídající známým vzorům prohledávače jsou spíše vyloučeny než smazány.',
  'analytics.links.botsNote':
    '{count, plural, one {# požadavek} other {# požadavky} few {# požadavky} many {# požadavky}} byly klasifikovány jako automatické a jsou vyloučeny z deduplikovaného počtu.',
  'analytics.links.series.title': 'Požadavky a deduplikovaná kliknutí v průběhu času',
  'analytics.links.series.requests': 'Celkový počet požadavků',
  'analytics.links.series.clicks': 'Duplikovaná kliknutí',
  'analytics.links.breakdownTitle': 'Odkud pocházela kliknutí',
  'analytics.links.breakdown.share': '{percent} deduplikovaných kliknutí',
  'analytics.links.referrer.direct': 'Nebyl odeslán žádný referrer',
  'analytics.links.referrer.social': 'Sociální platforma',
  'analytics.links.referrer.search': 'Vyhledávač',
  'analytics.links.referrer.email': 'E-mailový klient',
  'analytics.links.referrer.other': 'Jiný web',
  'analytics.links.device.mobile': 'Mobil',
  'analytics.links.device.desktop': 'Počítač',
  'analytics.links.device.tablet': 'Tablet',
  'analytics.links.device.unknown': 'Neurčeno',
  'analytics.links.countryUnknown': 'Země není určena',
  'analytics.links.lastEventLabel': 'Poslední kliknutí',
  'analytics.links.noEvents': 'Zatím nebyla zaznamenána žádná kliknutí',
  'analytics.links.noEventsBody':
    'Tento odkaz nebyl od svého vytvoření vyžádán. To je skutečná nula, měřená naší vlastní přesměrovací službou.',
  'analytics.links.compareWarning':
    '{provider} zprávy {providerValue} kliknutí na odkaz pro tento příspěvek. Relé zaznamenáno {relayValue} deduplikovaná kliknutí. Tyto dvě počítají různé události a žádná nenahrazuje druhou.',
  'analytics.links.errorTitle': 'Statistiku odkazu nelze načíst',
  'analytics.links.errorBody':
    'Služba přesměrování stále funguje, takže odkaz stále posílá návštěvníky na místo určení. Týká se to pouze přehledů.',
  'analytics.links.createDestination': 'Cílová adresa URL',
  'analytics.links.createDestinationHelp':
    'Musí to být veřejná https adresa. Soukromé síťové adresy a řetězce přesměrování jsou službou přesměrování odmítnuty.',
  'analytics.links.createCampaign': 'Název kampaně',
  'analytics.links.createSlug': 'Vlastní zakončení',
  'analytics.links.createSlugHelp':
    'Ponechte toto pole prázdné a relé vygeneruje krátký náhodný konec.',
  'analytics.links.createUtm': 'Parametry UTM',
  'analytics.links.blockedScheme': 'Přijímány jsou pouze cíle https.',
  'analytics.links.blockedPrivate':
    'Tato adresa je v privátní síti, takže ji služba přesměrování nepřijme.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Pravidla',
  'automation.tab.feeds': 'RSS zdroje',
  'automation.tab.label': 'Sekce automatizace',

  'automation.rules.table.caption': 'Pravidla automatizace v tomto pracovním prostoru.',
  'automation.rules.table.rule': 'Pravidlo',
  'automation.rules.table.state': 'Stav',
  'automation.rules.table.accounts': 'Účty',
  'automation.rules.table.lastRun': 'Poslední spuštění',
  'automation.rules.table.nextCheck': 'Další kontrola',
  'automation.rules.neverRun': 'Zatím neběží',
  'automation.rules.emptyExample':
    'Příklad: když se ve zdroji blogu Acme objeví nová položka, pokud je jazykem angličtina, vytvořte koncept ze šablony oznámení blogu a požádejte o schválení.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {Nejsou vybrány žádné účty} one {# účet} other {# účty} few {# účty} many {# účty}}',
  'automation.rules.openRule': 'Otevřít {name}',
  'automation.rules.duplicateRule': 'Duplikovat {name}',
  'automation.rules.deleteTitle': 'Smazat {name}?',
  'automation.rules.deleteBody':
    'Pravidlo se okamžitě zastaví a jeho historie běhu je uchována pro protokol auditu. Příspěvky, které již vytvořil, nejsou ovlivněny.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'naplánovaný komentář nebo položka vlákna se nezdaří',

  'automation.condition.timeWindow': 'čas je mezi {start} a {end} v {timeZone}',
  'automation.condition.domainPresent': 'textové odkazy na {domain}',
  'automation.condition.hashtagPresent': 'text obsahuje hashtag {hashtag}',
  'automation.condition.providerCapability': 'účet skutečně umí {capability}',
  'automation.condition.planStatus': 'předplatné je aktivní',

  'automation.action.continueSequence': 'pokračujte v připraveném vláknu nebo sekvenci komentářů',
  'automation.action.notifyEmail': 'zašlete e-mail na adresu {target}',
  'automation.action.notifyWebhook': 'odeslat webhook na {target}',
  'automation.action.pauseConnection': 'pozastavit dotčený účet',
  'automation.action.quotePost': 'jednou citujte zdrojový příspěvek',
  'automation.action.followUpComment': 'přidejte připravený komentář ke zdrojovému příspěvku',

  'automation.param.feed': 'Zdroj',
  'automation.param.template': 'Šablona',
  'automation.param.signature': 'Podpis',
  'automation.param.disclosure': 'Zveřejnění',
  'automation.param.locale': 'Jazyk',
  'automation.param.project': 'Projekt',
  'automation.param.campaign': 'Kampaň',
  'automation.param.account': 'Účet',
  'automation.param.platform': 'Platforma',
  'automation.param.contentType': 'Typ obsahu',
  'automation.param.keyword': 'Klíčové slovo',
  'automation.param.hashtag': 'Hashtag',
  'automation.param.domain': 'Doména',
  'automation.param.capability': 'Schopnost',
  'automation.param.timeZone': 'Časové pásmo',
  'automation.param.startTime': 'Od',
  'automation.param.endTime': 'Komu',
  'automation.param.duration': 'Trvání',
  'automation.param.metric': 'Metrika',
  'automation.param.value': 'Hodnota',
  'automation.param.target': 'Odeslat na',
  'automation.param.time': 'Čas',
  'automation.param.cadence': 'Jak často',
  'automation.param.notSet': 'nenastaveno',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Název pravidla',
  'automation.editor.namePlaceholder': 'Blogujte na sociální síti',
  'automation.editor.when': 'Když',
  'automation.editor.if': 'If',
  'automation.editor.then': 'Poté',
  'automation.editor.after': 'Po',
  'automation.editor.until': 'Do',
  'automation.editor.sentenceLabel': 'Věta pravidla',
  'automation.editor.readBack': 'Přečtěte si větu, než toto zapnete. Je to celé pravidlo.',
  'automation.editor.chooseTrigger': 'Vyberte, čím se toto pravidlo spustí',
  'automation.editor.addCondition': 'Přidat podmínku',
  'automation.editor.addAction': 'Přidat akci',
  'automation.editor.removeCondition': 'Odstranit podmínku {label}',
  'automation.editor.removeAction': 'Odstranit akci {label}',
  'automation.editor.moveActionUp': 'Přesunout {label} dříve',
  'automation.editor.moveActionDown': 'Přesunout {label} později',
  'automation.editor.actionOrder': 'Akce probíhají v tomto pořadí, shora dolů.',
  'automation.editor.noConditions': 'Žádné podmínky. Pravidlo se spustí pokaždé, když je spuštěno.',
  'automation.editor.noActions': 'Zatím žádné akce. Pravidlo bez akce nelze uložit.',
  'automation.editor.delayNone': 'bez zpoždění',
  'automation.editor.delayLabel': 'Prodleva před spuštěním akcí',
  'automation.editor.endLabel': 'Když toto pravidlo skončí',
  'automation.editor.end.manual': 'Vypnu to',
  'automation.editor.end.date': 'datum, které si vyberu',
  'automation.editor.end.count':
    'proběhlo {count, plural, one {# čas} other {# krát} few {# krát} many {# krát}}',
  'automation.editor.end.dateValue': 'Zastavit na',
  'automation.editor.end.countValue': 'Zastavte se po tolika spuštěních',
  'automation.editor.parameterFor': 'Nastavení pro {label}',
  'automation.editor.saveDraft': 'Uložit jako koncept',
  'automation.editor.savedAt': 'Uloženo {time}',
  'automation.editor.unsaved': 'Neuložené změny',

  'automation.editor.view.sentence': 'Věta',
  'automation.editor.view.structured': 'Strukturovaný',
  'automation.editor.view.api': 'Reprezentace API',
  'automation.editor.view.label': 'Zobrazení editoru',
  'automation.editor.apiHelp':
    'Přesně to odesílají REST API, CLI a MCP server. Když jej upravíte zde a přepnete zpět na větu, zachová se všechna pole.',
  'automation.editor.apiInvalid': 'Toto není platné pravidlo JSON, takže nebylo použito: {reason}',
  'automation.editor.apiApply': 'Použít tento JSON',
  'automation.editor.structuredHelp':
    'Stejné pravidlo jako pole. Toto použijte, když má pravidlo mnoho podmínek a věta je dlouhá.',

  'automation.editor.error.noAction': 'Před uložením přidejte alespoň jednu akci.',
  'automation.editor.error.noTrigger': 'Před uložením vyberte spouštěč.',
  'automation.editor.error.noAccounts':
    'Vyberte alespoň jeden účet, na který může toto pravidlo působit.',
  'automation.editor.error.missingParameter': '{label} potřebuje hodnotu.',
  'automation.editor.error.summary':
    '{count, plural, one {# věc vyžaduje vaši pozornost} other {# věci vyžadují vaši pozornost} few {# věci vyžadují vaši pozornost} many {# věci vyžadují vaši pozornost}} před uložením tohoto pravidla.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'Co začíná toto pravidlo',
  'automation.picker.conditionTitle': 'Přidat podmínku',
  'automation.picker.actionTitle': 'Přidat akci',
  'automation.picker.search': 'Filtrovat tento seznam',
  'automation.picker.noResults': 'Nic v tomto seznamu neodpovídá tomu, co jste zadali.',
  'automation.picker.groupContent': 'Obsah',
  'automation.picker.groupPublishing': 'Publikování',
  'automation.picker.groupNotify': 'Lidé a systémy',
  'automation.picker.groupControl': 'Ovládání pravidel',
  'automation.picker.groupSchedule': 'Čas',
  'automation.picker.groupExternal': 'Externí události',
  'automation.picker.groupMeasurement': 'Měření',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# akce je} other {# akce jsou} few {# akce jsou} many {# akce jsou}} není uveden, protože je vybrané účty nemohou provést.',
  'automation.picker.hiddenDetail': '{action} není k dispozici pro {provider}. {reason}',
  'automation.picker.consequential': 'Vytváří něco na platformě',
  'automation.picker.internalOnly': 'Zůstává uvnitř relé',

  'automation.accounts.label': 'Účty, na které se toto pravidlo může vztahovat',
  'automation.accounts.help':
    'Pravidlo se nikdy nemůže dotknout účtu, který zde není uveden, bez ohledu na jeho podmínky.',
  'automation.accounts.none': 'Zatím nejsou vybrány žádné účty',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Pravidla měření pro tento spouštěč',
  'automation.threshold.intro':
    'Pravidlo, které reaguje na číslo, potřebuje vědět, které číslo, měřeno za jaké období a jak často může působit.',
  'automation.threshold.metric': 'Metrika ke sledování',
  'automation.threshold.value': 'Hodnota prahu',
  'automation.threshold.window': 'Okno měření',
  'automation.threshold.windowHelp':
    'Počítáno od okamžiku zveřejnění zdrojového příspěvku. Mimo toto okno pravidlo přestane příspěvek sledovat.',
  'automation.threshold.expiry': 'Přestat sledovat příspěvek po',
  'automation.threshold.cooldown': 'Vychladnutí mezi provedeními',
  'automation.threshold.cooldownHelp':
    'Nejkratší povolená doba mezi dvěma spuštěními pro stejný zdrojový příspěvek.',
  'automation.threshold.maxPerPost': 'Maximální počet spuštění na zdrojový příspěvek',
  'automation.threshold.defaultsTitle':
    'Výchozí hodnoty, které zůstanou zapnuté, dokud je nezměníte',
  'automation.threshold.defaultOncePerPost': 'Spustit jednou pro každý zdrojový příspěvek.',
  'automation.threshold.defaultStale':
    'Neprovádět, pokud je metrika nedostupná nebo zastaralá. Použitý limit čerstvosti je {duration}.',
  'automation.threshold.staleLimit': 'Zacházet s metrikou jako zastaralou po',
  'automation.threshold.providerNote':
    '{provider} zprávy {metric} na zpoždění, takže toto pravidlo může fungovat až poté, co poskytovatel číslo zveřejní.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Reagovat z jiného účtu',
  'automation.crossAccount.off': 'Vypnuto. Toto pravidlo funguje pouze na zdrojovém účtu.',
  'automation.crossAccount.enable': 'Povolit zpětnou vazbu z jiného účtu',
  'automation.crossAccount.body':
    'Oba účty musí být připojeny k tomuto pracovnímu prostoru a oba zde musí být pojmenovány. Následuje připravený příspěvek, který napíšete předem, a podléhá stejným zásadám schvalování jako cokoli jiného.',
  'automation.crossAccount.sourceAccount': 'Zdrojový účet',
  'automation.crossAccount.followUpAccount': 'Účet, který publikuje následnou zprávu',
  'automation.crossAccount.preauthorize':
    'Potvrzuji, že tento pracovní prostor ovládá oba {sourceAccount} a {followUpAccount} a že následná kontrola není prezentována jako nezávislá podpora.',
  'automation.crossAccount.preauthorizeRequired':
    'Před uložením tohoto pravidla potvrďte předautorizaci.',
  'automation.crossAccount.duplicateCheck':
    'Před následnou kontrolou probíhají kontroly duplicitních účtů a kadence, a pokud by opakovaly zdrojový příspěvek, jsou spíše přeskočeny než zpožděny.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro':
    'Všechno, co toto pravidlo dokáže, dříve, než může udělat cokoliv z toho.',
  'automation.preflight.accountsLabel': 'Účty, se kterými může působit',
  'automation.preflight.maxActionsLabel': 'Většina externích akcí za běh',
  'automation.preflight.maxActionsPeriod':
    'Maximálně {count, plural, one {# vnější akce} other {# externí akce} few {# externí akce} many {# externí akce}} v {period}.',
  'automation.preflight.approvalLabel': 'Schválení',
  'automation.preflight.approvalNone':
    'Žádná akce v tomto pravidle nevytváří nic na platformě, takže se nevztahuje žádné schválení.',
  'automation.preflight.providerLabel': 'Omezení poskytovatele',
  'automation.preflight.providerNone': 'Na akce v tomto pravidle se nevztahuje žádná.',
  'automation.preflight.costLabel': 'Odhadované měřené náklady',
  'automation.preflight.costUnknown':
    'Náklady na tyto akce nelze odhadnout, dokud nebude známa cena poskytovatele.',
  'automation.preflight.costMethod':
    'Odhad z ceníku poskytovatele na {date}. Účtenka zaznamenává, co bylo skutečně účtováno.',
  'automation.preflight.cadenceLabel': 'Kadence a duplikáty',
  'automation.preflight.cadenceBody':
    'Před každou akcí se spouští kontrola duplicit a kadence. Akce, která by překročila kadenční rozpočet pro účet, je přeskočena a zaznamenána, není zařazena do fronty.',
  'automation.preflight.failureLabel': 'Pokud se běh nezdaří',
  'automation.preflight.failure.pauseAfter':
    'Pravidlo se pozastaví po {count, plural, one {# po sobě jdoucí selhání} other {# po sobě jdoucí selhání} few {# po sobě jdoucí selhání} many {# po sobě jdoucí selhání}} a založí úkol.',
  'automation.preflight.failure.continue':
    'Pravidlo stále běží a každé selhání se zaznamená do protokolu běhu.',
  'automation.preflight.exampleLabel': 'Příklad běhu',
  'automation.preflight.exampleIntro':
    'Při použití nejnovější události by tento spouštěč odpovídal.',
  'automation.preflight.exampleNone':
    'Žádná odpovídající událost zatím nenastala, takže nelze zobrazit žádný příklad. Místo toho spusťte testovací událost.',
  'automation.preflight.activate': 'Zapnout toto pravidlo',
  'automation.preflight.activateConfirmTitle': 'Zapnout {name}?',
  'automation.preflight.activateConfirmBody':
    'Od této chvíle toto pravidlo funguje bez předchozího dotazování, v rámci výše uvedených limitů.',
  'automation.preflight.blocked':
    'Toto pravidlo zatím nelze zapnout. {count, plural, one {# položka} other {# položky} few {# položky} many {# položky}} výše potřebuje rozhodnutí.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Testovací událost',
  'automation.test.body':
    'Testovací běh vyhodnotí celou větu a ukáže, co by udělal. Nikdy nepublikuje, nezveřejňuje komentáře a nikdy neposílá webhook do skutečného koncového bodu.',
  'automation.test.useLastEvent': 'Použít poslední odpovídající událost',
  'automation.test.usePayload': 'Vložte datovou část události',
  'automation.test.run': 'Spustit test',
  'automation.test.running': 'Spuštění testu',
  'automation.test.resultTitle': 'Co test udělal',
  'automation.test.conditionPassed': '{condition} úspěšně dokončeno',
  'automation.test.conditionFailed': '{condition} neprošlo, takže zde pravidlo skončilo',
  'automation.test.actionSimulated': '{action} by běželo',
  'automation.test.actionSkipped': '{action} bude přeskočeno: {reason}',
  'automation.test.noExternalEffect': 'Během tohoto testu nic nezbylo z relé.',
  'automation.test.failed': 'Test nelze dokončit: {reason}',

  'automation.runs.table.caption': 'Poslední spuštění tohoto pravidla.',
  'automation.runs.startedAt': 'Zahájeno',
  'automation.runs.outcome.label': 'Výsledek',
  'automation.runs.actionsTaken': 'Akce',
  'automation.runs.trigger': 'Spuštěno uživatelem',
  'automation.runs.outcome.completed': 'Dokončeno',
  'automation.runs.outcome.skipped': 'Přeskočeno',
  'automation.runs.outcome.failed': 'Neúspěšné',
  'automation.runs.outcome.testMode': 'Testovací režim',
  'automation.runs.actionCount':
    '{count, plural, =0 {Žádná vnější akce} one {# vnější akce} other {# externí akce} few {# externí akce} many {# externí akce}}',
  'automation.runs.skippedReason': 'Přeskočeno, protože {reason}',
  'automation.runs.openDetail': 'Otevřete běh z {time}',
  'automation.runs.createdItems': 'Vytvořeno',

  'automation.versions.caption': 'Každá uložená verze tohoto pravidla.',
  'automation.versions.current': 'Aktuální',
  'automation.versions.savedBy': 'Uložil {actor} na {date}',
  'automation.versions.compare': 'Porovnat s aktuální verzí',
  'automation.versions.restore': 'Obnovit tuto verzi',
  'automation.versions.restoreConfirm':
    'Obnovením se vytvoří nová verze. Nic se nepřepíše a pravidlo zůstane v aktuálním stavu, dokud jej nezapnete.',
  'automation.versions.diffTitle': 'Verze {from} ve srovnání s verzí {to}',

  'automation.kill.title': 'Zastavit {name} nyní',
  'automation.kill.body':
    'Pravidlo se zastaví okamžitě, uprostřed běhu, pokud k němu dochází. Vše, co již bylo odesláno na platformu, zůstává zveřejněno, protože externí příspěvek není nikdy vrácen zpět.',
  'automation.kill.confirmPhrase': 'STOP',
  'automation.kill.confirmLabel': 'Pro potvrzení zadejte STOP',
  'automation.kill.stopped':
    'Toto pravidlo bylo zastaveno uživatelem {actor} na {date}. Nemůže se znovu spustit, dokud jej znovu nezapnete.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Načítání pravidel automatizace',
  'automation.state.loadingRule': 'Načítání pravidla a jeho posledních spuštění',
  'automation.state.errorTitle': 'Pravidla nelze načíst',
  'automation.state.errorBody':
    'Pravidla, která již běží, nejsou tímto ovlivněna. Selhala pouze tato obrazovka.',
  'automation.state.offlineTitle': 'Jste offline',
  'automation.state.offlineBody':
    'Můžete si přečíst pravidlo a upravit koncept a zůstane v tomto zařízení. Ukládání, testování a zapínání pravidla vyžaduje připojení.',
  'automation.state.permissionTitle': 'Nemůžete změnit pravidla automatizace',
  'automation.state.permissionBody':
    'Pravidla působí na propojené účty, takže změna jednoho vyžaduje roli správce nebo vyšší. Stále si můžete přečíst každé pravidlo a jeho historii běhu.',
  'automation.state.rateLimitTitle': 'Běhy pravidel se zpomalují',
  'automation.state.rateLimitCause':
    'Tento pracovní prostor dosáhl povoleného běhu automatizace pro aktuální okno. Naplánované příspěvky a ruční publikování nejsou ovlivněny.',
  'automation.state.rateLimitAlternative':
    'Pravidlům s kadencí lze nastavit delší interval, který spotřebuje méně běhů.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Přeměňte zdroj na koncepty nebo naplánované příspěvky se stejným ověřením a schválením jako cokoliv, co sami napíšete.',
  'automation.rss.empty': 'Zatím žádné zdroje',
  'automation.rss.emptyBody':
    'Přidejte zdroj a relé jej zkontroluje podle plánu. Každá nová položka se stane konceptem, plánovaným příspěvkem nebo žádostí o schválení, podle toho, co si vyberete.',
  'automation.rss.emptyExample':
    'Příklad: zdroj blogu Acme vytvoří koncept pro X a LinkedIn pokaždé, když je článek publikován, a čeká na schvalovatele.',
  'automation.rss.table.caption': 'Zasílá průzkumy tohoto pracovního prostoru.',
  'automation.rss.table.feed': 'Zdroj',
  'automation.rss.table.policy': 'Co se stane s novou položkou',
  'automation.rss.table.health': 'Zdraví',

  'automation.rss.step.url': 'Adresa zdroje',
  'automation.rss.step.preview': 'Zkontrolujte zdroj',
  'automation.rss.step.seen': 'Výchozí bod',
  'automation.rss.step.targets': 'Kam to jde',
  'automation.rss.step.template': 'Co říká příspěvek',
  'automation.rss.step.policy': 'Jak je publikován',
  'automation.rss.stepOf': 'Krok {current} z {total}',

  'automation.rss.urlHelp':
    'Post Array načítá zdroj z našich serverů, nikoli z vašeho prohlížeče. Adresy privátních sítí jsou odmítnuty.',
  'automation.rss.validateAction': 'Zkontrolujte tento zdroj',
  'automation.rss.validateFailed': 'Tato adresa nevrátila čitelný zdroj',
  'automation.rss.validateFailedReason': 'Co jsme dostali zpět: {reason}',
  'automation.rss.validateBlocked': 'Tato adresa ukazuje na privátní síť, takže nebyla načtena.',
  'automation.rss.previewTitle': 'Náhled zdroje',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# položka} other {# položky} few {# položky} many {# položky}} vráceno, nejnovější jako první.',
  'automation.rss.previewItemPublished': 'Publikováno {dateTime}',
  'automation.rss.previewNoImage': 'V této položce není žádný obrázek',
  'automation.rss.previewImageAlt': 'Obrázek z položky zdroje {title}',
  'automation.rss.previewNoDate':
    'Tato položka nemá žádné časové razítko, takže Post Array použije čas, kdy ji poprvé viděl.',
  'automation.rss.previewFieldsTitle': 'Pole, která tento zdroj poskytuje',
  'automation.rss.previewFieldMissing': 'V tomto zdroji není přítomno',

  'automation.rss.seenTitle': 'Co se počítá jako již viděné',
  'automation.rss.seenLatest':
    'Zacházejte se vším, co je aktuálně ve zdroji, tak, jak je vidět. Odesílají se pouze budoucí položky.',
  'automation.rss.seenAll':
    'Zacházejte s nejnovější položkou jako s novou a zašlete ji při příští kontrole.',
  'automation.rss.seenHelp':
    'Většina zdrojů obsahuje staré články. Výběrem první možnosti se vyhnete zveřejnění nevyřízených záležitostí.',

  'automation.rss.targetsHelp':
    'Vyberte účty nebo uloženou skupinu. Každý cíl stále dostává svou vlastní validaci, než je cokoliv naplánováno.',
  'automation.rss.targetGroup': 'Uložená skupina',
  'automation.rss.targetIndividual': 'Jednotlivé účty',

  'automation.rss.templateFields': 'Dostupná pole',
  'automation.rss.templateInsert': 'Vložit {field}',
  'automation.rss.templateField.title': 'Název položky',
  'automation.rss.templateField.summary': 'Shrnutí položky',
  'automation.rss.templateField.link': 'Odkaz na položku',
  'automation.rss.templateField.author': 'Autor položky',
  'automation.rss.templateField.published': 'Datum zveřejnění',
  'automation.rss.templateField.categories': 'Kategorie',
  'automation.rss.templatePreview': 'Náhled s nejnovější položkou',
  'automation.rss.adaptWithAi': 'Upravte text pro každý cíl',
  'automation.rss.adaptHelp':
    'Znění je přepsáno tak, aby vyhovovalo každé platformě, a je zobrazeno jako rozdíl, který přijmete nebo odmítnete. Média pocházejí z položky zdroje. Relé negeneruje obrázky.',
  'automation.rss.noImageGeneration':
    'Pokud položka zdroje nemá žádný obrázek, příspěvek bez něj zmizí.',
  'automation.rss.imageFromFeed': 'Použít obrázek z položky zdroje, pokud má jeden',

  'automation.rss.policyHelp':
    'Položka zdroje není zvláštní. Dodržuje stejné zásady schvalování jako příspěvek, který sami napíšete.',
  'automation.rss.cadenceInterval': 'Nejvýše jedna položka každých',
  'automation.rss.cadenceHelp':
    'Položky navíc čekají ve frontě a nepublikují se společně, takže zdroj, který zveřejňuje deset článků najednou, nezahltí účet.',
  'automation.rss.immediateWarning':
    'Okamžité publikování odešle příspěvek na platformu, aniž by si jej někdo přečetl jako první. Je k dispozici pouze v případě, že to zásady schvalování pro tyto účty umožňují.',

  'automation.rss.healthTitle': 'Stav zdroje',
  'automation.rss.healthOk': 'Pracuje',
  'automation.rss.healthStalled': 'Žádná nová položka pro {duration}',
  'automation.rss.healthFailing':
    'Poslední {count, plural, one {kontrola} other {# kontroly} few {# kontroly} many {# kontroly}} se nezdařilo',
  'automation.rss.health.nextPoll': 'Další kontrola {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Zatím nebyly zpracovány žádné položky} one {# položka zpracována} other {# zpracované položky} few {# zpracované položky} many {# zpracované položky}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {Žádné duplikáty nebyly přeskočeny} one {# duplikát přeskočen} other {# duplikáty přeskočeny} few {# duplikáty přeskočeny} many {# duplikáty přeskočeny}}',
  'automation.rss.health.lastPollLabel': 'Poslední kontrola',
  'automation.rss.health.lastItemLabel': 'Poslední nová položka ve zdroji',
  'automation.rss.health.lastPostLabel': 'Poslední koncept nebo vytvořený příspěvek',
  'automation.rss.health.processedLabel': 'Zpracované položky',
  'automation.rss.recentItems': 'Poslední položky',
  'automation.rss.itemOutcome.draft': 'Koncept vytvořen',
  'automation.rss.itemOutcome.scheduled': 'Naplánováno na {time}',
  'automation.rss.itemOutcome.published': 'Publikováno',
  'automation.rss.itemOutcome.awaitingApproval': 'Čekání na schválení',
  'automation.rss.itemOutcome.duplicate': 'Přeskočeno, již viděno',
  'automation.rss.itemOutcome.failed': 'Selhalo: {reason}',
  'automation.rss.pauseFeed': 'Pozastavit tento zdroj',
  'automation.rss.resumeFeed': 'Obnovit tento zdroj',
  'automation.rss.deleteTitle': 'Odebrat {title}?',
  'automation.rss.deleteBody':
    'Relé přestane kontrolovat tento zdroj. Koncepty a příspěvky, které již vytvořil, zůstávají přesně tak, jak jsou.',
  'automation.rss.errorTitle': 'Tento zdroj nelze přečíst',
  'automation.rss.errorBody':
    'Relé pokračuje v kontrole podle normálního plánu. Z částečné odpovědi nebylo nic zveřejněno.',

  /* ----------------------------------------------------------------------
     What Post Array refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'Není k dispozici v žádném pravidle',
  'automation.refuse.body':
    'Automatické hodnocení Líbí se a sledování, skupiny zapojení, nevyžádané odpovědi a zprávy a zveřejňování stejného obsahu z několika účtů, aby to vypadalo populární, zde nejsou možnosti. Platformy je zakazují a poškozují účty, které je používají.',
  'automation.refuse.readPolicy': 'Přečtěte si zásady přijatelného použití',
} as const;
