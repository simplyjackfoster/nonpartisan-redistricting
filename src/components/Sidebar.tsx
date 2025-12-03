import { JoinedFeatureProperties } from './MapView';

interface SidebarProps {
  stateName?: string;
  mapTypeLabel: string;
  summaryStats?: {
    expected_dem_seats?: number;
    expected_gop_seats?: number;
    efficiency_gap?: number;
    seat_vote_gap?: number;
    notes?: string;
  };
  selectedDistrict?: JoinedFeatureProperties | null;
}

const formatPercent = (value?: number) => {
  if (value === undefined || value === null) return '—';
  return `${(value * 100).toFixed(1)}%`;
};

const formatMargin = (value?: number) => {
  if (value === undefined || value === null) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)} pt`;
};

function Sidebar({ stateName, mapTypeLabel, summaryStats, selectedDistrict }: SidebarProps) {
  return (
    <aside className="sidebar">
      <h3>{stateName ? `${stateName} overview` : 'National overview'}</h3>
      <p className="badge">{mapTypeLabel}</p>
      <div className="stat">
        <span>Expected Democratic seats</span>
        <strong>{summaryStats?.expected_dem_seats ?? '—'}</strong>
      </div>
      <div className="stat">
        <span>Expected Republican seats</span>
        <strong>{summaryStats?.expected_gop_seats ?? '—'}</strong>
      </div>
      <div className="stat">
        <span>Efficiency gap</span>
        <strong>{summaryStats?.efficiency_gap?.toFixed(2) ?? '—'}</strong>
      </div>
      <div className="stat">
        <span>Seat-to-vote gap</span>
        <strong>{summaryStats?.seat_vote_gap?.toFixed(2) ?? '—'}</strong>
      </div>
      {summaryStats?.notes && <p style={{ marginTop: '0.75rem', color: '#475569' }}>{summaryStats.notes}</p>}
      {selectedDistrict && (
        <div style={{ marginTop: '1.25rem' }}>
          <h3>District {selectedDistrict.district}</h3>
          <div className="stat">
            <span>Partisan lean</span>
            <strong>{formatMargin(selectedDistrict.dem_margin)}</strong>
          </div>
          <div className="stat">
            <span>Democratic win probability</span>
            <strong>{formatPercent(selectedDistrict.dem_prob)}</strong>
          </div>
          <div className="stat">
            <span>Minority percentage</span>
            <strong>{formatPercent(selectedDistrict.minority_percentage)}</strong>
          </div>
          <div className="stat">
            <span>Compactness rank</span>
            <strong>{selectedDistrict.compactness_rank ?? '—'}</strong>
          </div>
          <div className="stat">
            <span>Population</span>
            <strong>{selectedDistrict.total_population?.toLocaleString() ?? '—'}</strong>
          </div>
          {selectedDistrict.notes && <p style={{ color: '#475569' }}>{selectedDistrict.notes}</p>}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
