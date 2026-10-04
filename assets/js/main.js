/* The BCS Team — site behaviour. Plain JavaScript, no dependencies. */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.remove("no-js");

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(!document.body.classList.contains("nav-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        setNav(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (mq) {
      if (mq.matches) setNav(false);
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Animated counters ---------- */
  // <span data-count="42000">42,000</span> — the markup holds the final value, so no-JS is fine.
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- Section sub-navigation highlight ---------- */
  var subLinks = document.querySelectorAll(".subnav a[href^='#']");
  if (subLinks.length && "IntersectionObserver" in window) {
    var map = {};
    subLinks.forEach(function (a) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target) map[target.id] = a;
    });
    var subObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          subLinks.forEach(function (a) { a.classList.remove("is-active"); });
          var link = map[entry.target.id];
          link.classList.add("is-active");
          link.scrollIntoView({ block: "nearest", inline: "center", behavior: prefersReducedMotion ? "auto" : "smooth" });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) { subObserver.observe(document.getElementById(id)); });
  }

  /* ---------- Contact form ---------- */
  // No server yet: on submit the form validates, then opens the visitor's email client
  // with the message pre-filled. Swap `action` for a form service (e.g. Formspree) later.
  var form = document.getElementById("contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var preset = new URLSearchParams(window.location.search).get("topic");
    if (preset) {
      var radio = form.querySelector("input[name='topic'][value='" + preset + "']");
      if (radio) radio.checked = true;
    }

    function fieldOk(input) {
      var wrap = input.closest(".field");
      var ok = input.checkValidity();
      if (wrap) wrap.classList.toggle("has-error", !ok);
      return ok;
    }

    form.querySelectorAll("input, textarea, select").forEach(function (input) {
      input.addEventListener("blur", function () { if (input.value) fieldOk(input); });
      input.addEventListener("input", function () {
        var wrap = input.closest(".field");
        if (wrap && wrap.classList.contains("has-error")) fieldOk(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var required = form.querySelectorAll("[required]");
      var firstBad = null;
      required.forEach(function (input) {
        if (!fieldOk(input) && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }

      var data = new FormData(form);
      var topic = data.get("topic") || "General inquiry";
      var lines = [
        "Name: " + data.get("name"),
        "Organization: " + (data.get("organization") || "—"),
        "Email: " + data.get("email"),
        "Phone: " + (data.get("phone") || "—"),
        "Inquiry type: " + topic,
        "",
        data.get("message")
      ];
      var href = "mailto:" + form.getAttribute("data-to") +
        "?subject=" + encodeURIComponent("Website inquiry: " + topic) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      window.location.href = href;
      if (status) {
        status.classList.add("is-visible");
        status.focus();
      }
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
