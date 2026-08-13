export const webComparisonMessages = {
  'web.comparison.eyebrow': 'Vergleich',

  'web.comparison.state.yes': 'Ja',
  'web.comparison.state.no': 'Nein',
  'web.comparison.state.partial': 'Teilweise',
  'web.comparison.state.notVerified': 'Nicht verifiziert',

  'web.comparison.label.claim': 'Behauptung',
  'web.comparison.label.sourceRead': 'Gelesen am {date}',
  'web.comparison.label.checked': 'Jede Zeile geprüft am {date}',
  'web.comparison.label.nextReview': 'Nächste Prüfung fällig am {date}',
  'web.comparison.label.backToIndex': 'Alle Vergleiche',

  'web.comparison.table.title': 'Was jede Option tut',
  'web.comparison.table.caption': 'Eine Behauptung pro Zeile, mit der Quelle hinter jeder Antwort',

  'web.comparison.bestFor.title': 'Welche passt',
  'web.comparison.bestFor.ours': 'Wähle dieses Produkt, wenn',
  'web.comparison.bestFor.alternative': 'Wähle {name}, wenn',

  'web.comparison.notDo.title': 'Was dieses Produkt nicht tut',
  'web.comparison.notDo.body':
    'Diese Sätze werden aus dem Code gelesen, der über sie entscheidet, nicht von Hand geschrieben, damit dieser Abschnitt nicht davon abweichen kann, was das Produkt heute tatsächlich ist.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {Kein Connector hat die Anbieterverifizierung abgeschlossen, es wird also heute über dieses Produkt auf keiner Plattform veröffentlicht.} one {# Connector hat die Anbieterverifizierung abgeschlossen. Jede andere Plattform in der Kohorte ist noch Absicht.} other {# Connectoren haben die Anbieterverifizierung abgeschlossen. Jede andere Plattform in der Kohorte ist noch Absicht.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {Keine Sprache hat die menschliche Überprüfung abgeschlossen, jede Sprache in der Oberfläche ist also als Beta gekennzeichnet.} one {# Sprache hat die menschliche Überprüfung abgeschlossen. Jede andere Sprache ist als Beta gekennzeichnet.} other {# Sprachen haben die menschliche Überprüfung abgeschlossen. Jede andere Sprache ist als Beta gekennzeichnet.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Jede Preisstufe wurde festgelegt und hat einen echten Preis.} one {# Preisstufe ist noch ein unentschiedener Platzhalter und kann nicht gekauft werden.} other {# Preisstufen sind noch unentschiedene Platzhalter und können nicht gekauft werden.}}',

  'web.comparison.notVerified.title': 'Was "nicht verifiziert" bedeutet',
  'web.comparison.notVerified.body':
    'Eine Zelle sagt nicht verifiziert, wenn der Sachverhalt am Tag der Prüfung nicht in der offiziellen öffentlichen Dokumentation der anderen Option gelesen werden konnte. Sie wird nie aus dem Gedächtnis ausgefüllt und nie aus einer von jemand anderem geschriebenen Zusammenfassung übernommen.',

  'web.comparison.method.title': 'Wie diese Seite erstellt wird',
  'web.comparison.method.body':
    'Jede Zeile ist eine Behauptung, mit dem Dokument, aus dem sie stammt, und dem Datum, an dem eine Person es gelesen hat. Es gibt keine Konkurrenz-Screenshots, keinen kopierten Funktionstext und keine erfundenen Schwächen.',
  'web.comparison.method.cadence':
    'Jeder Vergleich wird mindestens alle 90 Tage erneut geprüft, und sofort, wenn eine Plattform oder Option etwas ändert, das eine Zeile behauptet.',

  'web.comparison.questions.title': 'Fragen',
  'web.comparison.sources.title': 'Auf dieser Seite zitierte Quellen',

  'web.comparison.index.title': 'Veröffentlichte Vergleiche',
  'web.comparison.index.body':
    'Jede Seite vergleicht dieses Produkt mit einer Kategorie von Alternativen, deren Fakten aus offizieller Dokumentation gelesen werden können. Ein benanntes Produkt bekommt eine Seite, wenn seine aktuellen Fakten aus seinen eigenen öffentlichen Seiten gelesen werden können, und nicht früher.',
  'web.comparison.index.checked': 'Geprüft am {date}',
} as const;
