export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadaten                                                              */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'Planung, Plattform für Plattform',
  'web.meta.schedule.description':
    'Was jede Plattform in der Startkohorte von einem verbundenen Konto verlangt, die Grenzwerte, die ihre offizielle API durchsetzt, und wie weit dieses Produkt dagegen gekommen ist.',
  'web.meta.schedulePlatform.title': 'Planung für {platform}',
  'web.meta.schedulePlatform.description':
    'Was {platform} von einem verbundenen Konto verlangt, die Grenzwerte, die ihre offizielle API durchsetzt, und welche Teile davon dieses Produkt gebaut hat.',

  /* ---------------------------------------------------------------------- */
  /* Übersicht                                                              */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Planung, Plattform für Plattform',
  'web.schedule.index.lede':
    'Eine Seite pro Plattform in der Startkohorte. Jede legt dar, was die Plattform von einem verbundenen Konto verlangt, die Grenzwerte, die ihre offizielle API durchsetzt, und wo der Bau steht. Jede Zahl trägt das Dokument, aus dem sie stammt, und das Datum, an dem eine Person es gelesen hat.',
  'web.schedule.index.listLabel': 'Plattformen in der Startkohorte',
  'web.schedule.index.cohortNote':
    'Die Kohorte ist die Menge der Plattformen, für die dieses Produkt gebaut wird. Es ist ein Plan, keine Verfügbarkeitsliste.',
  'web.schedule.index.limitsKnown': 'Grenzwerte erfasst',
  'web.schedule.index.limitsUnknown': 'Grenzwerte noch nicht erfasst',

  /* ---------------------------------------------------------------------- */
  /* Plattformseite                                                         */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Planung für {platform}',
  'web.schedule.platform.lede':
    'Was {platform} von einem verbundenen Konto verlangt, die Grenzwerte, die ihre offizielle API durchsetzt, und gegen welche davon dieses Produkt bisher gebaut hat.',

  'web.schedule.notice.title': 'Noch wird nichts auf {platform} veröffentlicht',
  'web.schedule.notice.body':
    'Kein Connector hat seine Fertigstellungsdefinition erfüllt, und keiner ist in der Produktion verifiziert. Diese Seite beschreibt, was die Plattform verlangt und was dieses Produkt zu unterstützen beabsichtigt. Sie beschreibt keinen funktionierenden Planer.',

  'web.schedule.requirements.title': 'Was {platform} verlangt',
  'web.schedule.requirements.accountTypes': 'Kontotyp',
  'web.schedule.requirements.restriction': 'Plattformeinschränkung',
  'web.schedule.requirements.cost': 'API-Kosten',
  'web.schedule.requirements.unavailable.title': 'Noch kein geprüfter Connector-Eintrag',
  'web.schedule.requirements.unavailable.body':
    'Diese Plattform ist der Kohorte nach der letzten Connector-Recherche beigetreten, es gibt also noch keinen datierten Eintrag ihrer Kontoanforderungen zum Anzeigen. Er erscheint hier, sobald eine Person die offizielle Dokumentation gelesen und erfasst hat.',
  'web.schedule.requirements.apiSource': 'Offizielle API-Dokumentation',
  'web.schedule.requirements.policySource': 'Plattformrichtlinie',

  /* ---------------------------------------------------------------------- */
  /* Grenzwerte                                                             */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Grenzwerte, die {platform} durchsetzt',
  'web.schedule.limits.lede':
    'Gelesen für ein frisch verbundenes Konto ohne erhöhte Berechtigung. Eine Plattform kann jeden dieser Werte anheben oder senken, ohne jemanden zu benachrichtigen, weshalb jeder Satz das Datum trägt, an dem er gelesen wurde.',
  'web.schedule.limits.unavailable.title': 'Grenzwerte für {platform} nicht erfasst',
  'web.schedule.limits.unavailable.body':
    'Diese Version liefert keinen Adapter für diese Plattform, es gibt also keinen erfassten Höchstwert zum Anzeigen. Eine erfundene Zahl wäre schlimmer als keine.',
  'web.schedule.limits.sourceLabel': 'Offizielle Plattformdokumentation',

  'web.schedule.limits.text': 'Textkörper',
  'web.schedule.limits.title_field': 'Titelfeld',
  'web.schedule.limits.countingUnit': 'Wie Zeichen gezählt werden',
  'web.schedule.limits.links': 'Wie Links gezählt werden',
  'web.schedule.limits.images': 'Bilder pro Beitrag',
  'web.schedule.limits.videos': 'Videos pro Beitrag',
  'web.schedule.limits.videoDuration': 'Videolänge',
  'web.schedule.limits.imageBytes': 'Größtes Bild',
  'web.schedule.limits.gifBytes': 'Größtes animiertes Bild',
  'web.schedule.limits.videoBytes': 'Größtes Video',
  'web.schedule.limits.documentBytes': 'Größtes Dokument',
  'web.schedule.limits.altText': 'Alternativtext',
  'web.schedule.limits.mimeTypes': 'Akzeptierte Dateitypen',
  'web.schedule.limits.markdown': 'Formatierungszeichen',

  'web.schedule.value.characters': '{count, plural, one {# Zeichen} other {# Zeichen}}',
  'web.schedule.value.files': '{count, plural, =0 {Keine} one {# Datei} other {# Dateien}}',
  'web.schedule.value.durationRange': 'Zwischen {min} und {max}',
  'web.schedule.value.durationMax': 'Bis zu {max}',
  'web.schedule.value.markdownYes': 'Akzeptiert',
  'web.schedule.value.markdownNo': 'Als reine Zeichen veröffentlicht',

  'web.schedule.unit.utf16':
    'Nach UTF-16-Codeeinheit, was die meisten Editoren als Zeichenanzahl melden.',
  'web.schedule.unit.grapheme':
    'Nach Graphem, sodass ein aus mehreren Codepunkten bestehendes Emoji weiterhin ein Zeichen kostet.',
  'web.schedule.unit.weighted':
    'Nach einem gewichteten Schema, bei dem die meisten nicht-lateinischen Zeichen zwei statt eins kosten.',

  'web.schedule.link.none': 'Links werden nicht gegen den Höchstwert gezählt.',
  'web.schedule.link.actual': 'Ein Link kostet genau die Zeichen, die er belegt.',
  'web.schedule.link.fixed':
    'Jeder Link wird auf den Kürzer der Plattform umgeschrieben und kostet {count, plural, one {# Zeichen} other {# Zeichen}}, unabhängig von seiner tatsächlichen Länge.',

  /* ---------------------------------------------------------------------- */
  /* Fähigkeitsstatus                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'Was für {platform} gebaut ist',
  'web.schedule.capabilities.lede':
    'Aus der Connector-Registry erzeugt, nicht hier geschrieben. "Von der Plattform nicht angeboten" ist eine Tatsache über die Plattform und endgültig. "Noch nicht gebaut" ist eine Tatsache über dieses Produkt und die ehrliche Voreinstellung, solange kein Connector seine Fertigstellungsdefinition erfüllt hat.',
  'web.schedule.capabilities.unavailable.title': 'Noch kein Fähigkeitseintrag für {platform}',
  'web.schedule.capabilities.unavailable.body':
    'In dieser Version gibt es keinen Adapter, die Registry hat also nichts zu melden. Die Zeile erscheint auf der Fähigkeitsmatrix, sobald es etwas Reales zu sagen gibt.',
  'web.schedule.capabilities.matrixLink': 'Die vollständige Fähigkeitsmatrix lesen',

  'web.schedule.next.title': 'Wo es als Nächstes weitergeht',
  'web.schedule.next.body':
    'Die Fähigkeitsmatrix enthält jede Plattform und jede Fähigkeit in einer Tabelle. Die Anwendungsfall-Seiten beschreiben die Arbeitsabläufe, für die dieses Produkt gebaut wird.',
} as const;
