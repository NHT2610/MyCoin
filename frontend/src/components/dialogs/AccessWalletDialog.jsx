import {Dialog, DialogContent, DialogTitle, Stack, TextField, Typography} from '@mui/material';
import {useContext, useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import { WalletContext } from '../../contexts/WalletContext';
import {useNavigate} from 'react-router-dom';
import api from '../../api/api';

const AccessWalletDialog = ({ isOpenDialog, onCloseDialog }) => {
  const { setPrivateKey, setPublicKey } = useContext(WalletContext);
  const [_privateKey, set_PrivateKey] = useState("");
  const [message, setMessage] = useState("");
  const [disableAccessButton, setDisaleAccessButton] = useState(true);
  const navigate = useNavigate()

  const handleAccessWalletClick = async () => {
    try {
      const response = await api.post('/wallets/access', { privateKey: _privateKey });
      console.log(response.data);
      setPrivateKey(_privateKey);
      setPublicKey(response.data.publicKey);
      navigate("/wallet");
    } catch (error) {
      throw error;
    }
  }
  const verifyPrivateKey = (privateKey) => {
    return privateKey.trim() !== "";
  }

  useEffect(() => {
    if (verifyPrivateKey(_privateKey)) {
      setDisaleAccessButton(false);
    } else {
      setDisaleAccessButton(true);
    }
  }, [_privateKey]);
  useEffect(() => {
    set_PrivateKey("");
    setMessage("");
    setDisaleAccessButton(true);
  }, [isOpenDialog]);

  return (
    <Dialog open={isOpenDialog} onClose={onCloseDialog} maxWidth="md">
      <DialogTitle><strong>Access wallet</strong></DialogTitle>
      <DialogContent>
        <Typography>Enter private key:</Typography>
        <Stack display="flex" direction="column" alignItems="center" sx={{ marginTop: '1em' }}>
          <TextField
            label="Private Key"
            value={_privateKey} onChange={(e) => set_PrivateKey(e.target.value)}
            sx={{ width: '670px' }}
          />
        </Stack>
        <Typography color="error"><i>{message}</i></Typography>
        <div style={{ display: "flex", justifyContent: "end", marginTop: "1em" }}>
          <Button onClick={onCloseDialog}><strong>Close</strong></Button>
          <Button onClick={handleAccessWalletClick} disabled={disableAccessButton}><strong>Access</strong></Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AccessWalletDialog;