export const webUseCaseMessages = {
  /* ---------------------------------------------------------------------- */
  /* Métadonnées                                                            */
  /* ---------------------------------------------------------------------- */

  'web.meta.useCases.title': "Cas d'usage",
  'web.meta.useCases.description':
    "Trois flux de travail pour lesquels ce produit est construit : gérer plusieurs clients au même endroit, faire approuver le travail avant qu'il ne sorte, et porter une idée sur plusieurs plateformes sans la réécrire.",
  'web.meta.useCase.clients.title': 'Gestion de plusieurs clients',
  'web.meta.useCase.clients.description':
    "Projets séparés, comptes connectés séparés, approbations séparées et rapports séparés, pour les équipes qui publient au nom d'autres personnes.",
  'web.meta.useCase.approvals.title': "Flux d'approbation",
  'web.meta.useCase.approvals.description':
    "Comment un brouillon devient une publication approuvée : qui la révise, qu'est-ce qui invalide une approbation, et pourquoi la même règle tient sur chaque surface.",
  'web.meta.useCase.crossPlatform.title': 'Publication multiplateforme',
  'web.meta.useCase.crossPlatform.description':
    'Un brouillon maître, une version adaptée par plateforme, validée par rapport aux limites enregistrées de chaque plateforme avant que quoi que ce soit soit planifié.',

  /* ---------------------------------------------------------------------- */
  /* Éléments partagés                                                      */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': "Cas d'usage",
  'web.useCases.index.lede':
    "Trois flux de travail pour lesquels ce produit est construit. Chaque page indique ce que ce flux coûte à une équipe aujourd'hui, comment le produit est conçu pour le gérer, et quelles parties sont réellement construites.",
  'web.useCases.index.listLabel': "Cas d'usage",

  'web.useCases.notice.title': 'Ceci décrit une conception, pas un service en fonctionnement',
  'web.useCases.notice.body':
    "Aucun connecteur n'est vérifié en production, rien sur cette page ne publie donc encore nulle part. Là où une partie du flux est construite, la page le dit. Là où elle ne l'est pas, elle le dit aussi.",

  'web.useCases.section.problem': 'Le problème',
  'web.useCases.section.approach': 'Comment le produit est conçu',
  'web.useCases.section.today': 'Ce qui est réellement construit',
  'web.useCases.section.related': 'Connexes',

  /* ---------------------------------------------------------------------- */
  /* Gestion de plusieurs clients                                           */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': 'Gestion de plusieurs clients',
  'web.useCases.clients.lede':
    "Le travail d'un client ne devrait jamais être à un mauvais clic de l'audience d'un autre client.",
  'web.useCases.clients.problem':
    "La plupart des équipes séparent les clients en faisant attention. Un compte partagé contient chaque page connectée, un calendrier contient chaque planning, et la seule chose qui sépare un brouillon d'un client de la mauvaise audience est la personne qui regarde l'écran à 18h. Quand quelqu'un quitte l'équipe, la séparation part avec l'habitude.",
  'web.useCases.clients.approach1':
    "Un projet est l'unité de séparation. Les comptes connectés, brouillons, files, médias et reçus appartiennent à un projet, et un membre ne voit que les projets auxquels il a été ajouté.",
  'web.useCases.clients.approach2':
    "La séparation est appliquée trois fois : à l'authentification, dans le service applicatif qui autorise l'action, et dans la base de données elle-même via la sécurité au niveau des lignes. Être connecté n'est jamais traité comme une permission.",
  'web.useCases.clients.approach3':
    "Les rapports suivent la même frontière, un rapport par client est donc la forme par défaut plutôt qu'une feuille de calcul assemblée à la main par quelqu'un.",
  'web.useCases.clients.today':
    "Les projets, l'appartenance restreinte au projet et les politiques de sécurité au niveau des lignes derrière elles sont construits et testés, y compris des tests qui tentent des lectures inter-projets et vérifient qu'ils échouent. Les forfaits sont dimensionnés selon le nombre de projets dont une équipe a besoin. Rien n'est encore publié sur aucune plateforme depuis aucun projet.",

  /* ---------------------------------------------------------------------- */
  /* Flux d'approbation                                                     */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': "Flux d'approbation",
  'web.useCases.approvals.lede':
    'Une approbation ne vaut quelque chose que si ce qui est approuvé est ce qui sort.',
  'web.useCases.approvals.problem':
    "Les approbations vivent généralement en dehors de l'outil qui publie. Une capture d'écran part vers un client, le client répond oui, puis le texte change. L'approbation renvoie maintenant à un brouillon que personne n'a, et l'outil n'en sait rien, il publie donc ce qui lui a été donné en dernier.",
  'web.useCases.approvals.approach1':
    "Une approbation est attachée exactement au contenu qui a été révisé. Modifier un brouillon approuvé invalide l'approbation et indique quel champ a changé, plutôt que de faire tacitement perdurer l'ancienne décision.",
  'web.useCases.approvals.approach2':
    "Un réviseur peut approuver, demander des modifications ou rejeter, et un commentaire est requis pour tout sauf l'approbation, l'auteur n'est donc jamais laissé à deviner quoi corriger.",
  'web.useCases.approvals.approach3':
    "La règle vit dans la couche applicative partagée, l'application web, l'API REST, le serveur MCP, la CLI et les webhooks lui obéissent donc tous. Aucune surface n'a de raccourci pour contourner la révision.",
  'web.useCases.approvals.today':
    "Les états d'approbation, la surface de révision, les règles de réapprobation et les événements d'audit derrière eux sont construits. Ce qui n'est pas construit est la dernière étape, parce qu'aucun connecteur n'a atteint sa définition de fait, une publication approuvée n'a donc encore nulle part où aller.",

  /* ---------------------------------------------------------------------- */
  /* Publication multiplateforme                                          */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': 'Publication multiplateforme',
  'web.useCases.crossPlatform.lede':
    'Une idée, une modification, et une version par plateforme qui respecte ce que cette plateforme accepte réellement.',
  'web.useCases.crossPlatform.problem':
    "Publier le même texte partout produit une version qui est tronquée sur une plateforme, qui manque un titre obligatoire sur une autre, et qui porte un lien qu'une troisième supprime silencieusement. L'alternative, réécrire à la main cinq fois, est où le travail va réellement.",
  'web.useCases.crossPlatform.approach1':
    "Un brouillon maître contient l'idée. Chaque compte sélectionné obtient sa propre version, et une modification du maître ne s'applique que là où elle convient, en disant clairement quelles cibles n'ont pas pu la recevoir et pourquoi.",
  'web.useCases.crossPlatform.approach2':
    "La validation s'exécute par rapport aux limites enregistrées de chaque plateforme, comptées comme cette plateforme compte, un plafond de caractères est donc vérifié en graphèmes là où la plateforme utilise des graphèmes et en unités pondérées là où elle utilise celles-ci.",
  'web.useCases.crossPlatform.approach3':
    "Chaque limite de plateforme montrée n'importe où sur ce site est générée à partir du registre des connecteurs et porte le document dont elle provient et la date à laquelle une personne l'a lu.",
  'web.useCases.crossPlatform.today':
    "Le compositeur, les versions par cible, les règles de validation et le jeu de données de limites généré sont construits. L'étape de publication ne l'est pas : aucun connecteur n'est vérifié en production, un brouillon validé peut donc être planifié en interne et ne peut pas atteindre une plateforme.",
} as const;
