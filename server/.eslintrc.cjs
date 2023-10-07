/* eslint-env node */
module.exports = {
  root: true,
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './server/tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['.eslintrc.cjs', 'dist/'],
};
