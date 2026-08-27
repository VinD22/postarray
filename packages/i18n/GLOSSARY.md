# Post Array interface glossary

Use this glossary before translating a catalog. It is a constraint for machine
translation and a checklist for human review. It applies to interface copy only;
it does not change the separate per-brand glossary used for post content.

## Rules

- Preserve protected terms exactly, including capitalization and spacing. Do not
  transliterate, translate, pluralize, or decline them.
- Preserve connector names exactly. Do not replace a connector with its parent
  company name or an informal variant.
- Use the mandated terms below for the corresponding interface concepts. The
  verb columns are the concise action-label form. Inflect only when the grammar
  of a complete ICU message requires it, without changing the chosen term.
- These terms do not authorize a claim about a connector, a platform, billing,
  consent, or legal terms. Those claims require the separate review described in
  the i18n README.

## Protected product nouns

| Term | Required handling | Notes |
| --- | --- | --- |
| `Post Array` | Keep exactly as written | Product and service name. |
| `Composer` | Keep exactly as written | Product feature name. |
| `Growth Advisor` | Keep exactly as written | Product feature name. |
| `Action Center` | Keep exactly as written | Product feature name. |
| `Project` | Translate to this language's ordinary word for "project" | Post Array's tenant-scoping noun (a workspace-owned publishing context). Renamed from "Brand" in the English source; do not translate it as this language's word for "brand" even where older, unreviewed catalog entries still do. |
| `Workspace` | Keep exactly as written | Post Array tenant-domain noun, not a generic office use. |

## Protected connector names

| Connector display name | Provider id | Required handling |
| --- | --- | --- |
| `X` | `x` | Keep exactly as written. |
| `LinkedIn` | `linkedin` | Keep exactly as written. |
| `Instagram` | `instagram` | Keep exactly as written. |
| `Facebook Pages` | `facebook` | Keep the full display name. Do not shorten it to `Facebook`. |
| `Threads` | `threads` | Keep exactly as written. |
| `YouTube` | `youtube` | Keep exactly as written. |
| `TikTok` | `tiktok` | Keep exactly as written. |
| `Bluesky` | `bluesky` | Keep exactly as written. |

The test-only `Fake provider` is not a user-facing connector and is not a
translatable product term.

## Mandated interface terms

The columns are intentionally scoped: **post**, **draft**, and **connection**
are nouns; **schedule**, **publish**, and **approve** are action-label verbs.
Use the approved form consistently in labels, navigation, status text, and
short messages. Translate longer sentences naturally while retaining this
terminology.

| Locale | Post | Draft | Schedule | Publish | Approve | Connection |
| --- | --- | --- | --- | --- | --- | --- |
| `en` | post | draft | schedule | publish | approve | connection |
| `es` | publicación | borrador | programar | publicar | aprobar | conexión |
| `es-419` | publicación | borrador | programar | publicar | aprobar | conexión |
| `pt-BR` | publicação | rascunho | agendar | publicar | aprovar | conexão |
| `fr` | publication | brouillon | planifier | publier | approuver | connexion |
| `de` | Beitrag | Entwurf | planen | veröffentlichen | genehmigen | Verbindung |
| `it` | post | bozza | programmare | pubblicare | approvare | connessione |
| `nl` | bericht | concept | inplannen | publiceren | goedkeuren | verbinding |
| `pl` | post | szkic | zaplanować | opublikować | zatwierdzić | połączenie |
| `cs` | příspěvek | koncept | naplánovat | publikovat | schválit | připojení |
| `sv` | inlägg | utkast | schemalägga | publicera | godkänna | anslutning |
| `tr` | gönderi | taslak | planla | yayınla | onayla | bağlantı |
| `ru` | публикация | черновик | запланировать | опубликовать | одобрить | подключение |
| `uk` | допис | чернетка | запланувати | опублікувати | схвалити | підключення |
| `ar` | منشور | مسودة | جدولة | نشر | اعتماد | اتصال |
| `he` | פוסט | טיוטה | תזמון | פרסום | אישור | חיבור |
| `hi` | पोस्ट | ड्राफ़्ट | शेड्यूल करें | प्रकाशित करें | अनुमोदित करें | कनेक्शन |
| `id` | postingan | draf | jadwalkan | terbitkan | setujui | koneksi |
| `vi` | bài đăng | bản nháp | lên lịch | xuất bản | phê duyệt | kết nối |
| `th` | โพสต์ | ฉบับร่าง | กำหนดเวลา | เผยแพร่ | อนุมัติ | การเชื่อมต่อ |
| `fil` | post | draft | iiskedyul | i-publish | aprubahan | koneksyon |
| `zh-Hans` | 帖子 | 草稿 | 安排发布 | 发布 | 批准 | 连接 |
| `zh-Hant` | 貼文 | 草稿 | 排程 | 發布 | 核准 | 連線 |
| `ja` | 投稿 | 下書き | 予約する | 公開する | 承認する | 接続 |
| `ko` | 게시물 | 초안 | 예약하기 | 게시하기 | 승인하기 | 연결 |

## Review checklist

Before a locale catalog becomes active, check that:

1. Every protected term above remains exact in catalog values and screenshots.
2. Every instance of the six mandated concepts uses the locale row above unless
   sentence grammar requires an inflection.
3. Connector capability, account-type, approval, and policy wording continues
   to describe only the capability supplied by the normalized Post Array data.
4. Legal, billing, consent, and disclosure copy follows the human-review gate
   in [the i18n README](./README.md#beta-versus-human-reviewed).
