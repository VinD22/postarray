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
  'web.comparison.eyebrow': 'Vergelijking',

  'web.comparison.state.yes': 'Ja',
  'web.comparison.state.no': 'Nee',
  'web.comparison.state.partial': 'Deels',
  'web.comparison.state.notVerified': 'Niet geverifieerd',

  'web.comparison.label.claim': 'Bewering',
  'web.comparison.label.sourceRead': 'Gelezen op {date}',
  'web.comparison.label.checked': 'Elke rij gecontroleerd op {date}',
  'web.comparison.label.nextReview': 'Volgende controle verwacht op {date}',
  'web.comparison.label.backToIndex': 'Alle vergelijkingen',

  'web.comparison.table.title': 'Wat elke optie doet',
  'web.comparison.table.caption': 'Eén bewering per rij, met de bron achter elk antwoord',

  'web.comparison.bestFor.title': 'Welke past',
  'web.comparison.bestFor.ours': 'Kies dit product wanneer',
  'web.comparison.bestFor.alternative': 'Kies {name} wanneer',

  'web.comparison.notDo.title': 'Wat dit product niet doet',
  'web.comparison.notDo.body':
    'Deze zinnen worden gelezen uit de code die ze bepaalt, niet met de hand getypt, dus dit onderdeel kan niet afwijken van wat het product vandaag daadwerkelijk is.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {Geen enkele connector heeft providerverificatie voltooid, dus vandaag wordt via dit product niets op een platform gepubliceerd.} one {# connector heeft providerverificatie voltooid. Elk ander platform in het lanceringscohort is nog een intentie.} other {# connectors hebben providerverificatie voltooid. Elk ander platform in het lanceringscohort is nog een intentie.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {Geen enkele taal heeft menselijke beoordeling voltooid, dus elke taal in de interface is gelabeld als beta.} one {# taal heeft menselijke beoordeling voltooid. Elke andere taal is gelabeld als beta.} other {# talen hebben menselijke beoordeling voltooid. Elke andere taal is gelabeld als beta.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Elk prijsniveau is vastgesteld en heeft een echte prijs.} one {# prijsniveau is nog een onbesliste tijdelijke aanduiding en kan niet worden gekocht.} other {# prijsniveaus zijn nog onbesliste tijdelijke aanduidingen en kunnen niet worden gekocht.}}',

  'web.comparison.notVerified.title': 'Wat niet geverifieerd betekent',
  'web.comparison.notVerified.body':
    'Een cel zegt niet geverifieerd wanneer het feit niet kon worden gelezen in de officiële publieke documentatie van de andere optie op de dag van de controle. Het wordt nooit uit het geheugen ingevuld, en nooit gekopieerd uit een samenvatting die iemand anders schreef.',

  'web.comparison.method.title': 'Hoe deze pagina wordt gemaakt',
  'web.comparison.method.body':
    'Elke rij is één bewering, met het document waar hij vandaan komt en de datum waarop iemand het heeft gelezen. Er zijn geen screenshots van concurrenten, geen gekopieerde functiebeschrijvingen en geen verzonnen zwaktes.',
  'web.comparison.method.cadence':
    'Elke vergelijking wordt minstens elke 90 dagen opnieuw gecontroleerd, en meteen wanneer een platform of een optie iets verandert dat een rij vermeldt.',

  'web.comparison.questions.title': 'Vragen',
  'web.comparison.sources.title': 'Bronnen aangehaald op deze pagina',

  'web.comparison.index.title': 'Gepubliceerde vergelijkingen',
  'web.comparison.index.body':
    "Elke pagina vergelijkt dit product met een categorie alternatieven waarvan de feiten uit officiële documentatie kunnen worden gelezen. Een met naam genoemd product krijgt een pagina zodra de huidige feiten van zijn eigen publieke pagina's kunnen worden gelezen, en niet eerder.",
  'web.comparison.index.checked': 'Gecontroleerd op {date}',
} as const;
