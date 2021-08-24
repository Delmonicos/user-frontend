import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";

import Charger from "../models/Charger";
import DelmonicosService from "../services/Delmonicos";

const ChargersMap = ({ selectCharger } : { selectCharger: (_: Charger) => void }) => {
  const [chargers, setChargers] = useState<Charger[]>([]);
  
  useEffect(() => {
    DelmonicosService.getChargers().then(setChargers);
  }, []);

  return (
    <MapContainer
      style={{
        width: "100%",
        height: "100%",
      }}
      center={[49.1196964, 6.1763552]}
      zoom={9}
      scrollWheelZoom>
      <TileLayer
        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        maxZoom={20}
        subdomains={["mt0","mt1","mt2","mt3"]}
        attribution='&copy; <a href="https://www.google.com">Google</a>'
      />
      { chargers.map((charger) => (
        <Marker
          key={charger.id}
          position={[charger.lat, charger.lng]}
          eventHandlers={{
            click: () => selectCharger(charger)
          }}
        >
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ChargersMap;
