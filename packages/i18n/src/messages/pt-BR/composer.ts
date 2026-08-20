/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Compor',
  'composer.titleWithProject': 'Escrever para {project}',
  'composer.master.label': 'Rascunho mestre',
  'composer.master.description':
    'Escreva uma vez aqui. As alterações compatíveis atingem todos os alvos selecionados. Abra um destino para escrever uma versão que somente essa conta receberá.',
  'composer.master.globalEdit': 'Edição global',
  'composer.master.placeholder': 'O que você deseja publicar?',
  'composer.brief.label': 'Breve',
  'composer.brief.placeholder': 'Descreva a ideia, o público e o resultado que você deseja.',
  'composer.sources.label': 'Referências de fontes',
  'composer.sources.empty': 'Nenhuma fonte anexada.',
  'composer.campaign.label': 'Campanha',
  'composer.campaign.none': 'Sem campanha',
  'composer.contentLocale.label': 'Idioma do conteúdo',
  'composer.contentLocale.help':
    'O idioma da publicação. Isso é separado do idioma da sua interface.',
  'composer.market.label': 'Mercado de público',

  'composer.targets.title': 'Alvos',
  'composer.targets.count':
    '{count, plural, =0 {Nenhuma conta selecionada} one {# conta} other {# contas} many {# contas}}',
  'composer.targets.publishSummary':
    '{count, plural, one {Isso será publicado em # conta} other {Isso será publicado em # contas} many {Isso será publicado em # contas}} {when, select, now {agora} scheduled {no horário agendado} other {}}',
  'composer.targets.add': 'Adicionar contas',
  'composer.targets.empty': 'Selecione pelo menos uma conta para publicar.',
  'composer.targets.state.ready': 'Pronto',
  'composer.targets.state.inherited': 'Herdado de mestre',
  'composer.targets.state.overridden': 'Substituído',
  'composer.targets.state.warning': 'Verifique antes de publicar',
  'composer.targets.state.error': 'Precisa de uma correção',
  'composer.targets.state.approvalNeeded': 'Aprovação necessária',
  'composer.targets.overrideBadge': 'Substituir',
  'composer.targets.resetConfirm.title': 'Redefinir esta meta para o rascunho mestre?',
  'composer.targets.resetConfirm.body':
    'A cópia, mídia e configurações que você alterou para {account} serão substituídas pelo rascunho mestre. Outros alvos não são afetados.',
  'composer.targets.divergence':
    '{count, plural, one {# o alvo difere do rascunho mestre} other {# os alvos diferem do rascunho mestre} many {# os alvos diferem do rascunho mestre}}',

  'composer.applyToAll.title': 'Aplicar a todos os alvos',
  'composer.applyToAll.compatible':
    '{count, plural, one {# o campo é compatível com todos os alvos selecionados} other {# os campos são compatíveis com todos os alvos selecionados} many {# os campos são compatíveis com todos os alvos selecionados}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# o campo não pode ser aplicado e permanece por destino} other {# os campos não podem ser aplicados e permanece por alvo} many {# os campos não podem ser aplicados e permanece por alvo}}',
  'composer.applyToAll.creates': 'Applying cria uma versão explícita para cada alvo.',

  'composer.editor.label': 'Postar texto',
  'composer.editor.characterCount': '{used} de {limit} caracteres',
  'composer.editor.characterCountOver': '{over} caracteres acima do limite de {limit} caracteres',
  'composer.editor.characterCountUnknown': 'Limite de caracteres indisponível para esta conta',
  'composer.editor.remaining':
    '{count, plural, one {# caractere restante} other {# caracteres restantes} many {# caracteres restantes}}',
  'composer.editor.hashtagCount':
    '{count, plural, one {# hashtag} other {# hashtags} many {# hashtags}}',
  'composer.editor.formatting': 'Formatação',
  'composer.editor.emoji': 'Emoji',
  'composer.editor.mention': 'Menção',
  'composer.editor.link': 'Link',

  'composer.mentions.search': 'Pesquise pessoas, páginas e empresas',
  'composer.mentions.searching': 'Procurando {provider}',
  'composer.mentions.resolved': 'Marcado {label} em {provider}',
  'composer.mentions.unresolved':
    'Esta menção ainda não foi associada a uma conta {provider}. Ele será publicado como texto simples até você selecionar um resultado.',
  'composer.mentions.noResults': 'Nenhuma conta correspondente em {provider}.',
  'composer.mentions.unsupported': 'A marcação nativa não está disponível para esta conta.',

  'composer.destination.label': 'Destino',
  'composer.destination.placeholder': 'Escolha onde será publicado',
  'composer.destination.community': 'Comunidade',
  'composer.destination.board': 'Conselho',
  'composer.destination.group': 'Grupo',
  'composer.destination.page': 'Página',
  'composer.destination.organization': 'Organização',
  'composer.destination.channel': 'Canal',
  'composer.destination.refresh': 'Atualizar destinos',
  'composer.destination.lastRefreshed': 'Destinos atualizados {relativeTime}',

  'composer.media.title': 'Mídia',
  'composer.media.count': '{count, plural, one {# arquivo} other {# arquivos} many {# arquivos}}',
  'composer.media.dropHint': 'Arraste arquivos aqui ou navegue em sua biblioteca.',
  'composer.media.inheritFromMaster': 'Usando a mídia master',
  'composer.media.overridden': 'Este alvo usa sua própria mídia',
  'composer.media.altText.label': 'Texto alternativo',
  'composer.media.altText.placeholder':
    'Descreva a imagem para pessoas que usam um leitor de tela.',
  'composer.media.altText.missing': 'O texto alternativo está faltando.',
  'composer.media.altText.waive': 'Esta imagem não precisa de texto alternativo',
  'composer.media.altText.generate': 'Escrever texto alternativo',
  'composer.media.crop': 'Cortar',
  'composer.media.resize': 'Redimensionar',
  'composer.media.rotate': 'Girar',
  'composer.media.compress': 'Comprimir',
  'composer.media.convertFormat': 'Converter formato',
  'composer.media.thumbnail': 'Miniatura',
  'composer.media.aspectPreset': 'Plataforma predefinida',
  'composer.media.original': 'Original',
  'composer.media.originalPreserved':
    'O arquivo original é mantido. As edições criam uma nova versão.',
  'composer.media.uploading': 'Enviando {name}',
  'composer.media.processing': 'Preparando {name}',
  'composer.media.rights.label': 'Direitos e consentimento',
  'composer.media.rights.confirm':
    'Eu tenho o direito de publicar esta mídia, incluindo quaisquer pessoas, músicas, logotipos e marcas nela contidas.',

  'composer.sequence.title': 'Comentários e tópico',
  'composer.sequence.root': 'Postagem principal',
  'composer.sequence.item': 'Item {position}',
  'composer.sequence.add': 'Adicionar comentário ou item do tópico',
  'composer.sequence.delayLabel': 'Atraso após o item anterior',
  'composer.sequence.delayImmediate': 'Imediatamente',
  'composer.sequence.delayMinutes':
    '{count, plural, one {# minuto} other {# minutos} many {# minutos}}',
  'composer.sequence.delayCustom': 'Atraso personalizado',
  'composer.sequence.accountLabel': 'Publicar este item como',
  'composer.sequence.unsupported': 'Esta conta não suporta itens de acompanhamento agendados.',

  'composer.repeat.title': 'Repita',
  'composer.repeat.off': 'Não repita',
  'composer.repeat.everyDays':
    '{count, plural, one {Todos os dias} other {Todos os # dias} many {Todos os # dias}}',
  'composer.repeat.endLabel': 'Pare de repetir',
  'composer.repeat.endOnDate': 'Em um encontro',
  'composer.repeat.endAfterCount': 'Depois de uma série de publicações',
  'composer.repeat.endRequired': 'Escolha uma data de término ou um número de repetições.',
  'composer.repeat.summary':
    'Repete {cadence} até {end}. Cada ocorrência recebe sua própria aprovação e recebimento.',

  'composer.links.title': 'Links',
  'composer.links.keepOriginal': 'Mantenha o URL original',
  'composer.links.track': 'Substitua por um link curto rastreado',
  'composer.links.utm': 'Parâmetros UTM',
  'composer.links.domain': 'Link domínio',
  'composer.links.finalUrl': 'Isso será publicado como {url}',
  'composer.links.frozenAtApproval':
    'O URL curto exato e o destino são congelados na versão aprovada.',

  'composer.signature.title': 'Assinatura',
  'composer.signature.none': 'Sem assinatura',
  'composer.signature.autoApplied':
    'Assinatura {name} foi adicionada automaticamente. Você pode alterá-lo.',

  'composer.set.title': 'Conjuntos',
  'composer.set.startFrom': 'Começar de um conjunto',
  'composer.set.continueWithout': 'Continuar sem definir',
  'composer.set.applied': 'Conjunto aplicado {name}. Este rascunho agora é independente do Set.',

  'composer.validation.title': 'Validação',
  'composer.validation.clean': 'Nenhum problema encontrado para os alvos selecionados.',
  'composer.validation.issueCount':
    '{count, plural, one {# problema} other {# problemas} many {# problemas}} em {targets, plural, one {# alvo} other {# alvos} many {# alvos}}',
  'composer.validation.blocking': 'Isso deve ser corrigido antes do agendamento.',
  'composer.validation.warning': 'Verifique isso antes de publicar.',
  'composer.validation.revalidated':
    'Verificado novamente em relação aos limites atuais da plataforma {relativeTime}.',

  'composer.preview.title': 'Visualização',
  'composer.preview.forAccount': 'Prévia para {account} em {provider}',
  'composer.preview.approximate':
    'Esta visualização usa as regras da plataforma que gravamos. A publicação publicada pode ser diferente se a plataforma mudar.',
  'composer.preview.unavailable':
    'Uma visualização verdadeira ainda não está disponível para esta conta.',

  'composer.cost.title': 'Custo estimado do fornecedor',
  'composer.cost.estimate': '{provider} estima {amount} de uso da API para esta publicação.',
  'composer.cost.linkSurcharge':
    '{provider} cobra mais por publicações que contenham um URL. A remoção do link diminui a estimativa.',
  'composer.cost.bulkWarning':
    '{count, plural, one {# publicação} other {# publicações} many {# publicações}} em uma ação. Revise a estimativa antes de continuar.',
  'composer.cost.reconciled': 'O uso real é reconciliado após a publicação.',
  'composer.cost.none': 'Nenhum custo de provedor medido para esta publicação.',

  'composer.autosave.saving': 'Salvando',
  'composer.autosave.saved': 'Salvo {relativeTime}',
  'composer.autosave.offline':
    'Off-line. Seu rascunho é mantido neste dispositivo e será sincronizado.',
  'composer.autosave.conflict':
    '{name} editou este rascunho enquanto você estava escrevendo. Revise ambas as versões antes de salvar.',
  'composer.autosave.failed':
    'Não foi possível salvar. Seu texto ainda está aqui. Tentando novamente.',

  'composer.ai.title': 'Assistência',
  'composer.ai.makeConcise': 'Faça mais conciso',
  'composer.ai.adaptForPlatform': 'Adaptar para {provider}',
  'composer.ai.transcreate': 'Transcriar para {language}',
  'composer.ai.checkClaims': 'Verifique as reivindicações',
  'composer.ai.writeAltText': 'Escrever texto alternativo',
  'composer.ai.suggestHooks': 'Sugerir ganchos',
  'composer.ai.suggestCta': 'Sugira uma frase de chamariz',
  'composer.ai.diffTitle': 'Alteração proposta',
  'composer.ai.diffHelp': 'Nada muda até que você aceite.',
  'composer.ai.working': 'Trabalhando nisso',
  'composer.ai.sources':
    'Baseado em {count, plural, one {# fonte} other {# fontes} many {# fontes}} você aprovou',
  'composer.ai.uncertain':
    'Esta frase não tem equivalente limpo em {language}. Revise-o com um falante nativo antes de publicar.',

  'composer.schedule.title': 'Programação',
  'composer.schedule.dateLabel': 'Data',
  'composer.schedule.timeLabel': 'Tempo',
  'composer.schedule.timeZoneLabel': 'Fuso horário',
  'composer.schedule.nextFreeSlot': 'Próxima vaga grátis',
  'composer.schedule.localAndUtc': '{local} em {timeZone}. {utc}UTC.',
  'composer.schedule.dstWarning':
    'Os relógios mudam em {timeZone} nesta data. Esta publicação é executada em {local}, que é {utc} UTC.',
  'composer.schedule.pastWarning': 'Esse tempo já passou. Escolha um horário posterior.',
  'composer.schedule.confirmTitle': 'Confirme antes de agendar',
  'composer.schedule.confirmPublishNow': 'Confirme antes de publicar agora',
  'composer.schedule.approverLabel': 'Aprovador',
  'composer.schedule.policyLabel': 'Política de aprovação',
  'composer.schedule.duplicateWarning':
    'Conteúdo semelhante foi publicado em {account} {relativeTime}. Publicá-lo novamente pode violar as regras da plataforma sobre conteúdo duplicado.',
  'composer.schedule.cadenceWarning':
    '{account} já tem {count, plural, one {# publicação} other {# publicações} many {# publicações}} agendados para aquele dia.',
} as const;
