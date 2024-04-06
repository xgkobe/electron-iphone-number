const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require("webpack");
const webpack = require('webpack');
module.exports = {
  entry: {
    index: "./src/main.js",
  },
  target: "electron-renderer",
  output: {
    filename: 'scripts/[name].index.prod.js',
    path: path.resolve(__dirname, "../../renderDist"),
    publicPath: "/",
    clean: true, // 打包构建前清除dist文件中无用的
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devtool: "inline-source-map",
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: true,
      template: path.resolve(__dirname, "../index.html"),
    }),
    new DefinePlugin({
      VERSION: JSON.stringify('5fa3b9'),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[fullhash:5].css',
      chunkFilename: 'css/[id].[fullhash:5].css',
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    alias: {
      component: path.resolve(__dirname, '../src/components'),
      pages: path.resolve(__dirname, '../src/pages'),
      '@': path.resolve(__dirname, '../'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
            //   loader: "jsx", // Remove this if you're not using JSX
            //   target: "es2015", // Syntax to compile to (see options below for possible values)
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb 大于4kb 视为resource 模块类型
          }
        },
        generator: {
          filename: 'assets/[name].[hash:5].[ext]'
        }
      }
    ],
  },
};

