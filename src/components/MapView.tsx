import { useEffect, useRef, useState } from 'react';
import maplibregl, { GeoJSONSource, MapMouseEvent } from 'maplibre-gl';

export interface DistrictStats {
  state: string;
  map_type: string;
  district: string;
  dem_margin?: number;
  dem_prob?: number;
  compactness_rank?: number;
  minority_percentage?: number;
  total_population?: number;
  notes?: string;
}

export interface JoinedFeatureProperties extends Record<string, unknown> {
  state: string;
  district: string;
  map_type: string;
  dem_margin?: number;
  dem_prob?: number;
  compactness_rank?: number;
  minority_percentage?: number;
  total_population?: number;
  notes?: string;
  name?: string;
}

export interface MapViewProps {
  geoJsonUrl: string;
  selectedDistrictId?: string;
  onHover?: (feature: JoinedFeatureProperties | null, point?: { x: number; y: number }) => void;
  onSelect?: (feature: JoinedFeatureProperties | null) => void;
  statsLookup?: Record<string, DistrictStats>;
}

const fillColorExpression: any[] = [
  'case',
  ['<=', ['get', 'dem_margin'], -15],
  '#c94c4c',
  ['<=', ['get', 'dem_margin'], -5],
  '#e38181',
  ['<=', ['get', 'dem_margin'], 5],
  '#9e9eb0',
  ['<=', ['get', 'dem_margin'], 15],
  '#81a5e3',
  ['>', ['get', 'dem_margin'], 15],
  '#4c74c9',
  '#9e9eb0',
];

const getDistrictKey = (props: { state: string; map_type: string; district: string }) =>
  `${props.state}|${props.map_type}|${props.district}`;

function MapView({ geoJsonUrl, selectedDistrictId, onHover, onSelect, statsLookup = {} }: MapViewProps) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);

  useEffect(() => {
    if (mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current as HTMLDivElement,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      bounds: [
        [-125.0, 24.0],
        [-66.5, 50.0],
      ],
      fitBoundsOptions: { padding: 40 },
      attributionControl: true,
      scrollZoom: true,
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const loadData = async () => {
      const response = await fetch(geoJsonUrl);
      const json = await response.json();

      json.features = json.features.map((feature: any) => {
        const props = feature.properties;
        const key = getDistrictKey({ state: props.state, map_type: props.map_type, district: String(props.district) });
        const supplemental = statsLookup[key];
        return {
          ...feature,
          properties: {
            ...props,
            ...supplemental,
            district: String(props.district ?? supplemental?.district ?? ''),
          },
        };
      });

      const sourceId = 'districts';
      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as GeoJSONSource).setData(json as GeoJSON.FeatureCollection);
      } else {
        map.addSource(sourceId, { type: 'geojson', data: json });

        map.addLayer({
          id: 'district-fill',
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': fillColorExpression as any,
            'fill-opacity': 0.75,
          },
        });

        map.addLayer({
          id: 'district-outline',
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#0f172a',
            'line-width': ['case', ['==', ['get', 'district'], selectedDistrictId ?? ''], 2.5, 1],
          },
        });

        map.addLayer({
          id: 'district-hover',
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#111827',
            'line-width': 3,
          },
          filter: ['==', ['get', 'district'], ''],
        });

        map.on('mousemove', 'district-fill', (event: MapMouseEvent) => {
          if (!event.features?.length) return;
          const feature = event.features[0];
          const properties = feature.properties as JoinedFeatureProperties;
          map.setFilter('district-hover', ['==', ['get', 'district'], properties.district]);
          onHover?.(properties, { x: event.point.x, y: event.point.y });
        });

        map.on('mouseleave', 'district-fill', () => {
          map.setFilter('district-hover', ['==', ['get', 'district'], '']);
          onHover?.(null);
        });

        map.on('click', 'district-fill', (event: MapMouseEvent) => {
          if (!event.features?.length) return;
          const properties = event.features[0].properties as JoinedFeatureProperties;
          onSelect?.(properties);
        });
      }

      const bounds = new maplibregl.LngLatBounds();
      json.features.forEach((feature: any) => {
        const geom = feature.geometry;
        if (geom.type === 'Polygon') {
          geom.coordinates[0].forEach((coord: [number, number]) => bounds.extend(coord));
        }
      });
      if (bounds.isEmpty() === false) {
        map.fitBounds(bounds, { padding: 40, animate: true, duration: 500 });
      }

      setLoadedSource(sourceId);
    };

    if (map.isStyleLoaded()) {
      loadData();
    } else {
      map.once('load', loadData);
    }
  }, [geoJsonUrl, statsLookup]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedSource) return;
    if (map.getLayer('district-outline')) {
      map.setPaintProperty('district-outline', 'line-width', ['case', ['==', ['get', 'district'], selectedDistrictId ?? ''], 2.5, 1]);
    }
  }, [selectedDistrictId, loadedSource]);

  return <div id="map-container" ref={containerRef} />;
}

export default MapView;
