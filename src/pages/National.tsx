import { useMemo, useState } from 'react';
import MapView, { JoinedFeatureProperties } from '../components/MapView';
import Sidebar from '../components/Sidebar';
import Tooltip from '../components/Tooltip';
import { mapCategories, mapDescriptors, nationalMaps } from '../data/mapsConfig';
import { buildDistrictLookup, useDistrictStats } from '../data/useAtlasData';
import { Link } from 'react-router-dom';

function National() {
  const [activeMapId, setActiveMapId] = useState(nationalMaps[0].id);
  const [hovered, setHovered] = useState<JoinedFeatureProperties | null>(null);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | undefined>();
  const [selectedDistrict, setSelectedDistrict] = useState<JoinedFeatureProperties | null>(null);
  const districts = useDistrictStats();
  const districtLookup = useMemo(() => buildDistrictLookup(districts), [districts]);

  const activeMap = mapDescriptors.find((descriptor) => descriptor.id === activeMapId) ?? nationalMaps[0];

  return (
    <div style={{ position: 'relative' }}>
      <section style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: '#475569' }}>
          Explore how congressional maps change when they prioritize compactness, competitiveness, proportionality,
          and minority representation. Click a state to dive deeper into its plans.
        </p>
        <div className="grid">
          {nationalMaps.map((descriptor) => (
            <button
              key={descriptor.id}
              className="card"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                borderColor: activeMapId === descriptor.id ? '#2c4fa5' : '#e2e8f0',
              }}
              onClick={() => {
                setActiveMapId(descriptor.id);
                setSelectedDistrict(null);
              }}
            >
              <h3 style={{ margin: '0 0 0.25rem 0' }}>{mapCategories[descriptor.mapType].title}</h3>
              <p style={{ margin: 0, color: '#475569' }}>{descriptor.description}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="map-shell">
        <div className="map-panel" style={{ position: 'relative' }}>
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
        <Sidebar mapTypeLabel={mapCategories[activeMap.mapType].title} selectedDistrict={selectedDistrict} />
      </div>

      <section style={{ marginTop: '2rem' }}>
        <h3>Featured states</h3>
        <div className="grid">
          <Link to="/state/Example%20West" className="card">
            <h4>Example West</h4>
            <p style={{ color: '#475569' }}>Dive into current and compact experiments for our sample data.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default National;
