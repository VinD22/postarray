export const postingSetMessages = {
  /* ------------------------------------------------------------- la pause */
  'calendar.hold.action': 'Mettre en pause',
  'calendar.hold.resumeAction': 'Reprendre',
  'calendar.hold.badge': 'En pause',
  'calendar.hold.badgeBilling': 'En pause par la facturation',
  'calendar.hold.term': 'Pause',
  'calendar.hold.byPerson': 'Mis en pause par vous le {date}.',
  'calendar.hold.byBilling':
    "Mis en pause le {date} parce que ce workspace a perdu l'accès complet.",
  'calendar.hold.none': 'Pas en pause',

  'calendar.hold.confirmTitle': 'Mettre cette publication en pause ?',
  'calendar.hold.confirmBody':
    'Cette publication restera où elle est et ne sortira pas à {time}. Vous pouvez la reprendre à tout moment avant, ou choisir un nouvel horaire si celui-ci est déjà passé.',
  'calendar.hold.confirmScope':
    "La pause arrête ce qui n'est pas encore arrivé. Tout ce qui a déjà été publié sur une plateforme reste publié, et la pause ne le supprime ni ne le modifie.",
  'calendar.hold.confirmNoteLabel': 'Pourquoi mettez-vous ceci en pause ? (facultatif)',
  'calendar.hold.confirmNoteHint':
    "Conservé dans le journal d'audit de votre équipe. N'est envoyé à aucune plateforme.",
  'calendar.hold.confirm': 'Mettre cette publication en pause',
  'calendar.hold.cancel': 'La laisser planifiée',

  'calendar.hold.resumeTitle': 'Reprendre cette publication ?',
  'calendar.hold.resumeBody': 'Elle sortira à {time}, en {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'Cet horaire est passé',
  'calendar.hold.resumeMissedBody':
    "Cette publication était prévue pour {time} pendant qu'elle était en pause. Choisissez un nouvel horaire pour qu'elle ne sorte pas au moment où vous la reprenez.",
  'calendar.hold.resumeTimeLabel': 'Nouvel horaire de publication',
  'calendar.hold.resumeConfirm': 'Reprendre',

  'calendar.hold.paused': 'En pause. Ne sortira pas tant que vous ne reprenez pas.',
  'calendar.hold.resumed': 'Reprise. Sortira à {time}.',

  'calendar.hold.blocked.published':
    'Cette publication est déjà sortie. La pause ne peut pas la retirer de la plateforme.',
  'calendar.hold.blocked.inFlight':
    "Cette publication est en cours d'envoi. Il est trop tard pour la mettre en pause, et l'arrêter à mi-chemin pourrait la laisser publiée seulement en partie.",
  'calendar.hold.blocked.finished':
    "Cette publication est déjà terminée, il n'y a donc rien à mettre en pause.",
  'calendar.hold.blocked.billing':
    "Cette publication est en pause parce que le workspace a perdu l'accès complet. La reprendre est une question de facturation, pas de planification.",
  'calendar.hold.blocked.billingAction': 'Aller à la facturation',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Posting Sets',
  'set.lede':
    'Une réponse enregistrée à "à qui est-ce que je publie ceci, et comment". Appliquer un Set copie ses réglages dans un nouveau brouillon.',
  'set.appliedOnce':
    "Un Set est lu une fois, quand vous l'appliquez. Le modifier ensuite change ce à partir de quoi part la prochaine publication. Les brouillons et publications planifiées déjà créés à partir de lui restent exactement tels quels.",
  'set.empty.title': 'Pas encore de Sets',
  'set.empty.body':
    'Créez-en un pour arrêter de reconstruire la même liste de comptes à chaque publication.',
  'set.create': 'Nouveau Set',
  'set.edit': 'Modifier le Set',
  'set.archive': 'Archiver le Set',
  'set.archived': 'Archivé',
  'set.archivedNote':
    "Les Sets archivés sont masqués dans le sélecteur. Les publications créées à partir d'eux restent inchangées.",
  'set.showArchived': 'Afficher les archivés',
  'set.saved': 'Set enregistré.',
  'set.archivedToast':
    'Set archivé. Les publications déjà créées à partir de lui restent inchangées.',

  'set.field.name': 'Nom',
  'set.field.nameHint': 'Ce que vous chercherez dans le sélecteur. Un par projet.',
  'set.field.description': 'Description',
  'set.field.descriptionHint': 'Facultatif. À quoi sert ce Set.',
  'set.field.targets': 'Comptes',
  'set.field.targetsHint':
    'Chaque compte avec lequel démarre une publication créée à partir de ce Set.',
  'set.field.targetCount':
    '{count, plural, =0 {Aucun compte} one {# compte} many {# comptes} other {# comptes}}',
  'set.field.signature': 'Signature',
  'set.field.signatureNone': 'Aucune signature',
  'set.field.approval': 'Approbation',
  'set.field.approvalHint':
    "L'approbation dont a besoin une publication créée à partir de ce Set avant de pouvoir être publiée.",
  'set.field.schedule': 'Quand publier',

  'set.approval.none': 'Aucune approbation nécessaire',
  'set.approval.single_approver': 'Un approbateur désigné',
  'set.approval.any_approver': "N'importe quel approbateur",
  'set.approval.named_approver': 'Un approbateur spécifique',
  'set.approval.policy_auto': 'Ce que dit la politique du workspace',

  'set.slot.next_free_slot': 'Prochain créneau libre de la file',
  'set.slot.next_free_slotHint':
    'Utilise les règles de file de ce projet pour proposer un horaire. Elle propose ; vous acceptez.',
  'set.slot.pick_time': 'Demandez-moi un horaire',
  'set.slot.pick_timeHint': "Appliquer le Set laisse l'horaire vide pour que vous le choisissiez.",
  'set.slot.draft_only': 'Le laisser comme brouillon',
  'set.slot.draft_onlyHint': 'Appliquer le Set ne touche pas du tout au planning.',
  'set.slot.noRules':
    "Ce projet n'a pas encore de règles de file, donc la file proposera la première heure libre et le dira.",
  'set.slot.rulesLink': 'Règles de file',

  'set.defaults.title': 'Valeurs par défaut par plateforme',
  'set.defaults.body':
    'Valeurs de départ copiées dans chaque nouvelle publication. Vous pouvez en changer chacune dans le compositeur ensuite.',
  'set.defaults.add': 'Ajouter une plateforme',
  'set.defaults.remove': 'Retirer les valeurs par défaut de {platform}',
  'set.defaults.privacy': 'Confidentialité',
  'set.defaults.privacyNone': 'Par défaut de la plateforme',
  'set.defaults.bodyPrefix': 'Texte avant la publication',
  'set.defaults.bodySuffix': 'Texte après la publication',
  'set.defaults.requireAltText': 'Exiger un texte alternatif sur chaque image',
  'set.defaults.requireAltTextHint':
    "Une publication créée à partir de ce Set ne peut pas être planifiée pour cette plateforme tant que chaque image n'a pas de texte alternatif.",
  'set.defaults.empty':
    'Aucune valeur par défaut par plateforme. Chaque compte part de la publication maîtresse.',

  'set.error.nameTaken': 'Un autre Set de ce projet utilise déjà ce nom.',
  'set.error.archived': 'Ce Set est archivé. Restaurez-le avant de le modifier.',
  'set.error.duplicateTarget': 'Ce compte est déjà dans ce Set.',
  'set.error.duplicatePlatform': 'Ce Set a déjà des valeurs par défaut pour cette plateforme.',

  /* --------------------------------------------------- comptes mémorisés */
  'targetMemory.setting.title': 'Se souvenir des comptes entre les publications',
  'targetMemory.setting.body':
    "Quand ceci est activé, le compositeur démarre chaque nouvelle publication avec les comptes que cette personne a choisis la dernière fois dans ce projet. C'est désactivé tant que vous ne l'activez pas.",
  'targetMemory.setting.stored':
    "Seule la liste des comptes est conservée, et seulement pour la personne qui les a choisis. Aucune légende, aucun horaire, aucun réglage de confidentialité ni aucun état d'approbation n'est stocké, et personne d'autre dans le projet ne peut voir votre liste.",
  'targetMemory.setting.offNote': "Tant que ceci est désactivé, rien n'est stocké du tout.",
  'targetMemory.setting.turnOffWarning':
    'Désactiver ceci supprime toute sélection enregistrée dans ce projet, pour tout le monde.',
  'targetMemory.setting.enabled': 'Activé',
  'targetMemory.setting.disabled': 'Désactivé',
  'targetMemory.setting.saved': 'Réglage enregistré.',
  'targetMemory.setting.cleared':
    'Réglage enregistré. Les sélections enregistrées dans ce projet ont été supprimées.',

  'targetMemory.composer.restored':
    '{count, plural, one {A démarré avec # compte de la dernière fois.} many {A démarré avec # comptes de la dernière fois.} other {A démarré avec # comptes de la dernière fois.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {# compte que vous avez utilisé la dernière fois a été laissé de côté car il nécessite une attention.} many {# comptes que vous avez utilisés la dernière fois ont été laissés de côté car ils nécessitent une attention.} other {# comptes que vous avez utilisés la dernière fois ont été laissés de côté car ils nécessitent une attention.}}',
  'targetMemory.composer.droppedAll':
    "Aucun des comptes que vous avez utilisés la dernière fois n'est disponible maintenant, donc rien n'a été présélectionné.",
  'targetMemory.composer.undo': 'Effacer la sélection',
  'targetMemory.composer.forget': 'Ne plus se souvenir de mes comptes',
  'targetMemory.composer.forgotten': 'Votre sélection enregistrée a été supprimée.',
  'targetMemory.composer.reviewAccounts': 'Vérifier les comptes',
} as const;
