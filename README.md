# Price Your Loaf

Price Your Loaf is the production web calculator from **From Oven to Market**, a Crust & Crumb Academy course. It helps cottage bakers calculate true cost, floor price, and suggested retail price for a named loaf.

## Where It Lives

- Production: https://price-your-loaf-fotm.vercel.app
- Public source: https://github.com/henryhunterjr/price-your-loaf
- Primary local repository: `C:\Users\henry\Projects\price-your-loaf-web`
- Original iOS project and synchronized web copy: `C:\Users\henry\Projects\from-oven-to-market-ios\.worktrees\price-your-loaf-build`
- Synchronized web directory inside the iOS project: `prototype\`

The standalone `price-your-loaf-web` repository is the source of truth for the production web app.

## How It Was Built

The app is intentionally simple and durable:

- Static HTML and CSS in `index.html`
- Plain JavaScript pricing engine in `calculator.js`
- Automated calculation tests in `calculator.test.mjs`
- Browser-only persistence using `localStorage`
- Installable web-app metadata in `manifest.webmanifest`
- Offline caching in `service-worker.js`
- Static hosting on Vercel
- No database, account system, framework, API, or paid runtime dependency

The app works on phones and computers. A user must return with the same browser on the same device to access the locally saved loaf.

## Pricing Formula

```text
sellable loaves = max(1, batch size - expected unsold loaves)
ingredient cost per loaf = total ingredient cost / batch size
labor per loaf = hands-on hours * hourly rate / sellable loaves
market overhead per loaf = (booth fee + travel) / sellable loaves
true cost per loaf = ingredients + labor + overhead + packaging per loaf
floor price = true cost per loaf
suggested retail = true cost per loaf / 0.40
```

The suggested retail calculation represents a 60% gross margin.

## Saved Data

The active loaf name and costs are stored in the user's browser under:

```text
from-oven-to-market.price-your-loaf.v1
```

Nothing is sent to Henry, Vercel, GitHub, or a database. Clearing browser storage, changing browsers, or changing devices removes access to that saved copy.

## Test It

From the primary local repository:

```powershell
cd C:\Users\henry\Projects\price-your-loaf-web
bun test calculator.test.mjs
```

Expected result: all tests pass.

To preview locally:

```powershell
python -m http.server 4174 --bind 127.0.0.1
```

Then open http://127.0.0.1:4174.

## Publish An Update

1. Edit and test the primary local repository.
2. Commit and push to GitHub.
3. Copy changed production files into the synchronized `prototype\` directory if the iOS project also needs the update.
4. Deploy from the linked Vercel directory:

```powershell
cd C:\Users\henry\Projects\from-oven-to-market-ios\.worktrees\price-your-loaf-build\prototype
vercel --prod --yes
```

5. Point the public alias at the deployment URL printed by Vercel:

```powershell
vercel alias set DEPLOYMENT_URL price-your-loaf-fotm.vercel.app
```

6. Verify https://price-your-loaf-fotm.vercel.app in a private browser window.

The Vercel project is named `prototype` under Henry Hunter Jr.'s Vercel account. The friendly production alias is `price-your-loaf-fotm.vercel.app`.

## Important Update Note

When changing production files, increment the cache name at the top of `service-worker.js`. This makes existing phones replace older cached files promptly.

## Recovery

If the local folder is lost, restore it with:

```powershell
cd C:\Users\henry\Projects
git clone https://github.com/henryhunterjr/price-your-loaf.git price-your-loaf-web
cd price-your-loaf-web
bun test calculator.test.mjs
```

The app can then be deployed to any static host, including Vercel, GitHub Pages, Cloudflare Pages, or Netlify.

## Ownership

Copyright 2026 by Henry Hunter. From Oven to Market | Crust & Crumb Academy. All rights reserved.
