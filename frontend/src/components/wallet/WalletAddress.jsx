import {WalletContext} from '../../contexts/WalletContext';
import {useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {Typography} from '@mui/material';

const WalletAddress = () => {
  const { publicKey } = useContext(WalletContext);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#184F90" }}>
      <Toolbar>
        <Typography variant="h7">
          <strong>Wallet Address:</strong> {publicKey.toString()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default WalletAddress;