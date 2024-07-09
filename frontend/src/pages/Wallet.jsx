import React, {useEffect} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import WalletAddress from '../components/wallet/WalletAddress';
import Sidebar from '../components/wallet/Sidebar';
import WalletContent from '../components/wallet/WalletContent';
import BlockchainContent from '../components/wallet/BlockchainContent';
import TransactionContent from '../components/wallet/TransactionContent';
import { Box } from '@mui/material';

const Wallet = () => {
  return (
    <>
      <WalletAddress />
      <Box display="flex">
        <Box width="20%" bgcolor="#f0f0f0" p={2}>
          <Sidebar />
        </Box>
        <Box width="80%" p={2}>
          <Routes>
            <Route path="wallet" element={<WalletContent />} />
            <Route path="blockchain" element={<BlockchainContent />} />
            <Route path="transaction" element={<TransactionContent />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default Wallet;
