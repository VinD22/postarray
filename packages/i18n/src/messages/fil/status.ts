/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'Wala pang nakaiskedyul',
  'empty.calendar.body':
    'Isulat ang iyong unang post at pumili ng oras. Maaari mo itong baguhin sa ibang pagkakataon.',
  'empty.calendar.action': 'Gumawa ng post',
  'empty.drafts.title': 'Walang draft',
  'empty.drafts.body':
    'Ang mga draft na na-save mo ay lalabas dito kasama ang mga target at isyu ng mga ito.',
  'empty.connections.title': 'Walang nakakonektang account',
  'empty.connections.body':
    'Ikonekta ang isang account upang mai-publish dito. Ipinapakita muna namin sa iyo ang eksaktong mga pahintulot.',
  'empty.connections.action': 'Ikonekta ang isang account',
  'empty.analytics.title': 'Wala pang sukatan',
  'empty.analytics.body':
    'Lumilitaw ang mga sukatan pagkatapos mabuhay nang sapat ang iyong unang post para maiulat ito ng platform.',
  'empty.analytics.noPermission':
    'Ang account na ito ay hindi nagbigay ng access sa analytics. Kumonekta muli upang idagdag ito.',
  'empty.approvals.title': 'Walang naghihintay sa iyo',
  'empty.approvals.body':
    'Lalabas dito ang mga kahilingan sa pag-apruba para sa iyong mga project.',
  'empty.library.title': 'Walang laman ang iyong library',
  'empty.library.body':
    'Mag-upload ng mga larawan at video, o i-import ang mga ito mula sa isang URL o sa API.',
  'empty.library.action': 'Mag-upload ng media',
  'empty.automation.title': 'Wala pang rules',
  'empty.automation.body':
    'Ang isang tuntunin ay tumutugon sa isang bagay at nagmumungkahi ng isang aksyon. Ipinapakita ng bawat panuntunan ang mga limitasyon nito bago mo ito i-on.',
  'empty.webhooks.title': 'Walang mga endpoint',
  'empty.webhooks.body':
    'Magdagdag ng endpoint para makatanggap ng mga nilagdaang kaganapan tungkol sa pag-publish at mga koneksyon.',
  'empty.searchResults.title': 'Walang mga resulta para sa {query}',
  'empty.searchResults.body': 'Suriin ang spelling, o i-clear ang isang filter.',
  'empty.filtered.title': 'Walang tumutugma sa mga filter na ito',
  'empty.filtered.action': 'I-clear ang mga filter',
  'empty.auditLog.title': 'Wala pang aktibidad',
  'empty.receipts.title': 'Wala pang resibo',
  'empty.receipts.body':
    'Ang bawat publikasyon ay gumagawa ng isang resibo na maaari mong suriin at ibahagi.',

  'loading.default': 'Naglo-load',
  'loading.calendar': 'Nilo-load ang iyong kalendaryo',
  'loading.analytics': 'Naglo-load ng mga sukatan',
  'loading.preview': 'Pagbuo ng preview',
  'loading.validating': 'Sinusuri laban sa kasalukuyang mga limitasyon ng platform',
  'loading.publishing': 'Publishing sa {provider}',
  'loading.uploading': 'Nag-a-upload {name}',
  'loading.uploadProgress': '{percent} na-upload',
  'loading.connecting': 'Kumokonekta sa {provider}',
  'loading.savingDraft': 'Sine-save ang iyong draft',
  'loading.generatingPlan': 'Pagbuo ng iyong plano',
  'loading.longRunning': 'Mas tumatagal ito kaysa karaniwan. Tumatakbo pa rin ito.',

  'offline.banner': 'Offline ka. Pinapanatili ang mga pagbabago sa device na ito.',
  'offline.draftSafe': 'Ligtas ang iyong draft. Nagsi-sync ito kapag online ka na ulit.',
  'offline.publishDisabled':
    'Ang pag-publish ay nangangailangan ng koneksyon. Hindi ito ipi-queue nang tahimik.',
  'offline.scheduleQueued':
    'Ang kahilingan sa iskedyul na ito ay naka-queue sa device na ito at ipapadala kapag online ka na.',
  'offline.reconnected': 'Balik online. Sini-sync ang iyong mga pagbabago.',
  'offline.syncConflict':
    'Ang ilang mga pagbabago ay hindi maaaring awtomatikong pagsamahin. Suriin ang mga ito bago i-save.',

  'permission.denied.title': 'Wala kang access dito',
  'permission.denied.role': 'Ito ay nangangailangan ng {role} papel. ikaw ay {currentRole}.',
  'permission.denied.scope': 'Ang kredensyal na ito ay nangangailangan ng saklaw {scope}.',
  'permission.denied.contactOwner': 'Magtanong {owner} upang ibigay ito.',
  'permission.denied.projectScope': 'Ang iyong pag-access ay limitado sa {projects}.',
  'permission.readOnly': 'Ang workspace na ito ay nababasa lang ngayon.',
  'permission.mfaRequired':
    'Kumpirmahin gamit ang dalawang salik na pagpapatotoo upang magpatuloy.',

  'rateLimit.title': 'Dahan dahan saglit',
  'rateLimit.body': 'Nakagawa ka na {count} mga kahilingan sa {window}. Ang limitasyon ay {limit}.',
  'rateLimit.resetsAt': 'Nagre-reset ito sa {time}.',
  'rateLimit.cheaperAlternative':
    'Iniiwasan na ngayon ng pag-iskedyul sa halip na mag-publish ang limitasyong ito.',
  'rateLimit.providerCost':
    '{provider} mga singil sa bawat operasyon. Ang pagkilos na ito ay tinatantya sa {amount}.',

  'incident.providerDegraded':
    '{provider} ay nagkakaproblema. Ang mga naka-iskedyul na post ay patuloy na sinusubukang muli.',
  'incident.providerDown': '{provider} ay hindi magagamit. Walang nawawala at walang nadodoble.',
  'incident.isolated': 'Ang ibang mga platform ay hindi naaapektuhan.',
  'incident.statusPage': 'Live na katayuan sa pamamagitan ng connector at surface',
  'incident.startedAt': 'Nagsimula {relativeTime}',

  'translation.incomplete':
    'Hindi isinasalin ang ilang teksto sa screen na ito {language} pa at ipinapakita sa Ingles.',
  'translation.beta': 'Ang wikang ito ay nasa beta. Iulat ang anumang maling nabasa.',

  'confirm.discardChanges.title': 'Itapon ang iyong mga pagbabago?',
  'confirm.discardChanges.body': 'Hindi na ito maaaring bawiin.',
  'confirm.deleteItem.title': 'Tanggalin {name}?',
  'confirm.deleteItem.body': 'Hindi na ito maaaring bawiin.',
  'confirm.cancelScheduled.title': 'Kanselahin ang nakaiskedyul na post na ito?',
  'confirm.cancelScheduled.body':
    'Hindi ito maglalathala. Nananatili rito ang draft para maiiskedyul mo itong muli.',
  'confirm.publishNow.title': 'I-publish ngayon?',
  'confirm.publishNow.body':
    '{count, plural, one {Ito ay naglalathala sa # account agad} other {Ito ay naglalathala sa # mga account kaagad}}. Hindi ito maalala mula sa Relay.',
  'confirm.typeToConfirm': 'Uri {word} para kumpirmahin.',
} as const;
