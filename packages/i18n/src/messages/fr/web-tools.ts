export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Métadonnées                                                            */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': 'Outils de publication gratuits',
  'web.meta.tools.description':
    "De petits outils privés pour ceux qui publient sur plusieurs plateformes : une vérification de limite par plateforme, un générateur d'UTM, une vérification de longueur de titre YouTube et un planificateur de fuseau horaire.",
  'web.meta.tools.preflight.title': 'Vérificateur de publication préalable',
  'web.meta.tools.preflight.description':
    'Vérifiez un brouillon par rapport aux limites de texte et de médias publiées de dix plateformes, avec la source et la date à laquelle chaque limite a été lue.',
  'web.meta.tools.utm.title': 'Générateur de liens UTM',
  'web.meta.tools.utm.description':
    'Composez une URL de campagne étiquetée et voyez ce que signifie chaque paramètre UTM. Fonctionne entièrement dans votre navigateur.',
  'web.meta.tools.youtubeTitle.title': 'Vérificateur de longueur de titre YouTube',
  'web.meta.tools.youtubeTitle.description':
    'Mesurez un titre YouTube par rapport au plafond documenté, compté comme une personne compte les caractères.',
  'web.meta.tools.timeZone.title': "Planificateur de fuseau horaire et d'heure d'été",
  'web.meta.tools.timeZone.description':
    "Voyez un horaire de publication sur plusieurs fuseaux d'audience et trouvez les semaines où un changement d'heure d'été déplace l'heure locale.",
  'web.meta.tools.engagementRate.title': "Calculateur de taux d'engagement",
  'web.meta.tools.engagementRate.description':
    'Divisez les interactions par la portée, les abonnés ou les impressions. Trois calculs simples, aucune référence inventée.',

  /* ---------------------------------------------------------------------- */
  /* Éléments partagés entre outils                                        */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'Outils gratuits',
  'web.tools.index.summary':
    'De petits calculateurs construits sur les mêmes données de limite de plateforme que lisent nos connecteurs.',
  'web.tools.index.lede':
    "Quatre petits outils, construits sur les mêmes données de limite de plateforme qu'utilisent nos connecteurs. Aucun compte, aucun envoi, aucun suivi de ce que vous tapez.",
  'web.tools.index.dataTitle': "D'où viennent les nombres",
  'web.tools.index.dataBody':
    'Chaque limite est générée à partir du code de capacité des connecteurs de ce dépôt, et chaque ligne de plateforme porte la page de documentation officielle dont elle provient et la date à laquelle une personne a lu cette page.',
  'web.tools.index.honesty':
    "Ces outils ne publient rien. Aucun connecteur n'a encore terminé la vérification du fournisseur, rien ici ne connecte donc de compte.",
  'web.tools.shared.privacyTitle': 'Ceci fonctionne dans votre navigateur',
  'web.tools.shared.privacyBody':
    "Tout ce que vous tapez reste sur cette page. Il n'y a aucune requête vers un serveur, aucun stockage et aucun événement d'analyse portant votre texte.",
  'web.tools.shared.sourceLink': 'Documentation de la plateforme',
  'web.tools.shared.sourceRead': 'Lu le {date}',
  'web.tools.shared.unavailable': 'indisponible',
  'web.tools.shared.unavailableWhy':
    "Nous ne fournissons pas encore de connecteur pour cette plateforme, nous n'avons donc aucune limite vérifiée à montrer. Nous préférons ne rien dire plutôt que deviner.",
  'web.tools.shared.copy': 'Copier',
  'web.tools.shared.copied': 'Copié',
  'web.tools.shared.copyFailed':
    'Votre navigateur a bloqué la copie. Sélectionnez le texte et copiez-le.',
  'web.tools.shared.faqTitle': 'Questions',
  'web.tools.shared.baselineTitle': 'Quel compte décrivent ces nombres',
  'web.tools.shared.baselineBody':
    "Le cas prudent : un compte fraîchement connecté sans éligibilité élevée. Certaines plateformes lèvent un plafond une fois qu'une chaîne ou une entreprise est vérifiée, et là où cela se produit, la page le dit.",
  'web.tools.shared.otherTools': 'Autres outils',

  /* ---------------------------------------------------------------------- */
  /* Noms des outils et résumés en une ligne                              */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'Vérificateur de publication préalable',
  'web.tools.preflight.summary':
    'Un brouillon, vérifié par rapport aux limites de texte et de médias de dix plateformes à la fois.',
  'web.tools.utm.name': 'Générateur de liens UTM',
  'web.tools.utm.summary':
    "Construisez une URL de campagne étiquetée sans abîmer la chaîne de requête qu'elle avait déjà.",
  'web.tools.youtubeTitle.name': 'Vérificateur de longueur de titre YouTube',
  'web.tools.youtubeTitle.summary': 'Mesurez un titre comme le compte une personne.',
  'web.tools.timeZone.name': "Planificateur de fuseau horaire et d'heure d'été",
  'web.tools.timeZone.summary':
    "Un horaire de publication sur plusieurs fuseaux d'audience, avec les changements d'heure d'été marqués.",
  'web.tools.engagementRate.name': "Calculateur de taux d'engagement",
  'web.tools.engagementRate.summary':
    "Interactions divisées par la portée, les abonnés ou les impressions. Rien n'est consulté, rien n'est utilisé comme référence.",

  /* ---------------------------------------------------------------------- */
  /* Vérificateur de publication préalable                                 */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'Vérificateur de publication préalable',
  'web.tools.preflight.lede':
    "Collez un brouillon, choisissez les plateformes sur lesquelles vous publiez, et voyez lesquelles le rejetteraient avant de l'apprendre par une erreur d'API.",
  'web.tools.preflight.explainer.title': 'Pourquoi un compteur de caractères ne suffit pas',
  'web.tools.preflight.explainer.body':
    "Les plateformes ne s'accordent pas sur ce qu'est un caractère. Certaines comptent des unités de code, un emoji coûte alors deux. Certaines comptent des graphèmes, un drapeau ou un emoji de famille coûte alors un. Certaines réécrivent chaque lien vers une largeur fixe, une URL de 200 caractères coûte alors autant qu'une de 20. Cet outil applique chaque règle de plateforme séparément.",
  'web.tools.preflight.explainer.counting':
    "Le brouillon est mesuré avec le segmenteur Intl du navigateur, qui divise le texte en unités qu'un lecteur appellerait des caractères, puis ajusté selon la règle de la plateforme.",
  'web.tools.preflight.field.draft.label': 'Votre brouillon',
  'web.tools.preflight.field.draft.help':
    'Collez le corps de la publication. Les liens sont détectés automatiquement pour que leur coût puisse être appliqué par plateforme.',
  'web.tools.preflight.field.platforms.label': 'Plateformes à vérifier',
  'web.tools.preflight.field.platforms.help': 'Choisissez-en autant que vous publiez.',
  'web.tools.preflight.field.mediaKind.label': 'Médias joints',
  'web.tools.preflight.field.mediaKind.none': 'Aucun média',
  'web.tools.preflight.field.mediaKind.image': 'Images',
  'web.tools.preflight.field.mediaKind.video': 'Une vidéo',
  'web.tools.preflight.field.mediaCount.label': "Combien d'images",
  'web.tools.preflight.field.byteSize.label': 'Taille du fichier en mégaoctets',
  'web.tools.preflight.field.byteSize.help':
    'Le plus grand fichier unique. Laissez vide pour sauter.',
  'web.tools.preflight.field.duration.label': 'Durée de la vidéo en secondes',
  'web.tools.preflight.field.duration.help': 'Laissez vide pour sauter la vérification de durée.',
  'web.tools.preflight.field.width.label': 'Largeur du média en pixels',
  'web.tools.preflight.field.height.label': 'Hauteur du média en pixels',
  'web.tools.preflight.field.dimensions.help':
    'Facultatif. Utilisé seulement pour montrer le format que vous publieriez.',
  'web.tools.preflight.results.title': 'Résultat par plateforme',
  'web.tools.preflight.results.empty': 'Choisissez au moins une plateforme pour voir un résultat.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Rien ne bloque} other {# échoueraient}}, {warning, plural, =0 {aucun avertissement} other {# à vérifier}}.',
  'web.tools.preflight.status.pass': 'Convient',
  'web.tools.preflight.status.warning': "Vaut la peine d'être vérifié",
  'web.tools.preflight.status.fail': 'Échouerait',
  'web.tools.preflight.status.unavailable': 'Indisponible',
  'web.tools.preflight.count.label':
    '{count} sur {limit} {unit, select, grapheme {caractères} utf16 {unités de code} weighted {caractères pondérés} other {caractères}}',
  'web.tools.preflight.finding.textOver':
    'Dépasse la limite de {over, plural, one {# caractère} many {# caractères} other {# caractères}}.',
  'web.tools.preflight.finding.textNear': 'À {remaining} caractères de la limite.',
  'web.tools.preflight.finding.textFits': 'Le corps convient.',
  'web.tools.preflight.finding.linkFixed':
    'Chaque lien est réécrit vers une largeur fixe, chacun coûte donc {cost} caractères quelle que soit sa longueur réelle.',
  'web.tools.preflight.finding.linkActual':
    "Les liens comptent selon les caractères qu'ils occupent.",
  'web.tools.preflight.finding.imagesOver':
    'Cette plateforme accepte {limit, plural, =0 {aucune image} one {# image} other {# images}} dans une publication.',
  'web.tools.preflight.finding.videosOver':
    'Cette plateforme accepte {limit, plural, =0 {aucune vidéo} one {# vidéo} other {# vidéos}} dans une publication.',
  'web.tools.preflight.finding.bytesOver': 'Le fichier dépasse le plafond de {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    "Aucun plafond d'octets publié pour ce type de média, la taille n'a donc pas été vérifiée.",
  'web.tools.preflight.finding.durationOver': 'Plus long que le plafond de {limit} secondes.',
  'web.tools.preflight.finding.durationUnder': 'Plus court que le minimum de {limit} secondes.',
  'web.tools.preflight.finding.durationUnknown':
    "Aucun plafond de durée publié, la longueur n'a donc pas été vérifiée.",
  'web.tools.preflight.finding.altText':
    "Le texte alternatif est accepté jusqu'à {limit} caractères, ce qui vaut la peine d'être utilisé.",
  'web.tools.preflight.finding.ratio': 'Vous publieriez à environ {ratio} pour 1.',
  'web.tools.preflight.faq.counting.q': 'Comment comptez-vous les caractères ?',
  'web.tools.preflight.faq.counting.a':
    "Par graphème, avec le segmenteur Intl du navigateur, l'unité qu'un lecteur entend par caractère. Là où une plateforme documente une règle différente, comme compter des unités de code ou facturer une largeur fixe par lien, cette règle est appliquée par-dessus.",
  'web.tools.preflight.faq.accuracy.q': 'À quel point ces limites sont-elles actuelles ?',
  'web.tools.preflight.faq.accuracy.a':
    "Chaque limite est générée à partir du code des connecteurs de notre dépôt plutôt que tapée sur une page, et chaque ligne de plateforme montre le document officiel dont elle provient et la date à laquelle une personne l'a lu. Si une plateforme change un nombre, la correction est un changement de code et chaque outil ici la suit.",
  'web.tools.preflight.faq.privacy.q': 'Mon brouillon est-il téléversé quelque part ?',
  'web.tools.preflight.faq.privacy.a':
    "Non. La vérification s'exécute dans votre navigateur. Il n'y a aucune requête portant votre texte, rien n'est stocké, et fermer l'onglet suffit à le supprimer.",
  'web.tools.preflight.faq.publish.q': 'Cet outil peut-il publier pour moi ?',
  'web.tools.preflight.faq.publish.a':
    "Pas encore. Aucun connecteur n'a terminé la vérification du fournisseur, rien sur ce site ne publie donc encore sur une plateforme. Cette page est une vérification de limite, pas un compositeur.",

  /* ---------------------------------------------------------------------- */
  /* Générateur d'UTM                                                      */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'Générateur de liens UTM',
  'web.tools.utm.lede':
    "Ajoutez des paramètres de campagne à une URL sans perdre la chaîne de requête qu'elle avait déjà, et sans deviner ce que signifie chaque paramètre.",
  'web.tools.utm.explainer.title': 'À quoi sert chaque paramètre',
  'web.tools.utm.explainer.body':
    "Les paramètres UTM sont lus par les outils d'analyse, pas par la plateforme sur laquelle vous publiez. Ils voyagent dans l'URL, quiconque voit le lien les voit donc aussi. Gardez-les courts, en minuscules et cohérents, car deux orthographes de la même campagne deviennent deux lignes dans un rapport.",
  'web.tools.utm.field.url.label': 'URL de destination',
  'web.tools.utm.field.url.help': 'La page où vous voulez que les gens arrivent, https inclus.',
  'web.tools.utm.field.url.invalid': "Cela ne s'interprète pas comme une URL http ou https.",
  'web.tools.utm.field.source.label': 'Source de la campagne',
  'web.tools.utm.field.source.help': "D'où vient le clic. Par exemple un nom de plateforme.",
  'web.tools.utm.field.medium.label': 'Support de la campagne',
  'web.tools.utm.field.medium.help': 'Le type de lien. Par exemple social, email ou référence.',
  'web.tools.utm.field.campaign.label': 'Nom de la campagne',
  'web.tools.utm.field.campaign.help':
    'Le lancement, la promotion ou le thème auquel appartient ce lien.',
  'web.tools.utm.field.term.label': 'Terme de la campagne',
  'web.tools.utm.field.term.help': 'Facultatif. Traditionnellement le mot-clé payant.',
  'web.tools.utm.field.content.label': 'Contenu de la campagne',
  'web.tools.utm.field.content.help':
    "Facultatif. Sépare deux liens vers la même page, par exemple deux versions d'une publication.",
  'web.tools.utm.result.title': 'Votre URL étiquetée',
  'web.tools.utm.result.empty': 'Entrez une URL de destination pour voir le résultat.',
  'web.tools.utm.result.label': 'URL composée',
  'web.tools.utm.result.preserved':
    "La chaîne de requête que votre URL avait déjà est conservée exactement telle que vous l'avez tapée.",
  'web.tools.utm.result.replaced':
    "Votre URL portait déjà l'un de ces paramètres. La valeur que vous avez saisie ici le remplace.",
  'web.tools.utm.faq.encoding.q': 'Que deviennent les espaces et les accents ?',
  'web.tools.utm.faq.encoding.a':
    "Ils sont encodés en pourcentage, ce qui fait qu'un lien survit lorsqu'il est collé dans une publication. Un espace devient un signe plus et une lettre accentuée devient sa forme encodée, et les outils d'analyse décodent les deux au retour.",
  'web.tools.utm.faq.existing.q': 'Est-ce que cela va casser une URL qui a déjà des paramètres ?',
  'web.tools.utm.faq.existing.a':
    "Non. Les paramètres existants sont préservés dans leur ordre d'origine, et seul un paramètre UTM que vous avez rempli est ajouté ou remplacé. Un fragment en fin d'URL reste en fin.",
  'web.tools.utm.faq.privacy.q': 'Mon URL est-elle envoyée quelque part ?',
  'web.tools.utm.faq.privacy.a':
    "Non. L'URL est composée dans votre navigateur et ne quitte jamais cette page.",

  /* ---------------------------------------------------------------------- */
  /* Vérificateur de longueur de titre YouTube                             */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'Vérificateur de longueur de titre YouTube',
  'web.tools.youtubeTitle.lede':
    "Un titre qui dépasse d'un caractère est rejeté au téléversement. Un titre simplement long est coupé à un endroit que vous n'avez pas choisi.",
  'web.tools.youtubeTitle.explainer.title': 'Deux limites différentes',
  'web.tools.youtubeTitle.explainer.body':
    "Le plafond strict est ce qu'accepte le point de téléversement. Où un titre est affiché est une question distincte : un résultat de recherche, une barre latérale et un téléphone coupent un titre à un endroit différent, et aucun de ces points de coupure n'est publié. Cet outil énonce le plafond documenté et montre la forme de votre titre, et n'invente pas de nombre de troncature.",
  'web.tools.youtubeTitle.field.title.label': 'Titre de la vidéo',
  'web.tools.youtubeTitle.field.title.help': 'Compté par graphème, un emoji coûte donc un.',
  'web.tools.youtubeTitle.result.count': '{count} sur {limit} caractères',
  'web.tools.youtubeTitle.result.over':
    'Dépasse de {over, plural, one {# caractère} many {# caractères} other {# caractères}}. Le téléversement serait rejeté.',
  'web.tools.youtubeTitle.result.fits': 'Dans le plafond documenté.',
  'web.tools.youtubeTitle.result.front':
    "Les {count} premiers caractères portent le plus de poids, car c'est à peu près ce que contient une mise en page étroite. Le vôtre commence : {preview}",
  'web.tools.youtubeTitle.result.unavailable':
    "La limite de titre est indisponible dans cette version, rien n'est donc vérifié ici.",
  'web.tools.youtubeTitle.faq.limit.q': "D'où vient la limite ?",
  'web.tools.youtubeTitle.faq.limit.a':
    "De la référence officielle d'insertion de vidéos, générée sur cette page à partir du même code de connecteur qu'utiliserait notre téléversement. La date à laquelle une personne a lu cette page pour la dernière fois figure à côté du nombre.",
  'web.tools.youtubeTitle.faq.truncation.q': 'Où exactement YouTube coupe-t-il un titre ?',
  'web.tools.youtubeTitle.faq.truncation.a':
    "Cela dépend de la surface et du viewport, et YouTube ne publie pas de nombre de caractères pour cela. Nous montrons le plafond, qui est documenté, et nous n'imprimons pas de nombre de troncature qui serait une supposition.",
  'web.tools.youtubeTitle.faq.emoji.q': 'Un emoji compte-t-il comme un caractère ?',
  'web.tools.youtubeTitle.faq.emoji.a':
    "Dans ce compteur oui, car nous comptons des graphèmes. Une plateforme qui compte des unités de code en interne peut facturer plus pour le même emoji, c'est pourquoi le vérificateur préalable applique chaque règle de plateforme séparément.",

  /* ---------------------------------------------------------------------- */
  /* Planificateur de fuseau horaire et d'heure d'été                     */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': "Planificateur de fuseau horaire et d'heure d'été",
  'web.tools.timeZone.lede':
    'Un créneau hebdomadaire qui semble stable dans votre calendrier se déplace pour la moitié de votre audience deux fois par an. Ceci montre où et quand.',
  'web.tools.timeZone.explainer.title': "Pourquoi une heure locale fixe n'est pas une heure fixe",
  'web.tools.timeZone.explainer.body':
    "Une heure ne signifie quelque chose qu'avec un fuseau attaché. Les fuseaux changent leur décalage à des dates qui diffèrent selon le pays, et deux régions distantes de cinq heures en janvier peuvent être distantes de quatre heures en avril. Un planning stocké comme un instant plus un fuseau survit à cela. Un planning stocké comme une heure locale ne le fait pas.",
  'web.tools.timeZone.field.date.label': 'Date',
  'web.tools.timeZone.field.time.label': 'Heure',
  'web.tools.timeZone.field.zone.label': 'Votre fuseau',
  'web.tools.timeZone.field.audience.label': "Fuseaux d'audience",
  'web.tools.timeZone.field.audience.help':
    'Choisissez les fuseaux où se trouvent réellement vos lecteurs.',
  'web.tools.timeZone.result.title': 'Le même instant, dans tous ceux que vous avez choisis',
  'web.tools.timeZone.result.empty': "Choisissez au moins un fuseau d'audience.",
  'web.tools.timeZone.result.shift':
    "Un changement d'heure d'été tombe entre cette date et le même jour de la semaine quatre semaines plus tard, l'heure locale se déplace donc.",
  'web.tools.timeZone.result.stable':
    'Aucun changement de décalage dans les quatre prochaines semaines.',
  'web.tools.timeZone.result.later': 'Quatre semaines plus tard, {time}.',
  'web.tools.timeZone.result.invalidDate': 'Entrez une date et une heure pour voir la comparaison.',
  'web.tools.timeZone.faq.dst.q': "Dans quel sens l'heure se déplace-t-elle ?",
  'web.tools.timeZone.faq.dst.a':
    "Cela dépend du fuseau et de la direction du changement, c'est pourquoi le tableau montre l'heure locale réelle quatre semaines plus tard plutôt que de décrire la règle. Le décalage de chaque fuseau est lu dans la base de données de fuseaux horaires de votre navigateur.",
  'web.tools.timeZone.faq.storage.q':
    'Comment une publication planifiée devrait-elle stocker son heure ?',
  'web.tools.timeZone.faq.storage.a':
    "Comme un instant plus le fuseau IANA choisi par la personne, jamais comme une heure locale naïve. C'est ce que nous faisons en interne, et c'est pourquoi une publication planifiée avant un changement d'horloge arrive quand même à l'heure locale prévue.",

  /* ---------------------------------------------------------------------- */
  /* Calculateur de taux d'engagement                                     */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': "Calculateur de taux d'engagement",
  'web.tools.engagementRate.lede':
    'Entrez les nombres que votre propre tableau de bord montre déjà. Ceci les divise de trois façons et s\'arrête là : aucune référence, aucun seuil de "bon", rien que nous n\'avons pas réellement.',
  'web.tools.engagementRate.explainer.title': 'Pourquoi trois dénominateurs, pas un',
  'web.tools.engagementRate.explainer.body':
    "La portée, les abonnés et les impressions répondent à des questions différentes. Le taux par portée indique comment ont réagi les personnes qui ont réellement vu la publication. Le taux par abonnés indique quelle part de votre audience s'est engagée, que la publication ait atteint tout le monde ou non. Le taux par impressions compte chaque vue, y compris les répétées. Comparer un taux calculé d'une façon à un taux calculé d'une autre façon est une cause fréquente d'un chiffre d'engagement qui semble faux.",
  'web.tools.engagementRate.field.interactions.label': 'Interactions',
  'web.tools.engagementRate.field.interactions.help':
    "J'aime, commentaires, partages et enregistrements additionnés, de la publication que vous mesurez.",
  'web.tools.engagementRate.field.reach.label': 'Portée',
  'web.tools.engagementRate.field.reach.help': 'Comptes ayant vu la publication au moins une fois.',
  'web.tools.engagementRate.field.followers.label': 'Abonnés',
  'web.tools.engagementRate.field.followers.help':
    'La taille du compte au moment de la publication.',
  'web.tools.engagementRate.field.impressions.label': 'Impressions',
  'web.tools.engagementRate.field.impressions.help':
    'Total des vues, y compris une personne qui a vu deux fois.',
  'web.tools.engagementRate.result.title': "Taux d'engagement, de trois façons",
  'web.tools.engagementRate.result.empty': 'indisponible',
  'web.tools.engagementRate.result.note':
    "Il n'existe pas de bon taux universel auquel se comparer. Cela dépend de la plateforme, du format, de la taille de l'audience et du secteur, et tout chiffre unique proposé comme référence est une supposition déguisée en donnée.",
  'web.tools.engagementRate.basis.reach': 'Par portée',
  'web.tools.engagementRate.basis.followers': 'Par abonnés',
  'web.tools.engagementRate.basis.impressions': 'Par impressions',
  'web.tools.engagementRate.faq.formula.q': 'Quelle est la formule réelle ?',
  'web.tools.engagementRate.faq.formula.a':
    "Interactions divisées par le dénominateur que vous choisissez, affichées en pourcentage. Interactions signifie ici j'aime, commentaires, partages et enregistrements additionnés ; certaines plateformes les rapportent séparément, additionnez-les vous-même dans ce cas avant de saisir le total.",
  'web.tools.engagementRate.faq.basis.q': 'Quel dénominateur devrais-je utiliser ?',
  'web.tools.engagementRate.faq.basis.a':
    "Celui que votre plateforme rapporte avec la publication, pour que les deux nombres proviennent de la même fenêtre de mesure. Comparer un taux par portée d'une publication à un taux par abonnés d'une autre n'est pas une comparaison équitable même si les deux sont appelés taux d'engagement.",
} as const;
