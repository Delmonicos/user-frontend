import {
  useState,
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

interface UserContextProviderProps {
  initialState: { hasPaymentConsent: boolean };
  children: ReactElement;
}

const UserContextProvider = ({ initialState, children } : UserContextProviderProps) => {
  const [ hasPaymentConsent, setPaymentConsent ] = useState(initialState.hasPaymentConsent);

  const reloadUser = () => {
    DelmonicosService
      .hasPaymentConsent(KeyringService.address)
      .then(setPaymentConsent)
  };

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
