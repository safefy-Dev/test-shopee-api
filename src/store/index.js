import { configureStore } from '@reduxjs/toolkit';
import shopeeReducer from './slices/shopeeSlice';

const store = configureStore({
  reducer: {
    shopee: shopeeReducer,
  },
});

export default store;
