

# 🌍 Flood Detection using Google Earth Engine, BigQuery & Looker Studio

> Detecting flooded areas from Sentinel-1 SAR satellite imagery and performing spatial analysis using Google Earth Engine, BigQuery GIS, and Looker Studio.

![Google Earth Engine](https://img.shields.io/badge/Google-Earth%20Engine-green)
![BigQuery](https://img.shields.io/badge/Google-BigQuery-blue)
![Looker Studio](https://img.shields.io/badge/Looker-Studio-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

---

# 📖 Overview

Floods are among the most destructive natural disasters and require rapid assessment to support emergency response and infrastructure planning.

This project demonstrates an end-to-end geospatial analytics workflow using Google Cloud technologies to detect flood-affected regions from Sentinel-1 Synthetic Aperture Radar (SAR) satellite imagery.

The workflow consists of:

- Detecting flooded regions in Google Earth Engine
- Converting raster flood pixels into vector polygons
- Exporting the results into Google BigQuery
- Running spatial SQL queries to identify flooded road segments
- Visualizing the final results in Looker Studio

This project was completed as part of the **Google Cloud Skills Boost (Qwiklabs)** hands-on lab.

---

# 🎯 Project Objective

The main objective of this project is to identify road segments that were affected by flooding after a heavy rainfall event.

Instead of manually analyzing satellite imagery, this workflow automates the entire process using cloud-based geospatial tools.

The final output answers the question:

> **"Which roads intersect the flooded areas?"**

---

# 🛰 Dataset Used

## Sentinel-1 SAR Dataset

Source:

```
COPERNICUS/S1_GRD
```

Sentinel-1 is a radar satellite operated by the European Space Agency (ESA).

Unlike optical satellites, SAR can:

- capture images during the day or night
- penetrate clouds
- detect standing water very effectively

This makes it ideal for flood mapping.

---

## Global Surface Water Dataset

```
JRC/GSW1_0
```

Used for removing permanent water bodies like:

- rivers
- lakes
- reservoirs

Only temporary floodwater remains.

---

## OpenStreetMap (OSM)

Used inside BigQuery.

Dataset:

```
bigquery-public-data.geo_openstreetmap.planet_ways
```

Contains global road geometries.

---

# 📍 Study Area

Area of Interest (AOI)

Lancaster, England

Coordinates

```
Latitude : 53.99° to 54.10°

Longitude: -2.92° to -2.67°
```

---

# 🏗 Project Workflow

```
Sentinel-1 SAR Images
          │
          ▼
Google Earth Engine
          │
          ▼
Flood Detection
          │
          ▼
Vector Polygon Generation
          │
          ▼
Export to BigQuery
          │
          ▼
Spatial SQL Analysis
          │
          ▼
Flooded Roads
          │
          ▼
Looker Studio Dashboard
```

---

# ⚙ Step 1 — Load Satellite Images

The Sentinel-1 image collection is loaded from Google Earth Engine.

```javascript
var collection = ee.ImageCollection('COPERNICUS/S1_GRD');
```

Only:

- VV Polarization
- Images inside AOI

are selected.

---

# ⚙ Step 2 — Create Before & After Images

Two mosaics are created.

### Before Flood

```
2017-11-01
↓

2017-11-17
```

### After Flood

```
2017-11-18
↓

2017-11-23
```

These represent the land before and after the rainfall event.

---

# ⚙ Step 3 — Remove Radar Noise

Radar imagery naturally contains speckle noise.

Median filtering is applied:

```javascript
focalMedian(100)
```

Radius:

```
100 meters
```

This produces smoother images and improves flood detection accuracy.

---

# ⚙ Step 4 — Detect Flooded Pixels

The difference between the two images is calculated.

```
Difference = After − Before
```

Pixels with a radar intensity decrease greater than:

```
-3 dB
```

are classified as flooded.

```javascript
after.subtract(before)
```

---

# ⚙ Step 5 — Remove Permanent Water

Existing rivers and lakes are removed using the Global Surface Water dataset.

This ensures only newly flooded regions remain.

---

# ⚙ Step 6 — Convert Raster to Vector

Flooded pixels are converted into polygons using:

```javascript
reduceToVectors()
```

Raster

⬇

Vector Polygons

This makes the data suitable for GIS analysis.

---

# ⚙ Step 7 — Remove Large False Detections

Very large polygons (>500,000 m²) are removed.

```javascript
MAX_AREA = 500000
```

This filters out noisy detections.

---

# ⚙ Step 8 — Export to BigQuery

The flood polygons are exported directly into BigQuery.

```javascript
Export.table.toBigQuery(...)
```

Created table:

```
ee_to_bq.flooded_areas
```

The exported table contains

| Column | Description |
|---------|-------------|
| geo | Polygon Geometry |
| area | Area of polygon |
| count | Number of pixels |
| label | Flood label |
| system:index | Earth Engine ID |

---

# ⚙ Step 9 — Spatial SQL Query

BigQuery GIS is then used.

The exported flood polygons are combined with the OpenStreetMap roads dataset.

Spatial functions such as

```
ST_INTERSECTS()
```

identify roads that overlap flood polygons.

Result:

```
Flooded Road Segments
```

---

# ⚙ Step 10 — Visualization

The SQL output is opened in

```
Looker Studio
```

A Google Maps Line Map is created.

The flooded roads are displayed over a street map.

This allows users to visually inspect:

- affected roads
- flood locations
- road network impact

---

# 📊 Final Outputs

The project produces three major outputs.

### 1️⃣ Flood Detection Map

Blue polygons represent flooded regions detected from Sentinel-1 SAR imagery.

---

### 2️⃣ BigQuery Spatial Dataset

A GIS-enabled table containing flood polygons.

---

### 3️⃣ Looker Studio Dashboard

Interactive visualization showing flooded road segments.

---

# 💻 Technologies Used

| Technology | Purpose |
|------------|---------|
| Google Earth Engine | Satellite image processing |
| JavaScript | Earth Engine scripting |
| Sentinel-1 SAR | Flood detection |
| Google BigQuery GIS | Spatial SQL analysis |
| OpenStreetMap | Road network |
| Looker Studio | Visualization |

---

# 📂 Repository Structure

```
Flood-Detection-GEE/
│
├── code.js
├── README.md
│
└── screenshots/
    ├── earth-engine-output.png
    ├── bigquery-output.png
    ├── sql-query.png
    └── looker-dashboard.png
```

---

# 🚀 Key Concepts Learned

- Google Earth Engine
- Sentinel-1 SAR Processing
- Image Filtering
- Raster Difference Analysis
- Flood Detection
- Raster to Vector Conversion
- BigQuery GIS
- Spatial SQL Queries
- ST_INTERSECTS()
- OpenStreetMap Integration
- Cloud-based Geospatial Analytics
- Looker Studio Visualization

---

# 📈 Results

The workflow successfully:

✅ Detected flooded regions from satellite imagery

✅ Converted raster flood pixels into GIS polygons

✅ Exported vector data into BigQuery

✅ Identified flooded road segments using spatial SQL

✅ Visualized the affected roads on an interactive map

The project demonstrates how Google Cloud can process large-scale geospatial datasets for disaster management and infrastructure analysis.

---

# 📚 References

- Google Earth Engine
- Google BigQuery GIS
- Sentinel-1 SAR Dataset
- Joint Research Centre Global Surface Water Dataset
- OpenStreetMap
- Google Cloud Skills Boost (Qwiklabs)

---

# 👨‍💻 Author

**Saloni Patel**

Project completed using:

- Google Earth Engine
- Google Cloud Platform
- BigQuery GIS
- Looker Studio

as part of a hands-on geospatial analytics workflow for flood detection and spatial analysis.
