const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

let activeId = (SERIES.find((s) => s.featured) || SERIES[0]).id;
let activeFilter = "all";
let pickerFilter = "";

const seriesIframe = document.getElementById("series-iframe");
const seriesTitle = document.getElementById("series-title");
const seriesLink = document.getElementById("series-link");
const seriesBadge = document.getElementById("series-badge");

const HERO_WORDS = ["Tromsø", "Japan", "Portugal", "India", "Paris", "Okinawa", "Germany"];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSeries(id) {
  return SERIES.find((s) => s.id === id);
}

function playSeries(id, { scroll = true } = {}) {
  const item = getSeries(id);
  if (!item || !seriesIframe || !seriesTitle || !seriesLink) return;

  activeId = id;
  seriesTitle.textContent = item.title;
  seriesIframe.src = embedUrl(id);
  seriesIframe.title = `${item.title} playlist`;
  seriesLink.href = playlistUrl(id);
  seriesLink.textContent = `Open ${item.title} on YouTube →`;

  if (seriesBadge) {
    seriesBadge.textContent = REGION_LABELS[item.region] || item.region;
  }

  document.querySelectorAll(".series-btn, .explore-card, .dest-card, .japan-card").forEach((el) => {
    const match = el.dataset.id === id;
    el.classList.toggle("is-active", match);
    if (el.matches(".series-btn")) {
      if (match) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    }
    if (el.matches(".explore-card")) el.setAttribute("aria-pressed", String(match));
  });

  const playerCard = document.querySelector(".series-player-card");
  if (playerCard) {
    playerCard.classList.remove("is-pulsing");
    void playerCard.offsetWidth;
    playerCard.classList.add("is-pulsing");
  }

  showToast(`Now playing: ${item.title}`, item.flag);

  if (scroll) {
    const section = document.getElementById("series");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setActiveFilter(region) {
  activeFilter = region;
  document.querySelectorAll(".filter-chip").forEach((btn) => {
    const on = btn.dataset.filter === region;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-pressed", String(on));
  });
  document.querySelectorAll(".region-tile").forEach((tile) => {
    tile.classList.toggle("is-active", tile.dataset.region === region);
  });
  renderExploreGrid();
}

function showToast(message, icon = "▶") {
  const stack = document.getElementById("toast-stack");
  if (!stack) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  const iconEl = document.createElement("span");
  iconEl.className = "toast-icon";
  iconEl.textContent = icon;
  const messageEl = document.createElement("span");
  messageEl.textContent = message;
  toast.append(iconEl, messageEl);
  stack.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function matchesFilter(item) {
  if (activeFilter !== "all" && item.region !== activeFilter) return false;
  const q = (document.getElementById("series-search")?.value || "").trim().toLowerCase();
  if (!q) return true;
  return (
    item.title.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q) ||
    (REGION_LABELS[item.region] || "").toLowerCase().includes(q)
  );
}

function renderFilterBar() {
  const bar = document.getElementById("filter-bar");
  if (!bar) return;

  const counts = { all: SERIES.length };
  SERIES.forEach((s) => {
    counts[s.region] = (counts[s.region] || 0) + 1;
  });

  const filters = [
    { key: "all", label: "All" },
    { key: "europe", label: "Europe" },
    { key: "japan", label: "Japan" },
    { key: "asia", label: "Asia" },
    { key: "life", label: "Life abroad" },
  ];

  bar.innerHTML = filters
    .map(
      (f) => `
    <button type="button" class="filter-chip${activeFilter === f.key ? " is-active" : ""}"
      aria-pressed="${activeFilter === f.key}"
      data-filter="${escapeHtml(f.key)}">
      ${escapeHtml(f.label)}<span class="filter-count">${counts[f.key] || 0}</span>
    </button>`
    )
    .join("");

  bar.querySelectorAll(".filter-chip").forEach((btn) => {
    btn.addEventListener("click", () => setActiveFilter(btn.dataset.filter));
  });
}

function exploreCardHtml(item) {
  const badge = item.featured ? '<span class="series-pill">New</span>' : "";
  return `
    <button type="button" class="explore-card${item.featured ? " is-featured" : ""}${item.id === activeId ? " is-active" : ""}"
      data-id="${escapeHtml(item.id)}" aria-pressed="${item.id === activeId}">
      <span class="explore-card-flag">${escapeHtml(item.flag)}</span>
      <span class="explore-card-body">
        <strong>${escapeHtml(item.title)}${badge}</strong>
        <small>${escapeHtml(REGION_LABELS[item.region] || item.region)}</small>
        <p>${escapeHtml(item.desc)}</p>
      </span>
      <span class="explore-card-play" aria-hidden="true">▶</span>
    </button>`;
}

function renderExploreGrid() {
  const grid = document.getElementById("explore-grid");
  const meta = document.getElementById("results-meta");
  if (!grid) return;

  const visible = SERIES.filter(matchesFilter);
  grid.innerHTML = visible.map(exploreCardHtml).join("") || `<p class="empty-state">No series match your search.</p>`;

  if (meta) {
    meta.textContent = `${visible.length} series found`;
  }

  grid.querySelectorAll(".explore-card").forEach((card) => {
    card.addEventListener("click", () => playSeries(card.dataset.id));
  });
  initTiltCards(grid);
}

function getSeriesIndex(id) {
  return SERIES.findIndex((s) => s.id === id);
}

function playAdjacent(delta) {
  const idx = getSeriesIndex(activeId);
  if (idx < 0) return;
  const next = (idx + delta + SERIES.length) % SERIES.length;
  playSeries(SERIES[next].id);
}

function renderPicker() {
  const list = document.getElementById("series-picker");
  if (!list) return;

  const q = pickerFilter.toLowerCase();
  const items = SERIES.filter(
    (s) =>
      !q ||
      s.title.toLowerCase().includes(q) ||
      (REGION_LABELS[s.region] || "").toLowerCase().includes(q)
  );

  list.innerHTML = items
    .map(
      (s) => `
    <li>
      <button type="button" class="series-btn${s.id === activeId ? " is-active" : ""}"
        ${s.id === activeId ? 'aria-current="true"' : ""}
        data-id="${escapeHtml(s.id)}">
        <span class="series-flag">${escapeHtml(s.flag)}</span>
        <span class="series-btn-text">
          <strong>${escapeHtml(s.title)}${s.featured ? '<span class="series-pill series-pill-small">New</span>' : ""}</strong>
          <small>${escapeHtml(REGION_LABELS[s.region] || s.region)}</small>
        </span>
      </button>
    </li>`
    )
    .join("");

  list.querySelectorAll(".series-btn").forEach((btn) => {
    btn.addEventListener("click", () => playSeries(btn.dataset.id, { scroll: false }));
  });
}

function destCardHtml(item) {
  return `
    <button type="button" class="dest-card${item.featured ? " is-featured" : ""}${item.id === activeId ? " is-active" : ""}" data-id="${escapeHtml(item.id)}">
      <span class="dest-flag">${escapeHtml(item.flag)}</span>
      <h3>${escapeHtml(item.title)}${item.featured ? '<span class="series-pill">New</span>' : ""}</h3>
      <p>${escapeHtml(item.desc)}</p>
      <span class="dest-cta">Play series →</span>
    </button>`;
}

function renderDestGrid() {
  const grid = document.getElementById("dest-grid");
  if (!grid) return;
  const travel = SERIES.filter((s) => s.region !== "life");
  grid.innerHTML = travel.map(destCardHtml).join("");
  grid.querySelectorAll(".dest-card").forEach((card) => {
    card.addEventListener("click", () => playSeries(card.dataset.id));
  });
  initTiltCards(grid);
}

function japanCardHtml(item) {
  return `
    <button type="button" class="japan-card${item.id === activeId ? " is-active" : ""}" data-id="${escapeHtml(item.id)}">
      <span class="japan-card-glow" aria-hidden="true"></span>
      <span class="japan-card-flag">${escapeHtml(item.flag)}</span>
      <h3>${escapeHtml(item.title)}${item.featured ? '<span class="series-pill">New</span>' : ""}</h3>
      <p>${escapeHtml(item.desc)}</p>
      <span class="japan-card-cta">Watch now →</span>
    </button>`;
}

function renderJapanGrid() {
  const grid = document.getElementById("japan-grid");
  if (!grid) return;
  const japan = SERIES.filter((s) => s.region === "japan");
  grid.innerHTML = japan.map(japanCardHtml).join("");
  grid.querySelectorAll(".japan-card").forEach((card) => {
    card.addEventListener("click", () => playSeries(card.dataset.id));
  });
  initTiltCards(grid);
}

function renderHeroChips() {
  const wrap = document.getElementById("hero-chips");
  if (!wrap) return;
  const picks = [
    SERIES.find((s) => s.featured),
    SERIES.find((s) => s.region === "japan"),
    SERIES.find((s) => s.title === "Portugal Series"),
    SERIES.find((s) => s.title === "India 2025"),
    SERIES.find((s) => s.title === "Paris Series"),
    SERIES.find((s) => s.region === "life"),
  ].filter(Boolean);

  wrap.innerHTML = picks
    .map(
      (s) =>
        `<button type="button" class="hero-chip" data-id="${escapeHtml(s.id)}">${escapeHtml(s.flag)} ${escapeHtml(s.title)}</button>`
    )
    .join("");

  wrap.querySelectorAll(".hero-chip").forEach((chip) => {
    chip.addEventListener("click", () => playSeries(chip.dataset.id));
  });
}

function renderFooter() {
  const nav = document.getElementById("footer-series");
  if (!nav) return;
  nav.innerHTML = SERIES.map(
    (s) =>
      `<a href="${escapeHtml(playlistUrl(s.id))}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.title)}</a>`
  ).join("");
}

function renderSiteStats() {
  document.querySelectorAll("[data-series-count]").forEach((el) => {
    el.textContent = String(SERIES.length);
  });

  document.querySelectorAll("[data-series-count-target]").forEach((el) => {
    el.dataset.target = String(SERIES.length);
    el.textContent = "0";
  });
}

/* Hero rotator */
function initHeroRotator() {
  const el = document.getElementById("hero-rotator");
  if (!el) return;
  let i = 0;
  el.textContent = HERO_WORDS[0];
  setInterval(() => {
    i = (i + 1) % HERO_WORDS.length;
    el.classList.add("fade");
    setTimeout(() => {
      el.textContent = HERO_WORDS[i];
      el.classList.remove("fade");
    }, 280);
  }, 2800);
}

/* Hero parallax */
function initHeroParallax() {
  const hero = document.getElementById("hero");
  const bg = document.getElementById("hero-bg");
  if (!hero || !bg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    bg.style.transform = `translate(${x * 10}px, ${y * 6}px)`;
  });

  hero.addEventListener("mouseleave", () => {
    bg.style.transform = "";
  });
}

/* Count-up stats */
function initCountUp() {
  const els = document.querySelectorAll(".count-up");
  if (!els.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((el) => {
      el.textContent = el.dataset.target;
    });
    return;
  }

  const run = (el) => {
    const target = Number(el.dataset.target) || 0;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  els.forEach((el) => obs.observe(el));
}

/* Nav */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");

if (navToggle && navMenu) {
  const closeNav = () => {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    navMenu.classList.remove("open");
  };

  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    navToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    navMenu.classList.toggle("open", !open);
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  navMenu.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", closeNav);
  });
}

function initScrollNav() {
  const links = document.querySelectorAll("[data-nav]");
  const sections = [...links]
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${id}`));
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );
  sections.forEach((s) => obs.observe(s));
}

/* Random / shuffle */
function randomSeries(filterFn = () => true) {
  const pool = SERIES.filter(filterFn);
  return pool[Math.floor(Math.random() * pool.length)];
}

document.getElementById("hero-random")?.addEventListener("click", () => {
  const pick = randomSeries();
  if (pick) playSeries(pick.id);
});

document.getElementById("japan-shuffle")?.addEventListener("click", () => {
  const pick = randomSeries((s) => s.region === "japan");
  if (pick) playSeries(pick.id);
});

document.querySelector("[data-featured-play]")?.addEventListener("click", () => {
  const featured = SERIES.find((s) => s.featured) || SERIES[0];
  if (featured) playSeries(featured.id);
});

document.getElementById("series-search")?.addEventListener("input", renderExploreGrid);

document.getElementById("picker-search")?.addEventListener("input", (e) => {
  pickerFilter = e.target.value;
  renderPicker();
});

document.querySelector("[data-play-life]")?.addEventListener("click", () => {
  const life = SERIES.find((s) => s.region === "life");
  if (life) playSeries(life.id);
});

/* Reveal */
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

function initMarquee() {
  const track = document.getElementById("marquee-track");
  if (!track) return;
  const items = SERIES.map((s) => `<span>${escapeHtml(s.flag)} ${escapeHtml(s.title)}</span>`).join("");
  track.innerHTML = items + items;
}

function initRegionBento() {
  const bento = document.getElementById("region-bento");
  if (!bento) return;

  const counts = { all: SERIES.length };
  SERIES.forEach((s) => {
    counts[s.region] = (counts[s.region] || 0) + 1;
  });
  bento.querySelectorAll("[data-region-count]").forEach((el) => {
    const key = el.dataset.regionCount;
    el.textContent = String(counts[key] || 0);
  });

  bento.querySelectorAll(".region-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      setActiveFilter(tile.dataset.region);
      document.getElementById("explore")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initTiltCards(root = document) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  root.querySelectorAll(".explore-card, .dest-card, .japan-card").forEach((card) => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = "1";
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function initSubscribe() {
  const modal = document.getElementById("subscribe-modal");
  if (!modal) return;

  document.querySelectorAll("[data-subscribe-link]").forEach((a) => {
    a.href = YOUTUBE.subscribe;
  });
  document.querySelectorAll("[data-channel-link]").forEach((a) => {
    a.href = YOUTUBE.channel;
  });

  const open = () => {
    if (modal.open) {
      document.body.classList.add("modal-open");
      return;
    }
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    document.body.classList.add("modal-open");
  };

  const close = () => {
    modal.close?.();
    modal.removeAttribute("open");
    document.body.classList.remove("modal-open");
  };

  document.querySelectorAll("[data-subscribe-open]").forEach((btn) => {
    btn.addEventListener("click", open);
  });

  document.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", close);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.open) close();
    if (e.key === "s" && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== "INPUT") {
      e.preventDefault();
      open();
    }
  });
}

function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener(
    "scroll",
    () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${p})`;
    },
    { passive: true }
  );
}

function initSubscribeDock() {
  const dock = document.getElementById("subscribe-dock");
  const subSection = document.getElementById("subscribe");
  if (!dock) return;

  const obs = subSection
    ? new IntersectionObserver(
        ([entry]) => {
          dock.classList.toggle("is-hidden", entry.isIntersecting);
        },
        { threshold: 0.25 }
      )
    : null;
  if (subSection && obs) obs.observe(subSection);
}

document.getElementById("player-prev")?.addEventListener("click", () => playAdjacent(-1));
document.getElementById("player-next")?.addEventListener("click", () => playAdjacent(1));

/* Init */
document.querySelectorAll("[data-subscribe-link]").forEach((a) => {
  a.href = YOUTUBE.subscribe;
});

renderFilterBar();
renderExploreGrid();
renderPicker();
renderDestGrid();
renderJapanGrid();
renderHeroChips();
renderFooter();
renderSiteStats();
initMarquee();
initRegionBento();
initSubscribe();
initScrollProgress();
initSubscribeDock();
initHeroRotator();
initHeroParallax();
initCountUp();
initScrollNav();
initTiltCards(document);
playSeries(activeId, { scroll: false });
