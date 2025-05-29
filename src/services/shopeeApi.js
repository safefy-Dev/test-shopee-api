import axios from 'axios';
import { REACT_APP_SHOPEE_PARTNER_ID, REACT_APP_SHOPEE_PARTNER_KEY } from '../config';

const shopeeApi = axios.create({
  baseURL: process.env.REACT_APP_SHOPEE_API_BASE_URL,
  timeout: 30000,
});

// Helper function to generate timestamp
const generateTimestamp = () => Math.floor(Date.now() / 1000);

// Helper function to generate signature
const generateSignature = (partnerId, timestamp, shopId, path, body = '') => {
  const stringToSign = `${partnerId}${timestamp}${shopId}${path}${body}${REACT_APP_SHOPEE_PARTNER_KEY}`;
  return Buffer.from(stringToSign).toString('base64');
};

// Helper function to generate headers
const generateHeaders = (shopId, path, body = '') => {
  const timestamp = generateTimestamp();
  const signature = generateSignature(
    REACT_APP_SHOPEE_PARTNER_ID,
    timestamp,
    shopId,
    path,
    body
  );

  return {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(`${REACT_APP_SHOPEE_PARTNER_ID}:${signature}`).toString('base64')}`,
    'X-Timestamp': timestamp,
    'X-Shopid': shopId,
  };
};

// API Endpoints
export const getStoreInfo = async (shopId, token) => {
  const path = '/shop/get_shop_info';
  const headers = generateHeaders(shopId, path);
  
  try {
    const response = await shopeeApi.get(path, {
      headers,
      params: {
        partner_id: REACT_APP_SHOPEE_PARTNER_ID,
        shop_id: shopId,
        timestamp: generateTimestamp(),
      },
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching store info:', error);
    throw error;
  }
};

export const getProducts = async (shopId, token, offset = 0, limit = 100) => {
  const path = '/item/list';
  const headers = generateHeaders(shopId, path);
  
  try {
    const response = await shopeeApi.get(path, {
      headers,
      params: {
        partner_id: REACT_APP_SHOPEE_PARTNER_ID,
        shop_id: shopId,
        timestamp: generateTimestamp(),
        offset,
        limit,
      },
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductDetail = async (shopId, token, itemId) => {
  const path = '/item/get';
  const headers = generateHeaders(shopId, path);
  
  try {
    const response = await shopeeApi.get(path, {
      headers,
      params: {
        partner_id: REACT_APP_SHOPEE_PARTNER_ID,
        shop_id: shopId,
        timestamp: generateTimestamp(),
        item_id: itemId,
      },
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw error;
  }
};

export const getOrders = async (shopId, token, time_from, time_to, page_size = 100) => {
  const path = '/order/get_order_list';
  const headers = generateHeaders(shopId, path);
  
  try {
    const response = await shopeeApi.get(path, {
      headers,
      params: {
        partner_id: REACT_APP_SHOPEE_PARTNER_ID,
        shop_id: shopId,
        timestamp: generateTimestamp(),
        time_from,
        time_to,
        page_size,
      },
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export default shopeeApi;
