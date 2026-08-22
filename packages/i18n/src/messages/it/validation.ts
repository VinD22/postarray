/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message': '{provider} necessita di testo per questo tipo di post.',
  'validation.text_too_long.message':
    '{over, plural, one {# caratteri oltre il limite per {account}} many {# caratteri oltre il limite per {account}} other {# caratteri oltre il limite per {account}}}',
  'validation.text_too_long.hint': '{provider} consente i caratteri {limit} per questo account.',
  'validation.text_too_short.message': '{provider} necessita di almeno {min} caratteri qui.',
  'validation.title_required.message': '{provider} necessita di un titolo.',
  'validation.title_too_long.message': 'Il titolo supera il limite di caratteri {limit}.',
  'validation.description_too_long.message':
    'La descrizione supera il limite di caratteri {limit}.',
  'validation.media_required.message':
    "{provider} necessita di almeno un'immagine o un video per questo tipo di post.",
  'validation.media_count_exceeded.message':
    '{provider} accetta al massimo {limit, plural, one {# file} many {# file} other {# file}} qui. Questo post contiene {count}.',
  'validation.media_type_unsupported.message': '{provider} non accetta file {mimeType}.',
  'validation.media_aspect_ratio_unsupported.message':
    'Questo file è {actual}. {provider} necessita di un rapporto tra {min} e {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Ritaglialo con la piattaforma preimpostata per risolvere questo problema.',
  'validation.media_resolution_too_low.message':
    'Questo file è {actual}. {provider} necessita di almeno {required}.',
  'validation.media_duration_too_long.message':
    'Questo video è {actual}. {provider} accetta fino a {limit} per questo account.',
  'validation.media_duration_too_short.message':
    'Questo video è {actual}. {provider} necessita di almeno {limit}.',
  'validation.media_file_too_large.message':
    'Questo file è {actual}. {provider} accetta fino a {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} non può pubblicare immagini e video nello stesso post.',
  'validation.media_unavailable.message':
    'Un file allegato non è più disponibile. Rimuovilo dal post o caricalo di nuovo.',
  'validation.alt_text_missing.message':
    'Manca il testo alternativo su {count, plural, one {# immagine} many {# immagini} other {# immagini}}.',
  'validation.alt_text_missing.hint': "Descrivi l'immagine o contrassegnala come decorativa.",
  'validation.thumbnail_unsupported.message':
    '{provider} non accetta una miniatura personalizzata qui.',
  'validation.destination_required.message': 'Scegli dove pubblicare su {provider}.',
  'validation.destination_unsupported.message':
    '{destination} non accetta questo tipo di post su {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# menzione non è stata abbinata a un account reale} many {# menzioni non sono state abbinate a un account reale} other {# menzioni non sono state abbinate a un account reale}}.',
  'validation.mention_unresolved.hint':
    "Seleziona l'account dai risultati della ricerca o rimuovi la menzione. Il testo normale non viene mai pubblicato come tag nativo.",
  'validation.hashtag_count_exceeded.message':
    'Hashtag {count}. {provider} conta più di {limit} come spam.',
  'validation.link_not_allowed.message': '{provider} non consente collegamenti in questo campo.',
  'validation.link_destination_unverified.message':
    'Il dominio del collegamento {domain} non è verificato per questa area di lavoro.',
  'validation.privacy_setting_required.message':
    '{provider} richiede una scelta esplicita sulla privacy prima della pubblicazione.',
  'validation.privacy_setting_required.hint':
    'Non esiste un valore predefinito. Scegli chi può vedere questo post.',
  'validation.disclosure_required.message':
    "Questo post necessita di un'informativa ai sensi delle regole del progetto per {market}.",
  'validation.first_comment_unsupported.message':
    '{provider} non supporta un primo commento pianificato per questo account.',
  'validation.thread_unsupported.message':
    '{provider} non supporta le discussioni per questo account.',
  'validation.repeat_end_required.message':
    'Un post ripetuto necessita di una data di fine o di un numero di ripetizioni.',
  'validation.schedule_in_past.message': 'Quel tempo è passato in {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'Questo è più avanti rispetto allo sguardo al futuro di {limit} impostato per questa credenziale.',
  'validation.schedule_outside_quiet_hours.message':
    'Questo rientra nelle ore tranquille impostate per {project}.',
  'validation.duplicate_within_window.message':
    "Contenuti molto simili sono già programmati o pubblicati per {account} all'interno di {window}.",
  'validation.blocked_term_present.message': 'Il testo contiene un termine bloccato per {project}.',
  'validation.unsupported_claim.message':
    'Questa affermazione non è inclusa nelle affermazioni approvate per {project}.',
  'validation.unsupported_claim.hint':
    'Aggiungilo alle affermazioni approvate con prove o riformula la frase.',
  'validation.cadence_exceeded.message':
    '{account} pubblicherebbe {count, plural, one {# volta} many {# volte} other {# volte}} quel giorno, oltre il limite di {limit}.',
  'validation.connection_paused.message': '{account} è in pausa e non verrà pubblicato.',
  'validation.account_type_invalid.message':
    '{account} non è il tipo di account richiesto da {provider} per questo tipo di post.',

  'validation.severity.error': 'Deve sistemare',
  'validation.severity.warning': 'Controlla questo',
  'validation.severity.info': 'Per tua informazione',
  'validation.field.required': 'Questo campo è obbligatorio.',
  'validation.field.tooShort':
    'Utilizzare almeno {min, plural, one {# carattere} many {# caratteri} other {# caratteri}}.',
  'validation.field.tooLong':
    'Utilizza al massimo {max, plural, one {# carattere} many {# caratteri} other {# caratteri}}.',
  'validation.field.invalidEmail': 'Inserisci un indirizzo email valido.',
  'validation.field.invalidUrl': 'Inserisci un URL completo, incluso https.',
  'validation.field.invalidDate': 'Inserisci una data valida.',
  'validation.field.invalidTime': 'Inserisci un orario valido.',
  'validation.field.invalidNumber': 'Inserisci un numero.',
  'validation.field.outOfRange': 'Immettere un valore compreso tra {min} e {max}.',
  'validation.field.mustMatch': 'Questi due valori devono corrispondere.',
  'validation.field.alreadyTaken': 'Questo è già in uso.',
  'validation.field.unsafeValue': 'Questo valore non è consentito qui.',
} as const;
