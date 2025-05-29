import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addStore } from '../store/slices/shopeeSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shopId, setShopId] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopToken, setShopToken] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addStore({
        id: shopId,
        name: shopName,
        token: shopToken,
      })
    );
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Connect Shopee Store
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Shop ID"
            margin="normal"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Shop Name"
            margin="normal"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Shop Token"
            margin="normal"
            value={shopToken}
            onChange={(e) => setShopToken(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Connect Store
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
