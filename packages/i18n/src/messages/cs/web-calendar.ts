/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'Facebook',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Vlákna',
  'web.provider.bluesky': 'Bluesky',
  'web.provider.mastodon': 'Mastodon',
  'web.provider.telegram': 'Telegram',
  'web.provider.reddit': 'Reddit',
  'web.provider.wordpress': 'WordPress',
  'web.provider.medium': 'Medium',
  'web.provider.devto': 'Dev.to',
  'web.provider.pinterest': 'Pinterest',
  'web.provider.discord': 'Discord',
  'web.provider.slack': 'Slack',
  'web.connection.requirement.mastodon':
    'Mastodon se připojuje přístupovým tokenem vytvořeným na vaší instanci, ne heslem.',
  'web.connection.requirement.telegram':
    'Relay publikuje jako bot. Přidejte bota do kanálu nebo skupiny, kam chcete publikovat.',
  'web.connection.requirement.reddit':
    'Psaní na Redditu vyžaduje schválenou aplikaci a každý příspěvek potřebuje nadpis a subreddit.',
  'web.connection.requirement.wordpress':
    'Relay publikuje přes REST API webu s heslem aplikace vytvořeným ve WordPressu.',
  'web.connection.requirement.medium':
    'Medium se připojuje přes OAuth a Relay publikuje veřejné příběhy v Markdownu.',
  'web.connection.requirement.devto':
    'Dev.to se připojuje klíčem API vytvořeným v nastavení Dev.to.',
  'web.connection.requirement.pinterest':
    'Psaní na Pinterestu vyžaduje schválený přístup aplikace a pin potřebuje obrázek a vlastní nástěnku.',
  'web.connection.requirement.discord':
    'Relay publikuje jako bot. Přidejte bota na servery a kanály, kam chcete publikovat.',
  'web.connection.requirement.slack':
    'Relay publikuje jako aplikace. Přidejte aplikaci do kanálů, kam chcete publikovat.',
  'web.provider.fake': 'Testovací konektor',

  'web.accountType.personal_profile': 'Osobní profil',
  'web.accountType.creator_profile': 'Účet tvůrce',
  'web.accountType.business_profile': 'Firemní účet',
  'web.accountType.page': 'Stránka',
  'web.accountType.organization': 'Organizace',
  'web.accountType.channel': 'Kanál',
  'web.accountType.group': 'Skupina',
  'web.accountType.board': 'Deska',
  'web.accountType.community': 'Komunita',
  'web.accountType.publication': 'Publikace',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Vše naplánované, čekající na schválení, zveřejněné nebo zablokované, na jednom místě.',
  'web.calendar.view.agenda': 'Agenda',
  'web.calendar.view.table': 'Tabulka',
  'web.calendar.view.switchLabel': 'Vyberte, jak je rozvrh uspořádán',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} až {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'Zobrazuje se {range} v {timeZone}',
  'web.calendar.timeZone.workspace': 'Časové pásmo pracovního prostoru: {timeZone}',
  'web.calendar.timeZone.change': 'Změna v nastavení pracovního prostoru',
  'web.calendar.jumpToDate': 'Přejít na datum',
  'web.calendar.nowLabel': 'Nyní',
  'web.calendar.allDayHeading': 'Zatím není přesný čas',

  'web.calendar.filter.group': 'Skupina zákazníků',
  'web.calendar.filter.anyProject': 'Jakýkoli projekt',
  'web.calendar.filter.anyAccount': 'Jakýkoli účet',
  'web.calendar.filter.anyPlatform': 'Jakákoli platforma',
  'web.calendar.filter.anyStatus': 'Jakýkoli stav',
  'web.calendar.filter.anyLocale': 'Jakýkoli jazyk obsahu',
  'web.calendar.filter.anyCampaign': 'Jakákoli kampaň',
  'web.calendar.filter.anyGroup': 'Každá skupina',
  'web.calendar.filter.regionLabel': 'Filtrovat plán',
  'web.calendar.bucket.scheduled': 'Naplánováno',
  'web.calendar.bucket.draft': 'Návrhy a schválení',
  'web.calendar.bucket.published': 'Publikováno',
  'web.calendar.bucket.failed': 'Vyžaduje pozornost',
  'web.calendar.filter.summary':
    '{count, plural, =0 {Žádné filtry} one {# filtr} other {# filtry} few {# filtry} many {# filtry}}, {results, plural, =0 {žádné příspěvky} one {# příspěvek} other {# příspěvky} few {# příspěvky} many {# příspěvky}}',

  'web.calendar.grid.label': 'Mřížka plánu pro {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Nic na {time} na {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {Zobrazit # další příspěvek} other {Zobrazit # další příspěvky} few {Zobrazit # další příspěvky} many {Zobrazit # další příspěvky}}',
  'web.calendar.month.label': 'Měsíční mřížka pro {month}',
  'web.calendar.agenda.label': 'Agenda pro {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Nic naplánováno',

  'web.calendar.table.caption': 'Každý příspěvek v {range}, seřazeno podle času zveřejnění.',
  'web.calendar.table.column.time': 'Čas',
  'web.calendar.table.column.account': 'Účet',
  'web.calendar.table.column.content': 'Obsah',
  'web.calendar.table.column.language': 'Jazyk',
  'web.calendar.table.column.media': 'Média',
  'web.calendar.table.column.status': 'Stav',
  'web.calendar.table.column.approver': 'Schvalovatel',
  'web.calendar.table.column.campaign': 'Kampaň',
  'web.calendar.table.column.actions': 'Akce',
  'web.calendar.table.rowMenu': 'Akce pro {title}',
  'web.calendar.table.noApprover': 'Není potřeba žádné schválení',
  'web.calendar.table.noCampaign': 'Žádná kampaň',

  'web.calendar.entry.untitled': 'Koncept bez názvu',
  'web.calendar.entry.language': 'Jazyk {locale}',
  'web.calendar.entry.openDetail': 'Otevřít {title}',
  'web.calendar.entry.selected': '{title} vybráno. {hint}',
  'web.calendar.detail.title': 'Plánovaný příspěvek',
  'web.calendar.detail.close': 'Zavřít tento příspěvek',

  'web.calendar.keyboard.title': 'Přesuňte příspěvek pomocí klávesnice',
  'web.calendar.keyboard.body':
    'Zaměřte příspěvek a stisknutím klávesy Enter jej otevřete. Stisknutím M vyzvednete příspěvek, poté jej pomocí kláves se šipkami posuňte o jeden slot a Enter pro potvrzení. Stisknutím Escape jej vrátíte zpět.',
  'web.calendar.keyboard.pickUp': 'Přesunout tento příspěvek',
  'web.calendar.keyboard.grabbed':
    '{title} vyzvednuto z {from}. Šipkami jej pohybujte. Enter potvrzuje. Útěk se ruší.',
  'web.calendar.keyboard.moved': 'Navrhovaný čas {to}. Enter potvrzuje.',
  'web.calendar.keyboard.released': '{title} vrátit zpět na {from}.',
  'web.calendar.keyboard.stepMinutes': 'Každý krok je {minutes} minut.',

  'web.calendar.reschedule.title': 'Přesunout tento příspěvek?',
  'web.calendar.reschedule.subject': '{account} na {provider}',
  'web.calendar.reschedule.from': 'Od {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'Komu {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Přesunout příspěvek',
  'web.calendar.reschedule.dstTitle': 'Hodiny se mezi těmito dvěma časy mění',
  'web.calendar.reschedule.dstBody':
    'Posun v {timeZone} je {fromOffset} za starých časů a {toOffset} v novém čase. Místní hodina, kterou jste vybrali, je zachována, takže okamžitý UTC se posune.',
  'web.calendar.reschedule.conflictTitle': 'Další příspěvky jsou blízko této době',
  'web.calendar.reschedule.conflictBody':
    '{account} již má {count, plural, one {# příspěvek} other {# příspěvky} few {# příspěvky} many {# příspěvky}} v rámci {window} nové doby.',
  'web.calendar.reschedule.campaignTitle': 'Konflikt kampaní',
  'web.calendar.reschedule.campaignBody':
    'Kampaň {campaign} běží od {start} až {end}. Nový čas je mimo toto okno.',
  'web.calendar.reschedule.leadTimeTitle': 'To je velmi brzy',
  'web.calendar.reschedule.leadTimeBody':
    'Nový čas je {duration} od nynějška. {provider} potřebuje {required} k přípravě média pro tento typ příspěvku.',
  'web.calendar.reschedule.pastTitle': 'Ta doba uplynula',
  'web.calendar.reschedule.pastBody': 'Vyberte čas v budoucnosti nebo místo toho publikujte nyní.',

  'web.calendar.published.title': 'Tento příspěvek je již publikován',
  'web.calendar.published.body':
    'Příspěvek existuje na {provider} na {permalinkLabel}. Přesunutím záznamu ve štafetě se neposune sloupek na plošině. Vyberte si, co chcete, aby se stalo.',
  'web.calendar.published.optionLocal': 'Aktualizovat pouze místní záznam',
  'web.calendar.published.optionLocalHint':
    'Potvrzení uchovává skutečný čas zveřejnění. Přesouvá se pouze záznam plánování, takže váš kalendář odpovídá vašemu plánu.',
  'web.calendar.published.optionNew': 'Naplánujte nový příspěvek na nový čas',
  'web.calendar.published.optionNewHint':
    'Tím se vytvoří druhý samostatný externí příspěvek. Ten, který je již na {provider} zůstává online.',
  'web.calendar.published.optionLabel': 'Co by se mělo stát',

  'web.calendar.attention.title':
    '{count, plural, one {# příspěvek potřebuje rozhodnutí nebo opravu} other {# příspěvky vyžadují rozhodnutí nebo opravu} few {# příspěvky vyžadují rozhodnutí nebo opravu} many {# příspěvky vyžadují rozhodnutí nebo opravu}}',
  'web.calendar.attention.body': 'Zůstanou zde a v centru akcí, dokud nebudou vyřešeny.',
  'web.calendar.attention.open': 'Otevřít centrum akcí',
  'web.calendar.attention.showOnly': 'Zobrazit pouze tyto',

  'web.calendar.loading': 'Načítání rozvrhu',
  'web.calendar.error.title': 'Rozvrh nelze načíst',
  'web.calendar.error.body':
    'Nic naplánovaného se nezměnilo. Vaše příspěvky se stále zveřejňují v plánovaných časech.',
  'web.calendar.error.retry': 'Zkuste to znovu',
  'web.calendar.empty.example':
    '09:30 Evropa/Berlín, X @acme, „Naplánované první komentáře jsou aktivní“, Naplánováno, 1 obrázek',
  'web.calendar.emptyFiltered.body':
    'Žádný příspěvek v {range} odpovídá těmto filtrům. Rozšiřte rozsah nebo vymažte filtr.',
  'web.calendar.offline.title': 'Jste offline',
  'web.calendar.offline.body':
    'Plán níže je poslední kopie načtená tímto zařízením. Změna plánu a publikování nejsou k dispozici, dokud se připojení nevrátí.',
  'web.calendar.rateLimited.cause':
    'Tento pracovní prostor čte kalendář vícekrát, než umožňuje aktuální okno.',
  'web.calendar.rateLimited.resetLabel': 'Můžete to zkusit znovu v',
  'web.calendar.rateLimited.resetUnknown': '{provider} neuvedl, kdy se to resetuje.',
  'web.calendar.permission.requirementsLabel': 'Požadovaný rozsah',
  'web.calendar.permission.title': 'Tento kalendář nevidíte',
  'web.calendar.permission.body':
    'Přístup do kalendáře je udělen pro každý projekt. Váš účet není u projektů v tomto zobrazení.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Kalendář',
  'web.receipt.breadcrumb.post': 'Příspěvek',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Načítání potvrzení o publikaci',
  'web.receipt.notFound.title': 'Žádná účtenka s tímto odkazem',
  'web.receipt.notFound.body':
    'Po odeslání příspěvku existuje potvrzení. Zkontrolujte referenci nebo otevřete příspěvek z kalendáře.',
  'web.receipt.error.title': 'Účtenku nelze načíst',
  'web.receipt.error.body':
    'Účtenka je neměnná a není tím ovlivněna. Nic nebylo znovu publikováno.',

  'web.receipt.section.summary': 'Co se stalo',
  'web.receipt.section.timeline': 'Časová osa události',
  'web.receipt.section.items': 'Kořenový příspěvek a následné položky',
  'web.receipt.section.attempts': 'Pokusy',
  'web.receipt.section.provenance': 'Provenience',
  'web.receipt.section.cost': 'Využití poskytovatele',
  'web.receipt.section.analytics': 'Synchronizace Analytics',
  'web.receipt.section.targets': 'Cíle v této kampani',

  'web.receipt.item.root': 'Kořenový příspěvek',
  'web.receipt.item.comment': 'Komentář {position}',
  'web.receipt.item.thread': 'Část závitu {position}',
  'web.receipt.item.delay': 'Běží {delay} po kořenovém příspěvku',
  'web.receipt.item.noDelay': 'Běží s kořenovým příspěvkem',
  'web.receipt.item.pending': 'Zatím nezahájeno',
  'web.receipt.item.rootUnaffected':
    'Kořenový příspěvek je aktivní. Následná položka, která selže, to nikdy nezmění.',

  'web.receipt.attempt.heading': 'Pokus {number}',
  'web.receipt.attempt.startedAt': 'Zahájeno {time}',
  'web.receipt.attempt.startedLabel': 'Zahájeno',
  'web.receipt.attempt.responseSummary': 'Odpověď poskytovatele dezinfikována',
  'web.receipt.attempt.duration': 'Trvalo {duration}',
  'web.receipt.attempt.httpStatus': 'Stav HTTP',
  'web.receipt.attempt.providerRequestId': 'Reference požadavku poskytovatele',
  'web.receipt.attempt.retryable': 'Opakováno automaticky',
  'web.receipt.attempt.notRetryable': 'Nezkoušeno automaticky',
  'web.receipt.attempt.nextRetry': 'Další pokus na {time}',
  'web.receipt.attempt.nextRetryLabel': 'Další pokus',
  'web.receipt.attempt.showResponse': 'Ukázat vyčištěnou odpověď poskytovatele',
  'web.receipt.attempt.hideResponse': 'Skrýt vyčištěnou odpověď poskytovatele',
  'web.receipt.attempt.none': 'Jeden pokus, žádné selhání.',

  'web.receipt.provenance.capabilityVersion': 'Snímek schopností',
  'web.receipt.provenance.capabilityHint':
    'Snímek použitý při schvalování a znovu zkontrolovaný před odesláním.',
  'web.receipt.provenance.accountType': 'Typ účtu',
  'web.receipt.provenance.externalAccount': 'Reference externího účtu',
  'web.receipt.provenance.workflow': 'Reference pracovního postupu',
  'web.receipt.provenance.createdAt': 'Stvrzenka sepsána {time}',

  'web.receipt.approval.notRequired': 'Pro tento cíl nebylo vyžadováno žádné schválení.',
  'web.receipt.approval.policy': 'Zásady {policy}',
  'web.receipt.approval.unknownPolicy': 'Odkaz na zásady nebyl zaznamenán',

  'web.receipt.cost.currency': 'Účtováno v {currency}',
  'web.receipt.cost.estimatedLabel': 'Odhad před zveřejněním',
  'web.receipt.cost.actualLabel': 'Odsouhlasené skutečné',
  'web.receipt.provenance.writtenLabel': 'Stvrzenka sepsána',
  'web.receipt.cost.reconciledAt': 'Odsouhlaseno {time}',
  'web.receipt.cost.notMetered': '{provider} neúčtuje za operaci pro tento typ příspěvku.',

  'web.receipt.analytics.never': 'Analytics se pro tento příspěvek ještě nesynchronizoval.',
  'web.receipt.analytics.explain':
    'Poskytovatelé agregují podle svých vlastních plánů. Níže uvedený čas je čas, kdy je Relay naposledy četla, nikoli kdy byla čísla pravdivá.',

  'web.receipt.export.download': 'Stáhněte si účtenku',
  'web.receipt.export.copyReference': 'Zkopírujte odkaz na účtenku',
  'web.receipt.export.denied':
    'Sdílení účtenky vyžaduje roli vlastníka, správce nebo schvalovatele. Jste {role}.',

  'web.receipt.partial.retryFailedOnly': 'Zkuste znovu pouze cíle, které selhaly',
  'web.receipt.partial.retryHint':
    'Opakování se nikdy nedotkne cíle, který již vytvořil externí příspěvek.',

  'web.receipt.remediation.user_action_required':
    'To vyžaduje změnu v relé nebo na {provider} než bude možné znovu spustit.',
  'web.receipt.remediation.content_invalid':
    'Upravte obsah tak, aby prošel {provider} ověření a poté jej naplánujte znovu.',
  'web.receipt.remediation.transient_provider':
    '{provider} vrátilo dočasnou chybu. Relé opakovalo podle vlastního plánu.',
  'web.receipt.remediation.permanent_provider':
    '{provider} to trvale odmítl. Opakovaný pokus o stejný obsah nezmění odpověď.',
  'web.receipt.remediation.internal':
    'Byla to chyba na naší straně. Je zaznamenáno s odkazem níže.',
  'web.receipt.remediation.unknown':
    '{provider} vrátil něco, pro co nemáme pravidlo. Dezinfikovaná odpověď je níže.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Účty',
  'web.connection.tab.capabilities': 'Matice schopností',
  'web.connection.tab.groups': 'Skupiny zákazníků',
  'web.connection.loading': 'Načítání propojených účtů',
  'web.connection.error.title': 'Propojené účty nelze načíst',
  'web.connection.error.body':
    'Publikování není ovlivněno. Naplánované příspěvky stále běží proti uloženému přístupu.',
  'web.connection.list.label': 'Propojené účty',
  'web.connection.empty.example':
    'X, @acme, osobní profil, připojeno 12. června Ana Ruiz, publikování a metriky, naposledy publikováno 6. srpna',
  'web.connection.filter.provider': 'Platforma',
  'web.connection.filter.health': 'Zdraví',
  'web.connection.filter.group': 'Skupina zákazníků',
  'web.connection.filter.anyHealth': 'Jakékoli zdraví',
  'web.connection.healthFilter.healthy': 'Pracuje',
  'web.connection.healthFilter.expiring_soon': 'Brzy vyprší',
  'web.connection.healthFilter.expired': 'Platnost přístupu vypršela',
  'web.connection.healthFilter.revoked': 'Přístup odvolán',
  'web.connection.healthFilter.permission_missing': 'Chybí oprávnění',
  'web.connection.healthFilter.review_pending': 'Čekání na kontrolu platformy',
  'web.connection.healthFilter.paused': 'Pozastaveno',
  'web.connection.healthFilter.unknown': 'Zdraví nedostupné',

  'web.connection.row.summaryLabel': 'Co tento účet umí',
  'web.connection.row.expand': 'Zobrazit úplný souhrn pro {account}',
  'web.connection.row.collapse': 'Skrýt úplný souhrn pro {account}',
  'web.connection.row.metered': 'Měřeno na operaci. Odhadovaný {amount} za vytvoření příspěvku.',
  'web.connection.row.limitationHeading': 'Omezení tohoto účtu',
  'web.connection.row.noLimitations': 'Pro tento účet není omezena produkce ani beta.',
  'web.connection.row.beta': 'Beta konektor',
  'web.connection.row.betaBody':
    'Tento konektor funguje, s limity, které jsme nedokončili. Zkontrolujte publikovaný příspěvek, než se na něj spolehnete.',

  'web.connection.detail.expiryLabel': 'Platnost přístupu vyprší',
  'web.connection.health.expiresIn': 'Platnost přístupu vyprší {relativeTime}, dne {date}',
  'web.connection.health.noExpiry': 'Tento přístup nevyprší podle plánu {provider} nám říká.',
  'web.connection.health.checkedAt': 'Kontrola stavu {relativeTime}',

  'web.connection.action.inspect': 'Kontrola oprávnění',
  'web.connection.action.viewCapabilities': 'Podívejte se, co podporuje',
  'web.connection.action.moveGroup': 'Přesunout do jiné skupiny',
  'web.connection.action.menu': 'Další akce pro {account}',

  'web.connection.pause.title': 'Pozastavit {account}?',
  'web.connection.resume.title': 'Pokračovat {account}?',
  'web.connection.resume.body':
    'Naplánované příspěvky pro tento účet se začnou znovu publikovat v plánovaných časech. Příspěvky, jejichž čas již uplynul, se zpětně nespouštějí.',
  'web.connection.disconnect.confirmWord': 'ODPOJIT',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# plánovaný příspěvek} other {# plánované příspěvky} few {# plánované příspěvky} many {# plánované příspěvky}} pro tento účet nebude publikován.',
  'web.connection.disconnect.consequence.published':
    'Již zveřejněné příspěvky zůstávají na {provider}. Relé je nesmaže.',
  'web.connection.disconnect.consequence.analytics':
    'Již shromážděné metriky zůstanou v tomto pracovním prostoru a přestanou se aktualizovat.',

  'web.connection.connect.title': 'Připojit účet',
  'web.connection.connect.chooseProvider': 'Která platforma',
  'web.connection.connect.permissionHeading': 'Na co se relé zeptá {provider} pro',
  'web.connection.connect.requirementHeading': 'Než budete pokračovat',
  'web.connection.connect.continue': 'Pokračovat na {provider}',
  'web.connection.connect.handoffNote':
    'Další obrazovka je {provider}, nikoli relé. Relé nikdy neuvidí vaše heslo.',
  'web.connection.connect.noWriteWithoutApproval':
    'Připojení účtu nic nepublikuje. Každý příspěvek se stále řídí těmito zásadami schvalování pracovního prostoru.',
  'web.connection.projectScope.title': 'Kanály pro {project}',
  'web.connection.projectScope.body':
    'Nové kanály se připojují k tomuto projektu. Přepněte projekt na horní liště, abyste spravovali jinou sadu.',
  'web.connection.projectMissing.title': 'Vytvořte projekt před připojením kanálu',
  'web.connection.projectMissing.body':
    'Projekty udržují kanály, média, koncepty a harmonogramy různých produktů nebo klientů oddělené.',

  'web.connection.requirement.instagram':
    'Publikování na Instagramu vyžaduje profesionální účet, což znamená obchodní účet nebo účet tvůrce propojený se stránkou na Facebooku.',
  'web.connection.requirement.facebook':
    'Relay publikuje na facebookových stránkách. Osobní profil nemůže být cílem publikování.',
  'web.connection.requirement.linkedin':
    'K publikování pro organizaci potřebujete roli správce obsahu na této stránce LinkedIn.',
  'web.connection.requirement.youtube':
    'Dokud Google nedokončí audit aplikace, budou nahraná videa z tohoto projektu publikována jako soukromá. Viditelnost na YouTube můžete poté změnit.',
  'web.connection.requirement.tiktok':
    'TikTok vyžaduje, abyste si sami vybrali publikum pro každý příspěvek. Relé vám nemůže předvolit jedno.',
  'web.connection.requirement.x':
    'X poplatků za operaci. Příspěvek, který obsahuje adresu URL, stojí více než příspěvek ve formátu prostého textu a odhad se zobrazí před naplánováním.',
  'web.connection.requirement.threads':
    'Publikování vláken používá účet propojený s vaším profesionálním účtem na Instagramu.',
  'web.connection.requirement.bluesky':
    'Bluesky se připojí pomocí hesla aplikace vytvořeného v nastavení Bluesky, nikoli hesla vašeho účtu.',
  'web.connection.requirement.generic':
    'Potřebujete oprávnění k přidávání příspěvků na tento účet ze samotné platformy. Relé to nemůže udělit.',

  'web.connection.purpose.publish': 'Publikování příspěvků, které naplánujete v Relay.',
  'web.connection.purpose.readPosts':
    'Čtení příspěvku Relay zveřejněný, aby účtenka mohla prokázat, že je aktivní.',
  'web.connection.purpose.identity':
    'V Relay se zobrazuje přesný název účtu, takže nikdy nepublikujete na nesprávném účtu.',
  'web.connection.purpose.analytics':
    'Čtení metrik, které tato platforma uvádí pro vaše vlastní příspěvky.',
  'web.connection.purpose.refresh':
    'Udržování přístupu, aby naplánovaný příspěvek přes noc neselhal.',
  'web.connection.purpose.chooseDestination':
    'Seznam stránek a kanálů, které si můžete vybrat jako cíl publikování.',

  'web.connection.permissions.title': 'Oprávnění na {account}',
  'web.connection.permissions.scopeColumn': 'Oprávnění',
  'web.connection.permissions.stateColumn': 'Stav',
  'web.connection.permissions.purposeColumn': 'K čemu je relé používá',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {# oprávnění} other {# oprávnění} few {# oprávnění} many {# oprávnění}}. Chcete-li obnovit níže uvedené funkce, znovu se připojte a přijměte.',
  'web.connection.permissions.snapshot': 'Přečíst z {provider} {relativeTime}',

  'web.connection.capability.title': 'Matice schopností',
  'web.connection.capability.subtitle':
    'Vygenerováno z verzovaných definic konektorů v tomto sestavení, poté zkontrolováno ručně. Jsou to stejná data, která používá skladatel a stránka s veřejnými funkcemi.',
  'web.connection.capability.tableLabel': 'Schopnosti podle platformy',
  'web.connection.capability.featureColumn': 'Schopnost',
  'web.connection.capability.legendTitle': 'Jak to číst',
  'web.connection.capability.legend.supported':
    'Relé to dnes dokáže pro připojený účet správného typu.',
  'web.connection.capability.legend.not_implemented':
    'Platforma to nabízí a Relay to ještě nepostavilo. Je na mapě konektoru.',
  'web.connection.capability.legend.unsupported':
    'Platforma to prostřednictvím svého oficiálního API nenabízí, takže to žádný nástroj nemůže bezpečně provést.',
  'web.connection.capability.legend.requires_review':
    'Postaveno a platforma jej udělí až poté, co zkontroluje aplikaci nebo účet.',
  'web.connection.capability.versionLabel': 'Definice konektorů',
  'web.connection.capability.version': 'Verze definic konektorů {version}',
  'web.connection.capability.observedAt': 'Přečtený snímek {relativeTime}',
  'web.connection.capability.forAccount': 'Zobrazeno pro {account}',
  'web.connection.capability.noSnapshot':
    'Pro tento účet zatím neexistuje žádný snímek funkcí. Chcete-li si přečíst jeden, znovu se připojte.',
  'web.connection.capability.cellLabel': '{feature} na {provider}: {state}',

  'web.connection.group.title': 'Skupiny zákazníků',
  'web.connection.group.listLabel': 'Skupiny zákazníků',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Žádné účty} one {# účet} other {# účty} few {# účty} many {# účty}}',
  'web.connection.group.create': 'Vytvořit skupinu',
  'web.connection.group.nameLabel': 'Název skupiny',
  'web.connection.group.namePlaceholder': 'Acme EU',
  'web.connection.group.moveTitle': 'Přesunout {account}',
  'web.connection.group.moveLabel': 'Přesunout do',
  'web.connection.group.moveConfirm': 'Přesunout účet',
  'web.connection.group.movedAnnouncement': '{account} přesunuto do {group}',
  'web.connection.group.filterCalendarHint':
    'Skupina filtruje kalendář a analýzy. Přesunutím účtu zůstane zachován každý příspěvek, účtenka a metrika, kterou již má.',
  'web.connection.group.empty.title': 'Zatím žádné zákaznické skupiny',
  'web.connection.group.empty.body':
    'Skupina je klient nebo projekt. Seskupte účty a filtrujte kalendář a analýzy podle zákazníka.',

  'web.connection.incident.title': 'Tento účet vyžaduje pozornost',
  'web.connection.incident.remediationHeading': 'Co dělat',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# naplánovaný příspěvek je pozastaven} other {# naplánované příspěvky jsou pozastaveny} few {# naplánované příspěvky jsou pozastaveny} many {# naplánované příspěvky jsou pozastaveny}} pro tento účet.',
  'web.connection.incident.nothingLost': 'Nic není ztraceno a nic není duplikováno.',
} as const;
