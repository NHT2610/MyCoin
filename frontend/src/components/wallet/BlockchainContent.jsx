import React, {useContext, useEffect, useState} from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Typography,
  Stack,
  Tooltip
} from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import {WalletContext} from '../../contexts/WalletContext';
import api from '../../api/api';

const BlockchainContent = () => {
  const { publicKey, getTimeAgo, shortenAddress } = useContext(WalletContext);
  const [blocks, setBlocks] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [title, setTitle] = useState('All Blocks In Blockchain');

  useEffect(() => {
    const getBlocks = async () => {
      try {
        const response = await api.get('/blocks');
        console.log(response.data);
        setBlocks(response.data);
        setFilteredBlocks(response.data);
      } catch (error) {
        throw error;
      }
    }
    getBlocks();
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredBlocks(blocks);
      setTitle('All Blocks In Blockchain');
    } else if (filter === 'Your Mined') {
      setFilteredBlocks(blocks.filter(block => block.validator === publicKey));
      setTitle('Your Mined Blocks');
    }
  }, [filter, blocks, publicKey]);

  return (
    <div>
      <Select
        defaultValue="All"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Your Mined">Your mined</MenuItem>
      </Select>
      <Typography variant="h6" gutterBottom><strong>{title}</strong></Typography>
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
          {filteredBlocks.map((block) =>
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
    </div>
  );
}

export default BlockchainContent;
