import {
  BarChart3,
  MessagesSquare,
  CalendarDays,
  FolderOpen,
  House,
  Layers,
  ListOrdered,
  Plug,
  Sprout,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

/**
 * The eight primary destinations. Fixed, in this order, on every screen.
 *
 * The assistant earns the eighth slot on the same test the others answer: it
 * is the only place you can say what you want in your own words and be shown,
 * before anything happens, exactly what would happen. It is a destination
 * rather than a verb inside another screen because a conversation has to be
 * somewhere you can come back to. It never acts on its own: every action it
 * proposes goes through the same confirmation a person approves by hand.
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
/**
 * A destination that lives inside one of the eight, not beside them.
 *
 * Sub items exist so a screen can be reachable without becoming a ninth
 * primary destination. They answer a narrower question than their parent does
 * ("when is this project willing to post" is a detail of the calendar, not a
 * rival to it), so they are shown only while their section is open.
 */
export interface NavSubItem {
  readonly id: string;
  readonly href: string;
  /** Catalog key for the label. Never an English literal. */
  readonly labelKey: string;
  readonly icon: LucideIcon;
}

export interface NavItem {
  readonly id: string;
  readonly href: string;
  /** Catalog key for the label. Never an English literal. */
  readonly labelKey: string;
  readonly icon: LucideIcon;
  /** Shown in the compact bottom bar on small screens. */
  readonly inBottomBar: boolean;
  /** Revealed in the rail while this destination is the active one. */
  readonly subItems?: readonly NavSubItem[];
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', href: '/home', labelKey: 'nav.home', icon: House, inBottomBar: true },
  {
    id: 'calendar',
    href: '/calendar',
    labelKey: 'nav.calendar',
    icon: CalendarDays,
    inBottomBar: true,
    subItems: [
      {
        id: 'queue',
        href: '/calendar/queue',
        // The screen's own title key. Nav has no separate word for this
        // destination and inventing one would be two strings to keep in step.
        labelKey: 'queue.title',
        icon: ListOrdered,
      },
    ],
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
    id: 'assistant',
    href: '/assistant',
    // The screen's own title key. Nav has no separate word for this
    // destination, and inventing one would be two strings to keep in step.
    labelKey: 'assistantWeb.title',
    icon: MessagesSquare,
    inBottomBar: false,
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
    subItems: [
      {
        id: 'sets',
        href: '/library/sets',
        // The screen's own title key, for the same reason as the queue above.
        labelKey: 'set.title',
        icon: Layers,
      },
    ],
  },
  {
    id: 'connections',
    href: '/connections',
    labelKey: 'nav.connections',
    icon: Plug,
    inBottomBar: false,
  },
];

/** True when `pathname` is exactly this sub destination. */
export function isNavSubItemActive(item: NavSubItem, pathname: string): boolean {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** True when `pathname` is inside this destination. */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.href === '/home') {
    return pathname === '/home';
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
