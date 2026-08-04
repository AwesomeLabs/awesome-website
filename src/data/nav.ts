import { LINKS } from '@/config';

export type NavLink = { label: string; href: string };

/**
 * Header nav. The in-page anchors are written root-relative ("/#products")
 * rather than bare ("#products") — the same header renders on /team/,
 * /privacy/ and /terms/, where a bare hash would resolve to a section that
 * page does not have.
 */
export const navLinks: NavLink[] = [
  { label: 'Our Apps', href: '/#products' },
  { label: 'Team', href: '/team/' },
  { label: 'Work With Us', href: '/#work' },
];

/**
 * Footer links. The handoff's prototype points all three at #contact, which
 * is placeholder wiring; Team and Privacy are real pages on this site.
 * Terms is added here — it is a real page and the client asked for it to stay
 * indexed, so leaving it unlinked would orphan it.
 */
export const footerLinks: NavLink[] = [
  { label: 'Team', href: '/team/' },
  { label: 'Contact', href: LINKS.hello },
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
];
