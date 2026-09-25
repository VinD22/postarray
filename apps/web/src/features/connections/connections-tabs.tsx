'use client';

/**
 * The Connections screen's tab switcher: accounts, capabilities, groups.
 *
 * Three peer views of the same account list, so this wears the segmented
 * control's surface: one sunken track, one sliding chip. It stays `Tabs` and
 * not `SegmentedControl` for one reason, and it is not cosmetic. Each of the
 * three views is a real panel with real content, so the control owns
 * `aria-controls` and each panel is a `tabpanel`. Turning that into a radio
 * group would drop the relationship and leave three unlabelled regions.
 *
 * The chip itself is `useSegmentedThumb` from the design system, shared with
 * `SegmentedControl` and with the Growth plan's switcher. It replaces a GSAP
 * Flip copy that lived here, an identical one in `features/growth/plan-tabs.tsx`
 * and a third in `features/calendar/view-switch.tsx`. A CSS transition over a
 * measured offset does the same job, needs no reduced-motion branch because
 * the global override reaches it, and does not load an animation library to
 * move a rectangle 90 pixels.
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

export interface ConnectionsTab {
  readonly value: string;
  readonly label: ReactNode;
}

export interface ConnectionsTabsProps {
  tabs: readonly ConnectionsTab[];
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name for the whole control. */
  label: string;
  className?: string;
  /** Wraps the tab strip only, so callers can align it with page padding. */
  listWrapperClassName?: string;
  children: ReactNode;
}

export function ConnectionsTabs({
  tabs,
  value,
  onValueChange,
  label,
  className,
  listWrapperClassName,
  children,
}: ConnectionsTabsProps): ReactNode {
  const listRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  useSegmentedThumb({ trackRef: listRef, thumbRef, value, itemCount: tabs.length });

  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <div className={listWrapperClassName}>
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
      </div>
      {children}
    </Tabs>
  );
}
