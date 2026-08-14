/**
 * Get the API base URL based on environment
 * For Codespaces: https://$CODESPACE_NAME-8000.app.github.dev
 * For localhost: http://localhost:8000
 */
export const getApiBaseUrl = (): string => {
  if (process.env.CODESPACE_NAME) {
    return `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`;
  }
  return `http://localhost:${process.env.PORT || 8000}`;
};

/**
 * Get the server listening URL
 */
export const getServerUrl = (): string => {
  const port = process.env.PORT || 8000;
  if (process.env.CODESPACE_NAME) {
    return `https://${process.env.CODESPACE_NAME}-${port}.app.github.dev`;
  }
  return `http://localhost:${port}`;
};

/**
 * Get environment info for logging
 */
export const getEnvironmentInfo = () => {
  return {
    env: process.env.NODE_ENV || 'development',
    codespace: process.env.CODESPACE_NAME || 'local',
    port: process.env.PORT || 8000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db',
  };
};
