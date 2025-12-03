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
    <div className="page">
      <section className="tab-row">
        {nationalMaps.map((descriptor) => (
          <button
            key={descriptor.id}
            className={`pill ${activeMapId === descriptor.id ? 'active' : ''}`}
            onClick={() => {
              setActiveMapId(descriptor.id);
              setSelectedDistrict(null);
            }}
            type="button"
          >
            {mapCategories[descriptor.mapType].title}
          </button>
        ))}
      </section>

      <section className="page-header">
        <div>
          <p className="eyebrow">Current congressional district boundaries</p>
          <h1>How often we&apos;d expect a party to win each of the nation&apos;s 435 seats over the long term.</h1>
          <p className="lede">
            Explore how congressional maps change when they prioritize compactness, competitiveness, proportionality,
            and minority representation. Click a state to dive deeper into its plans.
          </p>
        </div>
      </section>

      <div className="map-shell">
        <div className="map-panel" style={{ position: 'relative' }}>
          <div className="map-meta">
            <div>
              <p className="eyebrow">National – {mapCategories[activeMap.mapType].title}</p>
              <h2 className="map-title">{activeMap.description}</h2>
            </div>
            <div className="chip">All states</div>
          </div>
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
          <div className="legend legend-bars">
            <div className="legend-scale">
              <div className="scale-label">Chance of being represented by either party</div>
              <div className="scale-row">
                <span>0%</span>
                <div className="scale-bar blue" />
                <span>100%</span>
              </div>
              <div className="scale-row">
                <span>0%</span>
                <div className="scale-bar red" />
                <span>100%</span>
              </div>
            </div>
          </div>
          {hovered && hoverPoint && (
            <div style={{ position: 'absolute', left: hoverPoint.x + 10, top: hoverPoint.y + 10, zIndex: 10 }}>
              <Tooltip feature={hovered} />
            </div>
          )}
        </div>
        <aside className="summary-panel">
          <div className="summary-header">
            <div>
              <p className="eyebrow">Congressional districts</p>
              <h3>State spotlight</h3>
            </div>
            <div className="chip muted">RMS vote share</div>
          </div>
          <div className="summary-card">
            <div className="summary-state">Alabama</div>
            <div className="bar-row">
              <div className="bar dem" style={{ width: '38%' }} />
              <div className="bar gop" style={{ width: '61%' }} />
              <span className="bar-label dem">38% Dem</span>
              <span className="bar-label gop">61% GOP</span>
            </div>
            <p className="smallprint">Based on historical patterns since 2006</p>
          </div>
          <Sidebar mapTypeLabel={mapCategories[activeMap.mapType].title} selectedDistrict={selectedDistrict} />
          <Link to="/state/Example%20West" className="card muted-link">
            <h4>Example West</h4>
            <p>Explore current and compact experiments for our sample data.</p>
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default National;
