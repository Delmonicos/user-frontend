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
import DelmonicosService from './services/Delmonicos';

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
      .then(() => setInitialized(true));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      { isInitialized === false && <Loading /> }
      { isInitialized && (
        <Router>
          <AppBar />
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App;
