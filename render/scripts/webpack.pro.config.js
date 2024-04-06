const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMiniMizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  output: {
    publicPath: "./",
  },
  optimization: {
    usedExports: true,
    minimizer: [
      new TerserWebpackPlugin(),
      new CssMiniMizerPlugin()
    ],
    splitChunks: {
      maxAsyncRequests: 6,
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial', // 只打包初始时依赖的第三方
        },
        antd: {
          name: 'chunk-antd',
          priority: 20,
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          chunks: 'all',
        },
      }
    },
    runtimeChunk: 'single',
  }
}

