/**
 * The in-page product demonstration: the hero demonstration on the home page
 * and the guided walkthrough at `/demo`.
 *
 * Rules that bind this file specifically:
 *
 *  - Every panel on those surfaces is built from the real design system, so a
 *    reader is looking at the interface rather than at a drawing of it. The
 *    copy must therefore never describe something the interface does not do.
 *  - The content is sample content for a company that does not exist, and it
 *    says so in words, in the caption a screen reader reads with the figure.
 *  - No number here is an engagement number. There is no follower count, no
 *    reach figure and no score, because the product has no such data and a
 *    demonstration that invents one is a fabricated dashboard.
 *  - Nothing publishes today. No connector has passed provider verification,
 *    so the demonstration stops at the point the product stops: a scheduled
 *    post, an approval, and a receipt whose publishing half is unavailable.
 *  - The demonstration submits nothing. It has no form, no destination and no
 *    account behind it, and the copy must not suggest otherwise.
 */
export const webDemoMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata and navigation                                                 */
  /* ---------------------------------------------------------------------- */

  'web.meta.demo.title': 'Podívejte se, jak Relay funguje',
  'web.meta.demo.description':
    'Řízená prohlídka publikačního postupu, od nového projektu až po potvrzenku, zobrazená ve skutečném rozhraní s ukázkovým obsahem. Zatím se nic nepublikuje a prohlídka říká, kde ta hranice je.',

  'web.demo.nav.label': 'Podívejte se, jak to funguje',
  'web.demo.nav.summary':
    'Řízená prohlídka produktu v pořadí, v jakém jej poznáváte, sestavená ze skutečného rozhraní s ukázkovým obsahem.',

  /* ---------------------------------------------------------------------- */
  /* The frame every demonstration panel sits in                             */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': 'Ukázka',
  'web.demo.frame.sample':
    'Ukázka sestavená ze skutečného rozhraní, naplněná ukázkovým obsahem pro společnost, která neexistuje. Ne živý účet. Nic zde nic neodesílá.',

  'web.demo.control.pause': 'Pozastavit ukázku',
  'web.demo.control.play': 'Přehrát ukázku',
  'web.demo.control.replay': 'Přehrát ukázku znovu',

  /* ---------------------------------------------------------------------- */
  /* The home page hero demonstration                                        */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.caption':
    'Jeden koncept se stane verzí pro každou platformu, dostane čas a přistane v týdnu. Ukázkový obsah, ne živý účet.',
  'web.demo.hero.more': 'Projděte si celý pracovní postup',

  /* ---------------------------------------------------------------------- */
  /* The walkthrough page                                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': 'Jak to funguje, v pořadí, v jakém to poznáváte',
  'web.demo.lede':
    'Devět kroků, od prázdného pracovního prostoru až po záznam o tom, co se stalo. Každý ukazuje povrch, na který byste se skutečně dívali, s ukázkovým obsahem v něm. Nic na této stránce se nehýbe samo, takže si ji můžete přečíst svým tempem.',
  'web.demo.notice.title': 'Toto je ukázka, ne živý účet',
  'web.demo.notice.body':
    'Každý panel zde je rozhraní produktu s ukázkovým obsahem v něm. Žádný konektor neprošel ověřením poskytovatele, takže dnes se přes tento produkt nic nepublikuje na žádné platformě. Kde se pracovní postup zastavuje, stránka to říká, místo aby kreslila zbytek.',
  'web.demo.contents.title': 'Devět kroků',
  'web.demo.stepLabel': 'Krok {position} z {total}',
  'web.demo.next': 'Další: {step}',
  'web.demo.closing.pricing': 'Podívejte se, kolik to stojí',
  'web.demo.closing.title': 'To je celý cyklus',
  'web.demo.closing.body':
    'Nic výše není maketou produktu, který doufáme postavit. Je to rozhraní tak, jak je, s publikační polovinou poctivě označenou jako nedokončenou.',

  /* ---------------------------------------------------------------------- */
  /* The nine steps                                                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': 'Vytvořte projekt',
  'web.demo.step.project.body':
    'Projekt obsahuje účty, koncepty, schválení a časové pásmo. Každý dotaz v produktu je omezen na jeden projekt, v aplikační službě a znovu v databázi, takže klient nemůže náhodou vidět jiného klienta.',

  'web.demo.step.connect.title': 'Připojte účet',
  'web.demo.step.connect.body':
    'Připojování prochází pouze přes oficiální API platformy a řekne vám, co platforma od účtu vyžaduje, než začnete. Dnes se každý konektor zastaví na ověření, a proto to každý řádek níže říká, místo aby ukazoval zelenou fajfku.',

  'web.demo.step.compose.title': 'Napište to jednou, přizpůsobte pro každou platformu',
  'web.demo.step.compose.body':
    'Napíšete hlavní koncept. Výběr jednoho účtu otevře přepis pouze pro tento účet, s vlastními limity a vlastním náhledem. Nic, co napíšete pro LinkedIn, nemění to, co dostane X, a kontroly pod každou verzí proběhnou dřív, než je cokoli naplánováno.',

  'web.demo.step.variants.title': 'Podívejte se, co skutečně dostane každý účet',
  'web.demo.step.variants.body':
    'Jeden koncept se stane jednou verzí na účet, každá napsaná pro platformu, na kterou jde: kratší řádek pro X, celá poznámka o vydání pro LinkedIn, popisek a alternativní text pro Instagram. Kteroukoli z nich upravíte, aniž byste se dotkli ostatních, a každá verze nese kontrolu, která se na ni vztahuje.',

  'web.demo.step.schedule.title': 'Dejte tomu čas, nebo to předejte frontě',
  'web.demo.step.schedule.body':
    'Čas se ukládá jako okamžik plus časové pásmo projektu, nikdy jako naivní místní čas, takže vám změna letního času nic neposune. Fronta je druhá cesta: bere další termín povolený pravidly, která jste nastavili.',

  'web.demo.step.calendar.title': 'Sledujte kalendář',
  'web.demo.step.calendar.body':
    'Týden ukazuje platformu, účet, stav a čas pro každý příspěvek. Přesunutí jednoho je stejně dobře tlačítko jako přetažení, takže kalendář je plně použitelný z klávesnice.',

  'web.demo.step.receipt.title': 'Přečtěte si potvrzenku poté',
  'web.demo.step.receipt.body':
    'Každý pokus zapíše neměnnou potvrzenku: kdo ji napsal, kdo ji schválil, podle jakých zásad, v jaký okamžik. Publikační polovinu tohoto záznamu zapisuje běh publikování, což je část, která ještě neexistuje.',

  /* ---------------------------------------------------------------------- */
  /* Panel labels                                                            */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': 'Projekt',
  'web.demo.project.zone': 'Časové pásmo: {zone}',
  'web.demo.project.scope':
    'Koncepty, účty, schválení a potvrzenky patří tomuto projektu a nikam jinam.',

  'web.demo.accounts.label': 'Účty v tomto projektu',
  'web.demo.accounts.state': 'Ověření nedokončeno',
  'web.demo.accounts.note':
    'Každý řádek by nesl stav tokenu, udělená oprávnění a poslední úspěšný příspěvek. Žádný z nich dnes nemůže publikovat.',

  'web.demo.master.label': 'Hlavní koncept',
  'web.demo.master.project': 'V projektu {project}',

  'web.demo.variants.label': 'Co dostane každý účet',

  'web.demo.schedule.label': 'Naplánováno',
  'web.demo.schedule.value': '{when} v pásmu {zone}',
  'web.demo.schedule.approval': 'Než lze cokoli odeslat, je vyžadováno jedno schválení.',
  'web.demo.schedule.queue':
    'Fronta je druhá cesta: vybere další termín povolený vašimi pravidly, v tomto časovém pásmu.',

  'web.demo.week.label': 'Týden',
  'web.demo.week.caption': 'Stejné tři příspěvky v kalendáři, čtené v časovém pásmu projektu.',
  'web.demo.week.empty': 'Nic naplánováno',

  'web.demo.receipt.label': 'Potvrzenka zatím',
  'web.demo.receipt.pending':
    'Co bylo odesláno, co odpověděla platforma, externí ID příspěvku a trvalý odkaz jsou zapisovány během běhu publikování. Zůstávají nedostupné, dokud konektor neprojde ověřením poskytovatele.',
  'web.demo.receipt.field.externalId': 'Externí ID příspěvku',
  'web.demo.receipt.field.permalink': 'Trvalý odkaz',

  /* ---------------------------------------------------------------------- */
  /* Sample content                                                          */
  /*                                                                         */
  /* Northbound Tools is the sample company the marketing pages already use.  */
  /* Its handles sit on the reserved `.example` domain and its people are     */
  /* first names with no surname, so nothing here can be mistaken for a real  */
  /* customer, a real account or a real endorsement.                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools (ukázka)',
  'web.demo.sample.actor': 'Ada, ukázková kolegyně',
  'web.demo.sample.approver': 'Ravi, ukázkový recenzent',
  'web.demo.sample.policy': 'Jedno schválení před odesláním',
  'web.demo.sample.master':
    'Northbound 2.4 dnes vychází. Importy jsou rychlejší, vyhledávání má klávesovou zkratku a chyba exportu, kterou hlásili dva z vás, je opravena.',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'Northbound 2.4 je venku. Rychlejší importy, vyhledávání klávesnicí a ta chyba exportu je opravena.',
  'web.demo.sample.x.check': 'Počet znaků a pořadí vlákna',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    'Northbound 2.4 dnes vychází. Poznámka o vydání plně vysvětluje změny importu a opravu exportu.',
  'web.demo.sample.linkedin.check': 'Role organizace a délka příspěvku',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    'Stejný obrázek vydání, s popiskem napsaným pro feed a alternativním textem napsaným člověkem.',
  'web.demo.sample.instagram.check': 'Typ účtu, poměr stran a alternativní text',

  /* ---------------------------------------------------------------------- */
  /* The nine scene product tour                                             */
  /*                                                                         */
  /* The step names are the indicator's button labels, so they are short      */
  /* enough to sit in a row of nine and specific enough to be worth clicking. */
  /* They are also the labels of the stacked walkthrough a reader gets with   */
  /* reduced motion or no JavaScript, which is the same tour with the timing  */
  /* taken out rather than a reduced version of it.                           */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': 'Kroky prohlídky',
  'web.demo.tour.jump': 'Zobrazit krok {position}: {step}',
  'web.demo.tour.step.project': 'Vytvořte projekt',
  'web.demo.tour.step.connect': 'Připojit účty',
  'web.demo.tour.step.compose': 'Napsat jednou',
  'web.demo.tour.step.variants': 'Přizpůsobit pro platformu',
  'web.demo.tour.step.validate': 'Zkontrolovat to',
  'web.demo.tour.step.schedule': 'Dát tomu čas',
  'web.demo.tour.step.week': 'Podívat se na týden',
  'web.demo.tour.step.publish': 'Publikovat a zaznamenat',
  'web.demo.tour.step.digest': 'Přečíst přehled',

  /* ---------------------------------------------------------------------- */
  /* Checks (step 5)                                                         */
  /*                                                                         */
  /* Only checks the composer genuinely runs today: the per account character */
  /* limit (`validation.text_too_long`), alt text on every image             */
  /* (`validation.alt_text_missing`), and whether a first comment is allowed  */
  /* on the account it was written for (the `firstComment` capability).       */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': 'Kontroly před naplánováním',
  'web.demo.validate.check.length': 'Limit znaků, podle účtu',
  'web.demo.validate.check.lengthDetail':
    'Každá verze je měřena proti limitu, který platforma tomuto účtu dává.',
  'web.demo.validate.check.altText': 'Alternativní text u každého obrázku',
  'web.demo.validate.check.altTextDetail':
    'Obrázek bez popisu, nebo bez označení jako dekorativní, zastaví plánování.',
  'web.demo.validate.check.firstComment': 'První komentář zde povolen',
  'web.demo.validate.check.firstCommentDetail':
    'První komentář je nabízen pouze u účtů, jejichž platforma jej podporuje.',
  'web.demo.validate.note':
    'Tyto kontroly proběhnou v editoru dřív, než je cokoli naplánováno, a znovu dřív, než je cokoli odesláno.',

  /* ---------------------------------------------------------------------- */
  /* Publish and receipt (step 8)                                            */
  /*                                                                         */
  /* The steps a scheduled post has really passed are completed. Everything   */
  /* the publish run would write is pending, because no connector has passed  */
  /* provider verification, so there is no publish run to write it.           */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': 'Publikování a jeho záznam',
  'web.demo.live.step.approved': 'Schváleno uživatelem {approver}',
  'web.demo.live.step.queued': 'Zařazeno do fronty na svůj termín',
  'web.demo.live.step.sent': 'Odesláno na platformu',
  'web.demo.live.step.confirmed': 'Potvrzeno platformou',
  'web.demo.live.badge.pending': 'Nepublikováno',
  'web.demo.live.badge.live': 'Živé',
  'web.demo.live.pending':
    'Poslední dva kroky zapisuje běh publikování. Žádný konektor zatím neprošel ověřením poskytovatele, takže zůstávají čekající a externí ID příspěvku a trvalý odkaz zůstávají nedostupné.',

  /* ---------------------------------------------------------------------- */
  /* The weekly digest (step 9)                                              */
  /*                                                                         */
  /* Sentences about what the product did, never engagement figures. There is */
  /* no reach, no impression count and no score here, because the product has */
  /* none to read and a digest that invented one would be a fabricated        */
  /* dashboard with a friendlier voice.                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': 'Váš týden, ve větách',
  'web.demo.digest.sample': 'Ukázka',
  'web.demo.digest.line.variants':
    'Tento týden vyšly z jednoho konceptu tři verze specifické pro platformu.',
  'web.demo.digest.line.earliest': 'Úterní ráno bylo vaším nejranějším termínem.',
  'web.demo.digest.line.approval': 'Každá verze byla schválena dřív, než byla zařazena do fronty.',
  'web.demo.digest.line.alt': 'Každý obrázek nesl alternativní text napsaný člověkem.',
  'web.demo.digest.footer': 'Živá analytika se zde objeví, jakmile se vaše příspěvky publikují.',

  /* ---------------------------------------------------------------------- */
  /* The three added walkthrough steps                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': 'Zkontrolujte to před naplánováním',
  'web.demo.step.validate.body':
    'Editor měří každou verzi proti účtu, pro který je napsána: limit znaků, který tento účet skutečně má, alternativní text u každého obrázku a zda platforma vůbec nabízí první komentář. Verzi, která neprojde kontrolou, nelze naplánovat.',

  'web.demo.step.publish.title': 'Publikujte a uchovejte záznam',
  'web.demo.step.publish.body':
    'Běh publikování odešle každou verzi v jejím okamžiku, zaznamená, co odpověděla platforma, a zapíše neměnnou potvrzenku. Tento běh je část, která ještě neexistuje, takže poslední dva kroky níže čekají, místo aby byly nakresleny jako dokončené.',

  'web.demo.step.digest.title': 'Přečtěte si týdenní přehled',
  'web.demo.step.digest.body':
    'Přehled ve větách popisuje, co produkt udělal: kolik verzí vyšlo z jednoho konceptu, který termín byl nejranější, co bylo schváleno. Neobsahuje žádná čísla zapojení, protože analytika přichází z platforem poté, co se příspěvek publikuje, a zatím se nic nepublikuje.',
} as const;
