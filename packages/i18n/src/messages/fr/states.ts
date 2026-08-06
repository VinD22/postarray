/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Brouillon',
  'state.draft.description':
    "Seules les personnes présentes dans cet espace de travail peuvent le voir. Rien n'est prévu.",
  'state.validation_needed.label': 'Validation nécessaire',
  'state.validation_needed.description':
    'Une ou plusieurs cibles ont un problème qui doit être résolu avant que cela puisse être planifié.',
  'state.approval_requested.label': 'Approbation demandée',
  'state.approval_requested.description': 'En attendant {approver} décider.',
  'state.approved.label': 'Approuvé',
  'state.approved.description':
    'Approuvé par {approver}. Il peut désormais être programmé ou publié.',
  'state.scheduled.label': 'Programmé',
  'state.scheduled.description': 'Publie {time} dans {timeZone}.',
  'state.preparing_media.label': 'Préparation des médias',
  'state.preparing_media.description':
    'Téléchargement et conversion de fichiers pour la plateforme.',
  'state.dispatching.label': 'Expéditeur',
  'state.dispatching.description': 'Envoi à {provider} maintenant.',
  'state.provider_processing.label': 'Traitement du fournisseur',
  'state.provider_processing.description':
    '{provider} a accepté le téléchargement et est toujours en train de le traiter. Nous confirmons quand il sera en direct.',
  'state.published.label': 'Publié',
  'state.published.description': 'En direct {provider} depuis {time}.',
  'state.partially_published.label': 'Partiellement publié',
  'state.partially_published.description':
    "{published, plural, one {# cible publiée} many {# objectifs publiés} other {# objectifs publiés}}, {failed, plural, one {# échoué} many {# échoué} other {# échoué}}. Les messages publiés sont en direct et n'ont pas été annulés.",
  'state.action_required.label': 'Action requise',
  'state.action_required.description':
    'Cela ne peut pas continuer tant que vous n’avez pas fait quelque chose.',
  'state.retry_scheduled.label': 'Nouvelle tentative programmée',
  'state.retry_scheduled.description':
    "Tentative {attempt} de {max} fonctionnera à {time}. Rien n'est dupliqué.",
  'state.failed_permanently.label': 'Échoué',
  'state.failed_permanently.description':
    'Cela ne sera pas réessayé. Votre contenu est conservé et la raison figure sur le reçu.',
  'state.canceled.label': 'Annulé',
  'state.canceled.description': "Annulé par {actor} sur {date}. Rien n'a été publié.",
  'state.deleted_externally.label': 'Supprimé sur la plateforme',
  'state.deleted_externally.description':
    "Ce message n'est plus publié {provider}. Le reçu et les métriques collectées avant son départ sont conservés.",

  'state.approval.not_required.label': 'Aucune approbation nécessaire',
  'state.approval.not_required.description':
    'La politique relative à ces objectifs ne nécessite pas d’approbation.',
  'state.approval.requested.label': 'Demandé',
  'state.approval.requested.description': 'Envoyé à {approver} {relativeTime}.',
  'state.approval.in_review.label': 'En revue',
  'state.approval.in_review.description': '{approver} regarde ça maintenant.',
  'state.approval.approved.label': 'Approuvé',
  'state.approval.approved.description': 'Approuvé par {approver} sur {date}.',
  'state.approval.changes_requested.label': 'Modifications demandées',
  'state.approval.changes_requested.description': '{approver} demandé des changements sur {date}.',
  'state.approval.rejected.label': 'Rejeté',
  'state.approval.rejected.description': 'Rejeté par {approver} sur {date}.',
  'state.approval.expired.label': 'Expiré',
  'state.approval.expired.description': 'Cette demande a expiré le {date} sans décision.',
  'state.approval.withdrawn.label': 'Retiré',
  'state.approval.withdrawn.description': "L'auteur a retiré cette demande le {date}.",

  'state.summary.targets':
    '{ready, plural, one {# cible prête} many {# cibles prêtes} other {# cibles prêtes}}, {blocked, plural, =0 {aucun bloqué} one {# bloqué} many {# bloqué} other {# bloqué}}',
  'state.changedAt': 'Modifié {relativeTime}',
} as const;
