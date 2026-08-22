/**
 * Der Assistent.
 *
 * Jeder Satz hier sagt in der Vergangenheitsform, was der Assistent getan hat,
 * und sagt deutlich, wenn er nichts getan hat. Nichts in diesem Katalog stellt
 * einen Vorschlag als Tatsache dar, und nichts verspricht eine Aktion, die noch
 * nicht stattgefunden hat.
 */
export const assistantMessages = {
  'assistant.tool.plan_week': 'Eine Woche mit Beiträgen für dieses Projekt entwerfen.',
  'assistant.tool.suggest_caption': 'Andere Einstiege für diesen Beitrag vorschlagen.',
  'assistant.tool.check_platform_fit': 'Diesen Beitrag daran prüfen, was das Konto zulässt.',
  'assistant.tool.report_week': 'Zeigen, was diese Woche hinausgeht.',
  'assistant.tool.report_failures': 'Zeigen, was fehlgeschlagen ist und warum.',
  'assistant.tool.draft_post': 'Einen Entwurf erstellen.',
  'assistant.tool.adapt_draft_text': 'Diesen Beitrag für ein Konto neu schreiben.',
  'assistant.tool.schedule_post': 'Diesen Beitrag in den nächsten Platz der Warteschlange legen.',
  'assistant.tool.request_approval': 'Diesen Beitrag zur Genehmigung senden.',

  'assistant.turn.plan_week': 'Hier ist eine vorgeschlagene Woche. Es ist noch nichts geplant.',
  'assistant.turn.suggest_caption':
    'Hier sind einige vorgeschlagene Einstiege. Ihr Entwurf ist unverändert.',
  'assistant.turn.check_platform_fit': 'So passt dieser Beitrag im Moment zu diesem Konto.',
  'assistant.turn.report_week': 'Das ist für diesen Zeitraum geplant.',
  'assistant.turn.report_failures': 'Das ist fehlgeschlagen, mit dem damals aufgezeichneten Grund.',
  'assistant.turn.draft_post': 'Dies erstellt einen Entwurf, sobald Sie es bestätigen.',
  'assistant.turn.adapt_draft_text':
    'Dies schreibt die Version für dieses Konto neu, sobald Sie es bestätigen.',
  'assistant.turn.schedule_post': 'Dies plant den Beitrag, sobald Sie es bestätigen.',
  'assistant.turn.request_approval':
    'Dies sendet den Beitrag zur Genehmigung, sobald Sie es bestätigen.',

  'assistant.state.awaiting_confirmation':
    'Wartet auf Ihre Bestätigung. Es hat sich noch nichts geändert.',
  'assistant.state.applied': 'Fertig. Sie haben es bestätigt, also wurde es ausgeführt.',

  'assistant.blocked.no_confirmable_subject':
    'Dies ist nur ein Vorschlag. Erstellen Sie den Entwurf im Composer, dann kann der Assistent darauf aufbauen.',
  'assistant.blocked.confirmation_unavailable':
    'Dies ist nur ein Vorschlag. Dieser Sitzung kann keine Bestätigung zum Handeln gegeben werden.',

  'assistant.error.profile_required':
    'Füllen Sie zuerst das Unternehmensprofil aus, damit ein Plan auf Ihren eigenen Worten beruht.',

  'assistant.label.suggestion': 'Vorschlag',
} as const;
