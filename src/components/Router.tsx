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
            <Route path="/chargers" component={ChargersPage} />
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
