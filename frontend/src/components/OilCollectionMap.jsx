import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { collectionCenters } from "../data/collectionCenters";

// Default pointer marker
const pointerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function OilCollectionMap() {
    return (
        <div style={{ height: "500px", width: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)" }}>
            <MapContainer
                center={[22.9734, 78.6569]}
                zoom={5}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {collectionCenters.map((center, idx) => {
                    const lat = center.Latitude ?? center.latitude;
                    const lon = center.Longitude ?? center.longitude;
                    const name = center.Name ?? center.name;
                    const address = center.Address ?? center.address;
                    const contact = center.Contact ?? center.contact;

                    if (!lat || !lon) return null;

                    return (
                        <Marker key={idx} position={[lat, lon]} icon={pointerIcon}>
                            <Popup>
                                <div style={{ color: "#333", fontSize: "13px", lineHeight: "1.5" }}>
                                    <div style={{ fontSize: "15px", fontWeight: "bold", color: "#d35400", marginBottom: "4px" }}>
                                        {name}
                                    </div>
                                    <div>
                                        <b>Address:</b> {address}
                                    </div>
                                    <div style={{ marginTop: "4px" }}>
                                        <b>Contact:</b> {contact}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
