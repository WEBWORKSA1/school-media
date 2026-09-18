# School.Media: build prompts, phase by phase

These are the prompts used to build School.Media, the media network for schools. Paste them into an AI coding assistant one phase at a time. Each phase depends on the ones before it. The repository you are in is the finished result of Phases 1–7. Phases 8–10 are for scaling up later.

---

## Business concept

**Positioning:** School.Media is the media and discovery network for schools. Parents and students come for free content and tools. Schools, brands and employers pay for placement and leads.

**How the site gets traffic (free for families)**
- A directory for finding schools: search, filter and compare
- A free "School Match" quiz that gives each family a ranked shortlist
- Scholarship listings
- Student contests
- A video hub
- Guides and news
- Open house events
- A jobs and talent board

**How the site makes money (from schools, brands and employers)**

| Stream | Model | Benchmark |
|---|---|---|
| Google AdSense | Display ads, in-article ads, multiplex ads | $15–30 per 1,000 page views in the education niche (Tier-1 countries) |
| YouTube | Channel ad revenue plus embeds that drive watch time | Median $10 per 1,000 views for education channels |
| Enrollment leads | Sold per lead, or bundled into Premium listings | $35–$250 per lead. For comparison, education leads cost about $90 on Google Ads |
| Featured listings | Enhanced plan at $49/mo, Premium at $99/mo | Similar to Niche and Private School Review |
| Advertising and sponsorships | Display at $10 CPM, site takeovers, newsletter slots, sponsored content | Boarding School Review charges $250/day |
| Contest and scholarship sponsors | Naming rights plus leads from entrants who opt in | Fastweb, Unigo and Niche all use this |
| Job board | $99 standard post, $249 featured post | EdSurge, EdWeek (TopSchoolJobs) |
| Donations | One-time and monthly | The 74, Khan Academy, Crash Course |

**Research base:** 30 sites were reviewed. They were GreatSchools, Niche, Private School Review, Boarding School Review, SchoolDigger, Edutopia, EdSurge, Education Week, EdWeek Market Brief, The 74, Common Sense Education, Khan Academy, TED-Ed, Crash Course, PBS LearningMedia, National Geographic Kids, Scholastic, Quizlet, Brainly, Study.com, Chegg, BYJU'S, Duolingo, Coursera, Newsela, Fastweb, Scholarships.com, Unigo, DonorsChoose and Teachers Pay Teachers.

---

## Phase 1: Foundation and design system

```
Build a static, GitHub Pages-compatible website for the domain School.Media ("the media network for schools").
Stack: plain HTML5 + one CSS file + vanilla JS (no build step, no framework, no server). All paths must be RELATIVE so it
works both at https://school.media/ and at https://<user>.github.io/school-media/.
Create:
- assets/css/style.css: a design system with CSS variables (brand indigo #4f46e5 → violet #7c3aed → pink #db2777 gradient,
  amber accent), light and dark themes (prefers-color-scheme plus a manual toggle saved in localStorage), and the font
  Plus Jakarta Sans. Components: buttons, cards, badges, chips, forms, stepper, tabs, modal, toast, countdown, pricing
  cards, donation amounts, FAQ accordion, sticky mobile CTA, ad-slot placeholders, reveal-on-scroll. The layout must
  work on mobile first and must never scroll sideways at 360px width.
- assets/js/config.js: one config object (SM_CONFIG) holding the AdSense client and slot IDs, the GA4 ID, the form endpoint
  (JSON POST, e.g. Formspree or a Zapier webhook), donation links (Stripe Payment Links, PayPal, Buy Me a Coffee, GitHub
  Sponsors, Patreon), payment links for paid products, social URLs and the topbar promo text. Everything must work in
  demo mode when values are blank.
- assets/js/app.js: builds the shared header (sticky, dropdown, mobile menu) and footer (newsletter form, link columns,
  social links), theme toggle, toast, modal, GDPR/Consent Mode v2 cookie banner, loaders for AdSense and GA4, an ad-slot
  renderer, UTM first-touch capture, the lead form engine, a lightweight YouTube embed that loads only on click,
  bookmarks, share buttons, animated counters, countdowns, a one-time exit-intent lead magnet, and service-worker
  registration.
```

## Phase 2: Content data layer

```
Create /data/*.json as the site's content database (editable without touching code):
schools.json (id, name, type, grades, city, region, country, tuition, currency, rating, reviews, students, ratio, founded,
religion, curriculum, features[], sports[], featured, verified, color, admissions{deadline, financialAid, acceptance},
description, sample flag), articles.json (id, title, category, emoji, author, date, read time, excerpt, HTML body, featured),
videos.json (YouTube id, title, channel, category, duration, desc), scholarships.json (name, sponsor, amountText, level,
country, category, window/deadline, essay flag, official URL, house flag), contests.json (title, emoji, category,
eligibility, deadline, prize, prizes[], entry, format), jobs.json, events.json.
Mark placeholder records with "sample": true and show a visible "sample listing" notice in the UI. Never present
invented schools, reviews or statistics as real.
```

## Phase 3: School discovery (the traffic engine)

```
Build schools.html: a directory with a sidebar of filters (text search, type checkboxes, country, a tuition range slider,
feature checkboxes, financial aid), sorting (recommended/featured first, rating, tuition, A–Z), result count, and
responsive cards (logo initials, rating stars, verified badge, featured ribbon, tuition, ratio, "Request Info",
"Compare", "Save"). Insert a multiplex ad slot after the 6th result.
Compare: a floating compare bar (up to 4 schools) that opens a side-by-side comparison table in a modal.
Build school.html?id=: the profile hero, tabs (Overview, Admissions, Reviews, Events), a key-facts list, features and
sports chips, upcoming events, a private-tour booking form, a review form (moderated), a sticky sidebar "Request
information" lead form, an ad slot, share buttons, similar schools, and School JSON-LD for real (non-sample) listings.
Build events.html: a filterable open-house calendar with an RSVP modal (a lead) and an "Add your event" form for schools.
```

## Phase 4: Lead generation (the revenue engine)

```
Build match.html: a 6-step "School Match" quiz with a progress bar. Steps: grade, school type, budget, priorities
(multi-select), location, then contact details with TCPA/GDPR-style consent. Single-choice steps advance automatically.
On submit: send the lead with every answer and UTM data to the endpoint, then score all schools (type, budget,
priorities, country, rating, featured boost) and show the top 5 with a "% match" figure.
Lead capture across the site:
- Hero quick-match form (home)
- Request info on each school profile
- Tour booking
- Event RSVP
- Exit-intent checklist lead magnet
- Newsletter forms (footer, home band, article sidebar)
- Scholarship profile (with a monthly no-essay draw as the incentive)
- Contest entries
- Student reporter applications
- School partner sign-up
- Advertiser media-kit request
- Contest sponsor request
- Job post
- Job application
- Talent pool
- Video submission
- Contact form
Every form has these: honeypot spam trap, validation, consent checkbox, success state with a next-step call to action,
GA4 events (generate_lead / sign_up), a copy saved in localStorage, and a POST to SM_CONFIG.formEndpoint.
Build leads.html (noindex): a local lead inbox with a filter by form and CSV export.
```

## Phase 5: Content, video and community

```
Build news.html: a lead story, category chips, search, article cards, and an ad slot after row 1.
Build article.html?id=: a reading progress bar, an in-article ad after the 3rd block, a mid-article School Match call to
action, share buttons and bookmark, a sidebar (match call to action, newsletter, sidebar ad), related articles, and
Article JSON-LD.
Build videos.html: a featured video, category chips, a grid of lightweight YouTube embeds, a "Submit your school's video"
form and a "Sponsor a video series" pitch.
Build scholarships.html: a profile and draw sign-up band, filters (search, level, no-essay, international), cards with a
link to the official site (nofollow, tracked as outbound), a pitch to sponsor a scholarship, and a link to the playbook
article.
Build contests.html: a featured contest band with a live countdown, contest cards (prize, eligibility, countdown), entry
and rules modals, a Student Reporter Program form and a contest sponsorship form.
Build jobs.html: category chips, search and type filter, job cards with an apply modal, job-post pricing ($99 / $249)
with a post form, and a talent-pool sign-up.
```

## Phase 6: Monetization pages

```
Build for-schools.html:
- Hero with an enrollment ROI calculator
- Benefits grid
- Pricing with a monthly/yearly toggle: Basic $0, Enhanced $49, Premium $99 (no competitor ads, featured in Match,
  CRM delivery), and Enrollment Leads from $35 per lead
- Claim-profile partner form (seats, budget)
- FAQ
- Advertising rate card (display $10 CPM, takeover $250/day, newsletter $400, sponsored article $750, video series
  $1,500/mo, contest sponsor $2,500, category sponsorship)
- Media-kit request form
Buttons open Stripe payment links when they are set in the config. Otherwise they scroll to the form.
Build donate.html:
- One-time or monthly toggle
- Amount tiles plus a custom amount
- A line showing what each amount pays for
- Goal meter (from config)
- Checkout through the Stripe, PayPal or Buy Me a Coffee link, with a pledge form as fallback
- Other ways to help
- FAQ
```

## Phase 7: Trust, legal, SEO and deployment

```
Add about.html, contact.html (topic select plus a "Write for us" section), privacy.html (AdSense, cookie and consent
disclosures, children's privacy, GDPR/CCPA/PIPEDA/DPDP rights), terms.html (including official contest rules: no
purchase necessary, minors need parental consent, judging, licence to display entries, prizes), and 404.html.
SEO: a unique title and meta description, canonical link, Open Graph and Twitter tags, OG image, Organization + WebSite
+ SearchAction JSON-LD, sitemap.xml (static pages plus article and school URLs), robots.txt (allow Mediapartners-Google),
ads.txt, llms.txt, a manifest.webmanifest PWA, sw.js (network-first with offline fallback) and .nojekyll.
Deploy: push to GitHub repo WEBWORKSA1/school-media and publish with GitHub Pages (free plan, public repo) from the
branch root. Add a CNAME file for school.media only once DNS is ready.
```

## Phase 8: Going live (manual steps, in order)

```
1. Buy or point the domain: add a CNAME file containing "school.media". At the DNS provider add A records to 185.199.108.153,
   185.199.109.153, 185.199.110.153 and 185.199.111.153, plus a CNAME for www pointing to webworksa1.github.io. Enable
   "Enforce HTTPS" in the repo's Pages settings.
2. Forms: create a Formspree form (or a Make/Zapier webhook to Google Sheets + CRM) and paste the URL into config.formEndpoint.
3. Payments: create Stripe Payment Links for donations (one-time with customer-chosen amount, monthly), Enhanced,
   Premium, job posts and sponsorships, and paste them into the config.
4. Analytics: create a GA4 property and set config.ga4. Mark generate_lead and sign_up as key events.
5. AdSense: publish 25–40 original articles first, then apply. After approval set config.adsense.client and slot IDs,
   update ads.txt, and set up a Google-certified CMP for the EEA and UK.
6. Replace the sample schools, jobs and events with real data. Remove the "sample" flags.
7. Submit sitemap.xml to Google Search Console and Bing Webmaster Tools.
```

## Phase 9: Growth playbook

```
- Programmatic SEO: generate /schools/<country>/<city>/ landing pages from schools.json with a static generator script
  (e.g. "Best IB schools in Dubai", "Online high schools in Ontario").
- Publish 3 articles a week targeting long-tail queries: "how to choose a school in <city>", "<curriculum> vs <curriculum>",
  "<city> private school tuition 2027".
- YouTube: 2 Shorts a week (school tours, study hacks, scholarship alerts) plus 1 long video. Embed each on the site.
- Contests as growth loops: share-to-vote, entries on YouTube and TikTok, and school badges linking back.
- Email: a weekly brief, plus a 6-email nurture sequence after a School Match.
- Sales: reach out to 50 schools a week with "Claim your free profile" and upsell Premium after sending the first 5 leads.
```

## Phase 10: Scaling up the platform (when revenue justifies it)

```
Move data from JSON to a headless CMS (Decap CMS on GitHub, or Sanity or Supabase) and add school self-serve dashboards
(auth, profile editing, lead inbox, analytics). Add Stripe subscriptions, a reviews moderation queue, a public voting
system for contests, multilingual pages (hreflang: en, fr, es, hi, ar) and an API for school data licensing.
Keep the static front end on GitHub Pages or move it to Netlify, Vercel or Cloudflare Pages if serverless functions
are needed.
```
