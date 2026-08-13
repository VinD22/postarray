/**
 * The scene vocabulary's marketing-side compositions.
 *
 * The motion primitives themselves (`ScrollScene`, `ParallaxLayer`,
 * `SceneSequencer`, `CelebrationBurst`, `LiveBadge`) live in
 * `apps/web/src/components/motion` and are generic. What is exported here is
 * the marketing surface built on top of them, plus the governance that keeps
 * the whole vocabulary honest: read `scene-budget.test.ts` and `README.md` in
 * this directory before reaching for any of it.
 */
export { ColorBand, type ColorBandProps, type SceneAccent } from './color-band';
export { GradientWash, type GradientWashProps, type GradientWashPlacement } from './gradient-wash';
export { Sticker, type StickerProps, MAX_STICKER_TILT_DEGREES, clampTilt } from './sticker';
export { TourIndicator, type TourIndicatorProps } from './tour-indicator';
