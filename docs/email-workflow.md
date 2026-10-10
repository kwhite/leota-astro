# Optional table emails (v1)

The site stays static. Publishing, Cloudflare builds and Markdown edits never send email. These local commands build the current site, extract a post's rendered content and create an email with inline formatting. MDX callouts and ordinary Markdown share Astro's existing renderer; images use the build's public media URLs. No signup/subscriber service is involved.

## Preview

```sh
pnpm email:preview 1-8-far-from-the-tree-part-2
```

Open `.email/previews/1-8-far-from-the-tree-part-2/index.html`; `message.txt` is the plain-text alternative. All `.email` files are ignored by Git and live outside `dist`. The email uses a dark 600px layout, the full post, cover/excerpt when present and a read-online link. Interactive embeds become links; disclosures become expanded bordered panels with bold headings; galleries stack vertically. Site navigation, recent posts and lightbox controls are omitted. No Ghost tracking or unsubscribe tokens are copied. Email apps may still block remote images or alter colors. Browser preview is not inbox acceptance testing.

## Private setup

Create `.email/config.json` locally (do not put it under public):

```json
{
  "from": "Kat <YOUR_VERIFIED_SENDER>",
  "domain": "YOUR_MAILGUN_DOMAIN",
  "region": "us",
  "testTo": "YOUR_ADDRESS",
  "recipients": ["PLAYER_ADDRESS"]
}
```

Use `"eu"` for an EU Mailgun domain. Put the actual existing Mailgun API key in `.email/credentials.env`:

```text
MAILGUN_API_KEY=YOUR_KEY
```

Restrict those files to your account. Nothing reads credentials from the Ghost backup. Each player receives a separate message; addresses aren't exposed to other players. Open/click tracking is disabled.

## Publish and optionally send

1. Publish the post through the usual workflow and verify it online.
2. Run `pnpm email:test <post-slug>` to send to `testTo` only.
3. Check the received email, then run `pnpm email:send <post-slug>` to email the table.

Both sending commands rebuild and compare the live post's email content with the local version before sending. A mismatch, missing configuration or failed build stops the command. The default live origin is `https://herebedragons.club`; `EMAIL_SITE_URL` overrides it if needed during domain cutover. Preview needs no credentials or live-site access. These commands never deploy.

## Send history and failures

`.email/history/test/<slug>` and `.email/history/send/<slug>` record recipient hashes and Mailgun acceptance IDs separately. Each explicit test command creates a fresh attempt folder and sends a new test, even for the same post. Table sends keep stable history: accepted recipients are skipped on subsequent runs, including when a post changes. A single local lock prevents overlapping commands. Keep this private folder when moving computers: an independent checkout without its history cannot know what another machine sent.

A recipient is marked pending before the network request. Network errors/timeouts leave that entry pending because the provider might have accepted the message. Check Mailgun logs before removing a pending record and retrying. On a partial failure, accepted recipients are skipped; unresolved pending records stop progress until reviewed. Provider acceptance does not prove inbox delivery. A deliberate table resend requires reviewing and clearing the corresponding table history; there is no automatic resend flag. Tests can be repeated simply by running the test command again. Remove a stale `.email/send.lock` only after confirming no send command is running.

Validation: `pnpm email:check` tests rendering, unsafe/interactive markup removal, recipient isolation in transport, duplicate prevention and ambiguous failure handling. Real inbox rendering and provider delivery require a configured test send.
