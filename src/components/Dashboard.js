import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Line, Doughnut } from 'react-chartjs-2';
import { DataGrid } from '@mui/x-data-grid';
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { fetchStoreData } from '../store/slices/shopeeSlice';

// ✅ Register chart components once
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { selectedStore, loading, error, summary, salesTrend } =
    useSelector((state) => state.shopee);

  useEffect(() => {
    if (selectedStore) {
      dispatch(fetchStoreData(selectedStore));
    }
  }, [dispatch, selectedStore]);

  const chartRef = useRef(null);

  const salesTrendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const salesTrendData = {
    labels: salesTrend?.labels || ['No Data'],
    datasets: salesTrend?.datasets || [
      {
        label: 'Sales',
        data: [0],
        borderColor: '#ff424e',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const categoryData = {
    labels: summary?.categoryDistribution?.map((c) => c.name) || [],
    datasets: [
      {
        data: summary?.categoryDistribution?.map((c) => c.count) || [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800'],
      },
    ],
  };

  const productColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'price', headerName: 'Price', width: 120 },
    { field: 'stock', headerName: 'Stock', width: 120 },
  ];

  const productRows = summary?.products || [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Total Products
            </Typography>
            <Typography variant="h4">{summary?.totalProducts ?? '-'}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Total Sales
            </Typography>
            <Typography variant="h4">{summary?.totalSales ?? '-'} THB</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Best Seller
            </Typography>
            <Typography variant="h4">
              {summary?.bestSeller?.name ?? 'N/A'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Out of Stock
            </Typography>
            <Typography variant="h4">{summary?.outOfStock ?? '-'}</Typography>
          </Paper>
        </Grid>

        {/* Sales Trend Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Sales Trend
            </Typography>
            <Line ref={chartRef} data={salesTrendData} options={salesTrendOptions} />
          </Paper>
        </Grid>

        {/* Category Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Category Distribution
            </Typography>
            <Doughnut data={categoryData} />
          </Paper>
        </Grid>

        {/* Product Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Products
            </Typography>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={productRows}
                columns={productColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
