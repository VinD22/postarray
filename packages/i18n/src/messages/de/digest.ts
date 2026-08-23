/** Weekly digest copy for the German interface. */
export const digestMessages = {
  'digest.title': 'Diese Woche',
  'digest.subtitle': 'Was wir vom {windowStart} bis {windowEnd} sehen können.',
  'digest.empty':
    'Für diese Woche gibt es noch nichts zusammenzufassen. Veröffentliche etwas, dann wird es hier angezeigt.',
  'digest.regenerate': 'Zusammenfassung dieser Woche neu erstellen',
  'digest.generating': 'Zusammenfassung dieser Woche wird erstellt',
  'digest.source.deterministic':
    'Erstellt aus deinen Veröffentlichungsdaten und deinen eigenen Messwerten, ohne den Schreibassistenten.',
  'digest.source.ai':
    'Vom Assistenten aus deinen eigenen Daten erstellt. Jede Zahl wurde damit abgeglichen.',
  'digest.unavailable.aiOff':
    'Der Schreibassistent ist deaktiviert. Daher siehst du die einfache Version. Es fehlt nichts.',
  'digest.unavailable.rejected':
    'Die Assistentenversion passte nicht zu deinen Daten und wurde verworfen. Dies ist die einfache Version.',
  'digest.headline.published':
    '{published, plural, =0 {Keine Beiträge abgeschlossen} one {# Beitrag abgeschlossen} other {# Beiträge abgeschlossen}} zwischen {windowStart} und {windowEnd}.',
  'digest.headline.nothingPublished':
    'Zwischen {windowStart} und {windowEnd} wurde nichts veröffentlicht.',
  'digest.outcome.published':
    '{count, plural, one {# Beitrag auf {provider} abgeschlossen} other {# Beiträge auf {provider} abgeschlossen}}.',
  'digest.outcome.partial':
    '{count, plural, one {# Beitrag hat einige seiner Ziele auf {provider} erreicht, andere jedoch nicht} other {# Beiträge haben einige ihrer Ziele auf {provider} erreicht, andere jedoch nicht}}.',
  'digest.outcome.failed':
    '{count, plural, one {# Beitrag wurde auf {provider} nicht veröffentlicht} other {# Beiträge wurden auf {provider} nicht veröffentlicht}}.',
  'digest.metrics.noneYet':
    'Für diese Woche sind noch keine Messwerte eingetroffen. Das bedeutet, dass wir nicht wissen, wie diese Beiträge abgeschnitten haben, nicht dass sie schlecht abgeschnitten haben.',
  'digest.freshness.statement':
    '{label, select, fresh {Die Messwerte wurden zuletzt um {lastObservedAt} synchronisiert.} stale {Die Messwerte wurden seit {lastObservedAt} nicht synchronisiert. Die Zahlen oben können daher veraltet sein.} other {Es wurde noch nichts synchronisiert, daher ist nichts oben gemessen.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Gut zu wissen: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Wöchentliche Zusammenfassung per E-Mail',
  'digest.settings.description':
    'Jede Woche eine kurze E-Mail mit dem, was veröffentlicht wurde und was wir messen konnten. Standardmäßig aktiviert.',
  'digest.settings.enabled': 'Wöchentliche Zusammenfassung senden',
  'email.digest.subject': 'Deine Woche in {workspaceName}',
  'email.digest.intro':
    'Hier ist, was wir für {workspaceName} zwischen {windowStart} und {windowEnd} sehen können.',
  'email.digest.noData':
    'Wir konnten diese Woche nichts messen. Wenn eine Zahl fehlt, dann weil wir sie nicht lesen konnten, nicht weil sie null war.',
  'email.digest.footer':
    'Du erhältst diese Nachricht, weil die wöchentliche Zusammenfassung für {workspaceName} aktiviert ist. Du kannst sie in den Workspace-Einstellungen deaktivieren.',
} as const;

