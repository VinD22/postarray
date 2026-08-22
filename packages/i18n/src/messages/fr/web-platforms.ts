export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Métadonnées                                                            */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'Planification, plateforme par plateforme',
  'web.meta.schedule.description':
    "Ce que chaque plateforme de la cohorte de lancement exige d'un compte connecté, les limites que son API officielle applique, et jusqu'où ce produit est allé face à elles.",
  'web.meta.schedulePlatform.title': 'Planification pour {platform}',
  'web.meta.schedulePlatform.description':
    "Ce que {platform} exige d'un compte connecté, les limites que son API officielle applique, et quelles parties de cela ce produit a construites.",

  /* ---------------------------------------------------------------------- */
  /* Index                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Planification, plateforme par plateforme',
  'web.schedule.index.lede':
    "Une page par plateforme dans la cohorte de lancement. Chacune indique ce que la plateforme demande d'un compte connecté, les limites que son API officielle applique, et où en est la construction. Chaque nombre porte le document dont il provient et la date à laquelle une personne l'a lu.",
  'web.schedule.index.listLabel': 'Plateformes de la cohorte de lancement',
  'web.schedule.index.cohortNote':
    "La cohorte est l'ensemble des plateformes pour lesquelles ce produit est construit. C'est un plan, pas une liste de disponibilité.",
  'web.schedule.index.limitsKnown': 'Limites enregistrées',
  'web.schedule.index.limitsUnknown': 'Limites pas encore enregistrées',

  /* ---------------------------------------------------------------------- */
  /* Page de la plateforme                                                  */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Planification pour {platform}',
  'web.schedule.platform.lede':
    "Ce que {platform} demande d'un compte connecté, les limites que son API officielle applique, et contre lesquelles de celles-ci ce produit a construit jusqu'à présent.",

  'web.schedule.notice.title': "Rien n'est encore publié sur {platform}",
  'web.schedule.notice.body':
    "Aucun connecteur n'a atteint sa définition de fait, et aucun n'est vérifié en production. Cette page décrit ce que la plateforme exige et ce que ce produit prévoit de prendre en charge. Elle ne décrit pas un planificateur fonctionnel.",

  'web.schedule.requirements.title': 'Ce que {platform} exige',
  'web.schedule.requirements.accountTypes': 'Type de compte',
  'web.schedule.requirements.restriction': 'Restriction de la plateforme',
  'web.schedule.requirements.cost': "Coût de l'API",
  'web.schedule.requirements.unavailable.title': 'Pas encore de fiche connecteur vérifiée',
  'web.schedule.requirements.unavailable.body':
    "Cette plateforme a rejoint la cohorte après la dernière recherche sur les connecteurs, il n'y a donc pas de fiche datée de ses exigences de compte à afficher. Elle apparaîtra ici dès qu'une personne aura lu la documentation officielle et l'aura enregistrée.",
  'web.schedule.requirements.apiSource': "Documentation officielle de l'API",
  'web.schedule.requirements.policySource': 'Politique de la plateforme',

  /* ---------------------------------------------------------------------- */
  /* Limites                                                                */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Limites que {platform} applique',
  'web.schedule.limits.lede':
    "Lues pour un compte fraîchement connecté sans éligibilité élevée. Une plateforme peut augmenter ou baisser n'importe laquelle de ces valeurs sans prévenir personne, c'est pourquoi chaque ensemble porte la date à laquelle il a été lu.",
  'web.schedule.limits.unavailable.title': 'Limites non enregistrées pour {platform}',
  'web.schedule.limits.unavailable.body':
    "Cette version ne fournit pas d'adaptateur pour cette plateforme, il n'y a donc pas de plafond enregistré à afficher. Un chiffre inventé serait pire que rien.",
  'web.schedule.limits.sourceLabel': 'Documentation officielle de la plateforme',

  'web.schedule.limits.text': 'Texte du corps',
  'web.schedule.limits.title_field': 'Champ de titre',
  'web.schedule.limits.countingUnit': 'Comment les caractères sont comptés',
  'web.schedule.limits.links': 'Comment les liens sont comptés',
  'web.schedule.limits.images': 'Images par publication',
  'web.schedule.limits.videos': 'Vidéos par publication',
  'web.schedule.limits.videoDuration': 'Durée de la vidéo',
  'web.schedule.limits.imageBytes': 'Image la plus grande',
  'web.schedule.limits.gifBytes': 'Image animée la plus grande',
  'web.schedule.limits.videoBytes': 'Vidéo la plus grande',
  'web.schedule.limits.documentBytes': 'Document le plus grand',
  'web.schedule.limits.altText': 'Texte alternatif',
  'web.schedule.limits.mimeTypes': 'Types de fichiers acceptés',
  'web.schedule.limits.markdown': 'Marques de mise en forme',

  'web.schedule.value.characters':
    '{count, plural, one {# caractère} many {# caractères} other {# caractères}}',
  'web.schedule.value.files':
    '{count, plural, =0 {Aucun} one {# fichier} many {# fichiers} other {# fichiers}}',
  'web.schedule.value.durationRange': 'Entre {min} et {max}',
  'web.schedule.value.durationMax': "Jusqu'à {max}",
  'web.schedule.value.markdownYes': 'Accepté',
  'web.schedule.value.markdownNo': 'Publié comme caractères simples',

  'web.schedule.unit.utf16':
    'Par unité de code UTF-16, ce que la plupart des éditeurs rapportent comme nombre de caractères.',
  'web.schedule.unit.grapheme':
    'Par graphème, donc un emoji composé de plusieurs points de code coûte quand même un caractère.',
  'web.schedule.unit.weighted':
    "Par un schéma pondéré où la plupart des caractères non latins coûtent deux au lieu d'un.",

  'web.schedule.link.none': 'Les liens ne sont pas comptés dans le plafond.',
  'web.schedule.link.actual': "Un lien coûte exactement les caractères qu'il occupe.",
  'web.schedule.link.fixed':
    'Chaque lien est réécrit vers le raccourcisseur de la plateforme et coûte {count, plural, one {# caractère} many {# caractères} other {# caractères}} quelle que soit sa longueur réelle.',

  /* ---------------------------------------------------------------------- */
  /* État des capacités                                                    */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'Ce qui est construit pour {platform}',
  'web.schedule.capabilities.lede':
    'Généré à partir du registre des connecteurs, pas écrit ici. "Non proposé par la plateforme" est un fait sur la plateforme et est définitif. "Pas encore construit" est un fait sur ce produit et le défaut honnête tant qu\'aucun connecteur n\'a atteint sa définition de fait.',
  'web.schedule.capabilities.unavailable.title': 'Pas encore de fiche de capacité pour {platform}',
  'web.schedule.capabilities.unavailable.body':
    "Il n'y a pas d'adaptateur dans cette version, le registre n'a donc rien à rapporter. La ligne apparaîtra sur la matrice de capacités dès qu'il y aura quelque chose de réel à dire.",
  'web.schedule.capabilities.matrixLink': 'Lire la matrice de capacités complète',

  'web.schedule.next.title': 'Où aller ensuite',
  'web.schedule.next.body':
    "La matrice de capacités regroupe chaque plateforme et chaque capacité dans un seul tableau. Les pages de cas d'usage décrivent les flux de travail pour lesquels ce produit est construit.",
} as const;
