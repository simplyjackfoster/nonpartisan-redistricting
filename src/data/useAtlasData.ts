import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { DistrictStats } from '../components/MapView';

export interface StateStatRow {
  state: string;
  map_type: string;
  expected_dem_seats?: number;
  expected_gop_seats?: number;
  efficiency_gap?: number;
  seat_vote_gap?: number;
  notes?: string;
}

const districtCache: { promise?: Promise<DistrictStats[]> } = {};
const stateCache: { promise?: Promise<StateStatRow[]> } = {};
const districtCsvUrl = new URL('./districts.csv', import.meta.url).href;
const stateCsvUrl = new URL('./states.csv', import.meta.url).href;

const parseNumber = (value: string | undefined) => {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

const fetchDistricts = () => {
  if (!districtCache.promise) {
    districtCache.promise = new Promise((resolve, reject) => {
      Papa.parse<DistrictStats>(districtCsvUrl, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          const cleaned = result.data
            .filter((row) => row.state)
            .map((row) => ({
              ...row,
              district: String(row.district),
              dem_margin: parseNumber(row.dem_margin as any),
              dem_prob: parseNumber(row.dem_prob as any),
              compactness_rank: parseNumber(row.compactness_rank as any),
              minority_percentage: parseNumber(row.minority_percentage as any),
              total_population: parseNumber(row.total_population as any),
            }));
          resolve(cleaned);
        },
        error: (err) => reject(err),
      });
    });
  }
  return districtCache.promise;
};

const fetchStates = () => {
  if (!stateCache.promise) {
    stateCache.promise = new Promise((resolve, reject) => {
      Papa.parse<StateStatRow>(stateCsvUrl, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          const cleaned = result.data.filter((row) => row.state).map((row) => ({
            ...row,
            expected_dem_seats: parseNumber(row.expected_dem_seats as any),
            expected_gop_seats: parseNumber(row.expected_gop_seats as any),
            efficiency_gap: parseNumber(row.efficiency_gap as any),
            seat_vote_gap: parseNumber(row.seat_vote_gap as any),
          }));
          resolve(cleaned);
        },
        error: (err) => reject(err),
      });
    });
  }
  return stateCache.promise;
};

export const useDistrictStats = () => {
  const [rows, setRows] = useState<DistrictStats[]>([]);

  useEffect(() => {
    fetchDistricts().then(setRows).catch((err) => console.error('Failed to load districts', err));
  }, []);

  return rows;
};

export const useStateStats = () => {
  const [rows, setRows] = useState<StateStatRow[]>([]);

  useEffect(() => {
    fetchStates().then(setRows).catch((err) => console.error('Failed to load state stats', err));
  }, []);

  return rows;
};

export const buildDistrictLookup = (rows: DistrictStats[]) => {
  return rows.reduce<Record<string, DistrictStats>>((acc, row) => {
    const key = `${row.state}|${row.map_type}|${row.district}`;
    acc[key] = row;
    return acc;
  }, {});
};

export const findStateSummary = (rows: StateStatRow[], stateName: string, mapType: string) =>
  rows.find((row) => row.state === stateName && row.map_type === mapType);
