import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import MapView, { JoinedFeatureProperties } from '../components/MapView';
import Sidebar from '../components/Sidebar';
import Tooltip from '../components/Tooltip';
import MapTypeSelector from '../components/MapTypeSelector';
import { mapCategories, mapDescriptors, mapTypesByState } from '../data/mapsConfig';
import { buildDistrictLookup, findStateSummary, useDistrictStats, useStateStats } from '../data/useAtlasData';

function StateDetail() {
  const { stateName = '' } = useParams();
  const decodedState = decodeURIComponent(stateName);
  const options = mapTypesByState[decodedState] ?? [];
  const defaultMap = options[0] ?? mapDescriptors[0];
  const [activeMapId, setActiveMapId] = useState(defaultMap.id);
  const [hovered, setHovered] = useState<JoinedFeatureProperties | null>(null);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | undefined>();
  const [selectedDistrict, setSelectedDistrict] = useState<JoinedFeatureProperties | null>(null);

  const districts = useDistrictStats();
  const states = useStateStats();
  const districtLookup = useMemo(() => buildDistrictLookup(districts), [districts]);

  const activeMap = options.find((descriptor) => descriptor.id === activeMapId) ?? defaultMap;
  const summary = findStateSummary(states, decodedState, activeMap.mapType);

  return (
    <div className="map-shell">
      <div className="map-panel" style={{ position: 'relative' }}>
        <MapTypeSelector options={options} activeMapId={activeMapId} onChange={(value) => setActiveMapId(value)} />
        <MapView
          geoJsonUrl={activeMap.geoJson}
          statsLookup={districtLookup}
          selectedDistrictId={selectedDistrict?.district as string | undefined}
          onHover={(feature, point) => {
            setHovered(feature);
            setHoverPoint(point);
          }}
          onSelect={(feature) => setSelectedDistrict(feature)}
        />
        <div className="legend">
          <span className="color" style={{ background: '#4c74c9' }} /> Safe Dem
          <span className="color" style={{ background: '#81a5e3' }} /> Lean Dem
          <span className="color" style={{ background: '#9e9eb0' }} /> Competitive
          <span className="color" style={{ background: '#e38181' }} /> Lean GOP
          <span className="color" style={{ background: '#c94c4c' }} /> Safe GOP
        </div>
        {hovered && hoverPoint && (
          <div style={{ position: 'absolute', left: hoverPoint.x + 10, top: hoverPoint.y + 10, zIndex: 10 }}>
            <Tooltip feature={hovered} />
          </div>
        )}
      </div>
      <Sidebar
        stateName={decodedState}
        mapTypeLabel={mapCategories[activeMap.mapType].title}
        summaryStats={summary}
        selectedDistrict={selectedDistrict}
      />
    </div>
  );
}

export default StateDetail;
