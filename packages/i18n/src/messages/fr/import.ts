export const importMessages = {
  'import.title': 'Importer des publications depuis un CSV',
  'import.subtitle':
    'Téléversez une feuille de calcul, voyez ce qu\'elle fera, puis décidez. Le téléversement ne fait que vérifier le fichier. Il ne crée rien.',

  'import.step.upload': 'Téléverser',
  'import.step.columns': 'Colonnes',
  'import.step.review': 'Vérifier',
  'import.step.apply': 'Appliquer',
  'import.step.results': 'Résultats',
  'import.step.position': 'Étape {current} sur {total}',

  'import.upload.heading': 'Choisissez un fichier CSV',
  'import.upload.help':
    'CSV uniquement. Les fichiers de feuille de calcul comme .xlsx ne sont pas lus. Exportez d\'abord votre feuille en CSV.',
  'import.upload.field': 'Fichier CSV',
  'import.upload.fieldHelp': 'Sélectionnez un fichier, ou collez les lignes dans la zone ci-dessous.',
  'import.upload.paste': 'Ou collez le texte CSV',
  'import.upload.pasteHelp': 'Incluez la ligne d\'en-tête. Tout est vérifié avant que quoi que ce soit soit créé.',
  'import.upload.project': 'Projet',
  'import.upload.projectHelp': 'Chaque ligne d\'un fichier appartient à ce projet.',
  'import.upload.submit': 'Vérifier ce fichier',
  'import.upload.submitting': 'Lecture du fichier',
  'import.upload.allowPast': 'Autoriser les horaires déjà passés',
  'import.upload.allowPastHelp':
    'Désactivé par défaut. Une ligne datée dans le passé est signalée pour que vous la corrigiez, plutôt que d\'être déplacée pour vous.',
  'import.upload.tooLarge': 'Ce fichier dépasse {limit} caractères. Divisez-le et réessayez.',
  'import.upload.duplicate':
    'C\'est le même fichier que vous avez téléversé avant, vous regardez donc cet import plutôt qu\'une seconde copie.',

  'import.template.heading': 'Ce que signifient les colonnes',
  'import.template.download': 'Télécharger un modèle CSV',
  'import.template.required': 'Colonnes obligatoires',
  'import.template.optional': 'Colonnes facultatives',
  'import.column.external_row_id': 'Votre propre identifiant pour la ligne. Doit être unique dans le fichier.',
  'import.column.project': 'Le nom ou l\'identifiant du projet auquel appartient la ligne.',
  'import.column.targets':
    'Soit set: suivi d\'un identifiant de jeu de comptes, soit des identifiants de compte séparés par une barre verticale.',
  'import.column.caption': 'Le texte de la publication.',
  'import.column.scheduled_local_time': 'Date et heure locales, écrites comme 2026-09-01T10:00.',
  'import.column.time_zone': 'Le fuseau IANA dans lequel cette heure locale est lue, par exemple Europe/Berlin.',
  'import.column.media':
    'Un identifiant de média, sha256: suivi de la somme de contrôle d\'un média que vous avez déjà, ou une adresse https à récupérer par le serveur.',
  'import.column.title': 'Un titre, là où la destination en utilise un.',
  'import.column.destination': 'La page, le tableau ou le canal à l\'intérieur du compte.',
  'import.column.privacy': 'La valeur de confidentialité attendue par la destination.',
  'import.column.first_comment': 'Texte publié comme premier commentaire après la publication.',
  'import.column.approval_policy': 'La politique d\'approbation à associer à chaque brouillon.',
  'import.column.perPlatform':
    'Une colonne caption_ ou title_ nommée d\'après une plateforme ne remplace que cette plateforme, par exemple caption_instagram.',

  'import.columns.heading': 'Vérification des colonnes',
  'import.columns.ok': 'Chaque colonne obligatoire est présente.',
  'import.columns.missing':
    '{count, plural, one {# colonne obligatoire manque} many {# colonnes obligatoires manquent} other {# colonnes obligatoires manquent}}',
  'import.columns.unknown':
    '{count, plural, one {# colonne n\'a pas été reconnue et est ignorée} many {# colonnes n\'ont pas été reconnues et sont ignorées} other {# colonnes n\'ont pas été reconnues et sont ignorées}}',
  'import.columns.present': 'Colonnes trouvées',

  'import.review.heading': 'Ce que ce fichier va faire',
  'import.review.counts':
    '{valid, plural, =0 {Aucune ligne n\'est prête} one {# ligne est prête} many {# lignes sont prêtes} other {# lignes sont prêtes}}, {invalid, plural, =0 {aucune ne nécessite d\'attention} one {# nécessite une attention} many {# nécessitent une attention} other {# nécessitent une attention}}.',
  'import.review.empty': 'Aucune ligne n\'a été lue dans ce fichier.',
  'import.review.rowsHeading': 'Lignes',
  'import.review.filterAll': 'Toutes les lignes',
  'import.review.filterValid': 'Prêtes',
  'import.review.filterInvalid': 'Nécessitent une attention',
  'import.review.filterFailed': 'Échouées',
  'import.review.downloadErrors': 'Télécharger les problèmes en CSV',
  'import.review.parsedWith': 'Lu avec l\'analyseur {version}',

  'import.table.row': 'Identifiant de ligne',
  'import.table.line': 'Ligne',
  'import.table.state': 'État',
  'import.table.caption': 'Légende',
  'import.table.time': 'Planifié',
  'import.table.problems': 'Problèmes',
  'import.table.draft': 'Brouillon',
  'import.table.noProblems': 'Aucun',

  'import.state.pending': 'Non vérifié',
  'import.state.valid': 'Prête',
  'import.state.invalid': 'Nécessite une attention',
  'import.state.applied': 'Brouillon créé',
  'import.state.skipped': 'Déjà fait',
  'import.state.failed': 'Échoué',

  'import.job.state.uploaded': 'Téléversé',
  'import.job.state.validating': 'Vérification en cours',
  'import.job.state.validated': 'Vérifié',
  'import.job.state.applying': 'Application en cours',
  'import.job.state.applied': 'Appliqué',
  'import.job.state.failed': 'N\'a pas pu être lu',

  'import.apply.heading': 'Que faire des lignes qui sont prêtes ?',
  'import.apply.drafts': 'Créer des brouillons',
  'import.apply.draftsHelp':
    'Par défaut. Chaque ligne prête devient un brouillon que vous pouvez ouvrir, modifier et approuver. Rien n\'est planifié.',
  'import.apply.scheduled': 'Créer des brouillons et les planifier',
  'import.apply.scheduledHelp':
    'Chaque ligne prête devient un brouillon et prend l\'horaire écrit dans le fichier. Choisissez ceci seulement si les horaires sont corrects.',
  'import.apply.confirm': 'Appliquer {count, plural, one {# ligne} many {# lignes} other {# lignes}}',
  'import.apply.confirmScheduled':
    'Créer et planifier {count, plural, one {# ligne} many {# lignes} other {# lignes}}',
  'import.apply.running': 'Application des lignes',
  'import.apply.safeToRepeat':
    'Appliquer deux fois est sûr. Une ligne qui a déjà créé un brouillon est laissée telle quelle.',

  'import.results.heading': 'Résultats',
  'import.results.applied': '{count, plural, one {# brouillon créé} many {# brouillons créés} other {# brouillons créés}}',
  'import.results.skipped':
    '{count, plural, one {# ligne était déjà faite} many {# lignes étaient déjà faites} other {# lignes étaient déjà faites}}',
  'import.results.failed': '{count, plural, one {# ligne a échoué} many {# lignes ont échoué} other {# lignes ont échoué}}',
  'import.results.retry': 'Réappliquer les lignes restantes',
  'import.results.openDrafts': 'Ouvrir les brouillons',
  'import.results.unavailable': 'indisponible',

  'import.history.heading': 'Imports précédents',
  'import.history.empty': 'Pas encore d\'imports.',
  'import.history.open': 'Ouvrir',

  'import.a11y.rowsTable': 'Lignes du manifeste et leurs problèmes',
  'import.a11y.stepList': 'Étapes de l\'import',
  'import.a11y.uploadedFile': 'Fichier sélectionné : {filename}',

  'import.error.emptyFile': 'Ce fichier n\'a aucune ligne.',
  'import.error.missingColumn': 'La colonne {column} manque.',
  'import.error.unknownColumn': 'La colonne {column} n\'a pas été reconnue, elle est donc ignorée.',
  'import.error.duplicateRowId': 'L\'identifiant de ligne {value} est utilisé plus d\'une fois dans ce fichier.',
  'import.error.required': 'Cette cellule ne peut pas être vide.',
  'import.error.invalidCell': 'Cette cellule n\'a pas un format que nous pouvons lire.',
  'import.error.rowShape': 'Cette ligne a {actual} cellules mais l\'en-tête en a {expected}.',
  'import.error.invalidLocalTime':
    'L\'heure {value} n\'est pas une date et heure locales comme 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'Le fuseau {value} n\'est pas un nom de fuseau horaire IANA.',
  'import.error.nonexistentLocalTime':
    'L\'heure {value} n\'existe pas en {zone}. Les horloges la sautent.',
  'import.error.ambiguousLocalTime':
    'L\'heure {value} se produit deux fois en {zone} ce jour-là. Choisissez une heure différente.',
  'import.error.scheduleInPast': 'L\'heure {value} en {zone} est déjà passée.',
  'import.error.invalidTargets':
    'La valeur {value} n\'est ni un jeu de comptes enregistré ni une liste d\'identifiants de compte.',
  'import.error.invalidMedia':
    'La valeur {value} n\'est ni un identifiant de média, ni une somme de contrôle sha256, ni une adresse https.',
  'import.error.mediaNotFound': 'Aucun média dans ce workspace ne correspond à {value}.',
  'import.error.mediaImportStarted':
    'Le média à {value} est en cours de récupération. Réappliquez ce fichier une fois qu\'il est dans la bibliothèque.',
  'import.error.unknownVariantTarget':
    'Cette ligne n\'a pas de compte {provider}, la légende {provider} n\'a donc pas été utilisée.',
  'import.error.applyFailed': 'Cette ligne n\'a pas pu être appliquée. Référence : {code}.',
  'import.error.alreadyApplied': 'Cette ligne a déjà créé un brouillon, elle a donc été laissée telle quelle.',
  'import.error.tooManyRows': 'Seules les {limit} premières lignes d\'un fichier sont lues.',
} as const;
