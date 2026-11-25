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
    '<div class="wrap" style="margin-top:18px">Info last checked: 25 Nov 2026. Details may change with game updates.</div>';
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
  /* ---------- original mission thumbnails (inline SVG, no image files) ---------- */
  var CH_COL = { 1: ["#ff3d8b", "#ff8a3d"], 2: ["#7b5cff", "#ff3d8b"], 3: ["#ff8a3d", "#ffd23d"], 4: ["#2de0c8", "#3d8bff"], 5: ["#ffd23d", "#ff3d8b"] };
  var ICONS = {
    car: '<path d="M10 34l6-14c1-3 3-4 6-4h20c3 0 5 1 6 4l6 14v12h-6v-4H16v4h-6z" /><circle cx="20" cy="38" r="4" fill="#0d0a14"/><circle cx="44" cy="38" r="4" fill="#0d0a14"/>',
    boat: '<path d="M8 38h48l-8 10H16z"/><path d="M30 10v26h-14z"/><path d="M33 14v22h14z"/>',
    plane: '<path d="M30 6c2 0 3 2 3 5v13l20 11v5l-20-6v10l6 5v4l-9-3-9 3v-4l6-5V34l-20 6v-5l20-11V11c0-3 1-5 3-5z"/>',
    bank: '<path d="M32 6l26 12v4H6v-4z"/><path d="M10 26h6v18h-6zM22 26h6v18h-6zM36 26h6v18h-6zM48 26h6v18h-6z"/><path d="M6 48h52v6H6z"/>',
    bag: '<path d="M14 22h36l-4 30H18z"/><path d="M24 22v-6a8 8 0 0116 0v6" fill="none" stroke="#fff" stroke-width="4"/><text x="32" y="44" text-anchor="middle" font-size="16" font-weight="700" fill="#0d0a14" font-family="Arial">$</text>',
    house: '<path d="M32 8l26 22h-7v24H13V30H6z"/><path d="M27 40h10v14H27z" fill="#0d0a14"/>',
    target: '<circle cx="32" cy="32" r="22" fill="none" stroke="#fff" stroke-width="5"/><circle cx="32" cy="32" r="11" fill="none" stroke="#fff" stroke-width="5"/><path d="M30 4h4v56h-4zM4 30h56v4H4z"/>',
    star: '<path d="M32 6l7 17 18 1-14 12 5 18-16-10-16 10 5-18L7 24l18-1z"/>',
    music: '<path d="M24 12l28-6v34a8 8 0 11-5-7V16l-18 4v26a8 8 0 11-5-7z"/>',
    swamp: '<path d="M6 44c6-4 10-4 16 0s10 4 16 0 10-4 20 0v10H6z"/><path d="M20 40c2-10 8-18 20-20-4 6-6 12-6 20z"/>'
  };
  function iconFor(m) {
    var t = (m.name + " " + (m.tips || "")).toLowerCase();
    if (m.heist || /\bbank|fleeca|vault|safecrack/.test(t)) return "bank";
    if (/plane|airfield|fly |helicopter|skies|down to earth/.test(t)) return "plane";
    if (/boat|jet ski|seashark|fishing|marina|island/.test(t)) return "boat";
    if (/swamp|gator|alligator|everglade/.test(t)) return "swamp";
    if (/music|concert|dimez|dwnply|video|club/.test(t)) return "music";
    if (/house|home|apartment|moved in|real estate|mia/.test(t)) return "house";
    if (/\bcar\b|drive|race|zorr|schafter|impound|tow|garage|traffic/.test(t)) return "car";
    if (/cash|money|drug|deal|rent|stash|bag/.test(t)) return "bag";
    if (/shoot|gun|kill|fight|cops|police|escape/.test(t)) return "target";
    return "star";
  }
  function wrap(t, max) {
    var words = t.split(" "), lines = [""];
    words.forEach(function (w) {
      var cur = lines[lines.length - 1];
      if ((cur + " " + w).trim().length > max && cur) lines.push(w); else lines[lines.length - 1] = (cur + " " + w).trim();
    });
    return lines.slice(0, 3);
  }
  function thumbSVG(m, ch, big) {
    var col = CH_COL[ch] || CH_COL[1], id = "g" + m.n + (big ? "b" : "s");
    var bg = '<defs><linearGradient id="' + id + '" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="' + col[0] + '"/><stop offset="1" stop-color="' + col[1] + '"/></linearGradient></defs>' +
      '<rect width="320" height="180" fill="url(#' + id + ')"/>' +
      '<path d="M0 0H210L120 180H0z" fill="#0d0a14" opacity=".82"/>' +
      '<circle cx="250" cy="90" r="52" fill="#0d0a14" opacity=".35"/>' +
      '<g transform="translate(218 58)" fill="#fff">' + ICONS[iconFor(m)] + "</g>";
    var font = 'font-family="Bebas Neue,Impact,Arial Narrow,sans-serif"';
    var body;
    if (!big) {
      body = '<text x="22" y="128" ' + font + ' font-size="108" fill="#fff">' + pad(m.n) + "</text>";
    } else {
      var who = m.who === "J" ? "JASON" : m.who === "L" ? "LUCIA" : m.who === "JL" ? "JASON + LUCIA" : "TBC";
      var lines = wrap(m.spoiler ? "SPOILER" : m.name.toUpperCase(), 11), fs = lines.length > 2 ? 24 : 30;
      body = '<text x="18" y="52" ' + font + ' font-size="48" fill="url(#' + id + ')">' + pad(m.n) + "</text>" +
        lines.map(function (l, i) { return '<text x="18" y="' + (98 + i * (fs + 2)) + '" ' + font + ' font-size="' + fs + '" fill="#fff">' + esc(l) + "</text>"; }).join("") +
        '<text x="18" y="166" font-family="Inter,Arial,sans-serif" font-size="11" font-weight="700" fill="#ffd23d" letter-spacing="1.5">' + who + " · CH " + ch + "</text>";
    }
    return '<svg class="thumb-art" viewBox="0 0 320 180" role="img" aria-label="Mission ' + m.n + ' thumbnail" xmlns="http://www.w3.org/2000/svg">' + bg + body + "</svg>";
  }
  function videoFacade(m) {
    return '<div class="yt-facade" data-yt="' + esc(m.yt) + '" role="button" tabindex="0" aria-label="Play walkthrough video">' +
      '<img loading="lazy" src="https://i.ytimg.com/vi/' + esc(m.yt) + '/hqdefault.jpg" alt="Walkthrough video for mission ' + m.n + '">' +
      '<span class="yt-play">▶</span><span class="yt-cap">Walkthrough video · YouTube</span></div>';
  }

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
          '<div class="thumb">' + thumbSVG(m, c.id) + '</div>' +
          '<div><div class="nm">' + name + "</div><div>" + tag + "</div></div>" +
          '<input type="checkbox" class="chk" aria-label="Mark complete"' + (done[m.n] ? " checked" : "") + ">" +
          '<div class="mission-detail">' +
          '<div class="media">' + (m.yt ? videoFacade(m) : thumbSVG(m, c.id, true)) + '</div>' +
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
    var fac = e.target.closest(".yt-facade");
    if (fac) { fac.outerHTML = '<div class="yt-frame"><iframe src="https://www.youtube-nocookie.com/embed/' + fac.getAttribute("data-yt") + '?autoplay=1&rel=0" title="Walkthrough video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>'; return; }
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
