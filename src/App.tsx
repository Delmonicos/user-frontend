import { useEffect, useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  Box,
  CircularProgress,
} from "@material-ui/core";

import Router from "./components/Router";
import AppBar from "./components/AppBar";
import theme from "./theme";
import DelmonicosService from "./services/Delmonicos";
import KeyringService from "./services/Keyring";
import UserContextProvider from "./components/UserContext";

const Loading = () => {
  return (
    <Box
      display="flex"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={90} />
    </Box>
  );
};

const App = () => {
  const [ isInitialized, setInitialized ] = useState(false);
  useEffect(() => {
    DelmonicosService
      .connect()
      .then(() => KeyringService.init())
      .then(() => setInitialized(true));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      { isInitialized === false && <Loading /> }
      { isInitialized && (
        <UserContextProvider>
          <Router>
            <AppBar />
          </Router>
        </UserContextProvider>
      )}
    </ThemeProvider>
  );
}

export default App;
