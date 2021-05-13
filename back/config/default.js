module.exports = {
  port: process.env.HTTP_PORT || 4000,
  env: process.env.NODE_ENV || 'development',
  appVersion: process.env.APP_VERSION || '1.0.0',
  appName: process.env.APP_NAME || 'demo-api',
  appUrl: process.env.APP_URL || 'http://localhost:4000',
  baseUrl: process.env.APP_BASE_URL || '/',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    allowMethods: ['GET', 'POST'],
  },
  firewallAuthorizedHosts: process.env.FIREWALL_AUTHORIZED_HOSTS || '^localhost,',
  appSearch: {
    baseUrlFn: () => process.env.ENTERPRISE_SEARCH_URL || 'http://localhost:3002',
    engineName: process.env.ENTERPRISE_SEARCH_INDEX || 'model-search-demo',
    apiKey: process.env.ENTERPRISE_SEARCH_PRIVATE_KEY
  },
  git: {
    repoUrl: 'https://huggingface.co/'
  },
  modelsUrl: 'https://huggingface.co/api/models'
}