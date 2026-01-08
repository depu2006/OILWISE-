// src/components/IndiaUsageMap.jsx
import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { stateCoordinates } from "../data/stateCoordinates";
import collectionCenters from "../data/collectionCenters.json";

// Helper component to recenter map
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function IndiaUsageMap({ stateUserCount, stateOilUsage = {} }) {
  // View Mode: 'usage' (default) or 'centers'
  const [viewMode, setViewMode] = useState("usage");
  const [mapCenter, setMapCenter] = useState([22, 79]);
  const [mapZoom, setMapZoom] = useState(5);

  // Filter States
  const SOUTH_INDIA = ["Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Kerala", "Puducherry", "Odisha"];
  const NORTH_INDIA = ["Delhi", "Haryana", "Punjab", "Rajasthan", "Uttar Pradesh", "Uttarakhand", "Bihar", "Madhya Pradesh", "Himachal Pradesh", "West Bengal", "Gujarat", "Maharashtra", "Jharkhand", "Chhattisgarh"];

  const [activeRegion, setActiveRegion] = useState(null); // 'SOUTH' or 'NORTH' or null
  const [activeState, setActiveState] = useState(null);

  // Normalize helper
  const normalize = (s) => (s || "").trim().toLowerCase();

  // Extract state from address
  const extractState = (address) => {
    if (!address) return "unknown";
    let parts = address.split(",");
    let last = parts[parts.length - 1].trim();
    // Remove zip codes if present (e.g., "- 533437")
    last = last.replace(/-\s*\d+$/, "").trim();
    // Handle cases where zip is separate part or unexpected format
    if (!isNaN(last) && parts.length > 1) {
      last = parts[parts.length - 2].trim();
    }
    return last;
  };

  // Filtered Centers
  const filteredCenters = useMemo(() => {
    if (viewMode !== "centers") return [];

    let list = collectionCenters;

    // Filter by Region
    if (activeRegion === 'SOUTH') {
      list = list.filter(c => {
        const st = extractState(c.Address || c.address);
        return SOUTH_INDIA.some(s => st.includes(s));
      });
    } else if (activeRegion === 'NORTH') {
      list = list.filter(c => {
        const st = extractState(c.Address || c.address);
        return NORTH_INDIA.some(s => st.includes(s));
      });
    }

    // Filter by Specific State
    if (activeState) {
      list = list.filter(c => {
        const st = extractState(c.Address || c.address);
        return st.includes(activeState);
      });
    }

    return list;
  }, [viewMode, activeRegion, activeState]);


  // Effect to move map when activeState changes
  useEffect(() => {
    if (activeState) {
      // Find coordinates for the state
      const coords = stateCoordinates[normalize(activeState)];
      if (coords) {
        setMapCenter(coords);
        setMapZoom(7);
      }
    } else if (activeRegion === 'SOUTH') {
      setMapCenter([14, 77]);
      setMapZoom(6);
    } else if (activeRegion === 'NORTH') {
      setMapCenter([26, 78]);
      setMapZoom(6);
    } else {
      // Reset
      setMapCenter([22, 79]);
      setMapZoom(5);
    }
  }, [activeState, activeRegion]);


  // --- ICONS & STYLES ---

  const getOilColor = (oilUsage) => {
    if (!oilUsage || oilUsage === 0) return "#9CA3AF";
    if (oilUsage < 20) return "#22c55e";
    if (oilUsage <= 30) return "#f97316";
    return "#ef4444";
  };

  const getUsageCategory = (oilUsage) => {
    if (!oilUsage || oilUsage === 0) return "No Data";
    if (oilUsage < 20) return "Low";
    if (oilUsage <= 30) return "Medium";
    return "High";
  };

  const createNumberIcon = (count, oilUsage) => {
    const size = count > 50 ? 50 : count > 20 ? 40 : count > 5 ? 35 : 30;
    const fontSize = count > 50 ? 16 : count > 20 ? 14 : count > 5 ? 13 : 12;
    const color = getOilColor(oilUsage);

    return L.divIcon({
      className: "custom-marker-icon",
      html: `
        <div style="position: relative; width: ${size}px; height: ${size}px;">
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
          </svg>
          <div style="position: absolute; top: 25%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; font-size: ${fontSize}px; text-shadow: 0 1px 2px rgba(0,0,0,0.5); pointer-events: none;">${count}</div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
    });
  };

  const centerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Prepare Usage Markers
  const usageMarkers = Object.entries(stateUserCount).map(([stateName, count]) => {
    const normalizedState = normalize(stateName);
    const coords = stateCoordinates[normalizedState];
    const oilUsage = stateOilUsage[normalizedState] || 0;
    if (!coords || count === 0) return null;
    return { stateName, count, oilUsage, position: coords };
  }).filter(Boolean);


  // --- RENDER ---
  return (
    <div style={{ display: "flex", gap: "20px", height: "600px", flexDirection: "row" }}>
      <style>{`
        .custom-marker-icon { background: transparent; border: none; }
        .sidebar {
          width: 250px;
          background: var(--panel, #fff);
          border: 1px solid var(--border, #eee);
          border-radius: 12px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .sidebar h3 { font-size: 1.1em; color: var(--text-primary); margin-bottom: 5px; }
        .mode-toggle { display: flex; gap: 5px; background: #f0f0f0; padding: 4px; border-radius: 8px; margin-bottom: 10px; }
        .mode-btn { flex: 1; padding: 8px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85em; font-weight: 600; }
        .mode-btn.active { background: white; shadow: 0 1px 2px rgba(0,0,0,0.1); color: #0f7cfe; }
        
        .filters { display: flex; flex-direction: column; gap: 8px; }
        .filter-btn { padding: 10px; border: 1px solid var(--border, #eee); background: white; border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.2s; }
        .filter-btn:hover { background: #f9f9f9; }
        .filter-btn.active { border-color: #0f7cfe; background: #eff6ff; color: #0f7cfe; font-weight: 600; }
        
        .state-list { display: flex; flex-direction: column; gap: 4px; margin-left: 10px; margin-top: 5px; border-left: 2px solid #eee; padding-left: 10px; }
        .state-item { padding: 6px; font-size: 0.9em; cursor: pointer; border-radius: 4px; }
        .state-item:hover { background: #f0f0f0; }
        .state-item.active { color: #0f7cfe; font-weight: 600; background: #e0f2fe; }
      `}</style>

      {/* SIDEBAR */}
      <div className="sidebar">
        <h3>Map Controls</h3>

        <div className="mode-toggle">
          <button
            className={`mode-btn ${viewMode === 'usage' ? 'active' : ''}`}
            onClick={() => setViewMode('usage')}
          >
            👥 User Usage
          </button>
          <button
            className={`mode-btn ${viewMode === 'centers' ? 'active' : ''}`}
            onClick={() => setViewMode('centers')}
          >
            🏭 Centers
          </button>
        </div>

        {viewMode === 'centers' && (
          <div className="filters">
            <h4>Regions</h4>
            <button
              className={`filter-btn ${activeRegion === 'SOUTH' ? 'active' : ''}`}
              onClick={() => {
                const newVal = activeRegion === 'SOUTH' ? null : 'SOUTH';
                setActiveRegion(newVal);
                setActiveState(null);
              }}
            >
              South India
            </button>
            {activeRegion === 'SOUTH' && (
              <div className="state-list">
                {SOUTH_INDIA.map(st => (
                  <div
                    key={st}
                    className={`state-item ${activeState === st ? 'active' : ''}`}
                    onClick={() => setActiveState(activeState === st ? null : st)}
                  >
                    {st}
                  </div>
                ))}
              </div>
            )}

            <button
              className={`filter-btn ${activeRegion === 'NORTH' ? 'active' : ''}`}
              onClick={() => {
                const newVal = activeRegion === 'NORTH' ? null : 'NORTH';
                setActiveRegion(newVal);
                setActiveState(null);
              }}
            >
              North India
            </button>
            {activeRegion === 'NORTH' && (
              <div className="state-list">
                {NORTH_INDIA.map(st => (
                  <div
                    key={st}
                    className={`state-item ${activeState === st ? 'active' : ''}`}
                    onClick={() => setActiveState(activeState === st ? null : st)}
                  >
                    {st}
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => { setActiveRegion(null); setActiveState(null); }} style={{ marginTop: '10px', padding: '8px', cursor: 'pointer', background: '#eee', border: 'none', borderRadius: '6px' }}>
              Reset View
            </button>
          </div>
        )}

        {viewMode === 'usage' && (
          <div style={{ fontSize: '0.9em', color: '#666', lineHeight: '1.5' }}>
            <p>Visualizing oil consumption and user activity across states.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }}></div>
              Low (&lt;20g)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f97316' }}></div>
              Medium (20-30g)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></div>
              High (&gt;30g)
            </div>
          </div>
        )}
      </div>

      {/* MAP */}
      <div style={{ flex: 1, position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={[22, 79]}
          zoom={5}
          scrollWheelZoom={false}
        >
          <MapUpdater center={mapCenter} zoom={mapZoom} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* VIEW MODE: USAGE */}
          {viewMode === 'usage' && usageMarkers.map((marker, idx) => (
            <Marker
              key={idx}
              position={marker.position}
              icon={createNumberIcon(marker.count, marker.oilUsage)}
            >
              <Popup>
                <div style={{ fontWeight: '600' }}>{marker.stateName}</div>
                <div>{marker.count} users</div>
                <div>Usage: {marker.oilUsage}g/day</div>
              </Popup>
            </Marker>
          ))}

          {/* VIEW MODE: CENTERS */}
          {viewMode === 'centers' && filteredCenters.map((center, idx) => {
            const lat = center.Latitude ?? center.latitude;
            const lng = center.Longitude ?? center.longitude;
            if (!lat || !lng) return null;

            return (
              <Marker
                key={idx}
                position={[lat, lng]}
                icon={centerIcon}
              >
                <Popup>
                  <div style={{ color: '#d9534f', fontWeight: 'bold' }}>{center.Name || center.name || "Center"}</div>
                  <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
                    {center.Address || center.address}
                  </div>
                  <div style={{ fontSize: '0.9em', marginTop: '5px', color: '#007bff' }}>
                    📞 {center.Contact || center.contact || "N/A"}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
