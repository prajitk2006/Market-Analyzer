import { mockAlerts } from '@/utils/mockData';

// This would be replaced with actual API calls in a production app
const API_BASE_URL = 'https://api.example.com';

// For the MVP, we're using mock data
// In a real application, these would make actual API calls

export const fetchAlerts = async () => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be:
  // const response = await axios.get(`${API_BASE_URL}/alerts`);
  // return response.data;
  
  return mockAlerts();
};

export const createAlert = async (alertData) => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, this would be:
  // const response = await axios.post(`${API_BASE_URL}/alerts`, alertData);
  // return response.data;
  
  // For mock purposes, just return the data with an ID
  return {
    ...alertData,
    id: String(Date.now()),
  };
};

export const updateAlert = async (alertId, alertData) => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would be:
  // const response = await axios.put(`${API_BASE_URL}/alerts/${alertId}`, alertData);
  // return response.data;
  
  // For mock purposes, just return the updated data
  return alertData;
};

export const deleteAlert = async (alertId) => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // In a real app, this would be:
  // const response = await axios.delete(`${API_BASE_URL}/alerts/${alertId}`);
  // return response.data;
  
  // For mock purposes, just return success
  return { success: true };
};

export const toggleAlert = async (alertId, enabled) => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would be:
  // const response = await axios.patch(`${API_BASE_URL}/alerts/${alertId}`, { enabled });
  // return response.data;
  
  // For mock purposes, just return success with the updated state
  return { success: true, enabled };
};