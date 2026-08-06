/**
 * The public marketing site and public documentation surfaces.
 *
 * Rules that bind this file specifically, beyond the catalog rules in
 * `lint.ts`:
 *
 *  - Every claim here is either a product fact we control (price, channel
 *    allowance, surfaces) or a provider fact that carries a source link and a
 *    verification date in the page that renders it. No adjective stands in for
 *    a number.
 *  - Nothing here promises reach, ranking, engagement or "going" anywhere.
 *  - Nothing here describes AI image or AI video generation as a Relay
 *    feature, because it is not one.
 *  - No integration is called official until the provider has approved it. The
 *    connector matrix uses `capability.level.*` from `connections.ts` so the
 *    marketing site and the product cannot drift apart.
 *  - Legal wording that must be drafted by counsel is marked with
 *    `web.legal.counselPending.*` rather than guessed at here.
 */
export const webMarketingMessages = {
  /* ---------------------------------------------------------------------- */
  /* Shared marketing furniture                                              */
  /* ---------------------------------------------------------------------- */

  'web.brand.name': 'Relé',
  'web.brand.tagline': 'Vícejazyčná úroveň kontroly publikování pro lidi a agenty.',
  'web.skipToContent': 'Přeskočit na hlavní obsah',
  'web.nav.label': 'Navigace na webu',
  'web.nav.openMenu': 'Nabídka',
  'web.nav.closeMenu': 'Zavřít nabídku',
  'web.nav.footerLabel': 'Navigace v zápatí',

  'web.cta.startTrial': 'Zahajte 7denní zkušební verzi',
  'web.cta.seePricing': 'Zobrazit cenu',
  'web.cta.seeCapabilities': 'Přečtěte si matici schopností',
  'web.cta.readDocs': 'Přečtěte si dokumentaci',
  'web.cta.trialFootnote':
    'Polar vyzvedne platební metodu, dnes naúčtuje 0 USD a před potvrzením zobrazí přesné datum prvního naúčtování.',

  'web.label.lastReviewed': 'Poslední kontrola {date}',
  'web.label.nextReview': 'Další recenze {date}',
  'web.label.researchDate': 'Zkoumáno {date}',
  'web.label.officialSource': 'Oficiální zdroj',
  'web.label.onThisPage': 'Na této stránce',
  'web.label.provider': 'Platforma',
  'web.label.capability': 'Schopnost',

  'web.notFound.title': 'Na této adrese není žádná stránka',
  'web.notFound.body':
    'Odkaz může být zastaralý nebo jsme stránku zrušili. Stránky, které přestávají být přesné, jsou vyřazeny, nikoli ponechány, a changelog to zaznamená, když k tomu dojde.',
  'web.notFound.action': 'Přejít na domovskou stránku',

  'web.correction.title': 'Na této stránce jsem našel něco špatně',
  'web.correction.body':
    'Pravidla platformy se mění a my se pleteme. Pošlete URL a co je nepřesné a my stránku opravíme nebo ji vyřadíme.',
  'web.correction.email': 'opravy@relé.příklad',

  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.home.title': 'Relay, vícejazyčná řídicí rovina publikování',
  'web.meta.home.description':
    'Přeměňte jeden získaný nápad na obsah nativní platformy, jednou jej schválte, spolehlivě publikujte prostřednictvím oficiálních rozhraní API platformy a zjistěte, co dále zlepšit.',
  'web.meta.product.title': 'Jak relé funguje',
  'web.meta.product.description':
    'Prohlídka publikačního pultu: pište jednou, přizpůsobte se pro každou platformu, ověřujte podle skutečných limitů, schvalujte, plánujte, publikujte a uschovejte účtenku.',
  'web.meta.integrations.title': 'Platforms Relay publikuje na',
  'web.meta.integrations.description':
    'K jakým platformám se Relay připojuje, co dnes každé připojení umí a co samotná platforma neumožňuje.',
  'web.meta.capabilities.title': 'Matrice schopností konektoru',
  'web.meta.capabilities.description':
    'Tabulka pro jednotlivé platformy, podle schopností vygenerovaná z našich definic konektorů, oddělující to, co jsme vytvořili, od toho, co platforma nenabízí.',
  'web.meta.creators.title': 'Štafeta pro tvůrce',
  'web.meta.creators.description':
    'Pro samostatné tvůrce publikující stejnou myšlenku v několika formátech a jazycích, aniž by ji museli pětkrát přepisovat.',
  'web.meta.agencies.title': 'Relé pro agentury',
  'web.meta.agencies.description':
    'Oddělení klientů, schvalování, odkazy na recenze, potvrzení a hlášení pro týmy, které publikují jménem jiných lidí.',
  'web.meta.developers.title': 'Relé pro vývojáře',
  'web.meta.developers.description':
    'Jeden backend za webovou aplikací, REST API, vzdálený MCP server, CLI a podepsané webhooky. Stejná pravidla schvalování na každém povrchu.',
  'web.meta.pricing.title': 'Cena',
  'web.meta.pricing.description':
    'Jeden plán. 29 $ měsíčně nebo 300 $ ročně, což je 25 $ měsíčně účtovaných ročně. 30 aktivních kanálů, neomezený počet členů týmu, žádné úrovně funkcí.',
  'web.meta.resources.title': 'Zdroje',
  'web.meta.resources.description':
    'Stav, changelog, dokumentace, metodika, srovnání, radar nástrojů a katalog příležitostí.',
  'web.meta.status.title': 'Stav',
  'web.meta.status.description':
    'Aktuální stav každého povrchu relé a každého konektoru plus historie incidentů.',
  'web.meta.changelog.title': 'Changelog',
  'web.meta.changelog.description': 'Co bylo dodáno, co se změnilo u konektorů a co bylo opraveno.',
  'web.meta.docs.title': 'Dokumentace',
  'web.meta.docs.description':
    'REST API, MCP server, CLI a dokumentace webhooku pro budování na Relay.',
  'web.meta.methodology.title': 'Metodika',
  'web.meta.methodology.description':
    'Jak zkoumáme nároky na platformě, jak je datujeme, jak porovnáváme jiné produkty a jak opravujeme chyby.',
  'web.meta.compare.title': 'Srovnání',
  'web.meta.compare.description':
    'Poctivá a datovaná srovnání s jinými publikačními nástroji, včetně toho, pro koho je každý z nich nejlepší.',
  'web.meta.toolRadar.title': 'Kreativní nástroj radar',
  'web.meta.toolRadar.description':
    'Datovaný, redakčně zkontrolovaný katalog specializovaných kreativních nástrojů s omezeními, výhradami práv a komerčním zveřejněním.',
  'web.meta.opportunities.title': 'Příležitosti propagace',
  'web.meta.opportunities.description':
    'Spravovaný katalog míst, kde lze produkt uvést, uvést na trh nebo o něm diskutovat, přičemž každá destinace má vlastní pravidla podávání.',
  'web.meta.legal.title': 'Právní předpisy a zásady',
  'web.meta.legal.description':
    'Podmínky, soukromí, přijatelné použití, použití AI, soubory cookie, dílčí zpracovatelé, refundace, autorská práva, zabezpečení, dostupnost, podmínky pro vývojáře a podmínky přidružených společností.',

  /* ---------------------------------------------------------------------- */
  /* Home                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.home.promise':
    'Přeměňte jeden získaný nápad na obsah nativní platformy, jednou jej schválte, spolehlivě publikujte a zjistěte, co dále zlepšit.',
  'web.home.lede':
    'Relay je vydavatelský stůl pro lidi, kteří jsou zodpovědní za to, co vyjde. Napíšete jednou, přizpůsobíte se pro každou platformu, uvidíte skutečné limity, než naplánujete, získáte potřebný souhlas, publikujete prostřednictvím oficiálních rozhraní API platformy a u každého příspěvku si ponecháte potvrzení.',
  'web.home.summaryLine':
    'Jeden tarif za 29 $ měsíčně nebo 300 $ ročně. 30 aktivních sociálních kanálů, neomezený počet členů týmu, žádné úrovně funkcí. Sedmidenní zkušební verze vybírá platební metodu a účtuje 0 $ při placení.',

  'web.home.example.title': 'Jeden nápad, pět verzí nativních pro platformu',
  'web.home.example.body':
    'Skladatel začíná hlavní verzí. Výběrem jednoho účtu se otevře přepsání pouze pro tento účet s vlastními aktuálními limity a vlastním náhledem. Nic, co napíšete pro LinkedIn, nemění to, co X přijímá.',
  'web.home.example.column.account': 'Účet',
  'web.home.example.column.variant': 'Co tento účet obdrží',
  'web.home.example.column.check': 'Před plánováním zkontrolováno',
  'web.home.example.caption':
    'Ilustrativní kompozice. Zobrazené limity a nastavení pocházejí z definice konektoru pro každou platformu, nikoli z odhadu.',
  'web.home.example.x.account': 'X, @severní směr',
  'web.home.example.x.variant': 'Hlavní text, zkrácený, plus vlákno se dvěma příspěvky',
  'web.home.example.x.check':
    'Počet znaků, pořadí vláken, odhadovaná cena API za odkazový příspěvek',
  'web.home.example.linkedin.account': 'LinkedIn, nástroje Northbound',
  'web.home.example.linkedin.variant': 'Delší hlavní text s připojeným dokumentem',
  'web.home.example.linkedin.check': 'Role organizace, délka příspěvku, typ dokumentu',
  'web.home.example.instagram.account': 'Instagram, @northbound.tools',
  'web.home.example.instagram.variant':
    'Čtvercový výřez stejného obrázku, titulek přepsán pro zdroj',
  'web.home.example.instagram.check':
    'Typ profesionálního účtu, poměr stran, přítomen alternativní text',
  'web.home.example.youtube.account': 'YouTube, sever',
  'web.home.example.youtube.variant': 'Stejný klip jako krátký, s vlastním názvem a popisem',
  'web.home.example.youtube.check':
    'Rozsah nahrávání, stav auditu, soukromí, kam se nahrávání dostane',
  'web.home.example.bluesky.account': 'Bluesky, sever.příklad',
  'web.home.example.bluesky.variant': 'Hlavní text s odkazovou kartou',
  'web.home.example.bluesky.check':
    'Počet znaků, rozlišení karty odkazu, přítomen alternativní text',

  'web.home.pillars.title': 'V čem je relé postaveno tak, aby bylo dobré',
  'web.home.pillars.confidence.title': 'Publikujte s důvěrou',
  'web.home.pillars.confidence.body':
    'Skutečný náhled na účet, deterministické zásady a kontroly platformy, než je cokoli zařazeno do fronty, schválení, které váš pracovní prostor vyžaduje, neměnná účtenka s externím ID příspěvku a zdravotní stav každého připojení.',
  'web.home.pillars.confidence.proof':
    'Každý externí zápis nese klíč idempotence, takže pád pracovníka po přijetí příspěvku platformou nevytvoří druhý.',
  'web.home.pillars.adapt.title': 'Přizpůsobte spíše než duplikujte',
  'web.home.pillars.adapt.body':
    'U jednotlivých variant platformy, které můžete přepsat jeden účet po druhém, a transcreation spíše než doslovný překlad, s glosářem značky a jmenovaným recenzentem pro každý jazyk.',
  'web.home.pillars.adapt.proof':
    'Rozhraní je k dispozici ve vybraných jazycích. Adaptace obsahu pokrývá 30 jazyků obsahu a každý z nich lze před zveřejněním zkontrolovat.',
  'web.home.pillars.loop.title': 'Uzavřete smyčku',
  'web.home.pillars.loop.body':
    'Analytics, které pojmenovávají metriku, platformu, která ji nahlásila, jmenovatel a kdy byla naposledy aktualizována. Tam, kde platforma něco nehlásí, Relay to řekne namísto zobrazení nuly.',
  'web.home.pillars.loop.proof':
    'Příspěvek se porovnává spíše s vaším vlastním mediánem než se skóre, které nikdo nemůže zkontrolovat.',
  'web.home.pillars.anywhere.title': 'Pracujte z místa, kde již jste',
  'web.home.pillars.anywhere.body':
    'Webová aplikace, REST API, vzdálený MCP server, CLI a podepsané webhooky volají stejné aplikační služby, stejná autorizační pravidla a stejné validátory.',
  'web.home.pillars.anywhere.proof':
    'Agent nemůže obejít zásady schvalování použitím jiného povrchu, protože zásady se vynucují ve službě, nikoli v rozhraní.',
  'web.home.pillars.economics.title': 'Ekonomika, kterou můžete předvídat',
  'web.home.pillars.economics.body':
    'Jedna cena, každá dodávaná funkce, 30 aktivních kanálů a neomezený počet členů týmu. Využití platformy, které si poskytovatel účtuje za operaci, je zahrnuto v ceně a zobrazeno před potvrzením akce.',
  'web.home.pillars.economics.proof':
    'Neexistuje žádný kreditní systém pro generování obrázků nebo videa, protože Relay negeneruje média.',

  'web.home.honest.title': 'Co relé nedělá',
  'web.home.honest.lede':
    'Toto jsou hranice, nikoli škádlení s plánem. Pokud se jeden z nich změní, změní se nejprve v changelogu.',
  'web.home.honest.noMedia':
    'Žádné AI generování obrazu a žádné AI generování videa. Relay přizpůsobuje, schvaluje, publikuje a měří média, která přinášíte.',
  'web.home.honest.noAutomationOfEngagement':
    'Žádné automatické lajky, sledování, opětovné příspěvky, nevyžádané odpovědi ani přímé zprávy. Žádné moduly zapojení a žádné vymyšlené zapojení.',
  'web.home.honest.noUnofficial':
    'Žádná automatizace prohlížeče, žádné přehrávání souborů cookie, žádné škrábání a žádné neoficiální koncové body odesílání. Pouze oficiální rozhraní API platformy.',
  'web.home.honest.noPromises':
    'Žádný příslib ohledně dosahu, hodnocení nebo zapojení. Relé vám může říct, co se stalo a co dále testovat. Nemůže vám říct, co publikum udělá.',
  'web.home.honest.noUnattendedPublishing':
    'Ve výchozím nastavení žádné bezobslužné publikování. Zástupce může navrhnout, ověřit a požádat o schválení. Člověk se rozhoduje dříve, než se cokoli stane veřejným, pokud se záměrně neodhlásíte od konkrétní politiky.',

  'web.home.surfaces.title': 'Pět povrchů, jeden backend',
  'web.home.surfaces.body':
    'Stejné případy použití, stejné kontroly pronájmu, stejné validátory a stejné pracovní postupy publikování. Plocha je cesta dovnitř, nikdy zkratka za pravidlem.',
  'web.home.surfaces.web': 'Webová aplikace',
  'web.home.surfaces.webBody': 'Skladatel, kalendář, schvalování, analýzy, připojení a nastavení.',
  'web.home.surfaces.api': 'REST API',
  'web.home.surfaces.apiBody':
    'Klíče s rozsahem, klíče idempotence při každém zápisu, stránkování kurzoru, překlepy.',
  'web.home.surfaces.mcp': 'Vzdálený server MCP',
  'web.home.surfaces.mcpBody':
    'Streamovatelné HTTP, OAuth, rozsahy jednotlivých nástrojů a náhled před každým následným voláním.',
  'web.home.surfaces.cli': 'CLI',
  'web.home.surfaces.cliBody':
    'Stabilní strojově čitelný výstup pro skripty a nepřetržitou integraci.',
  'web.home.surfaces.webhooks': 'Podepsané webhooky',
  'web.home.surfaces.webhooksBody':
    'Publikujte výsledky, rozhodnutí o schválení a stav připojení s opětovným doručením.',

  'web.home.closing.title': 'Začněte s jedním účtem a jedním příspěvkem',
  'web.home.closing.body':
    'Připojte jeden účet, navrhněte jeden příspěvek, sledujte průběh ověřování, naplánujte jej a přečtěte si potvrzení. To je celý produkt za přibližně deset minut.',

  /* ---------------------------------------------------------------------- */
  /* Product                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.product.title': 'Publikační stůl',
  'web.product.lede':
    'Sedm otázek musí být zodpovězeno v každém kroku bez kliknutí na cokoli: co se zveřejňuje, kde, jakou verzi každý účet obdrží, kdy a v jakém časovém pásmu, kdo to schválil, kolik to může stát a co se stalo.',

  'web.product.step.source.title': 'Zdroj',
  'web.product.step.source.body':
    'Začněte od briefu, souboru, který již máte, položky RSS nebo požadavku od agenta. Dovezená média si uchovávají původ, který jste jim poskytli, včetně toho, odkud pochází a kdo je držitelem práv.',
  'web.product.step.compose.title': 'Napište jednou a poté přepište',
  'web.product.step.compose.body':
    'Hlavní verze řídí každý cíl. Výběrem jednoho účtu se otevře přepsání pouze pro tento účet: jeho vlastní text, vlastní oříznutí média, vlastní nastavení, vlastní počítadlo aktivních limitů a vlastní náhled. Resetování přepsání obnoví hlavní server jednou akcí a nejprve vám ukáže rozdíl.',
  'web.product.step.validate.title': 'Ověřte, než se cokoli zařadí do fronty',
  'web.product.step.validate.body':
    'Ověření je deterministické a běží na serveru. Kontroluje limity platformy ze snímku funkcí verze, typ účtu, alternativní text, mediální práva, pravidla duplikace a kadence, rozlišení zmínek a cíle a odhadované náklady na používání platformy. Každý problém pojmenovává cíl, ke kterému patří, a jak jej opravit.',
  'web.product.step.approve.title': 'Schválit jednou',
  'web.product.step.approve.body':
    'Schválení je zásadou pracovního prostoru, nikoli zvykem. Recenzent vidí každý cíl, každou variantu, časové pásmo, stav soukromí a odhadované náklady na jedné obrazovce a funguje to na telefonu. Obsah změněný po schválení vyžaduje opětovné schválení.',
  'web.product.step.schedule.title': 'Rozvrh v reálném časovém pásmu',
  'web.product.step.schedule.body':
    'V každém naplánovaném příspěvku je uložen okamžik a časové pásmo IANA, nikdy naivní místní čas. Přechody na letní čas se zobrazí před potvrzením, nejsou objeveny později.',
  'web.product.step.publish.title': 'Zveřejněte a uschovejte účtenku',
  'web.product.step.publish.body':
    'Každý cíl je odeslán s klíčem idempotence. Cíl, který selže, nevrací zpět cíl, který uspěl, a tento stav má svůj vlastní název: částečně publikován. Každý výsledek vytvoří neměnnou účtenku s externím ID příspěvku, identifikátorem požadavku, historií pokusů a přesnou chybou, pokud nějaká byla.',
  'web.product.step.learn.title': 'Další informace',
  'web.product.step.learn.body':
    'Metriky jsou normalizovány, pojmenovány, přiřazeny platformě, která je nahlásila, a označeny časem aktuálnosti. Metrika, kterou platforma nehlásí, je označena jako nedostupná s důvodem. Nikdy se nevykreslí jako nula.',

  'web.product.shot.caption':
    'Snímky obrazovky na této stránce jsou zachyceny z běžícího produktu. Dokud není povrch dostatečně úplný, aby se dal poctivě vyfotografovat, popisujeme jej slovy, místo abychom jej kreslili.',
  'web.product.shot.pending': 'Snímek obrazovky čeká na zachycení',
  'web.product.shot.pendingReason':
    'Tento povrch se stále buduje. Spíše než ilustraci zveřejníme skutečný záběr.',

  'web.product.states.title': 'Státy, které nikdo rád nenavrhuje',
  'web.product.states.body':
    'Publikační nástroj se posuzuje podle špatného dne, nikoli podle dobrého. Každý z nich má navrženou obrazovku, prostou větu a další akci.',
  'web.product.states.partial':
    'Částečně zveřejněno: které cíle jsou aktivní, které selhaly a proč.',
  'web.product.states.revoked':
    'Zrušený token nalezený v době odeslání s cestou opětovného připojení.',
  'web.product.states.rateLimited':
    'Omezení rychlosti platformy, kdy se resetuje a co je za ní ve frontě.',
  'web.product.states.duplicate':
    'Duplikát nebo blok kadence s pravidlem, které bylo spuštěno, a cestou odvolání.',
  'web.product.states.offline': 'Při psaní offline: nic, co jste napsali, se neztratí.',
  'web.product.states.permission':
    'Akce, kterou vaše role neumožňuje, pojmenujte roli, která to umožňuje.',

  /* ---------------------------------------------------------------------- */
  /* Integrations and capability matrix                                      */
  /* ---------------------------------------------------------------------- */

  'web.integrations.title': 'Platformy',
  'web.integrations.lede':
    'Relé se připojuje prostřednictvím oficiálních rozhraní API platformy. Každý konektor má pojmenovaného vlastníka, zaznamenanou adresu URL zásad a datum kontroly. Konektor není uveden jako podporovaný, dokud neprojde definicí konektoru done.',
  'web.integrations.reviewNotice.title':
    'Žádný konektor není popsán jako oficiální, dokud jej platforma neschválí',
  'web.integrations.reviewNotice.body':
    'Několik platforem vyžaduje kontrolu aplikace, než může být aplikace publikována jménem zákazníka. Pokud je tato recenze nedořešená, konektor to říká a přesně popisuje, co je omezeno, dokud neprojde.',
  'web.integrations.accountTypes': 'Typy účtů, které může tento konektor publikovat na',
  'web.integrations.restriction': 'Omezení, které byste měli znát před připojením',
  'web.integrations.cost': 'Náklady na používání platformy',
  'web.integrations.viewMatrix': 'Zobrazit všechny funkce této platformy',

  'web.capabilities.title': 'Matrice schopností konektoru',
  'web.capabilities.lede':
    'Vygenerováno ze stejných definic konektorů, které produkt čte, a poté je před zveřejněním zkontroluje osoba. Marketing nemůže slíbit něco, co adaptér nedokáže.',
  'web.capabilities.legend.title': 'Jak číst tuto tabulku',
  'web.capabilities.legend.body':
    'Čtyři stavy a na rozdílu mezi prostředními dvěma záleží. Ještě nevybudováno je naše nevyřízená záležitost. To, že platforma nenabízí, je fakt o platformě, který žádný nástroj nedokáže obejít.',
  'web.capabilities.tableCaption':
    'Schopnosti podle platformy. Každá buňka pojmenuje svůj stav slovy i barvou.',
  'web.capabilities.snapshot': 'Verze definic konektorů {version}, recenzováno {date}',
  'web.capabilities.sourceNote':
    'Každý nárok na platformu v této tabulce odkazuje na oficiální dokumentaci, ze které pochází, a datum, kdy jsme jej naposledy četli.',

  /* ---------------------------------------------------------------------- */
  /* Audience pages                                                          */
  /* ---------------------------------------------------------------------- */

  'web.creators.title': 'Pro tvůrce',
  'web.creators.lede':
    'Zveřejňujete stejný nápad v několika formátech, někdy ve více než jednom jazyce, a jste celý tým. Práce, kterou Relay odstraňuje, je přepisování, opětovné ořezávání a kontrola.',
  'web.creators.job.adapt.title': 'Napište to jednou, odešlete pět nativních verzí',
  'web.creators.job.adapt.body':
    'Hlavní verze nese myšlenku. Každý účet získá délku, oříznutí, nastavení a tón, který platforma očekává, a můžete je všechny vidět vedle sebe, než se zapíšete.',
  'web.creators.job.languages.title': 'Publikovat v jiném jazyce bez hádání',
  'web.creators.job.languages.body':
    'Přepis zachovává záměr spíše než slova, používá glosář vaší značky a označí, zda jej četl nativní recenzent. Nic není publikováno v jazyce, za který nemůžete ručit, pokud to neřeknete.',
  'web.creators.job.rights.title': 'Uchovávejte záznam o svých právech u souboru',
  'web.creators.job.rights.body':
    'Média nesou, odkud pochází, kdo je držitelem práv a zda byla vytvořena pomocí generativního nástroje. Platformy se stále více ptají. Relay uloží vaši odpověď s aktivem, místo aby se vás znovu zeptal.',
  'web.creators.job.cost.title': 'Znáte cenu před odesláním příspěvku',
  'web.creators.job.cost.body':
    'X účtuje za operaci a účtuje více za příspěvek obsahující adresu URL. Relay to odhadne, než to potvrdíte, takže náročný týden na odkaz je spíše rozhodnutím než překvapením z faktury.',
  'web.creators.notFor.title': 'Co to není',
  'web.creators.notFor.body':
    'Relay negeneruje obrázky ani video, nespouští automatizaci zapojení a nepředpovídá, jak bude příspěvek fungovat. Pokud to jsou nástroje, které chcete, dělají je jiné produkty a my bychom byli raději, kdybyste to věděli hned.',

  'web.agencies.title': 'Pro agentury',
  'web.agencies.lede':
    'Zveřejňujete jménem jiných lidí, což činí připisování, schvalování a důkazy součástí práce spíše než maličkostí.',
  'web.agencies.job.separation.title': 'Oddělení klientů, které vydrží',
  'web.agencies.job.separation.body':
    'Každý pracovní prostor je izolován na úrovni databáze i v aplikaci. Dotaz, který překročí hranici pracovního prostoru, selže v Postgresu, a to nejen v cestě kódu, kterou by někdo mohl zapomenout.',
  'web.agencies.job.approval.title': 'Schválení, která může klient skutečně použít',
  'web.agencies.job.approval.body':
    'Revizor vidí každý cíl, každou variantu, plán s jeho časovým pásmem a odhadovanou cenou na jediné obrazovce a obrazovka funguje na telefonu. Rozhodnutí o schválení se zaznamenávají s tím, kdo, kdy a co viděl.',
  'web.agencies.job.receipts.title': 'Důkaz pro nepříjemný rozhovor',
  'web.agencies.job.receipts.body':
    'Každá publikace vytváří neměnnou účtenku s externím ID příspěvku a úplnou historií pokusů. Když se klient zeptá, zda se něco pokazilo v devět, odpověď má připojené časové razítko a identifikátor platformy.',
  'web.agencies.job.roles.title': 'Role, které odpovídají tomu, jak je práce rozdělena',
  'web.agencies.job.roles.body':
    'Vlastník, správce, manažer, editor, schvalovatel, analytik a divák, v rozsahu podle značky a účtu. Neomezený počet členů týmu, protože poplatky za sedadlo nutí agentury sdílet přihlášení a to je bezpečnostní problém.',
  'web.agencies.limits.title': 'Hranice, jasně vyjádřená',
  'web.agencies.limits.body':
    'Jeden plán pokrývá 30 aktivních sociálních kanálů. Kanál je jeden sociální účet, stránka, profil, skupina nebo připojení k publikaci. Pokud potřebujete více než 30, řekněte nám, co potřebujete, a my vám dáme přímou odpověď, nikoli skrytou úroveň.',

  'web.developers.title': 'Pro vývojáře',
  'web.developers.lede':
    'Publikování je část pracovního postupu, kde je chyba veřejná a trvalá. Relay vám poskytuje jeden backend, typové chyby, idempotenci při každém zápisu a schvalovací model, který si agent nedokáže vymluvit.',
  'web.developers.surface.api.title': 'REST API',
  'web.developers.surface.api.body':
    'Klíče API s rozsahem, klíč idempotency vyžadovaný při každém zápisu, stránkování kurzoru a napsaná chybová obálka se stabilním kódem, klíč zprávy a vyčištěné detaily. Žádné užitečné zatížení poskytovatele se vám nikdy neodrazí v nezpracované podobě.',
  'web.developers.surface.mcp.title': 'Vzdálený server MCP',
  'web.developers.surface.mcp.body':
    'Streamovatelný HTTP s OAuth. Nástroje jsou granulované a každý deklaruje své vedlejší účinky. Čtení, navrhování, žádosti o schválení, plánování a publikování jsou samostatné oblasti, takže model, který umí navrhovat, nelze publikovat.',
  'web.developers.surface.cli.title': 'CLI',
  'web.developers.surface.cli.body':
    'Každý příkaz podporuje strojově čitelný výstup se stabilním tvarem, takže skript jej může analyzovat a souvislá integrační úloha na něm může selhat.',
  'web.developers.surface.webhooks.title': 'Podepsané webhooky',
  'web.developers.surface.webhooks.body':
    'Publikovat výsledky, rozhodnutí o schválení, stav připojení a výsledky ověření, podepsané, odolné proti opětovnému přehrávání a znovu doručitelné z řídicího panelu.',
  'web.developers.safety.title': 'Model bezpečnosti agentů',
  'web.developers.safety.body':
    'Pověření agenta je účet služby s rozsahem, nikoli kopie relace osoby. Přenáší omezení pro každou značku, účet, národní prostředí, doménu, kadenci a výhled do budoucna a server znovu autorizuje každý hovor, místo aby důvěřoval hostiteli agenta.',
  'web.developers.safety.injection':
    'Webové stránky, zdroje, komentáře a odpovědi platformy jsou považovány za nedůvěryhodná data. Výstup modelu je deterministicky revalidován, protože model, který říká, že příspěvek je v pořádku, není bezpečnostní rozhodnutí.',
  'web.developers.safety.killSwitch':
    'Každý agent a každý pracovní prostor má přepínač zabíjení, který zastaví čekající práci, aniž by jej smazal.',
  'web.developers.openSource.title': 'Otevřené kusy',
  'web.developers.openSource.body':
    'Smlouva o konektoru, rozhraní příkazového řádku, příklady schémat, definice nástrojů MCP a simulátor poskytovatele jsou součásti, které potřebujete sestavit proti Relay bez účtu sandbox. Tam, kde repozitář ještě není publikován, je to na této stránce uvedeno spíše než odkaz na nic.',

  /* ---------------------------------------------------------------------- */
  /* Pricing                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.pricing.title': 'Jeden plán',
  'web.pricing.lede':
    'Neexistují žádné úrovně funkcí, takže neexistuje žádná srovnávací tabulka ke čtení. Oba fakturační intervaly odemknou všechny dodané funkce.',
  'web.pricing.intervalHeading': 'Vyberte si způsob platby',
  'web.pricing.monthlyLabel': 'Účtováno měsíčně',
  'web.pricing.annualLabel': 'Fakturováno ročně',
  'web.pricing.annualDetail': '300 $ účtováno jednou ročně.',
  'web.pricing.monthlyDetail': '29 $ účtováno každý měsíc.',
  'web.pricing.perMonthNote':
    'Ceny jsou v amerických dolarech. Polar přidává veškerou daň z obratu nebo DPH, která platí tam, kde se nacházíte.',

  'web.pricing.beside.title': 'S čím souhlasíte',
  'web.pricing.beside.channels':
    '30 aktivních sociálních kanálů. Kanál je jeden sociální účet, stránka, profil, skupina nebo připojení k publikaci.',
  'web.pricing.beside.members':
    'Neomezený počet členů týmu, pracovních prostorů a skupin značek. Neexistuje žádný poplatek za sedadlo.',
  'web.pricing.beside.fairUse':
    'Neomezený počet konceptů, plánovaných příspěvků a uložených účtenek podle zveřejněných zásad fair use a anti spam. Tyto ovládací prvky slouží k ochraně vašich připojených účtů a vztahují se identicky na každého předplatitele.',
  'web.pricing.beside.metered':
    'X účtuje za operaci API a účtuje více za příspěvek, který obsahuje adresu URL. Relé to projde za cenu, odhadne to, než akci potvrdíte, a ukáže to při vašem použití. Ostatní poplatky za platformu se promítají pouze tehdy, když jsou zveřejněny před akcí.',
  'web.pricing.beside.noMedia':
    'Generování obrazu AI a generování videa AI nejsou součástí dodávky a neprodávají se. Nejsou zde žádné titulky médií, protože Relay negeneruje média.',
  'web.pricing.beside.trial':
    'Zkušební verze běží po dobu sedmi dnů s každou funkcí. Polar vybírá platební metodu u pokladny a dnes účtuje 0 USD. Než to potvrdíte, vedle počáteční akce se zobrazí přesná částka a datum prvního poplatku.',
  'web.pricing.beside.conversion':
    'Pokud nic neuděláte, zkušební den se sedmý den převede na vámi zvolený interval a společnost Polar si naúčtuje částku uvedenou u pokladny. Polar pošle e-mail s připomenutím tři dny předtím, než se tak stane.',
  'web.pricing.beside.cancel':
    'Zrušit v Nastavení kdykoli bez kontaktování podpory. Zrušte před převodem zkušební verze a neproběhne žádný pokus o nabití. Poté zrušte a ponecháte si přístup až do konce placeného období.',
  'web.pricing.beside.data':
    'Po skončení předplatného se nic nesmaže. Svůj obsah, účtenky a analýzy můžete exportovat a sami je můžete smazat.',

  'web.pricing.included.title': 'Zahrnuto, v obou intervalech',
  'web.pricing.compare.title': 'Proč zde není žádná srovnávací tabulka',
  'web.pricing.compare.body':
    'Existuje srovnávací tabulka, která ukazuje, co může levnější plán přinést. Existuje jeden plán, takže tabulka bude mít jeden sloupec. Pokud někdy přidáme úroveň, řekneme, co se přesunulo a proč na seznamu změn, než se změní stránka s cenou.',

  'web.pricing.testimonials.title': 'Na této stránce zatím nejsou žádné nabídky zákazníků',
  'web.pricing.testimonials.body':
    'Cenová nabídka se objeví pouze tehdy, když ji zákazník napsal, dal k tomu písemný souhlas a my můžeme ukázat na práci, kterou popisuje. Do té doby je prázdný prostor upřímnější než stěna vymyšlené chvály.',

  'web.pricing.faq.title': 'Otázky, které si lidé kladou před zaplacením',
  'web.pricing.faq.channels.q': 'Co se stane, když přejdu přes 30 kanálů',
  'web.pricing.faq.channels.a':
    'Nic není odpojeno a nic není smazáno. Kanály překračující limit se stanou pouze pro čtení, vy si vyberete, které zůstanou aktivní, a my vám to řekneme, než se tak stane.',
  'web.pricing.faq.refund.q': 'Vrátíte peníze',
  'web.pricing.faq.refund.a':
    'Ano, podle zveřejněných zásad pro vrácení peněz a zrušení a vždy tam, kde to vyžaduje zákon na ochranu spotřebitele. Fakturaci zajišťuje společnost Polar jako obchodník a vracení peněz prostřednictvím společnosti Polar.',
  'web.pricing.faq.selfHost.q': 'Mohu to spustit sám',
  'web.pricing.faq.selfHost.a':
    'Dnes ne. Zda bude edice s vlastním hostitelem a pod jakou licencí, je otevřené rozhodnutí. Odpověď zveřejníme spíše než naznačíme jednu.',
  'web.pricing.faq.xCost.q': 'Kolik mě X skutečně bude stát',
  'web.pricing.faq.xCost.a':
    'Záleží na tom, kolik příspěvků publikujete a kolik z nich obsahuje URL, protože X je oceňuje jinak. Relay odhadne každou akci předtím, než ji potvrdíte, a sečte ji ve vašem zobrazení využití. Neoznačujeme to.',
  'web.pricing.faq.trialAbuse.q': 'Mohu zahájit druhou zkušební verzi',
  'web.pricing.faq.trialAbuse.a':
    'Opakované pokusy jsou omezeny společností Polar. Pokud máte legitimní důvod, kontaktujte podporu a osoba se na to podívá.',

  /* ---------------------------------------------------------------------- */
  /* Resources index                                                         */
  /* ---------------------------------------------------------------------- */

  'web.resources.title': 'Zdroje',
  'web.resources.lede': 'Provozní pravda o produktu a výzkum za vším, co o platformě tvrdíme.',
  'web.resources.status.body':
    'Aktuální stav každého povrchu a každého konektoru s historií incidentů.',
  'web.resources.changelog.body': 'Co bylo dodáno, co se změnilo na konektoru a co jsme opravili.',
  'web.resources.docs.body': 'Dokumentace REST API, MCP, CLI a webhooku.',
  'web.resources.methodology.body':
    'Jak zkoumáme, datujeme, pocházíme a opravujeme každý nárok na platformu.',
  'web.resources.compare.body':
    'Datovaná srovnání s jinými nástroji, včetně toho, komu který z nich vyhovuje.',
  'web.resources.capabilities.body': 'Na platformu, na funkci, generované z definic konektorů.',
  'web.resources.toolRadar.body':
    'Specializované kreativní nástroje, datované, s omezeními a zveřejněním.',
  'web.resources.opportunities.body':
    'Vybraná místa ke spuštění, vypsání nebo přispění podle pravidel každého cíle.',
  'web.resources.legal.body':
    'Podmínky, soukromí, přijatelné použití, použití AI, zabezpečení a zbytek sady zásad.',
  'web.resources.guides.title': 'Průvodci a pracovní postupy',
  'web.resources.guides.empty': 'Dosud nebyl publikován žádný průvodce',
  'web.resources.guides.emptyBody':
    'Redakční standard vyžaduje originální produktová data, reprodukovatelný pracovní postup, primární zdroje platformy s datem ověření a jmenovaného lidského editora. První průvodci publikují, když se s tím setkají.',

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.status.title': 'Stav',
  'web.status.lede':
    'Stav každého povrchu relé a každého konektoru. Stav konektoru pokrývá náš adaptér a platformu API, na které závisí.',
  'web.status.updated': 'Zaškrtnuto {time}',
  'web.status.surfaces.title': 'Povrchy',
  'web.status.connectors.title': 'Konektory',
  'web.status.level.operational': 'Funguje normálně',
  'web.status.level.degraded': 'Degradováno',
  'web.status.level.partial': 'Částečný výpadek',
  'web.status.level.outage': 'Výpadek',
  'web.status.level.maintenance': 'Plánovaná údržba',
  'web.status.level.notLive': 'Zatím neaktivní',
  'web.status.notLiveBody':
    'Tento konektor je vytvořen, ale zatím nepřenáší zákaznický provoz, takže není o čem hlásit.',
  'web.status.incidents.title': 'Historie incidentů',
  'web.status.incidents.empty': 'Nebyl zaznamenán žádný incident',
  'web.status.incidents.emptyBody':
    'Tato stránka začíná záměrně prázdná. Zveřejňujeme každý incident, který ovlivnil publikování, včetně těch způsobených našimi vlastními chybami, s časovou osou a tím, co se poté změnilo.',
  'web.status.incident.started': 'Zahájeno {time}',
  'web.status.incident.resolved': 'Vyřešeno {time}',
  'web.status.incident.impact': 'Dopad',
  'web.status.incident.cause': 'Příčina',
  'web.status.incident.followUp': 'Co se změnilo poté',
  'web.status.subscribe.title': 'Dejte si vědět, když se něco rozbije',
  'web.status.subscribe.body':
    'Stav připojení, selhání publikování a incidenty platformy jsou dodávány jako podepsané webhooky do vašeho vlastního koncového bodu. Zatím neexistuje žádný samostatný seznam adresátů stavu.',

  /* ---------------------------------------------------------------------- */
  /* Changelog                                                               */
  /* ---------------------------------------------------------------------- */

  'web.changelog.title': 'Changelog',
  'web.changelog.lede':
    'Změny produktu, změny a opravy konektorů. Změna funkce, která ovlivňuje to, co můžete publikovat, se objeví zde dříve, než se objeví kdekoli jinde na tomto webu.',
  'web.changelog.kind.shipped': 'Dodáno',
  'web.changelog.kind.changed': 'Změněno',
  'web.changelog.kind.fixed': 'Opraveno',
  'web.changelog.kind.connector': 'Konektor',
  'web.changelog.kind.correction': 'Oprava',
  'web.changelog.kind.security': 'Zabezpečení',
  'web.changelog.empty': 'Zatím nebylo nic veřejně odesláno',
  'web.changelog.emptyBody':
    'Relé je sestaveno. První položka zde je první věc, kterou může zákazník použít, nikoli milník o nás samých.',

  /* ---------------------------------------------------------------------- */
  /* Docs shell                                                              */
  /* ---------------------------------------------------------------------- */

  'web.docs.title': 'Dokumentace',
  'web.docs.lede':
    'Jeden backend, čtyři cesty dovnitř. Každá sekce dokumentuje stejné případy použití, takže koncept, který se naučíte v REST API, je stejný koncept v MCP a v CLI.',
  'web.docs.section.start.title': 'Začínáme',
  'web.docs.section.start.body':
    'Autentizace, pracovní prostory, značky a váš první publikovaný příspěvek.',
  'web.docs.section.api.title': 'REST API',
  'web.docs.section.api.body': 'Zdroje, stránkování, idempotence, chybové kódy a limity sazeb.',
  'web.docs.section.mcp.title': 'MCP server',
  'web.docs.section.mcp.body': 'Doprava, OAuth, katalog nástrojů, rozsahy a schvalovací handshake.',
  'web.docs.section.cli.title': 'CLI',
  'web.docs.section.cli.body': 'Nainstalujte, ověřte a smlouvu o strojově čitelném výstupu.',
  'web.docs.section.webhooks.title': 'Webhooky',
  'web.docs.section.webhooks.body':
    'Katalog událostí, ověření podpisu, opakované pokusy a opětovné doručení.',
  'web.docs.section.connectors.title': 'Konektory',
  'web.docs.section.connectors.body':
    'Podle požadavků platformy, typů účtů, limitů a známých omezení.',
  'web.docs.section.errors.title': 'Odkaz na chybu',
  'web.docs.section.errors.body': 'Každý chybový kód, co jej způsobuje a co s tím dělat.',
  'web.docs.pending': 'Dosud nezveřejněno',
  'web.docs.pendingBody':
    'Tato sekce je napsána proti dodanému API a publikuje se s ním. Raději vám neukážeme nic než dokumentaci pro koncový bod, který se může změnit.',
  'web.docs.principles.title': 'Na co se můžete spolehnout',
  'web.docs.principles.idempotency':
    'Každý zápis vyžaduje klíč idempotence. Opakované přehrání požadavku se stejným klíčem vrátí původní výsledek namísto vytvoření druhého příspěvku.',
  'web.docs.principles.errors':
    'Každá chyba nese stabilní kód, klíč zprávy a vyčištěné detaily. Kódy mezi verzemi nemění význam.',
  'web.docs.principles.versioning':
    'Porušující změny dostanou novou verzi a ohlášené okno ukončení podpory. Aditivní změny ne.',
  'web.docs.principles.scopes':
    'Čtení, vytváření návrhů, žádosti o schválení, plánování a publikování jsou samostatné oblasti. Pověření získá nejmenší sadu, která dělá svou práci.',

  /* ---------------------------------------------------------------------- */
  /* Methodology                                                             */
  /* ---------------------------------------------------------------------- */

  'web.methodology.title': 'Metodika',
  'web.methodology.lede':
    'Jak se cokoli na tomto webu nazývá pravdivým a co se stane, když se ukáže, že tomu tak není.',
  'web.methodology.claims.title': 'Nároky platformy',
  'web.methodology.claims.body':
    'Každé tvrzení o tom, co platforma umožňuje, pochází z vlastní dokumentace nebo stránky zásad dané platformy. Zaznamenáváme adresu URL, datum, kdy byla přečtena, verzi API, na kterou se vztahuje, a osobu, která ji vlastní, znovu kontroluje. Nárok bez těchto čtyř věcí na web nejde.',
  'web.methodology.recheck.title': 'Když znovu zkontrolujeme',
  'web.methodology.recheck.beforeConnector':
    'Před spuštěním konektoru a znovu před tím, než přenese zákaznický provoz.',
  'web.methodology.recheck.monthly': 'Každý měsíc pro protokoly změn platformy a ceny dodavatele.',
  'web.methodology.recheck.quarterly':
    'Každé čtvrtletí pro plány konkurentů, pravidla komunity a právní dokumenty.',
  'web.methodology.recheck.immediate':
    'Okamžitě po jakémkoli zamítnutí platformy, oznámení o vynucení, ukončení podpory nebo nevysvětlitelné změně v publikačním nebo analytickém chování.',
  'web.methodology.comparison.title': 'Srovnání',
  'web.methodology.comparison.bestFor':
    'V každém srovnání je uvedeno, pro koho je který produkt nejlepší, včetně případů, kdy to nejsme my.',
  'web.methodology.comparison.dated':
    'Každé srovnání nese datum výzkumu a spojuje primární zdroje cen a schopností.',
  'web.methodology.comparison.distinction':
    'Chybějící schopnost je označena buď jako něco, co jsme nevytvořili, nebo jako něco, co platforma neumožňuje. Jsou to různé věty a nikdy je neslučujeme.',
  'web.methodology.comparison.noLogos':
    'Nepoužíváme loga, nabídky nebo snímky rozhraní zákazníků jiných společností a nenárokujeme si podporu, kterou nemáme.',
  'web.methodology.benchmarks.title': 'Srovnávací hodnoty a produktová data',
  'web.methodology.benchmarks.body':
    'Jakékoli číslo získané z aktivity zákazníka uvádí jeho vzorek, jeho vyloučení, definici jeho metriky a jeho práh soukromí a je agregováno, takže nelze identifikovat žádný pracovní prostor. Pokud je vzorek příliš malý na to, aby jej bylo možné bezpečně publikovat, říkáme to, místo abychom jej přesto zveřejnili.',
  'web.methodology.ai.title': 'AI v našem vlastním obsahu',
  'web.methodology.ai.body':
    'Model může zkoumat, navrhovat, překládat, kontrolovat a formátovat. Jmenovaná osoba vlastní každý nárok, upravuje dílo a udržuje jej aktuální. Nezveřejňujeme nerecenzované vygenerované články a negenerujeme snímky obrazovky.',
  'web.methodology.corrections.title': 'Opravy',
  'web.methodology.corrections.body':
    'Když je stránka chybná, opravíme ji na místě, přidáme poznámku s datem a opravu zapíšeme do seznamu změn. Když je stránka příliš zastaralá na to, aby se dala opravit, raději ji odebereme, než abychom ji opustili.',

  /* ---------------------------------------------------------------------- */
  /* Compare                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.compare.title': 'Srovnání',
  'web.compare.lede':
    'Tyto stránky jsou užitečné, i když si vyberete jiný produkt. To je standard, který musí splnit před zveřejněním.',
  'web.compare.rules.title': 'Pravidla, kterými se tyto stránky řídí',
  'web.compare.rules.bestFor':
    'Na každé stránce je nejprve ve své vlastní sekci uvedeno, pro koho je druhý produkt nejlepší.',
  'web.compare.rules.dated':
    'Každý nárok je datován a odkazuje na primární zdroj, ze kterého pochází.',
  'web.compare.rules.distinction':
    'Oddělujeme to, co jsme nevybudovali, od toho, co platforma neumožňuje.',
  'web.compare.rules.axes':
    'Každá stránka porovnává stejné věci: příspěvek na účet, limity pro odesílání, tým a schválení, API, přístup k MCP a CLI, jazyky obsahu, analýzy, zpracování videa, vestavěné použití, vlastní hosting, podpora a náklady na rozhraní API platformy, které platíte navrch.',
  'web.compare.rules.correction': 'Na každé stránce je uveden kontakt na opravu a datum kontroly.',
  'web.compare.planned.title': 'Plánované stránky',
  'web.compare.planned.body':
    'Ty se zveřejní, jakmile bude dokončena kontrola aktuálních cen a schopností. Porovnání zapsané z paměti je horší než žádné srovnání.',
  'web.compare.empty': 'Dosud nebylo zveřejněno žádné srovnání',
  'web.compare.emptyBody':
    'Každá stránka potřebuje novou kontrolu faktů oproti cenám a dokumentaci jiného produktu. Po dokončení práce publikují jednu po druhé.',

  /* ---------------------------------------------------------------------- */
  /* Tool radar                                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.title': 'Kreativní nástroj radar',
  'web.toolRadar.lede':
    'Relé negeneruje obrázky ani video. Pomůže vám to rozhodnout se, který speciální nástroj použít, a přinést hotové dílo s neporušeným záznamem práv.',
  'web.toolRadar.record.title': 'Co musí nést každá deska',
  'web.toolRadar.record.url': 'Oficiální adresa URL a organizace, která produkt vlastní.',
  'web.toolRadar.record.useCase':
    'Pracovní postup, pro který je doporučován, a jeho zdokumentovaná omezení.',
  'web.toolRadar.record.pricing': 'Jeho cenový model a datum, kdy jsme jej zkontrolovali.',
  'web.toolRadar.record.rights':
    'Jeho práva, licencování, uchovávání a upozornění na soukromí, slovy dodavatele.',
  'web.toolRadar.record.disclosure':
    'Zda s ním máme nějaké obchodní vztahy. Pořadí na tom nikdy nezávisí.',
  'web.toolRadar.record.verified':
    'Poslední ověřené datum a viditelné varování, jakmile záznam překročí okno kontroly.',
  'web.toolRadar.category.title': 'Kategorie',
  'web.toolRadar.empty': 'Katalog ještě není naplněn',
  'web.toolRadar.emptyBody':
    'Záznamy píše osoba z vlastní dokumentace dodavatele. Tuto stránku nezaplníme odkazy vygenerovanými modelem, které vypadají věrohodně.',
  'web.toolRadar.noAffiliateYet':
    'S žádným zde dnes uvedeným nástrojem neexistuje žádný přidružený vztah.',

  /* ---------------------------------------------------------------------- */
  /* Opportunities                                                           */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.title': 'Příležitosti propagace',
  'web.opportunities.lede':
    'Spravovaný katalog míst, kde lze produkt uvést na trh, uvést, diskutovat nebo přispívat, s pravidly, která si každá destinace stanoví sama pro sebe.',
  'web.opportunities.rules.title': 'Jak se tento katalog chová',
  'web.opportunities.rules.curated':
    'Každý záznam je zkontrolovaný záznam s oficiální adresou URL, aktuálními pravidly pro odesílání a datem ověření. Modelem není nic objeveno a prezentováno jako ověřené.',
  'web.opportunities.rules.noAutomation':
    'Relay za vás nikdy neodesílá formulář, neodepisuje kontakt, neposílá hromadné e-maily nebo příspěvky do komunity. Odešlete vy.',
  'web.opportunities.rules.noGuarantee':
    'Zápis není příslib hodnocení a odkaz není strategie růstu. Ukážeme vám zdatnost, publikum, úsilí, náklady a požadavky na zveřejnění, takže se můžete rozhodnout, zda to za vaše odpoledne stojí.',
  'web.opportunities.rules.stale':
    'Záznam po datu revize je spíše označen nebo skrytý než zobrazen jako aktuální.',
  'web.opportunities.category.title': 'Kategorie',
  'web.opportunities.empty': 'Katalog ještě není naplněn',
  'web.opportunities.emptyBody':
    'Každá pravidla destinace si musí přečíst a zaznamenat osoba, než je lze doporučit. Kategorie jsou uvedeny výše, takže můžete vidět podobu toho, co přichází.',

  /* ---------------------------------------------------------------------- */
  /* Legal, shared                                                           */
  /* ---------------------------------------------------------------------- */

  'web.legal.title': 'Právní předpisy a zásady',
  'web.legal.lede':
    'Dokumenty, které řídí používání Relay. V případě, že formulaci musí navrhnout právník pro konkrétní společnost a jurisdikci, stránka to říká namísto předstírání.',
  'web.legal.counselPending.title': 'Čeká na posouzení právníkem před spuštěním',
  'web.legal.counselPending.body':
    'Látka na této stránce odráží, jak se produkt skutečně chová, a je dnes přesný. Závazné právní znění, rozhodná jurisdikce a podmínky odpovědnosti jsou připravovány s kvalifikovaným právníkem a nahradí tento text dříve, než bude služba Relay obecně dostupná. Tato stránka nepředstavuje právní poradenství a zatím to není smlouva.',
  'web.legal.contact.title': 'Kontakt',
  'web.legal.contact.privacy': 'soukromí@relé.příklad',
  'web.legal.contact.legal': 'legal@relay.example',
  'web.legal.contact.security': 'zabezpečení@relé.příklad',
  'web.legal.contact.abuse': 'zneužívání@relé.příklad',
  'web.legal.contact.copyright': 'copyright@relé.příklad',
  'web.legal.contact.affiliates': 'affiliates@relé.příklad',
  'web.legal.contact.accessibility': 'přístupnost@relé.příklad',
  'web.legal.entity.pending':
    'Zadavatel, jeho registrovaná adresa a rozhodná jurisdikce jsou otevřeným rozhodnutím a budou zde uvedeny před spuštěním.',
  'web.legal.index.updated': 'Aktualizováno {date}',

  /* Terms ---------------------------------------------------------------- */
  'web.legal.terms.title': 'Smluvní podmínky',
  'web.legal.terms.summary':
    'Co Relay souhlasí s poskytnutím, s čím souhlasíte a co se stane, když se kterákoli strana zastaví.',
  'web.legal.terms.service.title': 'Co je to služba',
  'web.legal.terms.service.body':
    'Relay je hostovaná služba pro vytváření, schvalování, plánování a publikování obsahu na sociálních platformách prostřednictvím oficiálních rozhraní API těchto platforem spolu s příjmy, analýzami a záznamy auditu, které z toho vyplývají. Není to sociální platforma a nekontroluje, co kterákoli platforma udělá s příspěvkem po jeho zveřejnění.',
  'web.legal.terms.content.title': 'Váš obsah zůstane váš',
  'web.legal.terms.content.body':
    'Zůstáváte vlastnictvím všeho, co nahrajete, napíšete nebo importujete. Relay udělujete pouze licenci potřebnou k jeho uložení, zpracování, přizpůsobení variantám, které požadujete, a přenosu na vámi vybrané účty. Tato licence končí, když smažete obsah, kromě záznamů, které jsme povinni uchovávat.',
  'web.legal.terms.warranties.title': 'Co potvrzujete zveřejněním',
  'web.legal.terms.warranties.body':
    'Že jste oprávněni publikovat na připojených účtech, že jste držiteli práv k obsahu a médiím, že máte souhlas vyžadovaný pro jakoukoli osobu, která se v něm objevuje, a že zveřejnění neporušuje pravidla cílové platformy.',
  'web.legal.terms.platforms.title': 'Závislost na platformě',
  'web.legal.terms.platforms.body':
    'Konektory závisí na API třetích stran, které tyto společnosti ovládají. Platforma může změnit své API, omezit oprávnění, zrušit aplikaci nebo zavřít přístup bez upozornění. Relay nemůže zaručit, že jakýkoli konektor zůstane dostupný, a nedostupnost konektoru není selháním této smlouvy. Až k tomu dojde, budeme vás informovat na stavové stránce a v protokolu změn.',
  'web.legal.terms.ai.title': 'Výstup AI',
  'web.legal.terms.ai.body':
    'Pomoc s textem, překlad, přetvoření a plánování poskytují návrhy. Mohou být chybné, zastaralé nebo nevhodné. Jste odpovědní za kontrolu všeho, co publikujete. Relé negeneruje obrázky ani video.',
  'web.legal.terms.billing.title': 'Platba',
  'web.legal.terms.billing.body':
    'Polar je rekordním obchodníkem. Polar zpracovává pokladny, daně, faktury a refundace. Předplatné se automaticky obnovuje ve vámi zvoleném intervalu, dokud je nezrušíte. Využití platformy, které si poskytovatel účtuje za operaci, je účtováno samostatně v ceně a je zveřejněno před akcí, která k němu dojde.',
  'web.legal.terms.suspension.title': 'Pozastavení a plánované příspěvky',
  'web.legal.terms.suspension.body':
    'Pokud předplatné vyprší nebo je pracovní prostor pozastaven, naplánované příspěvky se zastaví a nepublikují se v tichosti a pracovní prostor se stane pouze pro čtení. Váš obsah, účtenky a připojení jsou zachovány a lze je exportovat.',
  'web.legal.terms.aup.title': 'Přijatelné použití',
  'web.legal.terms.aup.body':
    'Zásady přijatelného užívání tvoří součást těchto podmínek. Můžeme omezit, pozastavit, vyžadovat ověření, zrušit agentovi nebo přístup k API, pozastavit nebo ukončit z důvodu jejich porušení a proti kterémukoli z těchto rozhodnutí se můžete odvolat k určité osobě.',
  'web.legal.terms.termination.title': 'Ukončení smlouvy',
  'web.legal.terms.termination.body':
    'Tu můžete kdykoli zrušit v Nastavení. Po ukončení si před smazáním ponecháte exportní okno a smazání není nikdy podmíněno zaplacením nezaplacené faktury, kromě fakturačních záznamů, které jsme ze zákona povinni uchovávat.',
  'web.legal.terms.developer.title': 'API, MCP a servisní účty',
  'web.legal.terms.developer.body':
    'Programatický přístup se navíc řídí podmínkami API a MCP, včetně limitů sazeb, požadavků na rozsah a pravidla, že servisní účet nikdy nedědí plná oprávnění člověka.',

  /* Privacy -------------------------------------------------------------- */
  'web.legal.privacy.title': 'Zásady ochrany osobních údajů',
  'web.legal.privacy.summary':
    'Co Relay shromažďuje, proč, kdo to zpracovává, jak dlouho je uchováváno a jak to dostat ven nebo nechat smazat.',
  'web.legal.privacy.collect.title': 'Co držíme',
  'web.legal.privacy.collect.account':
    'Účet a profil: vaše jméno, e-mail, členství v pracovním prostoru a role.',
  'web.legal.privacy.collect.connections':
    'Sociální připojení: identifikátor účtu platformy, jeho zobrazovaný název, jeho typ, udělené rozsahy a šifrovaný přístupový token. Tokeny jsou uloženy se šifrováním obálek a nikdy se nezapisují do protokolu.',
  'web.legal.privacy.collect.content':
    'Obsah a média, které vytvoříte, nahrajete nebo importujete, včetně práv a původu, které s ním zaznamenáte.',
  'web.legal.privacy.collect.schedules':
    'Rozvrhy, rozhodnutí o schválení, potvrzení o publikaci a auditní události.',
  'web.legal.privacy.collect.analytics':
    'Metriky získané z platforem o příspěvcích, které jste publikovali prostřednictvím Relay.',
  'web.legal.privacy.collect.billing':
    'Fakturační reference držené společností Polar. Relé neukládá podrobnosti o vaší kartě.',
  'web.legal.privacy.collect.technical':
    'Údaje o zařízení a protokolu potřebné k provozu a zabezpečení služby, ve výchozím nastavení upraveny.',
  'web.legal.privacy.collect.agent':
    'Aktivita agenta a rozhraní API: které pověření provedlo jakou akci, se vstupní hodnotou hash namísto vstupu.',
  'web.legal.privacy.minimization.title': 'Co záměrně neděláme',
  'web.legal.privacy.minimization.scopes':
    'Požadujeme pouze rozsahy platforem, které funkce, které jste povolili, skutečně potřebují.',
  'web.legal.privacy.minimization.history':
    'Nezpracováváme celou vaši sociální historii, abychom nakreslili graf.',
  'web.legal.privacy.minimization.logs':
    'Obsah příspěvku je odstraněn z obecných protokolů a z nástrojů podpory.',
  'web.legal.privacy.minimization.training':
    'Váš obsah se ve výchozím nastavení nepoužívá k výcviku našich modelů ani jiných modelů.',
  'web.legal.privacy.subprocessors.title': 'Kdo jiný to zpracovává',
  'web.legal.privacy.subprocessors.body':
    'Aktuální seznam subprocesorů je publikován samostatně a změny jsou zde oznámeny dříve, než vstoupí v platnost.',
  'web.legal.privacy.retention.title': 'Jak dlouho to uchováváme',
  'web.legal.privacy.rights.title': 'Vaše ovládací prvky',
  'web.legal.privacy.rights.export':
    'Stáhněte si svůj obsah, účtenky a analýzy jako JSON a CSV s archivem médií.',
  'web.legal.privacy.rights.revoke':
    'Odpojte jeden sociální účet bez smazání pracovního prostoru. Tokeny jsou na platformě odvolány a smazány zde.',
  'web.legal.privacy.rights.delete': 'Smažte značku, část obsahu, mediální soubor nebo celý účet.',
  'web.legal.privacy.rights.cancelJobs':
    'Před odstraněním čehokoli zrušte naplánované úlohy, aby se po vašem odchodu nic nepublikovalo.',
  'web.legal.privacy.rights.sessions':
    'Zobrazit a zrušit aktivní relace, klíče API, pověření agenta, webhooky a oprávnění platformy.',
  'web.legal.privacy.rights.consent':
    'Předvolby souhlasu jsou verzované a kontrolovatelné, takže můžete vidět, s čím jste souhlasili a kdy.',
  'web.legal.privacy.deletion.title': 'Mazání dat uložených na platformě',
  'web.legal.privacy.deletion.body':
    'Odpojením účtu v Relay se zruší token na platformě a smaže se zde pověření. Obsah již publikovaný na platformě se řídí touto platformou a musí být smazán. Pokud platforma vyžaduje smazání odvozených dat během pevně stanoveného období po odvolání, dodržíme tuto lhůtu. Pro data Google a YouTube je toto období aktuálně 30 dní.',
  'web.legal.privacy.transfers.title': 'Mezinárodní převody',
  'web.legal.privacy.transfers.body':
    'Hostitelské regiony a přenosový mechanismus se dokončují s právním zástupcem a budou zde uvedeny spolu s příslušnými bezpečnostními opatřeními před spuštěním.',

  /* Acceptable use ------------------------------------------------------- */
  'web.legal.aup.title': 'Zásady přijatelného užívání',
  'web.legal.aup.summary':
    'Relay vám pomáhá publikovat obsah, ke kterému máte oprávnění. Není vytvořen tak, aby pomohl komukoli vyhnout se limitu platformy, předstírat doporučení nebo odesílat nevyžádané zprávy.',
  'web.legal.aup.prohibited.title': 'Není povoleno',
  'web.legal.aup.prohibited.spam':
    'Spam, nevyžádané hromadné zprávy, odpovědi nebo zmínky, návnada na zapojení a opakovaný nevyžádaný obsah.',
  'web.legal.aup.prohibited.linkSchemes':
    'Automatické odesílání adresářů nebo formulářů, hromadný dosah, schémata odkazů, placené nebo reciproční odkazy určené k manipulaci s hodnocením ve vyhledávání a propagace komunity, která porušuje pravidla místa určení.',
  'web.legal.aup.prohibited.inauthentic':
    'Koordinované neautentické chování, zesílení více účtů prezentované jako nezávislé, moduly zapojení, falešné recenze, hodnocení nebo počty instalací, automatické hodnocení Líbí se mi a sledování a manipulace s trendy.',
  'web.legal.aup.prohibited.duplicate':
    'Publikování duplicitního nebo v podstatě podobného obsahu na mnoha účtech tam, kde to platforma zakazuje.',
  'web.legal.aup.prohibited.impersonation':
    'Předstírání jiné identity, phishing, podvody, podvody, malware, krádež přihlašovacích údajů a klamavá instalace.',
  'web.legal.aup.prohibited.harm':
    'Obtěžování, doxxing, sexuální vykořisťování, nekonsensuální intimní média, nenávistný nebo násilný extremistický obsah a nelegální zboží nebo služby.',
  'web.legal.aup.prohibited.political':
    'Politická manipulace a automatizované politické přesvědčování tam, kde je to zakázáno. Politický obsah, pokud je vůbec povolen, podléhá rozšířené kontrole.',
  'web.legal.aup.prohibited.rights':
    'Porušování autorských práv, ochranných známek a propagace, nelicencovaná hudba nebo média, syntetické podobizny bez práv a zveřejnění a nezveřejněná placená doporučení.',
  'web.legal.aup.prohibited.circumvention':
    'Obcházení oficiálních rozhraní API, limitů sazeb, auditů, ovládacích prvků účtu nebo vynucení platformy pomocí automatizace prohlížeče, přehrávání souborů cookie nebo scraping.',
  'web.legal.aup.prohibited.restrictedStores':
    'Automatické odesílání do obchodů s aplikacemi, Internetového obchodu Chrome nebo jiných systémů s omezeným odesíláním prostřednictvím neautorizovaných rozhraní.',
  'web.legal.aup.prohibited.banEvasion':
    'Vyhýbání se zákazu účtu nebo provozování koordinovaných farem účtů.',
  'web.legal.aup.prohibited.training':
    'Školení nebo hodnocení modelů na obsahu třetích stran nebo jiných zákazníků bez oprávnění.',
  'web.legal.aup.controls.title': 'Ovládací prvky, které toto vynucují',
  'web.legal.aup.controls.duplicate':
    'Přesné a téměř duplicitní otisky prstů podle pracovního prostoru, účtu, platformy a časového okna, s kontrolou podobnosti mezi účty.',
  'web.legal.aup.controls.cadence':
    'Rozpočty kadence na úrovni účtu a na úrovni pracovního prostoru plus kontroly množství zmínek, hashtagů, adres URL a domén.',
  'web.legal.aup.controls.escalation':
    'Nový účet, nová doména a eskalace hromadných akcí a maximální počet opakování pro každou opakující se kampaň.',
  'web.legal.aup.controls.linkSafety':
    'Skenování cíle na krátkých odkazech, s nouzovou deaktivací a kanálem hlášení zneužití.',
  'web.legal.aup.controls.workspaceCaps':
    'Vlastník pracovního prostoru může nastavit přísnější limity, než umožňuje plán. Kontroly rizik nelze uvolnit tím, že zaplatíte více.',
  'web.legal.aup.enforcement.title': 'Vymáhání a odvolání',
  'web.legal.aup.enforcement.body':
    'Kde je to možné, blokujeme před externí akcí, nikoli po ní, a zaznamenáváme důvod, verzi pravidla a cestu odvolání. Opakované nebo závažné chování vede k prověření důvěryhodnosti osobou. Bude vám řečeno, co se stalo, bez úrovně podrobností, které by někomu pomohly vyhnout se kontrole. Proti každému rozhodnutí se lze odvolat a zrušit.',
  'web.legal.aup.report.title': 'Hlášení zneužití',
  'web.legal.aup.report.body':
    'Pokud obsah publikovaný prostřednictvím Relay porušuje tato pravidla, řekněte nám to. Uveďte URL příspěvku a co je na něm špatně.',

  /* AI policy ------------------------------------------------------------ */
  'web.legal.ai.title': 'Používání umělé inteligence a zásady generovaného obsahu',
  'web.legal.ai.summary':
    'Které funkce používají model, co se odesílá, co se uchovává, za co zůstáváte odpovědní a proč Relay negeneruje média.',
  'web.legal.ai.features.title': 'Kde se model používá',
  'web.legal.ai.features.text':
    'Textová pomoc při skládání: přepisování, zkrácení a přizpůsobení pro platformu.',
  'web.legal.ai.features.translation':
    'Překlad a přepis do vašich jazyků obsahu na základě glosáře vaší značky.',
  'web.legal.ai.features.feedback': 'Zpětná vazba k obsahu a čtyřtýdenní plán růstu.',
  'web.legal.ai.features.provider':
    'Tyto funkce volají DeepSeek. Aktuálně používané identifikátory modelu jsou zveřejněny v dokumentaci a jakákoliv změna je uvedena v seznamu změn.',
  'web.legal.ai.data.title': 'Co je odesláno a co se s tím stane',
  'web.legal.ai.data.sent':
    'Pouze text, o který jste nás požádali, pokyny a kontext značky, který jste se rozhodli připojit. Pověření, tokeny a další obsah zákazníků nejsou nikdy v kontextu modelu.',
  'web.legal.ai.data.training':
    'Váš obsah neslouží k výcviku našich modelů. Nakonfigurujeme poskytovatele tak, aby se nepoužíval k školení jejich.',
  'web.legal.ai.data.optOut':
    'Volitelné funkce umělé inteligence lze pro každý pracovní prostor vypnout. Publikování, plánování, schvalování a analýzy na nich nezávisí.',
  'web.legal.ai.responsibility.title': 'Co zůstane vaše',
  'web.legal.ai.responsibility.body':
    'Model může být s jistotou špatný. Jste odpovědní za kontrolu faktů, tvrzení, jmen, čísel a tónu před zveřejněním a za jakékoli zveřejnění, které platforma vyžaduje. Žádná funkce umělé inteligence nezaručuje dosah, zapojení nebo hodnocení a žádná není nabízena jako jedna.',
  'web.legal.ai.disclosure.title': 'Zveřejnění a původ',
  'web.legal.ai.disclosure.body':
    'Relay zaznamenává, zda byl obsah ve své interní historii podporován umělou inteligencí, připomene vám, kde platforma vyžaduje zveřejnění změněných nebo syntetických médií, a ukládá původ, který poskytnete s importovaným aktivem. Pokud platforma nabízí pole pro zveřejnění, Relay je nastaví z vašeho prohlášení, nikoli hádání.',
  'web.legal.ai.blocks.title': 'Co funkce umělé inteligence odmítají',
  'web.legal.ai.blocks.impersonation': 'Vydávání se za skutečnou osobu nebo veřejnou osobnost.',
  'web.legal.ai.blocks.ncii': 'Nekonsensuální intimní snímky v jakékoli formě.',
  'web.legal.ai.blocks.fabrication':
    'Vymyšlené posudky, vynalezené zákazníky a vymyšlené údaje o výkonu.',
  'web.legal.ai.blocks.unverified':
    'Představení adresy URL vygenerované modelem jako ověřená příležitost. Doporučení příležitostí a nástrojů pocházejí pouze z kurátorského katalogu.',
  'web.legal.ai.noMedia.title': 'Proč neexistuje generování obrázků nebo videí',
  'web.legal.ai.noMedia.body':
    'Relay neshromáždil ověřený vizuální systém, podrobnosti o produktu, práva k aktivům, oprávnění k podobenství a kontext kampaně, které by výstup připravený pro značku vyžadoval, a při generování aplikací by potřeboval svůj vlastní souhlas, původ, hodnocení bezpečnosti a kontroly nákladů. Schopnost mediálního modelu, licencování, ceny a retence se také rychle mění, a proto naše doporučení týkající se nástrojů obsahují data. Výběrem specializovaného nástroje a importem schváleného díla si ponecháte kreativní kontrolu. Relé se stará o adaptaci, schvalování, publikování a měření.',
  'web.legal.ai.noMedia.caveat':
    'Nástroj, který se objevuje v našem radaru, není prohlášením, že jeho výstup je bezpečný nebo že jsou práva vymazána. Jeho zdokumentovaná upozornění jsou uvedena spolu s ním a vaše normální prohlášení o právech stále platí.',

  /* Cookies -------------------------------------------------------------- */
  'web.legal.cookies.title': 'Zásady souborů cookie',
  'web.legal.cookies.summary':
    'Co je uloženo ve vašem prohlížeči, proč a co se stane, když odmítnete volitelné části.',
  'web.legal.cookies.essential.title': 'Nezbytně nutné',
  'web.legal.cookies.essential.body':
    'Soubor cookie relace, díky kterému zůstanete přihlášeni, token pro padělání žádosti mezi weby a preferenční soubor cookie obsahující vaše zvolené téma a časové pásmo. Tyto nelze vypnout bez přerušení přihlášení a neslouží k reklamě.',
  'web.legal.cookies.analytics.title': 'Analýza produktů',
  'web.legal.cookies.analytics.body':
    'Souhrnné měření obrazovek první stranou, které se používají, takže můžeme opravit ty, které nefungují. Je volitelná, je vypnutá, dokud to nepovolíte, a její odmítnutí na produktu nic nemění.',
  'web.legal.cookies.marketing.title': 'Reklama',
  'web.legal.cookies.marketing.body':
    'Neprovozujeme reklamní soubory cookie, nevkládáme reklamní pixely třetích stran a neprodáváme ani nesdílíme osobní údaje pro cross-kontextovou behaviorální reklamu.',
  'web.legal.cookies.shortLinks.title': 'Sledované krátké odkazy',
  'web.legal.cookies.shortLinks.body':
    'Krátké kliknutí na odkaz vytvoří analýzu první strany pro pracovní prostor, který vlastní odkaz. Údaje o poloze a zařízení jsou minimalizovány, provoz robotů je klasifikován, IP adresy jsou okamžitě zkráceny nebo zahozeny a pracovní prostor může vypnout sledování nebo zkrátit uchovávání. Do slugu nebo parametru dotazu se nikdy nevkládá nic citlivého.',
  'web.legal.cookies.control.title': 'Změna názoru',
  'web.legal.cookies.control.body':
    'Volba souhlasu je uložena s verzí a lze ji kdykoli změnit v Nastavení pod ovládacími prvky dat. Odvolání souhlasu nabývá účinnosti okamžitě.',

  /* Subprocessors -------------------------------------------------------- */
  'web.legal.subprocessors.title': 'Subprocesory',
  'web.legal.subprocessors.summary':
    'Společnosti, které naším jménem zpracovávají zákaznická data, co dělají a kde.',
  'web.legal.subprocessors.notice.title': 'Oznámení o změně',
  'web.legal.subprocessors.notice.body':
    'Nový subzpracovatel je zde zveřejněn před tím, než začne zpracovávat zákaznická data, s alespoň 30denním upozorněním na změnu, která podstatně ovlivňuje zpracování. Zákazníci s dodatkem o zpracování dat mohou během tohoto okna vznést námitky.',
  'web.legal.subprocessors.column.name': 'Subprocesor',
  'web.legal.subprocessors.column.purpose': 'Co pro nás zpracovává',
  'web.legal.subprocessors.column.data': 'Kategorie dat',
  'web.legal.subprocessors.column.region': 'Oblast zpracování',
  'web.legal.subprocessors.platforms.title': 'Sociální platformy nejsou subprocesory',
  'web.legal.subprocessors.platforms.body':
    'Když publikujete, Relay přenese váš obsah na účet platformy, který jste vybrali, podle vašich pokynů. Tyto platformy jsou nezávislými správci toho, co dostávají, a řídí to jejich vlastními podmínkami.',

  /* Refunds -------------------------------------------------------------- */
  'web.legal.refunds.title': 'Zásady vrácení peněz a zrušení',
  'web.legal.refunds.summary': 'Jak zrušit, co se stane s vašimi daty a kdy dostanete peníze zpět.',
  'web.legal.refunds.cancel.title': 'Rušení',
  'web.legal.refunds.cancel.body':
    'Zrušit v Nastavení bez kontaktování podpory. Zrušení během sedmidenní zkušební doby znamená, že nedojde k žádnému poplatku a obrazovka zrušení to písemně potvrdí. Zrušením po zkušební době zůstane váš přístup až do konce období, za které jste již zaplatili.',
  'web.legal.refunds.refund.title': 'Vrácení peněz',
  'web.legal.refunds.refund.body':
    'Pokud služba nefungovala podle popisu, kontaktujte podporu a my vám vrátíme peníze za dotčené období. Povinná práva spotřebitele na odstoupení od smlouvy, včetně zákonné lhůty na rozmyšlenou, pokud se na vás vztahuje, jsou plně respektována a nejsou ničím na této stránce omezena. Vrácení peněz provádí společnost Polar, náš registrovaný obchodník, původní platební metodou.',
  'web.legal.refunds.usage.title': 'Poplatky za používání platformy',
  'web.legal.refunds.usage.body':
    'Využití přenesené z platformy, jako je cena X za operaci, pokrývá náklady, které jsme již zaplatili vaším jménem za vámi potvrzenou akci. Je vratná v případě, že byla účtována naše chyba, například duplicitní odeslání způsobené závadou na naší straně.',
  'web.legal.refunds.data.title': 'Co se stane s vašimi daty',
  'web.legal.refunds.data.body':
    'Při zrušení se nic nesmaže. Pracovní prostor se stane pouze pro čtení, plánované příspěvky se zastaví místo publikování a před odstraněním si ponecháte okno exportu. Smazání není nikdy podmíněno zaplacením faktury, kromě fakturačních záznamů, které musíme uchovávat ze zákona.',
  'web.legal.refunds.failed.title': 'Neúspěšná platba',
  'web.legal.refunds.failed.body':
    'Polar to zkusí a pošle vám e-mail. Během doby odkladu publikování pokračuje. Poté se pracovní prostor stane pouze pro čtení a plánované příspěvky se zastaví. Nic není odpojeno a nic není smazáno.',

  /* DMCA ----------------------------------------------------------------- */
  'web.legal.dmca.title': 'Autorská práva a zastavení šíření',
  'web.legal.dmca.summary':
    'Jak nahlásit obsah hostovaný službou Relay, který porušuje vaše práva, a jak reagovat, pokud byl váš odstraněn.',
  'web.legal.dmca.scope.title': 'Na základě čeho můžeme jednat',
  'web.legal.dmca.scope.body':
    'Přenos může odstranit materiál uložený v našich systémech, jako je mediální soubor nebo koncept. Obsah již publikovaný na sociální platformě žije na této platformě a musí jí být nahlášen, protože nemůžeme smazat příspěvek, který nehostíme. Řekneme vám, která z těchto dvou se na vaši zprávu vztahuje.',
  'web.legal.dmca.notice.title': 'Odeslání upozornění',
  'web.legal.dmca.notice.identify':
    'Identifikujte dílo chráněné autorskými právy a materiál, o kterém tvrdíte, že je porušuje, pomocí adresy URL, na kterou se můžeme dostat.',
  'web.legal.dmca.notice.contact': 'Uveďte své jméno, adresu, telefonní číslo a e-mail.',
  'web.legal.dmca.notice.goodFaith':
    'Uveďte, že v dobré víře věříte, že použití není povoleno držitelem práv, jeho zástupcem nebo zákonem.',
  'web.legal.dmca.notice.accuracy':
    'Uveďte, že informace jsou přesné, a pod hrozbou trestu za křivou přísahu, že jste oprávněni jednat za držitele práv.',
  'web.legal.dmca.notice.signature': 'Podepište to, fyzicky nebo elektronicky.',
  'web.legal.dmca.counter.title': 'Odpor vůči oznámení',
  'web.legal.dmca.counter.body':
    'Pokud byl váš materiál odstraněn a vy se domníváte, že se jednalo o omyl nebo nesprávnou identifikaci, můžete odeslat protioznámení se stejnými kontaktními údaji, uvedete materiál a místo, kde se nacházel, a souhlasíte s jurisdikcí, která zde bude uvedena. Předáme jej osobě, která si stěžovala.',
  'web.legal.dmca.repeat.title': 'Opakující se porušovatelé',
  'web.legal.dmca.repeat.body':
    'Účty, které opakovaně porušují autorská práva, jsou pozastaveny a poté ukončeny. Oznámení ve špatné víře použitá k odstranění obsahu konkurence jsou také důvodem pro ukončení.',

  /* Security ------------------------------------------------------------- */
  'web.legal.security.title': 'Bezpečnost a zodpovědné zveřejnění',
  'web.legal.security.summary':
    'Jak Relay chrání přihlašovací údaje, kterým důvěřujete, a jak nahlásit problém, který najdete.',
  'web.legal.security.tokens.title': 'Pověření pro sociální sítě',
  'web.legal.security.tokens.body':
    'Tokeny platformy jsou zašifrovány pomocí šifrování obálek pod spravovaným klíčem, otočeny, uloženy odděleně od obsahu a fakturačních dat a odstraněny z každého protokolu. Token není nikdy odeslán do prohlížeče, nikdy není umístěn v kontextu modelu a nikdy není zahrnut do chybové zprávy.',
  'web.legal.security.tenancy.title': 'Nájem',
  'web.legal.security.tenancy.body':
    'Izolace je vynucena třikrát: na okraji, když se ověřujete, v aplikační službě, když autorizuje akci, a v PostgreSQL prostřednictvím zabezpečení na úrovni řádků. Přihlášení není nikdy považováno za povolení. Pokusy o přístup mezi pracovní prostory jsou testovány v nepřetržité integraci a musí selhat.',
  'web.legal.security.publishing.title': 'Integrita publikování',
  'web.legal.security.publishing.body':
    'Každý externí zápis nese klíč idempotence a vytváří neměnnou účtenku. Duplicitní publikace je považována za vadu s nulovým cílem a testovací sada zahrnuje pády pracovníků po přijetí platformy, časové limity platformy, duplicitní webhooky, zrušené tokeny při odeslání a přechody na letní čas.',
  'web.legal.security.program.title': 'Program',
  'web.legal.security.program.threatModel':
    'Psaný model hrozeb pokrývající OAuth, pronájem, publikování, MCP, média, fakturaci a analýzy.',
  'web.legal.security.program.pentest':
    'Nezávislá bezpečnostní kontrola zaměřená na únik tokenů a přístup mezi nájemci před placeným spuštěním.',
  'web.legal.security.program.access':
    'Nejméně privilegovaný produkční přístup, vícefaktorové ověřování a inventář zařízení a relací.',
  'web.legal.security.program.supplyChain':
    'Skenování závislostí a kontejnerů s úrovněmi opravných služeb a podepsaným původem sestavení tam, kde je to praktické.',
  'web.legal.security.program.logging':
    'Centralizované protokolování, které se ve výchozím nastavení rediguje s upozorněním na anomálie.',
  'web.legal.security.program.backups':
    'Šifrované zálohy s testovanou obnovou a zdokumentovanou rotací.',
  'web.legal.security.disclosure.title': 'Nahlášení chyby zabezpečení',
  'web.legal.security.disclosure.body':
    'Pošlete nám e-mail s dostatečnými podrobnostmi, abychom mohli problém reprodukovat. Do dvou pracovních dnů potvrdíme, budeme vás informovat a připíšeme vám, když budete chtít kredit. Nepřistupujte k datům jiného zákazníka, neznehodnocujte službu ani nespouštějte automatické skenování proti produkci. Otestujte ve svém vlastním pracovním prostoru.',
  'web.legal.security.disclosure.safeHarbor':
    'Nebudeme podnikat právní kroky za výzkum v dobré víře, který se řídí těmito zásadami. Přesné znění bezpečného přístavu je u právního zástupce.',
  'web.legal.security.incidents.title': 'Pokud se něco pokazí',
  'web.legal.security.incidents.body':
    'Máme plán reakce na incidenty se jmenovanými osobami s rozhodovací pravomocí, úrovněmi závažnosti, uchováváním důkazů a oznamovacími povinnostmi. Incidenty, které ovlivnily publikování, jsou zveřejněny na stavové stránce s časovou osou a tím, co se poté změnilo, včetně těch, které jsme způsobili my.',

  /* Accessibility -------------------------------------------------------- */
  'web.legal.accessibility.title': 'Prohlášení o přístupnosti',
  'web.legal.accessibility.summary':
    'Standardní relé je postaveno na tom, co jsme ověřili, o čem víme, že ještě není v pořádku, a jak nám to sdělit.',
  'web.legal.accessibility.standard.title': 'Standard',
  'web.legal.accessibility.standard.body':
    'Relay cílí na WCAG 2.2 úrovně AA napříč produktem a touto stránkou. Přístupnost je zde požadavek sloučení, nikoli pozdější tiket a obrazovka, která selže, se neodešle.',
  'web.legal.accessibility.measures.title': 'Co to znamená v praxi',
  'web.legal.accessibility.measures.keyboard':
    'Vše je ovladatelné z klávesnice s viditelným kroužkem ostření a logickým pořadím ostření. Nikde neexistuje žádná interakce typu drag only.',
  'web.legal.accessibility.measures.contrast':
    'U každého barevného páru v návrhovém systému je automatickým testem potvrzen poměr 4,5 ku 1 pro hlavní text a 3 ku 1 pro velký text a ovládací okraje, ve světlém i tmavém motivu.',
  'web.legal.accessibility.measures.colour':
    'Stav, schopnosti a čerstvost vždy obsahují ikonu a slovo a také barvu.',
  'web.legal.accessibility.measures.announcements':
    'Uložení stavu, změny ověření, průběh nahrávání, potvrzení naplánování a výsledky publikování jsou oznámeny čtečkám obrazovky.',
  'web.legal.accessibility.measures.zoom':
    'Rozvržení fungují při šířce 320 pixelů a při 200procentním přiblížení bez vodorovného posouvání stránky. Široké tabulky rolují uvnitř vlastního kontejneru.',
  'web.legal.accessibility.measures.motion':
    'Snížená preference pohybu odstraní každý nepodstatný přechod.',
  'web.legal.accessibility.measures.targets':
    'Cíle dotyku mají alespoň 44 pixelů na hrubém ukazateli.',
  'web.legal.accessibility.known.title': 'Známé mezery',
  'web.legal.accessibility.known.body':
    'Uvedeme zde seznam konkrétních známých problémů s datem opravy, jakmile budou nalezeny, místo abychom požadovali plnou shodu. Nezávislý audit je plánován před obecnou dostupností a jeho zjištění budou zveřejněna zde.',
  'web.legal.accessibility.feedback.title': 'Řekněte nám něco o překážce',
  'web.legal.accessibility.feedback.body':
    'Popište, co jste se snažili udělat, stránku a asistenční technologii, kterou používáte. Odpovíme do pěti pracovních dnů a nabídneme jiný způsob, jak úkol dokončit, dokud jej neopravíme.',

  /* API and MCP terms ---------------------------------------------------- */
  'web.legal.apiTerms.title': 'Podmínky rozhraní API a MCP',
  'web.legal.apiTerms.summary':
    'Další podmínky pro programatický přístup, včetně pověření agenta, limitů sazeb a toho, co účet služby nikdy nemůže dělat.',
  'web.legal.apiTerms.credentials.title': 'Přihlašovací údaje',
  'web.legal.apiTerms.credentials.body':
    'Klíč API nebo pověření agenta identifikuje účet služby s rozsahem. Nejedná se o kopii osobního účtu a nikdy nezdědí jejich plná oprávnění. Klíče jsou zobrazeny jednou, lze je kdykoli odvolat a nesmějí být vloženy do klientské aplikace nebo veřejného úložiště.',
  'web.legal.apiTerms.scopes.title': 'Rozsahy',
  'web.legal.apiTerms.scopes.body':
    'Čtení, navrhování, žádost o schválení, plánování, okamžité publikování, rušení, analýzy a fakturace jsou samostatné oblasti. Požadujte nejmenší sadu, kterou integrace potřebuje. Okamžité publikování a další vysoce rizikové akce vyžadují ve výchozím nastavení výslovné lidské potvrzení a toto výchozí nastavení je nastaveno pro pracovní prostor, nikoli pro pověření.',
  'web.legal.apiTerms.limits.title': 'Omezení sazby a idempotence',
  'web.legal.apiTerms.limits.body':
    'Každý zápis vyžaduje klíč idempotence. Přehrání požadavku se stejným klíčem vrátí původní výsledek. Limity rychlosti jsou zveřejněny v dokumentaci a jsou vráceny v hlavičkách odpovědi a odpověď limitu vám řekne, když se resetuje.',
  'web.legal.apiTerms.agents.title': 'Chování agenta',
  'web.legal.apiTerms.agents.body':
    'Jeden hovor se nemusí tiše publikovat do všech připojených účtů. Hromadné akce, nová doména, nový účet, citlivá kategorie, placená podpora, změna soukromí nebo obsah pozměněný po schválení vždy eskalují na lidské rozhodnutí. Každý agent a každý pracovní prostor má přepínač zabíjení.',
  'web.legal.apiTerms.prohibited.title': 'Není povoleno prostřednictvím rozhraní API',
  'web.legal.apiTerms.prohibited.body':
    'Další prodej přístupu bez písemné dohody, používání služby Relay jako předávání obsahu, který nemáte oprávnění publikovat, obcházení zásad schvalování a jakékoli použití, které porušuje zásady přijatelného užívání. Programatický přístup podléhá stejným antispamovým kontrolám jako webová aplikace.',
  'web.legal.apiTerms.changes.title': 'Změnit zásady',
  'web.legal.apiTerms.changes.body':
    'Další změny jsou odesílány bez upozornění. Překonané změny dostanou novou verzi, ohlášené okno ukončení podpory a poznámku o migraci v changelogu. Chybové kódy nemění význam v rámci verze.',

  /* Affiliate terms ------------------------------------------------------ */
  'web.legal.affiliate.title': 'Podmínky pro přidružení a pro autory',
  'web.legal.affiliate.summary': 'Co platíme, co požadujeme a co způsobí uzavření účtu.',
  'web.legal.affiliate.commission.title': 'Provize',
  'web.legal.affiliate.commission.body':
    'Opakující se provize z doporučených předplatných po dobu až dvanácti měsíců, s výhradou kontroly podvodu. Provize je zadržena, dokud se neuzavře okno pro vrácení peněz, a je zrušena, pokud zákazník vrátí peníze. Výplaty probíhají přes Polar.',
  'web.legal.affiliate.disclosure.title': 'Zveřejnění není volitelné',
  'web.legal.affiliate.disclosure.body':
    'Na každém místě, kde sdílíte odkaz na doporučení, musí být obchodní vztah jasně a blízko odkazu uveden v jazyce publika. To platí stejně pro videa, příspěvky, zpravodaje, články a odpovědi komunity.',
  'web.legal.affiliate.honesty.title': 'Placeno za práci, ne za chválu',
  'web.legal.affiliate.honesty.body':
    'Sponzorovaná smlouva s výukovým programem nikdy nevyžaduje kladné uzavření. Můžete publikovat kritiku a přesto dostanete zaplaceno. Nekupujeme recenze, hlasy, hodnocení ani instalace a nenabízíme pobídky podmíněné kladnou recenzí.',
  'web.legal.affiliate.prohibited.title': 'Důvod pro uzavření přidruženého účtu',
  'web.legal.affiliate.prohibited.brandBidding':
    'Nabízení cen na výrazy naší značky v placeném vyhledávání nebo zobrazování reklam, které naznačují, že jste my.',
  'web.legal.affiliate.prohibited.spam':
    'Nevyžádané e-maily, hromadné příspěvky komunity nebo vhazování odkazů do vláken, která se neptala.',
  'web.legal.affiliate.prohibited.cookieStuffing':
    'Naplňování cookies, nucená kliknutí, vlastní doporučení a kupon squatting.',
  'web.legal.affiliate.prohibited.claims':
    'Vymýšlení zákaznických výsledků, výroba posudku nebo tvrzení, že Relay dělá něco, co nedělá, včetně všeho o generování médií AI.',
  'web.legal.affiliate.prohibited.trademark':
    'Registrace domény, popisovače nebo záznamu aplikace, které používají naše jméno způsobem, který naznačuje, že jste ta společnost.',

  /* ---------------------------------------------------------------------- */
  /* Platform names and per platform facts                                   */
  /* ---------------------------------------------------------------------- */

  'web.marketing.provider.x.label': 'X',
  'web.marketing.provider.linkedin.label': 'LinkedIn',
  'web.marketing.provider.instagram.label': 'Instagram',
  'web.marketing.provider.facebook.label': 'Facebook',
  'web.marketing.provider.youtube.label': 'YouTube',
  'web.marketing.provider.tiktok.label': 'TikTok',
  'web.marketing.provider.threads.label': 'Vlákna',
  'web.marketing.provider.bluesky.label': 'Bluesky',

  'web.marketing.provider.x.accountTypes': 'Osobní nebo firemní účet X, který ovládáte.',
  'web.marketing.provider.x.restriction':
    'Automatické odesílání vyžaduje výslovný souhlas majitele účtu, který Relay zaznamenává. Duplicitní nebo v podstatě podobné příspěvky napříč účty nejsou povoleny a nevyžádané automatické odpovědi nejsou vytvářeny.',
  'web.marketing.provider.x.cost':
    'X si účtuje poplatky za každou operaci API a účtuje více za příspěvek obsahující adresu URL. Relé odhadne cenu ještě před potvrzením a předá ji bez přirážky.',

  'web.marketing.provider.linkedin.accountTypes':
    'Členský profil nebo stránka organizace, kde zastáváte správnou roli.',
  'web.marketing.provider.linkedin.restriction':
    'Publikování jménem organizace vyžaduje schválený produkt správy komunity a ověřenou obchodní identitu. Analýza členských příspěvků závisí na oprávnění ke čtení, které LinkedIn uzavřel pro nové aplikace, takže je Relay nenabízí.',
  'web.marketing.provider.linkedin.cost':
    'Žádný provozní poplatek. Platí denní limity pro aplikace a členy.',

  'web.marketing.provider.instagram.accountTypes':
    'Profesionální instagramový účet, firma nebo tvůrce.',
  'web.marketing.provider.instagram.restriction':
    'Publikování obsahu na Instagramu je k dispozici pouze pro profesionální účty. Spotřebitelský účet nemůže být publikován žádnou aplikací, včetně této. Publishing používá oficiální kontejner a sekvenci publikování a Relay potvrzuje konečný stav spíše než oznamuje nahrání jako úspěšné.',
  'web.marketing.provider.instagram.cost':
    'Žádný provozní poplatek. Je vyžadována kontrola meta aplikace a ověření firmy.',

  'web.marketing.provider.facebook.accountTypes': 'Stránka na Facebooku, kterou spravujete.',
  'web.marketing.provider.facebook.restriction':
    'Cílem publikování je stránka. Automatizaci osobního profilu API nenabízí a Relay se o ni nepokouší.',
  'web.marketing.provider.facebook.cost':
    'Žádný provozní poplatek. Je vyžadována kontrola meta aplikace a ověření firmy.',

  'web.marketing.provider.youtube.accountTypes':
    'Kanál YouTube propojený prostřednictvím vašeho účtu Google.',
  'web.marketing.provider.youtube.restriction':
    'Projekt, který neprošel auditem souladu s Google API, lze nahrát pouze jako soukromý. Relay nebude popisovat veřejné nahrávání jako dostupné, dokud tento audit neprojde a na obrazovce připojení nebude uvedeno, do kterého stavu se vaše nahrávání dostane.',
  'web.marketing.provider.youtube.cost':
    'Žádný provozní poplatek. Platí denní kvóta a nelze ji sdílet mezi projekty.',

  'web.marketing.provider.tiktok.accountTypes': 'Účet TikTok s autorizací Direct Post.',
  'web.marketing.provider.tiktok.restriction':
    'Dokud neprojde audit rozhraní Content Posting API, jsou příspěvky soukromé a platí omezení pro jednotlivé účty. V době publikování Relay načte aktuální informace o tvůrci, zobrazí dostupné možnosti ochrany osobních údajů, aniž by jednu předem vybral, a požádá o komentář, nastavení duetu a stehu a prohlášení o komerčním obsahu.',
  'web.marketing.provider.tiktok.cost':
    'Žádný provozní poplatek. Neauditovaný režim používá denní limity pro příspěvky.',

  'web.marketing.provider.threads.accountTypes':
    'Profil Threads propojený s profesionálním účtem na Instagramu.',
  'web.marketing.provider.threads.restriction':
    'Publikování probíhá podle kontejneru Meta a sekvence publikování. Schopnosti se ověřují v porovnání s oficiální sbírkou, než se cokoli zde nazývá podporované.',
  'web.marketing.provider.threads.cost': 'Žádný poplatek za operaci.',

  'web.marketing.provider.bluesky.accountTypes':
    'Účet Bluesky u jakéhokoli poskytovatele hostingu.',
  'web.marketing.provider.bluesky.restriction':
    'Otevřený protokol bez kroku kontroly aplikace. Limity sazeb a limity velikosti záznamu stále platí a jsou uplatňovány před odesláním.',
  'web.marketing.provider.bluesky.cost': 'Žádný poplatek za operaci.',
  'web.marketing.provider.mastodon.label': 'Mastodon',
  'web.marketing.provider.mastodon.accountTypes': 'Účet Mastodon na libovolné instanci.',
  'web.marketing.provider.mastodon.restriction':
    'Otevřený protokol bez schvalování aplikací. Limit znaků určuje každá instance a její limity rychlosti jsou respektovány.',
  'web.marketing.provider.mastodon.cost': 'Žádný poplatek za operaci.',
  'web.marketing.provider.telegram.label': 'Telegram',
  'web.marketing.provider.telegram.accountTypes':
    'Bot Telegramu, který ovládáte a který publikuje do kanálu nebo skupiny.',
  'web.marketing.provider.telegram.restriction':
    'Bot může publikovat pouze tam, kam byl přidán. Token je přihlašovací údaj aplikace a cílový chat se volí pro připojení.',
  'web.marketing.provider.telegram.cost': 'Žádný poplatek za operaci.',
  'web.marketing.provider.reddit.label': 'Reddit',
  'web.marketing.provider.reddit.accountTypes': 'Účet Reddit s oprávněním publikovat.',
  'web.marketing.provider.reddit.restriction':
    'Psaní na Redditu vyžaduje schválenou aplikaci. Příspěvky jsou textové nebo odkazové v povolených subredditech; žádné automatické komentáře ani hlasy.',
  'web.marketing.provider.reddit.cost': 'Žádný poplatek za operaci.',
  'web.marketing.provider.wordpress.label': 'WordPress',
  'web.marketing.provider.wordpress.accountTypes': 'Web WordPress s heslem aplikace.',
  'web.marketing.provider.wordpress.restriction':
    'Příspěvky vycházejí přes REST API webu jako připojený uživatel. Nahrávání obrázků a videí zatím není postaveno.',
  'web.marketing.provider.wordpress.cost': 'Žádný poplatek za operaci.',
  'web.marketing.provider.medium.label': 'Medium',
  'web.marketing.provider.medium.accountTypes': 'Profil autora Medium připojený přes OAuth.',
  'web.marketing.provider.medium.restriction':
    'Příspěvky vycházejí jako veřejné příběhy v Markdownu. Integrační API nemá mazání, takže se nenabízí.',
  'web.marketing.provider.medium.cost': 'Žádný poplatek za operaci.',
  'web.marketing.provider.devto.label': 'Dev.to',
  'web.marketing.provider.devto.accountTypes': 'Profil Dev.to připojený pomocí jeho API klíče.',
  'web.marketing.provider.devto.restriction':
    'Články vycházejí jako veřejné příspěvky v Markdownu. Nahrávání obrázků a analytika zatím nejsou postaveny.',
  'web.marketing.provider.devto.cost': 'Žádný poplatek za operaci.',
  'web.marketing.provider.pinterest.label': 'Pinterest',
  'web.marketing.provider.pinterest.accountTypes': 'Obchodní účet Pinterest připojený přes OAuth.',
  'web.marketing.provider.pinterest.restriction':
    'Pin vyžaduje obrázek a vlastní nástěnku. Psaní vyžaduje schválení aplikace; nástěnky se načítají při připojení.',
  'web.marketing.provider.pinterest.cost': 'Žádný poplatek za operaci.',
  'web.marketing.provider.discord.label': 'Discord',
  'web.marketing.provider.discord.accountTypes':
    'Bot Discord, který ovládáte a který publikuje do textových kanálů.',
  'web.marketing.provider.discord.restriction':
    'Bot může publikovat pouze do kanálů, které vidí. Textové zprávy jsou podporovány; přílohy zatím ne.',
  'web.marketing.provider.discord.cost': 'Žádný poplatek za operaci.',
  'web.marketing.provider.slack.label': 'Slack',
  'web.marketing.provider.slack.accountTypes':
    'Pracovní prostor Slack připojený přes OAuth aplikaci.',
  'web.marketing.provider.slack.restriction':
    'Zprávy jdou do veřejných a soukromých kanálů, kde aplikace je. Nahrávání souborů a analytika zatím nejsou postaveny.',
  'web.marketing.provider.slack.cost': 'Žádný poplatek za operaci.',

  /* ---------------------------------------------------------------------- */
  /* Capability matrix notes                                                 */
  /* ---------------------------------------------------------------------- */

  'web.capabilities.short.supported': 'Podporováno',
  'web.capabilities.short.unsupported': 'Platforma to nenabízí',
  'web.capabilities.short.not_implemented': 'Zatím nepostaveno',
  'web.capabilities.short.requires_review': 'Potřebuje kontrolu platformy',
  'web.capabilities.notesTitle': 'Poznámky a zdroje',
  'web.capabilities.noteRef': 'Poznámka {number}',
  'web.capabilities.summary':
    '{supported, plural, one {# podporovaná schopnost} other {# podporované funkce} few {# podporované funkce} many {# podporované funkce}}, {requiresReview, plural, one {# čeká na kontrolu platformy} other {# čeká na kontrolu platformy} few {# čeká na kontrolu platformy} many {# čeká na kontrolu platformy}}, {notImplemented, plural, one {# ještě není postaveno} other {# ještě není postaveno} few {# ještě není postaveno} many {# ještě není postaveno}}, {unsupported, plural, one {# platforma nenabízí} other {# platforma nenabízí} few {# platforma nenabízí} many {# platforma nenabízí}}.',
  'web.capabilities.buildState.title': 'Zákaznický provoz zatím nepřenáší žádný konektor',
  'web.capabilities.buildState.body':
    'Relé je sestaveno. Tato tabulka odráží definice konektorů tak, jak jsou dnes, což je důvod, proč se většina buněk čte jako dosud nepostavená. Buňka bude podporována až poté, co tento konektor projde svou definicí hotovo, včetně smluvních testů proti zaznamenaným příslušenstvím platformy. Buňky, které říkají, že platforma něco nenabízí nebo ji omezují na kontrolu, jsou fakty o platformě a jsou již konečné.',
  'web.capabilities.note.instagramProfessional':
    'Pouze profesionální účty. Spotřebitelský účet nemůže být publikován žádnou aplikací.',
  'web.capabilities.note.facebookPagesOnly':
    'Pouze stránky. Rozhraní API nepublikuje do osobního profilu.',
  'web.capabilities.note.youtubeAudit':
    'Dokud neprojde audit souladu s rozhraním Google API, nahraje se pozemek jako soukromý.',
  'web.capabilities.note.tiktokAudit':
    'Dokud neprojde audit rozhraní Content Posting API, budou příspěvky soukromé a omezené.',
  'web.capabilities.note.tiktokPrivacy':
    'Možnost ochrany soukromí je načtena v době zveřejnění a musí ji zvolit osoba.',
  'web.capabilities.note.linkedinMemberAnalytics':
    'Analytika příspěvků členů potřebuje oprávnění ke čtení LinkedIn uzavřel nové aplikace.',
  'web.capabilities.note.linkedinOrgAccess':
    'Vyžaduje schválený produkt správy komunity a ověřenou firmu.',
  'web.capabilities.note.linkedinDocuments':
    'LinkedIn je jediná připojená platforma s typem příspěvku dokumentu.',
  'web.capabilities.note.metaReview': 'Vyžaduje kontrolu aplikace Meta a ověření firmy.',
  'web.capabilities.note.xConsent':
    'Vyžaduje zaznamenaný souhlas majitele účtu pro automatizované zveřejňování.',
  'web.capabilities.note.xDisclosure':
    'Platforma poskytuje pole made with AI, které Relay nastavuje z vaší deklarace.',
  'web.capabilities.note.noDestinations':
    'Tato platforma nemá žádný cílový koncept, jako je stránka, nástěnka nebo komunita.',
  'web.capabilities.note.noThreads': 'Tato platforma nemá žádnou nativní sekvenci více příspěvků.',
  'web.capabilities.note.noDocuments': 'Tato platforma nemá žádný typ příspěvku dokumentu.',
  'web.capabilities.note.videoOnly': 'Tato platforma přijímá pouze nahrávání videí.',
  'web.capabilities.note.noAltText':
    'Tato platforma nepřijímá alternativní text prostřednictvím rozhraní API pro publikování.',
  'web.capabilities.note.noPrivacyChoice':
    'Tato platforma nenabízí možnost ochrany osobních údajů za příspěvek prostřednictvím svého rozhraní API.',
  'web.capabilities.note.noThumbnail':
    'Tato platforma nepřijímá vlastní miniaturu prostřednictvím svého rozhraní API.',
  'web.capabilities.note.inBuild': 'Toto platforma nabízí. Relé jej ještě nedodalo.',
  'web.capabilities.note.noCarousel': 'Platforma nenabízí posuvný karusel.',
  'web.capabilities.note.noDisclosure':
    'Platforma nemá pole pro zveřejnění AI nebo komerčního obsahu.',
  'web.capabilities.note.noAnalytics':
    'Platforma nezveřejňuje metriky zapojení přes své oficiální API.',
  'web.capabilities.note.redditReview': 'Psaní na Redditu vyžaduje schválenou aplikaci data API.',
  'web.capabilities.note.redditMedia':
    'Příspěvky s obrázky a videem zatím nejsou pro Reddit postaveny.',
  'web.capabilities.note.mediumImages': 'Integrační API nepřijímá přílohy obrázků.',
  'web.capabilities.note.mediumNoDelete': 'Integrační API nemá koncový bod pro mazání.',
  'web.capabilities.note.devtoImages':
    'API přijímá pouze tělo článku; nahrávání obrázků zatím není postaveno.',
  'web.capabilities.note.pinterestNeedsImage':
    'Pin vyžaduje obrázek; piny pouze s textem neexistují.',
  'web.capabilities.note.pinterestReview':
    'Psaní na Pinterestu vyžaduje schválený přístup aplikace.',

  /* ---------------------------------------------------------------------- */
  /* Status page surfaces                                                    */
  /* ---------------------------------------------------------------------- */

  'web.status.surface.web': 'Webová aplikace',
  'web.status.surface.api': 'REST API',
  'web.status.surface.mcp': 'MCP server',
  'web.status.surface.cli': 'CLI',
  'web.status.surface.webhooks': 'Doručování přes webhook',
  'web.status.surface.publishing': 'Pracovní vydavatelství',
  'web.status.surface.media': 'Zpracování médií',
  'web.status.surface.analytics': 'Sbírka Analytics',
  'web.status.surface.links': 'Přesměrování pomocí krátkých odkazů',
  'web.status.surface.checkout': 'Pokladna a fakturace',
  'web.status.preLaunch.title': 'Relé zatím není obecně dostupné',
  'web.status.preLaunch.body':
    'Tato stránka je aktivní dříve, než je produkt spuštěn, takže zvyk hlášení existuje od prvního zákazníka a není přidán po prvním výpadku. Povrchy, které jsou stále ve výstavbě, jsou jako takové označeny, místo aby byly zobrazeny jako zdravé.',

  /* ---------------------------------------------------------------------- */
  /* Comparison targets                                                      */
  /* ---------------------------------------------------------------------- */

  'web.compare.product.postiz': 'Postiz',
  'web.compare.product.buffer': 'Vyrovnávací paměť',
  'web.compare.product.hootsuite': 'Hootsuite',
  'web.compare.product.later': 'Později',
  'web.compare.product.metricool': 'Metricool',
  'web.compare.product.publer': 'Vydavatel',
  'web.compare.product.socialbee': 'SocialBee',
  'web.compare.product.typefully': 'Zpravidla',
  'web.compare.product.publishingApis': 'Rozhraní API pro publikování pro vývojáře',
  'web.compare.state.factCheckPending': 'Probíhá kontrola faktů',

  /* ---------------------------------------------------------------------- */
  /* Tool radar categories                                                   */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.category.video': 'Generování a úprava videa',
  'web.toolRadar.category.image': 'Generování a úpravy obrázků',
  'web.toolRadar.category.audio': 'Zvuk, hlas a hudba',
  'web.toolRadar.category.ugc': 'Video ve stylu avatara a tvůrce',
  'web.toolRadar.category.clipping': 'Dlouhé video až krátké klipy',
  'web.toolRadar.category.design': 'Design a rozvržení',
  'web.toolRadar.category.research': 'Výzkum a shromažďování zdrojů',
  'web.toolRadar.category.workflow': 'Automatizace pracovních postupů',

  /* ---------------------------------------------------------------------- */
  /* Opportunity categories                                                  */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.category.launch': 'Spouštěcí a spouštěcí adresáře produktu',
  'web.opportunities.category.review': 'Adresáře softwaru a recenzí',
  'web.opportunities.category.marketplace': 'Tržiště pro integraci a automatizaci',
  'web.opportunities.category.community':
    'Předváděcí vlákna komunity, která umožňují odesílání příspěvků',
  'web.opportunities.category.partner': 'Partnerské ekosystémy a integrační adresáře',
  'web.opportunities.category.editorial': 'Výukové programy pro hosty, podcasty a zpravodaje',
  'web.opportunities.category.openSource': 'Seznamy otevřených zdrojů a zdroje dokumentace',

  /* ---------------------------------------------------------------------- */
  /* Subprocessors and retention                                             */
  /* ---------------------------------------------------------------------- */

  'web.legal.subprocessors.neon.label': 'Neon',
  'web.legal.subprocessors.neon.purpose': 'Spravovaný PostgreSQL, autentizace a úložiště objektů.',
  'web.legal.subprocessors.neon.data':
    'Záznamy účtů, obsah, média, plány, účtenky a auditní události.',
  'web.legal.subprocessors.temporal.label': 'Dočasný mrak',
  'web.legal.subprocessors.temporal.purpose':
    'Trvalé provádění pracovních postupů publikování, opakování a plánování.',
  'web.legal.subprocessors.temporal.data':
    'Vstupy pracovního postupu omezené na identifikátory a minimalizované užitečné zatížení.',
  'web.legal.subprocessors.polar.label': 'Polární',
  'web.legal.subprocessors.polar.purpose':
    'Rekordní obchodník: pokladna, předplatné, daně, faktury a refundace.',
  'web.legal.subprocessors.polar.data':
    'Jméno, e-mail, fakturační adresa, způsob platby u Polaru a stav předplatného.',
  'web.legal.subprocessors.deepseek.label': 'DeepSeek',
  'web.legal.subprocessors.deepseek.purpose':
    'Textová asistence, překlady a přepisy a návrhy plánování.',
  'web.legal.subprocessors.deepseek.data':
    'Pouze text, který odešlete do funkce AI, a kontext značky, který jste k němu připojili.',
  'web.legal.subprocessors.hosting.label': 'Hostování aplikací a doručování obsahu',
  'web.legal.subprocessors.hosting.purpose':
    'Poskytování webové aplikace, rozhraní API a služby krátkých odkazů.',
  'web.legal.subprocessors.hosting.data': 'Vyžádejte si metadata a redigované protokoly.',
  'web.legal.subprocessors.email.label': 'Transakční doručování e-mailů',
  'web.legal.subprocessors.email.purpose':
    'Odkazy na přihlášení, žádosti o schválení, oznámení o zveřejnění výsledků a připomenutí zkušebních verzí.',
  'web.legal.subprocessors.email.data': 'Jméno, e-mailová adresa a obsah zprávy.',
  'web.legal.subprocessors.monitoring.label': 'Sledování chyb a výkonu',
  'web.legal.subprocessors.monitoring.purpose': 'Diagnostika selhání při publikování a v rozhraní.',
  'web.legal.subprocessors.monitoring.data':
    'Upravená trasování zásobníku, identifikátory požadavků a identifikátory pracovního prostoru. Obsah příspěvku je odstraněn.',
  'web.legal.subprocessors.region.pending': 'Potvrzení oblasti',
  'web.legal.subprocessors.vendorPending': 'Vybírá se dodavatel',

  'web.legal.retention.column.data': 'Data',
  'web.legal.retention.column.period': 'Jak dlouho je uchováván',
  'web.legal.retention.credentials.label': 'Přihlašovací údaje k aktivní platformě',
  'web.legal.retention.credentials.period':
    'Zašifrováno, když je připojení aktivní. Odvoláno na platformě a smazáno zde, jakmile se odpojíte.',
  'web.legal.retention.oauthState.label': 'Stav transakce OAuth',
  'web.legal.retention.oauthState.period': 'Minuty, poté smazáno.',
  'web.legal.retention.drafts.label': 'Koncepty a média',
  'web.legal.retention.drafts.period':
    'Dokud je účet aktivní, nebo vaše vlastní nastavení uchování, s odkladem do koše.',
  'web.legal.retention.receipts.label': 'Potvrzení o publikacích a auditní události',
  'web.legal.retention.receipts.period':
    'Uchováno po plánovanou a zákonnou dobu uchování, minimalizováno a kdykoli exportovatelné.',
  'web.legal.retention.rawProvider.label': 'Nezpracované odpovědi platformy',
  'web.legal.retention.rawProvider.period':
    'Nejkratší doba potřebná pro ladění a soulad, poté minimalizována nebo odstraněna.',
  'web.legal.retention.metrics.label': 'Pozorování Analytics',
  'web.legal.retention.metrics.period':
    'Doba uchování plánu, v rámci toho, co umožňují podmínky platformy.',
  'web.legal.retention.securityLogs.label': 'Bezpečnostní protokoly',
  'web.legal.retention.securityLogs.period':
    'Pevné okno mezi 30 a 180 dny v závislosti na riziku události.',
  'web.legal.retention.billing.label': 'Fakturační záznamy',
  'web.legal.retention.billing.period':
    'Statutární účetní období uchovávané společností Polar a námi.',
  'web.legal.retention.deletedAccount.label': 'Smazaný účet',
  'web.legal.retention.deletedAccount.period':
    'Okamžitě zrušena pověření a naplánovaná práce. Úplné smazání bude dokončeno v publikovaném okně, kromě zákonných fakturačních záznamů.',
  'web.legal.retention.backups.label': 'Zálohy',
  'web.legal.retention.backups.period':
    'Šifrované a kontrolovaný přístup, platnost vyprší po zdokumentované rotaci. Smazání se šíří procesem obnovy.',

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.footer.product': 'Produkt',
  'web.footer.company': 'Společnost',
  'web.footer.resources': 'Zdroje',
  'web.footer.legal': 'Právní',
  'web.footer.developers': 'Vývojáři',
  'web.footer.statement':
    'Relay publikuje pouze prostřednictvím oficiálních rozhraní API platformy. Dostupnost konektoru závisí na schváleních, která řídí platformy, a každý nárok na funkci na tomto webu je datován a pochází.',
  'web.footer.noAffiliation':
    'Názvy a značky platforem patří jejich vlastníkům. Jejich použití zde identifikuje konektor a neznamená podporu nebo partnerství.',
  'web.footer.copyright': 'Relé {year}',
} as const;
