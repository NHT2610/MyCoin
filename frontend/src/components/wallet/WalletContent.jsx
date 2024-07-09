import React, {useContext, useEffect, useState} from 'react';
import {
  Card,
  CardContent,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Stack,
  Tooltip
} from '@mui/material';
import SendCoinDialog from '../dialogs/SendCoinDialog';
import api from '../../api/api';
import {WalletContext} from '../../contexts/WalletContext';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

const WalletContent = () => {
  const { publicKey, privateKey, getTimeAgo, shortenAddress } = useContext(WalletContext);
  const [balance, setBalance] = useState(0);
  const [blocksMined, setBlocksMined] = useState(0);
  const [blocks, setBlocks] = useState([]);
  const [isOpenSendCoinDialog, setIsOpenSendCoinDialog] = useState(false);

  const handleOpenSendCoinDialog = () => {
    setIsOpenSendCoinDialog(true);
  }
  const handleCloseSendCoinDialog = () => {
    setIsOpenSendCoinDialog(false);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getBalance = async () => {
    try {
      const response = await api.get(`/wallets/balance/${publicKey}`);
      console.log(response.data);
      setBalance(response.data['balance']);
    } catch (error) {
      throw error;
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getBlocks = async () => {
    try {
      const response = await api.get(`/wallets/mined-blocks/${publicKey}`);
      console.log(response.data);
      setBlocks(response.data);
      setBlocksMined(response.data.length);
    } catch (error) {
      throw error;
    }
  }
  const handleMineBlock = async () => {
    try {
      const data = { privateKey };
      const response = await api.post('/mine-block', data);
      console.log(response.data);
      const newBlock = response.data;
      setBlocks([...blocks, newBlock]);
      setBlocksMined(blocksMined=> blocksMined + 1);
      await getBalance();
    } catch (error) {
      console.error('Error mining block:', error);
    }
  }

  useEffect(() => {
    getBalance();
    getBlocks();
  }, []);

  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
        <Card sx={{ flex: 1, backgroundColor: "#05C0A5" }}>
          <CardContent>
            <Typography variant="h6"><strong>Balance</strong></Typography>
            <Typography variant="h6">{balance} NTC</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, backgroundColor: "#07B0C5" }}>
          <CardContent>
            <Typography variant="h6"><strong>Blocks Mined</strong></Typography>
            <Typography variant="h6">{blocksMined} {blocksMined <= 1 ? 'Block' : 'Blocks'}</Typography>
          </CardContent>
        </Card>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
        <Button variant="contained" onClick={handleOpenSendCoinDialog} sx={{ backgroundColor: "#184F90" }}>Send Coin</Button>
        <Button variant="contained" sx={{ backgroundColor: "#184F90" }} onClick={handleMineBlock}>Mine</Button>
      </Stack>
      <Typography variant="h6" gutterBottom><strong>Your Mined Blocks</strong></Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Index</strong></TableCell>
            <TableCell><strong>Timestamp</strong></TableCell>
            <TableCell><strong>Validator</strong></TableCell>
            <TableCell><strong>Transaction Count</strong></TableCell>
            <TableCell><strong>Coins Received</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blocks.map((block) =>
            <TableRow key={block.index}>
              <TableCell>
                <Stack direction="row" alignItems="center">
                  <ViewInArIcon sx={{ marginRight: "8px", color: "gray" }} /> {block.index}
                </Stack>
              </TableCell>
              <TableCell>{getTimeAgo(block.timestamp)}</TableCell>
              <TableCell>
                <Tooltip title={block.validator} arrow>
                  <span>{shortenAddress(block.validator)}</span>
                </Tooltip>
              </TableCell>
              <TableCell>{block.data.length} {block.data.length <= 1 ? 'txn' : 'txns'}</TableCell>
              <TableCell>{block.nCoins} NTC</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <SendCoinDialog isOpenDialog={isOpenSendCoinDialog} onCloseDialog={handleCloseSendCoinDialog} />
    </div>
  );
}

export default WalletContent;
