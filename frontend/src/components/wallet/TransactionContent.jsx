import React, {useContext, useEffect, useState} from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Tooltip,
  Typography,
  Stack
} from '@mui/material';
import {WalletContext} from '../../contexts/WalletContext';
import api from '../../api/api';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

const TransactionContent = () => {
  const { publicKey, getTimeAgo, shortenAddress, shortenTransactionId } = useContext(WalletContext);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState('All');
  const [title, setTitle] = useState('All Transactions');

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        console.log(response.data);
        setTransactions(response.data);
        setFilteredTransactions(response.data);
      } catch (error) {
        throw error;
      }
    }
    getTransactions();
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredTransactions(transactions);
      setTitle('All Transactions');
    } else if (filter === 'Your transactions') {
      setFilteredTransactions(transactions.filter(tx => tx.from === publicKey));
      setTitle('Your Transactions');
    }
  }, [filter, transactions, publicKey]);

  return (
    <div>
      <Select
        defaultValue="All"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Your transactions">Your transactions</MenuItem>
      </Select>
      <Typography variant="h6" gutterBottom><strong>{title}</strong></Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Timestamp</strong></TableCell>
            <TableCell><strong>From</strong></TableCell>
            <TableCell><strong>To</strong></TableCell>
            <TableCell><strong>Amount</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTransactions.map((tx) =>
            <TableRow key={tx.id}>
              <TableCell>
                <Stack direction="row" alignItems="center">
                  <ArticleOutlinedIcon sx={{ marginRight: "8px", color: "gray" }} />
                  <Tooltip title={tx.id} arrow>
                    <span>{shortenTransactionId(tx.id)}</span>
                  </Tooltip>
                </Stack>
              </TableCell>
              <TableCell>{getTimeAgo(tx.timestamp)}</TableCell>
              <TableCell>
                <Tooltip title={tx.from} arrow>
                  <span>{shortenAddress(tx.from)}</span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={tx.to} arrow>
                  <span>{shortenAddress(tx.to)}</span>
                </Tooltip>
              </TableCell>
              <TableCell>{tx.amount} NTC</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default TransactionContent;
