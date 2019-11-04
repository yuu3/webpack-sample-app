const path = require('path')
const fs = require('fs')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = env => {
  const NODE_ENV = (env && env.production) ? 'production' : 'development'
  return [{
    /**
     * module for JavaScript
     */
    mode: NODE_ENV,
    context: path.resolve(__dirname, './src'),
    entry: {
      app: path.resolve(__dirname, './src/app.js'),
    },
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname,'dist'),
    },
    devtool: NODE_ENV === 'development' ? 'source-map' : 'none',
    devServer: {
      clientLogLevel: 'warning',
      contentBase: path.resolve(__dirname,'dist'),
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
        },
      ]
    },
    optimization: {
      minimizer: NODE_ENV === 'production' ? [] : [
        new UglifyJSPlugin({
          cache: true,
          exclude: /\/node_modules/,
        })
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.html'),
        filename: 'index.html',
      }),
      new FaviconsWebpackPlugin({
        logo: path.resolve(__dirname, './public/webpack.png'),
        prefix: './dist/',
        outputPath: path.resolve(__dirname, './dist')
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, './manifest.json'),
          to: path.resolve(__dirname, './dist')
        }
      ]),
      new WorkboxWebpackPlugin.GenerateSW({
        // globDirectory: path.resolve(__dirname, './dist'),
        // globPatterns: ['*.{html,js,css}', 'images/**/*.{jpg,jpeg,png,gif,webp,svg}'],
        swDest: path.resolve(__dirname, './dist/sw.js'),
        clientsClaim: true,
        skipWaiting: true,
      }),
    ],
    resolve: {
      extensions: ['.js']
    },
    watch: NODE_ENV === 'development'
  },{
    /**
     * module for css
     */
    mode: NODE_ENV,
    context: path.resolve(__dirname, './assets'),
    entry: {
      app: path.resolve(__dirname, './assets/app.scss')
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'app.css'
    },
    devtool: NODE_ENV === 'development' ? 'source-map' : 'none',
    context: path.resolve(__dirname, './assets'),
    module: {
      rules: [{
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
      }],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: path.resolve(__dirname, './dist/app.css'),
      })
    ],
    optimization: {
      minimizer: [
        new MiniCssExtractPlugin({
          filename: path.resolve(__dirname, './dist/app.css'),
        }),
      ]
    }
  }]
}