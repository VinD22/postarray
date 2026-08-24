/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message': '{provider} benötigt Text für diesen Beitragstyp.',
  'validation.text_too_long.message':
    '{over, plural, one {# Zeichen über dem Limit für {account}} other {# Zeichen über dem Limit für {account}}}',
  'validation.text_too_long.hint': '{provider} erlaubt {limit} Zeichen für dieses Konto.',
  'validation.text_too_short.message': '{provider} benötigt hier mindestens {min} Zeichen.',
  'validation.title_required.message': '{provider} benötigt einen Titel.',
  'validation.title_too_long.message': 'Der Titel überschreitet die Zeichenbeschränkung {limit}.',
  'validation.description_too_long.message':
    'Die Beschreibung überschreitet die Zeichenbeschränkung {limit}.',
  'validation.media_required.message':
    '{provider} benötigt mindestens ein Bild oder Video für diesen Beitragstyp.',
  'validation.media_count_exceeded.message':
    '{provider} akzeptiert hier höchstens {limit, plural, one {# Datei} other {# Dateien}}. Dieser Beitrag hat {count}.',
  'validation.media_type_unsupported.message': '{provider} akzeptiert keine {mimeType} Dateien.',
  'validation.media_aspect_ratio_unsupported.message':
    'Diese Datei ist {actual}. {provider} benötigt ein Verhältnis zwischen {min} und {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Beschneiden Sie es mit der Plattformvoreinstellung, um dieses Problem zu beheben.',
  'validation.media_resolution_too_low.message':
    'Diese Datei ist {actual}. {provider} benötigt mindestens {required}.',
  'validation.media_duration_too_long.message':
    'Dieses Video ist {actual}. {provider} akzeptiert bis zu {limit} für dieses Konto.',
  'validation.media_duration_too_short.message':
    'Dieses Video ist {actual}. {provider} benötigt mindestens {limit}.',
  'validation.media_file_too_large.message':
    'Diese Datei ist {actual}. {provider} akzeptiert bis zu {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} kann Bilder und Videos nicht im selben Beitrag veröffentlichen.',
  'validation.alt_text_missing.message':
    'Alt-Text fehlt auf {count, plural, one {# Bild} other {# Bilder}}.',
  'validation.alt_text_missing.hint':
    'Beschreiben Sie das Bild oder markieren Sie es als dekorativ.',
  'validation.thumbnail_unsupported.message':
    '{provider} akzeptiert hier keine benutzerdefinierte Miniaturansicht.',
  'validation.destination_required.message':
    'Wählen Sie aus, wo dies auf {provider} veröffentlicht wird.',
  'validation.destination_unsupported.message':
    '{destination} akzeptiert diesen Beitragstyp nicht auf {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# Erwähnung wurde keinem echten Konto zugeordnet} other {# Erwähnung wurde keinem echten Konto zugeordnet}}.',
  'validation.mention_unresolved.hint':
    'Wählen Sie das Konto aus den Suchergebnissen aus oder entfernen Sie die Erwähnung. Nur-Text wird niemals als natives Tag veröffentlicht.',
  'validation.hashtag_count_exceeded.message':
    '{count} Hashtags. {provider} zählt mehr als {limit} als Spam.',
  'validation.link_not_allowed.message': '{provider} erlaubt keine Links in diesem Feld.',
  'validation.link_destination_unverified.message':
    'Die Linkdomäne {domain} ist für diesen Arbeitsbereich nicht überprüft.',
  'validation.privacy_setting_required.message':
    '{provider} erfordert vor der Veröffentlichung eine explizite Datenschutzauswahl.',
  'validation.privacy_setting_required.hint':
    'Es gibt keinen Standardwert. Wählen Sie aus, wer diesen Beitrag sehen kann.',
  'validation.disclosure_required.message':
    'Dieser Beitrag erfordert eine Offenlegung gemäß den Projektregeln für {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} unterstützt keinen geplanten ersten Kommentar für dieses Konto.',
  'validation.thread_unsupported.message': '{provider} unterstützt keine Threads für dieses Konto.',
  'validation.repeat_end_required.message':
    'Ein sich wiederholender Beitrag benötigt ein Ende date oder ein number von Wiederholungen.',
  'validation.schedule_in_past.message': 'Dass time in {timeZone} übergeben wurde.',
  'validation.schedule_too_far_ahead.message':
    'Beiträge können bis zu {limit} im Voraus geplant werden; genauso lange werden hochgeladene Medien aufbewahrt.',
  'validation.schedule_outside_quiet_hours.message':
    'Dies fällt in die Ruhezeiten, die für {project} festgelegt sind.',
  'validation.duplicate_within_window.message':
    'Sehr ähnliche Inhalte sind bereits für {account} innerhalb von {window} geplant oder veröffentlicht.',
  'validation.blocked_term_present.message':
    'Der Text enthält einen gesperrten Begriff für {project}.',
  'validation.unsupported_claim.message':
    'Dieser Anspruch ist nicht in den genehmigten Ansprüchen für {project} enthalten.',
  'validation.unsupported_claim.hint':
    'Fügen Sie es den genehmigten Behauptungen mit Beweisen hinzu oder formulieren Sie den Satz um.',
  'validation.cadence_exceeded.message':
    '{account} würde {count, plural, one {# time} other {# Mal}} an diesem Tag veröffentlichen, über dem Limit von {limit}.',
  'validation.connection_paused.message': '{account} ist pausiert und wird nicht veröffentlicht.',
  'validation.account_type_invalid.message':
    '{account} ist nicht der Kontotyp, den {provider} für diesen Beitragstyp benötigt.',

  'validation.severity.error': 'Muss repariert werden',
  'validation.severity.warning': 'Überprüfen Sie dies',
  'validation.severity.info': 'Zu Ihrer Information',
  'validation.field.required': 'Dieses Feld ist erforderlich.',
  'validation.field.tooShort':
    'Verwenden Sie mindestens {min, plural, one {# Zeichen} other {# Zeichen}}.',
  'validation.field.tooLong':
    'Verwenden Sie maximal {max, plural, one {# Zeichen} other {# Zeichen}}.',
  'validation.field.invalidEmail': 'Geben Sie eine gültige E-Mail-Adresse ein.',
  'validation.field.invalidUrl': 'Geben Sie eine vollständige URL ein, einschließlich https.',
  'validation.field.invalidDate': 'Geben Sie ein gültiges date ein.',
  'validation.field.invalidTime': 'Geben Sie ein gültiges time ein.',
  'validation.field.invalidNumber': 'Geben Sie ein number ein.',
  'validation.field.outOfRange': 'Geben Sie einen Wert zwischen {min} und {max} ein.',
  'validation.field.mustMatch': 'Diese beiden Werte müssen übereinstimmen.',
  'validation.field.alreadyTaken': 'Das ist bereits im Einsatz.',
  'validation.field.unsafeValue': 'Dieser Wert ist hier nicht zulässig.',
  'validation.media_unavailable.message':
    'Eine angehängte Datei ist nicht mehr verfügbar. Entfernen Sie sie aus dem Beitrag oder laden Sie sie erneut hoch.',
  'validation.media_rights_undeclared.message':
    'Erklären Sie die Rechte und die Einwilligung für jede angehängte Datei, bevor Sie veröffentlichen.',
  'validation.media_not_ready.message':
    'Eine angehängte Datei hat die Verarbeitung und die Sicherheitsprüfungen noch nicht bestanden.',
  'validation.media_scan_blocked.message':
    'Eine angehängte Datei hat ihre Sicherheitsprüfung nicht bestanden und kann nicht veröffentlicht werden.',
} as const;
