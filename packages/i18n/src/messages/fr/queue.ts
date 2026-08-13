export const queueMessages = {
  'queue.title': 'File de publication',
  'queue.subtitle':
    'Quand ce projet peut publier, et à quel intervalle. Rien n\'est publié sans qu\'une personne accepte l\'horaire.',

  'queue.rules.heading': 'Règles de la file',
  'queue.rules.empty':
    'Pas encore de règle de file. Tant que vous n\'en ajoutez pas, le prochain créneau est simplement la première heure libre.',
  'queue.rules.create': 'Nouvelle règle de file',
  'queue.rules.count': '{count, plural, =0 {Aucune règle} one {# règle} many {# règles} other {# règles}}',
  'queue.rules.enabled': 'En usage',
  'queue.rules.disabled': 'En pause',
  'queue.rules.archived': 'Archivée',
  'queue.rules.edit': 'Modifier la règle',
  'queue.rules.archive': 'Archiver la règle',
  'queue.rules.archiveHelp':
    'Archiver arrête les propositions futures. Les créneaux déjà réservés gardent leur horaire et leur motif.',

  'queue.field.name': 'Nom de la règle',
  'queue.field.nameHelp': 'Un nom que vous reconnaîtrez plus tard, par exemple Matinées en semaine.',
  'queue.field.timeZone': 'Fuseau horaire',
  'queue.field.timeZoneHelp':
    'Les créneaux, le décompte quotidien et les dates de blocage sont tous lus dans ce fuseau.',
  'queue.field.minimumGap': 'Écart minimum',
  'queue.field.minimumGapHelp': 'Minutes entre deux publications. Zéro signifie aucune règle d\'espacement.',
  'queue.field.maximumPerDay': 'Maximum par jour',
  'queue.field.maximumPerDayHelp':
    'Laissez vide pour aucune limite quotidienne. Zéro signifie que cette règle ne propose rien.',
  'queue.field.maximumPerDayUnlimited': 'Aucune limite quotidienne',
  'queue.field.priority': 'Priorité',
  'queue.field.priorityHelp': 'La règle de priorité la plus haute pouvant offrir un créneau est celle utilisée.',
  'queue.field.enabled': 'Utiliser cette règle',

  'queue.windows.heading': 'Créneaux hebdomadaires',
  'queue.windows.help':
    'Choisissez les heures locales pendant lesquelles ce projet peut publier. Utilisez les champs de jour et d\'heure, ou les boutons de la grille.',
  'queue.windows.empty': 'Pas encore de créneau. Une règle sans créneau ne peut jamais offrir de plage.',
  'queue.windows.add': 'Ajouter un créneau',
  'queue.windows.remove': 'Retirer le créneau',
  'queue.windows.entry': '{weekday}, de {start} à {end}',
  'queue.windows.start': 'De',
  'queue.windows.end': 'À',
  'queue.windows.weekday': 'Jour',
  'queue.windows.toggleCell': '{weekday} à {hour}',
  'queue.windows.gridLabel': 'Disponibilité hebdomadaire, un bouton par jour et par heure',

  'queue.weekday.1': 'Lundi',
  'queue.weekday.2': 'Mardi',
  'queue.weekday.3': 'Mercredi',
  'queue.weekday.4': 'Jeudi',
  'queue.weekday.5': 'Vendredi',
  'queue.weekday.6': 'Samedi',
  'queue.weekday.7': 'Dimanche',

  'queue.blackouts.heading': 'Dates bloquées',
  'queue.blackouts.help': 'Dates où ce projet ne publiera pas, lues dans le fuseau horaire de la règle.',
  'queue.blackouts.empty': 'Aucune date bloquée.',
  'queue.blackouts.add': 'Ajouter un blocage',
  'queue.blackouts.remove': 'Retirer le blocage',
  'queue.blackouts.from': 'Premier jour',
  'queue.blackouts.to': 'Dernier jour',
  'queue.blackouts.entry': '{from} à {to}',

  'queue.connections.heading': 'Comptes',
  'queue.connections.all': 'Chaque compte de ce projet',
  'queue.connections.scoped':
    '{count, plural, one {# compte} many {# comptes} other {# comptes}} auxquels cette règle s\'applique',

  'queue.slot.heading': 'Prochain créneau de la file',
  'queue.slot.action': 'Utiliser le prochain créneau de la file',
  'queue.slot.proposed': '{local} en {timeZone}',
  'queue.slot.utc': 'Cela correspond à {utc} en UTC.',
  'queue.slot.why': 'Pourquoi cet horaire',
  'queue.slot.accept': 'Utiliser cet horaire',
  'queue.slot.release': 'Choisir un autre horaire',
  'queue.slot.expires': 'Cette proposition est maintenue jusqu\'à {expires}.',
  'queue.slot.unavailable': 'Un créneau de la file n\'est pas disponible pour le moment.',
  'queue.slot.pending': 'Recherche du prochain créneau.',
  'queue.slot.accepted': 'Planifié pour {local} en {timeZone}.',
  'queue.slot.notAutomatic': 'Rien n\'est planifié tant que vous ne choisissez pas cet horaire.',

  'queue.reason.noRulesConfigured':
    'Ce projet n\'a aucune règle de file configurée, donc aucun créneau ne s\'est appliqué.',
  'queue.reason.fallbackFirstFreeHour': 'La première heure libre à partir de maintenant a été utilisée.',
  'queue.reason.matchedRule': 'La règle {name} a choisi cet horaire, en {zone}.',
  'queue.reason.matchedWindow': 'Il tombe dans le créneau de {start} à {end} en {zone}.',
  'queue.reason.minimumGap': 'Il est espacé d\'au moins {minutes} minutes de toute autre publication.',
  'queue.reason.noMinimumGap': 'Cette règle ne définit aucun écart minimum entre les publications.',
  'queue.reason.dailyCap': 'Ce jour accueille au maximum {limit} publications, et il n\'est pas complet.',
  'queue.reason.dailyCapUnlimited': 'Cette règle ne définit aucune limite quotidienne.',
  'queue.reason.blackoutSkipped':
    '{days, plural, one {# jour bloqué a été} many {# jours bloqués ont été} other {# jours bloqués ont été}} sautés pour y arriver.',
  'queue.reason.dstNonexistentSkipped':
    'La première heure du créneau n\'existe pas à cette date en {zone}, donc la suivante qui existe a été utilisée.',
  'queue.reason.dstAmbiguousFirst':
    'Cette heure locale se produit deux fois en {zone} à cette date. La première occurrence a été utilisée.',
  'queue.reason.priorityChosen': 'Cette règle a la priorité {priority}, la plus haute qui pouvait offrir.',
  'queue.reason.connectionScoped':
    'Cette règle couvre {count, plural, one {# compte} many {# comptes} other {# comptes}}.',
  'queue.reason.horizonExhausted': 'Aucun créneau n\'était libre en {days} jours.',
} as const;
