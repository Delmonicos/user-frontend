import { ReactElement } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Container,
  Box,
} from "@material-ui/core";

import ChargersPage from "../pages/Chargers";
import ChargerDetailPage from "../pages/ChargerDetail";

const Router = ({ children }: { children: ReactElement }) => {
  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <BrowserRouter>
        <Box>
          {children}
        </Box>
        <Container
          maxWidth="md"
          style={{ flexGrow: 1, padding: 0 }}
        >
          <Routes>
            <Route path="/chargers" element={<ChargersPage />} />
            <Route path="/chargers/:chargerId" element={<ChargerDetailPage />} />
            <Route path="*" element={<Navigate to="/chargers" />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </Box>
  );
};

export default Router;
