import { MapDescriptor, mapCategories } from '../data/mapsConfig';

interface MapTypeSelectorProps {
  options: MapDescriptor[];
  activeMapId: string;
  onChange: (mapId: string) => void;
}

function MapTypeSelector({ options, activeMapId, onChange }: MapTypeSelectorProps) {
  return (
    <div className="selector-row">
      <label htmlFor="mapType">Map type</label>
      <select id="mapType" value={activeMapId} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {mapCategories[option.mapType].title}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MapTypeSelector;
