
# 🌍 Google Earth Engine Outputs

The following images illustrate the step-by-step flood detection process performed in Google Earth Engine using Sentinel-1 SAR imagery.

---

## 1. Difference Image (Before vs After Flood)


This image represents the difference in radar backscatter intensity between the **pre-flood** and **post-flood** Sentinel-1 SAR images.

The difference image helps identify areas where the radar signal changed significantly after the rainfall event. Such changes often indicate the presence of standing water, as water surfaces reflect radar signals differently than dry land.

<p align="center">
  <img width="1920" height="1080" alt="Screenshot 2026-08-13 174526" src="https://github.com/user-attachments/assets/25f27fb0-146e-4f81-8ee1-a6297abfc27d" />
</p>

---

## 2. Flood Mask (Thresholded Difference)

The second image shows the thresholded difference after applying a flood detection threshold and masking out permanent water bodies using the **JRC Global Surface Water** dataset.

This processing step removes rivers, lakes, and reservoirs that are normally present, leaving only the areas that are likely to have been newly flooded during the event.

<p align="center">
 <img width="1920" height="1080" alt="Screenshot 2026-08-13 174535" src="https://github.com/user-attachments/assets/89d14bbb-e894-4172-87d8-383f0ee45b97" />
</p>

---

## 3. Final Flooded Areas (Vector Polygons)

The final output displays the detected flooded regions as **blue vector polygons**.

The flood pixels are converted into vector polygons using the `reduceToVectors()` function, making the results suitable for GIS analysis and spatial queries. These polygons are then exported to **Google BigQuery**, where they are intersected with OpenStreetMap road data to identify road segments affected by flooding.

This is the final output of the flood detection workflow in Google Earth Engine.

<p align="center">
 <img width="1920" height="1080" alt="Screenshot 2026-08-13 174544" src="https://github.com/user-attachments/assets/74d62f43-1d5c-4f1c-a3ab-eb9db26bb12d" />

</p>
