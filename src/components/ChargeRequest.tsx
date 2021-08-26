import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
} from "@material-ui/core";
import FreeIcon from '@material-ui/icons/CheckCircle';

import DelmonicosService from "../services/Delmonicos";
import useCharger from "../hooks/useCharger";

const InProgress = ({ data, request }: { data: { userId: string; sessionId: string }; request: boolean}) => {
  return (
    <Card style={{ marginTop: 10, marginBottom: 10 }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          { request
            ? (
              <>
                <CircularProgress size={90} color="secondary" style={{ marginBottom: 7 }} />
                <Typography>
                  A charge session will start soon...
                </Typography>
              </>
            ) :
            (
              <>
                <LinearProgress color="secondary" style={{ marginBottom: 7, width: '300px', height: 10 }} />
                <Typography>
                  A charge session is in progress...
                </Typography>
              </>
            )
          }
          
        </Box>
        <Box mt={5}>
          User :<br/>
          <code style={{ fontSize: 8 }}>{ data.userId }</code>
        </Box>
        <Box>
          Session ID:<br/>
          <code style={{ fontSize: 8 }}>{ data.sessionId }</code>
        </Box>
      </CardContent>
    </Card>
  );
};

const ChargeRequest = ({ chargerId } : { chargerId: string }) => {
  const { loading: loadingStatus, chargerFree, currentChargeRequest, currentChargeSession } = useCharger(chargerId);
  const [loadingRequest, setLoadingRequest] = useState(false);
  
  const handleStart = () => {
    setLoadingRequest(true);
    DelmonicosService
      .newChargeRequest(chargerId)
      .then(() => setLoadingRequest(false));
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
          <code style={{ fontSize: 11 }}>{ chargerId }</code>
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
        <Box mt={2} width="100%">
          { chargerFree && !loadingRequest && !loadingStatus && (
            <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
              <FreeIcon color="secondary" style={{ fontSize: 100 }} />
              <Typography>
                Charger is free
              </Typography>
            </Box>
          )}
          { chargerFree === false && !loadingRequest && !loadingStatus && (currentChargeRequest !== null || currentChargeSession !==null) && (
            <InProgress
              request={currentChargeRequest !== null}
              data={currentChargeRequest ? currentChargeRequest : currentChargeSession!}
            />
          )}
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={handleStart}
            disabled={chargerFree === false || loadingRequest || loadingStatus}
          >
            Start
          </Button>
        </Box>
        { (loadingRequest || loadingStatus) && (
          <CircularProgress size={90} />
        )}
      </Box>
    </Box>
  );
};

export default ChargeRequest;
