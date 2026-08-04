import type { ImageMetadata } from 'astro';
import jeremy from '@/assets/jeremy-gollehon.png';
import bob from '@/assets/bob-troia.png';

/**
 * SOURCING — read before editing.
 *
 * The bios below started from the founder bios on supptrack.app/about, which
 * the founders wrote themselves. Treat the current wording as author-approved.
 *
 *
 * Photos are the founder portraits from the SuppTrack site, copied here with
 * the `-supptrack` suffix stripped.
 */

export type TeamMember = {
  name: string;
  role: string;
  photo: ImageMetadata;
  /**
   * Two sentences at most, about track record rather than a skills list.
   * Deliberate: this page is read for credibility, and a stack rundown dates
   * faster than a career does. Each clause below is traceable to a first-party
   * source — see the SOURCING note above.
   */
  bio: string;
  /**
   * Exactly two destinations, as separate fields rather than a link array:
   * the page renders a specific icon for each, so an arbitrary list would
   * imply a generality the markup does not have.
   */
  linkedin: string;
  x: string;
};

export const team: TeamMember[] = [
  {
    name: 'Bob Troia',
    role: 'Co-founder',
    photo: bob,
    bio: 'Entrepreneur, technologist, biohacker, and citizen scientist, with twenty-plus years across full-stack development, data, and health tech. He has been building since the earliest days of the web, and has founded and exited several companies.',
    linkedin: 'https://linkedin.com/in/troia',
    x: 'https://twitter.com/BobTroia',
  },
  {
    name: 'Jeremy Gollehon',
    role: 'Co-founder',
    photo: jeremy,
    bio: 'Product and engineering leader focused on consumer health and wellness, with over ten years building the mobile-first products behind everything the studio ships. He came to it from finance, after years building software in the hedge fund world.',
    linkedin: 'https://linkedin.com/in/jeremygollehon',
    x: 'https://twitter.com/gollyjer',
  },
];
