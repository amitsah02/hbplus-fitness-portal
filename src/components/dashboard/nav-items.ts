export type Section =
  | 'Overview'
  | 'My Profile'
  | 'Fitness Resources'
  | 'Security'
  | 'User Management';

export type NavItem = {
  key: Section;
  icon: string;
  /** Shown only to admins. */
  adminOnly?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { key: 'Overview', icon: '⌂' },
  { key: 'My Profile', icon: '◉' },
  { key: 'Fitness Resources', icon: '⚒' },
  { key: 'Security', icon: '◇' },
  { key: 'User Management', icon: '⚙', adminOnly: true },
];
