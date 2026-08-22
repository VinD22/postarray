/**
 * Reading a proposal without trusting it.
 *
 * `AssistantActionOutput.proposal` is exactly what the API will write once a
 * person approves it, and it is typed as an open record because each tool
 * proposes a different thing. The screen has to show a person the parts that
 * matter to them (the text, the time, the zone, the note) so nothing here
 * guesses: a field that is not present is absent, never an empty string and
 * never a zero.
 */

export interface ReadableProposal {
  readonly title: string | null;
  readonly body: string | null;
  readonly note: string | null;
  readonly instant: string | null;
  readonly ianaTimeZone: string | null;
  readonly localDateTime: string | null;
  readonly contentItemId: string | null;
}

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

export function readProposal(proposal: Readonly<Record<string, unknown>>): ReadableProposal {
  return {
    title: text(proposal.title),
    body: text(proposal.body),
    note: text(proposal.note),
    instant: text(proposal.instant),
    ianaTimeZone: text(proposal.ianaTimeZone),
    localDateTime: text(proposal.localDateTime),
    contentItemId: text(proposal.contentItemId),
  };
}
