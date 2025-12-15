/* Three Pines Industries - single page interactions (vanilla JS)
   - Mobile nav toggle + focus management
   - Smooth scrolling + active section highlighting
   - IntersectionObserver reveal animations
   - Parallax hero layers
   - Tabs (Capabilities) with ARIA
   - Form validation + success animation
*/

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* -------- Theme toggle (dark/light) -------- */
(function initTheme() {
  const stored = localStorage.getItem("tpi-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const root = document.documentElement;

  if (stored === "dark" || (!stored && prefersDark)) root.classList.add("dark");

  const btn = $("#themeToggle");
  btn?.addEventListener("click", () => {
    root.classList.toggle("dark");
    localStorage.setItem("tpi-theme", root.classList.contains("dark") ? "dark" : "light");
    btn.setAttribute("aria-pressed", root.classList.contains("dark") ? "true" : "false");
  });
})();

/* -------- Mobile nav -------- */
(function initMobileNav() {
  const toggle = $("#navToggle");
  const panel = $("#mobileNav");
  const backdrop = $("#navBackdrop");
  const links = $$("#mobileNav a");

  if (!toggle || !panel || !backdrop) return;

  const open = () => {
    panel.dataset.open = "true";
    backdrop.dataset.open = "true";
    toggle.setAttribute("aria-expanded", "true");
    panel.removeAttribute("inert");
    links[0]?.focus();
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    panel.dataset.open = "false";
    backdrop.dataset.open = "false";
    toggle.setAttribute("aria-expanded", "false");
    panel.setAttribute("inert", "");
    toggle.focus();
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
    const isOpen = panel.dataset.open === "true";
    isOpen ? close() : open();
  });

  backdrop.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.dataset.open === "true") close();
  });

  links.forEach((a) => a.addEventListener("click", close));

  panel.setAttribute("inert", "");
  panel.dataset.open = "false";
  backdrop.dataset.open = "false";
})();

/* -------- Smooth scroll for in-page anchors (and offset for sticky header) -------- */
(function initSmoothScroll() {
  const header = $("#siteHeader");
  const headerH = () => (header ? header.getBoundingClientRect().height : 0);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top - headerH() - 10;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  $$('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.length < 2) return;
    const id = href.slice(1);

    a.addEventListener("click", (e) => {
      if (!document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
      history.replaceState(null, "", `#${id}`);
    });
  });
})();

/* -------- Active section highlighting in nav -------- */
(function initActiveSectionHighlight() {
  const sectionIds = ["home", "about", "divisions", "capabilities", "contact"];
  const navLinks = new Map();

  sectionIds.forEach((id) => {
    const link = $(`a[data-nav="${id}"]`);
    if (link) navLinks.set(id, link);
  });

  const setActive = (id) => {
    navLinks.forEach((link, key) => {
      const active = key === id;
      link.setAttribute("aria-current", active ? "page" : "false");
      link.classList.toggle("text-glacier-700", active);
      link.classList.toggle("dark:text-glacier-300", active);
      link.classList.toggle("font-semibold", active);
    });
  };

  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    },
    { root: null, threshold: [0.25, 0.5, 0.75], rootMargin: "-10% 0px -60% 0px" }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();

/* -------- IntersectionObserver reveal animations -------- */
(function initReveal() {
  const els = $$(".reveal");
  if (!els.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  els.forEach((el) => obs.observe(el));
})();

/* -------- Hero parallax (3+ layers) -------- */
(function initParallax() {
  const layers = $$(".parallax-layer");
  if (!layers.length) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY || 0;

    layers.forEach((layer) => {
      const speed = Number(layer.dataset.speed || "0.2");
      const translate = Math.min(y * speed, 220);
      layer.style.transform = `translate3d(0, ${translate}px, 0)`;
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
})();

/* -------- Capabilities tabs (ARIA) -------- */
(function initTabs() {
  const tablist = $("#capTablist");
  if (!tablist) return;

  const tabs = $$('[role="tab"]', tablist);
  const panels = $$('[role="tabpanel"]');

  const activate = (tab) => {
    const target = tab.getAttribute("aria-controls");
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", selected ? "true" : "false");
      t.setAttribute("tabindex", selected ? "0" : "-1");
    });

    panels.forEach((p) => {
      const show = p.id === target;
      p.hidden = !show;
      if (show) {
        p.classList.remove("opacity-0", "translate-y-2");
        p.classList.add("opacity-100", "translate-y-0");
      }
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (e) => {
      const idx = tabs.indexOf(tab);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        tabs[(idx + 1) % tabs.length].focus();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        tabs[(idx - 1 + tabs.length) % tabs.length].focus();
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate(tab);
      }
    });
  });

  const initial = tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
  if (initial) activate(initial);
})();

/* -------- Form validation + success animation -------- */
(function initForm() {
  const form = $("#contactForm");
  if (!form) return;

  const name = $("#name");
  const email = $("#email");
  const org = $("#org");
  const message = $("#message");
  const status = $("#formStatus");
  const success = $("#formSuccess");

  const setError = (input, msg) => {
    const id = input.getAttribute("id");
    const err = $(`#${id}Error`);
    if (err) err.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  };

  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

  const validate = () => {
    let ok = true;

    if (!name.value.trim()) { setError(name, "Please enter your name."); ok = false; }
    else setError(name, "");

    if (!email.value.trim()) { setError(email, "Please enter your email."); ok = false; }
    else if (!validEmail(email.value)) { setError(email, "Please enter a valid email address."); ok = false; }
    else setError(email, "");

    if (org.value.trim().length > 0 && org.value.trim().length < 2) { setError(org, "Organization name looks too short."); ok = false; }
    else setError(org, "");

    if (!message.value.trim() || message.value.trim().length < 10) { setError(message, "Please include a message (10+ characters)."); ok = false; }
    else setError(message, "");

    return ok;
  };

  [name, email, org, message].forEach((el) => {
    el.addEventListener("input", () => validate());
    el.addEventListener("blur", () => validate());
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    success.hidden = true;
    status.textContent = "";

    if (!validate()) {
      status.textContent = "Please fix the highlighted fields and try again.";
      status.className = "mt-3 text-sm font-semibold text-red-600 dark:text-red-300";
      return;
    }

    const btn = $("#submitBtn");
    btn.disabled = true;
    btn.dataset.loading = "true";
    btn.innerHTML = `
      <span class="relative inline-flex items-center gap-2">
        <span class="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
        Sending…
      </span>
    `;

    await new Promise((r) => setTimeout(r, 800));

    btn.disabled = false;
    btn.dataset.loading = "false";
    btn.innerHTML = `Send message <span aria-hidden="true">→</span>`;

    form.reset();
    [name, email, org, message].forEach((el) => setError(el, ""));

    status.textContent = "";
    success.hidden = false;
    success.classList.remove("opacity-0", "translate-y-2");
    success.classList.add("opacity-100", "translate-y-0");
  });
})();
