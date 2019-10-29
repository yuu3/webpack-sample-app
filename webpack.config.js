const path = require('path')
const weboack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = env => {
  const NODE_ENV = (env && env.production) ? 'production' : 'development'
  return [{
    /**
     * Module for JavaScript
     */
    mode: NODE_ENV,
    context: path.resolve(__dirname, './src'),
    entry: {
      app: path.resolve(__dirname, './src/app.js')
    },
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname,'dist'),
    },
    devtool: NODE_ENV === 'development' ? 'source-map' : 'none',
    devServer: {
      clientLogLevel: 'warning',
      contentBase: './dist',
      overlay: true,
      inline: true,
      disableHostCheck: true,
      host: '0.0.0.0',
      port: 3000
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
      minimizer: NODE_ENV === 'production' ? [
        // new webpack.optimize.OccurrenceOrderPlugin(false),
      ] : [
        // new webpack.optimize.OccurrenceOrderPlugin(true),
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
      path: path.resolve(__dirname,'./dist'),
      filename: 'app.css'
    },
    devtool: NODE_ENV === 'development' ? 'source-map' : 'none',
    context: path.resolve(__dirname, 'assets'),
    module: {
      rules: [{
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'style-loader',
        ]
      },{
        test: /\.scss$/,
        use: [{
          loader: 'css-loader',
        },{
          loader: 'sass-loader',
          options: {
            sourceMap: NODE_ENV === 'development'
          }
        }]
      }]
    },
    plugins: [
    //   new OptimizeCssAssetsPlugin({}),
      new MiniCssExtractPlugin({
        filename: path.resolve(__dirname, './dist/app.css')
      })
    ],
    optimization: {
      minimizer: [
        // new OptimizeCssAssetsPlugin({})
      ]
    }
  }]
}