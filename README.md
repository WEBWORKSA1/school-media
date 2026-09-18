# School.Media

**The media network for schools.** Families use it to discover and compare schools. Students find scholarships and contests, watch videos and read guides, and can apply for jobs. It is also built to generate leads and revenue for the owner.

It is a static site: HTML, CSS and vanilla JavaScript, with no build step. It runs **free on GitHub Pages**.

- **Live site (GitHub Pages):** https://webworksa1.github.io/school-media/
- **Planned domain:** https://school.media
- **Phase-by-phase build prompts and business model:** [`docs/BUILD-PROMPTS.md`](docs/BUILD-PROMPTS.md)

## Pages

| Page | Purpose | Money / leads |
|---|---|---|
| `index.html` | Home: hero search, quick match form, featured schools, guides, videos, contests, FAQ | Quick-match lead, newsletter, ads |
| `schools.html` | Directory with filters, sorting, compare (up to 4), bookmarks | Request info, multiplex ad |
| `school.html?id=` | School profile: facts, reviews, events, tour booking | **Info request lead**, tour lead, ads |
| `match.html` | 6-step School Match quiz → ranked top 5 | **Core lead engine** |
| `events.html` | Open houses & RSVPs | RSVP leads, school event submissions |
| `news.html`, `article.html?id=` | Guides and news, reading progress bar, related articles | In-article ads, match call to action, newsletter |
| `videos.html` | Video hub with lightweight YouTube embeds | Views that feed the YouTube channel, series sponsorship |
| `scholarships.html` | Scholarship directory + profile / monthly draw | Student profile leads, sponsors |
| `contests.html` | Contests, entry forms, student reporters, sponsors | Entries, sponsorship leads |
| `jobs.html` | Jobs board, apply, post a job, talent pool | Paid job posts ($99 / $249), hiring |
| `for-schools.html` | ROI calculator, pricing, partner sign-up, ad rate card, media kit | **B2B revenue** |
| `donate.html` | One-time or monthly donations, goal meter | Donations |
| `leads.html` | Admin lead inbox (stored in the browser), CSV export (noindex) | Operations |

## Turning on monetization (edit only `assets/js/config.js`)

1. **Forms and leads.** Set `formEndpoint`. Formspree, Getform, a Make or Zapier webhook, or a Google Apps Script all work. Every form POSTs JSON that includes a `form` field and UTM data.
2. **AdSense.** Set `adsense.client` (`ca-pub-…`) and, optionally, slot IDs. Then update `ads.txt` with the same publisher ID. The consent banner uses Google Consent Mode v2.
3. **GA4.** Set `ga4`. The site sends these events: `generate_lead`, `sign_up`, `video_play`, `share`, `select_plan`, `begin_checkout`.
4. **Donations and payments.** Paste your Stripe Payment Links, PayPal, Buy Me a Coffee, GitHub Sponsors or Patreon links. Until a link is set, the donate button collects a pledge through a form instead.
5. **Social and YouTube.** Add your channel and profile URLs. Any left blank are hidden.

## Editing content

All content lives in `/data/*.json`: `schools`, `articles`, `videos`, `scholarships`, `contests`, `jobs`, `events`.

- The schools, jobs and events shipped with the site are **sample records** (`"sample": true`), and the site labels them as samples. Replace them with real data before promoting the site.
- Contest prizes and School.Media scholarships are templates. Set amounts you will actually fund.
- To add a video, add its YouTube ID to `videos.json`.

## Custom domain (school.media)

1. Add a file named `CNAME` at the repo root containing `school.media`.
2. At your DNS provider, add A records for `@` pointing to 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153, and a CNAME for `www` pointing to `webworksa1.github.io`.
3. Go to repo **Settings → Pages** and tick **Enforce HTTPS**.

Absolute URLs in `sitemap.xml`, canonical tags and `robots.txt` already point to `https://school.media/`.

## Local preview

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
