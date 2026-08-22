/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message': '{provider} a besoin de texte pour ce type de message.',
  'validation.text_too_long.message':
    '{over, plural, one {# caractère dépassant la limite pour {account}} many {# caractères dépassant la limite pour {account}} other {# caractères dépassant la limite pour {account}}}',
  'validation.text_too_long.hint': '{provider} permet {limit} caractères pour ce compte.',
  'validation.text_too_short.message': "{provider} a besoin d'au moins {min} personnages ici.",
  'validation.title_required.message': "{provider} a besoin d'un titre.",
  'validation.title_too_long.message': 'Le titre est sur le {limit} limite de caractères.',
  'validation.description_too_long.message':
    'La description est sur le {limit} limite de caractères.',
  'validation.media_required.message':
    "{provider} a besoin d'au moins une image ou une vidéo pour ce type de message.",
  'validation.media_count_exceeded.message':
    '{provider} accepte au maximum {limit, plural, one {# déposer} many {# fichiers} other {# fichiers}} ici. Ce message a {count}.',
  'validation.media_type_unsupported.message': "{provider} n'accepte pas {mimeType} fichiers.",
  'validation.media_aspect_ratio_unsupported.message':
    "Ce fichier est {actual}. {provider} a besoin d'un rapport entre {min} et {max}.",
  'validation.media_aspect_ratio_unsupported.hint':
    'Recadrez-le avec le préréglage de la plate-forme pour résoudre ce problème.',
  'validation.media_resolution_too_low.message':
    "Ce fichier est {actual}. {provider} a besoin d'au moins {required}.",
  'validation.media_duration_too_long.message':
    "Cette vidéo est {actual}. {provider} accepte jusqu'à {limit} pour ce compte.",
  'validation.media_duration_too_short.message':
    "Cette vidéo est {actual}. {provider} a besoin d'au moins {limit}.",
  'validation.media_file_too_large.message':
    "Ce fichier est {actual}. {provider} accepte jusqu'à {limit}.",
  'validation.media_mixed_types_unsupported.message':
    "{provider} ne peut pas publier d'images et de vidéos dans le même message.",
  'validation.alt_text_missing.message':
    'Le texte alternatif est manquant sur {count, plural, one {# image} many {# images} other {# images}}.',
  'validation.alt_text_missing.hint': "Décrivez l'image ou marquez-la comme décorative.",
  'validation.thumbnail_unsupported.message':
    "{provider} n'accepte pas de vignette personnalisée ici.",
  'validation.destination_required.message': 'Choisissez où cela est publié sur {provider}.',
  'validation.destination_unsupported.message':
    "{destination} n'accepte pas ce type de message sur {provider}.",
  'validation.mention_unresolved.message':
    "{count, plural, one {# mention n'a pas été associée à un compte réel} many {# mentions n'ont pas été associées à des comptes réels} other {# mentions n'ont pas été associées à des comptes réels}}.",
  'validation.mention_unresolved.hint':
    'Sélectionnez le compte dans les résultats de recherche ou supprimez la mention. Le texte brut n’est jamais publié en tant que balise native.',
  'validation.hashtag_count_exceeded.message':
    '{count} des hashtags. {provider} compte plus que {limit} comme spam.',
  'validation.link_not_allowed.message': "{provider} n'autorise pas les liens dans ce champ.",
  'validation.link_destination_unverified.message':
    'Le domaine de lien {domain} n’est pas vérifié pour cet espace de travail.',
  'validation.privacy_setting_required.message':
    '{provider} nécessite un choix explicite de confidentialité avant la publication.',
  'validation.privacy_setting_required.hint':
    "Il n'y a pas de défaut. Choisissez qui peut voir ce message.",
  'validation.disclosure_required.message':
    'Cette publication nécessite une divulgation conformément aux règles du projet pour {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} ne prend pas en charge un premier commentaire programmé pour ce compte.',
  'validation.thread_unsupported.message':
    '{provider} ne prend pas en charge les discussions pour ce compte.',
  'validation.repeat_end_required.message':
    'Une publication répétitive nécessite une date de fin ou un certain nombre de répétitions.',
  'validation.schedule_in_past.message': 'Ce temps est passé {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    "C'est plus en avance que le {limit} anticipez ce titre.",
  'validation.schedule_outside_quiet_hours.message':
    'Cela tombe dans les heures calmes fixées pour {project}.',
  'validation.duplicate_within_window.message':
    'Un contenu très similaire est déjà programmé ou publié pour {account} dans {window}.',
  'validation.blocked_term_present.message': 'Le texte contient un terme bloqué pour {project}.',
  'validation.unsupported_claim.message':
    'Cette allégation ne figure pas dans les allégations approuvées pour {project}.',
  'validation.unsupported_claim.hint':
    'Ajoutez-le aux allégations approuvées avec des preuves ou reformulez la phrase.',
  'validation.cadence_exceeded.message':
    '{account} publierait {count, plural, one {# temps} many {# fois} other {# fois}} ce jour-là, au-delà de la limite de {limit}.',
  'validation.connection_paused.message': '{account} est en pause et ne sera pas publié.',
  'validation.account_type_invalid.message':
    "{account} n'est pas le type de compte {provider} requis pour ce type de message.",

  'validation.severity.error': 'Doit réparer',
  'validation.severity.warning': 'Vérifiez ceci',
  'validation.severity.info': 'Pour votre information',
  'validation.field.required': 'Ce champ est obligatoire.',
  'validation.field.tooShort':
    'Utiliser au moins {min, plural, one {# personnage} many {# caractères} other {# caractères}}.',
  'validation.field.tooLong':
    'Utiliser au maximum {max, plural, one {# personnage} many {# caractères} other {# caractères}}.',
  'validation.field.invalidEmail': 'Entrez une adresse e-mail valide.',
  'validation.field.invalidUrl': 'Saisissez une URL complète, y compris https.',
  'validation.field.invalidDate': 'Entrez une date valide.',
  'validation.field.invalidTime': 'Entrez une heure valide.',
  'validation.field.invalidNumber': 'Entrez un numéro.',
  'validation.field.outOfRange': 'Entrez une valeur entre {min} et {max}.',
  'validation.field.mustMatch': 'Ces deux valeurs doivent correspondre.',
  'validation.field.alreadyTaken': "C'est déjà utilisé.",
  'validation.field.unsafeValue': "Cette valeur n'est pas autorisée ici.",
  'validation.media_unavailable.message':
    "Un fichier joint n'est plus disponible. Retirez-le de la publication ou téléversez-le à nouveau.",
  'validation.media_rights_undeclared.message':
    'Déclarez les droits et le consentement de chaque fichier joint avant de publier.',
  'validation.media_not_ready.message':
    "Un fichier joint n'a pas encore passé le traitement et les contrôles de sécurité.",
  'validation.media_scan_blocked.message':
    "Un fichier joint n'a pas passé son contrôle de sécurité et ne peut pas être publié.",
} as const;
