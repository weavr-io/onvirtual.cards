module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: ['@nuxtjs', 'prettier', 'prettier/vue', 'plugin:prettier/recommended', 'plugin:nuxt/recommended'],
  plugins: ['prettier', '@typescript-eslint'],
  // add your custom rules here
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-console': 0,
    'no-console': 0
  }
}
