const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const AssetsPlugin = require('assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin'); 

const helpers = require('../helpers');

const commonConfig = require('./webpack.common');


const vendorWebpackConfig = {

  entry: {
    vendor: helpers.feConfig.vendor
  },

  output: {
    publicPath: helpers.production() ? helpers.feConfig.baseUrl : '/',
    path: helpers.dest(),
    library: '[name]_dll',
  },

  plugins: [
    new CleanWebpackPlugin(helpers.dest(), { root: helpers.dest('../'), exclude: ['*.zip'] }),

    new webpack.DllPlugin({
      path: helpers.dest('vendor-manifest.json'),
      name: '[name]_dll'
    }),

    new AssetsPlugin({
      fullPath: false,
      filename: 'vendor-assets.json',
      path: helpers.dest()
    })
  ]
}

const mergedConfig = webpackMerge(commonConfig, vendorWebpackConfig);

module.exports = mergedConfig
