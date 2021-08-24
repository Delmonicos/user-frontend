import { useState } from 'react';

import ChargersMap from "../components/ChargersMap";
import ChargerDetailModal from "../components/ChargerDetailModal";
import Charger from '../models/Charger';

const Chargers = () => {
  const [selectedCharger, setSelectedCharger] = useState<Charger|null>(null);

  return (
    <>
      <ChargersMap selectCharger={setSelectedCharger} />
      { selectedCharger !== null && (
        <ChargerDetailModal
          charger={selectedCharger}
          onClose={() => setSelectedCharger(null)}
        />
      )}
    </>
  );
};

export default Chargers;