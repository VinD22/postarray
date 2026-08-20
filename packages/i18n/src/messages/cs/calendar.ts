/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Kalendář',
  'calendar.view.day': 'Den',
  'calendar.view.week': 'Týden',
  'calendar.view.month': 'Měsíc',
  'calendar.view.list': 'Seznam',
  'calendar.view.label': 'Zobrazení kalendáře',
  'calendar.today': 'Dnes',
  'calendar.goToDate': 'Přejít na datum',
  'calendar.previousPeriod': 'Předchozí období',
  'calendar.nextPeriod': 'Příští období',
  'calendar.timeZoneNote': 'Časy jsou uvedeny v {timeZone}.',
  'calendar.weekOf': 'Týden {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount':
    '{count, plural, =0 {Nic naplánováno} one {# příspěvek} other {# příspěvky} few {# příspěvky} many {# příspěvky}}',
  'calendar.slotOverflow':
    '{count, plural, one {# více} other {# více} few {# více} many {# více}}',
  'calendar.newPostAt': 'Nový příspěvek na {time}',

  'calendar.filter.project': 'Značka',
  'calendar.filter.account': 'Účet',
  'calendar.filter.platform': 'Platforma',
  'calendar.filter.status': 'Stav',
  'calendar.filter.locale': 'Jazyk obsahu',
  'calendar.filter.campaign': 'Kampaň',
  'calendar.filter.applied':
    '{count, plural, one {# použit filtr} other {# použité filtry} few {# použité filtry} many {# použité filtry}}',

  'calendar.drag.instructions':
    'Přetáhněte příspěvek do nového slotu nebo jej vyberte a pomocí kláves se šipkami jej přesuňte.',
  'calendar.drag.confirmTitle': 'Přesunout tento příspěvek?',
  'calendar.drag.confirmBody': 'Od {from} až {to} v {timeZone}.',
  'calendar.drag.dstNotice': 'Hodiny se mezi těmito časy mění v {timeZone}. Nový čas je {utc} UTC.',
  'calendar.drag.publishedNotice':
    'Tento příspěvek je již publikován. Přesunutím se změní pouze místní záznam. Opětovné zveřejnění je samostatná akce.',
  'calendar.drag.conflictNotice':
    '{account} již má {count, plural, one {# příspěvek} other {# příspěvky} few {# příspěvky} many {# příspěvky}} do hodiny od nového času.',

  'calendar.queue.title': 'Fronta',
  'calendar.queue.upcoming': 'Připravované',
  'calendar.queue.needsApproval': 'Čekání na schválení',
  'calendar.queue.drafts': 'Koncepty',
  'calendar.queue.published': 'Publikováno',
  'calendar.queue.failed': 'Neúspěšné',
  'calendar.queue.nextSlot': 'Další volný slot je {time}.',

  'calendar.post.publishesAt': 'Publikuje {time} v {timeZone}',
  'calendar.post.publishedAt': 'Publikováno {time}',
  'calendar.post.targetCount':
    '{count, plural, one {# účet} other {# účty} few {# účty} many {# účty}}',
  'calendar.post.mediaType.text': 'Text',
  'calendar.post.mediaType.image': 'Obrázek',
  'calendar.post.mediaType.carousel': 'Karusel',
  'calendar.post.mediaType.video': 'Video',
  'calendar.post.mediaType.document': 'Dokument',

  'actionCenter.title': 'Centrum akcí',
  'actionCenter.description': 'Vše, co potřebuje rozhodnutí nebo opravu, v jedné frontě.',
  'actionCenter.empty': 'Nic teď nevyžaduje pozornost.',
  'actionCenter.item.connectionExpiring':
    '{account} je třeba znovu připojit před {date} nebo naplánované příspěvky selžou.',
  'actionCenter.item.connectionActionRequired':
    '{account} vyžaduje pozornost na {provider}, než bude moci znovu publikovat.',
  'actionCenter.item.validationFailed': 'Návrh pro {account} neprošlo {provider} ověření.',
  'actionCenter.item.approvalOverdue': 'Žádost o schválení čeká od {date}.',
  'actionCenter.item.scheduleConflict': '{account} má příspěvky naplánované blízko sebe na {date}.',
  'actionCenter.item.providerIncident':
    '{provider} hlásí problém. Naplánované příspěvky se pokusí znovu.',
  'actionCenter.item.commentFailed':
    'Hlavní příspěvek byl zveřejněn, ale následná položka pro {account} se nezdařilo.',
  'actionCenter.item.analyticsStale': 'Analytics pro {account} nebyly aktualizovány od {date}.',
  'actionCenter.item.rssStalled': 'Zdroj {name} nevrátil platnou položku od {date}.',
  'actionCenter.item.webhookFailing':
    'Dodávky do {endpoint} selhalo {count, plural, one {# čas} other {# krát} few {# krát} many {# krát}} v řadě.',
  'actionCenter.item.usageBalance':
    'Měřená akce pro {provider} potřebuje před spuštěním rovnováhu využití.',

  'approval.title': 'Schválení',
  'approval.requestTitle': 'Žádost o schválení',
  'approval.requestedBy': 'Požadováno {name} {relativeTime}',
  'approval.requestedFrom': 'Čekání na {name}',
  'approval.policy.none': 'Pro tyto cíle není vyžadován žádný souhlas.',
  'approval.policy.anyApprover': 'Toto může schválit každý schvalovatel.',
  'approval.policy.namedApprover': '{name}.',
  'approval.policy.everyApprover': 'Toto musí schválit každý schvalovatel.',
  'approval.decision.approvedBy': 'Schváleno {name} na {date}',
  'approval.decision.rejectedBy': 'Odmítnuto uživatelem {name} na {date}',
  'approval.decision.changesRequestedBy': 'Změny požadované uživatelem {name} na {date}',
  'approval.comment.label': 'Poznámka pro autora',
  'approval.comment.placeholder': 'Řekněte, co je třeba změnit a proč.',
  'approval.reapproval.needed':
    'Tento příspěvek se po schválení změnil. Než bude možné publikovat, potřebuje znovu schválení.',
  'approval.reapproval.reason.content': 'Obsah se změnil.',
  'approval.reapproval.reason.account': 'Cílové účty se změnily.',
  'approval.reapproval.reason.media': 'Média se změnila.',
  'approval.reapproval.reason.schedule': 'Změnil se čas publikování.',
  'approval.reapproval.reason.privacy':
    'Nastavení ochrany osobních údajů nebo zveřejňování se změnilo.',
  'approval.reapproval.reason.locale': 'Změnil se jazyk obsahu.',
  'approval.expiresAt': 'Platnost této žádosti vyprší {date}.',
} as const;
