import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccessWalletDialog from './dialogs/AccessWalletDialog';
import {useState} from 'react';

const Header = () => {
  const [isOpenAccessWalletDialog, setIsOpenAccessWalletDialog] = useState(false);

  const handleAccessWalletClick = () => {
    setIsOpenAccessWalletDialog(true);
  }
  const handleCloseAccessWalletDialog = () => {
    setIsOpenAccessWalletDialog(false);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
      <AppBar position="static" sx={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#BACBDE',
        borderRadius: '50px',
        height: '75px',
        width: '90%', // Adjust this value as needed
        maxWidth: '100%', // Optionally set a maximum width
        boxShadow: 'none', // Optionally remove box shadow for a cleaner look
      }}>
        <Toolbar>
          <Box display="flex" flexGrow={1} alignItems="center">
            <IconButton edge="start" color="inherit" aria-label="logo">
              <img src="https://www.myetherwallet.com/img/logo-dark.9f8186ae.svg" alt="Logo" style={{ width: '113px', height: '32px' }} />
            </IconButton>
          </Box>
          <Button
            sx={{
              backgroundColor: 'black',
              color: 'white',
              borderRadius: '50px',
              '&:hover': {
                backgroundColor: 'gray' // Optional: change hover color
              },
              fontWeight: 'bold',
              fontSize: '16px',
              textTransform: 'none',
              padding: '8px 18px 8px 16px'
            }}
            onClick={handleAccessWalletClick}
          >
            Access my wallet
          </Button>
        </Toolbar>
      </AppBar>
      <AccessWalletDialog isOpenDialog={isOpenAccessWalletDialog} onCloseDialog={handleCloseAccessWalletDialog} />
    </Box>
  );
}

export default Header;