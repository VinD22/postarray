/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'Etwas ist schief gelaufen und wir konnten es nicht klassifizieren.',
  'error.unknown.action':
    'Versuchen Sie es erneut. Wenn das Problem weiterhin auftritt, senden Sie uns die untenstehende Referenz.',
  'error.internal.message': 'Dies ist ein Problem auf unserer Seite, nicht bei Ihren Inhalten.',
  'error.internal.action':
    'Ihre Arbeit wird gespeichert. Wir wurden alarmiert. Versuchen Sie es in ein paar Minuten noch einmal.',
  'error.not_implemented.message': 'Post Array hat dies noch nicht gebaut.',
  'error.not_implemented.action': 'Befolgen Sie das Änderungsprotokoll, wenn es versendet wird.',
  'error.offline.message': 'Du bist offline.',
  'error.offline.action':
    'Ihr Entwurf wird auf diesem Gerät gespeichert. Veröffentlichung und Planung werden fortgesetzt, sobald die Verbindung wiederhergestellt ist.',
  'error.network_unreachable.message': 'Wir konnten den Server nicht erreichen.',
  'error.network_unreachable.action':
    'Überprüfen Sie Ihre Verbindung und versuchen Sie es erneut. Nichts ging verloren.',
  'error.request_invalid.message': 'Die Anfrage war nicht in einer Form, die wir annehmen können.',
  'error.request_invalid.action':
    'Überprüfen Sie die unten aufgeführten Felder und senden Sie es erneut.',
  'error.validation_failed.message':
    'Einige Felder müssen geändert werden, bevor diese gespeichert werden können.',
  'error.validation_failed.action': 'Korrigieren Sie die hervorgehobenen Felder.',
  'error.unauthenticated.message': 'Dazu müssen Sie angemeldet sein.',
  'error.unauthenticated.action': 'Melden Sie sich an und wir bringen Sie hierher zurück.',
  'error.session_expired.message': 'Ihre Sitzung ist abgelaufen.',
  'error.session_expired.action': 'Melden Sie sich erneut an. Ihr Entwurf wird gespeichert.',
  'error.mfa_required.message': 'Für diese Aktion ist eine Zwei-Faktor-Bestätigung erforderlich.',
  'error.mfa_required.action': 'Bestätigen Sie mit Ihrer Authentifizierungs-App, um fortzufahren.',
  'error.forbidden.message': 'Ihre Rolle lässt diese Aktion nicht zu.',
  'error.forbidden.action':
    'Bitten Sie einen Besitzer oder Administrator dieses Arbeitsbereichs um Zugriff.',
  'error.insufficient_scope.message':
    'Diese Anmeldeinformationen haben nicht den Geltungsbereich {scope}.',
  'error.insufficient_scope.action':
    'Gewähren Sie diesen Bereich oder verwenden Sie einen Berechtigungsnachweis, der ihn bereits besitzt.',
  'error.workspace_not_found.message':
    'Dieser Arbeitsbereich existiert nicht oder Sie sind kein Mitglied.',
  'error.workspace_not_found.action': 'Wählen Sie einen Arbeitsbereich, zu dem Sie gehören.',
  'error.workspace_suspended.message': 'Dieser Arbeitsbereich ist gesperrt.',
  'error.workspace_suspended.action':
    'Wenden Sie sich an den Support, um das Problem zu beheben. Ihre Daten sind intakt.',
  'error.not_found.message': 'Dieser Artikel existiert nicht mehr.',
  'error.not_found.action':
    'Möglicherweise wurde es gelöscht. Gehen Sie zurück und aktualisieren Sie die Liste.',
  'error.conflict.message': 'Jemand anderes hat dies geändert, während Sie daran gearbeitet haben.',
  'error.conflict.action': 'Überprüfen Sie beide Versionen und speichern Sie sie dann erneut.',
  'error.idempotency_key_reused.message':
    'Dieser Idempotenzschlüssel wurde bereits für eine andere Anfrage verwendet.',
  'error.idempotency_key_reused.action':
    'Verwenden Sie einen neuen Schlüssel oder wiederholen Sie die exakte ursprüngliche Anfrage.',
  'error.rate_limited.message': 'Zu viele Anfragen.',
  'error.rate_limited.action': 'Versuchen Sie es nach {time} noch einmal.',
  'error.quota_exceeded.message':
    'Diese Aktion überschreitet das Limit für den aktuellen Zeitraum.',
  'error.quota_exceeded.action': 'Das Limit wird {relativeTime} zurückgesetzt.',
  'error.payment_required.message':
    'Für diesen Arbeitsbereich ist kein aktives Abonnement vorhanden.',
  'error.payment_required.action':
    'Starten Sie das Abonnement, um es erneut zu veröffentlichen. Es wird nichts gelöscht.',
  'error.subscription_past_due.message': 'Die letzte Zahlung ist nicht erfolgt.',
  'error.subscription_past_due.action': 'Aktualisieren Sie die Zahlungsmethode im Polar-Portal.',
  'error.trial_expired.message': 'Der Prozess endete am {date}.',
  'error.trial_expired.action':
    'Starten Sie das Abonnement, um mit der Veröffentlichung fortzufahren.',
  'error.post_credits_exhausted.message':
    'Dieser Arbeitsbereich hat alle kostenlosen Beiträge verbraucht. Alles andere funktioniert weiterhin.',
  'error.post_credits_exhausted.action':
    'Wählen Sie einen Tarif, um weiter zu veröffentlichen. Ihre Konten bleiben verbunden und Ihre Entwürfe und Planungen bleiben erhalten.',
  'error.entitlement_missing.message':
    'Dieser Arbeitsbereich hat keinen Zugriff auf diese Funktion.',
  'error.entitlement_missing.action':
    'Überprüfen Sie die Abrechnungseinstellungen oder wenden Sie sich an den Support.',
  'error.channel_limit_reached.message':
    'Dieser Arbeitsbereich nutzt bereits alle {limit} aktiven Kanäle.',
  'error.channel_limit_reached.action':
    'Trennen Sie einen Kanal, bevor Sie einen anderen anschließen.',
  'error.connection_not_found.message':
    'Diese Verbindung befindet sich nicht mehr in diesem Arbeitsbereich.',
  'error.connection_not_found.action':
    'Verbinden Sie das Konto erneut, um weiterhin darauf zu veröffentlichen.',
  'error.connection_revoked.message': '{account} hat den Zugriff auf {provider} widerrufen.',
  'error.connection_revoked.action':
    'Verbinden Sie das Konto erneut. Danach werden die geplanten Beiträge fortgesetzt.',
  'error.connection_expired.message': 'Zugriff für {account} abgelaufen.',
  'error.connection_expired.action':
    'Verbinden Sie das Konto erneut, um die Veröffentlichung und Analyse wiederherzustellen.',
  'error.connection_paused.message': '{account} ist pausiert.',
  'error.connection_paused.action':
    'Setzen Sie den Vorgang über Connections fort, wenn Sie bereit sind.',
  'error.connection_permission_missing.message':
    '{account} hat nicht die dafür erforderliche Berechtigung erteilt.',
  'error.connection_permission_missing.action':
    'Stellen Sie die Verbindung wieder her und akzeptieren Sie {permission} auf dem Zustimmungsbildschirm.',
  'error.connection_account_type_invalid.message':
    'Instagram braucht einen professionellen Account. {account} ist ein persönliches Konto.',
  'error.connection_account_type_invalid.action':
    'Wechseln Sie in der Instagram-App zu einem Geschäfts- oder Erstellerkonto und stellen Sie dann die Verbindung wieder her.',
  'error.connection_review_pending.message': '{provider} überprüft diese App noch für {account}.',
  'error.connection_review_pending.action':
    'Beiträge werden privat veröffentlicht, bis die Überprüfung abgeschlossen ist. Wir aktualisieren diese Seite, wenn sie sich ändert.',
  'error.capability_unsupported.message':
    '{provider} bietet dies nicht über seine offizielle API an.',
  'error.capability_unsupported.action': 'Verwenden Sie ein Format, das dieses Konto unterstützt.',
  'error.capability_not_implemented.message': 'Post Array hat dies für {provider} noch nicht erstellt.',
  'error.capability_not_implemented.action':
    'Auf der Funktionsseite wird aufgeführt, was jeder Connector heute leisten kann.',
  'error.capability_requires_review.message':
    '{provider} gewährt dies erst, nachdem es die App oder das Konto überprüft hat.',
  'error.capability_requires_review.action':
    'Es bleibt nicht verfügbar, bis diese Überprüfung abgeschlossen ist.',
  'error.content_invalid.message': '{provider} akzeptiert diesen Inhalt nicht für {account}.',
  'error.content_invalid.action':
    'Die Probleme werden auf dem Ziel aufgelistet. Beheben Sie sie und versuchen Sie es erneut.',
  'error.content_changed_after_approval.message':
    'Dieser Beitrag wurde nach der Genehmigung geändert.',
  'error.content_changed_after_approval.action':
    'Fordern Sie erneut eine Genehmigung an, bevor es veröffentlicht werden kann.',
  'error.duplicate_content.message':
    'Sehr ähnliche Inhalte wurden unter {account} {relativeTime} veröffentlicht.',
  'error.duplicate_content.action':
    'Ändern Sie den Text oder veröffentlichen Sie ihn später. Plattformen beschränken doppelte Beiträge.',
  'error.cadence_limit_reached.message':
    '{account} hat den für diesen Arbeitsbereich festgelegten Veröffentlichungsrhythmus erreicht.',
  'error.cadence_limit_reached.action':
    'Planen Sie dies für einen späteren Slot oder erhöhen Sie die Trittfrequenzgrenze.',
  'error.media_invalid.message': 'Diese Datei kann nicht unter {provider} veröffentlicht werden.',
  'error.media_invalid.action': 'Der genaue Grenzwert wird neben der Datei angezeigt.',
  'error.media_too_large.message': 'Diese Datei ist größer als {provider} akzeptiert.',
  'error.media_too_large.action':
    'Komprimieren Sie es oder laden Sie eine kleinere Version hoch. Das Original bleibt erhalten.',
  'error.media_processing_failed.message':
    'Wir konnten diese Datei nicht für {provider} vorbereiten.',
  'error.media_processing_failed.action':
    'Versuchen Sie es erneut hochzuladen oder verwenden Sie ein anderes Format.',
  'error.media_rights_undeclared.message': 'Für dieses Medium gibt es keine Rechteerklärung.',
  'error.media_rights_undeclared.action':
    'Bestätigen Sie, dass Sie die Rechte zur Veröffentlichung haben, einschließlich aller darin enthaltenen Personen.',
  'error.alt_text_required.message': 'Dieses Bild benötigt Alternativtext für {provider}.',
  'error.alt_text_required.action': 'Beschreiben Sie das Bild oder markieren Sie es als dekorativ.',
  'error.approval_required.message':
    'Dieser Arbeitsbereich erfordert vor der Veröffentlichung eine Genehmigung.',
  'error.approval_required.action': 'Fordern Sie die Genehmigung von {approver} an.',
  'error.approval_expired.message': 'Die Genehmigung für diesen Beitrag ist am {date} abgelaufen.',
  'error.approval_expired.action': 'Bitten Sie erneut um Genehmigung.',
  'error.schedule_in_past.message':
    'Diese Uhrzeit liegt in {timeZone} bereits in der Vergangenheit.',
  'error.schedule_in_past.action':
    'Wählen Sie eine spätere Uhrzeit oder veröffentlichen Sie jetzt.',
  'error.schedule_conflict.message':
    '{account} hat bereits einen Beitrag innerhalb von {duration} um diese Uhrzeit.',
  'error.schedule_conflict.action':
    'Verschieben Sie einen davon oder fahren Sie fort, wenn dieser Abstand beabsichtigt ist.',
  'error.time_zone_invalid.message': 'Wir erkennen die Zeitzone {timeZone} nicht.',
  'error.time_zone_invalid.action': 'Wählen Sie eine Zone aus der Liste.',
  'error.destination_unavailable.message':
    'Das Ziel {destination} ist auf {provider} nicht mehr verfügbar.',
  'error.destination_unavailable.action':
    'Aktualisieren Sie die Zielliste und wählen Sie ein anderes aus.',
  'error.mention_unresolved.message':
    'Eine Erwähnung wurde keinem echten {provider} Konto zugeordnet.',
  'error.mention_unresolved.action':
    'Suchen Sie nach dem Konto und wählen Sie es aus oder entfernen Sie die Erwähnung. Wir veröffentlichen niemals eine erfundene native Markierung.',
  'error.provider_transient.message': '{provider} konnte dies derzeit nicht verarbeiten.',
  'error.provider_transient.action':
    'Wir werden es automatisch erneut versuchen. Nichts wird dupliziert.',
  'error.provider_permanent.message':
    '{provider} hat dies abgelehnt und akzeptiert keinen erneuten Versuch.',
  'error.provider_permanent.action': 'Die bereinigte Antwort finden Sie auf der Quittung.',
  'error.provider_rate_limited.message': '{provider} Rate hat diesen Arbeitsbereich eingeschränkt.',
  'error.provider_rate_limited.action': 'Wir werden es nach {time} erneut versuchen.',
  'error.provider_unavailable.message': '{provider} antwortet nicht.',
  'error.provider_unavailable.action':
    'Überprüfen Sie die Statusseite. Geplante Beiträge werden ständig wiederholt.',
  'error.provider_content_rejected.message':
    '{provider} hat diesen Inhalt gemäß seinen eigenen Richtlinien abgelehnt.',
  'error.provider_content_rejected.action':
    'Der Grund dafür steht auf der Quittung. Bearbeiten Sie den Inhalt oder legen Sie Einspruch mit {provider} ein.',
  'error.user_action_required.message':
    '{account} benötigt etwas von Ihnen, bevor es veröffentlicht werden kann.',
  'error.user_action_required.action': 'Öffnen Sie die Verbindung, um zu sehen, was fehlt.',
  'error.short_link_destination_blocked.message': 'Dieses Ziel kann nicht verkürzt werden.',
  'error.short_link_destination_blocked.action':
    'Private Netzwerke, unsichere Systeme und bekannte missbräuchliche Ziele werden blockiert.',
  'error.short_link_domain_unverified.message': 'Die Domain {domain} ist noch nicht verifiziert.',
  'error.short_link_domain_unverified.action':
    'Fügen Sie den in den Einstellungen angezeigten DNS-Eintrag hinzu und überprüfen Sie ihn.',
  'error.rss_feed_invalid.message':
    'Diese URL hat keinen gültigen RSS- oder Atom-Feed zurückgegeben.',
  'error.rss_feed_invalid.action':
    'Überprüfen Sie die Adresse. Wir holen es sicher ab und folgen keinen privaten Weiterleitungen.',
  'error.webhook_signature_invalid.message': 'Die Signatur dieses Webhooks wurde nicht überprüft.',
  'error.webhook_signature_invalid.action':
    'Überprüfen Sie, ob der Absender das aktuelle Signaturgeheimnis verwendet. Die Nutzlast wurde nicht verarbeitet.',
  'error.webhook_delivery_failed.message': 'Die Lieferung an {endpoint} ist fehlgeschlagen.',
  'error.webhook_delivery_failed.action':
    'Wir versuchen es erneut mit Backoff. Das Zustellungsprotokoll enthält die Antwort.',
  'error.automation_rule_not_permitted.message':
    'Diese Regel würde gegen eine Plattformregel verstoßen und kann daher nicht erstellt werden.',
  'error.automation_rule_not_permitted.action':
    'Automatisierte Likes, Follows, unerwünschte Antworten und doppelte Massenbeiträge sind niemals verfügbar.',
  'error.ai_unavailable.message': 'Der Schreibassistent ist derzeit nicht verfügbar.',
  'error.ai_unavailable.action': 'Ihr Text ist unberührt. Versuchen Sie es in Kürze noch einmal.',
  'error.ai_output_invalid.message':
    'Der Assistent hat etwas zurückgegeben, das wir nicht validieren konnten.',
  'error.ai_output_invalid.action':
    'Auf Ihren Entwurf wurde nichts angewendet. Versuchen Sie es erneut.',
  'error.ai_budget_exceeded.message':
    'Dieser Arbeitsbereich hat vorerst sein Assistentenlimit erreicht.',
  'error.ai_budget_exceeded.action':
    'Das Limit wird {relativeTime} zurückgesetzt. Das Schreiben mit der Hand funktioniert immer noch.',
  'error.storage_unavailable.message': 'Wir konnten den Medienspeicher nicht erreichen.',
  'error.storage_unavailable.action':
    'Ihr Text wird gespeichert. Versuchen Sie den Upload gleich noch einmal.',
  'error.export_unavailable.message': 'Dieser Export konnte nicht hergestellt werden.',
  'error.export_unavailable.action':
    'Versuchen Sie es mit einem kleineren Bereich oder wenden Sie sich mit der Referenz an den Support.',

  'error.reference': 'Referenz {correlationId}',
  'error.reportToSupport': 'Senden Sie dies an den Support',
  'error.contentPreserved': 'Ihr Inhalt bleibt erhalten. Es wurde nichts veröffentlicht.',
  'error.project_limit_reached.message':
    'Dieser Arbeitsbereich nutzt bereits alle {limit} aktiven Projekte.',
  'error.project_limit_reached.action':
    'Archivieren Sie ein inaktives Projekt oder ändern Sie das Projektkontingent des Arbeitsbereichs.',
  'error.project_has_connections.message':
    'Dieses Projekt hat noch {connected, plural, one {# verbundenen Kanal} other {# verbundene Kanäle}}.',
  'error.project_has_connections.action':
    'Trennen Sie jeden Kanal in diesem Projekt, bevor Sie es archivieren.',
  'error.project_last_active.message':
    'Ein Arbeitsbereich muss mindestens ein aktives Projekt behalten.',
  'error.project_last_active.action':
    'Erstellen Sie ein weiteres Projekt, bevor Sie dieses archivieren.',
} as const;
