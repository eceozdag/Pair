import { Platform } from 'react-native';

// Your local IP address for phone testing
const LOCAL_IP = '192.168.178.70';

const getApiUrl = () => {
  if (!__DEV__) {
    // Production
    return 'https://pair-wine-backend-production.up.railway.app/api';
  }

  // Development - use localhost for web, IP for mobile
  if (Platform.OS === 'web') {
    return 'http://localhost:3001/api';
  }

  // Mobile devices need the actual IP address
  return `http://${LOCAL_IP}:3001/api`;
};

export default {
  apiUrl: getApiUrl(),
};

