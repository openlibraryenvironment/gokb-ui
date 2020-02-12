module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    'vuetify',
  ],
  plugins: [
    'vuetify'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ["error", "only-multiline"],
    'vuetify/no-deprecated-classes': 'error'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
}
