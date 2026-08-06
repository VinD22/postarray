/** Workspace settings: members, roles, brands, localization, security, data. */
export const settingsMessages = {
  'settings.title': 'Nastavení',
  'settings.saved': 'Uloženo',
  'settings.unsavedChanges': 'Máte neuložené změny.',

  'settings.workspace.title': 'Pracovní prostor',
  'settings.workspace.name': 'Název pracovního prostoru',
  'settings.workspace.defaultTimeZone': 'Výchozí časové pásmo',
  'settings.workspace.defaultLocale': 'Výchozí jazyk rozhraní',
  'settings.workspace.defaultContentLocale': 'Výchozí jazyk obsahu',
  'settings.workspace.transferOwnership': 'Převést vlastnictví',
  'settings.workspace.delete': 'Smazat pracovní prostor',
  'settings.workspace.deleteWarning':
    'Smazání pracovního prostoru zruší naplánované příspěvky, zruší připojení a odstraní uložená média. Účtenky jsou uchovávány po dobu uchování uvedenou v Podmínkách.',

  'settings.members.title': 'Členové a role',
  'settings.members.invite': 'Pozvat lidi',
  'settings.members.inviteEmail': 'E-mailová adresa',
  'settings.members.inviteSent': 'Pozvánka odeslána na {email}.',
  'settings.members.pending': 'Pozváni, dosud nepřijati',
  'settings.members.count':
    '{count, plural, one {# člen} other {# členové} few {# členové} many {# členové}}',
  'settings.members.removeConfirm':
    'Odebrat {name} z tohoto pracovního prostoru? Jejich minulé akce zůstávají v protokolu auditu.',
  'settings.role.owner.label': 'Vlastník',
  'settings.role.admin.label': 'Správce',
  'settings.role.manager.label': 'Manažer',
  'settings.role.editor.label': 'Editor',
  'settings.role.approver.label': 'Schvalovatel',
  'settings.role.analyst.label': 'Analytik',
  'settings.role.viewer.label': 'Prohlížeč',
  'settings.role.owner.description': 'Vše včetně fakturace, zabezpečení a mazání.',
  'settings.role.admin.description': 'Vše kromě fakturace a mazání pracovního prostoru.',
  'settings.role.manager.description': 'Spravujte značky, připojení, plány a pravidla.',
  'settings.role.editor.description': 'Vytvářejte a upravujte obsah, požádejte o schválení.',
  'settings.role.approver.description':
    'Schvalte nebo odmítněte obsah a naplánujte, co bude schváleno.',
  'settings.role.analyst.description': 'Přečtěte si analýzy a účtenky.',
  'settings.role.viewer.description': 'Pouze pro čtení.',
  'settings.role.scopeLabel': 'Omezení na značky a účty',
  'settings.role.mfaRequired': 'Vlastníci musí používat dvoufaktorové ověřování.',

  'settings.brands.title': 'Značky',
  'settings.brands.add': 'Přidat značku',
  'settings.brands.voice': 'Hlas',
  'settings.brands.audience': 'Publikum',
  'settings.brands.approvedClaims': 'Schválené nároky',
  'settings.brands.blockedTerms': 'Blokované výrazy',
  'settings.brands.disclosureDefaults': 'Výchozí nastavení zveřejňování',
  'settings.brands.domains': 'Domény',
  'settings.brands.glossary.title': 'Glosář',
  'settings.brands.glossary.term': 'Termín',
  'settings.brands.glossary.preferred': 'Preferovaný překlad',
  'settings.brands.glossary.prohibited': 'Nepřekládat jako',
  'settings.brands.glossary.context': 'Kontext',
  'settings.brands.glossary.keepUntranslated': 'Ponechat nepřeložené',
  'settings.brands.localeRules.title': 'Místní pravidla',
  'settings.brands.localeRules.formality': 'Formality',
  'settings.brands.localeRules.pronouns': 'Zájmena a čestná jména',
  'settings.brands.localeRules.idioms': 'Idiomy, kterým je třeba se vyhnout',
  'settings.brands.localeRules.emoji': 'Normy pro emotikony a hashtagy',
  'settings.brands.localeRules.legal': 'Regionální právní informace',
  'settings.brands.localeRules.cta': 'Výzva k akci podle trhu',
  'settings.brands.localeRules.reviewedExamples': 'Příklady schválené nativním recenzentem',

  'settings.sets.title': 'Sady',
  'settings.sets.description':
    'Opakovatelně použitelná skupina cílů, variant, nastavení, komentářů a zpoždění. Použitím sady se vytvoří nezávislý koncept.',
  'settings.sets.editNote':
    'Úprava sady nezmění příspěvky, které jsou již schváleny nebo naplánovány.',
  'settings.signatures.title': 'Podpisy',
  'settings.signatures.description':
    'Závěrečný text, hashtagy, odkazy nebo zveřejnění v rozsahu podle značky, platformy a jazyka.',
  'settings.signatures.autoApply': 'Přidat automaticky, když se kontext shoduje',

  'settings.localization.title': 'Lokalizace',
  'settings.localization.interfaceLocale': 'Jazyk rozhraní',
  'settings.localization.interfaceLocaleHelp':
    'Jazyk této aplikace pro vás. Nemění to jazyk vašich příspěvků.',
  'settings.localization.contentLocales': 'Jazyky obsahu',
  'settings.localization.contentLocalesHelp':
    'Jazyky, ve kterých publikujete. Každá značka může nastavit pravidla a slovník pro každý jazyk.',
  'settings.localization.marketLocales': 'Trhy s publikem',
  'settings.localization.beta': 'Beta překlad',
  'settings.localization.betaHelp':
    'Tento jazyk je podporovaný strojem a ještě není plně zkontrolován osobou. Nepřeložený text se vrátí do angličtiny.',
  'settings.localization.humanReviewed': 'Recenzováno rodilým mluvčím',
  'settings.localization.timeZone': 'Časové pásmo',
  'settings.localization.weekStart': 'První den v týdnu',
  'settings.localization.hourCycle.label': 'Formát času',
  'settings.localization.hourCycle.h12': '12 hodin',
  'settings.localization.hourCycle.h23': '24 hodin',

  'settings.notifications.title': 'Oznámení',
  'settings.notifications.email': 'E-mail',
  'settings.notifications.inApp': 'V aplikaci',
  'settings.notifications.approvalRequests': 'Žádosti o schválení',
  'settings.notifications.publishResults': 'Publikovat výsledky',
  'settings.notifications.connectionHealth': 'Stav připojení',
  'settings.notifications.ruleFailures': 'Selhání automatizace',
  'settings.notifications.weeklySummary': 'Týdenní shrnutí',
  'settings.notifications.digestOnly': 'Seskupit je do jedné denní zprávy',

  'settings.security.title': 'Zabezpečení',
  'settings.security.mfa': 'Dvoufaktorové ověření',
  'settings.security.mfaEnable': 'Zapněte dvoufaktorové ověřování',
  'settings.security.mfaRequiredFor':
    'Požadováno pro změny fakturace, servisní účty, opětovné připojení účtu a zrušení přihlašovacích údajů.',
  'settings.security.passkeys': 'Heslové klíče',
  'settings.security.sessions': 'Aktivní relace',
  'settings.security.sessionRevoke': 'Odhlaste se z této relace',
  'settings.security.auditLog.title': 'Revizní protokol',
  'settings.security.auditLog.description':
    'Každá akce, kdo nebo co ji provedl a kdy. Exportovatelné vlastníky a správci.',
  'settings.security.killSwitch': 'Nouzové zastavení',
  'settings.security.killSwitchBody':
    'Okamžitě zastaví každou naplánovanou publikaci a automatizaci v tomto pracovním prostoru. Nic není smazáno. Můžete jej znovu vypnout.',
  'settings.security.killSwitchActive':
    'Nouzové zastavení je zapnuto. Žádný příspěvek nebude publikován.',

  'settings.data.title': 'Ovládací prvky dat',
  'settings.data.export': 'Exportujte svá data',
  'settings.data.exportPreparing': 'Příprava exportu. Až bude připraven, zašleme vám e-mail.',
  'settings.data.deletionRequest': 'Požádat o smazání',
  'settings.data.deletionExplain':
    'Smazání zruší naplánované pracovní postupy, zruší přístup poskytovatele, odstraní uložená média a analýzy náhrobků tam, kde to poskytovatel vyžaduje.',
  'settings.data.retention': 'Udržení',
  'settings.data.consents': 'Souhlasy',
  'settings.data.consent.productAnalytics': 'Analýza produktů',
  'settings.data.consent.diagnostics': 'Sdílejte diagnostiku s podporou',
  'settings.data.consent.aiImprovement':
    'Použijte můj obsah ke zlepšení asistenta. Tato funkce je vypnutá, dokud ji nezapnete.',
  'settings.data.consent.marketingEmail': 'Novinky o produktech e-mailem',
} as const;
