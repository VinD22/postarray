/**
 * The web application shell: Home, the command palette, the Action center
 * queue chrome, the demo data notice, and the parts of sign in and onboarding
 * that the shared `auth`, `onboarding` and `billing` catalogs do not cover.
 *
 * Owned by the web shell. Screen catalogs (composer, calendar, analytics)
 * belong to their own files.
 */
export const webShellMessages = {
  /* -- Document and shell chrome ----------------------------------------- */
  'shell.appName': 'Post Array',
  'shell.documentTitle': '{page} · Post Array',
  'shell.tagline': 'Un bureau de publication pour les personnes et les agents.',
  'shell.menu.open': 'Ouvrir le menu',
  'shell.menu.title': 'Menu',
  'shell.nav.more': 'Plus',
  'shell.help.title': 'Aide',
  'shell.help.documentation': 'Documentation',
  'shell.help.keyboardShortcuts': 'Raccourcis clavier',
  'shell.help.platformStatus': 'Statut de la plateforme',
  'shell.help.whatChanged': 'Ce qui a changé',
  'shell.help.contactSupport': "Contacter l'assistance",
  'shell.account.settings': 'Paramètres',
  'shell.account.profile': 'Votre profil',
  'shell.workspace.create': 'Créer un espace de travail',
  'shell.workspace.manage': 'Paramètres Workspace',
  'shell.workspace.role': 'Tu es {role} ici',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Données de démonstration',
  'shell.demo.title': 'Vous consultez des données de démonstration',
  'shell.demo.body':
    "L'API Post Array n'est pas accessible à partir de ce navigateur, les écrans sont donc remplis avec un exemple d'espace de travail prédéfini. Rien ici n'est connecté à un compte réel et rien ne peut publier.",
  'shell.demo.howToConnect':
    "Définissez NEXT_PUBLIC_RELAY_API_URL et redémarrez l'application pour utiliser les données en direct.",

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Vous êtes hors ligne',
  'shell.offline.body':
    'Les brouillons sont conservés sur cet appareil. La planification et la publication reprennent au retour de la connexion.',
  'shell.offline.retry': 'Vérifiez la connexion',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Ouvrir la palette de commandes',
  'palette.title': 'Palette de commandes',
  'palette.description': 'Recherchez un écran, un compte ou une action.',
  'palette.placeholder': "Tapez une commande ou un nom d'écran",
  'palette.empty': 'Rien ne correspond {query}.',
  'palette.group.actions': 'Actes',
  'palette.group.goTo': 'Aller à',
  'palette.group.workspaces': 'Espaces de travail',
  'palette.group.settings': 'Paramètres',
  'palette.hint.navigate': 'Déplacez-vous avec les touches fléchées',
  'palette.hint.select': 'Ouvrir avec Entrée',
  'palette.hint.close': 'Fermer avec Escape',
  'palette.action.compose': 'Composer un message',
  'palette.action.connectAccount': 'Connecter un compte',
  'palette.action.openActionCenter': "Ouvrez le Centre d'action",
  'palette.action.uploadMedia': 'Télécharger des médias',
  'palette.action.createRule': "Créer une règle d'automatisation",
  'palette.action.toggleTheme': 'Changer de thème',
  'palette.action.signOut': 'se déconnecter',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': "Ouvrez le Centre d'action",
  'actionCenter.group.now.label': 'Maintenant',
  'actionCenter.group.soon.label': 'Bientôt',
  'actionCenter.group.watching.label': 'Regarder',
  'actionCenter.group.now.hint':
    "La publication est menacée jusqu'à ce que ces problèmes soient traités.",
  'actionCenter.group.soon.hint': 'Ceux-ci ont une date limite que vous pouvez toujours respecter.',
  'actionCenter.group.watching.hint': 'Pas urgent. Ça vaut le détour cette semaine.',
  'actionCenter.severity.now': "J'ai besoin de toi maintenant",
  'actionCenter.severity.soon': "J'ai bientôt besoin de toi",
  'actionCenter.severity.watching': 'Regarder',
  'actionCenter.filter.all': 'Tous',
  'actionCenter.filter.connections': 'Relations',
  'actionCenter.filter.publishing': 'Édition',
  'actionCenter.filter.automation': 'Automation',
  'actionCenter.filter.billing': 'Facturation',
  'actionCenter.snoozed': 'Répété',
  'actionCenter.snoozeOneDay': 'Répéter pendant une journée',
  'actionCenter.snoozedUntil': "Répété jusqu'à {date}",
  'actionCenter.unsnooze': 'Ramène ça',
  'actionCenter.resolved': 'Résolu {relativeTime}',
  'actionCenter.emptyFiltered': 'Rien dans ce groupe n’a besoin d’attention.',
  'actionCenter.errorTitle': "Le centre d'action n'a pas pu se charger",
  'actionCenter.loading': 'Charger ce qui nécessite une attention particulière',
  'actionCenter.affectedAccount': 'Affecte {account}',
  'actionCenter.itemCount':
    "{count, plural, =0 {Rien n'a besoin d'attention} one {# article} many {# articles} other {# articles}}",
  'actionCenter.action.reconnect': 'Reconnecter',
  'actionCenter.action.openReceipt': 'Ouvrir le reçu',
  'actionCenter.action.review': 'Revoir',
  'actionCenter.action.openDraft': 'Ouvrir le brouillon',
  'actionCenter.action.openCalendar': 'Ouvrir le calendrier',
  'actionCenter.action.viewStatus': "Afficher l'état",
  'actionCenter.action.checkFeed': 'Vérifier le flux',
  'actionCenter.action.inspectDeliveries': 'Inspecter les livraisons',
  'actionCenter.action.addBalance': "Examiner l'utilisation",
  'actionCenter.action.fixConnection': 'Réparer la connexion',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Maison',
  'home.subtitle': 'Ce dont vous avez besoin aujourd’hui et ce qui se passera ensuite.',
  'home.greetingSummary':
    "{actions, plural, =0 {Rien n'a besoin de toi pour le moment} one {# élément a besoin de vous} many {# articles ont besoin de vous} other {# articles ont besoin de vous}}. {upcoming, plural, =0 {Rien n'est prévu dans les prochaines 24 heures} one {# post sera publié dans les prochaines 24 heures} many {# posts seront publiés dans les prochaines 24 heures} other {# posts seront publiés dans les prochaines 24 heures}}.",
  'home.needsYou.title': "J'ai besoin de toi maintenant",
  'home.needsYou.empty': "Rien n'a besoin de toi pour le moment.",
  'home.needsYou.emptyBody':
    'L’état de la connexion, les approbations et les échecs de publication apparaissent ici au moment où ils se produisent.',
  'home.needsYou.viewAll': "Ouvrez le Centre d'action",
  'home.needsYou.emptyQuiet':
    'Profitez du calme. Tout ce qui nécessite une décision apparaît ici dès que cela se produit.',
  'home.upcoming.title': 'Prochaines 24 heures',
  'home.upcoming.empty': "Rien n'est prévu dans les prochaines 24 heures.",
  'home.upcoming.emptyBody':
    'Écrivez un article et choisissez une heure. Vous pourrez le modifier plus tard.',
  'home.upcoming.viewAll': 'Ouvrir le calendrier',
  'home.upcoming.timeZoneNote':
    "Les heures sont indiquées dans {timeZone}, la zone de l'espace de travail.",
  'home.upcoming.columnTime': 'Temps',
  'home.upcoming.columnAccount': 'Compte',
  'home.upcoming.columnContent': 'Contenu',
  'home.upcoming.columnStatus': 'Statut',
  'home.receipts.title': 'Reçus récents',
  'home.receipts.empty': "Aucun message n'a encore été publié à partir de cet espace de travail.",
  'home.receipts.emptyBody':
    'Chaque publication produit un reçu que vous pouvez consulter et partager.',
  'home.receipts.viewAll': 'Tous les reçus',
  'home.receipts.publishedTo': 'Publié sur {account}',
  'home.connections.title': 'Santé de la connexion',
  'home.connections.summary':
    "{healthy, plural, one {# compte fonctionne} many {# comptes fonctionnent} other {# comptes fonctionnent}}. {attention, plural, =0 {Aucun n'a besoin d'attention} one {# a besoin d'attention} many {# besoin d'attention} other {# besoin d'attention}}.",
  'home.connections.viewAll': 'Toutes les connexions',
  'home.connections.empty': "Aucun compte connecté pour l'instant.",
  'home.advisor.title': 'Conseiller en croissance',
  'home.advisor.summary':
    'Version du forfait {version} a été approuvé {date}. Semaine {week} de {total} a {briefs, plural, one {# mémoire non encore rédigé} many {# mémoires non encore rédigées} other {# mémoires non encore rédigées}}.',
  'home.advisor.noPlan':
    'Le conseiller construit un plan à partir des faits que vous confirmez. Il propose des travaux et ne publie jamais seul.',
  'home.advisor.openPlan': 'Ouvrir le forfait',
  'home.advisor.createDrafts': 'Créer des brouillons à partir de la semaine {week}',
  'home.advisor.start': "Démarrer le profil de l'entreprise",
  'home.trial.banner':
    "Procès, {days, plural, =0 {se termine aujourd'hui} one {# jour restant} many {# jours restants} other {# jours restants}}. Convertit {date} à {amount}.",
  'home.trial.manage': 'Gérer ou annuler',
  'home.error.title': 'Impossible de charger la maison',
  'home.error.body':
    "Votre espace de travail est intact. Il s'agit d'un problème pour atteindre l'API Post Array.",

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title': "Publiez via les API officielles et voyez exactement ce qui s'est passé.",
  'auth.aside.point.receipts':
    'Chaque publication produit un reçu : qui l’a approuvé, quand elle a été expédiée, ce que la plateforme a retourné.',
  'auth.aside.point.approvals':
    'Rien n’atteint une plateforme sans l’approbation requise par votre politique.',
  'auth.aside.point.surfaces':
    "Le même workflow depuis l'application web, l'API REST, MCP, la CLI et les webhooks.",
  'auth.provider.title': 'Avant de continuer',
  'auth.provider.google.access':
    'Google partage votre nom, votre adresse e-mail et votre photo de profil avec Post Array. Post Array ne peut pas lire votre compte Gmail, Drive ou Agenda.',
  'auth.provider.facebook.access':
    "Facebook partage votre nom, votre adresse e-mail et votre photo de profil avec Post Array. La connexion d'une page sur laquelle publier est une étape distincte que vous approuverez plus tard.",
  'auth.provider.note': 'Cela vous connecte. Il ne connecte pas un compte sur lequel publier.',
  'auth.continueWithEmail': "Continuer avec l'e-mail",
  'auth.method.password': 'Mot de passe',
  'auth.method.magicLink': 'Lien email',
  'auth.method.username': "Nom d'utilisateur",
  'auth.method.chooseLabel': 'Comment voulez-vous vous connecter ?',
  'auth.username.placeholder': "votre nom d'utilisateur",
  'auth.username.aliasNote':
    "Un nom d'utilisateur est un alias pour l'adresse e-mail de votre compte. Le mot de passe est le même.",
  'auth.password.placeholder': 'Votre mot de passe',
  'auth.submit.signIn': 'Se connecter',
  'auth.submit.signUp': 'Créer un compte',
  'auth.submit.working': 'Vérification',
  'auth.failure.credentials':
    'Cette adresse e-mail et ce mot de passe ne correspondent pas à un compte. Vérifiez les deux et réessayez.',
  'auth.failure.usernameCredentials':
    "Ce nom d'utilisateur et ce mot de passe ne correspondent pas à un compte. Vérifiez les deux et réessayez.",
  'auth.failure.noAccountLeak':
    'Pour votre sécurité, nous ne disons pas si une adresse est enregistrée.',
  'auth.failure.provider': "La connexion avec {provider} n'a pas terminé. Rien n'a été changé.",
  'auth.failure.network':
    "Nous n'avons pas pu atteindre Post Array. Vérifiez votre connexion et réessayez.",
  'auth.signUp.emailInUseNote':
    "Si cette adresse possède déjà un compte, nous envoyons par e-mail un lien de connexion au lieu d'en créer un deuxième.",
  'auth.legal.readTerms': 'Lire les conditions',
  'auth.legal.readPrivacy': "Lire l'avis de confidentialité",
  'auth.switchToSignUp': 'Créer un compte',
  'auth.switchToSignIn': 'Connectez-vous plutôt',
  'auth.checkEmail.body':
    'Nous avons envoyé un lien de connexion à {email}. Cela fonctionne une fois.',
  'auth.checkEmail.wrongAddress': 'Utiliser une autre adresse',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Facturation',
  'onboarding.stepName.workspace': 'Workspace',
  'onboarding.stepName.role': "Cas d'utilisation",
  'onboarding.stepName.connect': 'Connecter',
  'onboarding.stepName.compose': 'Premier message',
  'onboarding.stepName.receipt': 'Confirmation',
  'onboarding.stepList': 'Étapes de configuration',
  'onboarding.stepComplete': 'Fait',
  'onboarding.stepCurrent': 'Étape actuelle',
  'onboarding.exit': 'Terminer plus tard',
  'onboarding.plan.intervalMonthlyLabel': '29 $ par mois',
  'onboarding.plan.intervalAnnualLabel': '300 $ par an',
  'onboarding.plan.checkoutHint':
    "L'écran suivant est Polar, notre marchand attitré. L'accès est accordé lorsque Polar confirme l'abonnement, et non lorsque le navigateur revient.",
  'onboarding.plan.factsTitle': 'Que se passe-t-il lorsque vous continuez',
  'onboarding.workspace.help':
    'Un espace de travail contient vos projets, vos comptes connectés, vos brouillons et vos reçus. Vous pourrez en créer davantage plus tard.',
  'onboarding.workspace.localeNote':
    'La langue de votre interface change cette application. Les langues du contenu sont choisies par publication et sont distinctes de ce paramètre.',
  'onboarding.workspace.timeZoneDetected': 'Détecté à partir de cet appareil : {timeZone}',
  'onboarding.connect.permissionsTitle': 'Quoi {provider} sera demandé',
  'onboarding.connect.permissionsFooter':
    "Post Array ne demande jamais une autorisation qu'il n'utilise pas et vous pouvez vous déconnecter à tout moment.",
  'onboarding.connect.chooseProvider': 'Choisissez une plateforme',
  'onboarding.connect.opensProvider': 'Ouvertures continues {provider} dans cet onglet.',
  'onboarding.compose.help':
    "Rédigez le message, puis vérifiez l'aperçu et la validation avant de choisir une heure.",
  'onboarding.compose.openComposer': 'Ouvrir le compositeur complet',
  'onboarding.receipt.title': 'Votre premier post est programmé',
  'onboarding.receipt.body':
    "Voici le bilan jusqu'à présent. Il continue à se mettre à jour via la répartition, la réponse du fournisseur et la première synchronisation analytique.",
  'onboarding.receipt.goHome': 'Aller à la maison',
  'onboarding.blocked.title': 'Cette étape nécessite la précédente',
  'onboarding.blocked.body': "Finition {step} d'abord. Rien de ce que vous avez saisi n'est perdu.",
} as const;
