import {Dialog, DialogContent, DialogTitle, Stack, TextField, Typography} from '@mui/material';
import Button from '@mui/material/Button';
import {useEffect, useRef, useState} from 'react';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import api from '../../api/api';

const CreateWalletDialog = ({ isOpenDialog, onCloseDialog }) => {
  const [privateKey, setPrivateKey] = useState('');
  const textFieldRef = useRef(null);

  const handleCopyContent = () => {
    if (textFieldRef.current) {
      textFieldRef.current.select();
      document.execCommand('copy');
    }
  };

  useEffect(() => {
    if (isOpenDialog && !privateKey) {
      const createWallet = async () => {
        try {
          const response = await api.get('/wallets/create');
          console.log(response.data);
          setPrivateKey(response.data.privateKey);
        } catch (error) {
          console.error(error);
        }
      };
      createWallet().then(r => r);
    }
  }, [isOpenDialog, privateKey]);

  return (
    <Dialog open={isOpenDialog} onClose={onCloseDialog} maxWidth="md">
      <DialogTitle><strong>Create a wallet</strong></DialogTitle>
      <DialogContent>
        <Typography>Your private key:</Typography>
        <Stack display="flex" direction="column" alignItems="center" sx={{ marginTop: '1em' }}>
          <TextField
            label="Private Key"
            sx={{ width: '670px' }}
            value={privateKey}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Button onClick={handleCopyContent} size="small" sx={{ padding: "0px" }}>
                  <ContentCopyTwoToneIcon />
                </Button>
              )
            }}
            inputRef={textFieldRef}
          />
        </Stack>
        <div style={{ display: "flex", justifyContent: "end", marginTop: "1em" }}>
          <Button onClick={onCloseDialog}><strong>Close</strong></Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWalletDialog;