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
    baseUrlFn: () => `${process.env.ENTERPRISE_SEARCH_URL}/api/as/v1/`,
    engineName: 'model-search-demo',
    apiKey: 'eEFUWG9JNmRqeWdoM1R2dnZlRkp0cFl0dlZwemp3ditPM3ZGNjNUYXlmd3FkNm9SQzdLUmlqWnlvcENodXVXNi0tQkI4WDg2ajNwdHZXNGJ4WmNjUmdrQT09--033c1f0bf5cb93b76e209e254c6310057a18cd27'
  },
  git: {
    baseDir: '/tmp',
    maxConcurrentProcesses: 6,
    binary: '/usr/bin/git',
    baseUrl: 'https://huggingface.co/'
  },
  modelsUrl: 'https://huggingface.co/api/models'
}