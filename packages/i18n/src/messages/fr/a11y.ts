/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Navigation principale',
  'a11y.region.main': 'Contenu principal',
  'a11y.region.composer': 'Composer',
  'a11y.region.preview': 'Aperçu',
  'a11y.region.validation': 'Problèmes de validation',
  'a11y.region.targets': 'Comptes cibles',
  'a11y.region.notifications': 'Notifications',

  'a11y.announce.saved': 'Brouillon enregistré',
  'a11y.announce.saving': 'Enregistrer le brouillon',
  'a11y.announce.saveFailed':
    "Le brouillon n'a pas pu être enregistré. Votre texte est toujours là.",
  'a11y.announce.offline':
    'Vous êtes hors ligne. Les modifications sont conservées sur cet appareil.',
  'a11y.announce.online': 'De retour en ligne',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Aucun problème de validation} one {# problème de validation} many {# problèmes de validation} other {# problèmes de validation}}',
  'a11y.announce.validationCleared': 'Tous les problèmes de validation résolus',
  'a11y.announce.targetSelected':
    '{account} choisi. {count, plural, one {# cible} many {# cibles} other {# cibles}} en tout.',
  'a11y.announce.targetOverridden': '{account} a maintenant sa propre version',
  'a11y.announce.targetReset': '{account} réinitialiser le brouillon principal',
  'a11y.announce.uploadProgress': '{name}, {percent} téléchargé',
  'a11y.announce.uploadComplete': '{name} téléchargé',
  'a11y.announce.uploadFailed': '{name} échec du téléchargement',
  'a11y.announce.scheduled': 'Prévu pour {time} dans {timeZone}',
  'a11y.announce.rescheduled': 'Déplacé vers {time} dans {timeZone}',
  'a11y.announce.publishing': 'Édition',
  'a11y.announce.published':
    '{count, plural, one {Publié sur # compte} many {Publié sur # comptes} other {Publié sur # comptes}}',
  'a11y.announce.publishPartial':
    'Publié sur {published} de {total} comptes. {failed, plural, one {# compte nécessite votre attention} many {# comptes nécessitent une attention particulière} other {# comptes nécessitent une attention particulière}}.',
  'a11y.announce.publishFailed': 'La publication a échoué. Votre contenu est préservé.',
  'a11y.announce.approvalRequested': 'Approbation demandée à {approver}',
  'a11y.announce.approved': 'Approuvé',
  'a11y.announce.connectionAdded': '{account} connecté',
  'a11y.announce.connectionRemoved': '{account} déconnecté',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Filtres effacés} one {# filtre appliqué} many {# filtres appliqués} other {# filtres appliqués}}, {results, plural, one {# résultat} many {# résultats} other {# résultats}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Copié dans le presse-papiers',
  'a11y.announce.suggestionApplied': 'Suggestion appliquée',
  'a11y.announce.suggestionRejected': 'Suggestion rejetée',

  'a11y.label.closeDialog': 'Fermer la boîte de dialogue',
  'a11y.label.openMenu': 'Ouvrir le menu',
  'a11y.label.sortBy': 'Trier par {field}',
  'a11y.label.sortAscending': 'Trié par ordre croissant',
  'a11y.label.sortDescending': 'Trié par ordre décroissant',
  'a11y.label.removeTarget': 'Retirer {account} des cibles',
  'a11y.label.removeMedia': 'Retirer {name}',
  'a11y.label.editAltText': 'Modifier le texte alternatif pour {name}',
  'a11y.label.mediaPreview': 'Aperçu de {name}',
  'a11y.label.playVideo': 'Jouer {name}',
  'a11y.label.pauseVideo': 'Pause {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {rien de prévu} one {# poste} many {# messages} other {# messages}}',
  'a11y.label.postSummary': '{account} sur {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} de {limit} caractères utilisés',
  'a11y.label.requiredField': 'Requis',
  'a11y.label.externalLink': 'Ouvre dans un nouvel onglet',
  'a11y.label.loadingRegion': 'Chargement du contenu',
  'a11y.label.expandRow': 'Afficher les détails de {name}',
  'a11y.label.collapseRow': 'Masquer les détails pour {name}',
  'a11y.languagePicker.label': "Choisir la langue de l'interface",
  'a11y.languagePicker.filterLabel': 'Filtrer les langues',
  'a11y.languagePicker.announceChanged': "La langue de l'interface a été modifiée en {language}",

  'a11y.keyboard.hint.calendar':
    'Utilisez les touches fléchées pour vous déplacer entre les emplacements. Appuyez sur Entrée pour ouvrir un message. Appuyez sur Espace puis sur les touches fléchées pour reprogrammer.',
  'a11y.keyboard.hint.composer':
    'Appuyez sur Contrôle et sur les touches de support pour vous déplacer entre les cibles. Appuyez sur Control et I pour passer au numéro suivant.',
  'a11y.keyboard.hint.dialog': 'Appuyez sur Échap pour fermer.',
  'a11y.keyboard.shortcutsTitle': 'Raccourcis clavier',

  'a11y.table.alternative': 'Vue tableau',
  'a11y.table.alternativeHint': 'Le même horaire qu’une table triable.',
  'a11y.motion.reduced': 'Les animations sont réduites en raison des paramètres de votre système.',
} as const;
