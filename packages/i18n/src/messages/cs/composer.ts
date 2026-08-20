/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Napsat',
  'composer.titleWithProject': 'Napište pro {project}',
  'composer.master.label': 'Hlavní návrh',
  'composer.master.description':
    'Napište jednou sem. Kompatibilní změny dosáhnou každého vybraného cíle. Otevřete cíl a zapište verzi, kterou obdrží pouze tento účet.',
  'composer.master.globalEdit': 'Globální úprava',
  'composer.master.placeholder': 'Co chcete publikovat?',
  'composer.brief.label': 'Stručně',
  'composer.brief.placeholder': 'Popište myšlenku, publikum a požadovaný výsledek.',
  'composer.sources.label': 'Odkazy na zdroje',
  'composer.sources.empty': 'Žádné připojené zdroje.',
  'composer.campaign.label': 'Kampaň',
  'composer.campaign.none': 'Žádná kampaň',
  'composer.contentLocale.label': 'Jazyk obsahu',
  'composer.contentLocale.help': 'Jazyk příspěvku. Toto je oddělené od jazyka vašeho rozhraní.',
  'composer.market.label': 'Trh s publikem',

  'composer.targets.title': 'Cíle',
  'composer.targets.count':
    '{count, plural, =0 {Nejsou vybrány žádné účty} one {# účet} other {# účty} few {# účty} many {# účty}}',
  'composer.targets.publishSummary':
    '{count, plural, one {Toto bude publikováno na # účet} other {Toto bude publikováno na # účty} few {Toto bude publikováno na # účty} many {Toto bude publikováno na # účty}} {when, select, now {nyní} scheduled {v naplánovaný čas} other {}}',
  'composer.targets.add': 'Přidat účty',
  'composer.targets.empty': 'Vyberte alespoň jeden účet pro publikování.',
  'composer.targets.state.ready': 'Připraveno',
  'composer.targets.state.inherited': 'Zděděno od předlohy',
  'composer.targets.state.overridden': 'Přepsáno',
  'composer.targets.state.warning': 'Před publikováním zkontrolujte',
  'composer.targets.state.error': 'Potřebuje opravu',
  'composer.targets.state.approvalNeeded': 'Je nutné schválení',
  'composer.targets.overrideBadge': 'Přepsat',
  'composer.targets.resetConfirm.title': 'Obnovit tento cíl na hlavní koncept?',
  'composer.targets.resetConfirm.body':
    'Kopírování, média a nastavení, které jste změnili pro {account} bude nahrazeno hlavním konceptem. Ostatní cíle nejsou ovlivněny.',
  'composer.targets.divergence':
    '{count, plural, one {# cíl se liší od hlavního návrhu} other {# cíle se liší od hlavního návrhu} few {# cíle se liší od hlavního návrhu} many {# cíle se liší od hlavního návrhu}}',

  'composer.applyToAll.title': 'Použít na všechny cíle',
  'composer.applyToAll.compatible':
    '{count, plural, one {# pole je kompatibilní s každým vybraným cílem} other {# pole jsou kompatibilní s každým vybraným cílem} few {# pole jsou kompatibilní s každým vybraným cílem} many {# pole jsou kompatibilní s každým vybraným cílem}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# pole nelze použít a zůstává na cíl} other {# pole nelze použít a zůstat na cíl} few {# pole nelze použít a zůstat na cíl} many {# pole nelze použít a zůstat na cíl}}',
  'composer.applyToAll.creates': 'Použití vytvoří explicitní verzi pro každý cíl.',

  'composer.editor.label': 'Text příspěvku',
  'composer.editor.characterCount': '{used} z {limit} znaků',
  'composer.editor.characterCountOver': '{over} znaků přes {limit} limit počtu znaků',
  'composer.editor.characterCountUnknown': 'Pro tento účet není k dispozici limit počtu znaků',
  'composer.editor.remaining':
    '{count, plural, one {# zbývající znak} other {# zbývajících znaků} few {# zbývajících znaků} many {# zbývajících znaků}}',
  'composer.editor.hashtagCount':
    '{count, plural, one {# hashtag} other {# hashtagy} few {# hashtagy} many {# hashtagy}}',
  'composer.editor.formatting': 'Formátování',
  'composer.editor.emoji': 'Emoji',
  'composer.editor.mention': 'Zmínka',
  'composer.editor.link': 'Odkaz',

  'composer.mentions.search': 'Vyhledávejte lidi, stránky a společnosti',
  'composer.mentions.searching': 'Vyhledávání {provider}',
  'composer.mentions.resolved': 'Označeno {label} na {provider}',
  'composer.mentions.unresolved':
    'Tato zmínka nebyla přiřazena k {provider} účet zatím. Dokud nevyberete výsledek, bude se publikovat jako prostý text.',
  'composer.mentions.noResults': 'Žádné odpovídající účty na {provider}.',
  'composer.mentions.unsupported': 'Nativní značkování není pro tento účet k dispozici.',

  'composer.destination.label': 'Cíl',
  'composer.destination.placeholder': 'Vyberte, kde bude tato publikace publikována',
  'composer.destination.community': 'Komunita',
  'composer.destination.board': 'Deska',
  'composer.destination.group': 'Skupina',
  'composer.destination.page': 'Stránka',
  'composer.destination.organization': 'Organizace',
  'composer.destination.channel': 'Kanál',
  'composer.destination.refresh': 'Obnovit cíle',
  'composer.destination.lastRefreshed': 'Cíle obnoveny {relativeTime}',

  'composer.media.title': 'Média',
  'composer.media.count':
    '{count, plural, one {# soubor} other {# soubory} few {# soubory} many {# soubory}}',
  'composer.media.dropHint': 'Sem přetáhněte soubory nebo procházejte svou knihovnu.',
  'composer.media.inheritFromMaster': 'Použití hlavního média',
  'composer.media.overridden': 'Tento cíl používá vlastní média',
  'composer.media.altText.label': 'Alternativní text',
  'composer.media.altText.placeholder':
    'Popište obrázek pro lidi, kteří používají čtečku obrazovky.',
  'composer.media.altText.missing': 'Chybí alternativní text.',
  'composer.media.altText.waive': 'Tento obrázek nepotřebuje alternativní text',
  'composer.media.altText.generate': 'Napište alternativní text',
  'composer.media.crop': 'Oříznout',
  'composer.media.resize': 'Změnit velikost',
  'composer.media.rotate': 'Otočit',
  'composer.media.compress': 'Komprimovat',
  'composer.media.convertFormat': 'Převést formát',
  'composer.media.thumbnail': 'Miniatura',
  'composer.media.aspectPreset': 'Přednastavená platforma',
  'composer.media.original': 'Původní',
  'composer.media.originalPreserved': 'Původní soubor je zachován. Úpravy vytvoří novou verzi.',
  'composer.media.uploading': 'Nahrávání {name}',
  'composer.media.processing': 'Příprava {name}',
  'composer.media.rights.label': 'Práva a souhlas',
  'composer.media.rights.confirm':
    'Mám právo publikovat toto médium, včetně všech lidí, hudby, log a značek v něm.',

  'composer.sequence.title': 'Komentáře a vlákno',
  'composer.sequence.root': 'Hlavní příspěvek',
  'composer.sequence.item': 'Položka {position}',
  'composer.sequence.add': 'Přidejte komentář nebo položku vlákna',
  'composer.sequence.delayLabel': 'Zpoždění po předchozí položce',
  'composer.sequence.delayImmediate': 'Ihned',
  'composer.sequence.delayMinutes':
    '{count, plural, one {# minuta} other {# minuty} few {# minuty} many {# minuty}}',
  'composer.sequence.delayCustom': 'Vlastní zpoždění',
  'composer.sequence.accountLabel': 'Publikovat tuto položku jako',
  'composer.sequence.unsupported': 'Tento účet nepodporuje plánované následné položky.',

  'composer.repeat.title': 'Opakujte',
  'composer.repeat.off': 'Neopakovat',
  'composer.repeat.everyDays':
    '{count, plural, one {Každý den} other {Každý # dnů} few {Každý # dnů} many {Každý # dnů}}',
  'composer.repeat.endLabel': 'Přestat opakovat',
  'composer.repeat.endOnDate': 'Na rande',
  'composer.repeat.endAfterCount': 'Po řadě příspěvků',
  'composer.repeat.endRequired': 'Vyberte datum ukončení nebo počet opakování.',
  'composer.repeat.summary':
    'Opakuje se {cadence} do {end}. Každý výskyt má své vlastní schválení a potvrzení.',

  'composer.links.title': 'Odkazy',
  'composer.links.keepOriginal': 'Zachovat původní URL',
  'composer.links.track': 'Nahradit sledovaným krátkým odkazem',
  'composer.links.utm': 'Parametry UTM',
  'composer.links.domain': 'Odkazová doména',
  'composer.links.finalUrl': 'Toto bude publikováno jako {url}',
  'composer.links.frozenAtApproval':
    'Přesná krátká adresa URL a cíl jsou zmrazeny ve schválené verzi.',

  'composer.signature.title': 'Podpis',
  'composer.signature.none': 'Žádný podpis',
  'composer.signature.autoApplied': 'Podpis {name} bylo přidáno automaticky. Můžete to změnit.',

  'composer.set.title': 'Sady',
  'composer.set.startFrom': 'Začněte ze sady',
  'composer.set.continueWithout': 'Pokračovat bez sady',
  'composer.set.applied': 'Použitá sada {name}. Tento koncept je nyní nezávislý na sadě.',

  'composer.validation.title': 'Ověření',
  'composer.validation.clean': 'Pro vybrané cíle nebyly nalezeny žádné problémy.',
  'composer.validation.issueCount':
    '{count, plural, one {# problém} other {# problémy} few {# problémy} many {# problémy}} napříč {targets, plural, one {# cíl} other {# cíle} few {# cíle} many {# cíle}}',
  'composer.validation.blocking': 'Toto musí být opraveno před plánováním.',
  'composer.validation.warning': 'Před publikováním toto zkontrolujte.',
  'composer.validation.revalidated':
    'Znovu zkontrolováno podle aktuálních limitů platformy {relativeTime}.',

  'composer.preview.title': 'Náhled',
  'composer.preview.forAccount': 'Náhled pro {account} na {provider}',
  'composer.preview.approximate':
    'Tento náhled používá pravidla platformy, která jsme zaznamenali. Publikovaný příspěvek se může lišit, pokud se změní platforma.',
  'composer.preview.unavailable': 'Skutečný náhled pro tento účet zatím není k dispozici.',

  'composer.cost.title': 'Odhadované náklady poskytovatele',
  'composer.cost.estimate': '{provider} odhady {amount} využití API pro tento příspěvek.',
  'composer.cost.linkSurcharge':
    '{provider} účtuje více za příspěvky, které obsahují URL. Odstraněním odkazu se odhad sníží.',
  'composer.cost.bulkWarning':
    '{count, plural, one {# publikace} other {# publikace} few {# publikace} many {# publikace}} v jedné akci. Než budete pokračovat, zkontrolujte odhad.',
  'composer.cost.reconciled': 'Skutečné využití je po zveřejnění odsouhlaseno.',
  'composer.cost.none': 'Žádné měřené náklady poskytovatele pro tento příspěvek.',

  'composer.autosave.saving': 'Ukládání',
  'composer.autosave.saved': 'Uloženo {relativeTime}',
  'composer.autosave.offline':
    'Offline. Váš koncept je uložen v tomto zařízení a bude synchronizován.',
  'composer.autosave.conflict':
    '{name} upravil tento koncept, když jste psali. Před uložením zkontrolujte obě verze.',
  'composer.autosave.failed': 'Nelze uložit. Váš text je stále zde. Opakuji.',

  'composer.ai.title': 'Asistence',
  'composer.ai.makeConcise': 'Uveďte stručněji',
  'composer.ai.adaptForPlatform': 'Přizpůsobit pro {provider}',
  'composer.ai.transcreate': 'Převést na {language}',
  'composer.ai.checkClaims': 'Zkontrolujte nároky',
  'composer.ai.writeAltText': 'Napište alternativní text',
  'composer.ai.suggestHooks': 'Navrhněte háčky',
  'composer.ai.suggestCta': 'Navrhněte výzvu k akci',
  'composer.ai.diffTitle': 'Navrhovaná změna',
  'composer.ai.diffHelp': 'Nic se nezmění, dokud to nepřijmete.',
  'composer.ai.working': 'Pracujeme na tom',
  'composer.ai.sources':
    'Založeno na {count, plural, one {# zdroj} other {# zdroje} few {# zdroje} many {# zdroje}} schválili jste',
  'composer.ai.uncertain':
    'Tato fráze nemá žádný čistý ekvivalent v {language}. Před publikováním si ji projděte s rodilým mluvčím.',

  'composer.schedule.title': 'Rozvrh',
  'composer.schedule.dateLabel': 'Datum',
  'composer.schedule.timeLabel': 'Čas',
  'composer.schedule.timeZoneLabel': 'Časové pásmo',
  'composer.schedule.nextFreeSlot': 'Další volný slot',
  'composer.schedule.localAndUtc': '{local} v {timeZone}. {utc} UTC.',
  'composer.schedule.dstWarning':
    'Hodiny se mění v {timeZone} k tomuto datu. Tento příspěvek běží na {local}, což je {utc} UTC.',
  'composer.schedule.pastWarning': 'Ta doba uplynula. Vyberte pozdější čas.',
  'composer.schedule.confirmTitle': 'Před plánováním potvrdit',
  'composer.schedule.confirmPublishNow': 'Před zveřejněním nyní potvrdit',
  'composer.schedule.approverLabel': 'Schvalovatel',
  'composer.schedule.policyLabel': 'Zásady schvalování',
  'composer.schedule.duplicateWarning':
    'Podobný obsah byl publikován jako {account} {relativeTime}. Jeho opětovné zveřejnění může porušit pravidla platformy týkající se duplicitního obsahu.',
  'composer.schedule.cadenceWarning':
    '{account} již má {count, plural, one {# příspěvek} other {# příspěvky} few {# příspěvky} many {# příspěvky}} naplánováno na ten den.',
} as const;
