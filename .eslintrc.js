module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'plugin:prettier/recommended', 'prettier'],
  plugins: ['prettier', '@typescript-eslint'],
  // add your custom rules here
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-console': 0,
    'no-console': 0,
  },
}
