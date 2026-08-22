/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'Zatím není nic naplánováno',
  'empty.calendar.body': 'Napište svůj první příspěvek a vyberte čas. Můžete jej později změnit.',
  'empty.calendar.action': 'Napsat příspěvek',
  'empty.drafts.title': 'Žádné koncepty',
  'empty.drafts.body': 'Koncepty, které uložíte, se zobrazí zde se svými cíli a problémy.',
  'empty.connections.title': 'Žádné připojené účty',
  'empty.connections.body':
    'Připojte účet, do kterého chcete publikovat. Nejprve vám ukážeme přesná oprávnění.',
  'empty.connections.action': 'Připojit účet',
  'empty.analytics.title': 'Zatím žádné metriky',
  'empty.analytics.body':
    'Metriky se zobrazí poté, co byl váš první příspěvek aktivní dostatečně dlouho na to, aby o něm platforma mohla informovat.',
  'empty.analytics.noPermission':
    'Tento účet neudělil analytický přístup. Znovu se připojte a přidejte jej.',
  'empty.approvals.title': 'Nic na vás nečeká',
  'empty.approvals.body': 'Zde se zobrazují žádosti o schválení vašich projektů.',
  'empty.library.title': 'Vaše knihovna je prázdná',
  'empty.library.body':
    'Nahrajte obrázky a videa nebo je importujte z adresy URL nebo rozhraní API.',
  'empty.library.action': 'Nahrát média',
  'empty.automation.title': 'Zatím žádná pravidla',
  'empty.automation.body':
    'Pravidlo na něco reaguje a navrhuje akci. Každé pravidlo ukazuje své limity, než je zapnete.',
  'empty.webhooks.title': 'Žádné koncové body',
  'empty.webhooks.body':
    'Přidejte koncový bod pro příjem podepsaných událostí o publikování a připojení.',
  'empty.searchResults.title': 'Žádné výsledky pro {query}',
  'empty.searchResults.body': 'Zkontrolujte pravopis nebo vymažte filtr.',
  'empty.filtered.title': 'Těmto filtrům neodpovídá nic',
  'empty.filtered.action': 'Vymazat filtry',
  'empty.auditLog.title': 'Zatím žádná aktivita',
  'empty.receipts.title': 'Zatím žádné účtenky',
  'empty.receipts.body': 'Každá publikace obsahuje účtenku, kterou si můžete prohlédnout a sdílet.',

  'loading.default': 'Načítání',
  'loading.calendar': 'Načítání kalendáře',
  'loading.analytics': 'Načítání metrik',
  'loading.preview': 'Vytváření náhledu',
  'loading.validating': 'Kontrola podle aktuálních limitů platformy',
  'loading.publishing': 'Publikování na {provider}',
  'loading.uploading': 'Nahrávání {name}',
  'loading.uploadProgress': '{percent} nahráno',
  'loading.connecting': 'Připojování k {provider}',
  'loading.savingDraft': 'Ukládání konceptu',
  'loading.generatingPlan': 'Sestavení plánu',
  'loading.longRunning': 'Trvá to déle než obvykle. Stále běží.',

  'offline.banner': 'Jste offline. Změny jsou uloženy na tomto zařízení.',
  'offline.draftSafe': 'Váš koncept je v bezpečí. Synchronizuje se, když jste opět online.',
  'offline.publishDisabled':
    'Publikování vyžaduje připojení. Toto nebude zařazeno do fronty v tichosti.',
  'offline.scheduleQueued':
    'Tento plánovací požadavek je na tomto zařízení zařazen do fronty a bude odeslán, až budete opět online.',
  'offline.reconnected': 'Zpět online. Synchronizace vašich změn.',
  'offline.syncConflict':
    'Některé změny nebylo možné sloučit automaticky. Před uložením je zkontrolujte.',

  'permission.denied.title': 'K tomuto nemáte přístup',
  'permission.denied.role': 'To vyžaduje {role} role. Jste {currentRole}.',
  'permission.denied.scope': 'Toto pověření vyžaduje rozsah {scope}.',
  'permission.denied.contactOwner': 'Zeptejte se {owner} k udělení.',
  'permission.denied.projectScope': 'Váš přístup je omezen na {projects}.',
  'permission.readOnly': 'Tento pracovní prostor je nyní pouze pro čtení.',
  'permission.mfaRequired': 'Pro pokračování potvrďte dvoufaktorovou autentizací.',

  'rateLimit.title': 'Na chvíli zpomal',
  'rateLimit.body': 'Udělali jste {count} požadavky v {window}. Limit je {limit}.',
  'rateLimit.resetsAt': 'Toto se resetuje na {time}.',
  'rateLimit.cheaperAlternative': 'Tento limit se nyní vyhýbá plánováním namísto publikování.',
  'rateLimit.providerCost': '{provider} poplatky za operaci. Tato akce se odhaduje na {amount}.',

  'incident.providerDegraded': '{provider} má problémy. Naplánované příspěvky se neustále opakují.',
  'incident.providerDown': '{provider} není k dispozici. Nic se neztratí a nic se nezduplikuje.',
  'incident.isolated': 'Ostatní platformy nejsou ovlivněny.',
  'incident.statusPage': 'Aktivní stav podle konektoru a povrchu',
  'incident.startedAt': 'Zahájeno {relativeTime}',

  'translation.incomplete':
    'Některý text na této obrazovce není přeložen do {language} a je zobrazen v angličtině.',
  'translation.beta': 'Tento jazyk je ve verzi beta. Nahlaste vše, co se čte špatně.',

  'confirm.discardChanges.title': 'Zahodit změny?',
  'confirm.discardChanges.body': 'Toto nelze vrátit zpět.',
  'confirm.deleteItem.title': 'Smazat {name}?',
  'confirm.deleteItem.body': 'Toto nelze vrátit zpět.',
  'confirm.cancelScheduled.title': 'Zrušit tento naplánovaný příspěvek?',
  'confirm.cancelScheduled.body':
    'Nebude zveřejněno. Koncept zde zůstane, takže jej můžete znovu naplánovat.',
  'confirm.publishNow.title': 'Publikovat nyní?',
  'confirm.publishNow.body':
    '{count, plural, one {Toto publikuje na # účet ihned} other {Toto publikuje na # účty okamžitě} few {Toto publikuje na # účty okamžitě} many {Toto publikuje na # účty okamžitě}}. Nelze jej odvolat z relé.',
  'confirm.typeToConfirm': 'Typ {word} pro potvrzení.',
} as const;
