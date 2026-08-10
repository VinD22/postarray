# 24. SEO Strategy, from Keyword Data

**Prepared:** 10 August 2026. All figures from DataForSEO, Google, United States,
retrieved 10 August 2026. Re-pull before acting on anything more than three
months old.

---

## 1. The finding that should change the plan

**The competitor does not rank for "social media scheduler". It ranks for
platform how-to questions.**

PostBridge's own ranked-keyword profile, sorted by volume:

| Their ranking keyword | Volume/mo | Their position |
| --- | --- | --- |
| meta ad library | 74,000 | 40 |
| how to see your subscribers on youtube (and ~30 near-identical variants) | 14,800 each | 8 to 19 |
| how much does youtube pay per view | 14,800 | 11 |
| my subscriber | 12,100 | 8 |
| instagram user search | 9,900 | 49 |
| shadowban tester twitter | 8,100 | 22 |

Their organic footprint is **informational platform-mechanics content and free
tools**, not product-category terms. The `/tools` directory is the strategy, not
a side project.

Our blog currently targets the opposite: "queue slots or fixed times",
"scheduling across time zones". Those are good articles that nobody searches
for. This document proposes we keep them and add the traffic.

## 2. Why the obvious keywords are the wrong first target

| Keyword | Volume/mo | Difficulty | Avg referring domains of the ranking set |
| --- | --- | --- | --- |
| social media scheduler | 60,500 | 33 | **4,071** |
| social media scheduling tool | 2,900 | 24 | 200 |
| schedule instagram posts | 6,600 | 41 | 63 |
| how to post to multiple social media at once | **10** | 27 | 4,228 |

Two things to notice.

Ranking for "social media scheduler" means competing with pages carrying an
average of four thousand referring domains. On a domain with none, that is a
multi-year project, not a launch tactic.

And "how to post to multiple social media at once" — the phrase closest to our
actual pitch — gets **ten searches a month**. Our elevator pitch is not a search
behaviour. People do not search for cross-posting; they search for the problem
that sends them looking.

## 3. Where the traffic actually is, and why we can win it

The platform specs cluster is high volume and nearly uncontested:

| Keyword | Volume/mo | Difficulty | Avg referring domains |
| --- | --- | --- | --- |
| best time to post on instagram | 90,500 | 14 | 68 |
| youtube thumbnail size | 33,100 | **10** | 57 |
| tiktok video size | 1,600 | **9** | 24 |
| x character limit | 1,000 | **4** | 10 |
| instagram reel cover size | 590 | **11** | 54 |
| linkedin post character limit | 390 | n/a | **3.5** |
| instagram carousel limit | 210 | n/a | **3.3** |
| instagram alt text | 210 | n/a | 7 |

Difficulty 4 to 14, with ranking pages carrying three to sixty referring
domains. That is winnable from a standing start.

**And we have an unfair advantage on exactly these terms.**
`apps/web/src/features/marketing/data/publishing-limits.ts` is generated from
the connector capability code by `pnpm generate:publishing-limits`, and carries
a source URL and a verification date per provider. Every competitor page on
"instagram reel cover size" is hand-typed and silently rots when the platform
changes. Ours regenerates from the code that actually enforces the limit, and a
test fails when it drifts.

That is a durable moat on a cluster with difficulty 9, and it is already built.

## 4. What to do, in order

### 4.1 A specs page per platform per constraint (highest value)

Build `/specs/<platform>/<constraint>` pages generated from the publishing-limits
dataset: image sizes, video length and dimensions, character limits, carousel
counts, alt-text limits, thumbnail requirements. Each page carries the number,
the official source, the date a person verified it, and a link to the preflight
tool that checks a real file against it.

Ten platforms times six or seven constraints is roughly sixty pages from data we
already generate. Start with the eight keywords in section 3.

The rule that makes them trustworthy and keeps them honest: a page states a
limit only where the dataset has one. No dataset row, no page.

### 4.2 Extend the preflight tool into the cluster

`/tools/post-preflight` already checks text and media against real limits. Give
each specs page a deep link into it with that platform preselected. The tool is
the conversion path the article cannot be.

### 4.3 Keep the existing articles, retarget four of them

The ten existing articles stay. Four should be re-angled onto searched phrasing
rather than internal vocabulary:

| Existing | Retarget toward |
| --- | --- |
| queue slots or fixed times | how to schedule instagram posts (9,900/mo, KD 37) |
| posting cadence you can keep | best time to post on instagram (90,500/mo, KD 14) |
| media preflight before the calendar | instagram reel cover size, tiktok video size |
| one idea adapted per platform | what size should a post be on each platform |

"Best time to post on instagram" needs care. We must not invent engagement data
we do not have. The honest and differentiated angle: the question is usually
asked by somebody who wants a repeatable cadence, and we can answer that from
first principles plus time-zone mechanics without fabricating a chart.

### 4.4 Platform pages already exist; point them at demand

`/schedule/<platform>` exists for all ten. Their titles should carry the phrasing
people actually use, and the low-difficulty ones deserve priority:
pinterest scheduler (590/mo, KD 25, **+51% year on year**), google business
profile posts (320/mo, KD 26, **+52% year on year**), bluesky scheduler
(110/mo, **KD 2**).

Both Pinterest and Google Business Profile are growing over fifty percent a year
and both are in our cohort. Bluesky at difficulty 2 is nearly free to rank for,
though the term is declining 44% year on year, so treat it as cheap coverage
rather than a bet.

## 5. What we must not do

- Do not claim a "best time to post" backed by data we do not have.
- Do not publish a specs page for a platform with no dataset row.
- Do not chase "social media scheduler" with content. It is a link-building and
  brand problem, not a writing problem.
- Do not copy the competitor's tool ideas that need scraping. Their handle
  checker and shadowban tester almost certainly query platforms in ways our own
  rules forbid. The specs cluster gets similar volume and is fully compliant.

## 6. Measurement

Instrument organic landing page, query cluster, tool usage, and signup, and
review at 30 and 90 days. The specs cluster should show movement inside a month
at these difficulty levels; if it does not, the problem is indexing or internal
linking, not the keyword choice.
