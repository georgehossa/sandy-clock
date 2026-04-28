module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  ignorePatterns: ['node_modules/', 'dist/', 'ios/', 'android/', '.expo/', 'coverage/'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
  },
};
