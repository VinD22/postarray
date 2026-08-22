export const mediaMessages = {
  // ==================================================== o editor ====
  'mediaLib.derivative.heading': 'Editar esta imagem',
  'mediaLib.derivative.description':
    'Recorte, gire, redimensione, mude o formato ou comprima. Toda mudança age sobre os pixels que já estão no seu arquivo. Nada é adicionado que não estava lá.',
  'mediaLib.derivative.originalKept':
    'O original nunca é substituído. Cada edição é salva como uma versão separada que você pode escolher ao compor.',
  'mediaLib.derivative.apply': 'Salvar esta versão',
  'mediaLib.derivative.applying': 'Salvando esta versão',
  'mediaLib.derivative.discard': 'Descartar mudanças',
  'mediaLib.derivative.noChanges': 'Nada para salvar ainda. Mude um valor acima.',

  'mediaLib.derivative.tab.crop': 'Recortar',
  'mediaLib.derivative.tab.transform': 'Girar e redimensionar',
  'mediaLib.derivative.tab.output': 'Formato',

  'mediaLib.derivative.cropHint':
    'Digite os números, ou use as setas do teclado em qualquer campo. Nenhuma etapa aqui precisa de mouse.',
  'mediaLib.derivative.cropX': 'Borda esquerda, em pixels',
  'mediaLib.derivative.cropY': 'Borda superior, em pixels',
  'mediaLib.derivative.cropWidth': 'Largura do recorte, em pixels',
  'mediaLib.derivative.cropHeight': 'Altura do recorte, em pixels',
  'mediaLib.derivative.rotate': 'Girar',
  'mediaLib.derivative.rotateNone': 'Sem rotação',
  'mediaLib.derivative.rotateDegrees': '{degrees} graus no sentido horário',
  'mediaLib.derivative.resizeWidth': 'Nova largura, em pixels',
  'mediaLib.derivative.resizeHeight': 'Nova altura, em pixels',
  'mediaLib.derivative.lockRatio': 'Manter a proporção quando eu mudar um lado',
  'mediaLib.derivative.format': 'Salvar como',
  'mediaLib.derivative.formatSame': 'Manter o formato atual',
  'mediaLib.derivative.quality': 'Qualidade',
  'mediaLib.derivative.qualityHint':
    'Qualidade menor gera um arquivo menor. Aplica-se a JPEG e WebP. PNG é sem perdas e ignora isso.',
  'mediaLib.derivative.projected': 'Esta versão vai ter {width} por {height} pixels.',
  'mediaLib.derivative.projectedUnavailable':
    'O tamanho desta versão fica indisponível até que ela seja gerada.',

  // ==================================================== a lista de versões ====
  'mediaLib.derivative.listHeading': 'Versões',
  'mediaLib.derivative.original': 'Original',
  'mediaLib.derivative.originalHint': 'Sempre mantido. Nunca sobrescrito.',
  'mediaLib.derivative.item': '{width} por {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Ainda não há versões editadas. O original é o único arquivo aqui.',
  'mediaLib.derivative.select': 'Usar esta versão',
  'mediaLib.derivative.selected': 'Em uso neste post',
  'mediaLib.derivative.useOriginal': 'Usar o original',
  'mediaLib.derivative.processing':
    'Esta versão está sendo gerada. Ela aparece aqui quando estiver pronta.',
  'mediaLib.derivative.alreadyExists':
    'Você já fez exatamente essa edição antes, então reaproveitamos aquela versão em vez de criar uma segunda.',
  'mediaLib.derivative.failedTitle': 'Esta versão não pôde ser gerada',
  'mediaLib.derivative.failedBody':
    'Nada foi salvo e seu original está intacto. Mude os valores e tente de novo.',
  'mediaLib.derivative.openEditor': 'Editar {name}',

  'mediaLib.derivative.unsupportedTitle': 'A edição funciona apenas com imagens',
  'mediaLib.derivative.unsupportedBody':
    'Vídeo, áudio e documentos não podem ser editados aqui. Prepare o arquivo antes de fazer o upload. Seu upload original também não é alterado de qualquer forma.',

  'mediaLib.derivative.nonGenerative':
    'A ferramenta não gera imagens nem vídeos. Este editor apenas recorta, gira, redimensiona, converte e comprime o que você enviou.',

  // ==================================================== recusas ====
  'error.media_derivative_no_operations.message':
    'Escolha ao menos uma mudança antes de salvar uma versão.',
  'error.media_derivative_duplicate_operation.message':
    'Cada tipo de mudança pode aparecer uma vez. Remova o segundo {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Esse recorte ultrapassa a borda da imagem, que tem {sourceWidth} por {sourceHeight} pixels. Mova-o ou diminua-o.',
  'error.media_derivative_upscale_rejected.message':
    'Este editor nunca amplia uma imagem, porque os pixels extras seriam inventados em vez de seus. O maior que esta versão pode ficar é {availableWidth} por {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'A edição funciona com imagens JPEG, PNG, WebP e GIF. Este arquivo é {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Ainda não sabemos o tamanho desta imagem, então não podemos verificar a mudança contra ele. Tente de novo quando o processamento terminar.',
  'error.media_derivative_format_required.message':
    'Escolha um formato para salvar. Um arquivo {sourceMimeType} não pode ser salvo de volta como ele mesmo aqui.',
  'error.media_derivative_quality_unsupported.message':
    'PNG é sem perdas, então uma configuração de qualidade não faria nada. Remova-a, ou salve como JPEG ou WebP.',
  'error.media_derivative_no_change.message': 'Esse já é o formato que este arquivo usa.',
  'error.media_derivative_source_unavailable.message':
    'O arquivo do qual esta versão viria não está mais no armazenamento.',
  'error.media_derivative_preset_mismatch.message':
    'Esta solicitação de edição não corresponde às mudanças que descreve. Nada foi gerado. Tente de novo a partir do editor.',
  'error.media_derivative_empty_result.message':
    'A edição não produziu nenhuma imagem, então nada foi salvo. Seu original está intacto.',
  'error.media_derivative_transform_failed.message':
    'Esta imagem não pôde ser lida nem escrita. Nada foi salvo e seu original está intacto.',
  'error.media_derivative_write_failed.message':
    'Esta versão não pôde ser registrada. Nada foi salvo e seu original está intacto.',
} as const;
