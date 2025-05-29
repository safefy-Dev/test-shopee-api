import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const navigate = useNavigate();
  const selectedStore = useSelector((state) => state.shopee.selectedStore);
  const stores = useSelector((state) => state.shopee.stores);

  const handleStoreChange = (event) => {
    // TODO: Implement store change logic
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Shopee Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Select
            value={selectedStore}
            onChange={handleStoreChange}
            size="small"
            sx={{ mr: 1 }}
          >
            {stores.map((store) => (
              <MenuItem key={store.id} value={store.id}>
                🏢 {store.name}
              </MenuItem>
            ))}
          </Select>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
