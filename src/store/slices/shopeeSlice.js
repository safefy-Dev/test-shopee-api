import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, getOrders, getStoreInfo } from '../../services/shopeeApi';

const initialState = {
  stores: [],
  selectedStore: null,
  products: [],
  loading: false,
  error: null,
  summary: {
    totalProducts: 0,
    totalSales: 0,
    bestSeller: null,
    outOfStock: 0,
  },
  salesTrend: {
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
        borderColor: '#ff424e',
        tension: 0.1
      }
    ]
  },
  categoryDistribution: [],
};

export const fetchStoreData = createAsyncThunk(
  'shopee/fetchStoreData',
  async (shopId, { getState }) => {
    const state = getState();
    const token = state.shopee.stores.find(store => store.id === shopId)?.token;
    if (!token) throw new Error('No token found for store');

    try {
      // Fetch store info
      const storeInfo = await getStoreInfo(shopId, token);
      
      // Fetch products
      const products = await getProducts(shopId, token);
      
      // Fetch recent orders for sales data
      const endDate = Math.floor(Date.now() / 1000);
      const startDate = endDate - 30 * 24 * 60 * 60; // Last 30 days
      const orders = await getOrders(shopId, token, startDate, endDate);

      // Calculate summary data
      const summary = {
        totalProducts: products?.item_list?.length || 0,
        totalSales: orders?.orders?.reduce((sum, order) => sum + order.order_amount, 0) || 0,
        bestSeller: products?.item_list?.reduce((best, item) => 
          item.sales > (best?.sales || 0) ? item : best
        ) || null,
        outOfStock: products?.item_list?.filter(item => item.stock === 0).length || 0,
      };

      // Prepare sales trend data
      const salesTrend = {
        labels: Array.from({ length: 30 }, (_, i) => {
          const date = new Date(endDate * 1000 - i * 24 * 60 * 60 * 1000);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }).reverse(),
        datasets: [{
          label: 'Daily Sales',
          data: Array.from({ length: 30 }, (_, i) => {
            const date = endDate - i * 24 * 60 * 60;
            return orders?.orders?.filter(order => 
              order.create_time >= date - 24 * 60 * 60 && 
              order.create_time < date
            ).reduce((sum, order) => sum + order.order_amount, 0) || 0;
          }).reverse(),
          borderColor: '#ff424e',
          tension: 0.1,
          fill: false
        }]
      };

      return {
        products: products?.item_list || [],
        summary,
        salesTrend,
        storeInfo
      };
    } catch (error) {
      console.error('Error fetching store data:', error);
      throw error;
    }
  }
);

export const shopeeSlice = createSlice({
  name: 'shopee',
  initialState,
  reducers: {
    addStore: (state, action) => {
      state.stores.push(action.payload);
    },
    selectStore: (state, action) => {
      state.selectedStore = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    updateSummary: (state, action) => {
      state.summary = action.payload;
    },
    updateSalesTrend: (state, action) => {
      state.salesTrend = action.payload;
    },
    updateCategoryDistribution: (state, action) => {
      state.categoryDistribution = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        // TODO: Calculate summary, sales trend, and category distribution
      })
      .addCase(fetchStoreData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addStore,
  selectStore,
  setProducts,
  updateSummary,
  updateSalesTrend,
  updateCategoryDistribution,
} = shopeeSlice.actions;

export default shopeeSlice.reducer;
