const chalk = require('chalk');
const log = console.log;
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

var HappyPack = require('happypack');
const os = require('os');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const helpers = require('../helpers')
log(chalk.green('fecli root:', helpers.feRoot()))
log(chalk.green('project root:', helpers.root()))

var config = {
  context: helpers.root(),
  mode: helpers.getModel(),
  target: 'web',

  resolve: {
    modules: [
      helpers.root(),
      helpers.root('../node_modules'),
      helpers.feRoot('node_modules'),
      helpers.feRoot('node_modules/antd/node_modules')
    ],
    alias: {
      
    },
    extensions: ['.web.js','.js', '.json', '.ts', '.tsx']
  },

  resolveLoader: {
    modules: [helpers.root('../node_modules'), helpers.feRoot('node_modules')]
  },

  output: {
    publicPath: helpers.production() ? (helpers.feConfig.cdn || helpers.feConfig.baseUrl ): helpers.feConfig.baseUrl,
    path: helpers.dest(),
    filename: !helpers.production() ? '[name].js' : '[name]-[chunkhash:6].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          helpers.root(''),
        ],
        loader: 'happypack/loader?id=happybabel'
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto'
      },
      {
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: "postcss-loader",
						options: {
							plugins: [
								require("autoprefixer")({
									overrideBrowserslist: [
										"ie >= 11",
										"ff >= 30",
										"chrome >= 34",
										"safari >= 7",
										"opera >= 23",
										"ios >= 7",
										"android >= 4.4",
										"bb >= 10"
									]
								}),
								require('postcss-px2rem')({remUnit: 75})
							]
						}
					},
				],
			},
			{
				test: /\.less$/,
				use: [
          MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: "postcss-loader",
						options: {
							plugins: [
								require("autoprefixer")({
									overrideBrowserslist: [
										"ie >= 11",
										"ff >= 30",
										"chrome >= 34",
										"safari >= 7",
										"opera >= 23",
										"ios >= 7",
										"android >= 4.4",
										"bb >= 10"
									]
								}),
								require('postcss-px2rem')({remUnit: 75})
							]
						}
					},
					'less-loader'
				],
				// exclude: /node_modules/
			},
			{
				test: /\.scss$/,
        use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: "postcss-loader",
						options: {
							plugins: [
								require("autoprefixer")({
									overrideBrowserslist: [
										"ie >= 11",
										"ff >= 30",
										"chrome >= 34",
										"safari >= 7",
										"opera >= 23",
										"ios >= 7",
										"android >= 4.4",
										"bb >= 10"
									]
								}),
								require('postcss-px2rem')({remUnit: 75})
							]
						}
					},
					'sass-loader',
				],
				// exclude: /node_modules/
			},
      // {
      //   test: (name) => {
      //     if (/\.s?css$/.test(name)) {
      //       return !/\.module\.s?css$/.test(name)
      //     } else {
      //       return false
      //     }
      //   },
      //   use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=css-pack']
      // },
      // {
      //   test: /\.module\.s?css$/,
      //   use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=sass-module-pack']
      // },
      // {
      //   test: /\.module\.less$/,
      //   use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=less-module-pack']
      // },
      // {
      //   test: (name) => {
      //     if (/\.less$/.test(name)) {
      //       return !/\.module\.less$/.test(name)
      //     } else {
      //       return false
      //     }
      //   },
      //   use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=less-pack']

      // },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [helpers.root('../index.html')]
      },

      {
        test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /antd-mobile.*\.svg$/i,
        use: {
          loader: 'svg-sprite-loader',
        }
      },
      {
        test: /\.(jpe?g|png|gif|ico|xlsx)/,
        loader: 'file-loader',
        //loader: 'file-loader',
        options: {
          context: helpers.root(),
          name: '[path][name].[ext]?[hash:8]'
        }
      },
      { 
        test:/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use:'file-loader' 
      }
    ]
  },

  plugins: [
    new ProgressBarPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: !helpers.production()
    }),
    new MiniCssExtractPlugin({filename: !helpers.production() ? '[name].css' : '[name]-[chunkhash:6].css', allChunks: true }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [
          autoprefixer
        ]
      }
    }),
    new HappyPack({
      id: 'happybabel',
      loaders: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            require.resolve('@babel/preset-env'), 
            require.resolve('@babel/preset-react'),
          ],
          plugins: [
            require.resolve('@babel/plugin-transform-async-to-generator'),
            require.resolve('@babel/plugin-syntax-dynamic-import'),
            require.resolve('@babel/plugin-proposal-class-properties'),
            require.resolve('@babel/plugin-proposal-export-default-from'),
            require.resolve('@babel/plugin-transform-runtime'),
            require.resolve('@babel/plugin-transform-modules-commonjs'),
            require.resolve('babel-plugin-dynamic-import-webpack'),
            [ require.resolve('babel-plugin-import'),
              {
                //style: 'css',
                libraryName: 'antd-mobile',
                //libraryDirectory: 'es'
              }
            ]
          ]
        }
      }],
      threadPool: happyThreadPool,
      // cache: true,
      verbose: true
    }),
    new HappyPack({
      id: 'css-pack',
      loaders: [
        {loader: 'css-loader', options: {minimize:helpers.production()}},
        {
          loader: "postcss-loader",
          options: {
            plugins: [
              require("autoprefixer")({
                overrideBrowserslist: [
                  "ie >= 11",
                  "ff >= 30",
                  "chrome >= 34",
                  "safari >= 7",
                  "opera >= 23",
                  "ios >= 7",
                  "android >= 4.4",
                  "bb >= 10"
                ]
              }),
              require('postcss-px2rem')({remUnit: 75})
            ]
          }
        },
        {loader: 'sass-loader'}
      ]
    }),
    new HappyPack({
      id: 'sass-pack',
      loaders: [
        {loader: 'css-loader', options: {minimize:helpers.production(), modules: true}},
        {
          loader: "postcss-loader",
          options: {
            plugins: [
              require("autoprefixer")({
                overrideBrowserslist: [
                  "ie >= 11",
                  "ff >= 30",
                  "chrome >= 34",
                  "safari >= 7",
                  "opera >= 23",
                  "ios >= 7",
                  "android >= 4.4",
                  "bb >= 10"
                ]
              }),
              require('postcss-px2rem')({remUnit: 75})
            ]
          }
        },
        {loader: 'sass-loader'}
      ]
    }),
    new HappyPack({
      id: 'less-pack',
      loaders: [
        {loader: 'css-loader', options: {minimize:helpers.production()}},
        {
          loader: "postcss-loader",
          options: {
            plugins: [
              require("autoprefixer")({
                overrideBrowserslist: [
                  "ie >= 11",
                  "ff >= 30",
                  "chrome >= 34",
                  "safari >= 7",
                  "opera >= 23",
                  "ios >= 7",
                  "android >= 4.4",
                  "bb >= 10"
                ]
              }),
              require('postcss-px2rem')({remUnit: 75})
            ]
          }
        },
        {loader: 'less-loader'}
      ]
    }),
    new HappyPack({
      id: 'less-module-pack',
      loaders: [
        {
          loader: 'css-loader', 
          options: {
            minimize:helpers.production(),
            camelCase: true,
            importLoaders: 1,
            modules: true,
          },
        },
        {loader: 'less-loader'}
      ]
    }),
    new HappyPack({
      id: 'sass-module-pack',
      loaders: [
        {
          loader: 'css-loader', 
          options: {
            minimize:helpers.production(),
            camelCase: true,
            importLoaders: 1,
            modules: true,
          },
        },
        {loader: 'sass-loader'}
      ]
    })
  ]
}
if (helpers.production()) {
  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  );
}

module.exports = config
