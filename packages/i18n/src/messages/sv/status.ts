/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'Inget planerat ännu',
  'empty.calendar.body': 'Skriv ditt första inlägg och välj en tid. Du kan ändra det senare.',
  'empty.calendar.action': 'Skriv ett inlägg',
  'empty.drafts.title': 'Inga utkast',
  'empty.drafts.body': 'Utkast som du sparar visas här med sina mål och problem.',
  'empty.connections.title': 'Inga konton anslutna',
  'empty.connections.body':
    'Anslut ett konto för att publicera till det. Vi visar dig de exakta behörigheterna först.',
  'empty.connections.action': 'Anslut ett konto',
  'empty.analytics.title': 'Inga mätvärden än',
  'empty.analytics.body':
    'Mätvärden visas efter att ditt första inlägg har varit live tillräckligt länge för att plattformen ska kunna rapportera om det.',
  'empty.analytics.noPermission':
    'Det här kontot har inte beviljats analysåtkomst. Återanslut för att lägga till den.',
  'empty.approvals.title': 'Inget väntar på dig',
  'empty.approvals.body': 'Godkännandeförfrågningar för dina varumärken visas här.',
  'empty.library.title': 'Ditt bibliotek är tomt',
  'empty.library.body': 'Ladda upp bilder och video, eller importera dem från en URL eller API.',
  'empty.library.action': 'Ladda upp media',
  'empty.automation.title': 'Inga regler än',
  'empty.automation.body':
    'En regel reagerar på något och föreslår en åtgärd. Varje regel visar sina gränser innan du slår på den.',
  'empty.webhooks.title': 'Inga slutpunkter',
  'empty.webhooks.body':
    'Lägg till en slutpunkt för att ta emot signerade händelser om publicering och anslutningar.',
  'empty.searchResults.title': 'Inga resultat för {query}',
  'empty.searchResults.body': 'Kontrollera stavningen eller rensa ett filter.',
  'empty.filtered.title': 'Ingenting matchar dessa filter',
  'empty.filtered.action': 'Rensa filter',
  'empty.auditLog.title': 'Ingen aktivitet ännu',
  'empty.receipts.title': 'Inga kvitton ännu',
  'empty.receipts.body': 'Varje publikation producerar ett kvitto som du kan inspektera och dela.',

  'loading.default': 'Laddar',
  'loading.calendar': 'Laddar din kalender',
  'loading.analytics': 'Laddar mätvärden',
  'loading.preview': 'Bygger förhandsvisningen',
  'loading.validating': 'Kontrollerar mot nuvarande plattformsgränser',
  'loading.publishing': 'Publicerar till {provider}',
  'loading.uploading': 'Laddar upp {name}',
  'loading.uploadProgress': '{percent} laddat upp',
  'loading.connecting': 'Ansluter till {provider}',
  'loading.savingDraft': 'Sparar ditt utkast',
  'loading.generatingPlan': 'Bygg din plan',
  'loading.longRunning': 'Detta tar längre tid än vanligt. Den körs fortfarande.',

  'offline.banner': 'Du är offline. Ändringar sparas på den här enheten.',
  'offline.draftSafe': 'Ditt utkast är säkert. Det synkroniseras när du är online igen.',
  'offline.publishDisabled': 'Publicering behöver en koppling. Detta kommer inte att köas tyst.',
  'offline.scheduleQueued':
    'Denna schemabegäran står i kö på den här enheten och kommer att skickas när du är online igen.',
  'offline.reconnected': 'Tillbaka online. Synkroniserar dina ändringar.',
  'offline.syncConflict':
    'Vissa ändringar kunde inte slås samman automatiskt. Granska dem innan du sparar.',

  'permission.denied.title': 'Du har inte tillgång till detta',
  'permission.denied.role': 'Detta behöver rollen {role}. Du är {currentRole}.',
  'permission.denied.scope': 'Denna legitimation behöver omfattningen {scope}.',
  'permission.denied.contactOwner': 'Be {owner} att bevilja det.',
  'permission.denied.brandScope': 'Din åtkomst är begränsad till {brands}.',
  'permission.readOnly': 'Den här arbetsytan är skrivskyddad just nu.',
  'permission.mfaRequired': 'Bekräfta med tvåfaktorsautentisering för att fortsätta.',

  'rateLimit.title': 'Sakta ner en stund',
  'rateLimit.body': 'Du har gjort {count} förfrågningar i {window}. Gränsen är {limit}.',
  'rateLimit.resetsAt': 'Detta återställs till {time}.',
  'rateLimit.cheaperAlternative':
    'Genom att schemalägga istället för att publicera nu undviks denna gräns.',
  'rateLimit.providerCost':
    '{provider} avgifter per operation. Denna åtgärd beräknas till {amount}.',

  'incident.providerDegraded':
    '{provider} har problem. Schemalagda inlägg fortsätter att försöka igen.',
  'incident.providerDown':
    '{provider} är inte tillgänglig. Ingenting går förlorat och ingenting dupliceras.',
  'incident.isolated': 'Andra plattformar påverkas inte.',
  'incident.statusPage': 'Livestatus efter kontakt och yta',
  'incident.startedAt': 'Startade {relativeTime}',

  'translation.incomplete':
    'En del text på den här skärmen är inte översatt till {language} ännu och visas på engelska.',
  'translation.beta': 'Detta språk är i beta. Rapportera allt som är fel.',

  'confirm.discardChanges.title': 'Vill du ignorera dina ändringar?',
  'confirm.discardChanges.body': 'Detta kan inte ångras.',
  'confirm.deleteItem.title': 'Ta bort {name}?',
  'confirm.deleteItem.body': 'Detta kan inte ångras.',
  'confirm.cancelScheduled.title': 'Vill du avbryta detta schemalagda inlägg?',
  'confirm.cancelScheduled.body':
    'Den kommer inte att publiceras. Utkastet stannar här så att du kan schemalägga det igen.',
  'confirm.publishNow.title': 'Publicera nu?',
  'confirm.publishNow.body':
    '{count, plural, one {Detta publiceras till # konto omedelbart} other {Detta publiceras till # konton omedelbart}}. Den kan inte återkallas från Relay.',
  'confirm.typeToConfirm': 'Skriv {word} för att bekräfta.',
} as const;
