// ==========================================================
// Claude Assist — landing page interactions
// ==========================================================

// 👉 Set this to your real download link (e.g. a .dmg on GitHub Releases).
const DOWNLOAD_URL = "downloads/ClaudeAssist.dmg";

(() => {
  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Download links ---------- */
  document.querySelectorAll(".js-download").forEach((a) => {
    a.href = DOWNLOAD_URL;
    a.setAttribute("download", "");
  });

  /* ---------- Theme toggle ---------- */
  const toggle = document.getElementById("themeToggle");
  const setTheme = (t, persist) => {
    root.dataset.theme = t;
    toggle.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    if (persist) localStorage.setItem("theme", t);
  };
  setTheme(root.dataset.theme || "light", false);
  toggle.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
  // Follow system changes unless the user picked a theme explicitly
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) setTheme(e.matches ? "dark" : "light", false);
  });

  /* ---------- Nav border on scroll ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Count-up numbers ---------- */
  const countUp = (el) => {
    const to = +el.dataset.to;
    if (reduceMotion) { el.textContent = to; return; }
    const dur = 1400, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("is-visible");
      el.querySelectorAll(".js-count").forEach(countUp);
      // drop the stagger delay afterwards so hover transitions stay snappy
      setTimeout(() => (el.style.transitionDelay = ""), 1400);
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach((el, i) => {
    // light stagger for siblings
    el.style.transitionDelay = `${(i % 6) * 70}ms`;
    io.observe(el);
  });

  /* ---------- Menu bar clock ---------- */
  const clock = document.querySelector(".js-clock");
  const fmtClock = () => {
    const d = new Date();
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    clock.textContent = `${day} ${time}`;
  };
  fmtClock();
  setInterval(fmtClock, 15000);

  /* ---------- Popover "Refreshing in Ns" countdown ---------- */
  const refresh = document.querySelector(".js-refresh");
  let secs = 5;
  setInterval(() => {
    secs = secs <= 1 ? 5 : secs - 1;
    refresh.textContent = secs;
  }, 1000);

  /* ---------- Reset countdown (ticks down each minute) ---------- */
  const resetEls = document.querySelectorAll(".js-reset, .js-reset-demo");
  let minutes = 280;
  const fmtReset = (m) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
  setInterval(() => {
    minutes = minutes <= 1 ? 300 : minutes - 1;
    resetEls.forEach((el) => (el.textContent = fmtReset(minutes)));
  }, reduceMotion ? 60000 : 2500);

  /* ---------- Status pill demo: cycles Good → Moderate → Low ---------- */
  const statusPill = document.querySelector(".js-status-pill");
  const states = [
    { c: "#5FCB6A", g: "rgba(95,203,106,.45)", w: "64px" },
    { c: "#E8B04B", g: "rgba(232,176,75,.45)", w: "40px" },
    { c: "#E5604D", g: "rgba(229,96,77,.45)", w: "18px" },
  ];
  let si = 0;
  if (!reduceMotion) {
    setInterval(() => {
      si = (si + 1) % states.length;
      const s = states[si];
      statusPill.style.background = s.c;
      statusPill.style.boxShadow = `0 0 22px ${s.g}`;
      statusPill.style.width = s.w;
    }, 2200);
  }

  /* ---------- Year ---------- */
  document.querySelectorAll(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
