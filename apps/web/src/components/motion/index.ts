export { Reveal, type RevealProps } from './reveal';
export { StaggerList, type StaggerListProps } from './stagger-list';
export { KineticHeadline, type KineticHeadlineProps } from './kinetic-headline';
export { Marquee, type MarqueeProps } from './marquee';
export { PinnedScene, type PinnedSceneProps } from './pinned-scene';
export { Magnetic, type MagneticProps, MagneticButton, type MagneticButtonProps } from './magnetic';
export { CountUp, type CountUpProps } from './count-up';
export {
  PageTransitionProvider,
  type PageTransitionProviderProps,
} from './page-transition-provider';

/* The scene vocabulary (Track B). Budgeted per page by
   `features/marketing/components/scene/scene-budget.test.ts` — read that file
   before reaching for any of these. */
export {
  SceneSequencer,
  type SceneSequencerProps,
  type SceneSequencerHandle,
  type SceneSequencerControlLabels,
  type SequencerScene,
} from './scene-sequencer';
export { ParallaxLayer, type ParallaxLayerProps } from './parallax-layer';
export {
  ScrollScene,
  type ScrollSceneProps,
  type ScrollSceneBackground,
  type ThemeTokenName,
} from './scroll-scene';
export {
  CelebrationBurst,
  type CelebrationBurstProps,
  type CelebrationTier,
} from './celebration-burst';
export { LiveBadge, type LiveBadgeProps } from './live-badge';
