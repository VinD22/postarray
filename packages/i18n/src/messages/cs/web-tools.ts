/**
 * The free tools on the public site.
 *
 * These pages exist because this repository already knows every launch cohort
 * platform's real publishing limits from its connector capability code. A tool
 * here may therefore state a number, but only a number the generated dataset
 * carries, always beside the official source and the date a person read it.
 *
 * Rules that bind this file specifically:
 *
 *  - A tool never claims the product publishes anywhere. Nothing in the launch
 *    cohort is verified for production yet, and these pages say so.
 *  - Every calculation described here runs in the reader's browser. Copy that
 *    promises privacy must stay true of the component that renders it.
 *  - No tool writes, rewrites, suggests or scores content. No tool looks up a
 *    handle, a follower count or anything else that would need an unofficial
 *    endpoint.
 *  - A limit we do not have is "unavailable". Never zero, never a guess.
 */
export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': 'Bezplatné publikační nástroje',
  'web.meta.tools.description':
    'Malé, soukromé nástroje pro lidi publikující na více platformách: kontrola limitů podle platformy, tvůrce UTM, kontrola délky titulků YouTube a plánovač časových pásem.',
  'web.meta.tools.preflight.title': 'Kontrola příspěvku před publikováním',
  'web.meta.tools.preflight.description':
    'Zkontrolujte jeden koncept proti publikovaným textovým a mediálním limitům deseti platforem, se zdrojem a datem, kdy byl každý limit přečten.',
  'web.meta.tools.utm.title': 'Tvůrce odkazů UTM',
  'web.meta.tools.utm.description':
    'Sestavte označenou kampaňovou URL a zjistěte, co znamená každý parametr UTM. Funguje zcela ve vašem prohlížeči.',
  'web.meta.tools.youtubeTitle.title': 'Kontrola délky titulků YouTube',
  'web.meta.tools.youtubeTitle.description':
    'Změřte titulek YouTube proti zdokumentovanému limitu, počítaný tak, jak počítá znaky člověk.',
  'web.meta.tools.timeZone.title': 'Plánovač časových pásem a letního času',
  'web.meta.tools.timeZone.description':
    'Zobrazte jeden čas publikování napříč několika pásmy publika a najděte týdny, kdy změna letního času posune místní hodinu.',
  'web.meta.tools.engagementRate.title': 'Kalkulačka míry zapojení',
  'web.meta.tools.engagementRate.description':
    'Vydělte interakce dosahem, sledujícími nebo zobrazeními. Tři jednoduché výpočty, žádný vymyšlený standard.',

  /* ---------------------------------------------------------------------- */
  /* Shared tool furniture                                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'Bezplatné nástroje',
  'web.tools.index.summary':
    'Malé kalkulačky postavené na stejných datech o limitech platforem, která čtou naše konektory.',
  'web.tools.index.lede':
    'Čtyři malé nástroje, postavené na stejných datech o limitech platforem, která používají naše konektory. Žádný účet, žádné nahrávání, žádné sledování toho, co píšete.',
  'web.tools.index.dataTitle': 'Odkud pocházejí čísla',
  'web.tools.index.dataBody':
    'Každý limit je generován z kódu schopností konektorů v tomto repozitáři a každý řádek platformy nese oficiální dokumentační stránku, ze které pochází, a datum, kdy ji někdo přečetl.',
  'web.tools.index.honesty':
    'Tyto nástroje nic nepublikují. Žádný konektor zatím nedokončil ověření poskytovatele, takže zde nic nepřipojuje účet.',
  'web.tools.shared.privacyTitle': 'Toto funguje ve vašem prohlížeči',
  'web.tools.shared.privacyBody':
    'Vše, co napíšete, zůstává na této stránce. Neexistuje žádný požadavek na server, žádné ukládání a žádná analytická událost nesoucí váš text.',
  'web.tools.shared.sourceLink': 'Dokumentace platformy',
  'web.tools.shared.sourceRead': 'Přečteno {date}',
  'web.tools.shared.unavailable': 'nedostupné',
  'web.tools.shared.unavailableWhy':
    'Pro tuto platformu zatím nedodáváme konektor, takže nemáme ověřený limit k zobrazení. Raději neřekneme nic, než abychom hádali.',
  'web.tools.shared.copy': 'Kopírovat',
  'web.tools.shared.copied': 'Zkopírováno',
  'web.tools.shared.copyFailed':
    'Váš prohlížeč zablokoval kopírování. Vyberte text a zkopírujte jej.',
  'web.tools.shared.faqTitle': 'Otázky',
  'web.tools.shared.baselineTitle': 'Který účet tato čísla popisují',
  'web.tools.shared.baselineBody':
    'Opatrný případ: nově připojený účet bez zvýšené způsobilosti. Některé platformy zvyšují limit, jakmile je kanál nebo firma ověřena, a tam, kde k tomu dojde, to stránka uvádí.',
  'web.tools.shared.otherTools': 'Další nástroje',

  /* ---------------------------------------------------------------------- */
  /* Tool names and one line summaries, shared by the index and the footer   */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'Kontrola příspěvku před publikováním',
  'web.tools.preflight.summary':
    'Jeden koncept, zkontrolovaný proti textovým a mediálním limitům deseti platforem najednou.',
  'web.tools.utm.name': 'Tvůrce odkazů UTM',
  'web.tools.utm.summary':
    'Sestavte označenou kampaňovou URL, aniž byste poškodili dotazovací řetězec, který měla.',
  'web.tools.youtubeTitle.name': 'Kontrola délky titulků YouTube',
  'web.tools.youtubeTitle.summary': 'Změřte titulek tak, jak počítá znaky člověk.',
  'web.tools.timeZone.name': 'Plánovač časových pásem a letního času',
  'web.tools.timeZone.summary':
    'Jeden čas publikování napříč několika pásmy publika, s vyznačenými posuny letního času.',
  'web.tools.engagementRate.name': 'Kalkulačka míry zapojení',
  'web.tools.engagementRate.summary':
    'Interakce vydělené dosahem, sledujícími nebo zobrazeními. Nic nevyhledáváme, nic neporovnáváme se standardem.',

  /* ---------------------------------------------------------------------- */
  /* Post preflight checker                                                  */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'Kontrola příspěvku před publikováním',
  'web.tools.preflight.lede':
    'Vložte koncept, vyberte platformy, na kterých publikujete, a zjistěte, které by jej odmítly, dříve než to zjistíte z chyby API.',
  'web.tools.preflight.explainer.title': 'Proč nestačí počítadlo znaků',
  'web.tools.preflight.explainer.body':
    'Platformy se neshodnou na tom, co je znak. Některé počítají kódové jednotky, takže jedno emoji stojí dva. Některé počítají grafémy, takže vlajka nebo rodinné emoji stojí jeden. Některé přepisují každý odkaz na pevnou šířku, takže URL o 200 znacích stojí stejně jako ta o 20. Tento nástroj aplikuje pravidlo každé platformy zvlášť.',
  'web.tools.preflight.explainer.counting':
    'Koncept je měřen pomocí Intl segmentátoru prohlížeče, který rozdělí text na jednotky, kterým by čtenář řekl znaky, poté upravené podle pravidla platformy.',
  'web.tools.preflight.field.draft.label': 'Váš koncept',
  'web.tools.preflight.field.draft.help':
    'Vložte text příspěvku. Odkazy jsou detekovány automaticky, takže jejich cenu lze aplikovat podle platformy.',
  'web.tools.preflight.field.platforms.label': 'Platformy ke kontrole',
  'web.tools.preflight.field.platforms.help': 'Vyberte tolik, kolik jich používáte k publikování.',
  'web.tools.preflight.field.mediaKind.label': 'Připojená média',
  'web.tools.preflight.field.mediaKind.none': 'Bez médií',
  'web.tools.preflight.field.mediaKind.image': 'Obrázky',
  'web.tools.preflight.field.mediaKind.video': 'Jedno video',
  'web.tools.preflight.field.mediaCount.label': 'Kolik obrázků',
  'web.tools.preflight.field.byteSize.label': 'Velikost souboru v megabajtech',
  'web.tools.preflight.field.byteSize.help':
    'Největší jednotlivý soubor. Nechte prázdné pro přeskočení.',
  'web.tools.preflight.field.duration.label': 'Délka videa v sekundách',
  'web.tools.preflight.field.duration.help': 'Nechte prázdné pro přeskočení kontroly délky.',
  'web.tools.preflight.field.width.label': 'Šířka médií v pixelech',
  'web.tools.preflight.field.height.label': 'Výška médií v pixelech',
  'web.tools.preflight.field.dimensions.help':
    'Volitelné. Používá se pouze pro zobrazení poměru stran, který byste publikovali.',
  'web.tools.preflight.results.title': 'Výsledek podle platformy',
  'web.tools.preflight.results.empty': 'Vyberte alespoň jednu platformu, abyste viděli výsledek.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Nic neblokujícího} other {# by selhalo}}, {warning, plural, =0 {žádná upozornění} other {# ke kontrole}}.',
  'web.tools.preflight.status.pass': 'Vyhovuje',
  'web.tools.preflight.status.warning': 'Stojí za kontrolu',
  'web.tools.preflight.status.fail': 'Selhalo by',
  'web.tools.preflight.status.unavailable': 'Nedostupné',
  'web.tools.preflight.count.label':
    '{count} z {limit} {unit, select, grapheme {znaků} utf16 {kódových jednotek} weighted {vážených znaků} other {znaků}}',
  'web.tools.preflight.finding.textOver':
    'Přes limit o {over, plural, one {# znak} few {# znaky} many {# znaku} other {# znaků}}.',
  'web.tools.preflight.finding.textNear': 'V mezích {remaining} znaků od limitu.',
  'web.tools.preflight.finding.textFits': 'Text se vejde.',
  'web.tools.preflight.finding.linkFixed':
    'Každý odkaz je přepsán na pevnou šířku, takže každý stojí {cost} znaků bez ohledu na jeho skutečnou délku.',
  'web.tools.preflight.finding.linkActual': 'Odkazy se počítají jako znaky, které zabírají.',
  'web.tools.preflight.finding.imagesOver':
    'Tato platforma akceptuje {limit, plural, =0 {žádné obrázky} one {# obrázek} few {# obrázky} many {# obrázku} other {# obrázků}} v jednom příspěvku.',
  'web.tools.preflight.finding.videosOver':
    'Tato platforma akceptuje {limit, plural, =0 {žádné video} one {# video} few {# videa} many {# videa} other {# videí}} v jednom příspěvku.',
  'web.tools.preflight.finding.bytesOver': 'Soubor je větší než limit {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    'Pro tento typ médií není zveřejněn žádný bajtový limit, takže velikost nebyla zkontrolována.',
  'web.tools.preflight.finding.durationOver': 'Delší než limit {limit} sekund.',
  'web.tools.preflight.finding.durationUnder': 'Kratší než minimum {limit} sekund.',
  'web.tools.preflight.finding.durationUnknown':
    'Není zveřejněn žádný limit délky, takže délka nebyla zkontrolována.',
  'web.tools.preflight.finding.altText':
    'Alternativní text je přijímán do {limit} znaků, což se vyplatí využít.',
  'web.tools.preflight.finding.ratio': 'Publikovali byste v poměru přibližně {ratio} k 1.',
  'web.tools.preflight.faq.counting.q': 'Jak počítáte znaky?',
  'web.tools.preflight.faq.counting.a':
    'Podle grafému, pomocí Intl segmentátoru prohlížeče, což je jednotka, kterou čtenář myslí znakem. Tam, kde platforma dokumentuje jiné pravidlo, například počítání kódových jednotek nebo účtování pevné šířky za odkaz, je toto pravidlo aplikováno navíc.',
  'web.tools.preflight.faq.accuracy.q': 'Jak aktuální jsou tyto limity?',
  'web.tools.preflight.faq.accuracy.a':
    'Každý limit je generován z kódu konektorů v našem repozitáři místo psaní na stránku a každý řádek platformy ukazuje oficiální dokument, ze kterého pochází, a datum, kdy jej někdo přečetl. Pokud platforma změní číslo, oprava je jedna změna kódu a každý nástroj zde ji následuje.',
  'web.tools.preflight.faq.privacy.q': 'Je můj koncept někam nahráván?',
  'web.tools.preflight.faq.privacy.a':
    'Ne. Kontrola funguje ve vašem prohlížeči. Neexistuje žádný požadavek nesoucí váš text, nic se neukládá a zavření karty stačí k jeho zahození.',
  'web.tools.preflight.faq.publish.q': 'Může tento nástroj publikovat za mě?',
  'web.tools.preflight.faq.publish.a':
    'Ještě ne. Žádný konektor nedokončil ověření poskytovatele, takže nic na tomto webu zatím nepublikuje na platformu. Tato stránka je kontrola limitů, ne editor.',

  /* ---------------------------------------------------------------------- */
  /* UTM builder                                                             */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'Tvůrce odkazů UTM',
  'web.tools.utm.lede':
    'Přidejte kampaňové parametry k URL, aniž byste ztratili dotazovací řetězec, který už měla, a aniž byste hádali, co který parametr znamená.',
  'web.tools.utm.explainer.title': 'K čemu slouží jednotlivé parametry',
  'web.tools.utm.explainer.body':
    'Parametry UTM čtou analytické nástroje, ne platforma, na které publikujete. Cestují v URL, takže je vidí každý, kdo odkaz uvidí. Udržujte je krátké, malými písmeny a konzistentní, protože dva pravopisy stejné kampaně se stanou dvěma řádky v reportu.',
  'web.tools.utm.field.url.label': 'Cílová URL',
  'web.tools.utm.field.url.help': 'Stránka, kam chcete lidi přivést, včetně https.',
  'web.tools.utm.field.url.invalid': 'Toto se neanalyzuje jako URL http nebo https.',
  'web.tools.utm.field.source.label': 'Zdroj kampaně',
  'web.tools.utm.field.source.help': 'Odkud přišel klik. Například název platformy.',
  'web.tools.utm.field.medium.label': 'Médium kampaně',
  'web.tools.utm.field.medium.help': 'Druh odkazu. Například social, e-mail nebo doporučení.',
  'web.tools.utm.field.campaign.label': 'Název kampaně',
  'web.tools.utm.field.campaign.help':
    'Spuštění, propagace nebo téma, ke kterému tento odkaz patří.',
  'web.tools.utm.field.term.label': 'Termín kampaně',
  'web.tools.utm.field.term.help': 'Volitelné. Tradičně placené klíčové slovo.',
  'web.tools.utm.field.content.label': 'Obsah kampaně',
  'web.tools.utm.field.content.help':
    'Volitelné. Odlišuje dva odkazy na stejnou stránku, například dvě verze příspěvku.',
  'web.tools.utm.result.title': 'Vaše označená URL',
  'web.tools.utm.result.empty': 'Zadejte cílovou URL, abyste viděli výsledek.',
  'web.tools.utm.result.label': 'Sestavená URL',
  'web.tools.utm.result.preserved':
    'Dotazovací řetězec, který už byl na vaší URL, se zachová přesně tak, jak jste jej napsali.',
  'web.tools.utm.result.replaced':
    'Vaše URL už nesla jeden z těchto parametrů. Hodnota, kterou jste zde zadali, jej nahrazuje.',
  'web.tools.utm.faq.encoding.q': 'Co se stane s mezerami a diakritikou?',
  'web.tools.utm.faq.encoding.a':
    'Jsou procentuálně kódovány, což umožňuje odkazu přežít vložení do příspěvku. Mezera se stane znaménkem plus a písmeno s diakritikou se stane svou kódovanou formou, a analytické nástroje obě zpět dekódují.',
  'web.tools.utm.faq.existing.q': 'Rozbije to URL, která už má parametry?',
  'web.tools.utm.faq.existing.a':
    'Ne. Existující parametry se zachovávají v původním pořadí a přidán nebo nahrazen je pouze parametr UTM, který jste vyplnili. Fragment na konci URL zůstává na konci.',
  'web.tools.utm.faq.privacy.q': 'Je moje URL někam odesílána?',
  'web.tools.utm.faq.privacy.a':
    'Ne. URL je sestavena ve vašem prohlížeči a nikdy tuto stránku neopustí.',

  /* ---------------------------------------------------------------------- */
  /* YouTube title length checker                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'Kontrola délky titulků YouTube',
  'web.tools.youtubeTitle.lede':
    'Titulek, který je o jeden znak příliš dlouhý, je při nahrávání odmítnut. Titulek, který je pouze dlouhý, je oříznut v místě, které jste si nevybrali.',
  'web.tools.youtubeTitle.explainer.title': 'Dva různé limity',
  'web.tools.youtubeTitle.explainer.body':
    'Tvrdý limit je to, co přijímá koncový bod pro nahrávání. Kde je titulek zobrazen, je samostatná otázka: výsledek vyhledávání, postranní panel a telefon všechny oříznou titulek na jiném místě a žádné z těchto míst oříznutí není publikováno. Tento nástroj uvádí zdokumentovaný limit a ukazuje tvar vašeho titulku a nevymýšlí číslo oříznutí.',
  'web.tools.youtubeTitle.field.title.label': 'Titulek videa',
  'web.tools.youtubeTitle.field.title.help': 'Počítáno podle grafému, takže emoji stojí jeden.',
  'web.tools.youtubeTitle.result.count': '{count} z {limit} znaků',
  'web.tools.youtubeTitle.result.over':
    'Přes limit o {over, plural, one {# znak} few {# znaky} many {# znaku} other {# znaků}}. Nahrávání by bylo odmítnuto.',
  'web.tools.youtubeTitle.result.fits': 'V mezích zdokumentovaného limitu.',
  'web.tools.youtubeTitle.result.front':
    'Prvních {count} znaků nese největší váhu, protože zhruba tolik místa má úzké rozvržení. Váš začíná: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'Limit titulku není v této verzi dostupný, takže se zde nic nekontroluje.',
  'web.tools.youtubeTitle.faq.limit.q': 'Odkud pochází limit?',
  'web.tools.youtubeTitle.faq.limit.a':
    'Z oficiální reference videos insert, generované na této stránce ze stejného kódu konektorů, jaký by použil náš nahrávač. Datum, kdy někdo tuto stránku naposledy přečetl, je zobrazeno vedle čísla.',
  'web.tools.youtubeTitle.faq.truncation.q': 'Kde přesně YouTube oříznout titulek?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'Záleží na povrchu a zobrazovací ploše a YouTube pro to nezveřejňuje počet znaků. Ukazujeme limit, který je zdokumentovaný, a netiskneme číslo oříznutí, které by byl odhad.',
  'web.tools.youtubeTitle.faq.emoji.q': 'Počítá se emoji jako jeden znak?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'V tomto počítadle ano, protože počítáme grafémy. Platforma, která interně počítá kódové jednotky, může za stejné emoji účtovat více, a proto kontrola před publikováním aplikuje pravidlo každé platformy zvlášť.',

  /* ---------------------------------------------------------------------- */
  /* Time zone and daylight saving planner                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'Plánovač časových pásem a letního času',
  'web.tools.timeZone.lede':
    'Týdenní termín, který ve vašem kalendáři vypadá stabilně, se pro polovinu vašeho publika dvakrát ročně posune. Toto ukazuje kde a kdy.',
  'web.tools.timeZone.explainer.title': 'Proč pevný místní čas není pevný čas',
  'web.tools.timeZone.explainer.body':
    'Čas něco znamená pouze s připojeným pásmem. Pásma mění svůj posun v datech, která se liší podle země, a dva regiony vzdálené pět hodin v lednu mohou být vzdálené čtyři hodiny v dubnu. Plán uložený jako okamžik plus pásmo to přežije. Plán uložený jako místní hodina ne.',
  'web.tools.timeZone.field.date.label': 'Datum',
  'web.tools.timeZone.field.time.label': 'Čas',
  'web.tools.timeZone.field.zone.label': 'Vaše pásmo',
  'web.tools.timeZone.field.audience.label': 'Pásma publika',
  'web.tools.timeZone.field.audience.help': 'Vyberte pásma, ve kterých vaši čtenáři skutečně jsou.',
  'web.tools.timeZone.result.title': 'Stejný okamžik, všude, kde jste vybrali',
  'web.tools.timeZone.result.empty': 'Vyberte alespoň jedno pásmo publika.',
  'web.tools.timeZone.result.shift':
    'Změna letního času spadá mezi toto datum a stejný den v týdnu o čtyři týdny později, takže se místní hodina posune.',
  'web.tools.timeZone.result.stable': 'Žádná změna posunu v příštích čtyřech týdnech.',
  'web.tools.timeZone.result.later': 'O čtyři týdny později, {time}.',
  'web.tools.timeZone.result.invalidDate': 'Zadejte datum a čas, abyste viděli srovnání.',
  'web.tools.timeZone.faq.dst.q': 'Kterým směrem se hodina posune?',
  'web.tools.timeZone.faq.dst.a':
    'Záleží na pásmu a směru změny, a proto tabulka ukazuje skutečný místní čas o čtyři týdny dopředu místo popisu pravidla. Posun pro každé pásmo je čten z databáze časových pásem vašeho prohlížeče.',
  'web.tools.timeZone.faq.storage.q': 'Jak by měl naplánovaný příspěvek ukládat svůj čas?',
  'web.tools.timeZone.faq.storage.a':
    'Jako okamžik plus pásmo IANA, které si osoba vybrala, nikdy jako naivní místní čas. To je to, co děláme interně, a proto příspěvek naplánovaný před změnou hodin stále přistane v zamýšlenou místní hodinu.',

  /* ---------------------------------------------------------------------- */
  /* Engagement rate calculator                                              */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': 'Kalkulačka míry zapojení',
  'web.tools.engagementRate.lede':
    'Zadejte čísla, která vám váš vlastní přehled už ukazuje. Toto je vydělí třemi způsoby a tam se zastaví: žádný standard, žádný práh „dobré“, nic, co bychom opravdu neměli.',
  'web.tools.engagementRate.explainer.title': 'Proč tři jmenovatele, ne jeden',
  'web.tools.engagementRate.explainer.body':
    'Dosah, sledující a zobrazení odpovídají na různé otázky. Míra podle dosahu vám říká, jak reagovali lidé, kteří příspěvek skutečně viděli. Míra podle sledujících vám říká, jaký podíl vašeho publika se zapojil, bez ohledu na to, zda příspěvek zasáhl všechny. Míra podle zobrazení počítá každé zobrazení, včetně opakování. Porovnávání míry vypočítané jedním způsobem s mírou vypočítanou jiným způsobem je běžným zdrojem čísla zapojení, které vypadá špatně.',
  'web.tools.engagementRate.field.interactions.label': 'Interakce',
  'web.tools.engagementRate.field.interactions.help':
    'Lajky, komentáře, sdílení a uložení sečtené dohromady, z příspěvku, který měříte.',
  'web.tools.engagementRate.field.reach.label': 'Dosah',
  'web.tools.engagementRate.field.reach.help': 'Účty, které viděly příspěvek alespoň jednou.',
  'web.tools.engagementRate.field.followers.label': 'Sledující',
  'web.tools.engagementRate.field.followers.help': 'Velikost účtu v době příspěvku.',
  'web.tools.engagementRate.field.impressions.label': 'Zobrazení',
  'web.tools.engagementRate.field.impressions.help':
    'Celkový počet zobrazení, včetně osoby, která to viděla dvakrát.',
  'web.tools.engagementRate.result.title': 'Míra zapojení, třemi způsoby',
  'web.tools.engagementRate.result.empty': 'nedostupné',
  'web.tools.engagementRate.result.note':
    'Neexistuje univerzálně dobrá míra pro srovnání. Záleží na platformě, formátu, velikosti publika a odvětví, a jakékoli jedno číslo nabízené jako standard je odhad převlečený za data.',
  'web.tools.engagementRate.basis.reach': 'Podle dosahu',
  'web.tools.engagementRate.basis.followers': 'Podle sledujících',
  'web.tools.engagementRate.basis.impressions': 'Podle zobrazení',
  'web.tools.engagementRate.faq.formula.q': 'Jaký je skutečný vzorec?',
  'web.tools.engagementRate.faq.formula.a':
    'Interakce vydělené jmenovatelem, který vyberete, zobrazené jako procento. Interakce zde znamenají lajky, komentáře, sdílení a uložení sečtené dohromady; některé platformy je uvádějí odděleně, v takovém případě je sečtěte sami před zadáním celkového počtu.',
  'web.tools.engagementRate.faq.basis.q': 'Který jmenovatel bych měl použít?',
  'web.tools.engagementRate.faq.basis.a':
    'Ten, který vaše platforma uvádí spolu s příspěvkem, aby obě čísla pocházela ze stejného měřicího okna. Porovnávání míry podle dosahu na jednom příspěvku s mírou podle sledujících na jiném není spravedlivé srovnání, i když se obě nazývají mírou zapojení.',
} as const;
