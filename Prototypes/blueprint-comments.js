/* Inline commenting layer for the EHD service blueprint pages.
 *
 * Usage: <script defer src="blueprint-comments.js"
 *                data-page="ehd-current-state"
 *                data-api="https://.../api/blueprint-comments"></script>
 *
 * Every card, panel and stage header gets a comment button. Comments are
 * shared (stored via the API); each visitor can edit/delete their own
 * comments — ownership is a per-comment secret kept in localStorage.
 */
(function () {
  const script = document.currentScript;
  const PAGE = script.dataset.page;
  const API = script.dataset.api;
  if (!PAGE || !API) return;

  const LS_NAME = "bc-name";
  const LS_SECRETS = "bc-secrets-" + PAGE;

  let comments = [];
  let activeSection = null; // null = all-comments view
  let drawerOpen = false;
  const targets = new Map(); // sectionId -> {el, label}

  /* ---------- helpers ---------- */

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  function slug(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  }

  function getName() { return localStorage.getItem(LS_NAME) || ""; }
  function setName(v) { localStorage.setItem(LS_NAME, v); }

  function getSecrets() {
    try { return JSON.parse(localStorage.getItem(LS_SECRETS)) || {}; }
    catch { return {}; }
  }
  function saveSecret(id, secret) {
    const s = getSecrets(); s[id] = secret;
    localStorage.setItem(LS_SECRETS, JSON.stringify(s));
  }
  function dropSecret(id) {
    const s = getSecrets(); delete s[id];
    localStorage.setItem(LS_SECRETS, JSON.stringify(s));
  }
  function mySecret(id) { return getSecrets()[id] || null; }

  function newSecret() {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  function timeAgo(iso) {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    if (s < 604800) return Math.floor(s / 86400) + "d ago";
    return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  async function apiCall(method, body, qs) {
    const res = await fetch(API + (qs || ""), {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error("api_" + res.status);
    return res.json();
  }

  /* ---------- discover commentable sections ---------- */

  function findSections() {
    const stageNames = Array.from(document.querySelectorAll(".stagehead h2")).map((h) => h.textContent.trim());
    const seen = {};

    function register(el, baseLabel, headingText) {
      let id = slug(headingText || baseLabel) || "section";
      if (seen[id] != null) { seen[id] += 1; id = id + "-" + seen[id]; } else { seen[id] = 0; }
      targets.set(id, { el, label: baseLabel });
      el.dataset.bcId = id;
      el.classList.add("bc-target");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bc-btn";
      btn.setAttribute("aria-label", "Comments on: " + baseLabel);
      btn.addEventListener("click", (e) => { e.stopPropagation(); openSection(id); });
      el.appendChild(btn);
    }

    document.querySelectorAll(".stagehead").forEach((el, i) => {
      const h = el.querySelector("h2");
      const name = h ? h.textContent.trim() : "Stage " + (i + 1);
      register(el, "Stage " + (i + 1) + " — " + name, "stage-" + (i + 1) + "-" + name);
    });

    document.querySelectorAll(".cell").forEach((cell) => {
      // Lane = nearest preceding .lanelabel; stage = how many cells since it.
      let lane = "", stageIdx = 0, node = cell;
      while ((node = node.previousElementSibling)) {
        if (node.classList.contains("cell")) stageIdx++;
        else if (node.classList.contains("lanelabel")) {
          const inner = node.querySelector(".inner");
          lane = inner ? inner.childNodes[0].textContent.trim() : "";
          break;
        }
      }
      const stage = stageNames[stageIdx] ? "Stage " + (stageIdx + 1) + " · " : "";
      cell.querySelectorAll(".cardx").forEach((card) => {
        const h = card.querySelector("h4");
        const title = h ? h.textContent.trim() : "Card";
        register(card, stage + lane + " — " + title, title + "-" + lane + "-" + stageIdx);
      });
    });

    document.querySelectorAll(".panels .panel").forEach((panel) => {
      const h = panel.querySelector("h3");
      const title = h ? h.textContent.trim() : "Panel";
      register(panel, title, "panel-" + title);
    });
  }

  /* ---------- rendering ---------- */

  function counts() {
    const byId = {};
    comments.forEach((c) => { byId[c.section] = (byId[c.section] || 0) + 1; });
    return byId;
  }

  function refreshBadges() {
    const byId = counts();
    targets.forEach((t, id) => {
      const btn = t.el.querySelector(":scope > .bc-btn");
      if (!btn) return;
      const n = byId[id] || 0;
      btn.textContent = n ? n : "💬";
      btn.classList.toggle("has", n > 0);
    });
    const fab = document.getElementById("bc-fab");
    if (fab) fab.textContent = "💬 Comments" + (comments.length ? " (" + comments.length + ")" : "");
  }

  function commentHtml(c) {
    const own = !!mySecret(c.id);
    return (
      '<div class="bc-comment" data-id="' + c.id + '">' +
        '<div class="bc-meta"><strong>' + esc(c.author) + "</strong>" +
        '<span>' + timeAgo(c.createdAt) + (c.edited ? " · edited" : "") + "</span></div>" +
        '<div class="bc-text">' + esc(c.text) + "</div>" +
        (own
          ? '<div class="bc-actions"><button type="button" data-act="edit">Edit</button>' +
            '<button type="button" data-act="delete">Delete</button></div>'
          : "") +
      "</div>"
    );
  }

  function render() {
    const drawer = document.getElementById("bc-drawer");
    drawer.classList.toggle("open", drawerOpen);
    document.querySelectorAll(".bc-active").forEach((el) => el.classList.remove("bc-active"));
    if (!drawerOpen) { refreshBadges(); return; }

    const titleEl = drawer.querySelector(".bc-title");
    const bodyEl = drawer.querySelector(".bc-body");
    const backBtn = drawer.querySelector(".bc-back");

    if (activeSection) {
      const t = targets.get(activeSection);
      const label = t ? t.label : (comments.find((c) => c.section === activeSection) || {}).sectionLabel || "Section";
      if (t) t.el.classList.add("bc-active");
      titleEl.textContent = label;
      backBtn.style.display = "";
      const list = comments.filter((c) => c.section === activeSection);
      bodyEl.innerHTML =
        (list.length
          ? list.map(commentHtml).join("")
          : '<p class="bc-empty">No comments yet on this section. Be the first!</p>') +
        '<form class="bc-form">' +
          '<input type="text" name="author" placeholder="Your name" maxlength="60" required value="' + esc(getName()) + '">' +
          '<textarea name="text" placeholder="Write a comment…" maxlength="2000" required rows="3"></textarea>' +
          '<button type="submit">Post comment</button>' +
          '<span class="bc-status" role="status"></span>' +
        "</form>";
    } else {
      titleEl.textContent = "All comments";
      backBtn.style.display = "none";
      if (!comments.length) {
        bodyEl.innerHTML =
          '<p class="bc-empty">No comments yet.<br><br>Hover over any card on the blueprint and click the 💬 button to leave the first comment. You can edit or delete your own comments afterwards (from this device).</p>';
      } else {
        const groups = new Map();
        comments.forEach((c) => {
          if (!groups.has(c.section)) groups.set(c.section, []);
          groups.get(c.section).push(c);
        });
        let html = "";
        groups.forEach((list, sectionId) => {
          const t = targets.get(sectionId);
          const label = t ? t.label : list[0].sectionLabel || "Removed section";
          html +=
            '<div class="bc-group"><button type="button" class="bc-group-head" data-section="' +
            esc(sectionId) + '">' + esc(label) + " (" + list.length + ")</button>" +
            list.map(commentHtml).join("") + "</div>";
        });
        bodyEl.innerHTML = html;
      }
    }
    refreshBadges();
  }

  /* ---------- actions ---------- */

  function openSection(id) {
    activeSection = id;
    drawerOpen = true;
    render();
    const form = document.querySelector("#bc-drawer .bc-form textarea");
    if (form && !comments.some((c) => c.section === id)) form.focus();
  }

  function jumpTo(id) {
    const t = targets.get(id);
    if (t) t.el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    openSection(id);
  }

  async function reload() {
    try {
      const data = await apiCall("GET", null, "?page=" + encodeURIComponent(PAGE));
      comments = data.comments;
      // Don't re-render over someone mid-typing — just refresh the badges.
      const ta = document.querySelector("#bc-drawer textarea");
      const typing = ta && (ta.value.trim() || document.activeElement === ta);
      if (typing) refreshBadges();
      else render();
    } catch { /* keep whatever we have */ }
  }

  async function postComment(form) {
    const author = form.author.value.trim();
    const text = form.text.value.trim();
    const status = form.querySelector(".bc-status");
    if (!author || !text) return;
    setName(author);
    const secret = newSecret();
    status.textContent = "Posting…";
    try {
      const data = await apiCall("POST", {
        page: PAGE, section: activeSection,
        sectionLabel: (targets.get(activeSection) || {}).label || activeSection,
        author, text, secret,
      });
      saveSecret(data.comment.id, secret);
      comments.push(data.comment);
      render();
    } catch {
      status.textContent = "Couldn't post — please try again.";
    }
  }

  function startEdit(box, c) {
    box.innerHTML =
      '<div class="bc-meta"><strong>' + esc(c.author) + "</strong></div>" +
      '<form class="bc-form bc-edit-form">' +
        '<textarea name="text" maxlength="2000" required rows="3">' + esc(c.text) + "</textarea>" +
        '<div class="bc-actions"><button type="submit">Save</button>' +
        '<button type="button" data-act="cancel">Cancel</button></div>' +
        '<span class="bc-status" role="status"></span>' +
      "</form>";
    box.querySelector("textarea").focus();
  }

  async function saveEdit(box, c, form) {
    const text = form.text.value.trim();
    const status = form.querySelector(".bc-status");
    if (!text) return;
    status.textContent = "Saving…";
    try {
      const data = await apiCall("PUT", { id: c.id, secret: mySecret(c.id), text });
      const i = comments.findIndex((x) => x.id === c.id);
      if (i >= 0) comments[i] = data.comment;
      render();
    } catch {
      status.textContent = "Couldn't save — please try again.";
    }
  }

  async function deleteComment(c) {
    if (!confirm("Delete this comment?")) return;
    try {
      await apiCall("DELETE", { id: c.id, secret: mySecret(c.id) });
      dropSecret(c.id);
      comments = comments.filter((x) => x.id !== c.id);
      render();
    } catch {
      alert("Couldn't delete — please try again.");
    }
  }

  /* ---------- shell ---------- */

  function buildShell() {
    const fab = document.createElement("button");
    fab.id = "bc-fab";
    fab.type = "button";
    fab.textContent = "💬 Comments";
    fab.addEventListener("click", () => {
      drawerOpen = !drawerOpen;
      if (drawerOpen) activeSection = null;
      render();
      if (drawerOpen) reload();
    });
    document.body.appendChild(fab);

    const drawer = document.createElement("aside");
    drawer.id = "bc-drawer";
    drawer.setAttribute("aria-label", "Comments");
    drawer.innerHTML =
      '<div class="bc-head">' +
        '<button type="button" class="bc-back" aria-label="All comments">‹ All</button>' +
        '<h2 class="bc-title">Comments</h2>' +
        '<button type="button" class="bc-close" aria-label="Close">×</button>' +
      "</div>" +
      '<div class="bc-body"></div>' +
      '<div class="bc-foot">Comments are visible to everyone with this link. You can edit or delete your own from this device.</div>';
    document.body.appendChild(drawer);

    drawer.querySelector(".bc-close").addEventListener("click", () => { drawerOpen = false; render(); });
    drawer.querySelector(".bc-back").addEventListener("click", () => { activeSection = null; render(); });

    drawer.addEventListener("click", (e) => {
      const groupHead = e.target.closest(".bc-group-head");
      if (groupHead) { jumpTo(groupHead.dataset.section); return; }
      const actBtn = e.target.closest("button[data-act]");
      if (!actBtn) return;
      const box = e.target.closest(".bc-comment");
      if (!box) return;
      const c = comments.find((x) => x.id === box.dataset.id);
      if (!c) return;
      const act = actBtn.dataset.act;
      if (act === "edit") startEdit(box, c);
      else if (act === "delete") deleteComment(c);
      else if (act === "cancel") render();
    });

    drawer.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      if (form.classList.contains("bc-edit-form")) {
        const box = form.closest(".bc-comment");
        const c = comments.find((x) => x.id === box.dataset.id);
        if (c) saveEdit(box, c, form);
      } else {
        postComment(form);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawerOpen) { drawerOpen = false; render(); }
    });
  }

  function injectCss() {
    const css = `
      .bc-target{position:relative;}
      .bc-btn{
        position:absolute;top:-9px;right:-7px;z-index:30;
        min-width:24px;height:24px;padding:0 7px;border-radius:12px;
        border:2px solid #fff;background:var(--navy,#00267F);color:#fff;
        font-size:12px;font-weight:800;line-height:1;cursor:pointer;
        box-shadow:0 1px 4px rgba(0,0,0,.3);opacity:0;transition:opacity .12s;
      }
      .stagehead .bc-btn{top:6px;right:6px;}
      .bc-target:hover>.bc-btn,.bc-btn.has,.bc-btn:focus-visible{opacity:1;}
      .bc-btn.has{background:var(--gold,#FFC726);color:var(--charcoal,#2C2C2C);border-color:var(--charcoal,#2C2C2C);}
      .bc-active{outline:3px solid var(--gold,#FFC726);outline-offset:2px;}

      #bc-fab{
        position:fixed;right:22px;bottom:22px;z-index:100;
        background:var(--navy,#00267F);color:#fff;border:2px solid var(--gold,#FFC726);
        font:inherit;font-weight:700;font-size:14px;padding:12px 18px;border-radius:999px;
        cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3);
      }
      #bc-drawer{
        position:fixed;top:0;right:0;bottom:0;width:380px;max-width:100vw;z-index:200;
        background:#fff;box-shadow:-4px 0 24px rgba(0,0,0,.25);
        display:flex;flex-direction:column;transform:translateX(105%);
        transition:transform .18s ease-out;font-size:14px;
      }
      #bc-drawer.open{transform:none;}
      .bc-head{
        display:flex;align-items:center;gap:8px;padding:14px 16px;
        background:var(--charcoal,#2C2C2C);color:#fff;flex:none;
      }
      .bc-head h2{font-size:15px;font-weight:800;flex:1;line-height:1.3;}
      .bc-back,.bc-close{
        background:none;border:none;color:var(--gold,#FFC726);
        font:inherit;font-weight:800;cursor:pointer;padding:2px 6px;flex:none;
      }
      .bc-close{font-size:22px;line-height:1;}
      .bc-body{flex:1;overflow-y:auto;padding:14px 16px;}
      .bc-foot{
        flex:none;padding:10px 16px;font-size:11.5px;color:#6b6363;
        border-top:1px solid var(--line,#d8d2d2);background:var(--offwhite,#F7F3F3);
      }
      .bc-empty{color:#6b6363;padding:8px 0 16px;}
      .bc-comment{
        border:1px solid var(--line,#d8d2d2);border-radius:8px;
        padding:10px 12px;margin-bottom:10px;background:#fff;
      }
      .bc-meta{display:flex;justify-content:space-between;gap:8px;margin-bottom:4px;}
      .bc-meta span{color:#8a8181;font-size:12px;white-space:nowrap;}
      .bc-text{white-space:pre-wrap;word-wrap:break-word;}
      .bc-actions{margin-top:8px;display:flex;gap:10px;}
      .bc-actions button{
        background:none;border:none;padding:0;font:inherit;font-size:12.5px;
        font-weight:700;color:var(--navy,#00267F);cursor:pointer;text-decoration:underline;
      }
      .bc-form{display:flex;flex-direction:column;gap:8px;margin-top:14px;}
      .bc-form input,.bc-form textarea{
        font:inherit;font-size:13.5px;padding:8px 10px;
        border:1.5px solid var(--charcoal,#2C2C2C);border-radius:6px;width:100%;
      }
      .bc-form button[type=submit]{
        align-self:flex-start;background:var(--navy,#00267F);color:#fff;
        border:none;border-radius:6px;font:inherit;font-weight:700;
        padding:8px 16px;cursor:pointer;
      }
      .bc-edit-form{margin-top:6px;}
      .bc-edit-form .bc-actions button{text-decoration:none;}
      .bc-edit-form button[type=submit]{padding:5px 12px;font-size:12.5px;}
      .bc-edit-form button[data-act=cancel]{
        background:none;border:none;font:inherit;font-size:12.5px;
        color:#6b6363;cursor:pointer;text-decoration:underline;
      }
      .bc-status{font-size:12px;color:var(--red,#B42318);}
      .bc-group{margin-bottom:18px;}
      .bc-group-head{
        display:block;width:100%;text-align:left;background:var(--offwhite,#F7F3F3);
        border:none;border-left:4px solid var(--gold,#FFC726);border-radius:4px;
        font:inherit;font-size:12.5px;font-weight:800;color:var(--charcoal,#2C2C2C);
        padding:7px 10px;margin-bottom:8px;cursor:pointer;
      }
      .bc-group-head:hover{background:#efe9e9;}
      @media (max-width:520px){#bc-drawer{width:100vw;}}
      @media print{#bc-fab,#bc-drawer,.bc-btn{display:none !important;}}
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ---------- boot ---------- */

  function boot() {
    injectCss();
    findSections();
    buildShell();
    render();
    reload();
    setInterval(() => { if (!document.hidden) reload(); }, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
