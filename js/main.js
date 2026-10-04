/* ============ SETTINGS: edit these ============ */
var CONTACT = {
  email: "",          // e.g. "info@yourdomain.co.ke"
  phone: "",          // e.g. "+254 700 000 000"
  whatsapp: "",       // digits only with country code, e.g. "254700000000"
  location: "Kenya"
};
/* ================================================ */

(function () {
  // Year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Header shadow on scroll
  var header = document.querySelector(".site");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  });

  // Scroll reveal
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); setTimeout(function () { en.target.classList.add("done"); }, 1200); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in", "done"); });
  }

  // Glow that follows the cursor on cards
  document.querySelectorAll(".glow-hover").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // Sun drifts slower than the page as you scroll
  var sun = document.querySelector(".sun-wrap");
  if (sun && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        sun.style.transform = "translateY(" + (window.scrollY * 0.3) + "px)";
        ticking = false;
      });
    }, { passive: true });
  }

  // Contact details from settings
  document.querySelectorAll("[data-contact]").forEach(function (el) {
    var key = el.getAttribute("data-contact");
    if (CONTACT[key]) {
      el.textContent = CONTACT[key];
      if (key === "email") el.href = "mailto:" + CONTACT.email;
      if (key === "phone") el.href = "tel:" + CONTACT.phone.replace(/\s+/g, "");
    }
  });
  document.querySelectorAll("[data-whatsapp]").forEach(function (a) {
    if (CONTACT.whatsapp) a.href = "https://wa.me/" + CONTACT.whatsapp;
  });

  // Products filter
  var chips = document.querySelectorAll(".chip");
  var cards = document.querySelectorAll(".card[data-cat]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", "true");
      var cat = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var match = cat === "all" || card.getAttribute("data-cat") === cat;
        card.classList.toggle("hide", !match);
        if (match) { card.classList.remove("show"); void card.offsetWidth; card.classList.add("show"); }
      });
    });
  });

  // Contact form
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("status");
    var product = new URLSearchParams(window.location.search).get("product");
    if (product) {
      form.msg.value = "Hello, I would like to enquire about: " + product + ".";
      form.who.value = "Buyer";
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "note";
      if (!form.name.value.trim() || !form.email.value.trim() || !form.msg.value.trim()) {
        status.textContent = "Please fill in your name, email and message.";
        status.classList.add("err");
        return;
      }
      if (!CONTACT.email) {
        status.textContent = "The company email is not set yet. Add it in js/main.js.";
        status.classList.add("err");
        return;
      }
      var body = "Name: " + form.name.value + "\nEmail: " + form.email.value +
                 "\nI am a: " + form.who.value + "\n\n" + form.msg.value;
      window.location.href = "mailto:" + CONTACT.email +
        "?subject=" + encodeURIComponent("Website enquiry from " + form.name.value) +
        "&body=" + encodeURIComponent(body);
      status.textContent = "Opening your email app to send the message.";
      status.classList.add("ok");
    });
  }
})();
