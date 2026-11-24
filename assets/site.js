/* GTA6Help.in — shared header, footer, ads and mission tracker */

/* ======== SITE SETTINGS (edit these) ========
   email:          contact email shown on Contact & Privacy pages
   adsenseClient:  your AdSense publisher ID, e.g. "ca-pub-1234567890123456"
                   (leave "" until AdSense approves you; no ad boxes show while empty)
   adSlots:        ad unit IDs from AdSense for the top and bottom banners
   ============================================ */
window.SITE = {
  email: "gta6.h3lp@gmail.com",
  adsenseClient: "ca-pub-6000336420372903",
  adSlots: { top: "", bottom: "" }
};

(function () {
  var page = document.body.getAttribute("data-page") || "";
  var links = [
    ["index.html", "Home", "home"],
    ["missions.html", "Missions", "missions"],
    ["side-missions.html", "Side Missions", "side"],
    ["guides.html", "Guides & Tips", "guides"],
    ["completion.html", "100%", "completion"],
    ["cheats.html", "Cheats", "cheats"],
    ["game-info.html", "Game Info & FAQ", "info"]
  ];

  // Header
  var h = document.createElement("header");
  h.className = "site";
  h.innerHTML =
    '<div class="wrap"><a class="logo" href="index.html">GTA6<b>HELP</b><small>.in</small></a>' +
    '<button class="menu-btn" aria-label="Menu">☰</button><nav class="main">' +
    links.map(function (l) {
      return '<a href="' + l[0] + '"' + (l[2] === page ? ' class="on"' : "") + ">" + l[1] + "</a>";
    }).join("") + "</nav></div>";
  document.body.prepend(h);
  h.querySelector(".menu-btn").onclick = function () { h.querySelector("nav").classList.toggle("open"); };

  // Footer
  var f = document.createElement("footer");
  f.className = "site";
  f.innerHTML =
    '<div class="wrap cols"><div style="max-width:560px"><a class="logo" href="index.html">GTA6<b>HELP</b><small>.in</small></a>' +
    "<p>Unofficial fan-made help guide. GTA6Help.in is not affiliated with, endorsed or sponsored by Rockstar Games or Take-Two Interactive. " +
    "Grand Theft Auto, GTA and related marks belong to Take-Two Interactive. Screenshots, where shown, are captured by our own players.</p></div>" +
    "<div>" + links.map(function (l) { return '<a href="' + l[0] + '">' + l[1] + "</a>"; }).join("<br>") + "</div>" +
    '<div><a href="about.html">About us</a><br><a href="contact.html">Contact</a><br><a href="privacy.html">Privacy Policy</a></div></div>' +
    '<div class="wrap" style="margin-top:18px">Info last checked: 24 Nov 2026. Details may change with game updates.</div>';
  document.body.appendChild(f);

  // Fill in the contact email wherever the page asks for it
  document.querySelectorAll("[data-email]").forEach(function (el) {
    if (SITE.email) { el.textContent = SITE.email; el.href = "mailto:" + SITE.email; }
  });

  // ---------------- Ads: max 2 banners per page (top + bottom), no pop-ups ----------------
  if (SITE.adsenseClient && (SITE.adSlots.top || SITE.adSlots.bottom)) {
    var s = document.querySelector('script[src*="adsbygoogle.js"]') ? null : document.createElement("script");
    if (s) {
    s.async = true;
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + SITE.adsenseClient;
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
    }
    var makeAd = function (slot) {
      var box = document.createElement("div");
      box.className = "ad-box wrap";
      box.innerHTML = '<div class="ad-label">Advertisement</div><ins class="adsbygoogle" style="display:block" data-ad-client="' +
        SITE.adsenseClient + '" data-ad-slot="' + slot + '" data-ad-format="horizontal" data-full-width-responsive="true"></ins>';
      return box;
    };
    var head = document.querySelector(".page-head, .hero");
    if (head && SITE.adSlots.top) head.after(makeAd(SITE.adSlots.top));
    if (SITE.adSlots.bottom) f.before(makeAd(SITE.adSlots.bottom));
    document.querySelectorAll("ins.adsbygoogle").forEach(function () {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  }

  // ---------------- Missions page ----------------
  var root = document.getElementById("missions");
  if (!root || !window.CHAPTERS) return;

  var KEY = "gta6help-done";
  var done = {};
  try { done = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} }

  var WHO = { J: "Jason", L: "Lucia", JL: "Jason & Lucia" };
  var filter = "all", query = "", total = 0;
  window.CHAPTERS.forEach(function (c) { total += c.missions.length; });

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function render() {
    var html = "";
    window.CHAPTERS.forEach(function (c) {
      var items = c.missions.filter(function (m) {
        if (filter === "J" && m.who.indexOf("J") < 0) return false;
        if (filter === "L" && m.who.indexOf("L") < 0) return false;
        if (filter === "todo" && done[m.n]) return false;
        if (query && (m.name.toLowerCase().indexOf(query) < 0 || m.spoiler)) return false;
        return true;
      });
      if (!items.length) return;
      var cDone = c.missions.filter(function (m) { return done[m.n]; }).length;
      html += '<div class="chapter" id="chapter-' + c.id + '"><div class="chapter-head"><span class="cn">CHAPTER ' + c.id +
        "</span><h2 style=\"margin:0\">" + esc(c.name) + '</h2><span class="muted">' + cDone + " / " + c.missions.length + " done</span></div>";
      items.forEach(function (m) {
        var tag = m.who ? '<span class="tag ' + m.who + '">' + WHO[m.who] + "</span>" : '<span class="tag na">TBC</span>';
        if (m.heist) tag += ' <span class="tag heist">HEIST</span>';
        var name = m.spoiler
          ? '<span class="spoil" title="Click to reveal">' + esc(m.name) + '</span><span class="spoil-hint">SPOILER · click</span>'
          : esc(m.name);
        html += '<div class="mission' + (done[m.n] ? " done" : "") + '" data-n="' + m.n + '">' +
          '<div class="no">' + pad(m.n) + "</div>" +
          '<div><div class="nm">' + name + "</div><div>" + tag + "</div></div>" +
          '<input type="checkbox" class="chk" aria-label="Mark complete"' + (done[m.n] ? " checked" : "") + ">" +
          '<div class="mission-detail">' +
          '<figure class="shot" style="margin:0"><img src="images/missions/' + pad(m.n) + '.jpg" alt="Mission ' + m.n + ' screenshot" ' +
          "onerror=\"this.onerror=null;this.src='images/screenshot-placeholder.svg'\"><figcaption>Mission " + m.n + " · reference image</figcaption></figure>" +
          "<div><h3>Mission " + m.n + (m.spoiler ? "" : " — " + esc(m.name)) + "</h3>" +
          '<p class="muted">Chapter ' + c.id + ": " + esc(c.name) + " · Play as: " + (WHO[m.who] || "to be confirmed") + "</p>" +
          (m.steps ? '<ol class="steps">' + m.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>" : "") +
          (m.tips ? "<p>" + esc(m.tips) + "</p>" : '<p class="muted">Full walkthrough coming soon.</p>') +
          '<a class="btn yt" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' +
          encodeURIComponent("GTA 6 " + m.name + " mission walkthrough") + '">▶ Watch walkthrough on YouTube</a>' +
          '<p class="muted" style="font-size:.85rem">Tip: missions can’t be replayed in GTA 6. Make a manual save before you start.</p></div></div></div>';
      });
      html += "</div>";
    });
    root.innerHTML = html || '<p class="muted">No missions match.</p>';
    var count = Object.keys(done).filter(function (k) { return done[k]; }).length;
    document.getElementById("prog-bar").style.width = (count / total * 100) + "%";
    document.getElementById("prog-txt").textContent = count + " of " + total + " story missions complete";
  }

  root.addEventListener("click", function (e) {
    var row = e.target.closest(".mission");
    if (!row) return;
    var n = +row.getAttribute("data-n");
    if (e.target.classList.contains("chk")) {
      done[n] = e.target.checked; save(); render(); return;
    }
    if (e.target.classList.contains("spoil")) { e.target.classList.remove("spoil"); var hint = e.target.nextSibling; if (hint) hint.remove(); return; }
    if (e.target.closest(".mission-detail")) return;
    row.classList.toggle("open");
  });
  document.querySelectorAll(".chip[data-f]").forEach(function (b) {
    b.onclick = function () {
      document.querySelectorAll(".chip[data-f]").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on"); filter = b.getAttribute("data-f"); render();
    };
  });
  document.getElementById("q").addEventListener("input", function (e) { query = e.target.value.trim().toLowerCase(); render(); });
  render();

  var miss = document.getElementById("missables");
  if (miss && window.MISSABLES) {
    miss.innerHTML = window.MISSABLES.map(function (m) {
      return "<tr><td><b>" + esc(m.name) + "</b></td><td>Chapter " + m.chapter + "</td><td>" + (m.who || "—") + "</td></tr>";
    }).join("");
  }
})();
