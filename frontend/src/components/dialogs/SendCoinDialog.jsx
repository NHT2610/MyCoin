import {Dialog, DialogContent, DialogTitle, Stack, TextField, Typography} from '@mui/material';
import Button from '@mui/material/Button';
import {useContext, useEffect, useState} from 'react';
import IconButton from '@mui/material/IconButton';
import api from '../../api/api';
import {WalletContext} from '../../contexts/WalletContext';

function RemoveCircleIcon() {
  return null;
}

function AddCircleIcon() {
  return null;
}

const SendCoinDialog = ({ isOpenDialog, onCloseDialog }) => {
  const { publicKey, privateKey } = useContext(WalletContext);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState(1);
  const [disabledSendButton, setDisabledSendButton] = useState(true);
  const [message, setMessage] = useState("");

  const handleAmountChange = (newAmount) => {
    if (newAmount >= 1) {
      setAmount(newAmount);
    }
  };
  const verifyInput = () => {
    return receiverAddress.trim() !== "" && amount >= 1;
  };
  const handleIncreaseAmount = () => {
    handleAmountChange(amount + 1);
  };
  const handleDecreaseAmount = () => {
    handleAmountChange(amount - 1);
  };
  const handleSendClick = async () => {
    try {
      const data = {
        from: publicKey,
        to: receiverAddress,
        amount,
        privateKey
      };
      console.log(data);
      const response = await api.post('/transaction/create', data);
      console.log(response.data);
      setMessage("Transaction successful!");
      setDisabledSendButton(true);
    } catch (error) {
      setMessage(error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (verifyInput()) {
      setDisabledSendButton(false);
    } else {
      setDisabledSendButton(true);
    }
  }, [receiverAddress]);
  useEffect(() => {
    setReceiverAddress("");
    setAmount(1);
    setMessage("");
    setDisabledSendButton(true);
  }, [isOpenDialog]);

  return (
    <Dialog open={isOpenDialog} onClose={onCloseDialog} maxWidth="md">
      <DialogTitle><strong>Send coin</strong></DialogTitle>
      <DialogContent>
        <Typography>Enter receiver address:</Typography>
        <Stack display="flex" direction="column" alignItems="center" sx={{ marginTop: '1em' }}>
          <TextField
            label="Receiver Address"
            value={receiverAddress} onChange={e => setReceiverAddress(e.target.value)}
            sx={{ width: '800px' }}
          />
        </Stack>
        <Typography sx={{ marginTop: '1em' }}>Amount:</Typography>
        <Stack display="flex" direction="column" alignItems="center">
          <IconButton onClick={handleDecreaseAmount} disabled={amount <= 1}>
            <RemoveCircleIcon />
          </IconButton>
          <TextField
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(parseInt(e.target.value))}
            sx={{ width: '800px' }}
            inputProps={{ min: 1 }}
          />
          <IconButton onClick={handleIncreaseAmount}>
            <AddCircleIcon />
          </IconButton>
        </Stack>
        <Typography color="error"><i>{message}</i></Typography>
        <div style={{ display: "flex", justifyContent: "end", marginTop: "1em" }}>
          <Button onClick={onCloseDialog}><strong>Close</strong></Button>
          <Button onClick={handleSendClick} disabled={disabledSendButton}><strong>Send</strong></Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SendCoinDialog;