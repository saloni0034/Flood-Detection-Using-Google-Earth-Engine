
# 🌍 Google Earth Engine Outputs

The following images illustrate the step-by-step flood detection process performed in Google Earth Engine using Sentinel-1 SAR imagery.

---

## 1. Difference Image (Before vs After Flood)

This image represents the difference in radar backscatter intensity between the **pre-flood** and **post-flood** Sentinel-1 SAR images.

The difference image helps identify areas where the radar signal changed significantly after the rainfall event. Such changes often indicate the presence of standing water, as water surfaces reflect radar signals differently than dry land.

<p align="center">
  <img src="Screenshot 2026-08-13 174526" src="https://github.com/user-attachments/assets/c88ab115-506b-452c-b7a5-7ce33d3ad1ab" width="900">
</p>

---

## 2. Flood Mask (Thresholded Difference)

The second image shows the thresholded difference after applying a flood detection threshold and masking out permanent water bodies using the **JRC Global Surface Water** dataset.

This processing step removes rivers, lakes, and reservoirs that are normally present, leaving only the areas that are likely to have been newly flooded during the event.

<p align="center">
  <img src="Screenshot 2026-08-13 174535" src="https://github.com/user-attachments/assets/7005f181-f2c4-4d6a-8e12-926bc23250b6" width="900">
</p>

---

## 3. Final Flooded Areas (Vector Polygons)

The final output displays the detected flooded regions as **blue vector polygons**.

The flood pixels are converted into vector polygons using the `reduceToVectors()` function, making the results suitable for GIS analysis and spatial queries. These polygons are then exported to **Google BigQuery**, where they are intersected with OpenStreetMap road data to identify road segments affected by flooding.

This is the final output of the flood detection workflow in Google Earth Engine.

<p align="center">
  <img src="Screenshot 2026-08-13 174544" src="https://github.com/user-attachments/assets/f52c337f-cf47-404f-a122-c6a69f41bd1f" width="900">
</p>
