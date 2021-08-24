import { useContext } from "react";
import ChargeRequest from "../components/ChargeRequest";
import { useParams } from "react-router-dom";

import Page from "../components/Page";
import RegisterPayment from "../components/RegisterPayment";
import { UserContext } from "../components/UserContext";

const NewRequest = () => {
  const { hasPaymentConsent } = useContext(UserContext);
  const { chargerId } = useParams<{ chargerId: string }>();
  return (
    <Page>
      <>
        { hasPaymentConsent === false && <RegisterPayment /> }
        { hasPaymentConsent && <ChargeRequest  chargerId={chargerId} /> }
      </>
    </Page>
  );
};

export default NewRequest;