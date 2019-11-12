const path = require('path');
const fs = require('fs');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = env => {
  const NODE_ENV = (env && env.production) ? 'production' : 'development'
  return {
    /**
     * module for JavaScript
     */
    mode: NODE_ENV,
    context: path.resolve(__dirname, './src'),
    entry: {
      app: path.resolve(__dirname, './src/app.js')
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, './dist')
    },
    devtool: NODE_ENV === 'development' ? 'inline-source-map' : 'none',
    watch: NODE_ENV === 'development',
    resolve: {
      extensions: ['.js', '.css']
    },
    devServer: {
      clientLogLevel: 'warning',
      contentBase: path.resolve(__dirname, './dist'),
      overlay: true,
      inline: true,
      disableHostCheck: true,
      port: 3000,
      https: {
        key: fs.readFileSync(path.resolve(__dirname, './localhost-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, './localhost.pem'))
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            }
          }
        },{
          test: /\.(sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                 url: false,
              }
            },
            'sass-loader'
          ]
        },{
          test: /\.(png|jpg|svg|gif)$/,
          use: {
            loader: 'file-loader'
          }
        },{
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: {
            loader: 'file-loader'
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.html'),
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin({
        filename: './[name].css',
        chunkFilename: 'id.css',
        ignoreOrder: false
      }),
      new FaviconsWebpackPlugin({
        logo: path.resolve(__dirname, './public/webpack.png'),
        prefix: 'dist',
        outputPath: path.resolve(__dirname, './dist')
      }),
      new WorkboxWebpackPlugin.GenerateSW({
        swDest: path.resolve(__dirname, './dist/sw.js'),
        clientsClaim: true,
        skipWaiting: true,
      })
    ],
    optimization: {
      minimizer: NODE_ENV === 'production' ? [] : [
        new UglifyJSPlugin({
          cache: true,
          exclude: /\/node_modules/,
        })
      ],
      splitChunks: {
        chunks: 'all',
      }
    },
  }
}