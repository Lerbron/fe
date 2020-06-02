const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const moment = require('moment');
const chalk = require('chalk');
const log = console.log;
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //开启多核压缩
const helpers = require('../helpers')
const commonConfig = require('./webpack.common')
const dllConfig = require(helpers.dest('vendor-assets.json'))
const currentTime = moment(new Date()).format('YYYYMMDDHHmmss');

const fs = require('fs');
fs.writeFile(helpers.dest('version.json'), JSON.stringify({
  version: currentTime
}), (err) => {
  if (err) {
    log(chalk.red(err))
    throw err;
  }
});

const entryConfig = {
  entry: helpers.feConfig.entry,

  devtool: helpers.production() ? 'none' : 'source-map',

  plugins: [
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery'
    // }),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: !helpers.production(),
      __BASENAME__: JSON.stringify(helpers.feConfig.baseUrl),
      __VERSION__: currentTime
    }),
    new webpack.DllReferencePlugin({
      context: helpers.root(),
      manifest: require(helpers.dest('vendor-manifest.json'))
    }),

    new HtmlWebpackPlugin({
      template: helpers.root('../index.html'),
      filename: helpers.dest('index.html'),
      base: helpers.feConfig.baseUrl,
      buildTime: new Date().toLocaleString()
    }),

    new AddAssetHtmlPlugin({
      filepath: helpers.dest(dllConfig.vendor.js),
      includeSourcemap: false
    }),

    new CaseSensitivePathsPlugin()
  ]
}


if (dllConfig.vendor.css) {
  entryConfig.plugins.push(
    new AddAssetHtmlPlugin({
      filepath: helpers.dest(dllConfig.vendor.css),
      includeSourcemap: false,
      typeOfAsset: 'css'
    })
  )
}

if (!helpers.production()) {
  const port = app.port || 9000
} else {
  entryConfig.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            ie8: true,
          },
          ecma: 5,
          mangle: true,
          output: {
            comments: false,
          }
        },
        sourceMap: helpers.production()
      }),
    ]
  }
}


module.exports = webpackMerge(commonConfig, entryConfig)