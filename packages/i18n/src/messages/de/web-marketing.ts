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

  'web.brand.name': 'Relais',
  'web.brand.tagline':
    'Die mehrsprachige Veröffentlichungssteuerungsebene für Personen und Agenten.',
  'web.skipToContent': 'Springe zum Hauptinhalt',
  'web.nav.label': 'Site-Navigation',
  'web.nav.openMenu': 'Menü',
  'web.nav.closeMenu': 'Schließen Sie das Menü',
  'web.nav.footerLabel': 'Fußzeilennavigation',

  'web.cta.startTrial': 'Starten Sie die 7-Tage-Testversion',
  'web.cta.seePricing': 'Sehen Sie sich den Preis an',
  'web.cta.seeCapabilities': 'Lesen Sie die Fähigkeitsmatrix',
  'web.cta.readDocs': 'Lesen Sie die Dokumentation',
  'web.cta.trialFootnote':
    'Polar collects a payment method, charges $0 today, and shows the exact first charge date before you confirm.',

  'web.label.lastReviewed': 'Zuletzt bewertet {date}',
  'web.label.nextReview': 'Nächste Bewertung {date}',
  'web.label.researchDate': 'Recherchiert {date}',
  'web.label.officialSource': 'Offizielle Quelle',
  'web.label.onThisPage': 'Auf dieser Seite',
  'web.label.provider': 'Plattform',
  'web.label.capability': 'Fähigkeit',

  'web.notFound.title': 'Unter dieser Adresse gibt es keine Seite',
  'web.notFound.body':
    'Der Link ist möglicherweise veraltet oder wir haben die Seite eingestellt. Seiten, die nicht mehr korrekt sind, werden nicht mehr aktiv, sondern gelöscht. Wenn das passiert, wird dies im Änderungsprotokoll aufgezeichnet.',
  'web.notFound.action': 'Gehen Sie zur Startseite',

  'web.correction.title': 'Auf dieser Seite ist etwas nicht in Ordnung',
  'web.correction.body':
    'Plattformregeln ändern sich und wir machen Dinge falsch. Senden Sie uns die URL und den Fehler und wir werden die Seite korrigieren oder aus dem Verkehr ziehen.',
  'web.correction.email': 'Korrekturen@relay.example',

  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.home.title': 'Relay, die Steuerungsebene für mehrsprachige Veröffentlichungen',
  'web.meta.home.description':
    'Verwandeln Sie eine eingegangene Idee in plattformnativen Inhalt, genehmigen Sie sie einmal, veröffentlichen Sie sie zuverlässig über offizielle Plattform-APIs und erfahren Sie, was Sie als Nächstes verbessern können.',
  'web.meta.product.title': 'So funktioniert Relay',
  'web.meta.product.description':
    'Ein Rundgang durch die Veröffentlichungsabteilung: Einmal verfassen, pro Plattform anpassen, anhand der tatsächlichen Grenzen validieren, genehmigen, planen, veröffentlichen und die Quittung aufbewahren.',
  'web.meta.integrations.title': 'Platforms Relay veröffentlicht an',
  'web.meta.integrations.description':
    'Mit welchen Plattformen sich Relay verbindet, was jede Verbindung heute kann und was die Plattform selbst nicht zulässt.',
  'web.meta.capabilities.title': 'Connector-Fähigkeitsmatrix',
  'web.meta.capabilities.description':
    'Eine Tabelle pro Plattform und pro Fähigkeit, die aus unseren Connector-Definitionen generiert wird und trennt, was wir erstellt haben, von dem, was die Plattform nicht bietet.',
  'web.meta.creators.title': 'Staffel für Kreative',
  'web.meta.creators.description':
    'Für Solokünstler, die dieselbe Idee in mehreren Formaten und Sprachen veröffentlichen, ohne sie fünfmal neu zu schreiben.',
  'web.meta.agencies.title': 'Relais für Agenturen',
  'web.meta.agencies.description':
    'Kundentrennung, Genehmigungen, gemeinsam nutzbare Bewertungslinks, Belege und Berichte für Teams, die im Namen anderer Personen veröffentlichen.',
  'web.meta.developers.title': 'Relais für Entwickler',
  'web.meta.developers.description':
    'Ein Backend hinter der Web-App, die REST-API, ein Remote-MCP-Server, die CLI und signierte Webhooks. Gleiche Genehmigungsregeln auf jeder Oberfläche.',
  'web.meta.pricing.title': 'Pricing',
  'web.meta.pricing.description':
    'One plan. $29 a month, or $300 a year which is $25 a month billed annually. 30 active channels, unlimited team members, no feature tiers.',
  'web.meta.resources.title': 'Ressourcen',
  'web.meta.resources.description':
    'Status, Changelog, Dokumentation, Methodik, Vergleiche, der Tool-Radar und der Opportunity-Katalog.',
  'web.meta.status.title': 'Status',
  'web.meta.status.description':
    'Aktueller Status jeder Relaisoberfläche und jedes Anschlusses sowie der Vorfallverlauf.',
  'web.meta.changelog.title': 'Änderungsprotokoll',
  'web.meta.changelog.description':
    'Was wurde geliefert, was hat sich an den Anschlüssen geändert und was wurde korrigiert.',
  'web.meta.docs.title': 'Dokumentation',
  'web.meta.docs.description':
    'REST-API, MCP-Server, CLI und Webhook-Dokumentation für den Aufbau auf Relay.',
  'web.meta.methodology.title': 'Methodik',
  'web.meta.methodology.description':
    'Wie wir Plattformansprüche recherchieren, wie wir sie datieren, wie wir andere Produkte vergleichen und wie wir Fehler korrigieren.',
  'web.meta.compare.title': 'Vergleiche',
  'web.meta.compare.description':
    'Ehrliche, veraltete Vergleiche mit anderen Veröffentlichungstools, einschließlich der Frage, für wen jedes einzelne am besten geeignet ist.',
  'web.meta.toolRadar.title': 'Kreatives Werkzeugradar',
  'web.meta.toolRadar.description':
    'Ein veralteter, redaktionell überprüfter Katalog spezieller kreativer Tools mit Einschränkungen, Vorbehalten bei Rechten und kommerzieller Offenlegung.',
  'web.meta.opportunities.title': 'Aufstiegsmöglichkeiten',
  'web.meta.opportunities.description':
    'Ein kuratierter Katalog von Orten, an denen ein Produkt gelistet, vorgestellt oder besprochen werden kann, mit eigenen Einreichungsregeln für jeden Zielort.',
  'web.meta.legal.title': 'Recht und Richtlinien',
  'web.meta.legal.description':
    'Bedingungen, Datenschutz, akzeptable Nutzung, KI-Nutzung, Cookies, Unterauftragsverarbeiter, Rückerstattungen, Urheberrecht, Sicherheit, Zugänglichkeit, Entwicklerbedingungen und Affiliate-Bedingungen.',

  /* ---------------------------------------------------------------------- */
  /* Home                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.home.promise':
    'Verwandeln Sie eine eingegangene Idee in plattformnativen Inhalt, genehmigen Sie sie einmal, veröffentlichen Sie sie zuverlässig und erfahren Sie, was Sie als Nächstes verbessern können.',
  'web.home.lede':
    'Relay ist ein Verlagsbüro für Leute, die für das, was herauskommt, verantwortlich sind. Sie schreiben einmal, passen sich pro Plattform an, sehen die tatsächlichen Grenzen, bevor Sie planen, holen die erforderliche Genehmigung ein, veröffentlichen über offizielle Plattform-APIs und führen für jeden Beitrag eine Quittung.',
  'web.home.summaryLine':
    'One plan at $29 a month or $300 a year. 30 active social channels, unlimited team members, no feature tiers. The seven day trial collects a payment method and charges $0 at checkout.',

  'web.home.example.title': 'Eine Idee, fünf plattformnative Versionen',
  'web.home.example.body':
    'Der Komponist beginnt mit einer Masterversion. Wenn Sie ein Konto auswählen, wird nur für dieses Konto eine Überschreibung mit eigenen Live-Limits und einer eigenen Vorschau geöffnet. Nichts, was Sie für LinkedIn schreiben, ändert das, was X erhält.',
  'web.home.example.column.account': 'Konto',
  'web.home.example.column.variant': 'Was dieses Konto erhält',
  'web.home.example.column.check': 'Wird vor der Terminplanung überprüft',
  'web.home.example.caption':
    'Eine illustrative Komposition. Die angezeigten Grenzwerte und Einstellungen stammen aus der Connector-Definition für jede Plattform und nicht aus einer Schätzung.',
  'web.home.example.x.account': 'X, @northbound',
  'web.home.example.x.variant': 'Haupttext, gekürzt, plus ein Thread mit zwei Beiträgen',
  'web.home.example.x.check':
    'Zeichenanzahl, Thread-Reihenfolge, geschätzte API-Kosten für einen Linkbeitrag',
  'web.home.example.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.home.example.linkedin.variant': 'Längerer Mastertext mit angehängtem Dokument',
  'web.home.example.linkedin.check': 'Organisationsrolle, Beitragslänge, Dokumenttyp',
  'web.home.example.instagram.account': 'Instagram, @northbound.tools',
  'web.home.example.instagram.variant':
    'Quadratischer Ausschnitt desselben Bildes, Beschriftung für den Feed neu geschrieben',
  'web.home.example.instagram.check':
    'Professioneller Kontotyp, Seitenverhältnis, Alternativtext vorhanden',
  'web.home.example.youtube.account': 'YouTube, Richtung Norden',
  'web.home.example.youtube.variant':
    'Derselbe Clip wie ein Kurzfilm, mit eigenem Titel und eigener Beschreibung',
  'web.home.example.youtube.check':
    'Upload-Bereich, Prüfstatus, Datenschutz, in dem der Upload landet',
  'web.home.example.bluesky.account': 'Bluesky, Richtung Norden.Beispiel',
  'web.home.example.bluesky.variant': 'Mastertext mit der Linkkarte',
  'web.home.example.bluesky.check':
    'Anzahl der Zeichen, Auflösung der Linkkarte, Alternativtext vorhanden',

  'web.home.pillars.title': 'Worin Relay besonders gut kann',
  'web.home.pillars.confidence.title': 'Veröffentlichen Sie mit Zuversicht',
  'web.home.pillars.confidence.body':
    'Eine echte Vorschau pro Konto, deterministische Richtlinien- und Plattformprüfungen, bevor etwas in die Warteschlange gestellt wird, die für Ihren Arbeitsbereich erforderliche Genehmigung, eine unveränderliche Quittung mit der externen Beitrags-ID und ein Integritätsstatus für jede Verbindung.',
  'web.home.pillars.confidence.proof':
    'Jeder externe Schreibvorgang trägt einen Idempotenzschlüssel, sodass ein Worker-Absturz, nachdem die Plattform einen Beitrag angenommen hat, keinen zweiten erstellt.',
  'web.home.pillars.adapt.title': 'Anpassen statt duplizieren',
  'web.home.pillars.adapt.body':
    'Plattformspezifische Varianten, mit denen Sie jeweils ein Konto überschreiben können, und Transkreation statt wörtlicher Übersetzung, mit einem Markenglossar und einem benannten Prüfer pro Sprache.',
  'web.home.pillars.adapt.proof':
    'Die Benutzeroberfläche ist in ausgewählten Sprachen verfügbar. Die Inhaltsanpassung umfasst 30 Inhaltssprachen und jede einzelne davon kann vor der Veröffentlichung überprüft werden.',
  'web.home.pillars.loop.title': 'Schließen Sie den Kreislauf',
  'web.home.pillars.loop.body':
    'Analysen, die die Metrik, die Plattform, die sie gemeldet hat, den Nenner und den Zeitpunkt der letzten Aktualisierung benennen. Wenn eine Plattform etwas nicht meldet, sagt Relay dies, anstatt eine Null anzuzeigen.',
  'web.home.pillars.loop.proof':
    'Ein Beitrag wird mit Ihrem eigenen Median verglichen und nicht mit einer Punktzahl, die niemand prüfen kann.',
  'web.home.pillars.anywhere.title': 'Arbeiten Sie dort, wo Sie bereits sind',
  'web.home.pillars.anywhere.body':
    'Die Web-App, eine REST-API, ein Remote-MCP-Server, eine CLI und signierte Webhooks rufen dieselben Anwendungsdienste, dieselben Autorisierungsregeln und dieselben Validatoren auf.',
  'web.home.pillars.anywhere.proof':
    'Ein Agent kann eine Genehmigungsrichtlinie nicht umgehen, indem er eine andere Oberfläche verwendet, da die Richtlinie im Dienst und nicht in der Schnittstelle durchgesetzt wird.',
  'web.home.pillars.economics.title': 'Economics you can predict',
  'web.home.pillars.economics.body':
    'One price, every shipped feature, 30 active channels and unlimited team members. Platform usage that a provider charges per operation is passed through at cost and shown before you confirm the action.',
  'web.home.pillars.economics.proof':
    'There is no image or video generation credit system, because Relay does not generate media.',

  'web.home.honest.title': 'Was Relay nicht kann',
  'web.home.honest.lede':
    'Dabei handelt es sich um Grenzen, nicht um eine Roadmap. Wenn sich einer von ihnen ändert, ändert sich dies zuerst im Änderungsprotokoll.',
  'web.home.honest.noMedia':
    'Keine KI-Bildgenerierung und keine KI-Videogenerierung. Relay passt die von Ihnen mitgebrachten Medien an, genehmigt, veröffentlicht und bewertet sie.',
  'web.home.honest.noAutomationOfEngagement':
    'Keine automatischen Likes, Follows, Reposts, unaufgeforderten Antworten oder Direktnachrichten. Keine Verlobungskapseln und keine erfundene Verlobung.',
  'web.home.honest.noUnofficial':
    'Keine Browserautomatisierung, keine Cookie-Wiedergabe, kein Scraping und keine inoffiziellen Posting-Endpunkte. Nur offizielle Plattform-APIs.',
  'web.home.honest.noPromises':
    'Kein Versprechen bezüglich Reichweite, Ranking oder Engagement. Relay kann Ihnen sagen, was passiert ist und was Sie als Nächstes testen müssen. Es kann Ihnen nicht sagen, was ein Publikum tun wird.',
  'web.home.honest.noUnattendedPublishing':
    'Standardmäßig keine unbeaufsichtigte Veröffentlichung. Ein Agent kann Entwürfe entwerfen, validieren und eine Genehmigung anfordern. Ein Mensch entscheidet, bevor etwas öffentlich wird, es sei denn, Sie entscheiden sich bewusst gegen eine bestimmte Richtlinie.',

  'web.home.surfaces.title': 'Fünf Oberflächen, ein Backend',
  'web.home.surfaces.body':
    'Dieselben Anwendungsfälle, dieselben Mandantenprüfungen, dieselben Validatoren und dieselben Veröffentlichungsworkflows. Eine Oberfläche ist ein Weg hinein, niemals eine Abkürzung hinter einer Regel.',
  'web.home.surfaces.web': 'Web-App',
  'web.home.surfaces.webBody':
    'Komponist, Kalender, Genehmigungen, Analysen, Verbindungen und Einstellungen.',
  'web.home.surfaces.api': 'REST-API',
  'web.home.surfaces.apiBody':
    'Schlüssel mit Gültigkeitsbereich, Idempotenzschlüssel bei jedem Schreibvorgang, Cursor-Paginierung, Tippfehler.',
  'web.home.surfaces.mcp': 'Remote-MCP-Server',
  'web.home.surfaces.mcpBody':
    'Streambares HTTP, OAuth, pro Tool-Bereiche und eine Vorschau vor jedem Folgeaufruf.',
  'web.home.surfaces.cli': 'CLI',
  'web.home.surfaces.cliBody':
    'Stabile maschinenlesbare Ausgabe für Skripte und kontinuierliche Integration.',
  'web.home.surfaces.webhooks': 'Signierte Webhooks',
  'web.home.surfaces.webhooksBody':
    'Veröffentlichen Sie Ergebnisse, Genehmigungsentscheidungen und den Verbindungszustand mit erneuter Übermittlung.',

  'web.home.closing.title': 'Beginnen Sie mit einem Konto und einem Beitrag',
  'web.home.closing.body':
    'Verknüpfen Sie ein Konto, verfassen Sie einen Beitrag, beobachten Sie den Validierungslauf, planen Sie ihn und lesen Sie die Quittung. Das ist das ganze Produkt in etwa zehn Minuten.',

  /* ---------------------------------------------------------------------- */
  /* Product                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.product.title': 'Der Verlagstisch',
  'web.product.lede':
    'Sieben Fragen müssen bei jedem Schritt beantwortet werden können, ohne dass Sie etwas anklicken müssen: Was wird gepostet, wo, welche Version jedes Konto erhält, wann und in welcher Zeitzone, wer es genehmigt hat, was es kosten darf und was passiert ist.',

  'web.product.step.source.title': 'Quelle',
  'web.product.step.source.body':
    'Beginnen Sie mit einem Briefing, einer Datei, die Sie bereits haben, einem RSS-Element oder einer Anfrage eines Agenten. Importierte Medien behalten die Herkunft, die Sie ihnen gegeben haben, einschließlich der Herkunft und des Inhabers der Rechte.',
  'web.product.step.compose.title': 'Einmal verfassen, dann überschreiben',
  'web.product.step.compose.body':
    'Eine Master-Version steuert jedes Ziel. Wenn Sie ein Konto auswählen, wird nur für dieses Konto eine Überschreibung geöffnet: ein eigener Text, ein eigener Medienausschnitt, eigene Einstellungen, ein eigener Live-Limit-Zähler und eine eigene Vorschau. Das Zurücksetzen einer Überschreibung stellt den Master in einer Aktion wieder her und zeigt Ihnen zunächst den Unterschied.',
  'web.product.step.validate.title':
    'Überprüfen Sie, bevor etwas in die Warteschlange gestellt wird',
  'web.product.step.validate.body':
    'Die Validierung ist deterministisch und wird auf dem Server ausgeführt. Es überprüft die Plattformgrenzen anhand des versionierten Funktions-Snapshots, des Kontotyps, des Alternativtexts, der Medienrechte, der Duplikat- und Kadenzregeln, der Erwähnung und der Zielauflösung sowie der geschätzten Kosten für die Plattformnutzung. Jedes Problem nennt das Ziel, zu dem es gehört, und wie es behoben werden kann.',
  'web.product.step.approve.title': 'Einmal genehmigen',
  'web.product.step.approve.body':
    'Genehmigung ist eine Arbeitsplatzrichtlinie, keine Gewohnheit. Ein Prüfer sieht jedes Ziel, jede Variante, die Zeitzone, den Datenschutzstatus und die geschätzten Kosten auf einem Bildschirm und es funktioniert auf einem Telefon. Inhalte, die nach der Genehmigung geändert wurden, erfordern eine erneute Genehmigung.',
  'web.product.step.schedule.title': 'Planen Sie in einer Echtzeitzone',
  'web.product.step.schedule.body':
    'Jeder geplante Beitrag speichert einen Augenblick und eine IANA-Zeitzone, niemals eine naive Ortszeit. Sommerzeitumstellungen werden angezeigt, bevor Sie sie bestätigen, und werden danach nicht entdeckt.',
  'web.product.step.publish.title': 'Veröffentlichen Sie die Quittung und bewahren Sie sie auf',
  'web.product.step.publish.body':
    'Jedes Ziel wird mit einem Idempotenzschlüssel versandt. Ein Ziel, das fehlschlägt, setzt ein erfolgreiches Ziel nicht zurück, und dieser Zustand hat einen eigenen Namen: teilweise veröffentlicht. Für jedes Ergebnis wird eine unveränderliche Quittung mit der externen Beitrags-ID, der Anforderungskennung, dem Versuchsverlauf und dem genauen Fehler (falls vorhanden) erstellt.',
  'web.product.step.learn.title': 'Lernen',
  'web.product.step.learn.body':
    'Metriken werden normalisiert, benannt, der Plattform zugeordnet, die sie gemeldet hat, und mit einem Aktualitätszeitpunkt versehen. Eine Metrik, die eine Plattform nicht meldet, wird mit dem Grund als nicht verfügbar markiert. Es wird niemals als Null gerendert.',

  'web.product.shot.caption':
    'Die Screenshots auf dieser Seite stammen vom laufenden Produkt. Bis eine Oberfläche vollständig genug ist, um ehrlich fotografiert zu werden, beschreiben wir sie in Worten, anstatt ein Bild davon zu zeichnen.',
  'web.product.shot.pending': 'Screenshot wartet auf Aufnahme',
  'web.product.shot.pendingReason':
    'Diese Oberfläche wird noch gebaut. Wir werden eine echte Aufnahme und keine Illustration veröffentlichen.',

  'web.product.states.title': 'Die Staaten, die niemand gerne entwirft',
  'web.product.states.body':
    'Ein Publishing-Tool wird am schlechten Tag beurteilt, nicht am guten. Jedes davon hat einen gestalteten Bildschirm, einen einfachen Satz und eine nächste Aktion.',
  'web.product.states.partial':
    'Teilweise veröffentlicht: Welche Ziele sind aktiv, welche sind fehlgeschlagen und warum.',
  'web.product.states.revoked':
    'Ein widerrufenes Token, das zum Versandzeitpunkt gefunden wurde, mit dem Wiederherstellungspfad.',
  'web.product.states.rateLimited':
    'Ein Plattform-Ratenlimit, mit Angabe des Zeitpunkts des Zurücksetzens und der dahinter stehenden Warteschlangen.',
  'web.product.states.duplicate':
    'Ein Duplikat oder Kadenzblock mit der ausgelösten Regel und dem Einspruchspfad.',
  'web.product.states.offline':
    'Offline beim Verfassen: Nichts, was Sie geschrieben haben, geht verloren.',
  'web.product.states.permission':
    'Eine Aktion, die Ihre Rolle nicht zulässt, benennen Sie die Rolle, die dies zulässt.',

  /* ---------------------------------------------------------------------- */
  /* Integrations and capability matrix                                      */
  /* ---------------------------------------------------------------------- */

  'web.integrations.title': 'Plattformen',
  'web.integrations.lede':
    'Relay verbindet sich über offizielle Plattform-APIs. Jeder Connector hat einen benannten Besitzer, eine aufgezeichnete Richtlinien-URL und ein Überprüfungsdatum. Ein Connector wird erst dann als unterstützt aufgeführt, wenn er die Connector-Definition als „Fertig“ erfüllt.',
  'web.integrations.reviewNotice.title':
    'Kein Connector wird als offiziell bezeichnet, bevor die Plattform ihn genehmigt',
  'web.integrations.reviewNotice.body':
    'Mehrere Plattformen erfordern eine App-Überprüfung, bevor eine Anwendung im Namen eines Kunden veröffentlicht werden darf. Wo diese Prüfung aussteht, sagt der Konnektor dies und beschreibt genau, welche Einschränkungen bis zur bestandenen Prüfung gelten.',
  'web.integrations.accountTypes': 'Kontotypen, auf denen dieser Connector veröffentlichen kann',
  'web.integrations.restriction':
    'Einschränkung, die Sie kennen sollten, bevor Sie eine Verbindung herstellen',
  'web.integrations.cost': 'Kosten für die Plattformnutzung',
  'web.integrations.viewMatrix': 'Sehen Sie sich alle Funktionen dieser Plattform an',

  'web.capabilities.title': 'Connector-Fähigkeitsmatrix',
  'web.capabilities.lede':
    'Wird aus denselben Connector-Definitionen generiert, die das Produkt liest, und dann vor der Veröffentlichung von einer Person überprüft. Marketing kann nichts versprechen, was ein Adapter nicht kann.',
  'web.capabilities.legend.title': 'So lesen Sie diese Tabelle',
  'web.capabilities.legend.body':
    'Vier Staaten, und der Unterschied zwischen den beiden mittleren ist wichtig. Noch nicht gebaut ist unser Rückstand. Eine Tatsache, die die Plattform nicht bietet, ist eine Tatsache, die kein Tool umgehen kann.',
  'web.capabilities.tableCaption':
    'Funktionen nach Plattform. Jede Zelle benennt ihren Zustand sowohl in Worten als auch in Farben.',
  'web.capabilities.snapshot': 'Connector-Definitionen Version {version}, überprüft {date}',
  'web.capabilities.sourceNote':
    'Jeder Plattformanspruch in dieser Tabelle verweist auf die offizielle Dokumentation, aus der er stammt, und auf das Datum, an dem wir ihn zuletzt gelesen haben.',

  /* ---------------------------------------------------------------------- */
  /* Audience pages                                                          */
  /* ---------------------------------------------------------------------- */

  'web.creators.title': 'Für Schöpfer',
  'web.creators.lede':
    'Sie veröffentlichen dieselbe Idee in mehreren Formaten, manchmal in mehr als einer Sprache, und Sie sind das gesamte Team. Die Arbeit, die Relay abnimmt, ist das erneute Tippen, das erneute Zuschneiden und das Überprüfen.',
  'web.creators.job.adapt.title': 'Einmal schreiben, fünf native Versionen versenden',
  'web.creators.job.adapt.body':
    'Die Masterversion trägt die Idee. Jedes Konto erhält die Länge, den Zuschnitt, die Einstellungen und den Ton, die die Plattform erwartet, und Sie können sie alle nebeneinander sehen, bevor Sie sich verpflichten.',
  'web.creators.job.languages.title': 'Veröffentlichen Sie in einer anderen Sprache, ohne zu raten',
  'web.creators.job.languages.body':
    'Die Transkreation behält die Absicht und nicht die Worte bei, verwendet Ihr Markenglossar und markiert, ob ein nativer Rezensent es gelesen hat. Nichts wird in einer Sprache veröffentlicht, für die Sie nicht bürgen können, es sei denn, Sie sagen es.',
  'web.creators.job.rights.title': 'Bewahren Sie Ihr Rechteverzeichnis mit der Akte auf',
  'web.creators.job.rights.body':
    'In den Medien ist angegeben, woher sie stammen, wer die Rechte besitzt und ob sie mit einem generativen Werkzeug erstellt wurden. Plattformen fragen zunehmend nach. Relay speichert Ihre Antwort mit dem Asset, anstatt Sie erneut zu fragen.',
  'web.creators.job.cost.title': 'Informieren Sie sich über die Kosten, bevor Sie posten',
  'web.creators.job.cost.body':
    'X berechnet pro Vorgang und berechnet mehr für einen Beitrag, der eine URL enthält. Relay geht davon aus, dass es sich bei einer verlinkten Woche eher um eine Entscheidung als um eine Rechnungsüberraschung handelt, bevor Sie die Bestätigung erhalten.',
  'web.creators.notFor.title': 'Was das nicht ist',
  'web.creators.notFor.body':
    'Relay generiert keine Bilder oder Videos, führt keine Interaktionsautomatisierung durch und sagt nicht voraus, wie ein Beitrag funktionieren wird. Wenn dies die Werkzeuge sind, die Sie benötigen, können andere Produkte dies tun, und wir möchten, dass Sie es jetzt wissen.',

  'web.agencies.title': 'Für Agenturen',
  'web.agencies.lede':
    'Sie veröffentlichen im Namen anderer Personen, was Namensnennung, Genehmigung und Beweise zu einem Teil der Arbeit und nicht zu einer netten Angelegenheit macht.',
  'web.agencies.job.separation.title': 'Kundentrennung, die Bestand hat',
  'web.agencies.job.separation.body':
    'Jeder Arbeitsbereich ist sowohl auf Datenbankebene als auch in der Anwendung isoliert. Eine Abfrage, die eine Arbeitsbereichsgrenze überschreitet, schlägt in Postgres fehl, und zwar nicht nur in einem Codepfad, den jemand vergessen könnte.',
  'web.agencies.job.approval.title': 'Genehmigungen, die ein Kunde tatsächlich verwenden kann',
  'web.agencies.job.approval.body':
    'Ein Prüfer sieht jedes Ziel, jede Variante, den Zeitplan mit seiner Zeitzone und die geschätzten Kosten auf einem einzigen Bildschirm, und der Bildschirm funktioniert auf einem Telefon. Genehmigungsentscheidungen werden protokolliert, wer, wann und was sie gesehen haben.',
  'web.agencies.job.receipts.title': 'Beweise für das unangenehme Gespräch',
  'web.agencies.job.receipts.body':
    'Für jede Veröffentlichung wird eine unveränderliche Quittung mit der externen Beitrags-ID und dem vollständigen Versuchsverlauf erstellt. Wenn ein Kunde fragt, ob um neun etwas ausgefallen ist, sind an die Antwort ein Zeitstempel und eine Plattformkennung angehängt.',
  'web.agencies.job.roles.title': 'Rollen, die zur Arbeitsaufteilung passen',
  'web.agencies.job.roles.body':
    'Eigentümer, Administrator, Manager, Redakteur, Genehmiger, Analyst und Betrachter, je Marke und Konto. Unbegrenzte Teammitglieder, da die Abrechnung pro Sitzplatz dazu führt, dass Agenturen Logins teilen, und das ein Sicherheitsproblem darstellt.',
  'web.agencies.limits.title': 'Die Grenze, klar ausgedrückt',
  'web.agencies.limits.body':
    'Ein Plan deckt 30 aktive soziale Kanäle ab. Ein Kanal ist ein soziales Konto, eine Seite, ein Profil, eine Gruppe oder eine Publikationsverbindung. Wenn Sie mehr als 30 benötigen, sagen Sie uns, was Sie brauchen, und wir geben Ihnen eine klare Antwort und keine versteckte Ebene.',

  'web.developers.title': 'Für Entwickler',
  'web.developers.lede':
    'Die Veröffentlichung ist der Teil eines Arbeitsablaufs, bei dem ein Fehler öffentlich und dauerhaft ist. Relay bietet Ihnen ein Backend, Tippfehler, Idempotenz bei jedem Schreibvorgang und ein Genehmigungsmodell, das ein Agent nicht umgehen kann.',
  'web.developers.surface.api.title': 'REST-API',
  'web.developers.surface.api.body':
    'API-Schlüssel mit Gültigkeitsbereich, ein bei jedem Schreibvorgang erforderlicher Idempotenzschlüssel, Cursor-Paginierung und ein typisierter Fehlerumschlag mit stabilem Code, einem Nachrichtenschlüssel und bereinigten Details. Keine Anbieternutzlast wird jemals roh an Sie zurückgespiegelt.',
  'web.developers.surface.mcp.title': 'Remote-MCP-Server',
  'web.developers.surface.mcp.body':
    'Streambares HTTP mit OAuth. Die Tools sind granular und jedes einzelne erklärt seine Nebenwirkungen. Lesen, Entwerfen, Genehmigung anfordern, Terminplanung und Veröffentlichung sind separate Bereiche, sodass ein Modell, das Entwürfe erstellen kann, nicht veröffentlicht werden kann.',
  'web.developers.surface.cli.title': 'CLI',
  'web.developers.surface.cli.body':
    'Jeder Befehl unterstützt eine maschinenlesbare Ausgabe mit einer stabilen Form, sodass ein Skript sie analysieren kann und ein kontinuierlicher Integrationsjob darauf fehlschlagen kann.',
  'web.developers.surface.webhooks.title': 'Signierte Webhooks',
  'web.developers.surface.webhooks.body':
    'Veröffentlichen Sie Ergebnisse, Genehmigungsentscheidungen, Verbindungszustand und Validierungsergebnisse, signiert, wiedergabesicher und wiederzustellbar über das Dashboard.',
  'web.developers.safety.title': 'Das Agentensicherheitsmodell',
  'web.developers.safety.body':
    'Bei den Anmeldeinformationen eines Agenten handelt es sich um ein bereichsbezogenes Dienstkonto und nicht um eine Kopie einer Personensitzung. Es unterliegt Beschränkungen pro Marke, pro Konto, pro Gebietsschema, pro Domäne, pro Kadenz und pro Vorausschau, und der Server autorisiert jeden Anruf erneut, anstatt dem Agent-Host zu vertrauen.',
  'web.developers.safety.injection':
    'Webseiten, Feeds, Kommentare und Plattformantworten werden als nicht vertrauenswürdige Daten behandelt. Die Modellausgabe wird deterministisch erneut validiert, da ein Modell, das sagt, dass ein Beitrag in Ordnung ist, keine Sicherheitsentscheidung darstellt.',
  'web.developers.safety.killSwitch':
    'Jeder Agent und jeder Arbeitsbereich verfügt über einen Kill-Schalter, der ausstehende Arbeiten stoppt, ohne sie zu löschen.',
  'web.developers.openSource.title': 'Offene Stücke',
  'web.developers.openSource.body':
    'Der Connector-Vertrag, die CLI, Schemabeispiele, MCP-Tool-Definitionen und der Provider-Simulator sind die Teile, die Sie zum Erstellen gegen Relay ohne Sandbox-Konto benötigen. Wenn ein Repository noch nicht veröffentlicht ist, wird auf dieser Seite darauf hingewiesen, anstatt auf nichts zu verweisen.',

  /* ---------------------------------------------------------------------- */
  /* Pricing                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.pricing.title': 'One plan',
  'web.pricing.lede':
    'There are no feature tiers, so there is no comparison table to read. Both billing intervals unlock every shipped feature.',
  'web.pricing.intervalHeading': 'Choose how you pay',
  'web.pricing.monthlyLabel': 'Billed monthly',
  'web.pricing.annualLabel': 'Billed annually',
  'web.pricing.annualDetail': '$300 charged once a year.',
  'web.pricing.monthlyDetail': '$29 charged every month.',
  'web.pricing.perMonthNote':
    'Prices are in US dollars. Polar adds any sales tax or VAT that applies where you are.',

  'web.pricing.beside.title': 'What you are agreeing to',
  'web.pricing.beside.channels':
    '30 active social channels. A channel is one social account, Page, profile, group or publication connection.',
  'web.pricing.beside.members':
    'Unlimited team members, workspaces and brand groups. There is no per seat charge.',
  'web.pricing.beside.fairUse':
    'Unlimited drafts, scheduled posts and stored receipts under a published fair use and anti spam policy. Those controls exist to protect your connected accounts and they apply identically to every subscriber.',
  'web.pricing.beside.metered':
    'X charges per API operation and charges more for a post that contains a URL. Relay passes that through at cost, estimates it before you confirm the action, and shows it in your usage. Other platform fees are passed through only when they are disclosed before the action.',
  'web.pricing.beside.noMedia':
    'AI image generation and AI video generation are not included and are not sold. There are no media credits, because Relay does not generate media.',
  'web.pricing.beside.trial':
    'The trial runs for seven days with every feature. Polar collects a payment method at checkout and charges $0 today. The exact first charge amount and date are shown next to the start action before you confirm.',
  'web.pricing.beside.conversion':
    'If you do nothing, the trial converts on day seven to the interval you chose and Polar charges the amount shown at checkout. Polar emails a reminder three days before that happens.',
  'web.pricing.beside.cancel':
    'Cancel from Settings at any time without contacting support. Cancel before the trial converts and no charge is attempted. Cancel after that and you keep access until the paid period ends.',
  'web.pricing.beside.data':
    'Nothing is deleted when a subscription ends. You can export your content, receipts and analytics, and you can delete them yourself.',

  'web.pricing.included.title': 'Included, in both intervals',
  'web.pricing.compare.title': 'Why there is no comparison table here',
  'web.pricing.compare.body':
    'A comparison table exists to show what a cheaper plan takes away. There is one plan, so the table would have one column. If we ever add a tier, we will say what moved and why on the changelog before the price page changes.',

  'web.pricing.testimonials.title': 'There are no customer quotes on this page yet',
  'web.pricing.testimonials.body':
    'A quote goes up only when the customer wrote it, gave written permission for it, and we can point to the work it describes. Until then an empty space is more honest than a wall of invented praise.',

  'web.pricing.faq.title': 'Questions people ask before paying',
  'web.pricing.faq.channels.q': 'What happens if I go over 30 channels',
  'web.pricing.faq.channels.a':
    'Nothing is disconnected and nothing is deleted. Channels over the limit become read only, you choose which ones stay active, and we tell you before it happens.',
  'web.pricing.faq.refund.q': 'Do you refund',
  'web.pricing.faq.refund.a':
    'Yes, under the published refund and cancellation policy, and always where consumer law requires it. Billing is handled by Polar as merchant of record and refunds are issued through Polar.',
  'web.pricing.faq.selfHost.q': 'Can I run it myself',
  'web.pricing.faq.selfHost.a':
    'Not today. Whether there will be a self hosted edition, and under which licence, is an open decision. We will publish the answer rather than imply one.',
  'web.pricing.faq.xCost.q': 'How much will X actually cost me',
  'web.pricing.faq.xCost.a':
    'It depends on how many posts you publish and how many of them contain a URL, because X prices those differently. Relay estimates each action before you confirm it and totals it in your usage view. We do not mark it up.',
  'web.pricing.faq.trialAbuse.q': 'Can I start a second trial',
  'web.pricing.faq.trialAbuse.a':
    'Repeat trials are limited by Polar. If you have a legitimate reason, contact support and a person will look at it.',

  /* ---------------------------------------------------------------------- */
  /* Resources index                                                         */
  /* ---------------------------------------------------------------------- */

  'web.resources.title': 'Ressourcen',
  'web.resources.lede':
    'Operative Wahrheit über das Produkt und die Forschung hinter allem, was wir über eine Plattform behaupten.',
  'web.resources.status.body':
    'Aktueller Zustand jeder Oberfläche und jedes Anschlusses, mit Vorfallhistorie.',
  'web.resources.changelog.body':
    'Was wurde geliefert, was hat sich an einem Stecker geändert und was haben wir korrigiert?',
  'web.resources.docs.body': 'REST API, MCP, CLI und Webhook-Dokumentation.',
  'web.resources.methodology.body':
    'Wie wir jeden Plattformanspruch recherchieren, datieren, beschaffen und korrigieren.',
  'web.resources.compare.body':
    'Datierte Vergleiche mit anderen Tools, einschließlich der Frage, für wen das jeweilige Tool geeignet ist.',
  'web.resources.capabilities.body':
    'Pro Plattform, pro Funktion, generiert aus den Connector-Definitionen.',
  'web.resources.toolRadar.body':
    'Spezielle kreative Werkzeuge, veraltet, mit Einschränkungen und Offenlegung.',
  'web.resources.opportunities.body':
    'Kuratierte Orte zum Starten, Auflisten oder Mitwirken, mit Regeln für jedes Ziel.',
  'web.resources.legal.body':
    'Terms, privacy, acceptable use, AI use, security and the rest of the policy set.',
  'web.resources.guides.title': 'Anleitungen und Arbeitsabläufe',
  'web.resources.guides.empty': 'Es wurde noch kein Leitfaden veröffentlicht',
  'web.resources.guides.emptyBody':
    'Der Redaktionsstandard erfordert Originalproduktdaten, einen reproduzierbaren Arbeitsablauf, primäre Plattformquellen mit einem Verifizierungsdatum und einen benannten menschlichen Redakteur. Die ersten Leitfäden veröffentlichen, wenn sie darauf treffen.',

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.status.title': 'Status',
  'web.status.lede':
    'Der Zustand jeder Relaisoberfläche und jedes Anschlusses. Der Connector-Status deckt unseren Adapter und die Plattform-API ab, von der er abhängt.',
  'web.status.updated': 'Überprüft {time}',
  'web.status.surfaces.title': 'Oberflächen',
  'web.status.connectors.title': 'Anschlüsse',
  'web.status.level.operational': 'Funktioniert normal',
  'web.status.level.degraded': 'Degradiert',
  'web.status.level.partial': 'Teilweiser Ausfall',
  'web.status.level.outage': 'Ausfall',
  'web.status.level.maintenance': 'Geplante Wartung',
  'web.status.level.notLive': 'Noch nicht live',
  'web.status.notLiveBody':
    'Dieser Connector ist fertig, überträgt aber noch keinen Kundenverkehr, daher gibt es nichts zu berichten.',
  'web.status.incidents.title': 'Vorfallgeschichte',
  'web.status.incidents.empty': 'Es wurde kein Vorfall registriert',
  'web.status.incidents.emptyBody':
    'Diese Seite beginnt absichtlich leer. Wir veröffentlichen jeden Vorfall, der sich auf die Veröffentlichung ausgewirkt hat, einschließlich der Vorfälle, die durch unsere eigenen Fehler verursacht wurden, mit dem Zeitplan und den Änderungen danach.',
  'web.status.incident.started': '{time} gestartet',
  'web.status.incident.resolved': '{time} behoben',
  'web.status.incident.impact': 'Auswirkungen',
  'web.status.incident.cause': 'Ursache',
  'web.status.incident.followUp': 'Was sich danach geändert hat',
  'web.status.subscribe.title': 'Lassen Sie sich informieren, wenn etwas kaputt geht',
  'web.status.subscribe.body':
    'Verbindungsstatus, Veröffentlichungsfehler und Plattformvorfälle werden als signierte Webhooks an Ihren eigenen Endpunkt übermittelt. Es gibt noch keine separate Status-Mailingliste.',

  /* ---------------------------------------------------------------------- */
  /* Changelog                                                               */
  /* ---------------------------------------------------------------------- */

  'web.changelog.title': 'Änderungsprotokoll',
  'web.changelog.lede':
    'Produktänderungen, Steckeränderungen und Korrekturen. Eine Funktionsänderung, die sich darauf auswirkt, was Sie veröffentlichen können, erscheint hier, bevor sie irgendwo anders auf dieser Site erscheint.',
  'web.changelog.kind.shipped': 'Ausgeliefert',
  'web.changelog.kind.changed': 'Geändert',
  'web.changelog.kind.fixed': 'Behoben',
  'web.changelog.kind.connector': 'Stecker',
  'web.changelog.kind.correction': 'Korrektur',
  'web.changelog.kind.security': 'Sicherheit',
  'web.changelog.empty': 'Bisher wurde noch nichts öffentlich versendet',
  'web.changelog.emptyBody':
    'Relais ist im Bau. Der erste Eintrag hier ist das Erste, was ein Kunde nutzen kann, kein Meilenstein über uns selbst.',

  /* ---------------------------------------------------------------------- */
  /* Docs shell                                                              */
  /* ---------------------------------------------------------------------- */

  'web.docs.title': 'Dokumentation',
  'web.docs.lede':
    'Ein Backend, vier Wege hinein. Jeder Abschnitt dokumentiert die gleichen Anwendungsfälle, sodass ein Konzept, das Sie in der REST-API lernen, dasselbe Konzept in MCP und in der CLI ist.',
  'web.docs.section.start.title': 'Erste Schritte',
  'web.docs.section.start.body':
    'Authentifizierung, Arbeitsbereiche, Marken und Ihr erster veröffentlichter Beitrag.',
  'web.docs.section.api.title': 'REST-API',
  'web.docs.section.api.body':
    'Ressourcen, Paginierung, Idempotenz, Fehlercodes und Ratenbeschränkungen.',
  'web.docs.section.mcp.title': 'MCP-Server',
  'web.docs.section.mcp.body':
    'Transport, OAuth, Toolkatalog, Bereiche und der Genehmigungs-Handshake.',
  'web.docs.section.cli.title': 'CLI',
  'web.docs.section.cli.body':
    'Installieren, authentifizieren und den maschinenlesbaren Ausgabevertrag.',
  'web.docs.section.webhooks.title': 'Webhooks',
  'web.docs.section.webhooks.body':
    'Ereigniskatalog, Signaturüberprüfung, Wiederholungsversuche und erneute Zustellung.',
  'web.docs.section.connectors.title': 'Anschlüsse',
  'web.docs.section.connectors.body':
    'Je nach Plattformanforderungen, Kontotypen, Limits und bekannten Einschränkungen.',
  'web.docs.section.errors.title': 'Fehlerreferenz',
  'web.docs.section.errors.body':
    'Jeder Fehlercode, was ihn verursacht und was man dagegen tun kann.',
  'web.docs.pending': 'Noch nicht veröffentlicht',
  'web.docs.pendingBody':
    'Dieser Abschnitt ist für die ausgelieferte API geschrieben und wird mit dieser veröffentlicht. Wir zeigen Ihnen lieber nichts als die Dokumentation für einen Endpunkt, der sich ändern könnte.',
  'web.docs.principles.title': 'Worauf Sie sich verlassen können',
  'web.docs.principles.idempotency':
    'Jeder Schreibvorgang benötigt einen Idempotenzschlüssel. Das erneute Abspielen einer Anfrage mit demselben Schlüssel gibt das ursprüngliche Ergebnis zurück, anstatt einen zweiten Beitrag zu erstellen.',
  'web.docs.principles.errors':
    'Jeder Fehler enthält einen stabilen Code, einen Nachrichtenschlüssel und bereinigte Details. Codes ändern ihre Bedeutung zwischen den Versionen nicht.',
  'web.docs.principles.versioning':
    'Wichtige Änderungen erhalten eine neue Version und ein angekündigtes Einstellungsfenster. Additive Änderungen nicht.',
  'web.docs.principles.scopes':
    'Lesen, Verfassen, Einholen von Genehmigungen, Terminplanung und Veröffentlichung sind separate Bereiche. Ein Berechtigungsnachweis erhält den kleinsten Satz, der seine Aufgabe erfüllt.',

  /* ---------------------------------------------------------------------- */
  /* Methodology                                                             */
  /* ---------------------------------------------------------------------- */

  'web.methodology.title': 'Methodik',
  'web.methodology.lede':
    'Wie etwas auf dieser Website als wahr bezeichnet wird und was passiert, wenn sich herausstellt, dass es nicht wahr ist.',
  'web.methodology.claims.title': 'Plattformansprüche',
  'web.methodology.claims.body':
    'Jede Behauptung darüber, was eine Plattform zulässt, stammt aus der Dokumentation oder Richtlinienseite dieser Plattform. Wir erfassen die URL, das Datum, an dem sie gelesen wurde, die API-Version, auf die man sich bezieht, und die Person, die sie erneut überprüft. Ohne diese vier Dinge kann kein Anspruch auf die Website erhoben werden.',
  'web.methodology.recheck.title': 'Wenn wir noch einmal nachsehen',
  'web.methodology.recheck.beforeConnector':
    'Bevor ein Connector startet und noch einmal, bevor er Kundenverkehr überträgt.',
  'web.methodology.recheck.monthly':
    'Jeden Monat für Plattform-Änderungsprotokolle und Anbieterpreise.',
  'web.methodology.recheck.quarterly':
    'Vierteljährlich für Mitbewerberpläne, Community-Regeln und rechtliche Dokumente.',
  'web.methodology.recheck.immediate':
    'Unmittelbar nach einer Ablehnung der Plattform, einer Durchsetzungsmitteilung, einer Einstellung oder einer unerklärlichen Änderung im Veröffentlichungs- oder Analyseverhalten.',
  'web.methodology.comparison.title': 'Vergleiche',
  'web.methodology.comparison.bestFor':
    'Bei jedem Vergleich wird angegeben, für wen das jeweilige Produkt am besten geeignet ist, auch wenn das nicht für uns gilt.',
  'web.methodology.comparison.dated':
    'Jeder Vergleich enthält das Forschungsdatum und verknüpft die wichtigsten Preis- und Leistungsquellen.',
  'web.methodology.comparison.distinction':
    'Eine fehlende Funktion wird entweder als etwas gekennzeichnet, das wir nicht entwickelt haben, oder als etwas, das die Plattform nicht zulässt. Das sind unterschiedliche Sätze und wir verschmelzen sie nie.',
  'web.methodology.comparison.noLogos':
    'Wir verwenden keine Kundenlogos, Zitate oder Schnittstellen-Screenshots anderer Unternehmen und erheben keinen Anspruch auf eine Empfehlung, die wir nicht haben.',
  'web.methodology.benchmarks.title': 'Benchmarks und Produktdaten',
  'web.methodology.benchmarks.body':
    'Jede aus der Kundenaktivität ermittelte Zahl gibt ihre Stichprobe, ihre Ausschlüsse, ihre Metrikdefinition und ihren Datenschutzschwellenwert an und wird aggregiert, sodass kein Arbeitsbereich identifiziert werden kann. Wenn eine Stichprobe zu klein ist, um sie sicher zu veröffentlichen, sagen wir das, anstatt sie trotzdem zu veröffentlichen.',
  'web.methodology.ai.title': 'KI in unseren eigenen Inhalten',
  'web.methodology.ai.body':
    'Ein Modell kann recherchieren, skizzieren, übersetzen, prüfen und formatieren. Eine benannte Person ist Eigentümer jedes Anspruchs, bearbeitet den Artikel und hält ihn auf dem neuesten Stand. Wir veröffentlichen keine unrezensierten generierten Artikel und erstellen keine Screenshots.',
  'web.methodology.corrections.title': 'Korrekturen',
  'web.methodology.corrections.body':
    'Wenn eine Seite falsch ist, korrigieren wir sie direkt, fügen einen datierten Korrekturvermerk hinzu und führen die Korrektur im Änderungsprotokoll auf. Wenn eine Seite zu veraltet ist, um sie zu reparieren, ziehen wir sie zurück, anstatt sie aktiv zu lassen.',

  /* ---------------------------------------------------------------------- */
  /* Compare                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.compare.title': 'Vergleiche',
  'web.compare.lede':
    'Diese Seiten sind auch dann nützlich, wenn Sie sich für das andere Produkt entscheiden. Das ist der Standard, den sie erfüllen müssen, bevor sie veröffentlichen.',
  'web.compare.rules.title': 'Die Regeln, denen diese Seiten folgen',
  'web.compare.rules.bestFor':
    'Auf jeder Seite wird zunächst in einem eigenen Abschnitt angegeben, für wen das andere Produkt am besten geeignet ist.',
  'web.compare.rules.dated':
    'Jede Behauptung ist datiert und verweist auf die Hauptquelle, aus der sie stammt.',
  'web.compare.rules.distinction':
    'Wir trennen das, was wir nicht gebaut haben, von dem, was eine Plattform nicht zulässt.',
  'web.compare.rules.axes':
    'Auf jeder Seite werden die gleichen Dinge verglichen: Kontokontingent, Posting-Limits, Team und Genehmigung, API-, MCP- und CLI-Zugriff, Inhaltssprachen, Analysen, Videoverarbeitung, eingebettete Nutzung, Selbsthosting, Support und die Plattform-API-Kosten, die Sie zusätzlich zahlen.',
  'web.compare.rules.correction':
    'Auf jeder Seite sind ein Korrekturkontakt und ein Überprüfungsdatum angegeben.',
  'web.compare.planned.title': 'Geplante Seiten',
  'web.compare.planned.body':
    'Diese werden veröffentlicht, sobald die aktuelle Preis- und Leistungsprüfung abgeschlossen ist. Ein aus dem Gedächtnis geschriebener Vergleich ist schlimmer als kein Vergleich.',
  'web.compare.empty': 'Es wurde noch kein Vergleich veröffentlicht',
  'web.compare.emptyBody':
    'Jede Seite muss mit den Preisen und der Dokumentation des anderen Produkts verglichen werden. Sie veröffentlichen eine nach der anderen, wenn die Arbeit abgeschlossen ist.',

  /* ---------------------------------------------------------------------- */
  /* Tool radar                                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.title': 'Kreatives Werkzeugradar',
  'web.toolRadar.lede':
    'Relay generiert keine Bilder oder Videos. Es hilft Ihnen bei der Entscheidung, welches Spezialtool Sie verwenden sollten, und hilft Ihnen, das fertige Asset mit intaktem Rechteverzeichnis einzuliefern.',
  'web.toolRadar.record.title': 'Was jede Schallplatte tragen muss',
  'web.toolRadar.record.url': 'Die offizielle URL und die Organisation, die das Produkt besitzt.',
  'web.toolRadar.record.useCase':
    'Der Arbeitsablauf, für den es empfohlen wird, und seine dokumentierten Einschränkungen.',
  'web.toolRadar.record.pricing': 'Das Preismodell und das Datum, an dem wir es überprüft haben.',
  'web.toolRadar.record.rights':
    'Seine Rechte, Lizenzierung, Aufbewahrung und Datenschutzvorbehalte, in den eigenen Worten des Anbieters.',
  'web.toolRadar.record.disclosure':
    'Ob wir eine Geschäftsbeziehung damit haben. Das Ranking hängt nie davon ab.',
  'web.toolRadar.record.verified':
    'Ein Datum der letzten Überprüfung und eine sichtbare Warnung, sobald ein Datensatz sein Überprüfungsfenster überschritten hat.',
  'web.toolRadar.category.title': 'Kategorien',
  'web.toolRadar.empty': 'Der Katalog ist noch nicht gefüllt',
  'web.toolRadar.emptyBody':
    'Die Aufzeichnungen werden von einer Person aus der eigenen Dokumentation des Anbieters erstellt. Wir werden diese Seite nicht mit modellgenerierten Links füllen, die plausibel erscheinen.',
  'web.toolRadar.noAffiliateYet':
    'Es besteht derzeit keine Affiliate-Beziehung zu einem der hier aufgeführten Tools.',

  /* ---------------------------------------------------------------------- */
  /* Opportunities                                                           */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.title': 'Aufstiegsmöglichkeiten',
  'web.opportunities.lede':
    'Ein kuratierter Katalog von Orten, an denen ein Produkt eingeführt, gelistet, diskutiert oder beigesteuert werden kann, mit den Regeln, die jeder Zielort für sich selbst festlegt.',
  'web.opportunities.rules.title': 'Wie sich dieser Katalog verhält',
  'web.opportunities.rules.curated':
    'Bei jedem Eintrag handelt es sich um einen überprüften Datensatz mit einer offiziellen URL, den aktuellen Einreichungsregeln und einem Überprüfungsdatum. Nichts wird von einem Modell entdeckt und als verifiziert dargestellt.',
  'web.opportunities.rules.noAutomation':
    'Relay sendet niemals ein Formular, kratzt keinen Kontakt, sendet keine Massen-E-Mails oder Beiträge an eine Community für Sie. Sie führen die Einreichung durch.',
  'web.opportunities.rules.noGuarantee':
    'Eine Auflistung ist kein Ranking-Versprechen und ein Link keine Wachstumsstrategie. Wir zeigen Eignung, Zielgruppe, Aufwand, Kosten und Offenlegungsanforderungen, damit Sie entscheiden können, ob sich der Nachmittag lohnt.',
  'web.opportunities.rules.stale':
    'Ein Datensatz, dessen Überprüfungsdatum abgelaufen ist, wird gekennzeichnet oder ausgeblendet und nicht als aktuell angezeigt.',
  'web.opportunities.category.title': 'Kategorien',
  'web.opportunities.empty': 'Der Katalog ist noch nicht gefüllt',
  'web.opportunities.emptyBody':
    'Die Regeln jedes Reiseziels müssen von einer Person gelesen und aufgezeichnet werden, bevor sie empfohlen werden können. Die Kategorien sind oben aufgeführt, sodass Sie sehen können, was auf Sie zukommt.',

  /* ---------------------------------------------------------------------- */
  /* Legal, shared                                                           */
  /* ---------------------------------------------------------------------- */

  'web.legal.title': 'Legal and policies',
  'web.legal.lede':
    'The documents that govern using Relay. Where the wording has to be drafted by a lawyer for a specific company and jurisdiction, the page says so instead of pretending.',
  'web.legal.counselPending.title': 'Pending review by counsel before launch',
  'web.legal.counselPending.body':
    'The substance on this page reflects how the product actually behaves and is accurate today. The binding legal wording, the governing jurisdiction and the liability terms are being drafted with qualified counsel and will replace this text before Relay is generally available. This page is not legal advice and it is not a contract yet.',
  'web.legal.contact.title': 'Contact',
  'web.legal.contact.privacy': 'privacy@relay.example',
  'web.legal.contact.legal': 'legal@relay.example',
  'web.legal.contact.security': 'security@relay.example',
  'web.legal.contact.abuse': 'abuse@relay.example',
  'web.legal.contact.copyright': 'copyright@relay.example',
  'web.legal.contact.affiliates': 'affiliates@relay.example',
  'web.legal.contact.accessibility': 'accessibility@relay.example',
  'web.legal.entity.pending':
    'The contracting entity, its registered address and the governing jurisdiction are an open decision and will be named here before launch.',
  'web.legal.index.updated': 'Updated {date}',

  /* Terms ---------------------------------------------------------------- */
  'web.legal.terms.title': 'Terms of Service',
  'web.legal.terms.summary':
    'What Relay agrees to provide, what you agree to do, and what happens when either side stops.',
  'web.legal.terms.service.title': 'What the service is',
  'web.legal.terms.service.body':
    'Relay is a hosted service for creating, approving, scheduling and publishing content to social platforms through those platforms official APIs, together with the receipts, analytics and audit records that result. It is not a social platform and it does not control what any platform does with a post once it is published.',
  'web.legal.terms.content.title': 'Your content stays yours',
  'web.legal.terms.content.body':
    'You keep ownership of everything you upload, write or import. You grant Relay only the licence needed to store it, process it, adapt it into the variants you ask for, and transmit it to the accounts you selected. That licence ends when you delete the content, apart from records we are required to keep.',
  'web.legal.terms.warranties.title': 'What you are confirming when you publish',
  'web.legal.terms.warranties.body':
    'That you are authorized to publish to the accounts you connected, that you hold the rights to the content and the media, that you have the consent required for any person appearing in it, and that publishing it does not breach the destination platform rules.',
  'web.legal.terms.platforms.title': 'Platform dependence',
  'web.legal.terms.platforms.body':
    'Connectors depend on third party APIs that those companies control. A platform can change its API, restrict a permission, revoke an application or close access with little notice. Relay cannot guarantee that any connector remains available, and a connector becoming unavailable is not a failure of this agreement. We will tell you on the status page and the changelog when it happens.',
  'web.legal.terms.ai.title': 'AI output',
  'web.legal.terms.ai.body':
    'Text assistance, translation, transcreation and planning features produce suggestions. They can be wrong, out of date or unsuitable. You are responsible for reviewing anything you publish. Relay does not generate images or video.',
  'web.legal.terms.billing.title': 'Payment',
  'web.legal.terms.billing.body':
    'Polar is the merchant of record. Polar handles checkout, taxes, invoices and refunds. Subscriptions renew automatically at the interval you chose until you cancel. Platform usage that a provider charges per operation is billed separately at cost and is disclosed before the action that incurs it.',
  'web.legal.terms.suspension.title': 'Suspension and scheduled posts',
  'web.legal.terms.suspension.body':
    'If a subscription lapses or a workspace is suspended, scheduled posts stop rather than publishing silently, and the workspace becomes read only. Your content, receipts and connections are preserved and remain exportable.',
  'web.legal.terms.aup.title': 'Acceptable use',
  'web.legal.terms.aup.body':
    'The Acceptable Use Policy forms part of these terms. We may rate limit, pause, require verification, revoke agent or API access, suspend or terminate for a breach of it, and you may appeal any of those decisions to a person.',
  'web.legal.terms.termination.title': 'Ending the agreement',
  'web.legal.terms.termination.body':
    'You can cancel at any time from Settings. After termination you keep an export window before deletion, and deletion is never made conditional on paying an outstanding invoice, other than the billing records we are legally required to retain.',
  'web.legal.terms.developer.title': 'API, MCP and service accounts',
  'web.legal.terms.developer.body':
    'Programmatic access is governed additionally by the API and MCP Terms, including rate limits, scope requirements and the rule that a service account never inherits a human full permissions.',

  /* Privacy -------------------------------------------------------------- */
  'web.legal.privacy.title': 'Privacy Policy',
  'web.legal.privacy.summary':
    'What Relay collects, why, who processes it, how long it is kept, and how to get it out or have it deleted.',
  'web.legal.privacy.collect.title': 'What we hold',
  'web.legal.privacy.collect.account':
    'Account and profile: your name, email, workspace membership and role.',
  'web.legal.privacy.collect.connections':
    'Social connections: the platform account identifier, its display name, its type, the granted scopes and an encrypted access token. Tokens are stored with envelope encryption and are never written to a log.',
  'web.legal.privacy.collect.content':
    'Content and media you create, upload or import, including the rights and provenance you record with it.',
  'web.legal.privacy.collect.schedules':
    'Schedules, approval decisions, publication receipts and audit events.',
  'web.legal.privacy.collect.analytics':
    'Metrics retrieved from platforms about posts you published through Relay.',
  'web.legal.privacy.collect.billing':
    'Billing references held by Polar. Relay does not store your card details.',
  'web.legal.privacy.collect.technical':
    'Device and log data needed to operate and secure the service, redacted by default.',
  'web.legal.privacy.collect.agent':
    'Agent and API activity: which credential took which action, with an input hash rather than the input.',
  'web.legal.privacy.minimization.title': 'What we deliberately do not do',
  'web.legal.privacy.minimization.scopes':
    'We request only the platform scopes the features you have enabled actually need.',
  'web.legal.privacy.minimization.history':
    'We do not ingest your entire social history in order to draw a chart.',
  'web.legal.privacy.minimization.logs':
    'Post content is redacted from general logs and from support tooling.',
  'web.legal.privacy.minimization.training':
    'Your content is not used to train our models or anyone models by default.',
  'web.legal.privacy.subprocessors.title': 'Who else processes it',
  'web.legal.privacy.subprocessors.body':
    'The current subprocessor list is published separately and changes are announced there before they take effect.',
  'web.legal.privacy.retention.title': 'How long we keep it',
  'web.legal.privacy.rights.title': 'Your controls',
  'web.legal.privacy.rights.export':
    'Download your content, receipts and analytics as JSON and CSV with a media archive.',
  'web.legal.privacy.rights.revoke':
    'Disconnect one social account without deleting the workspace. Tokens are revoked at the platform and deleted here.',
  'web.legal.privacy.rights.delete':
    'Delete a brand, a piece of content, a media file or the entire account.',
  'web.legal.privacy.rights.cancelJobs':
    'Cancel scheduled jobs before deleting anything, so nothing publishes after you leave.',
  'web.legal.privacy.rights.sessions':
    'See and revoke active sessions, API keys, agent credentials, webhooks and platform permissions.',
  'web.legal.privacy.rights.consent':
    'Consent preferences are versioned and auditable, so you can see what you agreed to and when.',
  'web.legal.privacy.deletion.title': 'Deleting data held at a platform',
  'web.legal.privacy.deletion.body':
    'Disconnecting an account in Relay revokes the token at the platform and deletes the credential here. Content already published on a platform is governed by that platform and has to be deleted there. Where a platform requires deletion of derived data within a fixed period after revocation, we meet that period. For Google and YouTube data that period is currently 30 days.',
  'web.legal.privacy.transfers.title': 'International transfers',
  'web.legal.privacy.transfers.body':
    'Hosting regions and the transfer mechanism are being finalized with counsel and will be named here, together with the safeguards that apply, before launch.',

  /* Acceptable use ------------------------------------------------------- */
  'web.legal.aup.title': 'Acceptable Use Policy',
  'web.legal.aup.summary':
    'Relay helps you publish content you are authorized to publish. It is not built to help anyone evade a platform limit, fake an endorsement or send unwanted messages.',
  'web.legal.aup.prohibited.title': 'Not permitted',
  'web.legal.aup.prohibited.spam':
    'Spam, unsolicited bulk messages, replies or mentions, engagement bait, and repeated unwanted content.',
  'web.legal.aup.prohibited.linkSchemes':
    'Automated directory or form submissions, bulk outreach, link schemes, paid or reciprocal links intended to manipulate search ranking, and community promotion that breaks the destination rules.',
  'web.legal.aup.prohibited.inauthentic':
    'Coordinated inauthentic behaviour, multi account amplification presented as independent, engagement pods, fake reviews, ratings or install counts, automated likes and follows, and trend manipulation.',
  'web.legal.aup.prohibited.duplicate':
    'Publishing duplicate or substantially similar content across many accounts where the platform prohibits it.',
  'web.legal.aup.prohibited.impersonation':
    'Impersonation, phishing, fraud, scams, malware, credential theft and deceptive installation.',
  'web.legal.aup.prohibited.harm':
    'Harassment, doxxing, sexual exploitation, non consensual intimate media, hate or violent extremist content, and illegal goods or services.',
  'web.legal.aup.prohibited.political':
    'Political manipulation and automated political persuasion where it is prohibited. Political content, where permitted at all, is subject to enhanced review.',
  'web.legal.aup.prohibited.rights':
    'Copyright, trademark and publicity violations, unlicensed music or media, synthetic likenesses without rights and disclosure, and undisclosed paid endorsements.',
  'web.legal.aup.prohibited.circumvention':
    'Bypassing official APIs, rate limits, audits, account controls or platform enforcement using browser automation, cookie replay or scraping.',
  'web.legal.aup.prohibited.restrictedStores':
    'Automated submission to app stores, the Chrome Web Store or other restricted submission systems through unauthorized interfaces.',
  'web.legal.aup.prohibited.banEvasion':
    'Evading an account ban or running coordinated account farms.',
  'web.legal.aup.prohibited.training':
    'Training or evaluating models on third party or other customers content without authorization.',
  'web.legal.aup.controls.title': 'The controls that enforce this',
  'web.legal.aup.controls.duplicate':
    'Exact and near duplicate fingerprinting by workspace, account, platform and time window, with a cross account similarity check.',
  'web.legal.aup.controls.cadence':
    'Account level and workspace level cadence budgets, plus mention, hashtag, URL and domain volume checks.',
  'web.legal.aup.controls.escalation':
    'New account, new domain and bulk action escalation, and a maximum number of repetitions for any repeating campaign.',
  'web.legal.aup.controls.linkSafety':
    'Destination scanning on short links, with emergency disable and an abuse report channel.',
  'web.legal.aup.controls.workspaceCaps':
    'A workspace owner can set stricter limits than the plan allows. Risk controls cannot be loosened by paying more.',
  'web.legal.aup.enforcement.title': 'Enforcement and appeal',
  'web.legal.aup.enforcement.body':
    'Where we can, we block before the external action rather than after it, and we record the reason, the rule version and the appeal path. Repeated or serious behaviour goes to a trust review by a person. You will be told what happened, without a level of detail that would help someone evade the check. Every decision can be appealed and reversed.',
  'web.legal.aup.report.title': 'Reporting abuse',
  'web.legal.aup.report.body':
    'If content published through Relay breaks these rules, tell us. Include the post URL and what is wrong with it.',

  /* AI policy ------------------------------------------------------------ */
  'web.legal.ai.title': 'AI Use and Generated Content Policy',
  'web.legal.ai.summary':
    'Which features use a model, what is sent, what is kept, what you stay responsible for, and why Relay does not generate media.',
  'web.legal.ai.features.title': 'Where a model is used',
  'web.legal.ai.features.text':
    'Text assistance in the composer: rewriting, shortening and adapting for a platform.',
  'web.legal.ai.features.translation':
    'Translation and transcreation into your content languages, against your brand glossary.',
  'web.legal.ai.features.feedback': 'Content feedback and the four week growth plan.',
  'web.legal.ai.features.provider':
    'These features call DeepSeek. The model identifiers currently in use are published in the documentation and any change is listed on the changelog.',
  'web.legal.ai.data.title': 'What is sent, and what happens to it',
  'web.legal.ai.data.sent':
    'Only the text you asked us to work on, the instruction, and the brand context you chose to attach. Credentials, tokens and other customers content are never in a model context.',
  'web.legal.ai.data.training':
    'Your content is not used to train our models. We configure providers so it is not used to train theirs.',
  'web.legal.ai.data.optOut':
    'Optional AI features can be turned off per workspace. Publishing, scheduling, approvals and analytics do not depend on them.',
  'web.legal.ai.responsibility.title': 'What stays yours',
  'web.legal.ai.responsibility.body':
    'A model can be confidently wrong. You are responsible for checking facts, claims, names, numbers and tone before you publish, and for any disclosure a platform requires. No AI feature guarantees reach, engagement or ranking, and none is offered as one.',
  'web.legal.ai.disclosure.title': 'Disclosure and provenance',
  'web.legal.ai.disclosure.body':
    'Relay records whether content was AI assisted in its internal history, reminds you where a platform requires an altered or synthetic media disclosure, and stores the provenance you provide with an imported asset. Where a platform offers a disclosure field, Relay sets it from your declaration rather than guessing.',
  'web.legal.ai.blocks.title': 'What the AI features refuse',
  'web.legal.ai.blocks.impersonation': 'Impersonating a real person or a public figure.',
  'web.legal.ai.blocks.ncii': 'Non consensual intimate imagery, in any form.',
  'web.legal.ai.blocks.fabrication':
    'Fabricated testimonials, invented customers and invented performance figures.',
  'web.legal.ai.blocks.unverified':
    'Presenting a model generated URL as a verified opportunity. Opportunity and tool recommendations come only from the curated catalog.',
  'web.legal.ai.noMedia.title': 'Why there is no image or video generation',
  'web.legal.ai.noMedia.body':
    'Relay has not collected the verified visual system, product detail, asset rights, likeness permissions and campaign context that brand ready output would require, and in app generation would need its own consent, provenance, safety evaluation and cost controls. Media model capability, licensing, pricing and retention also change quickly, which is why our tool recommendations carry dates. You keep creative control by choosing a specialist tool and importing the approved asset. Relay handles adaptation, approval, publishing and measurement.',
  'web.legal.ai.noMedia.caveat':
    'A tool appearing in our radar is not a statement that its output is safe or rights cleared. Its documented caveats are shown with it and your normal rights declaration still applies.',

  /* Cookies -------------------------------------------------------------- */
  'web.legal.cookies.title': 'Cookie Policy',
  'web.legal.cookies.summary':
    'What is stored in your browser, why, and what happens if you refuse the optional parts.',
  'web.legal.cookies.essential.title': 'Strictly necessary',
  'web.legal.cookies.essential.body':
    'A session cookie that keeps you signed in, a cross site request forgery token, and a preference cookie holding your theme and time zone choice. These cannot be turned off without breaking sign in, and they are not used for advertising.',
  'web.legal.cookies.analytics.title': 'Product analytics',
  'web.legal.cookies.analytics.body':
    'Aggregate, first party measurement of which screens are used, so we can fix the ones that are not working. It is optional, it is off until you allow it, and refusing it changes nothing about the product.',
  'web.legal.cookies.marketing.title': 'Advertising',
  'web.legal.cookies.marketing.body':
    'We do not run advertising cookies, we do not embed third party advertising pixels, and we do not sell or share personal information for cross context behavioural advertising.',
  'web.legal.cookies.shortLinks.title': 'Tracked short links',
  'web.legal.cookies.shortLinks.body':
    'A short link click creates first party analytics for the workspace that owns the link. Location and device data are minimized, bot traffic is classified out, IP addresses are truncated or discarded promptly, and a workspace can turn tracking off or shorten retention. Nothing sensitive is ever put in a slug or a query parameter.',
  'web.legal.cookies.control.title': 'Changing your mind',
  'web.legal.cookies.control.body':
    'The consent choice is stored with a version and can be changed at any time in Settings, under data controls. Withdrawing consent takes effect immediately.',

  /* Subprocessors -------------------------------------------------------- */
  'web.legal.subprocessors.title': 'Subprocessors',
  'web.legal.subprocessors.summary':
    'The companies that process customer data on our behalf, what they do, and where.',
  'web.legal.subprocessors.notice.title': 'Change notice',
  'web.legal.subprocessors.notice.body':
    'A new subprocessor is published here before it starts processing customer data, with at least 30 days notice for a change that materially affects processing. Customers with a data processing addendum can object during that window.',
  'web.legal.subprocessors.column.name': 'Subprocessor',
  'web.legal.subprocessors.column.purpose': 'What it processes for us',
  'web.legal.subprocessors.column.data': 'Data categories',
  'web.legal.subprocessors.column.region': 'Processing region',
  'web.legal.subprocessors.platforms.title': 'Social platforms are not subprocessors',
  'web.legal.subprocessors.platforms.body':
    'When you publish, Relay transmits your content to the platform account you selected, at your instruction. Those platforms are independent controllers of what they receive and their own terms govern it.',

  /* Refunds -------------------------------------------------------------- */
  'web.legal.refunds.title': 'Refund and Cancellation Policy',
  'web.legal.refunds.summary':
    'How to cancel, what happens to your data, and when you get money back.',
  'web.legal.refunds.cancel.title': 'Cancelling',
  'web.legal.refunds.cancel.body':
    'Cancel from Settings without contacting support. Cancelling during the seven day trial means no charge is attempted and the cancellation screen confirms that in writing. Cancelling after the trial keeps your access until the end of the period you already paid for.',
  'web.legal.refunds.refund.title': 'Refunds',
  'web.legal.refunds.refund.body':
    'If the service did not work as described, contact support and we will refund the affected period. Mandatory consumer withdrawal rights, including the statutory cooling off period where it applies to you, are honoured in full and are not limited by anything on this page. Refunds are issued by Polar, our merchant of record, to the original payment method.',
  'web.legal.refunds.usage.title': 'Platform usage charges',
  'web.legal.refunds.usage.body':
    'Usage passed through from a platform, such as X per operation pricing, covers a cost we already paid on your behalf for an action you confirmed. It is refundable when the charge was our error, for example a duplicate dispatch caused by a defect on our side.',
  'web.legal.refunds.data.title': 'What happens to your data',
  'web.legal.refunds.data.body':
    'Nothing is deleted at cancellation. The workspace becomes read only, scheduled posts stop rather than publishing, and you keep an export window before deletion. Deletion is never made conditional on paying an invoice, apart from the billing records we must keep by law.',
  'web.legal.refunds.failed.title': 'A failed payment',
  'web.legal.refunds.failed.body':
    'Polar retries and emails you. During the grace period publishing continues. After it, the workspace becomes read only and scheduled posts stop. Nothing is disconnected and nothing is deleted.',

  /* DMCA ----------------------------------------------------------------- */
  'web.legal.dmca.title': 'Copyright and Takedown',
  'web.legal.dmca.summary':
    'How to report content hosted by Relay that infringes your rights, and how to respond if yours was removed.',
  'web.legal.dmca.scope.title': 'What we can act on',
  'web.legal.dmca.scope.body':
    'Relay can remove material stored in our systems, such as a media file or a draft. Content already published on a social platform lives on that platform and has to be reported to it, because we cannot delete a post we do not host. We will tell you which of the two applies to your report.',
  'web.legal.dmca.notice.title': 'Sending a notice',
  'web.legal.dmca.notice.identify':
    'Identify the copyrighted work and the material you say infringes it, with a URL we can reach.',
  'web.legal.dmca.notice.contact': 'Give your name, address, telephone number and email.',
  'web.legal.dmca.notice.goodFaith':
    'State that you believe in good faith that the use is not authorized by the rights holder, its agent or the law.',
  'web.legal.dmca.notice.accuracy':
    'State that the information is accurate and, under penalty of perjury, that you are authorized to act for the rights holder.',
  'web.legal.dmca.notice.signature': 'Sign it, physically or electronically.',
  'web.legal.dmca.counter.title': 'Counter notice',
  'web.legal.dmca.counter.body':
    'If your material was removed and you believe that was a mistake or a misidentification, you can send a counter notice with the same contact details, identifying the material and where it was, and consenting to the jurisdiction that will be named here. We will forward it to the person who complained.',
  'web.legal.dmca.repeat.title': 'Repeat infringers',
  'web.legal.dmca.repeat.body':
    'Accounts that repeatedly infringe are suspended and then terminated. Bad faith notices, used to remove a competitor content, are also grounds for termination.',

  /* Security ------------------------------------------------------------- */
  'web.legal.security.title': 'Security and Responsible Disclosure',
  'web.legal.security.summary':
    'How Relay protects the credentials you trust it with, and how to report a problem you find.',
  'web.legal.security.tokens.title': 'Social credentials',
  'web.legal.security.tokens.body':
    'Platform tokens are encrypted with envelope encryption under a managed key, rotated, stored apart from content and billing data, and redacted from every log. A token is never sent to a browser, never placed in a model context and never included in an error message.',
  'web.legal.security.tenancy.title': 'Tenancy',
  'web.legal.security.tenancy.body':
    'Isolation is enforced three times: at the edge when you authenticate, in the application service when it authorizes the action, and in PostgreSQL through row level security. Being signed in is never treated as permission. Cross workspace access attempts are tested in continuous integration and must fail.',
  'web.legal.security.publishing.title': 'Publishing integrity',
  'web.legal.security.publishing.body':
    'Every external write carries an idempotency key and produces an immutable receipt. Duplicate publication is treated as a defect with a target of zero, and the test suite includes worker crashes after platform acceptance, platform timeouts, duplicated webhooks, revoked tokens at dispatch and daylight saving transitions.',
  'web.legal.security.program.title': 'The programme',
  'web.legal.security.program.threatModel':
    'A written threat model covering OAuth, tenancy, publishing, MCP, media, billing and analytics.',
  'web.legal.security.program.pentest':
    'An independent security review focused on token leakage and cross tenant access before paid launch.',
  'web.legal.security.program.access':
    'Least privilege production access, multi factor authentication, and a device and session inventory.',
  'web.legal.security.program.supplyChain':
    'Dependency and container scanning with patch service levels, and signed build provenance where practical.',
  'web.legal.security.program.logging':
    'Centralized logging that redacts by default, with anomaly alerting.',
  'web.legal.security.program.backups':
    'Encrypted backups with tested restoration and a documented rotation.',
  'web.legal.security.disclosure.title': 'Reporting a vulnerability',
  'web.legal.security.disclosure.body':
    'Email us with enough detail to reproduce the issue. We acknowledge within two business days, keep you updated, and credit you when you want the credit. Please do not access another customer data, degrade the service, or run automated scanning against production. Test against your own workspace.',
  'web.legal.security.disclosure.safeHarbor':
    'We will not pursue legal action for good faith research that follows this policy. The exact safe harbour wording is with counsel.',
  'web.legal.security.incidents.title': 'If something goes wrong',
  'web.legal.security.incidents.body':
    'We have an incident response plan with named decision makers, severity levels, evidence preservation and notification duties. Incidents that affected publishing are published on the status page with a timeline and what changed afterwards, including the ones we caused.',

  /* Accessibility -------------------------------------------------------- */
  'web.legal.accessibility.title': 'Accessibility Statement',
  'web.legal.accessibility.summary':
    'The standard Relay is built to, what we have verified, what we know is not right yet, and how to tell us.',
  'web.legal.accessibility.standard.title': 'The standard',
  'web.legal.accessibility.standard.body':
    'Relay targets WCAG 2.2 level AA across the product and this site. Accessibility is a merge requirement here, not a later ticket, and a screen that fails it does not ship.',
  'web.legal.accessibility.measures.title': 'What that means in practice',
  'web.legal.accessibility.measures.keyboard':
    'Everything is operable from the keyboard, with a visible focus ring and a logical focus order. There is no drag only interaction anywhere.',
  'web.legal.accessibility.measures.contrast':
    'Every colour pair in the design system is asserted at 4.5 to 1 for body text and 3 to 1 for large text and control edges, in both the light and the dark theme, by an automated test.',
  'web.legal.accessibility.measures.colour':
    'Status, capability and freshness always carry an icon and a word as well as a colour.',
  'web.legal.accessibility.measures.announcements':
    'Save state, validation changes, upload progress, schedule confirmation and publish results are announced to screen readers.',
  'web.legal.accessibility.measures.zoom':
    'Layouts work at 320 pixels wide and at 200 percent zoom without horizontal page scrolling. Wide tables scroll inside their own container.',
  'web.legal.accessibility.measures.motion':
    'A reduced motion preference removes every non essential transition.',
  'web.legal.accessibility.measures.targets':
    'Touch targets are at least 44 pixels on a coarse pointer.',
  'web.legal.accessibility.known.title': 'Known gaps',
  'web.legal.accessibility.known.body':
    'We will list specific known issues here with a fix date as they are found, rather than claiming full conformance. An independent audit is planned before general availability and its findings will be published here.',
  'web.legal.accessibility.feedback.title': 'Tell us about a barrier',
  'web.legal.accessibility.feedback.body':
    'Describe what you were trying to do, the page, and the assistive technology you use. We reply within five business days and will offer another way to complete the task while we fix it.',

  /* API and MCP terms ---------------------------------------------------- */
  'web.legal.apiTerms.title': 'API and MCP Terms',
  'web.legal.apiTerms.summary':
    'Additional terms for programmatic access, including agent credentials, rate limits and what a service account may never do.',
  'web.legal.apiTerms.credentials.title': 'Credentials',
  'web.legal.apiTerms.credentials.body':
    'An API key or agent credential identifies a scoped service account. It is not a copy of a person account and it never inherits their full permissions. Keys are shown once, are revocable at any time, and must not be embedded in a client application or a public repository.',
  'web.legal.apiTerms.scopes.title': 'Scopes',
  'web.legal.apiTerms.scopes.body':
    'Reading, drafting, requesting approval, scheduling, publishing immediately, cancelling, analytics and billing are separate scopes. Request the smallest set the integration needs. Immediate publishing and other high risk actions require explicit human confirmation by default and that default is set per workspace, not per credential.',
  'web.legal.apiTerms.limits.title': 'Rate limits and idempotency',
  'web.legal.apiTerms.limits.body':
    'Every write requires an idempotency key. Replaying a request with the same key returns the original result. Rate limits are published in the documentation and are returned in the response headers, and a limit response tells you when it resets.',
  'web.legal.apiTerms.agents.title': 'Agent behaviour',
  'web.legal.apiTerms.agents.body':
    'A single call may not silently publish to every connected account. Bulk actions, a new domain, a new account, a sensitive category, a paid endorsement, a privacy change or content altered after approval always escalate for a human decision. Every agent and every workspace has a kill switch.',
  'web.legal.apiTerms.prohibited.title': 'Not permitted through the API',
  'web.legal.apiTerms.prohibited.body':
    'Reselling access without a written agreement, using Relay as a relay for content you are not authorized to publish, circumventing approval policy, and any use that breaks the Acceptable Use Policy. Programmatic access is subject to the same anti spam controls as the web app.',
  'web.legal.apiTerms.changes.title': 'Change policy',
  'web.legal.apiTerms.changes.body':
    'Additive changes ship without notice. Breaking changes get a new version, an announced deprecation window and a migration note on the changelog. Error codes do not change meaning within a version.',

  /* Affiliate terms ------------------------------------------------------ */
  'web.legal.affiliate.title': 'Affiliate and Creator Terms',
  'web.legal.affiliate.summary':
    'What we pay, what we require, and what will get an account closed.',
  'web.legal.affiliate.commission.title': 'Commission',
  'web.legal.affiliate.commission.body':
    'Recurring commission on referred subscriptions for up to twelve months, subject to fraud review. Commission is held until the refund window closes and is reversed if the customer refunds. Payouts run through Polar.',
  'web.legal.affiliate.disclosure.title': 'Disclosure is not optional',
  'web.legal.affiliate.disclosure.body':
    'Every place you share a referral link must disclose the commercial relationship clearly and close to the link, in the language of the audience. This applies to videos, posts, newsletters, articles and community replies alike.',
  'web.legal.affiliate.honesty.title': 'Paid for work, not for praise',
  'web.legal.affiliate.honesty.body':
    'A sponsored tutorial contract never requires a positive conclusion. You may publish criticism and still be paid. We do not buy reviews, votes, ratings or installs, and we do not offer an incentive conditional on a positive review.',
  'web.legal.affiliate.prohibited.title': 'Grounds for closing an affiliate account',
  'web.legal.affiliate.prohibited.brandBidding':
    'Bidding on our brand terms in paid search, or running ads that imply you are us.',
  'web.legal.affiliate.prohibited.spam':
    'Unsolicited email, mass community posting, or link dropping in threads that did not ask.',
  'web.legal.affiliate.prohibited.cookieStuffing':
    'Cookie stuffing, forced clicks, self referral and coupon squatting.',
  'web.legal.affiliate.prohibited.claims':
    'Inventing customer results, fabricating a testimonial, or claiming Relay does something it does not, including anything about AI media generation.',
  'web.legal.affiliate.prohibited.trademark':
    'Registering a domain, handle or app listing that uses our name in a way that suggests you are the company.',

  /* ---------------------------------------------------------------------- */
  /* Platform names and per platform facts                                   */
  /* ---------------------------------------------------------------------- */

  'web.marketing.provider.x.label': 'X',
  'web.marketing.provider.linkedin.label': 'LinkedIn',
  'web.marketing.provider.instagram.label': 'Instagram',
  'web.marketing.provider.facebook.label': 'Facebook',
  'web.marketing.provider.youtube.label': 'YouTube',
  'web.marketing.provider.tiktok.label': 'TikTok',
  'web.marketing.provider.threads.label': 'Themen',
  'web.marketing.provider.bluesky.label': 'Bluesky',

  'web.marketing.provider.x.accountTypes':
    'Ein persönliches oder geschäftliches X-Konto, das Sie kontrollieren.',
  'web.marketing.provider.x.restriction':
    'Für die automatisierte Veröffentlichung ist eine ausdrückliche Einwilligung des Kontoinhabers erforderlich, die Relay protokolliert. Doppelte oder im Wesentlichen ähnliche Beiträge über mehrere Konten hinweg sind nicht gestattet und es werden keine unaufgeforderten automatisierten Antworten erstellt.',
  'web.marketing.provider.x.cost':
    'X berechnet für jeden API-Vorgang Gebühren und für einen Beitrag, der eine URL enthält, weitere Gebühren. Relay schätzt die Kosten vor Ihrer Bestätigung und gibt sie ohne Aufschlag weiter.',

  'web.marketing.provider.linkedin.accountTypes':
    'Ein Mitgliederprofil oder eine Organisationsseite, auf der Sie die richtige Rolle innehaben.',
  'web.marketing.provider.linkedin.restriction':
    'Für die Veröffentlichung im Namen einer Organisation sind ein genehmigtes Community-Management-Produkt und eine verifizierte Geschäftsidentität erforderlich. Die Analyse von Mitgliederbeiträgen hängt von einer Leseberechtigung ab, die LinkedIn für neue Bewerbungen gesperrt hat, sodass Relay diese nicht anbieten wird.',
  'web.marketing.provider.linkedin.cost':
    'Keine Gebühr pro Vorgang. Es gelten die Anmelde- und Tageslimits für Mitglieder.',

  'web.marketing.provider.instagram.accountTypes':
    'Ein professioneller Instagram-Account, ein Unternehmen oder ein YouTuber.',
  'web.marketing.provider.instagram.restriction':
    'Die Veröffentlichung von Instagram-Inhalten ist nur für professionelle Konten verfügbar. Ein Verbraucherkonto kann von keiner Anwendung veröffentlicht werden, auch nicht von dieser. Beim Veröffentlichen werden der offizielle Container und die Veröffentlichungssequenz verwendet, und Relay bestätigt den Endstatus, anstatt den Upload als Erfolg zu melden.',
  'web.marketing.provider.instagram.cost':
    'Keine Gebühr pro Vorgang. Eine Meta-App-Überprüfung und eine Unternehmensverifizierung sind erforderlich.',

  'web.marketing.provider.facebook.accountTypes': 'Eine von Ihnen verwaltete Facebook-Seite.',
  'web.marketing.provider.facebook.restriction':
    'Das Veröffentlichungsziel ist eine Seite. Die Automatisierung eines persönlichen Profils wird von der API nicht angeboten und Relay versucht dies auch nicht.',
  'web.marketing.provider.facebook.cost':
    'Keine Gebühr pro Vorgang. Eine Meta-App-Überprüfung und eine Unternehmensverifizierung sind erforderlich.',

  'web.marketing.provider.youtube.accountTypes':
    'Ein YouTube-Kanal, der über Ihr Google-Konto verbunden ist.',
  'web.marketing.provider.youtube.restriction':
    'Ein Projekt, das das Google API-Compliance-Audit nicht bestanden hat, kann nur als privat hochgeladen werden. Relay wird öffentliche Uploads erst dann als verfügbar beschreiben, wenn die Prüfung bestanden wurde, und auf dem Verbindungsbildschirm wird angezeigt, in welchem Bundesstaat Ihre Uploads landen.',
  'web.marketing.provider.youtube.cost':
    'Keine Gebühr pro Vorgang. Es gilt ein Tageskontingent, das nicht projektübergreifend geteilt werden kann.',

  'web.marketing.provider.tiktok.accountTypes': 'Ein TikTok-Konto mit Direct-Post-Autorisierung.',
  'web.marketing.provider.tiktok.restriction':
    'Bis die Prüfung der Content Posting API erfolgreich ist, sind die Beiträge privat und es gelten Obergrenzen pro Konto. Zum Zeitpunkt der Veröffentlichung ruft Relay die aktuellen Erstellerinformationen ab, zeigt die verfügbaren Datenschutzoptionen an, ohne eine vorab auszuwählen, und fragt nach den Kommentar-, Duett- und Stitch-Einstellungen sowie der Erklärung zum kommerziellen Inhalt.',
  'web.marketing.provider.tiktok.cost':
    'Keine Gebühr pro Vorgang. Im ungeprüften Modus gelten tägliche Beitragsobergrenzen.',

  'web.marketing.provider.threads.accountTypes':
    'Ein Threads-Profil, das mit einem professionellen Instagram-Konto verknüpft ist.',
  'web.marketing.provider.threads.restriction':
    'Die Veröffentlichung folgt der Meta-Container- und Veröffentlichungssequenz. Die Funktionen werden anhand der offiziellen Sammlung überprüft, bevor hier etwas als unterstützt bezeichnet wird.',
  'web.marketing.provider.threads.cost': 'Keine Gebühr pro Vorgang.',

  'web.marketing.provider.bluesky.accountTypes':
    'Ein Bluesky-Konto bei einem beliebigen Hosting-Anbieter.',
  'web.marketing.provider.bluesky.restriction':
    'Ein offenes Protokoll ohne Antragsprüfungsschritt. Es gelten weiterhin Raten- und Datensatzgrößenbeschränkungen, die vor dem Versand durchgesetzt werden.',
  'web.marketing.provider.bluesky.cost': 'Keine Gebühr pro Vorgang.',
  'web.marketing.provider.mastodon.label': 'Mastodon',
  'web.marketing.provider.mastodon.accountTypes':
    'Ein Mastodon-Konto auf einer beliebigen Instanz.',
  'web.marketing.provider.mastodon.restriction':
    'Ein offenes Protokoll ohne App-Prüfung. Die Zeichenbegrenzung setzt jede Instanz selbst, deren Ratenlimits werden eingehalten.',
  'web.marketing.provider.mastodon.cost': 'Keine Gebühr pro Vorgang.',
  'web.marketing.provider.telegram.label': 'Telegram',
  'web.marketing.provider.telegram.accountTypes':
    'Ein Telegram-Bot, den Sie kontrollieren, der in einen Kanal oder eine Gruppe postet.',
  'web.marketing.provider.telegram.restriction':
    'Ein Bot kann nur dort posten, wo er hinzugefügt wurde. Das Token ist eine Anwendungsanmeldedaten und der Ziel-Chat wird pro Verbindung gewählt.',
  'web.marketing.provider.telegram.cost': 'Keine Gebühr pro Vorgang.',
  'web.marketing.provider.reddit.label': 'Reddit',
  'web.marketing.provider.reddit.accountTypes': 'Ein Reddit-Konto, das zum Posten berechtigt ist.',
  'web.marketing.provider.reddit.restriction':
    'Das Schreiben auf Reddit erfordert eine genehmigte App. Gepostet wird als Text- oder Linkbeitrag in erlaubten Subreddits; keine automatisierten Kommentare oder Stimmen.',
  'web.marketing.provider.reddit.cost': 'Keine Gebühr pro Vorgang.',
  'web.marketing.provider.wordpress.label': 'WordPress',
  'web.marketing.provider.wordpress.accountTypes': 'Eine WordPress-Site mit App-Passwort.',
  'web.marketing.provider.wordpress.restriction':
    'Beiträge erscheinen über die REST-API der Site als verbundener Benutzer. Bild- und Video-Upload ist noch nicht gebaut.',
  'web.marketing.provider.wordpress.cost': 'Keine Gebühr pro Vorgang.',
  'web.marketing.provider.medium.label': 'Medium',
  'web.marketing.provider.medium.accountTypes': 'Ein Medium-Autorenprofil, verbunden per OAuth.',
  'web.marketing.provider.medium.restriction':
    'Beiträge erscheinen als öffentliche Geschichten in Markdown. Die Integrations-API hat kein Löschen, daher wird es nicht angeboten.',
  'web.marketing.provider.medium.cost': 'Keine Gebühr pro Vorgang.',
  'web.marketing.provider.devto.label': 'Dev.to',
  'web.marketing.provider.devto.accountTypes':
    'Ein Dev.to-Profil, verbunden mit seinem API-Schlüssel.',
  'web.marketing.provider.devto.restriction':
    'Artikel erscheinen als öffentliche Markdown-Beiträge. Bild-Upload und Analysen sind noch nicht gebaut.',
  'web.marketing.provider.devto.cost': 'Keine Gebühr pro Vorgang.',
  'web.marketing.provider.pinterest.label': 'Pinterest',
  'web.marketing.provider.pinterest.accountTypes':
    'Ein Pinterest-Geschäftskonto, verbunden per OAuth.',
  'web.marketing.provider.pinterest.restriction':
    'Ein Pin erfordert ein Bild und ein eigenes Board. Schreiben erfordert eine App-Prüfung; die Boards werden beim Verbinden gelesen.',
  'web.marketing.provider.pinterest.cost': 'Keine Gebühr pro Vorgang.',
  'web.marketing.provider.discord.label': 'Discord',
  'web.marketing.provider.discord.accountTypes':
    'Ein Discord-Bot, den Sie kontrollieren, der in Textkanäle postet.',
  'web.marketing.provider.discord.restriction':
    'Der Bot kann nur in Kanäle posten, die er sieht. Textnachrichten werden unterstützt; Dateianhänge noch nicht.',
  'web.marketing.provider.discord.cost': 'Keine Gebühr pro Vorgang.',
  'web.marketing.provider.slack.label': 'Slack',
  'web.marketing.provider.slack.accountTypes':
    'Ein Slack-Workspace, verbunden über eine OAuth-App.',
  'web.marketing.provider.slack.restriction':
    'Nachrichten gehen in öffentliche und private Kanäle, in denen die App ist. Datei-Upload und Analysen sind noch nicht gebaut.',
  'web.marketing.provider.slack.cost': 'Keine Gebühr pro Vorgang.',

  /* ---------------------------------------------------------------------- */
  /* Capability matrix notes                                                 */
  /* ---------------------------------------------------------------------- */

  'web.capabilities.short.supported': 'Unterstützt',
  'web.capabilities.short.unsupported': 'Plattform bietet es nicht an',
  'web.capabilities.short.not_implemented': 'Noch nicht gebaut',
  'web.capabilities.short.requires_review': 'Plattformüberprüfung erforderlich',
  'web.capabilities.notesTitle': 'Notizen und Quellen',
  'web.capabilities.noteRef': 'Beachten Sie {number}',
  'web.capabilities.summary':
    '{supported, plural, one {# Fähigkeit unterstützt} other {# unterstützte Funktionen}}, {requiresReview, plural, one {# Warten auf eine Plattformüberprüfung} other {# Warten auf eine Plattformüberprüfung}}, {notImplemented, plural, one {# noch nicht erstellt} other {# noch nicht erstellt}}, {unsupported, plural, one {# die Plattform bietet nicht an} other {# die Plattform bietet nicht an}}.',
  'web.capabilities.buildState.title': 'Noch überträgt kein Connector Kundenverkehr',
  'web.capabilities.buildState.body':
    'Relais ist im Bau. Diese Tabelle spiegelt die aktuellen Connector-Definitionen wider, weshalb die meisten Zellen als noch nicht erstellt angezeigt werden. Eine Zelle wird erst dann unterstützt, wenn dieser Connector seine „Definition of Done“ besteht, einschließlich Vertragstests mit den aufgezeichneten Plattformbefestigungen. Die Zellen, die besagen, dass eine Plattform etwas nicht anbietet oder dies hinter einer Bewertung verbirgt, sind Fakten über die Plattform und bereits endgültig.',
  'web.capabilities.note.instagramProfessional':
    'Nur professionelle Konten. Ein Verbraucherkonto kann von keiner Anwendung veröffentlicht werden.',
  'web.capabilities.note.facebookPagesOnly':
    'Nur Seiten. Die API veröffentlicht nicht in einem persönlichen Profil.',
  'web.capabilities.note.youtubeAudit':
    'Bis das Google API-Compliance-Audit erfolgreich ist, gelten Uploads als privat.',
  'web.capabilities.note.tiktokAudit':
    'Bis die Prüfung der Content Posting API erfolgreich ist, sind Beiträge privat und begrenzt.',
  'web.capabilities.note.tiktokPrivacy':
    'Die Datenschutzoption wird zum Zeitpunkt der Veröffentlichung abgerufen und muss von einer Person ausgewählt werden.',
  'web.capabilities.note.linkedinMemberAnalytics':
    'Für die Analyse von Mitgliederbeiträgen ist eine Leseberechtigung erforderlich, die LinkedIn für neue Bewerbungen geschlossen hat.',
  'web.capabilities.note.linkedinOrgAccess':
    'Erfordert ein zugelassenes Community-Management-Produkt und ein verifiziertes Unternehmen.',
  'web.capabilities.note.linkedinDocuments':
    'LinkedIn ist die einzige verbundene Plattform mit einem Dokumentbeitragstyp.',
  'web.capabilities.note.metaReview':
    'Erfordert Meta-App-Überprüfung und Unternehmensverifizierung.',
  'web.capabilities.note.xConsent':
    'Für die automatisierte Veröffentlichung ist eine schriftliche Einwilligung des Kontoinhabers erforderlich.',
  'web.capabilities.note.xDisclosure':
    'Die Plattform stellt ein mit KI erstelltes Feld bereit, das Relay anhand Ihrer Erklärung festlegt.',
  'web.capabilities.note.noDestinations':
    'Diese Plattform hat kein Zielkonzept wie eine Seite, ein Board oder eine Community.',
  'web.capabilities.note.noThreads':
    'Diese Plattform verfügt über keine native Multi-Post-Sequenz.',
  'web.capabilities.note.noDocuments': 'Diese Plattform verfügt über keinen Dokumentbeitragstyp.',
  'web.capabilities.note.videoOnly': 'Diese Plattform akzeptiert nur Video-Uploads.',
  'web.capabilities.note.noAltText':
    'Diese Plattform akzeptiert über ihre Veröffentlichungs-API keinen Alternativtext.',
  'web.capabilities.note.noPrivacyChoice':
    'Diese Plattform bietet über ihre API keine Datenschutzoption pro Beitrag.',
  'web.capabilities.note.noThumbnail':
    'Diese Plattform akzeptiert über ihre API keine benutzerdefinierten Miniaturansichten.',
  'web.capabilities.note.inBuild':
    'Die Plattform bietet dies an. Relay hat es noch nicht versendet.',
  'web.capabilities.note.noCarousel': 'Die Plattform bietet kein wischbares Karussell.',
  'web.capabilities.note.noDisclosure':
    'Die Plattform hat kein Offenlegungsfeld für KI- oder kommerzielle Inhalte.',
  'web.capabilities.note.noAnalytics':
    'Die Plattform stellt über ihre offizielle API keine Engagement-Kennzahlen bereit.',
  'web.capabilities.note.redditReview':
    'Das Schreiben auf Reddit erfordert eine genehmigte Daten-API-Anwendung.',
  'web.capabilities.note.redditMedia': 'Bild- und Videobeiträge sind für Reddit noch nicht gebaut.',
  'web.capabilities.note.mediumImages': 'Die Integrations-API akzeptiert keine Bildanhänge.',
  'web.capabilities.note.mediumNoDelete': 'Die Integrations-API hat keinen Lösch-Endpunkt.',
  'web.capabilities.note.devtoImages':
    'Die API akzeptiert nur Artikeltexte; Bild-Upload ist noch nicht gebaut.',
  'web.capabilities.note.pinterestNeedsImage':
    'Ein Pin erfordert ein Bild; reine Text-Pins gibt es nicht.',
  'web.capabilities.note.pinterestReview':
    'Das Schreiben auf Pinterest erfordert genehmigten App-Zugriff.',

  /* ---------------------------------------------------------------------- */
  /* Status page surfaces                                                    */
  /* ---------------------------------------------------------------------- */

  'web.status.surface.web': 'Web-App',
  'web.status.surface.api': 'REST-API',
  'web.status.surface.mcp': 'MCP-Server',
  'web.status.surface.cli': 'CLI',
  'web.status.surface.webhooks': 'Webhook-Zustellung',
  'web.status.surface.publishing': 'Verlagsmitarbeiter',
  'web.status.surface.media': 'Medienverarbeitung',
  'web.status.surface.analytics': 'Analytics-Sammlung',
  'web.status.surface.links': 'Kurze Link-Weiterleitungen',
  'web.status.surface.checkout': 'Kasse und Abrechnung',
  'web.status.preLaunch.title': 'Relay ist noch nicht allgemein verfügbar',
  'web.status.preLaunch.body':
    'Diese Seite ist live, bevor das Produkt verfügbar ist, sodass die Meldegewohnheit bereits beim ersten Kunden besteht und nicht erst nach dem ersten Ausfall hinzugefügt wird. Noch im Bau befindliche Flächen werden als solche gekennzeichnet, anstatt als fehlerfrei angezeigt zu werden.',

  /* ---------------------------------------------------------------------- */
  /* Comparison targets                                                      */
  /* ---------------------------------------------------------------------- */

  'web.compare.product.postiz': 'Postiz',
  'web.compare.product.buffer': 'Puffer',
  'web.compare.product.hootsuite': 'Hootsuite',
  'web.compare.product.later': 'Später',
  'web.compare.product.metricool': 'Metricool',
  'web.compare.product.publer': 'Herausgeber',
  'web.compare.product.socialbee': 'SocialBee',
  'web.compare.product.typefully': 'Typischerweise',
  'web.compare.product.publishingApis': 'Entwickler-Veröffentlichungs-APIs',
  'web.compare.state.factCheckPending': 'Faktencheck läuft',

  /* ---------------------------------------------------------------------- */
  /* Tool radar categories                                                   */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.category.video': 'Videogenerierung und -bearbeitung',
  'web.toolRadar.category.image': 'Bildgenerierung und -bearbeitung',
  'web.toolRadar.category.audio': 'Audio, Stimme und Musik',
  'web.toolRadar.category.ugc': 'Video im Avatar- und Creator-Stil',
  'web.toolRadar.category.clipping': 'Von langen Videos zu kurzen Clips',
  'web.toolRadar.category.design': 'Design und Layout',
  'web.toolRadar.category.research': 'Recherche und Quellensammlung',
  'web.toolRadar.category.workflow': 'Workflow-Automatisierung',

  /* ---------------------------------------------------------------------- */
  /* Opportunity categories                                                  */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.category.launch': 'Produkteinführungs- und Startup-Verzeichnisse',
  'web.opportunities.category.review': 'Software- und Rezensionsverzeichnisse',
  'web.opportunities.category.marketplace': 'Integrations- und Automatisierungsmarktplätze',
  'web.opportunities.category.community':
    'Community-Präsentationsthreads, die Einreichungen ermöglichen',
  'web.opportunities.category.partner': 'Partnerökosysteme und Integrationsverzeichnisse',
  'web.opportunities.category.editorial': 'Gast-Tutorials, Podcasts und Newsletter',
  'web.opportunities.category.openSource': 'Open-Source-Listen und Dokumentationsressourcen',

  /* ---------------------------------------------------------------------- */
  /* Subprocessors and retention                                             */
  /* ---------------------------------------------------------------------- */

  'web.legal.subprocessors.supabase.label': 'Supabase',
  'web.legal.subprocessors.supabase.purpose':
    'Managed PostgreSQL, authentication and object storage.',
  'web.legal.subprocessors.supabase.data':
    'Account records, content, media, schedules, receipts and audit events.',
  'web.legal.subprocessors.temporal.label': 'Temporal Cloud',
  'web.legal.subprocessors.temporal.purpose':
    'Durable execution of publishing, retry and scheduling workflows.',
  'web.legal.subprocessors.temporal.data':
    'Workflow inputs limited to identifiers and minimized payloads.',
  'web.legal.subprocessors.polar.label': 'Polar',
  'web.legal.subprocessors.polar.purpose':
    'Merchant of record: checkout, subscriptions, taxes, invoices and refunds.',
  'web.legal.subprocessors.polar.data':
    'Name, email, billing address, payment method held by Polar, and subscription state.',
  'web.legal.subprocessors.deepseek.label': 'DeepSeek',
  'web.legal.subprocessors.deepseek.purpose':
    'Text assistance, translation and transcreation, and planning suggestions.',
  'web.legal.subprocessors.deepseek.data':
    'Only the text you submit to an AI feature and the brand context you attached to it.',
  'web.legal.subprocessors.hosting.label': 'Application hosting and content delivery',
  'web.legal.subprocessors.hosting.purpose':
    'Serving the web app, the API and the short link service.',
  'web.legal.subprocessors.hosting.data': 'Request metadata and redacted logs.',
  'web.legal.subprocessors.email.label': 'Transactional email delivery',
  'web.legal.subprocessors.email.purpose':
    'Sign in links, approval requests, publish result notifications and trial reminders.',
  'web.legal.subprocessors.email.data': 'Name, email address and the message content.',
  'web.legal.subprocessors.monitoring.label': 'Error and performance monitoring',
  'web.legal.subprocessors.monitoring.purpose':
    'Diagnosing failures in publishing and in the interface.',
  'web.legal.subprocessors.monitoring.data':
    'Redacted stack traces, request identifiers and workspace identifiers. Post content is stripped.',
  'web.legal.subprocessors.region.pending': 'Region being confirmed',
  'web.legal.subprocessors.vendorPending': 'Vendor being selected',

  'web.legal.retention.column.data': 'Data',
  'web.legal.retention.column.period': 'How long it is kept',
  'web.legal.retention.credentials.label': 'Active platform credentials',
  'web.legal.retention.credentials.period':
    'Encrypted while the connection is active. Revoked at the platform and deleted here as soon as you disconnect.',
  'web.legal.retention.oauthState.label': 'OAuth transaction state',
  'web.legal.retention.oauthState.period': 'Minutes, then deleted.',
  'web.legal.retention.drafts.label': 'Drafts and media',
  'web.legal.retention.drafts.period':
    'While the account is active, or your own retention setting, with a trash grace period.',
  'web.legal.retention.receipts.label': 'Publication receipts and audit events',
  'web.legal.retention.receipts.period':
    'Kept for the plan and legal retention period, minimized, and exportable at any time.',
  'web.legal.retention.rawProvider.label': 'Raw platform responses',
  'web.legal.retention.rawProvider.period':
    'The shortest period needed for debugging and compliance, then minimized or deleted.',
  'web.legal.retention.metrics.label': 'Analytics observations',
  'web.legal.retention.metrics.period':
    'The plan retention period, within what the platform terms allow.',
  'web.legal.retention.securityLogs.label': 'Security logs',
  'web.legal.retention.securityLogs.period':
    'A fixed window between 30 and 180 days depending on the risk of the event.',
  'web.legal.retention.billing.label': 'Billing records',
  'web.legal.retention.billing.period':
    'The statutory accounting retention period, held by Polar and by us.',
  'web.legal.retention.deletedAccount.label': 'A deleted account',
  'web.legal.retention.deletedAccount.period':
    'Credentials revoked and scheduled work cancelled immediately. Full deletion completes within the published window, apart from lawful billing records.',
  'web.legal.retention.backups.label': 'Backups',
  'web.legal.retention.backups.period':
    'Encrypted and access controlled, expiring on a documented rotation. A deletion propagates through the restore process.',

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.footer.product': 'Produkt',
  'web.footer.company': 'Unternehmen',
  'web.footer.resources': 'Ressourcen',
  'web.footer.legal': 'Legal',
  'web.footer.developers': 'Entwickler',
  'web.footer.statement':
    'Relay veröffentlicht ausschließlich über offizielle Plattform-APIs. Die Verfügbarkeit von Connectors hängt von den Genehmigungen ab, die von den Plattformen kontrolliert werden, und jeder Leistungsanspruch auf dieser Website ist datiert und mit Quellenangabe versehen.',
  'web.footer.noAffiliation':
    'Plattformnamen und -marken gehören ihren Eigentümern. Ihre Verwendung hier identifiziert einen Konnektor und stellt keine Billigung oder Partnerschaft dar.',
  'web.footer.copyright': 'Relais {year}',
} as const;
