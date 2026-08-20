/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message': '{provider} heeft wat tekst nodig voor dit berichttype.',
  'validation.text_too_long.message':
    '{over, plural, one {# teken over de limiet voor {account}} other {# teken over de limiet voor {account}}}',
  'validation.text_too_long.hint': '{provider} staat {limit}-tekens toe voor dit account.',
  'validation.text_too_short.message': '{provider} heeft hier minimaal {min}-tekens nodig.',
  'validation.title_required.message': '{provider} heeft een titel nodig.',
  'validation.title_too_long.message': 'De titel overschrijdt de tekenlimiet van {limit}.',
  'validation.description_too_long.message':
    'De beschrijving overschrijdt de tekenlimiet van {limit}.',
  'validation.media_required.message':
    '{provider} heeft minimaal één afbeelding of video nodig voor dit berichttype.',
  'validation.media_count_exceeded.message':
    '{provider} accepteert hier maximaal {limit, plural, one {# bestand} other {# bestanden}}. Dit bericht bevat {count}.',
  'validation.media_type_unsupported.message': '{provider} accepteert geen {mimeType}-bestanden.',
  'validation.media_aspect_ratio_unsupported.message':
    'Dit bestand is {actual}. {provider} heeft een verhouding nodig tussen {min} en {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Snijd het bij met de platformvoorinstelling om dit op te lossen.',
  'validation.media_resolution_too_low.message':
    'Dit bestand is {actual}. {provider} heeft minimaal {required} nodig.',
  'validation.media_duration_too_long.message':
    'Deze video is {actual}. {provider} accepteert maximaal {limit} voor dit account.',
  'validation.media_duration_too_short.message':
    'Deze video is {actual}. {provider} heeft minimaal {limit} nodig.',
  'validation.media_file_too_large.message':
    'Dit bestand is {actual}. {provider} accepteert maximaal {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} kan geen afbeeldingen en video in hetzelfde bericht publiceren.',
  'validation.media_unavailable.message':
    'Een bijgevoegd bestand is niet meer beschikbaar. Verwijder het uit het bericht of upload het opnieuw.',
  'validation.alt_text_missing.message':
    'Alt-tekst ontbreekt op {count, plural, one {# afbeelding} other {# afbeeldingen}}.',
  'validation.alt_text_missing.hint': 'Beschrijf de afbeelding of markeer deze als decoratief.',
  'validation.thumbnail_unsupported.message':
    '{provider} accepteert hier geen aangepaste miniatuur.',
  'validation.destination_required.message': 'Kies waar dit wordt gepubliceerd op {provider}.',
  'validation.destination_unsupported.message':
    '{destination} accepteert dit berichttype niet op {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# vermelding is niet gekoppeld aan een echt account} other {# vermeldingen zijn niet gekoppeld aan echte accounts}}.',
  'validation.mention_unresolved.hint':
    'Selecteer het account uit de zoekresultaten of verwijder de vermelding. Platte tekst wordt nooit gepubliceerd als native tag.',
  'validation.hashtag_count_exceeded.message':
    '{count}-hashtags. {provider} telt meer dan {limit} als spam.',
  'validation.link_not_allowed.message': '{provider} staat geen links in dit veld toe.',
  'validation.link_destination_unverified.message':
    'Het linkdomein {domain} is niet geverifieerd voor deze werkruimte.',
  'validation.privacy_setting_required.message':
    '{provider} vereist een expliciete privacykeuze voordat deze wordt gepubliceerd.',
  'validation.privacy_setting_required.hint':
    'Er is geen standaard. Kies wie dit bericht kan zien.',
  'validation.disclosure_required.message':
    'Dit bericht heeft openbaarmaking nodig onder de merkregels voor {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} ondersteunt geen geplande eerste reactie voor dit account.',
  'validation.thread_unsupported.message': '{provider} ondersteunt geen threads voor dit account.',
  'validation.repeat_end_required.message':
    'Een herhalend bericht heeft een einddatum of een aantal herhalingen nodig.',
  'validation.schedule_in_past.message': 'Die tijd is verstreken in {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'Dit is verder vooruit dan de {limit}-vooruitblik die voor dit certificaat is vastgesteld.',
  'validation.schedule_outside_quiet_hours.message':
    'Dit valt binnen de rustige uren die zijn vastgesteld voor {project}.',
  'validation.duplicate_within_window.message':
    'Zeer vergelijkbare inhoud is al gepland of gepubliceerd voor {account} binnen {window}.',
  'validation.blocked_term_present.message': 'De tekst bevat een geblokkeerde term voor {project}.',
  'validation.unsupported_claim.message':
    'Deze claim staat niet in de goedgekeurde claims voor {project}.',
  'validation.unsupported_claim.hint':
    'Voeg het toe aan de goedgekeurde claims met bewijsmateriaal, of herformuleer de zin.',
  'validation.cadence_exceeded.message':
    '{account} zou die dag {count, plural, one {# keer} other {# keer}} publiceren, boven de limiet van {limit}.',
  'validation.connection_paused.message': '{account} is gepauzeerd en zal niet publiceren.',
  'validation.account_type_invalid.message':
    '{account} is niet het accounttype dat {provider} vereist voor dit berichttype.',

  'validation.severity.error': 'Moet repareren',
  'validation.severity.warning': 'Controleer dit',
  'validation.severity.info': 'Ter informatie',
  'validation.field.required': 'Dit veld is verplicht.',
  'validation.field.tooShort':
    'Gebruik minimaal {min, plural, one {# karakter} other {# karakters}}.',
  'validation.field.tooLong':
    'Gebruik maximaal {max, plural, one {# karakter} other {# karakters}}.',
  'validation.field.invalidEmail': 'Voer een geldig e-mailadres in.',
  'validation.field.invalidUrl': 'Voer een volledige URL in, inclusief https.',
  'validation.field.invalidDate': 'Voer een geldige datum in.',
  'validation.field.invalidTime': 'Voer een geldige tijd in.',
  'validation.field.invalidNumber': 'Voer een nummer in.',
  'validation.field.outOfRange': 'Voer een waarde in tussen {min} en {max}.',
  'validation.field.mustMatch': 'Deze twee waarden moeten overeenkomen.',
  'validation.field.alreadyTaken': 'Dat is al in gebruik.',
  'validation.field.unsafeValue': 'Deze waarde is hier niet toegestaan.',
} as const;
