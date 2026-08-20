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
  'web.comparison.eyebrow': 'Jämförelse',

  'web.comparison.state.yes': 'Ja',
  'web.comparison.state.no': 'Nej',
  'web.comparison.state.partial': 'Delvis',
  'web.comparison.state.notVerified': 'Inte verifierat',

  'web.comparison.label.claim': 'Påstående',
  'web.comparison.label.sourceRead': 'Läst {date}',
  'web.comparison.label.checked': 'Varje rad kontrollerad {date}',
  'web.comparison.label.nextReview': 'Nästa kontroll planerad till {date}',
  'web.comparison.label.backToIndex': 'Alla jämförelser',

  'web.comparison.table.title': 'Vad varje alternativ gör',
  'web.comparison.table.caption': 'Ett påstående per rad, med källan bakom varje svar',

  'web.comparison.bestFor.title': 'Vilket som passar',
  'web.comparison.bestFor.ours': 'Välj denna produkt när',
  'web.comparison.bestFor.alternative': 'Välj {name} när',

  'web.comparison.notDo.title': 'Vad denna produkt inte gör',
  'web.comparison.notDo.body':
    'Dessa meningar läses från koden som avgör dem, skrivs inte för hand, så det här avsnittet kan inte glida bort från vad produkten faktiskt är idag.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {Ingen anslutning har slutfört leverantörsverifiering, så inget publiceras till någon plattform genom denna produkt idag.} one {# anslutning har slutfört leverantörsverifiering. Varje annan plattform i lanseringsgruppen är fortfarande en avsikt.} other {# anslutningar har slutfört leverantörsverifiering. Varje annan plattform i lanseringsgruppen är fortfarande en avsikt.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {Inget språk har slutfört mänsklig granskning, så alla språk i gränssnittet är märkta som beta.} one {# språk har slutfört mänsklig granskning. Varje annat språk är märkt som beta.} other {# språk har slutfört mänsklig granskning. Varje annat språk är märkt som beta.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Varje prisnivå har beslutats och har ett riktigt pris.} one {# prisnivå är fortfarande en obestämd platshållare och kan inte köpas.} other {# prisnivåer är fortfarande obestämda platshållare och kan inte köpas.}}',

  'web.comparison.notVerified.title': 'Vad inte verifierat betyder',
  'web.comparison.notVerified.body':
    'En cell säger inte verifierat när faktan inte kunde läsas i det andra alternativets officiella publika dokumentation den dag kontrollen gjordes. Den fylls aldrig i från minnet, och kopieras aldrig från en sammanfattning som någon annan skrev.',

  'web.comparison.method.title': 'Hur denna sida görs',
  'web.comparison.method.body':
    'Varje rad är ett påstående, med dokumentet det kommer från och datumet en person läste det. Det finns inga skärmdumpar av konkurrenter, ingen kopierad funktionsformulering och inga påhittade svagheter.',
  'web.comparison.method.cadence':
    'Varje jämförelse kontrolleras igen minst en gång var 90:e dag, och omedelbart när en plattform eller ett alternativ ändrar något som en rad anger.',

  'web.comparison.questions.title': 'Frågor',
  'web.comparison.sources.title': 'Källor citerade på denna sida',

  'web.comparison.index.title': 'Publicerade jämförelser',
  'web.comparison.index.body':
    'Varje sida jämför denna produkt med en kategori alternativ vars fakta kan läsas från officiell dokumentation. En namngiven produkt får en sida när dess aktuella fakta kan läsas från dess egna publika sidor, och inte tidigare.',
  'web.comparison.index.checked': 'Kontrollerad {date}',
} as const;
