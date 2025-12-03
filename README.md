# Atlas of Redistricting (re-creation)

This project rebuilds the FiveThirtyEight "Atlas of Redistricting" experience using React, Vite, TypeScript, and MapLibre. It ships with lightweight sample data that mirrors the expected folder structure of the original project so you can plug in the public [redistricting-atlas-data](https://github.com/fivethirtyeight/redistricting-atlas-data) shapefiles and CSVs.

## Getting started

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:5173`.

## Project structure

```
public/maps/              # GeoJSON outputs (sample data included)
src/components/           # Map + UI building blocks
src/pages/                # National + State detail pages
src/data/                 # CSV assets + map configuration
scripts/convertShapefiles.js  # Utility to convert shapefiles to GeoJSON
```

## Replacing the sample data

1. Place shapefiles from `redistricting-atlas-data` into a top-level `shp/` folder.
2. Run `npm run build` once to install dev dependencies for the converter.
3. Execute `node scripts/convertShapefiles.js` to populate `public/maps/` with GeoJSON files.
4. Replace `src/data/districts.csv` and `src/data/states.csv` with the CSVs from the data repo.
5. Update `src/data/mapsConfig.ts` so each map descriptor points to the converted GeoJSON file and has the correct `mapType` and `state`.

## Deployment

The Vite build (`npm run build`) outputs a static bundle suitable for GitHub Pages or Vercel. Ensure `public/maps/` contains all required GeoJSON layers before deploying.
