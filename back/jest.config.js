module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: './tests/tsconfig.json',
    },
  },
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: ['src/**/*.ts*'],
  // This timeout allow the first database creation
  // Migration + views
  testTimeout: 20000,
}
