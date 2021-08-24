import { ReactElement } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {
  Container,
  Box,
} from "@material-ui/core";

import ChargersPage from "../pages/Chargers";
import NewRequestPage from "../pages/NewRequest";

const Router = ({ children } : { children: ReactElement }) => {
  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <BrowserRouter>
        <Box>
          { children }
        </Box>
        <Container
          maxWidth="lg"
          style={{ flexGrow: 1, padding: 0 }}
        >
          <Switch>
            <Route path="/chargers" exact component={ChargersPage} />
            <Route path="/chargers/:chargerId" component={NewRequestPage} />
            <Route>
              <Redirect to="/chargers" />
            </Route>
          </Switch>
        </Container>
      </BrowserRouter>
    </Box>
  );
};

export default Router;
