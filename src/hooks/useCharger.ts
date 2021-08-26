import { useEffect, useState } from "react";

import ChargeRequest from "../models/ChargeRequest";
import ChargeSession from "../models/ChargeSession";
import DelmonicosService from '../services/Delmonicos';

const UseCharger = (chargerId: string) => {
  const [loading, setLoading] = useState(true);
  const [currentChargeRequest, setCurrentChargeRequest] = useState<ChargeRequest | null>(null);
  const [currentChargeSession, setCurrentChargeSession] = useState<ChargeSession | null>(null);
  const [chargerFree, setChargerFree] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    DelmonicosService
      .getChargerStatusStream(
        chargerId,
        (request: ChargeRequest | null) => setCurrentChargeRequest(request),
        (session: ChargeSession | null) => setCurrentChargeSession(session),
      )
      .then((unsub) => {
        unsubscribe = unsub
        setLoading(false);
      });
    return () => {
      if(unsubscribe) unsubscribe();
    };
  }, [ chargerId ]);

  useEffect(() => {
    setChargerFree(currentChargeRequest === null && currentChargeSession === null);
  }, [ currentChargeRequest, currentChargeSession ]);

  return { loading, currentChargeRequest, currentChargeSession, chargerFree };
};

export default UseCharger;
