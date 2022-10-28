const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const { paths } = baseWebpackConfig.externals;

module.exports = merge(baseWebpackConfig, {
  // DEV config
  mode: 'development',
  output: {
    publicPath: '/'
  },
  devServer: {
    contentBase: `${paths.dist}/html`,
    port: 8081,
    openPage: 'index.html',
    overlay: {
      warnings: false,
      errors: true
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false,
            }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true, }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    })
  ]
});
