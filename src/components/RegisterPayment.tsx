import {
  useContext,
  useState,
  useCallback,
  ChangeEvent,
} from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";

import DelmonicosService from "../services/Delmonicos";
import { UserContext } from "./UserContext";

const RegisterPayment = () => {
  const { reload } = useContext(UserContext);

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');

  const handleSave = () => {
    setLoading(true);
    setError(null);
    DelmonicosService
      .setPaymentConsent(iban, bic)
      .then(() => reload())
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  };

  const handleIbanChanged = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setIban(evt.target.value);
  }, [setIban]);

  const handleBicChanged = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setBic(evt.target.value);
  }, [setBic]);
  

  return (
    <Box>
      <Typography variant="h4" style={{ textAlign: "center" }}>
        Register payment method
      </Typography>
      <Box p={4} display="flex" flexDirection="column" gridGap={20}>
        <TextField
          fullWidth
          label="IBAN"
          variant="outlined"
          disabled={isLoading}
          value={iban}
          onChange={handleIbanChanged}
        />
        <TextField
          fullWidth
          label="BIC"
          variant="outlined"
          disabled={isLoading}
          value={bic}
          onChange={handleBicChanged}
        />
        { isLoading === false && (
          <Button
            color="primary"
            variant="contained"
            onClick={handleSave}
            disabled={iban.length === 0 || bic.length === 0}
          >
            Save
          </Button>
        )}
        { isLoading && (
          <Box display="flex" justifyContent="center" >
            <CircularProgress />
          </Box>
        )}
        { error !== null && (
          <Typography color="error">
            { error }
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default RegisterPayment;
