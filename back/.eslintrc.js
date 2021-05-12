module.exports = {
  extends: '../.eslintrc.typescript',
  // add your custom rules here
  rules: {},
  env: {
    jest: true,
    node: true,
    es6: true,
  },
  plugins: ['@typescript-eslint', 'jest'],
}
