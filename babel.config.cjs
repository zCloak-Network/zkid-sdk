
const config = require('@zcloak/dev/config/babel-config-cjs.cjs');

module.exports = {
  ...config,
  plugins: [
    ...config.plugins,
    process.env.NODE_ENV === 'test' ? 'dynamic-import-node' : null
  ].filter(Boolean)
};
