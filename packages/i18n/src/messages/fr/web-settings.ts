/**
 * Web catalog for settings, the developer portal, billing and the Growth
 * Advisor.
 *
 * This file only adds what the web screens need on top of the intent catalogs
 * in `settings.ts`, `developer.ts`, `billing.ts` and `growth.ts`. Everything
 * here lives under a `.ui.` segment so a key can never collide with one of
 * those files when the catalogs are merged.
 *
 * Several strings are mandated word for word and must not be softened:
 *  - `billing.ui.annualFraming` states the saving in currency, never a percent.
 *  - `billing.ui.cancelConfirmedBeforeConversion` must read
 *    "Canceled. You will not be charged."
 *  - the media generation boundary paragraph is NOT restated here. It already
 *    exists as `billing.mediaGeneration.explanation`, and the Tool Radar
 *    renders that same key so there is one sentence to review and translate.
 */
export const webSettingsMessages = {
  /* ------------------------------------------------------------------ shell */

  'settings.ui.subtitle':
    'Tout ce qui configure cet espace de travail. Rien ici ne publie quoi que ce soit.',
  'settings.ui.nav.label': 'Sections de paramètres',
  'settings.ui.index.help':
    "Choisissez une section. Chaque modification vous est attribuée et apparaît dans le journal d'audit.",

  'settings.ui.section.members': 'Membres et rôles',
  'settings.ui.section.membersSummary':
    'Qui se trouve dans cet espace de travail et ce que chacun peut faire.',
  'settings.ui.section.projects': 'Marques',
  'settings.ui.section.projectsSummary':
    'Voix, audience, revendications approuvées, termes bloqués, règles locales, domaines et glossaire.',
  'settings.ui.section.agents': 'Agents et API',
  'settings.ui.section.agentsSummary':
    "Comptes de service, étendues, limites, informations d'identification, activité et terrain de jeu à sec.",
  'settings.ui.section.apps': 'Applications de développement',
  'settings.ui.section.appsSummary':
    'Applications OAuth tierces, redirections des listes autorisées, consentements et subventions.',
  'settings.ui.section.webhooks': 'Webhooks',
  'settings.ui.section.webhooksSummary':
    'Événements sortants signés, journaux de livraison, relivraison et rotation secrète.',
  'settings.ui.section.billing': 'Facturation',
  'settings.ui.section.billingSummary':
    'Plan, essai, intervalle, utilisation mesurée du fournisseur, factures et annulation.',
  'settings.ui.section.referrals': 'Parrainage et affiliation',
  'settings.ui.section.referralsSummary':
    'Votre lien de parrainage divulgué, les inscriptions attribuées et le statut de la commission.',
  'settings.ui.section.localization': 'Localisation',
  'settings.ui.section.localizationSummary':
    "Langue de l'interface, langues du contenu, marchés, fuseau horaire et format horaire.",
  'settings.ui.section.security': 'Sécurité',
  'settings.ui.section.securitySummary':
    "Sessions, authentification à deux facteurs, informations d'identification, agents, webhooks et subventions d'application.",
  'settings.ui.section.data': 'Contrôles des données',
  'settings.ui.section.dataSummary':
    'Exportez, révoquez une connexion, supprimez une marque, supprimez du contenu ou fermez le compte.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Chargement {section}',
  'settings.ui.state.errorTitle': "Nous n'avons pas pu charger {section}",
  'settings.ui.state.errorRetry': 'Essayer à nouveau',
  'settings.ui.state.savingAnnouncement': 'Économie {section}',
  'settings.ui.state.savedAnnouncement': '{section} enregistré',
  'settings.ui.state.saveFailedAnnouncement':
    "{section} n'a pas été sauvegardé. Votre contribution est toujours là.",
  'settings.ui.state.offlineTitle': 'Vous êtes hors ligne',
  'settings.ui.state.offlineBody':
    "Vous pouvez lire cette page. Les modifications ne peuvent pas être enregistrées tant que la connexion n'est pas rétablie.",
  'settings.ui.state.permissionTitle': "Vous n'avez pas accès à {section}",
  'settings.ui.state.permissionBody':
    "Cette section modifie le comportement de l'espace de travail, il est donc limité par rôle.",
  'settings.ui.state.permissionRequirements': 'Ce dont vous avez besoin',
  'settings.ui.state.permissionContact':
    "Un propriétaire ou un administrateur de cet espace de travail peut l'accorder. Ils sont répertoriés sous Membres et rôles.",
  'settings.ui.state.rateLimitTitle': 'Trop de changements en peu de temps',
  'settings.ui.state.rateLimitCause':
    "Cet espace de travail a atteint la limite d'écriture pour les modifications de paramètres.",
  'settings.ui.state.rateLimitReset': 'Réinitialisation des limites',
  'settings.ui.state.rateLimitAlternative':
    'Rien de ce que vous avez sauvegardé n’a été perdu. Les actions en lecture seule fonctionnent toujours pendant que vous attendez.',
  'settings.ui.state.rateLimitUsage': 'Les paramètres écrivent cette heure',
  'settings.ui.state.rateLimitUsageText': '{used} de {limit} utilisé',
  'settings.ui.state.unsavedTitle': 'Vous avez des modifications non enregistrées',
  'settings.ui.state.unsavedBody': 'Enregistrez-les avant de quitter cette section.',
  'settings.ui.state.readOnlyTitle': 'Cet espace de travail est en lecture seule',
  'settings.ui.state.readOnlyBody':
    'La facturation est en souffrance. Votre contenu, vos reçus et vos connexions sont intacts. Les paramètres peuvent être lus mais pas modifiés.',

  'settings.ui.state.referenceLabel': "Référence d'assistance",

  'settings.ui.attribution': 'Modifié par {name} {relativeTime}',
  'settings.ui.attributionNever': 'Pas changé depuis sa création',
  'settings.ui.copyFailed':
    'Votre navigateur a bloqué la copie. Sélectionnez le texte et copiez-le manuellement.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    "Chaque invitation, changement de rôle et suppression est enregistré avec votre nom et l'heure.",
  'settings.ui.members.tableCaption': 'Personnes dans cet espace de travail, avec rôle et portée',
  'settings.ui.members.column.person': 'Personne',
  'settings.ui.members.column.role': 'Rôle',
  'settings.ui.members.column.scope': 'Portée',
  'settings.ui.members.column.approvals': 'Approbations',
  'settings.ui.members.column.lastActive': 'Dernier actif',
  'settings.ui.members.column.actions': 'Actes',
  'settings.ui.members.scopeAll': 'Toutes marques et comptes',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {# marque} many {# marques} other {# marques}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Peut approuver',
  'settings.ui.members.approvals.cannotApprove': "Impossible d'approuver",
  'settings.ui.members.approvals.canApproveOwnProjects': 'Peut approuver les marques répertoriées',
  'settings.ui.members.lastActiveNever': "N'est pas encore connecté",
  'settings.ui.members.changeRole': 'Changer de rôle pour {name}',
  'settings.ui.members.remove': 'Retirer {name}',
  'settings.ui.members.lastOwnerTitle': 'Un espace de travail garde au moins un propriétaire',
  'settings.ui.members.lastOwnerBody':
    "Définissez d'abord quelqu'un d'autre comme propriétaire, puis ce changement devient disponible.",
  'settings.ui.members.inviteTitle': "Inviter quelqu'un à cet espace de travail",
  'settings.ui.members.inviteBody':
    "Ils reçoivent un e-mail avec un lien. L'invitation expire au bout de sept jours et vous pouvez la révoquer avant cette date.",
  'settings.ui.members.inviteRole': 'Rôle',
  'settings.ui.members.inviteScope': 'Marques dans lesquelles ils peuvent travailler',
  'settings.ui.members.inviteScopeAll': 'Toutes les marques présentes dans cet espace de travail',
  'settings.ui.members.inviteScopeSelected': 'Uniquement les marques que je sélectionne',
  'settings.ui.members.inviteApprovals': 'Peut décider des demandes d’approbation',
  'settings.ui.members.inviteApprovalsHelp':
    'Seuls les rôles qui incluent déjà une révision peuvent en bénéficier. C’est distinct de l’édition.',
  'settings.ui.members.inviteSubmit': 'Envoyer une invitation',
  'settings.ui.members.invitePending': 'Invité {relativeTime} par {name}',
  'settings.ui.members.inviteRevoke': "Révoquer l'invitation",
  'settings.ui.members.inviteResend': "Envoyez à nouveau l'invitation",
  'settings.ui.members.emptyTitle': 'Tu es la seule personne ici',
  'settings.ui.members.emptyBody':
    'Invitez les personnes qui rédigent, approuvent ou lisent les résultats. Chacun obtient un rôle et une portée de marque.',
  'settings.ui.members.emptyExample':
    'Une forme courante : un propriétaire pour la facturation, un approbateur par marque et des éditeurs qui rédigent mais ne publient jamais.',
  'settings.ui.members.roleReferenceTitle': 'Ce que chaque rôle peut faire',
  'settings.ui.members.roleReferenceCaption': 'Les rôles et les actions que chacun permet',
  'settings.ui.members.roleColumn.role': 'Rôle',
  'settings.ui.members.roleColumn.can': 'Peut faire',
  'settings.ui.members.roleColumn.cannot': 'Je ne peux pas faire',
  'settings.ui.members.roleCannot.owner': "Rien n'est refusé à un propriétaire.",
  'settings.ui.members.roleCannot.admin':
    "Modifiez la facturation ou supprimez l'espace de travail.",
  'settings.ui.members.roleCannot.manager':
    "Modifier la facturation, les rôles ou la suppression de l'espace de travail.",
  'settings.ui.members.roleCannot.editor':
    'Approuvez, planifiez, publiez ou modifiez les connexions.',
  'settings.ui.members.roleCannot.approver':
    'Modifiez les connexions, les règles ou la facturation.',
  'settings.ui.members.roleCannot.analyst': "Créez, modifiez, approuvez ou publiez n'importe quoi.",
  'settings.ui.members.roleCannot.viewer': "Changez n'importe quoi.",
  'settings.ui.members.removeTitle': 'Retirer {name} depuis cet espace de travail',
  'settings.ui.members.removeConsequence.access':
    'Ils perdent immédiatement l’accès, sur toutes les surfaces.',
  'settings.ui.members.removeConsequence.drafts':
    'Les brouillons qu’ils ont rédigés restent dans l’espace de travail et restent modifiables.',
  'settings.ui.members.removeConsequence.audit':
    'Leurs actions passées restent dans le journal d’audit et sur les reçus.',
  'settings.ui.members.removeConsequence.approvals':
    "Les demandes d'approbation en attente reviennent dans la file d'attente pour un autre approbateur.",

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'Une marque applique les règles par rapport auxquelles le contenu est vérifié : ce que vous pouvez prétendre, ce que vous ne pouvez pas dire et comment chaque langue est écrite.',
  'settings.ui.projects.listCaption': 'Marques dans cet espace de travail',
  'settings.ui.projects.column.project': 'Project',
  'settings.ui.projects.column.locales': 'Langues du contenu',
  'settings.ui.projects.column.accounts': 'Comptes',
  'settings.ui.projects.column.updated': 'Mis à jour',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Aucun compte} one {# compte} many {# comptes} other {# comptes}}',
  'settings.ui.projects.emptyTitle': 'Pas encore de marques',
  'settings.ui.projects.emptyBody':
    "Une marque regroupe les comptes, les règles d'approbation et les règles de langue. La plupart des équipes commencent par une et en ajoutent une seconde lorsqu'un client ou un marché a besoin de règles différentes.",
  'settings.ui.projects.emptyExample':
    'Exemple : marque "Acme EU", langues anglais et allemand, terme bloqué "garanti", mention "Partenariat payant" pour Instagram.',
  'settings.ui.projects.voiceHelp':
    'Comment cette marque sonne. Utilisé lorsque vous demandez une réécriture et lorsque les réclamations sont vérifiées.',
  'settings.ui.projects.audienceHelp': 'À qui s’adresse le contenu, par marché.',
  'settings.ui.projects.approvedClaimsHelp':
    "Déclarations qu'un évaluateur a effacées. Tout ce qui ne figure pas dans cette liste est signalé avant approbation, et non après publication.",
  'settings.ui.projects.blockedTermsHelp':
    'Des propos qui bloquent la programmation pour cette enseigne. Un par ligne.',
  'settings.ui.projects.domainsHelp':
    'Domaines vers lesquels cette marque peut créer des liens et des raccourcis. Seuls les domaines vérifiés peuvent être sélectionnés dans le compositeur.',
  'settings.ui.projects.domainVerified': 'Vérifié {date}',
  'settings.ui.projects.domainPending': 'Enregistrement DNS pas encore vu',
  'settings.ui.projects.disclosureHelp':
    'Appliqué par défaut dans le composer pour les plateformes que vous choisissez ici. Il peut être modifié par message avant approbation.',
  'settings.ui.projects.glossaryHelp':
    'Les noms de produits, les termes juridiques et tout ce qui doit survivre à une traduction reste inchangé.',
  'settings.ui.projects.glossaryCaption': 'Termes protégés et comment chacun est traité par langue',
  'settings.ui.projects.glossaryEmpty':
    'Pas encore de termes protégés. Ajoutez des noms de produits et des termes juridiques qui ne doivent pas être traduits ou reformulés.',
  'settings.ui.projects.localeRulesHelp':
    'Règles par langue de contenu. Ils sont appliqués lorsque vous adaptez ou transcréez, et présentés au réviseur.',
  'settings.ui.projects.saveProject': 'Sauvegarder la marque',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'Trois paramètres distincts : la langue de cette application, les langues dans lesquelles vous publiez et les marchés pour lesquels vous écrivez. Changer l’un n’en change jamais l’autre.',
  'settings.ui.localization.interfaceOnlyEnglish':
    "Choisissez une langue d'interface pour cette application. Les langues du contenu sont distinctes et déjà disponibles.",
  'settings.ui.localization.marketHelp':
    "Un marché change d’exemples, de divulgations légales et d’appels à l’action. Cela ne change pas la langue d'un message.",
  'settings.ui.localization.previewTitle': 'Comment les dates et les chiffres seront lus',
  'settings.ui.localization.previewDate': 'Date',
  'settings.ui.localization.previewTime': 'Temps',
  'settings.ui.localization.previewNumber': 'Nombre',
  'settings.ui.localization.previewCurrency': 'Devise',
  'settings.ui.localization.weekStartHelp': 'Utilisé par la vue de la semaine du calendrier.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    "Tout ce qui peut agir sur cet espace de travail, en un seul endroit : vos sessions, vos identifiants, vos agents, vos webhooks et les applications auxquelles vous avez accordé l'accès.",
  'settings.ui.security.sessionsCaption': 'Sessions connectées pour votre compte',
  'settings.ui.security.sessionColumn.device': 'Appareil et navigateur',
  'settings.ui.security.sessionColumn.location': 'Localisation approximative',
  'settings.ui.security.sessionColumn.lastSeen': 'Dernière utilisation',
  'settings.ui.security.sessionCurrent': 'Cette séance',
  'settings.ui.security.sessionRevokeAll': 'Déconnectez-vous toutes les deux sessions',
  'settings.ui.security.sessionLocationUnknown': 'Localisation non enregistrée',
  'settings.ui.security.mfaOn': "L'authentification à deux facteurs est activée",
  'settings.ui.security.mfaOff': "L'authentification à deux facteurs est désactivée",
  'settings.ui.security.mfaBody':
    "Un deuxième facteur est requis avant les modifications de facturation, la création d'un compte de service, la reconnexion d'un compte et la révocation des informations d'identification.",
  'settings.ui.security.credentialsTitle': 'Clés API',
  'settings.ui.security.credentialsBody':
    "Clés appartenant à cet espace de travail. Ils sont distincts des subventions d'application et de votre propre session.",
  'settings.ui.security.agentsTitle': 'Comptes de service',
  'settings.ui.security.webhooksTitle': 'Points de terminaison du webhook',
  'settings.ui.security.grantsTitle': 'Applications que vous avez autorisées',
  'settings.ui.security.grantsBody':
    "La révocation d'une application arrête immédiatement ses jetons. Vos propres connexions et publications programmées ne sont pas affectées.",
  'settings.ui.security.grantScopes': 'Autorisations accordées',
  'settings.ui.security.socialPermissionsTitle': 'Autorisations des comptes sociaux',
  'settings.ui.security.socialPermissionsBody':
    "Ce que chaque compte connecté a autorisé Relay à faire, à partir de l'instantané de fonctionnalité pris au moment de la connexion.",
  'settings.ui.security.viewInSection': 'Gérer dans {section}',
  'settings.ui.security.emptySessions': 'Seule cette session est connectée.',
  'settings.ui.security.emptyGrants':
    "Aucune application tierce n'a accès à cet espace de travail. Les applications apparaissent ici une fois que vous les avez autorisées sur un écran de consentement.",
  'settings.ui.security.revokeGrantTitle': "Révoquer l'accès pour {app}",
  'settings.ui.security.revokeGrantConsequence.tokens':
    "Ses jetons d'accès et d'actualisation cessent de fonctionner immédiatement.",
  'settings.ui.security.revokeGrantConsequence.scheduled':
    "Le poste déjà programmé reste programmé. Annulez-les séparément si vous souhaitez qu'ils soient arrêtés.",
  'settings.ui.security.revokeGrantConsequence.reconnect':
    "L'application peut demander à nouveau l'accès et vous pouvez refuser.",

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'Take your data out, remove one thing, or close the account. Every destructive action names exactly what it touches first.',
  'settings.ui.data.exportTitle': 'Export',
  'settings.ui.data.exportBody':
    'A portable archive of content, schedules, receipts, analytics and audit events, plus your uploaded media.',
  'settings.ui.data.exportJson': 'Structured JSON',
  'settings.ui.data.exportCsv': 'Spreadsheet CSV',
  'settings.ui.data.exportMedia': 'Media archive',
  'settings.ui.data.exportJsonHelp':
    'One file per record type. Documented and stable across versions.',
  'settings.ui.data.exportCsvHelp': 'Posts, receipts and metrics as flat tables for a spreadsheet.',
  'settings.ui.data.exportMediaHelp':
    'The original files you uploaded or imported, with checksums.',
  'settings.ui.data.exportStart': 'Prepare export',
  'settings.ui.data.exportRunning':
    'Preparing your export. It keeps running if you close this page.',
  'settings.ui.data.exportReady': 'Export ready, prepared {date}',
  'settings.ui.data.exportDownload': 'Download export',
  'settings.ui.data.exportExpires': 'The download link expires {date}.',
  'settings.ui.data.deleteTitle': 'Delete',
  'settings.ui.data.deleteBody':
    'Choose the smallest thing that solves your problem. Each option below says what survives.',
  'settings.ui.data.deleteConnection': 'Revoke one social connection',
  'settings.ui.data.deleteConnectionHelp':
    'Removes Relay access to that account. The workspace, its content and its receipts stay.',
  'settings.ui.data.deleteProject': 'Delete a project',
  'settings.ui.data.deleteProjectHelp':
    'Removes the project, its rules and its glossary. Content published under it keeps its receipts.',
  'settings.ui.data.deleteContent': 'Delete content and media',
  'settings.ui.data.deleteContentHelp':
    'Removes drafts and stored files. It does not remove anything already published on a platform.',
  'settings.ui.data.deleteAccount': 'Close this workspace',
  'settings.ui.data.deleteAccountHelp':
    'Cancels scheduled jobs, revokes every connection, removes stored media and closes the workspace.',
  'settings.ui.data.scheduledJobsTitle': 'Scheduled work that will be canceled first',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {Nothing is scheduled right now} one {# scheduled post} other {# scheduled posts}}',
  'settings.ui.data.cancelJobsFirst': 'Cancel scheduled posts now',
  'settings.ui.data.cancelJobsDone': 'Scheduled posts canceled. Nothing will publish.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'Type the workspace name to confirm',
  'settings.ui.data.deleteConsequence.jobs':
    'Every scheduled post is canceled before anything is removed.',
  'settings.ui.data.deleteConsequence.connections':
    'Every social connection is revoked at the provider.',
  'settings.ui.data.deleteConsequence.media': 'Stored media is deleted and cannot be recovered.',
  'settings.ui.data.deleteConsequence.receipts':
    'Publication receipts are kept for the retention period stated in the Terms, then removed.',
  'settings.ui.data.deleteConsequence.published':
    'Posts already live on a platform are not deleted. Remove those on the platform.',
  'settings.ui.data.exportFirst': 'Export your data before you delete it.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'Partagez Relay avec un lien divulgué. La Commission n’est jamais conditionnée à un avis positif.',
  'settings.ui.referral.linkLabel': 'Votre lien de parrainage',
  'settings.ui.referral.tableCaption': 'Inscriptions attribuées et état de leur commission',
  'settings.ui.referral.column.signup': "S'inscrire",
  'settings.ui.referral.column.date': 'Date',
  'settings.ui.referral.column.state': 'Commission',
  'settings.ui.referral.column.amount': 'Montant',
  'settings.ui.referral.emptyTitle': "Aucune inscription attribuée pour l'instant",
  'settings.ui.referral.emptyBody':
    "Les inscriptions apparaissent ici une fois que quelqu'un démarre un essai via votre lien. Les montants restent en attente jusqu'à la fermeture de la fenêtre de remboursement.",
  'settings.ui.referral.emptyExample':
    "Exemple de ligne : acme.example, a démarré un essai le 12 juin, en attente jusqu'au 12 juillet, puis approuvé.",
  'settings.ui.referral.termsLink': 'Lire les conditions partenaires',
  'settings.ui.referral.balance': 'Commission approuvée',
  'settings.ui.referral.balanceUnavailableReason':
    "Le grand livre des commissions n'a pas encore été rapproché pour cette période.",

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    "Un compte de service est une identité nommée pour un agent, un script ou un workflow. Il comporte ses propres périmètres, ses propres limites et sa propre piste d'audit.",
  'developer.ui.agents.emptyTitle': "Aucun compte de service pour l'instant",
  'developer.ui.agents.emptyBody':
    'Créez-en un pour chaque automatisation que vous exécutez. Des comptes séparés signifient que vous pouvez en révoquer un sans arrêter les autres.',
  'developer.ui.agents.emptyExample':
    "Exemple : « Agent de contenu », marque Acme EU, peut rédiger et programmer jusqu'à 6 publications par jour entre 07h00 et 22h00, ne les publie jamais immédiatement.",
  'developer.ui.agents.step.identity': 'Nom et objectif',
  'developer.ui.agents.step.scope': "Ce qu'il peut atteindre",
  'developer.ui.agents.step.limits': 'Limites',
  'developer.ui.agents.purpose': 'A quoi sert ce compte',
  'developer.ui.agents.purposeHelp':
    "Une phrase. Il apparaît à côté de chaque action effectuée par ce compte dans le journal d'audit.",
  'developer.ui.agents.scopeHelp':
    "Une portée s'accorde exactement elle-même. Rien ici n’implique autre chose.",
  'developer.ui.agents.limitsHelp':
    "Les limites sont appliquées par l'API et non par l'agent. Un agent ne peut pas augmenter sa propre limite.",
  'developer.ui.agents.quietHours': 'Heures calmes',
  'developer.ui.agents.quietHoursHelp':
    "Le compte ne peut pas planifier ou publier pendant ces heures, dans le fuseau horaire de l'espace de travail.",
  'developer.ui.agents.lookAheadHelp':
    'Dans quelle mesure dans le futur un message peut-il être placé.',
  'developer.ui.agents.cadenceHelp':
    'Le plus grand nombre de publications externes que cela puisse susciter en une journée.',
  'developer.ui.agents.expiry': 'Expiration des identifiants',
  'developer.ui.agents.expiryHelp':
    'Une vie plus courte est plus sûre. Vous pouvez effectuer une rotation à tout moment.',
  'developer.ui.agents.summaryTitle': 'Avant de le créer',
  'developer.ui.agents.summaryAccounts': 'Comptes auxquels il peut accéder',
  'developer.ui.agents.summaryMaxActions':
    'Au plus {count, plural, one {# publication externe} many {# publications externes} other {# publications externes}} par jour.',
  'developer.ui.agents.summaryApproval': "Comportement d'approbation",
  'developer.ui.agents.summaryCreate': 'Créer un compte de service',
  'developer.ui.agents.detailTitle': 'Compte de service',
  'developer.ui.agents.statusActive': 'Actif',
  'developer.ui.agents.statusStopped': 'Arrêté',
  'developer.ui.agents.statusExpired': 'Identifiant expiré',
  'developer.ui.agents.stoppedBody':
    'Ce compte est arrêté. Chaque appel effectué est refusé pour une raison simple. Rien de ce qu’il a créé n’a été supprimé.',
  'developer.ui.agents.killTitle': 'Arrêt {name}',
  'developer.ui.agents.killConsequence.calls':
    'Chaque appel API, MCP et CLI depuis ce compte est refusé en même temps.',
  'developer.ui.agents.killConsequence.scheduled':
    "Le poste déjà programmé reste programmé. Annulez-les du calendrier si vous souhaitez qu'ils soient arrêtés.",
  'developer.ui.agents.killConsequence.reversible': 'Vous pourrez le recommencer plus tard.',
  'developer.ui.agents.resume': 'Redémarrez cet agent',
  'developer.ui.agents.rotate': "Rotation des informations d'identification",
  'developer.ui.agents.rotateTitle': "Faites pivoter les informations d'identification pour {name}",
  'developer.ui.agents.rotateConsequence.old':
    "L'identifiant actuel cesse de fonctionner immédiatement.",
  'developer.ui.agents.rotateConsequence.new': 'Le nouveau est affiché une fois, sur cette page.',
  'developer.ui.agents.rotateConsequence.clients':
    "Tout ce qui utilise l'ancienne valeur échoue jusqu'à ce que vous la mettiez à jour.",
  'developer.ui.agents.credentialStored': "J'ai stocké cet identifiant",
  'developer.ui.agents.credentialLabel': 'Identifiant du compte de service',
  'developer.ui.agents.credentialWarning': "C'est la seule fois où cet identifiant est affiché",
  'developer.ui.agents.credentialWarningBody':
    "Copiez-le dans votre magasin secret maintenant. Nous ne gardons qu'un hachage, nous ne pouvons donc pas l'afficher à nouveau. La rotation en crée un nouveau.",
  'developer.ui.agents.credentialConsumed':
    "L'identifiant n'est plus affiché. Faites-le pivoter si vous ne l'avez pas stocké.",
  'developer.ui.agents.credentialReveal': "Afficher les informations d'identification",
  'developer.ui.agents.credentialHide': "Masquer les informations d'identification",

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read': 'Consultez vos comptes connectés et ce que chacun peut faire',
  'developer.ui.scope.accounts_write':
    'Renommer les comptes et modifier la façon dont ils sont regroupés',
  'developer.ui.scope.drafts_read': 'Lisez vos brouillons et leurs variantes',
  'developer.ui.scope.drafts_write': 'Créer et modifier des brouillons',
  'developer.ui.scope.posts_schedule': 'Programmez du contenu approuvé sur vos comptes',
  'developer.ui.scope.posts_publish': 'Publiez immédiatement sur vos comptes',
  'developer.ui.scope.posts_cancel': 'Annuler les publications programmées',
  'developer.ui.scope.analytics_read': 'Lire les analyses de vos comptes',
  'developer.ui.scope.media_read': 'Voir les fichiers de votre bibliothèque',
  'developer.ui.scope.media_write': 'Téléchargez et modifiez des fichiers dans votre bibliothèque',
  'developer.ui.scope.rules_read': "Lisez vos règles d'automatisation",
  'developer.ui.scope.rules_write': "Créer et modifier des règles d'automatisation pouvant publier",
  'developer.ui.scope.growth_read': 'Lisez vos projets de croissance',
  'developer.ui.scope.growth_write': 'Créer et modifier des plans de croissance',
  'developer.ui.scope.webhooks_manage': 'Créer et modifier les points de terminaison du webhook',
  'developer.ui.scope.billing_read':
    "Lisez votre forfait, l'état de votre essai et votre utilisation",
  'developer.ui.scope.connections_admin': 'Connecter et déconnecter les comptes sociaux',

  'developer.ui.activity.caption': "Appels d'outils récents, avec ceux qui ont été refusés",
  'developer.ui.activity.column.time': 'Temps',
  'developer.ui.activity.column.tool': 'Outil ou itinéraire',
  'developer.ui.activity.column.outcome': 'Résultat',
  'developer.ui.activity.column.subject': 'Sujet',
  'developer.ui.activity.outcome.ok': 'Autorisé',
  'developer.ui.activity.outcome.denied': 'Refusé',
  'developer.ui.activity.outcome.failed': 'Échoué',
  'developer.ui.activity.filterDenied': 'Afficher uniquement les tentatives refusées',
  'developer.ui.activity.deniedExplain':
    'Une tentative refusée est la façon dont un agent mal configuré se présente. Ces lignes sont conservées et non masquées.',
  'developer.ui.activity.emptyTitle': "Aucun appel enregistré pour l'instant",
  'developer.ui.activity.emptyBody':
    'Les appels apparaissent ici quelques secondes après leur arrivée, y compris ceux qui ont été refusés.',
  'developer.ui.activity.emptyExample':
    'Exemple de ligne : 12:03, draft_post, Autorisé, brouillon pour le compte X @acme.',

  'developer.ui.setup.help':
    'Collez-le dans le client que vous connectez. Remplacez l’espace réservé des informations d’identification par la valeur que vous avez stockée.',
  'developer.ui.setup.credentialPlaceholder':
    "L'extrait utilise un espace réservé. Ne confiez jamais les véritables informations d’identification à un référentiel.",
  'developer.ui.setup.copySnippet': "Copier l'extrait pour {client}",
  'developer.ui.setup.snippetCopied': 'Extrait copié',
  'developer.ui.setup.tabLabel': 'Extraits de configuration du client',

  'developer.ui.playground.help':
    "Les appels sont exécutés sur une copie prédéfinie de cet espace de travail. Aucun prestataire n'est contacté et rien n'est programmé.",
  'developer.ui.playground.tool': 'Outil',
  'developer.ui.playground.arguments': 'Arguments',
  'developer.ui.playground.argumentsHelp': 'JSON. Le même corps que la vraie API accepte.',
  'developer.ui.playground.result': 'Résultat',
  'developer.ui.playground.resultEmpty': 'Exécutez un outil pour voir la réponse qu’il renverrait.',
  'developer.ui.playground.invalidJson':
    "Ce n'est pas encore un JSON valide, il ne peut donc pas être envoyé.",
  'developer.ui.playground.deniedByApproval':
    "Niveau d'approbation {level} n'autorise pas cet appel. L'exécution à sec le refuse exactement comme le ferait l'API.",
  'developer.ui.playground.announceResult': 'Essai à sec terminé. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    "Enregistrez une application afin que d'autres personnes puissent lui accorder l'accès à leur espace de travail. Chaque application possède sa propre identité, sa propre liste autorisée de redirection et sa propre piste d'audit.",
  'developer.ui.apps.emptyTitle': 'Aucune application enregistrée',
  'developer.ui.apps.emptyBody':
    "Enregistrez une application lorsqu'un autre produit doit agir au nom d'un utilisateur Relay. Pour votre propre automatisation, utilisez plutôt un compte de service.",
  'developer.ui.apps.emptyExample':
    'Exemple : "Acme Publisher", client confidentiel, redirection https://acme.example/oauth/callback, scopes comptes : lecture et brouillons : écriture.',
  'developer.ui.apps.typeHelp':
    "Un client confidentiel s'exécute sur un serveur que vous contrôlez et peut garder secret. Un client public est un navigateur ou une application de bureau et utilise PKCE sans secret.",
  'developer.ui.apps.redirectAdd': 'Ajouter un URI de redirection',
  'developer.ui.apps.redirectRemove': 'Retirer {uri}',
  'developer.ui.apps.redirectInvalid':
    'Saisissez un URI https complet sans caractère générique ni chaîne de requête. Il doit correspondre exactement à la valeur envoyée par votre application.',
  'developer.ui.apps.linksTitle': 'Liens publiés',
  'developer.ui.apps.linksHelp':
    "Ceux-ci apparaissent sur l’écran de consentement. Un utilisateur qui ne peut pas les joindre n'accordera pas l'accès.",
  'developer.ui.apps.linkUnreachable':
    "Nous n'avons pas pu accéder à cette URL lors de notre dernière vérification. {date}.",
  'developer.ui.apps.linkReachable': 'Accessible, vérifié {date}',
  'developer.ui.apps.scopesTitle': 'Autorisations que cette application peut demander',
  'developer.ui.apps.scopesHelp':
    'Demandez le moins dont vous avez besoin. Un utilisateur voit les autorisations de lecture et les autorisations consécutives comme deux groupes distincts.',
  'developer.ui.apps.scopeGroup.read': 'Autorisations de lecture',
  'developer.ui.apps.scopeGroup.reversible': 'Modifications que vous pouvez annuler',
  'developer.ui.apps.scopeGroup.consequential': 'Autorisations consécutives',
  'developer.ui.apps.scopeGroupHelp.read':
    "Ceux-ci permettent à l'application d'examiner les données. Rien ne change.",
  'developer.ui.apps.scopeGroupHelp.reversible':
    "Ceux-ci permettent à l'application de créer ou de modifier des éléments dans Relay. Rien n'atteint une plate-forme.",
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Ceux-ci peuvent provoquer une publication sur un compte réel ou modifier les personnes pouvant accéder à vos comptes. Ils sont toujours répertoriés séparément et ne sont jamais regroupés.',
  'developer.ui.apps.noBundling':
    'Il n’existe pas de portée d’accès combinée. La facturation et la gestion des connexions sont toujours demandées nominativement.',
  'developer.ui.apps.secretTitle': 'Secret client',
  'developer.ui.apps.secretWarning': "C'est la seule fois où le secret client est affiché",
  'developer.ui.apps.secretWarningBody':
    "Stockez-le maintenant dans votre gestionnaire de secrets côté serveur. Nous ne gardons qu'un hachage. Si vous le perdez, faites-le pivoter : il n’y a aucun moyen de le révéler à nouveau.",
  'developer.ui.apps.secretConsumed':
    "Le secret n'est plus affiché. Faites-le pivoter si vous ne l'avez pas stocké.",
  'developer.ui.apps.secretStored': "J'ai gardé ce secret",
  'developer.ui.apps.secretPublicClient':
    "Un client public n'a pas de secret. Il utilise le flux de code d'autorisation avec PKCE.",
  'developer.ui.apps.rotateTitle': 'Faites pivoter le secret client pour {app}',
  'developer.ui.apps.rotateConsequence.old': 'Le secret actuel cesse de fonctionner immédiatement.',
  'developer.ui.apps.rotateConsequence.grants':
    "Les autorisations d'utilisateurs existantes ne sont pas révoquées.",
  'developer.ui.apps.rotateConsequence.deploy':
    "Vos serveurs ne parviennent pas à actualiser les jetons jusqu'à ce que vous déployiez la nouvelle valeur.",
  'developer.ui.apps.consentPreviewTitle': "Aperçu de l'écran de consentement",
  'developer.ui.apps.consentPreviewHelp':
    "C'est ce que voit un utilisateur. Il est généré à partir de l’enregistrement de l’application, il ne peut donc pas promettre plus que ce que l’application demande.",
  'developer.ui.apps.consentPreviewSample':
    "Aperçu uniquement. Rien n'est accordé et aucun jeton n'est émis.",
  'developer.ui.apps.grantsCaption':
    "Espaces de travail qui ont accordé l'accès à cette application",
  'developer.ui.apps.grantColumn.workspace': 'Workspace',
  'developer.ui.apps.grantColumn.scopes': 'Portées',
  'developer.ui.apps.grantColumn.granted': 'Accordé',
  'developer.ui.apps.grantColumn.lastUsed': 'Dernière utilisation',
  'developer.ui.apps.grantsEmpty': "Personne n'a encore accordé l'accès à cette application.",
  'developer.ui.apps.logsCaption': 'Requêtes récentes, avec secrets et charges utiles supprimés',
  'developer.ui.apps.logColumn.time': 'Temps',
  'developer.ui.apps.logColumn.route': 'Itinéraire',
  'developer.ui.apps.logColumn.status': 'Statut',
  'developer.ui.apps.logColumn.workspace': 'Workspace',
  'developer.ui.apps.logsRedacted':
    "Les corps de requête et de réponse sont stockés avec les informations d'identification, les jetons et le contenu utilisateur supprimés.",
  'developer.ui.apps.sandboxTitle': "Informations d'identification du bac à sable",
  'developer.ui.apps.sandboxBody':
    'Un ID client et un espace de travail distincts avec des données prédéfinies. Les appels passés avec celui-ci ne parviennent jamais à un fournisseur.',
  'developer.ui.apps.rateLimitLabel': 'Limite de taux',
  'developer.ui.apps.rateLimitUsage': '{used} de {limit} demande cette heure',
  'developer.ui.apps.disable': "Désactiver l'application",
  'developer.ui.apps.enable': "Activer l'application",
  'developer.ui.apps.disabledBody':
    'Cette application est désactivée. Les jetons existants sont refusés et aucune nouvelle subvention ne peut être démarrée. Les subventions sont conservées afin que vous puissiez les réactiver.',
  'developer.ui.apps.deleteTitle': 'Supprimer {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Chaque subvention est révoquée et chaque jeton cesse de fonctionner.',
  'developer.ui.apps.deleteConsequence.logs':
    "Les journaux de demandes sont conservés pendant la période de conservation de l'audit.",
  'developer.ui.apps.deleteConsequence.irreversible': "L'ID client ne peut pas être réutilisé.",

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Livraisons HTTPS signées pour les événements que vous choisissez. Chaque livraison est enregistrée avec sa réponse, et toute livraison peut être renvoyée.',
  'developer.ui.webhooks.emptyTitle': "Aucun point de terminaison pour l'instant",
  'developer.ui.webhooks.emptyBody':
    "Ajoutez un point de terminaison pour recevoir les résultats de publication, les décisions d'approbation et l'état de la connexion dans vos propres systèmes.",
  'developer.ui.webhooks.emptyExample':
    'Exemple : https://hooks.acme.example/relay, abonné à post.published, post.failed et connection.action_required.',
  'developer.ui.webhooks.create': 'Ajouter un point de terminaison',
  'developer.ui.webhooks.url': 'URL du point de terminaison',
  'developer.ui.webhooks.urlHelp':
    'HTTPS uniquement. Nous ne suivons aucune redirection et nous ne réessayons pas de 2xx.',
  'developer.ui.webhooks.eventsTitle': 'Événements',
  'developer.ui.webhooks.eventsHelp':
    'Choisissez les événements que vous gérez. Envoyer tout à un point de terminaison qui en ignore la majeure partie rend les échecs plus difficiles à détecter.',
  'developer.ui.webhooks.eventsAll': 'Chaque événement',
  'developer.ui.webhooks.eventsSelected': 'Uniquement les événements que je sélectionne',
  'developer.ui.webhooks.eventsCount':
    '{count, plural, one {# événement} many {# événements} other {# événements}}',
  'developer.ui.webhooks.eventGroup.connections': 'Relations',
  'developer.ui.webhooks.eventGroup.content': 'Contenu et approbation',
  'developer.ui.webhooks.eventGroup.publishing': 'Édition',
  'developer.ui.webhooks.eventGroup.automation': 'Automatisation et flux',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'Marques et comptes',
  'developer.ui.webhooks.scopeAll': 'Chaque marque et chaque compte',
  'developer.ui.webhooks.scopeSelected': 'Seulement ceux que je sélectionne',
  'developer.ui.webhooks.secretTitle': 'Secret de signature',
  'developer.ui.webhooks.secretBody':
    "Vérifiez l'en-tête de signature avant d'analyser un corps. Dédupliquer sur l'identifiant de livraison, qui est stable au fil des tentatives.",
  'developer.ui.webhooks.secretRotateTitle': 'Faites pivoter le secret de signature',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Les deux secrets sont acceptés pendant 24 heures afin que vous puissiez les déployer sans abandonner de livraison.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Après cette fenêtre, seul le nouveau secret est utilisé.',
  'developer.ui.webhooks.testDeliveryHelp':
    "Envoie un exemple d'événement signé marqué comme test, afin que votre récepteur puisse l'ignorer en toute sécurité.",
  'developer.ui.webhooks.testDeliverySent':
    'Livraison test envoyée. Le résultat apparaît dans le journal ci-dessous.',
  'developer.ui.webhooks.deliveriesCaption':
    "Livraisons récentes et réponse de chacune d'entre elles",
  'developer.ui.webhooks.deliveryColumn.time': 'Demandé',
  'developer.ui.webhooks.deliveryColumn.event': 'Événement',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Tentative',
  'developer.ui.webhooks.deliveryColumn.response': 'Réponse',
  'developer.ui.webhooks.deliveryColumn.status': 'Statut',
  'developer.ui.webhooks.deliveryStatus.pending': 'En attendant',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Livré',
  'developer.ui.webhooks.deliveryStatus.failed': 'Échec, je vais réessayer',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Échec, plus aucune tentative',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Non envoyé, point de terminaison désactivé',
  'developer.ui.webhooks.deliveryNoResponse': 'Aucune réponse reçue',
  'developer.ui.webhooks.deliveryNextAttempt': 'Prochaine tentative {relativeTime}',
  'developer.ui.webhooks.inspect': 'Inspecter la livraison',
  'developer.ui.webhooks.inspectTitle': 'Livraison {id}',
  'developer.ui.webhooks.inspectRequest': 'Corps de la demande',
  'developer.ui.webhooks.inspectResponse': 'Corps de réponse',
  'developer.ui.webhooks.redeliver': 'Renvoyez cette livraison',
  'developer.ui.webhooks.redeliverHelp':
    "Le même identifiant d'événement est renvoyé à nouveau avec l'indicateur de relivraison défini, de sorte qu'un récepteur idempotent l'ignore en toute sécurité.",
  'developer.ui.webhooks.redelivered': "En file d'attente pour une nouvelle livraison.",
  'developer.ui.webhooks.failureTitle': 'Ce point de terminaison échoue',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# livraison consécutive ayant échoué} many {# livraisons consécutives ont échoué} other {# livraisons consécutives ont échoué}}. Après {limit} échecs consécutifs, le point de terminaison est désactivé et une action est enregistrée.',
  'developer.ui.webhooks.disabledTitle':
    'Ce point de terminaison a été désactivé après des échecs répétés',
  'developer.ui.webhooks.disabledBody':
    "Nous avons arrêté d'y envoyer des messages afin que votre file d'attente ne se remplisse pas. Réparez le récepteur, envoyez une livraison test, puis réactivez-le.",
  'developer.ui.webhooks.lastSuccessLabel': 'Dernier succès',
  'developer.ui.webhooks.lastSuccessNever': "Aucune livraison n'a jamais réussi",
  'developer.ui.webhooks.deleteTitle': 'Supprimer ce point de terminaison',
  'developer.ui.webhooks.deleteConsequence.stop': "Rien de plus n'est envoyé à cette URL.",
  'developer.ui.webhooks.deleteConsequence.logs':
    "Les journaux de livraison sont conservés pendant la période de conservation de l'audit.",

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'One plan, two intervals. Polar is the merchant of record: it holds the payment method, issues invoices and handles cancellation.',
  'billing.ui.statusHeading': 'Current status',
  'billing.ui.planHeading': 'Plan',
  'billing.ui.intervalHeading': 'Billing interval',
  'billing.ui.usageHeading': 'Metered provider usage',
  'billing.ui.invoicesHeading': 'Invoices',
  'billing.ui.cancelHeading': 'Cancellation',
  'billing.ui.trialDaysRemaining':
    'Trial, {count, plural, =0 {ends today} one {# day remaining} other {# days remaining}}',
  'billing.ui.convertsOn': 'Converts on {date} to {amount} per {interval}.',
  'billing.ui.dueToday': '$0 due today',
  'billing.ui.conversionLabel': 'Converts',
  'billing.ui.channelsLabel': 'Active channels',
  'billing.ui.paymentMethodPolar': 'Payment method held by Polar',
  'billing.ui.paymentMethodDescriptor': '{project} ending {last4}, expires {expiry}',
  'billing.ui.paymentMethodMissing': 'No payment method on file yet',
  'billing.ui.cancelBeforeDate': 'Cancel before {date} and you will not be charged.',
  'billing.ui.annualFraming': '$25/month billed annually. Save $48/year.',
  'billing.ui.monthlyOption': '$29 per month',
  'billing.ui.annualOption': '$300 per year',
  'billing.ui.intervalChangeHelp':
    'Changing the interval takes effect at the next renewal. Polar prorates it and shows the exact amount before you confirm.',
  'billing.ui.intervalChangedAnnouncement': 'Billing interval set to {interval}.',
  'billing.ui.allowanceChannels':
    '30 active social channels. A channel is one connected account, page or channel.',
  'billing.ui.allowanceChannelsUsage': '{used} of {limit} active channels',
  'billing.ui.allowanceFairUse':
    'Fair use means anti spam, rate and provider cost controls. They apply the same way to every subscriber and are published, not discretionary.',
  'billing.ui.allowanceMetered':
    'X and some other providers charge per operation. Those charges are passed through at cost and are not part of the plan price.',
  'billing.ui.allowanceNoMedia':
    'Image generation and video generation are not included and are not sold. Relay does not generate media.',
  'billing.ui.readFairUse': 'Read the fair use policy',
  'billing.ui.readMeteredPolicy': 'Read how metered usage is billed',
  'billing.ui.usageCaption': 'Metered provider usage this period, billed at cost',
  'billing.ui.usageColumn.item': 'Item',
  'billing.ui.usageColumn.quantity': 'Quantity',
  'billing.ui.usageColumn.unitPrice': 'Unit price',
  'billing.ui.usageColumn.amount': 'Amount',
  'billing.ui.usageTotal': 'Total this period',
  'billing.ui.usagePeriod': 'Period {start} to {end}',
  'billing.ui.usageSource': 'Prices published by the provider. Verified {date}.',
  'billing.ui.usageReconciled': 'Reconciled against the provider invoice on {date}.',
  'billing.ui.usagePending': 'Not reconciled yet. The final amount can move slightly.',
  'billing.ui.usageUnavailableReason':
    'The provider has not returned usage for this period yet. It is normally available within 24 hours.',
  'billing.ui.usageEmpty': 'No metered usage this period.',
  'billing.ui.spendAlert': 'Spend alert',
  'billing.ui.spendAlertHelp':
    'We email you when metered usage passes this amount in a billing period.',
  'billing.ui.spendAlertPause': 'Also pause metered actions when the alert is reached',
  'billing.ui.balanceLabel': 'Usage balance',
  'billing.ui.balanceHelp': 'Metered usage is drawn from this balance and invoiced by Polar.',
  'billing.ui.invoicesCaption': 'Invoices issued by Polar',
  'billing.ui.invoiceColumn.date': 'Date',
  'billing.ui.invoiceColumn.description': 'Description',
  'billing.ui.invoiceColumn.amount': 'Amount',
  'billing.ui.invoiceColumn.state': 'State',
  'billing.ui.invoiceState.paid': 'Paid',
  'billing.ui.invoiceState.open': 'Open',
  'billing.ui.invoiceState.uncollectible': 'Not collected',
  'billing.ui.invoiceState.refunded': 'Refunded',
  'billing.ui.invoicesEmpty': 'No invoice yet. The first one is issued when the trial converts.',
  'billing.ui.invoicesInPortal': 'Every invoice and receipt is available in the Polar portal.',
  'billing.ui.portalHelp':
    'The portal is where you change the payment method, download invoices and cancel. It opens in a new tab.',
  'billing.ui.pastDueHeading': 'Payment overdue',
  'billing.ui.pastDueBody':
    'The last payment did not go through. Update the payment method in the Polar portal to keep publishing.',
  'billing.ui.gracePolicy':
    'Scheduled posts keep running until {date}. After that the workspace becomes read only: nothing is deleted and nothing is published.',
  'billing.ui.cancelBody':
    'Cancelling is one action and takes effect at the end of the period you have paid for. There is no call to make and no form to fill in.',
  'billing.ui.cancelStart': 'Cancel subscription',
  'billing.ui.cancelDialogTitle': 'Cancel this subscription',
  'billing.ui.cancelConsequence.noCharge':
    'You will not be charged. Nothing is taken today or on {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'You keep every feature until {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Drafts, receipts, media and analytics stay in this workspace.',
  'billing.ui.cancelConsequence.scheduled':
    'Posts scheduled after {date} will not publish. Cancel or reschedule them before then.',
  'billing.ui.cancelConsequence.restart': 'You can start the subscription again at any time.',
  'billing.ui.cancelConfirm': 'Cancel subscription',
  'billing.ui.cancelKeep': 'Keep subscription',
  'billing.ui.cancelConfirmedBeforeConversion': 'Canceled. You will not be charged.',
  'billing.ui.cancelConfirmedAfterConversion': 'Canceled. Access continues until {date}.',
  'billing.ui.cancelAnnouncement': 'Subscription canceled.',
  'billing.ui.canceledNotice': 'This subscription is canceled.',
  'billing.ui.resume': 'Start the subscription again',
  'billing.ui.noSubscriptionTitle': 'No subscription on this workspace',
  'billing.ui.noSubscriptionBody':
    'Start the seven day trial to publish. Polar collects a payment method and charges nothing today.',
  'billing.ui.noSubscriptionExample':
    'Monthly is $29. Annual is $300, which is $25/month billed annually. Save $48/year.',
  'billing.ui.overChannelLimitAction': 'Review connected channels',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'Répondez à une courte réponse, confirmez ce que nous avons compris et obtenez un plan que vous pouvez accepter élément par élément. Il propose du travail. Il ne planifie ni ne publie jamais quoi que ce soit de lui-même.',
  'growth.ui.step.intake': 'Admission',
  'growth.ui.step.confirm': 'Confirmer',
  'growth.ui.step.plan': 'Plan',
  'growth.ui.stepIndicator': 'Étape {current} de {total}: {name}',
  'growth.ui.intake.section.product': 'Produit',
  'growth.ui.intake.section.audience': 'Public et marchés',
  'growth.ui.intake.section.objective': 'Objectif',
  'growth.ui.intake.section.capacity': 'Canaux et capacité',
  'growth.ui.intake.section.limits': 'Ce qui est interdit',
  'growth.ui.intake.help':
    "Rien ici n'est deviné pour vous. Tout ce que vous laissez vide est marqué comme manquant plutôt que rempli.",
  'growth.ui.intake.productNameHelp': 'Le nom que vous utilisez avec les clients.',
  'growth.ui.intake.siteUrlHelp':
    'Nous lisons la page que vous nous donnez comme source. Vous confirmez tous les faits que nous en retirons.',
  'growth.ui.intake.descriptionHelp':
    "Ce que vous vendez et à qui cela s'adresse, selon vos propres mots.",
  'growth.ui.intake.marketsHelp': 'Pays ou régions. Un par ligne.',
  'growth.ui.intake.localesHelp': 'Les langues dans lesquelles vous publierez.',
  'growth.ui.intake.objectiveHelp': 'Ce dont vous voulez davantage au cours du prochain trimestre.',
  'growth.ui.intake.conversionHelp':
    "L'action que vous pouvez réellement mesurer. Une inscription, une démo, un achat.",
  'growth.ui.intake.proofHelp':
    "Études de cas, benchmarks que vous avez exécutés, captures d'écran que vous possédez, autorisations que vous détenez déjà. Un par ligne.",
  'growth.ui.intake.proofNone': "Je n'ai pas encore de preuve approuvée",
  'growth.ui.intake.proofNoneEffect':
    'Le plan évitera entièrement les résultats et les réclamations des clients.',
  'growth.ui.intake.channelsHelp': 'Les comptes à partir desquels vous publiez déjà.',
  'growth.ui.intake.capacityHelp':
    'Soyez honnête. Un plan que vous ne pouvez pas exécuter n’est pas un plan.',
  'growth.ui.intake.competitorsHelp': 'Facultatif. Un par ligne.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Réclamations que vous ne pouvez pas faire, pour des raisons juridiques ou politiques. Un par ligne.',
  'growth.ui.intake.prohibitedTopicsHelp': 'Des sujets à éviter. Un par ligne.',
  'growth.ui.intake.submit': 'Revoyez ce que nous avons compris',
  'growth.ui.intake.savedAnnouncement': "Profil d'entreprise enregistré.",
  'growth.ui.intake.requiredMissing':
    'Remplissez les champs marqués comme obligatoires avant de continuer.',

  'growth.ui.confirm.factsTitle': 'Des faits que vous avez confirmés',
  'growth.ui.confirm.factsHelp': 'Ceux-ci peuvent être utilisés en copie.',
  'growth.ui.confirm.assumptionsTitle': 'Hypothèses que nous avons formulées',
  'growth.ui.confirm.assumptionsHelp':
    'Ce ne sont pas des faits. Ils façonnent le plan mais ne deviennent jamais une revendication dans un message.',
  'growth.ui.confirm.missingTitle': 'Manquant',
  'growth.ui.confirm.missingHelp':
    'Le plan s’articule autour de chacun de ces éléments et le précise là où cela compte.',
  'growth.ui.confirm.confidence.label': 'Confiance: {level}',
  'growth.ui.confirm.confidence.low': 'faible',
  'growth.ui.confirm.confidence.medium': 'moyen',
  'growth.ui.confirm.confidence.high': 'haut',
  'growth.ui.confirm.promote': 'Confirmer comme un fait',
  'growth.ui.confirm.correct': 'Corrigez ceci',
  'growth.ui.confirm.correctLabel': 'Votre correction',
  'growth.ui.confirm.generate': 'Générer le plan',
  'growth.ui.confirm.announcement': "Profil d'entreprise confirmé.",

  'growth.ui.plan.generatingBody':
    'Cela prend quelques secondes. Vous pouvez quitter cette page : le plan se termine tout seul.',
  'growth.ui.plan.stateDraft': 'Projet, non approuvé',
  'growth.ui.plan.stateApproved': 'Approuvé',
  'growth.ui.plan.stateSuperseded': 'Remplacé par une version plus récente',
  'growth.ui.plan.newVersionNotice':
    'Une actualisation crée une version {version} et laisse la version approuvée intacte.',
  'growth.ui.plan.emptyTitle': 'Pas encore de plan',
  'growth.ui.plan.emptyBody':
    "Remplissez le profil de l'entreprise et nous construirons un plan à partir des faits que vous confirmez.",
  'growth.ui.plan.emptyExample':
    "Un plan contient une stratégie, quatre semaines de briefings, une campagne UGC, des opportunités soutenues par catalogue et jusqu'à cinq outils.",
  'growth.ui.plan.tabsLabel': 'Sections du plan',
  'growth.ui.plan.modelNote': 'Généré par {model}, rapide {promptVersion}, sur {date}.',

  'growth.ui.strategy.snapshotTitle': "Aperçu de l'entreprise",
  'growth.ui.strategy.channelPriority': 'Priorité {rank}',
  'growth.ui.strategy.channelFormats': 'Formats natifs',
  'growth.ui.strategy.pillarProof': "Preuve sur laquelle s'appuie ce pilier",
  'growth.ui.strategy.pillarProofNone': 'Aucune preuve approuvée. Gardez ce pilier descriptif.',
  'growth.ui.strategy.cadenceCaption': 'Publications par semaine par chaîne',
  'growth.ui.strategy.cadenceColumn.channel': 'Canal',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Publications par semaine',
  'growth.ui.strategy.cadenceTotal': 'Total par semaine',
  'growth.ui.strategy.capacityWarning':
    'Cette cadence est {planned} publie par semaine contre une capacité déclarée de {capacity} heures. Réduisez-le ou augmentez la capacité du profil.',
  'growth.ui.strategy.measurementBody':
    "Par rapport à vos propres publications de fin de chaîne sur la même chaîne et dans le même format. Aucun benchmark externe n'est utilisé, car aucun n'est comparable à votre compte.",
  'growth.ui.strategy.localeAdaptations': 'Remarques linguistiques',

  'growth.ui.fourWeek.caption': 'Briefs proposés par semaine et par jour',
  'growth.ui.fourWeek.column.date': 'Date',
  'growth.ui.fourWeek.column.channel': 'Canal',
  'growth.ui.fourWeek.column.pillar': 'Pilier',
  'growth.ui.fourWeek.column.format': 'Format',
  'growth.ui.fourWeek.column.brief': 'Bref',
  'growth.ui.fourWeek.column.cta': "Appel à l'action",
  'growth.ui.fourWeek.column.measurement': 'Étiquette de mesure',
  'growth.ui.fourWeek.column.actions': 'Actes',
  'growth.ui.fourWeek.approvalRequired': 'Approbation requise avant de pouvoir publier',
  'growth.ui.fourWeek.approvalNotRequired': 'Aucune approbation requise pour ce compte',
  'growth.ui.fourWeek.noCta': "Aucun appel à l'action",
  'growth.ui.fourWeek.weekEmpty': 'Aucun brief proposé pour cette semaine.',
  'growth.ui.fourWeek.acceptedCount': '{accepted} de {total} mémoires acceptés comme brouillons',
  'growth.ui.fourWeek.acceptAnnouncement': 'Brouillon créé à partir de ce brief.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Proposition de calendrier ajoutée pour {date}.',

  'growth.ui.ugc.promptAngle': 'Angle {number}',
  'growth.ui.ugc.checklistTitle': 'Rights, consent and disclosure',
  'growth.ui.ugc.checklistHelp':
    'Work through this with each participant before anything is published. Consent to appear is not consent to advertise.',
  'growth.ui.ugc.incentiveNone': 'No incentive offered',
  'growth.ui.ugc.incentiveDisclosure':
    'An incentive must be disclosed on every post that results from it, by you and by the participant.',
  'growth.ui.ugc.honesty':
    'This plans a campaign you run with real people. Relay does not find creators, contact them, write testimonials or create customer content.',

  'growth.ui.opportunities.caption':
    'Opportunités vérifiées du catalogue, classées par adéquation avec votre profil',
  'growth.ui.opportunities.column.opportunity': 'Opportunité',
  'growth.ui.opportunities.column.type': 'Taper',
  'growth.ui.opportunities.column.audience': 'Public',
  'growth.ui.opportunities.column.fit': 'Pourquoi cela convient',
  'growth.ui.opportunities.column.requirements': 'Exigences',
  'growth.ui.opportunities.column.rules': "Règles d'auto-promotion",
  'growth.ui.opportunities.column.cost': 'Coût',
  'growth.ui.opportunities.column.effort': 'Effort',
  'growth.ui.opportunities.column.verified': 'Dernière vérification',
  'growth.ui.opportunities.column.actions': 'Actes',
  'growth.ui.opportunities.costFree': 'Gratuit',
  'growth.ui.opportunities.effort.low': 'Faible',
  'growth.ui.opportunities.effort.medium': 'Moyen',
  'growth.ui.opportunities.effort.high': 'Haut',
  'growth.ui.opportunities.noRequiredAsset': 'Aucun actif requis',
  'growth.ui.opportunities.prepareTitle': 'Préparer une soumission pour {name}',
  'growth.ui.opportunities.prepareRules': 'Leurs règles, citées',
  'growth.ui.opportunities.prepareChecklist': 'Que faut-il préparer',
  'growth.ui.opportunities.prepareManual':
    "Vous le soumettez vous-même sur leur site. Relay ne remplit pas de formulaires, ne crée pas de comptes et n'envoie pas d'e-mails à qui que ce soit.",
  'growth.ui.opportunities.pitchTitle': 'Projet de pitch',
  'growth.ui.opportunities.pitchHelp':
    "Modifiez-le avant de l'envoyer. Il utilise uniquement les faits que vous avez confirmés.",
  'growth.ui.opportunities.submittedOn': 'Soumis {date}',
  'growth.ui.opportunities.staleTitle': 'Certaines entrées doivent être revérifiées',
  'growth.ui.opportunities.staleBody':
    "{count, plural, one {# entrée a dépassé sa date d'examen} many {# entrées ont dépassé leur date d'examen} other {# entrées ont dépassé leur date d'examen}}. Vérifiez les règles en vigueur sur le site avant de vous y fier.",
  'growth.ui.opportunities.emptyExample':
    "Une ligne du catalogue contient l'URL officielle, l'audience, les règles de soumission citées sur le site, le coût, l'effort et la date à laquelle une personne l'a vérifié pour la dernière fois.",

  'growth.ui.tools.shown': '{shown} de {max} montré',
  'growth.ui.tools.fewerThanMax':
    "Seulement {count, plural, one {# correspondances d'outils} many {# outils correspondent} other {# outils correspondent}} ce flux de travail avec un examen actuel. Nous préférons en afficher moins plutôt que de compléter la liste.",
  'growth.ui.tools.emptyTitle': 'Aucun outil examiné ne correspond encore à ce flux de travail',
  'growth.ui.tools.emptyBody':
    "Chaque entrée nécessite un prix vérifié, des conditions de droits vérifiées et une limitation nommée avant d'apparaître ici.",
  'growth.ui.tools.emptyExample':
    "Une entrée indique à quoi il sert le mieux, pourquoi il correspond à votre plan, ce qu'il ne peut pas faire, les compétences dont il a besoin, comment le résultat revient dans Relay et quand le prix a été vérifié pour la dernière fois.",
  'growth.ui.tools.openSite': 'Ouvrez le site officiel pour {name}',
  'growth.ui.tools.stale': 'Passé sa date de révision. Exclus des plans générés.',

  'growth.ui.item.explainTitle': 'Pourquoi cela a été suggéré',
  'growth.ui.item.explainEvidence': 'Sur quoi il est basé',
  'growth.ui.item.explainNoEvidence':
    "Cela vient de l'objectif et des règles du canal, et non d'un fait confirmé concernant votre entreprise.",
  'growth.ui.item.dismissTitle': 'Rejeter cette suggestion',
  'growth.ui.item.dismissBody':
    'Dites-nous pourquoi. La raison est stockée avec le plan et façonne la version suivante.',
  'growth.ui.item.dismissReasonLabel': 'Raison',
  'growth.ui.item.dismissReason.notRelevant': 'Pas pertinent pour cette entreprise',
  'growth.ui.item.dismissReason.noCapacity': "Nous n'avons pas la capacité",
  'growth.ui.item.dismissReason.wrongAudience': 'Mauvais public',
  'growth.ui.item.dismissReason.alreadyDone': 'Nous le faisons déjà',
  'growth.ui.item.dismissReason.policy': 'Contre notre politique ou nos réclamations',
  'growth.ui.item.dismissReason.other': "Quelque chose d'autre",
  'growth.ui.item.dismissNote': 'Tout ce que vous voulez ajouter',
  'growth.ui.item.dismissed': "Rejeté. Il reste visible afin que vous puissiez l'annuler.",
  'growth.ui.item.undoDismiss': 'Annuler le rejet',

  'growth.ui.export.title': 'Exporter ce plan',
  'growth.ui.export.formatLabel': 'Format',
  'growth.ui.export.copy': 'Copier dans le presse-papier',
  'growth.ui.export.download': 'Télécharger le fichier',
  'growth.ui.export.copied': 'Plan copié dans le presse-papiers.',
  'growth.ui.export.schemaNote':
    "Les trois formats proviennent d'un schéma validé, version {version}. Les vues structurées sont sans danger pour le contrôle de code source et ne contiennent aucun secret.",
  'growth.ui.export.previewLabel': "Aperçu de l'exportation",
} as const;
