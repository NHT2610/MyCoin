import React from 'react';
import {List, ListItemButton, ListItemText} from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <List component="nav">
      <ListItemButton component={Link} to="/wallet/wallet">
        <ListItemText primary="Wallet" />
      </ListItemButton>
      <ListItemButton component={Link} to="/wallet/blockchain">
        <ListItemText primary="Blockchain" />
      </ListItemButton>
      <ListItemButton component={Link} to="/wallet/transaction">
        <ListItemText primary="Transaction" />
      </ListItemButton>
    </List>
  );
}

export default Sidebar;