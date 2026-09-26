# CHANDRAPUR SCHOOL VISIT — DEPLOYMENT GUIDE

This guide provides end-to-end instructions for deploying the **CHANDRAPUR SCHOOL VISIT** platform on **Local Servers**, **Cloudflare Pages**, and **Cloudflare Workers**.

---

## 1. Local Deployment & Verification

### Step-by-step
```bash
# 1. Open the project root directory
cd CHANDRAPUR_SCHOOL_VISIT

# 2. Install dependencies (serve & wrangler)
npm install

# 3. Execute the automated build script
npm run build

# 4. Launch the local production server
npm start
```
The application will be live at `http://localhost:8000`.

---

## 2. Cloudflare Pages Deployment (Recommended)

Cloudflare Pages provides global CDN distribution, edge caching, and automated HTTPS.

### Method A: Direct Wrangler CLI Deployment
```bash
# 1. Build the production dist directory
npm run build

# 2. Deploy directly to Cloudflare Pages
npm run deploy:pages
```
When prompted, confirm your project name: `chandrapur-school-visit`.

### Method B: Cloudflare Dashboard Git Integration
1. Push this repository to GitHub or GitLab.
2. In the Cloudflare Dashboard, navigate to **Compute (Workers) > Workers & Pages > Create > Pages > Connect to Git**.
3. Select the repository and configure build settings:
   - **Framework preset:** `None`
   - **Build command:** `node build.js`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**.

---

## 3. Cloudflare Workers Static Assets Deployment

The project includes `wrangler.toml` and `wrangler.jsonc` configured with native Single Page Application (SPA) asset routing:

```toml
name = "chandrapur-school-visit"
compatibility_date = "2024-09-23"

[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

### To deploy via Workers:
```bash
npm run deploy
```

---

## 4. Key Architectural Checks

- **Assets directory:** `./dist` (Never root `.`)
- **No Worker Scripts:** No `src/worker.js`, no `_worker.js` in dist.
- **SPA Routing:** Managed natively via `not_found_handling = "single-page-application"`.
- **Security Headers:** Custom security headers generated in `dist/_headers`.
- **Asset Size:** Every single asset in `./dist` is audited to ensure it is under Cloudflare's 25 MiB limit.
- **No External Dependency:** Embedded zero-loading-delay architecture ensures immediate render even on offline or slow 2G/3G mobile networks.
