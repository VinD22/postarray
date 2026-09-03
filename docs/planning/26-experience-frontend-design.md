# Post Array frontend experience overhaul: design for a junior team

Scope: `apps/web` plus additive work in `packages/design-system`. No code in this document. Every path is relative to the repo root unless it starts with `src/`, which means `apps/web/src/`.

## 0. Ground truth verified today

- `next` 16.3.0, `react` 19.2.8. The installed React production and development builds contain zero occurrences of `ViewTransition`. The React `<ViewTransition>` component is canary-only; `experimental.viewTransition` in Next requires that canary. Cross-document CSS view transitions (`@view-transition`) only fire on full-page navigations, which App Router client navigation is not. Conclusion for C: shared-element continuity is GSAP, not View Transitions.
- `apps/web/src/lib/api/resources/media.ts` has `createUploadUrl`, `finalizeUpload`, `importFromUrl`, `list`, `get`, `delete`, `edit`, `declareRights`, `setAltText`. There is no endpoint that returns a URL a browser can read bytes from. `MediaAssetView` has dimensions, `altText`, `scanState`, `storageAvailable`, but no URL. Thumbnails (A, C, E) depend on a backend read-URL endpoint. Contract placeholder is defined in section A.
- `ConnectionView` (`src/lib/api/types.ts:157`) already carries `displayName`, `handle`, `avatarUrl`. Previews can use it now.
- `CalendarEntryView` (`src/lib/api/types.ts:254`) has `provider` and `accountLabel` but no `connectionId` or `avatarUrl`. Chip avatars need a backend field.
- `CapabilitySnapshot` (`packages/contracts/src/capabilities.ts`) gives `text.maxLength`, `text.linkCounting {mode, charactersPerLink}`, `media.maxImages/maxVideos/altText/maxAltTextLength`, `contentKinds` per kind as `supported | unsupported | not_implemented`, `mentions.support`, `threads.maxItems`. This is the only source the preview may consult for what a platform can do.
- Remembered targets already exist end to end: `packages/contracts/src/target-memory.ts`, `keys.rememberedTargets`, `src/features/composer/data/use-remembered-targets.ts` and `use-seed-remembered-targets.ts`. B11 is a UI affordance on top, not a feature.
- `src/components/link.tsx` is the app's Link wrapper. The unsaved-changes guard hooks in there.
- Design-system primitives available: `Sheet`, `Popover`, `Combobox` (controlled `inputValue`, `status`, `messages`), `Toaster/useToast` (`action: {label, onSelect}`, `duration`), `DiffView` (whole-suggestion `onAccept/onReject`, `segments`), `Notice`, `ConfirmDialog` (`consequences[]`, `tone`), `EmptyState` (exactly one `action`), `StatusPill`, `CapabilityBadge`, `MetricValue`, `Table*`, `Pagination`, `Avatar`, `Skeleton*`, `useAnnouncer`, `useHotkeys` (`enableInFormFields`), `useMediaQuery(query, serverValue)`.
- `theme.css` motion tokens: 80/120/160/200ms functional, 400/650/900ms expressive, five eases. Off-scale literals: `.relay-pop-in` at 320ms (`:1321`) and `.relay-anim-spin` at 720ms (`:1254`). Loops at `1.6s` (`relay-pulse :1250`, `relay-shimmer :1405`) are also literals.
- `ThemePreference` is `'light' | 'dark'` (`packages/design-system/src/hooks/use-theme.tsx:8`) and `src/components/theme-picker.tsx` documents that "system" was removed deliberately. The owner wants it back; section F says how without breaking the bootstrap.
- Playwright sets `NEXT_PUBLIC_RELAY_DEMO_MODE` (`apps/web/playwright.config.ts:36`); `src/lib/api/config.ts:34` reads `NEXT_PUBLIC_POSTARRAY_DEMO_MODE`. Confirmed mismatch.
- `docs/planning/06-product-ux-and-design-system.md` §3.1 fixes six nav items and says Library holds media, Sets, Signatures. Calendar and queue are one section (§5.3).

## 1. Conventions every task in this plan follows

- Strings: add keys to `packages/i18n/src/messages/en/<namespace>.ts` (the `web-*.ts` files are the web-only namespaces). Never a literal in a component. Run the catalog coverage test; other locales fall back through `beta-fallbacks.ts`.
- Styling: Tailwind utilities that resolve to semantic tokens (`bg-surface-raised`, `text-text-secondary`), logical utilities only (`ps-`, `pe-`, `start-`, `end-`), no `dark:`.
- Motion in CSS uses `duration-(--duration-fast)` and `ease-(--ease-standard)` utilities or the `relay-anim-*` classes. Motion in JS goes through `@/lib/motion/gsap` and `@/lib/motion/constants`, always behind `useMotionOk()`.
- Every new client component renders its finished state in server HTML (no `opacity-0` in markup).
- Every new component gets a colocated `*.test.tsx` that covers render, keyboard operation, and the ARIA relationships.
- One vermilion `Button variant="primary"` per screen. Everything else is `secondary` or `ghost`.
- Unavailable renders `MetricValue` with a reason, never `0` and never a dash.
- Backend dependencies are coded against a contract added to `packages/contracts` with a `// TODO(owner): depends on api` comment. Each is listed in section 11 for the backend agent.

Sizes: S = under a day, M = 1 to 3 days, L = a week, for one junior dev with review.

---

## A. Platform-native preview system

### Files

Create under `src/features/composer/previews/`:

| File | Purpose | Size |
| --- | --- | --- |
| `types.ts` | `PreviewModel`, `PreviewProps`, `PreviewDevice`, `PresentationRule` | S |
| `build-preview-model.ts` (+test) | Pure: composer state + `TargetAccount` + `ConnectionView` + media lookup + `CapabilitySnapshot` to `PreviewModel` | M |
| `counter.ts` (+test) | Grapheme count with `Intl.Segmenter`, link counting from `text.linkCounting`, returns `{ used, max, remaining, over, nearLimit }` | S |
| `truncation.ts` (+test) | `collapseText(text, rule)` returning `{ visible, hidden, collapsed }` | S |
| `presentation-rules.ts` | Per-provider display constants (collapse thresholds, media grid shape, link card style, whether the platform shows a link card). Each constant carries a comment with the official documentation URL it came from. Anything unverified is `null`, which means "do not collapse, do not render a card" | S |
| `registry.ts` | `PREVIEW_REGISTRY: Partial<Record<ProviderId, PreviewComponent>>` and `getPreviewComponent(provider)` returning `GenericPreview` when absent | S |
| `frame.tsx` | `PreviewFrame`: neutral chrome, header row (avatar, display name, handle, provider glyph at logo scale), device width, `role="group"` label | M |
| `parts/preview-text.tsx` | Paragraphs, links, `@mentions`, `#hashtags` in `text-accent`, "See more" button | S |
| `parts/preview-media.tsx` | 1, 2, 3, 4+ image grids, carousel dots, video poster with duration, document tile, "not sent" strip for media past `maxImages` | M |
| `parts/preview-link-card.tsx` | Domain, title, description from `linkPlan`; domain-only card when no metadata | S |
| `parts/preview-actions.tsx` | Decorative lucide icon row, `aria-hidden` | S |
| `parts/preview-counter.tsx` | The counter with icon and word when over | S |
| `parts/preview-thumbnail.tsx` | Wraps `MediaThumbnail` from E (shared) | S |
| `providers/x-preview.tsx`, `instagram-preview.tsx` (feed, carousel, reel by `contentKind`), `linkedin-preview.tsx`, `facebook-preview.tsx`, `threads-preview.tsx`, `bluesky-preview.tsx`, `tiktok-preview.tsx`, `youtube-preview.tsx`, `pinterest-preview.tsx`, `mastodon-preview.tsx`, `generic-preview.tsx` | One per provider, each under 150 lines, composed from `parts/` | S each |
| `device-toggle.tsx` | Mobile/desktop `SegmentedControl` (G3). Until that primitive lands, `Tabs` | S |
| `preview-host.tsx` | Replaces the body of `components/provider-preview.tsx`; reads the model, picks the component, owns the device state (persisted in `localStorage` `pa:preview-device`) | S |

Modify: `src/features/composer/components/provider-preview.tsx` (becomes a re-export of `PreviewHost` so `variant-editor.tsx` and `master-panel.tsx` do not change), `src/features/composer/components/media-strip.tsx:86-89` (use `MediaThumbnail`).

### Component API sketch

```ts
type PreviewDevice = 'mobile' | 'desktop';

interface PreviewModel {
  provider: ProviderId;
  account: { displayName: string; handle: string | null; avatarUrl: string | null };
  contentKind: ContentKind;
  kindSupport: CapabilitySupport;            // from snapshot.contentKinds[kind]
  text: string;                              // resolved body for this target
  title: string | null;                      // YouTube, Pinterest, LinkedIn article
  links: readonly { url: string; domain: string; title: string | null; description: string | null }[];
  media: readonly { id: string; kind: MediaKind; altText: string | null; width: number | null; height: number | null; durationMs: number | null; sent: boolean }[];
  threadItems: readonly { text: string; mediaIds: readonly string[] }[];
  counter: { used: number; max: number; remaining: number; over: boolean };
  presentation: PresentationRule;            // from presentation-rules.ts
  postedAtLabel: string;                     // "Just now" or the scheduled time, translated
}

interface PreviewProps { model: PreviewModel; device: PreviewDevice; }
type PreviewComponent = (props: PreviewProps) => ReactNode;
```

### Data needs

- `ConnectionView` for the active target (already in `TargetAccount` bootstrap, `composer-gateway.ts:60-75`; verify `avatarUrl` and `handle` are copied through, add them if not).
- `CapabilitySnapshot` for the target (already `account.capabilities`).
- Media metadata from `MediaAssetView` (already reachable through the picker cache; add a `useMediaAssets(ids)` batched query if not).
- Media read URLs: backend dependency **BE-1**. Contract to add in `packages/contracts/src/media-read.ts`:
  `mediaReadUrlsSchema = { mediaId, thumbnail: { url, width, height, expiresAt } | null, poster: {...} | null, original: {...} | null }`, endpoint `GET /v1/media/{id}/read-urls`. Web client `api.media.getReadUrls(mediaId)`; hook `useMediaReadUrls(mediaId)` with `staleTime` derived from `expiresAt` minus 60 seconds.

### Honesty rules (must be enforced by tests)

1. If `kindSupport !== 'supported'`, the preview renders no post at all. It renders `CapabilityBadge state={kindSupport}` plus a `Notice` with distinct copy for `unsupported` ("Instagram does not publish documents") and `not_implemented` ("Post Array cannot publish reels to Instagram yet"). The two are different states per AGENTS.md rule 7.
2. Media past `media.maxImages` or `maxVideos` renders in a "not sent" strip below the grid with a lucide icon and the word "Not sent", never silently dropped and never shown in the grid.
3. The alt-text indicator appears only when `media.altText === 'supported'`.
4. A link card appears only when `presentation.linkCard !== null` and the link plan has a resolvable URL. No fabricated title or image: domain only when metadata is absent.
5. The counter always uses `snapshot.text.maxLength` and `snapshot.text.linkCounting`. No provider limit is hardcoded anywhere in `previews/`.
6. Mentions render as plain accent text unless `mentions.support === 'supported'`.
7. A test `previews/brand-colour.test.ts` reads every file under `previews/` and fails on `bg-brand-`, `border-brand-` (except a `border-s` 1px rule) or any `--brand-` outside the provider glyph. The glyph is allowed by README rule 3 because the provider name is text in the same header row.

### Truncation and layout rules

`presentation-rules.ts` holds, per provider: `collapse: { afterChars: number | null; afterLines: number | null; labelKey: MessageKey } | null`, `mediaGrid: 'square' | 'aspect' | 'stacked'`, `linkCard: 'large' | 'compact' | null`, `showsTitle: boolean`, `desktopWidth: number`, `mobileWidth: 360`. The junior dev fills each entry from the official help centre page and cites it in a comment. Unknown means `null`, and `null` means the preview does not pretend.

### Motion

- Typing: none. The preview re-renders synchronously with no transition on text.
- "See more": instant expand, no animation.
- Device switch: `relay-anim-fade-in` on the frame (120ms, `--ease-entrance`). No width tween.
- Counter: `transition-colors duration-(--duration-fast)`. Over the limit it also gains an icon and the word "over", so colour is never alone.

### Accessibility

- Frame: `role="group"` with `aria-label` "Preview: {displayName} on {provider}, {device}".
- Action icon row is `aria-hidden`.
- "See more" is a `<button aria-expanded>` that toggles the hidden span; screen readers get the full text either way through a visually hidden copy.
- Image `alt` is the asset's alt text; when absent, `alt=""` plus a visible "No alt text" `Badge` in the corner.
- Counter changes announce through `useAnnouncer` only at three thresholds (90 percent, limit reached, back under), not per keystroke.
- Avatar `alt=""`, name is text beside it.

### Acceptance criteria

- Each of the ten providers renders through its own component; an eleventh provider falls back to `GenericPreview` without throwing.
- A target whose snapshot marks the current `contentKind` `unsupported` shows the badge and notice and no mock post; `not_implemented` shows different copy.
- Six images on a target with `maxImages: 4` shows four in the grid and two in the "Not sent" strip.
- The counter matches `validate-draft.ts` for the same text (shared function, one test comparing both).
- Thumbnails come from `useMediaReadUrls` and re-fetch before expiry; a `storageAvailable: false` asset shows the unavailable tile.
- No `--brand-*` usage outside the glyph (test).
- Mobile and desktop widths render at 360px viewport without horizontal scroll.

Total: L (registry, model, frame, parts M; ten providers S each; do parts first, then split providers across devs).

---

## B. Composer restructure

### B1. Sticky desktop action bar (M)

Create `src/features/composer/components/action-bar.tsx`. Modify `composer-screen.tsx:148-155` and retire the mobile-only branch in `summary-bar.tsx` (the new bar is the summary bar at every width).

- Layout: `position: sticky; inset-block-end: 0` inside the main column, `bg-surface-raised`, `border-t`, safe-area padding. Contents from start to end: `SavedFlash` (exists), validation summary (`{count} to fix`, links to `validation-panel.tsx`), target count from `composer.targets.publishSummary`, secondary `Save draft`, primary `Schedule` or `Publish now` (label depends on `master.schedule`).
- The primary is the only vermilion on the composer. `Add accounts` and `Global edit` become `secondary`.
- Motion: none on the bar. Label swap is instant. `SavedFlash` keeps its 160ms fade.
- a11y: `role="toolbar"` with `aria-label`, arrow-key roving is unnecessary (buttons are in tab order). The bar never covers the last field: main column gets `padding-block-end` equal to bar height via a CSS variable.
- AC: at 1280px the primary button is visible without scrolling at any scroll position; at 360px the same component renders; Playwright axe passes on `/compose`.

### B2. Unsaved-changes guard and draft recovery (M)

Create `src/features/composer/hooks/use-draft-mirror.ts`, `src/features/composer/components/restore-banner.tsx`, `src/lib/navigation/unsaved-changes.tsx` (provider + `useUnsavedChanges(register)`), modify `src/components/link.tsx`, `src/components/shell/app-shell.tsx` (mount the provider), `composer-screen.tsx`.

- Mirror: on every reducer change, debounce 300ms, write `{ version: 1, contentItemId, baseUpdatedAt, dirty: true, state }` to `localStorage['pa:draft:' + workspaceId + ':' + contentItemId]`. On successful save, write `dirty: false, baseUpdatedAt: response.updatedAt`. Cap at 512KB; skip media bytes (ids only, which the state already is).
- Restore: in the gateway bootstrap, after loading the server master, read the mirror. If `mirror.dirty && mirror.baseUpdatedAt === master.updatedAt`, render `RestoreBanner` (`Notice tone="info"` with two actions: "Restore unsaved changes", "Discard"). If the server is newer, render a one-line notice "A newer version was saved on another device" and delete the mirror.
- Guard: `UnsavedChangesProvider` keeps a ref to an `isDirty()` getter. `components/link.tsx` calls it on click; if dirty, prevents default and opens `ConfirmDialog` ("Leave without saving?" with consequences "Your unsaved edits stay on this device for 7 days"). `beforeunload` handler set only while dirty. Browser back cannot be blocked reliably; the mirror covers it, and the plan says so in the component doc comment.
- AC: type, reload, see banner, restore, text is back. Save, reload, no banner. Click nav while dirty, dialog appears, cancel keeps you on the page. Reduced-motion has no effect (no motion here).

### B3. Variant persistence fix (M, has backend dependency BE-2)

Modify `src/features/composer/data/composer-gateway.ts:134-135` and `saveComposer` (`:144-179`).

- Load: populate `overrides` and `settings` from the content view's variants. Contract to confirm or add in `packages/contracts/src/content.ts`: `ContentItemView.variants: { variantId, connectionId, overrides: Partial<OverridableFields>, settings: VariantSettings }[]`. If the API omits `settings`, **BE-2** adds it.
- Save: add `api.content.updateVariantSettings(contentId, variantId, settings)` (**BE-2**) and call it for changed targets.
- Test: `composer-gateway.test.ts` round-trip: save state with one override and one setting, load, deep-equal.

### B4. Batched autosave (S)

Modify `saveComposer` and the autosave effect (`composer-gateway.ts:165-178` region).

- Track `dirtyConnectionIds` in the reducer (add to `ComposerState`, cleared on save).
- `updateMaster` and `setTargets` run with `Promise.all`; variant writes run with `Promise.allSettled` over dirty targets only; a rejected write marks that target dirty again and surfaces `PartialSuccessNotice`.
- Coalesce: if a save is in flight, set `pending = true`; when it resolves, run once more if pending. Keep 800ms debounce.
- Longer term **BE-3**: `PUT /v1/content/{id}/composite` accepting master, targets and variants in one request. Code the client so swapping the implementation touches one function.
- AC: with 6 targets, one edit produces at most 3 request waves, not 8 sequential; a failed variant write shows the notice and retries on the next edit.

### B5. Inline AI assist popover (L)

Create `src/features/composer/assist/assist-popover.tsx`, `assist-actions.ts`, `use-assist.ts`, `src/lib/text/diff-words.ts` (+test; LCS on word tokens, under 120 lines), modify `body-field.tsx` (toolbar button), `sequence-panel.tsx` (per item), `alt-text-form.tsx` in media (E5).

- Trigger: a `ghost` `Button` with the `Sparkles` lucide icon labelled "Suggest" in the body field toolbar. Opens `Popover` anchored to the button.
- Actions (menu rows): Suggest caption, Adapt for {platform} (only when a target is active), Shorten to fit (only when `counter.over`), Hook options, CTA options, Adjust tone (submenu: 4 tones from i18n). Alt text lives in the media form, not here.
- Client calls: `assistantApi.suggestCaption` exists. The rest need **BE-4**: `POST /v1/assistant/rewrites { projectId, contentItemId, connectionId?, operation: 'adapt' | 'shorten' | 'hook_options' | 'cta_options' | 'tone', tone?, text }` returning `{ suggestions: { text }[] , usage }`. Prompts already exist in `packages/ai/src/prompts/`.
- Result: single suggestion renders `DiffView` (segments from `diff-words`); options render a `RadioGroup` of candidates with a `DiffView` for the checked one. Accept replaces the field through the reducer (`master/body` or `variant/override`), reject closes. Every suggestion panel carries a `Badge` "Suggestion" and the sentence "Written by an assistant. Check it before publishing." Nothing auto-applies.
- Per-hunk accept: extend `DiffView` in the design system with an optional `onAcceptSegment?: (index: number) => void` that renders a small accept button after each `insert`/`delete` segment (S, design-system). Until it lands, whole-suggestion accept.
- States: loading (`Spinner` in the popover, request cancellable with Esc), error (`Notice tone="destructive"`), rate limited (`RateLimitNotice` with reset time), demo (`Notice` "Not available in the demo"), permission denied.
- Motion: popover uses `.relay-pop-in` (200ms after G fix). No typing animation on suggestion text.
- a11y: `Popover` content `role="dialog"` `aria-labelledby`; focus moves to the first action; suggestion arrival announced polite ("Suggestion ready"); Esc returns focus to the trigger.
- AC: accept writes to the correct target (master vs override, tested through the reducer); a 429 shows the reset time; no suggestion is applied without a click; the composer never blocks typing while a request is in flight.

### B6. Mention and hashtag helpers (M, backend dependency BE-5)

Create `src/features/composer/components/inline-autocomplete.tsx`, `src/lib/text/caret-position.ts` (mirror-div caret measurement), `src/features/composer/state/hashtag-history.ts` (localStorage per project, last 50, with counts). Modify `body-field.tsx`, `native-settings.tsx:97` (mention offsets computed from insertion index).

- Trigger `@` when active target's `mentions.support === 'supported'`; query `api.connections.searchMentions(connectionId, q)` (**BE-5**, returns `{ id, handle, displayName, avatarUrl }[]`, backed by the provider's official lookup where one exists; when `resolvesToExternalId` is false the helper inserts text only). On the master pane, `@` shows a hint row "Mentions resolve per account. Open a target to pick one."
- Trigger `#` on every pane: rows from `hashtag-history` matching prefix, sorted by count.
- Keyboard: ArrowUp/Down, Enter, Esc, Tab closes. `role="listbox"` in the popover, the textarea gets `aria-controls` and `aria-activedescendant`, `aria-autocomplete="list"`.
- Motion: none; the list appears and disappears instantly (a typing aid must not lag).
- AC: selecting a mention records `{ handle, externalId, offset, length }` with the right offset (test); hashtag picks persist across reloads; nothing opens on `@` when the capability is not supported.

### B7. Thread items with counter and media (S)

Modify `sequence-panel.tsx:219-230`: each item gets `PreviewCounter` bound to the active target's snapshot (`threads.maxItems` enforced with a notice at the limit) and a media row using `MediaPickerDialog` (exists) plus `MediaThumbnail` (E). AC: counter per item, item count capped with copy, thumbnails visible.

### B8. Keyboard shortcut fixes (S)

- `packages/design-system/src/hooks/use-hotkeys.ts`: normalise shifted symbols. When `event.key` is a symbol produced with Shift (`?`, `!`, `+`, and so on), match both `shift+?` and `?`. Add a test with a synthetic `KeyboardEvent` for `?` with `shiftKey: true`.
- `src/components/shell/app-shell.tsx:44-57`: bind `mod+shift+c` to `router.push('/compose')` with `enableInFormFields: true`, skipping when `pathname` already ends with `/compose`.
- Single source of truth: create `src/components/shell/shortcut-catalog.ts` exporting `{ id, keys, labelKey, scope: 'global' | 'composer' | 'calendar' }[]`; `shortcuts-dialog.tsx` renders from it; `app-shell.tsx` and the composer's `shortcuts-dialog.tsx` bind from it; a test asserts every global entry has a binding in `app-shell.tsx` by reading the source (same technique as `app-motion-tier.test.ts`).

### B9. DateTimeField primitive (L, design-system)

Create in `packages/design-system/src/primitives/`: `calendar-grid.tsx`, `time-field.tsx`, `time-zone-combobox.tsx`, `date-time-field.tsx`, and `packages/design-system/src/utils/time-zone.ts` (pure helpers: `listTimeZones()`, `groupByRegion()`, `zoneLabel(zone, locale)`, `detectDstEdge(parts, zone)`). Export from `primitives/index.ts` and `utils/index.ts`.

```ts
interface DateTimeParts { date: string /* YYYY-MM-DD */; time: string /* HH:mm */; timeZone: string }

interface DateTimeFieldProps {
  value: DateTimeParts | null;
  onChange: (next: DateTimeParts | null) => void;
  locale: string;                // for Intl formatting only
  hourCycle?: 'h12' | 'h23';
  min?: string; max?: string;    // ISO dates
  disabledDates?: (date: string) => boolean;
  messages: DateTimeFieldMessages; // every label: open picker, previous month, next month, today, time, hour, minute, time zone, search zones, no zones, nonexistent time, ambiguous time, format hint
  id?: string; name?: string; disabled?: boolean; invalid?: boolean; required?: boolean;
  'aria-describedby'?: string;
}
```

- Structure: one text input per part with a "Choose date" `IconButton` opening a Radix `Popover` containing `CalendarGrid` (`role="grid"`, roving tabindex, Arrow keys move days, PageUp/PageDown months, Shift+PageUp/Down years, Home/End week edges, Enter selects, Esc closes and restores focus). Typed dates are accepted and validated on blur.
- `TimeField`: two numeric segments (`inputmode="numeric"`, `aria-label` from messages), Up/Down increments, paste "14:30" fills both.
- `TimeZoneCombobox`: built on the existing `Combobox`. Items from `Intl.supportedValuesOf('timeZone')` when available, else a bundled fallback list of ~120 zones in `utils/time-zone-fallback.ts`. Grouped by region (`America`, `Europe`, `Asia`, ...) with the current UTC offset in the secondary label. This replaces `schedule-sheet.tsx:238-241`'s two-zone list.
- DST: `detectDstEdge` returns `'nonexistent'` (the wall time is skipped that day) or `'ambiguous'` (occurs twice) or `null`. `DateTimeField` renders the matching message under the field with `role="status"`. The app converts with `features/composer/state/time.ts`; the primitive never emits an instant.
- Value never becomes a `Date`. The consumer stores instant plus zone (AGENTS.md time rule).
- Motion: popover `.relay-pop-in` (200ms). Month change: none.
- a11y: APG date picker dialog pattern; each control has a visible label; 44px cells on coarse pointers; format hint linked with `aria-describedby`; invalid announces assertive.
- AC: fully keyboard operable (test); RTL renders mirrored via logical props only; the combobox lists at least 300 zones in Chrome and the fallback list in JSDOM; a 02:30 on a spring-forward day shows the nonexistent message; contrast tests unchanged.

### B10. Quick-create from a calendar slot and lazy draft creation (M)

- Modify `src/features/calendar/calendar-grid.tsx:185-191`: each empty slot renders a `ghost` `IconButton` (`Plus`) visible on hover and focus, always visible on coarse pointers, `aria-label` "New post at {time}". Click navigates to `/compose?at={iso}&tz={zone}`.
- Modify `src/app/[locale]/(app)/compose/page.tsx` and `features/composer/state/seed.ts`: read `at` and `tz`, validate with zod, seed `master.schedule`.
- Lazy creation: `composer-gateway.ts:83-87` creates a server draft on every visit. Change to create on first meaningful edit: bootstrap returns a local master with `id: null` and a `pendingCreate` flag; the autosave hook calls `createDraftOnce()` (a memoised promise in the gateway) before the first save and dispatches `master/assign-id`. Everything that needs `master.id` before the first save (validation, cost) waits on the same promise. AC: opening and leaving `/compose` creates no row; typing one character creates exactly one.

### B11. Remember-targets affordance (S)

Modify `target-rail.tsx`: a `Switch` "Start with the channels I used last time" bound to the project opt-in (`use-remembered-targets.ts`), and a `Notice tone="info"` when `droppedConnectionIds.length > 0`: "Restored 3 channels. Not restored: {names}, {reason}." Reasons from `ConnectionHealth`. AC: matches the four contract boundaries in `target-memory.ts` (off by default, ids only, per person, dropped channels named).

---

## C. Calendar polish

### C1. Avatars on chips (S, backend dependency BE-6)

**BE-6**: add `connectionId` and `avatarUrl` to `CalendarEntryView`. Modify `entry-chip.tsx`: `Avatar size="xs"` at the start, provider identity dot (8px, allowed) overlapping its corner, `accountLabel` remains text. Until BE-6 lands, look up `avatarUrl` from the `useConnections()` cache by `accountLabel` match is not acceptable (labels are not unique); ship the chip change behind the field being present.

### C2. Touch and long-press (M)

Modify `use-drag-reschedule.ts:170`. Coarse pointers lift after a 350ms press with less than 8px movement; on lift, set `touch-action: none` on the grid, show the grabbed style, and follow the pointer; release drops into the slot under the pointer and opens `RescheduleDialog` (exists). A short tap still opens the entry. Alternative path that already exists and must stay: keyboard M, plus a "Move" button in `entry-detail-sheet.tsx` that opens `RescheduleDialog` with the new `DateTimeField`. No drag-only operation anywhere (README keyboard rule). Motion: lift and settle stay 120ms as documented.

### C3. Overflow in week, day and month (S)

Modify `calendar-grid.tsx` and `calendar-month.tsx`: cap chips per cell by available height (measured once per resize), render "+{n} more" as a `Button variant="ghost" size="sm"` opening a `Popover` with the remaining chips (same `EntryChip`, `density="compact"`). Popover `aria-label` "{n} more posts on {date}".

### C4. Infinite paging (S)

Modify `use-calendar.ts:51-53`: switch to `useInfiniteQuery` on `api.scheduling.getCalendar` with the cursor; on data, keep calling `fetchNextPage` until `hasNextPage` is false (the visible range bounds it); show a `LoadingState` row "Loading more" while pages arrive and merge entries by `contentItemId + publishJobId`. Key stays `keys.calendar(range)`.

### C5. Correct SSR default view (S)

The current view is derived from viewport width after hydration (`use-media-query.ts:36` returns `false` on the server). Stop deriving the view from width. Persist the chosen view in a cookie `pa:calendar-view` (set by `view-switch.tsx`), read it in `calendar/page.tsx` on the server and pass `initialView`. With no cookie, the default is `list` (agenda), which is correct at every width, so first paint never flips. Width only affects density inside a view.

### C6. Reschedule toast with undo (S)

Modify `reschedule.ts` mutation success handler: `toast({ tone: 'success', title: t('calendar.rescheduled.title', {when}), action: { label: t('common.undo'), onSelect } , duration: 8000 })`. Undo calls the same mutation with the previous `instant` and `ianaTimeZone` and a fresh `newIdempotencyKey('reschedule')`; announce both through `useAnnouncer` (polite). Verify `Toaster` gives keyboard access to the action; if there is no way to reach the region without a pointer, add `useHotkeys({ 'alt+t' })` focusing the toast region in the `Toaster` (design-system S).

### C7. Dead links and the unused retry (S)

- `entry-chip.tsx` href: link to `/posts/{contentItemId}` (exists) with `#receipt`; add `id="receipt"` on the receipt section in `posts/[contentItemId]/page.tsx`.
- `receipt-screen.tsx:483-489`: wire `useRetryTarget` (`use-receipt.ts:97-131`) to a "Retry this account" `Button` per failed item, guarded by `ConfirmDialog` with consequences ("Publishes to {account} now. Already published accounts are not affected."). Replace "retry unavailable" copy with the real reason from the receipt when the API says it cannot be retried.

### C8. Routes for queue rules and posting sets (S each)

- `src/app/[locale]/(app)/calendar/queue/page.tsx` renders `features/queue/rule-editor-screen.tsx`; `calendar-toolbar.tsx` gets a secondary "Queue rules" link; `command-palette.tsx` and `nav-items.ts` get the entry. Decision: under Calendar, because queue rules answer "when does it go out" (docs 06 §5.3 treats calendar and queue as one section).
- `src/app/[locale]/(app)/library/sets/page.tsx` renders `features/posting-sets/posting-sets-screen.tsx`. `library/page.tsx` grows a `SegmentedControl` (G3) "Media | Sets | Signatures" where Signatures is a disabled item labelled "Unavailable" until a read endpoint exists (per the note in `composer-gateway.ts`). Matches docs 06 §3.2 "Library: media, Sets, Signatures".
- Both get `loading.tsx` and `error.tsx` (H4).
- Fix `analytics-shell.tsx:50-52`: compare against `usePathname()` with the locale prefix stripped through the existing locale utilities in `@relay/i18n` (`locales.ts`), and reuse that helper in `primary-nav.tsx`.

### C9. Calendar to composer continuity (M)

Recommendation: GSAP origin continuity, not View Transitions. Reasons: no `ViewTransition` export in React 19.2.8 stable, `experimental.viewTransition` needs a canary React, cross-document view transitions do not fire on client navigation, and GSAP is already the sanctioned tool.

- Create `src/lib/motion/origin-continuity.ts`: `rememberOrigin(id, element)` writes `{ id, rect: {x, y, width, height}, at: Date.now() }` to `sessionStorage['pa:origin']`; `useOriginContinuity(ref, id)` reads it once on mount, and if `useMotionOk()` and the entry is under 1000ms old and the ids match, runs `gsap.from(el, { x: dx, y: dy, scaleX, scaleY, duration: DURATION_SLOW, ease: EASE_OUT_EXPO })` from the stored rect to the element's own measured rect, then clears storage. Measured rects are physical on both ends, so RTL needs no branch.
- Apply: `entry-chip.tsx` calls `rememberOrigin(contentItemId, chipEl)` on activation; `composer-header.tsx` calls `useOriginContinuity(headerRef, master.id)`. One element, 200ms, transform only.
- Coexistence with `PageTransitionProvider tier="app"` (`app-shell.tsx:153`): the provider fades the whole route in at 120ms with an 8px rise. The continuity runs in parallel on one child; both are transform and opacity, both end under 200ms, and reduced motion disables both through `useMotionOk`. No provider change needed. Do not exempt the route from the fade; the two together read as one movement.
- Add `origin-continuity` to the "chrome-level Flip" paragraph of `components/motion/README.md` and extend `app-motion-tier.test.ts` scanning so `lib/motion/origin-continuity.ts` can only use fast-tier constants.
- AC: navigating from a chip plays one 200ms settle on the composer header; a direct `/compose?id=` visit plays nothing; reduced motion plays nothing; no layout shift (the header's final position is where server HTML put it).

---

## D. Analytics and reporting

### D1. Chart kit location and dependencies

Decision: `packages/design-system/src/charts/`, hand-rolled SVG, no d3.

- The design system may take third-party dependencies from its declared toolchain list, and `d3-scale`/`d3-shape` are not product coupling, so they are permissible. They are still not worth it: the kit needs a linear scale, a time scale, a band scale, "nice" ticks and a line/area path generator, roughly 250 lines total, all pure and testable, and the existing `trend-chart.tsx` already hand-rolls most of it (badly, at 464 lines). Two pure modules a junior can read beat a typed dependency they cannot.
- Colour: chart series must not use marigold or ultramarine (README: scene vocabulary and "nothing else may join"). Add four semantic tokens to `theme.css` in both themes with contrast assertions: `--chart-line` (ink), `--chart-line-compare` (text-secondary), `--chart-grid` (border-subtle), `--chart-area` (surface-sunken). Multi-series is distinguished by dash pattern plus a text legend, not hue. This is also the colour-blind-safe answer.

Files (each S unless marked):

| File | Purpose |
| --- | --- |
| `charts/scale.ts` (+test) | `linearScale`, `timeScale` (UTC ms), `bandScale`, `niceTicks(min, max, count)` |
| `charts/path.ts` (+test) | `linePath(points)` splitting on `null` values into separate `M` segments, `areaPath`, never interpolating across a gap |
| `charts/axis.tsx` | `XAxis`, `YAxis` with ticks, tick labels formatted by a caller-supplied `format` (Intl lives in the app) |
| `charts/chart-frame.tsx` | `<figure>` with `<figcaption>`, `svg role="img" aria-label`, margins, responsive via `viewBox` and a `ResizeObserver` for the width only |
| `charts/chart-table.tsx` | Accessible fallback: a `details` "View as table" holding `Table` with the same points; `unavailable` renders the word |
| `charts/chart-tooltip.tsx` | Focusable invisible hit rects per point (roving tabindex), tooltip via `Tooltip` primitive; arrow keys move between points |
| `charts/line-chart.tsx` (M) | `LineChart` |
| `charts/bar-chart.tsx` (M) | `BarChart` (vertical bands, compare series as outlined bars) |
| `charts/index.ts` | exports; add `"./charts"` to `package.json` exports |
| `charts/charts.test.tsx` | Render, table fallback present, no `animate` or `transition` on paths, nulls produce path gaps |

```ts
interface SeriesPoint { t: string /* ISO */; v: number | null }
interface Series { id: string; label: string; points: readonly SeriesPoint[]; dash?: 'solid' | 'dashed' }
interface LineChartProps {
  series: readonly Series[];           // max 2 recommended, 4 hard cap
  formatX: (iso: string) => string; formatY: (v: number) => string;
  messages: { caption: string; viewAsTable: string; unavailable: string; gapLegend: string; xHeader: string };
  height?: number;                     // default 240
  className?: string;
}
```

Rules baked in: no draw-in, no transition on `d`, numbers beside a chart render through `MetricValue` at once (README: nothing animates data). A null gap draws no segment and the legend sentence "Gaps mean the provider reported nothing" appears whenever any null exists.

### D2. Overview dashboard (M)

Rewrite `src/features/analytics/analytics-overview-screen.tsx` layout, modify `analytics-toolbar.tsx:211-220`, `queries.ts`.

- Toolbar: period `SegmentedControl` (7, 28, 90 days, Custom) where Custom opens `DateTimeField` in date-only mode (add `mode: 'date' | 'datetime'` prop in B9); "Compare to previous period" `Checkbox` now drives a second `useAnalyticsOverview` call with the shifted range, and every metric cell shows `BaselineDelta` (exists).
- Per-channel rollups: a `Table` (not cards), one row per connection: avatar and name, followers, reach, engagement rate, posts published, each a `MetricCell` with delta; sortable headers via `TableHead` sort props; `FreshnessLabel` per row from `lastAnalyticsSyncAt`.
- One `LineChart` below the table for the selected metric across the period, series from `useMetricSeries` (currently zero callers) for the checked channels (max 4).
- Fix the boundary: replace `adapt<T>()` (`queries.ts:60`) with zod parsing against schemas exported from `packages/contracts/src/analytics.ts`, and fix the two mismatches it hides (`ExperimentView` missing `variants` used at `experiments-screen.tsx:210`; `post-metrics-screen.tsx:120`).

### D3. Post detail series (S, backend dependency BE-7)

`post-metrics-screen.tsx`: add a `LineChart` of the post's metrics over time from **BE-7** `GET /v1/analytics/posts/{id}/series`. Until it exists, render the snapshot table only and no empty chart.

### D4. CSV export (S)

Create `src/lib/export/csv.ts` (+test; RFC 4180 quoting, UTF-8 BOM, ISO dates, empty cell for unavailable, never `0`), `src/features/analytics/components/export-button.tsx` (Blob and an `<a download>` created on click, filename `postarray-{project}-{from}-{to}.csv`). Announce "Download started".

### D5. Client report (L, backend dependency BE-8)

- Builder route `src/app/[locale]/(app)/analytics/reports/page.tsx` and `src/features/analytics/report/report-builder-screen.tsx`: project (from session), date range (`DateTimeField` date mode, two fields), channels (checkbox list with avatars), metrics (checkbox list from the union of `analytics.postMetrics`/`accountMetrics` across chosen channels), optional note. Primary "Create shareable link" calls **BE-8** `POST /v1/analytics/reports` returning `{ reportId, shareUrl, expiresAt }`. Result shows `CopyableSecret` for the URL, the expiry, and a "Revoke" secondary.
- Public route `src/app/[locale]/(public)/r/[token]/page.tsx` (RSC, no session, `robots: noindex`) fetching **BE-8** `GET /v1/public/reports/{token}` and rendering `src/features/analytics/report/report-screen.tsx`: cover (project name, range, generated at), per-channel `Table`, one `LineChart` per metric, note, footer "Prepared with Post Array". `error.tsx` for expired or revoked tokens.
- Print: `src/features/analytics/report/report-print.css` imported by the public layout: `@page` margins, `break-inside: avoid` on tables and figures, hide the toolbar, black ink on white, chart tokens resolve to ink. "Download PDF" is a `Button` calling `window.print()` with the visible label "Save as PDF" and a one-line hint. No server PDF in this pass.
- Unavailable metrics render the word in print too.
- AC: link opens without a session; expired token shows the error state; print preview shows no chrome and no page splits a table row; axe passes.

---

## E. Library polish

### E1. Thumbnails (M, depends on BE-1)

Create `src/features/media/components/media-thumbnail.tsx` (shared by A, B7, C, E):

```ts
interface MediaThumbnailProps {
  asset: Pick<MediaAssetView, 'id' | 'kind' | 'altText' | 'scanState' | 'storageAvailable' | 'durationMs' | 'width' | 'height'>;
  size: 'xs' | 'sm' | 'md' | 'lg';
  messages: { scanning: string; blocked: string; unavailable: string; noAltText: string; duration: (ms: number) => string };
}
```

States: loading `Skeleton` with the asset's aspect ratio (no layout shift); `scanState: 'pending'` shows "Scanning" with `Loader` icon; `suspicious | infected` shows a blocked tile with `ShieldAlert` icon and word; `storageAvailable: false` shows "Unavailable"; video shows the poster and duration; document shows the `FileText` icon. Plain `<img loading="lazy" decoding="async">` for signed URLs (they expire, so `next/image` caching by URL is wrong here). Replaces the grey squares at `library-screen.tsx:300-304` and `media-strip.tsx:86-89`.

### E2. Delete with confirm and undo window (M)

- `IconButton` (Trash2) on hover and focus of a tile and in `media-detail.tsx`. Opens `ConfirmDialog tone="destructive"` with consequences from **BE-9** `MediaAssetView.usage: { draftCount, scheduledCount }` ("Used in 2 scheduled posts. Those posts will fail validation until you replace it.").
- Create `src/lib/api/deferred-action.ts`: `deferAction({ run, undoWindowMs: 8000 })` returning `{ undo }`, flushing on timer, on toast dismiss, and on `pagehide`. The tile is removed optimistically, the toast offers Undo, and `api.media.delete` runs when the window closes. If the delete fails afterwards, re-insert and show a destructive toast.
- Announce "Deleted {name}. Undo available for 8 seconds."

### E3. Search, filter, sort, pagination (M, backend dependency BE-10 for `q` and `sort`)

Modify `library-screen.tsx`: toolbar with `Input` search (300ms debounce), kind `SegmentedControl` (All, Images, Video, Documents), `Select` sort (Newest, Oldest, Name, Size). State lives in the URL search params so it survives refresh. `useInfiniteQuery` over `api.media.list` with the cursor; a "Load more" `Button` (not scroll-triggered) with the count so far; the row count is announced polite.

### E4. Paste to upload (S)

Create `src/features/media/hooks/use-paste-upload.ts`: `document` `paste` listener that, when `clipboardData.files.length > 0` and the target is not a text field, enqueues into `useUploadQueue` and announces "Uploading {n} pasted files". Mount in `library-screen.tsx` and `media-strip.tsx`.

### E5. Persisted view and alt-text AI (S)

- View: cookie `pa:library-view` (grid or list), read on the server in `library/page.tsx` and passed as `initialView`, same pattern as C5.
- Alt text: `alt-text-form.tsx` gets "Suggest alt text" (`ghost`, Sparkles) calling **BE-11** `POST /v1/assistant/alt-text-suggestions { mediaId }`; result in a `DiffView` against the current text with the "Suggestion" badge; respects `maxAltTextLength` from the selected target when opened from the composer. This replaces the unreachable button at `library-screen.tsx:258-263`.

---

## F. Guidance surfaces

### F1. Revisitable setup guide (M, backend dependency BE-12 for per-user preferences)

Create `src/components/guidance/setup-guide-sheet.tsx`, `use-setup-progress.ts`, `src/lib/api/resources/preferences.ts`. Modify `help-menu.tsx` (add "Setup guide").

- `Sheet side="inline-end"` with a checklist computed from real data: workspace named, first channel connected (`useConnections`), remembered targets on, first post scheduled (dashboard summary), first post published, teammate invited. Each row links to the screen with `?guide={step}`; the screen may highlight one control through `data-guide-target`.
- Dismissed and completed flags persist in **BE-12** `GET/PATCH /v1/me/preferences` (`{ guide: { dismissedAt }, coachmarks: { seen: string[] } }`). Fallback to `localStorage['pa:prefs:' + userId]` until BE-12 exists, behind one adapter.
- `onboarding/page.tsx:49-52` keeps its redirect; the guide is how onboarding is revisited.

### F2. Coachmarks (M)

Create `src/components/guidance/coachmark.tsx`, `coachmark-catalog.ts`, `use-coachmarks.ts`.

- Exactly three, listed in the catalog and gated by a test that counts them: `compose-button` (shell), `calendar-move` (first visit to calendar with at least one entry), `target-overrides` (composer, first time a second target is added). Anchors carry `data-coachmark="<id>"`.
- `Popover` (non-modal), `role="dialog"` with `aria-labelledby`, a "Got it" `Button` and Esc; one at a time; never while a drag is active or a dialog is open; never on the first paint (wait for idle). Seen ids persist via F1's adapter.
- Motion: `.relay-pop-in` (200ms). Reduced motion: appears without animation (CSS override).

### F3. Empty states, one action each (S per screen)

Audit every signed-in screen and give each an `EmptyState` with exactly one `action` (the screen's primary, vermilion) and an `example`. Mapping to add as keys in `states.ts`:

| Screen | Title | One action |
| --- | --- | --- |
| Home queue | Nothing needs you today | Compose a post |
| Calendar | No posts scheduled this {view} | New post |
| Library | No media yet | Upload |
| Library sets | No sets yet | Create a set |
| Connections | No accounts connected | Connect an account |
| Analytics | No data for this period | Change period |
| Approvals | Nothing waiting for approval | (secondary only: Go to calendar) |
| Automation | No automations | New rule |

`EmptyScene` stays for first-run scenes (it is in the expressive allow-list, and currently declines it).

### F4. Contextual help sheet (M)

Create `src/components/shell/help-sheet.tsx`, `help-catalog.ts`. Modify `help-menu.tsx` ("How this screen works").

- The catalog maps the first route segment after the locale (`home`, `calendar`, `compose`, `library`, `analytics`, `connections`, `settings`, `automation`, `approvals`) to keys `help.screen.<segment>.title`, `.summary`, `.stepCount`, `.step1`..`.stepN`, `.shortcutsNote`. Numbered keys because ICU messages cannot hold arrays.
- `Sheet side="inline-end"` with the steps as an `<ol>`, a "Keyboard shortcuts" button opening the shortcuts dialog, and the docs link. Falls back to a generic entry for unmapped routes.

### F5. Shortcuts truth (covered by B8)

The dialog renders from `shortcut-catalog.ts`; a test guarantees each entry is bound.

### F6. System theme (M, design-system)

- `use-theme.tsx`: `ThemePreference = 'light' | 'dark' | 'system'`; `resolvedTheme` derives from `prefers-color-scheme` when `system` and subscribes to the media query change; `themeBootstrapScript` resolves `system` before first paint the same way. Stored `light`/`dark` values keep working; nothing stored still resolves from the media query (no behaviour change for existing users).
- `theme-picker.tsx` becomes a `DropdownMenuRadioGroup` with three explicit items (Light, Dark, Match system), each with a lucide icon (`Sun`, `Moon`, `Monitor`) and text. Update its doc comment: both designs are still finished designs; "system" is an explicit third choice, not a silent default.
- AC: no flash on load in any of the three states (Playwright screenshot of first paint for each); the contrast test suite is unchanged; the account menu and marketing header share the component.

---

## G. Motion and feel

### G1. Interaction motion table

CSS means the `relay-anim-*` class or a `transition` utility with token durations. GSAP is only used where an element must be measured or persists across a layout change.

| Interaction | Property | Duration | Ease | CSS or GSAP |
| --- | --- | --- | --- | --- |
| Button hover | background, colour | 120ms | standard | CSS |
| Button press | `scale(0.98)` | 80ms | standard | CSS `:active` |
| Focus ring | none (appears instantly) | 0 | | CSS |
| Popover, dropdown, tooltip open | opacity, scale 0.97 to 1 | 200ms (`relay-pop-in`, fixed) | out-expo | CSS |
| Popover close | opacity | 120ms | exit | CSS (Radix `data-state=closed`) |
| Dialog open | opacity, scale | 400ms expressive-sm (overlay entrance is allowed) | out-expo | CSS |
| Sheet open | logical slide | 400ms expressive-sm (`relay-sheet-enter`) | out-expo | CSS |
| Sheet close | logical slide out | 200ms | exit | CSS |
| Toast enter | inline-end slide 8px + opacity | 160ms (`relay-anim-enter-toast`) | entrance | CSS |
| Toast exit | opacity | 120ms | exit | CSS |
| List reorder (thread items, sets) | Flip of persistent rows | 160ms | standard | GSAP `Flip` |
| Calendar chip drag lift | `scale(1.02)`, shadow token | 120ms | standard | GSAP (exists) |
| Calendar chip drop settle | translate to slot | 120ms | out-back | GSAP (exists) |
| Skeleton shimmer | background-position loop | 1600ms loop token | standard | CSS |
| Status pill change | colour, icon swap | 120ms | standard | CSS |
| `LiveBadge` settle | dot settle, icon draw | CSS keyframes (exists) | | CSS |
| Nav active marker | translate, width | 160ms | standard | GSAP `Flip` (exists) |
| Page transition (app) | opacity + 8px rise | 120ms | entrance | GSAP (exists) |
| Tab switch content | opacity | 120ms | entrance | CSS `relay-anim-fade-in` |
| Segmented control thumb | translate | 160ms | standard | GSAP `Flip` |
| Calendar view switch | crossfade | 120ms | standard | GSAP (exists) |
| Calendar period step | 16px logical slide | 120ms | standard | GSAP (exists) |
| Upload progress bar | `inline-size` via `Progress` | none (value updates are data) | | none |
| Upload complete | `LiveBadge` false to true | CSS | | CSS |
| Counter over limit | colour | 120ms | standard | CSS |
| Publish celebration | burst | 900ms | | GSAP (exists, gated) |
| Compose button magnetic | pointer follow | quickTo | | GSAP (exists, gated) |
| Origin continuity (C9) | transform | 200ms | out-expo | GSAP |

Anything that changes a number is not animated. Anything that moves a text caret or blocks typing is not animated.

### G2. Keyframes and the off-scale literals (S)

- Keyframes live only in `theme.css` under the existing `@layer utilities` block, named `relay-*`, using only `opacity`, `transform`, `scale`, `translate`, and `background-position` (shimmer). Durations and eases reference tokens.
- Add loop tokens to the motion block: `--duration-loop-spin: 900ms` and `--duration-loop: 1600ms`, documented as continuous indicators rather than transitions.
- Fix `:1321` `.relay-pop-in` to `var(--duration-slow)` (200ms; in-app popovers must not take 320ms).
- Fix `:1254` `.relay-anim-spin` to `var(--duration-loop-spin)`; `:1250` and `:1405` to `var(--duration-loop)`.
- Add `packages/design-system/src/tokens/motion-literals.test.ts`: reads `theme.css`, fails on any `\d+(ms|s)` inside an `animation:` or `transition:` declaration that is not inside the token declaration block.
- Add `apps/web/src/test/no-tailwind-animate.test.ts`: fails on `animate-(spin|pulse|bounce|ping)` in `src/**` (they resolve to `animate-none` today, so they are dead classes); replace with `relay-anim-*`.

### G3. SegmentedControl primitive (S, design-system)

Create `packages/design-system/src/primitives/segmented-control.tsx`: Radix `ToggleGroup type="single"` with a measured thumb. Design-system stays CSS-only, so the thumb inside the package uses a CSS `translate` transition (160ms standard) positioned from measured rects; the app may wrap it with `Flip` if the measured approach misbehaves under RTL, but the CSS version must already land correctly because it positions from rects. Replace the four duplicates: `features/calendar/view-switch.tsx`, `features/growth/plan-tabs.tsx`, `features/connections/connections-tabs.tsx`, `features/marketing/.../price-toggle.tsx`. Props: `items: { value, label, icon? }[]`, `value`, `onValueChange`, `aria-label`, `size`.

### G4. Typography (S)

- Add utilities in `theme.css`: `.type-title` (Fraunces, `font-optical-sizing: auto`, `font-variation-settings: 'opsz' 144` at 28px and up), `.num` (`font-variant-numeric: tabular-nums`), `.mono-id` (JetBrains Mono, `letter-spacing: 0`, `font-size: 0.9375em`).
- Apply: `PageHeader` titles get `.type-title`; `MetricValue`, table numeric cells, counters and timestamps get `.num`; `Code` and `CopyableSecret` already use mono; add `.mono-id` to handles in the preview header, ids in receipts and `Timeline` timestamps.
- No font family, weight scale or size scale changes.

---

## H. Performance and robustness

### H1. HydrationBoundary pattern (M)

Create `src/lib/api/server-query.ts`: `getServerQueryClient()` wrapped in React `cache()`, `prefetch(queryClient, key, fn)` helper, and `withDehydratedState(queryClient, children)` rendering `<HydrationBoundary state={dehydrate(queryClient)}>`. Server-side `api` calls need the request cookies; reuse the `forward` mechanism `composer-gateway.ts` already uses. Apply first to `home/page.tsx` (dashboard summary, action center), `calendar/page.tsx` (first range), `connections/page.tsx`, `library/page.tsx`. Keys must be produced by the same `keys.*` functions with the session's workspace id, otherwise the client refetches and the double fetch stays.

### H2. Images (S)

`next.config.ts`: add `images.remotePatterns` for provider avatar CDNs (one entry per provider with a comment naming the provider; unlisted hosts fall back to `Avatar` initials) and the object storage host from `NEXT_PUBLIC_MEDIA_HOST`. Use `next/image` for avatars only; signed thumbnails stay `<img>` (E1).

### H3. Bundle analyzer (S)

`apps/web/package.json`: `@next/bundle-analyzer` devDependency and `"analyze": "ANALYZE=true next build"`; wrap the config when `ANALYZE` is set. Record the baseline route sizes in `docs/runbooks/web-bundle.md`.

### H4. Route loading and error coverage (S per route)

Create `loading.tsx` and `error.tsx` for `home`, `analytics` (+ `experiments`, `links`, `posts/[postId]`, `reports`), `growth`, `action-center`, `assistant`, `automation` (+ children), `approvals/[approvalId]`, `settings` (+ tabs), `calendar/queue`, `library/sets`. Each `loading.tsx` uses `LoadingState`, `SkeletonTable` or `SkeletonList` shaped like the screen (a table skeleton for tables, never a spinner for a whole page). Each `error.tsx` uses `ErrorState` with `reset` and reports through H5.

### H5. Error reporting (M)

Create `src/lib/observability/report-error.ts` (redacts query strings and emails, samples 100 percent of errors, batches, `navigator.sendBeacon` when leaving), route handler `src/app/api/client-errors/route.ts` forwarding to **BE-13** `POST /v1/client-errors` (or to Sentry when `SENTRY_DSN` is set, server-side only), and `src/components/shell/error-reporter.tsx` attaching `error` and `unhandledrejection` listeners, mounted in `providers.tsx`. Decision: minimal endpoint first; the Sentry browser SDK is a later swap behind the same `reportError` function.

### H6. Realtime through the SSE endpoint (M)

Create `src/lib/realtime/use-workspace-events.ts`: one `EventSource` to `GET /v1/events` per workspace, mounted in `app-shell.tsx`, reconnect with backoff, and a `connected` state exposed for `LiveBadge` in the shell. Event mapping to invalidations: `post.status` invalidates `keys.contentItem` and `keys.calendar` ranges containing it; `receipt.updated` invalidates `keys.receipt` and `keys.receipts`; `action_item.created` invalidates `keys.actionCenter` and the 60s poll in `hooks.ts:74-83` becomes a fallback only while the stream is disconnected; `upload.scanned` invalidates `keys.media` and the asset. Post detail stops needing polling.

### H7. Service worker (M)

`apps/web/public/sw.js` hand-written: precache the offline page (`/offline`, a new static route), fonts and the CSS; network-first for navigations with the offline page as fallback; never cache `/v1/*` or anything with `Authorization`; no outbox and no background sync (a replayed mutation is a duplicate post). Register in `src/components/shell/service-worker-registration.tsx` in production only. Add `useOnline` to the design system (`hooks/use-online.ts`, `useSyncExternalStore` on `online`/`offline`), move `features/analytics/use-online-status.ts` onto it, and mount `OfflineBanner` in the shell.

### H8. Playwright env fix (S)

`playwright.config.ts:36`: rename to `NEXT_PUBLIC_POSTARRAY_DEMO_MODE`. Add an assertion in `e2e/smoke.spec.ts` that `/home` renders the demo notice, so the axe suite can never silently audit error pages again.

### H9. Screen render tests and the catalogue (M, then S per screen)

- Create `src/test/render-screen.tsx`: renders a screen inside `IntlProvider` (English catalog), a fresh `QueryClient`, `SessionProvider` with the demo session fixture, `AnnouncerProvider`, `TooltipProvider`, `Toaster`.
- Create `src/test/screen-states.ts`: seven state factories that mock `@/lib/api` per state: `loading` (pending promise), `empty`, `error`, `partial` (a `Paginated` with one failed target), `offline` (`navigator.onLine` false plus network error), `permissionDenied` (403 `ApiError`), `rateLimited` (429 with reset).
- One `*.test.tsx` per screen (`home-screen`, `calendar-screen`, `composer-screen`, `library-screen`, `analytics-overview-screen`, `connections`, `receipt-screen`, `settings/billing`) iterating the seven states and asserting the expected primitive is present (`LoadingState`, `EmptyState`, `ErrorState`, `PartialSuccessNotice`, `OfflineBanner`, `PermissionDenied`, `RateLimitNotice`) and that axe (`vitest-axe` or the existing testing setup) reports no violations.
- Design system: `packages/design-system/src/patterns/states.test.tsx` covering the seven state patterns' render and ARIA (none has a test today).
- Catalogue: `src/app/[locale]/(dev)/catalogue/page.tsx` calling `notFound()` in production, listing every screen times seven states using the same factories. This is the Storybook substitute: one URL a reviewer opens. No snapshot tests (they rot).

---

## I. Sequencing: four two-week sprints, three to four devs

Lanes are directories. Two devs never touch the same file in the same sprint. Backend dependencies (BE-n) are listed in section 11 and are requested in sprint 1 so they land by sprint 2.

### Sprint 1: foundations and quick wins

| Dev | Lane | Tasks |
| --- | --- | --- |
| A | `packages/design-system` | G3 SegmentedControl, G2 literals and tests, G4 typography utilities, B8 hotkeys fix, `useOnline`, `DiffView.onAcceptSegment` |
| B | `features/composer/previews/` | A: types, model, counter, truncation, presentation rules, frame, parts (no providers yet) |
| C | `features/calendar/`, `app/(app)/calendar`, `app/(app)/library/sets` | C4, C5, C6, C7, C8 routes, C3 |
| D (if 4) | `apps/web` cross-cutting | H8, H3, H4 (loading/error for all routes), H9 harness and first two screen tests |

Parallel-safe: lanes do not overlap. Dev B waits for nothing (thumbnails render the skeleton until BE-1).

### Sprint 2: composer and previews

| Dev | Lane | Tasks |
| --- | --- | --- |
| A | `packages/design-system` | B9 DateTimeField (all four files, time zone utils), `patterns/states.test.tsx` |
| B | `features/composer/previews/providers/` | Ten provider previews, `preview-host`, `media-strip` thumbnails (BE-1 landed), device toggle |
| C | `features/composer/` (not `previews/`), `components/link.tsx`, `lib/navigation` | B1 action bar, B2 guard and mirror, B4 batched autosave, B11 remember affordance |
| D | `features/media/`, `lib/api/deferred-action.ts` | E1 thumbnail component (shared, B consumes it), E2 delete and undo, E4 paste, E5 view cookie |

Dependency: B consumes E1's `MediaThumbnail`; D lands it in the first two days and B uses a stub until then.

### Sprint 3: AI, calendar feel, analytics kit

| Dev | Lane | Tasks |
| --- | --- | --- |
| A | `packages/design-system/src/charts/` | D1 chart kit, chart tokens and contrast entries |
| B | `features/composer/assist/`, `lib/text/` | B5 assist popover, B6 mention and hashtag helpers, B7 thread items, B3 variant persistence (BE-2 landed), B10 quick-create and lazy create |
| C | `features/calendar/`, `lib/motion/origin-continuity.ts`, `features/composer/components/composer-header.tsx` (only this file in composer) | C1 avatars (BE-6), C2 touch, C9 continuity, schedule sheet swap to `DateTimeField` |
| D | `features/media/`, `components/guidance/`, `components/shell/help-*` | E3 search and paging (BE-10), E5 alt-text AI (BE-11), F1 setup guide, F2 coachmarks, F4 help sheet |

Conflict watch: C touches `composer-header.tsx` only; B stays out of it.

### Sprint 4: analytics screens, reporting, robustness, theme

| Dev | Lane | Tasks |
| --- | --- | --- |
| A | `packages/design-system/src/hooks/use-theme.tsx`, `components/theme-picker.tsx`, `apps/web` shell | F6 system theme, H6 SSE hook and shell `LiveBadge`, H7 service worker and `OfflineBanner` |
| B | `features/analytics/` (overview, post detail, queries, export) | D2 overview and boundary fix, D3 post series (BE-7), D4 CSV |
| C | `features/analytics/report/`, `app/(app)/analytics/reports`, `app/(public)/r/[token]` | D5 client report and print stylesheet (BE-8) |
| D | `lib/api/server-query.ts`, route pages, `lib/observability/`, `next.config.ts` | H1 hydration on four routes, H2 images, H5 error reporting, F3 empty states across screens, remaining H9 screen tests |

### After sprint 4 (small fixes bundle, S each, any dev)

Auth: client validation on `sign-in-form.tsx` and sign-up with `Field` errors; stop hardcoding `acceptedTerms` (`:61`) behind a real `Checkbox`; collapse the three identical tabs into one form; Google sign-in button wired to the API's OAuth start route once it exists (**BE-14**). Billing: `billing-screen.tsx:149-162` reads `tierKey`/`activeProjects` from the entitlement view (**BE-15**); the interval radio opens a `ConfirmDialog` before checkout (`:249-271`); referrals stub becomes an `EmptyState` with "Unavailable" wording. Home: `digest-card.tsx:29` renders the digest when `dashboard.service.ts:161-164` starts returning one (**BE-16**), and until then the card is removed rather than promising it. Onboarding: remove the duplicate OAuth notice (`compose/page.tsx:17` vs `compose-step.tsx:185,213`), add Back, add Skip on the plan step, source providers from `useAvailableProviders()` instead of the hardcoded four (`connect-step.tsx:27-69`), and fix "unknown" in `done-step.tsx:85` by reading the provider from the connection.

---

## 11. Backend dependencies to hand to the API agent

| Id | Endpoint or field | Needed by |
| --- | --- | --- |
| BE-1 | `GET /v1/media/{id}/read-urls` returning signed thumbnail, poster and original URLs with `expiresAt` | A, B7, C1, E1 |
| BE-2 | `ContentItemView.variants[].settings` on read; `PATCH /v1/content/{id}/variants/{variantId}/settings` | B3 |
| BE-3 | `PUT /v1/content/{id}/composite` (master + targets + variants in one write) | B4 |
| BE-4 | `POST /v1/assistant/rewrites` (adapt, shorten, hook_options, cta_options, tone) | B5 |
| BE-5 | `GET /v1/connections/{id}/mentions?q=` (official lookup only) | B6 |
| BE-6 | `CalendarEntryView.connectionId`, `.avatarUrl` | C1 |
| BE-7 | `GET /v1/analytics/posts/{id}/series` | D3 |
| BE-8 | `POST /v1/analytics/reports`, `DELETE /v1/analytics/reports/{id}`, `GET /v1/public/reports/{token}` | D5 |
| BE-9 | `MediaAssetView.usage { draftCount, scheduledCount }` | E2 |
| BE-10 | `GET /v1/media?q=&sort=` | E3 |
| BE-11 | `POST /v1/assistant/alt-text-suggestions` | E5 |
| BE-12 | `GET/PATCH /v1/me/preferences` | F1, F2 |
| BE-13 | `POST /v1/client-errors` | H5 |
| BE-14 | Google OAuth sign-in start and callback | Auth fixes |
| BE-15 | Entitlement view with `tierKey`, `activeProjects` | Billing fixes |
| BE-16 | Dashboard digest populated from the weekly digest workflow | Home |
| Given | `GET /v1/events` SSE with `post.status`, `receipt.updated`, `action_item.created`, `upload.scanned` | H6 |

## 12. Definition of done for the whole plan

- `pnpm verify` green, including the new gates: `motion-literals.test.ts`, `no-tailwind-animate.test.ts`, `previews/brand-colour.test.ts`, coachmark count test, shortcut catalog binding test, `app-motion-tier.test.ts` unchanged at three moments.
- Playwright axe passes on `/home`, `/compose`, `/calendar`, `/calendar/queue`, `/library`, `/library/sets`, `/analytics`, `/analytics/reports`, `/r/{demo-token}` in both themes and in the pseudo-locale.
- No `framer-motion`, no `d3-*`, no GSAP outside `lib/motion` and `components/motion`, no workspace import in the design system.
- Every new screen or state renders through the seven-state harness with a test.
- Every new string is a catalog key; the catalog lint passes with no em dashes.
