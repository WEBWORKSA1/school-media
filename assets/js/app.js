/* ==========================================================
   School.Media — core app (layout, theme, ads, forms, UI)
   ========================================================== */
(function () {
  "use strict";
  const C = window.SM_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const cache = {};
  async function getJSON(name) {
    if (cache[name]) return cache[name];
    const r = await fetch(`data/${name}.json`, { cache: "no-cache" });
    if (!r.ok) throw new Error("Failed to load " + name);
    return (cache[name] = await r.json());
  }
  const qs = (k) => new URLSearchParams(location.search).get(k);
  const fmtDate = (d) => new Date(d + (String(d).length === 10 ? "T00:00:00" : "")).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const money = (n) => (C.donate?.currency || "$") + Number(n).toLocaleString();

  /* ---------- Theme (before paint) ---------- */
  const savedTheme = store.get("sm_theme", null);
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

  /* ---------- Layout ---------- */
  const NAV = [
    { href: "schools.html", label: "Schools", children: [
      { href: "schools.html", label: "🏫 School Directory" },
      { href: "match.html", label: "🎯 Free School Match" },
      { href: "schools.html#compare", label: "⚖️ Compare Schools" },
      { href: "events.html", label: "📅 Open Houses & Events" }
    ]},
    { href: "news.html", label: "Guides" },
    { href: "videos.html", label: "Videos" },
    { href: "scholarships.html", label: "Scholarships" },
    { href: "contests.html", label: "Contests" },
    { href: "jobs.html", label: "Jobs" },
    { href: "for-schools.html", label: "For Schools" }
  ];
  function header() {
    const here = location.pathname.split("/").pop() || "index.html";
    const li = NAV.map((n) => {
      const act = here === n.href || (n.children || []).some((c) => c.href.split("#")[0] === here) ? " active" : "";
      if (!n.children) return `<li><a class="${act}" href="${n.href}">${n.label}</a></li>`;
      return `<li class="dropdown"><a class="${act}" href="${n.href}" aria-haspopup="true">${n.label} ▾</a><ul class="dropdown-menu">${n.children.map((c) => `<li><a href="${c.href}">${c.label}</a></li>`).join("")}</ul></li>`;
    }).join("");
    return `${C.topbar ? `<div class="topbar">${C.topbar}</div>` : ""}
<header class="header"><div class="container nav">
  <a class="logo" href="index.html" aria-label="School.Media home"><span class="logo-mark">S.</span><span>School<b>.Media</b></span></a>
  <ul class="nav-links" id="navLinks">${li}<li><a href="donate.html">❤️ Donate</a></li></ul>
  <div class="nav-cta">
    <button class="icon-btn" id="themeBtn" aria-label="Toggle dark mode">🌓</button>
    <a class="btn btn-ghost btn-sm" href="for-schools.html#list">List Your School</a>
    <a class="btn btn-primary btn-sm" href="match.html">Find My School</a>
    <button class="icon-btn menu-toggle" id="menuBtn" aria-label="Open menu" aria-expanded="false">☰</button>
  </div>
</div></header>`;
  }
  function footer() {
    const soc = Object.entries(C.social || {}).filter(([, v]) => v)
      .map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener" aria-label="${k}">${({ youtube: "YT", instagram: "IG", tiktok: "TT", x: "X", linkedin: "in", facebook: "f" })[k] || k}</a>`).join("");
    return `<footer class="footer"><div class="container">
  <div class="footer-grid">
    <div>
      <a class="logo" href="index.html"><span class="logo-mark">S.</span><span>School<b>.Media</b></span></a>
      <p style="margin-top:14px;max-width:340px">${esc(C.tagline)}. News, videos, school discovery, scholarships, contests and careers — free for families, built with schools.</p>
      <form class="newsletter-inline" data-form="newsletter" data-success="toast">
        <input type="email" name="email" placeholder="Your email" required aria-label="Email">
        <input type="hidden" name="list" value="weekly">
        <button class="btn btn-accent btn-sm" type="submit">Subscribe</button>
      </form>
      ${soc ? `<div class="social">${soc}</div>` : ""}
    </div>
    <div><h4>Families</h4><ul>
      <li><a href="schools.html">School Directory</a></li><li><a href="match.html">Free School Match</a></li>
      <li><a href="scholarships.html">Scholarships</a></li><li><a href="events.html">Open Houses</a></li><li><a href="news.html">Guides</a></li></ul></div>
    <div><h4>Students</h4><ul>
      <li><a href="contests.html">Contests & Awards</a></li><li><a href="videos.html">Video Lessons</a></li>
      <li><a href="contests.html#reporter">Student Reporter</a></li><li><a href="jobs.html">Internships</a></li></ul></div>
    <div><h4>Schools & Brands</h4><ul>
      <li><a href="for-schools.html">Get Enrollment Leads</a></li><li><a href="for-schools.html#pricing">Featured Listings</a></li>
      <li><a href="for-schools.html#advertise">Advertise / Media Kit</a></li><li><a href="jobs.html#post">Post a Job</a></li><li><a href="contests.html#sponsor">Sponsor a Contest</a></li></ul></div>
    <div><h4>School.Media</h4><ul>
      <li><a href="about.html">About</a></li><li><a href="contact.html">Contact</a></li><li><a href="contact.html#write">Write for Us</a></li>
      <li><a href="donate.html">Donate</a></li><li><a href="privacy.html">Privacy</a></li><li><a href="terms.html">Terms</a></li></ul></div>
  </div>
  <div class="footer-bottom"><span>© ${new Date().getFullYear()} School.Media. All rights reserved.</span>
  <span><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a> · <a href="#" id="cookieSettings">Cookie settings</a> · <a href="sitemap.xml">Sitemap</a></span></div>
</div></footer>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<div class="consent" id="consent" role="dialog" aria-label="Cookie consent">
  <strong>🍪 We value your privacy</strong>
  <p style="margin:6px 0 0" class="muted">We use cookies for analytics and personalised ads (Google AdSense). You can accept all or keep essential only. See our <a href="privacy.html">Privacy Policy</a>.</p>
  <div class="row"><button class="btn btn-primary btn-sm" data-consent="all">Accept all</button><button class="btn btn-ghost btn-sm" data-consent="essential">Essential only</button></div>
</div>`;
  }

  /* ---------- Toast & Modal ---------- */
  function toast(msg, ms = 3500) {
    const t = $("#toast"); if (!t) return;
    t.innerHTML = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), ms);
  }
  function modal(html, wide) {
    let m = $("#smModal");
    if (!m) {
      m = document.createElement("div"); m.id = "smModal"; m.className = "modal";
      m.innerHTML = `<div class="modal-box"><button class="icon-btn modal-close" aria-label="Close">✕</button><div class="modal-body"></div></div>`;
      document.body.appendChild(m);
      m.addEventListener("click", (e) => { if (e.target === m || e.target.closest(".modal-close")) closeModal(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
    }
    $(".modal-box", m).classList.toggle("wide", !!wide);
    $(".modal-body", m).innerHTML = html; m.classList.add("open");
    document.body.style.overflow = "hidden";
    initForms(m); initYT(m);
    return m;
  }
  function closeModal() { const m = $("#smModal"); if (m) { m.classList.remove("open"); document.body.style.overflow = ""; } }

  /* ---------- Consent, AdSense, GA4 ---------- */
  function loadScript(src, attrs = {}) {
    const s = document.createElement("script"); s.async = true; s.src = src;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v)); document.head.appendChild(s); return s;
  }
  function applyConsent(level) {
    window.gtag && gtag("consent", "update", {
      ad_storage: level === "all" ? "granted" : "denied", ad_user_data: level === "all" ? "granted" : "denied",
      ad_personalization: level === "all" ? "granted" : "denied", analytics_storage: level === "all" ? "granted" : "denied"
    });
    if (C.adsense?.client) {
      (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = level === "all" ? 0 : 1;
    }
  }
  function initTracking() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied", wait_for_update: 500 });
    if (C.ga4) { loadScript("https://www.googletagmanager.com/gtag/js?id=" + C.ga4); gtag("js", new Date()); gtag("config", C.ga4); }
    const level = store.get("sm_consent", null);
    if (level) applyConsent(level); else setTimeout(() => $("#consent")?.classList.add("show"), 900);
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-consent]");
      if (b) { store.set("sm_consent", b.dataset.consent); applyConsent(b.dataset.consent); $("#consent").classList.remove("show"); }
      if (e.target.id === "cookieSettings") { e.preventDefault(); $("#consent").classList.add("show"); }
    });
    if (C.adsense?.client) loadScript("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + C.adsense.client, { crossorigin: "anonymous" });
  }
  function track(name, params = {}) { try { window.gtag && gtag("event", name, params); } catch (e) {} }

  function initAds(root = document) {
    $$(".ad-slot:not([data-ready])", root).forEach((el) => {
      el.dataset.ready = "1";
      const type = el.dataset.ad || "leaderboard";
      const slot = C.adsense?.slots?.[type];
      if (C.adsense?.client && slot) {
        el.classList.add("live");
        const fmt = type === "inArticle" ? 'data-ad-layout="in-article" data-ad-format="fluid"' : type === "multiplex" ? 'data-ad-format="autorelaxed"' : 'data-ad-format="auto" data-full-width-responsive="true"';
        el.innerHTML = `<span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block;width:100%" data-ad-client="${C.adsense.client}" data-ad-slot="${slot}" ${fmt}></ins>`;
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      } else if (C.adsense?.client) {
        el.remove(); // Auto ads will place units
      } else {
        el.innerHTML = `<span class="ad-label">Advertisement</span><span>Ad space · <a href="for-schools.html#advertise">advertise here</a></span>`;
      }
    });
  }

  /* ---------- UTM capture (first touch) ---------- */
  function captureUTM() {
    const p = new URLSearchParams(location.search), utm = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "ref"].forEach((k) => { if (p.get(k)) utm[k] = p.get(k); });
    if (Object.keys(utm).length && !store.get("sm_utm", null)) store.set("sm_utm", utm);
    if (!store.get("sm_landing", null)) store.set("sm_landing", { page: location.pathname, referrer: document.referrer, ts: Date.now() });
  }

  /* ---------- Forms (lead capture engine) ---------- */
  async function submitLead(formName, data) {
    const payload = {
      form: formName, ...data,
      _page: location.pathname + location.search, _submitted: new Date().toISOString(),
      _utm: store.get("sm_utm", {}), _landing: store.get("sm_landing", {}), _lang: navigator.language
    };
    const endpoint = C.formEndpoints?.[formName] || C.formEndpoint;
    track(formName === "newsletter" ? "sign_up" : "generate_lead", { form_name: formName });
    const leads = store.get("sm_leads", []); leads.unshift(payload); store.set("sm_leads", leads.slice(0, 500));
    if (!endpoint) return { ok: true, demo: true };
    const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error("Submission failed");
    return { ok: true };
  }
  function serialize(form) {
    const fd = new FormData(form), out = {};
    for (const [k, v] of fd.entries()) {
      if (k === "_gotcha") continue;
      if (out[k] !== undefined) out[k] = [].concat(out[k], v); else out[k] = v;
    }
    return out;
  }
  function validate(form) {
    let ok = true;
    $$("[required]", form).forEach((el) => {
      const f = el.closest(".field"); const bad = el.type === "checkbox" ? !el.checked : !String(el.value).trim() || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value));
      f && f.classList.toggle("error", bad); if (bad) ok = false;
    });
    const tel = $("input[type=tel]", form);
    if (tel && tel.value && tel.value.replace(/\D/g, "").length < 7) { tel.closest(".field")?.classList.add("error"); ok = false; }
    return ok;
  }
  function initForms(root = document) {
    $$("form[data-form]:not([data-bound])", root).forEach((form) => {
      form.dataset.bound = "1";
      if (!$("input[name=_gotcha]", form)) form.insertAdjacentHTML("beforeend", '<input class="hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">');
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if ($("input[name=_gotcha]", form).value) return;
        if (!validate(form)) { toast("⚠️ Please complete the highlighted fields."); return; }
        const btn = $("button[type=submit]", form); const txt = btn?.innerHTML;
        if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
        try {
          const data = serialize(form);
          if (form._extra) Object.assign(data, form._extra());
          await submitLead(form.dataset.form, data);
          document.dispatchEvent(new CustomEvent("sm:lead", { detail: { form: form.dataset.form, data } }));
          if (form.dataset.success === "toast") { toast("🎉 You're in! Check your inbox."); form.reset(); }
          else {
            const msg = form.dataset.successMsg || "Thanks! We've received your details and will be in touch shortly.";
            form.innerHTML = `<div class="form-success"><div class="big">✅</div><h3>${esc(form.dataset.successTitle || "Submitted!")}</h3><p class="muted">${esc(msg)}</p>${form.dataset.next ? `<a class="btn btn-primary" href="${esc(form.dataset.next)}">${esc(form.dataset.nextLabel || "Continue")}</a>` : ""}</div>`;
          }
        } catch (err) {
          toast("❌ Something went wrong. Please try again or email " + esc(C.contactEmail));
        } finally { if (btn && btn.isConnected) { btn.disabled = false; btn.innerHTML = txt; } }
      });
    });
  }

  /* ---------- YouTube lite embed ---------- */
  function ytCard(v) {
    return `<div class="yt" data-yt="${esc(v.id)}" style="background-image:url(https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg)" role="button" tabindex="0" aria-label="Play: ${esc(v.title)}"><span class="play">▶</span>${v.duration ? `<span class="dur">${esc(v.duration)}</span>` : ""}</div>`;
  }
  function initYT(root = document) {
    $$(".yt:not([data-bound])", root).forEach((el) => {
      el.dataset.bound = "1";
      const play = () => { el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${el.dataset.yt}?autoplay=1&rel=0" title="YouTube video" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`; track("video_play", { video_id: el.dataset.yt }); };
      el.addEventListener("click", play, { once: true });
      el.addEventListener("keydown", (e) => { if (e.key === "Enter") play(); });
    });
  }

  /* ---------- Misc UI ---------- */
  function initReveal() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    $$(".reveal").forEach((e) => io.observe(e));
  }
  function initCounters() {
    $$("[data-count]").forEach((el) => {
      const end = +el.dataset.count, suf = el.dataset.suffix || ""; let cur = 0; const step = Math.max(1, Math.ceil(end / 60));
      const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); const t = setInterval(() => { cur = Math.min(end, cur + step); el.textContent = cur.toLocaleString() + suf; if (cur >= end) clearInterval(t); }, 20); } });
      io.observe(el);
    });
  }
  function countdown(el, date) {
    const tick = () => {
      const d = new Date(date + "T23:59:59") - new Date();
      if (d <= 0) { el.innerHTML = '<span class="badge">Closed</span>'; return; }
      const D = Math.floor(d / 864e5), H = Math.floor(d / 36e5) % 24, M = Math.floor(d / 6e4) % 60, S = Math.floor(d / 1e3) % 60;
      el.innerHTML = [[D, "days"], [H, "hrs"], [M, "min"], [S, "sec"]].map(([v, l]) => `<div><b>${v}</b><small>${l}</small></div>`).join("");
    };
    tick(); setInterval(tick, 1000);
  }
  function initExitIntent() {
    if (!C.exitIntent || matchMedia("(max-width:900px)").matches) return;
    if (/match|leads|donate/.test(location.pathname)) return;
    const last = store.get("sm_exit", 0); if (Date.now() - last < (C.exitIntentDelayDays || 7) * 864e5) return;
    const onLeave = (e) => {
      if (e.clientY > 10) return; document.removeEventListener("mouseout", onLeave); store.set("sm_exit", Date.now());
      modal(`<div class="center exit-offer"><div class="big">🎓</div><h2>Before you go — get the free 2026 School Choice Checklist</h2>
      <p class="muted">27 questions to ask on every school tour, tuition & aid worksheet, and a monthly digest of scholarships closing soon.</p>
      <form class="form" data-form="lead-magnet" data-success-title="Check your inbox!" data-success-msg="Your checklist is on its way. Want personalised school matches too?" data-next="match.html" data-next-label="Get my free school matches">
        <input type="hidden" name="magnet" value="school-choice-checklist-2026">
        <div class="field"><input type="email" name="email" placeholder="Parent / student email" required></div>
        <label class="check"><input type="checkbox" name="consent" value="yes" required> I agree to receive emails from School.Media. Unsubscribe anytime.</label>
        <button class="btn btn-primary btn-lg btn-block" type="submit">Send me the checklist</button></form></div>`);
    };
    setTimeout(() => document.addEventListener("mouseout", onLeave), 8000);
  }
  function bookmarks() {
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-bookmark]"); if (!b) return;
      e.preventDefault();
      const saved = store.get("sm_saved", []), id = b.dataset.bookmark, i = saved.indexOf(id);
      if (i > -1) saved.splice(i, 1); else saved.push(id);
      store.set("sm_saved", saved); b.classList.toggle("on", i === -1);
      toast(i === -1 ? "⭐ Saved to your list" : "Removed from your list");
    });
  }
  function share() {
    document.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-share]"); if (!b) return;
      const url = location.href, title = document.title;
      if (b.dataset.share === "native" && navigator.share) { try { await navigator.share({ title, url }); } catch (_) {} return; }
      const map = {
        x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`
      };
      if (map[b.dataset.share]) window.open(map[b.dataset.share], "_blank", "noopener,width=640,height=560");
      else { try { await navigator.clipboard.writeText(url); toast("🔗 Link copied"); } catch (_) { toast(url); } }
      track("share", { method: b.dataset.share });
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    const h = $("#site-header"), f = $("#site-footer");
    if (h) h.outerHTML = header();
    if (f) f.outerHTML = footer();
    $("#themeBtn")?.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = cur === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", next); store.set("sm_theme", next);
    });
    $("#menuBtn")?.addEventListener("click", (e) => { const n = $("#navLinks"); n.classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", n.classList.contains("open")); });
    initTracking(); captureUTM(); initAds(); initForms(); initYT(); initReveal(); initCounters(); initExitIntent(); bookmarks(); share();
    $$("[data-countdown]").forEach((el) => countdown(el, el.dataset.countdown));
    const saved = store.get("sm_saved", []); $$("[data-bookmark]").forEach((b) => b.classList.toggle("on", saved.includes(b.dataset.bookmark)));
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
    document.dispatchEvent(new Event("sm:ready"));
  }

  window.SM = { $, $$, esc, store, getJSON, qs, fmtDate, money, toast, modal, closeModal, initForms, initAds, initYT, ytCard, countdown, track, submitLead, C };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
