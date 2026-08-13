export const webUseCaseMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadaten                                                              */
  /* ---------------------------------------------------------------------- */

  'web.meta.useCases.title': 'Anwendungsfälle',
  'web.meta.useCases.description':
    'Drei Arbeitsabläufe, für die dieses Produkt gebaut wird: mehrere Kunden an einem Ort verwalten, Arbeit genehmigen lassen, bevor sie rausgeht, und eine Idee auf mehrere Plattformen bringen, ohne sie neu zu schreiben.',
  'web.meta.useCase.clients.title': 'Mehrere Kunden verwalten',
  'web.meta.useCase.clients.description':
    'Getrennte Projekte, getrennte verbundene Konten, getrennte Genehmigungen und getrennte Berichte, für Teams, die im Namen anderer Menschen veröffentlichen.',
  'web.meta.useCase.approvals.title': 'Genehmigungsabläufe',
  'web.meta.useCase.approvals.description':
    'Wie ein Entwurf zu einem genehmigten Beitrag wird: wer ihn prüft, was eine Genehmigung ungültig macht, und warum dieselbe Regel auf jeder Oberfläche gilt.',
  'web.meta.useCase.crossPlatform.title': 'Plattformübergreifende Veröffentlichung',
  'web.meta.useCase.crossPlatform.description':
    'Ein Hauptentwurf, eine angepasste Version pro Plattform, geprüft gegen die erfassten Grenzwerte jeder Plattform, bevor irgendetwas geplant wird.',

  /* ---------------------------------------------------------------------- */
  /* Gemeinsame Elemente                                                    */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': 'Anwendungsfälle',
  'web.useCases.index.lede':
    'Drei Arbeitsabläufe, für die dieses Produkt gebaut wird. Jede Seite sagt, was dieser Ablauf ein Team heute kostet, wie das Produkt entwickelt ist, um damit umzugehen, und welche Teile tatsächlich schon gebaut sind.',
  'web.useCases.index.listLabel': 'Anwendungsfälle',

  'web.useCases.notice.title': 'Dies beschreibt ein Design, keinen laufenden Dienst',
  'web.useCases.notice.body':
    'Kein Connector ist in der Produktion verifiziert, auf dieser Seite wird also noch nirgendwo etwas veröffentlicht. Wo ein Teil des Ablaufs gebaut ist, steht das da. Wo nicht, steht das auch da.',

  'web.useCases.section.problem': 'Das Problem',
  'web.useCases.section.approach': 'Wie das Produkt entwickelt ist',
  'web.useCases.section.today': 'Was tatsächlich schon gebaut ist',
  'web.useCases.section.related': 'Verwandt',

  /* ---------------------------------------------------------------------- */
  /* Mehrere Kunden verwalten                                               */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': 'Mehrere Kunden verwalten',
  'web.useCases.clients.lede':
    'Die Arbeit für einen Kunden sollte nie einen falschen Klick von der Zielgruppe eines anderen Kunden entfernt sein.',
  'web.useCases.clients.problem':
    'Die meisten Teams trennen Kunden durch Sorgfalt. Ein gemeinsames Konto enthält jede verbundene Seite, ein Kalender enthält jeden Zeitplan, und das Einzige, was einen Kundenentwurf von der falschen Zielgruppe trennt, ist die Person, die um 18 Uhr auf den Bildschirm schaut. Wenn jemand das Team verlässt, verschwindet die Trennung mit der Gewohnheit.',
  'web.useCases.clients.approach1':
    'Ein Projekt ist die Einheit der Trennung. Verbundene Konten, Entwürfe, Warteschlangen, Medien und Belege gehören zu einem Projekt, und ein Mitglied sieht nur die Projekte, zu denen es hinzugefügt wurde.',
  'web.useCases.clients.approach2':
    'Die Trennung wird dreifach durchgesetzt: bei der Authentifizierung, im Anwendungsdienst, der die Aktion autorisiert, und in der Datenbank selbst durch Sicherheit auf Zeilenebene. Angemeldet zu sein wird nie als Erlaubnis behandelt.',
  'web.useCases.clients.approach3':
    'Die Berichterstattung folgt derselben Grenze, sodass ein Bericht pro Kunde die Standardform ist, statt eine Tabelle, die jemand von Hand zusammenstellt.',
  'web.useCases.clients.today':
    'Projekte, projektbeschränkte Mitgliedschaft und die dahinterliegenden Sicherheitsrichtlinien auf Zeilenebene sind gebaut und getestet, einschließlich Tests, die projektübergreifende Lesezugriffe versuchen und prüfen, dass sie scheitern. Pläne werden danach bemessen, wie viele Projekte ein Team braucht. Von keinem Projekt wird bisher auf irgendeiner Plattform etwas veröffentlicht.',

  /* ---------------------------------------------------------------------- */
  /* Genehmigungsabläufe                                                    */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': 'Genehmigungsabläufe',
  'web.useCases.approvals.lede':
    'Eine Genehmigung ist nur etwas wert, wenn das Genehmigte auch das ist, was rausgeht.',
  'web.useCases.approvals.problem':
    'Genehmigungen leben meist außerhalb des veröffentlichenden Tools. Ein Screenshot geht an einen Kunden, der Kunde antwortet ja, und dann ändert sich der Text. Die Genehmigung bezieht sich jetzt auf einen Entwurf, den niemand hat, und das Tool weiß das nicht, es veröffentlicht also, was ihm zuletzt gegeben wurde.',
  'web.useCases.approvals.approach1':
    'Eine Genehmigung ist genau an den Inhalt gebunden, der geprüft wurde. Einen genehmigten Entwurf zu bearbeiten macht die Genehmigung ungültig und sagt, welches Feld sich geändert hat, statt die alte Entscheidung stillschweigend weiterzutragen.',
  'web.useCases.approvals.approach2':
    'Ein Prüfer kann genehmigen, Änderungen anfordern oder ablehnen, und ein Kommentar ist für alles außer der Genehmigung erforderlich, sodass der Autor nie im Ungewissen bleibt, was zu korrigieren ist.',
  'web.useCases.approvals.approach3':
    'Die Regel lebt in der gemeinsamen Anwendungsschicht, sodass die Web-App, die REST-API, der MCP-Server, die CLI und Webhooks ihr alle gehorchen. Keine Oberfläche hat eine Abkürzung um die Prüfung herum.',
  'web.useCases.approvals.today':
    'Die Genehmigungsstatus, die Prüfungsoberfläche, die Wiederholungsgenehmigungsregeln und die dahinterliegenden Prüfprotokoll-Ereignisse sind gebaut. Nicht gebaut ist der letzte Schritt, weil kein Connector seine Fertigstellungsdefinition erfüllt hat, ein genehmigter Beitrag hat also noch nirgendwo hinzugehen.',

  /* ---------------------------------------------------------------------- */
  /* Plattformübergreifende Veröffentlichung                               */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': 'Plattformübergreifende Veröffentlichung',
  'web.useCases.crossPlatform.lede':
    'Eine Idee, eine Bearbeitung, und eine Version pro Plattform, die respektiert, was diese Plattform tatsächlich akzeptiert.',
  'web.useCases.crossPlatform.problem':
    'Denselben Text überall zu veröffentlichen ergibt eine Version, die auf einer Plattform abgeschnitten wird, auf einer anderen einen Pflichttitel vermissen lässt, und auf einer dritten stillschweigend einen Link entfernt bekommt. Die Alternative, fünfmal von Hand neu zu schreiben, ist, wo die Arbeit tatsächlich hingeht.',
  'web.useCases.crossPlatform.approach1':
    'Ein Hauptentwurf enthält die Idee. Jedes ausgewählte Konto bekommt seine eigene Version, und eine Bearbeitung am Hauptentwurf gilt nur, wo sie passt, und sagt klar, welche Ziele sie nicht übernehmen konnten und warum.',
  'web.useCases.crossPlatform.approach2':
    'Die Validierung läuft gegen die erfassten Grenzwerte jeder Plattform, gezählt so, wie diese Plattform zählt, sodass ein Zeichenhöchstwert in Graphemen geprüft wird, wo die Plattform Grapheme verwendet, und in gewichteten Einheiten, wo sie diese verwendet.',
  'web.useCases.crossPlatform.approach3':
    'Jeder Plattformgrenzwert, der irgendwo auf dieser Seite gezeigt wird, wird aus der Connector-Registry erzeugt und trägt das Dokument, aus dem er stammt, und das Datum, an dem eine Person es gelesen hat.',
  'web.useCases.crossPlatform.today':
    'Der Composer, die Versionen pro Ziel, die Validierungsregeln und der erzeugte Grenzwert-Datensatz sind gebaut. Der Veröffentlichungsschritt ist es nicht: Kein Connector ist in der Produktion verifiziert, ein geprüfter Entwurf kann also intern geplant werden und keine Plattform erreichen.',
} as const;
