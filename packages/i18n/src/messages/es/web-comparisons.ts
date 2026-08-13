export const webComparisonMessages = {
  'web.comparison.eyebrow': 'Comparación',

  'web.comparison.state.yes': 'Sí',
  'web.comparison.state.no': 'No',
  'web.comparison.state.partial': 'En parte',
  'web.comparison.state.notVerified': 'No verificado',

  'web.comparison.label.claim': 'Afirmación',
  'web.comparison.label.sourceRead': 'Leído el {date}',
  'web.comparison.label.checked': 'Cada fila verificada el {date}',
  'web.comparison.label.nextReview': 'Próxima verificación el {date}',
  'web.comparison.label.backToIndex': 'Todas las comparaciones',

  'web.comparison.table.title': 'Qué hace cada opción',
  'web.comparison.table.caption': 'Una afirmación por fila, con la fuente detrás de cada respuesta',

  'web.comparison.bestFor.title': 'Cuál se ajusta',
  'web.comparison.bestFor.ours': 'Elige este producto cuando',
  'web.comparison.bestFor.alternative': 'Elige {name} cuando',

  'web.comparison.notDo.title': 'Lo que este producto no hace',
  'web.comparison.notDo.body':
    'Estas frases se leen del código que las decide, no se escriben a mano, así que esta sección no puede alejarse de lo que el producto realmente es hoy.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {Ningún conector completó la verificación del proveedor, así que no se publica nada en ninguna plataforma a través de este producto hoy.} one {# conector completó la verificación del proveedor. Toda otra plataforma del grupo sigue siendo intención.} many {# conectores completaron la verificación del proveedor. Toda otra plataforma del grupo sigue siendo intención.} other {# conectores completaron la verificación del proveedor. Toda otra plataforma del grupo sigue siendo intención.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {Ningún idioma completó la revisión humana, así que todo idioma en la interfaz está etiquetado como beta.} one {# idioma completó la revisión humana. Todo otro idioma está etiquetado como beta.} many {# idiomas completaron la revisión humana. Todo otro idioma está etiquetado como beta.} other {# idiomas completaron la revisión humana. Todo otro idioma está etiquetado como beta.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Todo plan de precio ya fue decidido y tiene un precio real.} one {# plan de precio todavía es un valor provisional sin decidir y no se puede comprar.} many {# planes de precio todavía son valores provisionales sin decidir y no se pueden comprar.} other {# planes de precio todavía son valores provisionales sin decidir y no se pueden comprar.}}',

  'web.comparison.notVerified.title': 'Qué significa "no verificado"',
  'web.comparison.notVerified.body':
    'Una celda dice no verificado cuando el hecho no se pudo leer en la documentación pública oficial de la otra opción el día de la verificación. Nunca se completa de memoria, ni se copia de un resumen escrito por otra persona.',

  'web.comparison.method.title': 'Cómo se hace esta página',
  'web.comparison.method.body':
    'Cada fila es una afirmación, con el documento del que vino y la fecha en que una persona lo leyó. No hay capturas de pantalla de la competencia, texto de funciones copiado ni debilidades inventadas.',
  'web.comparison.method.cadence':
    'Cada comparación se vuelve a verificar al menos cada 90 días, e inmediatamente cuando una plataforma u opción cambia algo que afirma una fila.',

  'web.comparison.questions.title': 'Preguntas',
  'web.comparison.sources.title': 'Fuentes citadas en esta página',

  'web.comparison.index.title': 'Comparaciones publicadas',
  'web.comparison.index.body':
    'Cada página compara este producto con una categoría de alternativa cuyos hechos se puedan leer en documentación oficial. Un producto nombrado consigue una página cuando sus hechos actuales se pueden leer en sus propias páginas públicas, y no antes.',
  'web.comparison.index.checked': 'Verificado el {date}',
} as const;
