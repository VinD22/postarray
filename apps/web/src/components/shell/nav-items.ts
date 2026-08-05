import {
  BarChart3,
  CalendarDays,
  FolderOpen,
  House,
  Plug,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

/**
 * The six primary destinations. Fixed, in this order, on every screen.
 *
 * Compose is not here. It is a persistent primary action in the shell, because
 * composing is something you start from anywhere, not a place you go. AI is
 * deliberately not here either: AI actions are verbs inside the composer, the
 * calendar and analytics.
 *
 * Each item answers exactly one question, which is the test for adding a
 * seventh: if it does not answer a new question, it belongs in Settings or in
 * the Action center.
 */
export interface NavItem {
  readonly id: string;
  readonly href: string;
  /** Catalog key for the label. Never an English literal. */
  readonly labelKey: string;
  readonly icon: LucideIcon;
  /** Shown in the compact bottom bar on small screens. */
  readonly inBottomBar: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', href: '/home', labelKey: 'nav.home', icon: House, inBottomBar: true },
  {
    id: 'calendar',
    href: '/calendar',
    labelKey: 'nav.calendar',
    icon: CalendarDays,
    inBottomBar: true,
  },
  {
    id: 'automation',
    href: '/automation',
    labelKey: 'nav.automation',
    icon: Workflow,
    inBottomBar: false,
  },
  {
    id: 'analytics',
    href: '/analytics',
    labelKey: 'nav.analytics',
    icon: BarChart3,
    inBottomBar: true,
  },
  {
    id: 'library',
    href: '/library',
    labelKey: 'nav.library',
    icon: FolderOpen,
    inBottomBar: false,
  },
  {
    id: 'connections',
    href: '/connections',
    labelKey: 'nav.connections',
    icon: Plug,
    inBottomBar: false,
  },
];

/** True when `pathname` is inside this destination. */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.href === '/home') {
    return pathname === '/home';
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
