const config = require('@zcloak/dev/config/jest.cjs');

module.exports = {
  ...config,
  moduleNameMapper: {},
  testTimeout: 30000
};
