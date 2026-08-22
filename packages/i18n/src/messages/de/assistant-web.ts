/**
 * Der Assistenten-Bildschirm in der Web-App.
 *
 * Wer diesen Bildschirm liest, ist jemand, der veröffentlicht, und nicht
 * jemand, der Software bedient. Jeder Satz hier ist für diese Person
 * geschrieben: Er sagt, was der Assistent anbietet, er sagt deutlich, dass ein
 * Vorschlag ein Vorschlag ist, und bevor etwas geschrieben wird, sagt er genau,
 * was passieren wird, für welche Konten, mit welchem Text, zu welcher Zeit, in
 * der Zeitzone des Arbeitsbereichs selbst.
 *
 * Nichts in diesem Namensraum verspricht eine Aktion, die noch nicht
 * stattgefunden hat, und nichts legt nahe, dass der Assistent von sich aus
 * handeln kann.
 */
export const assistantWebMessages = {
  'assistantWeb.title': 'Assistent',
  'assistantWeb.subtitle':
    'Sagen Sie, was Sie möchten. Er schlägt vor, Sie entscheiden, von allein passiert nichts.',

  'assistantWeb.empty.title': 'Sagen Sie ihm mit eigenen Worten, was Sie möchten.',
  'assistantWeb.empty.body':
    'Er kann eine Woche mit Beiträgen planen, andere Einstiege für einen Beitrag vorschlagen, Ihnen sagen, was hinausgeht, und einen Beitrag für Ihre Genehmigung vorbereiten. Er veröffentlicht nie etwas von allein.',
  'assistantWeb.empty.promptsLabel': 'Was Leute fragen',
  'assistantWeb.empty.promptPlan': 'Planen Sie meine Woche mit Beiträgen.',
  'assistantWeb.empty.promptWeek': 'Was geht diese Woche hinaus?',
  'assistantWeb.empty.promptFailures': 'Ist etwas beim Veröffentlichen fehlgeschlagen?',
  'assistantWeb.empty.promptCaption': 'Schlagen Sie einen anderen Einstieg für diesen Beitrag vor.',
  'assistantWeb.empty.reassurance':
    'Sie können es sich jederzeit anders überlegen. Es wird nichts geschrieben, bis Sie es genehmigen.',

  'assistantWeb.input.label': 'Was möchten Sie tun?',
  'assistantWeb.input.placeholder':
    'Fragen Sie nach einem Plan, einem Einstieg oder danach, was diese Woche hinausgeht.',
  'assistantWeb.input.send': 'Senden',
  'assistantWeb.input.hint': 'Einfache Worte funktionieren am besten. Es gibt nichts zu lernen.',

  'assistantWeb.turn.you': 'Sie',
  'assistantWeb.turn.assistant': 'Assistent',
  'assistantWeb.turn.working': 'Liest Ihren Arbeitsbereich und schreibt eine Antwort.',
  'assistantWeb.turn.workingNote': 'Währenddessen hat sich nichts geändert.',
  'assistantWeb.turn.suggestionBadge': 'Vorschlag',
  'assistantWeb.turn.suggestionNote':
    'Dies ist ein Vorschlag, kein Protokoll dessen, was passiert ist.',
  'assistantWeb.turn.provenance': 'Vorgeschlagen von {provider} {model}.',
  'assistantWeb.turn.degraded':
    'Diesmal aus Ihren eigenen Einstellungen geschrieben, ohne das Schreibmodell.',

  'assistantWeb.subject.label': 'Der Beitrag, um den es geht',
  'assistantWeb.subject.none': 'Noch kein Beitrag ausgewählt.',
  'assistantWeb.subject.choose': 'Einen Beitrag auswählen',
  'assistantWeb.subject.needed':
    'Wählen Sie aus, welchen Beitrag Sie meinen, und fragen Sie erneut.',
  'assistantWeb.subject.untitled': 'Beitrag ohne Titel',
  'assistantWeb.subject.composerOnly':
    'Das geschieht im Composer, wo Sie den Beitrag so sehen, wie ihn jedes Konto anzeigen wird.',
  'assistantWeb.subject.openComposer': 'Im Composer öffnen',

  'assistantWeb.confirm.title': 'Bevor etwas passiert',
  'assistantWeb.confirm.body':
    'Es wurde noch nichts geschrieben. Lesen Sie dies und genehmigen Sie es nur, wenn es das ist, was Sie möchten.',
  'assistantWeb.confirm.accountsLabel': 'Konten, die dies erreicht',
  'assistantWeb.confirm.accountsUnavailable': 'Welche Konten dies erreicht, ist nicht verfügbar.',
  'assistantWeb.confirm.accountCount': '{count, plural, one {# Konto} other {# Konten}}',
  'assistantWeb.confirm.textLabel': 'Der Text',
  'assistantWeb.confirm.textUnavailable': 'Diese Aktion ändert keinen Text.',
  'assistantWeb.confirm.timeLabel': 'Die Zeit',
  'assistantWeb.confirm.timeValue': '{dateTime} ({timeZone})',
  'assistantWeb.confirm.timeUnavailable': 'Diese Aktion legt keine Zeit fest.',
  'assistantWeb.confirm.zoneNote': 'Zeiten werden in der Zeitzone Ihres Arbeitsbereichs angezeigt.',
  'assistantWeb.confirm.noteLabel': 'Hinweis an die Person, die es genehmigt',
  'assistantWeb.confirm.expires': 'Diese Genehmigung läuft am {dateTime} ab.',
  'assistantWeb.confirm.approve': 'Genehmigen und ausführen',
  'assistantWeb.confirm.cancel': 'Jetzt nicht',
  'assistantWeb.confirm.cancelled': 'Abgebrochen. Es wurde nichts geschrieben.',
  'assistantWeb.confirm.applied': 'Fertig. Sie haben es genehmigt, also wurde es ausgeführt.',
  'assistantWeb.confirm.openConfirmation': 'Den vollständigen Genehmigungsbildschirm öffnen',
  'assistantWeb.confirm.proposalTitle': 'Nur ein Vorschlag',
  'assistantWeb.confirm.working': 'Wird genehmigt. Schließen Sie diesen Bildschirm nicht.',

  'assistantWeb.overBudget.title':
    'Dieser Arbeitsbereich hat sein KI-Kontingent für den Monat aufgebraucht.',
  'assistantWeb.overBudget.body':
    'Der Assistent kann nichts weiter schreiben, bis das Kontingent neu beginnt. Nichts von dem, was Sie bereits erstellt haben, ist betroffen, und Sie können Beiträge weiterhin selbst schreiben, planen und veröffentlichen.',
  'assistantWeb.overBudget.reset': 'Das Kontingent beginnt am {dateTime} neu.',
  'assistantWeb.overBudget.resetUnknown': 'Wir haben kein Datum dafür, wann es neu beginnt.',
  'assistantWeb.overBudget.compose': 'Selbst einen Beitrag schreiben',

  'assistantWeb.result.planTitle': 'Eine vorgeschlagene Woche. Es ist nichts geplant.',
  'assistantWeb.result.planSlot': 'Tag {day} um {time}',
  'assistantWeb.result.planEmpty': 'Es wurden keine Beiträge vorgeschlagen.',
  'assistantWeb.result.weekTitle': 'Was geplant ist',
  'assistantWeb.result.weekEmpty': 'Für diesen Zeitraum ist nichts geplant.',
  'assistantWeb.result.weekMore': 'Es gibt mehr als das. Der Kalender zeigt alles.',
  'assistantWeb.result.openCalendar': 'Den Kalender öffnen',
  'assistantWeb.result.failuresTitle':
    'Was fehlgeschlagen ist, und der damals aufgezeichnete Grund',
  'assistantWeb.result.failuresEmpty': 'Nichts ist fehlgeschlagen.',
  'assistantWeb.result.captionsTitle': 'Andere Einstiege für diesen Beitrag',
  'assistantWeb.result.captionsEmpty': 'Es wurden keine weiteren Einstiege vorgeschlagen.',
  'assistantWeb.result.copy': 'Diesen Text kopieren',
  'assistantWeb.result.copied': 'Kopiert.',

  'assistantWeb.error.title': 'Das wurde nicht ausgeführt.',
  'assistantWeb.error.body': 'Es wurde nichts geändert. Sie können erneut fragen.',
  'assistantWeb.error.retry': 'Erneut fragen',
} as const;
