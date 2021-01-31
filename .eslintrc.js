module.exports = {
  root: true,

  plugins: ['jest', 'unicorn'],

  extends: [
    'airbnb',
    'plugin:jest/recommended',
    'plugin:unicorn/recommended',
    'prettier',
    'prettier/react',
  ],

  env: {
    node: true,
    browser: true,
    jest: true,
  },

  rules: {
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/prevent-abbreviations': 'off',
  },
}
