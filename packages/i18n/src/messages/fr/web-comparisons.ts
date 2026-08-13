export const webComparisonMessages = {
  'web.comparison.eyebrow': 'Comparaison',

  'web.comparison.state.yes': 'Oui',
  'web.comparison.state.no': 'Non',
  'web.comparison.state.partial': 'En partie',
  'web.comparison.state.notVerified': 'Non vérifié',

  'web.comparison.label.claim': 'Affirmation',
  'web.comparison.label.sourceRead': 'Lu le {date}',
  'web.comparison.label.checked': 'Chaque ligne vérifiée le {date}',
  'web.comparison.label.nextReview': 'Prochaine vérification prévue le {date}',
  'web.comparison.label.backToIndex': 'Toutes les comparaisons',

  'web.comparison.table.title': 'Ce que fait chaque option',
  'web.comparison.table.caption': 'Une affirmation par ligne, avec la source derrière chaque réponse',

  'web.comparison.bestFor.title': 'Laquelle convient',
  'web.comparison.bestFor.ours': 'Choisissez ce produit quand',
  'web.comparison.bestFor.alternative': 'Choisissez {name} quand',

  'web.comparison.notDo.title': 'Ce que ce produit ne fait pas',
  'web.comparison.notDo.body':
    'Ces phrases sont lues depuis le code qui les décide, pas écrites à la main, donc cette section ne peut pas s\'éloigner de ce qu\'est réellement le produit aujourd\'hui.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {Aucun connecteur n\'a terminé la vérification du fournisseur, rien n\'est donc publié sur aucune plateforme via ce produit aujourd\'hui.} one {# connecteur a terminé la vérification du fournisseur. Toute autre plateforme du groupe reste une intention.} many {# connecteurs ont terminé la vérification du fournisseur. Toute autre plateforme du groupe reste une intention.} other {# connecteurs ont terminé la vérification du fournisseur. Toute autre plateforme du groupe reste une intention.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {Aucune langue n\'a terminé la révision humaine, chaque langue de l\'interface est donc étiquetée bêta.} one {# langue a terminé la révision humaine. Toute autre langue est étiquetée bêta.} many {# langues ont terminé la révision humaine. Toute autre langue est étiquetée bêta.} other {# langues ont terminé la révision humaine. Toute autre langue est étiquetée bêta.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Chaque palier tarifaire a été décidé et porte un vrai prix.} one {# palier tarifaire reste un espace réservé non décidé et ne peut pas être acheté.} many {# paliers tarifaires restent des espaces réservés non décidés et ne peuvent pas être achetés.} other {# paliers tarifaires restent des espaces réservés non décidés et ne peuvent pas être achetés.}}',

  'web.comparison.notVerified.title': 'Ce que signifie "non vérifié"',
  'web.comparison.notVerified.body':
    'Une cellule dit non vérifié quand le fait n\'a pas pu être lu dans la documentation publique officielle de l\'autre option le jour de la vérification. Elle n\'est jamais remplie de mémoire, ni copiée d\'un résumé écrit par quelqu\'un d\'autre.',

  'web.comparison.method.title': 'Comment cette page est réalisée',
  'web.comparison.method.body':
    'Chaque ligne est une affirmation, avec le document dont elle provient et la date à laquelle une personne l\'a lu. Il n\'y a pas de captures d\'écran de concurrents, pas de texte de fonctionnalité copié et pas de faiblesses inventées.',
  'web.comparison.method.cadence':
    'Chaque comparaison est revérifiée au moins tous les 90 jours, et immédiatement quand une plateforme ou une option change quelque chose qu\'une ligne affirme.',

  'web.comparison.questions.title': 'Questions',
  'web.comparison.sources.title': 'Sources citées sur cette page',

  'web.comparison.index.title': 'Comparaisons publiées',
  'web.comparison.index.body':
    'Chaque page compare ce produit à une catégorie d\'alternative dont les faits peuvent être lus dans la documentation officielle. Un produit nommé obtient une page quand ses faits actuels peuvent être lus sur ses propres pages publiques, et pas avant.',
  'web.comparison.index.checked': 'Vérifié le {date}',
} as const;
