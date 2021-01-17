const path = require('path');

module.exports = {
  mode: 'none',
  entry: './src/main.ts',
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.join(__dirname, "dist"),
    filename: "app.js"
  },
  resolve: {
    modules: [
      "node_modules",
    ],
    alias: {
      'pixi.js': 'pixi.js/dist/pixi.min.js',
      '@': path.join(__dirname, 'src'),
    },
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]' },
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          /* config.module.rule('images').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          /* config.module.rule('media').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: 'C:\\Users\\Max\\Desktop\\Projects\\fall\\fall\\node_modules\\.cache\\ts-loader',
              cacheIdentifier: '47b0d504'
            }
          },
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [
                '\\.vue$'
              ],
              happyPackMode: false
            }
          }
        ]
      },
    ]
  },
  performance: {
    hints: false
  }
};
