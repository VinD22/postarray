/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': "Quelque chose s'est mal passé et nous n'avons pas pu le classer.",
  'error.unknown.action':
    'Essayer à nouveau. Si cela continue, envoyez-nous la référence ci-dessous.',
  'error.internal.message': "Il s'agit d'un problème de notre côté, et non de votre contenu.",
  'error.internal.action':
    'Votre travail est enregistré. Nous avons été alertés. Réessayez dans quelques minutes.',
  'error.not_implemented.message': "Relay ne l'a pas encore construit.",
  'error.not_implemented.action':
    'Suivez le journal des modifications pour savoir quand il sera expédié.',
  'error.offline.message': 'Vous êtes hors ligne.',
  'error.offline.action':
    'Votre brouillon est conservé sur cet appareil. La publication et la planification reprennent au retour de la connexion.',
  'error.network_unreachable.message': "Nous n'avons pas pu accéder au serveur.",
  'error.network_unreachable.action': "Vérifiez votre connexion et réessayez. Rien n'a été perdu.",
  'error.request_invalid.message':
    'La demande n’était pas dans une forme que nous pouvons accepter.',
  'error.request_invalid.action': 'Vérifiez les champs ci-dessous et renvoyez-le à nouveau.',
  'error.validation_failed.message':
    'Certains champs doivent être modifiés avant de pouvoir être enregistrés.',
  'error.validation_failed.action': 'Corrigez les champs en surbrillance.',
  'error.unauthenticated.message': 'Vous devez être connecté pour ce faire.',
  'error.unauthenticated.action': 'Connectez-vous et nous vous ramènerons ici.',
  'error.session_expired.message': 'Votre session a expiré.',
  'error.session_expired.action': 'Connectez-vous à nouveau. Votre brouillon est enregistré.',
  'error.mfa_required.message': 'Cette action nécessite une confirmation à deux facteurs.',
  'error.mfa_required.action':
    "Confirmez avec votre application d'authentification pour continuer.",
  'error.forbidden.message': 'Votre rôle ne permet pas cette action.',
  'error.forbidden.action':
    "Demandez l'accès à un propriétaire ou à un administrateur de cet espace de travail.",
  'error.insufficient_scope.message': "Ce titre n'a pas la portée {scope}.",
  'error.insufficient_scope.action':
    'Accordez cette portée ou utilisez un identifiant qui la possède déjà.',
  'error.workspace_not_found.message':
    "Cet espace de travail n'existe pas ou vous n'êtes pas membre.",
  'error.workspace_not_found.action': 'Choisissez un espace de travail auquel vous appartenez.',
  'error.workspace_suspended.message': 'Cet espace de travail est suspendu.',
  'error.workspace_suspended.action':
    'Contactez le support pour résoudre le problème. Vos données sont intactes.',
  'error.not_found.message': "Cet élément n'existe plus.",
  'error.not_found.action':
    'Il a peut-être été supprimé. Revenez en arrière et actualisez la liste.',
  'error.conflict.message': "Quelqu'un d'autre a modifié cela pendant que vous travailliez dessus.",
  'error.conflict.action': 'Vérifiez les deux versions, puis enregistrez à nouveau.',
  'error.idempotency_key_reused.message':
    "Cette clé d'idempotence a déjà été utilisée pour une autre demande.",
  'error.idempotency_key_reused.action':
    'Utilisez une nouvelle clé ou répétez exactement la demande initiale.',
  'error.rate_limited.message': 'Trop de demandes.',
  'error.rate_limited.action': 'Réessayez après {time}.',
  'error.quota_exceeded.message': 'Cette action dépasse la limite pour la période en cours.',
  'error.quota_exceeded.action': 'La limite est réinitialisée {relativeTime}.',
  'error.payment_required.message': "Cet espace de travail n'a pas d'abonnement actif.",
  'error.payment_required.action':
    "Démarrez l'abonnement pour publier à nouveau. Rien n'est supprimé.",
  'error.subscription_past_due.message': "Le dernier paiement n'a pas été effectué.",
  'error.subscription_past_due.action': 'Mettez à jour le mode de paiement sur le portail Polar.',
  'error.trial_expired.message': "Le procès s'est terminé le {date}.",
  'error.trial_expired.action': "Démarrez l'abonnement pour continuer la publication.",
  'error.entitlement_missing.message':
    "Cet espace de travail n'a pas accès à cette fonctionnalité.",
  'error.entitlement_missing.action':
    "Vérifiez les paramètres de facturation ou contactez l'assistance.",
  'error.channel_limit_reached.message':
    'Cet espace de travail utilise déjà tous {limit} canaux actifs.',
  'error.channel_limit_reached.action': 'Déconnectez un canal avant d’en connecter un autre.',
  'error.connection_not_found.message': "Cette connexion n'est plus dans cet espace de travail.",
  'error.connection_not_found.action': 'Connectez à nouveau le compte pour continuer à y publier.',
  'error.connection_revoked.message': '{account} accès révoqué le {provider}.',
  'error.connection_revoked.action':
    'Reconnectez le compte. Les publications programmées reprennent ensuite.',
  'error.connection_expired.message': 'Accès pour {account} expiré.',
  'error.connection_expired.action':
    'Reconnectez le compte pour restaurer la publication et les analyses.',
  'error.connection_paused.message': '{account} est en pause.',
  'error.connection_paused.action': 'Reprenez-le à partir de Connexions lorsque vous êtes prêt.',
  'error.connection_permission_missing.message':
    "{account} n'a pas accordé l'autorisation nécessaire pour ce faire.",
  'error.connection_permission_missing.action':
    'Reconnectez-vous et acceptez {permission} sur l’écran de consentement.',
  'error.connection_account_type_invalid.message':
    "Instagram a besoin d'un compte professionnel. {account} est un compte personnel.",
  'error.connection_account_type_invalid.action':
    "Basculez-le vers un compte professionnel ou créateur dans l'application Instagram, puis reconnectez-vous.",
  'error.connection_review_pending.message':
    "{provider} est toujours en train d'examiner cette application pour {account}.",
  'error.connection_review_pending.action':
    "Les messages sont publiés en privé jusqu'à ce que l'examen soit terminé. Nous mettons à jour cette page lorsqu'elle change.",
  'error.capability_unsupported.message': '{provider} ne propose pas cela via son API officielle.',
  'error.capability_unsupported.action': 'Utilisez un format pris en charge par ce compte.',
  'error.capability_not_implemented.message':
    "Relay n'a pas construit ceci pour {provider} encore.",
  'error.capability_not_implemented.action':
    "La page des capacités répertorie ce que chaque connecteur peut faire aujourd'hui.",
  'error.capability_requires_review.message':
    "{provider} ne l'accorde qu'après avoir examiné l'application ou le compte.",
  'error.capability_requires_review.action':
    "Il reste indisponible jusqu'à ce que cet examen soit terminé.",
  'error.content_invalid.message': "{provider} n'acceptera pas ce contenu pour {account}.",
  'error.content_invalid.action':
    'Les problèmes sont répertoriés sur la cible. Corrigez-les et réessayez.',
  'error.content_changed_after_approval.message': 'Ce message a changé après avoir été approuvé.',
  'error.content_changed_after_approval.action':
    "Demandez à nouveau l'approbation avant de pouvoir publier.",
  'error.duplicate_content.message':
    'Un contenu très similaire a été publié sur {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Modifiez le texte ou publiez-le plus tard. Les plateformes limitent les publications en double.',
  'error.cadence_limit_reached.message':
    '{account} a atteint la cadence de publication définie pour cet espace de travail.',
  'error.cadence_limit_reached.action':
    'Planifiez cela pour un créneau ultérieur ou augmentez la limite de cadence.',
  'error.media_invalid.message': 'Ce fichier ne peut pas être publié sur {provider}.',
  'error.media_invalid.action': 'La limite exacte est indiquée à côté du fichier.',
  'error.media_too_large.message': 'Ce fichier est plus volumineux que {provider} accepte.',
  'error.media_too_large.action':
    "Compressez-le ou téléchargez une version plus petite. L'original est conservé.",
  'error.media_processing_failed.message':
    "Nous n'avons pas pu préparer ce fichier pour {provider}.",
  'error.media_processing_failed.action':
    'Essayez de le télécharger à nouveau ou utilisez un format différent.',
  'error.media_rights_undeclared.message': "Ce média n'a aucune déclaration de droits.",
  'error.media_rights_undeclared.action':
    'Confirmez que vous disposez des droits nécessaires pour le publier, y compris toutes les personnes qui y figurent.',
  'error.alt_text_required.message': 'Cette image nécessite un texte alternatif pour {provider}.',
  'error.alt_text_required.action': "Décrivez l'image ou marquez-la comme décorative.",
  'error.approval_required.message':
    'Cet espace de travail nécessite une approbation avant la publication.',
  'error.approval_required.action': "Demander l'approbation de {approver}.",
  'error.approval_expired.message': "L'approbation de ce poste a expiré le {date}.",
  'error.approval_expired.action': "Demandez à nouveau l'approbation.",
  'error.schedule_in_past.message': 'Ce temps est déjà passé {timeZone}.',
  'error.schedule_in_past.action': 'Choisissez une heure ultérieure ou publiez maintenant.',
  'error.schedule_conflict.message': '{account} a déjà un message dans {duration} de cette époque.',
  'error.schedule_conflict.action': 'Déplacez-en un ou continuez si cet espacement est prévu.',
  'error.time_zone_invalid.message': 'Nous ne reconnaissons pas le fuseau horaire {timeZone}.',
  'error.time_zone_invalid.action': 'Choisissez une zone dans la liste.',
  'error.destination_unavailable.message':
    "La destination {destination} n'est plus disponible sur {provider}.",
  'error.destination_unavailable.action':
    'Actualisez la liste de destinations et choisissez-en une autre.',
  'error.mention_unresolved.message':
    "Une mention n'a pas été associée à un réel {provider} compte.",
  'error.mention_unresolved.action':
    'Recherchez et sélectionnez le compte, ou supprimez la mention. Nous ne publions jamais de fausse balise native.',
  'error.provider_transient.message': "{provider} Je n'ai pas pu traiter cela pour le moment.",
  'error.provider_transient.action': "Nous réessayerons automatiquement. Rien n'est dupliqué.",
  'error.provider_permanent.message':
    "{provider} a rejeté cela et n'acceptera pas de nouvelle tentative.",
  'error.provider_permanent.action': 'La réponse aseptisée figure sur le reçu.',
  'error.provider_rate_limited.message': '{provider} le taux a limité cet espace de travail.',
  'error.provider_rate_limited.action': 'Nous réessayerons après {time}.',
  'error.provider_unavailable.message': '{provider} ne répond pas.',
  'error.provider_unavailable.action':
    "Consultez la page d'état. Les publications programmées continuent de réessayer.",
  'error.provider_content_rejected.message':
    '{provider} a rejeté ce contenu en vertu de ses propres politiques.',
  'error.provider_content_rejected.action':
    'La raison donnée figure sur le reçu. Modifiez le contenu ou faites appel avec {provider}.',
  'error.user_action_required.message':
    '{account} a besoin de quelque chose de votre part avant de pouvoir publier.',
  'error.user_action_required.action': 'Ouvrez la connexion pour voir ce qui manque.',
  'error.short_link_destination_blocked.message': 'Cette destination ne peut pas être raccourcie.',
  'error.short_link_destination_blocked.action':
    'Les réseaux privés, les programmes dangereux et les destinations abusives connues sont bloqués.',
  'error.short_link_domain_unverified.message': "Le domaine {domain} n'est pas encore vérifié.",
  'error.short_link_domain_unverified.action':
    "Ajoutez l'enregistrement DNS affiché dans les paramètres, puis vérifiez.",
  'error.rss_feed_invalid.message': "Cette URL n'a pas renvoyé de flux RSS ou Atom valide.",
  'error.rss_feed_invalid.action':
    "Vérifiez l'adresse. Nous le récupérons en toute sécurité et ne suivons aucune redirection privée.",
  'error.webhook_signature_invalid.message': "La signature sur ce webhook n'a pas été vérifiée.",
  'error.webhook_signature_invalid.action':
    "Vérifiez que l'expéditeur utilise le secret de signature actuel. La charge utile n'a pas été traitée.",
  'error.webhook_delivery_failed.message': 'Livraison à {endpoint} échoué.',
  'error.webhook_delivery_failed.action':
    'Nous réessayons avec recul. Le journal de livraison contient la réponse.',
  'error.automation_rule_not_permitted.message':
    'Cette règle enfreindrait une règle de plate-forme, elle ne peut donc pas être créée.',
  'error.automation_rule_not_permitted.action':
    'Les likes, les suivis, les réponses non sollicitées et les publications massives en double ne sont jamais disponibles.',
  'error.ai_unavailable.message': "L'assistant d'écriture n'est pas disponible pour le moment.",
  'error.ai_unavailable.action': 'Votre texte est intact. Réessayez sous peu.',
  'error.ai_output_invalid.message':
    "L'assistant a renvoyé quelque chose que nous n'avons pas pu valider.",
  'error.ai_output_invalid.action': "Rien n'a été appliqué à votre brouillon. Essayer à nouveau.",
  'error.ai_budget_exceeded.message':
    "Cet espace de travail a atteint sa limite d'assistants pour le moment.",
  'error.ai_budget_exceeded.action':
    "La limite est réinitialisée {relativeTime}. L'écriture à la main fonctionne toujours.",
  'error.storage_unavailable.message': "Nous n'avons pas pu accéder au stockage multimédia.",
  'error.storage_unavailable.action':
    'Votre texte est enregistré. Réessayez le téléchargement dans un instant.',
  'error.export_unavailable.message': 'Cette exportation n’a pas pu être produite.',
  'error.export_unavailable.action':
    'Essayez une gamme plus petite ou contactez le support avec la référence.',

  'error.reference': 'Référence {correlationId}',
  'error.reportToSupport': 'Envoyez ceci au support',
  'error.contentPreserved': "Votre contenu est préservé. Rien n'a été publié.",
} as const;
