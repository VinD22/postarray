/**
 * The comparison pages' chrome.
 *
 * What belongs here: state words, section headings, labels, and the three
 * disclosure sentences whose numbers are read at render time from the code
 * that decides them. What deliberately does not: the claims themselves. A
 * comparison table is several hundred words of dated, sourced content per
 * page, and the English catalog is merged into one object that every page load
 * resolves, so those claims live in typed modules under
 * `apps/web/src/features/comparisons/entries` and are loaded per slug.
 *
 * The `web.compare.*` namespace is the older `/compare` index. This namespace
 * is the per comparison page, kept separate so the index copy that beta locales
 * already carry is not disturbed.
 */
export const webComparisonMessages = {
  'web.comparison.eyebrow': 'Srovnání',

  'web.comparison.state.yes': 'Ano',
  'web.comparison.state.no': 'Ne',
  'web.comparison.state.partial': 'Částečně',
  'web.comparison.state.notVerified': 'Neověřeno',

  'web.comparison.label.claim': 'Tvrzení',
  'web.comparison.label.sourceRead': 'Přečteno {date}',
  'web.comparison.label.checked': 'Každý řádek zkontrolován {date}',
  'web.comparison.label.nextReview': 'Další kontrola naplánována na {date}',
  'web.comparison.label.backToIndex': 'Všechna srovnání',

  'web.comparison.table.title': 'Co dělá každá možnost',
  'web.comparison.table.caption': 'Jedno tvrzení na řádek, se zdrojem za každou odpovědí',

  'web.comparison.bestFor.title': 'Které se hodí',
  'web.comparison.bestFor.ours': 'Vyberte tento produkt, když',
  'web.comparison.bestFor.alternative': 'Vyberte {name}, když',

  'web.comparison.notDo.title': 'Co tento produkt nedělá',
  'web.comparison.notDo.body':
    'Tyto věty se čtou z kódu, který je určuje, nejsou psané ručně, takže tato část se nemůže vzdálit od toho, čím produkt dnes skutečně je.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {Žádný konektor nedokončil ověření poskytovatele, takže dnes se přes tento produkt nic nepublikuje na žádné platformě.} one {# konektor dokončil ověření poskytovatele. Každá další platforma ve startovní skupině je stále jen záměr.} few {# konektory dokončily ověření poskytovatele. Každá další platforma ve startovní skupině je stále jen záměr.} many {# konektoru dokončilo ověření poskytovatele. Každá další platforma ve startovní skupině je stále jen záměr.} other {# konektorů dokončilo ověření poskytovatele. Každá další platforma ve startovní skupině je stále jen záměr.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {Žádný jazyk nedokončil lidskou revizi, takže každý jazyk v rozhraní je označen jako beta.} one {# jazyk dokončil lidskou revizi. Každý další jazyk je označen jako beta.} few {# jazyky dokončily lidskou revizi. Každý další jazyk je označen jako beta.} many {# jazyku dokončilo lidskou revizi. Každý další jazyk je označen jako beta.} other {# jazyků dokončilo lidskou revizi. Každý další jazyk je označen jako beta.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Každá cenová úroveň byla rozhodnuta a má skutečnou cenu.} one {# cenová úroveň je stále nerozhodnutým zástupným místem a nelze ji koupit.} few {# cenové úrovně jsou stále nerozhodnutými zástupnými místy a nelze je koupit.} many {# cenové úrovně je stále nerozhodnutým zástupným místem a nelze ji koupit.} other {# cenových úrovní je stále nerozhodnutými zástupnými místy a nelze je koupit.}}',

  'web.comparison.notVerified.title': 'Co znamená neověřeno',
  'web.comparison.notVerified.body':
    'Buňka říká neověřeno, pokud fakt nebylo možné přečíst v oficiální veřejné dokumentaci druhé možnosti v den kontroly. Nikdy se nedoplňuje z paměti a nikdy se nekopíruje ze shrnutí, které napsal někdo jiný.',

  'web.comparison.method.title': 'Jak tato stránka vzniká',
  'web.comparison.method.body':
    'Každý řádek je jedno tvrzení, s dokumentem, ze kterého pochází, a datem, kdy jej někdo přečetl. Nejsou zde žádné snímky obrazovky konkurence, žádné zkopírované formulace funkcí a žádné vymyšlené slabiny.',
  'web.comparison.method.cadence':
    'Každé srovnání je znovu zkontrolováno alespoň jednou za 90 dní, a okamžitě, když platforma nebo možnost změní něco, co řádek uvádí.',

  'web.comparison.questions.title': 'Otázky',
  'web.comparison.sources.title': 'Zdroje citované na této stránce',

  'web.comparison.index.title': 'Zveřejněná srovnání',
  'web.comparison.index.body':
    'Každá stránka srovnává tento produkt s kategorií alternativ, jejichž fakta lze přečíst z oficiální dokumentace. Jmenovaný produkt získá stránku, jakmile lze jeho aktuální fakta přečíst z jeho vlastních veřejných stránek, a ne dříve.',
  'web.comparison.index.checked': 'Zkontrolováno {date}',
} as const;
