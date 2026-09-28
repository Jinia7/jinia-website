/* ============================================================
   main.js — 页面行为：渲染内容、导航、灯箱、滚动揭示
   依赖：art.js（图形）、site.js（内容）
   ============================================================ */

(function () {
  "use strict";

  var DIM = { hero: [640, 800], tree: [640, 800], portrait: [640, 800], desk: [640, 800] };

  function dim(id) { return DIM[id] || [800, 600]; }

  function art(id) {
    var d = dim(id);
    return '<svg class="art" viewBox="0 0 ' + d[0] + " " + d[1] +
      '" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><use href="#art-' +
      id + '"/></svg>';
  }

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function fmtDate(d) { return d.replace(/-/g, "."); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function tx(t) { return String(t == null ? "" : t); }

  function cat(id) {
    if (typeof CATS === "undefined") return { zh: "", en: "" };
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i];
    return { zh: "", en: "" };
  }

  /* ‹待补充› 小标签 */
  function todo(label) {
    return '<span class="todo">' + tx(label || "待补充") + "</span>";
  }

  /* ---------- 站点信息回填 ---------- */
  function fillSite() {
    if (typeof SITE === "undefined") return;

    $$("[data-site]").forEach(function (el) {
      var k = el.getAttribute("data-site");
      if (SITE[k] != null) el.textContent = SITE[k];
    });

    $$("[data-hero-title]").forEach(function (el) {
      el.innerHTML = SITE.heroTitle;
    });

    /* 邮箱没填时，全站显示统一的待补充标签，而不是假地址 */
    $$("[data-mail]").forEach(function (el) {
      if (SITE.email) {
        el.setAttribute("href", "mailto:" + SITE.email);
        el.textContent = SITE.email;
      } else {
        el.removeAttribute("href");
        el.classList.add("todo");
        el.textContent = "邮箱 · 待补充";
      }
    });

    var meta = $("#heroMeta");
    if (meta && SITE.heroMeta) {
      meta.innerHTML = SITE.heroMeta
        .map(function (t) { return "<span>" + t + "</span>"; })
        .join("<i></i>");
    }

    var facts = $("#homeFacts");
    if (facts && typeof FACTS !== "undefined") {
      facts.innerHTML = FACTS.map(function (f) {
        return '<div class="fact"><span class="fact__k">' + f.k +
          '</span><span class="fact__v">' + f.v + "</span></div>";
      }).join("");
    }

    $$("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- 随笔列表 ---------- */
  function postItem(p, n) {
    var c = cat(p.cat);
    var tag = c.zh ? c.zh + (c.en ? " · " + c.en : "") : "";
    return '<a class="pitem' + (p.draft ? " pitem--draft" : "") + '" href="post.html?id=' + p.id + '">' +
      '<span class="pitem__n">' + pad(n) + "</span>" +
      "<span>" +
      '<span class="pitem__t">' + p.title +
      (p.draft ? '<span class="pitem__flag">' + todo() + "</span>" : "") +
      "</span>" +
      '<span class="pitem__e">' + p.excerpt + "</span>" +
      "</span>" +
      '<span class="pitem__m">' + tag + "<br>" + fmtDate(p.date) + "</span>" +
      "</a>";
  }

  function renderPostList(el, limit, source) {
    if (!el || typeof POSTS === "undefined") return;
    var all = source || POSTS;
    var list = limit ? all.slice(0, limit) : all;
    el.innerHTML = list.map(function (p, i) { return postItem(p, i + 1); }).join("");
  }

  /* 随笔页：分类筛选 + 按年份分组 */
  function renderBlog(el) {
    if (!el || typeof POSTS === "undefined") return;
    var filters = $("#blogFilters");
    var active = "all";

    function draw() {
      var list = active === "all"
        ? POSTS
        : POSTS.filter(function (p) { return p.cat === active; });

      if (!list.length) {
        el.innerHTML = '<p class="empty">这一类还没开始写。' + todo("待补充") + "</p>";
        return;
      }

      var years = [], map = {};
      list.forEach(function (p) {
        var y = p.date.slice(0, 4);
        if (!map[y]) { map[y] = []; years.push(y); }
        map[y].push(p);
      });
      var n = 0;
      el.innerHTML = years.map(function (y) {
        var items = map[y].map(function (p) { n++; return postItem(p, n); }).join("");
        return '<section class="sec sec--tight">' +
          '<div class="sec__head"><h2 class="sec__title">' + y +
          "<span>" + map[y].length + " 篇</span></h2></div>" +
          '<div class="plist">' + items + "</div></section>";
      }).join("");
    }

    if (filters) {
      var all = [{ id: "all", zh: "全部", en: "All" }].concat(CATS);
      filters.innerHTML = all.map(function (c) {
        return '<button type="button" data-cat="' + c.id + '" aria-pressed="' +
          (c.id === "all") + '">' + c.zh +
          (c.en ? '<i>' + c.en + "</i>" : "") + "</button>";
      }).join("");

      filters.addEventListener("click", function (e) {
        var b = e.target.closest ? e.target.closest("button[data-cat]") : null;
        if (!b) return;
        active = b.getAttribute("data-cat");
        $$("button[data-cat]", filters).forEach(function (x) {
          x.setAttribute("aria-pressed", x === b);
        });
        draw();
      });
    }

    draw();
  }

  /* ---------- 作品 ---------- */
  /* 图片位：有 img 字段就显示真实图片，没有就用占位 SVG
     全站所有图片位都走这里——作品封面、过程图、照片墙、视频卡，
     所以「换图」只需要在 site.js 里加一行 img: "assets/img/xxx.jpg" */
  function frameMedia(o, tag) {
    var alt = tx(o.title || o.note || "");
    if (o.img) return '<img src="' + o.img + '" alt="' + alt + '" loading="lazy">';
    return art(o.art) + '<span class="frame__tag">' + (tag || "占位图") + "</span>";
  }

  function workCard(w, n, linked) {
    var open = linked === false ? "article" : "a";
    var href = linked === false ? "" : ' href="project.html?id=' + w.id + '"';
    return "<" + open + ' class="wcard"' + href + ">" +
      '<div class="frame frame--43">' + frameMedia(w) + "</div>" +
      '<div class="wcard__idx"><b>' + pad(n) + "</b><span>" +
      tx(w.year) + " · " + tx(w.meta) + "</span></div>" +
      '<h3 class="wcard__t">' + tx(w.title) + "</h3>" +
      '<p class="wcard__d">' + tx(w.course) + "</p>" +
      "</" + open + ">";
  }

  function renderWorks(el, limit, linked) {
    if (!el || typeof WORKS === "undefined") return;
    var list = limit ? WORKS.slice(0, limit) : WORKS;
    el.innerHTML = list.map(function (w, i) {
      return workCard(w, i + 1, linked);
    }).join("");
  }

  /* ---------- 生活 ---------- */
  function renderLife() {
    var moments = $("#momentList");
    if (moments && typeof MOMENTS !== "undefined") {
      moments.innerHTML = MOMENTS.map(function (m) {
        return '<article class="mcard">' +
          '<span class="tape tape--tl" aria-hidden="true"></span>' +
          "<p>" + tx(m.prompt) + "</p>" +
          (m.date ? '<p class="mcard__d">' + tx(m.date) + "</p>" : "") +
          "</article>";
      }).join("");
    }

    var photos = $("#photoGrid");
    if (photos && typeof PHOTOS !== "undefined") {
      photos.innerHTML = PHOTOS.map(function (p) {
        return '<button class="ph ' + p.span + '" type="button" ' +
          'data-art="' + p.art + '" data-img="' + tx(p.img || "") + '" data-title="' + p.title +
          '" data-note="' + p.note + '">' +
          '<div class="frame ' + p.ratio + '">' + frameMedia(p) + "</div>" +
          '<span class="ph__cap"><b>' + tx(p.title) + "</b>" + tx(p.note) + "</span>" +
          "</button>";
      }).join("");
    }

    var also = $("#alsoList");
    if (also && typeof ALSO !== "undefined") {
      also.innerHTML = ALSO.map(function (t) { return "<li>" + tx(t) + "</li>"; }).join("");
    }
  }

  /* ---------- 设计页 ---------- */
  function renderDesign() {
    var made = $("#workGrid");
    if (made && typeof WORKS !== "undefined") {
      made.innerHTML = WORKS.map(function (w, i) {
        return workCard(w, i + 1, true);
      }).join("");
    }

    if (typeof LEARNING !== "undefined") {
      var lhtml = LEARNING.map(function (d) {
        return "<li><strong>" + tx(d.title) + "</strong><span>" + tx(d.note) + "</span></li>";
      }).join("");
      ["#learnList", "#homeLearn"].forEach(function (sel) {
        var el = $(sel);
        if (el) el.innerHTML = lhtml;
      });
    }

    var exploring = $("#exploreList");
    if (exploring && typeof EXPLORING !== "undefined") {
      exploring.innerHTML = EXPLORING.map(function (t) {
        return "<li>" + tx(t) + "</li>";
      }).join("");
    }
  }

  /* ---------- 关于页 ---------- */
  function renderAbout() {
    var body = $("#aboutBody");
    if (body && typeof ABOUT_PARAGRAPHS !== "undefined") {
      body.innerHTML = ABOUT_PARAGRAPHS.map(function (t) {
        return "<p>" + tx(t) + "</p>";
      }).join("");
    }

    var ar = $("#aboutArchive");
    if (ar && typeof ABOUT_ARCHIVE !== "undefined") {
      ar.innerHTML = ABOUT_ARCHIVE.map(function (a) {
        return '<article class="acard' + (a.tape ? " acard--fun" : "") + '">' +
          (a.tape ? '<span class="tape tape--tl" aria-hidden="true"></span>' : "") +
          '<p class="acard__en">' + tx(a.en) + "</p>" +
          '<p class="acard__k">' + tx(a.k) + "</p>" +
          '<h3 class="acard__t">' + tx(a.t) + "</h3>" +
          '<p class="acard__n">' + tx(a.n) + "</p>" +
          "</article>";
      }).join("");
    }

    var now = $("#aboutNow");
    if (now && typeof ABOUT_NOW !== "undefined") {
      now.innerHTML = ABOUT_NOW.map(function (t) { return "<li>" + tx(t) + "</li>"; }).join("");
    }

    var tools = $("#aboutTools");
    if (tools && typeof ABOUT_TOOLS !== "undefined") {
      tools.innerHTML = ABOUT_TOOLS.map(function (t) { return "<li>" + tx(t) + "</li>"; }).join("");
    }

    var td = $("#aboutTodo");
    if (td && typeof ABOUT_TODO !== "undefined") {
      td.innerHTML = ABOUT_TODO.map(function (t) {
        return "<li>" + todo() + "<span>" + tx(t) + "</span></li>";
      }).join("");
    }
  }

  /* ---------- 文章详情 ---------- */
  function renderPost() {
    var host = $("#postBody");
    if (!host || typeof POSTS === "undefined") return;

    var id = new URLSearchParams(location.search).get("id");
    var idx = POSTS.findIndex(function (p) { return p.id === id; });
    if (idx < 0) idx = 0;
    var p = POSTS[idx];
    var c = cat(p.cat);

    document.title = p.title + (SITE ? " · " + SITE.name : "");
    var setT = function (sel, v) { var e = $(sel); if (e) e.textContent = v; };
    setT("#postTitle", p.title);
    setT("#postTag", c.zh ? c.zh + (c.en ? " · " + c.en : "") : "");
    setT("#postDate", fmtDate(p.date));

    var html = "";

    if (p.draft) {
      html += '<div class="notice">' +
        "<p><b>这篇的题目定了，正文还没写。</b>这个网站打算慢慢填，所以先把提纲放在这里——" +
        "等写完了，再把这段换掉。</p></div>";
    }

    html += p.body.map(function (b) {
      if (b.indexOf("## ") === 0) return "<h2>" + tx(b.slice(3)) + "</h2>";
      if (b.indexOf("> ") === 0) return "<blockquote>" + tx(b.slice(2)) + "</blockquote>";
      return "<p>" + tx(b) + "</p>";
    }).join("");

    if (p.outline) {
      html += '<div class="outline"><p class="outline__h">打算写这些</p><ol>' +
        p.outline.map(function (o) { return "<li>" + tx(o) + "</li>"; }).join("") +
        "</ol></div>";
    }

    host.innerHTML = html;

    var len = p.body.join("").length;
    setT("#postLen", p.draft ? "待写完" : "约 " + Math.max(1, Math.round(len / 380)) + " 分钟");

    var prev = POSTS[idx + 1];
    var next = POSTS[idx - 1];
    var pf = $("#postPrev"), nf = $("#postNext");
    if (pf) {
      if (prev) { pf.href = "post.html?id=" + prev.id; pf.innerHTML = "← " + prev.title; }
      else pf.style.visibility = "hidden";
    }
    if (nf) {
      if (next) { nf.href = "post.html?id=" + next.id; nf.innerHTML = next.title + " →"; }
      else nf.style.visibility = "hidden";
    }

    $$("[data-related]").forEach(function (el) {
      var others = POSTS.filter(function (q, i) { return i !== idx; }).slice(0, 3);
      el.innerHTML = others.map(function (q, i) { return postItem(q, i + 1); }).join("");
    });
  }

  /* ---------- 项目详情 ---------- */
  function renderProject() {
    var host = $("#projBody");
    if (!host || typeof WORKS === "undefined") return;

    var id = new URLSearchParams(location.search).get("id");
    var idx = WORKS.findIndex(function (w) { return w.id === id; });
    if (idx < 0) idx = 0;
    var w = WORKS[idx];

    document.title = w.title + (SITE ? " · " + SITE.name : "");
    var setT = function (sel, v) { var e = $(sel); if (e) e.textContent = v; };
    setT("#projTitle", w.title);
    setT("#projEn", w.titleEn || "");
    setT("#projTag", w.year + " · " + w.meta);
    setT("#projDesc", w.desc);

    var f = $("#projFrame");
    if (f) f.innerHTML = frameMedia(w, "占位图 · 等真实图片");

    var cap = $("#projCap");
    if (cap) cap.innerHTML = "<b>" + tx(w.title) + "</b><span>" +
      tx(w.course || "") + "</span>";

    var rows = $("#projRows");
    if (rows) {
      var r = [
        { k: "类型", v: w.meta },
        { k: "课程 / 来源", v: w.course },
        { k: "年份", v: w.year },
        { k: "我的部分", v: w.role },
        { k: "用到", v: (w.tools || []).join(" · ") }
      ];
      rows.innerHTML = r.map(function (x) {
        return '<div class="row"><p class="row__k">' + tx(x.k) +
          '</p><p class="row__v">' + tx(x.v) + "</p></div>";
      }).join("");
    }

    setT("#projBrief", w.brief);

    var steps = $("#projSteps");
    if (steps) {
      steps.innerHTML = (w.steps || []).map(function (s) {
        return '<li class="step"><span class="step__k">' + tx(s.k) +
          '</span><div><p class="step__t">' + tx(s.t) + "</p>" +
          '<p class="step__n">' + tx(s.n) + "</p></div></li>";
      }).join("");
    }

    var gal = $("#projGallery");
    if (gal) {
      gal.innerHTML = (w.gallery || []).map(function (g) {
        /* 没写 title 的图就不显示图注那一行 */
        var cap = g.title ? "<b>" + tx(g.title) + "</b>" : "";
        if (g.todo) cap += todo();
        return '<figure class="gitem"><div class="frame ' + g.ratio + '">' + frameMedia(g) + "</div>" +
          (cap ? '<figcaption class="cap">' + cap + "</figcaption>" : "") +
          "</figure>";
      }).join("");
    }

    var td = $("#projTodo");
    if (td) {
      var list = w.todo || [];
      td.innerHTML = list.map(function (t) {
        return "<li>" + todo() + "<span>" + tx(t) + "</span></li>";
      }).join("");
      /* 清单空了就把整个「还缺」区块藏起来，让「题目」占满整行 */
      var box = td.parentElement;
      var sec = td.closest("section");
      if (box) box.hidden = !list.length;
      if (sec && !list.length) sec.classList.add("two--single");
    }

    var other = $("#projOther");
    if (other) {
      other.innerHTML = WORKS.filter(function (x) { return x.id !== w.id; })
        .map(function (x, i) { return workCard(x, i + 1, true); }).join("");
    }
  }

  /* ---------- 导航 ---------- */
  function initNav() {
    var here = location.pathname.split("/").pop() || "index.html";
    if (here === "") here = "index.html";
    $$(".nav a, .menu__nav a, .ftr__nav a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href === here) a.setAttribute("aria-current", "page");
    });

    var hdr = $("#hdr");
    if (hdr) {
      var onScroll = function () {
        hdr.setAttribute("data-scrolled", window.scrollY > 8 ? "true" : "false");
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    var burger = $("#burger");
    var menu = $("#menu");
    if (!burger || !menu) return;

    var close = function () {
      menu.setAttribute("data-open", "false");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "打开菜单");
      document.body.removeAttribute("data-lock");
    };

    burger.addEventListener("click", function () {
      var open = menu.getAttribute("data-open") === "true";
      if (open) { close(); return; }
      menu.setAttribute("data-open", "true");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "关闭菜单");
      document.body.setAttribute("data-lock", "true");
    });

    $$("a", menu).forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) close();
    });
  }

  /* ---------- 灯箱 ---------- */
  function initLightbox() {
    var lb = $("#lightbox");
    if (!lb) return;
    var stage = $("#lbStage"), cap = $("#lbCap");
    var lastFocus = null;

    function open(btn) {
      lastFocus = btn;
      var img = btn.getAttribute("data-img");
      if (img) {
        stage.innerHTML = '<img src="' + img + '" alt="' +
          btn.getAttribute("data-title") + '">';
        cap.innerHTML = "<b>" + btn.getAttribute("data-title") + "</b>" +
          "<span>" + btn.getAttribute("data-note") + "</span>";
      } else {
        stage.innerHTML = art(btn.getAttribute("data-art"));
        cap.innerHTML = "<b>" + btn.getAttribute("data-title") + "</b>" +
          "<span>" + btn.getAttribute("data-note") + " · 占位图，等真实照片</span>";
      }
      lb.setAttribute("data-open", "true");
      document.body.setAttribute("data-lock", "true");
      $("#lbClose").focus();
    }
    function close() {
      lb.setAttribute("data-open", "false");
      document.body.removeAttribute("data-lock");
      if (lastFocus) lastFocus.focus();
    }

    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var btn = t.closest(".ph, .vcard");
      if (btn) { open(btn); return; }
      if (t.closest("#lbClose") || t === lb) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.getAttribute("data-open") === "true") close();
    });
  }

  /* ---------- 滚动揭示 ---------- */
  function initReveal() {
    var items = $$("[data-reveal]");
    if (!items.length) return;

    // 容器里有多张卡片时，让它们依次弹入：每张差 60ms，最多等 420ms
    // 用脚本加 class，脚本没跑时卡片照常可见，不会白屏
    items.forEach(function (el) {
      var kids = Array.prototype.slice.call(el.children);
      if (kids.length < 2) return;
      el.__stagger = kids;
      kids.forEach(function (k, i) {
        k.classList.add("rv");
        k.style.animationDelay = Math.min(i * 60, 420) + "ms";
      });
    });

    function show(el) {
      el.classList.add("is-in");
      if (el.__stagger) {
        el.__stagger.forEach(function (k) { k.classList.add("is-in"); });
      }
    }

    if (!("IntersectionObserver" in window)) {
      items.forEach(show);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var delay = parseFloat(el.getAttribute("data-reveal")) || 0;
        el.style.transitionDelay = delay + "s";
        show(el);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 启动 ---------- */
  function boot() {
    fillSite();
    renderPostList($("#homePosts"), 4);
    renderWorks($("#homeWorks"), 3, true);
    renderBlog($("#blogHost"));
    renderLife();
    renderDesign();
    renderAbout();
    renderPost();
    renderProject();
    initNav();
    initLightbox();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
