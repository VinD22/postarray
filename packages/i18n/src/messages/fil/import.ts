/**
 * Bulk CSV import.
 *
 * Two groups of strings. The `import.error.*` keys are the ones the parser and
 * the apply step emit: they are stored on a row, rendered in the report and
 * written into the downloadable CSV, so they have to make sense to someone
 * reading a spreadsheet rather than a screen. Everything else is the wizard.
 *
 * The copy says drafts wherever drafts are what happens, and it says schedule
 * only on the step where a person chooses it. Nothing here promises that a post
 * reaches a platform.
 */
export const importMessages = {
  'import.title': 'Mag-import ng mga post mula sa CSV',
  'import.subtitle':
    'Mag-upload ng spreadsheet, basahin kung ano ang gagawin nito, saka magdesisyon. Ang pag-upload ay nagche-check lang ng file. Wala itong ginagawang anuman.',

  'import.step.upload': 'I-upload',
  'import.step.columns': 'Mga column',
  'import.step.review': 'I-review',
  'import.step.apply': 'I-apply',
  'import.step.results': 'Mga resulta',
  'import.step.position': 'Hakbang {current} sa {total}',

  'import.upload.heading': 'Pumili ng CSV file',
  'import.upload.help':
    'CSV lang. Hindi nababasa ang mga spreadsheet file tulad ng .xlsx. I-export muna ang iyong sheet bilang CSV.',
  'import.upload.field': 'CSV file',
  'import.upload.fieldHelp': 'Pumili ng file, o i-paste ang mga row sa box sa ibaba.',
  'import.upload.paste': 'O i-paste ang CSV text',
  'import.upload.pasteHelp': 'Isama ang header row. Nachecheck ang lahat bago may gawin.',
  'import.upload.project': 'Proyekto',
  'import.upload.projectHelp': 'Ang bawat row sa isang file ay pag-aari ng project na ito.',
  'import.upload.submit': 'I-check ang file na ito',
  'import.upload.submitting': 'Binabasa ang file',
  'import.upload.allowPast': 'Payagan ang mga oras na nakalipas na',
  'import.upload.allowPastHelp':
    'Naka-off bilang default. Ire-report ang row na may petsang nakaraan para maayos mo ito, sa halip na awtomatikong ilipat.',
  'import.upload.tooLarge':
    'Mas malaki sa {limit} na character ang file na iyon. Hatiin ito at subukan ulit.',
  'import.upload.duplicate':
    'Ito ang parehong file na na-upload mo na noon, kaya tinitingnan mo ang import na iyon sa halip na ikalawang kopya nito.',

  'import.template.heading': 'Ano ang ibig sabihin ng mga column',
  'import.template.download': 'Mag-download ng template na CSV',
  'import.template.required': 'Mga kinakailangang column',
  'import.template.optional': 'Mga opsyonal na column',
  'import.column.external_row_id':
    'Ang sarili mong id para sa row. Dapat ito ay natatangi sa loob ng file.',
  'import.column.project': 'Ang pangalan o id ng project na pag-aari ng row.',
  'import.column.targets':
    'Alinman sa set: na sinusundan ng id ng isang target set, o mga id ng account na pinaghihiwalay ng vertical bar.',
  'import.column.caption': 'Ang teksto ng post.',
  'import.column.scheduled_local_time': 'Petsa at oras na lokal, isinulat bilang 2026-09-01T10:00.',
  'import.column.time_zone':
    'Ang IANA zone kung saan babasahin ang oras na lokal, halimbawa Europe/Berlin.',
  'import.column.media':
    'Isang media id, sha256: na sinusundan ng checksum ng media na mayroon ka na, o isang https address na kukunin ng server.',
  'import.column.title': 'Isang pamagat, kung saan gumagamit nito ang destinasyon.',
  'import.column.destination': 'Ang page, board, o channel sa loob ng account.',
  'import.column.privacy': 'Ang value ng privacy na inaasahan ng destinasyon.',
  'import.column.first_comment': 'Ang tekstong ipo-post bilang unang komento pagkatapos ng post.',
  'import.column.approval_policy': 'Ang approval policy na idadagdag sa bawat draft.',
  'import.column.perPlatform':
    'Ang isang caption_ o title_ na column na pinangalanan ayon sa isang platform ay nag-o-override lang sa platform na iyon, halimbawa caption_instagram.',

  'import.columns.heading': 'Pagsusuri ng column',
  'import.columns.ok': 'Naroon ang lahat ng kinakailangang column.',
  'import.columns.missing':
    '{count, plural, one {# kinakailangang column ang kulang} other {# kinakailangang column ang kulang}}',
  'import.columns.unknown':
    '{count, plural, one {# column ang hindi nakilala at binalewala} other {# column ang hindi nakilala at binalewala}}',
  'import.columns.present': 'Mga column na nahanap',

  'import.review.heading': 'Ano ang gagawin ng file na ito',
  'import.review.counts':
    '{valid, plural, =0 {Walang row na handa} one {# row ang handa} other {# row ang handa}}, {invalid, plural, =0 {wala ang kailangan ng atensyon} one {# ang kailangan ng atensyon} other {# ang kailangan ng atensyon}}.',
  'import.review.empty': 'Walang row na nabasa mula sa file na ito.',
  'import.review.rowsHeading': 'Mga row',
  'import.review.filterAll': 'Lahat ng row',
  'import.review.filterValid': 'Handa na',
  'import.review.filterInvalid': 'Kailangan ng atensyon',
  'import.review.filterFailed': 'Nabigo',
  'import.review.downloadErrors': 'I-download ang mga problema bilang CSV',
  'import.review.parsedWith': 'Nabasa gamit ang parser {version}',

  'import.table.row': 'Id ng row',
  'import.table.line': 'Linya',
  'import.table.state': 'Katayuan',
  'import.table.caption': 'Teksto',
  'import.table.time': 'Naka-iskedyul',
  'import.table.problems': 'Mga problema',
  'import.table.draft': 'Draft',
  'import.table.noProblems': 'Wala',

  'import.state.pending': 'Hindi pa na-check',
  'import.state.valid': 'Handa na',
  'import.state.invalid': 'Kailangan ng atensyon',
  'import.state.applied': 'Nagawa ang draft',
  'import.state.skipped': 'Nagawa na noon',
  'import.state.failed': 'Nabigo',

  'import.job.state.uploaded': 'Na-upload',
  'import.job.state.validating': 'Nagche-check',
  'import.job.state.validated': 'Na-check',
  'import.job.state.applying': 'Ina-apply',
  'import.job.state.applied': 'Na-apply',
  'import.job.state.failed': 'Hindi mabasa',

  'import.apply.heading': 'Ano ang dapat mangyari sa mga row na handa na?',
  'import.apply.drafts': 'Gumawa ng mga draft',
  'import.apply.draftsHelp':
    'Ang default. Ang bawat row na handa ay nagiging draft na puwede mong buksan, i-edit, at aprubahan. Wala pang naka-iskedyul.',
  'import.apply.scheduled': 'Gumawa ng mga draft at i-iskedyul ang mga ito',
  'import.apply.scheduledHelp':
    'Ang bawat row na handa ay nagiging draft at kukunin ang oras na nakasulat sa file. Piliin ito kung tama lang ang mga oras.',
  'import.apply.confirm': 'I-apply ang {count, plural, one {# row} other {# row}}',
  'import.apply.confirmScheduled':
    'Gumawa at i-iskedyul ang {count, plural, one {# row} other {# row}}',
  'import.apply.running': 'Ina-apply ang mga row',
  'import.apply.safeToRepeat':
    'Ligtas na i-apply nang dalawang beses. Ang row na nakagawa na ng draft ay hindi na gagalawin.',

  'import.results.heading': 'Mga resulta',
  'import.results.applied': '{count, plural, one {# draft ang nagawa} other {# draft ang nagawa}}',
  'import.results.skipped':
    '{count, plural, one {# row ang nagawa na noon} other {# row ang nagawa na noon}}',
  'import.results.failed': '{count, plural, one {# row ang nabigo} other {# row ang nabigo}}',
  'import.results.retry': 'I-apply ulit ang natitirang mga row',
  'import.results.openDrafts': 'Buksan ang mga draft',
  'import.results.unavailable': 'hindi available',

  'import.history.heading': 'Mga naunang import',
  'import.history.empty': 'Wala pang import.',
  'import.history.open': 'Buksan',

  'import.a11y.rowsTable': 'Mga row ng file at ang kanilang mga problema',
  'import.a11y.stepList': 'Mga hakbang sa pag-import',
  'import.a11y.uploadedFile': 'Napiling file: {filename}',

  'import.error.emptyFile': 'Walang row ang file na iyon.',
  'import.error.missingColumn': 'Kulang ang column na {column}.',
  'import.error.unknownColumn': 'Hindi nakilala ang column na {column}, kaya binalewala ito.',
  'import.error.duplicateRowId':
    'Ginamit nang mahigit isang beses ang row id na {value} sa file na ito.',
  'import.error.required': 'Hindi puwedeng blangko ang cell na ito.',
  'import.error.invalidCell': 'Wala sa hugis na mababasa namin ang cell na ito.',
  'import.error.rowShape': 'May {actual} cell ang linyang ito pero {expected} ang header.',
  'import.error.invalidLocalTime':
    'Ang oras na {value} ay hindi isang lokal na petsa at oras tulad ng 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'Ang zone na {value} ay hindi isang pangalan ng IANA time zone.',
  'import.error.nonexistentLocalTime':
    'Hindi umiiral ang oras na {value} sa {zone}. Nilalaktawan ito ng orasan.',
  'import.error.ambiguousLocalTime':
    'Dalawang beses nangyayari ang oras na {value} sa {zone} sa araw na iyon. Pumili ng ibang oras.',
  'import.error.scheduleInPast': 'Nakaraan na ang oras na {value} sa {zone}.',
  'import.error.invalidTargets':
    'Ang value na {value} ay hindi isang naka-save na target set o listahan ng mga account id.',
  'import.error.invalidMedia':
    'Ang value na {value} ay hindi isang media id, sha256 checksum, o https address.',
  'import.error.mediaNotFound': 'Walang media sa workspace na ito na tumutugma sa {value}.',
  'import.error.mediaImportStarted':
    'Kinukuha ang media sa {value}. I-apply ulit ang file na ito kapag nasa library na ito.',
  'import.error.unknownVariantTarget':
    'Walang account na {provider} ang row na ito, kaya hindi ginamit ang caption para sa {provider}.',
  'import.error.applyFailed': 'Hindi ma-apply ang row na ito. Reference: {code}.',
  'import.error.alreadyApplied': 'Nakagawa na ng draft ang row na ito, kaya hindi na ito ginalaw.',
  'import.error.tooManyRows': 'Ang unang {limit} row lang ng isang file ang nababasa.',
} as const;
