/**
 * The free tools on the public site.
 *
 * These pages exist because this repository already knows every launch cohort
 * platform's real publishing limits from its connector capability code. A tool
 * here may therefore state a number, but only a number the generated dataset
 * carries, always beside the official source and the date a person read it.
 *
 * Rules that bind this file specifically:
 *
 *  - A tool never claims the product publishes anywhere. Nothing in the launch
 *    cohort is verified for production yet, and these pages say so.
 *  - Every calculation described here runs in the reader's browser. Copy that
 *    promises privacy must stay true of the component that renders it.
 *  - No tool writes, rewrites, suggests or scores content. No tool looks up a
 *    handle, a follower count or anything else that would need an unofficial
 *    endpoint.
 *  - A limit we do not have is "unavailable". Never zero, never a guess.
 */
export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': 'Free publishing tools',
  'web.meta.tools.description':
    'Small, private tools for people who post to several platforms: a per platform limit check, a UTM builder, a YouTube title length check and a time zone planner.',
  'web.meta.tools.preflight.title': 'Post preflight checker',
  'web.meta.tools.preflight.description':
    'Check one draft against the published text and media limits of ten platforms, with the source and the date each limit was read.',
  'web.meta.tools.utm.title': 'UTM link builder',
  'web.meta.tools.utm.description':
    'Compose a tagged campaign URL and see what each UTM parameter means. Runs entirely in your browser.',
  'web.meta.tools.youtubeTitle.title': 'YouTube title length checker',
  'web.meta.tools.youtubeTitle.description':
    'Measure a YouTube title against the documented ceiling, counted the way a person counts characters.',
  'web.meta.tools.timeZone.title': 'Time zone and daylight saving planner',
  'web.meta.tools.timeZone.description':
    'See one posting time across several audience zones and find the weeks where a daylight saving shift moves the local hour.',

  /* ---------------------------------------------------------------------- */
  /* Shared tool furniture                                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'Free tools',
  'web.tools.index.summary':
    'Small calculators built on the same platform limit data our connectors read.',
  'web.tools.index.lede':
    'Four small tools, built on the same platform limit data our connectors use. No account, no upload, no tracking of what you type.',
  'web.tools.index.dataTitle': 'Where the numbers come from',
  'web.tools.index.dataBody':
    'Each limit is generated from the connector capability code in this repository, and every platform row carries the official documentation page it came from and the date a person read that page.',
  'web.tools.index.honesty':
    'These tools do not publish anything. No connector has completed provider verification yet, so nothing here connects an account.',
  'web.tools.shared.privacyTitle': 'This runs in your browser',
  'web.tools.shared.privacyBody':
    'Everything you type stays on this page. There is no request to a server, no storage and no analytics event carrying your text.',
  'web.tools.shared.sourceLink': 'Platform documentation',
  'web.tools.shared.sourceRead': 'Read on {date}',
  'web.tools.shared.unavailable': 'unavailable',
  'web.tools.shared.unavailableWhy':
    'We do not ship a connector for this platform yet, so we have no verified limit to show. We would rather say nothing than guess.',
  'web.tools.shared.copy': 'Copy',
  'web.tools.shared.copied': 'Copied',
  'web.tools.shared.copyFailed': 'Your browser blocked the copy. Select the text and copy it.',
  'web.tools.shared.faqTitle': 'Questions',
  'web.tools.shared.baselineTitle': 'Which account these numbers describe',
  'web.tools.shared.baselineBody':
    'The conservative case: a newly connected account with no raised eligibility. Some platforms lift a ceiling once a channel or a business is verified, and where that happens the page says so.',
  'web.tools.shared.otherTools': 'Other tools',

  /* ---------------------------------------------------------------------- */
  /* Tool names and one line summaries, shared by the index and the footer   */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'Post preflight checker',
  'web.tools.preflight.summary':
    'One draft, checked against the text and media limits of ten platforms at once.',
  'web.tools.utm.name': 'UTM link builder',
  'web.tools.utm.summary': 'Build a tagged campaign URL without mangling the query string it had.',
  'web.tools.youtubeTitle.name': 'YouTube title length checker',
  'web.tools.youtubeTitle.summary': 'Measure a title the way a person counts characters.',
  'web.tools.timeZone.name': 'Time zone and daylight saving planner',
  'web.tools.timeZone.summary':
    'One posting time across several audience zones, with the daylight saving shifts marked.',

  /* ---------------------------------------------------------------------- */
  /* Post preflight checker                                                  */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'Post preflight checker',
  'web.tools.preflight.lede':
    'Paste a draft, pick the platforms you post to, and see which ones would reject it before you find out from an API error.',
  'web.tools.preflight.explainer.title': 'Why a character counter is not enough',
  'web.tools.preflight.explainer.body':
    'Platforms disagree about what a character is. Some count code units, so one emoji costs two. Some count graphemes, so a flag or a family emoji costs one. Some rewrite every link to a fixed width, so a 200 character URL costs the same as a 20 character one. This tool applies each platform rule separately.',
  'web.tools.preflight.explainer.counting':
    'The draft is measured with the browser Intl segmenter, which splits text into the units a reader would call characters, then adjusted for the platform rule.',
  'web.tools.preflight.field.draft.label': 'Your draft',
  'web.tools.preflight.field.draft.help':
    'Paste the post body. Links are detected automatically so their cost can be applied per platform.',
  'web.tools.preflight.field.platforms.label': 'Platforms to check',
  'web.tools.preflight.field.platforms.help': 'Pick as many as you post to.',
  'web.tools.preflight.field.mediaKind.label': 'Attached media',
  'web.tools.preflight.field.mediaKind.none': 'No media',
  'web.tools.preflight.field.mediaKind.image': 'Images',
  'web.tools.preflight.field.mediaKind.video': 'One video',
  'web.tools.preflight.field.mediaCount.label': 'How many images',
  'web.tools.preflight.field.byteSize.label': 'File size in megabytes',
  'web.tools.preflight.field.byteSize.help': 'The largest single file. Leave empty to skip.',
  'web.tools.preflight.field.duration.label': 'Video length in seconds',
  'web.tools.preflight.field.duration.help': 'Leave empty to skip the duration check.',
  'web.tools.preflight.field.width.label': 'Media width in pixels',
  'web.tools.preflight.field.height.label': 'Media height in pixels',
  'web.tools.preflight.field.dimensions.help':
    'Optional. Used only to show the aspect ratio you would be publishing.',
  'web.tools.preflight.results.title': 'Result by platform',
  'web.tools.preflight.results.empty': 'Pick at least one platform to see a result.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Nothing blocking} other {# would fail}}, {warning, plural, =0 {no warnings} other {# to look at}}.',
  'web.tools.preflight.status.pass': 'Fits',
  'web.tools.preflight.status.warning': 'Worth checking',
  'web.tools.preflight.status.fail': 'Would fail',
  'web.tools.preflight.status.unavailable': 'Unavailable',
  'web.tools.preflight.count.label':
    '{count} of {limit} {unit, select, grapheme {characters} utf16 {code units} weighted {weighted characters} other {characters}}',
  'web.tools.preflight.finding.textOver':
    'Over the limit by {over, plural, one {# character} other {# characters}}.',
  'web.tools.preflight.finding.textNear': 'Within {remaining} characters of the limit.',
  'web.tools.preflight.finding.textFits': 'The body fits.',
  'web.tools.preflight.finding.linkFixed':
    'Every link is rewritten to a fixed width, so each one costs {cost} characters whatever its real length.',
  'web.tools.preflight.finding.linkActual': 'Links count as the characters they occupy.',
  'web.tools.preflight.finding.imagesOver':
    'This platform accepts {limit, plural, =0 {no images} one {# image} other {# images}} in one post.',
  'web.tools.preflight.finding.videosOver':
    'This platform accepts {limit, plural, =0 {no video} one {# video} other {# videos}} in one post.',
  'web.tools.preflight.finding.bytesOver': 'The file is larger than the {limit} ceiling.',
  'web.tools.preflight.finding.bytesUnknown':
    'No published byte ceiling for this media kind, so the size was not checked.',
  'web.tools.preflight.finding.durationOver': 'Longer than the {limit} second ceiling.',
  'web.tools.preflight.finding.durationUnder': 'Shorter than the {limit} second minimum.',
  'web.tools.preflight.finding.durationUnknown':
    'No published duration ceiling, so the length was not checked.',
  'web.tools.preflight.finding.altText':
    'Alt text is accepted up to {limit} characters, which is worth using.',
  'web.tools.preflight.finding.ratio': 'You would be publishing at about {ratio} to 1.',
  'web.tools.preflight.faq.counting.q': 'How do you count characters?',
  'web.tools.preflight.faq.counting.a':
    'By grapheme, using the browser Intl segmenter, which is the unit a reader means by a character. Where a platform documents a different rule, such as counting code units or charging a flat width per link, that rule is applied on top.',
  'web.tools.preflight.faq.accuracy.q': 'How current are these limits?',
  'web.tools.preflight.faq.accuracy.a':
    'Each limit is generated from the connector code in our repository rather than typed into a page, and each platform row shows the official document it came from and the date a person read it. If a platform changes a number, the fix is one code change and every tool here follows.',
  'web.tools.preflight.faq.privacy.q': 'Does my draft get uploaded?',
  'web.tools.preflight.faq.privacy.a':
    'No. The check runs in your browser. There is no request carrying your text, nothing is stored, and closing the tab is enough to discard it.',
  'web.tools.preflight.faq.publish.q': 'Can this tool post for me?',
  'web.tools.preflight.faq.publish.a':
    'Not today. No connector has completed provider verification, so nothing on this site publishes to a platform yet. This page is a limit check, not a composer.',

  /* ---------------------------------------------------------------------- */
  /* UTM builder                                                             */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'UTM link builder',
  'web.tools.utm.lede':
    'Add campaign parameters to a URL without losing the query string it already had, and without guessing which parameter means what.',
  'web.tools.utm.explainer.title': 'What each parameter is for',
  'web.tools.utm.explainer.body':
    'UTM parameters are read by analytics tools, not by the platform you post on. They travel in the URL, so anyone who sees the link sees them. Keep them short, lower case and consistent, because two spellings of the same campaign become two rows in a report.',
  'web.tools.utm.field.url.label': 'Destination URL',
  'web.tools.utm.field.url.help': 'The page you want people to land on, including https.',
  'web.tools.utm.field.url.invalid': 'That does not parse as an http or https URL.',
  'web.tools.utm.field.source.label': 'Campaign source',
  'web.tools.utm.field.source.help': 'Where the click came from. For example a platform name.',
  'web.tools.utm.field.medium.label': 'Campaign medium',
  'web.tools.utm.field.medium.help': 'The kind of link. For example social, email or referral.',
  'web.tools.utm.field.campaign.label': 'Campaign name',
  'web.tools.utm.field.campaign.help': 'The launch, promotion or theme this link belongs to.',
  'web.tools.utm.field.term.label': 'Campaign term',
  'web.tools.utm.field.term.help': 'Optional. Traditionally the paid keyword.',
  'web.tools.utm.field.content.label': 'Campaign content',
  'web.tools.utm.field.content.help':
    'Optional. Separates two links to the same page, for example two versions of a post.',
  'web.tools.utm.result.title': 'Your tagged URL',
  'web.tools.utm.result.empty': 'Enter a destination URL to see the result.',
  'web.tools.utm.result.label': 'Composed URL',
  'web.tools.utm.result.preserved':
    'The query string that was already on your URL is kept exactly as you typed it.',
  'web.tools.utm.result.replaced':
    'Your URL already carried one of these parameters. The value you entered here replaces it.',
  'web.tools.utm.faq.encoding.q': 'What happens to spaces and accents?',
  'web.tools.utm.faq.encoding.a':
    'They are percent encoded, which is what makes a link survive being pasted into a post. A space becomes a plus sign and an accented letter becomes its encoded form, and analytics tools decode both back.',
  'web.tools.utm.faq.existing.q': 'Will it break a URL that already has parameters?',
  'web.tools.utm.faq.existing.a':
    'No. Existing parameters are preserved in their original order, and only a UTM parameter you filled in is added or replaced. A fragment at the end of the URL stays at the end.',
  'web.tools.utm.faq.privacy.q': 'Is my URL sent anywhere?',
  'web.tools.utm.faq.privacy.a':
    'No. The URL is composed in your browser and never leaves this page.',

  /* ---------------------------------------------------------------------- */
  /* YouTube title length checker                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'YouTube title length checker',
  'web.tools.youtubeTitle.lede':
    'A title that is one character too long is rejected on upload. A title that is merely long gets cut somewhere you did not choose.',
  'web.tools.youtubeTitle.explainer.title': 'Two different limits',
  'web.tools.youtubeTitle.explainer.body':
    'The hard ceiling is what the upload endpoint accepts. Where a title is shown is a separate question: a search result, a sidebar and a phone all cut a title at a different point, and none of those cut points is published. This tool states the documented ceiling and shows you the shape of your title, and it does not invent a truncation number.',
  'web.tools.youtubeTitle.field.title.label': 'Video title',
  'web.tools.youtubeTitle.field.title.help': 'Counted by grapheme, so an emoji costs one.',
  'web.tools.youtubeTitle.result.count': '{count} of {limit} characters',
  'web.tools.youtubeTitle.result.over':
    'Over by {over, plural, one {# character} other {# characters}}. The upload would be rejected.',
  'web.tools.youtubeTitle.result.fits': 'Within the documented ceiling.',
  'web.tools.youtubeTitle.result.front':
    'The first {count} characters carry the most weight, because that is roughly what a narrow layout has room for. Yours start: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'The title limit is unavailable in this build, so nothing is checked here.',
  'web.tools.youtubeTitle.faq.limit.q': 'Where does the limit come from?',
  'web.tools.youtubeTitle.faq.limit.a':
    'From the official videos insert reference, generated into this page from the same connector code our uploader would use. The date a person last read that page is shown beside the number.',
  'web.tools.youtubeTitle.faq.truncation.q': 'Where exactly does YouTube cut a title?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'It depends on the surface and the viewport, and YouTube does not publish a character count for it. We show the ceiling, which is documented, and we do not print a cut off number that would be a guess.',
  'web.tools.youtubeTitle.faq.emoji.q': 'Does an emoji count as one character?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'In this counter it does, because we count graphemes. A platform that counts code units internally may charge more for the same emoji, which is why the preflight checker applies each platform rule separately.',

  /* ---------------------------------------------------------------------- */
  /* Time zone and daylight saving planner                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'Time zone and daylight saving planner',
  'web.tools.timeZone.lede':
    'A weekly slot that looks stable in your calendar moves for half your audience twice a year. This shows where and when.',
  'web.tools.timeZone.explainer.title': 'Why a fixed local time is not a fixed time',
  'web.tools.timeZone.explainer.body':
    'A time only means something with a zone attached. Zones change their offset on dates that differ by country, and two regions that are five hours apart in January can be four hours apart in April. A schedule stored as an instant plus a zone survives that. A schedule stored as a local hour does not.',
  'web.tools.timeZone.field.date.label': 'Date',
  'web.tools.timeZone.field.time.label': 'Time',
  'web.tools.timeZone.field.zone.label': 'Your zone',
  'web.tools.timeZone.field.audience.label': 'Audience zones',
  'web.tools.timeZone.field.audience.help': 'Pick the zones your readers are actually in.',
  'web.tools.timeZone.result.title': 'The same moment, everywhere you picked',
  'web.tools.timeZone.result.empty': 'Pick at least one audience zone.',
  'web.tools.timeZone.result.shift':
    'A daylight saving change falls between this date and the same weekday four weeks later, so the local hour moves.',
  'web.tools.timeZone.result.stable': 'No offset change in the next four weeks.',
  'web.tools.timeZone.result.later': 'Four weeks later, {time}.',
  'web.tools.timeZone.result.invalidDate': 'Enter a date and a time to see the comparison.',
  'web.tools.timeZone.faq.dst.q': 'Which way does the hour move?',
  'web.tools.timeZone.faq.dst.a':
    'It depends on the zone and the direction of the change, which is why the table shows the actual local time four weeks out rather than describing the rule. The offset for each zone is read from your browser time zone database.',
  'web.tools.timeZone.faq.storage.q': 'How should a scheduled post store its time?',
  'web.tools.timeZone.faq.storage.a':
    'As an instant plus the IANA zone the person chose, never as a naive local time. That is what we do internally, and it is why a post scheduled before a clock change still lands at the intended local hour.',
} as const;
