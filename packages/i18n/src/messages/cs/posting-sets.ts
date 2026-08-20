/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 *
 * Three features that all answer "who is this going to, and when", grouped in
 * one namespace so their vocabulary stays consistent. The hold copy is the part
 * most worth reading twice: pausing stops work that has not happened, and every
 * sentence here has to say that plainly rather than implying a post can be
 * pulled back off a platform.
 */
export const postingSetMessages = {
  /* ------------------------------------------------------------- the hold */
  'calendar.hold.action': 'Pozastavit',
  'calendar.hold.resumeAction': 'Obnovit',
  'calendar.hold.badge': 'Pozastaveno',
  'calendar.hold.badgeBilling': 'Pozastaveno kvůli fakturaci',
  'calendar.hold.term': 'Pozastavení',
  'calendar.hold.byPerson': 'Pozastaveno vámi dne {date}.',
  'calendar.hold.byBilling': 'Pozastaveno dne {date}, protože tento pracovní prostor ztratil plný přístup.',
  'calendar.hold.none': 'Nepozastaveno',

  'calendar.hold.confirmTitle': 'Pozastavit tento příspěvek?',
  'calendar.hold.confirmBody':
    'Tento příspěvek zůstane tam, kde je, a nebude publikován v {time}. Můžete ho kdykoli předtím obnovit, nebo vybrat nový čas, pokud už ten uplynul.',
  'calendar.hold.confirmScope':
    'Pozastavení zastaví to, co se ještě nestalo. Vše, co už bylo publikováno na platformě, zůstává publikováno, a pozastavení to nemaže ani neupravuje.',
  'calendar.hold.confirmNoteLabel': 'Proč to pozastavujete? (volitelné)',
  'calendar.hold.confirmNoteHint':
    'Uloženo v auditním záznamu pro váš tým. Neodesílá se na žádnou platformu.',
  'calendar.hold.confirm': 'Pozastavit tento příspěvek',
  'calendar.hold.cancel': 'Nechat naplánovaný',

  'calendar.hold.resumeTitle': 'Obnovit tento příspěvek?',
  'calendar.hold.resumeBody': 'Bude publikován v {time}, v pásmu {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'Tento čas uplynul',
  'calendar.hold.resumeMissedBody':
    'Tento příspěvek měl vyjít v {time}, zatímco byl pozastaven. Vyberte nový čas, aby nevyšel ve chvíli, kdy jej obnovíte.',
  'calendar.hold.resumeTimeLabel': 'Nový čas publikování',
  'calendar.hold.resumeConfirm': 'Obnovit',

  'calendar.hold.paused': 'Pozastaveno. Nebude publikován, dokud jej neobnovíte.',
  'calendar.hold.resumed': 'Obnoveno. Bude publikován v {time}.',

  'calendar.hold.blocked.published':
    'Tento příspěvek už byl publikován. Pozastavení jej nemůže vzít zpět z platformy.',
  'calendar.hold.blocked.inFlight':
    'Tento příspěvek se právě odesílá. Je příliš pozdě jej pozastavit a zastavení v polovině by ho mohlo nechat publikovaný jen zčásti.',
  'calendar.hold.blocked.finished': 'Tento příspěvek je již dokončen, takže není co pozastavovat.',
  'calendar.hold.blocked.billing':
    'Tento příspěvek je pozastaven, protože tento pracovní prostor ztratil plný přístup. Jeho obnovení je otázkou fakturace, ne plánování.',
  'calendar.hold.blocked.billingAction': 'Přejít na fakturaci',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Sady publikování',
  'set.lede':
    'Uložená odpověď na otázku „komu to publikuji a jak“. Použití Sady zkopíruje její nastavení do nového konceptu.',
  'set.appliedOnce':
    'Sada se čte pouze jednou, ve chvíli, kdy ji použijete. Její pozdější úprava mění, čím začíná další příspěvek. Koncepty a naplánované příspěvky, které jste z ní už vytvořili, zůstávají přesně tak, jak jsou.',
  'set.empty.title': 'Zatím žádné Sady',
  'set.empty.body': 'Vytvořte jednu, abyste přestali znovu sestavovat stejný seznam účtů pro každý příspěvek.',
  'set.create': 'Nová Sada',
  'set.edit': 'Upravit Sadu',
  'set.archive': 'Archivovat Sadu',
  'set.archived': 'Archivováno',
  'set.archivedNote': 'Archivované Sady jsou skryté ve výběru. Příspěvky z nich vytvořené se nemění.',
  'set.showArchived': 'Zobrazit archivované',
  'set.saved': 'Sada uložena.',
  'set.archivedToast': 'Sada archivována. Příspěvky z ní již vytvořené se nemění.',

  'set.field.name': 'Název',
  'set.field.nameHint': 'Podle čeho ji později poznáte ve výběru. Jedna na značku.',
  'set.field.description': 'Popis',
  'set.field.descriptionHint': 'Volitelné. K čemu tato Sada slouží.',
  'set.field.targets': 'Účty',
  'set.field.targetsHint': 'Každý účet, kterým začíná příspěvek vytvořený z této Sady.',
  'set.field.targetCount':
    '{count, plural, =0 {Žádné účty} one {# účet} few {# účty} many {# účtu} other {# účtů}}',
  'set.field.signature': 'Podpis',
  'set.field.signatureNone': 'Žádný podpis',
  'set.field.approval': 'Schválení',
  'set.field.approvalHint':
    'Schválení, které příspěvek vytvořený z této Sady potřebuje, než může být publikován.',
  'set.field.schedule': 'Kdy publikovat',

  'set.approval.none': 'Schválení není potřeba',
  'set.approval.single_approver': 'Jeden určený schvalovatel',
  'set.approval.any_approver': 'Kterýkoli schvalovatel',
  'set.approval.named_approver': 'Konkrétní schvalovatel',
  'set.approval.policy_auto': 'Cokoli říká zásada pracovního prostoru',

  'set.slot.next_free_slot': 'Další volný termín z fronty',
  'set.slot.next_free_slotHint':
    'Použije pravidla fronty této značky k navržení termínu. Navrhuje; vy potvrzujete.',
  'set.slot.pick_time': 'Zeptejte se mě na čas',
  'set.slot.pick_timeHint': 'Použití Sady ponechá čas prázdný, abyste jej vybrali vy.',
  'set.slot.draft_only': 'Nechat jako koncept',
  'set.slot.draft_onlyHint': 'Použití Sady se vůbec nedotkne plánu.',
  'set.slot.noRules':
    'Tato značka zatím nemá pravidla fronty, takže fronta nabídne první volnou hodinu a řekne to.',
  'set.slot.rulesLink': 'Pravidla fronty',

  'set.defaults.title': 'Výchozí hodnoty podle platformy',
  'set.defaults.body':
    'Počáteční hodnoty zkopírované do každého nového příspěvku. Kteroukoli z nich můžete později změnit v editoru.',
  'set.defaults.add': 'Přidat platformu',
  'set.defaults.remove': 'Odebrat výchozí hodnoty pro {platform}',
  'set.defaults.privacy': 'Soukromí',
  'set.defaults.privacyNone': 'Výchozí hodnota platformy',
  'set.defaults.bodyPrefix': 'Text před příspěvkem',
  'set.defaults.bodySuffix': 'Text za příspěvkem',
  'set.defaults.requireAltText': 'Vyžadovat alternativní text u každého obrázku',
  'set.defaults.requireAltTextHint':
    'Příspěvek vytvořený z této Sady nelze naplánovat na tuto platformu, dokud každý obrázek nemá alternativní text.',
  'set.defaults.empty': 'Žádné výchozí hodnoty podle platformy. Každý účet začíná od hlavního příspěvku.',

  'set.error.nameTaken': 'Jiná Sada v této značce už tento název používá.',
  'set.error.archived': 'Tato Sada je archivovaná. Před úpravou ji obnovte.',
  'set.error.duplicateTarget': 'Tento účet je již v této Sadě.',
  'set.error.duplicatePlatform': 'Tato Sada už má výchozí hodnoty pro tuto platformu.',

  /* --------------------------------------------------- remembered targets */
  'targetMemory.setting.title': 'Pamatovat si účty mezi příspěvky',
  'targetMemory.setting.body':
    'Když je toto zapnuto, editor začne každý nový příspěvek s účty, které daná osoba vybrala naposledy v této značce. Je vypnuto, dokud jej nezapnete.',
  'targetMemory.setting.stored':
    'Ukládá se pouze seznam účtů, a to jen pro osobu, která je vybrala. Neukládá se žádný popisek, čas, nastavení soukromí ani stav schválení, a nikdo jiný ve značce nevidí váš seznam.',
  'targetMemory.setting.offNote': 'Dokud je toto vypnuto, neukládá se vůbec nic.',
  'targetMemory.setting.turnOffWarning':
    'Vypnutím se smažou všechny uložené výběry v této značce, pro všechny.',
  'targetMemory.setting.enabled': 'Zapnuto',
  'targetMemory.setting.disabled': 'Vypnuto',
  'targetMemory.setting.saved': 'Nastavení uloženo.',
  'targetMemory.setting.cleared': 'Nastavení uloženo. Uložené výběry v této značce byly smazány.',

  'targetMemory.composer.restored':
    '{count, plural, one {Zahájeno s # účtem z minula.} few {Zahájeno s # účty z minula.} many {Zahájeno s # účtu z minula.} other {Zahájeno s # účty z minula.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {# účet, který jste použili minule, byl vynechán, protože vyžaduje pozornost.} few {# účty, které jste použili minule, byly vynechány, protože vyžadují pozornost.} many {# účtu, které jste použili minule, bylo vynecháno, protože vyžadují pozornost.} other {# účtů, které jste použili minule, bylo vynecháno, protože vyžadují pozornost.}}',
  'targetMemory.composer.droppedAll':
    'Žádný z účtů, které jste použili minule, není nyní dostupný, takže nic nebylo předvybráno.',
  'targetMemory.composer.undo': 'Vymazat výběr',
  'targetMemory.composer.forget': 'Přestat si pamatovat mé účty',
  'targetMemory.composer.forgotten': 'Váš uložený výběr byl smazán.',
  'targetMemory.composer.reviewAccounts': 'Zkontrolovat účty',
} as const;
