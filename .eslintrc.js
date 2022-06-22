module.exports = {
  root: true,
  extends: ['prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    curly: 'off'
  },
  env: {
    es6: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8
    // ecmaFeatures: {
    //   jsx: true,
    //   experimentalObjectRestSpread: true
    // }
  }
};
