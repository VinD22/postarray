/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Composer',
  'composer.titleWithBrand': 'Composer pour {brand}',
  'composer.master.label': 'Projet principal',
  'composer.master.description':
    'Écrivez une fois ici. Les modifications compatibles atteignent chaque cible sélectionnée. Ouvrez une cible pour écrire une version que seul ce compte recevra.',
  'composer.master.globalEdit': 'Modification globale',
  'composer.master.placeholder': 'Que souhaitez-vous publier ?',
  'composer.brief.label': 'Bref',
  'composer.brief.placeholder': "Décrivez l'idée, le public et le résultat souhaité.",
  'composer.sources.label': 'Références sources',
  'composer.sources.empty': 'Aucune source jointe.',
  'composer.campaign.label': 'Campagne',
  'composer.campaign.none': 'Aucune campagne',
  'composer.contentLocale.label': 'Langue du contenu',
  'composer.contentLocale.help':
    'La langue du message. Ceci est distinct de la langue de votre interface.',
  'composer.market.label': "Marché d'audience",

  'composer.targets.title': 'Cibles',
  'composer.targets.count':
    '{count, plural, =0 {Aucun compte sélectionné} one {# compte} many {# comptes} other {# comptes}}',
  'composer.targets.publishSummary':
    "{count, plural, one {Cette publication sera publiée sur # compte} many {Cette publication sera publiée sur # comptes} other {Cette publication sera publiée sur # comptes}} {when, select, now {maintenant} scheduled {à l'heure prévue} other {}}",
  'composer.targets.add': 'Ajouter des comptes',
  'composer.targets.empty': 'Sélectionnez au moins un compte sur lequel publier.',
  'composer.targets.state.ready': 'Prêt',
  'composer.targets.state.inherited': 'Hérité du maître',
  'composer.targets.state.overridden': 'Remplacé',
  'composer.targets.state.warning': 'Vérifiez avant de publier',
  'composer.targets.state.error': "A besoin d'un correctif",
  'composer.targets.state.approvalNeeded': 'Approbation nécessaire',
  'composer.targets.overrideBadge': 'Outrepasser',
  'composer.targets.resetConfirm.title': 'Réinitialiser cette cible au brouillon principal ?',
  'composer.targets.resetConfirm.body':
    'La copie, le support et les paramètres pour lesquels vous avez modifié {account} sera remplacé par le projet principal. Les autres cibles ne sont pas affectées.',
  'composer.targets.divergence':
    '{count, plural, one {# cible diffère du brouillon principal} many {# cibles diffèrent du brouillon principal} other {# cibles diffèrent du brouillon principal}}',

  'composer.applyToAll.title': 'Appliquer à toutes les cibles',
  'composer.applyToAll.compatible':
    '{count, plural, one {# champ est compatible avec chaque cible sélectionnée} many {# champs sont compatibles avec chaque cible sélectionnée} other {# champs sont compatibles avec chaque cible sélectionnée}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# champ ne peut pas être appliqué et reste par cible} many {# champs ne peuvent pas être appliqués et restent par cible} other {# champs ne peuvent pas être appliqués et restent par cible}}',
  'composer.applyToAll.creates': "L'application crée une version explicite pour chaque cible.",

  'composer.editor.label': 'Publier du texte',
  'composer.editor.characterCount': '{used} de {limit} personnages',
  'composer.editor.characterCountOver': '{over} personnages sur le {limit} limite de caractères',
  'composer.editor.characterCountUnknown': 'Limite de caractères indisponible pour ce compte',
  'composer.editor.remaining':
    '{count, plural, one {# caractère restant} many {# caractères restants} other {# caractères restants}}',
  'composer.editor.hashtagCount':
    '{count, plural, one {#hashtag} many {# hashtag} other {# hashtag}}',
  'composer.editor.formatting': 'Formatage',
  'composer.editor.emoji': 'Émoji',
  'composer.editor.mention': 'Mention',
  'composer.editor.link': 'Lien',

  'composer.mentions.search': 'Rechercher des personnes, des pages et des entreprises',
  'composer.mentions.searching': 'Recherche {provider}',
  'composer.mentions.resolved': 'Tagué {label} sur {provider}',
  'composer.mentions.unresolved':
    "Cette mention n'a pas été associée à un {provider} compte encore. Il sera publié sous forme de texte brut jusqu'à ce que vous sélectionniez un résultat.",
  'composer.mentions.noResults': 'Aucun compte correspondant sur {provider}.',
  'composer.mentions.unsupported': "Le balisage natif n'est pas disponible pour ce compte.",

  'composer.destination.label': 'Destination',
  'composer.destination.placeholder': 'Choisissez où cela est publié',
  'composer.destination.community': 'Communauté',
  'composer.destination.board': 'Conseil',
  'composer.destination.group': 'Groupe',
  'composer.destination.page': 'Page',
  'composer.destination.organization': 'Organisation',
  'composer.destination.channel': 'Canal',
  'composer.destination.refresh': 'Actualiser les destinations',
  'composer.destination.lastRefreshed': 'Destinations rafraîchies {relativeTime}',

  'composer.media.title': 'Médias',
  'composer.media.count': '{count, plural, one {# déposer} many {# fichiers} other {# fichiers}}',
  'composer.media.dropHint': 'Faites glisser les fichiers ici ou parcourez votre bibliothèque.',
  'composer.media.inheritFromMaster': 'Utilisation du média maître',
  'composer.media.overridden': 'Cette cible utilise ses propres médias',
  'composer.media.altText.label': 'Texte alternatif',
  'composer.media.altText.placeholder':
    "Décrivez l'image pour les personnes utilisant un lecteur d'écran.",
  'composer.media.altText.missing': 'Le texte alternatif est manquant.',
  'composer.media.altText.waive': "Cette image n'a pas besoin de texte alternatif",
  'composer.media.altText.generate': 'Écrire un texte alternatif',
  'composer.media.crop': 'Recadrer',
  'composer.media.resize': 'Redimensionner',
  'composer.media.rotate': 'Tourner',
  'composer.media.compress': 'Compresse',
  'composer.media.convertFormat': 'Convertir le format',
  'composer.media.thumbnail': 'Vignette',
  'composer.media.aspectPreset': 'Plateforme prédéfinie',
  'composer.media.original': 'Original',
  'composer.media.originalPreserved':
    'Le fichier original est conservé. Les modifications créent une nouvelle version.',
  'composer.media.uploading': 'Téléchargement {name}',
  'composer.media.processing': 'Préparation {name}',
  'composer.media.rights.label': 'Droits et consentement',
  'composer.media.rights.confirm':
    "J'ai le droit de publier ce média, y compris toutes les personnes, musiques, logos et marques qui y figurent.",

  'composer.sequence.title': 'Commentaires et fil de discussion',
  'composer.sequence.root': 'Poste principal',
  'composer.sequence.item': 'Article {position}',
  'composer.sequence.add': 'Ajouter un commentaire ou un élément de fil de discussion',
  'composer.sequence.delayLabel': "Retard après l'élément précédent",
  'composer.sequence.delayImmediate': 'Immédiatement',
  'composer.sequence.delayMinutes':
    '{count, plural, one {# minute} many {# minutes} other {# minutes}}',
  'composer.sequence.delayCustom': 'Délai personnalisé',
  'composer.sequence.accountLabel': 'Publier cet élément comme',
  'composer.sequence.unsupported':
    'Ce compte ne prend pas en charge les éléments de suivi planifiés.',

  'composer.repeat.title': 'Répéter',
  'composer.repeat.off': 'Ne répétez pas',
  'composer.repeat.everyDays':
    '{count, plural, one {Tous les jours} many {Tous les # jours} other {Tous les # jours}}',
  'composer.repeat.endLabel': 'Arrêtez de répéter',
  'composer.repeat.endOnDate': 'À un rendez-vous',
  'composer.repeat.endAfterCount': 'Après plusieurs posts',
  'composer.repeat.endRequired': 'Choisissez une date de fin ou un nombre de répétitions.',
  'composer.repeat.summary':
    "Répétitions {cadence} jusqu'à {end}. Chaque événement reçoit sa propre approbation et réception.",

  'composer.links.title': 'Links',
  'composer.links.keepOriginal': "Conserver l'URL d'origine",
  'composer.links.track': 'Remplacer par un lien court suivi',
  'composer.links.utm': 'Paramètres UTM',
  'composer.links.domain': 'Domaine de lien',
  'composer.links.finalUrl': 'Cela sera publié comme {url}',
  'composer.links.frozenAtApproval':
    "L'URL courte exacte et la destination sont figées dans la version approuvée.",

  'composer.signature.title': 'Signature',
  'composer.signature.none': 'Aucune signature',
  'composer.signature.autoApplied':
    'Signature {name} a été ajouté automatiquement. Vous pouvez le changer.',

  'composer.set.title': 'Ensembles',
  'composer.set.startFrom': "Commencer à partir d'un ensemble",
  'composer.set.continueWithout': 'Continuer sans set',
  'composer.set.applied': 'Ensemble appliqué {name}. Ce draft est désormais indépendant du Set.',

  'composer.validation.title': 'Validation',
  'composer.validation.clean': 'Aucun problème trouvé pour les cibles sélectionnées.',
  'composer.validation.issueCount':
    '{count, plural, one {# problème} many {# problèmes} other {# problèmes}} à travers {targets, plural, one {# cible} many {# cibles} other {# cibles}}',
  'composer.validation.blocking': 'Cela doit être corrigé avant la planification.',
  'composer.validation.warning': 'Vérifiez ceci avant de publier.',
  'composer.validation.revalidated':
    'Revérifié par rapport aux limites actuelles de la plate-forme {relativeTime}.',

  'composer.preview.title': 'Aperçu',
  'composer.preview.forAccount': 'Aperçu pour {account} sur {provider}',
  'composer.preview.approximate':
    'Cet aperçu utilise les règles de plateforme que nous avons enregistrées. La publication publiée peut différer si la plateforme change.',
  'composer.preview.unavailable': "Un véritable aperçu n'est pas encore disponible pour ce compte.",

  'composer.cost.title': 'Coût estimé du fournisseur',
  'composer.cost.estimate':
    "{provider} estimations {amount} d'utilisation de l'API pour ce message.",
  'composer.cost.linkSurcharge':
    '{provider} facture plus pour les publications contenant une URL. La suppression du lien réduit l’estimation.',
  'composer.cost.bulkWarning':
    "{count, plural, one {# publication} many {# publications} other {# publications}} en un seul geste. Vérifiez l'estimation avant de continuer.",
  'composer.cost.reconciled': "L'utilisation réelle est rapprochée après la publication.",
  'composer.cost.none': 'Aucun coût de fournisseur facturé pour ce poste.',

  'composer.autosave.saving': 'Économie',
  'composer.autosave.saved': 'Enregistré {relativeTime}',
  'composer.autosave.offline':
    'Hors ligne. Votre brouillon est conservé sur cet appareil et sera synchronisé.',
  'composer.autosave.conflict':
    "{name} J'ai édité ce brouillon pendant que vous écriviez. Vérifiez les deux versions avant de sauvegarder.",
  'composer.autosave.failed': "Impossible d'enregistrer. Votre texte est toujours là. Réessayer.",

  'composer.ai.title': 'Assister',
  'composer.ai.makeConcise': 'Rendre plus concis',
  'composer.ai.adaptForPlatform': "S'adapter pour {provider}",
  'composer.ai.transcreate': 'Transcréer vers {language}',
  'composer.ai.checkClaims': 'Vérifier les réclamations',
  'composer.ai.writeAltText': 'Écrire un texte alternatif',
  'composer.ai.suggestHooks': 'Proposer des crochets',
  'composer.ai.suggestCta': "Suggérer un appel à l'action",
  'composer.ai.diffTitle': 'Modification proposée',
  'composer.ai.diffHelp': "Rien ne change tant que vous ne l'acceptez pas.",
  'composer.ai.working': "J'y travaille",
  'composer.ai.sources':
    'Basé sur {count, plural, one {# source} many {# sources} other {# sources}} tu as approuvé',
  'composer.ai.uncertain':
    'Cette expression n’a pas d’équivalent propre dans {language}. Révisez-le avec un locuteur natif avant de le publier.',

  'composer.schedule.title': 'Calendrier',
  'composer.schedule.dateLabel': 'Date',
  'composer.schedule.timeLabel': 'Temps',
  'composer.schedule.timeZoneLabel': 'Fuseau horaire',
  'composer.schedule.nextFreeSlot': 'Prochain emplacement gratuit',
  'composer.schedule.localAndUtc': '{local} dans {timeZone}. {utc} UTC.',
  'composer.schedule.dstWarning':
    'Les horloges changent {timeZone} à cette date. Ce message fonctionne à {local}, ce qui est {utc} UTC.',
  'composer.schedule.pastWarning': 'Ce temps est révolu. Choisissez une heure ultérieure.',
  'composer.schedule.confirmTitle': 'Confirmer avant de planifier',
  'composer.schedule.confirmPublishNow': 'Confirmez avant de publier maintenant',
  'composer.schedule.approverLabel': 'Approbateur',
  'composer.schedule.policyLabel': "Politique d'approbation",
  'composer.schedule.duplicateWarning':
    'Un contenu similaire a été publié sur {account} {relativeTime}. Le publier à nouveau peut enfreindre les règles de la plateforme concernant le contenu en double.',
  'composer.schedule.cadenceWarning':
    '{account} a déjà {count, plural, one {# poste} many {# messages} other {# messages}} prévu ce jour-là.',
} as const;
