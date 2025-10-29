const ENV = {
  dev: {
    apiUrl: 'http://localhost:3001/api',
  },
  prod: {
    apiUrl: 'https://pair-wine-backend-production.up.railway.app/api',
  },
};

const getEnvVars = () => {
  if (__DEV__) return ENV.dev;
  return ENV.prod;
};

export default getEnvVars();

