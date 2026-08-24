/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message': '{provider} behöver lite text för den här inläggstypen.',
  'validation.text_too_long.message':
    '{over, plural, one {# tecken över gränsen för {account}} other {# tecken över gränsen för {account}}}',
  'validation.text_too_long.hint': '{provider} tillåter {limit} tecken för detta konto.',
  'validation.text_too_short.message': '{provider} behöver minst {min} tecken här.',
  'validation.title_required.message': '{provider} behöver en titel.',
  'validation.title_too_long.message': 'Titeln överskrider teckenbegränsningen på {limit}.',
  'validation.description_too_long.message': 'Beskrivningen överskrider teckengränsen på {limit}.',
  'validation.media_required.message':
    '{provider} behöver minst en bild eller video för den här inläggstypen.',
  'validation.media_count_exceeded.message':
    '{provider} accepterar högst {limit, plural, one {# fil} other {# filer}} här. Det här inlägget har {count}.',
  'validation.media_type_unsupported.message': '{provider} accepterar inte {mimeType} filer.',
  'validation.media_aspect_ratio_unsupported.message':
    'Den här filen är {actual}. {provider} behöver ett förhållande mellan {min} och {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Beskär den med plattformens förinställning för att fixa detta.',
  'validation.media_resolution_too_low.message':
    'Den här filen är {actual}. {provider} behöver minst {required}.',
  'validation.media_duration_too_long.message':
    'Den här videon är {actual}. {provider} accepterar upp till {limit} för detta konto.',
  'validation.media_duration_too_short.message':
    'Den här videon är {actual}. {provider} behöver minst {limit}.',
  'validation.media_file_too_large.message':
    'Den här filen är {actual}. {provider} accepterar upp till {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} kan inte publicera bilder och video i samma inlägg.',
  'validation.media_unavailable.message':
    'En bifogad fil är inte längre tillgänglig. Ta bort den från inlägget eller ladda upp den igen.',
  'validation.alt_text_missing.message':
    'Alt text saknas på {count, plural, one {# bild} other {# bilder}}.',
  'validation.alt_text_missing.hint': 'Beskriv bilden eller markera den som dekorativ.',
  'validation.thumbnail_unsupported.message':
    '{provider} accepterar inte en anpassad miniatyr här.',
  'validation.destination_required.message': 'Välj var detta publiceras på {provider}.',
  'validation.destination_unsupported.message':
    '{destination} accepterar inte denna inläggstyp på {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# omnämnande har inte matchats till ett riktigt konto} other {# omnämnanden har inte matchats med riktiga konton}}.',
  'validation.mention_unresolved.hint':
    'Välj kontot från sökresultaten eller ta bort omnämnandet. Oformaterad text publiceras aldrig som en integrerad tagg.',
  'validation.hashtag_count_exceeded.message':
    '{count} hashtags. {provider} räknas mer än {limit} som skräppost.',
  'validation.link_not_allowed.message': '{provider} tillåter inte länkar i det här fältet.',
  'validation.link_destination_unverified.message':
    'Länkdomänen {domain} är inte verifierad för denna arbetsyta.',
  'validation.privacy_setting_required.message':
    '{provider} kräver ett uttryckligt integritetsval innan publicering.',
  'validation.privacy_setting_required.hint':
    'Det finns ingen standard. Välj vem som kan se det här inlägget.',
  'validation.disclosure_required.message':
    'Det här inlägget behöver offentliggöras enligt projektreglerna för {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} stöder inte en schemalagd första kommentar för det här kontot.',
  'validation.thread_unsupported.message': '{provider} stöder inte trådar för detta konto.',
  'validation.repeat_end_required.message':
    'Ett återkommande inlägg behöver ett slutdatum eller ett antal upprepningar.',
  'validation.schedule_in_past.message': 'Den tiden har gått i {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'Inlägg kan schemaläggas upp till {limit} i förväg, vilket också är så länge uppladdade medier sparas.',
  'validation.schedule_outside_quiet_hours.message':
    'Detta faller inom de tysta timmar som är inställda på {project}.',
  'validation.duplicate_within_window.message':
    'Mycket liknande innehåll är redan schemalagt eller publicerat för {account} inom {window}.',
  'validation.blocked_term_present.message': 'Texten innehåller en spärrad term för {project}.',
  'validation.unsupported_claim.message':
    'Detta påstående finns inte i de godkända anspråken för {project}.',
  'validation.unsupported_claim.hint':
    'Lägg till det i de godkända påståendena med bevis, eller omformulera meningen.',
  'validation.cadence_exceeded.message':
    '{account} skulle publicera {count, plural, one {# gång} other {# gånger}} den dagen, över gränsen på {limit}.',
  'validation.connection_paused.message': '{account} är pausad och kommer inte att publiceras.',
  'validation.account_type_invalid.message':
    '{account} är inte den kontotyp {provider} kräver för denna inläggstyp.',

  'validation.severity.error': 'Måste fixa',
  'validation.severity.warning': 'Kontrollera detta',
  'validation.severity.info': 'För din information',
  'validation.field.required': 'Detta fält är obligatoriskt.',
  'validation.field.tooShort': 'Använd minst {min, plural, one {# tecken} other {# tecken}}.',
  'validation.field.tooLong': 'Använd högst {max, plural, one {# tecken} other {# tecken}}.',
  'validation.field.invalidEmail': 'Ange en giltig e-postadress.',
  'validation.field.invalidUrl': 'Ange en fullständig URL, inklusive https.',
  'validation.field.invalidDate': 'Ange ett giltigt datum.',
  'validation.field.invalidTime': 'Ange en giltig tid.',
  'validation.field.invalidNumber': 'Ange ett nummer.',
  'validation.field.outOfRange': 'Ange ett värde mellan {min} och {max}.',
  'validation.field.mustMatch': 'Dessa två värden måste matcha.',
  'validation.field.alreadyTaken': 'Det är redan i bruk.',
  'validation.field.unsafeValue': 'Det värdet är inte tillåtet här.',
} as const;
