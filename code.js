// =============================================
// Flood Detection using Google Earth Engine
// Export Flooded Areas to BigQuery
// =============================================

// Define the Area of Interest (AOI) around Lancaster, England.
var aoi = ee.Geometry.Polygon(
  [[
    [-2.92, 54.10],
    [-2.92, 53.99],
    [-2.67, 53.99],
    [-2.67, 54.10]
  ]],
  null,
  false
);

// Load Sentinel-1 SAR Image Collection (VV polarization)
var collection = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(aoi)
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .select('VV');

// Center the map on the AOI
Map.centerObject(aoi, 13);

// ---------------------------------------------
// Image Preprocessing
// ---------------------------------------------

// Radius used for median smoothing (meters)
var SMOOTHING_RADIUS_METERS = 100;

// Before-flood image
var before = collection
  .filterDate('2017-11-01', '2017-11-17')
  .mosaic()
  .focalMedian(SMOOTHING_RADIUS_METERS, 'circle', 'meters');

// After-flood image
var after = collection
  .filterDate('2017-11-18', '2017-11-23')
  .mosaic()
  .focalMedian(SMOOTHING_RADIUS_METERS, 'circle', 'meters');

// ---------------------------------------------
// Flood Detection
// ---------------------------------------------

// Calculate radar backscatter difference
var diffSmoothed = after.subtract(before);

// Flood threshold (dB)
var DIFF_THRESHOLD_DB = -3;

// Identify flooded pixels
var diffThresholded = diffSmoothed.lt(DIFF_THRESHOLD_DB);

// Display radar difference
Map.addLayer(diffSmoothed, {min: -10, max: 10}, 'Difference');

// ---------------------------------------------
// Remove Permanent Water Bodies
// ---------------------------------------------

var jrcData0 = ee.Image('JRC/GSW1_0/Metadata')
  .select('total_obs')
  .lte(0);

var waterMask = ee.Image('JRC/GSW1_0/GlobalSurfaceWater')
  .select('occurrence')
  .unmask(0)
  .max(jrcData0)
  .lt(50); // Keep pixels with water occurrence < 50%

// Apply water mask
var floodedPixels = diffThresholded.updateMask(waterMask);

// Display filtered flood pixels
Map.addLayer(floodedPixels, {min: -10, max: 10}, 'Flood Pixels');

// ---------------------------------------------
// Convert Flood Pixels to Vector Polygons
// ---------------------------------------------

var vectors = floodedPixels.reduceToVectors({
  geometry: aoi,
  scale: 10,
  geometryType: 'polygon',
  eightConnected: false
});

// ---------------------------------------------
// Remove Large False Positives
// ---------------------------------------------

var MAX_AREA = 500 * 1000; // 500,000 m²

vectors = vectors
  .map(function(feature) {
    return feature.set('area', feature.geometry().area(10));
  })
  .filter(ee.Filter.lt('area', MAX_AREA));

// Display final flood polygons
Map.addLayer(vectors, {color: 'blue'}, 'Flooded Areas');

// ---------------------------------------------
// Export to BigQuery
// ---------------------------------------------

Export.table.toBigQuery({
  collection: vectors,
  description: 'ee2bq_export_polygons',
  table: 'qwiklabs-gcp-04-fcd0399b3feb.ee_to_bq.flooded_areas'
});
