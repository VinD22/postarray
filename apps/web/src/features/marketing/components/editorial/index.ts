/**
 * The editorial marketing vocabulary.
 *
 * This is the replacement for `components/loud/`, which was drawn for the
 * poster palette: heavy outlines, hard offset shadows, rotated stickers with
 * starburst clip paths, colour-blocked bands and a bordered-chip logo
 * marquee. Rendered in the muted terracotta-on-paper tokens those forms read
 * as the loud system wearing grey, which is worse than either system alone.
 *
 * The mapping, for anyone migrating a page that still imports `loud/`:
 *
 *   loud/poster-card   PosterCard          -> EditorialCard
 *   loud/band          Band                -> EditorialSection
 *   loud/cta-slab      CtaSlab             -> ClosingCta
 *   loud/sticker       Sticker (info)      -> Eyebrow
 *   loud/sticker       Sticker (decor)     -> deleted, not replaced
 *   loud/display       LoudDisplay         -> EditorialDisplay
 *   loud/big-number    BigNumber           -> EditorialBigNumber
 *   loud/vs-table      VsTable             -> EditorialVsTable
 *   loud/price-toggle  PriceToggle         -> EditorialPriceToggle
 *   loud/price-toggle  PricePlanBlock      -> EditorialPricePlanBlock
 *   loud/hero-platform-cycler HeroPlatformCycler -> EditorialPlatformCycler
 *   loud/logo-marquee  LogoMarquee         -> ProviderGrid
 *   loud/variant-scene VariantScene        -> EditorialVariantScene
 *
 * `loud/band`'s `ZigzagEdge` is the one export with no editorial equivalent:
 * the torn-paper seam is a poster device, and the seam between two editorial
 * sections is whitespace or a hairline.
 */
export { EditorialCard, type EditorialCardProps, type EditorialCardTone } from './card';
export {
  EditorialSection,
  type EditorialSectionProps,
  type EditorialSectionTone,
} from './section';
export { ClosingCta, type ClosingCtaProps } from './closing-cta';
export { Eyebrow, type EyebrowProps, type EyebrowTone } from './eyebrow';
export {
  EditorialDisplay,
  type EditorialDisplayProps,
  type EditorialDisplaySize,
} from './display';
export { LineMaskHeadline, type LineMaskHeadlineProps } from './line-mask-headline';
export { EditorialBigNumber, type EditorialBigNumberProps } from './big-number';
export {
  EditorialVsTable,
  type EditorialVsTableColumn,
  type EditorialVsTableProps,
  type EditorialVsTableRow,
} from './vs-table';
export {
  EditorialPriceToggle,
  type EditorialPriceToggleProps,
  EditorialPricePlanBlock,
  type EditorialPricePlanBlockProps,
  type BillingInterval,
} from './price-toggle';
export {
  EditorialPlatformCycler,
  type EditorialPlatformCyclerProps,
} from './platform-cycler';
export { ProviderGrid, type ProviderGridProps } from './provider-grid';
export {
  EditorialVariantScene,
  type EditorialVariantSceneProps,
  type EditorialVariantRow,
} from './variant-scene';
