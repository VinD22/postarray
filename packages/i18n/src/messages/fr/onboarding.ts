/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Configurer Post Array',
  'onboarding.progress': 'Étape {current} de {total}',
  'onboarding.skipForNow': "Passer pour l'instant",
  'onboarding.goal': 'Une publication programmée vérifiée en moins de dix minutes.',

  'onboarding.plan.title': 'Choisissez comment vous souhaitez payer',
  'onboarding.plan.help':
    "Un forfait, toutes les fonctionnalités. Modifiez l'intervalle quand vous le souhaitez.",

  'onboarding.workspace.title': 'Nommez votre Workspace',
  'onboarding.workspace.namePlaceholder': 'Le nom de votre entreprise ou de votre client',
  'onboarding.workspace.timeZone': 'Fuseau horaire pour la planification',
  'onboarding.workspace.timeZoneHelp':
    "Chaque heure programmée est stockée avec cette zone, donc un changement d'horloge ne déplace jamais votre poste par accident.",
  'onboarding.workspace.locale': "Langue de l'interface",

  'onboarding.role.title': "Qu'est-ce qui vous décrit le mieux ?",
  'onboarding.role.creator': 'Créateur',
  'onboarding.role.team': 'Équipe interne',
  'onboarding.role.agency': 'Agence',
  'onboarding.role.developer': 'Développeur ou agent builder',
  'onboarding.role.help':
    'Cela modifie les valeurs par défaut que nous suggérons. Vous pourrez tout changer plus tard.',

  'onboarding.connect.title': 'Connectez votre premier compte',
  'onboarding.connect.help':
    'Nous vous montrerons exactement quelles autorisations chaque plate-forme est demandée avant que vous approuviez quoi que ce soit.',
  'onboarding.connect.skipNote':
    "Vous pouvez d’abord explorer avec l’exemple de compte. Rien n'en est publié.",
  'onboarding.connect.success': '{account} est connecté.',

  'onboarding.content.title': 'Commencez avec quelque chose que vous avez déjà',
  'onboarding.content.useAsset': 'Utiliser une image ou une vidéo',
  'onboarding.content.useBrief': 'Commencez par un court brief',
  'onboarding.content.useText': 'Écrivez-le vous-même',

  'onboarding.preview.title': "C'est ce qui va publier",
  'onboarding.preview.help': 'Un véritable aperçu des règles de la plateforme pour ce compte.',

  'onboarding.schedule.title': 'Choisissez quand il sortira',
  'onboarding.schedule.help':
    "Vérifiez l'heure, les paramètres de confidentialité, la divulgation et le coût estimé du fournisseur.",

  'onboarding.done.title': 'Programmé',
  'onboarding.done.body': 'Votre message est prévu pour {time} dans {timeZone}.',
  'onboarding.done.nextStep.title': 'Que faire ensuite',
  'onboarding.done.nextStep.connectMore': 'Connecter un autre compte',
  'onboarding.done.nextStep.inviteTeam': 'Inviter un coéquipier',
  'onboarding.done.nextStep.setApproval': "Définir une politique d'approbation",
  'onboarding.done.nextStep.exploreApi': "Explorez l'API et le serveur MCP",

  'onboarding.checklist.title': 'Commencer',
  'onboarding.checklist.connectAccount': 'Connecter un compte',
  'onboarding.checklist.firstPost': 'Publier ou planifier une publication',
  'onboarding.checklist.inviteTeammate': 'Inviter un coéquipier',
  'onboarding.checklist.setProjectVoice': 'Décrivez la voix du projet',
  'onboarding.checklist.tryAutomation': "Essayez une règle d'automatisation",
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Tout est fait} one {# pas à gauche} many {# pas restants} other {# pas restants}}',
} as const;
