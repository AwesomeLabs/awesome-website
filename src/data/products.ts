import type { ImageMetadata } from 'astro';
import supptrackIcon from '@/assets/supptrack.png';
import breathingIcon from '@/assets/breathing.png';
import pepcalcIcon from '@/assets/pepcalc.png';
import tokenartIcon from '@/assets/tokenart.png';
import supptrackShot from '@/assets/supptrack-shot.png';
import breathingShot from '@/assets/breathing-shot.png';
import pepcalcShot from '@/assets/pepcalc-shot.png';
import tokenartShot from '@/assets/tokenart-shot.png';

export type Product = {
  name: string;
  /** One-line positioning, rendered in accent under the name. */
  tag: string;
  blurb: string;
  href: string;
  icon: ImageMetadata;
  /**
   * Featured image, 4:3. All four are supplied press mockups, cropped to 4:3
   * and normalised to 1200x900 (the handoff asks for 800x600 minimum; 1200
   * gives headroom for the 800w variant Astro generates on 2x displays).
   *
   * Still optional in the type: ProductCard falls back to a tinted panel, so
   * a fifth product can be added before its artwork exists without the card
   * breaking. Crop safely — the app icon overlaps the bottom-left
   * corner of the image by 46px.
   */
  shot?: ImageMetadata;
  /**
   * Alt text for `shot` once it lands. Held here rather than generated so
   * whoever adds the image is prompted to write real alt text.
   */
  shotAlt?: string;
};

/**
 * Order is from the handoff and is not alphabetical or chronological — it
 * leads with the newest app and closes with the outlier (token.art is the one
 * non-health product). Keep it.
 */
export const products: Product[] = [
  {
    name: 'SuppTrack',
    tag: 'Smart supplement tracking',
    blurb:
      "A better way to manage your supplement routine. Organize, track, and optimize your intake, powered by AI and the world's largest supplement database.",
    href: 'https://supptrack.app',
    icon: supptrackIcon,
    shot: supptrackShot,
    shotAlt:
      "Three SuppTrack screens: a supplement's nutrient breakdown, the day's scheduled doses, and the weekly schedule view.",
  },
  {
    name: 'Awesome Breathing',
    tag: 'Beautifully simple guided breath pacer',
    blurb:
      'A simple, elegant tool to guide and visualize your breathing. For meditation, relaxation, or a few moments of calm in your day.',
    href: 'https://awesomebreathing.com',
    icon: breathingIcon,
    shot: breathingShot,
    shotAlt:
      'Three Awesome Breathing pacer screens showing the breathing ring mid-session in light, dark, and ember themes.',
  },
  {
    name: 'PepCalc',
    tag: 'Peptide reconstitution calculator',
    blurb:
      'The simplest way to get peptide reconstitution right. Instant results, saved protocols for repeatable calculations, multi-peptide blend support, and smart conversions.',
    href: 'https://pepcalc.app',
    icon: pepcalcIcon,
    shot: pepcalcShot,
    shotAlt:
      'Three PepCalc screens: a saved peptide protocol, syringe and vial details, and the calculated draw in insulin units.',
  },
  {
    name: 'token.art',
    tag: 'Multi-chain NFT viewer',
    blurb:
      'Aggregate, browse, and showcase your blockchain-based NFTs and digital collectibles. Made for collectors, by collectors.',
    href: 'https://token.art',
    icon: tokenartIcon,
    shot: tokenartShot,
    shotAlt:
      'Two token.art screens showing NFTs from a connected wallet: a trading card and a Bored Ape Yacht Club avatar, each captioned with its collection.',
  },
];
