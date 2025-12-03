import { JoinedFeatureProperties } from './MapView';

interface TooltipProps {
  feature: JoinedFeatureProperties;
}

const Tooltip = ({ feature }: TooltipProps) => {
  return (
    <div className="tooltip">
      <h4>{feature.name ?? `District ${feature.district}`}</h4>
      <div className="stat">
        <span>Partisan lean</span>
        <strong>
          {typeof feature.dem_margin === 'number'
            ? `${feature.dem_margin > 0 ? 'D+' : feature.dem_margin < 0 ? 'R+' : ''}${Math.abs(feature.dem_margin)}`
            : '—'}
        </strong>
      </div>
      <div className="stat">
        <span>Minority %</span>
        <strong>{feature.minority_percentage ? `${(feature.minority_percentage * 100).toFixed(1)}%` : '—'}</strong>
      </div>
      <div className="stat">
        <span>Compactness rank</span>
        <strong>{feature.compactness_rank ?? '—'}</strong>
      </div>
    </div>
  );
};

export default Tooltip;
