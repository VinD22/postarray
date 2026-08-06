/**
 * The public marketing site and public documentation surfaces.
 *
 * Rules that bind this file specifically, beyond the catalog rules in
 * `lint.ts`:
 *
 *  - Every claim here is either a product fact we control (price, channel
 *    allowance, surfaces) or a provider fact that carries a source link and a
 *    verification date in the page that renders it. No adjective stands in for
 *    a number.
 *  - Nothing here promises reach, ranking, engagement or "going" anywhere.
 *  - Nothing here describes AI image or AI video generation as a Relay
 *    feature, because it is not one.
 *  - No integration is called official until the provider has approved it. The
 *    connector matrix uses `capability.level.*` from `connections.ts` so the
 *    marketing site and the product cannot drift apart.
 *  - Legal wording that must be drafted by counsel is marked with
 *    `web.legal.counselPending.*` rather than guessed at here.
 */
export const webMarketingMessages = {
  /* ---------------------------------------------------------------------- */
  /* Shared marketing furniture                                              */
  /* ---------------------------------------------------------------------- */

  'web.brand.name': 'Relay',
  'web.brand.tagline':
    'Le plan de contrôle de publication multilingue pour les personnes et les agents.',
  'web.skipToContent': 'Passer au contenu principal',
  'web.nav.label': 'Navigation sur les sites',
  'web.nav.openMenu': 'Menu',
  'web.nav.closeMenu': 'Fermer le menu',
  'web.nav.footerLabel': 'Navigation en pied de page',

  'web.cta.startTrial': "Commencez l'essai de 7 jours",
  'web.cta.seePricing': 'Voir le prix',
  'web.cta.seeCapabilities': 'Lire la matrice des capacités',
  'web.cta.readDocs': 'Lire la documentation',
  'web.cta.trialFootnote':
    'Polar collects a payment method, charges $0 today, and shows the exact first charge date before you confirm.',

  'web.label.lastReviewed': 'Dernière révision {date}',
  'web.label.nextReview': 'Revue suivante {date}',
  'web.label.researchDate': 'Recherche {date}',
  'web.label.officialSource': 'Source officielle',
  'web.label.onThisPage': 'Sur cette page',
  'web.label.provider': 'Plate-forme',
  'web.label.capability': 'Capacité',

  'web.notFound.title': "Il n'y a pas de page à cette adresse",
  'web.notFound.body':
    "Le lien est peut-être obsolète ou nous avons supprimé la page. Les pages qui cessent d'être exactes sont retirées plutôt que laissées en place, et le journal des modifications l'enregistre lorsque cela se produit.",
  'web.notFound.action': "Aller à la page d'accueil",

  'web.correction.title': "J'ai trouvé quelque chose qui ne va pas sur cette page",
  'web.correction.body':
    "Les règles de la plateforme changent et nous nous trompons. Envoyez l'URL et ce qui est inexact et nous corrigerons la page ou la retirerons.",
  'web.correction.email': 'corrections@relay.example',

  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.home.title': 'Relay, le plan de contrôle de publication multilingue',
  'web.meta.home.description':
    "Transformez une idée en contenu natif de la plateforme, approuvez-la une fois, publiez-la de manière fiable via les API officielles de la plateforme et découvrez ce qu'il faut améliorer ensuite.",
  'web.meta.product.title': 'Comment fonctionne Relay',
  'web.meta.product.description':
    'Une visite guidée du bureau de publication : rédigez une seule fois, adaptez par plateforme, validez par rapport aux limites réelles, approuvez, planifiez, publiez et conservez le reçu.',
  'web.meta.integrations.title': 'Plateformes Relay publie sur',
  'web.meta.integrations.description':
    "À quelles plates-formes Relay se connecte, ce que chaque connexion peut faire aujourd'hui et ce que la plate-forme elle-même ne permet pas.",
  'web.meta.capabilities.title': 'Matrice de capacités des connecteurs',
  'web.meta.capabilities.description':
    "Un tableau par plateforme et par capacité généré à partir de nos définitions de connecteurs, séparant ce que nous avons construit de ce que la plateforme n'offre pas.",
  'web.meta.creators.title': 'Relay pour les créateurs',
  'web.meta.creators.description':
    'Pour les créateurs solo publiant la même idée dans plusieurs formats et langues sans la réécrire cinq fois.',
  'web.meta.agencies.title': 'Relay pour les agences',
  'web.meta.agencies.description':
    "Séparation des clients, approbations, liens de révision partageables, reçus et rapports pour les équipes qui publient pour le compte d'autres personnes.",
  'web.meta.developers.title': 'Relay pour les développeurs',
  'web.meta.developers.description':
    "Un backend derrière l'application Web, l'API REST, un serveur MCP distant, la CLI et des webhooks signés. Mêmes règles d’approbation sur toutes les surfaces.",
  'web.meta.pricing.title': 'Pricing',
  'web.meta.pricing.description':
    'One plan. $29 a month, or $300 a year which is $25 a month billed annually. 30 active channels, unlimited team members, no feature tiers.',
  'web.meta.resources.title': 'Ressources',
  'web.meta.resources.description':
    "Statut, changelog, documentation, méthodologie, comparaisons, le radar à outils et le catalogue d'opportunités.",
  'web.meta.status.title': 'Statut',
  'web.meta.status.description':
    "État actuel de chaque surface Relay et de chaque connecteur, ainsi que l'historique des incidents.",
  'web.meta.changelog.title': 'Journal des modifications',
  'web.meta.changelog.description':
    'Ce qui a été expédié, ce qui a changé pour les connecteurs et ce qui a été corrigé.',
  'web.meta.docs.title': 'Documentation',
  'web.meta.docs.description':
    'API REST, serveur MCP, CLI et documentation webhook pour la construction sur Relay.',
  'web.meta.methodology.title': 'Méthodologie',
  'web.meta.methodology.description':
    "Comment nous recherchons les allégations de la plateforme, comment nous les datant, comment nous comparons d'autres produits et comment nous corrigeons les erreurs.",
  'web.meta.compare.title': 'Comparaisons',
  'web.meta.compare.description':
    "Des comparaisons honnêtes et datées avec d'autres outils de publication, y compris à qui chacun d'eux est le mieux adapté.",
  'web.meta.toolRadar.title': "Radar d'outils créatifs",
  'web.meta.toolRadar.description':
    "Un catalogue daté et révisé éditorialement d'outils de création spécialisés, avec des limitations, des mises en garde concernant les droits et des informations commerciales.",
  'web.meta.opportunities.title': 'Possibilités de promotion',
  'web.meta.opportunities.description':
    'Un catalogue organisé de lieux où un produit peut être répertorié, lancé ou discuté, avec ses propres règles de soumission pour chaque destination.',
  'web.meta.legal.title': 'Mentions légales et politiques',
  'web.meta.legal.description':
    "Conditions, confidentialité, utilisation acceptable, utilisation de l'IA, cookies, sous-traitants, remboursements, droits d'auteur, sécurité, accessibilité, conditions des développeurs et conditions des affiliés.",

  /* ---------------------------------------------------------------------- */
  /* Home                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.home.promise':
    "Transformez une idée source en contenu natif de la plateforme, approuvez-la une fois, publiez-la de manière fiable et découvrez ce qu'il faut améliorer ensuite.",
  'web.home.lede':
    "Relay est un bureau de publication destiné aux personnes responsables de ce qui sort. Vous écrivez une seule fois, vous vous adaptez par plateforme, voyez les limites réelles avant de planifier, obtenez l'approbation dont vous avez besoin, publiez via les API officielles de la plateforme et conservez un reçu pour chaque publication.",
  'web.home.summaryLine':
    'One plan at $29 a month or $300 a year. 30 active social channels, unlimited team members, no feature tiers. The seven day trial collects a payment method and charges $0 at checkout.',

  'web.home.example.title': 'Une idée, cinq versions natives de la plateforme',
  'web.home.example.body':
    "Le compositeur commence par une version maître. La sélection d'un compte ouvre un remplacement pour ce compte uniquement, avec ses propres limites en direct et son propre aperçu. Rien de ce que vous écrivez pour LinkedIn ne change ce que X reçoit.",
  'web.home.example.column.account': 'Compte',
  'web.home.example.column.variant': 'Ce que ce compte reçoit',
  'web.home.example.column.check': 'Vérifié avant la planification',
  'web.home.example.caption':
    "Une composition illustrative. Les limites et paramètres affichés proviennent de la définition du connecteur pour chaque plateforme, et non d'une estimation.",
  'web.home.example.x.account': 'X, @northbound',
  'web.home.example.x.variant':
    'Texte principal, raccourci, plus un fil de discussion à deux articles',
  'web.home.example.x.check':
    "Nombre de caractères, ordre des fils de discussion, coût estimé de l'API pour une publication de lien",
  'web.home.example.linkedin.account': 'LinkedIn, outils en direction nord',
  'web.home.example.linkedin.variant': 'Texte principal plus long avec le document joint',
  'web.home.example.linkedin.check': "Rôle dans l'organisation, durée du message, type de document",
  'web.home.example.instagram.account': 'Instagram, @northbound.tools',
  'web.home.example.instagram.variant':
    'Recadrage carré de la même image, légende réécrite pour le flux',
  'web.home.example.instagram.check':
    'Type de compte professionnel, rapport hauteur/largeur, texte alternatif présent',
  'web.home.example.youtube.account': 'YouTube, en direction nord',
  'web.home.example.youtube.variant':
    "Le même clip qu'un Short, avec son propre titre et sa propre description",
  'web.home.example.youtube.check':
    "Portée du téléchargement, état de l'audit, confidentialité dans laquelle le téléchargement atterrira",
  'web.home.example.bluesky.account': 'Bluesky, direction nord.exemple',
  'web.home.example.bluesky.variant': 'Texte maître avec la carte de lien',
  'web.home.example.bluesky.check':
    'Nombre de caractères, résolution de la carte de lien, texte alternatif présent',

  'web.home.pillars.title': 'Ce pour quoi Relay est conçu pour être bon',
  'web.home.pillars.confidence.title': 'Publiez en toute confiance',
  'web.home.pillars.confidence.body':
    "Un véritable aperçu par compte, des vérifications déterministes de la politique et de la plate-forme avant que quoi que ce soit ne soit mis en file d'attente, l'approbation requise par votre espace de travail, un reçu immuable avec l'ID de publication externe et un état de santé pour chaque connexion.",
  'web.home.pillars.confidence.proof':
    "Chaque écriture externe comporte une clé d'idempotence, donc un crash de travailleur après que la plateforme a accepté une publication n'en crée pas une seconde.",
  'web.home.pillars.adapt.title': "S'adapter plutôt que dupliquer",
  'web.home.pillars.adapt.body':
    'Variantes par plate-forme que vous pouvez remplacer un compte à la fois, et transcréation plutôt que traduction littérale, avec un glossaire de marque et un réviseur nommé par langue.',
  'web.home.pillars.adapt.proof':
    "L'interface est disponible dans certaines langues. L'adaptation du contenu couvre 30 langues de contenu et chacune d'entre elles peut être révisée avant sa publication.",
  'web.home.pillars.loop.title': 'Fermer la boucle',
  'web.home.pillars.loop.body':
    "Des analyses qui nomment la métrique, la plate-forme qui l'a signalée, le dénominateur et la date de sa dernière actualisation. Lorsqu'une plateforme ne signale pas quelque chose, Relay l'indique au lieu d'afficher un zéro.",
  'web.home.pillars.loop.proof':
    'Une publication est comparée à votre propre médiane plutôt qu’à un score que personne ne peut auditer.',
  'web.home.pillars.anywhere.title': 'Travaillez là où vous êtes déjà',
  'web.home.pillars.anywhere.body':
    "L'application web, une API REST, un serveur MCP distant, une CLI et des webhooks signés appellent les mêmes services applicatifs, les mêmes règles d'autorisation et les mêmes validateurs.",
  'web.home.pillars.anywhere.proof':
    "Un agent ne peut pas contourner une stratégie d'approbation en utilisant une surface différente, car la stratégie est appliquée dans le service et non dans l'interface.",
  'web.home.pillars.economics.title': 'Economics you can predict',
  'web.home.pillars.economics.body':
    'One price, every shipped feature, 30 active channels and unlimited team members. Platform usage that a provider charges per operation is passed through at cost and shown before you confirm the action.',
  'web.home.pillars.economics.proof':
    'There is no image or video generation credit system, because Relay does not generate media.',

  'web.home.honest.title': 'Ce que Relay ne fait pas',
  'web.home.honest.lede':
    "Ce sont des limites, pas une feuille de route. Si l'un d'entre eux change, il change d'abord dans le journal des modifications.",
  'web.home.honest.noMedia':
    'Pas de génération d’images AI et pas de génération de vidéo AI. Relay adapte, approuve, publie et mesure les médias que vous apportez.',
  'web.home.honest.noAutomationOfEngagement':
    "Pas de likes, de suivis, de republications, de réponses non sollicitées ou de messages directs automatiques. Pas de modules d'engagement et pas d'engagement fabriqué.",
  'web.home.honest.noUnofficial':
    "Pas d'automatisation du navigateur, pas de relecture de cookies, pas de scraping et pas de points de terminaison de publication non officiels. API de plateforme officielle uniquement.",
  'web.home.honest.noPromises':
    "Aucune promesse concernant la portée, le classement ou l'engagement. Relay peut vous dire ce qui s'est passé et ce qu'il faut tester ensuite. Il ne peut pas vous dire ce que fera un public.",
  'web.home.honest.noUnattendedPublishing':
    'Pas de publication sans surveillance par défaut. Un agent peut rédiger, valider et demander une approbation. Un être humain décide avant que quoi que ce soit ne devienne public, à moins que vous ne retiriez délibérément une politique spécifique.',

  'web.home.surfaces.title': 'Cinq surfaces, un backend',
  'web.home.surfaces.body':
    "Les mêmes cas d'utilisation, les mêmes contrôles de location, les mêmes validateurs et les mêmes workflows de publication. Une surface est une porte d’entrée, jamais un raccourci au-delà d’une règle.",
  'web.home.surfaces.web': 'Application Web',
  'web.home.surfaces.webBody':
    'Composer, calendrier, approbations, analyses, connexions et paramètres.',
  'web.home.surfaces.api': 'API REST',
  'web.home.surfaces.apiBody':
    "Clés étendues, clés d'idempotence à chaque écriture, pagination du curseur, erreurs de frappe.",
  'web.home.surfaces.mcp': 'Serveur MCP distant',
  'web.home.surfaces.mcpBody':
    'HTTP diffusable, OAuth, portées par outil et un aperçu avant chaque appel consécutif.',
  'web.home.surfaces.cli': 'CLI',
  'web.home.surfaces.cliBody':
    'Sortie stable lisible par machine pour les scripts et l’intégration continue.',
  'web.home.surfaces.webhooks': 'Webhooks signés',
  'web.home.surfaces.webhooksBody':
    'Publiez les résultats, les décisions d’approbation et l’état de la connexion, avec relivraison.',

  'web.home.closing.title': 'Commencez avec un compte et une publication',
  'web.home.closing.body':
    "Connectez un compte, rédigez une publication, regardez la validation, planifiez-la et lisez le reçu. C'est tout le produit en dix minutes environ.",

  /* ---------------------------------------------------------------------- */
  /* Product                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.product.title': 'Le bureau des éditions',
  'web.product.lede':
    "Il faut répondre à sept questions à chaque étape sans cliquer sur quoi que ce soit : ce qui est publié, où, quelle version chaque compte reçoit, quand et dans quel fuseau horaire, qui l'a approuvé, combien cela peut coûter et que s'est-il passé.",

  'web.product.step.source.title': 'Source',
  'web.product.step.source.body':
    "Partez d'un brief, d'un fichier que vous possédez déjà, d'un élément RSS ou d'une demande d'un agent. Les médias importés conservent la provenance que vous leur avez indiquée, y compris leur provenance et qui détient les droits.",
  'web.product.step.compose.title': 'Composez une fois, puis remplacez',
  'web.product.step.compose.body':
    "Une version principale pilote chaque cible. La sélection d'un compte ouvre un remplacement pour ce compte uniquement : son propre texte, son propre recadrage multimédia, ses propres paramètres, son propre compteur de limite en direct et son propre aperçu. La réinitialisation d'un remplacement restaure le maître en une seule action et vous montre d'abord la différence.",
  'web.product.step.validate.title':
    "Validez avant que quoi que ce soit ne soit mis en file d'attente",
  'web.product.step.validate.body':
    "La validation est déterministe et s'exécute sur le serveur. Il vérifie les limites de la plate-forme à partir de l'instantané des capacités versionné, du type de compte, du texte alternatif, des droits multimédias, des règles de duplication et de cadence, de la résolution de mention et de destination et du coût d'utilisation estimé de la plate-forme. Chaque problème indique la cible à laquelle il appartient et comment le résoudre.",
  'web.product.step.approve.title': 'Approuver une fois',
  'web.product.step.approve.body':
    "L'approbation est une politique d'espace de travail, pas une habitude. Un évaluateur voit chaque cible, chaque variante, le fuseau horaire, l’état de confidentialité et le coût estimé sur un seul écran, et cela fonctionne sur un téléphone. Le contenu modifié après approbation nécessite une nouvelle approbation.",
  'web.product.step.schedule.title': 'Planifier dans un fuseau horaire réel',
  'web.product.step.schedule.body':
    "Chaque publication programmée stocke un instant et un fuseau horaire IANA, jamais une heure locale naïve. Les transitions vers l'heure d'été sont affichées avant votre confirmation, et ne sont pas découvertes par la suite.",
  'web.product.step.publish.title': 'Publier et conserver le reçu',
  'web.product.step.publish.body':
    "Chaque cible est envoyée avec une clé d'idempotence. Une cible qui échoue n'annule pas une cible qui a réussi, et cet état a son propre nom : partiellement publié. Chaque résultat produit un reçu immuable avec l'ID de publication externe, l'identifiant de la demande, l'historique des tentatives et l'erreur exacte s'il y en a une.",
  'web.product.step.learn.title': 'Apprendre',
  'web.product.step.learn.body':
    "Les métriques sont normalisées, nommées, attribuées à la plateforme qui les a signalées et estampillées d'une durée de fraîcheur. Une métrique qu’une plateforme ne signale pas est marquée comme indisponible avec la raison. Il n’est jamais rendu par zéro.",

  'web.product.shot.caption':
    "Les captures d'écran sur cette page sont capturées à partir du produit en cours d'exécution. Jusqu'à ce qu'une surface soit suffisamment complète pour être photographiée honnêtement, nous la décrivons avec des mots au lieu de la dessiner.",
  'web.product.shot.pending': "Capture d'écran en attente de capture",
  'web.product.shot.pendingReason':
    "Cette surface est encore en construction. Nous publierons une capture réelle plutôt qu'une illustration.",

  'web.product.states.title': 'Les États que personne n’aime concevoir',
  'web.product.states.body':
    "Un outil de publication est jugé le mauvais jour, pas le bon. Chacun d'eux a un écran conçu, une phrase simple et une action suivante.",
  'web.product.states.partial':
    'Partiellement publié : quelles cibles sont actives, lesquelles ont échoué et pourquoi.',
  'web.product.states.revoked':
    "Un jeton révoqué trouvé au moment de l'envoi, avec le chemin de reconnexion.",
  'web.product.states.rateLimited':
    "Une limite de débit de plate-forme, avec le moment où elle se réinitialise et ce qui est en file d'attente derrière elle.",
  'web.product.states.duplicate':
    "Un bloc de duplication ou de cadence, avec la règle qui s'est déclenchée et le chemin d'appel.",
  'web.product.states.offline':
    "Hors ligne lors de la composition : rien de ce que vous avez écrit n'est perdu.",
  'web.product.states.permission':
    'Une action que votre rôle ne permet pas, en nommant le rôle qui le permet.',

  /* ---------------------------------------------------------------------- */
  /* Integrations and capability matrix                                      */
  /* ---------------------------------------------------------------------- */

  'web.integrations.title': 'Plateformes',
  'web.integrations.lede':
    'Relay se connecte via les API de la plateforme officielle. Chaque connecteur a un propriétaire nommé, une URL de stratégie enregistrée et une date de révision. Un connecteur n’est pas répertorié comme pris en charge tant qu’il n’a pas réussi la définition de connecteur terminée.',
  'web.integrations.reviewNotice.title':
    "Aucun connecteur n'est qualifié d'officiel avant que la plateforme ne l'approuve",
  'web.integrations.reviewNotice.body':
    "Plusieurs plates-formes exigent un examen de l'application avant qu'une application puisse être publiée au nom d'un client. Lorsque cet examen est en suspens, le connecteur le dit et décrit exactement ce qui est restreint jusqu'à ce qu'il soit réussi.",
  'web.integrations.accountTypes': 'Types de comptes sur lesquels ce connecteur peut publier',
  'web.integrations.restriction': 'Restriction à connaître avant de vous connecter',
  'web.integrations.cost': "Coût d'utilisation de la plateforme",
  'web.integrations.viewMatrix': 'Voir toutes les fonctionnalités de cette plateforme',

  'web.capabilities.title': 'Matrice de capacités des connecteurs',
  'web.capabilities.lede':
    'Généré à partir des mêmes définitions de connecteur que celles lues par le produit, puis examiné par une personne avant publication. Le marketing ne peut pas promettre quelque chose qu’un adaptateur ne peut pas faire.',
  'web.capabilities.legend.title': 'Comment lire ce tableau',
  'web.capabilities.legend.body':
    "Quatre États, et la différence entre les deux du milieu compte. Notre retard n’est pas encore construit. Ce qui n'est pas proposé par la plate-forme est un fait sur la plate-forme qu'aucun outil ne peut contourner.",
  'web.capabilities.tableCaption':
    "Capacités par plateforme. Chaque cellule nomme son état en mots ainsi qu'en couleur.",
  'web.capabilities.snapshot': 'Version des définitions de connecteur {version}, révisé {date}',
  'web.capabilities.sourceNote':
    "Chaque revendication de plate-forme dans ce tableau renvoie à la documentation officielle dont elle provient et à la date à laquelle nous l'avons lue pour la dernière fois.",

  /* ---------------------------------------------------------------------- */
  /* Audience pages                                                          */
  /* ---------------------------------------------------------------------- */

  'web.creators.title': 'Pour les créateurs',
  'web.creators.lede':
    "Vous publiez la même idée dans plusieurs formats, parfois dans plusieurs langues, et vous êtes toute l'équipe. Le travail que Relay supprime est la retape, le recadrage et la vérification.",
  'web.creators.job.adapt.title': 'Écrivez-le une fois, expédiez cinq versions natives',
  'web.creators.job.adapt.body':
    "La version principale porte l'idée. Chaque compte obtient la longueur, le recadrage, les paramètres et le ton attendu par la plate-forme, et vous pouvez tous les voir côte à côte avant de vous engager.",
  'web.creators.job.languages.title': 'Publiez dans une autre langue sans deviner',
  'web.creators.job.languages.body':
    "La transcréation conserve l'intention plutôt que les mots, utilise le glossaire de votre marque et indique si un évaluateur natif l'a lu. Rien n'est publié dans une langue dont vous ne pouvez garantir que si vous le dites.",
  'web.creators.job.rights.title': 'Conservez votre dossier de droits avec le dossier',
  'web.creators.job.rights.body':
    "Les médias indiquent d'où ils viennent, qui détient les droits et s'ils ont été créés avec un outil génératif. Les plateformes le demandent de plus en plus. Relay stocke votre réponse avec l'actif au lieu de vous demander à nouveau.",
  'web.creators.job.cost.title': 'Connaissez le coût avant de publier',
  'web.creators.job.cost.body':
    "X facture par opération et facture davantage pour une publication contenant une URL. Relay estime qu'avant de confirmer, une semaine de liens chargée est donc une décision plutôt qu'une facture surprise.",
  'web.creators.notFor.title': "Ce que ce n'est pas",
  'web.creators.notFor.body':
    "Relay ne génère pas d'images ou de vidéos, n'exécute pas d'automatisation de l'engagement et ne prédit pas les performances d'une publication. Si ce sont les outils que vous souhaitez, d’autres produits les proposent et nous préférons que vous le sachiez maintenant.",

  'web.agencies.title': 'Pour les agences',
  'web.agencies.lede':
    "Vous publiez au nom d'autres personnes, ce qui fait de l'attribution, de l'approbation et des preuves une partie du travail plutôt qu'une subtilité.",
  'web.agencies.job.separation.title': 'Une séparation client qui tient la route',
  'web.agencies.job.separation.body':
    "Chaque espace de travail est isolé au niveau de la base de données ainsi que dans l'application. Une requête qui traverse les limites d’un espace de travail échoue dans Postgres, pas seulement dans un chemin de code que quelqu’un pourrait oublier.",
  'web.agencies.job.approval.title': "Approbations qu'un client peut réellement utiliser",
  'web.agencies.job.approval.body':
    "Un évaluateur voit chaque cible, chaque variante, le planning avec son fuseau horaire et le coût estimé sur un seul écran, et l'écran fonctionne sur un téléphone. Les décisions d'approbation sont enregistrées avec qui, quand et ce qu'ils ont vu.",
  'web.agencies.job.receipts.title': 'Preuve de la conversation gênante',
  'web.agencies.job.receipts.body':
    "Chaque publication produit un reçu immuable avec l'ID de publication externe et l'historique complet des tentatives. Lorsqu'un client demande si quelque chose s'est passé à neuf heures, la réponse est accompagnée d'un horodatage et d'un identifiant de plate-forme.",
  'web.agencies.job.roles.title':
    'Des rôles qui correspondent à la façon dont le travail est réparti',
  'web.agencies.job.roles.body':
    "Propriétaire, administrateur, gestionnaire, éditeur, approbateur, analyste et spectateur, définis par marque et par compte. Membres d'équipe illimités, car la facturation par siège oblige les agences à partager les connexions et c'est un problème de sécurité.",
  'web.agencies.limits.title': 'La frontière, clairement énoncée',
  'web.agencies.limits.body':
    "Un plan couvre 30 canaux sociaux actifs. Un canal est un compte social, une page, un profil, un groupe ou une connexion à une publication. Si vous en avez besoin de plus de 30, dites-nous ce dont vous avez besoin et nous vous donnerons une réponse claire plutôt qu'un niveau caché.",

  'web.developers.title': 'Pour les développeurs',
  'web.developers.lede':
    "La publication fait partie d'un flux de travail où une erreur est publique et permanente. Relay vous offre un backend, des erreurs de frappe, une idempotence à chaque écriture et un modèle d'approbation qu'un agent ne peut pas contourner.",
  'web.developers.surface.api.title': 'API REST',
  'web.developers.surface.api.body':
    "Clés API étendues, une clé d'idempotence requise à chaque écriture, une pagination du curseur et une enveloppe d'erreur dactylographiée contenant un code stable, une clé de message et des détails épurés. Aucune charge utile du fournisseur ne vous est jamais renvoyée brute.",
  'web.developers.surface.mcp.title': 'Serveur MCP distant',
  'web.developers.surface.mcp.body':
    "HTTP diffusable avec OAuth. Les outils sont granulaires et chacun déclare ses effets secondaires. La lecture, la rédaction, la demande d'approbation, la planification et la publication sont des domaines distincts, de sorte qu'un modèle capable de rédiger ne peut pas être publié.",
  'web.developers.surface.cli.title': 'CLI',
  'web.developers.surface.cli.body':
    "Chaque commande prend en charge une sortie lisible par machine avec une forme stable, de sorte qu'un script peut l'analyser et qu'une tâche d'intégration continue peut échouer.",
  'web.developers.surface.webhooks.title': 'Webhooks signés',
  'web.developers.surface.webhooks.body':
    "Publiez les résultats, les décisions d'approbation, l'état de la connexion et les résultats de validation, signés, résistants à la relecture et livrables à nouveau à partir du tableau de bord.",
  'web.developers.safety.title': 'Le modèle de sécurité des agents',
  'web.developers.safety.body':
    "Un identifiant d'agent est un compte de service étendu, et non une copie d'une session personnelle. Il comporte des restrictions par marque, par compte, par région, par domaine, par cadence et par anticipation, et le serveur réautorise chaque appel plutôt que de faire confiance à l'hôte de l'agent.",
  'web.developers.safety.injection':
    "Les pages Web, les flux, les commentaires et les réponses de la plateforme sont traités comme des données non fiables. La sortie du modèle est revalidée de manière déterministe, car un modèle indiquant qu'un message est correct n'est pas une décision de sécurité.",
  'web.developers.safety.killSwitch':
    "Chaque agent et chaque espace de travail dispose d'un kill switch qui arrête le travail en attente sans le supprimer.",
  'web.developers.openSource.title': 'Pièces ouvertes',
  'web.developers.openSource.body':
    "Le contrat de connecteur, la CLI, les exemples de schéma, les définitions d'outils MCP et le simulateur de fournisseur sont les éléments dont vous avez besoin pour créer avec Relay sans compte sandbox. Lorsqu'un référentiel n'est pas encore publié, cette page l'indique plutôt que de créer un lien vers rien.",

  /* ---------------------------------------------------------------------- */
  /* Pricing                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.pricing.title': 'One plan',
  'web.pricing.lede':
    'There are no feature tiers, so there is no comparison table to read. Both billing intervals unlock every shipped feature.',
  'web.pricing.intervalHeading': 'Choose how you pay',
  'web.pricing.monthlyLabel': 'Billed monthly',
  'web.pricing.annualLabel': 'Billed annually',
  'web.pricing.annualDetail': '$300 charged once a year.',
  'web.pricing.monthlyDetail': '$29 charged every month.',
  'web.pricing.perMonthNote':
    'Prices are in US dollars. Polar adds any sales tax or VAT that applies where you are.',

  'web.pricing.beside.title': 'What you are agreeing to',
  'web.pricing.beside.channels':
    '30 active social channels. A channel is one social account, Page, profile, group or publication connection.',
  'web.pricing.beside.members':
    'Unlimited team members, workspaces and brand groups. There is no per seat charge.',
  'web.pricing.beside.fairUse':
    'Unlimited drafts, scheduled posts and stored receipts under a published fair use and anti spam policy. Those controls exist to protect your connected accounts and they apply identically to every subscriber.',
  'web.pricing.beside.metered':
    'X charges per API operation and charges more for a post that contains a URL. Relay passes that through at cost, estimates it before you confirm the action, and shows it in your usage. Other platform fees are passed through only when they are disclosed before the action.',
  'web.pricing.beside.noMedia':
    'AI image generation and AI video generation are not included and are not sold. There are no media credits, because Relay does not generate media.',
  'web.pricing.beside.trial':
    'The trial runs for seven days with every feature. Polar collects a payment method at checkout and charges $0 today. The exact first charge amount and date are shown next to the start action before you confirm.',
  'web.pricing.beside.conversion':
    'If you do nothing, the trial converts on day seven to the interval you chose and Polar charges the amount shown at checkout. Polar emails a reminder three days before that happens.',
  'web.pricing.beside.cancel':
    'Cancel from Settings at any time without contacting support. Cancel before the trial converts and no charge is attempted. Cancel after that and you keep access until the paid period ends.',
  'web.pricing.beside.data':
    'Nothing is deleted when a subscription ends. You can export your content, receipts and analytics, and you can delete them yourself.',

  'web.pricing.included.title': 'Included, in both intervals',
  'web.pricing.compare.title': 'Why there is no comparison table here',
  'web.pricing.compare.body':
    'A comparison table exists to show what a cheaper plan takes away. There is one plan, so the table would have one column. If we ever add a tier, we will say what moved and why on the changelog before the price page changes.',

  'web.pricing.testimonials.title': 'There are no customer quotes on this page yet',
  'web.pricing.testimonials.body':
    'A quote goes up only when the customer wrote it, gave written permission for it, and we can point to the work it describes. Until then an empty space is more honest than a wall of invented praise.',

  'web.pricing.faq.title': 'Questions people ask before paying',
  'web.pricing.faq.channels.q': 'What happens if I go over 30 channels',
  'web.pricing.faq.channels.a':
    'Nothing is disconnected and nothing is deleted. Channels over the limit become read only, you choose which ones stay active, and we tell you before it happens.',
  'web.pricing.faq.refund.q': 'Do you refund',
  'web.pricing.faq.refund.a':
    'Yes, under the published refund and cancellation policy, and always where consumer law requires it. Billing is handled by Polar as merchant of record and refunds are issued through Polar.',
  'web.pricing.faq.selfHost.q': 'Can I run it myself',
  'web.pricing.faq.selfHost.a':
    'Not today. Whether there will be a self hosted edition, and under which licence, is an open decision. We will publish the answer rather than imply one.',
  'web.pricing.faq.xCost.q': 'How much will X actually cost me',
  'web.pricing.faq.xCost.a':
    'It depends on how many posts you publish and how many of them contain a URL, because X prices those differently. Relay estimates each action before you confirm it and totals it in your usage view. We do not mark it up.',
  'web.pricing.faq.trialAbuse.q': 'Can I start a second trial',
  'web.pricing.faq.trialAbuse.a':
    'Repeat trials are limited by Polar. If you have a legitimate reason, contact support and a person will look at it.',

  /* ---------------------------------------------------------------------- */
  /* Resources index                                                         */
  /* ---------------------------------------------------------------------- */

  'web.resources.title': 'Ressources',
  'web.resources.lede':
    'Vérité opérationnelle sur le produit et recherche derrière tout ce que nous affirmons concernant une plate-forme.',
  'web.resources.status.body':
    'État actuel de chaque surface et de chaque connecteur, avec historique des incidents.',
  'web.resources.changelog.body':
    'Ce qui a été expédié, ce qui a changé pour un connecteur et ce que nous avons corrigé.',
  'web.resources.docs.body': "Documentation sur l'API REST, MCP, CLI et webhook.",
  'web.resources.methodology.body':
    'Comment nous recherchons, datant, recherchons et corrigeons chaque réclamation de la plateforme.',
  'web.resources.compare.body':
    "Comparaisons datées avec d'autres outils, y compris à qui chacun convient.",
  'web.resources.capabilities.body':
    'Par plateforme, par fonctionnalité, généré à partir des définitions de connecteur.',
  'web.resources.toolRadar.body':
    'Outils de création spécialisés, obsolètes, avec limitations et divulgations.',
  'web.resources.opportunities.body':
    'Des lieux sélectionnés pour lancer, répertorier ou contribuer, avec des règles pour chaque destination.',
  'web.resources.legal.body':
    'Terms, privacy, acceptable use, AI use, security and the rest of the policy set.',
  'web.resources.guides.title': 'Guides et flux de travail',
  'web.resources.guides.empty': "Aucun guide n'a encore été publié",
  'web.resources.guides.emptyBody':
    "La norme éditoriale nécessite des données produit originales, un flux de travail reproductible, des sources de plateforme primaires avec une date de vérification et un éditeur humain nommé. Les premiers guides publient lorsqu'ils le rencontrent.",

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.status.title': 'Statut',
  'web.status.lede':
    "L'état de chaque surface Relay et de chaque connecteur. L’état du connecteur couvre notre adaptateur et l’API de plate-forme dont il dépend.",
  'web.status.updated': 'À carreaux {time}',
  'web.status.surfaces.title': 'Surfaces',
  'web.status.connectors.title': 'Connecteurs',
  'web.status.level.operational': 'Fonctionnant normalement',
  'web.status.level.degraded': 'Dégradé',
  'web.status.level.partial': 'Panne partielle',
  'web.status.level.outage': 'Panne',
  'web.status.level.maintenance': 'Entretien planifié',
  'web.status.level.notLive': 'Pas encore en direct',
  'web.status.notLiveBody':
    "Ce connecteur est construit mais ne transporte pas encore de trafic client, il n'y a donc rien à signaler.",
  'web.status.incidents.title': 'Historique des incidents',
  'web.status.incidents.empty': "Aucun incident n'a été enregistré",
  'web.status.incidents.emptyBody':
    'Cette page commence volontairement vide. Nous publions tous les incidents qui ont affecté la publication, y compris ceux causés par nos propres erreurs, avec la chronologie et ce qui a changé par la suite.',
  'web.status.incident.started': 'Commencé {time}',
  'web.status.incident.resolved': 'Résolu {time}',
  'web.status.incident.impact': 'Impact',
  'web.status.incident.cause': 'Cause',
  'web.status.incident.followUp': 'Ce qui a changé par la suite',
  'web.status.subscribe.title': 'Soyez averti quand quelque chose se brise',
  'web.status.subscribe.body':
    'L’état de la connexion, les échecs de publication et les incidents de plate-forme sont transmis sous forme de webhooks signés à votre propre point de terminaison. Il n’existe pas encore de liste de diffusion de statut distincte.',

  /* ---------------------------------------------------------------------- */
  /* Changelog                                                               */
  /* ---------------------------------------------------------------------- */

  'web.changelog.title': 'Journal des modifications',
  'web.changelog.lede':
    "Modifications du produit, modifications des connecteurs et corrections. Un changement de fonctionnalité qui affecte ce que vous pouvez publier apparaît ici avant d'apparaître ailleurs sur ce site.",
  'web.changelog.kind.shipped': 'Expédié',
  'web.changelog.kind.changed': 'Modifié',
  'web.changelog.kind.fixed': 'Fixé',
  'web.changelog.kind.connector': 'Connecteur',
  'web.changelog.kind.correction': 'Correction',
  'web.changelog.kind.security': 'Sécurité',
  'web.changelog.empty': "Rien n'a encore été publié publiquement",
  'web.changelog.emptyBody':
    'Relay est en cours de construction. La première entrée ici est la première chose qu’un client peut utiliser, et non une étape importante nous concernant.',

  /* ---------------------------------------------------------------------- */
  /* Docs shell                                                              */
  /* ---------------------------------------------------------------------- */

  'web.docs.title': 'Documentation',
  'web.docs.lede':
    "Un backend, quatre façons d'y accéder. Chaque section documente les mêmes cas d'utilisation, donc un concept que vous apprenez dans l'API REST est le même concept dans MCP et dans la CLI.",
  'web.docs.section.start.title': 'Commencer',
  'web.docs.section.start.body':
    'Authentification, espaces de travail, marques et votre premier article publié.',
  'web.docs.section.api.title': 'API REST',
  'web.docs.section.api.body':
    "Ressources, pagination, idempotence, codes d'erreur et limites de débit.",
  'web.docs.section.mcp.title': 'Serveur MCP',
  'web.docs.section.mcp.body':
    "Transport, OAuth, catalogue d'outils, portées et poignée de main d'approbation.",
  'web.docs.section.cli.title': 'CLI',
  'web.docs.section.cli.body':
    'Installez, authentifiez-vous et le contrat de sortie lisible par machine.',
  'web.docs.section.webhooks.title': 'Webhooks',
  'web.docs.section.webhooks.body':
    "Catalogue d'événements, vérification de signature, tentatives et relivraison.",
  'web.docs.section.connectors.title': 'Connecteurs',
  'web.docs.section.connectors.body':
    'Selon les exigences de la plateforme, les types de comptes, les limites et les restrictions connues.',
  'web.docs.section.errors.title': "Référence d'erreur",
  'web.docs.section.errors.body': "Chaque code d'erreur, ses causes et que faire à ce sujet.",
  'web.docs.pending': 'Pas encore publié',
  'web.docs.pendingBody':
    "Cette section est écrite par rapport à l'API fournie et publiée avec celle-ci. Nous préférons ne rien vous montrer si ce n'est la documentation d'un point de terminaison susceptible de changer.",
  'web.docs.principles.title': 'Sur quoi vous pouvez compter',
  'web.docs.principles.idempotency':
    "Chaque écriture prend une clé d'idempotence. Rejouer une requête avec la même clé renvoie le résultat original plutôt que de créer une deuxième publication.",
  'web.docs.principles.errors':
    'Chaque erreur comporte un code stable, une clé de message et des détails épurés. Les codes ne changent pas de signification entre les versions.',
  'web.docs.principles.versioning':
    "Les modifications majeures bénéficient d'une nouvelle version et d'une fenêtre de dépréciation annoncée. Les changements additifs ne le font pas.",
  'web.docs.principles.scopes':
    "La lecture, la rédaction, la demande d'approbation, la planification et la publication sont des domaines distincts. Un identifiant obtient le plus petit ensemble qui fait son travail.",

  /* ---------------------------------------------------------------------- */
  /* Methodology                                                             */
  /* ---------------------------------------------------------------------- */

  'web.methodology.title': 'Méthodologie',
  'web.methodology.lede':
    "Comment tout ce qui se trouve sur ce site peut être qualifié de vrai, et que se passe-t-il lorsque cela s'avère ne pas l'être.",
  'web.methodology.claims.title': 'Revendications de la plateforme',
  'web.methodology.claims.body':
    "Chaque affirmation sur ce qu'une plate-forme autorise provient de la propre documentation ou de la page de politique de cette plate-forme. Nous enregistrons l'URL, la date à laquelle elle a été lue, la version de l'API à laquelle on s'applique et la personne qui en est propriétaire la revérifie. Une réclamation sans ces quatre éléments ne sera pas envoyée sur le site.",
  'web.methodology.recheck.title': 'Quand nous revérifions',
  'web.methodology.recheck.beforeConnector':
    'Avant qu’un connecteur démarre, et encore avant qu’il achemine le trafic client.',
  'web.methodology.recheck.monthly':
    'Chaque mois pour les journaux des modifications de la plateforme et les prix des fournisseurs.',
  'web.methodology.recheck.quarterly':
    'Chaque trimestre pour les plans des concurrents, les règles communautaires et les documents juridiques.',
  'web.methodology.recheck.immediate':
    "Immédiatement après tout rejet de la plateforme, avis d'application, dépréciation ou changement inexpliqué dans le comportement de publication ou d'analyse.",
  'web.methodology.comparison.title': 'Comparaisons',
  'web.methodology.comparison.bestFor':
    'Chaque comparaison indique à qui s’adresse chaque produit, y compris lorsque ce n’est pas nous.',
  'web.methodology.comparison.dated':
    'Chaque comparaison porte la date de recherche et relie les principales sources de prix et de capacités.',
  'web.methodology.comparison.distinction':
    'Une fonctionnalité manquante est étiquetée soit comme quelque chose que nous n’avons pas construit, soit comme quelque chose que la plate-forme ne permet pas. Ce sont des phrases différentes et nous ne les fusionnons jamais.',
  'web.methodology.comparison.noLogos':
    "Nous n'utilisons pas les logos, citations ou captures d'écran d'interface de clients d'autres sociétés, et nous ne revendiquons pas une approbation que nous n'avons pas.",
  'web.methodology.benchmarks.title': 'Benchmarks et données produits',
  'web.methodology.benchmarks.body':
    "Tout nombre tiré de l'activité du client indique son échantillon, ses exclusions, sa définition de métrique et son seuil de confidentialité, et est agrégé afin qu'aucun espace de travail ne puisse être identifié. Si un échantillon est trop petit pour être publié en toute sécurité, nous le disons au lieu de le publier quand même.",
  'web.methodology.ai.title': "L'IA dans notre propre contenu",
  'web.methodology.ai.body':
    "Un modèle peut rechercher, décrire, traduire, vérifier et formater. Une personne nommée est propriétaire de chaque réclamation, édite la pièce et la maintient à jour. Nous ne publions pas d'articles générés non révisés et nous ne générons pas de captures d'écran.",
  'web.methodology.corrections.title': 'Corrections',
  'web.methodology.corrections.body':
    "Lorsqu'une page est erronée, nous la corrigeons sur place, ajoutons une note de correction datée et listons la correction dans le journal des modifications. Lorsqu'une page est trop obsolète pour être corrigée, nous la retirons plutôt que de la laisser en place.",

  /* ---------------------------------------------------------------------- */
  /* Compare                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.compare.title': 'Comparaisons',
  'web.compare.lede':
    "Ces pages sont utiles même si vous choisissez l'autre produit. C'est la norme à laquelle ils doivent répondre avant de publier.",
  'web.compare.rules.title': 'Les règles que ces pages suivent',
  'web.compare.rules.bestFor':
    'Chaque page indique d’abord à qui s’adresse l’autre produit, dans sa propre section.',
  'web.compare.rules.dated':
    "Chaque réclamation est datée et relie la source principale d'où elle provient.",
  'web.compare.rules.distinction':
    'Nous séparons ce que nous n’avons pas construit de ce qu’une plateforme ne permet pas.',
  'web.compare.rules.axes':
    "Chaque page compare les mêmes éléments : allocation de compte, limites de publication, équipe et approbation, accès API, MCP et CLI, langues de contenu, analyses, gestion vidéo, utilisation intégrée, auto-hébergement, support et coût de l'API de la plate-forme que vous payez en plus.",
  'web.compare.rules.correction':
    'Chaque page porte un contact de correction et une date de révision.',
  'web.compare.planned.title': 'Pages planifiées',
  'web.compare.planned.body':
    'Ceux-ci sont publiés une fois la vérification actuelle des prix et des capacités terminée. Une comparaison écrite de mémoire est pire que pas de comparaison.',
  'web.compare.empty': "Aucune comparaison n'a encore été publiée",
  'web.compare.emptyBody':
    "Chaque page nécessite une nouvelle vérification des faits par rapport aux prix et à la documentation de l'autre produit. Ils publient un par un à mesure que ce travail se termine.",

  /* ---------------------------------------------------------------------- */
  /* Tool radar                                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.title': "Radar d'outils créatifs",
  'web.toolRadar.lede':
    "Relay ne génère ni images ni vidéo. Cela vous aide à décider quel outil spécialisé utiliser et à apporter l'actif fini avec son enregistrement de droits intact.",
  'web.toolRadar.record.title': 'Ce que chaque disque doit contenir',
  'web.toolRadar.record.url': "L'URL officielle et l'organisation propriétaire du produit.",
  'web.toolRadar.record.useCase':
    'Le flux de travail pour lequel il est recommandé et ses limites documentées.',
  'web.toolRadar.record.pricing':
    "Son modèle de tarification et la date à laquelle nous l'avons vérifié.",
  'web.toolRadar.record.rights':
    'Ses droits, licences, conservation et mises en garde en matière de confidentialité, selon les propres mots du vendeur.',
  'web.toolRadar.record.disclosure':
    'Si nous entretenons des relations commerciales avec lui. Le classement n’en dépend jamais.',
  'web.toolRadar.record.verified':
    "Une date de dernière vérification et un avertissement visible une fois qu'un enregistrement a dépassé sa fenêtre de révision.",
  'web.toolRadar.category.title': 'Catégories',
  'web.toolRadar.empty': "Le catalogue n'est pas encore rempli",
  'web.toolRadar.emptyBody':
    'Les enregistrements sont rédigés par une personne à partir de la propre documentation du fournisseur. Nous ne remplirons pas cette page avec des liens générés par des modèles qui semblent plausibles.',
  'web.toolRadar.noAffiliateYet':
    'Il n’existe aucune relation d’affiliation avec les outils répertoriés ici aujourd’hui.',

  /* ---------------------------------------------------------------------- */
  /* Opportunities                                                           */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.title': 'Possibilités de promotion',
  'web.opportunities.lede':
    'Un catalogue organisé de lieux où un produit peut être lancé, répertorié, discuté ou contribué, avec les règles que chaque destination se fixe.',
  'web.opportunities.rules.title': 'Comment se comporte ce catalogue',
  'web.opportunities.rules.curated':
    "Chaque candidature est un enregistrement révisé avec une URL officielle, les règles de soumission actuelles et une date de vérification. Rien n'est découvert par un modèle et présenté comme vérifié.",
  'web.opportunities.rules.noAutomation':
    "Relay ne soumet jamais de formulaire, ne récupère jamais de contact, n'envoie jamais d'e-mails ou de publications en masse à une communauté pour vous. Vous faites la soumission.",
  'web.opportunities.rules.noGuarantee':
    "Une liste n'est pas une promesse de classement et un lien n'est pas une stratégie de croissance. Nous vous montrons les exigences en matière d'adéquation, d'audience, d'effort, de coût et de divulgation afin que vous puissiez décider si cela vaut la peine de votre après-midi.",
  'web.opportunities.rules.stale':
    'Un enregistrement au-delà de sa date de révision est étiqueté ou masqué plutôt que affiché comme actuel.',
  'web.opportunities.category.title': 'Catégories',
  'web.opportunities.empty': "Le catalogue n'est pas encore rempli",
  'web.opportunities.emptyBody':
    'Chaque règle de destination doit être lue et enregistrée par une personne avant de pouvoir être recommandée. Les catégories sont répertoriées ci-dessus afin que vous puissiez voir la forme de ce qui s’en vient.',

  /* ---------------------------------------------------------------------- */
  /* Legal, shared                                                           */
  /* ---------------------------------------------------------------------- */

  'web.legal.title': 'Legal and policies',
  'web.legal.lede':
    'The documents that govern using Relay. Where the wording has to be drafted by a lawyer for a specific company and jurisdiction, the page says so instead of pretending.',
  'web.legal.counselPending.title': 'Pending review by counsel before launch',
  'web.legal.counselPending.body':
    'The substance on this page reflects how the product actually behaves and is accurate today. The binding legal wording, the governing jurisdiction and the liability terms are being drafted with qualified counsel and will replace this text before Relay is generally available. This page is not legal advice and it is not a contract yet.',
  'web.legal.contact.title': 'Contact',
  'web.legal.contact.privacy': 'privacy@relay.example',
  'web.legal.contact.legal': 'legal@relay.example',
  'web.legal.contact.security': 'security@relay.example',
  'web.legal.contact.abuse': 'abuse@relay.example',
  'web.legal.contact.copyright': 'copyright@relay.example',
  'web.legal.contact.affiliates': 'affiliates@relay.example',
  'web.legal.contact.accessibility': 'accessibility@relay.example',
  'web.legal.entity.pending':
    'The contracting entity, its registered address and the governing jurisdiction are an open decision and will be named here before launch.',
  'web.legal.index.updated': 'Updated {date}',

  /* Terms ---------------------------------------------------------------- */
  'web.legal.terms.title': 'Terms of Service',
  'web.legal.terms.summary':
    'What Relay agrees to provide, what you agree to do, and what happens when either side stops.',
  'web.legal.terms.service.title': 'What the service is',
  'web.legal.terms.service.body':
    'Relay is a hosted service for creating, approving, scheduling and publishing content to social platforms through those platforms official APIs, together with the receipts, analytics and audit records that result. It is not a social platform and it does not control what any platform does with a post once it is published.',
  'web.legal.terms.content.title': 'Your content stays yours',
  'web.legal.terms.content.body':
    'You keep ownership of everything you upload, write or import. You grant Relay only the licence needed to store it, process it, adapt it into the variants you ask for, and transmit it to the accounts you selected. That licence ends when you delete the content, apart from records we are required to keep.',
  'web.legal.terms.warranties.title': 'What you are confirming when you publish',
  'web.legal.terms.warranties.body':
    'That you are authorized to publish to the accounts you connected, that you hold the rights to the content and the media, that you have the consent required for any person appearing in it, and that publishing it does not breach the destination platform rules.',
  'web.legal.terms.platforms.title': 'Platform dependence',
  'web.legal.terms.platforms.body':
    'Connectors depend on third party APIs that those companies control. A platform can change its API, restrict a permission, revoke an application or close access with little notice. Relay cannot guarantee that any connector remains available, and a connector becoming unavailable is not a failure of this agreement. We will tell you on the status page and the changelog when it happens.',
  'web.legal.terms.ai.title': 'AI output',
  'web.legal.terms.ai.body':
    'Text assistance, translation, transcreation and planning features produce suggestions. They can be wrong, out of date or unsuitable. You are responsible for reviewing anything you publish. Relay does not generate images or video.',
  'web.legal.terms.billing.title': 'Payment',
  'web.legal.terms.billing.body':
    'Polar is the merchant of record. Polar handles checkout, taxes, invoices and refunds. Subscriptions renew automatically at the interval you chose until you cancel. Platform usage that a provider charges per operation is billed separately at cost and is disclosed before the action that incurs it.',
  'web.legal.terms.suspension.title': 'Suspension and scheduled posts',
  'web.legal.terms.suspension.body':
    'If a subscription lapses or a workspace is suspended, scheduled posts stop rather than publishing silently, and the workspace becomes read only. Your content, receipts and connections are preserved and remain exportable.',
  'web.legal.terms.aup.title': 'Acceptable use',
  'web.legal.terms.aup.body':
    'The Acceptable Use Policy forms part of these terms. We may rate limit, pause, require verification, revoke agent or API access, suspend or terminate for a breach of it, and you may appeal any of those decisions to a person.',
  'web.legal.terms.termination.title': 'Ending the agreement',
  'web.legal.terms.termination.body':
    'You can cancel at any time from Settings. After termination you keep an export window before deletion, and deletion is never made conditional on paying an outstanding invoice, other than the billing records we are legally required to retain.',
  'web.legal.terms.developer.title': 'API, MCP and service accounts',
  'web.legal.terms.developer.body':
    'Programmatic access is governed additionally by the API and MCP Terms, including rate limits, scope requirements and the rule that a service account never inherits a human full permissions.',

  /* Privacy -------------------------------------------------------------- */
  'web.legal.privacy.title': 'Privacy Policy',
  'web.legal.privacy.summary':
    'What Relay collects, why, who processes it, how long it is kept, and how to get it out or have it deleted.',
  'web.legal.privacy.collect.title': 'What we hold',
  'web.legal.privacy.collect.account':
    'Account and profile: your name, email, workspace membership and role.',
  'web.legal.privacy.collect.connections':
    'Social connections: the platform account identifier, its display name, its type, the granted scopes and an encrypted access token. Tokens are stored with envelope encryption and are never written to a log.',
  'web.legal.privacy.collect.content':
    'Content and media you create, upload or import, including the rights and provenance you record with it.',
  'web.legal.privacy.collect.schedules':
    'Schedules, approval decisions, publication receipts and audit events.',
  'web.legal.privacy.collect.analytics':
    'Metrics retrieved from platforms about posts you published through Relay.',
  'web.legal.privacy.collect.billing':
    'Billing references held by Polar. Relay does not store your card details.',
  'web.legal.privacy.collect.technical':
    'Device and log data needed to operate and secure the service, redacted by default.',
  'web.legal.privacy.collect.agent':
    'Agent and API activity: which credential took which action, with an input hash rather than the input.',
  'web.legal.privacy.minimization.title': 'What we deliberately do not do',
  'web.legal.privacy.minimization.scopes':
    'We request only the platform scopes the features you have enabled actually need.',
  'web.legal.privacy.minimization.history':
    'We do not ingest your entire social history in order to draw a chart.',
  'web.legal.privacy.minimization.logs':
    'Post content is redacted from general logs and from support tooling.',
  'web.legal.privacy.minimization.training':
    'Your content is not used to train our models or anyone models by default.',
  'web.legal.privacy.subprocessors.title': 'Who else processes it',
  'web.legal.privacy.subprocessors.body':
    'The current subprocessor list is published separately and changes are announced there before they take effect.',
  'web.legal.privacy.retention.title': 'How long we keep it',
  'web.legal.privacy.rights.title': 'Your controls',
  'web.legal.privacy.rights.export':
    'Download your content, receipts and analytics as JSON and CSV with a media archive.',
  'web.legal.privacy.rights.revoke':
    'Disconnect one social account without deleting the workspace. Tokens are revoked at the platform and deleted here.',
  'web.legal.privacy.rights.delete':
    'Delete a brand, a piece of content, a media file or the entire account.',
  'web.legal.privacy.rights.cancelJobs':
    'Cancel scheduled jobs before deleting anything, so nothing publishes after you leave.',
  'web.legal.privacy.rights.sessions':
    'See and revoke active sessions, API keys, agent credentials, webhooks and platform permissions.',
  'web.legal.privacy.rights.consent':
    'Consent preferences are versioned and auditable, so you can see what you agreed to and when.',
  'web.legal.privacy.deletion.title': 'Deleting data held at a platform',
  'web.legal.privacy.deletion.body':
    'Disconnecting an account in Relay revokes the token at the platform and deletes the credential here. Content already published on a platform is governed by that platform and has to be deleted there. Where a platform requires deletion of derived data within a fixed period after revocation, we meet that period. For Google and YouTube data that period is currently 30 days.',
  'web.legal.privacy.transfers.title': 'International transfers',
  'web.legal.privacy.transfers.body':
    'Hosting regions and the transfer mechanism are being finalized with counsel and will be named here, together with the safeguards that apply, before launch.',

  /* Acceptable use ------------------------------------------------------- */
  'web.legal.aup.title': 'Acceptable Use Policy',
  'web.legal.aup.summary':
    'Relay helps you publish content you are authorized to publish. It is not built to help anyone evade a platform limit, fake an endorsement or send unwanted messages.',
  'web.legal.aup.prohibited.title': 'Not permitted',
  'web.legal.aup.prohibited.spam':
    'Spam, unsolicited bulk messages, replies or mentions, engagement bait, and repeated unwanted content.',
  'web.legal.aup.prohibited.linkSchemes':
    'Automated directory or form submissions, bulk outreach, link schemes, paid or reciprocal links intended to manipulate search ranking, and community promotion that breaks the destination rules.',
  'web.legal.aup.prohibited.inauthentic':
    'Coordinated inauthentic behaviour, multi account amplification presented as independent, engagement pods, fake reviews, ratings or install counts, automated likes and follows, and trend manipulation.',
  'web.legal.aup.prohibited.duplicate':
    'Publishing duplicate or substantially similar content across many accounts where the platform prohibits it.',
  'web.legal.aup.prohibited.impersonation':
    'Impersonation, phishing, fraud, scams, malware, credential theft and deceptive installation.',
  'web.legal.aup.prohibited.harm':
    'Harassment, doxxing, sexual exploitation, non consensual intimate media, hate or violent extremist content, and illegal goods or services.',
  'web.legal.aup.prohibited.political':
    'Political manipulation and automated political persuasion where it is prohibited. Political content, where permitted at all, is subject to enhanced review.',
  'web.legal.aup.prohibited.rights':
    'Copyright, trademark and publicity violations, unlicensed music or media, synthetic likenesses without rights and disclosure, and undisclosed paid endorsements.',
  'web.legal.aup.prohibited.circumvention':
    'Bypassing official APIs, rate limits, audits, account controls or platform enforcement using browser automation, cookie replay or scraping.',
  'web.legal.aup.prohibited.restrictedStores':
    'Automated submission to app stores, the Chrome Web Store or other restricted submission systems through unauthorized interfaces.',
  'web.legal.aup.prohibited.banEvasion':
    'Evading an account ban or running coordinated account farms.',
  'web.legal.aup.prohibited.training':
    'Training or evaluating models on third party or other customers content without authorization.',
  'web.legal.aup.controls.title': 'The controls that enforce this',
  'web.legal.aup.controls.duplicate':
    'Exact and near duplicate fingerprinting by workspace, account, platform and time window, with a cross account similarity check.',
  'web.legal.aup.controls.cadence':
    'Account level and workspace level cadence budgets, plus mention, hashtag, URL and domain volume checks.',
  'web.legal.aup.controls.escalation':
    'New account, new domain and bulk action escalation, and a maximum number of repetitions for any repeating campaign.',
  'web.legal.aup.controls.linkSafety':
    'Destination scanning on short links, with emergency disable and an abuse report channel.',
  'web.legal.aup.controls.workspaceCaps':
    'A workspace owner can set stricter limits than the plan allows. Risk controls cannot be loosened by paying more.',
  'web.legal.aup.enforcement.title': 'Enforcement and appeal',
  'web.legal.aup.enforcement.body':
    'Where we can, we block before the external action rather than after it, and we record the reason, the rule version and the appeal path. Repeated or serious behaviour goes to a trust review by a person. You will be told what happened, without a level of detail that would help someone evade the check. Every decision can be appealed and reversed.',
  'web.legal.aup.report.title': 'Reporting abuse',
  'web.legal.aup.report.body':
    'If content published through Relay breaks these rules, tell us. Include the post URL and what is wrong with it.',

  /* AI policy ------------------------------------------------------------ */
  'web.legal.ai.title': 'AI Use and Generated Content Policy',
  'web.legal.ai.summary':
    'Which features use a model, what is sent, what is kept, what you stay responsible for, and why Relay does not generate media.',
  'web.legal.ai.features.title': 'Where a model is used',
  'web.legal.ai.features.text':
    'Text assistance in the composer: rewriting, shortening and adapting for a platform.',
  'web.legal.ai.features.translation':
    'Translation and transcreation into your content languages, against your brand glossary.',
  'web.legal.ai.features.feedback': 'Content feedback and the four week growth plan.',
  'web.legal.ai.features.provider':
    'These features call DeepSeek. The model identifiers currently in use are published in the documentation and any change is listed on the changelog.',
  'web.legal.ai.data.title': 'What is sent, and what happens to it',
  'web.legal.ai.data.sent':
    'Only the text you asked us to work on, the instruction, and the brand context you chose to attach. Credentials, tokens and other customers content are never in a model context.',
  'web.legal.ai.data.training':
    'Your content is not used to train our models. We configure providers so it is not used to train theirs.',
  'web.legal.ai.data.optOut':
    'Optional AI features can be turned off per workspace. Publishing, scheduling, approvals and analytics do not depend on them.',
  'web.legal.ai.responsibility.title': 'What stays yours',
  'web.legal.ai.responsibility.body':
    'A model can be confidently wrong. You are responsible for checking facts, claims, names, numbers and tone before you publish, and for any disclosure a platform requires. No AI feature guarantees reach, engagement or ranking, and none is offered as one.',
  'web.legal.ai.disclosure.title': 'Disclosure and provenance',
  'web.legal.ai.disclosure.body':
    'Relay records whether content was AI assisted in its internal history, reminds you where a platform requires an altered or synthetic media disclosure, and stores the provenance you provide with an imported asset. Where a platform offers a disclosure field, Relay sets it from your declaration rather than guessing.',
  'web.legal.ai.blocks.title': 'What the AI features refuse',
  'web.legal.ai.blocks.impersonation': 'Impersonating a real person or a public figure.',
  'web.legal.ai.blocks.ncii': 'Non consensual intimate imagery, in any form.',
  'web.legal.ai.blocks.fabrication':
    'Fabricated testimonials, invented customers and invented performance figures.',
  'web.legal.ai.blocks.unverified':
    'Presenting a model generated URL as a verified opportunity. Opportunity and tool recommendations come only from the curated catalog.',
  'web.legal.ai.noMedia.title': 'Why there is no image or video generation',
  'web.legal.ai.noMedia.body':
    'Relay has not collected the verified visual system, product detail, asset rights, likeness permissions and campaign context that brand ready output would require, and in app generation would need its own consent, provenance, safety evaluation and cost controls. Media model capability, licensing, pricing and retention also change quickly, which is why our tool recommendations carry dates. You keep creative control by choosing a specialist tool and importing the approved asset. Relay handles adaptation, approval, publishing and measurement.',
  'web.legal.ai.noMedia.caveat':
    'A tool appearing in our radar is not a statement that its output is safe or rights cleared. Its documented caveats are shown with it and your normal rights declaration still applies.',

  /* Cookies -------------------------------------------------------------- */
  'web.legal.cookies.title': 'Cookie Policy',
  'web.legal.cookies.summary':
    'What is stored in your browser, why, and what happens if you refuse the optional parts.',
  'web.legal.cookies.essential.title': 'Strictly necessary',
  'web.legal.cookies.essential.body':
    'A session cookie that keeps you signed in, a cross site request forgery token, and a preference cookie holding your theme and time zone choice. These cannot be turned off without breaking sign in, and they are not used for advertising.',
  'web.legal.cookies.analytics.title': 'Product analytics',
  'web.legal.cookies.analytics.body':
    'Aggregate, first party measurement of which screens are used, so we can fix the ones that are not working. It is optional, it is off until you allow it, and refusing it changes nothing about the product.',
  'web.legal.cookies.marketing.title': 'Advertising',
  'web.legal.cookies.marketing.body':
    'We do not run advertising cookies, we do not embed third party advertising pixels, and we do not sell or share personal information for cross context behavioural advertising.',
  'web.legal.cookies.shortLinks.title': 'Tracked short links',
  'web.legal.cookies.shortLinks.body':
    'A short link click creates first party analytics for the workspace that owns the link. Location and device data are minimized, bot traffic is classified out, IP addresses are truncated or discarded promptly, and a workspace can turn tracking off or shorten retention. Nothing sensitive is ever put in a slug or a query parameter.',
  'web.legal.cookies.control.title': 'Changing your mind',
  'web.legal.cookies.control.body':
    'The consent choice is stored with a version and can be changed at any time in Settings, under data controls. Withdrawing consent takes effect immediately.',

  /* Subprocessors -------------------------------------------------------- */
  'web.legal.subprocessors.title': 'Subprocessors',
  'web.legal.subprocessors.summary':
    'The companies that process customer data on our behalf, what they do, and where.',
  'web.legal.subprocessors.notice.title': 'Change notice',
  'web.legal.subprocessors.notice.body':
    'A new subprocessor is published here before it starts processing customer data, with at least 30 days notice for a change that materially affects processing. Customers with a data processing addendum can object during that window.',
  'web.legal.subprocessors.column.name': 'Subprocessor',
  'web.legal.subprocessors.column.purpose': 'What it processes for us',
  'web.legal.subprocessors.column.data': 'Data categories',
  'web.legal.subprocessors.column.region': 'Processing region',
  'web.legal.subprocessors.platforms.title': 'Social platforms are not subprocessors',
  'web.legal.subprocessors.platforms.body':
    'When you publish, Relay transmits your content to the platform account you selected, at your instruction. Those platforms are independent controllers of what they receive and their own terms govern it.',

  /* Refunds -------------------------------------------------------------- */
  'web.legal.refunds.title': 'Refund and Cancellation Policy',
  'web.legal.refunds.summary':
    'How to cancel, what happens to your data, and when you get money back.',
  'web.legal.refunds.cancel.title': 'Cancelling',
  'web.legal.refunds.cancel.body':
    'Cancel from Settings without contacting support. Cancelling during the seven day trial means no charge is attempted and the cancellation screen confirms that in writing. Cancelling after the trial keeps your access until the end of the period you already paid for.',
  'web.legal.refunds.refund.title': 'Refunds',
  'web.legal.refunds.refund.body':
    'If the service did not work as described, contact support and we will refund the affected period. Mandatory consumer withdrawal rights, including the statutory cooling off period where it applies to you, are honoured in full and are not limited by anything on this page. Refunds are issued by Polar, our merchant of record, to the original payment method.',
  'web.legal.refunds.usage.title': 'Platform usage charges',
  'web.legal.refunds.usage.body':
    'Usage passed through from a platform, such as X per operation pricing, covers a cost we already paid on your behalf for an action you confirmed. It is refundable when the charge was our error, for example a duplicate dispatch caused by a defect on our side.',
  'web.legal.refunds.data.title': 'What happens to your data',
  'web.legal.refunds.data.body':
    'Nothing is deleted at cancellation. The workspace becomes read only, scheduled posts stop rather than publishing, and you keep an export window before deletion. Deletion is never made conditional on paying an invoice, apart from the billing records we must keep by law.',
  'web.legal.refunds.failed.title': 'A failed payment',
  'web.legal.refunds.failed.body':
    'Polar retries and emails you. During the grace period publishing continues. After it, the workspace becomes read only and scheduled posts stop. Nothing is disconnected and nothing is deleted.',

  /* DMCA ----------------------------------------------------------------- */
  'web.legal.dmca.title': 'Copyright and Takedown',
  'web.legal.dmca.summary':
    'How to report content hosted by Relay that infringes your rights, and how to respond if yours was removed.',
  'web.legal.dmca.scope.title': 'What we can act on',
  'web.legal.dmca.scope.body':
    'Relay can remove material stored in our systems, such as a media file or a draft. Content already published on a social platform lives on that platform and has to be reported to it, because we cannot delete a post we do not host. We will tell you which of the two applies to your report.',
  'web.legal.dmca.notice.title': 'Sending a notice',
  'web.legal.dmca.notice.identify':
    'Identify the copyrighted work and the material you say infringes it, with a URL we can reach.',
  'web.legal.dmca.notice.contact': 'Give your name, address, telephone number and email.',
  'web.legal.dmca.notice.goodFaith':
    'State that you believe in good faith that the use is not authorized by the rights holder, its agent or the law.',
  'web.legal.dmca.notice.accuracy':
    'State that the information is accurate and, under penalty of perjury, that you are authorized to act for the rights holder.',
  'web.legal.dmca.notice.signature': 'Sign it, physically or electronically.',
  'web.legal.dmca.counter.title': 'Counter notice',
  'web.legal.dmca.counter.body':
    'If your material was removed and you believe that was a mistake or a misidentification, you can send a counter notice with the same contact details, identifying the material and where it was, and consenting to the jurisdiction that will be named here. We will forward it to the person who complained.',
  'web.legal.dmca.repeat.title': 'Repeat infringers',
  'web.legal.dmca.repeat.body':
    'Accounts that repeatedly infringe are suspended and then terminated. Bad faith notices, used to remove a competitor content, are also grounds for termination.',

  /* Security ------------------------------------------------------------- */
  'web.legal.security.title': 'Security and Responsible Disclosure',
  'web.legal.security.summary':
    'How Relay protects the credentials you trust it with, and how to report a problem you find.',
  'web.legal.security.tokens.title': 'Social credentials',
  'web.legal.security.tokens.body':
    'Platform tokens are encrypted with envelope encryption under a managed key, rotated, stored apart from content and billing data, and redacted from every log. A token is never sent to a browser, never placed in a model context and never included in an error message.',
  'web.legal.security.tenancy.title': 'Tenancy',
  'web.legal.security.tenancy.body':
    'Isolation is enforced three times: at the edge when you authenticate, in the application service when it authorizes the action, and in PostgreSQL through row level security. Being signed in is never treated as permission. Cross workspace access attempts are tested in continuous integration and must fail.',
  'web.legal.security.publishing.title': 'Publishing integrity',
  'web.legal.security.publishing.body':
    'Every external write carries an idempotency key and produces an immutable receipt. Duplicate publication is treated as a defect with a target of zero, and the test suite includes worker crashes after platform acceptance, platform timeouts, duplicated webhooks, revoked tokens at dispatch and daylight saving transitions.',
  'web.legal.security.program.title': 'The programme',
  'web.legal.security.program.threatModel':
    'A written threat model covering OAuth, tenancy, publishing, MCP, media, billing and analytics.',
  'web.legal.security.program.pentest':
    'An independent security review focused on token leakage and cross tenant access before paid launch.',
  'web.legal.security.program.access':
    'Least privilege production access, multi factor authentication, and a device and session inventory.',
  'web.legal.security.program.supplyChain':
    'Dependency and container scanning with patch service levels, and signed build provenance where practical.',
  'web.legal.security.program.logging':
    'Centralized logging that redacts by default, with anomaly alerting.',
  'web.legal.security.program.backups':
    'Encrypted backups with tested restoration and a documented rotation.',
  'web.legal.security.disclosure.title': 'Reporting a vulnerability',
  'web.legal.security.disclosure.body':
    'Email us with enough detail to reproduce the issue. We acknowledge within two business days, keep you updated, and credit you when you want the credit. Please do not access another customer data, degrade the service, or run automated scanning against production. Test against your own workspace.',
  'web.legal.security.disclosure.safeHarbor':
    'We will not pursue legal action for good faith research that follows this policy. The exact safe harbour wording is with counsel.',
  'web.legal.security.incidents.title': 'If something goes wrong',
  'web.legal.security.incidents.body':
    'We have an incident response plan with named decision makers, severity levels, evidence preservation and notification duties. Incidents that affected publishing are published on the status page with a timeline and what changed afterwards, including the ones we caused.',

  /* Accessibility -------------------------------------------------------- */
  'web.legal.accessibility.title': 'Accessibility Statement',
  'web.legal.accessibility.summary':
    'The standard Relay is built to, what we have verified, what we know is not right yet, and how to tell us.',
  'web.legal.accessibility.standard.title': 'The standard',
  'web.legal.accessibility.standard.body':
    'Relay targets WCAG 2.2 level AA across the product and this site. Accessibility is a merge requirement here, not a later ticket, and a screen that fails it does not ship.',
  'web.legal.accessibility.measures.title': 'What that means in practice',
  'web.legal.accessibility.measures.keyboard':
    'Everything is operable from the keyboard, with a visible focus ring and a logical focus order. There is no drag only interaction anywhere.',
  'web.legal.accessibility.measures.contrast':
    'Every colour pair in the design system is asserted at 4.5 to 1 for body text and 3 to 1 for large text and control edges, in both the light and the dark theme, by an automated test.',
  'web.legal.accessibility.measures.colour':
    'Status, capability and freshness always carry an icon and a word as well as a colour.',
  'web.legal.accessibility.measures.announcements':
    'Save state, validation changes, upload progress, schedule confirmation and publish results are announced to screen readers.',
  'web.legal.accessibility.measures.zoom':
    'Layouts work at 320 pixels wide and at 200 percent zoom without horizontal page scrolling. Wide tables scroll inside their own container.',
  'web.legal.accessibility.measures.motion':
    'A reduced motion preference removes every non essential transition.',
  'web.legal.accessibility.measures.targets':
    'Touch targets are at least 44 pixels on a coarse pointer.',
  'web.legal.accessibility.known.title': 'Known gaps',
  'web.legal.accessibility.known.body':
    'We will list specific known issues here with a fix date as they are found, rather than claiming full conformance. An independent audit is planned before general availability and its findings will be published here.',
  'web.legal.accessibility.feedback.title': 'Tell us about a barrier',
  'web.legal.accessibility.feedback.body':
    'Describe what you were trying to do, the page, and the assistive technology you use. We reply within five business days and will offer another way to complete the task while we fix it.',

  /* API and MCP terms ---------------------------------------------------- */
  'web.legal.apiTerms.title': 'API and MCP Terms',
  'web.legal.apiTerms.summary':
    'Additional terms for programmatic access, including agent credentials, rate limits and what a service account may never do.',
  'web.legal.apiTerms.credentials.title': 'Credentials',
  'web.legal.apiTerms.credentials.body':
    'An API key or agent credential identifies a scoped service account. It is not a copy of a person account and it never inherits their full permissions. Keys are shown once, are revocable at any time, and must not be embedded in a client application or a public repository.',
  'web.legal.apiTerms.scopes.title': 'Scopes',
  'web.legal.apiTerms.scopes.body':
    'Reading, drafting, requesting approval, scheduling, publishing immediately, cancelling, analytics and billing are separate scopes. Request the smallest set the integration needs. Immediate publishing and other high risk actions require explicit human confirmation by default and that default is set per workspace, not per credential.',
  'web.legal.apiTerms.limits.title': 'Rate limits and idempotency',
  'web.legal.apiTerms.limits.body':
    'Every write requires an idempotency key. Replaying a request with the same key returns the original result. Rate limits are published in the documentation and are returned in the response headers, and a limit response tells you when it resets.',
  'web.legal.apiTerms.agents.title': 'Agent behaviour',
  'web.legal.apiTerms.agents.body':
    'A single call may not silently publish to every connected account. Bulk actions, a new domain, a new account, a sensitive category, a paid endorsement, a privacy change or content altered after approval always escalate for a human decision. Every agent and every workspace has a kill switch.',
  'web.legal.apiTerms.prohibited.title': 'Not permitted through the API',
  'web.legal.apiTerms.prohibited.body':
    'Reselling access without a written agreement, using Relay as a relay for content you are not authorized to publish, circumventing approval policy, and any use that breaks the Acceptable Use Policy. Programmatic access is subject to the same anti spam controls as the web app.',
  'web.legal.apiTerms.changes.title': 'Change policy',
  'web.legal.apiTerms.changes.body':
    'Additive changes ship without notice. Breaking changes get a new version, an announced deprecation window and a migration note on the changelog. Error codes do not change meaning within a version.',

  /* Affiliate terms ------------------------------------------------------ */
  'web.legal.affiliate.title': 'Affiliate and Creator Terms',
  'web.legal.affiliate.summary':
    'What we pay, what we require, and what will get an account closed.',
  'web.legal.affiliate.commission.title': 'Commission',
  'web.legal.affiliate.commission.body':
    'Recurring commission on referred subscriptions for up to twelve months, subject to fraud review. Commission is held until the refund window closes and is reversed if the customer refunds. Payouts run through Polar.',
  'web.legal.affiliate.disclosure.title': 'Disclosure is not optional',
  'web.legal.affiliate.disclosure.body':
    'Every place you share a referral link must disclose the commercial relationship clearly and close to the link, in the language of the audience. This applies to videos, posts, newsletters, articles and community replies alike.',
  'web.legal.affiliate.honesty.title': 'Paid for work, not for praise',
  'web.legal.affiliate.honesty.body':
    'A sponsored tutorial contract never requires a positive conclusion. You may publish criticism and still be paid. We do not buy reviews, votes, ratings or installs, and we do not offer an incentive conditional on a positive review.',
  'web.legal.affiliate.prohibited.title': 'Grounds for closing an affiliate account',
  'web.legal.affiliate.prohibited.brandBidding':
    'Bidding on our brand terms in paid search, or running ads that imply you are us.',
  'web.legal.affiliate.prohibited.spam':
    'Unsolicited email, mass community posting, or link dropping in threads that did not ask.',
  'web.legal.affiliate.prohibited.cookieStuffing':
    'Cookie stuffing, forced clicks, self referral and coupon squatting.',
  'web.legal.affiliate.prohibited.claims':
    'Inventing customer results, fabricating a testimonial, or claiming Relay does something it does not, including anything about AI media generation.',
  'web.legal.affiliate.prohibited.trademark':
    'Registering a domain, handle or app listing that uses our name in a way that suggests you are the company.',

  /* ---------------------------------------------------------------------- */
  /* Platform names and per platform facts                                   */
  /* ---------------------------------------------------------------------- */

  'web.marketing.provider.x.label': 'X',
  'web.marketing.provider.linkedin.label': 'LinkedIn',
  'web.marketing.provider.instagram.label': 'Instagram',
  'web.marketing.provider.facebook.label': 'Facebook',
  'web.marketing.provider.youtube.label': 'YouTube',
  'web.marketing.provider.tiktok.label': 'TikTok',
  'web.marketing.provider.threads.label': 'Threads',
  'web.marketing.provider.bluesky.label': 'Bluesky',

  'web.marketing.provider.x.accountTypes':
    'Un compte X personnel ou professionnel que vous contrôlez.',
  'web.marketing.provider.x.restriction':
    'La publication automatisée nécessite le consentement exprès du titulaire du compte, que Relay enregistre. Les publications en double ou substantiellement similaires sur plusieurs comptes ne sont pas autorisées et les réponses automatisées non sollicitées ne sont pas créées.',
  'web.marketing.provider.x.cost':
    "X facture chaque opération d'API et facture davantage pour une publication contenant une URL. Relay estime le coût avant de le confirmer et le transmet sans majoration.",

  'web.marketing.provider.linkedin.accountTypes':
    "Un profil de membre ou une page d'organisation dans laquelle vous occupez le bon rôle.",
  'web.marketing.provider.linkedin.restriction':
    "La publication au nom d’une organisation nécessite un produit de gestion de communauté approuvé et une identité commerciale vérifiée. L'analyse des publications des membres dépend d'une autorisation de lecture. LinkedIn a été fermé aux nouvelles candidatures, donc Relay ne la proposera pas.",
  'web.marketing.provider.linkedin.cost':
    'Pas de frais par opération. Des limites quotidiennes d’inscription et de membre s’appliquent.',

  'web.marketing.provider.instagram.accountTypes':
    'Un compte Instagram professionnel, entreprise ou créateur.',
  'web.marketing.provider.instagram.restriction':
    "La publication de contenu Instagram est disponible pour les comptes professionnels uniquement. Un compte consommateur ne peut être publié par aucune application, y compris celle-ci. La publication utilise le conteneur et la séquence de publication officiels, et Relay confirme l'état final plutôt que de signaler le téléchargement comme un succès.",
  'web.marketing.provider.instagram.cost':
    "Pas de frais par opération. L'examen de la méta-application et la vérification de l'entreprise sont requis.",

  'web.marketing.provider.facebook.accountTypes': 'Une page Facebook que vous administrez.',
  'web.marketing.provider.facebook.restriction':
    "La cible de publication est une page. L'automatisation d'un profil personnel n'est pas proposée par l'API et Relay ne la tente pas.",
  'web.marketing.provider.facebook.cost':
    "Pas de frais par opération. L'examen de la méta-application et la vérification de l'entreprise sont requis.",

  'web.marketing.provider.youtube.accountTypes':
    'Une chaîne YouTube connectée via votre compte Google.',
  'web.marketing.provider.youtube.restriction':
    "Un projet qui n'a pas réussi l'audit de conformité de l'API Google ne peut être téléchargé qu'en tant que projet privé. Relay ne décrira pas le téléchargement public comme disponible jusqu'à ce que cet audit soit réussi, et l'écran de connexion indique dans quel état vos téléchargements atterriront.",
  'web.marketing.provider.youtube.cost':
    "Pas de frais par opération. Un quota quotidien s'applique et ne peut pas être partagé entre les projets.",

  'web.marketing.provider.tiktok.accountTypes': 'Un compte TikTok avec autorisation Direct Post.',
  'web.marketing.provider.tiktok.restriction':
    "Jusqu'à ce que l'audit de l'API de publication de contenu soit réussi, les publications restent privées et des plafonds par compte s'appliquent. Au moment de la publication, Relay récupère les informations actuelles du créateur, affiche les options de confidentialité disponibles sans en présélectionner une, et demande les paramètres de commentaire, de duo et de point ainsi que la déclaration de contenu commercial.",
  'web.marketing.provider.tiktok.cost':
    'Pas de frais par opération. Le mode non audité applique des plafonds de publication quotidiens.',

  'web.marketing.provider.threads.accountTypes':
    'Un profil Threads lié à un compte professionnel Instagram.',
  'web.marketing.provider.threads.restriction':
    'La publication suit le conteneur Meta et la séquence de publication. Les capacités sont vérifiées par rapport à la collection officielle avant que quoi que ce soit ici soit appelé pris en charge.',
  'web.marketing.provider.threads.cost': 'Pas de frais par opération.',

  'web.marketing.provider.bluesky.accountTypes': 'Un compte Bluesky sur n’importe quel hébergeur.',
  'web.marketing.provider.bluesky.restriction':
    "Un protocole ouvert sans étape d’examen des candidatures. Les limites de débit et de taille d'enregistrement s'appliquent toujours et sont appliquées avant l'expédition.",
  'web.marketing.provider.bluesky.cost': 'Pas de frais par opération.',
  'web.marketing.provider.mastodon.label': 'Mastodon',
  'web.marketing.provider.mastodon.accountTypes':
    'Un compte Mastodon sur n’importe quelle instance.',
  'web.marketing.provider.mastodon.restriction':
    'Un protocole ouvert sans étape de revue d’application. La limite de caractères est fixée par chaque instance et ses limites de rythme sont respectées.',
  'web.marketing.provider.mastodon.cost': 'Pas de frais par opération.',
  'web.marketing.provider.telegram.label': 'Telegram',
  'web.marketing.provider.telegram.accountTypes':
    'Un bot Telegram que vous contrôlez, publiant dans un canal ou un groupe.',
  'web.marketing.provider.telegram.restriction':
    'Un bot ne publie que là où il a été ajouté. Le jeton est une identifiants d’application et le chat cible est choisi par connexion.',
  'web.marketing.provider.telegram.cost': 'Pas de frais par opération.',
  'web.marketing.provider.reddit.label': 'Reddit',
  'web.marketing.provider.reddit.accountTypes': 'Un compte Reddit autorisé à publier.',
  'web.marketing.provider.reddit.restriction':
    'Écrire sur Reddit exige une application approuvée. Les publications sont des posts texte ou lien dans les subreddits autorisés ; aucun commentaire ni vote automatique.',
  'web.marketing.provider.reddit.cost': 'Pas de frais par opération.',
  'web.marketing.provider.wordpress.label': 'WordPress',
  'web.marketing.provider.wordpress.accountTypes':
    'Un site WordPress avec un mot de passe d’application.',
  'web.marketing.provider.wordpress.restriction':
    'Les publications sortent par l’API REST du site en tant qu’utilisateur connecté. L’upload d’images et de vidéos n’est pas encore construit.',
  'web.marketing.provider.wordpress.cost': 'Pas de frais par opération.',
  'web.marketing.provider.medium.label': 'Medium',
  'web.marketing.provider.medium.accountTypes': 'Un profil d’auteur Medium connecté via OAuth.',
  'web.marketing.provider.medium.restriction':
    'Les publications sortent en histoires publiques en Markdown. L’API d’intégration n’a pas de suppression, donc elle n’est pas offerte.',
  'web.marketing.provider.medium.cost': 'Pas de frais par opération.',
  'web.marketing.provider.devto.label': 'Dev.to',
  'web.marketing.provider.devto.accountTypes': 'Un profil Dev.to connecté avec sa clé API.',
  'web.marketing.provider.devto.restriction':
    'Les articles sortent en posts Markdown publics. L’upload d’images et les analyses ne sont pas encore construits.',
  'web.marketing.provider.devto.cost': 'Pas de frais par opération.',
  'web.marketing.provider.pinterest.label': 'Pinterest',
  'web.marketing.provider.pinterest.accountTypes':
    'Un compte professionnel Pinterest connecté via OAuth.',
  'web.marketing.provider.pinterest.restriction':
    'Un pin exige une image et un tableau qui vous appartient. Écrire exige une revue d’application et les tableaux sont lus à la connexion.',
  'web.marketing.provider.pinterest.cost': 'Pas de frais par opération.',
  'web.marketing.provider.discord.label': 'Discord',
  'web.marketing.provider.discord.accountTypes':
    'Un bot Discord que vous contrôlez, publiant dans des canaux texte.',
  'web.marketing.provider.discord.restriction':
    'Le bot ne publie que dans les canaux qu’il voit. Les messages texte sont pris en charge ; les pièces jointes pas encore.',
  'web.marketing.provider.discord.cost': 'Pas de frais par opération.',
  'web.marketing.provider.slack.label': 'Slack',
  'web.marketing.provider.slack.accountTypes': 'Un espace Slack connecté via une app OAuth.',
  'web.marketing.provider.slack.restriction':
    'Les messages sortent vers les canaux publics et privés où se trouve l’app. L’upload de fichiers et les analyses ne sont pas encore construits.',
  'web.marketing.provider.slack.cost': 'Pas de frais par opération.',

  /* ---------------------------------------------------------------------- */
  /* Capability matrix notes                                                 */
  /* ---------------------------------------------------------------------- */

  'web.capabilities.short.supported': 'Soutenu',
  'web.capabilities.short.unsupported': 'La plateforme ne le propose pas',
  'web.capabilities.short.not_implemented': 'Pas encore construit',
  'web.capabilities.short.requires_review': 'Nécessite une révision de la plateforme',
  'web.capabilities.notesTitle': 'Notes et sources',
  'web.capabilities.noteRef': 'Note {number}',
  'web.capabilities.summary':
    "{supported, plural, one {# capacité prise en charge} many {# fonctionnalités prises en charge} other {# fonctionnalités prises en charge}}, {requiresReview, plural, one {# en attente d'un examen de la plateforme} many {# en attente d'un examen de la plateforme} other {# en attente d'un examen de la plateforme}}, {notImplemented, plural, one {# pas encore construit} many {# pas encore construit} other {# pas encore construit}}, {unsupported, plural, one {# la plateforme ne propose pas} many {# la plateforme ne propose pas} other {# la plateforme ne propose pas}}.",
  'web.capabilities.buildState.title': 'Aucun connecteur ne transporte encore le trafic client',
  'web.capabilities.buildState.body':
    "Relay est en cours de construction. Ce tableau reflète les définitions de connecteur telles qu'elles existent aujourd'hui, c'est pourquoi la plupart des cellules se lisent comme n'ayant pas encore été construites. Une cellule n'est prise en charge qu'une fois que ce connecteur a réussi sa définition de terminé, y compris les tests contractuels par rapport aux appareils de plate-forme enregistrés. Les cellules qui indiquent qu'une plate-forme n'offre pas quelque chose, ou la bloque derrière un avis, sont des faits sur la plate-forme et sont déjà définitives.",
  'web.capabilities.note.instagramProfessional':
    'Comptes professionnels uniquement. Un compte consommateur ne peut être publié par aucune application.',
  'web.capabilities.note.facebookPagesOnly':
    "Pages seulement. L'API ne publie pas sur un profil personnel.",
  'web.capabilities.note.youtubeAudit':
    "Jusqu'à ce que l'audit de conformité de l'API Google soit réussi, télécharge le terrain comme privé.",
  'web.capabilities.note.tiktokAudit':
    "Jusqu'à ce que l'audit de l'API de publication de contenu soit réussi, les publications restent privées et plafonnées.",
  'web.capabilities.note.tiktokPrivacy':
    "L'option de confidentialité est récupérée au moment de la publication et doit être choisie par une personne.",
  'web.capabilities.note.linkedinMemberAnalytics':
    'Les analyses des publications des membres nécessitent une autorisation de lecture. LinkedIn est fermé aux nouvelles candidatures.',
  'web.capabilities.note.linkedinOrgAccess':
    'Nécessite un produit de gestion de communauté approuvé et une entreprise vérifiée.',
  'web.capabilities.note.linkedinDocuments':
    'LinkedIn est la seule plateforme connectée avec un type de publication de document.',
  'web.capabilities.note.metaReview':
    "Nécessite un examen de l'application Meta et une vérification commerciale.",
  'web.capabilities.note.xConsent':
    'Nécessite le consentement enregistré du titulaire du compte pour la publication automatisée.',
  'web.capabilities.note.xDisclosure':
    'La plateforme fournit un champ made with AI, que Relay définit à partir de votre déclaration.',
  'web.capabilities.note.noDestinations':
    "Cette plateforme n'a pas de concept de destination tel qu'une page, un tableau ou une communauté.",
  'web.capabilities.note.noThreads': "Cette plateforme n'a pas de séquence multi-post native.",
  'web.capabilities.note.noDocuments':
    "Cette plateforme n'a pas de type de publication de document.",
  'web.capabilities.note.videoOnly':
    'Cette plateforme accepte uniquement les téléchargements de vidéos.',
  'web.capabilities.note.noAltText':
    "Cette plateforme n'accepte pas le texte alternatif via son API de publication.",
  'web.capabilities.note.noPrivacyChoice':
    "Cette plateforme n'offre pas d'option de confidentialité par publication via son API.",
  'web.capabilities.note.noThumbnail':
    "Cette plateforme n'accepte pas de vignette personnalisée via son API.",
  'web.capabilities.note.inBuild': 'La plateforme propose cela. Relay ne l’a pas encore expédié.',
  'web.capabilities.note.noCarousel': 'La plateforme n’offre pas de carrousel balayable.',
  'web.capabilities.note.noDisclosure':
    'La plateforme n’a pas de champ de divulgation pour le contenu IA ou commercial.',
  'web.capabilities.note.noAnalytics':
    'La plateforme n’expose pas de métriques d’engagement via son API officielle.',
  'web.capabilities.note.redditReview':
    'Écrire sur Reddit exige une application approuvée pour l’API de données.',
  'web.capabilities.note.redditMedia':
    'Les posts image et vidéo ne sont pas encore construits pour Reddit.',
  'web.capabilities.note.mediumImages':
    'L’API d’intégration n’accepte pas de pièces jointes d’image.',
  'web.capabilities.note.mediumNoDelete': 'L’API d’intégration n’a pas d’endpoint de suppression.',
  'web.capabilities.note.devtoImages':
    'L’API n’accepte que les corps d’article ; l’upload d’images n’est pas encore construit.',
  'web.capabilities.note.pinterestNeedsImage':
    'Un pin exige une image ; les pins texte seul n’existent pas.',
  'web.capabilities.note.pinterestReview':
    'Écrire sur Pinterest exige un accès d’application approuvé.',

  /* ---------------------------------------------------------------------- */
  /* Status page surfaces                                                    */
  /* ---------------------------------------------------------------------- */

  'web.status.surface.web': 'Application Web',
  'web.status.surface.api': 'API REST',
  'web.status.surface.mcp': 'Serveur MCP',
  'web.status.surface.cli': 'CLI',
  'web.status.surface.webhooks': 'Livraison de webhooks',
  'web.status.surface.publishing': "Travailleurs de l'édition",
  'web.status.surface.media': 'Traitement des médias',
  'web.status.surface.analytics': "Collecte d'analyses",
  'web.status.surface.links': 'Redirections de liens courts',
  'web.status.surface.checkout': 'Paiement et facturation',
  'web.status.preLaunch.title': 'Relay n’est pas encore disponible pour tous.',
  'web.status.preLaunch.body':
    "Cette page est active avant le produit, de sorte que l'habitude de reporting existe dès le premier client plutôt que d'être ajoutée après la première panne. Les surfaces encore en construction sont marquées comme telles au lieu d'être affichées comme saines.",

  /* ---------------------------------------------------------------------- */
  /* Comparison targets                                                      */
  /* ---------------------------------------------------------------------- */

  'web.compare.product.postiz': 'Postez',
  'web.compare.product.buffer': 'Tampon',
  'web.compare.product.hootsuite': 'Suite Hoot',
  'web.compare.product.later': 'Plus tard',
  'web.compare.product.metricool': 'Métricool',
  'web.compare.product.publer': 'Editeur',
  'web.compare.product.socialbee': 'Abeille Sociale',
  'web.compare.product.typefully': 'Typiquement',
  'web.compare.product.publishingApis': 'API de publication pour développeurs',
  'web.compare.state.factCheckPending': 'Vérification des faits en cours',

  /* ---------------------------------------------------------------------- */
  /* Tool radar categories                                                   */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.category.video': 'Génération et montage vidéo',
  'web.toolRadar.category.image': "Génération et édition d'images",
  'web.toolRadar.category.audio': 'Audio, voix et musique',
  'web.toolRadar.category.ugc': 'Vidéo de style avatar et créateur',
  'web.toolRadar.category.clipping': 'Vidéo longue à clips courts',
  'web.toolRadar.category.design': 'Conception et mise en page',
  'web.toolRadar.category.research': 'Recherche et collecte de sources',
  'web.toolRadar.category.workflow': 'Automatisation du flux de travail',

  /* ---------------------------------------------------------------------- */
  /* Opportunity categories                                                  */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.category.launch': 'Annuaires de lancement de produits et de démarrage',
  'web.opportunities.category.review': 'Répertoires de logiciels et de critiques',
  'web.opportunities.category.marketplace': "Marchés d'intégration et d'automatisation",
  'web.opportunities.category.community':
    'Discussions de présentation de la communauté qui permettent les soumissions',
  'web.opportunities.category.partner': "Écosystèmes partenaires et annuaires d'intégration",
  'web.opportunities.category.editorial': 'Tutoriels invités, podcasts et newsletters',
  'web.opportunities.category.openSource': 'Listes open source et ressources de documentation',

  /* ---------------------------------------------------------------------- */
  /* Subprocessors and retention                                             */
  /* ---------------------------------------------------------------------- */

  'web.legal.subprocessors.supabase.label': 'Supabase',
  'web.legal.subprocessors.supabase.purpose':
    'Managed PostgreSQL, authentication and object storage.',
  'web.legal.subprocessors.supabase.data':
    'Account records, content, media, schedules, receipts and audit events.',
  'web.legal.subprocessors.temporal.label': 'Temporal Cloud',
  'web.legal.subprocessors.temporal.purpose':
    'Durable execution of publishing, retry and scheduling workflows.',
  'web.legal.subprocessors.temporal.data':
    'Workflow inputs limited to identifiers and minimized payloads.',
  'web.legal.subprocessors.polar.label': 'Polar',
  'web.legal.subprocessors.polar.purpose':
    'Merchant of record: checkout, subscriptions, taxes, invoices and refunds.',
  'web.legal.subprocessors.polar.data':
    'Name, email, billing address, payment method held by Polar, and subscription state.',
  'web.legal.subprocessors.deepseek.label': 'DeepSeek',
  'web.legal.subprocessors.deepseek.purpose':
    'Text assistance, translation and transcreation, and planning suggestions.',
  'web.legal.subprocessors.deepseek.data':
    'Only the text you submit to an AI feature and the brand context you attached to it.',
  'web.legal.subprocessors.hosting.label': 'Application hosting and content delivery',
  'web.legal.subprocessors.hosting.purpose':
    'Serving the web app, the API and the short link service.',
  'web.legal.subprocessors.hosting.data': 'Request metadata and redacted logs.',
  'web.legal.subprocessors.email.label': 'Transactional email delivery',
  'web.legal.subprocessors.email.purpose':
    'Sign in links, approval requests, publish result notifications and trial reminders.',
  'web.legal.subprocessors.email.data': 'Name, email address and the message content.',
  'web.legal.subprocessors.monitoring.label': 'Error and performance monitoring',
  'web.legal.subprocessors.monitoring.purpose':
    'Diagnosing failures in publishing and in the interface.',
  'web.legal.subprocessors.monitoring.data':
    'Redacted stack traces, request identifiers and workspace identifiers. Post content is stripped.',
  'web.legal.subprocessors.region.pending': 'Region being confirmed',
  'web.legal.subprocessors.vendorPending': 'Vendor being selected',

  'web.legal.retention.column.data': 'Data',
  'web.legal.retention.column.period': 'How long it is kept',
  'web.legal.retention.credentials.label': 'Active platform credentials',
  'web.legal.retention.credentials.period':
    'Encrypted while the connection is active. Revoked at the platform and deleted here as soon as you disconnect.',
  'web.legal.retention.oauthState.label': 'OAuth transaction state',
  'web.legal.retention.oauthState.period': 'Minutes, then deleted.',
  'web.legal.retention.drafts.label': 'Drafts and media',
  'web.legal.retention.drafts.period':
    'While the account is active, or your own retention setting, with a trash grace period.',
  'web.legal.retention.receipts.label': 'Publication receipts and audit events',
  'web.legal.retention.receipts.period':
    'Kept for the plan and legal retention period, minimized, and exportable at any time.',
  'web.legal.retention.rawProvider.label': 'Raw platform responses',
  'web.legal.retention.rawProvider.period':
    'The shortest period needed for debugging and compliance, then minimized or deleted.',
  'web.legal.retention.metrics.label': 'Analytics observations',
  'web.legal.retention.metrics.period':
    'The plan retention period, within what the platform terms allow.',
  'web.legal.retention.securityLogs.label': 'Security logs',
  'web.legal.retention.securityLogs.period':
    'A fixed window between 30 and 180 days depending on the risk of the event.',
  'web.legal.retention.billing.label': 'Billing records',
  'web.legal.retention.billing.period':
    'The statutory accounting retention period, held by Polar and by us.',
  'web.legal.retention.deletedAccount.label': 'A deleted account',
  'web.legal.retention.deletedAccount.period':
    'Credentials revoked and scheduled work cancelled immediately. Full deletion completes within the published window, apart from lawful billing records.',
  'web.legal.retention.backups.label': 'Backups',
  'web.legal.retention.backups.period':
    'Encrypted and access controlled, expiring on a documented rotation. A deletion propagates through the restore process.',

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.footer.product': 'Produit',
  'web.footer.company': 'Entreprise',
  'web.footer.resources': 'Ressources',
  'web.footer.legal': 'Légal',
  'web.footer.developers': 'Développeurs',
  'web.footer.statement':
    'Relay publie uniquement via les API de la plateforme officielle. La disponibilité du connecteur dépend des approbations contrôlées par les plates-formes, et chaque revendication de capacité sur ce site est datée et sourcée.',
  'web.footer.noAffiliation':
    'Les noms et marques des plateformes appartiennent à leurs propriétaires. Leur utilisation ici identifie un connecteur et n’implique aucune approbation ou partenariat.',
  'web.footer.copyright': 'Relay {year}',
} as const;
