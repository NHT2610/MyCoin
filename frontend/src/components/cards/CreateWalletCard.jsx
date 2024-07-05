import {Card, CardContent, Stack, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CreateWalletDialog from '../dialogs/CreateWalletDialog';
import {useState} from 'react';

const CreateWalletCard = () => {
  const [isOpenCreateWalletDialog, setIsOpenCreateWalletDialog] = useState(false);

  const handleOpenCreateWalletDialog = () => {
    setIsOpenCreateWalletDialog(true);
  }
  const handleCloseCreateWalletDialog = () => {
    setIsOpenCreateWalletDialog(false);
  }

  return (
    <>
      <Card
        onClick={handleOpenCreateWalletDialog}
        sx={{
          width: '50%',
          borderRadius: '13px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto',
          '&:hover': { backgroundColor: "#CACACA", cursor: "pointer" }
        }}
      >
        <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}>
          <Stack sx={{ display: "inline-block", textAlign: "end" }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: "10px",
                borderRadius: "50px",
                paddingX: "10px",
                backgroundColor: "#05C0A5",
                color: "white",
                textTransform: "none",
              }}
            >
              <VerifiedUserIcon sx={{ fontSize: "18px", marginRight: "5px" }} />
              <Typography
                variant="overline"
                fontWeight="bold"
                sx={{
                  color: "white",
                  textTransform: "none",
                }}
              >
                Official
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Stack
          sx={{
            paddingX: "20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: "10px"
          }}
        >
          <Box display="flex" alignItems="center">
            <img
              src="https://www.myetherwallet.com/img/icon-mew-wallet.f29574d3.png"
              alt="Create Wallet Logo"
              style={{ height: '100px', border: 'none' }}
            />
          </Box>
          <CardContent
            sx={{ textAlign: 'justify', paddingTop: "0px" }}
          >
            <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
              Create a wallet
            </Typography>
            <Typography variant="h7">
              NTCoin is a revolutionary new cryptocurrency that offers enhanced security and fast transaction times. Create your NTCoin wallet today to start managing your digital assets securely and efficiently.
            </Typography>
          </CardContent>
        </Stack>
      </Card>
      <CreateWalletDialog isOpenDialog={isOpenCreateWalletDialog} onCloseDialog={handleCloseCreateWalletDialog} />
    </>
  );
}

export default CreateWalletCard;