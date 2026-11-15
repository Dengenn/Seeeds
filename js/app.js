/* seeeds — site behaviour. Pages declare <body data-page="home|shop|product|story|harvest|favourites">. */
(function () {
  var S = window.SEEEDS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return "$" + n.toFixed(0); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var page = document.body.dataset.page;
  var params = new URLSearchParams(location.search);

  /* ---------- icons (UI only) ---------- */
  var I = {
    search: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
    heart: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.3 4.5 4.5 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/></svg>',
    cart: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l2.2 11h10.4l2-8H6.3"/><circle cx="9.5" cy="19" r="1.3"/><circle cx="16.5" cy="19" r="1.3"/></svg>',
    user: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-3.6 4-5.3 7.5-5.3s6.3 1.7 7.5 5.3"/></svg>',
    menu: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chev: '<svg class="ico chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    filter: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>'
  };

  /* ---------- storage ---------- */
  function store(key) {
    var mem = [];
    return {
      get: function () { try { var v = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(v) ? v : mem; } catch (e) { return mem; } },
      set: function (v) { mem = v; try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} paint(); }
    };
  }
  var cart = store("seeeds.harvest.v3"), favs = store("seeeds.favourites.v1");
  var H = {
    items: function () { return cart.get().filter(function (x) { return S.product(x.id); }); },
    add: function (id, size) {
      var v = H.items(), p = S.product(id), hit = v.find(function (x) { return x.id === id && x.size === size; });
      if (hit) hit.qty = p.oneOfOne ? 1 : Math.min(9, hit.qty + 1); else v.push({ id: id, size: size, qty: 1 });
      cart.set(v);
    },
    count: function () { return H.items().reduce(function (a, x) { return a + x.qty; }, 0); },
    total: function () { return H.items().reduce(function (a, x) { return a + S.product(x.id).price * x.qty; }, 0); }
  };
  function isFav(id) { return favs.get().indexOf(id) > -1; }
  function toggleFav(id) { var v = favs.get(), i = v.indexOf(id); if (i > -1) v.splice(i, 1); else v.push(id); favs.set(v); return i === -1; }
  function paint() {
    var n = H.count(), f = favs.get().filter(function (id) { return S.product(id); }).length;
    $$("[data-cart-n]").forEach(function (el) { el.textContent = n || ""; el.dataset.n = n; });
    $$("[data-fav-n]").forEach(function (el) { el.textContent = f || ""; el.dataset.n = f; });
    $$(".fav[data-id]").forEach(function (b) { b.setAttribute("aria-pressed", isFav(b.dataset.id)); });
  }

  /* ---------- custom dropdown ---------- */
  function dropdown(root, onPick) {
    var btn = $(".dd-btn", root), menu = $(".dd-menu", root);
    function set(o) { root.classList.toggle("open", o); btn.setAttribute("aria-expanded", o); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); set(!root.classList.contains("open")); if (root.classList.contains("open")) { var f = $("[aria-selected='true'], a, button", menu); if (f) f.focus(); } });
    document.addEventListener("click", function (e) { if (!root.contains(e.target)) set(false); });
    root.addEventListener("keydown", function (e) {
      var items = $$("a, button", menu), i = items.indexOf(document.activeElement);
      if (e.key === "Escape") { set(false); btn.focus(); }
      if (e.key === "ArrowDown") { e.preventDefault(); if (!root.classList.contains("open")) set(true); (items[i + 1] || items[0]).focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
    });
    if (onPick) $$("[data-v]", menu).forEach(function (o) {
      o.addEventListener("click", function () {
        $$("[data-v]", menu).forEach(function (x) { x.setAttribute("aria-selected", x === o); });
        $(".dd-val", root).textContent = o.dataset.label || o.textContent; set(false); btn.focus(); onPick(o.dataset.v);
      });
    });
  }

  /* ---------- header ---------- */
  function megaHTML(item) {
    return '<div class="mega"><div class="wrap">' + item.columns.map(function (c) {
      return '<div class="col"><h4>' + c.title + "</h4><ul>" + c.links.map(function (l) { return '<li><a href="' + l[1] + '">' + l[0] + "</a></li>"; }).join("") + "</ul></div>";
    }).join("") + (item.feature ? '<a class="feature" href="' + item.feature.href + '"><img src="' + item.feature.image + '" alt=""><span>' + item.feature.title + "</span></a>" : "") + "</div></div>";
  }
  function current(item) {
    var g = params.get("g"), c = params.get("c");
    if (page !== "shop") return false;
    if (item.label === "Men") return g === "men";
    if (item.label === "Women") return g === "women";
    if (item.label === "Kids") return g === "kids";
    if (item.label === "Collections") return !!c && !g;
    if (item.label === "New & Featured") return params.get("new") === "1" && !g;
    return false;
  }
  function header() {
    var el = $("#site-header"); if (!el) return;
    el.outerHTML =
      '<div class="utility"><div class="wrap"><span class="msg">Free delivery on orders over $150</span><nav aria-label="Utility">' +
      '<a href="story.html">Our Story</a>' +
      '<div class="dd" id="help-dd"><button class="dd-btn" aria-haspopup="true" aria-expanded="false">Help</button><ul class="dd-menu" role="menu">' +
      '<li class="head">Help</li>' + ["Order Status", "Shipping & Delivery", "Returns", "Size Guide", "Contact Us"].map(function (t) { return '<li><a role="menuitem" href="#">' + t + "</a></li>"; }).join("") + "</ul></div>" +
      '<button data-auth="join">Join Us</button><button data-auth="signin">Sign In</button></nav></div></div>' +
      '<header class="site-head"><div class="wrap">' +
      '<div class="head-l"><button class="icon-btn menu-btn" aria-label="Open menu" aria-expanded="false">' + I.menu + "</button>" +
      '<a class="head-mark" href="index.html" aria-label="seeeds home"><img src="assets/mark-black-gold-rim.svg" alt=""></a>' +
      '<nav class="main-nav" aria-label="Primary">' + S.nav.map(function (n, i) {
        return '<div class="nav-item" data-i="' + i + '"><a href="' + n.href + '"' + (current(n) ? ' aria-current="page"' : "") + ">" + n.label + "</a>" + megaHTML(n) + "</div>";
      }).join("") + "</nav></div>" +
      '<div class="head-r"><button class="icon-btn" data-open-search aria-label="Search">' + I.search + "</button>" +
      '<a class="icon-btn hide-m" href="favourites.html" aria-label="Favourites">' + I.heart + '<span class="n" data-fav-n></span></a>' +
      '<a class="bag" href="harvest.html" aria-label="Harvest (cart)"><span class="label-t">Harvest</span><span class="icon-btn" aria-hidden="true">' + I.cart + '<span class="n" data-cart-n></span></span></a></div>' +
      "</div></header>" +
      '<div class="scrim"></div>' +
      '<div class="promo">The Burial Collection: Drop 01 is here. <a href="shop.html?c=buried">Shop now</a></div>' +
      drawerHTML() + searchHTML() + authHTML();

    dropdown($("#help-dd"));
    $$(".nav-item").forEach(function (it) {
      it.addEventListener("mouseenter", function () { document.body.classList.add("mega-open"); });
      it.addEventListener("mouseleave", function () { document.body.classList.remove("mega-open"); });
      it.addEventListener("focusin", function () { document.body.classList.add("mega-open"); });
      it.addEventListener("focusout", function (e) { if (!it.contains(e.relatedTarget)) document.body.classList.remove("mega-open"); });
    });
    overlay($(".drawer"), $(".menu-btn"), $(".drawer .x"));
    overlay($(".search"), $("[data-open-search]"), $(".search .x"), function () { $("#q").focus(); });
    $$("[data-auth]").forEach(function (b) { b.addEventListener("click", function () { openAuth(b.dataset.auth); }); });
    searchInit(); authInit();
  }
  function overlay(el, openBtn, closeBtn, after) {
    var last;
    function set(o) { el.classList.toggle("open", o); document.body.style.overflow = o ? "hidden" : ""; if (openBtn) openBtn.setAttribute("aria-expanded", o); if (o) { last = document.activeElement; (after || function () { closeBtn.focus(); })(); } else if (last) last.focus(); }
    if (openBtn) openBtn.addEventListener("click", function () { set(true); });
    closeBtn.addEventListener("click", function () { set(false); });
    el.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
    el._set = set;
  }
  function drawerHTML() {
    return '<div class="drawer" role="dialog" aria-modal="true" aria-label="Menu"><div class="top"><a href="index.html"><img src="assets/mark-black-gold-rim.svg" alt="seeeds" width="36" height="36"></a><button class="icon-btn x" aria-label="Close menu">' + I.close + "</button></div>" +
      S.nav.map(function (n) {
        return "<details><summary>" + n.label + '</summary><div class="grp">' + n.columns.map(function (c) {
          return "<h5>" + c.title + "</h5>" + c.links.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + "</a>"; }).join("");
        }).join("") + "</div></details>";
      }).join("") +
      '<a class="plain" href="story.html">Our Story</a><a class="plain" href="favourites.html">Favourites</a><a class="plain" href="harvest.html">Harvest</a>' +
      '<div class="acct"><button class="btn" data-auth="join">Join Us</button><button class="btn light" data-auth="signin">Sign In</button></div></div>';
  }
  function searchHTML() {
    return '<div class="search" role="dialog" aria-modal="true" aria-label="Search"><div class="wrap"><div class="bar"><img src="assets/mark-black-gold-rim.svg" alt="">' +
      '<label class="field">' + I.search + '<span class="sr">Search</span><input id="q" type="search" placeholder="Search seeeds" autocomplete="off"></label><button class="icon-btn x" aria-label="Close search">' + I.close + "</button></div>" +
      '<div class="popular"><h5>Popular searches</h5><div class="terms">' + ["tee", "shoes", "cap", "chain", "denim", "kids", "pink", "reclaimed"].map(function (t) { return "<button>" + t + "</button>"; }).join("") + "</div></div>" +
      '<div class="results" id="results" aria-live="polite"></div></div></div>';
  }
  function searchInit() {
    var q = $("#q"), out = $("#results");
    function run() {
      var t = q.value.trim().toLowerCase();
      if (!t) { out.innerHTML = ""; return; }
      var hits = S.products.filter(function (p) {
        return (p.name + " " + p.colour + " " + p.collection + " " + p.type + " " + (S.types[p.type] || "") + " " + p.gender.join(" ") + " " + p.honours.name + (p.oneOfOne ? " reclaimed" : "")).toLowerCase().indexOf(t) > -1;
      });
      out.innerHTML = hits.length ? hits.map(card).join("") : '<p class="muted">Nothing found for "' + esc(t) + '".</p>';
      bindCards(out);
    }
    q.addEventListener("input", run);
    $$(".search .terms button").forEach(function (b) { b.addEventListener("click", function () { q.value = b.textContent; run(); q.focus(); }); });
  }
  function authHTML() {
    return '<div class="modal" id="auth" role="dialog" aria-modal="true" aria-labelledby="auth-title"><div class="box">' +
      '<button class="icon-btn x" aria-label="Close">' + I.close + '</button><img class="m" src="assets/mark-black-gold-rim.svg" alt="">' +
      '<h2 id="auth-title">Sign in</h2><p id="auth-sub">Welcome back to the soil.</p>' +
      '<form id="auth-form" novalidate><input class="field-in" id="auth-name" type="text" placeholder="First name" autocomplete="given-name" hidden>' +
      '<input class="field-in" type="email" placeholder="Email address" autocomplete="email" required><input class="field-in" type="password" placeholder="Password" autocomplete="current-password" required>' +
      '<button class="btn block" type="submit" id="auth-go">Sign in</button><div class="note" id="auth-note" aria-live="polite"></div></form>' +
      '<div class="auth-switch" id="auth-switch"></div></div></div>';
  }
  var authMode = "signin";
  function openAuth(mode) {
    authMode = mode; var join = mode === "join";
    $("#auth-title").textContent = join ? "Join seeeds" : "Sign in";
    $("#auth-sub").textContent = join ? "Members get first access to drops and Reclaimed one-of-ones." : "Welcome back to the soil.";
    $("#auth-go").textContent = join ? "Join us" : "Sign in";
    $("#auth-name").hidden = !join; $("#auth-note").textContent = "";
    $("#auth-switch").innerHTML = join ? 'Already a member? <button type="button" data-to="signin">Sign in</button>' : 'Not a member? <button type="button" data-to="join">Join us</button>';
    $("#auth-switch button").addEventListener("click", function (e) { openAuth(e.target.dataset.to); });
    var d = $(".drawer"); if (d.classList.contains("open")) d._set(false);
    $("#auth")._set(true);
  }
  function authInit() {
    overlay($("#auth"), null, $("#auth .x"), function () { $("#auth input:not([hidden])").focus(); });
    $("#auth").addEventListener("click", function (e) { if (e.target.id === "auth") $("#auth")._set(false); });
    $("#auth-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = /.+@.+\..+/.test(e.target.querySelector("[type=email]").value);
      $("#auth-note").textContent = ok ? "Accounts open soon. You're on the list." : "Please enter a valid email address.";
    });
  }

  function footer() {
    var el = $("#site-footer"); if (!el) return;
    el.outerHTML = '<footer><div class="foot-top"><div class="wrap">' +
      '<div class="foot-brand"><a class="lock" href="index.html"><img class="m" src="assets/mark-gold.svg" alt=""><img class="w" src="assets/wordmark-ivory.svg" alt="seeeds"></a>' +
      "<p>They buried us, but little did they know we were seeeds.</p></div>" +
      '<div class="foot-links">' +
      '<div><h5>Shop</h5><ul><li><a href="shop.html?new=1">New Arrivals</a></li><li><a href="shop.html?g=men">Men</a></li><li><a href="shop.html?g=women">Women</a></li><li><a href="shop.html?g=kids">Kids</a></li><li><a href="shop.html?t=shoes">Shoes</a></li><li><a href="shop.html?t=accessories">Accessories</a></li></ul></div>' +
      '<div><h5>Help</h5><ul><li><a href="#">Order Status</a></li><li><a href="#">Shipping &amp; Delivery</a></li><li><a href="#">Returns</a></li><li><a href="#">Size Guide</a></li><li><a href="#">Contact Us</a></li></ul></div>' +
      '<div><h5>seeeds</h5><ul><li><a href="story.html">Our Story</a></li><li><a href="story.html#roll-call">The Roll Call</a></li><li><a href="shop.html?c=reclaimed">Reclaimed</a></li><li><a href="favourites.html">Favourites</a></li></ul></div>' +
      "</div></div></div>" +
      '<div class="foot-bottom"><div class="wrap"><span>© ' + new Date().getFullYear() + ' seeeds. Wear your freedom.</span><nav aria-label="Legal"><a href="privacy.html">Privacy Policy</a><button type="button" data-cookie-settings>Cookie Settings</button><a href="privacy-rights.html">Your Privacy Rights</a></nav></div></div></footer>';
  }

  /* ---------- product card ---------- */
  function card(p) {
    var tag = p.sold ? "Sold" : p.oneOfOne ? "1 of 1" : p.badge || (p.isNew ? "Just In" : "");
    var who = p.gender.indexOf("kids") > -1 ? "Kids'" : p.gender.length > 1 ? "Unisex" : p.gender[0] === "men" ? "Men's" : "Women's";
    return '<article class="card' + (p.sold ? " sold" : "") + '"><a class="media" href="product.html?id=' + p.id + '"><img src="' + p.images[0] + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
      '<button class="fav" data-id="' + p.id + '" aria-pressed="' + isFav(p.id) + '" aria-label="Favourite ' + esc(p.name) + '">' + I.heart + "</button>" +
      '<a class="meta" href="product.html?id=' + p.id + '">' + (tag ? '<div class="tag">' + tag + "</div>" : "") + "<h3>" + esc(p.name) + '</h3><div class="sub">' + who + " " + (S.types[p.type] || "") + '</div><div class="price">' + money(p.price) + "</div></a></article>";
  }
  function bindCards(root) {
    $$(".fav", root).forEach(function (b) {
      if (b._b) return; b._b = true;
      b.addEventListener("click", function (e) { e.preventDefault(); toggleFav(b.dataset.id); if (page === "favourites") pages.favourites(); });
    });
  }
  var toastT;
  function toast(p, size) {
    var t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = '<div class="th"><img src="' + p.images[0] + '" alt=""></div><div><div class="t">Planted in your harvest</div><h4>' + esc(p.name) + "</h4>" +
      '<div class="muted" style="font-size:13px;margin:-4px 0 8px">Size ' + esc(size) + '</div><a class="link" href="harvest.html">View harvest</a></div>';
    t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, 4000);
  }

  /* ---------- pages ---------- */
  var pages = {};

  pages.home = function () {
    var v = $("#ad-video");
    if (v && matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
    var ctrl = $("#ad-ctrl");
    if (v && ctrl) {
      var PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
      var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
      function sync() { var p = v.paused; ctrl.innerHTML = p ? PLAY : PAUSE; ctrl.setAttribute("aria-label", p ? "Play video" : "Pause video"); }
      ctrl.addEventListener("click", function () { if (v.paused) v.play(); else v.pause(); });
      v.addEventListener("play", sync); v.addEventListener("pause", sync); sync();
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
    }
    $("#featured").innerHTML = S.products.filter(function (p) { return p.featured; }).slice(0, 4).map(card).join("");
    var hanger = '<svg class="hanger" viewBox="0 0 120 70" aria-hidden="true"><defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A4A4A"/><stop offset="1" stop-color="#0A0A0A"/></linearGradient></defs>' +
      '<path d="M60 47V38a9 9 0 1 1 9-9" fill="none" stroke="url(#hg)" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path d="M60 47L12 64q-6 3 1 4h94q7-1 1-4z" fill="none" stroke="url(#hg)" stroke-width="3.2" stroke-linejoin="round"/></svg>';
    $("#collections").innerHTML = S.collections.map(function (c) {
      return '<a class="ctile" href="shop.html?c=' + c.id + '">' + hanger + '<div class="frame"><div class="splash"><img src="assets/splash/splash-01.svg" alt=""></div>' +
        '<div class="media"><img src="' + c.image + '" alt="" loading="lazy"></div></div><h3>' + c.name + "</h3><p>" + c.line + "</p></a>";
    }).join("");
    $("#signup").addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = /.+@.+\..+/.test(e.target.email.value);
      $("#signup-note").textContent = ok ? "Thank you. You're on the list." : "Please enter a valid email address.";
      $("#signup-note").style.color = ok ? "" : "var(--pink)";
    });
  };

  pages.shop = function () {
    var state = {
      g: params.get("g") ? [params.get("g")] : [], t: params.get("t") || "", c: params.get("c") ? [params.get("c")] : [],
      a: params.get("a") || "", isNew: params.get("new") === "1", price: [], sort: params.get("sort") || "featured"
    };
    var priceBands = [["Under $60", 0, 59], ["$60 – $100", 60, 100], ["$100 – $200", 101, 200], ["Over $200", 201, 1e9]];
    function matchType(p) {
      if (!state.t) return true;
      if (state.t === "clothing") return S.typeGroups.clothing.indexOf(p.type) > -1;
      if (state.t === "accessories") return S.typeGroups.accessories.indexOf(p.type) > -1;
      return p.type === state.t;
    }
    function list() {
      var l = S.products.filter(function (p) {
        return (!state.g.length || state.g.some(function (g) { return p.gender.indexOf(g) > -1; })) && matchType(p) &&
          (!state.c.length || state.c.indexOf(p.collection) > -1) && (!state.a || p.kidsAge === state.a) && (!state.isNew || p.isNew) &&
          (!state.price.length || state.price.some(function (i) { var b = priceBands[i]; return p.price >= b[1] && p.price <= b[2]; }));
      });
      if (state.sort === "featured") l = l.slice().sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
      if (state.sort === "newest") l = l.slice().sort(function (a, b) { return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0); });
      if (state.sort === "low") l = l.slice().sort(function (a, b) { return a.price - b.price; });
      if (state.sort === "high") l = l.slice().sort(function (a, b) { return b.price - a.price; });
      return l;
    }
    function title() {
      var who = { men: "Men's", women: "Women's", kids: "Kids'" }[state.g.length === 1 ? state.g[0] : ""] || "";
      var what = state.t === "clothing" ? "Clothing" : state.t === "accessories" ? "Accessories" : S.types[state.t] || "";
      var col = state.c.length === 1 && S.collection(state.c[0]);
      var age = { big: "Big Kids", little: "Little Kids", baby: "Baby & Toddler" }[state.a];
      if (age) return age;
      if (col && !who && !what) return col.name;
      var s = [state.isNew ? "New" : "", who, what].filter(Boolean).join(" ");
      return s || (state.isNew ? "New Arrivals" : "All Products");
    }
    var catLinks = [["", "All"], ["shoes", "Shoes"], ["clothing", "Clothing"], ["tops", "Tops & T-Shirts"], ["jackets", "Jackets"], ["pants", "Pants & Jeans"], ["accessories", "Accessories"], ["hats", "Hats & Caps"], ["bags", "Bags"], ["jewellery", "Jewellery"]];
    function checks(name, opts, sel) {
      return opts.map(function (o) { return '<label class="check"><input type="checkbox" data-f="' + name + '" value="' + o[0] + '"' + (sel.indexOf(o[0]) > -1 ? " checked" : "") + ">" + o[1] + "</label>"; }).join("");
    }
    function renderSide() {
      $("#side").innerHTML = '<div class="close-side"><span>Filter</span><button class="icon-btn" id="close-side" aria-label="Close filters">' + I.close + "</button></div>" +
        '<ul class="cats">' + catLinks.map(function (c) { return '<li><a href="#" data-t="' + c[0] + '"' + (state.t === c[0] ? ' aria-current="true"' : "") + ">" + c[1] + "</a></li>"; }).join("") + "</ul>" +
        '<details open><summary>Gender</summary><div class="opts">' + checks("g", [["men", "Men"], ["women", "Women"], ["kids", "Kids"]], state.g) + "</div></details>" +
        '<details open><summary>Collection</summary><div class="opts">' + checks("c", S.collections.map(function (c) { return [c.id, c.name]; }), state.c) + "</div></details>" +
        '<details><summary>Shop by Price</summary><div class="opts">' + checks("p", priceBands.map(function (b, i) { return [String(i), b[0]]; }), state.price.map(String)) + "</div></details>" +
        '<details><summary>New</summary><div class="opts"><label class="check"><input type="checkbox" data-f="n"' + (state.isNew ? " checked" : "") + ">Just In</label></div></details>" +
        '<div class="apply"><button class="btn" id="apply-side">Show results</button></div>';
      $$("[data-t]", $("#side")).forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); state.t = a.dataset.t; state.a = ""; renderSide(); render(); }); });
      $$("input[data-f]", $("#side")).forEach(function (i) {
        i.addEventListener("change", function () {
          var f = i.dataset.f;
          if (f === "n") state.isNew = i.checked;
          else { var key = f === "p" ? "price" : f, v = f === "p" ? +i.value : i.value, arr = state[key], at = arr.indexOf(v); if (i.checked && at < 0) arr.push(v); if (!i.checked && at > -1) arr.splice(at, 1); }
          if (f === "g") state.a = "";
          render();
        });
      });
      function closeSide() { $(".plp").classList.remove("show-side"); document.body.style.overflow = ""; }
      $("#close-side").addEventListener("click", closeSide);
      $("#apply-side").addEventListener("click", closeSide);
      $("#apply-side").textContent = "Show results (" + list().length + ")";
    }
    function render() {
      var l = list();
      $("#plp-title").textContent = title() + " (" + l.length + ")";
      var ap = $("#apply-side"); if (ap) ap.textContent = "Show results (" + l.length + ")";
      $("#grid").innerHTML = l.length ? l.map(card).join("") : '<p class="empty-plp">No products match these filters yet.</p>';
      bindCards($("#grid"));
      var q = new URLSearchParams();
      if (state.g.length === 1) q.set("g", state.g[0]); if (state.t) q.set("t", state.t); if (state.c.length === 1) q.set("c", state.c[0]);
      if (state.a) q.set("a", state.a); if (state.isNew) q.set("new", "1");
      history.replaceState(null, "", "shop.html" + (q.toString() ? "?" + q : ""));
    }
    renderSide();
    var sorts = [["featured", "Featured"], ["newest", "Newest"], ["high", "Price: High–Low"], ["low", "Price: Low–High"]];
    $("#sort").innerHTML = '<button class="dd-btn" aria-haspopup="listbox" aria-expanded="false">Sort By <span class="dd-val muted" style="font-weight:400">' +
      sorts.find(function (s) { return s[0] === state.sort; })[1] + "</span>" + I.chev + '</button><ul class="dd-menu" role="listbox">' +
      sorts.map(function (s) { return '<li><button role="option" data-v="' + s[0] + '" aria-selected="' + (s[0] === state.sort) + '">' + s[1] + "</button></li>"; }).join("") + "</ul>";
    dropdown($("#sort"), function (v) { state.sort = v; render(); });
    $("#toggle-side").addEventListener("click", function () {
      var plp = $(".plp");
      if (matchMedia("(max-width: 900px)").matches) { plp.classList.add("show-side"); document.body.style.overflow = "hidden"; }
      else { plp.classList.toggle("no-side"); this.querySelector("span").textContent = plp.classList.contains("no-side") ? "Show Filters" : "Hide Filters"; $("#grid").classList.toggle("three", !plp.classList.contains("no-side")); }
    });
    $("#grid").classList.add("three");
    render();
  };

  pages.product = function () {
    var p = S.product(params.get("id")) || S.products[0], col = S.collection(p.collection);
    document.title = p.name + " — seeeds";
    var sizes = S.sizesFor(p), chosen = sizes.length === 1 ? sizes[0] : null;
    var who = p.gender.indexOf("kids") > -1 ? "Kids'" : p.gender.length > 1 ? "Unisex" : p.gender[0] === "men" ? "Men's" : "Women's";
    $("#pdp").innerHTML =
      '<div class="gallery"><div class="splash"><img src="assets/splash/splash-01.svg" alt=""></div>' +
      '<div class="main" id="main" title="Double-click to zoom"><img id="main-img" src="' + p.images[0] + '" alt="' + esc(p.name) + '">' +
      '<button type="button" class="zoom-hint" id="zoom-btn" aria-label="Zoom image"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5"/></svg></button></div>' +
      (p.images.length > 1 ? '<div class="thumbs" role="group" aria-label="Product images">' + p.images.map(function (src, i) {
        return '<button aria-pressed="' + (i === 0) + '" data-src="' + src + '" aria-label="Show image ' + (i + 1) + '"><img src="' + src + '" alt=""></button>';
      }).join("") + "</div>" : "") + "</div>" +
      '<div class="buy"><div><div class="crumb"><a href="shop.html">Shop</a> / <a href="shop.html?c=' + col.id + '">' + col.name + "</a></div>" +
      "<h1>" + esc(p.name) + '</h1><div class="sub">' + who + " " + (S.types[p.type] || "") + " · " + esc(p.colour) + "</div></div>" +
      '<div class="price">' + money(p.price) + (p.oneOfOne ? ' <span class="badge" style="background:var(--panel);margin-left:8px">1 of 1</span>' : "") + "</div>" +
      '<div class="honour"><div class="label">This piece honours</div><h3>' + esc(p.honours.name) + '</h3><div class="yr">' + esc(p.honours.year) + "</div><p>" + esc(p.honours.line) + "</p></div>" +
      '<div><div class="field-head"><span>Select size</span>' + (sizes.length > 1 ? '<a class="muted" href="#">Size guide</a>' : "") + '</div><div class="sizes">' +
      sizes.map(function (s) { return '<button aria-pressed="' + (s === chosen) + '" data-s="' + s + '">' + s + "</button>"; }).join("") + "</div></div>" +
      '<div class="actions">' + (p.sold ? '<button class="btn block" disabled>Sold</button>' : '<button class="btn block" id="plant">Plant in harvest</button>') +
      '<button class="btn light block fav-wide" data-id="' + p.id + '">' + (isFav(p.id) ? "Favourited" : "Favourite") + "</button>" +
      '<p class="hint" id="hint" aria-live="polite">' + (p.sold ? "This one-of-one has found its home." : "") + "</p></div>" +
      '<div><details class="acc" open><summary>Details</summary><ul>' + p.details.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul></details>" +
      '<details class="acc"><summary>Free Delivery &amp; Returns</summary><p>Free delivery on orders over $150. Returns within 30 days, except Reclaimed one-of-ones.</p></details>' +
      '<details class="acc"><summary>Care</summary><p>Wash cold, inside out. Hang to dry. Do not iron the print.</p></details></div></div>';

    var main = $("#main-img"), panel = $("#main"), cur = 0;
    /* fullscreen zoom viewer */
    var zv = document.createElement("div");
    zv.className = "zoomer"; zv.setAttribute("role", "dialog"); zv.setAttribute("aria-modal", "true"); zv.setAttribute("aria-label", "Image zoom");
    zv.innerHTML = '<button class="icon-btn z-x" aria-label="Close zoom">' + I.close + '</button>' +
      '<div class="z-stage"><img class="z-img" alt=""></div>' +
      '<div class="z-bar">' + (p.images.length > 1 ? '<button class="icon-btn z-prev" aria-label="Previous image"><svg class="ico" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>' : "") +
      '<button class="icon-btn z-out" aria-label="Zoom out"><svg class="ico" viewBox="0 0 24 24"><path d="M6 12h12"/></svg></button><span class="z-level">100%</span>' +
      '<button class="icon-btn z-in" aria-label="Zoom in"><svg class="ico" viewBox="0 0 24 24"><path d="M6 12h12M12 6v12"/></svg></button>' +
      (p.images.length > 1 ? '<button class="icon-btn z-next" aria-label="Next image"><svg class="ico" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>' : "") + "</div>" +
      '<p class="z-tip">Click or double-tap to zoom · drag to move · Esc to close</p>';
    document.body.appendChild(zv);
    var zs = $(".z-stage", zv), zi = $(".z-img", zv), scale = 1, tx = 0, ty = 0, drag = null, last = 0, pts = {}, pinch = null;
    function apply() {
      var r = zs.getBoundingClientRect(), mx = (scale - 1) * r.width / 2, my = (scale - 1) * r.height / 2;
      tx = Math.max(-mx, Math.min(mx, tx)); ty = Math.max(-my, Math.min(my, ty));
      zi.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
      zv.classList.toggle("zoomed", scale > 1); $(".z-level", zv).textContent = Math.round(scale * 100) + "%";
    }
    function zoomAt(ns, cx, cy) {
      var r = zs.getBoundingClientRect(); ns = Math.max(1, Math.min(4, ns));
      var ox = cx - (r.left + r.width / 2), oy = cy - (r.top + r.height / 2);
      tx = ox - (ox - tx) * ns / scale; ty = oy - (oy - ty) * ns / scale; scale = ns; apply();
    }
    function centre() { var r = zs.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
    function showZ(i) { cur = (i + p.images.length) % p.images.length; zi.src = p.images[cur]; zi.alt = p.name + ", image " + (cur + 1); scale = 1; tx = ty = 0; apply(); }
    var lastFocus;
    function openZ() { lastFocus = document.activeElement; showZ(cur); zv.classList.add("open"); document.body.style.overflow = "hidden"; $(".z-x", zv).focus(); }
    function closeZ() { zv.classList.remove("open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
    $("#zoom-btn").addEventListener("click", function (e) { e.stopPropagation(); openZ(); });
    panel.addEventListener("dblclick", function (e) { e.preventDefault(); openZ(); });
    var tapAt = 0;
    panel.addEventListener("touchend", function (e) {
      if (e.target.closest("#zoom-btn")) return;
      var now = Date.now();
      if (now - tapAt < 300) { e.preventDefault(); tapAt = 0; openZ(); } else tapAt = now;
    });
    $(".z-x", zv).addEventListener("click", closeZ);
    $(".z-in", zv).addEventListener("click", function () { var c = centre(); zoomAt(scale + 0.75, c[0], c[1]); });
    $(".z-out", zv).addEventListener("click", function () { var c = centre(); zoomAt(scale - 0.75, c[0], c[1]); });
    if ($(".z-prev", zv)) { $(".z-prev", zv).addEventListener("click", function () { showZ(cur - 1); }); $(".z-next", zv).addEventListener("click", function () { showZ(cur + 1); }); }
    document.addEventListener("keydown", function (e) {
      if (!zv.classList.contains("open")) return;
      if (e.key === "Escape") closeZ();
      if (e.key === "ArrowRight" && p.images.length > 1) showZ(cur + 1);
      if (e.key === "ArrowLeft" && p.images.length > 1) showZ(cur - 1);
      if (e.key === "+" || e.key === "=") { var c = centre(); zoomAt(scale + 0.75, c[0], c[1]); }
      if (e.key === "-") { var c2 = centre(); zoomAt(scale - 0.75, c2[0], c2[1]); }
    });
    zs.addEventListener("wheel", function (e) { e.preventDefault(); zoomAt(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY); }, { passive: false });
    zs.addEventListener("pointerdown", function (e) {
      pts[e.pointerId] = [e.clientX, e.clientY]; zs.setPointerCapture(e.pointerId);
      var ids = Object.keys(pts);
      if (ids.length === 2) { var a = pts[ids[0]], b = pts[ids[1]]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s: scale }; drag = null; return; }
      drag = { x: e.clientX, y: e.clientY, tx: tx, ty: ty, moved: false };
    });
    zs.addEventListener("pointermove", function (e) {
      if (!pts[e.pointerId]) return; pts[e.pointerId] = [e.clientX, e.clientY];
      var ids = Object.keys(pts);
      if (pinch && ids.length === 2) { var a = pts[ids[0]], b = pts[ids[1]]; zoomAt(pinch.s * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); return; }
      if (!drag) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
      if (scale > 1) { tx = drag.tx + dx; ty = drag.ty + dy; apply(); }
    });
    function up(e) {
      delete pts[e.pointerId];
      if (pinch) { if (Object.keys(pts).length < 2) pinch = null; drag = null; return; }
      if (drag && !drag.moved) {
        var now = Date.now(), touch = e.pointerType === "touch";
        if (!touch || now - last < 300) { if (scale > 1) { scale = 1; tx = ty = 0; apply(); } else zoomAt(2.5, e.clientX, e.clientY); last = 0; }
        else last = now;
      }
      drag = null;
    }
    zs.addEventListener("pointerup", up); zs.addEventListener("pointercancel", up);
    $$(".thumbs button").forEach(function (b) {
      function show() { main.src = b.dataset.src; cur = p.images.indexOf(b.dataset.src); $$(".thumbs button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); }
      b.addEventListener("mouseenter", show); b.addEventListener("click", show); b.addEventListener("focus", show);
    });
    $$(".sizes button").forEach(function (b) {
      b.addEventListener("click", function () { chosen = b.dataset.s; $$(".sizes button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); var h = $("#hint"); h.textContent = ""; h.classList.remove("err"); });
    });
    var plantBtn = $("#plant");
    if (plantBtn) plantBtn.addEventListener("click", function () {
      var h = $("#hint");
      if (!chosen) { h.textContent = "Please select a size."; h.classList.add("err"); return; }
      H.add(p.id, chosen); toast(p, chosen); h.classList.remove("err"); h.textContent = "Added to your harvest.";
    });
    $(".fav-wide").addEventListener("click", function () { var on = toggleFav(p.id); this.textContent = on ? "Favourited" : "Favourite"; });
    $("#related").innerHTML = S.products.filter(function (x) { return x.id !== p.id && !x.sold; })
      .sort(function (a, b) { return (b.collection === p.collection) - (a.collection === p.collection); }).slice(0, 4).map(card).join("");
    bindCards($("#related"));
  };

  pages.favourites = function () {
    var l = favs.get().map(S.product).filter(Boolean);
    $("#fav-grid").innerHTML = l.length ? l.map(card).join("") : '<div class="empty" style="grid-column:1/-1"><h2 class="h2">No favourites yet.</h2><p>Tap the heart on any product to save it here.</p><a class="btn" href="shop.html">Shop now</a></div>';
    bindCards($("#fav-grid"));
  };

  pages.story = function () {
    $("#roll").innerHTML = S.rollCall.map(function (f) {
      var wear = S.products.find(function (x) { return x.honours.name === f.name; });
      return '<div class="roll-row"><div class="yr">' + f.year + "</div><div><h3>" + esc(f.name) + '</h3><div class="place">' + esc(f.place) + "</div></div><p>" + esc(f.line) + "</p>" +
        (wear ? '<a class="link wear" href="product.html?id=' + wear.id + '">Wear it</a>' : "<span></span>") + "</div>";
    }).join("");
  };

  pages.harvest = function () {
    var root = $("#harvest-root");
    function render() {
      var items = H.items();
      if (!items.length) {
        root.innerHTML = '<div class="empty"><h2 class="h2">Your harvest is empty.</h2><p>Every piece carries a name. Find the one you want to wear.</p><a class="btn" href="shop.html">Shop now</a></div>';
        return;
      }
      var sub = H.total(), ship = sub >= 150 ? 0 : 12;
      root.innerHTML = '<div class="harvest"><div class="lines">' + items.map(function (x, i) {
        var p = S.product(x.id);
        return '<div class="line-item" data-i="' + i + '"><a class="th" href="product.html?id=' + p.id + '"><img src="' + p.images[0] + '" alt=""></a>' +
          '<div><h3><a href="product.html?id=' + p.id + '">' + esc(p.name) + '</a></h3><div class="sub">' + esc(p.colour) + " · Size " + esc(x.size) + "</div>" +
          (p.oneOfOne ? '<div class="sub">One of one</div>' : '<div class="qty"><button data-q="-1" aria-label="Decrease quantity">−</button><span>' + x.qty + '</span><button data-q="1" aria-label="Increase quantity">+</button></div>') +
          '</div><div class="end"><span>' + money(p.price * x.qty) + '</span><button class="remove" data-rm>Remove</button></div></div>';
      }).join("") + "</div>" +
        '<aside class="summary"><h2>Summary</h2>' +
        '<div class="row"><span>Subtotal</span><span>' + money(sub) + "</span></div>" +
        '<div class="row"><span>Delivery</span><span>' + (ship ? money(ship) : "Free") + "</span></div>" +
        '<div class="row total"><span>Total</span><span>' + money(sub + ship) + "</span></div>" +
        (ship ? '<div class="ship">Add ' + money(150 - sub) + " more for free delivery.</div>" : "") +
        '<button class="breaker" id="breaker" aria-describedby="breaker-help"><span class="fill"></span>Hold to break the chain</button>' +
        '<p class="fine" id="breaker-help">Press and hold to check out, or press Enter.</p></aside></div>';
      $$(".line-item").forEach(function (row) {
        var i = +row.dataset.i;
        $$("[data-q]", row).forEach(function (b) { b.addEventListener("click", function () { var v = H.items(); v[i].qty = Math.max(1, Math.min(9, v[i].qty + +b.dataset.q)); cart.set(v); render(); }); });
        $("[data-rm]", row).addEventListener("click", function () { var v = H.items(); v.splice(i, 1); cart.set(v); render(); });
      });
      breaker($("#breaker"));
    }
    function breaker(b) {
      var p = 0, raf, holding = false, last;
      function tick(t) { if (last) p = Math.min(1, p + (t - last) / 1200); last = t; b.style.setProperty("--p", p); if (p >= 1) { holding = false; done(); return; } if (holding) raf = requestAnimationFrame(tick); }
      function decay() { if (holding || p <= 0) return; p = Math.max(0, p - 0.06); b.style.setProperty("--p", p); requestAnimationFrame(decay); }
      function start(e) { if (e) e.preventDefault(); if (holding) return; holding = true; last = 0; raf = requestAnimationFrame(tick); }
      function stop() { if (!holding) return; holding = false; cancelAnimationFrame(raf); decay(); }
      b.addEventListener("pointerdown", start);
      ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { b.addEventListener(ev, stop); });
      b.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); done(); } else if (e.key === " ") start(e); });
      b.addEventListener("keyup", function (e) { if (e.key === " ") stop(); });
      b.addEventListener("click", function (e) { e.preventDefault(); });
    }
    function done() {
      var order = "SD-" + Math.random().toString(36).slice(2, 8).toUpperCase(), n = H.count();
      var f = document.createElement("div"); f.className = "freed"; f.setAttribute("role", "dialog"); f.setAttribute("aria-modal", "true"); f.setAttribute("aria-label", "Order confirmed");
      f.innerHTML = '<div class="splash"><img src="assets/splash/splash-01.svg" alt=""></div><div class="msg"><img class="mark" src="assets/mark-black-gold-rim.svg" alt="">' +
        '<div class="label">The chain is broken</div><h2 class="h1" style="margin-top:12px">You\'re free to go.</h2>' +
        "<p>Thank you. " + n + " piece" + (n === 1 ? " is" : "s are") + " on the way. We'll email you when your order ships.</p>" +
        '<a class="btn" href="index.html">Back to home</a><div class="order">Order ' + order + " · Preview checkout, no payment taken</div></div>";
      document.body.appendChild(f);
      requestAnimationFrame(function () { f.classList.add("show"); $(".btn", f).focus(); });
      cart.set([]); render();
    }
    render();
  };

  /* ---------- cookie consent ---------- */
  var CKEY = "seeeds.consent.v1";
  var CATS = [
    { id: "necessary", name: "Strictly necessary", desc: "Keep the site working: your harvest (cart), security and remembering these choices. These can't be switched off.", locked: true },
    { id: "functional", name: "Functional", desc: "Remember your favourites, recent searches and preferences between visits." },
    { id: "analytics", name: "Analytics", desc: "Help us understand which pages and products people use so we can improve the site. Data is aggregated." },
    { id: "marketing", name: "Marketing", desc: "Let us and our partners show you relevant seeeds ads on other sites and measure campaigns. Turning this off also opts you out of the \u201csale\u201d or \u201csharing\u201d of personal information." }
  ];
  function getConsent() { try { return JSON.parse(localStorage.getItem(CKEY) || "null"); } catch (e) { return null; } }
  function setConsent(c) {
    c.necessary = true; c.updated = new Date().toISOString();
    try { localStorage.setItem(CKEY, JSON.stringify(c)); } catch (e) {}
    window.seeedsConsent = c;
    document.dispatchEvent(new CustomEvent("seeeds:consent", { detail: c }));
  }
  window.seeedsConsent = getConsent();
  function cookies() {
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="cookie-bar" role="region" aria-label="Cookie notice" hidden><div class="cookie-in">' +
      "<p><strong>We use cookies.</strong> Some keep the site working. With your permission we'd also like to use cookies for favourites, analytics and marketing. <a href=\"privacy.html#cookies\">Learn more</a></p>" +
      '<div class="cookie-actions"><button class="btn light sm" data-ck="settings">Cookie Settings</button><button class="btn light sm" data-ck="reject">Reject all</button><button class="btn sm" data-ck="accept">Accept all</button></div></div></div>' +
      '<div class="modal" id="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="ck-title"><div class="box ck-box">' +
      '<button class="icon-btn x" aria-label="Close">' + I.close + '</button><h2 id="ck-title">Cookie settings</h2>' +
      '<p>Choose which cookies seeeds can use. You can change this any time from "Cookie Settings" at the bottom of every page.</p>' +
      CATS.map(function (c) {
        return '<div class="ck-row"><div><h3>' + c.name + "</h3><p>" + c.desc + "</p></div>" +
          (c.locked ? '<span class="ck-always">Always on</span>' : '<label class="switch"><input type="checkbox" data-cat="' + c.id + '"><span class="track" aria-hidden="true"></span><span class="sr">' + c.name + "</span></label>") + "</div>";
      }).join("") +
      '<div class="ck-foot"><button class="btn light" data-ck="reject">Reject all</button><button class="btn light" data-ck="save">Save choices</button><button class="btn" data-ck="accept">Accept all</button></div></div></div>';
    document.body.appendChild(wrap);
    var bar = $(".cookie-bar", wrap), modal = $("#cookie-modal", wrap);
    overlay(modal, null, $(".x", modal), function () { var f = $("input", modal); if (f) f.focus(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal._set(false); });
    function fill() { var c = getConsent() || {}; $$("[data-cat]", modal).forEach(function (i) { i.checked = !!c[i.dataset.cat]; }); }
    function all(v) { var c = {}; CATS.forEach(function (k) { c[k.id] = k.locked ? true : v; }); return c; }
    function done(c) { setConsent(c); bar.hidden = true; if (modal.classList.contains("open")) modal._set(false); }
    window.openCookieSettings = function () { fill(); modal._set(true); };
    $$("[data-ck]", wrap).forEach(function (b) {
      b.addEventListener("click", function () {
        var a = b.dataset.ck;
        if (a === "accept") done(all(true));
        else if (a === "reject") done(all(false));
        else if (a === "settings") window.openCookieSettings();
        else if (a === "save") { var c = all(false); $$("[data-cat]", modal).forEach(function (i) { c[i.dataset.cat] = i.checked; }); done(c); }
      });
    });
    $$("[data-cookie-settings]").forEach(function (b) { b.addEventListener("click", window.openCookieSettings); });
    if (!getConsent()) bar.hidden = false;
  }

  pages["privacy-rights"] = function () {
    var form = $("#rights-form"), note = $("#rights-note");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var type = $("input[name=rtype]:checked", form), email = form.email.value.trim();
      if (!type) { note.textContent = "Please choose the type of request."; note.className = "note err"; return; }
      if (!/.+@.+\..+/.test(email)) { note.textContent = "Please enter a valid email address."; note.className = "note err"; return; }
      var ref = "PR-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      form.reset();
      note.className = "note ok";
      note.textContent = "Request received (reference " + ref + "). We'll verify your identity by email and respond within 30 days. (Preview: this form isn't connected to an inbox yet.)";
    });
    var dns = $("#dns-toggle"), c = getConsent();
    dns.checked = c ? !c.marketing : false;
    dns.addEventListener("change", function () {
      var cur = getConsent() || { functional: false, analytics: false, marketing: true };
      cur.marketing = !dns.checked; setConsent(cur);
      var b = $(".cookie-bar"); if (b) b.hidden = true;
      $("#dns-note").textContent = dns.checked ? "Done. We won't sell or share your personal information for advertising on this browser." : "Opt-out removed.";
    });
    if (navigator.globalPrivacyControl) $("#gpc-note").hidden = false;
  };

  /* ---------- boot ---------- */
  header(); footer(); cookies();
  function headH() {
    var h = ["utility", "site-head", "promo"].reduce(function (t, c) { var el = $("." + c); return t + (el ? el.offsetHeight : 0); }, 0);
    document.documentElement.style.setProperty("--head-h", h + "px");
  }
  headH(); addEventListener("resize", headH);
  if (pages[page]) pages[page]();
  bindCards(document); paint();
  addEventListener("storage", paint);
})();
