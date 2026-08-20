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

  /* ---------------------------------------------------------------------- */
  /* Post specs cluster (/specs)                                            */
  /* ---------------------------------------------------------------------- */

  'web.meta.specs.title': 'Post specs, platform by platform',
  'web.meta.specs.description':
    'The limits each platform in the launch cohort enforces on one post, generated from the connector code, each one carrying the official document it came from and the date a person read it.',
  'web.meta.specsPlatform.title': 'Post specs for {platform}',
  'web.meta.specsPlatform.description':
    'Every limit recorded for {platform}: what it is, the official document the number came from, and the date a person read that document.',

  'web.specs.index.title': 'Post specs, platform by platform',
  'web.specs.index.lede':
    'One page per limit, per platform. Each page states the recorded value, the official document it came from and the date a person read it. Nothing here is typed by hand: the values are generated from the connector code, so a page exists only where the dataset has one.',
  'web.specs.index.listLabel': 'Platforms with recorded limits',
  'web.specs.index.count': '{count, plural, one {# recorded limit} other {# recorded limits}}',
  'web.specs.index.missingTitle': 'Why a platform can be missing here',
  'web.specs.index.missingBody':
    'A platform appears only where this build ships an adapter for it and the generated dataset carries at least one value. A platform with nothing recorded gets no page, because a page built on an invented number would be worse than no page at all.',
  'web.specs.index.methodTitle': 'Where these values come from',
  'web.specs.index.methodBody':
    'The dataset is regenerated from the connector capability code, which is the same code a draft is measured against. Values are read for a freshly connected account with no elevated eligibility.',

  'web.specs.platform.listLabel': 'Recorded limits for this platform',
  'web.specs.platform.limitsTitle': 'What is recorded for {platform}',
  'web.specs.platform.limitsBody':
    'Each row links to a page that states the value on its own, with the document it came from. A limit this platform does not document has no row and no page.',

  'web.specs.detail.valueTitle': 'The recorded value',
  'web.specs.detail.sourceLabel': 'Official platform documentation',
  'web.specs.detail.freshnessTitle': 'How current this is',
  'web.specs.detail.freshnessBody':
    'A platform can raise or lower a limit without announcing it. The value above is read for a freshly connected account with no elevated eligibility, and the date beside the source is the day a person last read that document.',
  'web.specs.detail.checkTitle': 'Check a real post against it',
  'web.specs.detail.checkBody':
    'The preflight checker measures a draft and a media file against every limit recorded for a platform, in the browser, without uploading anything. Opening it from this page preselects this platform.',
  'web.specs.detail.checkLink': 'Open the preflight checker for this platform',
  'web.specs.detail.siblingTitle': 'Everything else recorded for this platform',
  'web.specs.detail.siblingBody':
    'The other values in the same generated dataset, sourced the same way.',
  'web.specs.detail.scheduleLink': 'Read the full platform page',

  'web.specs.notice.title': 'A platform limit, not a working scheduler',
  'web.specs.notice.body':
    'No connector has passed its definition of done. This page states what the platform enforces. It does not say that this product publishes there yet.',

  'web.specs.constraint.characterLimit.name': 'Character limit',
  'web.specs.constraint.characterLimit.title': '{platform} character limit',
  'web.specs.constraint.characterLimit.lede':
    'The longest body text {platform} accepts on one post through its official API, read from the same generated dataset the preflight checker measures a draft against.',
  'web.specs.constraint.characterLimit.description':
    'The body text ceiling {platform} enforces on one post, with the official document the number came from and the date a person read it.',

  'web.specs.constraint.titleLimit.name': 'Title length limit',
  'web.specs.constraint.titleLimit.title': '{platform} title length limit',
  'web.specs.constraint.titleLimit.lede':
    'The longest title {platform} accepts in the separate title field its API exposes, read from the same generated dataset the preflight checker measures a draft against.',
  'web.specs.constraint.titleLimit.description':
    'The title field ceiling {platform} enforces, with the official document the number came from and the date a person read it.',

  'web.specs.constraint.imageSize.name': 'Image size limit',
  'web.specs.constraint.imageSize.title': '{platform} image size limit',
  'web.specs.constraint.imageSize.lede':
    'The largest still image file {platform} accepts through its official API, read from the same generated dataset the preflight checker measures a file against.',
  'web.specs.constraint.imageSize.description':
    'The largest image file {platform} accepts, with the official document the number came from and the date a person read it.',

  'web.specs.constraint.videoSize.name': 'Video size limit',
  'web.specs.constraint.videoSize.title': '{platform} video size limit',
  'web.specs.constraint.videoSize.lede':
    'The largest video file {platform} accepts through its official API, read from the same generated dataset the preflight checker measures a file against.',
  'web.specs.constraint.videoSize.description':
    'The largest video file {platform} accepts, with the official document the number came from and the date a person read it.',

  'web.specs.constraint.videoLength.name': 'Video length limit',
  'web.specs.constraint.videoLength.title': '{platform} video length limit',
  'web.specs.constraint.videoLength.lede':
    'How long a video posted to {platform} through its official API is allowed to run, read from the same generated dataset the preflight checker measures a file against.',
  'web.specs.constraint.videoLength.description':
    'How long a video posted to {platform} may run, with the official document the number came from and the date a person read it.',

  'web.specs.constraint.imageCount.name': 'Images per post',
  'web.specs.constraint.imageCount.title': '{platform} images per post',
  'web.specs.constraint.imageCount.lede':
    'How many images {platform} accepts on a single post through its official API, read from the same generated dataset the preflight checker measures a draft against.',
  'web.specs.constraint.imageCount.description':
    'How many images fit on one {platform} post, with the official document the number came from and the date a person read it.',

  'web.specs.constraint.altTextLimit.name': 'Alternative text limit',
  'web.specs.constraint.altTextLimit.title': '{platform} alt text limit',
  'web.specs.constraint.altTextLimit.lede':
    'The longest alternative text {platform} accepts on an attached image through its official API, read from the same generated dataset the preflight checker measures a draft against.',
  'web.specs.constraint.altTextLimit.description':
    'The alternative text ceiling {platform} enforces on an attached image, with the official document the number came from and the date a person read it.',

  'web.specs.constraint.fileTypes.name': 'Accepted file types',
  'web.specs.constraint.fileTypes.title': '{platform} accepted file types',
  'web.specs.constraint.fileTypes.lede':
    'The media types {platform} accepts through its official API, read from the same generated dataset the preflight checker measures a file against.',
  'web.specs.constraint.fileTypes.description':
    'Which media types {platform} accepts, with the official document the list came from and the date a person read it.',
} as const;
