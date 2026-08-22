/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message':
    '{provider} precisa de algum texto para este tipo de publicação.',
  'validation.text_too_long.message':
    '{over, plural, one {# caracteres acima do limite para {account}} other {# caracteres acima do limite para {account}} many {# caracteres acima do limite para {account}}}',
  'validation.text_too_long.hint': '{provider} permite {limit} caracteres para esta conta.',
  'validation.text_too_short.message': '{provider} precisa de pelo menos {min} caracteres aqui.',
  'validation.title_required.message': '{provider} precisa de um título.',
  'validation.title_too_long.message': 'O título ultrapassou o limite de {limit} caracteres.',
  'validation.description_too_long.message': 'A descrição excede o limite de {limit} caracteres.',
  'validation.media_required.message':
    '{provider} precisa de pelo menos uma imagem ou vídeo para este tipo de publicação.',
  'validation.media_count_exceeded.message':
    '{provider} aceita no máximo {limit, plural, one {# arquivo} other {# arquivos} many {# arquivos}} aqui. Esta publicação tem {count}.',
  'validation.media_type_unsupported.message': '{provider} não aceita arquivos {mimeType}.',
  'validation.media_aspect_ratio_unsupported.message':
    'Este arquivo é {actual}. {provider} precisa de uma proporção entre {min} e {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Corte-o com a predefinição da plataforma para corrigir isso.',
  'validation.media_resolution_too_low.message':
    'Este arquivo é {actual}. {provider} precisa de pelo menos {required}.',
  'validation.media_duration_too_long.message':
    'Este vídeo é {actual}. {provider} aceita até {limit} para esta conta.',
  'validation.media_duration_too_short.message':
    'Este vídeo é {actual}. {provider} precisa de pelo menos {limit}.',
  'validation.media_file_too_large.message':
    'Este arquivo é {actual}. {provider} aceita até {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} não pode publicar imagens e vídeos na mesma publicação.',
  'validation.alt_text_missing.message':
    'O texto alternativo está faltando em {count, plural, one {# imagem} other {# imagens} many {# imagens}}.',
  'validation.alt_text_missing.hint': 'Descreva a imagem ou marque-a como decorativa.',
  'validation.thumbnail_unsupported.message':
    '{provider} não aceita miniaturas personalizadas aqui.',
  'validation.destination_required.message': 'Escolha onde será publicado em {provider}.',
  'validation.destination_unsupported.message':
    '{destination} não aceita este tipo de publicação em {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# a menção não foi correspondida com uma conta real} other {# as menções não foram correspondidas com contas reais} many {# as menções não foram correspondidas com contas reais}}.',
  'validation.mention_unresolved.hint':
    'Selecione a conta nos resultados da pesquisa ou remova a menção. Texto simples nunca é publicado como uma tag nativa.',
  'validation.hashtag_count_exceeded.message':
    '{count} hashtags. {provider} conta mais que {limit} como spam.',
  'validation.link_not_allowed.message': '{provider} não permite links neste campo.',
  'validation.link_destination_unverified.message':
    'O domínio do link {domain} não foi verificado para este espaço de trabalho.',
  'validation.privacy_setting_required.message':
    '{provider} requer uma escolha explícita de privacidade antes da publicação.',
  'validation.privacy_setting_required.hint':
    'Não há padrão. Escolha quem pode ver esta publicação.',
  'validation.disclosure_required.message':
    'Esta publicação precisa de divulgação de acordo com as regras do projeto para {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} não suporta um primeiro comentário agendado para esta conta.',
  'validation.thread_unsupported.message': '{provider} não suporta conversas para esta conta.',
  'validation.repeat_end_required.message':
    'Uma publicação repetida precisa de uma data de término ou de um número de repetições.',
  'validation.schedule_in_past.message': 'Esse tempo já passou em {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'Isso está mais à frente do que o {limit} definido para esta credencial.',
  'validation.schedule_outside_quiet_hours.message':
    'Isso cai dentro do horário de silêncio definido para {project}.',
  'validation.duplicate_within_window.message':
    'Conteúdo muito semelhante já está agendado ou publicado para {account} dentro de {window}.',
  'validation.blocked_term_present.message': 'O texto contém um termo bloqueado para {project}.',
  'validation.unsupported_claim.message':
    'Esta reivindicação não está nas reivindicações aprovadas para {project}.',
  'validation.unsupported_claim.hint':
    'Adicione-o às reivindicações aprovadas com evidências ou reformule a frase.',
  'validation.cadence_exceeded.message':
    '{account} publicaria {count, plural, one {# hora} other {# vezes} many {# vezes}} naquele dia, acima do limite de {limit}.',
  'validation.connection_paused.message': '{account} está pausado e não será publicado.',
  'validation.account_type_invalid.message':
    '{account} não é o tipo de conta {provider} exigido para este tipo de publicação.',

  'validation.severity.error': 'Deve ser corrigido',
  'validation.severity.warning': 'Verifique isto',
  'validation.severity.info': 'Para sua informação',
  'validation.field.required': 'Este campo é obrigatório.',
  'validation.field.tooShort':
    'Use pelo menos {min, plural, one {# caractere} other {# caracteres} many {# caracteres}}.',
  'validation.field.tooLong':
    'Use no máximo {max, plural, one {# caractere} other {# caracteres} many {# caracteres}}.',
  'validation.field.invalidEmail': 'Insira um endereço de e-mail válido.',
  'validation.field.invalidUrl': 'Insira um URL completo, incluindo https.',
  'validation.field.invalidDate': 'Insira uma data válida.',
  'validation.field.invalidTime': 'Insira um horário válido.',
  'validation.field.invalidNumber': 'Insira um número.',
  'validation.field.outOfRange': 'Insira um valor entre {min} e {max}.',
  'validation.field.mustMatch': 'Esses dois valores devem corresponder.',
  'validation.field.alreadyTaken': 'Isso já está em uso.',
  'validation.field.unsafeValue': 'Esse valor não é permitido aqui.',
  'validation.media_unavailable.message':
    'Um arquivo anexado não está mais disponível. Remova-o da publicação ou envie-o novamente.',
  'validation.media_rights_undeclared.message':
    'Declare os direitos e o consentimento de cada arquivo anexado antes de publicar.',
  'validation.media_not_ready.message':
    'Um arquivo anexado ainda não passou pelo processamento e pelas verificações de segurança.',
  'validation.media_scan_blocked.message':
    'Um arquivo anexado não passou na verificação de segurança e não pode ser publicado.',
} as const;
