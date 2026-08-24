/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message': '{provider} potřebuje nějaký text pro tento typ příspěvku.',
  'validation.text_too_long.message':
    '{over, plural, one {# znak nad limit pro {account}} other {# znaků nad limit pro {account}} few {# znaků nad limit pro {account}} many {# znaků nad limit pro {account}}}',
  'validation.text_too_long.hint': '{provider} umožňuje {limit} znaků pro tento účet.',
  'validation.text_too_short.message': '{provider} potřebuje alespoň {min} znaků zde.',
  'validation.title_required.message': '{provider} potřebuje název.',
  'validation.title_too_long.message': 'Titul je přes {limit} limit počtu znaků.',
  'validation.description_too_long.message': 'Popis je přes {limit} limit počtu znaků.',
  'validation.media_required.message':
    '{provider} potřebuje pro tento typ příspěvku alespoň jeden obrázek nebo video.',
  'validation.media_count_exceeded.message':
    '{provider} přijímá maximálně {limit, plural, one {# soubor} other {# soubory} few {# soubory} many {# soubory}} zde. Tento příspěvek má {count}.',
  'validation.media_type_unsupported.message': '{provider} nepřijímá {mimeType} soubory.',
  'validation.media_aspect_ratio_unsupported.message':
    'Tento soubor je {actual}. {provider} potřebuje poměr mezi {min} a {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Ořízněte to s přednastavenou platformou, abyste to opravili.',
  'validation.media_resolution_too_low.message':
    'Tento soubor je {actual}. {provider} potřebuje alespoň {required}.',
  'validation.media_duration_too_long.message':
    'Toto video je {actual}. {provider} přijímá až {limit} pro tento účet.',
  'validation.media_duration_too_short.message':
    'Toto video je {actual}. {provider} potřebuje alespoň {limit}.',
  'validation.media_file_too_large.message':
    'Tento soubor je {actual}. {provider} přijímá až {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} nemůže publikovat obrázky a video ve stejném příspěvku.',
  'validation.media_unavailable.message':
    'Připojený soubor už není dostupný. Odeberte jej z příspěvku nebo jej znovu nahrajte.',
  'validation.alt_text_missing.message':
    'Na {count, plural, one {# obrázek} other {# obrázky} few {# obrázky} many {# obrázky}}.',
  'validation.alt_text_missing.hint': 'Popište obrázek nebo jej označte jako dekorativní.',
  'validation.thumbnail_unsupported.message': '{provider} zde nepřijímá vlastní miniaturu.',
  'validation.destination_required.message': 'Vyberte, kde bude toto publikováno na {provider}.',
  'validation.destination_unsupported.message':
    '{destination} nepřijímá tento typ příspěvku na {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# zmínka nebyla přiřazena ke skutečnému účtu} other {# zmínky nebyly přiřazeny ke skutečným účtům} few {# zmínky nebyly přiřazeny ke skutečným účtům} many {# zmínky nebyly přiřazeny ke skutečným účtům}}.',
  'validation.mention_unresolved.hint':
    'Vyberte účet z výsledků vyhledávání nebo zmínku odeberte. Prostý text se nikdy nepublikuje jako nativní značka.',
  'validation.hashtag_count_exceeded.message':
    '{count} hashtagy. {provider} se počítá více než {limit} jako spam.',
  'validation.link_not_allowed.message': '{provider} nepovoluje odkazy v tomto poli.',
  'validation.link_destination_unverified.message':
    'Odkazová doména {domain} není pro tento pracovní prostor ověřen.',
  'validation.privacy_setting_required.message':
    '{provider} vyžaduje před publikováním explicitní volbu ochrany soukromí.',
  'validation.privacy_setting_required.hint':
    'Neexistuje žádné výchozí nastavení. Vyberte, kdo může vidět tento příspěvek.',
  'validation.disclosure_required.message':
    'Tento příspěvek vyžaduje zveřejnění podle pravidel projektu pro {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} nepodporuje naplánovaný první komentář pro tento účet.',
  'validation.thread_unsupported.message': '{provider} nepodporuje vlákna pro tento účet.',
  'validation.repeat_end_required.message':
    'Opakující se příspěvek potřebuje datum ukončení nebo počet opakování.',
  'validation.schedule_in_past.message': 'Ten čas uplynul v {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'Příspěvky lze naplánovat až {limit} dopředu, což je také doba, po kterou uchováváme nahraná média.',
  'validation.schedule_outside_quiet_hours.message':
    'Toto spadá do klidových hodin nastavených na {project}.',
  'validation.duplicate_within_window.message':
    'Velmi podobný obsah je již naplánován nebo publikován pro {account} v rámci {window}.',
  'validation.blocked_term_present.message': 'Text obsahuje blokovaný výraz pro {project}.',
  'validation.unsupported_claim.message': 'Tento nárok není ve schválených nárocích pro {project}.',
  'validation.unsupported_claim.hint':
    'Přidejte jej ke schváleným tvrzením s důkazy nebo přeformulujte větu.',
  'validation.cadence_exceeded.message':
    '{account} zveřejní {count, plural, one {# čas} other {# krát} few {# krát} many {# krát}} ten den, přes limit {limit}.',
  'validation.connection_paused.message': '{account} je pozastaveno a nebude publikováno.',
  'validation.account_type_invalid.message':
    '{account} není typ účtu {provider} vyžaduje pro tento typ příspěvku.',

  'validation.severity.error': 'Nutno opravit',
  'validation.severity.warning': 'Zkontrolujte toto',
  'validation.severity.info': 'Pro vaši informaci',
  'validation.field.required': 'Toto pole je povinné.',
  'validation.field.tooShort':
    'Použijte alespoň {min, plural, one {# znak} other {# znaků} few {# znaků} many {# znaků}}.',
  'validation.field.tooLong':
    'Použijte maximálně {max, plural, one {# znak} other {# znaků} few {# znaků} many {# znaků}}.',
  'validation.field.invalidEmail': 'Zadejte platnou e-mailovou adresu.',
  'validation.field.invalidUrl': 'Zadejte úplnou adresu URL, včetně https.',
  'validation.field.invalidDate': 'Zadejte platné datum.',
  'validation.field.invalidTime': 'Zadejte platný čas.',
  'validation.field.invalidNumber': 'Zadejte číslo.',
  'validation.field.outOfRange': 'Zadejte hodnotu mezi {min} a {max}.',
  'validation.field.mustMatch': 'Tyto dvě hodnoty se musí shodovat.',
  'validation.field.alreadyTaken': 'To se již používá.',
  'validation.field.unsafeValue': 'Tato hodnota zde není povolena.',
} as const;
