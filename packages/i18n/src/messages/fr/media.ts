export const mediaMessages = {
  // ==================================================== l'éditeur ====
  'mediaLib.derivative.heading': 'Modifier cette image',
  'mediaLib.derivative.description':
    'Recadrez, pivotez, redimensionnez, changez le format ou compressez. Chaque modification agit sur les pixels déjà présents dans votre fichier. Rien n\'est ajouté qui n\'y était pas.',
  'mediaLib.derivative.originalKept':
    'L\'original n\'est jamais remplacé. Chaque modification est enregistrée comme une version distincte que vous pouvez choisir lors de la composition.',
  'mediaLib.derivative.apply': 'Enregistrer cette version',
  'mediaLib.derivative.applying': 'Enregistrement de cette version',
  'mediaLib.derivative.discard': 'Annuler les modifications',
  'mediaLib.derivative.noChanges': 'Rien à enregistrer pour l\'instant. Changez une valeur ci-dessus.',

  'mediaLib.derivative.tab.crop': 'Recadrer',
  'mediaLib.derivative.tab.transform': 'Pivoter et redimensionner',
  'mediaLib.derivative.tab.output': 'Format',

  'mediaLib.derivative.cropHint':
    'Tapez les nombres, ou utilisez les flèches du clavier dans n\'importe quel champ. Aucune étape ici ne nécessite de souris.',
  'mediaLib.derivative.cropX': 'Bord gauche, en pixels',
  'mediaLib.derivative.cropY': 'Bord supérieur, en pixels',
  'mediaLib.derivative.cropWidth': 'Largeur du recadrage, en pixels',
  'mediaLib.derivative.cropHeight': 'Hauteur du recadrage, en pixels',
  'mediaLib.derivative.rotate': 'Pivoter',
  'mediaLib.derivative.rotateNone': 'Aucune rotation',
  'mediaLib.derivative.rotateDegrees': '{degrees} degrés dans le sens horaire',
  'mediaLib.derivative.resizeWidth': 'Nouvelle largeur, en pixels',
  'mediaLib.derivative.resizeHeight': 'Nouvelle hauteur, en pixels',
  'mediaLib.derivative.lockRatio': 'Conserver la forme quand je change un côté',
  'mediaLib.derivative.format': 'Enregistrer sous',
  'mediaLib.derivative.formatSame': 'Conserver le format actuel',
  'mediaLib.derivative.quality': 'Qualité',
  'mediaLib.derivative.qualityHint':
    'Une qualité inférieure donne un fichier plus petit. S\'applique au JPEG et au WebP. Le PNG est sans perte et l\'ignore.',
  'mediaLib.derivative.projected': 'Cette version fera {width} par {height} pixels.',
  'mediaLib.derivative.projectedUnavailable':
    'La taille de cette version n\'est pas disponible tant qu\'elle n\'est pas créée.',

  // ==================================================== la liste des versions ====
  'mediaLib.derivative.listHeading': 'Versions',
  'mediaLib.derivative.original': 'Original',
  'mediaLib.derivative.originalHint': 'Toujours conservé. Jamais écrasé.',
  'mediaLib.derivative.item': '{width} par {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Pas encore de version modifiée. L\'original est le seul fichier ici.',
  'mediaLib.derivative.select': 'Utiliser cette version',
  'mediaLib.derivative.selected': 'Utilisée pour cette publication',
  'mediaLib.derivative.useOriginal': 'Utiliser l\'original',
  'mediaLib.derivative.processing': 'Cette version est en cours de création. Elle apparaîtra ici une fois prête.',
  'mediaLib.derivative.alreadyExists':
    'Vous avez déjà fait exactement cette modification, nous avons donc réutilisé cette version plutôt que d\'en créer une seconde.',
  'mediaLib.derivative.failedTitle': 'Cette version n\'a pas pu être créée',
  'mediaLib.derivative.failedBody':
    'Rien n\'a été enregistré et votre original est intact. Changez les valeurs et réessayez.',
  'mediaLib.derivative.openEditor': 'Modifier {name}',

  'mediaLib.derivative.unsupportedTitle': 'La modification ne fonctionne que sur les images',
  'mediaLib.derivative.unsupportedBody':
    'La vidéo, l\'audio et les documents ne peuvent pas être modifiés ici. Préparez le fichier avant de le téléverser. Votre téléversement original n\'est de toute façon jamais modifié.',

  'mediaLib.derivative.nonGenerative':
    'L\'outil ne génère ni images ni vidéos. Cet éditeur ne fait que recadrer, pivoter, redimensionner, convertir et compresser ce que vous avez téléversé.',

  // ==================================================== refus ====
  'error.media_derivative_no_operations.message': 'Choisissez au moins une modification avant d\'enregistrer une version.',
  'error.media_derivative_duplicate_operation.message':
    'Chaque type de modification ne peut apparaître qu\'une fois. Retirez le second {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Ce recadrage dépasse le bord de l\'image, qui fait {sourceWidth} par {sourceHeight} pixels. Déplacez-le ou réduisez-le.',
  'error.media_derivative_upscale_rejected.message':
    'Cet éditeur n\'agrandit jamais une image, car les pixels supplémentaires seraient inventés plutôt qu\'à vous. La plus grande taille possible pour cette version est {availableWidth} par {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'La modification fonctionne sur les images JPEG, PNG, WebP et GIF. Ce fichier est {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Nous ne connaissons pas encore la taille de cette image, nous ne pouvons donc pas vérifier la modification contre elle. Réessayez une fois le traitement terminé.',
  'error.media_derivative_format_required.message':
    'Choisissez un format pour enregistrer. Un fichier {sourceMimeType} ne peut pas être enregistré tel quel ici.',
  'error.media_derivative_quality_unsupported.message':
    'Le PNG est sans perte, un réglage de qualité ne ferait donc rien. Retirez-le, ou enregistrez en JPEG ou WebP.',
  'error.media_derivative_no_change.message': 'C\'est déjà le format que ce fichier utilise.',
  'error.media_derivative_source_unavailable.message':
    'Le fichier dont cette version proviendrait n\'est plus dans le stockage.',
  'error.media_derivative_preset_mismatch.message':
    'Cette demande de modification ne correspond pas aux changements qu\'elle décrit. Rien n\'a été créé. Réessayez depuis l\'éditeur.',
  'error.media_derivative_empty_result.message':
    'La modification n\'a produit aucune image, rien n\'a donc été enregistré. Votre original est intact.',
  'error.media_derivative_transform_failed.message':
    'Cette image n\'a pas pu être lue ni écrite. Rien n\'a été enregistré et votre original est intact.',
  'error.media_derivative_write_failed.message':
    'Cette version n\'a pas pu être enregistrée. Rien n\'a été enregistré et votre original est intact.',
} as const;
