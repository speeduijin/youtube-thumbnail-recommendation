/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb', 'airbnb-typescript', 'prettier'],
  ignorePatterns: ['.eslintrc.cjs', 'build'],
};
