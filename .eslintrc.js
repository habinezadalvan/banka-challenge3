module.exports = {
  env: {
    es6: true,
    node: true, 
    jest: true
  },
  plugins:['import'],

  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "import/prefer-default-export": 0,
    "import/no-unresolved": 0,
    "import/no-dynamic-require": 0
  },
};
