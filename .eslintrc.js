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
    'brace-style': ["error", "1tbs", {"allowSingleLine": true}],
    'max-len': 'off',
    'indent': 'off',
    'template-curly-spacing': 'off',
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/script-indent': ['error', 2, {
      'baseIndent': 1,
      'switchCase': 1,
      'ignores': []
    }],
    'vue/max-attributes-per-line': ['error', {
      'singleline': 1,
      'multiline': {
        'max': 1,
        'allowFirstLine': false
      }
    }],
    'vue/html-closing-bracket-newline': ['error', {
      'singleline': 'never',
      'multiline': 'always'
    }],
    'vue/html-closing-bracket-spacing': 'error',
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/grid-unknown-attributes': 'error',
    'vuetify/no-legacy-grid': 'error'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
}
