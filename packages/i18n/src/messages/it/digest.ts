/** Weekly digest copy for the Italian interface. */
export const digestMessages = {
  'digest.title': 'Questa settimana',
  'digest.subtitle': 'Ciò che possiamo vedere dal {windowStart} al {windowEnd}.',
  'digest.empty':
    'Non c’è ancora nulla da riassumere per questa settimana. Pubblica qualcosa e apparirà qui.',
  'digest.regenerate': 'Ricrea il riepilogo di questa settimana',
  'digest.generating': 'Creazione del riepilogo di questa settimana',
  'digest.source.deterministic':
    'Scritto dai tuoi dati di pubblicazione e dalle tue misurazioni, senza l’assistente di scrittura.',
  'digest.source.ai':
    'Scritto dall’assistente usando i tuoi dati. Ogni numero è stato verificato confrontandolo con quei dati.',
  'digest.unavailable.aiOff':
    'L’assistente di scrittura è disattivato, quindi questa è la versione semplice. Non manca nulla.',
  'digest.unavailable.rejected':
    'La versione dell’assistente non corrispondeva ai tuoi dati ed è stata eliminata. Questa è la versione semplice.',
  'digest.headline.published':
    '{published, plural, =0 {Nessun post completato} one {# post completato} other {# post completati}} tra {windowStart} e {windowEnd}.',
  'digest.headline.nothingPublished':
    'Non è stato pubblicato nulla tra {windowStart} e {windowEnd}.',
  'digest.outcome.published':
    '{count, plural, one {# post completato su {provider}} many {# post completati su {provider}} other {# post completati su {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {# post ha raggiunto alcune delle sue destinazioni su {provider}, ma non le altre} many {# post hanno raggiunto alcune delle loro destinazioni su {provider}, ma non le altre} other {# post hanno raggiunto alcune delle loro destinazioni su {provider}, ma non le altre}}.',
  'digest.outcome.failed':
    '{count, plural, one {# post non è stato inviato su {provider}} many {# post non sono stati inviati su {provider}} other {# post non sono stati inviati su {provider}}}.',
  'digest.metrics.noneYet':
    'Questa settimana non è ancora arrivata alcuna misurazione. Significa che non sappiamo come sono andati questi post, non che siano andati male.',
  'digest.freshness.statement':
    '{label, select, fresh {Le misurazioni sono state sincronizzate l’ultima volta alle {lastObservedAt}.} stale {Le misurazioni non vengono sincronizzate dal {lastObservedAt}, quindi i numeri sopra potrebbero non essere aggiornati.} other {Non è ancora stato sincronizzato nulla, quindi nulla di quanto sopra è misurato.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Da sapere: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Riepilogo settimanale via e-mail',
  'digest.settings.description':
    'Una breve e-mail ogni settimana con ciò che è stato pubblicato e ciò che abbiamo potuto misurare. Attivo per impostazione predefinita.',
  'digest.settings.enabled': 'Invia il riepilogo settimanale',
  'email.digest.subject': 'La tua settimana in {workspaceName}',
  'email.digest.intro':
    'Ecco ciò che possiamo vedere per {workspaceName} tra {windowStart} e {windowEnd}.',
  'email.digest.noData':
    'Questa settimana non abbiamo potuto misurare nulla. Quando manca un numero, è perché non abbiamo potuto leggerlo, non perché fosse zero.',
  'email.digest.footer':
    'Ricevi questa e-mail perché il riepilogo settimanale è attivo per {workspaceName}. Disattivalo nelle impostazioni dello spazio di lavoro.',
} as const;
