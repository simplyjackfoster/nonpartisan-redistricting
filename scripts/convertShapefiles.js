#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import * as shapefile from 'shapefile';

const inputDir = path.resolve('shp');
const outputDir = path.resolve('public/maps');

async function convertFile(filePath) {
  const baseName = path.basename(filePath, path.extname(filePath));
  const outputPath = path.join(outputDir, `${baseName}.geojson`);
  await fs.ensureDir(outputDir);

  const source = await shapefile.open(filePath);
  const features = [];
  let result = await source.read();
  while (!result.done) {
    features.push({ type: 'Feature', properties: result.value.properties, geometry: result.value.geometry });
    result = await source.read();
  }

  const geojson = { type: 'FeatureCollection', features };
  await fs.writeJson(outputPath, geojson, { spaces: 2 });
  console.log(`Converted ${filePath} -> ${outputPath}`);
}

async function run() {
  if (!fs.existsSync(inputDir)) {
    console.error('No shp directory found. Please place shapefiles inside ./shp');
    process.exit(1);
  }

  const files = glob.sync(path.join(inputDir, '*.shp'));
  if (!files.length) {
    console.error('No .shp files detected.');
    process.exit(1);
  }

  for (const file of files) {
    try {
      await convertFile(file);
    } catch (error) {
      console.error(`Failed to convert ${file}`, error);
    }
  }
}

run();
