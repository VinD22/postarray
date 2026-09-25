'use client';

/**
 * The Growth Advisor plan's tab switcher: strategy, four week, UGC,
 * opportunities, tools.
 *
 * Five peer sections of one generated plan, wearing the segmented control's
 * surface: one sunken track, one sliding chip. It stays `Tabs` rather than
 * `SegmentedControl` because each section is a real panel, so the control owns
 * `aria-controls` and each section is a `tabpanel`. See
 * `features/connections/connections-tabs.tsx`, which made the same call for the
 * same reason.
 *
 * The chip is `useSegmentedThumb` from the design system, shared with every
 * other segmented surface in the product, replacing a per-file GSAP Flip copy.
 * `TabsList` keeps its own horizontal scroll, so five labels never force
 * page-level overflow at 360px.
 */

import { useRef, type ReactNode } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  segmentedItem,
  segmentedThumb,
  segmentedTrack,
  useSegmentedThumb,
} from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

export interface GrowthPlanTab {
  readonly value: string;
  readonly label: ReactNode;
}

export interface GrowthPlanTabsProps {
  tabs: readonly GrowthPlanTab[];
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name for the whole control. */
  label: string;
  className?: string;
  children: ReactNode;
}

export function GrowthPlanTabs({
  tabs,
  value,
  onValueChange,
  label,
  className,
  children,
}: GrowthPlanTabsProps): ReactNode {
  const listRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  useSegmentedThumb({ trackRef: listRef, thumbRef, value, itemCount: tabs.length });

  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList ref={listRef} aria-label={label} className={cn(segmentedTrack, 'inline-flex')}>
        <span ref={thumbRef} aria-hidden="true" className={segmentedThumb} />
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            data-segment-value={tab.value}
            className={cn(segmentedItem(), 'mb-0 border-b-0 data-[state=active]:border-b-0')}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
