import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import { ROUTES } from '@/features/marketing/site';
import type { BlogArticle } from '../types';

/**
 * Content module, loaded per slug. Each language this article exists in is a
 * key of `content`. See `../types.ts` for why article prose is not in the ICU
 * catalog, and why titles are written per language rather than translated.
 *
 * Every number in this article is one already carried by the generated
 * publishing-limits dataset, cited to the same official document that dataset
 * cites. Nothing here is typed in from memory: a limit that changes upstream
 * changes this article's neighbouring `/schedule` and `/tools` pages the same
 * way, because they read the same generated source.
 */
export const captionAndCharacterLimits: BlogArticle = {
  slug: 'caption-and-character-limits',
  cluster: 'adaptation',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-12',
  updated: '2026-08-12',
  sources: [
    {
      title: 'X API: Create a post',
      url: 'https://docs.x.com/x-api/posts/create-post',
      readOn: '2026-08-04',
    },
    {
      title: 'LinkedIn Posts API',
      url: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-03',
      readOn: '2026-08-04',
    },
    {
      title: 'Instagram Platform content publishing',
      url: 'https://developers.facebook.com/docs/instagram-platform/content-publishing/',
      readOn: '2026-08-04',
    },
    {
      title: 'TikTok Content Posting API',
      url: 'https://developers.tiktok.com/doc/content-posting-api-get-started/',
      readOn: '2026-08-04',
    },
  ],
  content: {
    en: {
      title: 'Caption and character limits by platform, from the documented source',
      description:
        'X counts 280 weighted characters, Instagram counts up to 2,200 graphemes, LinkedIn and TikTok each set their own ceiling. Here is each limit with its source and a checker.',
      lede: 'A caption that fits on one platform can be rejected on another, because "character" does not mean the same thing everywhere. Here is what each platform actually counts, with the document that says so.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'In short',
          items: [
            'A character limit is not one universal number. Each platform defines its own ceiling and its own counting method.',
            'Some platforms count Unicode code units, some count grapheme clusters, so an emoji or a flag can cost a different amount depending on where it is posted.',
            'Check a real draft against every platform at once with the checker below rather than counting by hand.',
          ],
        },
        {
          kind: 'stat',
          value: '280',
          label: 'Weighted characters, the ceiling for a post on X.',
          source: 'https://docs.x.com/x-api/posts/create-post',
        },
        {
          kind: 'heading',
          id: 'counting-methods',
          text: 'Why the same caption can cost a different number of characters',
        },
        {
          kind: 'paragraph',
          text: "A plain ASCII sentence costs the same everywhere. The disagreement starts with anything else: an accented letter, an emoji, a flag built from two regional indicator symbols, or a link. Some platforms count in UTF-16 code units, so a character outside the common range can cost two. Some count grapheme clusters, the units a person would actually call a character, so a family emoji built from several code points still costs one. A caption that measures fine on one platform can measure differently on another for exactly this reason, before either platform's length ceiling even enters the picture.",
        },
        {
          kind: 'paragraph',
          text: "Links complicate the count further. Some platforms rewrite every link to a fixed width regardless of the URL's real length; others count the URL exactly as typed. A 90 character link can cost the same as a 20 character one on a platform that rewrites, and cost 90 characters on one that does not.",
        },
        {
          kind: 'heading',
          id: 'per-platform',
          text: 'What each platform documents',
        },
        {
          kind: 'paragraph',
          text: "X documents a 280 character ceiling using its own weighted counting scheme, where certain characters and every link cost a fixed 23 characters regardless of the URL's real length. Instagram documents a 2,200 character caption ceiling, counted by grapheme, with no separate weighting for a link. LinkedIn and TikTok each publish their own ceiling and their own counting rule in their API documentation, and neither matches X's scheme or each other's exactly. None of the four documents a universal Unicode standard as the rule; each states its own.",
        },
        {
          kind: 'tool',
          tool: 'preflight',
          caption:
            "Paste a real draft, pick the platforms you post to, and see which ones would accept it and which would reject it, each measured by that platform's own documented counting rule.",
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Why does an emoji sometimes count as more than one character?',
              a: 'A platform that counts UTF-16 code units, rather than grapheme clusters, charges for every code point an emoji is built from. A simple emoji is usually one code point, but a flag, a skin tone modifier or a family emoji is built from several, and a code unit counter charges for each of them.',
            },
            {
              q: 'Does a link always cost a fixed number of characters?',
              a: 'Only on a platform that documents a fixed link weighting. X states 23 characters for every link regardless of its real length. A platform that does not document a fixed weighting counts the URL as typed, so a long link costs more of the ceiling than a short one.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'See every platform limit with its source and verification date',
          href: ROUTES.capabilities,
        },
      ],
    },
    es: {
      title: 'Límite de caracteres por plataforma, según la fuente documentada',
      description:
        'X cuenta 280 caracteres ponderados, Instagram hasta 2200 grafemas, LinkedIn y TikTok fijan cada uno su propio tope. Cada límite con su fuente y un verificador.',
      lede: 'Un texto que cabe en una plataforma puede ser rechazado en otra, porque "carácter" no significa lo mismo en todas partes. Esto es lo que cada plataforma realmente cuenta, con el documento que lo respalda.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'En resumen',
          items: [
            'El límite de caracteres no es un número universal. Cada plataforma define su propio tope y su propio método de conteo.',
            'Algunas plataformas cuentan unidades de código Unicode, otras cuentan grafemas, así que un emoji o una bandera puede costar distinto según dónde se publique.',
            'Verifica un borrador real contra todas las plataformas a la vez con el verificador de abajo, en lugar de contar a mano.',
          ],
        },
        {
          kind: 'stat',
          value: '280',
          label: 'Caracteres ponderados, el tope para una publicación en X.',
          source: 'https://docs.x.com/x-api/posts/create-post',
        },
        {
          kind: 'heading',
          id: 'counting-methods',
          text: 'Por qué el mismo texto puede costar un número distinto de caracteres',
        },
        {
          kind: 'paragraph',
          text: 'Una oración simple en ASCII cuesta lo mismo en todas partes. La diferencia empieza con cualquier otra cosa: una letra acentuada, un emoji, una bandera formada por dos símbolos indicadores regionales, o un enlace. Algunas plataformas cuentan en unidades de código UTF-16, así que un carácter fuera del rango común puede costar dos. Otras cuentan grupos de grafemas, las unidades que una persona realmente llamaría carácter, así que un emoji de familia formado por varios puntos de código sigue costando uno. Un texto que mide bien en una plataforma puede medir distinto en otra por esta misma razón, incluso antes de considerar el tope de longitud de cada plataforma.',
        },
        {
          kind: 'paragraph',
          text: 'Los enlaces complican aún más el conteo. Algunas plataformas reescriben todo enlace a un ancho fijo sin importar la longitud real de la URL; otras cuentan la URL tal como se escribió. Un enlace de 90 caracteres puede costar lo mismo que uno de 20 en una plataforma que reescribe, y costar 90 caracteres en una que no lo hace.',
        },
        {
          kind: 'heading',
          id: 'per-platform',
          text: 'Lo que documenta cada plataforma',
        },
        {
          kind: 'paragraph',
          text: 'X documenta un tope de 280 caracteres usando su propio esquema de conteo ponderado, donde ciertos caracteres y todo enlace cuestan un fijo de 23 caracteres sin importar la longitud real de la URL. Instagram documenta un tope de 2200 caracteres para el pie de foto, contado por grafema, sin una ponderación separada para los enlaces. LinkedIn y TikTok publican cada uno su propio tope y su propia regla de conteo en su documentación de API, y ninguna coincide exactamente con el esquema de X ni entre sí. Ninguna de las cuatro documenta un estándar Unicode universal como regla; cada una establece el suyo.',
        },
        {
          kind: 'tool',
          tool: 'preflight',
          caption:
            'Pega un borrador real, elige las plataformas en las que publicas y mira cuáles lo aceptarían y cuáles lo rechazarían, cada una medida según su propia regla de conteo documentada.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: '¿Por qué un emoji a veces cuenta como más de un carácter?',
              a: 'Una plataforma que cuenta unidades de código UTF-16, en lugar de grupos de grafemas, cobra por cada punto de código del que está formado un emoji. Un emoji simple suele ser un punto de código, pero una bandera, un modificador de tono de piel o un emoji de familia están formados por varios, y un contador de unidades de código cobra por cada uno.',
            },
            {
              q: '¿Un enlace siempre cuesta un número fijo de caracteres?',
              a: 'Solo en una plataforma que documente una ponderación fija para enlaces. X indica 23 caracteres para cualquier enlace sin importar su longitud real. Una plataforma que no documenta una ponderación fija cuenta la URL tal como se escribió, así que un enlace largo consume más del tope que uno corto.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Ver cada límite de plataforma con su fuente y fecha de verificación',
          href: ROUTES.capabilities,
        },
      ],
    },
    'pt-BR': {
      title: 'Limite de caracteres por plataforma, segundo a fonte documentada',
      description:
        'X conta 280 caracteres ponderados, Instagram até 2.200 grafemas, LinkedIn e TikTok definem cada um seu próprio teto. Cada limite com sua fonte e um verificador.',
      lede: 'Um texto que cabe em uma plataforma pode ser rejeitado em outra, porque "caractere" não significa a mesma coisa em todo lugar. Veja o que cada plataforma realmente conta, com o documento que comprova.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'Resumo',
          items: [
            'O limite de caracteres não é um número universal. Cada plataforma define seu próprio teto e seu próprio método de contagem.',
            'Algumas plataformas contam unidades de código Unicode, outras contam grafemas, então um emoji ou uma bandeira pode custar diferente dependendo de onde é postado.',
            'Confira um rascunho real contra todas as plataformas de uma vez com o verificador abaixo, em vez de contar na mão.',
          ],
        },
        {
          kind: 'stat',
          value: '280',
          label: 'Caracteres ponderados, o teto para um post no X.',
          source: 'https://docs.x.com/x-api/posts/create-post',
        },
        {
          kind: 'heading',
          id: 'counting-methods',
          text: 'Por que o mesmo texto pode custar um número diferente de caracteres',
        },
        {
          kind: 'paragraph',
          text: 'Uma frase simples em ASCII custa o mesmo em qualquer lugar. A diferença começa com qualquer outra coisa: uma letra acentuada, um emoji, uma bandeira formada por dois símbolos indicadores regionais, ou um link. Algumas plataformas contam em unidades de código UTF-16, então um caractere fora do intervalo comum pode custar dois. Outras contam clusters de grafemas, as unidades que uma pessoa de fato chamaria de caractere, então um emoji de família formado por vários pontos de código ainda custa um. Um texto que mede certo em uma plataforma pode medir diferente em outra por esse motivo, mesmo antes de considerar o teto de comprimento de cada plataforma.',
        },
        {
          kind: 'paragraph',
          text: 'Os links complicam ainda mais a contagem. Algumas plataformas reescrevem todo link para uma largura fixa, independente do tamanho real da URL; outras contam a URL como foi digitada. Um link de 90 caracteres pode custar o mesmo que um de 20 em uma plataforma que reescreve, e custar 90 caracteres em uma que não reescreve.',
        },
        {
          kind: 'heading',
          id: 'per-platform',
          text: 'O que cada plataforma documenta',
        },
        {
          kind: 'paragraph',
          text: 'O X documenta um teto de 280 caracteres usando seu próprio esquema de contagem ponderada, no qual certos caracteres e todo link custam um fixo de 23 caracteres, independente do tamanho real da URL. O Instagram documenta um teto de 2.200 caracteres para a legenda, contado por grafema, sem ponderação separada para links. LinkedIn e TikTok publicam cada um seu próprio teto e sua própria regra de contagem na documentação da API, e nenhum coincide exatamente com o esquema do X nem entre si. Nenhum dos quatro documenta um padrão Unicode universal como regra; cada um estabelece o seu.',
        },
        {
          kind: 'tool',
          tool: 'preflight',
          caption:
            'Cole um rascunho real, escolha as plataformas em que você posta e veja quais aceitariam e quais rejeitariam, cada uma medida pela regra de contagem que ela mesma documenta.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Por que um emoji às vezes conta como mais de um caractere?',
              a: 'Uma plataforma que conta unidades de código UTF-16, em vez de clusters de grafemas, cobra por cada ponto de código que forma um emoji. Um emoji simples costuma ser um ponto de código, mas uma bandeira, um modificador de tom de pele ou um emoji de família são formados por vários, e um contador de unidades de código cobra por cada um.',
            },
            {
              q: 'Um link sempre custa um número fixo de caracteres?',
              a: 'Só em uma plataforma que documenta uma ponderação fixa para links. O X indica 23 caracteres para qualquer link, independente do tamanho real. Uma plataforma que não documenta uma ponderação fixa conta a URL como foi digitada, então um link longo consome mais do teto do que um curto.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Ver cada limite de plataforma com sua fonte e data de verificação',
          href: ROUTES.capabilities,
        },
      ],
    },
    de: {
      title: 'Zeichenlimits je Plattform, aus der dokumentierten Quelle',
      description:
        'X zählt 280 gewichtete Zeichen, Instagram bis zu 2.200 Graphemcluster, LinkedIn und TikTok legen jeweils ihre eigene Obergrenze fest. Jedes Limit mit Quelle und einem Prüfwerkzeug.',
      lede: 'Ein Text, der auf einer Plattform passt, kann auf einer anderen abgelehnt werden, weil "Zeichen" nicht überall dasselbe bedeutet. So zählt jede Plattform tatsächlich, mit dem Dokument, das es belegt.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'Kurz gesagt',
          items: [
            'Ein Zeichenlimit ist keine universelle Zahl. Jede Plattform legt ihre eigene Obergrenze und ihre eigene Zählmethode fest.',
            'Manche Plattformen zählen Unicode-Codeeinheiten, manche zählen Graphemcluster, sodass ein Emoji oder eine Flagge je nach Plattform unterschiedlich viel kostet.',
            'Prüfe einen echten Entwurf mit dem Prüfwerkzeug unten gegen alle Plattformen auf einmal, statt von Hand zu zählen.',
          ],
        },
        {
          kind: 'stat',
          value: '280',
          label: 'Gewichtete Zeichen, die Obergrenze für einen Beitrag auf X.',
          source: 'https://docs.x.com/x-api/posts/create-post',
        },
        {
          kind: 'heading',
          id: 'counting-methods',
          text: 'Warum derselbe Text auf verschiedenen Plattformen unterschiedlich viele Zeichen kostet',
        },
        {
          kind: 'paragraph',
          text: 'Ein einfacher ASCII-Satz kostet überall gleich viel. Die Uneinigkeit beginnt bei allem anderen: einem Buchstaben mit Akzent, einem Emoji, einer aus zwei regionalen Indikatorsymbolen gebauten Flagge oder einem Link. Manche Plattformen zählen in UTF-16-Codeeinheiten, sodass ein Zeichen außerhalb des gängigen Bereichs zwei kosten kann. Manche zählen Graphemcluster, die Einheiten, die eine Person tatsächlich als Zeichen bezeichnen würde, sodass ein aus mehreren Codepunkten gebautes Familien-Emoji weiterhin eins kostet. Ein Text, der auf einer Plattform passt, kann auf einer anderen genau deshalb anders gemessen werden, noch bevor die Längenobergrenze der jeweiligen Plattform überhaupt eine Rolle spielt.',
        },
        {
          kind: 'paragraph',
          text: 'Links verkomplizieren die Zählung zusätzlich. Manche Plattformen schreiben jeden Link unabhängig von der tatsächlichen URL-Länge auf eine feste Breite um; andere zählen die URL genau wie eingegeben. Ein 90 Zeichen langer Link kann auf einer umschreibenden Plattform gleich viel kosten wie ein 20 Zeichen langer, und auf einer nicht umschreibenden 90 Zeichen kosten.',
        },
        {
          kind: 'heading',
          id: 'per-platform',
          text: 'Was jede Plattform dokumentiert',
        },
        {
          kind: 'paragraph',
          text: 'X dokumentiert eine Obergrenze von 280 Zeichen nach einem eigenen gewichteten Zählschema, bei dem bestimmte Zeichen und jeder Link unabhängig von der tatsächlichen URL-Länge fest 23 Zeichen kosten. Instagram dokumentiert eine Bildunterschrift-Obergrenze von 2.200 Zeichen, gezählt nach Graphem, ohne separate Gewichtung für einen Link. LinkedIn und TikTok veröffentlichen jeweils ihre eigene Obergrenze und ihre eigene Zählregel in ihrer API-Dokumentation, und keine stimmt exakt mit dem Schema von X oder miteinander überein. Keine der vier dokumentiert einen universellen Unicode-Standard als Regel; jede legt ihre eigene fest.',
        },
        {
          kind: 'tool',
          tool: 'preflight',
          caption:
            'Füge einen echten Entwurf ein, wähle die Plattformen, auf denen du postest, und sieh, welche ihn akzeptieren würden und welche ihn ablehnen würden, jeweils nach der von der Plattform selbst dokumentierten Zählregel gemessen.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Warum zählt ein Emoji manchmal als mehr als ein Zeichen?',
              a: 'Eine Plattform, die UTF-16-Codeeinheiten statt Graphemcluster zählt, berechnet jeden Codepunkt, aus dem ein Emoji besteht. Ein einfaches Emoji ist meist ein Codepunkt, aber eine Flagge, ein Hautton-Modifikator oder ein Familien-Emoji bestehen aus mehreren, und ein Codeeinheiten-Zähler berechnet jeden davon.',
            },
            {
              q: 'Kostet ein Link immer eine feste Anzahl an Zeichen?',
              a: 'Nur auf einer Plattform, die eine feste Link-Gewichtung dokumentiert. X gibt 23 Zeichen für jeden Link an, unabhängig von dessen tatsächlicher Länge. Eine Plattform, die keine feste Gewichtung dokumentiert, zählt die URL wie eingegeben, sodass ein langer Link mehr von der Obergrenze verbraucht als ein kurzer.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Jedes Plattformlimit mit Quelle und Prüfdatum ansehen',
          href: ROUTES.capabilities,
        },
      ],
    },
    fr: {
      title: 'Limites de caractères par plateforme, selon la source documentée',
      description:
        "X compte 280 caractères pondérés, Instagram jusqu'à 2 200 graphèmes, LinkedIn et TikTok fixent chacun leur propre plafond. Chaque limite avec sa source et un vérificateur.",
      lede: 'Un texte qui tient sur une plateforme peut être rejeté sur une autre, car "caractère" ne veut pas dire la même chose partout. Voici ce que chaque plateforme compte réellement, avec le document qui le prouve.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'En résumé',
          items: [
            "Une limite de caractères n'est pas un chiffre universel. Chaque plateforme définit son propre plafond et sa propre méthode de comptage.",
            "Certaines plateformes comptent des unités de code Unicode, d'autres des graphèmes, donc un emoji ou un drapeau peut coûter un nombre différent selon où il est publié.",
            'Vérifiez un brouillon réel sur toutes les plateformes à la fois avec le vérificateur ci-dessous, plutôt que de compter à la main.',
          ],
        },
        {
          kind: 'stat',
          value: '280',
          label: 'Caractères pondérés, le plafond pour une publication sur X.',
          source: 'https://docs.x.com/x-api/posts/create-post',
        },
        {
          kind: 'heading',
          id: 'counting-methods',
          text: 'Pourquoi le même texte peut coûter un nombre différent de caractères',
        },
        {
          kind: 'paragraph',
          text: "Une phrase simple en ASCII coûte pareil partout. Le désaccord commence avec tout le reste : une lettre accentuée, un emoji, un drapeau construit à partir de deux symboles indicateurs régionaux, ou un lien. Certaines plateformes comptent en unités de code UTF-16, donc un caractère hors de la plage courante peut coûter deux. D'autres comptent des clusters de graphèmes, les unités qu'une personne appellerait réellement un caractère, donc un emoji de famille construit à partir de plusieurs points de code coûte quand même un seul. Un texte qui passe correctement sur une plateforme peut être mesuré différemment sur une autre pour cette raison précise, avant même que le plafond de longueur de chaque plateforme n'entre en jeu.",
        },
        {
          kind: 'paragraph',
          text: "Les liens compliquent encore le comptage. Certaines plateformes réécrivent chaque lien à une largeur fixe quelle que soit la longueur réelle de l'URL ; d'autres comptent l'URL telle qu'elle est saisie. Un lien de 90 caractères peut coûter autant qu'un lien de 20 caractères sur une plateforme qui réécrit, et coûter 90 caractères sur une qui ne le fait pas.",
        },
        {
          kind: 'heading',
          id: 'per-platform',
          text: 'Ce que documente chaque plateforme',
        },
        {
          kind: 'paragraph',
          text: "X documente un plafond de 280 caractères selon son propre schéma de comptage pondéré, où certains caractères et chaque lien coûtent un fixe de 23 caractères quelle que soit la longueur réelle de l'URL. Instagram documente un plafond de légende de 2 200 caractères, compté par graphème, sans pondération distincte pour un lien. LinkedIn et TikTok publient chacun leur propre plafond et leur propre règle de comptage dans leur documentation d'API, et aucun ne correspond exactement au schéma de X ni à celui de l'autre. Aucune des quatre ne documente une norme Unicode universelle comme règle ; chacune fixe la sienne.",
        },
        {
          kind: 'tool',
          tool: 'preflight',
          caption:
            "Collez un brouillon réel, choisissez les plateformes sur lesquelles vous publiez, et voyez lesquelles l'accepteraient et lesquelles le rejetteraient, chacune mesurée selon sa propre règle de comptage documentée.",
        },
        {
          kind: 'faq',
          items: [
            {
              q: "Pourquoi un emoji compte-t-il parfois pour plus d'un caractère ?",
              a: "Une plateforme qui compte des unités de code UTF-16, plutôt que des clusters de graphèmes, facture chaque point de code dont un emoji est composé. Un emoji simple est généralement un point de code, mais un drapeau, un modificateur de teint ou un emoji de famille sont composés de plusieurs, et un compteur d'unités de code facture chacun d'eux.",
            },
            {
              q: 'Un lien coûte-t-il toujours un nombre fixe de caractères ?',
              a: "Seulement sur une plateforme qui documente une pondération fixe pour les liens. X indique 23 caractères pour chaque lien quelle que soit sa longueur réelle. Une plateforme qui ne documente pas de pondération fixe compte l'URL telle qu'elle est saisie, donc un lien long consomme plus du plafond qu'un lien court.",
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Voir chaque limite de plateforme avec sa source et sa date de vérification',
          href: ROUTES.capabilities,
        },
      ],
    },
    ja: {
      title: 'プラットフォーム別の文字数制限を、公式資料に基づいて解説',
      description:
        'Xは280の重み付き文字、Instagramは最大2200書記素、LinkedInとTikTokはそれぞれ独自の上限を設けています。各制限を出典とチェッカー付きで紹介します。',
      lede: 'あるプラットフォームで収まる文章が、別のプラットフォームでは弾かれることがあります。「文字」の意味がどこでも同じとは限らないからです。各プラットフォームが実際に何を数えているかを、根拠となる資料とともに紹介します。',
      blocks: [
        {
          kind: 'takeaways',
          title: '要点',
          items: [
            '文字数制限は万人共通の一つの数字ではない。各プラットフォームが独自の上限とカウント方法を定めている。',
            'Unicodeのコード単位を数えるプラットフォームもあれば書記素クラスタを数えるプラットフォームもあり、絵文字や旗の絵文字は投稿先によってコストが変わる。',
            '手で数えるのではなく、下のチェッカーで実際の下書きを全プラットフォームまとめて確認する。',
          ],
        },
        {
          kind: 'stat',
          value: '280',
          label: 'Xの投稿上限となる重み付き文字数。',
          source: 'https://docs.x.com/x-api/posts/create-post',
        },
        {
          kind: 'heading',
          id: 'counting-methods',
          text: '同じ文章でもプラットフォームによって文字数が変わる理由',
        },
        {
          kind: 'paragraph',
          text: '単純なASCII文だけの文章なら、どこでも同じ文字数になります。差が生まれるのはそれ以外の要素、アクセント付き文字、絵文字、2つの地域指示記号から成る旗の絵文字、リンクなどです。UTF-16のコード単位で数えるプラットフォームでは、一般的な範囲外の文字が2文字分としてカウントされることがあります。書記素クラスタ、つまり人が実際に「1文字」と呼ぶ単位で数えるプラットフォームでは、複数のコードポイントから成る家族の絵文字でも1文字分のままです。同じ文章が一方のプラットフォームでは問題なく、もう一方では違う結果になるのは、各プラットフォームの上限そのものが関わる前段階で、この違いが原因になっているためです。',
        },
        {
          kind: 'paragraph',
          text: 'リンクはカウントをさらに複雑にします。URLの実際の長さに関係なく固定幅に書き換えるプラットフォームもあれば、入力されたURLをそのまま数えるプラットフォームもあります。90文字のリンクが、書き換えるプラットフォームでは20文字のリンクと同じコストになり、書き換えないプラットフォームでは90文字分のコストになることがあります。',
        },
        {
          kind: 'heading',
          id: 'per-platform',
          text: '各プラットフォームが公式に定めている内容',
        },
        {
          kind: 'paragraph',
          text: 'Xは独自の重み付きカウント方式で280文字の上限を定めており、特定の文字とすべてのリンクはURLの実際の長さに関係なく一律23文字としてカウントされます。Instagramは書記素で数えたキャプション上限2200文字を定めており、リンクへの別枠の重み付けはありません。LinkedInとTikTokはそれぞれ独自の上限とカウントルールをAPI資料で公開しており、どちらもXの方式や互いの方式とは正確には一致しません。4社ともUnicodeの共通標準をルールとして採用しているわけではなく、それぞれが独自のルールを定めています。',
        },
        {
          kind: 'tool',
          tool: 'preflight',
          caption:
            '実際の下書きを貼り付け、投稿先のプラットフォームを選ぶと、それぞれのプラットフォームが公式に定めたカウントルールで測定し、通るか弾かれるかを表示します。',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'なぜ絵文字が1文字以上として数えられることがあるのですか。',
              a: '書記素クラスタではなくUTF-16のコード単位を数えるプラットフォームでは、絵文字を構成するコードポイントごとにカウントされます。単純な絵文字は通常コードポイント1つですが、旗の絵文字、肌の色の修飾子、家族の絵文字は複数のコードポイントから成り、コード単位カウンタはそのそれぞれをカウントします。',
            },
            {
              q: 'リンクは常に固定の文字数としてカウントされますか。',
              a: '固定のリンク重み付けを公式に定めているプラットフォームに限ります。Xはリンクの実際の長さに関係なく23文字と定めています。固定の重み付けを定めていないプラットフォームは入力されたURLをそのままカウントするため、長いリンクは短いリンクより上限を多く消費します。',
            },
          ],
        },
        {
          kind: 'cta',
          label: '各プラットフォームの制限を出典と確認日付きで見る',
          href: ROUTES.capabilities,
        },
      ],
    },
    id: {
      title: 'Batas jumlah karakter per platform, dari sumber yang terdokumentasi',
      description:
        'X menghitung 280 karakter berbobot, Instagram sampai 2.200 grapheme, LinkedIn dan TikTok masing-masing menetapkan batasnya sendiri. Tiap batas lengkap dengan sumber dan alat pengecek.',
      lede: 'Teks yang muat di satu platform bisa ditolak di platform lain, karena "karakter" tidak berarti sama di mana-mana. Ini yang sebenarnya dihitung tiap platform, lengkap dengan dokumen yang menjadi acuannya.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'Ringkasan',
          items: [
            'Batas karakter bukan angka universal. Tiap platform menetapkan batas dan metode hitungnya sendiri.',
            'Sebagian platform menghitung unit kode Unicode, sebagian menghitung grapheme cluster, jadi emoji atau bendera bisa berbeda biayanya tergantung tempat memposting.',
            'Cek draf sungguhan terhadap semua platform sekaligus dengan pengecek di bawah, bukan menghitung manual.',
          ],
        },
        {
          kind: 'stat',
          value: '280',
          label: 'Karakter berbobot, batas untuk satu postingan di X.',
          source: 'https://docs.x.com/x-api/posts/create-post',
        },
        {
          kind: 'heading',
          id: 'counting-methods',
          text: 'Kenapa teks yang sama bisa berbeda jumlah karakternya di tiap platform',
        },
        {
          kind: 'paragraph',
          text: 'Kalimat ASCII sederhana biayanya sama di mana-mana. Perbedaan mulai muncul pada hal lain: huruf beraksen, emoji, bendera yang dibentuk dari dua simbol indikator regional, atau tautan. Sebagian platform menghitung dalam unit kode UTF-16, jadi karakter di luar rentang umum bisa dihitung dua. Sebagian menghitung grapheme cluster, unit yang benar-benar disebut orang sebagai satu karakter, jadi emoji keluarga yang dibentuk dari beberapa titik kode tetap dihitung satu. Teks yang pas di satu platform bisa terukur berbeda di platform lain karena alasan ini, bahkan sebelum batas panjang masing-masing platform ikut berperan.',
        },
        {
          kind: 'paragraph',
          text: 'Tautan membuat penghitungan makin rumit. Sebagian platform menulis ulang setiap tautan ke lebar tetap terlepas dari panjang URL yang sebenarnya; sebagian lain menghitung URL persis seperti yang diketik. Tautan sepanjang 90 karakter bisa berbiaya sama dengan tautan 20 karakter di platform yang menulis ulang, dan berbiaya 90 karakter di platform yang tidak.',
        },
        {
          kind: 'heading',
          id: 'per-platform',
          text: 'Apa yang didokumentasikan tiap platform',
        },
        {
          kind: 'paragraph',
          text: 'X mendokumentasikan batas 280 karakter dengan skema hitung berbobot miliknya sendiri, di mana karakter tertentu dan setiap tautan berbiaya tetap 23 karakter terlepas dari panjang URL sebenarnya. Instagram mendokumentasikan batas keterangan 2.200 karakter, dihitung per grapheme, tanpa pembobotan terpisah untuk tautan. LinkedIn dan TikTok masing-masing mempublikasikan batas dan aturan hitungnya sendiri di dokumentasi API mereka, dan tidak ada yang persis sama dengan skema X maupun satu sama lain. Tidak satu pun dari keempatnya mendokumentasikan standar Unicode universal sebagai aturan; masing-masing menetapkan aturannya sendiri.',
        },
        {
          kind: 'tool',
          tool: 'preflight',
          caption:
            'Tempel draf sungguhan, pilih platform tempat kamu posting, dan lihat mana yang akan menerima serta mana yang akan menolak, masing-masing diukur dengan aturan hitung yang didokumentasikan platform itu sendiri.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Kenapa satu emoji kadang dihitung lebih dari satu karakter?',
              a: 'Platform yang menghitung unit kode UTF-16, bukan grapheme cluster, membebankan biaya untuk tiap titik kode penyusun emoji. Emoji sederhana biasanya satu titik kode, tapi bendera, pengubah warna kulit, atau emoji keluarga tersusun dari beberapa titik kode, dan penghitung unit kode membebankan biaya untuk masing-masingnya.',
            },
            {
              q: 'Apakah tautan selalu berbiaya jumlah karakter yang tetap?',
              a: 'Hanya pada platform yang mendokumentasikan pembobotan tautan tetap. X menyatakan 23 karakter untuk tautan apa pun terlepas dari panjang sebenarnya. Platform yang tidak mendokumentasikan pembobotan tetap menghitung URL persis seperti yang diketik, jadi tautan panjang memakai lebih banyak jatah batas daripada tautan pendek.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Lihat semua batas platform lengkap dengan sumber dan tanggal verifikasi',
          href: ROUTES.capabilities,
        },
      ],
    },
  },
};
