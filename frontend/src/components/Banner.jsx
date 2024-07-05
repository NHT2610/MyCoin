import Box from '@mui/material/Box';
import {Stack, Typography} from '@mui/material';
import {useState} from 'react';
import AccessWalletDialog from './dialogs/AccessWalletDialog';

const Banner = () => {
  const [isOpenAccessWalletDialog, setIsOpenAccessWalletDialog] = useState(false);

  const handleOpenAccessWalletDialog = () => {
    setIsOpenAccessWalletDialog(true);
  }
  const handleCloseAccessWalletDialog = () => {
    setIsOpenAccessWalletDialog(false);
  }

  return (
    <Box
      sx={{
        opacity: '1',
        color: 'white',
        textAlign: 'center',
        margin: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Typography variant="h4" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
        Create a new wallet
      </Typography>
      <Typography variant="subtitle1" component="div" gutterBottom>
        Please select a method to create a new wallet
      </Typography>
      <Stack direction="row" justifyContent='center'>
        <Typography variant="subtitle1" component="div" gutterBottom>
          Already have a wallet?
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            href="#" onClick={handleOpenAccessWalletDialog}
            style={{color: '#05C0A5', font: 'inherit', marginLeft: '5px'}}
          >
            Access wallet
          </a>
        </Typography>
      </Stack>
      <AccessWalletDialog isOpenDialog={isOpenAccessWalletDialog} onCloseDialog={handleCloseAccessWalletDialog} />
    </Box>
  );
}

export default Banner;