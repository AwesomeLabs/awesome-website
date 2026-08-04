/**
 * Site identity and the two flavours of page copy.
 *
 * Search and social want different things from the same page, so they get
 * different strings rather than one shared pair:
 *
 *   SEARCH   `<title>` and `meta description`. The title carries the brand,
 *            since a result has nothing else to identify it. Google renders
 *            roughly 60 characters of title and 155 of description.
 *
 *   SOCIAL   `og:*` and `twitter:*`. The card already shows the brand in
 *            `og:site_name`, so repeating it in the title just spends
 *            characters. Feeds truncate hard — Facebook and LinkedIn around
 *            110-125 — so social copy is written to survive at that length.
 */
export const SITE = {
  name: 'Awesome Labs',
  legalName: 'Awesome Labs, LLC',
  url: 'https://isjustawesome.com',

  /** Search result title. Brand first — it is the strongest term. */
  title: 'Awesome Labs: Health, Wellness + Emerging Technology Studio',
  /**
   * Search result description. Under ~155 characters. Deliberately not a
   * restatement of the title: the two appear together in a result, so the
   * description leads with the proof the title cannot carry (shipped apps,
   * client work) rather than repeating "studio".
   */
  description:
    'We conceive, build, and launch apps that make people healthier and happier. Four of our own, used by hundreds of thousands, plus select client work.',

  /**
   * Social card title. No brand: `og:site_name` already supplies it.
   */
  socialTitle: 'Health, Wellness + Emerging Technology Studio',
  /**
   * Social card description. Under ~125 characters, sharing no significant
   * word with socialTitle — on a card the two sit on consecutive lines.
   */
  socialDescription:
    'We build apps that make people healthier and happier. SuppTrack, Awesome Breathing, PepCalc, and token.art.',

  locale: 'en_US',
  twitterHandle: '@awesomelabsllc',
  email: 'hello@isjustawesome.com',
} as const;

export const LINKS = {
  instagram: 'https://www.instagram.com/awesome.labs/',
  twitter: 'https://twitter.com/AwesomeLabsLLC',
  /**
   * The "Start a project" CTA and the footer's Contact link. A mailto is the
   * honest destination: there is no contact form on this site and no inbox
   * automation behind one. The subject line is prefilled so enquiries are
   * filterable on arrival.
   */
  contact: `mailto:hello@isjustawesome.com?subject=${encodeURIComponent('Collaboration opportunity')}`,
  hello: 'mailto:hello@isjustawesome.com',
} as const;

/**
 * Plausible site ID. The current tracker identifies the site by the ID in the
 * script filename, NOT by a data-domain attribute — so this value only ever
 * appears in netlify.toml's proxy target. It is recorded here for provenance;
 * changing it here alone does nothing.
 *
 * @see netlify.toml — /js/pa.js proxy
 */
export const PLAUSIBLE_SITE_ID = 'pa-cBBYTykCD0usrY4wYDFon';

/** GA4 measurement ID, carried over from the legacy site so history is continuous. */
export const GA4_MEASUREMENT_ID = 'G-5W672ZTGX1';
