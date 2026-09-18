/* ==========================================================
   School.Media — page modules (dispatched by <body data-page>)
   ========================================================== */
(function () {
  "use strict";
  const { $, $$, esc, store, getJSON, qs, fmtDate, money, toast, modal, initForms, initAds, initYT, ytCard, countdown, track, C } = window.SM;
  const page = document.body.dataset.page;
  const initials = (n) => n.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
  const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
  const tuition = (s) => (s.tuition ? `${s.currency} ${Number(s.tuition).toLocaleString()}/yr` : "Tuition-free");

  /* ---------------- Shared renderers ---------------- */
  function schoolCard(s) {
    return `<article class="card hover school-card">
      ${s.featured ? '<span class="badge badge-accent featured-ribbon">★ Featured</span>' : ""}
      <div class="school-top"><div class="school-logo" style="background:${s.color}">${esc(initials(s.name))}</div>
        <div><h3><a href="school.html?id=${s.id}">${esc(s.name)}</a></h3>
        <div class="meta">📍 ${esc(s.city)}, ${esc(s.country)} · ${esc(s.grades)}</div>
        <div class="meta"><span class="stars">${stars(s.rating)}</span> <b>${s.rating}</b> (${s.reviews})${s.verified ? ' · <span class="badge badge-success">✓ Verified</span>' : ""}</div></div></div>
      <div class="pill-row"><span class="badge badge-brand">${esc(s.type)}</span>${s.features.slice(0, 3).map((f) => `<span class="badge">${esc(f)}</span>`).join("")}</div>
      <div class="meta">💵 ${tuition(s)} · 👩‍🏫 ${esc(s.ratio)}</div>
      <div class="actions">
        <a class="btn btn-primary btn-sm" href="school.html?id=${s.id}#inquire">Request Info</a>
        <button class="btn btn-ghost btn-sm" data-compare="${s.id}">⚖️ Compare</button>
        <button class="btn btn-ghost btn-sm bookmark" data-bookmark="school:${s.id}" aria-label="Save">☆</button>
      </div></article>`;
  }
  function articleCard(a) {
    return `<article class="card hover"><div class="card-media"><div class="thumb" style="background:linear-gradient(135deg,#4f46e5,#db2777)">${a.emoji}</div></div>
      <span class="badge badge-brand">${esc(a.category)}</span>
      <h3 style="margin-top:10px"><a href="article.html?id=${a.id}">${esc(a.title)}</a></h3>
      <p class="muted" style="font-size:.93rem">${esc(a.excerpt)}</p>
      <div class="meta">${fmtDate(a.date)} · ${a.read} min read</div></article>`;
  }
  function videoCard(v) {
    return `<article class="card hover" style="padding:14px">${ytCard(v)}<h3 style="font-size:1rem;margin:12px 0 4px">${esc(v.title)}</h3><div class="meta">${esc(v.channel)} · ${esc(v.category)}</div></article>`;
  }
  function scholarshipCard(s) {
    const ext = /^https?:/.test(s.url);
    return `<article class="card hover" style="display:flex;flex-direction:column;gap:8px">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:start"><span class="badge ${s.house ? "badge-rose" : "badge-brand"}">${s.house ? "School.Media Award" : esc(s.category)}</span>${s.essay ? "" : '<span class="badge badge-success">No essay</span>'}</div>
      <h3 style="margin:4px 0 0">${esc(s.name)}</h3><div class="meta">${esc(s.sponsor)} · ${esc(s.level)} · ${esc(s.country)}</div>
      <div class="score" style="font-size:1.3rem">${esc(s.amountText)}</div>
      <p class="muted" style="font-size:.9rem;margin:0">${esc(s.desc)}</p>
      <div class="meta">🗓 ${s.deadline ? "Deadline " + fmtDate(s.deadline) : esc(s.window) + " · verify dates on official site"}</div>
      <div class="actions" style="display:flex;gap:8px;margin-top:auto;padding-top:8px">
        ${s.house ? `<a class="btn btn-primary btn-sm" href="${esc(s.url)}">Apply free</a>` : `<a class="btn btn-primary btn-sm" href="${esc(s.url)}" target="_blank" rel="noopener nofollow" data-outbound="${s.id}">Official site ↗</a>`}
        <button class="btn btn-ghost btn-sm bookmark" data-bookmark="sch:${s.id}">☆ Save</button></div></article>`;
  }
  function contestCard(c) {
    return `<article class="card hover" style="display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:2.2rem">${c.emoji}</span><span class="badge badge-brand">${esc(c.category)}</span></div>
      <h3 style="margin:0">${esc(c.title)}</h3><p class="muted" style="margin:0;font-size:.92rem">${esc(c.desc)}</p>
      <div class="meta">🏆 <b>${esc(c.prize)}</b></div><div class="meta">👥 ${esc(c.eligibility)} · 🎟 ${esc(c.entry)}</div>
      <div class="countdown" data-countdown="${c.deadline}"></div>
      <div style="display:flex;gap:8px;margin-top:auto"><button class="btn btn-primary btn-sm" data-enter="${c.id}">Enter now</button><button class="btn btn-ghost btn-sm" data-rules="${c.id}">Prizes & rules</button></div></article>`;
  }
  function jobCard(j) {
    return `<article class="card hover" style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
      <div class="school-logo" style="background:${j.school === "school-media" ? "linear-gradient(135deg,#4f46e5,#db2777)" : "#0ea5e9"};width:48px;height:48px">${esc(initials(j.org))}</div>
      <div style="flex:1;min-width:220px"><h3 style="margin:0 0 4px;font-size:1.05rem">${esc(j.title)} ${j.featured ? '<span class="badge badge-accent">Featured</span>' : ""}</h3>
      <div class="meta">${esc(j.org)} · 📍 ${esc(j.location)} · ${esc(j.type)} · 💵 ${esc(j.salary)}</div>
      <p class="muted" style="font-size:.9rem;margin:8px 0 0">${esc(j.summary)}</p></div>
      <button class="btn btn-primary btn-sm" data-apply="${j.id}">Apply</button></article>`;
  }

  /* ---------------- Compare (global) ---------------- */
  let compare = store.get("sm_compare", []);
  function renderCompareBar() {
    let bar = $("#compareBar");
    if (!compare.length) { bar && bar.remove(); return; }
    if (!bar) { bar = document.createElement("div"); bar.id = "compareBar"; bar.className = "compare-bar"; document.body.appendChild(bar); }
    bar.innerHTML = `<b>⚖️ ${compare.length} selected</b><button class="btn btn-accent btn-sm" id="doCompare" ${compare.length < 2 ? "disabled" : ""}>Compare now</button><button class="btn btn-sm" style="color:inherit" id="clearCompare">Clear</button>`;
    $("#doCompare").onclick = openCompare; $("#clearCompare").onclick = () => { compare = []; store.set("sm_compare", compare); renderCompareBar(); };
  }
  async function openCompare() {
    const all = await getJSON("schools"); const list = compare.map((id) => all.find((s) => s.id === id)).filter(Boolean);
    const rows = [["Type", (s) => s.type], ["Location", (s) => `${s.city}, ${s.country}`], ["Grades", (s) => s.grades], ["Rating", (s) => `${s.rating} ★ (${s.reviews})`], ["Tuition", tuition], ["Student–teacher", (s) => s.ratio], ["Students", (s) => s.students.toLocaleString()], ["Curriculum", (s) => s.curriculum], ["Financial aid", (s) => (s.admissions.financialAid ? "Yes" : "No")], ["Acceptance", (s) => s.admissions.acceptance], ["Highlights", (s) => s.features.join(", ")]];
    modal(`<h2>Compare schools</h2><div class="table-wrap"><table class="compare-table"><thead><tr><th></th>${list.map((s) => `<th style="color:var(--text)">${esc(s.name)}</th>`).join("")}</tr></thead><tbody>
      ${rows.map(([l, f]) => `<tr><th>${l}</th>${list.map((s) => `<td>${esc(f(s))}</td>`).join("")}</tr>`).join("")}
      <tr><th></th>${list.map((s) => `<td><a class="btn btn-primary btn-sm" href="school.html?id=${s.id}#inquire">Request info</a></td>`).join("")}</tr></tbody></table></div>`, true);
    track("compare_schools", { count: list.length });
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-compare]"); if (!b) return;
    const id = b.dataset.compare, i = compare.indexOf(id);
    if (i > -1) compare.splice(i, 1); else { if (compare.length >= 4) { toast("You can compare up to 4 schools"); return; } compare.push(id); }
    store.set("sm_compare", compare); renderCompareBar(); toast(i > -1 ? "Removed from compare" : "Added to compare");
  });
  renderCompareBar();

  /* ---------------- Contest entry (global) ---------------- */
  async function contestModal(id, rulesOnly) {
    const c = (await getJSON("contests")).find((x) => x.id === id); if (!c) return;
    const rules = `<ul class="ticks">${c.prizes.map((p) => `<li>${esc(p)}</li>`).join("")}</ul><dl class="kv"><dt>Eligibility</dt><dd>${esc(c.eligibility)}</dd><dt>Format</dt><dd>${esc(c.format)}</dd><dt>Entry fee</dt><dd>${esc(c.entry)}</dd><dt>Deadline</dt><dd>${fmtDate(c.deadline)}</dd></dl><p class="form-note" style="margin-top:12px">No purchase necessary. Entrants under 18 need parent/guardian consent. Winners are selected by a judging panel on the stated criteria. Full terms in our <a href="terms.html#contests">Terms</a>.</p>`;
    if (rulesOnly) { modal(`<h2>${c.emoji} ${esc(c.title)}</h2>${rules}<button class="btn btn-primary" data-enter="${c.id}">Enter now</button>`); return; }
    const nom = c.category === "Nomination", sch = c.category === "Schools";
    modal(`<h2>${c.emoji} Enter: ${esc(c.title)}</h2><p class="muted">${esc(c.format)} · Deadline ${fmtDate(c.deadline)}</p>
    <form class="form" data-form="contest-entry" data-success-title="Entry received! 🎉" data-success-msg="We'll email you a confirmation. Share your entry to get more votes!">
      <input type="hidden" name="contest" value="${c.id}">
      <div class="form-row"><div class="field"><label>${nom ? "Your name" : sch ? "Contact name" : "Student name"}</label><input type="text" name="name" required></div>
      <div class="field"><label>Email</label><input type="email" name="email" required></div></div>
      <div class="form-row"><div class="field"><label>${sch ? "School name" : "School"}</label><input type="text" name="school" ${sch ? "required" : ""}></div>
      <div class="field"><label>Country</label><input type="text" name="country" required></div></div>
      ${nom ? `<div class="field"><label>Teacher's name & school</label><input type="text" name="nominee" required></div><div class="field"><label>Why they deserve it (150–400 words)</label><textarea name="story" required></textarea></div>`
            : `<div class="form-row"><div class="field"><label>Age</label><input type="number" name="age" min="5" max="99"></div><div class="field"><label>Entry title</label><input type="text" name="title" required></div></div>
               <div class="field"><label>Link to your entry (YouTube, TikTok, Google Drive, Docs)</label><input type="url" name="entry_url" placeholder="https://" required></div>
               <div class="field"><label>Short description</label><textarea name="description"></textarea></div>`}
      <label class="check"><input type="checkbox" name="rules" value="agreed" required> I agree to the contest rules and confirm the entry is original work. If under 18, a parent/guardian consents to this entry.</label>
      <label class="check"><input type="checkbox" name="newsletter" value="yes" checked> Send me future contests & scholarships.</label>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Submit entry</button></form>`);
    track("contest_open", { contest: id });
  }
  document.addEventListener("click", (e) => {
    const en = e.target.closest("[data-enter]"); if (en) { e.preventDefault(); contestModal(en.dataset.enter); }
    const ru = e.target.closest("[data-rules]"); if (ru) { e.preventDefault(); contestModal(ru.dataset.rules, true); }
    const ob = e.target.closest("[data-outbound]"); if (ob) track("outbound_click", { id: ob.dataset.outbound });
  });

  /* ---------------- Pages ---------------- */
  const P = {};

  P.home = async () => {
    const [schools, articles, videos, contests] = await Promise.all([getJSON("schools"), getJSON("articles"), getJSON("videos"), getJSON("contests")]);
    $("#homeSchools").innerHTML = schools.filter((s) => s.featured).slice(0, 3).map(schoolCard).join("");
    $("#homeArticles").innerHTML = articles.slice(0, 3).map(articleCard).join("");
    $("#homeVideos").innerHTML = videos.slice(0, 3).map(videoCard).join("");
    $("#homeContests").innerHTML = contests.slice(0, 3).map(contestCard).join("");
    initYT(); $$("[data-countdown]").forEach((el) => countdown(el, el.dataset.countdown));
    $("#heroSearch")?.addEventListener("submit", (e) => { e.preventDefault(); const q = $("#heroQ").value, t = $("#heroType").value; location.href = `schools.html?q=${encodeURIComponent(q)}${t ? "&type=" + encodeURIComponent(t) : ""}`; });
  };

  P.directory = async () => {
    const all = await getJSON("schools");
    const types = [...new Set(all.map((s) => s.type))].sort(), countries = [...new Set(all.map((s) => s.country))].sort();
    const feats = ["Boarding", "STEM", "IB", "Online", "Tuition-free", "Bilingual", "Small classes", "Robotics"];
    $("#fType").innerHTML = types.map((t) => `<label><input type="checkbox" value="${t}" name="type"> ${t}</label>`).join("");
    $("#fCountry").innerHTML = `<option value="">All countries</option>` + countries.map((c) => `<option>${c}</option>`).join("");
    $("#fFeat").innerHTML = feats.map((t) => `<label><input type="checkbox" value="${t}" name="feat"> ${t}</label>`).join("");
    const q0 = qs("q"), t0 = qs("type"); if (q0) $("#q").value = q0; if (t0) $$('#fType input').forEach((i) => (i.checked = i.value === t0));
    const render = () => {
      const q = $("#q").value.toLowerCase().trim(), ty = $$('#fType input:checked').map((i) => i.value), co = $("#fCountry").value,
        fe = $$('#fFeat input:checked').map((i) => i.value.toLowerCase()), aid = $("#fAid").checked, maxT = +$("#fTuition").value, sort = $("#sort").value;
      $("#tuitionVal").textContent = maxT >= 70000 ? "Any" : "≤ " + maxT.toLocaleString();
      let r = all.filter((s) => (!q || (s.name + s.city + s.country + s.curriculum + s.features.join(" ")).toLowerCase().includes(q)) && (!ty.length || ty.includes(s.type)) && (!co || s.country === co) && (!fe.length || fe.every((f) => (s.features.join(" ") + s.curriculum + s.type).toLowerCase().includes(f.toLowerCase()))) && (!aid || s.admissions.financialAid) && (maxT >= 70000 || s.tuition <= maxT));
      r.sort((a, b) => sort === "rating" ? b.rating - a.rating : sort === "tuition" ? a.tuition - b.tuition : sort === "name" ? a.name.localeCompare(b.name) : (b.featured - a.featured) || b.rating - a.rating);
      $("#count").textContent = `${r.length} school${r.length === 1 ? "" : "s"}`;
      const cards = r.map(schoolCard); if (cards.length > 6) cards.splice(6, 0, '<div class="ad-slot" data-ad="multiplex" style="grid-column:1/-1;margin:0"></div>');
      $("#results").innerHTML = cards.join("") || `<div class="empty" style="grid-column:1/-1">No schools match. <a href="match.html">Try our free School Match</a> — we'll find options for you.</div>`;
      initAds($("#results"));
      const saved = store.get("sm_saved", []); $$("[data-bookmark]").forEach((b) => b.classList.toggle("on", saved.includes(b.dataset.bookmark)));
    };
    $$("#filters input, #filters select, #q, #sort").forEach((el) => el.addEventListener("input", render));
    $("#resetFilters").onclick = () => { $("#filters").reset(); $("#q").value = ""; render(); };
    render();
    if (location.hash === "#compare") toast("Tap ⚖️ Compare on 2–4 schools, then hit Compare now.", 5000);
  };

  P.school = async () => {
    const all = await getJSON("schools"); const s = all.find((x) => x.id === qs("id")) || all[0];
    document.title = `${s.name} — Reviews, Tuition & Admissions | School.Media`;
    $('meta[name="description"]')?.setAttribute("content", `${s.name} in ${s.city}: ${s.type} school, grades ${s.grades}. Tuition, reviews, admissions and how to apply.`);
    $("#sName").textContent = s.name; $("#crumb").textContent = s.name;
    $("#sMeta").innerHTML = `📍 ${esc(s.city)}, ${esc(s.region)}, ${esc(s.country)} · ${esc(s.type)} · Grades ${esc(s.grades)} · <span class="stars">${stars(s.rating)}</span> ${s.rating} (${s.reviews} reviews) ${s.verified ? '<span class="badge badge-success">✓ Verified</span>' : ""}`;
    $("#sLogo").style.background = s.color; $("#sLogo").textContent = initials(s.name);
    $("#sDesc").textContent = s.description;
    $("#sFacts").innerHTML = [["Tuition", tuition(s)], ["Students", s.students.toLocaleString()], ["Student–teacher ratio", s.ratio], ["Founded", s.founded], ["Curriculum", s.curriculum], ["Religious affiliation", s.religion], ["Acceptance rate", s.admissions.acceptance], ["Application deadline", s.admissions.deadline === "Rolling" ? "Rolling" : fmtDate(s.admissions.deadline)], ["Financial aid", s.admissions.financialAid ? "Available" : "Not offered"]].map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("");
    $("#sFeatures").innerHTML = s.features.concat(s.sports).map((f) => `<span class="chip">${esc(f)}</span>`).join("");
    $$(".js-school-name").forEach((e) => (e.textContent = s.name));
    $("#inqSchool").value = s.id; $("#tourSchool").value = s.id;
    $("#sCompare").dataset.compare = s.id; $("#sSave").dataset.bookmark = "school:" + s.id;
    if (s.sample) $("#sampleNote").classList.remove("hidden");
    const sim = all.filter((x) => x.id !== s.id && (x.type === s.type || x.country === s.country)).slice(0, 3);
    $("#similar").innerHTML = sim.map(schoolCard).join("");
    const events = (await getJSON("events")).filter((e) => e.school === s.id);
    $("#sEvents").innerHTML = events.length ? events.map((e) => `<li class="leaderboard" style="list-style:none"><b>${esc(e.type)}</b> — ${fmtDate(e.date)} · ${esc(e.time)} (${esc(e.format)})</li>`).join("") : '<p class="muted">No upcoming events listed. Request a private tour below.</p>';
    // Reviews (local)
    const key = "sm_reviews_" + s.id; const renderReviews = () => { const rv = store.get(key, []); $("#reviewsList").innerHTML = rv.length ? rv.map((r) => `<div class="card" style="padding:16px"><div class="stars">${stars(r.stars)}</div><p style="margin:6px 0">${esc(r.text)}</p><div class="meta">${esc(r.role)} · ${fmtDate(r.date)} · pending moderation</div></div>`).join("") : '<p class="muted">Be the first to share your experience. Reviews are moderated before publishing.</p>'; };
    renderReviews();
    document.addEventListener("sm:lead", (e) => { if (e.detail.form === "school-review") { const d = e.detail.data; const rv = store.get(key, []); rv.unshift({ stars: +d.stars, text: d.review, role: d.role, date: new Date().toISOString().slice(0, 10) }); store.set(key, rv); renderReviews(); } });
    // JSON-LD
    const ld = document.createElement("script"); ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "School", name: s.name, address: { "@type": "PostalAddress", addressLocality: s.city, addressRegion: s.region, addressCountry: s.country }, aggregateRating: { "@type": "AggregateRating", ratingValue: s.rating, reviewCount: s.reviews } });
    if (!s.sample) document.head.appendChild(ld);
    track("view_school", { school: s.id });
  };

  P.match = async () => {
    const steps = $$(".step"), total = steps.length; let i = 0; const answers = {};
    const show = (n) => { steps.forEach((s, k) => s.classList.toggle("active", k === n)); $(".progress span").style.width = ((n + 1) / total) * 100 + "%"; $("#stepNum").textContent = `Step ${n + 1} of ${total}`; i = n; window.scrollTo({ top: $(".stepper").offsetTop - 90, behavior: "smooth" }); };
    $$(".option").forEach((o) => o.addEventListener("click", () => {
      const step = o.closest(".step"), key = step.dataset.key, multi = step.dataset.multi === "1";
      if (!multi) { $$(".option", step).forEach((x) => x.classList.remove("selected")); o.classList.add("selected"); answers[key] = o.dataset.value; setTimeout(() => show(Math.min(i + 1, total - 1)), 220); }
      else { o.classList.toggle("selected"); answers[key] = $$(".option.selected", step).map((x) => x.dataset.value); }
      track("match_answer", { step: key });
    }));
    $$("[data-next]").forEach((b) => b.addEventListener("click", () => show(Math.min(i + 1, total - 1))));
    $$("[data-prev]").forEach((b) => b.addEventListener("click", () => show(Math.max(i - 1, 0))));
    const form = $("#matchForm"); form._extra = () => ({ answers: JSON.stringify(answers), ...answers });
    document.addEventListener("sm:lead", async (e) => {
      if (e.detail.form !== "school-match") return;
      const all = await getJSON("schools");
      const score = (s) => {
        let sc = s.rating * 10;
        if (answers.type && answers.type !== "Not sure" && s.type === answers.type) sc += 40;
        if (answers.budget === "free" && s.tuition === 0) sc += 35; if (answers.budget === "low" && s.tuition > 0 && s.tuition < 20000) sc += 25; if (answers.budget === "high" && s.tuition >= 20000) sc += 20;
        (answers.priorities || []).forEach((p) => { if ((s.features.join(" ") + s.curriculum).toLowerCase().includes(p.toLowerCase())) sc += 15; });
        if (answers.country && s.country === answers.country) sc += 30;
        if (s.featured) sc += 5; return sc;
      };
      const top = all.map((s) => ({ s, sc: score(s) })).sort((a, b) => b.sc - a.sc).slice(0, 5);
      const max = top[0].sc;
      $("#matchResults").innerHTML = `<h2 class="center">🎯 Your top ${top.length} matches</h2><p class="center muted">We've emailed these to you. Selected schools may contact you to answer questions or invite you to a tour.</p><div class="grid g3" style="margin-top:24px">${top.map(({ s, sc }) => schoolCard(s).replace('<div class="pill-row">', `<div class="score">${Math.round((sc / max) * 97)}% match</div><div class="pill-row">`)).join("")}</div>`;
      $("#matchResults").classList.remove("hidden"); $("#matchResults").scrollIntoView({ behavior: "smooth" });
    });
    show(0);
  };

  P.news = async () => {
    const all = await getJSON("articles"); const cats = ["All", ...new Set(all.map((a) => a.category))];
    let cur = qs("cat") || "All";
    const render = () => {
      $("#catChips").innerHTML = cats.map((c) => `<button class="chip ${c === cur ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
      const q = ($("#newsQ").value || "").toLowerCase();
      const list = all.filter((a) => (cur === "All" || a.category === cur) && (!q || (a.title + a.excerpt).toLowerCase().includes(q)));
      const cards = list.map(articleCard); if (cards.length > 3) cards.splice(3, 0, '<div class="ad-slot" data-ad="leaderboard" style="grid-column:1/-1;margin:0"></div>');
      $("#newsGrid").innerHTML = cards.join("") || '<div class="empty" style="grid-column:1/-1">No articles found.</div>';
      initAds($("#newsGrid"));
    };
    $("#catChips").addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) { cur = b.dataset.cat; render(); } });
    $("#newsQ").addEventListener("input", render);
    const f = all.find((a) => a.featured) || all[0];
    $("#leadStory").innerHTML = `<div class="split card" style="padding:0;overflow:hidden"><div class="illus" style="border-radius:0;box-shadow:none;min-height:260px">${f.emoji}</div><div style="padding:28px"><span class="badge badge-accent">Editor's pick</span><h2 style="margin-top:12px"><a href="article.html?id=${f.id}" style="color:var(--text)">${esc(f.title)}</a></h2><p class="muted">${esc(f.excerpt)}</p><a class="btn btn-primary" href="article.html?id=${f.id}">Read the guide →</a></div></div>`;
    render();
  };

  P.article = async () => {
    const all = await getJSON("articles"); const a = all.find((x) => x.id === qs("id")) || all[0];
    document.title = `${a.title} | School.Media`;
    $('meta[name="description"]')?.setAttribute("content", a.excerpt);
    $("#aCat").textContent = a.category; $("#aTitle").textContent = a.title; $("#aExcerpt").textContent = a.excerpt;
    $("#aMeta").textContent = `By ${a.author} · ${fmtDate(a.date)} · ${a.read} min read`;
    // insert in-article ad after 3rd block + mid-article lead CTA
    const tmp = document.createElement("div"); tmp.innerHTML = a.body; const kids = [...tmp.children];
    if (kids.length > 4) kids[2].insertAdjacentHTML("afterend", '<div class="ad-slot" data-ad="inArticle"></div>');
    if (kids.length > 8) kids[6].insertAdjacentHTML("afterend", `<div class="card" style="margin:24px 0;background:color-mix(in srgb,var(--brand) 7%,var(--surface))"><b>🎯 Want a shortlist in 2 minutes?</b><p class="muted" style="margin:6px 0 12px">Answer 6 quick questions and get your personalised school matches — free.</p><a class="btn btn-primary btn-sm" href="match.html">Start my free School Match</a></div>`);
    $("#aBody").innerHTML = tmp.innerHTML; initAds($("#aBody"));
    $("#aBookmark").dataset.bookmark = "article:" + a.id;
    $("#related").innerHTML = all.filter((x) => x.id !== a.id).sort((x, y) => (y.category === a.category) - (x.category === a.category)).slice(0, 3).map(articleCard).join("");
    const ld = document.createElement("script"); ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: a.title, datePublished: a.date, author: { "@type": "Organization", name: "School.Media" }, publisher: { "@type": "Organization", name: "School.Media" }, description: a.excerpt });
    document.head.appendChild(ld);
    const bar = $(".reading-progress"); window.addEventListener("scroll", () => { const h = document.documentElement; bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%"; }, { passive: true });
  };

  P.videos = async () => {
    const all = await getJSON("videos"); const cats = ["All", ...new Set(all.map((v) => v.category))]; let cur = "All";
    const f = all.find((v) => v.featured) || all[0];
    $("#featuredVideo").innerHTML = `<div class="split"><div>${ytCard(f)}</div><div><span class="badge badge-rose">▶ Featured</span><h2 style="margin-top:12px">${esc(f.title)}</h2><p class="muted">${esc(f.desc)}</p><div class="meta">${esc(f.channel)} · ${esc(f.duration)}</div><div class="share" style="margin-top:16px"><button class="btn btn-ghost btn-sm" data-share="copy">🔗 Share</button>${C.youtubeChannel ? `<a class="btn btn-primary btn-sm" href="${esc(C.youtubeChannel)}?sub_confirmation=1" target="_blank" rel="noopener">▶ Subscribe on YouTube</a>` : ""}</div></div></div>`;
    const render = () => {
      $("#vidChips").innerHTML = cats.map((c) => `<button class="chip ${c === cur ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
      $("#vidGrid").innerHTML = all.filter((v) => cur === "All" || v.category === cur).map(videoCard).join("");
      initYT();
    };
    $("#vidChips").addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) { cur = b.dataset.cat; render(); } });
    render(); initYT();
  };

  P.scholarships = async () => {
    const all = await getJSON("scholarships");
    const levels = [...new Set(all.flatMap((s) => s.level.split(/,\s*/)))];
    $("#sLevel").innerHTML = '<option value="">Any level</option>' + levels.map((l) => `<option>${l}</option>`).join("");
    const render = () => {
      const q = $("#sQ").value.toLowerCase(), lv = $("#sLevel").value, ne = $("#sNoEssay").checked, intl = $("#sIntl").checked;
      const r = all.filter((s) => (!q || (s.name + s.sponsor + s.category + s.desc).toLowerCase().includes(q)) && (!lv || s.level.includes(lv)) && (!ne || !s.essay) && (!intl || /International|Global/.test(s.country)));
      $("#sCount").textContent = r.length + " scholarships";
      $("#sGrid").innerHTML = r.map(scholarshipCard).join("") || '<div class="empty" style="grid-column:1/-1">No matches — create a profile and we\'ll alert you when new ones open.</div>';
      const saved = store.get("sm_saved", []); $$("[data-bookmark]").forEach((b) => b.classList.toggle("on", saved.includes(b.dataset.bookmark)));
    };
    $$("#sQ,#sLevel,#sNoEssay,#sIntl").forEach((e) => e.addEventListener("input", render)); render();
  };

  P.contests = async () => {
    const all = await getJSON("contests");
    const f = all.find((c) => c.featured) || all[0];
    $("#featContest").innerHTML = `<div class="band"><div class="band-grid"><div><span class="badge" style="background:rgba(255,255,255,.18);color:#fff;border:0">Featured contest</span><h2 style="margin-top:12px">${f.emoji} ${esc(f.title)}</h2><p>${esc(f.desc)}</p><p><b>🏆 ${esc(f.prize)}</b></p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-white btn-lg" data-enter="${f.id}">Enter free</button><button class="btn btn-ghost btn-lg" style="color:#fff;border-color:rgba(255,255,255,.5)" data-rules="${f.id}">Prizes & rules</button></div></div><div><p style="margin-bottom:8px;font-weight:700">Entries close in</p><div class="countdown" data-countdown="${f.deadline}" style="color:var(--text)"></div></div></div></div>`;
    $("#contestGrid").innerHTML = all.filter((c) => c !== f).map(contestCard).join("");
    $$("[data-countdown]").forEach((el) => countdown(el, el.dataset.countdown));
  };

  P.jobs = async () => {
    const all = await getJSON("jobs"); const cats = ["All", ...new Set(all.map((j) => j.category))]; let cur = "All";
    const render = () => {
      const q = $("#jQ").value.toLowerCase(), t = $("#jType").value;
      $("#jChips").innerHTML = cats.map((c) => `<button class="chip ${c === cur ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
      const r = all.filter((j) => (cur === "All" || j.category === cur) && (!t || j.type === t) && (!q || (j.title + j.org + j.location).toLowerCase().includes(q))).sort((a, b) => b.featured - a.featured);
      $("#jobList").innerHTML = r.map(jobCard).join("") || '<div class="empty">No roles match. Join the talent pool and we\'ll match you.</div>';
    };
    $("#jChips").addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) { cur = b.dataset.cat; render(); } });
    $$("#jQ,#jType").forEach((e) => e.addEventListener("input", render)); render();
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-apply]"); if (!b) return; const j = all.find((x) => x.id === b.dataset.apply);
      modal(`<h2>Apply: ${esc(j.title)}</h2><p class="muted">${esc(j.org)} · ${esc(j.location)} · ${esc(j.salary)}</p>
        <form class="form" data-form="job-application" data-success-title="Application sent!" data-success-msg="The hiring team will review your application. Good luck!">
          <input type="hidden" name="job" value="${j.id}"><input type="hidden" name="job_title" value="${esc(j.title)}">
          <div class="form-row"><div class="field"><label>Full name</label><input type="text" name="name" required></div><div class="field"><label>Email</label><input type="email" name="email" required></div></div>
          <div class="form-row"><div class="field"><label>Phone</label><input type="tel" name="phone"></div><div class="field"><label>Location</label><input type="text" name="location"></div></div>
          <div class="field"><label>Résumé / portfolio link</label><input type="url" name="resume_url" placeholder="Google Drive, LinkedIn, portfolio…" required></div>
          <div class="field"><label>Why you? (short)</label><textarea name="cover"></textarea></div>
          <label class="check"><input type="checkbox" name="consent" value="yes" required> I consent to School.Media sharing my application with this employer.</label>
          <button class="btn btn-primary btn-block" type="submit">Send application</button></form>`);
    });
  };

  P.events = async () => {
    const [ev, schools] = await Promise.all([getJSON("events"), getJSON("schools")]);
    const render = () => {
      const f = $("#evFormat").value, q = $("#evQ").value.toLowerCase();
      const list = ev.filter((e) => (!f || e.format === f) && (!q || (e.title + e.city + e.country).toLowerCase().includes(q))).sort((a, b) => a.date.localeCompare(b.date));
      $("#evList").innerHTML = list.map((e) => { const d = new Date(e.date + "T00:00:00"); const s = schools.find((x) => x.id === e.school);
        return `<article class="card hover" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><div style="text-align:center;min-width:64px;background:var(--surface-2);border-radius:12px;padding:10px"><div class="muted" style="font-size:.75rem;font-weight:700;text-transform:uppercase">${d.toLocaleString(undefined, { month: "short" })}</div><div style="font-size:1.6rem;font-weight:800">${d.getDate()}</div></div>
        <div style="flex:1;min-width:200px"><h3 style="margin:0 0 4px;font-size:1.05rem">${esc(e.title)}</h3><div class="meta">🕘 ${esc(e.time)} · ${e.format === "Virtual" ? "💻 Virtual" : "📍 " + esc(e.city) + ", " + esc(e.country)} · <a href="school.html?id=${s?.id}">View school</a></div></div>
        <button class="btn btn-primary btn-sm" data-rsvp="${e.id}">RSVP free</button></article>`; }).join("") || '<div class="empty">No events match.</div>';
    };
    $$("#evFormat,#evQ").forEach((e) => e.addEventListener("input", render)); render();
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-rsvp]"); if (!b) return; const x = ev.find((v) => v.id === b.dataset.rsvp);
      modal(`<h2>RSVP: ${esc(x.title)}</h2><p class="muted">${fmtDate(x.date)} · ${esc(x.time)} · ${esc(x.format)}</p>
      <form class="form" data-form="event-rsvp" data-success-title="You're registered!" data-success-msg="We'll send the details and a reminder before the event.">
        <input type="hidden" name="event" value="${x.id}"><input type="hidden" name="school" value="${x.school}">
        <div class="form-row"><div class="field"><label>Parent name</label><input type="text" name="name" required></div><div class="field"><label>Email</label><input type="email" name="email" required></div></div>
        <div class="form-row"><div class="field"><label>Phone</label><input type="tel" name="phone"></div><div class="field"><label>Attendees</label><select name="attendees"><option>1</option><option>2</option><option>3</option><option>4+</option></select></div></div>
        <div class="field"><label>Student's entry grade</label><select name="grade"><option>Pre-K</option><option>K–2</option><option>3–5</option><option>6–8</option><option>9–12</option></select></div>
        <label class="check"><input type="checkbox" name="consent" value="yes" required> Share my details with this school so they can confirm my visit.</label>
        <button class="btn btn-primary btn-block" type="submit">Confirm RSVP</button></form>`);
    });
  };

  P.donate = () => {
    const d = C.donate || {}; let freq = "once", amt = 50;
    const pct = d.goal ? Math.min(100, Math.round((d.raised / d.goal) * 100)) : 0;
    $("#goalText").innerHTML = d.raised ? `<b>${money(d.raised)}</b> raised of ${money(d.goal)} goal · ${d.supporters} supporters` : `Goal: <b>${money(d.goal)}</b> this year — become a founding supporter`;
    $("#goalBar").style.width = Math.max(pct, 2) + "%";
    $$(".toggle button").forEach((b) => b.addEventListener("click", () => { $$(".toggle button").forEach((x) => x.classList.remove("on")); b.classList.add("on"); freq = b.dataset.freq; upd(); }));
    $$(".amount[data-amt]").forEach((b) => b.addEventListener("click", () => { $$(".amount").forEach((x) => x.classList.remove("selected")); b.classList.add("selected"); amt = +b.dataset.amt; $("#customAmt").value = ""; upd(); }));
    $("#customAmt").addEventListener("input", (e) => { $$(".amount").forEach((x) => x.classList.remove("selected")); amt = +e.target.value || 0; upd(); });
    const impact = (a) => a >= 500 ? "funds a full student scholarship prize" : a >= 250 ? "sponsors a classroom STEM kit" : a >= 100 ? "produces a free video lesson" : a >= 50 ? "keeps School.Media ad-light for 1,000 readers" : a >= 25 ? "pays for a student reporter's article" : "covers hosting for a day";
    function upd() { $("#donateBtn").textContent = `Donate ${money(amt || 0)}${freq === "monthly" ? "/month" : ""}`; $("#impact").textContent = amt ? `💡 ${money(amt)}${freq === "monthly" ? " a month" : ""} ${impact(amt)}.` : ""; }
    upd();
    $("#donateBtn").addEventListener("click", () => {
      track("begin_checkout", { value: amt, currency: "USD", frequency: freq });
      const link = freq === "monthly" ? (d.stripeMonthly || d.patreon || d.githubSponsors) : (d.stripeOneTime || d.paypal || d.buyMeACoffee);
      if (link) { window.open(link + (link.includes("stripe") ? (link.includes("?") ? "&" : "?") + "__prefilled_amount=" + amt * 100 : ""), "_blank", "noopener"); return; }
      modal(`<h2>Pledge your support</h2><p class="muted">Online payments are being set up. Leave your pledge and we'll send a secure payment link to your email.</p>
      <form class="form" data-form="donation-pledge" data-success-title="Thank you! ❤️" data-success-msg="We'll email you a secure payment link shortly.">
        <input type="hidden" name="amount" value="${amt}"><input type="hidden" name="frequency" value="${freq}">
        <div class="form-row"><div class="field"><label>Name</label><input type="text" name="name" required></div><div class="field"><label>Email</label><input type="email" name="email" required></div></div>
        <div class="field"><label>Dedicate / message (optional)</label><input type="text" name="message"></div>
        <label class="check"><input type="checkbox" name="public" value="yes"> List my name on the supporters wall</label>
        <button class="btn btn-primary btn-block" type="submit">Pledge ${money(amt)}${freq === "monthly" ? "/mo" : ""}</button></form>`);
    });
    const alt = [["PayPal", d.paypal], ["Buy Me a Coffee", d.buyMeACoffee], ["GitHub Sponsors", d.githubSponsors], ["Patreon", d.patreon]].filter(([, l]) => l);
    $("#altPay").innerHTML = alt.length ? alt.map(([n, l]) => `<a class="btn btn-ghost btn-sm" href="${esc(l)}" target="_blank" rel="noopener">${n}</a>`).join("") : "";
  };

  P.forschools = () => {
    $$(".toggle button").forEach((b) => b.addEventListener("click", () => {
      $$(".toggle button").forEach((x) => x.classList.remove("on")); b.classList.add("on");
      const yr = b.dataset.freq === "yearly"; $$("[data-m]").forEach((el) => (el.textContent = yr ? el.dataset.y : el.dataset.m)); $$(".per").forEach((el) => (el.textContent = yr ? "/mo, billed yearly" : "/month"));
    }));
    $$("[data-plan]").forEach((b) => b.addEventListener("click", (e) => {
      const plan = b.dataset.plan, link = C.payments?.[b.dataset.pay];
      e.preventDefault(); track("select_plan", { plan });
      if (link) { window.open(link, "_blank", "noopener"); return; }
      $("#planField").value = plan; $("#list").scrollIntoView({ behavior: "smooth" }); toast(`Selected: ${plan}`);
    }));
    // ROI calculator
    const calc = () => {
      const tuitionV = +$("#roiTuition").value || 0, years = +$("#roiYears").value || 0, leads = +$("#roiLeads").value || 0, conv = (+$("#roiConv").value || 0) / 100;
      const students = leads * 12 * conv, rev = students * tuitionV * years;
      $("#roiOut").innerHTML = `<b>${students.toFixed(1)}</b> new students/yr → <b>${money(Math.round(rev))}</b> lifetime tuition revenue`;
    };
    $$("#roi input").forEach((i) => i.addEventListener("input", calc)); calc();
  };

  P.contact = () => { const t = qs("topic") || (location.hash === "#write" ? "Write for us" : ""); if (t) { const sel = $("#topic"); [...sel.options].forEach((o) => { if (o.text === t) sel.value = o.value; }); } };

  P.leads = () => {
    const render = () => {
      const leads = store.get("sm_leads", []); const f = $("#lf").value;
      const list = leads.filter((l) => !f || l.form === f);
      $("#lf").innerHTML = '<option value="">All forms</option>' + [...new Set(leads.map((l) => l.form))].map((x) => `<option ${x === f ? "selected" : ""}>${x}</option>`).join("");
      $("#lcount").textContent = `${list.length} submissions`;
      $("#ltable").innerHTML = list.length ? `<table class="compare-table"><thead><tr><th>When</th><th>Form</th><th>Name</th><th>Email</th><th>Phone</th><th>Details</th></tr></thead><tbody>${list.map((l) => `<tr><td>${new Date(l._submitted).toLocaleString()}</td><td><span class="badge badge-brand">${esc(l.form)}</span></td><td>${esc(l.name || l.parent_name || "")}</td><td>${esc(l.email || "")}</td><td>${esc(l.phone || "")}</td><td style="font-size:.8rem;max-width:360px">${esc(Object.entries(l).filter(([k]) => !k.startsWith("_") && !["form", "name", "email", "phone", "answers"].includes(k)).map(([k, v]) => k + ": " + v).join(" · "))}</td></tr>`).join("")}</tbody></table>` : '<div class="empty">No submissions in this browser yet.</div>';
    };
    $("#lf").addEventListener("change", render);
    $("#lexport").onclick = () => {
      const leads = store.get("sm_leads", []); if (!leads.length) return toast("Nothing to export");
      const keys = [...new Set(leads.flatMap((l) => Object.keys(l)))];
      const csv = [keys.join(","), ...leads.map((l) => keys.map((k) => `"${String(typeof l[k] === "object" ? JSON.stringify(l[k]) : l[k] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "school-media-leads.csv"; a.click();
    };
    $("#lclear").onclick = () => { if (confirm("Delete all locally stored submissions?")) { store.set("sm_leads", []); render(); } };
    $("#endpointStatus").innerHTML = C.formEndpoint ? `✅ Live: forms POST to <code>${esc(C.formEndpoint)}</code>` : "⚠️ Demo mode: no <code>formEndpoint</code> set in assets/js/config.js — submissions are saved only in this browser.";
    render();
  };

  if (P[page]) Promise.resolve().then(() => P[page]()).catch((e) => { console.error(e); toast("⚠️ Couldn't load content. Please refresh."); });
})();
