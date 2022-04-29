import { useContext } from "react";
import Charger from "../components/Charger";
import { useParams } from "react-router-dom";

import Page from "../components/Page";
import RegisterPayment from "../components/RegisterPayment";
import { UserContext } from "../components/UserContext";

const ChargerDetail = () => {
  const { hasPaymentConsent } = useContext(UserContext);
  const { chargerId } = useParams<{ chargerId: string }>();
  return (
    <Page size="xs">
      <>
        { hasPaymentConsent === false && <RegisterPayment /> }
        { hasPaymentConsent && <Charger  chargerId={chargerId} /> }
      </>
    </Page>
  );
};

export default ChargerDetail;