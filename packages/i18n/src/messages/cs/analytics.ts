/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Analytics',
  'analytics.subtitle': 'Co se stalo, jak je to čerstvé a co stojí za to vyzkoušet dále.',
  'analytics.range.7d': 'Posledních 7 dní',
  'analytics.range.30d': 'Posledních 30 dní',
  'analytics.range.90d': 'Posledních 90 dní',
  'analytics.range.custom': 'Vlastní rozsah',
  'analytics.range.limitedByProvider':
    '{provider} vrátí maximálně {days, plural, one {# den} other {# dnů} few {# dnů} many {# dnů}} historie tohoto účtu.',
  'analytics.account.select': 'Vyberte účet',
  'analytics.compareTo': 'Ve srovnání s {baseline}',
  'analytics.baseline.trailingMedian':
    'váš medián předchozího {count, plural, one {# srovnatelný příspěvek} other {# srovnatelné příspěvky} few {# srovnatelné příspěvky} many {# srovnatelné příspěvky}}',

  'analytics.metric.followers': 'Sledovatelé',
  'analytics.metric.subscribers': 'Odběratelé',
  'analytics.metric.profileViews': 'Zobrazení profilu',
  'analytics.metric.impressions': 'Zobrazení',
  'analytics.metric.reach': 'Dosah',
  'analytics.metric.views': 'Zobrazení',
  'analytics.metric.videoViews': 'Zhlédnutí videa',
  'analytics.metric.watchTime': 'Doba sledování',
  'analytics.metric.averageViewDuration': 'Průměrná doba sledování',
  'analytics.metric.averageViewPercentage': 'Průměrné procento zhlédnutí',
  'analytics.metric.likes': 'Líbí se mi a reakce',
  'analytics.metric.comments': 'Komentáře a odpovědi',
  'analytics.metric.shares': 'Sdílení, reposty a citace',
  'analytics.metric.saves': 'Uložení a záložky',
  'analytics.metric.linkClicks': 'Kliknutí na odkaz',
  'analytics.metric.clickThroughRate': 'Míra prokliku',
  'analytics.metric.engagementRate': 'Míra zapojení',
  'analytics.metric.publishedCount': 'Zveřejněné příspěvky',
  'analytics.metric.followerChange': 'Změna sledujících',

  'analytics.definition.title': 'Jak {metric} je definováno',
  'analytics.definition.provider': 'Nahlásil {provider} jako {providerField}.',
  'analytics.definition.denominator.label': 'Jmenovatel: {denominator}.',
  'analytics.definition.unit': 'Jednotka: {unit}.',
  'analytics.definition.normalized':
    'Normalizováno z hodnoty poskytovatele. Hrubá hodnota je zachována a dostupná.',
  'analytics.definition.notComparable':
    '{provider} a {otherProvider} to definuje jinak. Porovnejte je opatrně.',

  'analytics.value.unavailable': 'Nedostupné',
  'analytics.value.unavailableReason.permission':
    'Tento účet neudělil oprávnění potřebná pro tuto metriku.',
  'analytics.value.unavailableReason.unsupported': '{provider} tuto metriku nehlásí.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} zveřejní tuto metriku později. Zkontrolujte znovu po {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'Poslední synchronizace se nezdařila. Zkoušíme to znovu a neukážeme uhádnuté číslo.',
  'analytics.freshness.synced': 'Synchronizováno {relativeTime}',
  'analytics.freshness.stale':
    'Poslední úspěšná synchronizace {relativeTime}. Toto může být zastaralé.',
  'analytics.freshness.coverage':
    '{covered} z {total} příspěvky v tomto rozsahu mají aktuální data.',

  'analytics.feedback.title': 'Co to naznačuje',
  'analytics.feedback.aboveBaseline':
    'Tento příspěvek obdržel {percent} více {metric} než {baseline}.',
  'analytics.feedback.belowBaseline':
    'Tento příspěvek obdržel {percent} méně {metric} než {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Obrázkové příspěvky a video příspěvky zde nejsou přímo srovnatelné.',
  'analytics.feedback.smallSample':
    'Vzorek je malý. Před vyvozením závěru znovu vyzkoušejte stejný háček.',
  'analytics.feedback.association':
    'Po změně zpoždění prvního komentáře z {before} až {after}. Toto je asociace, nikoli důkaz příčiny.',
  'analytics.feedback.nextTest': 'Co testovat dále',
  'analytics.feedback.doNotInfer': 'Co to neukazuje',
  'analytics.feedback.noScore':
    'Není zde žádné skóre pro různé platformy. Vyberte metriku s definicí, které důvěřujete.',

  'analytics.experiment.title': 'Experimenty',
  'analytics.experiment.hypothesis': 'Hypotéza',
  'analytics.experiment.variants': 'Varianty',
  'analytics.experiment.successMetric': 'Metrika úspěšnosti',
  'analytics.experiment.window': 'Okno měření',
  'analytics.experiment.status.running': 'Běží do {date}',
  'analytics.experiment.status.complete': 'Dokončeno',
  'analytics.experiment.tagBeforePublishing':
    'Označte experiment před publikováním, aby se srovnání neprovádělo až poté.',
  'analytics.experiment.caveats': 'Upozornění',

  'analytics.export.title': 'Exportovat',
  'analytics.export.csv': 'Stáhnout CSV',
  'analytics.export.json': 'Stáhnout JSON',
  'analytics.export.providerRestriction':
    '{provider} omezuje způsob, jakým mohou být jeho data kombinována nebo ukládána. Některá pole nejsou zahrnuta.',

  'analytics.links.title': 'Sledované odkazy',
  'analytics.links.subtitle':
    'Měření přesměrování první strany. Jedná se o sérii oddělenou od kliknutí na odkaz, která hlásí platforma.',
  'analytics.links.destination': 'Cíl',
  'analytics.links.shortUrl': 'Krátká adresa URL',
  'analytics.links.totalRequests': 'Celkový počet požadavků',
  'analytics.links.humanClicks': 'Duplikovaná kliknutí',
  'analytics.links.suspectedBots': 'Podezření na roboty',
  'analytics.links.referrerClass': 'Referrer',
  'analytics.links.deviceClass': 'Zařízení',
  'analytics.links.country': 'Země',
  'analytics.links.lastEvent': 'Poslední kliknutí {relativeTime}',
  'analytics.links.privacyNote':
    'Zachováváme pouze přibližnou polohu a třídu zařízení. Nezpracované IP adresy se krátce uchovávají pro účely detekce zneužití a duplicit a poté se zahodí.',
  'analytics.links.separateSources':
    'Nepřidávejte tato kliknutí k číslu hlášenému platformou. Počítají různé věci.',
} as const;
