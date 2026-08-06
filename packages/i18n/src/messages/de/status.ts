/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'Noch nichts geplant',
  'empty.calendar.body':
    'Schreiben Sie Ihren ersten Beitrag und wählen Sie ein time. Sie können es später ändern.',
  'empty.calendar.action': 'Verfassen Sie einen Beitrag',
  'empty.drafts.title': 'Keine Entwürfe',
  'empty.drafts.body':
    'Von Ihnen gespeicherte Entwürfe werden hier mit ihren Zielen und Problemen angezeigt.',
  'empty.connections.title': 'Keine Konten verbunden',
  'empty.connections.body':
    'Verbinden Sie ein Konto, um darin zu veröffentlichen. Wir zeigen Ihnen zunächst die genauen Berechtigungen.',
  'empty.connections.action': 'Verbinden Sie ein Konto',
  'empty.analytics.title': 'Noch keine Messwerte',
  'empty.analytics.body':
    'Messwerte werden angezeigt, nachdem Ihr erster Beitrag lange genug online war, damit die Plattform darüber berichten kann.',
  'empty.analytics.noPermission':
    'Dieses Konto hat keinen Analysezugriff gewährt. Stellen Sie die Verbindung erneut her, um es hinzuzufügen.',
  'empty.approvals.title': 'Nichts wartet auf dich',
  'empty.approvals.body': 'Hier werden Genehmigungsanfragen für Ihre Marken angezeigt.',
  'empty.library.title': 'Ihre Bibliothek ist leer',
  'empty.library.body':
    'Laden Sie Bilder und Videos hoch oder importieren Sie sie von einer URL oder der API.',
  'empty.library.action': 'Medien hochladen',
  'empty.automation.title': 'Noch keine Regeln',
  'empty.automation.body':
    'Eine Regel reagiert auf etwas und schlägt eine Aktion vor. Jede Regel zeigt ihre Grenzen, bevor Sie sie aktivieren.',
  'empty.webhooks.title': 'Keine Endpunkte',
  'empty.webhooks.body':
    'Fügen Sie einen Endpunkt hinzu, um signierte Ereignisse zu Veröffentlichungen und Verbindungen zu empfangen.',
  'empty.searchResults.title': 'Keine Ergebnisse für {query}',
  'empty.searchResults.body': 'Überprüfen Sie die Rechtschreibung oder löschen Sie einen Filter.',
  'empty.filtered.title': 'Nichts entspricht diesen Filtern',
  'empty.filtered.action': 'Filter löschen',
  'empty.auditLog.title': 'Noch keine Aktivität',
  'empty.receipts.title': 'Noch keine Quittungen',
  'empty.receipts.body':
    'Für jede Veröffentlichung gibt es eine Quittung, die Sie einsehen und weitergeben können.',

  'loading.default': 'Laden',
  'loading.calendar': 'Laden Sie Ihren Kalender',
  'loading.analytics': 'Messwerte werden geladen',
  'loading.preview': 'Erstellen der Vorschau',
  'loading.validating': 'Überprüfung anhand aktueller Plattformgrenzen',
  'loading.publishing': 'Veröffentlichen an {provider}',
  'loading.uploading': 'Hochladen von {name}',
  'loading.uploadProgress': '{percent} hochgeladen',
  'loading.connecting': 'Verbindung mit {provider} herstellen',
  'loading.savingDraft': 'Speichern Sie Ihren Entwurf',
  'loading.generatingPlan': 'Erstellen Sie Ihren Plan',
  'loading.longRunning': 'Das dauert länger als gewöhnlich. Es läuft immer noch.',

  'offline.banner': 'Du bist offline. Änderungen werden auf diesem Gerät gespeichert.',
  'offline.draftSafe':
    'Ihr Entwurf ist sicher. Die Synchronisierung erfolgt, wenn Sie wieder online sind.',
  'offline.publishDisabled':
    'Publizieren braucht eine Verbindung. Dies wird nicht stillschweigend in die Warteschlange gestellt.',
  'offline.scheduleQueued':
    'Diese Zeitplananfrage wird auf diesem Gerät in die Warteschlange gestellt und gesendet, sobald Sie wieder online sind.',
  'offline.reconnected': 'Wieder online. Synchronisierung Ihrer Änderungen.',
  'offline.syncConflict':
    'Einige Änderungen konnten nicht automatisch zusammengeführt werden. Überprüfen Sie sie vor dem Speichern.',

  'permission.denied.title': 'Sie haben keinen Zugriff darauf',
  'permission.denied.role': 'Hierfür ist die Rolle {role} erforderlich. Du bist {currentRole}.',
  'permission.denied.scope': 'Diese Anmeldeinformationen benötigen den Bereich {scope}.',
  'permission.denied.contactOwner': 'Bitten Sie {owner}, es zu gewähren.',
  'permission.denied.brandScope': 'Ihr Zugriff ist auf {brands} beschränkt.',
  'permission.readOnly': 'Dieser Arbeitsbereich ist derzeit schreibgeschützt.',
  'permission.mfaRequired':
    'Bestätigen Sie mit der Zwei-Faktor-Authentifizierung, um fortzufahren.',

  'rateLimit.title': 'Machen Sie es für einen Moment langsamer',
  'rateLimit.body': 'Sie haben {count} Anfragen in {window} gestellt. Der Grenzwert ist {limit}.',
  'rateLimit.resetsAt': 'Dies wird bei {time} zurückgesetzt.',
  'rateLimit.cheaperAlternative':
    'Durch Planen statt Veröffentlichen wird diese Beschränkung jetzt umgangen.',
  'rateLimit.providerCost':
    '{provider} Gebühren pro Vorgang. Diese Aktion wird auf {amount} geschätzt.',

  'incident.providerDegraded':
    '{provider} hat Probleme. Geplante Beiträge werden ständig wiederholt.',
  'incident.providerDown':
    '{provider} ist nicht verfügbar. Nichts geht verloren und nichts wird dupliziert.',
  'incident.isolated': 'Andere Plattformen sind davon nicht betroffen.',
  'incident.statusPage': 'Live-Status nach Stecker und Oberfläche',
  'incident.startedAt': 'Gestartet {relativeTime}',

  'translation.incomplete':
    'Einige Texte auf diesem Bildschirm sind noch nicht in {language} übersetzt und werden auf Englisch angezeigt.',
  'translation.beta':
    'Diese Sprache befindet sich in der Betaphase. Melden Sie alles, was falsch lautet.',

  'confirm.discardChanges.title': 'Ihre Änderungen verwerfen?',
  'confirm.discardChanges.body': 'Dies kann nicht rückgängig gemacht werden.',
  'confirm.deleteItem.title': '{name} löschen?',
  'confirm.deleteItem.body': 'Dies kann nicht rückgängig gemacht werden.',
  'confirm.cancelScheduled.title': 'Diesen geplanten Beitrag abbrechen?',
  'confirm.cancelScheduled.body':
    'Es wird nicht veröffentlicht. Der Entwurf bleibt hier, sodass Sie ihn erneut planen können.',
  'confirm.publishNow.title': 'Jetzt veröffentlichen?',
  'confirm.publishNow.body':
    '{count, plural, one {Dies wird sofort auf # Konto veröffentlicht} other {Dies wird sofort auf # Konten veröffentlicht}}. Es kann nicht von Relay zurückgerufen werden.',
  'confirm.typeToConfirm': 'Geben Sie zur Bestätigung {word} ein.',
} as const;
