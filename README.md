# CHANDRAPUR SCHOOL VISIT
### Chandrapur District — School Field Visit & Mapping Platform
### चंद्रपूर जिल्हा — शाळा प्रत्यक्ष पाहणी व मॅपिंग प्रणाली

---

## English Overview

**CHANDRAPUR SCHOOL VISIT** is a production-grade, self-contained web platform designed specifically for education officers, field observers, resource coordinators, and administrators in **Chandrapur District, Maharashtra, India (District Code: 2713)**.

The platform provides instant, zero-delay access to all **2,451 schools** across all **15 administrative blocks** with strict zero data loss. It features a two-stage browser GPS engine, proximity radius counters, an interactive multi-stop Route Planner, visit planning & field tracking logs, and direct Google Maps navigation links.

### Key Architectural Standards
1. **Zero Data Loss Ingestion:** All 2,451 source records preserved with all original columns and mapping IDs.
2. **Zero Loading Delay:** The entire verified dataset is embedded directly in memory (`window.CHANDRAPUR_SCHOOLS`), booting immediately without external API latency or loading spinners.
3. **Zero Internal Canvas Map:** Eliminates heavy Leaflet/OpenStreetMap rendering. All GPS coordinates are used for Haversine straight-line distance calculations and external Google Maps turn-by-turn navigation.
4. **No Login Required:** Directly accessible with zero barriers, authentication forms, or session management.
5. **Clean SaaS Styling:** Modern Government SaaS aesthetic with Navy, White, Light Grey, and warm Gold accents.

---

## हिंदी सारांश (Hindi Overview)

**चंद्रपूर स्कूल व्हिजिट (CHANDRAPUR SCHOOL VISIT)** हे **चंद्रपूर जिल्हा, महाराष्ट्र (जिल्हा कोड: 2713)** मधील शिक्षण अधिकारी, केंद्रप्रमुख, विस्तार अधिकारी व निरीक्षकांसाठी तयार केलेले एक आधुनिक व वेगवान डिजिटल प्लॅटफॉर्म आहे.

या प्लॅटफॉर्मवर चंद्रपूर जिल्ह्यातील सर्व **15 तालुक्यांमधील 2,451 शाळांची** संपूर्ण अधिकृत माहिती उपलब्ध आहे.

### प्रमुख वैशिष्ट्ये:
- **कोणताही डेटा गहाळ नाही (Zero Data Loss):** मूळ डेटासेटमधील सर्व 2,451 शाळांची नोंदणी व मूळ रकाने पूर्णपणे जतन करण्यात आले आहेत.
- **झिरो लोडिंग विलंब:** संपूर्ण डेटाबेस ॲप्लिकेशनमध्ये एम्बेड केलेला असल्यामुळे कोणतीही प्रतीक्षा न करता सिस्टीम त्वरित लोड होते.
- **अंतर्गत नकाशा नाही (No Internal Map):** जड नकाशा फ्रेमवर्क ऐवजी थेट अचूक हॅव्हरसाईन (Haversine) हवाई अंतर व थेट बाह्य Google Maps नेव्हिगेशन लिंक दिली आहे.
- **लॉगिनची गरज नाही:** कोणत्याही पासवर्ड किंवा लॉगिनशिवाय थेट सुरक्षित वापर.
- **दोन-टप्प्यांची GPS प्रणाली:** अचूक अंतरासाठी वेगवान मोबाईल जीपीएस व 15 तालुक्यांचे क्विक जंप बटन्स.

---

## 🏛️ Administrative Hierarchy (Chandrapur District)

- **State:** Maharashtra (27)
- **District:** Chandrapur (2713)
- **Total Blocks (15):**
  1. CHANDRAPUR (311 Schools)
  2. WARORA (226 Schools)
  3. CHIMUR (224 Schools)
  4. RAJURA (198 Schools)
  5. BHADRAWATI (175 Schools)
  6. KORPANA (175 Schools)
  7. BRAMHAPURI (160 Schools)
  8. JIWATI (159 Schools)
  9. NAGBHID (149 Schools)
  10. SINDEWAHI (131 Schools)
  11. MUL (128 Schools)
  12. SAOLI (118 Schools)
  13. GONDPIPRI / GONDPIPARI (118 Schools)
  14. BALLARPUR (104 Schools)
  15. POMBHURNA / POMBURNA (75 Schools)
- **Total Schools:** 2,451
- **Total Clusters:** 141

---

## 🚀 Installation & Local Execution

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build the Production Bundle
```bash
npm run build
```
The build script performs a complete integrity audit, validates all 2,451 records, checks asset sizes (< 25 MiB Cloudflare limit), and generates `./dist`.

### Step 3: Run the Local Server
```bash
npm start
```
Open [http://localhost:8000](http://localhost:8000) in your web browser.

---

## ⚡ One-Click Startup Scripts

### Linux / macOS
```bash
chmod +x run.sh
./run.sh
```

### Windows
Double-click `run.bat` or run:
```cmd
run.bat
```

---

## ☁️ Cloudflare Deployment

This project is pre-configured for **Cloudflare Pages** and **Cloudflare Workers Static Assets** (`wrangler.toml` and `wrangler.jsonc`).

### Deploy via Wrangler CLI
```bash
npm run deploy:pages
```
Or for Workers Static Assets:
```bash
npm run deploy
```

---

## 📍 GPS Proximity & Google Maps Navigation

1. **Browser Geolocation:**
   - **Stage 1:** Immediate, low-power location acquisition (`maximumAge: 300000`, `timeout: 3500ms`).
   - **Stage 2:** Background high-precision GPS refinement (`enableHighAccuracy: true`, `timeout: 8000ms`).
   - **HQ Fallback:** If GPS access is denied or unavailable, the platform defaults to Chandrapur District Collectorate HQ coordinates (`19.9615, 79.2961`).
2. **Proximity Radii:** Dynamic counts for schools within ≤ 5 KM, ≤ 10 KM, ≤ 25 KM, and ≤ 50 KM.
3. **Google Maps Turn-by-Turn Navigation:** Every school includes a direct Google Maps navigation button using official GPS coordinates (`https://www.google.com/maps/dir/?api=1&destination=LAT,LON`).
4. **Multi-Stop Route Planner:** Queue multiple schools, reorder your visit sequence, view leg-by-leg straight-line distances, and launch multi-waypoint road navigation directly in external Google Maps.

---

## 📋 Field Visit Tracking & Data Protection

- **Visit Plan:** Organize scheduled inspections.
- **Visit History:** Log inspection date, time, captured field GPS coordinates, observations/remarks, and upload site photos.
- **Zero Source Modification:** All visit data is maintained strictly in browser `localStorage`, ensuring the master school database remains 100% pristine.
- **Log Export:** Export completed inspection history to CSV anytime.

---

## 🛡️ Data Validation & Audit Metrics

| Validation Metric | Target | Actual Verified Result | Status |
| :--- | :--- | :--- | :--- |
| **District Blocks** | 15 Blocks | 15 Blocks (100%) | PASS |
| **Source File Records** | 2,451 | 2,451 | PASS |
| **JSON Database Records** | 2,451 | 2,451 | PASS |
| **Embedded JS Records** | 2,451 | 2,451 | PASS |
| **Website UI Records** | 2,451 | 2,451 | PASS |
| **Missing Records** | 0 | 0 | PASS |
| **Duplicate UDISE Codes** | 0 | 0 | PASS |
| **Missing Coordinates** | 0 | 0 | PASS |
| **Missing Contact Numbers** | 0 | 0 | PASS |
| **Records Flagged for Review** | 7 | 7 (Preserved with notes) | PASS |

---

## 📄 License
Government of Maharashtra — District Administration Chandrapur. For official field inspection and educational administration purposes.
