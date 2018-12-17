const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const sorting = require('postcss-sorting')

const build = {
  entry: {
    index: path.resolve(__dirname, 'src/pages/index.js'),
    output: path.resolve(__dirname, 'src/pages/output.js'),
  },
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'js/[name].js?[hash]'
  },
  module: {
    rules: [
      // Babel
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      // Styles
      {
        test: /\.(sa|sc|c)ss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                url: false,
                minimize: true,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  sorting(),
                  autoprefixer({
                    browsers: ['ie >= 8', 'last 4 version']
                  })
                ],
                sourceMap: true
              }
            },
            {loader: 'sass-loader'}
          ]
        })
      },
      // Pug
      {
        test: /\.pug$/,
        use: {
          loader: 'pug-loader',
          options: {
            pretty: true
          }
        }
      },
      // Vue
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: true
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Index',
      filename: 'index.html',
      template: './src/pug/index.pug',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'Output',
      filename: 'output.html',
      template: './src/pug/output.pug',
      chunks: ['output']
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].css?[hash]'
    })
  ]
}

const dev = {
  ...build,
  devServer: {
    contentBase: path.join(__dirname, './'),
    compress: true,
    port: 9000
  }
}

module.exports = env => {
  return env === 'development' ? build : dev
}