import {
  useState,
  useEffect,
  createContext,
  ReactElement,
} from "react";

import KeyringService from "../services/Keyring";
import DelmonicosService from "../services/Delmonicos";

interface Context {
  hasPaymentConsent: boolean
  reload: () => void
}

const UserContext = createContext<Context>({
  hasPaymentConsent: false,
  reload: () => {},
});

const UserContextProvider = ({ children } : { children: ReactElement }) => {
  const [ hasPaymentConsent, setPaymentConsent ] = useState(false);

  const reloadUser = () => {
    DelmonicosService
      .hasPaymentConsent(KeyringService.address!)
      .then(setPaymentConsent)
  };

  useEffect(reloadUser, []);

  const context = {
    hasPaymentConsent,
    reload: reloadUser,
  };

  return (
    <UserContext.Provider value={context}>
      { children }
    </UserContext.Provider>
  );
};

export default UserContextProvider;
export { UserContext };
