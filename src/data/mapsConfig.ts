export type MapCategory =
  | 'current'
  | 'compact'
  | 'proportional'
  | 'competitive'
  | 'minority'
  | 'dem-advantage'
  | 'gop-advantage';

export interface MapDescriptor {
  id: string;
  title: string;
  description: string;
  mapType: MapCategory;
  level: 'national' | 'state';
  state?: string;
  geoJson: string;
}

export const mapCategories: Record<MapCategory, { title: string; description: string }> = {
  current: {
    title: 'Current Map',
    description: 'The official congressional plan used as a baseline.',
  },
  compact: {
    title: 'Compact Map',
    description: 'Districts optimized for geometric compactness.',
  },
  proportional: {
    title: 'Proportional Map',
    description: 'Seats proportional to the statewide vote share.',
  },
  competitive: {
    title: 'Competitive Map',
    description: 'Maximizes the number of highly competitive seats.',
  },
  minority: {
    title: 'Majority-Minority Optimized',
    description: 'Prioritizes minority opportunity districts.',
  },
  'dem-advantage': {
    title: 'Democratic Advantage',
    description: 'Illustrates a Democratic-optimized gerrymander.',
  },
  'gop-advantage': {
    title: 'Republican Advantage',
    description: 'Illustrates a Republican-optimized gerrymander.',
  },
};

export const mapDescriptors: MapDescriptor[] = [
  {
    id: 'national-current',
    title: 'National – Current map',
    description: mapCategories.current.description,
    mapType: 'current',
    level: 'national',
    geoJson: '/maps/national_current.geojson',
  },
  {
    id: 'national-compact',
    title: 'National – Compact map',
    description: mapCategories.compact.description,
    mapType: 'compact',
    level: 'national',
    geoJson: '/maps/national_compact.geojson',
  },
  {
    id: 'example-west-current',
    title: 'Example West – Current map',
    description: mapCategories.current.description,
    mapType: 'current',
    level: 'state',
    state: 'Example West',
    geoJson: '/maps/example-west_current.geojson',
  },
  {
    id: 'example-west-compact',
    title: 'Example West – Compact map',
    description: mapCategories.compact.description,
    mapType: 'compact',
    level: 'state',
    state: 'Example West',
    geoJson: '/maps/example-west_compact.geojson',
  },
];

export const mapTypesByState = mapDescriptors.reduce<Record<string, MapDescriptor[]>>((acc, descriptor) => {
  if (descriptor.level === 'state' && descriptor.state) {
    acc[descriptor.state] = acc[descriptor.state] || [];
    acc[descriptor.state].push(descriptor);
  }
  return acc;
}, {});

export const nationalMaps = mapDescriptors.filter((descriptor) => descriptor.level === 'national');
