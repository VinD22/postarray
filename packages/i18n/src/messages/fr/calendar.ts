/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Calendrier',
  'calendar.view.day': 'Jour',
  'calendar.view.week': 'Semaine',
  'calendar.view.month': 'Mois',
  'calendar.view.list': 'Liste',
  'calendar.view.label': 'Vue Calendrier',
  'calendar.today': "Aujourd'hui",
  'calendar.goToDate': 'Aller à ce jour',
  'calendar.previousPeriod': 'Période précédente',
  'calendar.nextPeriod': 'Période suivante',
  'calendar.timeZoneNote': 'Les heures sont indiquées dans {timeZone}.',
  'calendar.weekOf': 'Semaine de {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount':
    '{count, plural, =0 {Rien de prévu} one {# poste} many {# messages} other {# messages}}',
  'calendar.slotOverflow': '{count, plural, one {# plus} many {# plus} other {# plus}}',
  'calendar.newPostAt': 'Nouveau message à {time}',

  'calendar.filter.project': 'Project',
  'calendar.filter.account': 'Compte',
  'calendar.filter.platform': 'Plate-forme',
  'calendar.filter.status': 'Statut',
  'calendar.filter.locale': 'Langue du contenu',
  'calendar.filter.campaign': 'Campagne',
  'calendar.filter.applied':
    '{count, plural, one {# filtre appliqué} many {# filtres appliqués} other {# filtres appliqués}}',

  'calendar.drag.instructions':
    'Faites glisser une publication vers un nouvel emplacement ou sélectionnez-la et utilisez les touches fléchées pour la déplacer.',
  'calendar.drag.confirmTitle': 'Déplacer ce message ?',
  'calendar.drag.confirmBody': 'Depuis {from} à {to} dans {timeZone}.',
  'calendar.drag.dstNotice':
    'Les horloges changent entre ces heures en {timeZone}. La nouvelle heure est {utc} UTC.',
  'calendar.drag.publishedNotice':
    "Cet article est déjà publié. Le déplacer modifie uniquement l'enregistrement local. Le publier à nouveau est une action distincte.",
  'calendar.drag.conflictNotice':
    "{account} a déjà {count, plural, one {# poste} many {# messages} other {# messages}} dans l'heure qui suit la nouvelle heure.",

  'calendar.queue.title': "File d'attente",
  'calendar.queue.upcoming': 'Prochain',
  'calendar.queue.needsApproval': "En attente d'approbation",
  'calendar.queue.drafts': 'Brouillons',
  'calendar.queue.published': 'Publié',
  'calendar.queue.failed': 'Échoué',
  'calendar.queue.nextSlot': 'Le prochain emplacement gratuit est {time}.',

  'calendar.post.publishesAt': 'Publie {time} dans {timeZone}',
  'calendar.post.publishedAt': 'Publié {time}',
  'calendar.post.targetCount': '{count, plural, one {# compte} many {# comptes} other {# comptes}}',
  'calendar.post.mediaType.text': 'Texte',
  'calendar.post.mediaType.image': 'Image',
  'calendar.post.mediaType.carousel': 'Carrousel',
  'calendar.post.mediaType.video': 'Vidéo',
  'calendar.post.mediaType.document': 'Document',

  'actionCenter.title': "Centre d'action",
  'actionCenter.description':
    "Tout ce qui nécessite une décision ou une solution, dans une seule file d'attente.",
  'actionCenter.empty': 'Rien n’a besoin d’attention pour le moment.',
  'actionCenter.item.connectionExpiring':
    '{account} doit être reconnecté avant {date} ou les publications programmées échoueront.',
  'actionCenter.item.connectionActionRequired':
    "{account} a besoin d'attention sur {provider} avant de pouvoir publier à nouveau.",
  'actionCenter.item.validationFailed':
    'Un projet pour {account} ne passe pas {provider} validation.',
  'actionCenter.item.approvalOverdue': "Une demande d'approbation est en attente depuis {date}.",
  'actionCenter.item.scheduleConflict':
    '{account} a des messages programmés à proximité les uns des autres sur {date}.',
  'actionCenter.item.providerIncident':
    '{provider} signale un problème. Les publications programmées seront réessayées.',
  'actionCenter.item.commentFailed':
    'Le message principal publié, mais un élément de suivi pour {account} échoué.',
  'actionCenter.item.analyticsStale':
    "Analyses pour {account} je n'ai pas mis à jour depuis {date}.",
  'actionCenter.item.rssStalled': "Le flux {name} n'a pas retourné d'article valide depuis {date}.",
  'actionCenter.item.webhookFailing':
    "Livraisons à {endpoint} avoir échoué {count, plural, one {# temps} many {# fois} other {# fois}} d'affilée.",
  'actionCenter.item.usageBalance':
    "Une action mesurée pour {provider} a besoin d'un solde d'utilisation avant de pouvoir s'exécuter.",

  'approval.title': 'Approbations',
  'approval.requestTitle': "Demande d'approbation",
  'approval.requestedBy': 'Demandé par {name} {relativeTime}',
  'approval.requestedFrom': 'En attendant {name}',
  'approval.policy.none': 'Aucune approbation requise pour ces cibles.',
  'approval.policy.anyApprover': 'N’importe quel approbateur peut approuver cela.',
  'approval.policy.namedApprover': '{name} doit approuver cela.',
  'approval.policy.everyApprover': 'Chaque approbateur doit approuver cela.',
  'approval.decision.approvedBy': 'Approuvé par {name} sur {date}',
  'approval.decision.rejectedBy': 'Rejeté par {name} sur {date}',
  'approval.decision.changesRequestedBy': 'Modifications demandées par {name} sur {date}',
  'approval.comment.label': "Note pour l'auteur",
  'approval.comment.placeholder': 'Dites ce qui doit changer et pourquoi.',
  'approval.reapproval.needed':
    'Ce message a changé après approbation. Il doit à nouveau être approuvé avant de pouvoir être publié.',
  'approval.reapproval.reason.content': 'Le contenu a changé.',
  'approval.reapproval.reason.account': 'Les comptes cibles ont changé.',
  'approval.reapproval.reason.media': 'Les médias ont changé.',
  'approval.reapproval.reason.schedule': "L'heure de publication a changé.",
  'approval.reapproval.reason.privacy':
    'Les paramètres de confidentialité ou de divulgation ont été modifiés.',
  'approval.reapproval.reason.locale': 'La langue du contenu a changé.',
  'approval.expiresAt': 'Cette demande expire le {date}.',
} as const;
