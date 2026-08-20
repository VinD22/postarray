/** Workspace settings: members, roles, projects, localization, security, data. */
export const settingsMessages = {
  'settings.title': 'Paramètres',
  'settings.saved': 'Enregistré',
  'settings.unsavedChanges': 'Vous avez des modifications non enregistrées.',

  'settings.workspace.title': 'Workspace',
  'settings.workspace.name': 'Nom Workspace',
  'settings.workspace.defaultTimeZone': 'Fuseau horaire par défaut',
  'settings.workspace.defaultLocale': "Langue d'interface par défaut",
  'settings.workspace.defaultContentLocale': 'Langue du contenu par défaut',
  'settings.workspace.transferOwnership': 'Transférer la propriété',
  'settings.workspace.delete': "Supprimer l'espace de travail",
  'settings.workspace.deleteWarning':
    "La suppression d'un espace de travail annule les publications planifiées, révoque les connexions et supprime les médias stockés. Les reçus sont conservés pendant la durée de conservation indiquée dans les Conditions.",

  'settings.members.title': 'Membres et rôles',
  'settings.members.invite': 'Inviter des personnes',
  'settings.members.inviteEmail': 'Adresse email',
  'settings.members.inviteSent': 'Invitation envoyée à {email}.',
  'settings.members.pending': 'Invité, pas encore accepté',
  'settings.members.count': '{count, plural, one {# membre} many {# membres} other {# membres}}',
  'settings.members.removeConfirm':
    "Retirer {name} de cet espace de travail ? Leurs actions passées restent dans le journal d'audit.",
  'settings.role.owner.label': 'Propriétaire',
  'settings.role.admin.label': 'Administrateur',
  'settings.role.manager.label': 'Directeur',
  'settings.role.editor.label': 'Éditeur',
  'settings.role.approver.label': 'Approbateur',
  'settings.role.analyst.label': 'Analyste',
  'settings.role.viewer.label': 'Téléspectateur',
  'settings.role.owner.description':
    'Tout, y compris la facturation, la sécurité et la suppression.',
  'settings.role.admin.description':
    "Tout sauf la facturation et la suppression de l'espace de travail.",
  'settings.role.manager.description':
    'Gérez les marques, les connexions, les horaires et les règles.',
  'settings.role.editor.description': "Créez et modifiez du contenu, demandez l'approbation.",
  'settings.role.approver.description':
    'Approuvez ou rejetez le contenu et planifiez ce qui est approuvé.',
  'settings.role.analyst.description': 'Lire les analyses et les reçus.',
  'settings.role.viewer.description': 'Lecture seule.',
  'settings.role.scopeLabel': 'Limité aux marques et aux comptes',
  'settings.role.mfaRequired':
    'Les propriétaires doivent utiliser une authentification à deux facteurs.',

  'settings.projects.title': 'Marques',
  'settings.projects.add': 'Ajouter une marque',
  'settings.projects.voice': 'Voix',
  'settings.projects.audience': 'Public',
  'settings.projects.approvedClaims': 'Réclamations approuvées',
  'settings.projects.blockedTerms': 'Conditions bloquées',
  'settings.projects.disclosureDefaults': 'Valeurs par défaut de divulgation',
  'settings.projects.domains': 'Domaines',
  'settings.projects.glossary.title': 'Glossaire',
  'settings.projects.glossary.term': 'Terme',
  'settings.projects.glossary.preferred': 'Traduction préférée',
  'settings.projects.glossary.prohibited': 'Ne traduisez pas par',
  'settings.projects.glossary.context': 'Contexte',
  'settings.projects.glossary.keepUntranslated': 'Garder non traduit',
  'settings.projects.localeRules.title': 'Règles locales',
  'settings.projects.localeRules.formality': 'Formalité',
  'settings.projects.localeRules.pronouns': 'Pronoms et titres honorifiques',
  'settings.projects.localeRules.idioms': 'Expressions idiomatiques à éviter',
  'settings.projects.localeRules.emoji': 'Normes sur les emojis et les hashtags',
  'settings.projects.localeRules.legal': 'Divulgations juridiques régionales',
  'settings.projects.localeRules.cta': "Appel à l'action par marché",
  'settings.projects.localeRules.reviewedExamples': 'Exemples approuvés par un évaluateur natif',

  'settings.sets.title': 'Ensembles',
  'settings.sets.description':
    "Un groupe réutilisable de cibles, de variantes, de paramètres, de commentaires et de délais. L'application d'un ensemble crée un brouillon indépendant.",
  'settings.sets.editNote':
    "La modification d'un ensemble ne modifie pas les publications déjà approuvées ou programmées.",
  'settings.signatures.title': 'Signature',
  'settings.signatures.description':
    'Texte de clôture, hashtags, liens ou informations, définis par marque, plateforme et langue.',
  'settings.signatures.autoApply': 'Ajouter automatiquement lorsque le contexte correspond',

  'settings.localization.title': 'Localisation',
  'settings.localization.interfaceLocale': "Langue de l'interface",
  'settings.localization.interfaceLocaleHelp':
    'La langue de cette application pour vous. Cela ne change pas la langue de vos messages.',
  'settings.localization.contentLocales': 'Langues du contenu',
  'settings.localization.contentLocalesHelp':
    'Les langues dans lesquelles vous publiez. Chaque marque peut définir des règles et un glossaire par langue.',
  'settings.localization.marketLocales': "Marchés d'audience",
  'settings.localization.beta': 'Traduction bêta',
  'settings.localization.betaHelp':
    "Ce langage est assisté par machine et n'est pas encore entièrement révisé par une personne. Le texte non traduit revient à l’anglais.",
  'settings.localization.humanReviewed': 'Évalué par un locuteur natif',
  'settings.localization.timeZone': 'Fuseau horaire',
  'settings.localization.weekStart': 'Premier jour de la semaine',
  'settings.localization.hourCycle.label': "Format de l'heure",
  'settings.localization.hourCycle.h12': '12 heures',
  'settings.localization.hourCycle.h23': '24 heures',

  'settings.notifications.title': 'Notifications',
  'settings.notifications.email': 'E-mail',
  'settings.notifications.inApp': "Dans l'application",
  'settings.notifications.approvalRequests': "Demandes d'approbation",
  'settings.notifications.publishResults': 'Publier les résultats',
  'settings.notifications.connectionHealth': 'Santé de la connexion',
  'settings.notifications.ruleFailures': "Échecs de l'automatisation",
  'settings.notifications.weeklySummary': 'Résumé hebdomadaire',
  'settings.notifications.digestOnly': 'Regroupez-les dans un seul message quotidien',

  'settings.security.title': 'Sécurité',
  'settings.security.mfa': 'Authentification à deux facteurs',
  'settings.security.mfaEnable': "Activer l'authentification à deux facteurs",
  'settings.security.mfaRequiredFor':
    "Requis pour les modifications de facturation, les comptes de service, la reconnexion d'un compte et la révocation des informations d'identification.",
  'settings.security.passkeys': 'Mots-clés',
  'settings.security.sessions': 'Séances actives',
  'settings.security.sessionRevoke': 'Se déconnecter de cette session',
  'settings.security.auditLog.title': "Journal d'audit",
  'settings.security.auditLog.description':
    "Chaque action, qui ou quoi l'a effectuée et quand. Exportable par les propriétaires et les administrateurs.",
  'settings.security.killSwitch': "Arrêt d'urgence",
  'settings.security.killSwitchBody':
    "Arrête immédiatement toutes les publications et automatisations planifiées dans cet espace de travail. Rien n'est supprimé. Vous pouvez le désactiver à nouveau.",
  'settings.security.killSwitchActive':
    "L'arrêt d'urgence est activé. Aucun article ne sera publié.",

  'settings.data.title': 'Data controls',
  'settings.data.export': 'Export your data',
  'settings.data.exportPreparing': 'Preparing your export. We will email you when it is ready.',
  'settings.data.deletionRequest': 'Request deletion',
  'settings.data.deletionExplain':
    'Deletion cancels scheduled workflows, revokes provider access, removes stored media and tombstones analytics where the provider requires it.',
  'settings.data.retention': 'Retention',
  'settings.data.consents': 'Consents',
  'settings.data.consent.productAnalytics': 'Product analytics',
  'settings.data.consent.diagnostics': 'Share diagnostics with support',
  'settings.data.consent.aiImprovement':
    'Use my content to improve the assistant. This is off unless you turn it on.',
  'settings.data.consent.marketingEmail': 'Product news by email',
} as const;
