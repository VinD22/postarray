export const webDemoMessages = {
  /* ---------------------------------------------------------------------- */
  /* Métadonnées et navigation                                              */
  /* ---------------------------------------------------------------------- */

  'web.meta.demo.title': 'Voyez comment ça marche',
  'web.meta.demo.description':
    "Une visite guidée du flux de publication, d'un nouveau projet jusqu'au reçu, montrée dans l'interface réelle avec du contenu d'exemple. Rien n'est encore publié, et la visite dit où se trouve cette limite.",

  'web.demo.nav.label': 'Voir comment ça marche',
  'web.demo.nav.summary':
    "Une visite guidée du produit dans l'ordre où vous le découvrez, construite à partir de l'interface réelle avec du contenu d'exemple.",

  /* ---------------------------------------------------------------------- */
  /* Le cadre dans lequel s'inscrit chaque panneau de démonstration        */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': 'Démonstration',
  'web.demo.frame.sample':
    "Une démonstration construite à partir de l'interface réelle, remplie de contenu d'exemple pour une entreprise qui n'existe pas. Pas un compte réel. Rien ici n'envoie quoi que ce soit.",

  'web.demo.control.pause': 'Mettre la démonstration en pause',
  'web.demo.control.play': 'Lancer la démonstration',
  'web.demo.control.replay': 'Rejouer la démonstration',

  /* ---------------------------------------------------------------------- */
  /* La démonstration en vedette sur la page d'accueil                     */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.viewCta': 'Voir la démo',
  'web.demo.hero.projectsLine':
    'Un seul compte gère plusieurs activités. Chaque projet est une activité à part entière, avec ses propres comptes connectés, son propre calendrier et ses propres validations, et vous passez de l\'un à l\'autre depuis un seul menu, comme on change de propriété dans une console de recherche.',
  'web.demo.hero.projectsChip': '{count, plural, one {# compte} many {# comptes} other {# comptes}}',
  'web.demo.hero.caption':
    "Un brouillon devient une version par plateforme, reçoit un horaire et atterrit dans la semaine. Contenu d'exemple, pas un compte réel.",
  'web.demo.hero.more': 'Parcourir tout le flux de travail',

  /* ---------------------------------------------------------------------- */
  /* La page de la visite                                                   */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': "Comment ça marche, dans l'ordre où vous le découvrez",
  'web.demo.lede':
    "Neuf étapes, d'un workspace vide jusqu'au registre de ce qui s'est passé. Chacune montre la surface que vous regarderiez réellement, avec du contenu d'exemple dedans.",
  'web.demo.notice.title': 'Ceci est une démonstration, pas un compte réel',
  'web.demo.notice.body':
    "Chaque panneau ici est l'interface du produit avec du contenu d'exemple. Aucun connecteur n'a terminé la vérification du fournisseur, rien n'est donc publié sur aucune plateforme via ce produit aujourd'hui. Là où le flux de travail s'arrête, la page le dit plutôt que de dessiner le reste.",
  'web.demo.contents.title': 'Les neuf étapes',
  'web.demo.stepLabel': 'Étape {position} sur {total}',
  'web.demo.next': 'Suivant : {step}',
  'web.demo.closing.pricing': 'Voyez ce que cela coûte',
  'web.demo.closing.title': "C'est toute la boucle",
  'web.demo.closing.body':
    "Rien ci-dessus n'est une maquette d'un produit que nous espérons construire. C'est l'interface telle qu'elle est, avec la moitié publication honnêtement marquée comme inachevée.",

  /* ---------------------------------------------------------------------- */
  /* Les neuf étapes                                                         */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': 'Créer un projet',
  'web.demo.step.project.body':
    "Un projet contient des comptes, des brouillons, des approbations et un fuseau horaire. Chaque requête dans le produit est limitée à l'un d'eux, dans le service applicatif et à nouveau dans la base de données, pour qu'un client ne puisse pas voir un autre client par accident.",

  'web.demo.step.connect.title': 'Connecter un compte',
  'web.demo.step.connect.body':
    "La connexion passe uniquement par les API officielles de la plateforme, et vous dit ce que la plateforme exige du compte avant de commencer. Aujourd'hui, chaque connecteur s'arrête à la vérification, c'est pourquoi chaque ligne ci-dessous le dit plutôt que de montrer une coche verte.",

  'web.demo.step.compose.title': 'Écrivez une fois, adaptez par plateforme',
  'web.demo.step.compose.body':
    "Vous écrivez un brouillon maître. Sélectionner un compte ouvre une substitution pour ce compte seul, avec ses propres limites et son propre aperçu. Rien de ce que vous écrivez pour LinkedIn ne change ce que reçoit X, et les vérifications de chaque version s'exécutent avant que quoi que ce soit soit planifié.",
  'web.demo.step.variants.title': 'Voyez ce que chaque compte reçoit réellement',
  'web.demo.step.variants.body':
    "Un brouillon devient une version par compte, chacune écrite pour la plateforme à laquelle elle est destinée : une ligne plus courte pour X, la note de version complète pour LinkedIn, une légende et un texte alternatif pour Instagram. Vous modifiez l'une d'elles sans toucher aux autres, et chaque version porte la vérification qui la concerne.",

  'web.demo.step.schedule.title': 'Donnez-lui un horaire, ou remettez-le à la file',
  'web.demo.step.schedule.body':
    "Un horaire est stocké comme un instant plus le fuseau horaire du projet, jamais comme une heure locale naïve, donc un changement d'heure d'été ne déplace rien sous vos pieds. La file est l'autre chemin : elle prend le prochain créneau autorisé par les règles que vous avez définies.",

  'web.demo.step.calendar.title': 'Observez le calendrier',
  'web.demo.step.calendar.body':
    "La semaine montre la plateforme, le compte, l'état et l'horaire de chaque publication. Déplacer une publication se fait aussi bien par un bouton que par un glisser-déposer, le calendrier est donc entièrement utilisable au clavier.",

  'web.demo.step.receipt.title': 'Lisez le reçu ensuite',
  'web.demo.step.receipt.body':
    "Chaque tentative écrit un reçu immuable : qui l'a écrit, qui l'a approuvé, sous quelle politique, à quel instant. La moitié publication de ce registre est écrite par l'exécution de publication, la partie qui n'existe pas encore.",

  /* ---------------------------------------------------------------------- */
  /* Étiquettes des panneaux                                               */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': 'Projet',
  'web.demo.project.zone': 'Fuseau horaire : {zone}',
  'web.demo.project.scope':
    'Les brouillons, comptes, approbations et reçus appartiennent à ce projet et nulle part ailleurs.',

  'web.demo.accounts.label': 'Comptes de ce projet',
  'web.demo.accounts.state': 'Vérification non terminée',
  'web.demo.accounts.note':
    "Chaque ligne afficherait la santé du jeton, les permissions accordées et la dernière publication envoyée avec succès. Aucune ne peut publier aujourd'hui.",

  'web.demo.master.label': 'Brouillon maître',
  'web.demo.master.project': 'Dans le projet {project}',

  'web.demo.variants.label': 'Ce que reçoit chaque compte',

  'web.demo.schedule.label': 'Planifié',
  'web.demo.schedule.value': '{when} en {zone}',
  'web.demo.schedule.approval':
    'Une approbation est requise avant que quoi que ce soit puisse être envoyé.',
  'web.demo.schedule.queue':
    "La file est l'autre chemin : elle choisit le prochain créneau autorisé par vos règles, dans ce fuseau horaire.",

  'web.demo.week.label': 'La semaine',
  'web.demo.week.caption':
    'Les mêmes trois publications sur le calendrier, lues dans le fuseau horaire du projet.',
  'web.demo.week.empty': 'Rien de planifié',

  'web.demo.receipt.label': "Reçu jusqu'à présent",
  'web.demo.receipt.pending':
    "Ce qui a été envoyé, ce qu'a répondu la plateforme, l'identifiant externe de publication et le lien permanent sont écrits par l'exécution de publication. Ils restent indisponibles jusqu'à ce qu'un connecteur termine la vérification du fournisseur.",
  'web.demo.receipt.field.externalId': 'Identifiant externe de publication',
  'web.demo.receipt.field.permalink': 'Lien permanent',

  /* ---------------------------------------------------------------------- */
  /* Contenu d'exemple                                                      */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools (exemple)',
  'web.demo.sample.actor': "Ada, coéquipière d'exemple",
  'web.demo.sample.approver': "Ravi, réviseur d'exemple",
  'web.demo.sample.policy': "Une approbation avant l'envoi",
  'web.demo.sample.master':
    "Northbound 2.4 est sorti aujourd'hui. Les imports sont plus rapides, la recherche a un raccourci clavier, et le bug d'export que deux d'entre vous ont signalé est corrigé.",

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    "Northbound 2.4 est sorti. Imports plus rapides, recherche au clavier, et ce bug d'export est corrigé.",
  'web.demo.sample.x.check': 'Nombre de caractères et ordre du fil',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    "Northbound 2.4 est sorti aujourd'hui. La note de version explique en détail les changements d'import et la correction d'export.",
  'web.demo.sample.linkedin.check': "Rôle dans l'organisation et longueur de la publication",

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    "La même photo du lancement, avec une légende écrite pour le fil d'actualité et un texte alternatif écrit par une personne.",
  'web.demo.sample.instagram.check': 'Type de compte, format et texte alternatif',

  /* ---------------------------------------------------------------------- */
  /* La visite en neuf scènes                                              */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': 'Étapes de la visite',
  'web.demo.tour.jump': "Afficher l'étape {position} : {step}",
  'web.demo.tour.step.project': 'Créer un projet',
  'web.demo.tour.step.connect': 'Connecter des comptes',
  'web.demo.tour.step.compose': 'Composer une fois',
  'web.demo.tour.step.variants': 'Adapter par plateforme',
  'web.demo.tour.step.validate': 'Vérifier',
  'web.demo.tour.step.schedule': 'Donner un horaire',
  'web.demo.tour.step.week': 'Voir la semaine',
  'web.demo.tour.step.publish': 'Publier et enregistrer',
  'web.demo.tour.step.digest': 'Lire le résumé',

  /* ---------------------------------------------------------------------- */
  /* Vérifications (étape 5)                                               */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': 'Vérifications avant la planification',
  'web.demo.validate.check.length': 'Limite de caractères, par compte',
  'web.demo.validate.check.lengthDetail':
    'Chaque version est mesurée par rapport à la limite que la plateforme accorde à ce compte.',
  'web.demo.validate.check.altText': 'Texte alternatif sur chaque image',
  'web.demo.validate.check.altTextDetail':
    'Une image sans description, ou sans être marquée comme décorative, arrête la planification.',
  'web.demo.validate.check.firstComment': 'Premier commentaire autorisé ici',
  'web.demo.validate.check.firstCommentDetail':
    "Un premier commentaire n'est proposé que sur les comptes dont la plateforme le prend en charge.",
  'web.demo.validate.note':
    "Ceci s'exécute dans le compositeur avant que quoi que ce soit soit planifié, et à nouveau avant que quoi que ce soit soit envoyé.",

  /* ---------------------------------------------------------------------- */
  /* Publication et reçu (étape 8)                                         */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': 'Publication et son registre',
  'web.demo.live.step.approved': 'Approuvé par {approver}',
  'web.demo.live.step.queued': 'En file pour son créneau',
  'web.demo.live.step.sent': 'Envoyé à la plateforme',
  'web.demo.live.step.confirmed': 'Confirmé par la plateforme',
  'web.demo.live.badge.pending': 'Non publié',
  'web.demo.live.badge.live': 'En direct',
  'web.demo.live.pending':
    "Les deux dernières étapes sont écrites par l'exécution de publication. Aucun connecteur n'a encore terminé la vérification du fournisseur, elles restent donc en attente, et l'identifiant externe de publication et le lien permanent restent indisponibles.",

  /* ---------------------------------------------------------------------- */
  /* Le résumé hebdomadaire (étape 9)                                      */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': 'Votre semaine, en phrases',
  'web.demo.digest.sample': 'Exemple',
  'web.demo.digest.line.variants':
    "Trois versions natives de plateforme sont sorties d'un brouillon cette semaine.",
  'web.demo.digest.line.earliest': 'Le mardi matin était votre créneau le plus tôt.',
  'web.demo.digest.line.approval': "Chaque version a été approuvée avant d'entrer dans la file.",
  'web.demo.digest.line.alt': 'Chaque image portait un texte alternatif écrit par une personne.',
  'web.demo.digest.footer':
    'Les analyses en direct apparaissent ici au fur et à mesure que vos publications sortent.',

  /* ---------------------------------------------------------------------- */
  /* Les trois étapes ajoutées à la visite                                 */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': 'Vérifiez avant de planifier',
  'web.demo.step.validate.body':
    'Le compositeur mesure chaque version par rapport au compte pour lequel elle a été écrite : la limite de caractères que ce compte a réellement, le texte alternatif sur chaque image, et si la plateforme propose même un premier commentaire. Une version qui échoue à une vérification ne peut pas être planifiée.',

  'web.demo.step.publish.title': 'Publiez, et gardez le registre',
  'web.demo.step.publish.body':
    "Une exécution de publication envoie chaque version à son instant, enregistre ce que la plateforme a répondu, et écrit un reçu immuable. Cette exécution est la partie qui n'existe pas encore, c'est pourquoi les deux dernières étapes ci-dessous apparaissent en attente plutôt que dessinées comme terminées.",

  'web.demo.step.digest.title': 'Lisez le résumé hebdomadaire',
  'web.demo.step.digest.body':
    "Le résumé décrit en phrases ce qu'a fait le produit : combien de versions sont sorties d'un brouillon, quel créneau était le plus tôt, ce qui a été approuvé. Il ne porte aucun chiffre d'engagement, car les analyses viennent des plateformes après qu'une publication sort, et rien n'est encore publié.",
} as const;
