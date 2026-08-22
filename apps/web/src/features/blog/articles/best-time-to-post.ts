import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import { ROUTES } from '@/features/marketing/site';
import type { BlogArticle } from '../types';

/**
 * Content module, loaded per slug. Each language this article exists in is a
 * key of `content`. See `../types.ts` for why article prose is not in the ICU
 * catalog, and why titles are written per language rather than translated.
 *
 * "Best time to post" is the highest volume phrase in this cluster in every
 * language it is searched in, and the honest answer is arithmetic, not a
 * chart: nobody here has engagement data to publish, so this article answers
 * the question a reader who searches that phrase actually has, which is how
 * to turn one posting time into the right local time for every audience
 * without inventing a "best" hour we cannot back up.
 */
export const bestTimeToPost: BlogArticle = {
  slug: 'best-time-to-post',
  cluster: 'cadence',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-12',
  updated: '2026-08-12',
  sources: [
    {
      title: 'IANA Time Zone Database',
      url: 'https://www.iana.org/time-zones',
      readOn: '2026-08-10',
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
      title: 'Best time to post: the honest answer is a calculation, not a chart',
      description:
        'There is no universal best hour to post on Instagram or TikTok. Here is how to find your own answer from your audience time zones instead of a guessed chart.',
      lede: 'Every "best time to post" chart you will find online is an average across accounts that are not yours. The useful version of the question is not what hour is best in general, but what local hour your own audience is actually in when you publish.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'In short',
          items: [
            'No single hour is best for every account. Published charts average across audiences that are not yours.',
            'The question that is actually answerable is: what does one posting time look like across the time zones your audience is in.',
            'Use the calculator below with your own audience zones rather than a guessed global average.',
          ],
        },
        {
          kind: 'heading',
          id: 'why-charts-lie',
          text: 'Why a generic best time chart cannot be right for you',
        },
        {
          kind: 'paragraph',
          text: 'A "best time to post on Instagram" chart is built by averaging engagement across a large, mixed set of accounts, then reporting the hour where that average is highest. That number describes the dataset it came from, not your account. If your audience is concentrated in one region while the dataset skews toward another, the published hour can point you at a time when most of your own readers are asleep.',
        },
        {
          kind: 'paragraph',
          text: 'We do not publish an engagement chart here, on purpose. We have no engagement data of our own to report, and a number without a dataset behind it is a guess wearing the shape of a fact.',
        },
        {
          kind: 'heading',
          id: 'the-real-question',
          text: 'The question worth answering: one time, every zone',
        },
        {
          kind: 'paragraph',
          text: 'What is answerable without inventing data is arithmetic: if you post at a given local time, what local time does that land at for readers in each of your other audience regions. That turns "best time to post" into a planning problem you can actually solve, and it stays correct through a daylight saving change, which a fixed chart does not.',
        },
        {
          kind: 'tool',
          tool: 'zone-planner',
          caption:
            'Pick a date, a time and your zone, add the zones your audience is actually in, and see the same moment in every one of them, including whether a daylight saving shift moves it in the next four weeks.',
        },
        {
          kind: 'heading',
          id: 'cadence-over-hour',
          text: 'A consistent hour beats a theoretically perfect one',
        },
        {
          kind: 'paragraph',
          text: 'Both Instagram and TikTok publish through APIs built around a scheduled time you set, not a platform-chosen optimal slot. Neither documents a universal best hour, because neither claims one exists. What a repeatable schedule gives you that a single perfect post cannot is a pattern your audience can learn, and a baseline you can actually compare a change against later.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Is there really no best time to post on Instagram?',
              a: 'Not a universal one. Instagram does not publish or endorse a single best hour, and any chart claiming one is reporting an average across accounts that are not yours. The useful move is checking what local hour your own posting time lands at for your actual audience.',
            },
            {
              q: 'How often should I recheck the calculation?',
              a: 'Whenever your audience mix changes meaningfully, and around daylight saving transitions in the zones you post to. The calculator above flags a shift in the next four weeks so you notice before it happens rather than after.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Read how a posting cadence survives a normal week',
          href: ROUTES.blog,
        },
      ],
    },
    es: {
      title: 'Mejor hora para publicar: la respuesta honesta es un cálculo, no una tabla',
      description:
        'No existe una hora universal ideal para publicar en Instagram o TikTok. Así se calcula tu propia respuesta a partir de las zonas horarias de tu audiencia, no de una tabla genérica.',
      lede: 'Cualquier tabla de "mejor hora para publicar" que encuentres en línea es un promedio de cuentas que no son la tuya. La pregunta útil no es qué hora es mejor en general, sino en qué hora local está realmente tu audiencia cuando publicas.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'En resumen',
          items: [
            'Ninguna hora es la mejor para todas las cuentas. Las tablas publicadas promedian audiencias que no son la tuya.',
            'La pregunta que sí se puede responder es: cómo se ve una misma hora de publicación en cada zona horaria de tu audiencia.',
            'Usa la calculadora de abajo con las zonas reales de tu audiencia, en lugar de un promedio global adivinado.',
          ],
        },
        {
          kind: 'heading',
          id: 'why-charts-lie',
          text: 'Por qué una tabla genérica no puede ser correcta para ti',
        },
        {
          kind: 'paragraph',
          text: 'Una tabla de "mejor hora para publicar en Instagram" se construye promediando el interacción de un conjunto grande y mixto de cuentas, y reportando la hora donde ese promedio es más alto. Ese número describe el conjunto de datos del que salió, no tu cuenta. Si tu audiencia se concentra en una región mientras el conjunto de datos se inclina hacia otra, la hora publicada puede señalarte un momento en que la mayoría de tus propios lectores está dormida.',
        },
        {
          kind: 'paragraph',
          text: 'Aquí no publicamos una tabla de interacción, a propósito. No tenemos datos de interacción propios que reportar, y un número sin un conjunto de datos detrás es una suposición disfrazada de dato.',
        },
        {
          kind: 'heading',
          id: 'the-real-question',
          text: 'La pregunta que sí se puede responder: una hora, cada zona',
        },
        {
          kind: 'paragraph',
          text: 'Lo que sí se puede calcular sin inventar datos es aritmética: si publicas a una hora local dada, a qué hora local llega eso para lectores en cada una de tus otras regiones de audiencia. Eso convierte "mejor hora para publicar" en un problema de planificación que puedes resolver de verdad, y se mantiene correcto tras un cambio de horario de verano, algo que una tabla fija no logra.',
        },
        {
          kind: 'tool',
          tool: 'zone-planner',
          caption:
            'Elige una fecha, una hora y tu zona, agrega las zonas donde está tu audiencia y mira el mismo momento en cada una, incluido si un cambio de horario de verano lo desplaza en las próximas cuatro semanas.',
        },
        {
          kind: 'heading',
          id: 'cadence-over-hour',
          text: 'Una hora constante gana a una teóricamente perfecta',
        },
        {
          kind: 'paragraph',
          text: 'Tanto Instagram como TikTok publican mediante APIs construidas alrededor de una hora programada que tú defines, no de un horario óptimo elegido por la plataforma. Ninguna documenta una mejor hora universal, porque ninguna afirma que exista. Lo que un horario repetible te da y una publicación teóricamente perfecta no puede darte es un patrón que tu audiencia puede aprender, y una base contra la que comparar un cambio más adelante.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: '¿De verdad no existe una mejor hora para publicar en Instagram?',
              a: 'No una universal. Instagram no publica ni respalda una única mejor hora, y cualquier tabla que afirme una está reportando un promedio de cuentas que no son la tuya. Lo útil es revisar en qué hora local cae tu horario de publicación para tu audiencia real.',
            },
            {
              q: '¿Cada cuánto conviene repetir el cálculo?',
              a: 'Cuando tu mezcla de audiencia cambie de forma relevante, y cerca de los cambios de horario de verano en las zonas donde publicas. La calculadora de arriba marca un cambio en las próximas cuatro semanas para que lo notes antes de que ocurra.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Lee cómo un ritmo de publicación sobrevive una semana normal',
          href: ROUTES.blog,
        },
      ],
    },
    'pt-BR': {
      title: 'Melhor horário para postar: a resposta honesta é um cálculo, não uma tabela',
      description:
        'Não existe um horário universal ideal para postar no Instagram ou no TikTok. Veja como calcular sua própria resposta a partir dos fusos horários da sua audiência, em vez de uma tabela genérica.',
      lede: 'Toda tabela de "melhor horário para postar" que você encontra por aí é uma média de contas que não são a sua. A pergunta útil não é qual horário é melhor em geral, e sim em que horário local sua audiência realmente está quando você publica.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'Resumo',
          items: [
            'Nenhum horário é o melhor para todas as contas. As tabelas publicadas fazem média de audiências que não são a sua.',
            'A pergunta que dá para responder de verdade é: como um mesmo horário de publicação aparece em cada fuso da sua audiência.',
            'Use a calculadora abaixo com os fusos reais da sua audiência, em vez de uma média global chutada.',
          ],
        },
        {
          kind: 'heading',
          id: 'why-charts-lie',
          text: 'Por que uma tabela genérica não pode estar certa para você',
        },
        {
          kind: 'paragraph',
          text: 'Uma tabela de "melhor horário para postar no Instagram" é montada tirando a média do engajamento de um conjunto grande e misto de contas, e reportando o horário em que essa média é mais alta. Esse número descreve o conjunto de dados de onde saiu, não a sua conta. Se sua audiência está concentrada em uma região enquanto o conjunto de dados pende para outra, o horário publicado pode apontar um momento em que a maior parte da sua própria audiência está dormindo.',
        },
        {
          kind: 'paragraph',
          text: 'Aqui a gente não publica uma tabela de engajamento, de propósito. Não temos dados próprios de engajamento para reportar, e um número sem um conjunto de dados por trás é um chute com cara de fato.',
        },
        {
          kind: 'heading',
          id: 'the-real-question',
          text: 'A pergunta que dá para responder: um horário, cada fuso',
        },
        {
          kind: 'paragraph',
          text: 'O que dá para calcular sem inventar dados é aritmética: se você posta em um horário local dado, que horário local isso representa para leitores em cada uma das suas outras regiões de audiência. Isso transforma "melhor horário para postar" em um problema de planejamento que dá para resolver de verdade, e continua correto depois de uma mudança de horário de verão, o que uma tabela fixa não consegue.',
        },
        {
          kind: 'tool',
          tool: 'zone-planner',
          caption:
            'Escolha uma data, um horário e seu fuso, adicione os fusos onde sua audiência está e veja o mesmo momento em cada um, incluindo se uma mudança de horário de verão desloca isso nas próximas quatro semanas.',
        },
        {
          kind: 'heading',
          id: 'cadence-over-hour',
          text: 'Um horário constante vence um teoricamente perfeito',
        },
        {
          kind: 'paragraph',
          text: 'Tanto Instagram quanto TikTok publicam por APIs construídas em torno de um horário agendado que você define, não de um horário ótimo escolhido pela plataforma. Nenhuma das duas documenta um melhor horário universal, porque nenhuma afirma que ele existe. O que um horário repetível te dá e uma postagem teoricamente perfeita não dá é um padrão que sua audiência consegue aprender, e uma base para comparar uma mudança depois.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'De verdade não existe um melhor horário para postar no Instagram?',
              a: 'Não um universal. O Instagram não publica nem endossa um único melhor horário, e qualquer tabela que afirme isso está reportando uma média de contas que não são a sua. O útil é conferir em que horário local cai seu horário de postagem para sua audiência real.',
            },
            {
              q: 'De quanto em quanto tempo vale repetir o cálculo?',
              a: 'Sempre que sua mistura de audiência mudar de forma relevante, e perto das mudanças de horário de verão nos fusos onde você posta. A calculadora acima sinaliza uma mudança nas próximas quatro semanas para você notar antes de acontecer.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Leia como um ritmo de publicação sobrevive a uma semana normal',
          href: ROUTES.blog,
        },
      ],
    },
    de: {
      title: 'Bester Zeitpunkt zum Posten: die ehrliche Antwort ist eine Rechnung, kein Diagramm',
      description:
        'Es gibt keine universelle beste Uhrzeit zum Posten auf Instagram oder TikTok. So berechnest du deine eigene Antwort anhand der Zeitzonen deines Publikums statt eines geschätzten Diagramms.',
      lede: 'Jede online zu findende Tabelle zur "besten Zeit zum Posten" ist ein Durchschnitt über Konten, die nicht deine sind. Die eigentlich nützliche Frage lautet nicht, welche Uhrzeit allgemein am besten ist, sondern in welcher Ortszeit dein Publikum tatsächlich ist, wenn du veröffentlichst.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'Kurz gesagt',
          items: [
            'Keine einzelne Uhrzeit ist für jedes Konto am besten. Veröffentlichte Tabellen mitteln über Zielgruppen, die nicht deine sind.',
            'Die tatsächlich beantwortbare Frage lautet: Wie sieht eine feste Uhrzeit über die Zeitzonen deines Publikums verteilt aus.',
            'Nutze den Rechner unten mit den echten Zeitzonen deines Publikums statt eines geschätzten globalen Durchschnitts.',
          ],
        },
        {
          kind: 'heading',
          id: 'why-charts-lie',
          text: 'Warum eine allgemeine Tabelle für dich nicht stimmen kann',
        },
        {
          kind: 'paragraph',
          text: 'Eine Tabelle zur "besten Zeit zum Posten auf Instagram" entsteht, indem das Engagement über eine große, gemischte Menge an Konten gemittelt und die Uhrzeit mit dem höchsten Durchschnitt genannt wird. Diese Zahl beschreibt den Datensatz, aus dem sie stammt, nicht dein Konto. Ist dein Publikum in einer Region konzentriert, während der Datensatz eine andere Region übergewichtet, kann die veröffentlichte Uhrzeit genau auf einen Moment zeigen, in dem der Großteil deiner eigenen Leser schläft.',
        },
        {
          kind: 'paragraph',
          text: 'Wir veröffentlichen hier bewusst keine Engagement-Tabelle. Wir haben keine eigenen Engagement-Daten zu berichten, und eine Zahl ohne Datensatz dahinter ist eine Vermutung im Gewand einer Tatsache.',
        },
        {
          kind: 'heading',
          id: 'the-real-question',
          text: 'Die beantwortbare Frage: eine Uhrzeit, jede Zeitzone',
        },
        {
          kind: 'paragraph',
          text: 'Ohne Daten zu erfinden lässt sich rein rechnerisch beantworten: Wenn du zu einer bestimmten Ortszeit postest, welche Ortszeit ergibt das für Leser in jeder deiner anderen Zielregionen. Das macht aus "beste Zeit zum Posten" ein Planungsproblem, das sich tatsächlich lösen lässt, und bleibt auch nach einer Zeitumstellung korrekt, was eine feste Tabelle nicht schafft.',
        },
        {
          kind: 'tool',
          tool: 'zone-planner',
          caption:
            'Wähle ein Datum, eine Uhrzeit und deine Zeitzone, füge die Zeitzonen deines Publikums hinzu und sieh denselben Moment in jeder davon, inklusive, ob eine Zeitumstellung ihn in den nächsten vier Wochen verschiebt.',
        },
        {
          kind: 'heading',
          id: 'cadence-over-hour',
          text: 'Ein gleichbleibender Zeitpunkt schlägt einen theoretisch perfekten',
        },
        {
          kind: 'paragraph',
          text: 'Sowohl Instagram als auch TikTok veröffentlichen über APIs, die auf einer von dir festgelegten geplanten Uhrzeit basieren, nicht auf einem von der Plattform gewählten optimalen Slot. Keine der beiden dokumentiert eine universelle beste Uhrzeit, weil keine behauptet, dass es sie gibt. Was ein wiederholbarer Zeitplan bietet und ein theoretisch perfekter Einzelbeitrag nicht kann, ist ein Muster, das dein Publikum lernen kann, und eine Basis, gegen die du eine spätere Änderung tatsächlich vergleichen kannst.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Gibt es wirklich keine beste Zeit zum Posten auf Instagram?',
              a: 'Keine universelle. Instagram veröffentlicht oder bestätigt keine einzelne beste Uhrzeit, und jede Tabelle, die eine behauptet, berichtet einen Durchschnitt über Konten, die nicht deine sind. Sinnvoll ist zu prüfen, auf welche Ortszeit deine Posting-Zeit für dein tatsächliches Publikum fällt.',
            },
            {
              q: 'Wie oft sollte ich die Berechnung wiederholen?',
              a: 'Immer wenn sich deine Publikumsmischung merklich ändert, und rund um Zeitumstellungen in den Zeitzonen, in die du postest. Der Rechner oben markiert eine Umstellung in den nächsten vier Wochen, damit du sie vorher bemerkst statt danach.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Lies, wie ein Veröffentlichungsrhythmus eine normale Woche übersteht',
          href: ROUTES.blog,
        },
      ],
    },
    fr: {
      title: 'Meilleur moment pour publier : la réponse honnête est un calcul, pas un tableau',
      description:
        "Il n'existe pas d'heure universelle idéale pour publier sur Instagram ou TikTok. Voici comment calculer votre propre réponse à partir des fuseaux horaires de votre audience.",
      lede: 'Tout tableau de "meilleur moment pour publier" trouvé en ligne est une moyenne sur des comptes qui ne sont pas le vôtre. La question utile n\'est pas quelle heure est la meilleure en général, mais dans quel fuseau horaire local se trouve réellement votre audience quand vous publiez.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'En résumé',
          items: [
            "Aucune heure n'est la meilleure pour tous les comptes. Les tableaux publiés font une moyenne sur des audiences qui ne sont pas la vôtre.",
            'La question à laquelle on peut vraiment répondre : à quoi ressemble une même heure de publication dans chaque fuseau de votre audience.',
            "Utilisez le calculateur ci-dessous avec les fuseaux réels de votre audience, plutôt qu'une moyenne mondiale devinée.",
          ],
        },
        {
          kind: 'heading',
          id: 'why-charts-lie',
          text: 'Pourquoi un tableau générique ne peut pas être juste pour vous',
        },
        {
          kind: 'paragraph',
          text: "Un tableau du \"meilleur moment pour publier sur Instagram\" est construit en faisant la moyenne de l'engagement sur un large ensemble mixte de comptes, puis en indiquant l'heure où cette moyenne est la plus élevée. Ce chiffre décrit le jeu de données dont il est issu, pas votre compte. Si votre audience est concentrée dans une région pendant que le jeu de données penche vers une autre, l'heure publiée peut pointer vers un moment où la majorité de vos propres lecteurs dort.",
        },
        {
          kind: 'paragraph',
          text: "Nous ne publions pas de tableau d'engagement ici, volontairement. Nous n'avons pas de données d'engagement propres à rapporter, et un chiffre sans jeu de données derrière lui est une supposition déguisée en fait.",
        },
        {
          kind: 'heading',
          id: 'the-real-question',
          text: 'La question à laquelle on peut répondre : une heure, chaque fuseau',
        },
        {
          kind: 'paragraph',
          text: "Ce qui est calculable sans inventer de données, c'est de l'arithmétique : si vous publiez à une heure locale donnée, à quelle heure locale cela correspond pour les lecteurs de chacune de vos autres régions d'audience. Cela transforme \"meilleur moment pour publier\" en un problème de planification que l'on peut réellement résoudre, et qui reste juste après un changement d'heure, ce qu'un tableau fixe ne fait pas.",
        },
        {
          kind: 'tool',
          tool: 'zone-planner',
          caption:
            "Choisissez une date, une heure et votre fuseau, ajoutez les fuseaux où se trouve votre audience, et voyez le même instant dans chacun d'eux, y compris si un changement d'heure le déplace dans les quatre prochaines semaines.",
        },
        {
          kind: 'heading',
          id: 'cadence-over-hour',
          text: "Une heure constante l'emporte sur une heure théoriquement parfaite",
        },
        {
          kind: 'paragraph',
          text: "Instagram comme TikTok publient via des API construites autour d'une heure planifiée que vous définissez, pas d'un créneau optimal choisi par la plateforme. Aucune des deux ne documente une meilleure heure universelle, car aucune n'affirme qu'elle existe. Ce qu'un rythme reproductible apporte, et qu'une publication théoriquement parfaite ne peut pas apporter, c'est un schéma que votre audience peut apprendre, et une base à laquelle comparer un changement plus tard.",
        },
        {
          kind: 'faq',
          items: [
            {
              q: "Il n'existe vraiment pas de meilleur moment pour publier sur Instagram ?",
              a: "Pas d'universel. Instagram ne publie ni ne cautionne une heure unique meilleure que les autres, et tout tableau qui en affirme une rapporte une moyenne sur des comptes qui ne sont pas le vôtre. L'utile est de vérifier à quelle heure locale correspond votre heure de publication pour votre audience réelle.",
            },
            {
              q: 'À quelle fréquence refaire le calcul ?',
              a: "Chaque fois que la composition de votre audience change de façon notable, et autour des changements d'heure dans les fuseaux où vous publiez. Le calculateur ci-dessus signale un changement dans les quatre prochaines semaines pour que vous le remarquiez avant qu'il n'ait lieu.",
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Lisez comment un rythme de publication survit à une semaine normale',
          href: ROUTES.blog,
        },
      ],
    },
    ja: {
      title: '投稿に最適な時間帯は「表」ではなく「計算」で決める',
      description:
        'InstagramやTikTokに「万人共通の最適な時間帯」は存在しません。当て推量の表ではなく、自分のオーディエンスのタイムゾーンから答えを計算する方法を紹介します。',
      lede: 'ネットで見つかる「投稿のベストタイム」の表は、どれも自分のアカウントではない集団の平均にすぎません。本当に意味のある問いは「一般的に何時が最適か」ではなく、「投稿した瞬間、実際のオーディエンスは現地で何時にいるか」です。',
      blocks: [
        {
          kind: 'takeaways',
          title: '要点',
          items: [
            'すべてのアカウントに共通する最適な時間帯は存在しない。公開されている表は自分とは違うオーディエンスの平均にすぎない。',
            '実際に答えられる問いは「同じ投稿時刻が、オーディエンスの各タイムゾーンでどう見えるか」。',
            '下の計算ツールに実際のオーディエンスのタイムゾーンを入力して使う。当て推量の世界平均は使わない。',
          ],
        },
        {
          kind: 'heading',
          id: 'why-charts-lie',
          text: '一般的な表がそのアカウントに当てはまらない理由',
        },
        {
          kind: 'paragraph',
          text: '「Instagramの投稿ベストタイム」の表は、多種多様なアカウントのエンゲージメントを平均し、その平均が最も高くなる時刻を示すことで作られます。この数字が説明しているのは元になったデータセットであって、そのアカウントではありません。オーディエンスが特定の地域に集中していて、データセットが別の地域に偏っている場合、公開された時刻はまさに読者の大半が眠っている時間帯を指してしまうことがあります。',
        },
        {
          kind: 'paragraph',
          text: 'このサイトでは意図的にエンゲージメントの表を公開していません。報告できる独自のエンゲージメントデータを持っていないためで、根拠となるデータセットのない数字は、事実の姿をした推測にすぎません。',
        },
        {
          kind: 'heading',
          id: 'the-real-question',
          text: '答えられる問い、それは「一つの時刻、各タイムゾーン」',
        },
        {
          kind: 'paragraph',
          text: 'データを捏造せずに計算できるのは算数です。ある現地時刻に投稿すると、オーディエンスの他の地域ではそれが何時になるか。これによって「投稿のベストタイム」は実際に解ける計画の問題になり、サマータイムの切り替え後も正しさを保ちます。固定の表ではそれができません。',
        },
        {
          kind: 'tool',
          tool: 'zone-planner',
          caption:
            '日付、時刻、自分のタイムゾーンを選び、オーディエンスがいるタイムゾーンを追加すると、それぞれの地域での同じ瞬間が表示されます。今後4週間以内にサマータイムの切り替えでずれるかどうかも分かります。',
        },
        {
          kind: 'heading',
          id: 'cadence-over-hour',
          text: '理論上完璧な一投稿より、一定の時刻の方が勝る',
        },
        {
          kind: 'paragraph',
          text: 'InstagramもTikTokも、プラットフォームが選ぶ最適な枠ではなく、自分で設定した予約時刻を軸にしたAPIで投稿を公開します。どちらも万人共通の最適な時間帯を文書化していません。そもそもそんなものが存在するとは主張していないからです。繰り返せる時刻がもたらすのは、オーディエンスが学習できるパターンと、後で変更を比較できる基準であり、理論上完璧な一回の投稿にはそれができません。',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Instagramに本当にベストな時間帯は存在しないのですか。',
              a: '万人共通のものは存在しません。Instagramは単一のベストな時間帯を公開も推奨もしておらず、それを主張する表はすべて自分とは違うアカウント群の平均を報告しているだけです。実際のオーディエンスにとって自分の投稿時刻が現地で何時になるかを確認する方が有用です。',
            },
            {
              q: 'この計算はどのくらいの頻度でやり直すべきですか。',
              a: 'オーディエンスの構成が大きく変わったときと、投稿先のタイムゾーンでサマータイムが切り替わる前後です。上の計算ツールは今後4週間以内の切り替えを表示するので、起きてからではなく事前に気づけます。',
            },
          ],
        },
        {
          kind: 'cta',
          label: '通常の一週間を乗り切れる投稿ペースの作り方を読む',
          href: ROUTES.blog,
        },
      ],
    },
    id: {
      title: 'Waktu terbaik untuk posting: jawaban jujurnya adalah hitungan, bukan tabel',
      description:
        'Tidak ada satu waktu terbaik universal untuk posting di Instagram atau TikTok. Ini cara menghitung jawabanmu sendiri dari zona waktu audiens, bukan dari tabel tebakan.',
      lede: 'Setiap tabel "waktu terbaik untuk posting" yang kamu temukan online adalah rata-rata dari akun yang bukan akunmu. Pertanyaan yang benar-benar berguna bukan jam berapa yang terbaik secara umum, melainkan jam berapa waktu lokal audiensmu saat kamu benar-benar memposting.',
      blocks: [
        {
          kind: 'takeaways',
          title: 'Ringkasan',
          items: [
            'Tidak ada satu jam yang terbaik untuk semua akun. Tabel yang dipublikasikan merata-ratakan audiens yang bukan audiensmu.',
            'Pertanyaan yang benar-benar bisa dijawab: seperti apa satu waktu posting yang sama jika dilihat dari setiap zona waktu audiensmu.',
            'Gunakan kalkulator di bawah dengan zona waktu audiens yang sebenarnya, bukan rata-rata global yang ditebak.',
          ],
        },
        {
          kind: 'heading',
          id: 'why-charts-lie',
          text: 'Kenapa tabel umum tidak bisa akurat untukmu',
        },
        {
          kind: 'paragraph',
          text: 'Tabel "waktu terbaik posting di Instagram" dibuat dengan merata-ratakan interaksi dari kumpulan akun yang besar dan campuran, lalu melaporkan jam saat rata-rata itu paling tinggi. Angka itu menggambarkan kumpulan data asalnya, bukan akunmu. Jika audiensmu terkonsentrasi di satu wilayah sementara kumpulan data condong ke wilayah lain, jam yang dipublikasikan bisa justru menunjuk ke saat sebagian besar pembacamu sedang tidur.',
        },
        {
          kind: 'paragraph',
          text: 'Kami sengaja tidak mempublikasikan tabel interaksi di sini. Kami tidak punya data interaksi sendiri untuk dilaporkan, dan angka tanpa kumpulan data di baliknya hanyalah tebakan yang berpenampilan seperti fakta.',
        },
        {
          kind: 'heading',
          id: 'the-real-question',
          text: 'Pertanyaan yang bisa dijawab: satu waktu, tiap zona',
        },
        {
          kind: 'paragraph',
          text: 'Yang bisa dihitung tanpa mengarang data adalah aritmetika: jika kamu posting pada waktu lokal tertentu, jam berapa itu untuk pembaca di masing-masing wilayah audiensmu yang lain. Ini mengubah "waktu terbaik untuk posting" menjadi masalah perencanaan yang benar-benar bisa dipecahkan, dan tetap akurat setelah perubahan waktu musim panas, yang tidak bisa dilakukan tabel tetap.',
        },
        {
          kind: 'tool',
          tool: 'zone-planner',
          caption:
            'Pilih tanggal, waktu, dan zonamu, tambahkan zona tempat audiensmu berada, lalu lihat momen yang sama di tiap zona, termasuk apakah pergeseran waktu musim panas menggesernya dalam empat minggu ke depan.',
        },
        {
          kind: 'heading',
          id: 'cadence-over-hour',
          text: 'Waktu yang konsisten mengalahkan waktu yang secara teori sempurna',
        },
        {
          kind: 'paragraph',
          text: 'Instagram maupun TikTok mempublikasikan lewat API yang dibangun di sekitar waktu terjadwal yang kamu tentukan sendiri, bukan slot optimal pilihan platform. Tidak ada satu pun yang mendokumentasikan satu waktu terbaik universal, karena tidak ada yang mengklaim itu ada. Yang diberikan jadwal yang bisa diulang, dan tidak bisa diberikan satu unggahan yang secara teori sempurna, adalah pola yang bisa dipelajari audiensmu, dan patokan untuk membandingkan perubahan nanti.',
        },
        {
          kind: 'faq',
          items: [
            {
              q: 'Benarkah tidak ada waktu terbaik untuk posting di Instagram?',
              a: 'Tidak ada yang universal. Instagram tidak mempublikasikan atau mendukung satu waktu terbaik tunggal, dan tabel mana pun yang mengklaimnya sebenarnya melaporkan rata-rata dari akun yang bukan akunmu. Yang berguna adalah memeriksa jam lokal berapa waktu postingmu jatuh untuk audiensmu yang sebenarnya.',
            },
            {
              q: 'Seberapa sering perhitungan ini perlu diulang?',
              a: 'Setiap kali komposisi audiensmu berubah secara berarti, dan menjelang pergantian waktu musim panas di zona tempat kamu posting. Kalkulator di atas menandai pergeseran dalam empat minggu ke depan supaya kamu menyadarinya sebelum terjadi.',
            },
          ],
        },
        {
          kind: 'cta',
          label: 'Baca cara ritme posting bertahan dalam satu minggu biasa',
          href: ROUTES.blog,
        },
      ],
    },
  },
};
