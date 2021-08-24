import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";

import DelmonicosService from "../services/Delmonicos";

const ChargeRequest = ({ chargerId } : { chargerId: string }) => {
  const [isLoading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    DelmonicosService
      .newChargeRequest(chargerId)
      .then(() => setLoading(false));
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box>
        <Typography variant="h4" style={{ textAlign: "center" }}>
          Start charge
        </Typography>
        <Box mt={2}>
          <Typography variant="body1">
            Charger ID:
          </Typography>
          <Typography style={{ fontSize: 12 }}>
            { chargerId }
          </Typography>
        </Box>
      </Box>
      <Box
        flexGrow={3}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        { isLoading === false && (
          <Box mt={2} width="100%">
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleStart}
            >
              Start
            </Button>
          </Box>
        )}
        { isLoading && (
          <CircularProgress
            size={90}
          />
        )}
      </Box>
    </Box>
  );
};

export default ChargeRequest;
