/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'Facebook',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Themen',
  'web.provider.bluesky': 'Bluesky',
  'web.provider.mastodon': 'Mastodon',
  'web.provider.telegram': 'Telegram',
  'web.provider.reddit': 'Reddit',
  'web.provider.wordpress': 'WordPress',
  'web.provider.medium': 'Medium',
  'web.provider.devto': 'Dev.to',
  'web.provider.pinterest': 'Pinterest',
  'web.provider.discord': 'Discord',
  'web.provider.slack': 'Slack',
  'web.connection.requirement.mastodon':
    'Mastodon verbindet sich mit einem Zugriffstoken, das Sie auf Ihrer eigenen Instanz erstellen, nicht mit Ihrem Passwort.',
  'web.connection.requirement.telegram':
    'Post Array postet als Bot. Fügen Sie den Bot dem Kanal oder der Gruppe hinzu, in die Sie publizieren möchten.',
  'web.connection.requirement.reddit':
    'Das Schreiben auf Reddit erfordert eine genehmigte App, und jeder Beitrag braucht einen Titel und ein Subreddit.',
  'web.connection.requirement.wordpress':
    'Post Array publiziert über die REST-API der Site mit einem App-Passwort, das Sie in WordPress erstellen.',
  'web.connection.requirement.medium':
    'Medium verbindet sich über OAuth und Post Array publiziert öffentliche Geschichten in Markdown.',
  'web.connection.requirement.devto':
    'Dev.to verbindet sich mit einem API-Schlüssel aus Ihren Dev.to-Einstellungen.',
  'web.connection.requirement.pinterest':
    'Das Schreiben auf Pinterest erfordert genehmigten App-Zugriff, und ein Pin braucht ein Bild und ein eigenes Board.',
  'web.connection.requirement.discord':
    'Post Array postet als Bot. Fügen Sie den Bot den Servern und Kanälen hinzu, in die Sie publizieren möchten.',
  'web.connection.requirement.slack':
    'Post Array postet als App. Fügen Sie die App den Kanälen hinzu, in die Sie publizieren möchten.',
  'web.provider.fake': 'Teststecker',

  'web.accountType.personal_profile': 'Persönliches Profil',
  'web.accountType.creator_profile': 'Erstellerkonto',
  'web.accountType.business_profile': 'Geschäftskonto',
  'web.accountType.page': 'Seite',
  'web.accountType.organization': 'Organisation',
  'web.accountType.channel': 'Kanal',
  'web.accountType.group': 'Gruppe',
  'web.accountType.board': 'Vorstand',
  'web.accountType.community': 'Gemeinschaft',
  'web.accountType.publication': 'Veröffentlichung',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Alles geplant, auf Genehmigung wartend, veröffentlicht oder blockiert, an einem Ort.',
  'web.calendar.view.agenda': 'Tagesordnung',
  'web.calendar.view.table': 'Tisch',
  'web.calendar.view.switchLabel': 'Wählen Sie, wie der Zeitplan gestaltet werden soll',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} bis {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': '{range} wird in {timeZone} angezeigt',
  'web.calendar.timeZone.workspace': 'Zeitzone des Arbeitsbereichs: {timeZone}',
  'web.calendar.timeZone.change': 'Änderung der Arbeitsbereichseinstellungen',
  'web.calendar.jumpToDate': 'Springe zu einem Datum',
  'web.calendar.nowLabel': 'Jetzt',
  'web.calendar.allDayHeading': 'Noch keine genaue Uhrzeit',

  'web.calendar.filter.group': 'Kundengruppe',
  'web.calendar.filter.anyProject': 'Jedes Projekt',
  'web.calendar.filter.anyAccount': 'Jedes Konto',
  'web.calendar.filter.anyPlatform': 'Jede Plattform',
  'web.calendar.filter.anyStatus': 'Beliebiger Status',
  'web.calendar.filter.anyLocale': 'Jede Inhaltssprache',
  'web.calendar.filter.anyCampaign': 'Jede Kampagne',
  'web.calendar.filter.anyGroup': 'Jede Gruppe',
  'web.calendar.filter.regionLabel': 'Filtern Sie den Zeitplan',
  'web.calendar.bucket.scheduled': 'Geplant',
  'web.calendar.bucket.draft': 'Entwürfe und Genehmigungen',
  'web.calendar.bucket.published': 'Veröffentlicht',
  'web.calendar.bucket.failed': 'Braucht Aufmerksamkeit',
  'web.calendar.filter.summary':
    '{count, plural, =0 {Keine Filter} one {# Filter} other {# Filter}}, {results, plural, =0 {keine Beiträge} one {# Beitrag} other {# Beiträge}}',

  'web.calendar.grid.label': 'Zeitplanraster für {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Nichts bei {time} auf {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {# weitere Beiträge anzeigen} other {# weitere Beiträge anzeigen}}',
  'web.calendar.month.label': 'Monatsraster für {month}',
  'web.calendar.agenda.label': 'Agenda für {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Nichts geplant',

  'web.calendar.table.caption': 'Jeder Beitrag in {range}, sortiert nach Veröffentlichungszeit.',
  'web.calendar.table.column.time': 'Zeit',
  'web.calendar.table.column.account': 'Konto',
  'web.calendar.table.column.content': 'Inhalt',
  'web.calendar.table.column.language': 'Sprache',
  'web.calendar.table.column.media': 'Medien',
  'web.calendar.table.column.status': 'Status',
  'web.calendar.table.column.approver': 'Genehmiger',
  'web.calendar.table.column.campaign': 'Kampagne',
  'web.calendar.table.column.actions': 'Aktionen',
  'web.calendar.table.rowMenu': 'Aktionen für {title}',
  'web.calendar.table.noApprover': 'Keine Genehmigung erforderlich',
  'web.calendar.table.noCampaign': 'Keine Kampagne',

  'web.calendar.entry.untitled': 'Entwurf ohne Titel',
  'web.calendar.entry.language': 'Sprache {locale}',
  'web.calendar.entry.openDetail': 'Öffnen Sie {title}',
  'web.calendar.entry.selected': '{title} ausgewählt. {hint}',
  'web.calendar.detail.title': 'Geplanter Beitrag',
  'web.calendar.detail.close': 'Schließen Sie diesen Beitrag',

  'web.calendar.keyboard.title': 'Verschieben Sie einen Beitrag mit der Tastatur',
  'web.calendar.keyboard.body':
    'Fokussieren Sie einen Beitrag und drücken Sie die Eingabetaste, um ihn zu öffnen. Drücken Sie M, um einen Beitrag aufzunehmen, verschieben Sie ihn dann mit den Pfeiltasten um einen Platz und bestätigen Sie mit der Eingabetaste. Drücken Sie Escape, um es zurückzusetzen.',
  'web.calendar.keyboard.pickUp': 'Verschieben Sie diesen Beitrag',
  'web.calendar.keyboard.grabbed':
    '{title} wurde von {from} übernommen. Mit den Pfeiltasten wird es verschoben. Enter bestätigt. Escape bricht ab.',
  'web.calendar.keyboard.moved': 'Vorgeschlagene Zeit {to}. Enter bestätigt.',
  'web.calendar.keyboard.released': '{title} zurückgesetzt auf {from}.',
  'web.calendar.keyboard.stepMinutes': 'Jeder Schritt dauert {minutes} Minuten.',

  'web.calendar.reschedule.title': 'Diesen Beitrag verschieben?',
  'web.calendar.reschedule.subject': '{account} auf {provider}',
  'web.calendar.reschedule.from': 'Von {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'Zu {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Beitrag verschieben',
  'web.calendar.reschedule.dstTitle': 'Zwischen diesen beiden Zeiten stellen sich die Uhren um',
  'web.calendar.reschedule.dstBody':
    'Der Offset in {timeZone} ist {fromOffset} zur alten Zeit und {toOffset} zur neuen Zeit. Die von Ihnen ausgewählte lokale Stunde wird beibehalten, sodass sich die UTC-Sofortzeit verschiebt.',
  'web.calendar.reschedule.conflictTitle': 'Weitere Beiträge folgen in Kürze',
  'web.calendar.reschedule.conflictBody':
    '{account} hat bereits {count, plural, one {# Beitrag} other {# Beiträge}} innerhalb von {window} der neuen Zeit.',
  'web.calendar.reschedule.campaignTitle': 'Kampagnenkonflikt',
  'web.calendar.reschedule.campaignBody':
    'Die Kampagne {campaign} läuft von {start} bis {end}. Die neue Zeit liegt außerhalb dieses Fensters.',
  'web.calendar.reschedule.leadTimeTitle': 'Das ist sehr bald',
  'web.calendar.reschedule.leadTimeBody':
    'Die neue Zeit ist ab sofort {duration}. {provider} benötigt {required}, um Medien für diesen Beitragstyp vorzubereiten.',
  'web.calendar.reschedule.pastTitle': 'Diese Zeit ist vergangen',
  'web.calendar.reschedule.pastBody':
    'Wählen Sie einen Zeitpunkt in der Zukunft aus oder veröffentlichen Sie stattdessen jetzt.',

  'web.calendar.published.title': 'Dieser Beitrag ist bereits veröffentlicht',
  'web.calendar.published.body':
    'Es gibt einen Beitrag auf {provider} unter {permalinkLabel}. Durch das Verschieben des Eintrags in Post Array wird der Beitrag auf der Plattform nicht verschoben. Wählen Sie, was passieren soll.',
  'web.calendar.published.optionLocal': 'Nur den lokalen Datensatz aktualisieren',
  'web.calendar.published.optionLocalHint':
    'Die Quittung enthält die tatsächliche Veröffentlichungszeit. Nur der Planungseintrag wird verschoben, sodass Ihr Kalender Ihrem Plan entspricht.',
  'web.calendar.published.optionNew': 'Planen Sie einen neuen Beitrag zum neuen Zeitpunkt',
  'web.calendar.published.optionNewHint':
    'Dadurch entsteht ein zweiter, separater externer Beitrag. Derjenige, der bereits auf {provider} ist, bleibt online.',
  'web.calendar.published.optionLabel': 'Was soll passieren',

  'web.calendar.attention.title':
    '{count, plural, one {# Beitrag benötigt eine Entscheidung oder eine Korrektur} other {# Beiträge benötigen eine Entscheidung oder eine Korrektur}}',
  'web.calendar.attention.body': 'Sie bleiben hier und im Action Center, bis sie gelöst sind.',
  'web.calendar.attention.open': 'Öffnen Sie das Action Center',
  'web.calendar.attention.showOnly': 'Nur diese anzeigen',

  'web.calendar.loading': 'Laden des Zeitplans',
  'web.calendar.error.title': 'Der Zeitplan konnte nicht geladen werden',
  'web.calendar.error.body':
    'Geplant hat sich nichts geändert. Ihre Beiträge werden weiterhin zum geplanten Zeitpunkt veröffentlicht.',
  'web.calendar.error.retry': 'Versuchen Sie es erneut',
  'web.calendar.empty.example':
    '09:30 Europa/Berlin, X @acme, „Geplante erste Kommentare sind live“, Geplant, 1 Bild',
  'web.calendar.emptyFiltered.body':
    'Kein Beitrag in {range} entspricht diesen Filtern. Erweitern Sie den Bereich oder löschen Sie einen Filter.',
  'web.calendar.offline.title': 'Du bist offline',
  'web.calendar.offline.body':
    'Der folgende Zeitplan zeigt die letzte von diesem Gerät geladene Kopie. Eine Neuplanung und Veröffentlichung sind erst möglich, wenn die Verbindung wiederhergestellt ist.',
  'web.calendar.rateLimited.cause':
    'Dieser Arbeitsbereich liest den Kalender öfter, als das aktuelle Fenster zulässt.',
  'web.calendar.rateLimited.resetLabel': 'Sie können es noch einmal versuchen',
  'web.calendar.rateLimited.resetUnknown':
    '{provider} hat nicht gesagt, wann dies zurückgesetzt wird.',
  'web.calendar.permission.requirementsLabel': 'Erforderlicher Umfang',
  'web.calendar.permission.title': 'Sie können diesen Kalender nicht sehen',
  'web.calendar.permission.body':
    'Der Zugriff auf den Kalender wird pro Projekt gewährt. Ihr Konto gehört zu keinem der Projekte in dieser Ansicht.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Kalender',
  'web.receipt.breadcrumb.post': 'Beitrag',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Laden des Veröffentlichungsbelegs',
  'web.receipt.notFound.title': 'Keine Quittung mit dieser Referenz',
  'web.receipt.notFound.body':
    'Sobald eine Post versandt wurde, gibt es eine Quittung. Überprüfen Sie die Referenz oder öffnen Sie den Beitrag im Kalender.',
  'web.receipt.error.title': 'Der Beleg konnte nicht geladen werden',
  'web.receipt.error.body':
    'Die Quittung ist unveränderlich und wird hiervon nicht berührt. Nichts wurde erneut veröffentlicht.',

  'web.receipt.section.summary': 'Was ist passiert?',
  'web.receipt.section.timeline': 'Zeitleiste der Veranstaltung',
  'web.receipt.section.items': 'Root-Post und Follow-up-Elemente',
  'web.receipt.section.attempts': 'Versuche',
  'web.receipt.section.provenance': 'Provenienz',
  'web.receipt.section.cost': 'Nutzung durch den Anbieter',
  'web.receipt.section.analytics': 'Analytics-Synchronisierung',
  'web.receipt.section.targets': 'Ziele in dieser Kampagne',

  'web.receipt.item.root': 'Root-Beitrag',
  'web.receipt.item.comment': 'Kommentar {position}',
  'web.receipt.item.thread': 'Gewindeteil {position}',
  'web.receipt.item.delay': 'Führt {delay} nach dem Root-Beitrag aus',
  'web.receipt.item.noDelay': 'Läuft mit dem Root-Beitrag',
  'web.receipt.item.pending': 'Noch nicht begonnen',
  'web.receipt.item.rootUnaffected':
    'Der Root-Beitrag ist live. Daran ändert auch ein Folgeelement, das fehlschlägt, nie etwas.',

  'web.receipt.attempt.heading': 'Versuchen Sie {number}',
  'web.receipt.attempt.startedAt': '{time} gestartet',
  'web.receipt.attempt.startedLabel': 'Begonnen',
  'web.receipt.attempt.responseSummary': 'Bereinigte Antwort des Anbieters',
  'web.receipt.attempt.duration': 'Nahm {duration}',
  'web.receipt.attempt.httpStatus': 'HTTP-Status',
  'web.receipt.attempt.providerRequestId': 'Referenz zur Anbieteranfrage',
  'web.receipt.attempt.retryable': 'Automatisch erneut versucht',
  'web.receipt.attempt.notRetryable': 'Nicht automatisch wiederholt',
  'web.receipt.attempt.nextRetry': 'Nächster Versuch bei {time}',
  'web.receipt.attempt.nextRetryLabel': 'Nächster Versuch',
  'web.receipt.attempt.showResponse': 'Zeigen Sie die bereinigte Antwort des Anbieters an',
  'web.receipt.attempt.hideResponse': 'Blenden Sie die bereinigte Anbieterantwort aus',
  'web.receipt.attempt.none': 'Ein Versuch, kein Misserfolg.',

  'web.receipt.provenance.capabilityVersion': 'Fähigkeits-Snapshot',
  'web.receipt.provenance.capabilityHint':
    'Der Schnappschuss, der bei der Genehmigung verwendet und vor dem Versand erneut überprüft wurde.',
  'web.receipt.provenance.accountType': 'Kontotyp',
  'web.receipt.provenance.externalAccount': 'Externe Kontoreferenz',
  'web.receipt.provenance.workflow': 'Workflow-Referenz',
  'web.receipt.provenance.createdAt': 'Quittung geschrieben {time}',

  'web.receipt.approval.notRequired': 'Für dieses Ziel war keine Genehmigung erforderlich.',
  'web.receipt.approval.policy': 'Richtlinie {policy}',
  'web.receipt.approval.unknownPolicy': 'Richtlinienverweis nicht erfasst',

  'web.receipt.cost.currency': 'Aufgeladen in {currency}',
  'web.receipt.cost.estimatedLabel': 'Vor Veröffentlichung geschätzt',
  'web.receipt.cost.actualLabel': 'Tatsächlich abgeglichen',
  'web.receipt.provenance.writtenLabel': 'Quittung geschrieben',
  'web.receipt.cost.reconciledAt': '{time} abgeglichen',
  'web.receipt.cost.notMetered':
    '{provider} erhebt für diesen Beitragstyp keine Gebühren pro Vorgang.',

  'web.receipt.analytics.never': 'Analytics wurde für diesen Beitrag noch nicht synchronisiert.',
  'web.receipt.analytics.explain':
    'Anbieter aggregieren nach ihren eigenen Zeitplänen. Die unten angegebene Zeit ist der Zeitpunkt, zu dem Post Array sie das letzte Mal gelesen hat, nicht der Zeitpunkt, zu dem die Zahlen wahr waren.',

  'web.receipt.export.download': 'Laden Sie die Quittung herunter',
  'web.receipt.export.copyReference': 'Kopieren Sie die Empfangsreferenz',
  'web.receipt.export.denied':
    'Zum Teilen einer Quittung ist die Rolle „Besitzer“, „Administrator“ oder „Genehmiger“ erforderlich. Du bist {role}.',

  'web.receipt.partial.retryFailedOnly':
    'Versuchen Sie es nur bei den Zielen erneut, bei denen ein Fehler aufgetreten ist',
  'web.receipt.partial.retryHint':
    'Bei einem erneuten Versuch wird niemals ein Ziel berührt, das bereits einen externen Beitrag erstellt hat.',

  'web.receipt.remediation.user_action_required':
    'Dies erfordert eine Änderung im Post Array oder auf {provider}, bevor es wieder ausgeführt werden kann.',
  'web.receipt.remediation.content_invalid':
    'Bearbeiten Sie den Inhalt so, dass er die {provider}-Validierung besteht, und planen Sie ihn dann erneut.',
  'web.receipt.remediation.transient_provider':
    '{provider} hat einen vorübergehenden Fehler zurückgegeben. Post Array versuchte es nach eigenem Zeitplan erneut.',
  'web.receipt.remediation.permanent_provider':
    '{provider} hat dies dauerhaft abgelehnt. Wenn Sie denselben Inhalt erneut versuchen, ändert sich die Antwort nicht.',
  'web.receipt.remediation.internal':
    'Das war ein Fehler unsererseits. Es wird mit der untenstehenden Referenz aufgezeichnet.',
  'web.receipt.remediation.unknown':
    '{provider} hat etwas zurückgegeben, für das wir keine Regel haben. Die bereinigte Antwort finden Sie unten.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Konten',
  'web.connection.tab.capabilities': 'Fähigkeitsmatrix',
  'web.connection.tab.groups': 'Kundengruppen',
  'web.connection.loading': 'Verbundene Konten werden geladen',
  'web.connection.error.title': 'Verbundene Konten konnten nicht geladen werden',
  'web.connection.error.body':
    'Die Veröffentlichung bleibt davon unberührt. Geplante Beiträge laufen weiterhin gegen den hinterlegten Zugriff.',
  'web.connection.list.label': 'Verbundene Konten',
  'web.connection.empty.example':
    'X, @acme, persönliches Profil, veröffentlicht am 12. Juni von Ana Ruiz, Veröffentlichung und Kennzahlen, zuletzt veröffentlicht am 6. August',
  'web.connection.filter.provider': 'Plattform',
  'web.connection.filter.health': 'Gesundheit',
  'web.connection.filter.group': 'Kundengruppe',
  'web.connection.filter.anyHealth': 'Jede Gesundheit',
  'web.connection.healthFilter.healthy': 'Arbeiten',
  'web.connection.healthFilter.expiring_soon': 'Läuft bald ab',
  'web.connection.healthFilter.expired': 'Zugriff abgelaufen',
  'web.connection.healthFilter.revoked': 'Zugriff widerrufen',
  'web.connection.healthFilter.permission_missing': 'Fehlende Berechtigung',
  'web.connection.healthFilter.review_pending': 'Warten auf Plattformüberprüfung',
  'web.connection.healthFilter.paused': 'Angehalten',
  'web.connection.healthFilter.unknown': 'Gesundheit nicht verfügbar',

  'web.connection.row.summaryLabel': 'Was dieses Konto kann',
  'web.connection.row.expand': 'Vollständige Zusammenfassung für {account} anzeigen',
  'web.connection.row.collapse': 'Vollständige Zusammenfassung für {account} ausblenden',
  'web.connection.row.metered':
    'Wird pro Vorgang gemessen. Geschätzte {amount} pro erstelltem Beitrag.',
  'web.connection.row.limitationHeading': 'Einschränkungen für dieses Konto',
  'web.connection.row.noLimitations':
    'Für dieses Konto gibt es keine Produktions- oder Betabeschränkung.',
  'web.connection.row.beta': 'Beta-Connector',
  'web.connection.row.betaBody':
    'Dieser Connector funktioniert mit Einschränkungen, die wir noch nicht vollständig überprüft haben. Überprüfen Sie den veröffentlichten Beitrag, bevor Sie sich darauf verlassen.',

  'web.connection.detail.expiryLabel': 'Der Zugriff läuft ab',
  'web.connection.health.expiresIn': 'Der Zugriff läuft {relativeTime} am {date} ab',
  'web.connection.health.noExpiry':
    'Dieser Zugriff läuft nicht nach einem Zeitplan ab, den uns {provider} mitteilt.',
  'web.connection.health.checkedAt': 'Zustand überprüft {relativeTime}',

  'web.connection.action.inspect': 'Überprüfen Sie die Berechtigungen',
  'web.connection.action.viewCapabilities': 'Sehen Sie, was es unterstützt',
  'web.connection.action.moveGroup': 'In eine andere Gruppe wechseln',
  'web.connection.action.menu': 'Weitere Aktionen für {account}',

  'web.connection.pause.title': 'Pause {account}?',
  'web.connection.resume.title': '{account} fortsetzen?',
  'web.connection.resume.body':
    'Geplante Beiträge für dieses Konto werden zum geplanten Zeitpunkt wieder veröffentlicht. Beiträge, deren Zeit bereits abgelaufen ist, werden nicht rückwirkend ausgelöst.',
  'web.connection.disconnect.confirmWord': 'TRENNEN',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# geplanter Beitrag} other {# geplante Beiträge}} für dieses Konto wird nicht veröffentlicht.',
  'web.connection.disconnect.consequence.published':
    'Bereits veröffentlichte Beiträge bleiben auf {provider}. Post Array löscht sie nicht.',
  'web.connection.disconnect.consequence.analytics':
    'Bereits erfasste Metriken bleiben in diesem Arbeitsbereich und werden nicht mehr aktualisiert.',

  'web.connection.connect.title': 'Verbinden Sie ein Konto',
  'web.connection.connect.chooseProvider': 'Welche Plattform',
  'web.connection.connect.permissionHeading': 'Wonach Post Array {provider} fragen wird',
  'web.connection.connect.requirementHeading': 'Bevor Sie fortfahren',
  'web.connection.connect.continue': 'Weiter zu {provider}',
  'web.connection.connect.handoffNote':
    'Der nächste Bildschirm ist {provider}, nicht Post Array. Post Array sieht Ihr Passwort nie.',
  'web.connection.connect.noWriteWithoutApproval':
    'Durch das Verbinden eines Kontos wird nichts veröffentlicht. Jeder Beitrag folgt weiterhin dieser Workspace-Genehmigungsrichtlinie.',

  'web.connection.requirement.instagram':
    'Für die Veröffentlichung auf Instagram ist ein professionelles Konto erforderlich, d. h. ein Geschäfts- oder Erstellerkonto, das mit einer Facebook-Seite verknüpft ist.',
  'web.connection.requirement.facebook':
    'Post Array veröffentlicht auf Facebook-Seiten. Ein persönliches Profil kann kein Veröffentlichungsziel sein.',
  'web.connection.requirement.linkedin':
    'Um für eine Organisation zu veröffentlichen, benötigen Sie eine Inhaltsadministratorrolle auf dieser LinkedIn-Seite.',
  'web.connection.requirement.youtube':
    'Bis Google das App-Audit abschließt, werden Uploads aus diesem Projekt als privat veröffentlicht. Sie können die Sichtbarkeit auf YouTube nachträglich ändern.',
  'web.connection.requirement.tiktok':
    'Bei TikTok müssen Sie die Zielgruppe für jeden Beitrag selbst auswählen. Post Array kann keine Vorauswahl für Sie treffen.',
  'web.connection.requirement.x':
    'X Gebühren pro Vorgang. Ein Beitrag, der eine URL enthält, kostet mehr als ein reiner Textbeitrag und der Kostenvoranschlag wird vor der Planung angezeigt.',
  'web.connection.requirement.threads':
    'Für die Veröffentlichung von Threads wird das Konto verwendet, das mit Ihrem professionellen Instagram-Konto verknüpft ist.',
  'web.connection.requirement.bluesky':
    'Bluesky verbindet sich mit einem App-Passwort, das in Ihren Bluesky-Einstellungen erstellt wurde, nicht mit Ihrem Kontopasswort.',
  'web.connection.requirement.generic':
    'Sie benötigen die Erlaubnis, auf diesem Konto von der Plattform selbst aus zu posten. Post Array kann es nicht gewähren.',

  'web.connection.purpose.publish': 'Veröffentlichen der von Ihnen geplanten Beiträge in Post Array.',
  'web.connection.purpose.readPosts':
    'Lesen Sie einen von Post Array veröffentlichten Beitrag noch einmal durch, damit anhand der Quittung nachgewiesen werden kann, dass er aktiv ist.',
  'web.connection.purpose.identity':
    'Zeigt den genauen Kontonamen in Post Array an, damit Sie nie auf dem falschen Konto veröffentlichen.',
  'web.connection.purpose.analytics':
    'Lesen Sie die Metriken, die diese Plattform für Ihre eigenen Beiträge meldet.',
  'web.connection.purpose.refresh':
    'Halten Sie den Zugriff aufrecht, damit ein geplanter Beitrag nicht über Nacht scheitert.',
  'web.connection.purpose.chooseDestination':
    'Auflistung der Seiten und Kanäle, die Sie als Veröffentlichungsziel auswählen können.',

  'web.connection.permissions.title': 'Berechtigungen für {account}',
  'web.connection.permissions.scopeColumn': 'Erlaubnis',
  'web.connection.permissions.stateColumn': 'Staat',
  'web.connection.permissions.purposeColumn': 'Wofür Post Array es verwendet',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {# Berechtigung fehlt} other {# Berechtigungen fehlen}}. Stellen Sie die Verbindung erneut her und akzeptieren Sie sie, um die folgenden Funktionen wiederherzustellen.',
  'web.connection.permissions.snapshot': 'Lesen Sie aus {provider} {relativeTime}',

  'web.connection.capability.title': 'Fähigkeitsmatrix',
  'web.connection.capability.subtitle':
    'Aus den versionierten Connector-Definitionen in diesem Build generiert und anschließend manuell überprüft. Es handelt sich um dieselben Daten, die der Composer und die öffentliche Funktionsseite verwenden.',
  'web.connection.capability.tableLabel': 'Funktionen nach Plattform',
  'web.connection.capability.featureColumn': 'Fähigkeit',
  'web.connection.capability.legendTitle': 'So lesen Sie das',
  'web.connection.capability.legend.supported':
    'Post Array kann dies heute für ein verbundenes Konto des richtigen Typs tun.',
  'web.connection.capability.legend.not_implemented':
    'Die Plattform bietet dies und Post Array hat es noch nicht gebaut. Es steht auf der Connector-Roadmap.',
  'web.connection.capability.legend.unsupported':
    'Die Plattform bietet dies nicht über ihre offizielle API an, sodass kein Tool dies sicher tun kann.',
  'web.connection.capability.legend.requires_review':
    'Gebaut, und die Plattform gewährt es erst, nachdem sie die App oder das Konto überprüft hat.',
  'web.connection.capability.versionLabel': 'Connector-Definitionen',
  'web.connection.capability.version': 'Connector-Definitionsversion {version}',
  'web.connection.capability.observedAt': 'Schnappschuss gelesen {relativeTime}',
  'web.connection.capability.forAccount': 'Angezeigt für {account}',
  'web.connection.capability.noSnapshot':
    'Für dieses Konto gibt es noch keinen Funktions-Snapshot. Stellen Sie die Verbindung wieder her, um eine zu lesen.',
  'web.connection.capability.cellLabel': '{feature} auf {provider}: {state}',

  'web.connection.group.title': 'Kundengruppen',
  'web.connection.group.listLabel': 'Kundengruppen',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Keine Konten} one {# Konto} other {# Konten}}',
  'web.connection.group.create': 'Erstellen Sie eine Gruppe',
  'web.connection.group.nameLabel': 'Gruppenname',
  'web.connection.group.namePlaceholder': 'Acme EU',
  'web.connection.group.moveTitle': 'Verschieben Sie {account}',
  'web.connection.group.moveLabel': 'Bewegen Sie sich nach',
  'web.connection.group.moveConfirm': 'Konto verschieben',
  'web.connection.group.movedAnnouncement': '{account} wurde nach {group} verschoben',
  'web.connection.group.filterCalendarHint':
    'Eine Gruppe filtert den Kalender und die Analysen. Beim Verschieben eines Kontos bleiben alle bereits vorhandenen Beiträge, Belege und Kennzahlen erhalten.',
  'web.connection.group.empty.title': 'Noch keine Kundengruppen',
  'web.connection.group.empty.body':
    'Ein Projekt hält ein Produkt oder einen Kunden und dessen verbundene Konten im Kalender und in den Analysen zusammen.',

  'web.connection.incident.title': 'Dieses Konto erfordert Aufmerksamkeit',
  'web.connection.incident.remediationHeading': 'Was zu tun ist',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# geplanter Beitrag ist auf Eis gelegt} other {# geplante Beiträge sind auf Eis gelegt}} für dieses Konto.',
  'web.connection.incident.nothingLost': 'Nichts geht verloren und nichts wird dupliziert.',
  'web.connection.projectScope.title': 'Kanäle für {project} werden angezeigt',
  'web.connection.projectScope.body':
    'Neue Kanäle werden mit diesem Projekt verbunden. Wechseln Sie das Projekt in der oberen Leiste, um einen anderen Satz zu verwalten.',
  'web.connection.projectMissing.title':
    'Erstellen Sie ein Projekt, bevor Sie einen Kanal verbinden',
  'web.connection.projectMissing.body':
    'Projekte halten Kanäle, Medien, Entwürfe und Zeitpläne verschiedener Produkte oder Kunden getrennt.',
} as const;
