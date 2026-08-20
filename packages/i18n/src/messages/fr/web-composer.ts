/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
  'composerWeb.pane.targets': 'Comptes et ensembles cibles',
  'composerWeb.pane.master': 'Brouillon principal et paramètres partagés',
  'composerWeb.pane.variant': 'Version pour la cible ouverte',
  'composerWeb.pane.review': 'Aperçu, validation, coût et approbation',
  'composerWeb.pane.showPreview': "Afficher l'aperçu",
  'composerWeb.pane.hidePreview': "Masquer l'aperçu",
  'composerWeb.pane.previewCollapsed':
    "Le panneau d'aperçu est masqué. Ouvrez-le pour vérifier le message final.",

  'composerWeb.step.targets': 'Cibles',
  'composerWeb.step.write': 'Écrire',
  'composerWeb.step.perTarget': 'Par cible',
  'composerWeb.step.review': 'Revoir',
  'composerWeb.step.progress': 'Étape {current} de {total}',
  'composerWeb.step.legend': 'Étapes Composer',

  'composerWeb.summary.label': 'Projet de résumé',
  'composerWeb.summary.targets':
    '{count, plural, =0 {Aucune cible} one {# cible} many {# cibles} other {# cibles}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {Aucun problème} one {# problème} many {# problèmes} other {# problèmes}}',
  'composerWeb.summary.notScheduled': 'Aucune heure choisie',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Coût pas encore chiffré',
  'composerWeb.summary.openReview': "Ouvrir l'examen",

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Projet principal',
  'composerWeb.rail.masterHint':
    'Modifiez ici pour atteindre toutes les cibles qui héritent encore.',
  'composerWeb.rail.accountsHeading': 'Comptes cibles',
  'composerWeb.rail.setsHeading': 'Ensembles et groupes',
  'composerWeb.rail.setsHelp':
    "Un ensemble est un groupe enregistré de comptes et de valeurs par défaut. L'application d'un copie ses valeurs dans ce brouillon. Les modifications ultérieures apportées à l'ensemble ne modifient pas ce brouillon.",
  'composerWeb.rail.openTarget': 'Ouvrez la version pour {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Limite inconnue',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {pas de média} one {# fichier multimédia} many {# fichiers multimédias} other {# fichiers multimédias}}',
  'composerWeb.rail.paused': "En pause. Il ne sera pas publié tant que vous ne l'aurez pas repris.",
  'composerWeb.rail.state.notBuilt': 'Pas encore construit',
  'composerWeb.rail.state.unsupported': 'Le fournisseur ne prend pas en charge',
  'composerWeb.rail.empty': "Aucun compte sélectionné pour l'instant.",
  'composerWeb.rail.emptyHelp':
    'Choisissez les comptes que cette publication devrait atteindre. Vous pourrez en ajouter d’autres plus tard.',
  'composerWeb.rail.divergenceHint':
    'Ouvrez une cible pour voir sa propre version. Le projet principal reste inchangé.',
  'composerWeb.rail.searchLabel': 'Filtrer les comptes',
  'composerWeb.rail.removeTarget': 'Retirer {account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Modification globale',
  'composerWeb.globalEdit.title': 'Appliquer cette modification à chaque cible sélectionnée',
  'composerWeb.globalEdit.description':
    'Le projet principal change toujours. Les cibles qui héritent encore de ce champ le suivent. Les cibles avec leur propre version la conservent.',
  'composerWeb.globalEdit.fieldLabel': 'Champ',
  'composerWeb.globalEdit.compatibleHeading': 'Ces objectifs acceptent le changement',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Ces cibles gardent leur propre version',
  'composerWeb.globalEdit.incompatibleHeading': 'Ces cibles ne peuvent pas accepter le changement',
  'composerWeb.globalEdit.incompatibleHelp':
    "Rien n'est abandonné sans vous le dire. Chaque compte ci-dessous reçoit une version explicite avec la modification adaptée, et vous pouvez la modifier par la suite.",
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} permet {limit} personnages. Ce texte est {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    "{account} n'accepte pas de lien dans ce champ. Le lien reste dans le brouillon principal et dans les cibles qui le permettent.",
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} accepte {limit, plural, one {# déposer} many {# fichiers} other {# fichiers}}. Ce projet a {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported':
    "{account} n'accepte pas {mimeType} fichiers.",
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} ne prend pas en charge les éléments de suivi, la séquence reste donc sur le brouillon principal.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} publie du texte brut. Les marques de formatage apparaîtront sous forme de caractères.',
  'composerWeb.globalEdit.adaptedPreview': 'Quoi {account} obtient à la place',
  'composerWeb.globalEdit.confirm': 'Appliquer et créer les versions',
  'composerWeb.globalEdit.nothingToApply':
    'Rien ne change. Le brouillon principal a déjà cette valeur.',
  'composerWeb.globalEdit.announced':
    "{applied, plural, one {Modification appliquée à # cible} many {Modification appliquée à # cibles} other {Modification appliquée à # cibles}}. {adapted, plural, =0 {Aucune cible n'a besoin d'une version adaptée} one {# cible a obtenu une version adaptée} many {# cibles ont reçu des versions adaptées} other {# cibles ont reçu des versions adaptées}}.",

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'Cette cible a sa propre version',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# champ diffère du brouillon principal} many {# champs diffèrent du brouillon principal} other {# champs diffèrent du brouillon principal}}',
  'composerWeb.override.field.body': 'Publier du texte',
  'composerWeb.override.field.contentKind': 'Type de message',
  'composerWeb.override.field.locale': 'Langue du contenu',
  'composerWeb.override.field.mediaIds': 'Médias',
  'composerWeb.override.field.links': 'Links',
  'composerWeb.override.field.signature': 'Signature',
  'composerWeb.override.field.threadItems': 'Commentaires et fil de discussion',
  'composerWeb.override.field.schedule': 'Calendrier',
  'composerWeb.override.resetField': 'Réinitialiser {field} maîtriser',
  'composerWeb.override.resetFieldTitle': 'Réinitialiser {field} pour {account}?',
  'composerWeb.override.resetFieldBody':
    'La version de {field} écrit pour {account} est rejeté et le brouillon principal est à nouveau utilisé. Aucun autre changement de cible.',
  'composerWeb.override.resetAll': 'Réinitialiser chaque champ en tant que maître',
  'composerWeb.override.inheritNotice':
    'Cet objectif suit le projet principal. Modifier quoi que ce soit ici crée uniquement une version {account} reçoit.',
  'composerWeb.override.created': '{account} a maintenant le sien {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Limites pour {account}',
  'composerWeb.limits.text': "Envoyez des SMS jusqu'à {limit} personnages",
  'composerWeb.limits.linkCost':
    'Un lien compte comme {count, plural, one {# personnage} many {# caractères} other {# caractères}} quelle que soit sa longueur.',
  'composerWeb.limits.images':
    "{count, plural, =0 {Aucune image} one {# image} many {jusqu'à # images} other {jusqu'à # images}}",
  'composerWeb.limits.videos':
    "{count, plural, =0 {Pas de vidéo} one {# vidéo} many {jusqu'à # vidéos} other {jusqu'à # vidéos}}",
  'composerWeb.limits.duration': "Vidéo jusqu'à {duration}",
  'composerWeb.limits.aspect': "Rapport d'aspect entre {min} et {max}",
  'composerWeb.limits.fileSize': "Fichiers jusqu'à {size}",
  'composerWeb.limits.mimeTypes': 'Types de fichiers acceptés : {types}',
  'composerWeb.limits.source':
    "À partir d'un instantané de capacité {version}, lire {relativeTime}.",
  'composerWeb.limits.thumbnailRequired': 'Une vignette est requise.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider} paramètres',
  'composerWeb.native.privacy': 'Qui peut voir ça',
  'composerWeb.native.privacyChoose': 'Choisissez un public',
  'composerWeb.native.privacyExplicit':
    '{provider} ne permet pas un public présélectionné. Choisissez-en un avant que cela puisse être programmé.',
  'composerWeb.native.community': 'Communauté',
  'composerWeb.native.board': 'Conseil',
  'composerWeb.native.group': 'Groupe ou page',
  'composerWeb.native.organization': 'Organisation',
  'composerWeb.native.channel': 'Canal',
  'composerWeb.native.publication': 'Publication',
  'composerWeb.native.disclosureHeading': 'Divulgation',
  'composerWeb.native.disclosureCommercial':
    "Cet article fait la promotion d'un produit ou d'un service",
  'composerWeb.native.disclosureBranded':
    'Cet article est un contenu de marque pour une autre entreprise',
  'composerWeb.native.disclosureAi': "Une partie de ce contenu a été réalisée avec un outil d'IA",
  'composerWeb.native.disclosureUnsupported':
    "{provider} n'offre pas cette divulgation via son API. Ajoutez-le plutôt dans le texte.",
  'composerWeb.native.none': 'Non {provider} les paramètres s’appliquent à ce type de publication.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Résolu le {provider}',
  'composerWeb.entity.resolvedId': 'Identifiant du compte {externalId}',
  'composerWeb.entity.plainTextWarning':
    "Pas de correspondance. Il sera publié sous forme de texte brut, ce qui n'est pas une balise native sur {provider}.",
  'composerWeb.entity.removeMention': 'Supprimer la mention de {label}',
  'composerWeb.entity.addMention': 'Ajouter une mention',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Aucune mention} one {# mention} many {# mention} other {# mention}}, {resolved} correspondant à un compte réel',
  'composerWeb.entity.lookupUnsupported':
    "{provider} n'offre pas de recherche d'entité pour ce type de compte.",
  'composerWeb.entity.lookupNotBuilt':
    "Relay n'a pas créé de recherche d'entité pour {provider} encore. Rien n'est deviné pour l'instant.",
  'composerWeb.entity.searchHint': 'Tapez au moins deux caractères, puis choisissez un résultat.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {Aucune correspondance} one {# correspondre} many {# correspondance} other {# correspondance}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Links',
  'composerWeb.links.detected':
    '{count, plural, one {# lien trouvé dans ce brouillon} many {# liens trouvés dans ce brouillon} other {# liens trouvés dans ce brouillon}}',
  'composerWeb.links.noneDetected': "Aucun lien dans ce brouillon pour l'instant.",
  'composerWeb.links.modeLabel': 'Comment ce lien est publié',
  'composerWeb.links.original': "URL d'origine",
  'composerWeb.links.utmSource': 'Source',
  'composerWeb.links.utmMedium': 'Moyen',
  'composerWeb.links.utmCampaign': 'Campagne',
  'composerWeb.links.utmTerm': 'Terme',
  'composerWeb.links.utmContent': 'Contenu',
  'composerWeb.links.domainVerified': '{domain}, vérifié pour cet espace de travail',
  'composerWeb.links.domainDefault': 'Domaine par défaut Relay',
  'composerWeb.links.domainNone': "Aucun domaine de marque n'est encore vérifié.",
  'composerWeb.links.notAllowedHere': '{account} ne permet pas de lien ici.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Commentaire',
  'composerWeb.sequence.kindThread': 'Partie filetée',
  'composerWeb.sequence.kindLabel': "Type d'article",
  'composerWeb.sequence.moveUp': 'Déplacer cet élément plus tôt',
  'composerWeb.sequence.moveDown': 'Déplacer cet élément plus tard',
  'composerWeb.sequence.remove': 'Supprimer cet élément',
  'composerWeb.sequence.absoluteTime': 'Fonctionne à {time}, ce qui est {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'Si un élément échoue, la publication déjà publiée reste publiée et les éléments suivants ne sont pas exécutés. Vous obtenez un élément d’action.',
  'composerWeb.sequence.maxReached':
    '{account} accepte {limit, plural, one {# élément de suivi} many {# éléments de suivi} other {# éléments de suivi}}.',
  'composerWeb.sequence.minDelay': 'Le délai le plus court {provider} permet voici {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Même compte que la publication',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Aucun problème} one {# problème} many {# problèmes} other {# problèmes}} sur cet article',
  'composerWeb.sequence.customMinutes': "Minutes après l'élément précédent",

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Répétez ce post',
  'composerWeb.repeat.cadenceLabel': 'À quelle fréquence',
  'composerWeb.repeat.maximum': 'Un message répétitif peut fonctionner au maximum {limit} fois.',
  'composerWeb.repeat.occurrenceLabel': 'Nombre de messages',
  'composerWeb.repeat.duplicateCheck':
    "Chaque occurrence est vérifiée pour le contenu en double avant sa publication. Une occurrence qui échoue à la vérification devient une action au lieu d'être publiée.",
  'composerWeb.repeat.occurrenceList': 'Premières occurrences',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {et # autre occurrence} many {et # occurrences supplémentaires} other {et # occurrences supplémentaires}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Ensembles et signature',
  'composerWeb.set.pickerTitle': "Commencer à partir d'un ensemble",
  'composerWeb.set.pickerDescription':
    "Un ensemble remplit les cibles, le texte et les paramètres. Le brouillon qu'il crée est indépendant, donc la modification ultérieure de l'ensemble ne modifie jamais une publication approuvée ou programmée.",
  'composerWeb.set.accountCount':
    '{count, plural, one {# compte} many {# comptes} other {# comptes}}',
  'composerWeb.set.apply': 'Utilisez cet ensemble',
  'composerWeb.set.none': "Aucun ensemble n'a encore été enregistré.",
  'composerWeb.signature.pickerLabel': 'Signature',
  'composerWeb.signature.scope': 'Pour {project} sur {provider} dans {language}',
  'composerWeb.signature.previewHeading': 'Comment ça termine le post',
  'composerWeb.signature.notMatching':
    "Cette signature s'étend à une marque, une plateforme ou une langue différente, elle n'est donc pas proposée ici.",

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Aide avec ce texte',
  'composerWeb.assist.unavailableTitle': "L'assistance textuelle n'est pas configurée",
  'composerWeb.assist.unavailableBody':
    "Aucune passerelle IA n'est configurée pour cet espace de travail, les actions d'assistance sont donc désactivées. Tout le reste dans le compositeur fonctionne normalement.",
  'composerWeb.assist.targetLabel': "S'applique à",
  'composerWeb.assist.targetMaster': 'Le projet principal',
  'composerWeb.assist.targetVariant': 'La version pour {account}',
  'composerWeb.assist.beforeLabel': 'Texte actuel',
  'composerWeb.assist.afterLabel': 'Texte proposé',
  'composerWeb.assist.regionLabel': 'Modification de texte proposée, pas encore appliquée',
  'composerWeb.assist.added': 'ajouté',
  'composerWeb.assist.removed': 'supprimé',
  'composerWeb.assist.evidence': 'Preuves et sources',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Aucune source trouvée pour cette affirmation. Vérifiez-le avant de publier.',
  'composerWeb.assist.failed': "La demande d'assistance n'a pas abouti. Votre texte est inchangé.",
  'composerWeb.assist.noMediaGeneration':
    "Relay ne crée pas d'images ou de vidéos. Apportez les fichiers terminés dans la bibliothèque et publiez-les ici.",

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    "Il s'agit de la version approuvée. Le modifier crée une nouvelle version et efface l'approbation.",
  'composerWeb.autosave.pinnedAcknowledge': "Modifier et effacer l'approbation",
  'composerWeb.autosave.conflictTitle': 'Deux versions de ce projet',
  'composerWeb.autosave.conflictKeepMine': "Gardez ce que j'ai écrit",
  'composerWeb.autosave.conflictKeepTheirs': 'Utilisez la version de {name}',
  'composerWeb.autosave.conflictHelp':
    "Rien n'est fusionné automatiquement. Choisissez par champ, puis enregistrez.",
  'composerWeb.autosave.retry': "Essayez à nouveau d'enregistrer",

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Raccourcis Composer',
  'composerWeb.shortcuts.nextTarget': 'Cible suivante',
  'composerWeb.shortcuts.previousTarget': 'Cible précédente',
  'composerWeb.shortcuts.nextIssue': 'Prochain numéro',
  'composerWeb.shortcuts.previousIssue': 'Numéro précédent',
  'composerWeb.shortcuts.save': 'Enregistrer le brouillon maintenant',
  'composerWeb.shortcuts.openSchedule': 'Ouvrir la feuille de planning',
  'composerWeb.shortcuts.open': 'Afficher les raccourcis',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'Revoir',
  'composerWeb.review.contentVersion': 'Version du contenu {checksum}',
  'composerWeb.review.approvalPolicy': 'Politique: {policy}',
  'composerWeb.review.approverPending': 'En attendant une décision de {approver}.',
  'composerWeb.review.approverNone': 'Aucune approbation n’est requise pour ces objectifs.',
  'composerWeb.review.perTargetHeading': 'Ce que chaque compte reçoit',
  'composerWeb.review.finalUrl': 'Lien publié',
  'composerWeb.review.privacyState': 'Public: {value}',
  'composerWeb.review.disclosureState': 'Divulgation: {value}',
  'composerWeb.review.disclosureNone': 'Aucun ensemble de divulgation',
  'composerWeb.review.mediaVersion': '{name}, version {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# cible ne peut pas encore être planifiée} many {# cibles ne peuvent pas encore être planifiées} other {# cibles ne peuvent pas encore être planifiées}}',
  'composerWeb.review.offlineBlocked':
    'La planification et la publication nécessitent une connexion. Votre brouillon est en sécurité sur cet appareil.',
  'composerWeb.review.publishConfirm':
    'Ceci publie à {count, plural, one {# compte} many {# comptes} other {# comptes}} tout de suite. Cela ne peut pas être annulé à partir d’ici.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Nouveau brouillon',
  'composerWeb.page.loading': 'Chargement du draft, de ses cibles et de leurs limites',
  'composerWeb.page.errorTitle': "Ce brouillon n'a pas pu être ouvert",
  'composerWeb.page.errorBody':
    "Rien n'a été perdu. Réessayez, et si l'échec persiste, la référence ci-dessous aide l'assistance à trouver la demande.",
  'composerWeb.page.noConnectionsTitle': 'Connectez un compte avant de composer',
  'composerWeb.page.noConnectionsBody':
    "Un brouillon nécessite au moins un compte connecté donc Relay connaît les limites, l'aperçu et les paramètres à afficher.",
  'composerWeb.page.noConnectionsExample':
    'Exemple : avec X et LinkedIn connectés, un brouillon devient deux versions natives avec leurs propres compteurs.',
  'composerWeb.page.permissionTitle':
    'Vous ne pouvez pas créer de publications dans cet espace de travail',
  'composerWeb.page.permissionBody':
    "La composition nécessite le rôle d'éditeur ou supérieur. Un propriétaire ou un administrateur peut modifier votre rôle.",
  'composerWeb.page.rateLimitTitle': 'Trop de brouillons sauvegardés en peu de temps',
  'composerWeb.page.rateLimitCause':
    "Cet espace de travail a atteint sa limite d'écriture pour la fenêtre actuelle. Votre texte est conservé sur cet appareil entre-temps.",
  'composerWeb.page.rateLimitAlternative':
    "Continuez à écrire. L'enregistrement reprend automatiquement lorsque la fenêtre est réinitialisée.",

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Grille',
  'mediaLib.view.list': 'Liste',
  'mediaLib.view.label': 'Mise en page',
  'mediaLib.sort.label': 'Trier',
  'mediaLib.sort.newest': 'Le plus récent en premier',
  'mediaLib.sort.name': 'Nom',
  'mediaLib.sort.size': 'Le plus grand en premier',
  'mediaLib.select': 'Sélectionner {name}',
  'mediaLib.column.file': 'Déposer',
  'mediaLib.column.type': 'Taper',
  'mediaLib.column.size': 'Taille',
  'mediaLib.column.altText': 'Texte alternatif',
  'mediaLib.column.rights': 'Droits',
  'mediaLib.column.added': 'Ajouté',
  'mediaLib.openDetail': 'Ouvrir {name}',

  'mediaLib.empty.title': 'Pas encore de média',
  'mediaLib.empty.body':
    "Téléchargez les images et les vidéos que vous possédez déjà ou importez un fichier à partir d'une URL. Relay vérifie le type et la taille par rapport à chaque compte sur lequel vous publiez.",
  'mediaLib.empty.example':
    'Exemple : launch_hero.jpg, 1 600 x 900, texte alt défini, utilisé dans 2 articles.',
  'mediaLib.error.title': "La bibliothèque n'a pas pu être chargée",
  'mediaLib.error.body': "Vos fichiers sont en sécurité. Cet échec n'a rien changé.",
  'mediaLib.loading': 'Chargement de votre médiathèque',
  'mediaLib.permission.title': "Vous ne pouvez pas voir cette bibliothèque d'espace de travail",
  'mediaLib.permission.body':
    "La visualisation des médias nécessite le rôle de téléspectateur ou supérieur sur cette marque. Un propriétaire ou un administrateur peut l'accorder.",

  'mediaLib.upload.heading': 'Ajouter un média',
  'mediaLib.upload.browse': 'Choisir des fichiers',
  'mediaLib.upload.dropHint':
    'Faites glisser les fichiers ici ou choisissez-les. Les téléchargements reprennent si la connexion est interrompue.',
  'mediaLib.upload.queueHeading': 'Téléchargements',
  'mediaLib.upload.progress': '{name}, {percent} de {size} envoyé',
  'mediaLib.upload.paused': 'En pause. {sent} de {size} est déjà stocké.',
  'mediaLib.upload.resume': 'Reprendre le téléchargement',
  'mediaLib.upload.pause': 'Suspendre le téléchargement',
  'mediaLib.upload.cancel': 'Annuler ce téléchargement',
  'mediaLib.upload.retry': 'Essayez à nouveau ce téléchargement',
  'mediaLib.upload.finalizing': 'Finition {name}',
  'mediaLib.upload.done': '{name} est dans votre bibliothèque',
  'mediaLib.upload.failed': "{name} n'a pas fini. {reason}",
  'mediaLib.upload.offline':
    'Hors ligne. Les téléchargements reprennent là où ils se sont arrêtés lorsque vous vous reconnectez.',
  'mediaLib.upload.rejectedType':
    "{name} est {mimeType}, qu'aucun de vos comptes sélectionnés n'accepte.",
  'mediaLib.upload.rejectedSize':
    '{name} est {size}. La limite la plus basse pour vos comptes est {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Accepté par # de vos comptes} many {Accepté par # de vos comptes} other {Accepté par # de vos comptes}}',
  'mediaLib.upload.rejectedBy': 'Non accepté par {accounts}',
  'mediaLib.upload.checkedAgainst': 'Vérifié par rapport aux comptes sélectionnés dans ce projet.',
  'mediaLib.upload.noTargets':
    "Aucun compte n'est sélectionné, le fichier est donc vérifié uniquement par rapport aux valeurs par défaut de l'espace de travail.",

  'mediaLib.alt.heading': 'Texte alternatif',
  'mediaLib.alt.help':
    'Décrivez ce qui compte dans l’image pour quelqu’un qui ne peut pas la voir. Une ou deux phrases suffisent généralement.',
  'mediaLib.alt.count': '{used} de {limit} personnages',
  'mediaLib.alt.requiredBy': 'Requis par {accounts}',
  'mediaLib.alt.waive': 'Cette image ne contient aucune information',
  'mediaLib.alt.waiveReason': "Pourquoi il n'a pas besoin de description",
  'mediaLib.alt.waiveHelp':
    'Utilisez-le uniquement pour la décoration. Une image abandonnée est publiée avec une description vide là où la plateforme le permet.',
  'mediaLib.alt.waived': 'Renoncé par {name} sur {date}. Raison: {reason}',
  'mediaLib.alt.unsupported':
    "{provider} n'accepte pas le texte alternatif via son API pour ce compte.",
  'mediaLib.alt.missingCount':
    "{count, plural, one {# le fichier n'a pas de texte alternatif} many {# fichiers n'ont pas de texte alternatif} other {# fichiers n'ont pas de texte alternatif}}",

  'mediaLib.rights.heading': 'Droits et consentement',
  'mediaLib.rights.declared': 'Déclaré par {name} sur {date}',
  'mediaLib.rights.undeclared':
    'Pas encore déclaré. Déclarez-le avant la publication de ce fichier.',
  'mediaLib.rights.ownerLabel': 'À qui appartient ce fichier',
  'mediaLib.rights.ownerSelf': 'Cet espace de travail',
  'mediaLib.rights.ownerLicensed': "Licence de quelqu'un d'autre",
  'mediaLib.rights.ownerUgc': 'Un client ou un créateur a donné son autorisation',
  'mediaLib.rights.licenseLabel': "Référence de licence ou d'autorisation",
  'mediaLib.rights.peopleLabel': 'Des personnes apparaissent dans ce fichier',
  'mediaLib.rights.peopleConsent': "Toutes les personnes présentées ont accepté d'être publiées",
  'mediaLib.rights.musicLabel': 'Ce fichier contient de la musique ou une bande-son',
  'mediaLib.rights.confirm':
    "J'ai le droit de publier ce fichier, y compris toutes les personnes, musiques, logos et marques qu'il contient.",
  'mediaLib.rights.blocking':
    'Ce fichier ne peut être planifié que lorsque les droits sont déclarés.',

  'mediaLib.editor.heading': "Modifier l'image",
  'mediaLib.editor.description':
    'Chaque modification est enregistrée en tant que nouvelle version. Le fichier original est conservé et peut être restauré.',
  'mediaLib.editor.tab.crop': 'Recadrer',
  'mediaLib.editor.tab.transform': 'Redimensionner et faire pivoter',
  'mediaLib.editor.tab.canvas': 'Toile',
  'mediaLib.editor.tab.output': 'Format et taille',
  'mediaLib.editor.tab.thumbnail': 'Vignette',
  'mediaLib.editor.presetLabel': 'Aspect prédéfini',
  'mediaLib.editor.presetFree': 'Gratuit',
  'mediaLib.editor.presetFor': '{ratio}, utilisé par {accounts}',
  'mediaLib.editor.cropX': 'Recadrer à partir du bord de départ',
  'mediaLib.editor.cropY': 'Recadrer par le haut',
  'mediaLib.editor.cropWidth': 'Largeur de culture',
  'mediaLib.editor.cropHeight': 'Hauteur de culture',
  'mediaLib.editor.cropKeyboardHint':
    'La zone de recadrage est définie avec des champs numériques, elle fonctionne donc entièrement à partir du clavier.',
  'mediaLib.editor.widthLabel': 'Largeur en pixels',
  'mediaLib.editor.heightLabel': 'Hauteur en pixels',
  'mediaLib.editor.lockRatio': 'Conserver le ratio actuel',
  'mediaLib.editor.rotateLabel': 'Rotation',
  'mediaLib.editor.rotateDegrees': '{degrees} degrés',
  'mediaLib.editor.flipHorizontal': "Retourner sur l'axe vertical",
  'mediaLib.editor.flipVertical': "Retourner sur l'axe horizontal",
  'mediaLib.editor.canvasColor': 'Couleur de fond',
  'mediaLib.editor.canvasFit': "Comment l'image se trouve sur la toile",
  'mediaLib.editor.canvasFitCover': 'Remplissez la toile et recadrez le trop-plein',
  'mediaLib.editor.canvasFitContain': "Ajustez toute l'image et complétez le reste",
  'mediaLib.editor.formatLabel': 'Format de sortie',
  'mediaLib.editor.qualityLabel': 'Qualité de compression',
  'mediaLib.editor.qualityValue': '{value} de 100',
  'mediaLib.editor.estimatedSize': 'Production estimée {size}, depuis {original}',
  'mediaLib.editor.estimatedSizeUnknown':
    "La taille de sortie n'est connue qu'une fois le fichier traité.",
  'mediaLib.editor.thumbnailHelp':
    "Choisissez l'image ou le fichier utilisé comme vignette vidéo là où la plateforme en accepte une.",
  'mediaLib.editor.thumbnailFrame': 'Cadre à {time}',
  'mediaLib.editor.save': 'Enregistrer en tant que nouvelle version',
  'mediaLib.editor.saving': 'Sauvegarde de la version {version}',
  'mediaLib.editor.saved': "Version {version} enregistré. L'original est toujours là.",
  'mediaLib.editor.discard': 'Ignorer ces modifications',
  'mediaLib.editor.noChanges': "Aucune modification à enregistrer pour l'instant.",
  'mediaLib.editor.revalidate':
    "L'enregistrement revérifie ce fichier par rapport à chaque compte dans les brouillons qui l'utilisent.",
  'mediaLib.editor.noGeneration':
    'Cet éditeur modifie le fichier que vous avez téléchargé. Cela ne crée pas de nouvelles images.',

  'mediaLib.versions.heading': 'Versions',
  'mediaLib.versions.original': 'Téléchargement original',
  'mediaLib.versions.current': 'Version actuelle',
  'mediaLib.versions.restore': 'Restaurer la version {version}',
  'mediaLib.versions.item': 'Version {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': "D'où vient ce fichier",
  'mediaLib.provenance.sourceUrl': 'URL source',
  'mediaLib.provenance.fetchedAt': 'Récupéré {date}',
  'mediaLib.provenance.declaredAuthor': 'Auteur déclaré',
  'mediaLib.provenance.declaredLicense': 'Licence déclarée',
  'mediaLib.provenance.contentCredentials': "Informations d'identification du contenu intégré",
  'mediaLib.provenance.contentCredentialsNone':
    "Ce fichier ne contient aucune information d'identification de contenu intégré. C’est courant et cela ne veut pas dire que quelque chose ne va pas.",
  'mediaLib.provenance.unverified':
    'Ces détails proviennent de la source et non de Relay. Vérifiez-les avant de vous y fier.',

  'mediaLib.picker.title': 'Choisissez un média',
  'mediaLib.picker.description':
    'Les fichiers sont vérifiés par rapport aux comptes sélectionnés dans ce projet.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Choisir des fichiers} one {Ajouter # fichier} many {Ajouter # fichiers} other {Ajouter # fichiers}}',
  'mediaLib.picker.forMaster': 'Ajout au brouillon principal',
  'mediaLib.picker.forVariant': 'Ajout à la version pour {account} seulement',
} as const;
