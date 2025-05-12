import axios from 'axios';
import { mockMarketData, mockWatchlistData, mockTopAssets, mockAssets, mockComparisonData } from '@/utils/mockData';

// This would be replaced with actual API calls in a production app
const API_BASE_URL = 'https://api.example.com';

// For the MVP, we're using mock data
// In a real application, these would make actual API calls

export const fetchMarketData = async (symbol, timeRange) => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be:
  // const response = await axios.get(`${API_BASE_URL}/market/${symbol}?timeRange=${timeRange}`);
  // return response.data;
  
  return mockMarketData(symbol, timeRange);
};

export const fetchWatchlistData = async () => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be:
  // const response = await axios.get(`${API_BASE_URL}/watchlist`);
  // return response.data;
  
  return mockWatchlistData();
};

export const fetchTopAssets = async (category) => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, this would be:
  // const response = await axios.get(`${API_BASE_URL}/assets/top?category=${category}`);
  // return response.data;
  
  return mockTopAssets(category);
};

export const fetchAllAssets = async () => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real app, this would be:
  // const response = await axios.get(`${API_BASE_URL}/assets`);
  // return response.data;
  
  return mockAssets();
};

export const fetchComparisonData = async (assetIds, timeRange) => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // In a real app, this would be:
  // const response = await axios.get(
  //   `${API_BASE_URL}/compare?assets=${assetIds.join(',')}&timeRange=${timeRange}`
  // );
  // return response.data;
  
  return mockComparisonData(assetIds, timeRange);
};

// Additional API methods would be added here for a real application:
// - addToWatchlist
// - removeFromWatchlist
// - fetchAssetDetails
// - etc.