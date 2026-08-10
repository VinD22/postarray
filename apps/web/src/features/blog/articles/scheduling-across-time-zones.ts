import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import type { BlogArticle } from '../types';

/**
 * Content module. English only, loaded per slug. See `../types.ts` for why
 * article prose is not in the ICU catalog.
 */
export const schedulingAcrossTimeZones: BlogArticle = {
  slug: 'scheduling-across-time-zones',
  title: 'Scheduling across time zones without daylight saving surprises',
  description:
    'Why a scheduled post drifts by an hour twice a year, which local times do not exist at all, and what a schedule has to store to survive a rule change.',
  cluster: 'scheduling',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-10',
  updated: '2026-08-10',
  sources: [
    {
      title: 'IANA Time Zone Database',
      url: 'https://www.iana.org/time-zones',
      readOn: '2026-08-10',
    },
    {
      title: 'ECMA-402 Internationalization API specification',
      url: 'https://tc39.es/ecma402/',
      readOn: '2026-08-10',
    },
  ],
  blocks: [
    {
      kind: 'paragraph',
      text: 'Twice a year a set of scheduled posts goes out an hour early or an hour late, and someone concludes the scheduler is unreliable. It usually is not. The schedule was stored as an instant with the offset baked in, and the offset stopped being true.',
    },
    {
      kind: 'paragraph',
      text: 'This is a data modelling problem with a small number of rules. Get the rules right once and the twice yearly surprise stops happening.',
    },

    { kind: 'heading', id: 'offsets', text: 'An offset is not a time zone' },
    {
      kind: 'paragraph',
      text: 'A time zone is a set of rules about how local time relates to UTC over history, published under a name such as Europe/Berlin or America/Sao_Paulo. An offset is what those rules produce on one particular date. The offset changes. The zone does not.',
    },
    {
      kind: 'paragraph',
      text: 'The rules themselves are political. Governments start and stop observing daylight saving, move the dates it starts on, and occasionally change their standard offset outright. The reference dataset that tracks all of this is the IANA time zone database, which ships revisions whenever a jurisdiction changes its mind.',
    },
    {
      kind: 'callout',
      title: 'Never store an abbreviation',
      body: 'CST is Central Standard Time in North America, China Standard Time, and Cuba Standard Time. Abbreviations are not identifiers. Store the IANA zone name.',
    },

    { kind: 'heading', id: 'store', text: 'Store the instant and the zone, always both' },
    {
      kind: 'paragraph',
      text: 'A schedule needs to answer two different questions that cannot be answered from the same field. When does this fire, which is an instant. And what did the person mean, which is a local wall clock time in a named zone.',
    },
    {
      kind: 'code',
      caption: 'The three values a scheduled post should carry',
      lines: [
        'publish_at_instant  2026-10-25T07:30:00Z',
        'publish_at_zone     Europe/Berlin',
        'publish_at_local    2026-10-25 09:30',
      ],
    },
    {
      kind: 'paragraph',
      text: 'The instant is what the worker acts on, so execution never depends on a locale or a server setting. The zone name is what lets you recompute the instant if the rules change before the post fires, and what lets you show the person the time they actually chose. The local time is derived, and keeping it stored is a convenience for display and an audit record of intent.',
    },
    {
      kind: 'list',
      items: [
        'Never compute a schedule in the browser time zone. The person who set it and the person reviewing it are often not in the same place, and neither of them may be in the account time zone.',
        'Never store a naive local time on its own. It is unresolvable the moment the rules move.',
        'Never store a fixed numeric offset as a substitute for a zone. Plus two hours is true for part of the year in Berlin and false for the rest of it.',
      ],
    },

    { kind: 'heading', id: 'gaps', text: 'Two local times a year are not real' },
    {
      kind: 'paragraph',
      text: 'When a zone springs forward, a range of local times does not occur. In a zone that jumps from 02:00 to 03:00, a post scheduled for 02:30 has asked for a moment that never exists. When the same zone falls back, a range of local times occurs twice, and 02:30 is ambiguous rather than absent.',
    },
    {
      kind: 'paragraph',
      text: 'Any scheduler must have a stated policy for both cases, because the default in most date libraries is silent and surprising.',
    },
    {
      kind: 'table',
      caption: 'A policy for the two irregular cases',
      columns: ['Case', 'What the reader should be told', 'A defensible default'],
      rows: [
        [
          'The chosen local time does not exist',
          'This time is skipped in this zone on this date',
          'Move forward to the first valid local time and show the new time before saving',
        ],
        [
          'The chosen local time happens twice',
          'This time occurs twice in this zone on this date',
          'Take the first occurrence and state which one was taken',
        ],
        [
          'A recurring rule crosses the change',
          'The wall clock time is kept, so the gap this week is 23 or 25 hours',
          'Keep the local time and let the interval flex',
        ],
      ],
    },
    {
      kind: 'callout',
      title: 'Recurring rules keep the clock, not the interval',
      body: 'A daily 09:00 slot means 09:00 every day. Across a transition, one gap between consecutive posts will be 23 hours and another 25. That is correct behaviour, and it should be visible in the calendar rather than discovered afterwards.',
    },

    { kind: 'heading', id: 'teams', text: 'Whose zone wins' },
    {
      kind: 'paragraph',
      text: 'Once more than one person touches a calendar, the question of which zone the interface speaks in becomes a policy, not a preference. Three candidates exist and only one of them can be the authority.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'The account or project zone. The best default: it is the zone the audience lives in, it does not travel, and it makes two people looking at the same calendar see the same thing.',
        'The reader zone. Useful as a secondary label so a person in another country understands what a time means for them, but a poor authority, because it changes when someone gets on a plane.',
        'UTC. Correct and unambiguous, and the right thing to log, but almost nobody plans a publishing week in it.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Show the project zone as the primary time, the reader zone as a quiet secondary, and UTC in anything that will be read by an engineer during an incident. Label every one of them with the zone name so no reading is ambiguous.',
    },

    { kind: 'heading', id: 'formatting', text: 'Format with the platform, not by hand' },
    {
      kind: 'paragraph',
      text: 'Hand rolled formatting is where the last class of bugs lives: a hard coded twelve hour clock in a locale that uses twenty four, a weekday starting on Sunday for a reader whose week starts on Monday, or a month name that is not translated. The internationalization API specified in ECMA-402 already knows all of this, and it takes a zone name as a formatting option.',
    },
    {
      kind: 'paragraph',
      text: 'Use it for every displayed date, pass the zone explicitly rather than relying on the ambient default, and let the locale decide the hour cycle and the first day of the week.',
    },

    { kind: 'heading', id: 'checklist', text: 'The short checklist' },
    {
      kind: 'list',
      items: [
        'Every scheduled row stores an instant and an IANA zone name.',
        'The interface states the zone next to every time it shows.',
        'Non existent and doubled local times have a written policy and a visible message.',
        'Recurring rules keep the wall clock time across a transition.',
        'Formatting goes through the platform internationalization API with an explicit zone.',
        'Two dates a year, the ones your main zones transition on, are in the test suite as fixtures rather than as a memory.',
      ],
    },
  ],
};
