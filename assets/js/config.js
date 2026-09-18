/* ==========================================================
   School.Media — SITE CONFIG
   Edit ONLY this file to switch on monetization, forms and payments.
   Everything works in "demo mode" until real values are added.
   ========================================================== */
window.SM_CONFIG = {
  siteName: "School.Media",
  siteUrl: "https://school.media",          // change if hosting on webworksa1.github.io/School-media
  tagline: "The media network for schools, students & parents",
  contactEmail: "hello@school.media",

  /* ---------- Google AdSense ----------
     1. Apply at https://adsense.google.com with your domain.
     2. Put your publisher ID below (format ca-pub-XXXXXXXXXXXXXXXX)
     3. Update /ads.txt with the same pub ID.
     4. Optional: add ad unit slot IDs; blank = Auto ads only. */
  adsense: {
    client: "",                 // e.g. "ca-pub-1234567890123456"
    slots: { leaderboard: "", inArticle: "", sidebar: "", multiplex: "" }
  },

  /* ---------- Analytics (Google Analytics 4) ---------- */
  ga4: "",                      // e.g. "G-XXXXXXXXXX"

  /* ---------- Lead & form delivery ----------
     Any service that accepts a JSON POST works: Formspree, Getform, Basin,
     Make/Zapier webhook, Google Apps Script web app, Airtable proxy...
     One endpoint receives ALL forms; each submission carries a "form" field.
     Leave blank = submissions are stored in the browser (see /leads.html). */
  formEndpoint: "",             // e.g. "https://formspree.io/f/abcdwxyz"
  formEndpoints: {              // optional per-form overrides
    // "school-match": "https://hooks.zapier.com/hooks/catch/xxx/yyy"
  },

  /* ---------- Donations & payments ----------
     Paste payment links (no backend needed). Blank links hide that button. */
  donate: {
    stripeOneTime: "",          // Stripe Payment Link (customer chooses amount)
    stripeMonthly: "",          // Stripe Payment Link for recurring
    paypal: "",                 // e.g. "https://www.paypal.com/donate/?hosted_button_id=XXXX"
    buyMeACoffee: "",           // e.g. "https://www.buymeacoffee.com/schoolmedia"
    githubSponsors: "",         // e.g. "https://github.com/sponsors/WEBWORKSA1"
    patreon: "",
    goal: 25000, raised: 0, supporters: 0, currency: "$"   // update raised/supporters as real donations arrive
  },
  payments: {                   // paid products (featured listings, job posts, contest entry)
    featuredListing: "", premiumListing: "", jobPost: "", featuredJob: "", sponsorPackage: ""
  },

  /* ---------- Social & YouTube (blank = icon hidden) ---------- */
  youtubeChannel: "",          // e.g. "https://www.youtube.com/@YourChannel"
  social: {
    youtube: "",
    instagram: "",
    tiktok: "",
    x: "",
    linkedin: "",
    facebook: ""
  },

  /* ---------- Lead-gen behaviour ---------- */
  exitIntent: true,             // show one-time exit offer on desktop
  exitIntentDelayDays: 7,
  topbar: "🏆 The 2026 School.Media Student Creator Awards are open — <a href=\"contests.html\">enter free &amp; win prizes</a>"
};
