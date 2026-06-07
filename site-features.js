function initAnalytics() {
  if (SITE.gaMeasurementId) {
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${SITE.gaMeasurementId}`;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", SITE.gaMeasurementId);
  }

  if (SITE.goatCounterCode) {
    const gc = document.createElement("script");
    gc.async = true;
    gc.dataset.goatcounter = `https://${SITE.goatCounterCode}.goatcounter.com/count`;
    gc.src = "https://gc.zgo.at/count.js";
    document.head.appendChild(gc);
  }
}

function getDisqusShortname() {
  const raw = (SITE.disqusShortname || "").trim();
  if (!raw) return "";
  const normalized = raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (normalized.endsWith(".disqus.com")) return normalized.replace(/\.disqus\.com$/, "");
  if (normalized.includes("disqus.com")) return "";
  return normalized;
}

function showCommentsFallback(root, fallback) {
  if (fallback) fallback.hidden = false;
  root.innerHTML = "";
}

function initComments() {
  const root = document.getElementById("comments-root");
  const fallback = document.getElementById("comments-fallback");
  if (!root) return;

  const shortname = getDisqusShortname();
  if (!shortname) {
    showCommentsFallback(root, fallback);
    return;
  }

  if (fallback) fallback.hidden = true;

  root.innerHTML = '<div id="disqus_thread"></div>';

  window.disqus_config = function disqusConfig() {
    this.page.url = SITE.siteUrl + (window.location.pathname || "/");
    this.page.identifier = "shravi-home";
    this.page.title = document.title || "Shravi Life in Abroad";
  };

  const embed = document.createElement("script");
  embed.src = `https://${shortname}.disqus.com/embed.js`;
  embed.setAttribute("data-timestamp", String(+new Date()));
  embed.async = true;
  embed.onerror = () => showCommentsFallback(root, fallback);
  document.body.appendChild(embed);
}

function initAnalyticsNote() {
  const el = document.getElementById("analytics-status");
  if (!el) return;

  const parts = [];
  if (SITE.gaMeasurementId) parts.push("Google Analytics");
  if (SITE.goatCounterCode) parts.push("GoatCounter");

  if (parts.length) {
    el.hidden = false;
    el.innerHTML = `Visit tracking is on (<strong>${parts.join(" & ")}</strong>). Check your analytics dashboard for visitor counts.`;
    el.classList.add("is-active");
  } else {
    el.hidden = true;
  }
}

initAnalytics();
initComments();
initAnalyticsNote();
