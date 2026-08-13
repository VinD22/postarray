import {
  BarChart3,
  CalendarDays,
  FolderOpen,
  House,
  Plug,
  Sprout,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

/**
 * The seven primary destinations. Fixed, in this order, on every screen.
 *
 * Compose is not here. It is a persistent primary action in the shell, because
 * composing is something you start from anywhere, not a place you go. AI as a
 * category is deliberately not here either: AI actions are verbs inside the
 * composer, the calendar and analytics.
 *
 * Each item answers exactly one question, which is the test for adding an
 * eighth: if it does not answer a new question, it belongs in Settings or in
 * the Action center. Growth earns its slot on that test rather than on being
 * an AI feature. It answers "what should I be posting, and where should I be
 * growing", which nothing else answers: Home reports what happened, Analytics
 * explains it, and Calendar shows what is already committed. It is not gated by
 * tier and not behind a flag; when assistance is not configured the screen says
 * so, in its own words.
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
    id: 'growth',
    href: '/growth',
    // The screen's own title key. Nav has no separate word for this
    // destination, and inventing one would be two strings to keep in step.
    labelKey: 'growth.title',
    icon: Sprout,
    inBottomBar: false,
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
