import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Button,
  LinearProgress,
  Box,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import FreeIcon from '@material-ui/icons/CheckCircle';

import Charger from "../models/Charger";
import useCharger from "../hooks/useCharger";

const ChargerDetailModal = ({ charger, onClose }: { charger: Charger; onClose: () => void }) => {
  const { chargerFree, loading } = useCharger(charger.id);
  
  return (
    <Dialog
      open
      onClose={onClose}
    >
      <DialogTitle>Charger { charger.id.substring(0,5) }...{ charger.id.substring(charger.id.length - 5) }</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Box width="100%" display="flex" justifyContent="center">
            { chargerFree && (
              <Box display="flex" flexDirection="column" alignItems="center">
                <FreeIcon color="secondary" style={{ fontSize: 50 }} />
                <Typography>
                  Charger is free
                </Typography>
              </Box>
            )}
            { chargerFree === false && (
              <Box>
                <LinearProgress color="secondary" />
                <Typography style={{ paddingTop: 10 }}>
                  A charge is in progress
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          component={RouterLink}
          color="primary"
          to={`/chargers/${charger.id}`}
          disabled={loading}
        >
          More
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChargerDetailModal;
