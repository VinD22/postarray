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
  'analytics.chart.legend': 'In dieser Tabelle dargestellte Serien',
  'analytics.tab.overview': 'Übersicht',
  'analytics.tab.experiments': 'Experimente',
  'analytics.tab.links': 'Verfolgte Links',
  'analytics.tab.label': 'Analytics-Abschnitte',

  'analytics.question.baseline':
    'Welche Beiträge haben sich von Ihrer eigenen Grundlinie entfernt?',
  'analytics.question.baselineHelp':
    'Jeder Beitrag wird mit Ihren eigenen aktuellen Beiträgen auf demselben Konto und im selben Format verglichen. Nichts hier kann Sie mit einem anderen Arbeitsplatz oder einem anderen Unternehmen vergleichen.',
  'analytics.question.accounts': 'Welche Konten benötigen Aufmerksamkeit?',
  'analytics.question.next': 'Was lohnt sich als nächstes zu testen?',

  'analytics.filter.project': 'Marke',
  'analytics.filter.accounts': 'Konten',
  'analytics.filter.allAccounts': 'Alle verbundenen Konten',
  'analytics.filter.range': 'Datumsbereich',
  'analytics.filter.format': 'Inhaltsformat',
  'analytics.filter.allFormats': 'Alle Formate',
  'analytics.filter.comparePrevious': 'Vergleichen Sie mit der Vorperiode',
  'analytics.filter.applied':
    '{count, plural, =0 {Keine Filter} one {# Filter} other {# Filter}} angewendet. {results, plural, =0 {Keine Beiträge stimmen überein} one {# Beiträge stimmen überein} other {# Beiträge stimmen überein}}.',

  'analytics.rankMetric.label': 'Ordnen Sie Beiträge nach',
  'analytics.rankMetric.help':
    'Im Staffellauf gibt es keine kombinierte Wertung. Wählen Sie eine Metrik aus, deren Definition Sie vertrauen, und die Tabelle wird nur nach dieser Metrik sortiert.',
  'analytics.rankMetric.chosen': 'Geordnet nach {metric}, wie von jedem Kontoanbieter angegeben.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Bewusstsein',
  'analytics.outcome.awarenessHelp':
    'Wie oft wurde der Beitrag zugestellt oder gesehen? Dies wird von den Anbietern unterschiedlich gezählt, sodass ein Wert nur über die Zeit mit sich selbst vergleichbar ist.',
  'analytics.outcome.consumption': 'Verbrauch',
  'analytics.outcome.consumptionHelp':
    'Wie viele der Beiträge haben sich die Leute tatsächlich angesehen oder gelesen?',
  'analytics.outcome.interaction': 'Interaktion',
  'analytics.outcome.interactionHelp':
    'Was die Leute auf der Plattform gemacht haben: Likes, Kommentare, Shares und Saves.',
  'analytics.outcome.conversion': 'Konvertierung',
  'analytics.outcome.conversionHelp':
    'Was die Leute taten, nachdem sie die Plattform verlassen hatten. Nur nachverfolgte Links können diese Frage beantworten, und zwar nur für die Links, die Sie zum Nachverfolgen ausgewählt haben.',
  'analytics.outcome.separateNote':
    'Diese vier Gruppen werden separat gezählt. Würde man sie addieren, würde dieselbe Person mehr als einmal gezählt.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Im ausgewählten Bereich veröffentlichte Beiträge, wobei jeder einzelne mit Ihrer eigenen aktuellen Baseline verglichen wird.',
  'analytics.table.post': 'Beitrag',
  'analytics.table.account': 'Konto',
  'analytics.table.format': 'Formatieren',
  'analytics.table.published': 'Veröffentlicht',
  'analytics.table.value': 'Wert',
  'analytics.table.delta': 'Gegen die Grundlinie',
  'analytics.table.sample': 'Probe',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Beweise',
  'analytics.table.openEvidence': 'Zeigen Sie den Beweis für {post}',
  'analytics.table.rowActions': 'Aktionen für {post}',
  'analytics.table.openPost': 'Offene Beitragsmetriken',
  'analytics.table.openReceipt': 'Veröffentlichungsbeleg öffnen',
  'analytics.table.noBaseline': 'Noch keine Grundlinie',
  'analytics.table.noBaselineReason':
    'Auf diesem Konto sind weniger als {required} vergleichbare Beiträge vorhanden. Ein Vergleich wäre Rauschen, daher wird keiner angezeigt.',
  'analytics.table.sortBy': 'Sortieren nach {column}',
  'analytics.table.detailToggle': 'Details',

  'analytics.delta.above': '{percent} über der Basislinie',
  'analytics.delta.below': '{percent} unter der Basislinie',
  'analytics.delta.level': 'Im Einklang mit der Grundlinie',
  'analytics.delta.unavailable': 'Kein Vergleich',

  'analytics.evidence.title': 'Wie dieser Vergleich zustande kam',
  'analytics.evidence.baseline':
    'Basislinie: der Median {metric} des vorherigen {count, plural, one {# vergleichbarer Beitrag} other {# vergleichbarer Beitrag}} auf {account}.',
  'analytics.evidence.comparableBy':
    'Vergleichbar bedeutet dasselbe Konto, dasselbe Inhaltsformat ({format}) und eine Veröffentlichungszeit innerhalb desselben Zeitraums.',
  'analytics.evidence.postsUsed': 'Für die Basislinie verwendete Beiträge',
  'analytics.evidence.excluded':
    '{count, plural, =0 {Keine Beiträge wurden ausgeschlossen} one {# Beitrag wurde ausgeschlossen} other {# Beiträge wurden ausgeschlossen}}, weil die Metrik für sie nicht verfügbar war.',
  'analytics.evidence.smallSample':
    'Mit {count, plural, one {# Beitrag} other {# Beiträge}} in der Grundlinie verschiebt ein einzelner ungewöhnlicher Beitrag den Median um ein großes Stück. Betrachten Sie dies als Signal zum erneuten Testen, nicht als Ergebnis.',
  'analytics.evidence.confounders': 'Was das nicht erklärt',
  'analytics.evidence.confounder.time':
    'Die Veröffentlichungszeit variierte je nach Baseline-Beitrag.',
  'analytics.evidence.confounder.format':
    'Bildbeiträge und Videobeiträge sind hier nicht direkt vergleichbar.',
  'analytics.evidence.confounder.followers':
    'Die Followerzahl auf {account} hat sich in diesem Zeitraum um {percent} verändert.',
  'analytics.evidence.confounder.paid':
    'Relay kann nicht sagen, ob einer dieser Beiträge bezahlt verbreitet wurde.',
  'analytics.evidence.confounder.provider':
    '{provider} hat in diesem Zeitraum die Art und Weise geändert, wie {metric} gemeldet wird.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'Was {metric} bedeutet',
  'analytics.definition.inlineHeading': 'Definition',
  'analytics.definition.observedAt': 'Beobachtet {dateTime}.',
  'analytics.definition.sourceLink': 'Dokumentation des Anbieters',
  'analytics.definition.verifiedOn': 'Mit der Anbieterdokumentation auf {date} abgeglichen.',
  'analytics.definition.panelTitle': 'Metrikdefinitionen in dieser Ansicht',
  'analytics.definition.panelIntro':
    'Jede Zahl auf diesem Bildschirm stammt aus einem benannten Anbieterfeld. Die folgenden Definitionen werden auch neben jedem Wert wiederholt, sodass nichts Wichtiges nur in einem Tooltip weiterlebt.',
  'analytics.definition.aggregation.sum': 'Aggregiert durch Addition jeder Beobachtung.',
  'analytics.definition.aggregation.average': 'Aggregiert als Mittelwert.',
  'analytics.definition.aggregation.median': 'Aggregiert als Median.',
  'analytics.definition.aggregation.last': 'Die jüngste Beobachtung.',
  'analytics.definition.aggregation.delta':
    'Der Wechsel zwischen der ersten und letzten Beobachtung.',
  'analytics.definition.aggregation.none': 'Als Einzelbeobachtung gemeldet.',
  'analytics.definition.denominator.none': 'Dies ist eine Zählung, keine Rate.',
  'analytics.definition.historyWindow':
    '{provider} speichert {days, plural, one {# Tag} other {# Tage}} des Verlaufs für dieses Feld.',
  'analytics.definition.historyWindowNone':
    '{provider} gibt für dieses Feld kein Verlaufslimit an.',

  'analytics.definition.term.providerField': 'Anbieterfeld',
  'analytics.definition.term.unit': 'Einheit',
  'analytics.definition.term.denominator': 'Nenner',
  'analytics.definition.term.aggregation': 'Wie es aggregiert wird',
  'analytics.definition.term.history': 'Verlauf, den der Anbieter führt',
  'analytics.definition.term.definition': 'Was der Anbieter sagt, bedeutet es',

  'analytics.unit.count': 'Eine Zählung von Ereignissen',
  'analytics.unit.seconds': 'Sekunden',
  'analytics.unit.percent': 'Ein Prozentsatz, den der Anbieter bereits berechnet hat',
  'analytics.unit.ratio': 'Ein Verhältnis-Relay, das aus zwei Anbieterfeldern berechnet wird',
  'analytics.unit.currency_minor': 'Ein Geldbetrag in kleineren Einheiten',

  'analytics.denominator.none': 'Dies ist eine Zählung, keine Rate. Es hat keinen Nenner.',
  'analytics.denominator.impressions': 'Geteilt nach Eindrücken',
  'analytics.denominator.reach': 'Geteilt nach Reichweite',
  'analytics.denominator.views': 'Geteilt nach Ansichten',
  'analytics.denominator.followers':
    'Geteilt durch die Anzahl der Follower zum Zeitpunkt der Beobachtung',
  'analytics.denominator.sessions': 'Aufgeteilt nach Sitzungen',

  'analytics.format.text': 'Text',
  'analytics.format.image': 'Bild',
  'analytics.format.carousel': 'Karussell',
  'analytics.format.video': 'Video',
  'analytics.format.short_video': 'Kurzes Video',
  'analytics.format.long_video': 'Langes Video',
  'analytics.format.document': 'Dokument',
  'analytics.format.thread': 'Thread',

  'analytics.value.unavailableReason.notImplemented':
    'Relay hat die Zuordnung für diese Metrik auf {provider} noch nicht erstellt.',
  'analytics.value.estimated': 'Geschätzte',
  'analytics.value.estimatedMethod': 'Methode: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'Woher diese Zahlen kommen',
  'analytics.freshness.intro':
    'Die Anbieter aggregieren nach ihrem eigenen Zeitplan. Nichts auf diesem Bildschirm ist live.',
  'analytics.freshness.accountRow': '{account} auf {provider}',
  'analytics.freshness.never': 'Nie synchronisiert',
  'analytics.freshness.nextAttempt': 'Nächster Synchronisierungsversuch {relativeTime}.',
  'analytics.freshness.openStatus': 'Anbieterstatus',

  'analytics.accounts.title': 'Konten, die Aufmerksamkeit erfordern',
  'analytics.accounts.empty':
    'Jedes verbundene Konto hat in diesem Zeitraum Daten zurückgegeben. Hier braucht dich nichts.',
  'analytics.accounts.reason.permission':
    'Die Analyseberechtigung wurde nicht erteilt, als dieses Konto verbunden war.',
  'analytics.accounts.reason.expired':
    'Der Zugriff ist abgelaufen, daher wurde seit {date} keine Metrik erfasst.',
  'analytics.accounts.reason.stale': 'Die letzte erfolgreiche Synchronisierung war {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# Synchronisierungsversuch} other {# Synchronisierungsversuche}} ist in Folge fehlgeschlagen. Der aufgezeichnete Grund war {reason}.',
  'analytics.accounts.reason.noPosts':
    'Für dieses Konto wurde im ausgewählten Bereich nichts veröffentlicht.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Beobachtungen',
  'analytics.observations.intro':
    'Dies sind Beschreibungen dessen, was die Zahlen anzeigen. Sie sind keine Vorhersagen und sie begründen keine Ursache.',
  'analytics.observations.empty':
    'Es gibt noch nicht genügend veröffentlichte Geschichte, um ein Muster zu beschreiben. Veröffentlichen Sie ein paar weitere Beiträge auf demselben Konto und Format.',
  'analytics.observations.citedPosts': 'Basierend auf',
  'analytics.observations.citedPeriod': 'Zeitraum: {start} bis {end}.',
  'analytics.observations.nextTestTitle': 'Ein Test, den Sie als Nächstes durchführen könnten',
  'analytics.observations.nextTestBody':
    'Veröffentlichen Sie {count, plural, one {# weitere Beiträge} other {# weitere Beiträge}} auf {account} und ändern Sie nur {variable} und vergleichen Sie dann dieselbe Metrik. Kennzeichnen Sie es vor der Veröffentlichung als Experiment, damit der Vergleich geplant und nicht erst im Nachhinein gefunden wird.',
  'analytics.observations.tagFirst': 'Markieren Sie ein Experiment',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} im Laufe der Zeit',
  'analytics.chart.summary':
    '{metric} auf {account}, {count, plural, one {# Punkt} other {# Punkte}} von {start} auf {end}.',
  'analytics.chart.showTable': 'Als Tabelle anzeigen',
  'analytics.chart.hideTable': 'Verstecke den Tisch',
  'analytics.chart.tableCaption': 'Die gleiche Serie als Tisch.',
  'analytics.chart.columnPeriod': 'Zeitraum',
  'analytics.chart.columnValue': 'Wert',
  'analytics.chart.gapLabel': 'Keine Daten erhoben',
  'analytics.chart.gapExplained':
    'Eine Unterbrechung in der Zeile bedeutet, dass für diesen Zeitraum keine Beobachtung erfasst wurde. Es bedeutet nicht Null.',
  'analytics.chart.annotation': 'Anmerkung',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'In diesem Bereich wurden keine Beobachtungen gesammelt.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Planen Sie ein Experiment',
  'analytics.experiment.empty':
    'Noch keine Experimente. Ein Experiment ist ein Vergleich, den Sie vor der Veröffentlichung festlegen. Nur dieser Vergleich kann eine Frage beantworten.',
  'analytics.experiment.emptyExample':
    'Beispiel: Veröffentlichen Sie dieselbe Ankündigung zweimal auf X, einmal mit dem Link im Beitrag und einmal mit dem Link im ersten Kommentar, und vergleichen Sie dann die Linkklicks über 72 Stunden.',
  'analytics.experiment.name': 'Was testen Sie?',
  'analytics.experiment.namePlaceholder': 'Erster Kommentar bei 5 Minuten gegenüber 30 Minuten',
  'analytics.experiment.hypothesisPlaceholder':
    'Eine kürzere Verzögerung, bevor der erste Kommentar mehr Antworten auf X erhält.',
  'analytics.experiment.variantLabel': 'Variante {index}',
  'analytics.experiment.variantDescription': 'Was ist bei dieser Variante anders?',
  'analytics.experiment.addVariant': 'Fügen Sie eine Variante hinzu',
  'analytics.experiment.removeVariant': 'Variante {index} entfernen',
  'analytics.experiment.accounts': 'Konten inklusive',
  'analytics.experiment.windowHelp':
    'Die Messwerte ändern sich weiter, nachdem ein Beitrag online geschaltet wurde. Korrigieren Sie das Fenster jetzt, damit der Vergleich nicht zu einem Zeitpunkt durchgeführt wird, der zufällig zu einer Variante passt.',
  'analytics.experiment.windowDays':
    'Messen Sie für {count, plural, one {# Tag} other {# Tage}} nach der Veröffentlichung jedes Beitrags',
  'analytics.experiment.minSample': 'Mindestbeiträge pro Variante',
  'analytics.experiment.minSampleHelp':
    'Unterhalb dieser Zahl wird das Ergebnis als nicht schlüssig und nicht als Gewinner angezeigt.',
  'analytics.experiment.status.planned': 'Geplant',
  'analytics.experiment.status.collecting':
    'Sammeln. {published} von {target}-Beiträgen veröffentlicht.',
  'analytics.experiment.status.inconclusive': 'Vollständig, kein klarer Unterschied',
  'analytics.experiment.result.difference':
    '{variant} hat {percent} mehr {metric} als {otherVariant} aufgezeichnet.',
  'analytics.experiment.result.noDifference':
    'Die beiden Varianten liegen innerhalb von {percent} auf {metric} voneinander. Das liegt ohnehin innerhalb des Bereichs, in dem diese Beiträge variieren.',
  'analytics.experiment.result.association':
    'Dies ist eine Zuordnung, die anhand von {count, plural, one {# Beitrag} other {# Beiträge}} gemessen wird. Es beweist nicht, dass die Änderung den Unterschied verursacht hat.',
  'analytics.experiment.result.unavailable':
    '{metric} war in diesem Experiment für {count, plural, one {# Beitrag} other {# Beiträge}} nicht verfügbar, daher werden diese Beiträge ausgeschlossen und nicht als Null gezählt.',
  'analytics.experiment.result.title': 'Ergebnis',
  'analytics.experiment.completeNow': 'Schließen Sie dieses Experiment',
  'analytics.experiment.completeConfirm':
    'Das Schließen stoppt die Sammlung. Die Beiträge bleiben veröffentlicht und die Nummern bleiben verfügbar.',
  'analytics.experiment.postsTitle': 'Beiträge in diesem Experiment',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Laden von Analysen für die ausgewählten Konten',
  'analytics.state.loadingProvider': '{provider}-Analyse wird abgerufen',
  'analytics.state.empty': 'In diesem Bereich wurde nichts veröffentlicht',
  'analytics.state.emptyBody':
    'Analytics beschreiben Beiträge, die bereits veröffentlicht wurden. Veröffentlichen Sie etwas oder erweitern Sie den Zeitraum.',
  'analytics.state.emptyExample':
    'Sobald ein Beitrag online ist, sehen Sie eine Zeile wie: X @acme, „Thread starten“, 12.400 Impressionen, 58 Prozent über Ihrem Median der vorherigen 10.',
  'analytics.state.errorTitle': 'Analysen konnten nicht geladen werden',
  'analytics.state.errorBody':
    'Es wird keine Zahl angezeigt, sondern eine erratene. Ihre Beiträge und Quittungen bleiben davon unberührt.',
  'analytics.state.partialTitle': '{loaded} von {total}-Konten haben Daten zurückgegeben',
  'analytics.state.partialBody':
    'Die Accounts, die geantwortet haben, werden mit ihrer eigenen Aktualität angezeigt. Der Rest wird mit dem Grund aufgeführt, warum dies nicht der Fall war.',
  'analytics.state.partialSucceeded': 'Zurückgegebene Daten',
  'analytics.state.partialFailed': 'Es wurden keine Daten zurückgegeben',
  'analytics.state.offlineTitle': 'Du bist offline',
  'analytics.state.offlineBody':
    'Die folgenden Abbildungen wurden vor dem Verbindungsabbruch geladen und sind daher älter, als die Aktualitätsetiketten vermuten lassen.',
  'analytics.state.permissionTitle': 'In diesem Arbeitsbereich können Sie keine Analysen sehen',
  'analytics.state.permissionBody':
    'Für Analytics ist die Rolle „Analyst“ oder höher erforderlich. Ein Besitzer oder Administrator dieses Arbeitsbereichs kann es gewähren.',
  'analytics.state.rateLimitTitle': '{provider} ist eine ratenbegrenzende Analyseanfrage',
  'analytics.state.rateLimitCause':
    'Das Konto hat seinen Anteil am Anbieterkontingent für dieses Fenster verbraucht. Relay unternimmt keine härteren Wiederholungsversuche, da dies die Veröffentlichung verzögern würde.',
  'analytics.state.rateLimitAlternative':
    'Grenzen Sie den Datumsbereich oder den Kontofilter ein, wodurch der Anbieter weniger verlangt.',
  'analytics.state.rateLimitReset': 'Anfragen werden fortgesetzt',
  'analytics.state.reference': 'Diagnosereferenz',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Erstellen Sie einen verfolgten Link',
  'analytics.links.empty': 'Noch keine getrackten Links',
  'analytics.links.emptyBody':
    'Bei einem getrackten Link handelt es sich um eine kurze URL-Weiterleitung, sodass Sie Klicks auch dann sehen können, wenn eine Plattform keine meldet. Das ursprüngliche Ziel wird nie ohne einen Audit-Eintrag geändert.',
  'analytics.links.emptyExample':
    'Beispiel: Relay.to/a7Kq2 leitet zu acme.com/blog/launch mit der Kampagne q3-launch weiter.',
  'analytics.links.table.caption':
    'Verfolgte Links in diesem Arbeitsbereich und die Anzahl ihrer Erstanbieter-Klicks.',
  'analytics.links.campaign': 'Kampagne',
  'analytics.links.created': 'Erstellt',
  'analytics.links.usedIn':
    '{count, plural, =0 {Noch nicht in einem Beitrag verwendet} one {In # Beitrag verwendet} other {In # Beiträgen verwendet}}',
  'analytics.links.state.active': 'Aktiv',
  'analytics.links.state.expired': 'Abgelaufen {date}',
  'analytics.links.state.disabled': 'Deaktiviert',
  'analytics.links.state.disabledAt':
    'Am {date} deaktiviert. Diese Kurz-URL leitet nicht mehr weiter.',
  'analytics.links.state.blocked': 'Aus Sicherheitsgründen blockiert',
  'analytics.links.state.blockedBody':
    'Diese Weiterleitung ist nicht verfügbar, weil ihr Ziel eine Sicherheitsprüfung nicht bestanden hat. Ändere das Ziel oder kontaktiere den Support.',
  'analytics.links.state.disabledReason':
    'Deaktiviert durch {actor} auf {date}. Erfasster Grund: {reason}.',
  'analytics.links.detailTitle': 'Verfolgter Link {slug}',
  'analytics.links.exactRedirect': 'Genaue Weiterleitung',
  'analytics.links.exactRedirectHelp':
    'Dies ist das Ziel, das ein Besucher gerade erreicht, inklusive aller UTM-Parameter, vollständig und nicht gekürzt dargestellt.',
  'analytics.links.editDestination': 'Ändern Sie das Ziel',
  'analytics.links.editDestinationWarning':
    'Die Änderung des Ziels wirkt sich auf alle Orte aus, an denen dieser Link bereits veröffentlicht wurde. Berichte für Zeiträume vor der Änderung behalten das zu diesem Zeitpunkt aktive Ziel bei.',
  'analytics.links.editDestinationAudit':
    'Die Änderung wird im Audit-Protokoll mit Ihrem Namen, dem alten und dem neuen Ziel aufgezeichnet.',
  'analytics.links.destinationHistory': 'Geschichte des Reiseziels',
  'analytics.links.destinationHistoryRow': '{destination}, aktiv von {start} bis {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, aktiv seit {start}',
  'analytics.links.domainLabel': 'Kurze Domain',
  'analytics.links.domainDefault': 'Relay-Standarddomäne',
  'analytics.links.domainVerified': 'Verifiziert durch DNS auf {date}',
  'analytics.links.domainPending': 'Warten auf den DNS-Eintrag',
  'analytics.links.domainPendingHelp':
    'Fügen Sie den TXT-Eintrag unten bei {domain} hinzu und überprüfen Sie ihn erneut. Bis zur Überprüfung kann diese Domain nicht für einen neuen Link ausgewählt werden.',
  'analytics.links.domainFailed': 'Der DNS-Eintrag stimmte auf {date} nicht überein',
  'analytics.links.domainCheck': 'Überprüfen Sie DNS erneut',
  'analytics.links.expiry': 'Ablauf',
  'analytics.links.expiryNone': 'Kein Ablauf festgelegt',
  'analytics.links.expiryHelp':
    'Nach dem Ablauf gibt der Link eine einfache Seite zurück, die besagt, dass er beendet ist. Es wird nie stillschweigend woanders hingedeutet.',
  'analytics.links.disable': 'Deaktivieren Sie diesen Link jetzt',
  'analytics.links.disableTitle': '{slug} deaktivieren?',
  'analytics.links.disableBody':
    'Besucher gelangen auf eine Seite mit der Meldung, dass der Link nicht mehr verfügbar sei. Veröffentlichte Beiträge enthalten weiterhin die Kurz-URL, sodass diese für jeden sichtbar ist, der darauf klickt.',
  'analytics.links.disableReason': 'Grund für die Deaktivierung',
  'analytics.links.enable': 'Aktivieren Sie diesen Link erneut',
  'analytics.links.abuseTitle': 'Missbrauch dieses Links melden',
  'analytics.links.abuseBody':
    'Wenn diese Kurz-URL für etwas verwendet wird, das Sie nicht beabsichtigt haben, melden Sie es und die Weiterleitung wird während der Überprüfung ausgesetzt.',
  'analytics.links.abuseAction': 'Melden Sie diesen Link',
  'analytics.links.measurementLabel': 'Erstanbieter-Redirect-Messung',
  'analytics.links.measurementExplained':
    'Relay zählt eine Anfrage, wenn der Weiterleitungsdienst nach dieser URL gefragt wird. Durch einen deduplizierten Klick werden wiederholte Anfragen desselben Besuchers innerhalb eines kurzen Zeitfensters entfernt, und Anfragen, die bekannten Crawler-Mustern entsprechen, werden ausgeschlossen und nicht gelöscht.',
  'analytics.links.botsNote':
    '{count, plural, one {# Anfrage} other {# Anfragen}} wurden als automatisiert klassifiziert und sind von der deduplizierten Zählung ausgeschlossen.',
  'analytics.links.series.title': 'Anfragen und deduplizierte Klicks im Laufe der Zeit',
  'analytics.links.series.requests': 'Gesamtzahl der Anfragen',
  'analytics.links.series.clicks': 'Deduplizierte Klicks',
  'analytics.links.breakdownTitle': 'Woher die Klicks kamen',
  'analytics.links.breakdown.share': '{percent} der deduplizierten Klicks',
  'analytics.links.referrer.direct': 'Kein Referrer gesendet',
  'analytics.links.referrer.social': 'Soziale Plattform',
  'analytics.links.referrer.search': 'Suchmaschine',
  'analytics.links.referrer.email': 'E-Mail-Client',
  'analytics.links.referrer.other': 'Andere Website',
  'analytics.links.device.mobile': 'Mobil',
  'analytics.links.device.desktop': 'Desktop',
  'analytics.links.device.tablet': 'Tablette',
  'analytics.links.device.unknown': 'Nicht bestimmt',
  'analytics.links.countryUnknown': 'Land nicht bestimmt',
  'analytics.links.lastEventLabel': 'Letzter Klick',
  'analytics.links.noEvents': 'Es wurden noch keine Klicks aufgezeichnet',
  'analytics.links.noEventsBody':
    'Dieser Link wurde seit seiner Erstellung nicht angefordert. Das ist eine echte Null, gemessen an unserem eigenen Weiterleitungsdienst.',
  'analytics.links.compareWarning':
    '{provider} meldet {providerValue} Linkklicks für diesen Beitrag. Relay zeichnete {relayValue} deduplizierte Klicks auf. Die beiden zählen unterschiedliche Ereignisse und keines ersetzt das andere.',
  'analytics.links.errorTitle': 'Linkstatistiken konnten nicht geladen werden',
  'analytics.links.errorBody':
    'Der Weiterleitungsdienst funktioniert immer noch, sodass der Link weiterhin Besucher an sein Ziel weiterleitet. Betroffen ist lediglich die Berichterstattung.',
  'analytics.links.createDestination': 'Ziel-URL',
  'analytics.links.createDestinationHelp':
    'Muss eine öffentliche https-Adresse sein. Private Netzwerkadressen und Weiterleitungsketten werden vom Weiterleitungsdienst abgelehnt.',
  'analytics.links.createCampaign': 'Kampagnenname',
  'analytics.links.createSlug': 'Benutzerdefiniertes Ende',
  'analytics.links.createSlugHelp':
    'Lassen Sie dieses Feld leer und Relay generiert ein kurzes, zufälliges Ende.',
  'analytics.links.createUtm': 'UTM-Parameter',
  'analytics.links.blockedScheme': 'Es werden nur https-Ziele akzeptiert.',
  'analytics.links.blockedPrivate':
    'Diese Adresse befindet sich in einem privaten Netzwerk und wird daher vom Weiterleitungsdienst nicht akzeptiert.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Regeln',
  'automation.tab.feeds': 'RSS-Feeds',
  'automation.tab.label': 'Automatisierungsabschnitte',

  'automation.rules.table.caption': 'Automatisierungsregeln in diesem Arbeitsbereich.',
  'automation.rules.table.rule': 'Regel',
  'automation.rules.table.state': 'Staat',
  'automation.rules.table.accounts': 'Konten',
  'automation.rules.table.lastRun': 'Letzter Lauf',
  'automation.rules.table.nextCheck': 'Nächste Kontrolle',
  'automation.rules.neverRun': 'Noch nicht ausgeführt',
  'automation.rules.emptyExample':
    'Beispiel: Wenn ein neues Element im Acme-Blog-Feed erscheint und die Sprache Englisch ist, erstellen Sie einen Entwurf aus der Blog-Ankündigungsvorlage und fordern Sie die Genehmigung an.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {Keine Konten ausgewählt} one {# Konto} other {# Konten}}',
  'automation.rules.openRule': 'Öffnen Sie {name}',
  'automation.rules.duplicateRule': '{name} duplizieren',
  'automation.rules.deleteTitle': '{name} löschen?',
  'automation.rules.deleteBody':
    'Die Regel wird sofort gestoppt und ihr Ausführungsverlauf wird für das Überwachungsprotokoll gespeichert. Bereits erstellte Beiträge sind nicht betroffen.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'Ein geplanter Kommentar oder Thread-Eintrag schlägt fehl',

  'automation.condition.timeWindow': 'Die Zeit liegt zwischen {start} und {end} in {timeZone}',
  'automation.condition.domainPresent': 'Der Text verweist auf {domain}',
  'automation.condition.hashtagPresent': 'Der Text enthält den Hashtag {hashtag}',
  'automation.condition.providerCapability': 'Das Konto kann tatsächlich {capability} ausführen',
  'automation.condition.planStatus': 'Das Abonnement ist aktiv',

  'automation.action.continueSequence':
    'Setzen Sie den vorbereiteten Thread oder die Kommentarsequenz fort',
  'automation.action.notifyEmail': 'Senden Sie eine E-Mail an {target}',
  'automation.action.notifyWebhook': 'Senden Sie einen Webhook an {target}',
  'automation.action.pauseConnection': 'Pausieren Sie das betroffene Konto',
  'automation.action.quotePost': 'Zitieren Sie den Quellbeitrag einmal',
  'automation.action.followUpComment':
    'Fügen Sie einen vorbereiteten Kommentar zum Quellbeitrag hinzu',

  'automation.param.feed': 'Futter',
  'automation.param.template': 'Vorlage',
  'automation.param.signature': 'Unterschrift',
  'automation.param.disclosure': 'Offenlegung',
  'automation.param.locale': 'Sprache',
  'automation.param.project': 'Marke',
  'automation.param.campaign': 'Kampagne',
  'automation.param.account': 'Konto',
  'automation.param.platform': 'Plattform',
  'automation.param.contentType': 'Inhaltstyp',
  'automation.param.keyword': 'Stichwort',
  'automation.param.hashtag': 'Hashtag',
  'automation.param.domain': 'Domäne',
  'automation.param.capability': 'Fähigkeit',
  'automation.param.timeZone': 'Zeitzone',
  'automation.param.startTime': 'Von',
  'automation.param.endTime': 'Zu',
  'automation.param.duration': 'Dauer',
  'automation.param.metric': 'Metrisch',
  'automation.param.value': 'Wert',
  'automation.param.target': 'Senden an',
  'automation.param.time': 'Zeit',
  'automation.param.cadence': 'Wie oft',
  'automation.param.notSet': 'nicht eingestellt',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Regelname',
  'automation.editor.namePlaceholder': 'Blog zu sozialen Netzwerken',
  'automation.editor.when': 'Wann',
  'automation.editor.if': 'Wenn',
  'automation.editor.then': 'Dann',
  'automation.editor.after': 'Nachher',
  'automation.editor.until': 'Bis',
  'automation.editor.sentenceLabel': 'Regelsatz',
  'automation.editor.readBack':
    'Lesen Sie den Satz noch einmal, bevor Sie ihn einschalten. Es ist die ganze Regel.',
  'automation.editor.chooseTrigger': 'Wählen Sie aus, womit diese Regel beginnt',
  'automation.editor.addCondition': 'Fügen Sie eine Bedingung hinzu',
  'automation.editor.addAction': 'Fügen Sie eine Aktion hinzu',
  'automation.editor.removeCondition': 'Entfernen Sie die Bedingung {label}',
  'automation.editor.removeAction': 'Entfernen Sie die Aktion {label}',
  'automation.editor.moveActionUp': 'Verschieben Sie {label} früher',
  'automation.editor.moveActionDown': 'Verschieben Sie {label} später',
  'automation.editor.actionOrder':
    'Aktionen werden in dieser Reihenfolge von oben nach unten ausgeführt.',
  'automation.editor.noConditions':
    'Keine Bedingungen. Die Regel wird jedes Mal ausgeführt, wenn sie ausgelöst wird.',
  'automation.editor.noActions':
    'Noch keine Aktionen. Eine Regel ohne Aktion kann nicht gespeichert werden.',
  'automation.editor.delayNone': 'keine Verzögerung',
  'automation.editor.delayLabel': 'Verzögerung, bevor die Aktionen ausgeführt werden',
  'automation.editor.endLabel': 'Wenn diese Regel aufhört',
  'automation.editor.end.manual': 'Ich schalte das aus',
  'automation.editor.end.date': 'ein Datum, das ich wähle',
  'automation.editor.end.count': 'es wurde ausgeführt {count, plural, one {# Mal} other {# Mal}}',
  'automation.editor.end.dateValue': 'Hör auf',
  'automation.editor.end.countValue': 'Hören Sie nach so vielen Läufen auf',
  'automation.editor.parameterFor': 'Einstellungen für {label}',
  'automation.editor.saveDraft': 'Als Entwurf speichern',
  'automation.editor.savedAt': '{time} gespeichert',
  'automation.editor.unsaved': 'Nicht gespeicherte Änderungen',

  'automation.editor.view.sentence': 'Satz',
  'automation.editor.view.structured': 'Strukturiert',
  'automation.editor.view.api': 'API-Darstellung',
  'automation.editor.view.label': 'Editoransicht',
  'automation.editor.apiHelp':
    'Genau das senden die REST API, die CLI und der MCP-Server. Wenn Sie es hier bearbeiten und wieder zum Satz wechseln, bleiben alle Felder erhalten.',
  'automation.editor.apiInvalid':
    'Dies ist kein gültiger Regel-JSON, daher wurde er nicht angewendet: {reason}',
  'automation.editor.apiApply': 'Wenden Sie diesen JSON an',
  'automation.editor.structuredHelp':
    'Die gleiche Regel wie bei Feldern. Verwenden Sie dies, wenn eine Regel viele Bedingungen hat und der Satz lang wird.',

  'automation.editor.error.noAction': 'Fügen Sie vor dem Speichern mindestens eine Aktion hinzu.',
  'automation.editor.error.noTrigger': 'Wählen Sie vor dem Speichern einen Auslöser.',
  'automation.editor.error.noAccounts':
    'Wählen Sie mindestens ein Konto aus, auf das diese Regel angewendet werden kann.',
  'automation.editor.error.missingParameter': '{label} benötigt einen Wert.',
  'automation.editor.error.summary':
    '{count, plural, one {# Sache erfordert Ihre Aufmerksamkeit} other {# Sache erfordert Ihre Aufmerksamkeit}}, bevor diese Regel gespeichert werden kann.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'Womit beginnt diese Regel?',
  'automation.picker.conditionTitle': 'Fügen Sie eine Bedingung hinzu',
  'automation.picker.actionTitle': 'Fügen Sie eine Aktion hinzu',
  'automation.picker.search': 'Filtern Sie diese Liste',
  'automation.picker.noResults': 'Nichts in dieser Liste stimmt mit Ihrer Eingabe überein.',
  'automation.picker.groupContent': 'Inhalt',
  'automation.picker.groupPublishing': 'Veröffentlichung',
  'automation.picker.groupNotify': 'Menschen und Systeme',
  'automation.picker.groupControl': 'Regelkontrolle',
  'automation.picker.groupSchedule': 'Zeit',
  'automation.picker.groupExternal': 'Externe Veranstaltungen',
  'automation.picker.groupMeasurement': 'Messung',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# Aktion ist} other {# Aktionen sind}} nicht aufgeführt, da die ausgewählten Konten sie nicht ausführen können.',
  'automation.picker.hiddenDetail': '{action} ist für {provider} nicht verfügbar. {reason}',
  'automation.picker.consequential': 'Erstellt etwas auf einer Plattform',
  'automation.picker.internalOnly': 'Bleibt im Relay',

  'automation.accounts.label': 'Konten, auf die sich diese Regel auswirken kann',
  'automation.accounts.help':
    'Eine Regel kann sich niemals auf ein Konto auswirken, das hier nicht aufgeführt ist, unabhängig davon, wie die Bedingungen lauten.',
  'automation.accounts.none': 'Noch keine Konten ausgewählt',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Messregeln für diesen Trigger',
  'automation.threshold.intro':
    'Eine Regel, die auf eine Zahl reagiert, muss wissen, welche Zahl, gemessen über welchen Zeitraum, und wie oft sie wirken darf.',
  'automation.threshold.metric': 'Zu beobachtende Metrik',
  'automation.threshold.value': 'Schwellenwert',
  'automation.threshold.window': 'Messfenster',
  'automation.threshold.windowHelp':
    'Gezählt ab dem Zeitpunkt der Veröffentlichung des Quellbeitrags. Außerhalb dieses Fensters stoppt die Regel die Beobachtung des Beitrags.',
  'automation.threshold.expiry': 'Hören Sie danach auf, einen Beitrag anzusehen',
  'automation.threshold.cooldown': 'Abklingzeit zwischen Hinrichtungen',
  'automation.threshold.cooldownHelp':
    'Die kürzeste zulässige Zeit zwischen zwei Durchläufen für denselben Quellbeitrag.',
  'automation.threshold.maxPerPost': 'Maximale Ausführungen pro Quellbeitrag',
  'automation.threshold.defaultsTitle':
    'Standardeinstellungen, die bestehen bleiben, sofern Sie sie nicht ändern',
  'automation.threshold.defaultOncePerPost': 'Einmal pro Quellbeitrag ausführen.',
  'automation.threshold.defaultStale':
    'Nicht ausführen, wenn die Metrik nicht verfügbar oder veraltet ist. Die verwendete Frischegrenze ist {duration}.',
  'automation.threshold.staleLimit': 'Behandeln Sie eine Metrik danach als veraltet',
  'automation.threshold.providerNote':
    '{provider} meldet {metric} eine Verzögerung, daher kann diese Regel erst wirken, nachdem der Anbieter die Nummer veröffentlicht hat.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Follow-up von einem anderen Konto aus',
  'automation.crossAccount.off': 'Aus. Diese Regel wirkt sich nur auf das Quellkonto aus.',
  'automation.crossAccount.enable': 'Erlauben Sie eine Nachverfolgung von einem anderen Konto aus',
  'automation.crossAccount.body':
    'Beide Konten müssen mit diesem Arbeitsbereich verbunden sein und beide müssen hier benannt werden. Beim Follow-up handelt es sich um einen vorbereiteten Beitrag, den Sie im Voraus verfassen und der die gleichen Genehmigungsrichtlinien durchläuft wie alles andere.',
  'automation.crossAccount.sourceAccount': 'Quellkonto',
  'automation.crossAccount.followUpAccount': 'Konto, das das Follow-up veröffentlicht',
  'automation.crossAccount.preauthorize':
    'Ich bestätige, dass dieser Arbeitsbereich sowohl {sourceAccount} als auch {followUpAccount} steuert und dass die Nachverfolgung nicht als unabhängige Empfehlung dargestellt wird.',
  'automation.crossAccount.preauthorizeRequired':
    'Bestätigen Sie die Vorautorisierung, bevor diese Regel gespeichert werden kann.',
  'automation.crossAccount.duplicateCheck':
    'Vor der Nachverfolgung werden kontoübergreifende Duplikat- und Kadenzprüfungen ausgeführt, und diese werden übersprungen und nicht verzögert, wenn sie den Quellbeitrag wiederholen würden.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro':
    'Alles, was diese Regel tun kann, bevor sie irgendetwas davon tun kann.',
  'automation.preflight.accountsLabel': 'Konten, auf die es reagieren kann',
  'automation.preflight.maxActionsLabel': 'Die meisten externen Aktionen pro Lauf',
  'automation.preflight.maxActionsPeriod':
    'Höchstens {count, plural, one {# externe Aktion} other {# externe Aktionen}} in {period}.',
  'automation.preflight.approvalLabel': 'Zustimmung',
  'automation.preflight.approvalNone':
    'Keine Aktion in dieser Regel erstellt etwas auf einer Plattform, daher gilt keine Genehmigung.',
  'automation.preflight.providerLabel': 'Anbieterbeschränkungen',
  'automation.preflight.providerNone': 'Für die Aktionen in dieser Regel gelten keine.',
  'automation.preflight.costLabel': 'Geschätzte gemessene Kosten',
  'automation.preflight.costUnknown':
    'Die Kosten für diese Maßnahmen können erst abgeschätzt werden, wenn ein Anbieterpreis bekannt ist.',
  'automation.preflight.costMethod':
    'Geschätzter Wert anhand der Preisliste des Anbieters auf {date}. Auf der Quittung wird vermerkt, was tatsächlich berechnet wurde.',
  'automation.preflight.cadenceLabel': 'Kadenz und Duplikate',
  'automation.preflight.cadenceBody':
    'Vor jeder Aktion werden Duplikat- und Rhythmusprüfungen durchgeführt. Eine Aktion, die das Kadenzbudget für ein Konto überschreiten würde, wird übersprungen und aufgezeichnet, nicht in die Warteschlange gestellt.',
  'automation.preflight.failureLabel': 'Wenn ein Lauf fehlschlägt',
  'automation.preflight.failure.pauseAfter':
    'Die Regel pausiert nach {count, plural, one {# aufeinanderfolgender Fehler} other {# aufeinanderfolgender Fehler}} und legt ein Aktionselement ab.',
  'automation.preflight.failure.continue':
    'Die Regel läuft weiter und jeder Fehler wird im Ausführungsprotokoll aufgezeichnet.',
  'automation.preflight.exampleLabel': 'Beispiellauf',
  'automation.preflight.exampleIntro':
    'Bei Verwendung des aktuellsten Ereignisses hätte dieser Auslöser zugestimmt.',
  'automation.preflight.exampleNone':
    'Es ist noch kein passendes Ereignis aufgetreten, daher kann kein Beispiel angezeigt werden. Führen Sie stattdessen ein Testereignis aus.',
  'automation.preflight.activate': 'Aktivieren Sie diese Regel',
  'automation.preflight.activateConfirmTitle': '{name} einschalten?',
  'automation.preflight.activateConfirmBody':
    'Von nun an gilt diese Regel, ohne Sie vorher zu fragen, innerhalb der oben aufgeführten Grenzen.',
  'automation.preflight.blocked':
    'Diese Regel kann noch nicht aktiviert werden. {count, plural, one {# item} other {# items}} oben muss eine Entscheidung getroffen werden.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Testveranstaltung',
  'automation.test.body':
    'Ein Testlauf wertet den gesamten Satz aus und zeigt, was er bewirken würde. Es veröffentlicht niemals, veröffentlicht niemals einen Kommentar und sendet niemals einen Webhook an einen echten Endpunkt.',
  'automation.test.useLastEvent': 'Verwenden Sie das aktuellste passende Ereignis',
  'automation.test.usePayload': 'Fügen Sie eine Ereignisnutzlast ein',
  'automation.test.run': 'Führen Sie den Test durch',
  'automation.test.running': 'Den Test ausführen',
  'automation.test.resultTitle': 'Was der Test bewirkt hat',
  'automation.test.conditionPassed': '{condition} bestanden',
  'automation.test.conditionFailed':
    '{condition} wurde nicht bestanden, daher wurde die Regel hier gestoppt',
  'automation.test.actionSimulated': '{action} würde ausgeführt',
  'automation.test.actionSkipped': '{action} würde übersprungen: {reason}',
  'automation.test.noExternalEffect': 'Während dieses Tests ist nichts von Relay übrig geblieben.',
  'automation.test.failed': 'Der Test konnte nicht abgeschlossen werden: {reason}',

  'automation.runs.table.caption': 'Aktuelle Ausführungen dieser Regel.',
  'automation.runs.startedAt': 'Begonnen',
  'automation.runs.outcome.label': 'Ergebnis',
  'automation.runs.actionsTaken': 'Aktionen',
  'automation.runs.trigger': 'Ausgelöst durch',
  'automation.runs.outcome.completed': 'Abgeschlossen',
  'automation.runs.outcome.skipped': 'Übersprungen',
  'automation.runs.outcome.failed': 'Fehlgeschlagen',
  'automation.runs.outcome.testMode': 'Testmodus',
  'automation.runs.actionCount':
    '{count, plural, =0 {Keine externe Aktion} one {# externe Aktion} other {# externe Aktionen}}',
  'automation.runs.skippedReason': 'Übersprungen, da {reason}',
  'automation.runs.openDetail': 'Öffnen Sie den Lauf von {time}',
  'automation.runs.createdItems': 'Erstellt',

  'automation.versions.caption': 'Jede gespeicherte Version dieser Regel.',
  'automation.versions.current': 'Aktuell',
  'automation.versions.savedBy': 'Gespeichert von {actor} auf {date}',
  'automation.versions.compare': 'Vergleichen Sie mit der aktuellen Version',
  'automation.versions.restore': 'Stellen Sie diese Version wieder her',
  'automation.versions.restoreConfirm':
    'Beim Wiederherstellen wird eine neue Version erstellt. Es wird nichts überschrieben und die Regel bleibt in ihrem aktuellen Zustand, bis Sie sie aktivieren.',
  'automation.versions.diffTitle': 'Version {from} im Vergleich zur Version {to}',

  'automation.kill.title': 'Stoppen Sie {name} jetzt',
  'automation.kill.body':
    'Die Regel stoppt sofort, mitten im Lauf, falls einer stattfindet. Alles, was bereits an eine Plattform gesendet wurde, bleibt veröffentlicht, da ein externer Beitrag nie zurückgesetzt wird.',
  'automation.kill.confirmPhrase': 'STOP',
  'automation.kill.confirmLabel': 'Geben Sie zur Bestätigung STOP ein',
  'automation.kill.stopped':
    'Diese Regel wurde von {actor} auf {date} gestoppt. Es kann erst wieder ausgeführt werden, wenn Sie es wieder einschalten.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Automatisierungsregeln werden geladen',
  'automation.state.loadingRule': 'Laden der Regel und ihrer letzten Ausführungen',
  'automation.state.errorTitle': 'Die Regeln konnten nicht geladen werden',
  'automation.state.errorBody':
    'Bereits laufende Regeln sind davon nicht betroffen. Nur dieser Bildschirm ist fehlgeschlagen.',
  'automation.state.offlineTitle': 'Du bist offline',
  'automation.state.offlineBody':
    'Sie können eine Regel lesen und den Entwurf bearbeiten, er bleibt auf diesem Gerät. Das Speichern, Testen und Aktivieren einer Regel erfordert eine Verbindung.',
  'automation.state.permissionTitle': 'Sie können Automatisierungsregeln nicht ändern',
  'automation.state.permissionBody':
    'Regeln wirken sich auf verbundene Konten aus, daher ist für die Änderung eines Kontos mindestens die Managerrolle erforderlich. Sie können weiterhin jede Regel und ihren Ausführungsverlauf lesen.',
  'automation.state.rateLimitTitle': 'Regelläufe werden verlangsamt',
  'automation.state.rateLimitCause':
    'Dieser Arbeitsbereich hat sein Automatisierungslauflimit für das aktuelle Fenster erreicht. Geplante Beiträge und manuelle Veröffentlichungen sind nicht betroffen.',
  'automation.state.rateLimitAlternative':
    'Regeln mit einer Kadenz können ein längeres Intervall zugewiesen werden, wodurch weniger Läufe erforderlich sind.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Wandeln Sie einen Feed in Entwürfe oder geplante Beiträge um, mit der gleichen Validierung und Genehmigung wie alles, was Sie selbst schreiben.',
  'automation.rss.empty': 'Noch keine Feeds',
  'automation.rss.emptyBody':
    'Fügen Sie einen Feed hinzu und Relay prüft ihn nach einem Zeitplan. Jedes neue Element wird zu einem Entwurf, einem geplanten Beitrag oder einer Genehmigungsanfrage, je nachdem, was Sie wählen.',
  'automation.rss.emptyExample':
    'Beispiel: Der Acme-Blog-Feed erstellt jedes Mal, wenn ein Artikel veröffentlicht wird, einen Entwurf für X und LinkedIn und wartet auf einen Genehmiger.',
  'automation.rss.table.caption': 'Füttert die Umfragen dieses Arbeitsbereichs.',
  'automation.rss.table.feed': 'Futter',
  'automation.rss.table.policy': 'Was passiert mit einem neuen Artikel?',
  'automation.rss.table.health': 'Gesundheit',

  'automation.rss.step.url': 'Feed-Adresse',
  'automation.rss.step.preview': 'Überprüfen Sie den Feed',
  'automation.rss.step.seen': 'Ausgangspunkt',
  'automation.rss.step.targets': 'Wohin es geht',
  'automation.rss.step.template': 'Was der Beitrag sagt',
  'automation.rss.step.policy': 'Wie es veröffentlicht wird',
  'automation.rss.stepOf': 'Schritt {current} von {total}',

  'automation.rss.urlHelp':
    'Relay ruft den Feed von unseren Servern ab, nicht von Ihrem Browser. Private Netzwerkadressen werden abgelehnt.',
  'automation.rss.validateAction': 'Überprüfen Sie diesen Feed',
  'automation.rss.validateFailed': 'Diese Adresse hat keinen lesbaren Feed zurückgegeben',
  'automation.rss.validateFailedReason': 'Was wir zurückbekommen haben: {reason}',
  'automation.rss.validateBlocked':
    'Diese Adresse verweist auf ein privates Netzwerk und wurde daher nicht abgerufen.',
  'automation.rss.previewTitle': 'Feed-Vorschau',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# Artikel} other {# Artikel}} zurückgegeben, neueste zuerst.',
  'automation.rss.previewItemPublished': 'Veröffentlicht {dateTime}',
  'automation.rss.previewNoImage': 'Kein Bild in diesem Artikel',
  'automation.rss.previewImageAlt': 'Bild aus dem Feed-Element {title}',
  'automation.rss.previewNoDate':
    'Dieses Element hat keinen Zeitstempel, daher verwendet Relay die Zeit, zu der es es zum ersten Mal gesehen hat.',
  'automation.rss.previewFieldsTitle': 'Felder, die dieser Feed bereitstellt',
  'automation.rss.previewFieldMissing': 'In diesem Feed nicht vorhanden',

  'automation.rss.seenTitle': 'Was gilt als bereits gesehen',
  'automation.rss.seenLatest':
    'Behandeln Sie alles, was derzeit im Feed angezeigt wird, wie angezeigt. Es werden nur zukünftige Artikel gebucht.',
  'automation.rss.seenAll':
    'Behandeln Sie den neuesten Artikel als neu und geben Sie ihn bei der nächsten Überprüfung ein.',
  'automation.rss.seenHelp':
    'Die meisten Feeds enthalten alte Artikel. Wenn Sie sich für die erste Option entscheiden, vermeiden Sie die Veröffentlichung eines Rückstands.',

  'automation.rss.targetsHelp':
    'Wählen Sie die Konten oder die gespeicherte Gruppe. Jedes Ziel erhält dennoch seine eigene Validierung, bevor etwas geplant wird.',
  'automation.rss.targetGroup': 'Gespeicherte Gruppe',
  'automation.rss.targetIndividual': 'Individuelle Konten',

  'automation.rss.templateFields': 'Verfügbare Felder',
  'automation.rss.templateInsert': 'Fügen Sie {field} ein',
  'automation.rss.templateField.title': 'Artikeltitel',
  'automation.rss.templateField.summary': 'Artikelübersicht',
  'automation.rss.templateField.link': 'Artikellink',
  'automation.rss.templateField.author': 'Artikelautor',
  'automation.rss.templateField.published': 'Veröffentlichungsdatum',
  'automation.rss.templateField.categories': 'Kategorien',
  'automation.rss.templatePreview': 'Vorschau mit dem neuesten Artikel',
  'automation.rss.adaptWithAi': 'Passen Sie den Text für jedes Ziel an',
  'automation.rss.adaptHelp':
    'Der Wortlaut wird so umgeschrieben, dass er zu jeder Plattform passt, und als Unterschied angezeigt, den Sie akzeptieren oder ablehnen. Die Medien stammen aus dem Feed-Element. Relay generiert keine Bilder.',
  'automation.rss.noImageGeneration':
    'Wenn ein Feed-Eintrag kein Bild hat, wird der Beitrag ohne Bild versendet.',
  'automation.rss.imageFromFeed':
    'Verwenden Sie das Bild aus dem Feed-Element, sofern eines vorhanden ist',

  'automation.rss.policyHelp':
    'Ein Feed-Eintrag ist nichts Besonderes. Es folgt die gleiche Genehmigungsrichtlinie wie ein Beitrag, den Sie selbst schreiben.',
  'automation.rss.cadenceInterval': 'Höchstens ein Artikel pro Stück',
  'automation.rss.cadenceHelp':
    'Zusätzliche Elemente warten in der Warteschlange, anstatt sie gemeinsam zu veröffentlichen, sodass ein Feed, der zehn Artikel gleichzeitig veröffentlicht, kein Konto überschwemmt.',
  'automation.rss.immediateWarning':
    'Durch die sofortige Veröffentlichung wird ein Beitrag an eine Plattform gesendet, ohne dass eine Person ihn zuerst liest. Es ist nur verfügbar, wenn die Genehmigungsrichtlinie für diese Konten dies zulässt.',

  'automation.rss.healthTitle': 'Gesundheit ernähren',
  'automation.rss.healthOk': 'Arbeiten',
  'automation.rss.healthStalled': 'Kein neuer Artikel für {duration}',
  'automation.rss.healthFailing':
    'Die letzte {count, plural, one {Prüfung} other {# Prüfungen}} ist fehlgeschlagen.',
  'automation.rss.health.nextPoll': 'Überprüfen Sie als nächstes {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Noch keine Artikel verarbeitet} one {# Artikel verarbeitet} other {# Artikel verarbeitet}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {Keine Duplikate übersprungen} one {# Duplikate übersprungen} other {# Duplikate übersprungen}}',
  'automation.rss.health.lastPollLabel': 'Zuletzt überprüft',
  'automation.rss.health.lastItemLabel': 'Letzter neuer Artikel im Feed',
  'automation.rss.health.lastPostLabel': 'Letzter Entwurf oder Beitrag erstellt',
  'automation.rss.health.processedLabel': 'Artikel verarbeitet',
  'automation.rss.recentItems': 'Aktuelle Artikel',
  'automation.rss.itemOutcome.draft': 'Entwurf erstellt',
  'automation.rss.itemOutcome.scheduled': 'Geplant für {time}',
  'automation.rss.itemOutcome.published': 'Veröffentlicht',
  'automation.rss.itemOutcome.awaitingApproval': 'Warten auf Genehmigung',
  'automation.rss.itemOutcome.duplicate': 'Übersprungen, schon gesehen',
  'automation.rss.itemOutcome.failed': 'Fehlgeschlagen: {reason}',
  'automation.rss.pauseFeed': 'Pausieren Sie diesen Feed',
  'automation.rss.resumeFeed': 'Setzen Sie diesen Feed fort',
  'automation.rss.deleteTitle': '{title} entfernen?',
  'automation.rss.deleteBody':
    'Relay hört auf, diesen Feed zu prüfen. Bereits erstellte Entwürfe und Beiträge bleiben unverändert.',
  'automation.rss.errorTitle': 'Dieser Feed konnte nicht gelesen werden',
  'automation.rss.errorBody':
    'Relay überprüft weiterhin den normalen Zeitplan. Aus einer Teilantwort wurde nichts veröffentlicht.',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'In keiner Regel verfügbar',
  'automation.refuse.body':
    'Automatische Likes und Follows, Engagement-Gruppen, unerwünschte Antworten und Nachrichten sowie das Posten desselben Inhalts von mehreren Konten aus, um ihn beliebt erscheinen zu lassen, sind hier keine Optionen. Plattformen verbieten sie und sie schädigen die Konten, die sie nutzen.',
  'automation.refuse.readPolicy': 'Lesen Sie die Richtlinien zur akzeptablen Nutzung',
} as const;
