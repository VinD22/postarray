/**
 * The per platform scheduler pages.
 *
 * Rules that bind this file specifically:
 *
 *  - Not one string here names a platform, states a character ceiling, a file
 *    size or a capability. Every one of those comes from the generated
 *    datasets the page reads, so a page physically cannot claim support the
 *    connectors do not have. The strings below are labels and framing only.
 *  - The framing is always "what the platform requires" and "what this product
 *    intends to support". Never "what you can publish". No connector has
 *    passed its definition of done, so nothing publishes.
 *  - Anything a platform does not document is `common.unavailable`, never a
 *    zero and never a guess.
 */
export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'Scheduling, platform by platform',
  'web.meta.schedule.description':
    'What each platform in the launch cohort requires from a connected account, the limits its official API enforces, and how far this product has got against them.',
  'web.meta.schedulePlatform.title': 'Scheduling for {platform}',
  'web.meta.schedulePlatform.description':
    'What {platform} requires from a connected account, the limits its official API enforces, and which parts of that this product has built.',

  /* ---------------------------------------------------------------------- */
  /* Index                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Scheduling, platform by platform',
  'web.schedule.index.lede':
    'One page per platform in the launch cohort. Each one states what the platform asks of a connected account, the limits its official API enforces, and where the build stands. Every number carries the document it came from and the date a person read it.',
  'web.schedule.index.listLabel': 'Platforms in the launch cohort',
  'web.schedule.index.cohortNote':
    'The cohort is the set of platforms this product is being built for. It is a plan, not an availability list.',
  'web.schedule.index.limitsKnown': 'Limits recorded',
  'web.schedule.index.limitsUnknown': 'Limits not recorded yet',

  /* ---------------------------------------------------------------------- */
  /* Platform page                                                          */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Scheduling for {platform}',
  'web.schedule.platform.lede':
    'What {platform} asks of a connected account, the limits its official API enforces, and which of them this product has built against so far.',

  'web.schedule.notice.title': 'Nothing publishes to {platform} yet',
  'web.schedule.notice.body':
    'No connector has passed its definition of done, and none is verified in production. This page describes what the platform requires and what this product intends to support. It does not describe a working scheduler.',

  'web.schedule.requirements.title': 'What {platform} requires',
  'web.schedule.requirements.accountTypes': 'Account type',
  'web.schedule.requirements.restriction': 'Platform restriction',
  'web.schedule.requirements.cost': 'API cost',
  'web.schedule.requirements.unavailable.title': 'No reviewed connector record yet',
  'web.schedule.requirements.unavailable.body':
    'This platform joined the cohort after the last connector research pass, so there is no dated record of its account requirements to show. It will appear here once a person has read the official documentation and recorded it.',
  'web.schedule.requirements.apiSource': 'Official API documentation',
  'web.schedule.requirements.policySource': 'Platform policy',

  /* ---------------------------------------------------------------------- */
  /* Limits                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Limits {platform} enforces',
  'web.schedule.limits.lede':
    'Read for a freshly connected account with no elevated eligibility. A platform can raise or lower any of these without telling anyone, which is why each set carries the date it was read.',
  'web.schedule.limits.unavailable.title': 'Limits not recorded for {platform}',
  'web.schedule.limits.unavailable.body':
    'This build ships no adapter for this platform, so there is no recorded ceiling to show. An invented number would be worse than none.',
  'web.schedule.limits.sourceLabel': 'Official platform documentation',

  'web.schedule.limits.text': 'Body text',
  'web.schedule.limits.title_field': 'Title field',
  'web.schedule.limits.countingUnit': 'How characters are counted',
  'web.schedule.limits.links': 'How links are counted',
  'web.schedule.limits.images': 'Images per post',
  'web.schedule.limits.videos': 'Videos per post',
  'web.schedule.limits.videoDuration': 'Video length',
  'web.schedule.limits.imageBytes': 'Largest image',
  'web.schedule.limits.gifBytes': 'Largest animated image',
  'web.schedule.limits.videoBytes': 'Largest video',
  'web.schedule.limits.documentBytes': 'Largest document',
  'web.schedule.limits.altText': 'Alternative text',
  'web.schedule.limits.mimeTypes': 'Accepted file types',
  'web.schedule.limits.markdown': 'Formatting marks',

  'web.schedule.value.characters': '{count, plural, one {# character} other {# characters}}',
  'web.schedule.value.files': '{count, plural, =0 {None} one {# file} other {# files}}',
  'web.schedule.value.durationRange': 'Between {min} and {max}',
  'web.schedule.value.durationMax': 'Up to {max}',
  'web.schedule.value.markdownYes': 'Accepted',
  'web.schedule.value.markdownNo': 'Published as plain characters',

  'web.schedule.unit.utf16':
    'By UTF-16 code unit, which is what most editors report as a character count.',
  'web.schedule.unit.grapheme':
    'By grapheme, so an emoji made of several code points still costs one character.',
  'web.schedule.unit.weighted':
    'By a weighted scheme where most non-Latin characters cost two instead of one.',

  'web.schedule.link.none': 'Links are not counted against the ceiling.',
  'web.schedule.link.actual': 'A link costs exactly the characters it occupies.',
  'web.schedule.link.fixed':
    'Every link is rewritten to the platform shortener and costs {count, plural, one {# character} other {# characters}} regardless of its real length.',

  /* ---------------------------------------------------------------------- */
  /* Capability state                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'What is built for {platform}',
  'web.schedule.capabilities.lede':
    'Generated from the connector registry, not written here. "Not offered by the platform" is a fact about the platform and is final. "Not built yet" is a fact about this product and is the honest default while no connector has passed its definition of done.',
  'web.schedule.capabilities.unavailable.title': 'No capability record for {platform} yet',
  'web.schedule.capabilities.unavailable.body':
    'There is no adapter in this build, so the registry has nothing to report. The row will appear on the capability matrix as soon as there is something real to say.',
  'web.schedule.capabilities.matrixLink': 'Read the full capability matrix',

  'web.schedule.next.title': 'Where to go next',
  'web.schedule.next.body':
    'The capability matrix carries every platform and every capability in one table. The use case pages describe the workflows this product is being built around.',
} as const;
