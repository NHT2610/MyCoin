import {Card, CardContent, Stack, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {useState} from 'react';
import AccessWalletDialog from '../dialogs/AccessWalletDialog';
import WalletTwoToneIcon from '@mui/icons-material/WalletTwoTone';

const AccessWalletCard = () => {
  const [isOpenAccessWalletDialog, setIsOpenAccessWalletDialog] = useState(false);

  const handleOpenAccessWalletDialog = () => {
    setIsOpenAccessWalletDialog(true);
  }
  const handleCloseAccessWalletDialog = () => {
    setIsOpenAccessWalletDialog(false);
  }

  return (
    <>
      <Card
        onClick={handleOpenAccessWalletDialog}
        sx={{
          width: "50%",
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
            <WalletTwoToneIcon sx={{ color: "#984AFF", fontSize: "100px" }} />
          </Box>
          <CardContent
            sx={{ textAlign: 'justify', paddingTop: "0px" }}
          >
            <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
              Access walltet
            </Typography>
            <Typography variant="h7">
              The NTCoin wallet provides a seamless and secure way to access your NTCoin holdings. With advanced security features and a user-friendly interface, managing your digital assets has never been easier. Get started with your NTCoin wallet and enjoy peace of mind with every transaction.
            </Typography>
          </CardContent>
        </Stack>
      </Card>
      <AccessWalletDialog isOpenDialog={isOpenAccessWalletDialog} onCloseDialog={handleCloseAccessWalletDialog} />
    </>
  );
}

export default AccessWalletCard;