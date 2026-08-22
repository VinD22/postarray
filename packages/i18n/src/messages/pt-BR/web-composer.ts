/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
  'composerWeb.pane.targets': 'Contas e conjuntos de destino',
  'composerWeb.pane.master': 'Rascunho mestre e configurações compartilhadas',
  'composerWeb.pane.variant': 'Versão para o alvo aberto',
  'composerWeb.pane.review': 'Pré-visualização, validação, custo e aprovação',
  'composerWeb.pane.showPreview': 'Mostrar visualização',
  'composerWeb.pane.hidePreview': 'Ocultar visualização',
  'composerWeb.pane.previewCollapsed':
    'O painel de visualização está oculto. Abra para conferir a publicação final.',

  'composerWeb.step.targets': 'Alvos',
  'composerWeb.step.write': 'Escreva',
  'composerWeb.step.perTarget': 'Por alvo',
  'composerWeb.step.review': 'Revisão',
  'composerWeb.step.progress': 'Etapa {current} de {total}',
  'composerWeb.step.legend': 'Composer passos',

  'composerWeb.summary.label': 'Projeto de resumo',
  'composerWeb.summary.targets':
    '{count, plural, =0 {Sem alvos} one {# alvo} other {# alvos} many {# alvos}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {Sem problemas} one {# problema} other {# problemas} many {# problemas}}',
  'composerWeb.summary.notScheduled': 'Sem horário escolhido',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Custo ainda sem preço',
  'composerWeb.summary.openReview': 'Abrir revisão',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Rascunho mestre',
  'composerWeb.rail.masterHint': 'Edite aqui para alcançar todos os alvos que ainda herdam.',
  'composerWeb.rail.accountsHeading': 'Contas alvo',
  'composerWeb.rail.setsHeading': 'Conjuntos e grupos',
  'composerWeb.rail.setsHelp':
    'Um conjunto é um grupo salvo de contas e padrões. A aplicação copia seus valores neste rascunho. Edições posteriores no Conjunto não alteram este rascunho.',
  'composerWeb.rail.openTarget': 'Abra a versão para {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Limite desconhecido',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {sem mídia} one {# arquivo de mídia} other {# arquivos de mídia} many {# arquivos de mídia}}',
  'composerWeb.rail.paused': 'Pausado. Ele não será publicado até que você o retome.',
  'composerWeb.rail.state.notBuilt': 'Ainda não construído',
  'composerWeb.rail.state.unsupported': 'Provedor não suporta',
  'composerWeb.rail.empty': 'Nenhuma conta selecionada ainda.',
  'composerWeb.rail.emptyHelp':
    'Escolha as contas que esta publicação deve alcançar. Você pode adicionar mais posteriormente.',
  'composerWeb.rail.divergenceHint':
    'Abra um alvo para ver sua própria versão. O rascunho mestre permanece inalterado.',
  'composerWeb.rail.searchLabel': 'Filtrar contas',
  'composerWeb.rail.removeTarget': 'Remover {account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Edição global',
  'composerWeb.globalEdit.title': 'Aplique esta alteração a todos os alvos selecionados',
  'composerWeb.globalEdit.description':
    'O rascunho mestre sempre muda. Os destinos que ainda herdam este campo o seguem. Alvos com versão própria mantêm.',
  'composerWeb.globalEdit.fieldLabel': 'Campo',
  'composerWeb.globalEdit.compatibleHeading': 'Esses alvos aceitam a mudança',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Esses alvos mantêm sua própria versão',
  'composerWeb.globalEdit.incompatibleHeading': 'Esses alvos não podem aceitar a mudança',
  'composerWeb.globalEdit.incompatibleHelp':
    'Nada é descartado sem avisar você. Cada conta abaixo recebe uma versão explícita com a alteração adaptada, e você pode editá-la posteriormente.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} permite {limit} caracteres. Este texto é {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} não aceita link neste campo. O link permanece no rascunho mestre e nos alvos que o permitem.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} aceita {limit, plural, one {# arquivo} other {# arquivos} many {# arquivos}}. Este rascunho tem {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported': '{account} não aceita arquivos {mimeType}.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} não suporta itens de acompanhamento, portanto a sequência permanece no rascunho mestre.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} publica texto simples. As marcas de formatação apareceriam como caracteres.',
  'composerWeb.globalEdit.adaptedPreview': 'O que {account} obtém em vez disso',
  'composerWeb.globalEdit.confirm': 'Aplicar e criar as versões',
  'composerWeb.globalEdit.nothingToApply': 'Nada muda. O rascunho mestre já possui este valor.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Alteração aplicada a # alvo} other {Alteração aplicada a # alvos} many {Alteração aplicada a # alvos}}. {adapted, plural, =0 {Nenhum alvo precisava de uma versão adaptada} one {# o alvo obteve uma versão adaptada} other {# os alvos obtiveram versões adaptadas} many {# os alvos obtiveram versões adaptadas}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'Este alvo tem sua própria versão',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# o campo difere do rascunho mestre} other {# os campos diferem do rascunho mestre} many {# os campos diferem do rascunho mestre}}',
  'composerWeb.override.field.body': 'Postar texto',
  'composerWeb.override.field.contentKind': 'Tipo de publicação',
  'composerWeb.override.field.locale': 'Idioma do conteúdo',
  'composerWeb.override.field.mediaIds': 'Mídia',
  'composerWeb.override.field.links': 'Links',
  'composerWeb.override.field.signature': 'Assinatura',
  'composerWeb.override.field.threadItems': 'Comentários e tópico',
  'composerWeb.override.field.schedule': 'Agendar',
  'composerWeb.override.resetField': 'Redefinir {field} para mestre',
  'composerWeb.override.resetFieldTitle': 'Redefinir {field} para {account}?',
  'composerWeb.override.resetFieldBody':
    'A versão de {field} escrita para {account} é descartada e o rascunho mestre é usado novamente. Nenhuma outra alteração de destino.',
  'composerWeb.override.resetAll': 'Redefinir todos os campos para master',
  'composerWeb.override.inheritNotice':
    'Este alvo segue o rascunho mestre. Editar qualquer coisa aqui cria uma versão que apenas {account} recebe.',
  'composerWeb.override.created': '{account} agora tem seu próprio {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Limites para {account}',
  'composerWeb.limits.text': 'Texto com até {limit} caracteres',
  'composerWeb.limits.linkCost':
    'Um link conta como {count, plural, one {# caractere} other {# caracteres} many {# caracteres}} qualquer que seja seu comprimento.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Sem imagens} one {# imagem} other {até # imagens} many {até # imagens}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {Sem vídeo} one {# vídeo} other {até # vídeos} many {até # vídeos}}',
  'composerWeb.limits.duration': 'Vídeo até {duration}',
  'composerWeb.limits.aspect': 'Proporção entre {min} e {max}',
  'composerWeb.limits.fileSize': 'Arquivos até {size}',
  'composerWeb.limits.mimeTypes': 'Tipos de arquivo aceitos: {types}',
  'composerWeb.limits.source': 'Do instantâneo de capacidade {version}, leia {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'É necessária uma miniatura.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider} configurações',
  'composerWeb.native.privacy': 'Quem pode ver isso',
  'composerWeb.native.privacyChoose': 'Escolha um público',
  'composerWeb.native.privacyExplicit':
    '{provider} não permite um público pré-selecionado. Escolha um antes que isso possa ser agendado.',
  'composerWeb.native.community': 'Comunidade',
  'composerWeb.native.board': 'Quadro',
  'composerWeb.native.group': 'Grupo ou Página',
  'composerWeb.native.organization': 'Organização',
  'composerWeb.native.channel': 'Canal',
  'composerWeb.native.publication': 'Publicação',
  'composerWeb.native.disclosureHeading': 'Divulgação',
  'composerWeb.native.disclosureCommercial': 'Esta publicação promove um produto ou serviço',
  'composerWeb.native.disclosureBranded': 'Esta publicação é conteúdo de marca para outra empresa',
  'composerWeb.native.disclosureAi': 'Parte deste conteúdo foi feita com uma ferramenta de IA',
  'composerWeb.native.disclosureUnsupported':
    '{provider} não oferece esta divulgação por meio de sua API. Em vez disso, adicione-o ao texto.',
  'composerWeb.native.none': 'Nenhuma configuração {provider} se aplica a este tipo de publicação.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Resolvido em {provider}',
  'composerWeb.entity.resolvedId': 'ID da conta {externalId}',
  'composerWeb.entity.plainTextWarning':
    'Não corresponde. Ele será publicado como texto simples, que não é uma tag nativa em {provider}.',
  'composerWeb.entity.removeMention': 'Remova a menção de {label}',
  'composerWeb.entity.addMention': 'Adicionar uma menção',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Nenhuma menção} one {# menção} other {# menções} many {# menções}}, {resolved} corresponde a uma conta real',
  'composerWeb.entity.lookupUnsupported':
    '{provider} não oferece pesquisa de entidade para este tipo de conta.',
  'composerWeb.entity.lookupNotBuilt':
    'Relay ainda não criou a pesquisa de entidade para {provider}. Enquanto isso, nada é adivinhado.',
  'composerWeb.entity.searchHint': 'Digite pelo menos dois caracteres e escolha um resultado.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {Sem correspondências} one {# correspondência} other {# correspondências} many {# correspondências}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Links',
  'composerWeb.links.detected':
    '{count, plural, one {# link encontrado neste rascunho} other {# links encontrados neste rascunho} many {# links encontrados neste rascunho}}',
  'composerWeb.links.noneDetected': 'Nenhum link neste rascunho ainda.',
  'composerWeb.links.modeLabel': 'Como este link publica',
  'composerWeb.links.original': 'URL original',
  'composerWeb.links.utmSource': 'Fonte',
  'composerWeb.links.utmMedium': 'Médio',
  'composerWeb.links.utmCampaign': 'Campanha',
  'composerWeb.links.utmTerm': 'Termo',
  'composerWeb.links.utmContent': 'Conteúdo',
  'composerWeb.links.domainVerified': '{domain}, verificado para este espaço de trabalho',
  'composerWeb.links.domainDefault': 'Relay domínio padrão',
  'composerWeb.links.domainNone': 'Nenhum domínio de marca foi verificado ainda.',
  'composerWeb.links.notAllowedHere': '{account} não permite um link aqui.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Comente',
  'composerWeb.sequence.kindThread': 'Parte da rosca',
  'composerWeb.sequence.kindLabel': 'Tipo de item',
  'composerWeb.sequence.moveUp': 'Mover este item mais cedo',
  'composerWeb.sequence.moveDown': 'Mover este item mais tarde',
  'composerWeb.sequence.remove': 'Remover este item',
  'composerWeb.sequence.absoluteTime': 'Executa em {time}, que é {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'Se um item falhar, a publicação já publicada permanece publicada e os itens posteriores não são executados. Você recebe um item de ação.',
  'composerWeb.sequence.maxReached':
    '{account} aceita {limit, plural, one {# item de acompanhamento} other {# itens de acompanhamento} many {# itens de acompanhamento}}.',
  'composerWeb.sequence.minDelay': 'O menor atraso {provider} permitido aqui é {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Mesma conta do publicação',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Sem problemas} one {# problema} other {# problemas} many {# problemas}} neste item',
  'composerWeb.sequence.customMinutes': 'Minutos após o item anterior',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Repita esta publicação',
  'composerWeb.repeat.cadenceLabel': 'Com que frequência',
  'composerWeb.repeat.maximum':
    'Uma publicação repetida pode ser executada no máximo {limit} vezes.',
  'composerWeb.repeat.occurrenceLabel': 'Número de publicações',
  'composerWeb.repeat.duplicateCheck':
    'Cada ocorrência é verificada quanto a conteúdo duplicado antes de ser publicada. Uma ocorrência que falha na verificação torna-se um item de ação em vez de publicação.',
  'composerWeb.repeat.occurrenceList': 'Primeiras ocorrências',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {e # mais ocorrências} other {e # mais ocorrências} many {e # mais ocorrências}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Conjuntos e assinatura',
  'composerWeb.set.pickerTitle': 'Começar de um conjunto',
  'composerWeb.set.pickerDescription':
    'Um conjunto preenche alvos, texto e configurações. O rascunho criado é independente, portanto, editar o Conjunto posteriormente nunca altera uma publicação aprovada ou agendada.',
  'composerWeb.set.accountCount': '{count, plural, one {# conta} other {# contas} many {# contas}}',
  'composerWeb.set.apply': 'Use este conjunto',
  'composerWeb.set.none': 'Nenhum conjunto salvo ainda.',
  'composerWeb.signature.pickerLabel': 'Assinatura',
  'composerWeb.signature.scope': 'Para {project} em {provider} em {language}',
  'composerWeb.signature.previewHeading': 'Como termina o publicação',
  'composerWeb.signature.notMatching':
    'Esta assinatura tem como escopo outro projeto, outra plataforma ou outro idioma, portanto não é oferecida aqui.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Ajude com este texto',
  'composerWeb.assist.unavailableTitle': 'A assistência de texto não está configurada',
  'composerWeb.assist.unavailableBody':
    'Nenhum gateway de IA está configurado para este espaço de trabalho, portanto as ações de assistência estão desativadas. Todo o resto no compositor funciona normalmente.',
  'composerWeb.assist.targetLabel': 'Aplica-se a',
  'composerWeb.assist.targetMaster': 'O rascunho mestre',
  'composerWeb.assist.targetVariant': 'A versão para {account}',
  'composerWeb.assist.beforeLabel': 'Texto atual',
  'composerWeb.assist.afterLabel': 'Texto proposto',
  'composerWeb.assist.regionLabel': 'Alteração de texto proposta, ainda não aplicada',
  'composerWeb.assist.added': 'adicionado',
  'composerWeb.assist.removed': 'removido',
  'composerWeb.assist.evidence': 'Evidências e fontes',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Nenhuma fonte encontrada para esta afirmação. Verifique antes de publicar.',
  'composerWeb.assist.failed':
    'A solicitação de assistência não foi concluída. Seu texto permanece inalterado.',
  'composerWeb.assist.noMediaGeneration':
    'Relay não cria imagens ou vídeos. Traga os arquivos finalizados para a biblioteca e publique-os aqui.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'Esta é a versão aprovada. Editá-lo cria uma nova versão e libera a aprovação.',
  'composerWeb.autosave.pinnedAcknowledge': 'Edite e limpe a aprovação',
  'composerWeb.autosave.conflictTitle': 'Duas versões deste rascunho',
  'composerWeb.autosave.conflictKeepMine': 'Mantenha o que escrevi',
  'composerWeb.autosave.conflictKeepTheirs': 'Use a versão de {name}',
  'composerWeb.autosave.conflictHelp':
    'Nada é mesclado automaticamente. Escolha por campo e salve.',
  'composerWeb.autosave.retry': 'Tente salvar novamente',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Composer atalhos',
  'composerWeb.shortcuts.nextTarget': 'Próximo alvo',
  'composerWeb.shortcuts.previousTarget': 'Meta anterior',
  'composerWeb.shortcuts.nextIssue': 'Próxima edição',
  'composerWeb.shortcuts.previousIssue': 'Edição anterior',
  'composerWeb.shortcuts.save': 'Salve rascunho agora',
  'composerWeb.shortcuts.openSchedule': 'Abra a planilha de agendamento',
  'composerWeb.shortcuts.open': 'Mostrar atalhos',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'Revisão',
  'composerWeb.review.contentVersion': 'Versão do conteúdo {checksum}',
  'composerWeb.review.approvalPolicy': 'Política: {policy}',
  'composerWeb.review.approverPending': 'Aguardando uma decisão de {approver}.',
  'composerWeb.review.approverNone': 'Nenhuma aprovação é necessária para essas metas.',
  'composerWeb.review.perTargetHeading': 'O que cada conta recebe',
  'composerWeb.review.finalUrl': 'Link publicado',
  'composerWeb.review.privacyState': 'Público: {value}',
  'composerWeb.review.disclosureState': 'Divulgação: {value}',
  'composerWeb.review.disclosureNone': 'Nenhuma divulgação definida',
  'composerWeb.review.mediaVersion': '{name}, versão {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# o alvo ainda não pode ser programado} other {# os alvos ainda não podem ser programados} many {# os alvos não podem ser programados ainda}}',
  'composerWeb.review.offlineBlocked':
    'O agendamento e a publicação precisam de uma conexão. Seu rascunho está seguro neste dispositivo.',
  'composerWeb.review.publishConfirm':
    'Isso é publicado em {count, plural, one {# conta} other {# contas} many {# contas}} imediatamente. Não pode ser desfeito aqui.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Novo rascunho',
  'composerWeb.page.loading': 'Carregando o draft, suas metas e seus limites',
  'composerWeb.page.errorTitle': 'Este rascunho não pôde ser aberto',
  'composerWeb.page.errorBody':
    'Nada foi perdido. Tente novamente e, se continuar falhando, a referência abaixo ajudará o suporte a encontrar a solicitação.',
  'composerWeb.page.noConnectionsTitle': 'Conecte uma conta antes de compor',
  'composerWeb.page.noConnectionsBody':
    'Um rascunho precisa de pelo menos uma conta conectada, então Relay conhece os limites, a visualização e as configurações a serem exibidas.',
  'composerWeb.page.noConnectionsExample':
    'Exemplo: com X e LinkedIn conectados, um rascunho se torna duas versões nativas com seus próprios contadores.',
  'composerWeb.page.permissionTitle': 'Você não pode criar publicações nesta área de trabalho',
  'composerWeb.page.permissionBody':
    'Composing precisa da função de editor ou superior. Um proprietário ou administrador pode alterar sua função.',
  'composerWeb.page.rateLimitTitle': 'Muitos rascunhos salvos em pouco tempo',
  'composerWeb.page.rateLimitCause':
    'Este espaço de trabalho atingiu seu limite de gravação para a janela atual. Enquanto isso, seu texto é mantido neste dispositivo.',
  'composerWeb.page.rateLimitAlternative':
    'Continue escrevendo. O salvamento é retomado automaticamente quando a janela é reiniciada.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Grade',
  'mediaLib.view.list': 'Lista',
  'mediaLib.view.label': 'Layout',
  'mediaLib.sort.label': 'Classificar',
  'mediaLib.sort.newest': 'Novo primeiro',
  'mediaLib.sort.name': 'Nome',
  'mediaLib.sort.size': 'Maior primeiro',
  'mediaLib.select': 'Selecione {name}',
  'mediaLib.column.file': 'Arquivo',
  'mediaLib.column.type': 'Digite',
  'mediaLib.column.size': 'Tamanho',
  'mediaLib.column.altText': 'Texto alternativo',
  'mediaLib.column.rights': 'Direitos',
  'mediaLib.column.added': 'Adicionado',
  'mediaLib.openDetail': 'Abra {name}',

  'mediaLib.empty.title': 'Nenhuma mídia ainda',
  'mediaLib.empty.body':
    'Carregue as imagens e vídeos que você já possui ou importe um arquivo de uma URL. Relay verifica o tipo e o tamanho em cada conta em que você publica.',
  'mediaLib.empty.example':
    'Exemplo: launch_hero.jpg, 1600 por 900, conjunto de texto alternativo, usado em 2 publicações.',
  'mediaLib.error.title': 'A biblioteca não pôde ser carregada',
  'mediaLib.error.body': 'Seus arquivos estão seguros. Nada foi alterado por esta falha.',
  'mediaLib.loading': 'Carregando sua biblioteca de mídia',
  'mediaLib.permission.title': 'Você não pode ver esta biblioteca de espaço de trabalho',
  'mediaLib.permission.body':
    'A visualização da mídia precisa da função de visualizador ou superior neste projeto. Um proprietário ou administrador pode concedê-la.',

  'mediaLib.upload.heading': 'Adicionar mídia',
  'mediaLib.upload.browse': 'Escolha arquivos',
  'mediaLib.upload.dropHint':
    'Arraste os arquivos aqui ou escolha-os. Os uploads serão retomados se a conexão cair.',
  'mediaLib.upload.queueHeading': 'Carregamentos',
  'mediaLib.upload.progress': '{name}, {percent} de {size} enviado',
  'mediaLib.upload.paused': 'Pausado. {sent} de {size} já está armazenado.',
  'mediaLib.upload.resume': 'Retomar upload',
  'mediaLib.upload.pause': 'Pausar upload',
  'mediaLib.upload.cancel': 'Cancelar este upload',
  'mediaLib.upload.retry': 'Tente fazer upload novamente',
  'mediaLib.upload.finalizing': 'Acabamento {name}',
  'mediaLib.upload.done': '{name} está na sua biblioteca',
  'mediaLib.upload.failed': '{name} não terminou. {reason}',
  'mediaLib.upload.offline':
    'Off-line. Os uploads continuam de onde pararam quando você se reconecta.',
  'mediaLib.upload.rejectedType':
    '{name} é {mimeType}, que nenhuma das contas selecionadas aceita.',
  'mediaLib.upload.rejectedSize': '{name} é {size}. O limite mais baixo em suas contas é {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Aceito por # de suas contas} other {Aceito por # de suas contas} many {Aceito por # de suas contas}}',
  'mediaLib.upload.rejectedBy': 'Não aceito por {accounts}',
  'mediaLib.upload.checkedAgainst': 'Verificado em relação às contas selecionadas neste rascunho.',
  'mediaLib.upload.noTargets':
    'Nenhuma conta está selecionada, então o arquivo é verificado apenas em relação aos padrões do espaço de trabalho.',

  'mediaLib.alt.heading': 'Texto alternativo',
  'mediaLib.alt.help':
    'Descreva o que importa na imagem para alguém que não consegue vê-la. Geralmente, uma ou duas frases são suficientes.',
  'mediaLib.alt.count': '{used} de {limit} caracteres',
  'mediaLib.alt.requiredBy': 'Exigido por {accounts}',
  'mediaLib.alt.waive': 'Esta imagem não contém informações',
  'mediaLib.alt.waiveReason': 'Por que não precisa de descrição',
  'mediaLib.alt.waiveHelp':
    'Use apenas para decoração. Uma imagem dispensada é publicada com uma descrição vazia onde a plataforma permite.',
  'mediaLib.alt.waived': 'Renunciado por {name} em {date}. Motivo: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} não aceita texto alternativo por meio de sua API para esta conta.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# arquivo não tem texto alternativo} other {# arquivos não tem texto alternativo} many {# arquivos não tem texto alternativo}}',

  'mediaLib.rights.heading': 'Direitos e consentimento',
  'mediaLib.rights.declared': 'Declarado por {name} em {date}',
  'mediaLib.rights.undeclared': 'Ainda não declarado. Declare-o antes da publicação deste arquivo.',
  'mediaLib.rights.ownerLabel': 'Quem é o proprietário deste arquivo',
  'mediaLib.rights.ownerSelf': 'Esta área de trabalho',
  'mediaLib.rights.ownerLicensed': 'Licenciado por outra pessoa',
  'mediaLib.rights.ownerUgc': 'Um cliente ou criador deu permissão',
  'mediaLib.rights.licenseLabel': 'Referência de licença ou permissão',
  'mediaLib.rights.peopleLabel': 'Pessoas aparecem neste arquivo',
  'mediaLib.rights.peopleConsent': 'Todos mostrados concordaram em ser publicados',
  'mediaLib.rights.musicLabel': 'Este arquivo contém música ou trilha sonora',
  'mediaLib.rights.confirm':
    'Eu tenho o direito de publicar este arquivo, incluindo quaisquer pessoas, músicas, logotipos e marcas nele contidas.',
  'mediaLib.rights.blocking':
    'Este arquivo não pode ser agendado até que os direitos sejam declarados.',

  'mediaLib.editor.heading': 'Editar imagem',
  'mediaLib.editor.description':
    'Cada edição é salva como uma nova versão. O arquivo original é mantido e pode ser restaurado.',
  'mediaLib.editor.tab.crop': 'Cortar',
  'mediaLib.editor.tab.transform': 'Redimensionar e girar',
  'mediaLib.editor.tab.canvas': 'Tela',
  'mediaLib.editor.tab.output': 'Formato e tamanho',
  'mediaLib.editor.tab.thumbnail': 'Miniatura',
  'mediaLib.editor.presetLabel': 'Predefinição de aspecto',
  'mediaLib.editor.presetFree': 'Grátis',
  'mediaLib.editor.presetFor': '{ratio}, usado por {accounts}',
  'mediaLib.editor.cropX': 'Cortar desde a borda inicial',
  'mediaLib.editor.cropY': 'Cortar do topo',
  'mediaLib.editor.cropWidth': 'Largura do corte',
  'mediaLib.editor.cropHeight': 'Altura de corte',
  'mediaLib.editor.cropKeyboardHint':
    'A caixa de corte é configurada com campos numéricos, por isso funciona totalmente no teclado.',
  'mediaLib.editor.widthLabel': 'Largura em pixels',
  'mediaLib.editor.heightLabel': 'Altura em pixels',
  'mediaLib.editor.lockRatio': 'Mantenha a proporção atual',
  'mediaLib.editor.rotateLabel': 'Rotação',
  'mediaLib.editor.rotateDegrees': '{degrees} graus',
  'mediaLib.editor.flipHorizontal': 'Virar no eixo vertical',
  'mediaLib.editor.flipVertical': 'Virar no eixo horizontal',
  'mediaLib.editor.canvasColor': 'Cor de fundo',
  'mediaLib.editor.canvasFit': 'Como a imagem fica na tela',
  'mediaLib.editor.canvasFitCover': 'Preencha a tela e corte o overflow',
  'mediaLib.editor.canvasFitContain': 'Ajuste a imagem inteira e preencha o resto',
  'mediaLib.editor.formatLabel': 'Formato de saída',
  'mediaLib.editor.qualityLabel': 'Qualidade de compressão',
  'mediaLib.editor.qualityValue': '{value} de 100',
  'mediaLib.editor.estimatedSize': 'Saída estimada {size}, de {original}',
  'mediaLib.editor.estimatedSizeUnknown':
    'O tamanho da saída só é conhecido quando o arquivo é processado.',
  'mediaLib.editor.thumbnailHelp':
    'Escolha o quadro ou arquivo usado como miniatura do vídeo onde a plataforma aceita.',
  'mediaLib.editor.thumbnailFrame': 'Quadro em {time}',
  'mediaLib.editor.save': 'Salvar como uma nova versão',
  'mediaLib.editor.saving': 'Salvando versão {version}',
  'mediaLib.editor.saved': 'Versão {version} salva. O original ainda está aqui.',
  'mediaLib.editor.discard': 'Descarte essas edições',
  'mediaLib.editor.noChanges': 'Nenhuma alteração para salvar ainda.',
  'mediaLib.editor.revalidate':
    'Saving verifica novamente este arquivo em todas as contas nos rascunhos que o utilizam.',
  'mediaLib.editor.noGeneration':
    'Este editor altera o arquivo que você carregou. Não cria novas imagens.',

  'mediaLib.versions.heading': 'Versões',
  'mediaLib.versions.original': 'Carregamento original',
  'mediaLib.versions.current': 'Versão atual',
  'mediaLib.versions.restore': 'Restaurar versão {version}',
  'mediaLib.versions.item': 'Versão {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'De onde veio este arquivo',
  'mediaLib.provenance.sourceUrl': 'URL de origem',
  'mediaLib.provenance.fetchedAt': 'Buscado {date}',
  'mediaLib.provenance.declaredAuthor': 'Autor declarado',
  'mediaLib.provenance.declaredLicense': 'Licença declarada',
  'mediaLib.provenance.contentCredentials': 'Credenciais de conteúdo incorporado',
  'mediaLib.provenance.contentCredentialsNone':
    'Este arquivo não contém credenciais de conteúdo incorporadas. Isso é comum e não significa que algo esteja errado.',
  'mediaLib.provenance.unverified':
    'Esses detalhes vêm da fonte, não de Relay. Verifique-os antes de confiar neles.',

  'mediaLib.picker.title': 'Escolha mídia',
  'mediaLib.picker.description':
    'Os arquivos são verificados em relação às contas selecionadas neste rascunho.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Escolher arquivos} one {Adicionar # arquivo} other {Adicionar # arquivos} many {Adicionar # arquivos}}',
  'mediaLib.picker.forMaster': 'Adicionando ao rascunho mestre',
  'mediaLib.picker.forVariant': 'Adicionando à versão apenas para {account}',
  'composerWeb.commitFailed.draft': 'Este rascunho não foi salvo.',
  'composerWeb.commitFailed.approval': 'A solicitação de aprovação não foi enviada.',
  'composerWeb.commitFailed.schedule': 'Esta publicação não foi agendada.',
  'composerWeb.commitFailed.publish': 'A publicação não foi concluída.',
  'mediaLib.offline.title': 'A biblioteca fica indisponível sem conexão',
  'mediaLib.offline.body':
    'Não conseguimos atualizar a biblioteca sem conexão. Os arquivos que já estão nesta tela não mudam. Reconecte e tente novamente.',
  'mediaLib.rateLimited.title': 'A biblioteca precisa de uma pausa curta',
  'mediaLib.rateLimited.cause':
    'A API pediu que reduzíssemos o ritmo enquanto carregávamos seus arquivos. Sua mídia armazenada está segura.',
  'mediaLib.rateLimited.resetLabel': 'Tente novamente após',
  'mediaLib.rateLimited.alternative':
    'Você pode continuar rascunhando localmente, mas os envios e as alterações na biblioteca esperam até o limite ser reiniciado.',
  'mediaLib.import.urlLabel': 'URL pública do arquivo',
  'mediaLib.import.urlPlaceholder': 'https://cdn.example.com/launch-video.mp4',
  'mediaLib.import.importing': 'Importando mídia',
  'mediaLib.import.succeeded': 'O arquivo está na sua biblioteca',
  'mediaLib.import.scanPending':
    'O Relay registrou a origem dele. A publicação espera até a verificação de segurança terminar.',
  'mediaLib.import.failed': 'Não foi possível importar o arquivo',
  'mediaLib.import.failedHelp':
    'Verifique se o link é público e aponta diretamente para um arquivo de mídia compatível, depois tente novamente.',
  'mediaLib.import.readOnly': 'Conecte a API para importar arquivos neste ambiente.',
  'mediaLib.import.offline': 'Reconecte antes de importar um arquivo.',
  'mediaLib.import.issue.invalid': 'Informe uma URL completa.',
  'mediaLib.import.issue.scheme': 'Use um link HTTP ou HTTPS.',
  'mediaLib.import.issue.credentials': 'Use um link sem nome de usuário ou senha.',
  'mediaLib.retention.title':
    'Os arquivos armazenados são mantidos por 30 dias após a criação da publicação',
  'mediaLib.retention.body':
    'Assim que um arquivo é anexado a uma publicação, nós o excluímos permanentemente do armazenamento do Relay 30 dias depois da criação dessa publicação. Arquivos à espera de anexo usam a data de envio como referência de limpeza. O texto da publicação, os recibos de publicação e o histórico de auditoria continuam disponíveis por mais tempo. Uma publicação já publicada em uma plataforma social não é removida quando o arquivo armazenado dela expira.',
  'mediaLib.retention.limits':
    'Imagens, áudio e arquivos PDF podem ter até {imageSize}. Vídeos podem ter até {videoSize}.',
  'mediaLib.retention.expiresLabel': 'Data de exclusão do arquivo',
  'mediaLib.retention.deleted': 'Excluído permanentemente',
  'mediaLib.retention.deletedTitle': 'Este arquivo armazenado foi excluído',
  'mediaLib.retention.deletedBody':
    'O período de armazenamento de 30 dias terminou. O texto da publicação, os recibos de publicação e o histórico de auditoria permanecem.',
  'mediaLib.processing.unavailableTitle': 'Este arquivo não está pronto para publicação',
  'mediaLib.processing.unavailableBody':
    'O processamento ou uma verificação de segurança ainda está pendente, ou não foi aprovado. Envie o arquivo novamente se este estado não mudar.',
  'mediaLib.processing.pendingTitle':
    'A verificação de segurança não está disponível antes do lançamento',
  'mediaLib.processing.pendingBody':
    'O arquivo fica armazenado por 30 dias, mas não pode ser anexado a uma publicação publicada até a verificação de segurança ser ativada.',
  'mediaLib.processing.blockedTitle': 'Este arquivo não pode ser publicado',
  'mediaLib.processing.blockedBody':
    'O arquivo não passou pelo processamento ou por uma verificação de segurança. Envie um arquivo diferente.',
} as const;
