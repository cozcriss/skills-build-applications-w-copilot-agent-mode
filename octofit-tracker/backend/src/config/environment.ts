/**
 * Normalize port to string for URL construction
 */
const normalizePort = (port: string | number | undefined): string => {
  return String(port || 8000);
};

/**
 * Get the API base URL based on environment
 * For Codespaces: https://$CODESPACE_NAME-8000.app.github.dev
 * For localhost: http://localhost:8000
 */
export const getApiBaseUrl = (): string => {
  const codespaceName = process.env.CODESPACE_NAME;
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }
  const port = normalizePort(process.env.PORT);
  return `http://localhost:${port}`;
};

/**
 * Get the server listening URL
 */
export const getServerUrl = (): string => {
  const codespaceName = process.env.CODESPACE_NAME;
  const port = normalizePort(process.env.PORT);
  
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }
  return `http://localhost:${port}`;
};

/**
 * Get environment info for logging
 */
export const getEnvironmentInfo = () => {
  const codespaceName = process.env.CODESPACE_NAME;
  const port = normalizePort(process.env.PORT);
  
  return {
    env: process.env.NODE_ENV || 'development',
    codespace: codespaceName || 'local',
    port: port,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db',
  };
};
