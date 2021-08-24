import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Button,
} from '@material-ui/core';

import { Link as RouterLink } from 'react-router-dom';

import Charger from "../models/Charger";

const ChargerDetailModal = ({ charger, onClose }: { charger: Charger, onClose: () => void }) => {
  return (
    <Dialog
      open
      onClose={onClose}
    >
      <DialogTitle>Charger { charger.id.substring(0,5) }...{ charger.id.substring(charger.id.length - 5) }</DialogTitle>
      <DialogContent>
        <DialogContentText>
          
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button component={RouterLink} color="primary" to={`/chargers/${charger.id}`}>
          Start charge
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChargerDetailModal;
