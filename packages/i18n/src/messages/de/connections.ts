/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'Verbindungen',
  'connection.subtitle':
    'Die Konten, Seiten und Kanäle, auf denen dieser Workspace veröffentlichen kann.',
  'connection.add': 'Verbinden Sie ein Konto',
  'connection.count': '{used, plural, one {# aktiver Kanal} other {# aktive Kanäle}} von {limit}',
  'connection.limitReached':
    'Dieser Workspace verwendet alle {limit} Kanäle. Trennen Sie einen, bevor Sie einen anderen verbinden.',

  'connection.account.label': 'Konto',
  'connection.account.type.profile': 'Profil',
  'connection.account.type.page': 'Seite',
  'connection.account.type.channel': 'Kanal',
  'connection.account.type.group': 'Gruppe',
  'connection.account.type.organization': 'Organisation',
  'connection.account.type.business': 'Geschäftskonto',
  'connection.account.type.creator': 'Erstellerkonto',
  'connection.connectedBy': 'Verbunden durch {name} auf {date}',
  'connection.lastPublished': 'Zuletzt veröffentlicht {relativeTime}',
  'connection.lastPublishedNever': 'Von diesem Konto wurde noch nichts veröffentlicht',
  'connection.lastAnalyticsSync': 'Analytics synchronisiert {relativeTime}',

  'connection.status.healthy': 'Funktionsfähig',
  'connection.status.expiringSoon': 'Läuft ab {relativeTime}',
  'connection.status.expired': 'Zugriff abgelaufen',
  'connection.status.revoked': 'Zugriff widerrufen',
  'connection.status.paused': 'Angehalten',
  'connection.status.permissionMissing': 'Fehlende Berechtigung',
  'connection.status.reviewPending': 'Warten auf Plattformüberprüfung',
  'connection.status.unknown': 'Gesundheit nicht verfügbar',

  'connection.token.expiresAt': 'Zugriff läuft ab {date}',
  'connection.token.expiryUnknown': '{provider} teilt uns nicht mit, wann dieser Zugriff abläuft.',

  'connection.permissions.title': 'Berechtigungen',
  'connection.permissions.granted': 'Gewährt',
  'connection.permissions.missing': 'Nicht gewährt',
  'connection.permissions.explainBeforeOAuth':
    'Relay wird {provider} um diese Berechtigungen bitten. Sie können die Verbindung jederzeit in den Einstellungen trennen.',
  'connection.permissions.whyNeeded': 'Warum das nötig ist',

  'connection.reconnect.title': 'Erneut verbinden {account}',
  'connection.reconnect.body':
    'Geplante Beiträge für dieses Konto werden zurückgehalten, bis die Verbindung wiederhergestellt wird. Nichts geht verloren.',
  'connection.disconnect.title': '{account} trennen?',
  'connection.disconnect.body':
    'Geplante Beiträge für dieses Konto werden nicht veröffentlicht. Bereits gesammelte Belege und Analysen bleiben in diesem Arbeitsbereich.',
  'connection.pause.body':
    'Ein pausiertes Konto behält seinen Verlauf und seinen Zeitplan bei, veröffentlicht es jedoch erst, wenn Sie es wieder aufnehmen.',

  'connection.incident.invalidToken':
    '{provider} hat den gespeicherten Zugriff für {account} abgelehnt. Stellen Sie die Verbindung wieder her, um die Veröffentlichung wiederherzustellen.',
  'connection.incident.permissionLost':
    '{account} gewährt {permission} nicht mehr. Stellen Sie die Verbindung wieder her und akzeptieren Sie diese Erlaubnis.',
  'connection.incident.roleLost':
    'Ihr {provider} Benutzer hat keine Rolle mehr auf {account}. Bitten Sie einen Administrator dieser Seite, sie wiederherzustellen.',
  'connection.incident.accountTypeInvalid':
    'Instagram braucht einen professionellen Account. Wechseln Sie {account} zu einem Geschäfts- oder Erstellerkonto und stellen Sie dann die Verbindung wieder her.',
  'connection.incident.reviewRestricted':
    '{provider} hat diese App bis zur Überprüfung eingeschränkt. Beiträge von {account} werden privat veröffentlicht, bis die Überprüfung abgeschlossen ist.',

  'connection.group.title': 'Kontogruppen',
  'connection.group.description':
    'Gruppieren Sie Konten nach Kunde oder Marke, um jeden Bildschirm zu filtern.',
  'connection.group.assign': 'In die Gruppe verschieben',
  'connection.group.none': 'Nicht gruppiert',
  'connection.group.moveNote':
    'Beim Verschieben eines Kontos bleiben dessen Beiträge, Belege und Analysen erhalten.',

  'connection.oauth.starting': '{provider} wird geöffnet',
  'connection.oauth.returned': 'Verbindung wird abgeschlossen',
  'connection.oauth.chooseAccounts': 'Wählen Sie aus, welche Konten verbunden werden sollen',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'Mit diesem {provider} Login können keine Konten verbunden werden. {reason}',
  'connection.oauth.canceled':
    'Die Verbindung wurde am {provider} abgebrochen. Es hat sich nichts geändert.',
  'connection.oauth.alreadyConnected': '{account} ist bereits mit diesem Arbeitsbereich verbunden.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} ist mit einem anderen Arbeitsbereich verbunden. Trennen Sie es dort zuerst.',

  'capability.title': 'Was dieses Konto unterstützt',
  'capability.matrix.title': 'Plattformfunktionen',
  'capability.matrix.subtitle':
    'Wird aus den von uns gepflegten und manuell überprüften Connector-Definitionen generiert.',
  'capability.level.supported': 'Unterstützt',
  'capability.level.unsupported': 'Wird von der Plattform nicht angeboten',
  'capability.level.not_implemented': 'Noch nicht gebaut',
  'capability.level.requires_review': 'Plattformüberprüfung erforderlich',
  'capability.level.beta': 'Beta',
  'capability.level.unknown': 'Nicht verfügbar',
  'capability.explain.supported': 'Relay kann dies heute für dieses Konto tun.',
  'capability.explain.unsupported':
    '{provider} bietet dies nicht über seine offizielle API an, sodass kein Tool dies sicher tun kann.',
  'capability.explain.not_implemented':
    '{provider} bietet dies an, aber Relay hat es noch nicht erstellt. Es steht auf der Connector-Roadmap.',
  'capability.explain.requires_review':
    '{provider} gewährt dies erst, nachdem es die App oder das Konto überprüft hat. Es bleibt nicht verfügbar, bis diese Überprüfung abgeschlossen ist.',
  'capability.explain.beta':
    'Dies funktioniert, mit Einschränkungen, die wir noch nicht vollständig überprüft haben. Überprüfen Sie das Ergebnis, bevor Sie sich darauf verlassen.',
  'capability.explain.unknown':
    'Wir konnten die aktuellen Berechtigungen für dieses Konto nicht lesen. Stellen Sie die Verbindung erneut her, um sie zu aktualisieren.',
  'capability.lastChecked': 'Überprüft {relativeTime}',
  'capability.feature.text': 'Textbeiträge',
  'capability.feature.image': 'Bilder',
  'capability.feature.carousel': 'Karussells',
  'capability.feature.video': 'Video',
  'capability.feature.document': 'Unterlagen',
  'capability.feature.firstComment': 'Geplanter erster Kommentar',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'Native Erwähnungen',
  'capability.feature.destinations': 'Zielauswahl',
  'capability.feature.privacy': 'Datenschutzkontrollen',
  'capability.feature.thumbnail': 'Benutzerdefinierte Miniaturansicht',
  'capability.feature.altText': 'Alt-Text',
  'capability.feature.analytics': 'Analytik',
  'capability.feature.delete': 'Einen veröffentlichten Beitrag löschen',
  'capability.feature.commentCount': 'Kommentar zählt',
  'capability.feature.commentReplies': 'Kommentare lesen und beantworten',
  'capability.feature.disclosure': 'Offenlegung der Automatisierung',
} as const;
