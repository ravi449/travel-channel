# Shravi Life in Abroad

A simple website for the [Shravi Life in Abroad](https://www.youtube.com/@shravilifeinabroad) YouTube channel — travel, life abroad, and entertainment.

## Open locally

From this folder, start a local server (any one of these):

```bash
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

Or open `index.html` directly in your browser.

## Customize

- **Playlists**: edit `series-data.js` (add titles, playlist IDs, regions).
- **Colors & fonts**: change CSS variables at the top of `styles.css`.
- **Interactivity**: filter/search logic lives in `script.js`.

## Deploy

Live site example: `https://shravilifeinabroad.netlify.app`

Upload the folder to any static host (Netlify, Cloudflare Pages, etc.). No build step required.

## Comments & visit tracking

Edit `site-config.js`, then redeploy. Full steps: **SETUP.md**
