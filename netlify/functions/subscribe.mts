/**
 * Mailing-list signup endpoint.
 *
 * Sits between the homepage form and the Mailchimp Marketing API so the API
 * key stays server-side. Because it is served from this domain, the page's CSP
 * needs no exception for Mailchimp and the browser makes a same-origin
 * request — which also means no CORS preflight.
 *
 * Environment (set in Netlify → Site configuration → Environment variables):
 *
 *   MAILCHIMP_API_KEY      Marketing API key. Its "-usN" suffix names the
 *                          data centre, which is why the URL below is derived
 *                          from the key rather than configured separately.
 *   MAILCHIMP_AUDIENCE_ID  Audience (list) ID. This is the same value as the
 *                          `id` parameter in the legacy list-manage embed URL
 *                          the old site posted to, so subscribers continue to
 *                          land in the audience that already exists.
 *
 * Neither has a fallback on purpose: a missing key should fail loudly in the
 * logs at deploy time, not quietly subscribe people to nothing.
 */

export const config = {
  /*
   * Serves the function at /api/subscribe directly, so there is no rewrite to
   * keep in sync in netlify.toml. The form's action and the fetch in
   * MailingList.astro both point here.
   */
  path: '/api/subscribe',
};

/** Mirrors the client-side check in MailingList.astro. Deliberately loose. */
const looksLikeEmail = (value: string) => /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(value);

/**
 * A visitor who submitted the form with JavaScript disabled gets a real page
 * back rather than a wall of JSON. Kept deliberately plain: it is a fallback
 * that most people will never see, and styling it would mean duplicating the
 * design system outside the Astro build where it could silently drift.
 */
const htmlResponse = (status: number, heading: string, body: string) =>
  new Response(
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${heading} | Awesome Labs</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
       background:#f2f7f6;color:#16211f;font:16px/1.6 system-ui,sans-serif;padding:24px}
  main{max-width:44ch;text-align:center}
  h1{font-size:28px;letter-spacing:-.02em;margin:0 0 12px}
  a{color:#2e6f68}
</style>
</head>
<body>
  <main>
    <h1>${heading}</h1>
    <p>${body}</p>
    <p><a href="/">Back to Awesome Labs</a></p>
  </main>
</body>
</html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );

export default async (request: Request): Promise<Response> => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    });
  }

  /*
   * Content negotiation. The enhanced path sends `Accept: application/json`;
   * a native form post sends `text/html,...`. One endpoint, two audiences.
   */
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');

  const reply = (status: number, message: string, heading = 'Something went wrong') =>
    wantsJson
      ? new Response(JSON.stringify({ message }), {
          status,
          headers: { 'Content-Type': 'application/json' },
        })
      : htmlResponse(status, heading, message);

  let email = '';
  let honeypot = '';

  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const body = (await request.json()) as { email?: unknown; company?: unknown };
      email = typeof body.email === 'string' ? body.email.trim() : '';
      honeypot = typeof body.company === 'string' ? body.company : '';
    } else {
      const form = await request.formData();
      email = String(form.get('email') ?? '').trim();
      honeypot = String(form.get('company') ?? '');
    }
  } catch {
    return reply(400, 'We could not read that submission. Please try again.');
  }

  /*
   * Honeypot. The field is hidden from people and from assistive tech, so
   * anything in it came from a bot filling every input on the page. Answer
   * with the success response rather than an error — a bot that is told it
   * failed simply retries, while one that is told it succeeded moves on.
   */
  if (honeypot) {
    return reply(200, "You're on the list.", 'Thanks');
  }

  if (!looksLikeEmail(email)) {
    return reply(400, 'Please enter a valid email address.', 'Check that address');
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const dataCenter = apiKey?.split('-')[1];

  if (!apiKey || !audienceId || !dataCenter) {
    // Configuration fault, not the visitor's. Log loudly, stay vague on-page.
    console.error(
      'Mailchimp is not configured: MAILCHIMP_API_KEY (with its -usN suffix) and MAILCHIMP_AUDIENCE_ID must both be set.',
    );
    return reply(500, 'Signup is temporarily unavailable. Please try again later.');
  }

  try {
    const response = await fetch(
      `https://${dataCenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Mailchimp ignores the username half of the basic auth pair.
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        },
        body: JSON.stringify({
          email_address: email,
          /*
           * Double opt-in. "subscribed" would add the address silently, which
           * is exactly the pattern that gets a sending domain flagged, and the
           * legacy embed form this replaces was double opt-in too — so
           * anything else would be a quiet change in how consent is collected.
           */
          status: 'pending',
        }),
      },
    );

    if (response.ok) {
      return reply(
        200,
        'Almost there. Check your inbox for a confirmation link.',
        "You're nearly on the list",
      );
    }

    const error = (await response.json().catch(() => ({}))) as {
      title?: string;
      detail?: string;
    };

    /*
     * "Member Exists" is a 400 from Mailchimp but not a failure from the
     * visitor's point of view — they are already subscribed, which is what
     * they wanted. Saying so beats showing them a generic error.
     *
     * Note this leaks membership of the list to anyone who guesses an
     * address. That is the accepted trade for a marketing newsletter; it
     * would not be acceptable on a list whose membership is sensitive.
     */
    if (error.title === 'Member Exists') {
      return reply(200, "You're already on the list. Nothing more to do.", 'Already subscribed');
    }

    /*
     * Mailchimp rejects addresses that previously unsubscribed or bounced;
     * they must resubscribe through Mailchimp itself, which this endpoint
     * cannot do on their behalf.
     */
    if (error.title === 'Forgotten Email Not Subscribed') {
      return reply(
        400,
        'This address was previously removed from the list. Please email hello@isjustawesome.com and we will add you back.',
        'We need to do that one by hand',
      );
    }

    console.error('Mailchimp rejected a subscribe request:', response.status, error);
    return reply(502, 'We could not add you right now. Please try again in a moment.');
  } catch (cause) {
    console.error('Mailchimp request failed:', cause);
    return reply(502, 'We could not reach the mailing list. Please try again in a moment.');
  }
};
