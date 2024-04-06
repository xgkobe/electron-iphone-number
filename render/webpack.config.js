const { merge } = require('webpack-merge');
const commonConfig = require('./scripts/webpack.base.config');
const devConfig = require('./scripts/webpack.dev.config');
const proConfig = require('./scripts/webpack.pro.config');

module.exports = () => {
  switch(process.env.NODE_ENV) {
    case 'development':
      return merge(commonConfig, devConfig);
    default:
      return merge(commonConfig, proConfig);
  }
}