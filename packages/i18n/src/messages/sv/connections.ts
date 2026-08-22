/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'Anslutningar',
  'connection.subtitle': 'Konton, sidor och kanaler som denna arbetsyta kan publicera till.',
  'connection.add': 'Anslut ett konto',
  'connection.count': '{used, plural, one {# aktiv kanal} other {# aktiva kanaler}} av {limit}',
  'connection.limitReached':
    'Den här arbetsytan använder alla {limit} kanaler. Koppla bort en innan du ansluter en annan.',

  'connection.account.label': 'konto',
  'connection.account.type.profile': 'Profil',
  'connection.account.type.page': 'Sida',
  'connection.account.type.channel': 'Kanal',
  'connection.account.type.group': 'Grupp',
  'connection.account.type.organization': 'Organisation',
  'connection.account.type.business': 'Företagskonto',
  'connection.account.type.creator': 'Skaparkonto',
  'connection.connectedBy': 'Ansluts med {name} på {date}',
  'connection.lastPublished': 'Senast publicerad {relativeTime}',
  'connection.lastPublishedNever': 'Inget publicerat från detta konto ännu',
  'connection.lastAnalyticsSync': 'Analytics synkroniserad {relativeTime}',

  'connection.status.healthy': 'Arbetar',
  'connection.status.expiringSoon': 'Går ut {relativeTime}',
  'connection.status.expired': 'Åtkomsten har löpt ut',
  'connection.status.revoked': 'Åtkomst återkallad',
  'connection.status.paused': 'Pausad',
  'connection.status.permissionMissing': 'Saknar behörighet',
  'connection.status.reviewPending': 'Väntar på granskning av plattformen',
  'connection.status.unknown': 'Hälsa otillgänglig',

  'connection.token.expiresAt': 'Åtkomsten löper ut {date}',
  'connection.token.expiryUnknown': '{provider} berättar inte för oss när denna åtkomst går ut.',

  'connection.permissions.title': 'Behörigheter',
  'connection.permissions.granted': 'Beviljas',
  'connection.permissions.missing': 'Inte beviljat',
  'connection.permissions.explainBeforeOAuth':
    'Relay kommer att fråga {provider} om dessa behörigheter. Du kan koppla från när som helst.',
  'connection.permissions.whyNeeded': 'Varför detta behövs',

  'connection.reconnect.title': 'Återanslut {account}',
  'connection.reconnect.body':
    'Schemalagda inlägg för det här kontot väntas tills det återansluts. Ingenting är förlorat.',
  'connection.disconnect.title': 'Koppla bort {account}?',
  'connection.disconnect.body':
    'Schemalagda inlägg för det här kontot publiceras inte. Redan insamlade kvitton och analyser stannar i den här arbetsytan.',
  'connection.pause.body':
    'Ett pausat konto behåller sin historik och sitt schema, men publiceras inte förrän du återupptar det.',

  'connection.incident.invalidToken':
    '{provider} avvisade den lagrade åtkomsten för {account}. Återanslut för att återställa publicering.',
  'connection.incident.permissionLost':
    '{account} beviljar inte längre {permission}. Återanslut och acceptera den behörigheten.',
  'connection.incident.roleLost':
    'Din {provider} användare har inte längre en roll på {account}. Be en administratör för den sidan att återställa den.',
  'connection.incident.accountTypeInvalid':
    'Instagram behöver ett professionellt konto. Byt {account} till ett företags- eller skaparkonto och anslut sedan igen.',
  'connection.incident.reviewRestricted':
    '{provider} har begränsat denna app i väntan på granskning. Inlägg från {account} publiceras privat tills granskningen är klar.',

  'connection.group.title': 'Kundgrupper',
  'connection.group.description':
    'Gruppera konton efter kund eller projekt för att filtrera varje skärm.',
  'connection.group.assign': 'Flytta till grupp',
  'connection.group.none': 'Ogrupperad',
  'connection.group.moveNote': 'Att flytta ett konto behåller dess inlägg, kvitton och analyser.',

  'connection.oauth.starting': 'Öppning {provider}',
  'connection.oauth.returned': 'Avslutar anslutningen',
  'connection.oauth.chooseAccounts': 'Välj vilka konton som ska anslutas',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'Inga konton på denna {provider}-inloggning kan anslutas. {reason}',
  'connection.oauth.canceled': 'Anslutningen avbröts den {provider}. Ingenting förändrades.',
  'connection.oauth.alreadyConnected': '{account} är redan ansluten till den här arbetsytan.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} är ansluten till en annan arbetsyta. Koppla bort den där först.',

  'capability.title': 'Vad detta konto stöder',
  'capability.matrix.title': 'Plattformsmöjligheter',
  'capability.matrix.subtitle':
    'Genereras från anslutningsdefinitionerna som vi underhåller och granskar för hand.',
  'capability.level.supported': 'Stöds',
  'capability.level.unsupported': 'Erbjuds inte av plattformen',
  'capability.level.not_implemented': 'Inte byggt ännu',
  'capability.level.requires_review': 'Behöver granskning av plattformen',
  'capability.level.beta': 'Beta',
  'capability.level.unknown': 'Ej tillgänglig',
  'capability.explain.supported': 'Relay kan göra detta för detta konto idag.',
  'capability.explain.unsupported':
    '{provider} erbjuder inte detta via sitt officiella API, så inget verktyg kan göra det säkert.',
  'capability.explain.not_implemented':
    '{provider} erbjuder detta, men Relay har inte byggt det ännu. Det finns på anslutningsfärdplanen.',
  'capability.explain.requires_review':
    '{provider} beviljar detta endast efter att den granskat appen eller kontot. Den förblir otillgänglig tills den recensionen går igenom.',
  'capability.explain.beta':
    'Detta fungerar, med gränser som vi inte har verifierat klart. Kontrollera resultatet innan du litar på det.',
  'capability.explain.unknown':
    'Vi kunde inte läsa de aktuella behörigheterna för det här kontot. Återanslut för att uppdatera dem.',
  'capability.lastChecked': 'Markerad {relativeTime}',
  'capability.feature.text': 'Textinlägg',
  'capability.feature.image': 'Bilder',
  'capability.feature.carousel': 'Karuseller',
  'capability.feature.video': 'Video',
  'capability.feature.document': 'Dokument',
  'capability.feature.firstComment': 'Schemalagd första kommentar',
  'capability.feature.thread': 'Trådar',
  'capability.feature.mentions': 'Infödda nämner',
  'capability.feature.destinations': 'Val av destination',
  'capability.feature.privacy': 'Privacy controls',
  'capability.feature.thumbnail': 'Anpassad miniatyr',
  'capability.feature.altText': 'Alt text',
  'capability.feature.analytics': 'Analytics',
  'capability.feature.delete': 'Ta bort ett publicerat inlägg',
  'capability.feature.commentCount': 'Kommentar räknas',
  'capability.feature.commentReplies': 'Läser och svarar på kommentarer',
  'capability.feature.disclosure': 'Automationsavslöjande',
} as const;
