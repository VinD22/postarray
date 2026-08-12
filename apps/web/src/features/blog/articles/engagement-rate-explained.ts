import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import { ROUTES } from '@/features/marketing/site';
import type { BlogArticle } from '../types';

/**
 * Content module, loaded per slug. Each language this article exists in is a
 * key of `content`. See `../types.ts` for why article prose is not in the ICU
 * catalog, and why titles are written per language rather than translated.
 *
 * Engagement rate has three common, incompatible denominators, and most
 * confusion about a "wrong" rate is really a comparison across two of them.
 * This article explains the arithmetic and hands the reader a calculator that
 * runs the same three divisions on their own numbers, with no benchmark
 * attached, because we have none to offer honestly.
 */
export const engagementRateExplained: BlogArticle = {
  slug: 'engagement-rate-explained',
  cluster: 'cadence',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-12',
  updated: '2026-08-12',
  sources: [
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
      title: 'Engagement rate, explained: three formulas that are not interchangeable',
      description:
        'Reach, followers and impressions give three different engagement rates from the same post. Here is what each one actually measures, and a calculator that runs all three.',
      lede:
        'A lot of "my engagement rate looks wrong" confusion is not a measurement problem. It is two rates calculated with different denominators being compared as if they were the same number.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'In short',
          items: [
            'Engagement rate by reach, by followers and by impressions are three different, valid numbers from the same post.',
            'Comparing a rate calculated one way against a rate calculated another way produces a number that looks wrong even when both were computed correctly.',
            'There is no universal good rate to compare against. It depends on platform, format and audience size.',
          ],
        },
        {
          kind: 'heading',
          id: 'three-denominators',
          text: 'Three denominators, three different questions',
        },
        {
          kind: 'paragraph',
          text: 'Interactions divided by reach answers: of the accounts that actually saw this post, what share responded. Interactions divided by followers answers: what share of the whole audience engaged, whether the post reached them or not. Interactions divided by impressions answers: across every view, including a person who saw it twice, what share turned into a response. None of the three is wrong. They measure different things, and a post can score well on one and poorly on another.',
        },
        {
          kind: 'paragraph',
          text: 'Reach based rate tends to run higher than follower based rate, because reach is usually smaller than the follower count. If a spreadsheet compares last month\'s reach based rate against this month\'s follower based rate, the drop it reports may be a change in formula, not a change in the audience.',
        },
        {
          kind: 'heading',
          id: 'no-benchmark',
          text: 'Why this page does not tell you what a good rate is',
        },
        {
          kind: 'paragraph',
          text: 'A "good engagement rate" figure needs a dataset behind it: a platform, a format, an audience size band and a time period, at minimum. We have no such dataset to offer, and publishing a single number without one would be a guess dressed up as a benchmark. What we can offer is the arithmetic itself, run correctly and labelled by which denominator it used.',
        },
        {
          kind: 'tool',
          tool: 'engagement-rate',
          caption:
            'Enter interactions, reach, followers and impressions from a real post and see the same numerator divided three different ways, each one labelled by what it actually measures.',
        },
        {
          kind: 'heading',
          id: 'comparing-fairly',
          text: 'How to compare two posts fairly',
        },
        {
          kind: 'paragraph',
          text: 'Use the same denominator on both sides of a comparison. If a platform reports reach for one post and impressions for another, either convert both to the same basis before comparing, or accept that the comparison is not apples to apples. Both Instagram and TikTok expose per post metrics through their publishing and reporting surfaces; neither defines a single official "engagement rate", which is exactly why the formula a reader picks has to stay consistent across the posts being compared.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Which denominator should I use for my own tracking?',
              a: 'Whichever one your platform reports alongside the post, and then keep using that same one every time so a later comparison is fair. Switching denominators between posts is the single most common reason a tracked rate looks like it changed when it did not.',
            },
            {
              q: 'Is a higher engagement rate always better?',
              a: 'Higher is generally a good sign within the same denominator and roughly the same audience size, because rate tends to fall as reach grows. Comparing rate across accounts of very different sizes, or across different denominators, is not a fair comparison even when both numbers are labelled the same way.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Try the calculator on its own page',
          href: ROUTES.toolEngagementRate,
        },
      ],
    },
    es: {
      title: 'Tasa de interacción explicada: tres fórmulas que no son intercambiables',
      description:
        'Alcance, seguidores e impresiones dan tres tasas de interacción distintas para la misma publicación. Qué mide cada una, y una calculadora que resuelve las tres.',
      lede:
        'Buena parte de la confusión con "mi tasa de interacción se ve mal" no es un problema de medición. Es comparar dos tasas calculadas con denominadores distintos como si fueran el mismo número.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'En resumen',
          items: [
            'La tasa de interacción por alcance, por seguidores y por impresiones son tres números distintos y válidos de la misma publicación.',
            'Comparar una tasa calculada de una forma contra otra calculada de otra forma da un número que parece incorrecto aunque ambas estén bien calculadas.',
            'No existe una buena tasa universal con la cual comparar. Depende de la plataforma, el formato y el tamaño de la audiencia.',
          ],
        },
        {
          kind: 'heading',
          id: 'three-denominators',
          text: 'Tres denominadores, tres preguntas distintas',
        },
        {
          kind: 'paragraph',
          text: 'Interacciones dividido entre alcance responde: de las cuentas que realmente vieron la publicación, qué porcentaje respondió. Interacciones dividido entre seguidores responde: qué porcentaje de toda la audiencia interactuó, la haya visto o no. Interacciones dividido entre impresiones responde: de cada visualización, incluida una persona que la vio dos veces, qué porcentaje se convirtió en una respuesta. Ninguna de las tres está mal. Miden cosas distintas, y una publicación puede salir bien en una y mal en otra.',
        },
        {
          kind: 'paragraph',
          text: 'La tasa basada en alcance suele ser más alta que la basada en seguidores, porque el alcance suele ser menor que el número de seguidores. Si una hoja de cálculo compara la tasa por alcance del mes pasado contra la tasa por seguidores de este mes, la caída que reporta puede ser un cambio de fórmula, no un cambio en la audiencia.',
        },
        {
          kind: 'heading',
          id: 'no-benchmark',
          text: 'Por qué esta página no dice cuál es una buena tasa',
        },
        {
          kind: 'paragraph',
          text: 'Una cifra de "buena tasa de interacción" necesita un conjunto de datos detrás: como mínimo, una plataforma, un formato, un rango de tamaño de audiencia y un periodo. No tenemos ese conjunto de datos para ofrecer, y publicar un solo número sin él sería una suposición disfrazada de referencia. Lo que sí podemos ofrecer es la aritmética misma, calculada correctamente y etiquetada según qué denominador usó.',
        },
        {
          kind: 'tool',
          tool: 'engagement-rate',
          caption:
            'Ingresa interacciones, alcance, seguidores e impresiones de una publicación real y mira el mismo numerador dividido de tres formas distintas, cada una etiquetada según qué mide realmente.',
        },
        {
          kind: 'heading',
          id: 'comparing-fairly',
          text: 'Cómo comparar dos publicaciones de forma justa',
        },
        {
          kind: 'paragraph',
          text: 'Usa el mismo denominador en ambos lados de la comparación. Si una plataforma reporta alcance para una publicación e impresiones para otra, conviértelas a la misma base antes de comparar, o acepta que la comparación no es equivalente. Tanto Instagram como TikTok exponen métricas por publicación en sus superficies de publicación y reportes; ninguna define una "tasa de interacción" oficial única, por eso la fórmula que elijas debe mantenerse igual entre las publicaciones que compares.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: '¿Qué denominador debería usar para mi propio seguimiento?',
              a: 'El que tu plataforma reporte junto a la publicación, y luego sigue usando ese mismo siempre para que una comparación futura sea justa. Cambiar de denominador entre publicaciones es la razón más común por la que una tasa registrada parece haber cambiado sin haberlo hecho.',
            },
            {
              q: '¿Una tasa de interacción más alta siempre es mejor?',
              a: 'En general una tasa más alta es buena señal dentro del mismo denominador y con un tamaño de audiencia similar, porque la tasa tiende a bajar conforme crece el alcance. Comparar la tasa entre cuentas de tamaños muy distintos, o entre denominadores distintos, no es una comparación justa aunque ambos números se llamen igual.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Prueba la calculadora en su propia página',
          href: ROUTES.toolEngagementRate,
        },
      ],
    },
    'pt-BR': {
      title: 'Taxa de engajamento explicada: três fórmulas que não são intercambiáveis',
      description:
        'Alcance, seguidores e impressões dão três taxas de engajamento diferentes para o mesmo post. O que cada uma mede de fato, e uma calculadora que resolve as três.',
      lede:
        'Boa parte da confusão de "minha taxa de engajamento parece errada" não é um problema de medição. É comparar duas taxas calculadas com denominadores diferentes como se fossem o mesmo número.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'Resumo',
          items: [
            'Taxa de engajamento por alcance, por seguidores e por impressões são três números diferentes e válidos do mesmo post.',
            'Comparar uma taxa calculada de um jeito com outra calculada de outro jeito dá um número que parece errado mesmo quando ambas estão certas.',
            'Não existe uma boa taxa universal para comparar. Depende da plataforma, do formato e do tamanho da audiência.',
          ],
        },
        {
          kind: 'heading',
          id: 'three-denominators',
          text: 'Três denominadores, três perguntas diferentes',
        },
        {
          kind: 'paragraph',
          text: 'Interações dividido pelo alcance responde: das contas que realmente viram o post, qual porcentagem reagiu. Interações dividido pelos seguidores responde: qual porcentagem de toda a audiência se engajou, tendo visto o post ou não. Interações dividido pelas impressões responde: de cada visualização, incluindo uma pessoa que viu duas vezes, qual porcentagem virou uma reação. Nenhuma das três está errada. Elas medem coisas diferentes, e um post pode ir bem em uma e mal em outra.',
        },
        {
          kind: 'paragraph',
          text: 'A taxa baseada em alcance costuma ser maior que a baseada em seguidores, porque o alcance geralmente é menor que o número de seguidores. Se uma planilha compara a taxa por alcance do mês passado com a taxa por seguidores deste mês, a queda relatada pode ser mudança de fórmula, não mudança na audiência.',
        },
        {
          kind: 'heading',
          id: 'no-benchmark',
          text: 'Por que esta página não diz qual é uma boa taxa',
        },
        {
          kind: 'paragraph',
          text: 'Um número de "boa taxa de engajamento" precisa de um conjunto de dados por trás: no mínimo, uma plataforma, um formato, uma faixa de tamanho de audiência e um período. Não temos esse conjunto de dados para oferecer, e publicar um único número sem ele seria um chute disfarçado de referência. O que podemos oferecer é a própria aritmética, calculada corretamente e identificada por qual denominador usou.',
        },
        {
          kind: 'tool',
          tool: 'engagement-rate',
          caption:
            'Digite interações, alcance, seguidores e impressões de um post real e veja o mesmo numerador dividido de três formas diferentes, cada uma identificada pelo que realmente mede.',
        },
        {
          kind: 'heading',
          id: 'comparing-fairly',
          text: 'Como comparar dois posts de forma justa',
        },
        {
          kind: 'paragraph',
          text: 'Use o mesmo denominador dos dois lados da comparação. Se uma plataforma relata alcance para um post e impressões para outro, converta os dois para a mesma base antes de comparar, ou aceite que a comparação não é equivalente. Instagram e TikTok expõem métricas por post nas suas superfícies de publicação e relatórios; nenhuma das duas define uma única "taxa de engajamento" oficial, por isso a fórmula escolhida precisa ser a mesma entre os posts comparados.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Qual denominador devo usar no meu próprio acompanhamento?',
              a: 'O que sua plataforma relata junto com o post, e depois continue usando esse mesmo sempre, para que uma comparação futura seja justa. Trocar de denominador entre posts é o motivo mais comum de uma taxa acompanhada parecer ter mudado sem ter mudado de verdade.',
            },
            {
              q: 'Uma taxa de engajamento mais alta é sempre melhor?',
              a: 'De modo geral, uma taxa mais alta é um bom sinal dentro do mesmo denominador e com um tamanho de audiência parecido, porque a taxa tende a cair conforme o alcance cresce. Comparar a taxa entre contas de tamanhos muito diferentes, ou entre denominadores diferentes, não é uma comparação justa mesmo que os dois números tenham o mesmo nome.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Teste a calculadora na página dela',
          href: ROUTES.toolEngagementRate,
        },
      ],
    },
    de: {
      title: 'Engagement-Rate erklärt: drei Formeln, die nicht austauschbar sind',
      description:
        'Reichweite, Follower und Impressionen ergeben drei unterschiedliche Engagement-Raten für denselben Beitrag. Was jede davon wirklich misst, plus ein Rechner für alle drei.',
      lede:
        'Ein großer Teil der Verwirrung bei "meine Engagement-Rate sieht falsch aus" ist kein Messproblem. Es werden zwei Raten mit unterschiedlichem Nenner verglichen, als wären sie dieselbe Zahl.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'Kurz gesagt',
          items: [
            'Engagement-Rate nach Reichweite, nach Followern und nach Impressionen sind drei unterschiedliche, gültige Zahlen für denselben Beitrag.',
            'Eine auf die eine Art berechnete Rate mit einer auf die andere Art berechneten zu vergleichen ergibt eine Zahl, die falsch aussieht, obwohl beide korrekt berechnet wurden.',
            'Es gibt keine universelle gute Rate zum Vergleichen. Sie hängt von Plattform, Format und Zielgruppengröße ab.',
          ],
        },
        {
          kind: 'heading',
          id: 'three-denominators',
          text: 'Drei Nenner, drei unterschiedliche Fragen',
        },
        {
          kind: 'paragraph',
          text: 'Interaktionen geteilt durch Reichweite beantwortet: Von den Konten, die den Beitrag tatsächlich gesehen haben, welcher Anteil hat reagiert. Interaktionen geteilt durch Follower beantwortet: Welcher Anteil der gesamten Zielgruppe hat sich beteiligt, unabhängig davon, ob sie den Beitrag erreicht hat. Interaktionen geteilt durch Impressionen beantwortet: Über alle Ansichten hinweg, auch eine Person, die zweimal gesehen hat, welcher Anteil wurde zu einer Reaktion. Keine der drei ist falsch. Sie messen unterschiedliche Dinge, und ein Beitrag kann bei der einen gut und bei der anderen schlecht abschneiden.',
        },
        {
          kind: 'paragraph',
          text: 'Die reichweitenbasierte Rate liegt tendenziell höher als die followerbasierte, weil die Reichweite meist kleiner ist als die Followerzahl. Vergleicht eine Tabelle die reichweitenbasierte Rate vom letzten Monat mit der followerbasierten Rate von diesem Monat, kann der gemeldete Rückgang eine Änderung der Formel sein, keine Änderung der Zielgruppe.',
        },
        {
          kind: 'heading',
          id: 'no-benchmark',
          text: 'Warum diese Seite nicht sagt, was eine gute Rate ist',
        },
        {
          kind: 'paragraph',
          text: 'Eine Zahl für eine "gute Engagement-Rate" braucht einen Datensatz dahinter: mindestens eine Plattform, ein Format, eine Zielgruppengrößenklasse und einen Zeitraum. Wir haben keinen solchen Datensatz anzubieten, und eine einzelne Zahl ohne diesen zu veröffentlichen wäre eine Vermutung im Gewand eines Richtwerts. Was wir anbieten können, ist die Rechnung selbst, korrekt ausgeführt und mit dem verwendeten Nenner beschriftet.',
        },
        {
          kind: 'tool',
          tool: 'engagement-rate',
          caption:
            'Gib Interaktionen, Reichweite, Follower und Impressionen eines echten Beitrags ein und sieh denselben Zähler auf drei verschiedene Arten geteilt, jede beschriftet mit dem, was sie tatsächlich misst.',
        },
        {
          kind: 'heading',
          id: 'comparing-fairly',
          text: 'Wie man zwei Beiträge fair vergleicht',
        },
        {
          kind: 'paragraph',
          text: 'Verwende auf beiden Seiten eines Vergleichs denselben Nenner. Meldet eine Plattform für einen Beitrag Reichweite und für einen anderen Impressionen, entweder beide vor dem Vergleich auf dieselbe Basis umrechnen, oder akzeptieren, dass der Vergleich nicht gleichwertig ist. Sowohl Instagram als auch TikTok stellen Kennzahlen je Beitrag über ihre Veröffentlichungs- und Berichtsoberflächen bereit; keine der beiden definiert eine einzige offizielle "Engagement-Rate", weshalb die gewählte Formel über die verglichenen Beiträge hinweg gleich bleiben muss.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Welchen Nenner sollte ich für mein eigenes Tracking verwenden?',
              a: 'Denjenigen, den deine Plattform zusammen mit dem Beitrag meldet, und dann immer denselben weiterverwenden, damit ein späterer Vergleich fair ist. Den Nenner zwischen Beiträgen zu wechseln ist der häufigste Grund, warum eine verfolgte Rate sich verändert zu haben scheint, obwohl sie es nicht hat.',
            },
            {
              q: 'Ist eine höhere Engagement-Rate immer besser?',
              a: 'Innerhalb desselben Nenners und bei etwa gleicher Zielgruppengröße ist eine höhere Rate meist ein gutes Zeichen, weil die Rate mit wachsender Reichweite tendenziell sinkt. Die Rate zwischen sehr unterschiedlich großen Konten oder zwischen unterschiedlichen Nennern zu vergleichen, ist auch dann kein fairer Vergleich, wenn beide Zahlen gleich benannt sind.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Rechner auf eigener Seite ausprobieren',
          href: ROUTES.toolEngagementRate,
        },
      ],
    },
    fr: {
      title: "Taux d'engagement expliqué : trois formules qui ne sont pas interchangeables",
      description:
        "Portée, abonnés et impressions donnent trois taux d'engagement différents pour la même publication. Ce que chacun mesure vraiment, avec un calculateur pour les trois.",
      lede:
        'Une bonne partie de la confusion "mon taux d\'engagement semble faux" n\'est pas un problème de mesure. C\'est comparer deux taux calculés avec des dénominateurs différents comme s\'ils étaient le même chiffre.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'En résumé',
          items: [
            "Le taux d'engagement par portée, par abonnés et par impressions sont trois chiffres différents et valides pour la même publication.",
            'Comparer un taux calculé d\'une façon avec un autre calculé différemment donne un chiffre qui semble faux même quand les deux sont corrects.',
            "Il n'existe pas de bon taux universel auquel se comparer. Cela dépend de la plateforme, du format et de la taille de l'audience.",
          ],
        },
        {
          kind: 'heading',
          id: 'three-denominators',
          text: 'Trois dénominateurs, trois questions différentes',
        },
        {
          kind: 'paragraph',
          text: "Les interactions divisées par la portée répondent : parmi les comptes qui ont réellement vu la publication, quelle part a réagi. Les interactions divisées par les abonnés répondent : quelle part de toute l'audience s'est engagée, que la publication l'ait atteinte ou non. Les interactions divisées par les impressions répondent : sur chaque vue, y compris une personne qui a vu deux fois, quelle part est devenue une réaction. Aucun des trois n'est faux. Ils mesurent des choses différentes, et une publication peut bien score sur l'un et mal sur l'autre.",
        },
        {
          kind: 'paragraph',
          text: 'Le taux basé sur la portée est généralement plus élevé que celui basé sur les abonnés, car la portée est habituellement inférieure au nombre d\'abonnés. Si un tableau compare le taux par portée du mois dernier au taux par abonnés de ce mois, la baisse rapportée peut être un changement de formule, pas un changement d\'audience.',
        },
        {
          kind: 'heading',
          id: 'no-benchmark',
          text: "Pourquoi cette page ne dit pas ce qu'est un bon taux",
        },
        {
          kind: 'paragraph',
          text: "Un chiffre de \"bon taux d'engagement\" a besoin d'un jeu de données derrière lui : au minimum une plateforme, un format, une tranche de taille d'audience et une période. Nous n'avons pas un tel jeu de données à proposer, et publier un chiffre unique sans cela serait une supposition déguisée en référence. Ce que nous pouvons proposer, c'est le calcul lui-même, effectué correctement et étiqueté selon le dénominateur utilisé.",
        },
        {
          kind: 'tool',
          tool: 'engagement-rate',
          caption:
            "Entrez les interactions, la portée, les abonnés et les impressions d'une vraie publication, et voyez le même numérateur divisé de trois façons différentes, chacune étiquetée selon ce qu'elle mesure réellement.",
        },
        {
          kind: 'heading',
          id: 'comparing-fairly',
          text: 'Comment comparer deux publications équitablement',
        },
        {
          kind: 'paragraph',
          text: "Utilisez le même dénominateur des deux côtés d'une comparaison. Si une plateforme indique la portée pour une publication et les impressions pour une autre, convertissez les deux sur la même base avant de comparer, ou acceptez que la comparaison ne soit pas équivalente. Instagram comme TikTok exposent des métriques par publication via leurs interfaces de publication et de rapport ; aucun des deux ne définit un \"taux d'engagement\" officiel unique, c'est justement pourquoi la formule choisie doit rester la même entre les publications comparées.",
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Quel dénominateur utiliser pour mon propre suivi ?',
              a: "Celui que votre plateforme indique à côté de la publication, puis continuez à utiliser toujours le même pour qu'une comparaison future soit équitable. Changer de dénominateur d'une publication à l'autre est la raison la plus courante pour laquelle un taux suivi semble avoir changé alors que ce n'est pas le cas.",
            },
            {
              q: "Un taux d'engagement plus élevé est-il toujours meilleur ?",
              a: "En général, un taux plus élevé est bon signe avec le même dénominateur et une taille d'audience à peu près comparable, car le taux tend à baisser quand la portée augmente. Comparer le taux entre des comptes de tailles très différentes, ou entre des dénominateurs différents, n'est pas une comparaison équitable même si les deux chiffres portent le même nom.",
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Essayer le calculateur sur sa propre page',
          href: ROUTES.toolEngagementRate,
        },
      ],
    },
    ja: {
      title: 'エンゲージメント率を解説：互換性のない3つの計算式',
      description:
        'リーチ、フォロワー、インプレッションでは、同じ投稿でも3つの異なるエンゲージメント率になります。それぞれが実際に何を測っているか、3つとも計算できるツール付きで解説します。',
      lede:
        '「エンゲージメント率がおかしい」という混乱の多くは、測定の問題ではありません。分母の違う2つの率を、同じ数字であるかのように比較していることが原因です。',
      blocks: [
        {
          kind: 'takeaways',
          title: '要点',
          items: [
            'リーチ基準、フォロワー基準、インプレッション基準のエンゲージメント率は、同じ投稿から出る3つの異なる正しい数字。',
            'ある方法で計算した率を別の方法で計算した率と比べると、どちらも正しく計算していても数字がおかしく見える。',
            '比較対象となる万人共通の良い数値は存在しない。プラットフォーム、フォーマット、オーディエンス規模によって変わる。',
          ],
        },
        {
          kind: 'heading',
          id: 'three-denominators',
          text: '3つの分母、3つの異なる問い',
        },
        {
          kind: 'paragraph',
          text: 'エンゲージメントをリーチで割ると分かるのは、実際に投稿を見たアカウントのうち反応した割合です。フォロワーで割ると分かるのは、投稿が届いたかどうかに関わらず、オーディエンス全体のうち反応した割合です。インプレッションで割ると分かるのは、2回見た人も含めた総閲覧数のうち反応につながった割合です。どれも間違いではありません。測っているものが違うため、ある指標では好調でも別の指標では不調ということが起こり得ます。',
        },
        {
          kind: 'paragraph',
          text: 'リーチ基準の率は、通常フォロワー基準の率より高くなりがちです。リーチはフォロワー数より小さいことが多いためです。先月のリーチ基準の率と今月のフォロワー基準の率を比べると、報告される低下は計算式の違いであり、オーディエンスの変化ではないことがあります。',
        },
        {
          kind: 'heading',
          id: 'no-benchmark',
          text: 'このページが「良い数値」を示さない理由',
        },
        {
          kind: 'paragraph',
          text: '「良いエンゲージメント率」という数字には、少なくともプラットフォーム、フォーマット、オーディエンス規模の帯、期間からなるデータセットが必要です。そうしたデータセットは持ち合わせておらず、根拠なしに単一の数字を公開すれば、基準値の姿をした推測になってしまいます。ここで提供できるのは、正しく実行され、使った分母が明示された計算そのものです。',
        },
        {
          kind: 'tool',
          tool: 'engagement-rate',
          caption:
            '実際の投稿のエンゲージメント数、リーチ、フォロワー数、インプレッション数を入力すると、同じ分子を3通りに割った結果が、それぞれ何を測っているかのラベル付きで表示されます。',
        },
        {
          kind: 'heading',
          id: 'comparing-fairly',
          text: '2つの投稿を公平に比較する方法',
        },
        {
          kind: 'paragraph',
          text: '比較の両側で同じ分母を使ってください。一方の投稿でプラットフォームがリーチを報告し、もう一方でインプレッションを報告している場合は、比較前に同じ基準に変換するか、その比較が等価ではないことを受け入れてください。InstagramもTikTokも投稿単位の指標を公開・レポート機能を通じて提供していますが、どちらも公式な単一の「エンゲージメント率」を定義していません。だからこそ、比較する投稿間では選んだ計算式を一貫させる必要があります。',
        },
        {
          kind: 'faq',
          items: [
            {
              q: '自分でトラッキングする際はどの分母を使うべきですか。',
              a: 'プラットフォームが投稿と一緒に報告している分母を使い、その後もずっと同じものを使い続けてください。そうすれば後の比較が公平になります。投稿ごとに分母を切り替えることが、追跡している率が実際には変わっていないのに変わって見える最も一般的な原因です。',
            },
            {
              q: 'エンゲージメント率は高ければ高いほど良いのですか。',
              a: '同じ分母で、オーディエンス規模もおおむね同じであれば、一般に高い方が良い兆候です。リーチが増えるほど率は下がる傾向があるためです。規模が大きく異なるアカウント間や、異なる分母同士で率を比べることは、両方の数字が同じ名前で呼ばれていても公平な比較ではありません。',
            },
          ],
        },
        {
          kind: 'cta',
          label: '計算ツール専用ページを試す',
          href: ROUTES.toolEngagementRate,
        },
      ],
    },
    id: {
      title: 'Engagement rate dijelaskan: tiga rumus yang tidak bisa saling ditukar',
      description:
        'Reach, followers, dan impressions menghasilkan tiga engagement rate berbeda dari postingan yang sama. Apa yang sebenarnya diukur masing-masing, plus kalkulator untuk ketiganya.',
      lede:
        'Banyak kebingungan "engagement rate saya kelihatan salah" sebenarnya bukan masalah pengukuran. Itu adalah dua rate yang dihitung dengan penyebut berbeda dibandingkan seolah angka yang sama.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'Ringkasan',
          items: [
            'Engagement rate berdasarkan reach, followers, dan impressions adalah tiga angka berbeda dan sama-sama valid dari postingan yang sama.',
            'Membandingkan rate yang dihitung dengan satu cara terhadap rate yang dihitung dengan cara lain menghasilkan angka yang terlihat salah, padahal keduanya dihitung dengan benar.',
            'Tidak ada angka bagus yang berlaku universal untuk dibandingkan. Tergantung platform, format, dan ukuran audiens.',
          ],
        },
        {
          kind: 'heading',
          id: 'three-denominators',
          text: 'Tiga penyebut, tiga pertanyaan berbeda',
        },
        {
          kind: 'paragraph',
          text: 'Interaksi dibagi reach menjawab: dari akun yang benar-benar melihat postingan, berapa persen yang merespons. Interaksi dibagi followers menjawab: berapa persen dari seluruh audiens yang berinteraksi, baik postingannya menjangkau mereka atau tidak. Interaksi dibagi impressions menjawab: dari setiap tayangan, termasuk orang yang melihat dua kali, berapa persen yang berujung jadi respons. Ketiganya tidak ada yang salah. Ketiganya mengukur hal berbeda, dan sebuah postingan bisa bagus di satu ukuran tapi buruk di ukuran lain.',
        },
        {
          kind: 'paragraph',
          text: 'Rate berbasis reach cenderung lebih tinggi daripada rate berbasis followers, karena reach biasanya lebih kecil dari jumlah followers. Jika sebuah spreadsheet membandingkan rate berbasis reach bulan lalu dengan rate berbasis followers bulan ini, penurunan yang dilaporkan bisa jadi perubahan rumus, bukan perubahan audiens.',
        },
        {
          kind: 'heading',
          id: 'no-benchmark',
          text: 'Kenapa halaman ini tidak memberi tahu angka bagus itu berapa',
        },
        {
          kind: 'paragraph',
          text: 'Angka "engagement rate yang bagus" butuh kumpulan data di baliknya: minimal platform, format, rentang ukuran audiens, dan periode waktu. Kami tidak punya kumpulan data seperti itu untuk ditawarkan, dan mempublikasikan satu angka tanpa itu hanyalah tebakan yang berpenampilan seperti tolok ukur. Yang bisa kami tawarkan adalah perhitungan itu sendiri, dijalankan dengan benar dan diberi label penyebut yang digunakan.',
        },
        {
          kind: 'tool',
          tool: 'engagement-rate',
          caption:
            'Masukkan interactions, reach, followers, dan impressions dari postingan sungguhan, lalu lihat pembilang yang sama dibagi dengan tiga cara berbeda, masing-masing diberi label sesuai yang sebenarnya diukur.',
        },
        {
          kind: 'heading',
          id: 'comparing-fairly',
          text: 'Cara membandingkan dua postingan secara adil',
        },
        {
          kind: 'paragraph',
          text: 'Gunakan penyebut yang sama di kedua sisi perbandingan. Jika sebuah platform melaporkan reach untuk satu postingan dan impressions untuk postingan lain, konversikan keduanya ke dasar yang sama sebelum membandingkan, atau terima bahwa perbandingan itu tidak setara. Instagram maupun TikTok menampilkan metrik per postingan lewat antarmuka publikasi dan laporan masing-masing; tidak ada satu pun yang mendefinisikan satu "engagement rate" resmi, itulah sebabnya rumus yang dipilih harus tetap sama di antara postingan yang dibandingkan.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Penyebut mana yang sebaiknya saya pakai untuk pelacakan sendiri?',
              a: 'Yang dilaporkan platform bersamaan dengan postingan, lalu tetap pakai yang sama setiap kali supaya perbandingan nanti adil. Berganti-ganti penyebut antar postingan adalah alasan paling umum sebuah rate yang dilacak terlihat berubah padahal tidak.',
            },
            {
              q: 'Apakah engagement rate yang lebih tinggi selalu lebih baik?',
              a: 'Secara umum, rate yang lebih tinggi adalah tanda baik selama penyebutnya sama dan ukuran audiensnya kurang lebih sebanding, karena rate cenderung turun seiring reach yang membesar. Membandingkan rate antar akun dengan ukuran yang sangat berbeda, atau antar penyebut yang berbeda, bukan perbandingan yang adil walau kedua angka disebut dengan nama yang sama.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Coba kalkulatornya di halaman sendiri',
          href: ROUTES.toolEngagementRate,
        },
      ],
    },
  },
};
