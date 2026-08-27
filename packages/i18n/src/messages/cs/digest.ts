/** Weekly digest copy for the Czech interface. */
export const digestMessages = {
  'digest.title': 'Tento týden',
  'digest.subtitle': 'Co vidíme od {windowStart} do {windowEnd}.',
  'digest.empty':
    'Pro tento týden zatím není co shrnout. Něco publikujte a objeví se to zde.',
  'digest.regenerate': 'Znovu sestavit přehled tohoto týdne',
  'digest.generating': 'Sestavuje se přehled tohoto týdne',
  'digest.source.deterministic':
    'Napsáno z vašich publikačních záznamů a vlastních měření, bez asistenta psaní.',
  'digest.source.ai':
    'Napsal asistent z vašich vlastních záznamů. Každé číslo bylo ověřeno.',
  'digest.unavailable.aiOff':
    'Asistent psaní je vypnutý, takže vidíte základní verzi. Nic v ní nechybí.',
  'digest.unavailable.rejected':
    'Verze od asistenta neodpovídala vašim datům, proto byla zahozena. Toto je základní verze.',
  'digest.headline.published':
    '{published, plural, one {# příspěvek dokončen} few {# příspěvky dokončeny} many {# příspěvků dokončeno} other {# příspěvků dokončeno}} mezi {windowStart} a {windowEnd}.',
  'digest.headline.nothingPublished': 'Mezi {windowStart} a {windowEnd} nebylo nic publikováno.',
  'digest.outcome.published':
    '{count, plural, one {# příspěvek dokončen na {provider}} few {# příspěvky dokončeny na {provider}} many {# příspěvků dokončeno na {provider}} other {# příspěvků dokončeno na {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {# příspěvek dorazil jen na některé cíle na {provider}} few {# příspěvky dorazily jen na některé cíle na {provider}} many {# příspěvků dorazilo jen na některé cíle na {provider}} other {# příspěvků dorazilo jen na některé cíle na {provider}}}.',
  'digest.outcome.failed':
    '{count, plural, one {# příspěvek nebyl odeslán na {provider}} few {# příspěvky nebyly odeslány na {provider}} many {# příspěvků nebylo odesláno na {provider}} other {# příspěvků nebylo odesláno na {provider}}}.',
  'digest.metrics.noneYet':
    'Pro tento týden zatím nedorazila žádná měření. To znamená, že nevíme, jak si tyto příspěvky vedly, ne že by si vedly špatně.',
  'digest.freshness.statement':
    '{label, select, fresh {Měření bylo naposledy synchronizováno v {lastObservedAt}.} stale {Měření nebylo synchronizováno od {lastObservedAt}, takže čísla výše mohou být zastaralá.} other {Zatím nebylo nic synchronizováno, takže nic výše není změřeno.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Stojí za to vědět: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Týdenní e-mailový přehled',
  'digest.settings.description':
    'Krátký e-mail každý týden s tím, co bylo odesláno a co se podařilo změřit. Ve výchozím nastavení zapnuto.',
  'digest.settings.enabled': 'Posílat týdenní přehled',
  'email.digest.subject': 'Váš týden v {workspaceName}',
  'email.digest.intro': 'Zde je to, co vidíme pro {workspaceName} mezi {windowStart} a {windowEnd}.',
  'email.digest.noData':
    'Tento týden se nám nepodařilo nic změřit. Pokud nějaké číslo chybí, je to proto, že jsme ho nemohli načíst, ne proto, že by bylo nula.',
  'email.digest.footer':
    'Dostáváte to, protože je pro {workspaceName} zapnutý týdenní přehled. Vypněte ho v nastavení pracovního prostoru.',
} as const;
