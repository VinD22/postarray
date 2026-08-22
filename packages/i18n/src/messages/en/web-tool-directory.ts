/**
 * The generated free tool directory: one character counter per platform, and
 * one consolidated media limits table.
 *
 * These pages are generated from the same publishing-limits dataset the
 * connector code produces, so the rules that bind `web-tools.ts` bind this file
 * too: a page may state a number only where the dataset carries one, beside the
 * official document it came from and the date a person read it, and no tool
 * writes, rewrites or scores content.
 *
 * Why this is a namespace of its own rather than more `web.tools.` keys:
 * `web.tools.` is a locale-filled prefix in `beta-fallbacks.ts`, which means
 * ten locales have a human translation of every key under it and the catalog
 * parity test enforces that. New English copy added there would either break
 * that test or be filled in by machine translation, and every sentence below
 * either states a platform rule or promises that nothing typed leaves the
 * browser. Both are exactly the claims a machine translation is most likely to
 * soften. `web.toolDirectory.` is registered as a beta English fallback prefix
 * instead, so these pages ship in the reviewed English source until a person
 * translates them.
 */
export const webToolDirectoryMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.toolDirectory.index.description':
    'Free tools for people who post to several platforms: a character counter for every platform we have limits for, a media size table, a per platform limit check, a UTM builder and a time zone planner. Nothing you type is uploaded.',
  'web.meta.toolDirectory.counter.title': '{platform} character counter',
  'web.meta.toolDirectory.counter.description':
    'Count a {platform} post the way {platform} counts it, in your browser. The ceiling comes from the same generated dataset our publishing checks read, beside the official document it came from and the date a person read it.',
  'web.meta.toolDirectory.media.title': 'Social media image and video size limits',
  'web.meta.toolDirectory.media.description':
    'File size ceilings, video length limits, attachment counts and accepted formats for every platform we have recorded, one table per platform, each figure beside its official source.',

  /* ---------------------------------------------------------------------- */
  /* The directory index                                                     */
  /* ---------------------------------------------------------------------- */

  'web.toolDirectory.lede':
    'Small tools built on the same platform limit data our connectors read. No account, no upload, no tracking of what you type.',
  'web.toolDirectory.group.calculators.title': 'Checks and calculators',
  'web.toolDirectory.group.counters.title': 'Character counters',
  'web.toolDirectory.group.counters.body':
    'One page per platform, because no two platforms count a post the same way. A platform is listed here only where the dataset carries a body text ceiling for it.',
  'web.toolDirectory.group.media.title': 'Image and video specs',
  'web.toolDirectory.group.media.body':
    'Every recorded upload limit in one place: file size ceilings, how long a video may run, how many files fit on one post and which formats are accepted.',
  'web.toolDirectory.counterLink.title': '{platform} character counter',

  /* ---------------------------------------------------------------------- */
  /* Per platform character counter                                          */
  /* ---------------------------------------------------------------------- */

  'web.toolDirectory.counter.title': '{platform} character counter',
  'web.toolDirectory.counter.lede':
    'Paste a post and see how much of the {platform} ceiling it uses, measured the way {platform} measures it. The count happens in this browser tab and nowhere else.',
  'web.toolDirectory.counter.explainer.title': 'How {platform} counts a post',
  'web.toolDirectory.counter.explainer.body':
    '{platform} accepts {limit, plural, one {# character} other {# characters}} in the body of one post, measured in {unit, select, grapheme {characters as a reader would count them, so an emoji or an accented letter costs one} utf16 {UTF-16 code units, so an emoji usually costs two} weighted {a weighted unit, where most alphabetic scripts cost one per character while CJK characters and emoji cost two} other {characters}}. This page applies the same rule our connector applies before it sends a post.',
  'web.toolDirectory.counter.explainer.links':
    '{mode, select, fixed {Links are the part people get wrong. {platform} rewrites every URL to a fixed width, so one link costs {cost, plural, one {# character} other {# characters}} whatever the real URL length is, and shortening a URL before you paste it saves nothing.} actual {A link costs exactly the characters it occupies, so a long URL costs more of the ceiling than a short one.} other {Links are not counted against this ceiling.}}',
  'web.toolDirectory.counter.field.draft.label': 'Your post',
  'web.toolDirectory.counter.field.draft.help':
    'Counted as you type, in this tab. There is no request carrying it anywhere, and nothing is stored.',
  'web.toolDirectory.counter.progress.label': 'Share of the ceiling used',
  'web.toolDirectory.counter.result.empty': 'Type or paste a post to see the count.',
  'web.toolDirectory.counter.result.remaining':
    '{remaining, plural, one {# character left} other {# characters left}}',
  'web.toolDirectory.counter.result.links':
    '{links, plural, one {# link in this post} other {# links in this post}}',
  'web.toolDirectory.counter.faq.counting.q': 'How does {platform} count a character?',
  'web.toolDirectory.counter.faq.counting.a':
    '{unit, select, grapheme {By grapheme, which is the unit a reader means by a character. An emoji, a flag and a letter carrying a separate accent mark each cost one.} utf16 {By UTF-16 code unit, which is what a programming language usually reports as string length. Most emoji cost two, and some cost more.} weighted {By a weighted count. Most alphabetic scripts cost one per character, Latin, Cyrillic and Arabic among them. CJK characters and most emoji cost two.} other {By character.}} This page measures with the browser segmenter and then applies the {platform} rule on top.',
  'web.toolDirectory.counter.faq.links.q': 'Do links count against the {platform} limit?',
  'web.toolDirectory.counter.faq.links.a':
    '{mode, select, fixed {Yes, at a flat rate. Every URL is rewritten to the platform shortener, so each link costs {cost, plural, one {# character} other {# characters}} of the ceiling however long it was when you pasted it.} actual {Yes, at their real length. A URL costs the characters it occupies, the same as any other text.} other {No. Links are not counted against this ceiling.}}',
  'web.toolDirectory.counter.related.title': 'The same counter, other platforms',
  'web.toolDirectory.counter.related.body':
    'Each platform enforces its own ceiling and its own counting rule, so a post that fits here can still be rejected somewhere else.',

  /* ---------------------------------------------------------------------- */
  /* Image and video size table                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolDirectory.media.name': 'Image and video size limits',
  'web.toolDirectory.media.summary':
    'Every recorded upload ceiling, video length and accepted format, one table per platform.',
  'web.toolDirectory.media.title': 'Social media image and video size limits',
  'web.toolDirectory.media.lede':
    'What each platform accepts as an upload: how large a file may be, how long a video may run, how many files fit on one post and which formats go through. One table per platform, generated from our connector code.',
  'web.toolDirectory.media.listLabel': 'Recorded media limits, platform by platform',
  'web.toolDirectory.media.tableCaption': 'Media limits recorded for {platform}',
  'web.toolDirectory.media.column.limit': 'Limit',
  'web.toolDirectory.media.column.value': 'Value',
  'web.toolDirectory.media.pixelsTitle': 'Why there are no pixel dimensions here',
  'web.toolDirectory.media.pixelsBody':
    'This dataset records what an upload is rejected for: file size, duration, attachment count and format. It does not record recommended pixel dimensions, so this page prints none. A recommended crop we had not verified would be a guess, and a guess is what sends a person back to redo the artwork.',
  'web.toolDirectory.media.missingTitle': 'Why a platform can be missing',
  'web.toolDirectory.media.missingBody':
    'A platform with no connector in this build has no recorded media limits, so it has no table here. An empty table of zeros would read as a set of real ceilings, which is the one thing it must not do.',
  'web.toolDirectory.media.checkTitle': 'Check a real file against these',
  'web.toolDirectory.media.checkBody':
    'The preflight checker takes a file size, a duration and a draft, and tells you which platforms would reject them. It runs in your browser as well.',

  /* ---------------------------------------------------------------------- */
  /* The "Text and captions" group                                          */
  /* ---------------------------------------------------------------------- */

  'web.toolDirectory.group.text.title': 'Text and captions',
  'web.toolDirectory.group.text.body':
    'Five small utilities for shaping a caption before it is posted: splitting a long post into a numbered thread, counting hashtags and mentions, converting case, copying an invisible character, and timing a script out loud.',

  /* ---------------------------------------------------------------------- */
  /* Thread splitter                                                        */
  /* ---------------------------------------------------------------------- */

  'web.meta.toolDirectory.threadSplitter.title': 'Thread splitter',
  'web.meta.toolDirectory.threadSplitter.description':
    'Split a long post into numbered parts that each fit the character limit of a chosen network, cut at a paragraph or sentence break rather than mid-word. Runs in your browser.',
  'web.toolDirectory.threadSplitter.name': 'Thread splitter',
  'web.toolDirectory.threadSplitter.summary':
    'Split long text into a numbered stack of parts that each fit the character limit of a chosen network.',
  'web.toolDirectory.threadSplitter.title': 'Thread splitter',
  'web.toolDirectory.threadSplitter.lede':
    'Paste a long post and pick a network. This splits it into a numbered stack of parts, each measured against the real character limit and counting rule of that network, cut at a paragraph or a sentence rather than mid-word.',
  'web.toolDirectory.threadSplitter.explainer.title': 'How the cut is chosen',
  'web.toolDirectory.threadSplitter.explainer.body':
    'Each part is packed as full as it can be without going over the limit. A paragraph break is preferred first, then a sentence break, then a word gap; a single word is never cut in half. A paragraph or sentence too long to fit any part on its own is broken down one level finer rather than left oversized. The one exception is a single word, most often a very long link, that still does not fit alone: it stands as its own part rather than being cut, and is flagged as over the limit.',
  'web.toolDirectory.threadSplitter.explainer.links':
    'The counting rule of each network applies to every part, the same rule its character counter page uses. On a network that rewrites links to a fixed width, a part carrying a link is measured at that fixed width, not the real length of the link.',
  'web.toolDirectory.threadSplitter.field.draft.label': 'Your long post',
  'web.toolDirectory.threadSplitter.field.draft.help':
    'Counted and split as you type, in this tab. Nothing is uploaded or stored.',
  'web.toolDirectory.threadSplitter.field.network.label': 'Network',
  'web.toolDirectory.threadSplitter.result.title': 'Thread',
  'web.toolDirectory.threadSplitter.result.empty': 'Paste a long post to see it split into parts.',
  'web.toolDirectory.threadSplitter.result.partLabel': 'Part {index} of {total}',
  'web.toolDirectory.threadSplitter.faq.boundaries.q': 'Where does the split happen?',
  'web.toolDirectory.threadSplitter.faq.boundaries.a':
    'At the largest boundary that still fits: a paragraph break first, then a sentence break, then a gap between words. A single word is never split in half, even if that means one part runs over the limit.',
  'web.toolDirectory.threadSplitter.faq.limit.q': 'Which limit does each part have to fit?',
  'web.toolDirectory.threadSplitter.faq.limit.a':
    'Whichever network you pick in the dropdown, measured the same way its own character counter page measures a post, including its link counting rule.',

  /* ---------------------------------------------------------------------- */
  /* Hashtag and mention counter                                            */
  /* ---------------------------------------------------------------------- */

  'web.meta.toolDirectory.hashtagCounter.title': 'Hashtag and mention counter',
  'web.meta.toolDirectory.hashtagCounter.description':
    'Count the hashtags and @mentions in a post and flag any hashtag repeated more than once. Runs in your browser; nothing is uploaded.',
  'web.toolDirectory.hashtagCounter.name': 'Hashtag and mention counter',
  'web.toolDirectory.hashtagCounter.summary':
    'Count hashtags and @mentions in a post and flag any hashtag that repeats.',
  'web.toolDirectory.hashtagCounter.title': 'Hashtag and mention counter',
  'web.toolDirectory.hashtagCounter.lede':
    'Paste a post to count its hashtags and @mentions and see which hashtags repeat. It does not check the total against a platform ceiling; see the question below for why.',
  'web.toolDirectory.hashtagCounter.explainer.title': 'What gets counted',
  'web.toolDirectory.hashtagCounter.explainer.body':
    'A hashtag or a mention found inside a link is not counted: a profile URL such as instagram.com/@handle carries an @ that is part of the address, not one you typed as a mention, and a search link can carry a literal # in its query string. A repeated hashtag is matched without regard to case, so #Launch and #LAUNCH count as the same tag, and the count shown is the first casing you typed it in.',
  'web.toolDirectory.hashtagCounter.field.draft.label': 'Your post',
  'web.toolDirectory.hashtagCounter.field.draft.help':
    'Counted as you type, in this tab. Nothing is uploaded or stored.',
  'web.toolDirectory.hashtagCounter.result.title': 'Count',
  'web.toolDirectory.hashtagCounter.result.hashtags': 'Hashtags',
  'web.toolDirectory.hashtagCounter.result.mentions': 'Mentions',
  'web.toolDirectory.hashtagCounter.result.uniqueHashtags':
    '{count, plural, one {# unique} other {# unique}} after collapsing repeats',
  'web.toolDirectory.hashtagCounter.result.duplicatesTitle': 'Repeated hashtags',
  'web.toolDirectory.hashtagCounter.result.duplicateCount':
    '{count, plural, one {used once} other {used # times}}',
  'web.toolDirectory.hashtagCounter.result.noDuplicates': 'No hashtag repeats in this post.',
  'web.toolDirectory.hashtagCounter.result.noLimitData':
    'This does not check the total against a platform ceiling: see "Does this check the 30 hashtag limit Instagram publishes?" below for why.',
  'web.toolDirectory.hashtagCounter.faq.limit.q':
    'Does this check the 30 hashtag limit Instagram publishes?',
  'web.toolDirectory.hashtagCounter.faq.limit.a':
    'Not today. Instagram publishes a 30 hashtag cap, but every number the tools on this site state comes from our generated publishing-limits dataset, beside the official source and the date a person read it, and that dataset does not carry a hashtag count field yet. Rather than type an unsourced number into this page, it counts and flags repeats and leaves the ceiling check for when that field exists.',
  'web.toolDirectory.hashtagCounter.faq.duplicate.q': 'Why does a repeated hashtag matter?',
  'web.toolDirectory.hashtagCounter.faq.duplicate.a':
    'Using the same hashtag twice in one post does not add reach and can read as filler or spam. This flags it so you can decide whether it earns its place.',

  /* ---------------------------------------------------------------------- */
  /* Case converter                                                         */
  /* ---------------------------------------------------------------------- */

  'web.meta.toolDirectory.caseConverter.title': 'Case converter',
  'web.meta.toolDirectory.caseConverter.description':
    'Convert pasted text to sentence case, Title Case, UPPERCASE or lowercase without touching a URL, a hashtag or an @mention. Runs in your browser.',
  'web.toolDirectory.caseConverter.name': 'Case converter',
  'web.toolDirectory.caseConverter.summary':
    'Sentence case, Title Case, UPPERCASE or lowercase, without touching a URL, hashtag or @mention.',
  'web.toolDirectory.caseConverter.title': 'Case converter',
  'web.toolDirectory.caseConverter.lede':
    'Paste text and pick a case. A URL, a hashtag and an @mention are found first and left exactly as typed; only the surrounding text is converted.',
  'web.toolDirectory.caseConverter.explainer.title': 'What stays untouched',
  'web.toolDirectory.caseConverter.explainer.body':
    'Every http or https link, every #hashtag and every @mention is detected before any conversion runs, and none of the four modes touches them: a link is case sensitive in its path, a hashtag is how a platform indexes a post, and a mention names a real account. Title Case here means one fixed rule, capitalize the first letter of every remaining word and lowercase the rest, without the list of lower-cased small words some house styles use, because this tool has no basis to make that editorial call for you.',
  'web.toolDirectory.caseConverter.field.draft.label': 'Your text',
  'web.toolDirectory.caseConverter.field.draft.help':
    'Converted as you type, in this tab. Nothing is uploaded or stored.',
  'web.toolDirectory.caseConverter.field.mode.label': 'Case',
  'web.toolDirectory.caseConverter.field.mode.sentence': 'Sentence case',
  'web.toolDirectory.caseConverter.field.mode.title': 'Title Case',
  'web.toolDirectory.caseConverter.field.mode.upper': 'UPPERCASE',
  'web.toolDirectory.caseConverter.field.mode.lower': 'lowercase',
  'web.toolDirectory.caseConverter.result.title': 'Result',
  'web.toolDirectory.caseConverter.result.empty': 'Type or paste text to see it converted.',
  'web.toolDirectory.caseConverter.result.label': 'Converted text',
  'web.toolDirectory.caseConverter.result.preserved':
    '{count, plural, one {# link, hashtag or mention was} other {# links, hashtags and mentions were}} left exactly as typed.',
  'web.toolDirectory.caseConverter.faq.protected.q': 'Does this change my links or hashtags?',
  'web.toolDirectory.caseConverter.faq.protected.a':
    'No. Every URL, #hashtag and @mention is detected first and copied through unchanged in every mode, including sentence case, which still capitalizes the real sentence text around them.',
  'web.toolDirectory.caseConverter.faq.titleRule.q':
    'How does Title Case decide what to capitalize?',
  'web.toolDirectory.caseConverter.faq.titleRule.a':
    'It capitalizes the first letter of every word outside a protected link, hashtag or mention, and lowercases the rest of that word. It does not lowercase short connecting words such as "a" or "of" the way some house style guides do, since that is a style choice rather than a fact this tool can make for you.',

  /* ---------------------------------------------------------------------- */
  /* Invisible character copier                                             */
  /* ---------------------------------------------------------------------- */

  'web.meta.toolDirectory.invisibleCharacter.title': 'Invisible character copier',
  'web.meta.toolDirectory.invisibleCharacter.description':
    'Copy a real zero-width or blank Unicode character, with an honest explanation of what each one is actually for and a paste-test area to confirm the copy worked.',
  'web.toolDirectory.invisibleCharacter.name': 'Invisible character copier',
  'web.toolDirectory.invisibleCharacter.summary':
    'Copy a zero-width or blank Unicode character, with an honest explanation of what it is for.',
  'web.toolDirectory.invisibleCharacter.title': 'Invisible character copier',
  'web.toolDirectory.invisibleCharacter.lede':
    'Four real Unicode characters that render as blank or take up no width, each with one tap to copy and a plain explanation of what it is actually for.',
  'web.toolDirectory.invisibleCharacter.explainer.title': 'What these are actually for',
  'web.toolDirectory.invisibleCharacter.explainer.body':
    'Every character below is a real, documented Unicode code point, not a trick. The braille pattern blank is a printable character that happens to render as empty space, which is why it can survive in a field that strips a whitespace-only line: it is not whitespace to begin with. The zero-width characters take up no width at all and exist for their own documented purpose, such as joining two emoji into one combined glyph. Whether any of them survives how a specific platform processes text is not something we have tested, so this page does not promise a result.',
  'web.toolDirectory.invisibleCharacter.entry.brailleBlank.name': 'Braille pattern blank',
  'web.toolDirectory.invisibleCharacter.entry.brailleBlank.explainer':
    'A real, printable braille character that renders as an empty cell. Because it is a printable character rather than whitespace, it can keep a line "alive" in a caption or bio field that automatically strips a line containing only whitespace.',
  'web.toolDirectory.invisibleCharacter.entry.zeroWidthSpace.name': 'Zero width space',
  'web.toolDirectory.invisibleCharacter.entry.zeroWidthSpace.explainer':
    'A word-break opportunity with no visible width. Browsers and text layout engines use it to mark where a long run of text without spaces, such as a URL, is allowed to wrap. On its own it adds no visible space.',
  'web.toolDirectory.invisibleCharacter.entry.zeroWidthJoiner.name': 'Zero width joiner',
  'web.toolDirectory.invisibleCharacter.entry.zeroWidthJoiner.explainer':
    'Joins two adjacent code points into a single combined glyph where a font supports it, most visibly in emoji such as a family or profession emoji made of several people joined into one. Outside a sequence a font recognizes, it renders as nothing.',
  'web.toolDirectory.invisibleCharacter.entry.zeroWidthNonJoiner.name': 'Zero width non-joiner',
  'web.toolDirectory.invisibleCharacter.entry.zeroWidthNonJoiner.explainer':
    'The opposite of the joiner: it tells a font to keep two adjacent letters from being merged into a connected ligature, which matters in scripts such as Persian and Arabic where letters normally join. It has no visible width of its own.',
  'web.toolDirectory.invisibleCharacter.pasteTest.title': 'Paste-test',
  'web.toolDirectory.invisibleCharacter.pasteTest.field.label': 'Paste here to check',
  'web.toolDirectory.invisibleCharacter.pasteTest.field.help':
    'Paste after copying one of the characters above. This reads only what you paste into this field, in this tab.',
  'web.toolDirectory.invisibleCharacter.pasteTest.result.empty': 'Nothing pasted yet.',
  'web.toolDirectory.invisibleCharacter.pasteTest.result.none':
    'No character from the list above was found in what you pasted.',
  'web.toolDirectory.invisibleCharacter.pasteTest.result.found':
    '{name}: found {count, plural, one {once} other {# times}}.',
  'web.toolDirectory.invisibleCharacter.faq.why.q': 'Why would I want an invisible character?',
  'web.toolDirectory.invisibleCharacter.faq.why.a':
    'Most often to keep a genuinely blank line inside a caption or bio field that automatically deletes a line made only of ordinary whitespace, or, for the joiner and non-joiner, to control how a font combines the characters next to them.',
  'web.toolDirectory.invisibleCharacter.faq.reliability.q': 'Will these survive on every platform?',
  'web.toolDirectory.invisibleCharacter.faq.reliability.a':
    'We cannot promise that. No connector on this site has been verified against a live platform yet, and some platforms strip zero-width characters deliberately. Test on the destination before relying on one.',

  /* ---------------------------------------------------------------------- */
  /* Video script timer                                                     */
  /* ---------------------------------------------------------------------- */

  'web.meta.toolDirectory.videoScriptTimer.title': 'Video script timer',
  'web.meta.toolDirectory.videoScriptTimer.description':
    'Estimate how long a script takes to read aloud at two stated speaking paces, and see the word budget left for 15, 30, 60 and 90 second videos. Runs in your browser.',
  'web.toolDirectory.videoScriptTimer.name': 'Video script timer',
  'web.toolDirectory.videoScriptTimer.summary':
    'Estimate spoken duration and word budget for 15, 30, 60 and 90 second videos.',
  'web.toolDirectory.videoScriptTimer.title': 'Video script timer',
  'web.toolDirectory.videoScriptTimer.lede':
    'Paste a script to see roughly how long it takes to read aloud, at two stated speaking paces, and how many words that leaves you for a 15, 30, 60 or 90 second video.',
  'web.toolDirectory.videoScriptTimer.explainer.title': 'Where the paces come from',
  'web.toolDirectory.videoScriptTimer.explainer.body':
    'This is plain arithmetic, a word count divided by an assumed speaking pace. Neither pace is a platform fact or a measurement of your own voice; they are two commonly cited spoken narration paces, stated plainly so the assumption is visible rather than hidden inside one confident-looking number. Your own delivery may run faster or slower than either.',
  'web.toolDirectory.videoScriptTimer.field.script.label': 'Your script',
  'web.toolDirectory.videoScriptTimer.field.script.help':
    'Paste narration only. On-screen text or captions are not read aloud by a viewer, so leaving them out keeps the estimate closer to the real spoken length. Counted as you type, in this tab.',
  'web.toolDirectory.videoScriptTimer.result.wordCount':
    '{count, plural, one {# word} other {# words}}',
  'web.toolDirectory.videoScriptTimer.pace.conversational': 'Conversational ({wpm} wpm)',
  'web.toolDirectory.videoScriptTimer.pace.brisk': 'Brisk ({wpm} wpm)',
  'web.toolDirectory.videoScriptTimer.result.duration':
    'About {seconds, plural, one {# second} other {# seconds}} to read aloud',
  'web.toolDirectory.videoScriptTimer.result.budgetTitle':
    'Word budget for common short video lengths',
  'web.toolDirectory.videoScriptTimer.result.budgetHelp':
    'How many words fit in each length at each pace, and how many words of your script that leaves, rounded down so the budget never promises a fractional word.',
  'web.toolDirectory.videoScriptTimer.result.durationColumn': 'Length',
  'web.toolDirectory.videoScriptTimer.result.durationValue': '{seconds}s',
  'web.toolDirectory.videoScriptTimer.result.budgetCell':
    '{budget} word budget, {remainingAbs, plural, one {# word {status, select, over {over} other {left}}} other {# words {status, select, over {over} other {left}}}}',
  'web.toolDirectory.videoScriptTimer.faq.pace.q': 'Why only two paces?',
  'web.toolDirectory.videoScriptTimer.faq.pace.a':
    'Two clearly labelled assumptions are honest about what this is: arithmetic, not a measurement of your voice. Read your own script aloud once with a stopwatch if you need a number specific to you.',
  'web.toolDirectory.videoScriptTimer.faq.budget.q': 'What does the word budget mean?',
  'web.toolDirectory.videoScriptTimer.faq.budget.a':
    'For one target length and one pace, it is the number of words that fit in that many seconds, rounded down. "Words left" subtracts the actual word count of your script from that budget; once your script runs longer than the budget, it shows how many words are over instead.',
  /* ---------------------------------------------------------------------- */
  /* Unicode text styles: the hub and four destination pages                 */
  /* ---------------------------------------------------------------------- */

  /*
   * One rule governs every sentence below. This cluster substitutes Unicode
   * look-alike code points; it does not make, host or link a font file, and no
   * string here may imply otherwise. The second rule is that we have measured
   * no platform's handling of these code points, so no string here says a style
   * "works" anywhere. It says paste it and look.
   */

  'web.toolDirectory.fontGenerator.sample': 'Type something here',
  'web.toolDirectory.fontGenerator.field.draft.label': 'Your text',
  'web.toolDirectory.fontGenerator.field.draft.help':
    'Styled as you type, in this tab. There is no request carrying it anywhere, nothing is stored and nothing about what you type is measured.',
  'web.toolDirectory.fontGenerator.result.title': 'Every style, from what you typed',
  'web.toolDirectory.fontGenerator.result.sampleNote':
    'Showing sample text until you type. Copy any row with the button under it.',
  'web.toolDirectory.fontGenerator.result.liveNote':
    'Copy any row with the button under it, then paste it where you want it.',
  'web.toolDirectory.fontGenerator.result.label': '{style}, styled version of your text',

  'web.toolDirectory.fontGenerator.accessibility.title': 'Read this before you style a whole bio',
  'web.toolDirectory.fontGenerator.accessibility.body':
    'These are not letters wearing a font. Each one is a different Unicode character that happens to look like a letter, so a screen reader announces it wrongly, letter by letter, or skips it entirely. Search does not match it against the plain word either. A person using a screen reader may hear your styled name as a run of noise, and someone searching for you may not find you.',
  'web.toolDirectory.fontGenerator.accessibility.advice':
    'The safe way to use this is sparingly: one styled word for emphasis, with your name, your handle and anything a reader needs to understand or find you left as ordinary text. A fully styled bio is a bio some people cannot read.',

  'web.toolDirectory.fontGenerator.explainer.title': 'What this actually does',
  'web.toolDirectory.fontGenerator.explainer.body':
    'Unicode contains alphabets that were added for mathematics, phonetics and legacy typesetting: a bold serif alphabet, a script alphabet, a double-struck alphabet, small capitals, letters inside circles, and more. This tool swaps each letter you type for its look-alike in one of those alphabets. The result is plain text, which is why it survives a copy and paste into a field that offers no formatting at all.',
  'web.toolDirectory.fontGenerator.explainer.extra':
    'It is not a font, and there is no file to download. If you came here looking for a typeface to install, this is the wrong tool and we would rather say so than waste your time.',
  'web.toolDirectory.fontGenerator.platformNote':
    'Support varies. Some apps keep these characters exactly as pasted, some normalise them back to plain letters, and some show a box where a device has no glyph for them. We have not tested any platform, so the honest instruction is the same everywhere: paste it into the real field on the device you care about, and look at it before you save.',

  'web.toolDirectory.fontGenerator.faq.notAFont.q': 'Is this a font I can download?',
  'web.toolDirectory.fontGenerator.faq.notAFont.a':
    'No. There is no font file here and nothing to install. This swaps each letter for a different Unicode character that looks like a styled version of it, which is why the result can be pasted into a bio or a caption that has no formatting controls. If you need an actual typeface file, you need a type foundry or a font library, not this page.',
  'web.toolDirectory.fontGenerator.faq.accessibility.q': 'Will a screen reader read this?',
  'web.toolDirectory.fontGenerator.faq.accessibility.a':
    'Badly, or not at all. A screen reader reads the character it is given, and these characters are not the letters they resemble, so they are announced wrongly or skipped. The same goes for search and for anything that matches text. Use one styled word where it earns its place, and leave your name, your handle and the words a reader needs as ordinary text.',
  'web.toolDirectory.fontGenerator.faq.support.q': 'Will these show up correctly everywhere?',
  'web.toolDirectory.fontGenerator.faq.support.a':
    'We cannot promise that, and we have measured none of it. Whether a style survives depends on the platform, the app version and the device font, and any of the three can change without notice. Paste it where you plan to use it, look at it on a phone as well as a desktop, and keep the plain version if it comes out wrong.',
  'web.toolDirectory.fontGenerator.faq.download.q':
    'Can I get a tattoo font, a graffiti font or Old English here?',
  'web.toolDirectory.fontGenerator.faq.download.a':
    'No. Those are typeface files you install, and this page cannot give you one. The closest thing here is the fraktur alphabet, which is a Unicode alphabet with a blackletter shape, and it is still text rather than a font. Sending you away is the right answer more often than pretending otherwise.',

  'web.toolDirectory.fontGenerator.style.boldSerif.name': 'Bold',
  'web.toolDirectory.fontGenerator.style.boldSerif.note':
    'The mathematical bold serif alphabet. Letters and digits both.',
  'web.toolDirectory.fontGenerator.style.italicSerif.name': 'Italic',
  'web.toolDirectory.fontGenerator.style.italicSerif.note':
    'The mathematical italic serif alphabet. Digits stay as typed, because the block has none.',
  'web.toolDirectory.fontGenerator.style.boldItalicSerif.name': 'Bold italic',
  'web.toolDirectory.fontGenerator.style.boldItalicSerif.note':
    'The mathematical bold italic serif alphabet. Letters only.',
  'web.toolDirectory.fontGenerator.style.script.name': 'Script',
  'web.toolDirectory.fontGenerator.style.script.note':
    'The mathematical script alphabet, the closest thing Unicode has to handwriting. Letters only.',
  'web.toolDirectory.fontGenerator.style.scriptBold.name': 'Bold script',
  'web.toolDirectory.fontGenerator.style.scriptBold.note':
    'The heavier weight of the same script alphabet. Letters only.',
  'web.toolDirectory.fontGenerator.style.fraktur.name': 'Fraktur',
  'web.toolDirectory.fontGenerator.style.fraktur.note':
    'The blackletter alphabet Unicode carries for mathematics. Letters only, and it is text rather than a gothic font file.',
  'web.toolDirectory.fontGenerator.style.doubleStruck.name': 'Outline',
  'web.toolDirectory.fontGenerator.style.doubleStruck.note':
    'The double-struck alphabet, the one used for number sets in mathematics. Letters and digits.',
  'web.toolDirectory.fontGenerator.style.sans.name': 'Sans serif',
  'web.toolDirectory.fontGenerator.style.sans.note':
    'The plain sans-serif alphabet. Subtle by design, and easy to mistake for unstyled text.',
  'web.toolDirectory.fontGenerator.style.sansBold.name': 'Sans bold',
  'web.toolDirectory.fontGenerator.style.sansBold.note':
    'The bold weight of the sans-serif alphabet. Letters and digits.',
  'web.toolDirectory.fontGenerator.style.sansItalic.name': 'Sans italic',
  'web.toolDirectory.fontGenerator.style.sansItalic.note':
    'The sloped sans-serif alphabet. Letters only.',
  'web.toolDirectory.fontGenerator.style.monospace.name': 'Monospace',
  'web.toolDirectory.fontGenerator.style.monospace.note':
    'The fixed-width alphabet. Every character occupies the same advance width.',
  'web.toolDirectory.fontGenerator.style.smallCaps.name': 'Small caps',
  'web.toolDirectory.fontGenerator.style.smallCaps.note':
    'Phonetic small capital letters. Unicode has no small capital X, so an x stays lower case rather than being faked with something else.',
  'web.toolDirectory.fontGenerator.style.circled.name': 'Circled',
  'web.toolDirectory.fontGenerator.style.circled.note':
    'Letters and digits inside circles, from the enclosed alphanumerics block.',
  'web.toolDirectory.fontGenerator.style.squared.name': 'Squared',
  'web.toolDirectory.fontGenerator.style.squared.note':
    'Letters inside squares. The block has capitals only, so lower case is raised to capitals first.',
  'web.toolDirectory.fontGenerator.style.fullwidth.name': 'Wide',
  'web.toolDirectory.fontGenerator.style.fullwidth.note':
    'The fullwidth forms, sized for the square grid CJK text is set on. Spaces widen too.',
  'web.toolDirectory.fontGenerator.style.strikethrough.name': 'Strikethrough',
  'web.toolDirectory.fontGenerator.style.strikethrough.note':
    'Your own letters, each followed by a combining long stroke. The line is drawn by the mark, so it can render unevenly.',
  'web.toolDirectory.fontGenerator.style.underline.name': 'Underline',
  'web.toolDirectory.fontGenerator.style.underline.note':
    'Your own letters, each followed by a combining low line. Same caveat: the line comes from the mark, not from the font.',

  /* The hub */

  'web.meta.toolDirectory.fontGenerator.title': 'Font changer and fancy font generator',
  'web.meta.toolDirectory.fontGenerator.description':
    'A font changer for bios and captions: type once and see every fancy font style, bold, italic, cursive script, outline, small caps and more, with one tap to copy. Unicode text, not a font file. Runs in your browser.',
  'web.toolDirectory.fontGenerator.name': 'Font changer',
  'web.toolDirectory.fontGenerator.summary':
    'Type once, see every Unicode text style, copy the one you want. Not a font file.',
  'web.toolDirectory.fontGenerator.title': 'Font changer and fancy font generator',
  'web.toolDirectory.fontGenerator.lede':
    'Type your text once and see it in every style this tool can make, then copy the one you want. These are Unicode characters you can paste anywhere, not a font you install.',

  /* Instagram */

  'web.meta.toolDirectory.instagramFonts.title': 'Instagram fonts: an Instagram font generator',
  'web.meta.toolDirectory.instagramFonts.description':
    'Instagram fonts for your bio and captions. Type once, see every style, copy in one tap. Unicode text rather than a font file, with a plain warning about what styled text does to screen readers and search.',
  'web.toolDirectory.instagramFonts.name': 'Instagram fonts',
  'web.toolDirectory.instagramFonts.summary':
    'Styled text for an Instagram bio or caption, with the accessibility cost stated plainly.',
  'web.toolDirectory.instagramFonts.title': 'Instagram fonts',
  'web.toolDirectory.instagramFonts.lede':
    'Type your bio or caption once and copy it in whichever style you want. It pastes into Instagram as ordinary text, because that is what it is: Unicode characters, not a font.',
  'web.toolDirectory.instagramFonts.explainer.title': 'Why a bio can be styled at all',
  'web.toolDirectory.instagramFonts.explainer.body':
    'Instagram gives you no formatting controls in a bio or a caption, so every styled bio you have seen was made this way: the letters were swapped for Unicode look-alikes before being pasted in. Nothing is installed and nothing is added to your account.',
  'web.toolDirectory.instagramFonts.explainer.extra':
    'Keep your name and your handle as plain letters. They are what somebody types when they search for you, and a styled version of them is a different string as far as any search is concerned.',
  'web.toolDirectory.instagramFonts.platformNote':
    'We have not tested how Instagram handles any of these characters, and we will not tell you a style is safe there. Support can differ between the iOS app, the Android app and the web, and between a bio, a caption and a comment. Paste it into the real field, look at it, and save only if it came out right.',
  'web.toolDirectory.instagramFonts.faq.bio.q': 'How do I put a styled font in my Instagram bio?',
  'web.toolDirectory.instagramFonts.faq.bio.a':
    'Type the text above, copy the style you want, then paste it into the bio field in Edit profile and save. If the characters come back as plain letters, or as empty boxes, that field or that app version did not accept them, and the plain version is the one to keep.',

  /* Discord */

  'web.meta.toolDirectory.discordFonts.title': 'Discord fonts: styled text for Discord',
  'web.meta.toolDirectory.discordFonts.description':
    'Discord fonts for a username, a status or a message. Type once, copy any style. Unicode text rather than a font file, with the accessibility cost stated plainly and a note on when Discord markdown is the better tool.',
  'web.toolDirectory.discordFonts.name': 'Discord fonts',
  'web.toolDirectory.discordFonts.summary':
    'Styled text for a Discord name, status or message, and when to use markdown instead.',
  'web.toolDirectory.discordFonts.title': 'Discord fonts',
  'web.toolDirectory.discordFonts.lede':
    'Styled text for a display name, a status or a message, copied in one tap. It is Unicode text, so it goes anywhere Discord accepts typing.',
  'web.toolDirectory.discordFonts.explainer.title': 'Where markdown is the better answer',
  'web.toolDirectory.discordFonts.explainer.body':
    'Inside a message, Discord already formats text: asterisks around a word make it bold, underscores make it italic, and a pair of tildes strikes it through. That is real formatting, it is read correctly by a screen reader, and it stays searchable, so use it whenever you are writing a message rather than naming something.',
  'web.toolDirectory.discordFonts.explainer.extra':
    'This page is for the places markdown does not reach, such as a display name or a status, where the only way to change how the text looks is to change the characters themselves. That is why the strikethrough and underline styles are left off this page: Discord does both properly, and a combining mark is the worse way to get the same look.',
  'web.toolDirectory.discordFonts.platformNote':
    'We have not tested how Discord handles any of these characters, and support can differ between the desktop app, the browser and mobile, and between a nickname, a status and a message. Some servers also reject unusual characters in a nickname. Paste it in the real place and look before you commit to it.',
  'web.toolDirectory.discordFonts.faq.markdown.q':
    'Should I use this or Discord markdown for a message?',
  'web.toolDirectory.discordFonts.faq.markdown.a':
    'Markdown, every time, for a message. Wrapping a word in asterisks gives you real bold that a screen reader announces correctly and search can still match. Use this page for a display name or a status, where markdown does not apply.',

  /* Facebook */

  'web.meta.toolDirectory.facebookFonts.title': 'Facebook fonts: styled text for posts and bios',
  'web.meta.toolDirectory.facebookFonts.description':
    'Facebook fonts for a post, a bio or a page name. Type once, copy any style in one tap. Unicode text rather than a font file, with a plain warning about screen readers and about text that stops being searchable.',
  'web.toolDirectory.facebookFonts.name': 'Facebook fonts',
  'web.toolDirectory.facebookFonts.summary':
    'Styled text for a Facebook post or bio, with the search and screen reader cost stated plainly.',
  'web.toolDirectory.facebookFonts.title': 'Facebook fonts',
  'web.toolDirectory.facebookFonts.lede':
    'Type a post or a bio once and copy it in whichever style you want. It pastes into Facebook as ordinary text, because these are Unicode characters rather than a font.',
  'web.toolDirectory.facebookFonts.explainer.title': 'What styling costs you here',
  'web.toolDirectory.facebookFonts.explainer.body':
    'Facebook has no formatting controls in a post or a bio, so styled text is made by swapping the letters for Unicode look-alikes. Nothing is installed and nothing changes about your account.',
  'web.toolDirectory.facebookFonts.explainer.extra':
    'The cost is bigger on Facebook than on most places, because Facebook search is how people find a page, a group or a person. A styled page name is a different string from the plain one, so somebody typing the plain spelling may not reach you.',
  'web.toolDirectory.facebookFonts.platformNote':
    'We have not tested how Facebook handles any of these characters. Behaviour can differ between the app and the browser, and a name field may have rules a post does not. Paste it into the real field and look at the result before you save it.',
  'web.toolDirectory.facebookFonts.faq.search.q': 'Will people still find my page if I style it?',
  'web.toolDirectory.facebookFonts.faq.search.a':
    'Possibly not. Styled characters are not the letters they resemble, so a search for the plain spelling of your name has nothing to match. If being findable matters, keep the name plain and put the styling somewhere it costs you less.',

  /* Cursive */

  'web.meta.toolDirectory.cursiveFonts.title': 'Cursive font generator: cursive fonts to copy',
  'web.meta.toolDirectory.cursiveFonts.description':
    'A cursive font generator for bios and captions: script, bold script and italic cursive fonts you can copy in one tap. Unicode text rather than a font file, with a plain note about screen readers and search.',
  'web.toolDirectory.cursiveFonts.name': 'Cursive font generator',
  'web.toolDirectory.cursiveFonts.summary':
    'Script and italic styles only, for when cursive is the thing you actually want.',
  'web.toolDirectory.cursiveFonts.title': 'Cursive font generator',
  'web.toolDirectory.cursiveFonts.lede':
    'The joined and sloped styles on their own: script, bold script and three italics. Type once, copy the one you like, paste it anywhere text goes.',
  'web.toolDirectory.cursiveFonts.explainer.title': 'How close to real cursive this gets',
  'web.toolDirectory.cursiveFonts.explainer.body':
    'Unicode has one script alphabet and one bold script alphabet, added for mathematics rather than for handwriting. They are the most cursive-looking letters that exist as plain text, and this page shows them beside the italics for comparison, so you can pick by eye instead of by name.',
  'web.toolDirectory.cursiveFonts.explainer.extra':
    'The letters do not join up the way handwriting does, and they cannot: each one is a separate character with its own shape. If you want genuinely connected lettering you want a typeface, and a typeface is a file this page cannot give you.',
  'web.toolDirectory.cursiveFonts.platformNote':
    'The script alphabets are among the less widely supported ones, so an older device may show a box instead of a letter. We have tested no platform. Paste it where you intend to use it, check it on a phone as well as a computer, and keep the plain version if it does not render.',
  'web.toolDirectory.cursiveFonts.faq.joined.q': 'Why do the letters not join up?',
  'web.toolDirectory.cursiveFonts.faq.joined.a':
    'Because each one is an individual Unicode character rather than a letter drawn by a font that knows what comes next. Joining is something a typeface does with its own shaping rules, and plain text has none. What you see here is as connected as copy and paste cursive gets.',

  /* The directory group */

  'web.toolDirectory.group.textStyles.title': 'Text styles you can paste',
  'web.toolDirectory.group.textStyles.body':
    'These substitute Unicode look-alike characters for the letters you type, which is why the result pastes into a bio or a caption that has no formatting controls. None of them is a font file, and every one of them costs you something: styled text is read poorly by a screen reader and is not matched by search.',
} as const;
