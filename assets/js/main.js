/* ==========================================================================
   Iconic Lab — interactions + i18n application
   ========================================================================== */
(function () {
  "use strict";

  var LANGS = ["ko", "en", "zh", "ja"];
  var STORE = "iconiclab.lang";
  var dict = window.I18N || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- language resolution ---------- */
  function pickLang() {
    // explicit ?lang= override wins (shareable localized links)
    try {
      var q = new URLSearchParams(location.search).get("lang");
      if (q && LANGS.indexOf(q) !== -1) return q;
    } catch (e) {}
    var saved = null;
    try { saved = localStorage.getItem(STORE); } catch (e) {}
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "ko").toLowerCase();
    if (nav.indexOf("zh") === 0) return "zh";
    if (nav.indexOf("ja") === 0) return "ja";
    if (nav.indexOf("en") === 0) return "en";
    return "ko";
  }

  function t(key, lang) {
    var l = dict[lang] || dict.ko || {};
    if (l[key] != null) return l[key];
    if (dict.ko && dict.ko[key] != null) return dict.ko[key];
    return key;
  }

  var current = pickLang();

  function applyLang(lang) {
    current = lang;
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    document.documentElement.setAttribute("lang", lang);

    // text content
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = t(nodes[i].getAttribute("data-i18n"), lang);
    }
    // attribute: content (meta tags)
    var metas = document.querySelectorAll("[data-i18n-content]");
    for (var m = 0; m < metas.length; m++) {
      metas[m].setAttribute("content", t(metas[m].getAttribute("data-i18n-content"), lang));
    }
    // attribute: aria-label
    var arias = document.querySelectorAll("[data-i18n-aria]");
    for (var a = 0; a < arias.length; a++) {
      arias[a].setAttribute("aria-label", t(arias[a].getAttribute("data-i18n-aria"), lang));
    }

    // page-specific title/description
    var page = window.PAGE;
    if (page && page.app) {
      document.title = page.name + " · " + t(page.app + ".tag", lang) + " — Iconic Lab";
      setMeta("description", t(page.app + ".desc", lang));
    } else {
      var titleNode = document.querySelector("title[data-i18n]");
      if (titleNode) document.title = titleNode.textContent;
    }

    // language switcher state
    var label = document.querySelector(".lang-current");
    if (label) label.textContent = t("lang." + lang, lang);
    var opts = document.querySelectorAll(".lang-menu button[data-lang]");
    for (var o = 0; o < opts.length; o++) {
      opts[o].setAttribute("aria-current", opts[o].getAttribute("data-lang") === lang ? "true" : "false");
    }
  }

  function setMeta(name, val) {
    var el = document.querySelector('meta[name="' + name + '"]');
    if (el) el.setAttribute("content", val);
  }

  /* ---------- DOM ready ---------- */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    applyLang(current);

    /* nav scrolled state */
    var nav = document.querySelector(".nav");
    var onScroll = function () {
      if (!nav) return;
      nav.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* mobile menu */
    var toggle = document.querySelector(".nav-toggle");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) closeLang();
      });
      nav.querySelectorAll(".nav-links a").forEach(function (a) {
        a.addEventListener("click", function () { nav.classList.remove("menu-open"); });
      });
    }

    /* language dropdown */
    var lang = document.querySelector(".lang");
    var langBtn = lang && lang.querySelector(".lang-btn");
    function closeLang() {
      if (!lang) return;
      lang.classList.remove("open");
      if (langBtn) langBtn.setAttribute("aria-expanded", "false");
    }
    if (lang && langBtn) {
      langBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = lang.classList.toggle("open");
        langBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      lang.querySelectorAll(".lang-menu button[data-lang]").forEach(function (b) {
        b.addEventListener("click", function () {
          applyLang(b.getAttribute("data-lang"));
          closeLang();
        });
      });
      document.addEventListener("click", closeLang);
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && lang.classList.contains("open")) {
          closeLang();
          langBtn.focus();
        }
      });
    }

    /* scroll reveal */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
      // reveal anything already in or ABOVE the viewport so a cold deep-link to an
      // anchor (e.g. /#apps) never leaves earlier sections permanently hidden
      var sweep = function () {
        revealEls.forEach(function (el) {
          if (el.classList.contains("in")) return;
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add("in"); io.unobserve(el);
          }
        });
      };
      sweep();
      window.addEventListener("load", sweep);
    } else {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    }

    /* pointer-driven glow (hero + cards) */
    if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
      var spot = document.querySelector(".hero-spot");
      var hero = document.querySelector(".hero");
      if (spot && hero) {
        hero.addEventListener("pointermove", function (e) {
          var r = hero.getBoundingClientRect();
          spot.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
          spot.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
        });
      }
      document.querySelectorAll(".app-card").forEach(function (card) {
        card.addEventListener("pointermove", function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty("--mx", (e.clientX - r.left) + "px");
          card.style.setProperty("--my", (e.clientY - r.top) + "px");
        });
      });
    }
  });
})();
