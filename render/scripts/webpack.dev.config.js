module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    target: 'electron-renderer',
    devServer: {
      port: 8043,
      open: true,
      hot: true,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: false,
          warnings: false,
        },
      },
    },
  }
  