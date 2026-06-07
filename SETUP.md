# Comments & visit tracking (free)

Your site is static on Netlify. Comments and visit counts use **free third-party tools** — you only paste IDs into `site-config.js`, then upload the folder to Netlify again.

---

## 1. Viewer comments (Disqus — free)

1. Go to [https://disqus.com/admin/create/](https://disqus.com/admin/create/) and sign up.
2. **Website name:** Shravi Life in Abroad  
3. **Website URL:** `https://shravilifeinabroad.netlify.app`  
4. Choose a **shortname** (e.g. `shravilifeinabroad`) — remember this.
5. Open `site-config.js` in this folder and set:

```javascript
disqusShortname: "shravilifeinabroad",
```

6. Redeploy to Netlify (drag the `travel-channel` folder onto [Netlify Drop](https://app.netlify.com/drop) again, or use your existing site’s deploy method).

Comments appear in the **Viewer comments** section. You moderate them in [Disqus admin](https://disqus.com/admin/).

### Your shortname (already in site-config.js)

```javascript
disqusShortname: "https-shravilifeinabroad-netlify-app",
```

Use only the shortname from Disqus → **Settings** → **General** — not a full URL.

### Comments / messages not showing?

1. **Redeploy the whole folder** to Netlify (all files, not only `site-config.js`).
2. Disqus → **Settings** → **Advanced** → allow `shravilifeinabroad.netlify.app`.
3. Turn off **ad blocker** when testing (Disqus is often blocked).
4. Scroll to **Viewer comments** near the bottom of the page.
5. Wait a few minutes if the Disqus site was just created.

---

## 2. How many visits (Google Analytics — free)

1. Go to [https://analytics.google.com](https://analytics.google.com) and sign in with Google.
2. **Admin** (gear) → **Create account** → name it (e.g. Shravi Site).
3. **Create property** → website URL: `https://shravilifeinabroad.netlify.app`
4. **Admin** → **Data streams** → your web stream → copy **Measurement ID** (looks like `G-ABC123XYZ`).
5. In `site-config.js`:

```javascript
gaMeasurementId: "G-ABC123XYZ",
```

6. Redeploy to Netlify.

**View visits:** [analytics.google.com](https://analytics.google.com) → Reports → Realtime / Acquisition. Data can take 24–48 hours to fully populate.

---

## 3. Simpler visit counter (GoatCounter — optional, free)

Good if you want a lighter alternative or backup to Google Analytics.

1. Sign up at [https://www.goatcounter.com](https://www.goatcounter.com)
2. Add a site with code e.g. `shravilifeinabroad`
3. In `site-config.js`:

```javascript
goatCounterCode: "shravilifeinabroad",
```

4. Redeploy.

**View visits:** dashboard at `https://shravilifeinabroad.goatcounter.com` (or your chosen code).

---

## 4. Redeploy after any change

Every time you edit `site-config.js` (or any file):

1. Open [https://app.netlify.com](https://app.netlify.com) → your site **shravilifeinabroad**
2. **Deploys** → drag the whole `travel-channel` folder, **or** connect GitHub later for automatic deploys.

---

## Quick reference (`site-config.js`)

```javascript
const SITE = {
  siteUrl: "https://shravilifeinabroad.netlify.app",
  disqusShortname: "your-disqus-shortname",
  gaMeasurementId: "G-XXXXXXXXXX",
  goatCounterCode: "your-goatcounter-code",
};
```

Leave any field as `""` if you do not use that service yet.
