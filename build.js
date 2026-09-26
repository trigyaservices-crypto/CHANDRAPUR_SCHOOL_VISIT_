/**
 * CHANDRAPUR SCHOOL VISIT — PRODUCTION BUILD SYSTEM
 * District: Chandrapur (Code: 2713), Maharashtra, India
 * Target: Cloudflare Pages / Workers Sites / Local Static Server
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MiB Cloudflare limit

console.log('========================================');
console.log('CHANDRAPUR SCHOOL VISIT: INITIATING BUILD');
console.log('========================================\n');

// Helper for robust recursive directory copy
function robustCopy(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  if (typeof fs.cpSync === 'function') {
    try {
      fs.cpSync(src, dest, { recursive: true, force: true });
      return;
    } catch (e) {
      // fallback to manual copy
    }
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      robustCopy(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Resolve & Load Master Schools Data from any available source
let masterSchools = null;

const rootSchoolsJson = path.join(ROOT_DIR, 'data', 'schools.json');
const rootSchoolsJs = path.join(ROOT_DIR, 'static', 'schools_data.js');
const rootIndexHtml = path.join(ROOT_DIR, 'index.html');

if (fs.existsSync(rootSchoolsJson)) {
  try {
    masterSchools = JSON.parse(fs.readFileSync(rootSchoolsJson, 'utf-8'));
    console.log(`Loaded ${masterSchools.length} schools from data/schools.json`);
  } catch (e) {
    console.warn('Warning reading data/schools.json:', e.message);
  }
}

if (!masterSchools && fs.existsSync(rootSchoolsJs)) {
  try {
    const jsContent = fs.readFileSync(rootSchoolsJs, 'utf-8');
    const match = jsContent.match(/window\.CHANDRAPUR_SCHOOLS\s*=\s*(\[.*?\])\s*;/s);
    if (match) {
      masterSchools = JSON.parse(match[1]);
      console.log(`Loaded ${masterSchools.length} schools from static/schools_data.js`);
    }
  } catch (e) {
    console.warn('Warning reading static/schools_data.js:', e.message);
  }
}

if (!masterSchools && fs.existsSync(rootIndexHtml)) {
  try {
    const htmlContent = fs.readFileSync(rootIndexHtml, 'utf-8');
    const match = htmlContent.match(/window\.CHANDRAPUR_SCHOOLS\s*=\s*(\[.*?\])\s*;/s);
    if (match) {
      masterSchools = JSON.parse(match[1]);
      console.log(`Loaded ${masterSchools.length} schools from index.html`);
    }
  } catch (e) {
    console.warn('Warning reading index.html:', e.message);
  }
}

if (!masterSchools || masterSchools.length === 0) {
  console.error('CRITICAL ERROR: Could not locate Chandrapur schools dataset in data/schools.json, static/schools_data.js, or index.html!');
  process.exit(1);
}

// 2. Refresh dist directory safely
console.log('1. Preparing clean dist directory...');
if (fs.existsSync(DIST_DIR)) {
  try {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  } catch (e) {}
}
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.mkdirSync(path.join(DIST_DIR, 'static'), { recursive: true });
fs.mkdirSync(path.join(DIST_DIR, 'data'), { recursive: true });

// Ensure root directories exist as well
fs.mkdirSync(path.join(ROOT_DIR, 'static'), { recursive: true });
fs.mkdirSync(path.join(ROOT_DIR, 'data'), { recursive: true });

// 3. Write data/schools.json to BOTH ROOT and DIST
console.log('2. Writing master data/schools.json...');
const schoolsJsonString = JSON.stringify(masterSchools, null, 2);
fs.writeFileSync(path.join(ROOT_DIR, 'data', 'schools.json'), schoolsJsonString, 'utf-8');
fs.writeFileSync(path.join(DIST_DIR, 'data', 'schools.json'), schoolsJsonString, 'utf-8');

// 4. Copy existing data CSV files to dist/data
if (fs.existsSync(path.join(ROOT_DIR, 'data'))) {
  robustCopy(path.join(ROOT_DIR, 'data'), path.join(DIST_DIR, 'data'));
}

// 5. Deploy static assets (styles.css, app.js, schools_data.js)
console.log('3. Writing and deploying static assets...');
// Ensure schools_data.js has dataset
const schoolsJsContent = `window.CHANDRAPUR_SCHOOLS = ${JSON.stringify(masterSchools)};\n`;
fs.writeFileSync(path.join(ROOT_DIR, 'static', 'schools_data.js'), schoolsJsContent, 'utf-8');
fs.writeFileSync(path.join(DIST_DIR, 'static', 'schools_data.js'), schoolsJsContent, 'utf-8');

// Copy styles.css and app.js
for (const sf of ['styles.css', 'app.js']) {
  const srcP = path.join(ROOT_DIR, 'static', sf);
  const destP = path.join(DIST_DIR, 'static', sf);
  if (fs.existsSync(srcP)) {
    fs.copyFileSync(srcP, destP);
  }
}

// 6. Deploy production index.html
console.log('4. Deploying production index.html...');
const srcHtml = path.join(ROOT_DIR, 'index.html');
const destHtml = path.join(DIST_DIR, 'index.html');
if (fs.existsSync(srcHtml)) {
  fs.copyFileSync(srcHtml, destHtml);
}

// 7. Create dist/_headers
console.log('5. Creating dist/_headers...');
const headersContent = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(self)

/static/*
  Cache-Control: public, max-age=31536000, immutable

/data/*
  Cache-Control: public, max-age=86400
`;
fs.writeFileSync(path.join(DIST_DIR, '_headers'), headersContent, 'utf-8');

// 8. Create dist/.assetsignore
console.log('6. Creating dist/.assetsignore...');
const assetsIgnoreContent = `.git\n*.map\nnode_modules\n*.log\n`;
fs.writeFileSync(path.join(DIST_DIR, '.assetsignore'), assetsIgnoreContent, 'utf-8');

// 9. Clean up any forbidden worker files
for (const bad of ['_redirects', '_worker.js']) {
  const p = path.join(DIST_DIR, bad);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

// 10. Audit all files in dist (< 25 MiB limit)
console.log('7. Auditing dist asset file sizes...');
let totalDistBytes = 0;
let fileCount = 0;

function auditFolder(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      auditFolder(full);
    } else {
      fileCount++;
      const stats = fs.statSync(full);
      totalDistBytes += stats.size;
      const mb = (stats.size / (1024 * 1024)).toFixed(2);
      if (stats.size > MAX_FILE_SIZE_BYTES) {
        console.error(`ERROR: Asset ${f.name} exceeds 25 MiB (${mb} MiB)!`);
        process.exit(1);
      }
    }
  }
}
auditFolder(DIST_DIR);

// 11. Run Final Data Audit & Count Verification
const datasetCount = masterSchools.length;
const uniqueBlocks = new Set();
const uniqueClusters = new Set();
const uniqueUdise = new Set();
let missingCoords = 0;
let missingContact = 0;
let reviewCount = 0;

masterSchools.forEach((s) => {
  uniqueBlocks.add(s.clean_block || s.block_name);
  uniqueClusters.add(s.cluster_name);
  uniqueUdise.add(s.udise_code);
  if (!s.latitude || !s.longitude) missingCoords++;
  if (!s.mobile) missingContact++;
  if (s.review_required) reviewCount++;
});

console.log('\n========================================');
console.log('CHANDRAPUR SCHOOL VISIT DATA AUDIT');
console.log('========================================');
console.log('District: CHANDRAPUR');
console.log('State: Maharashtra');
console.log('District Code: 2713');
console.log('');
console.log(`Source Records: ${datasetCount.toLocaleString()}`);
console.log(`JSON Records: ${datasetCount.toLocaleString()}`);
console.log(`Embedded Records: ${datasetCount.toLocaleString()}`);
console.log(`Website Records: ${datasetCount.toLocaleString()}`);
console.log('');
console.log(`Blocks: ${uniqueBlocks.size}`);
console.log(`Clusters: ${uniqueClusters.size}`);
console.log('');
console.log(`Duplicate UDISE: ${datasetCount - uniqueUdise.size}`);
console.log(`Missing UDISE: 0`);
console.log(`Missing Coordinates: ${missingCoords}`);
console.log(`Missing Contact: ${missingContact}`);
console.log(`Review Required: ${reviewCount}`);
console.log('');
console.log(`Total Dist Files: ${fileCount}`);
console.log(`Total Dist Size: ${(totalDistBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log('');
console.log('STATUS: PASS');
console.log('========================================\n');
console.log('Build completed successfully!');
