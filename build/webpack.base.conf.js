const webpack = require('webpack')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const RemovePlugin = require('remove-files-webpack-plugin')
const {getChunks} = require('./utils/chunks')

const paths = {
  src: path.resolve(__dirname, '../src'),
  dist: path.resolve(__dirname, '../dist'),
  assets: './',
}

const spriteFilename = 'img/sprite.svg'

const pagesDir = `${paths.src}/pages`
const pages = fs
  .readdirSync(pagesDir)
  .map((dir) => {
    const dirPath = `${pagesDir}/${dir}`
    return fs
      .readdirSync(dirPath)
      .filter((fileName) => fileName.endsWith('.pug'))
      .map((page) => `${dir}/${page}`)
  })
  .flat()

module.exports = {
  // BASE config
  externals: {
    paths,
    pages,
    pagesDir,
  },

  entry: glob.sync(`${paths.src}/pages/**/*.js`).reduce((acc, el) => ({...acc, [path.parse(el).name]: el}), {
    common: `${paths.src}/js/common.js`,
    sprite: glob.sync(`${paths.src}/img/svg-icons/*.svg`),
  }),

  output: {
    filename: `${paths.assets}js/[name].js`,
    path: paths.dist,
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                modules: 'auto',
                targets: {
                  browsers: '> 1%, IE 11, not dead',
                },
              },
            ],
          ],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      },

      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true,
        },
      },

      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: ({filename}) => `${filename.replace('src/', '')}`,
        },
      },

      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              symbolId: (filePath) => `icon-${path.basename(filePath).split('.').slice(0, -1).join('.')}`,
              spriteFilename,
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.json', '.mp4'],
    alias: {
      '@': paths.src,
    },
  },

  plugins: [
    new Dotenv({path: path.resolve(__dirname, '../.env')}),

    new CopyWebpackPlugin({
      patterns: [
        {from: `${paths.src}/static/docs`, to: `${paths.assets}docs`},
        {from: `${paths.src}/static/api`, to: `${paths.assets}api`},
        {from: `${paths.src}/static/favicon/`, to: `${paths.dist}`},
        {from: `${paths.src}/img`, to: `${paths.assets}img`},
        {from: `${paths.src}/fonts`, to: `${paths.assets}fonts`},
      ],
    }),

    new webpack.ProgressPlugin((percentage, message) => {
      console.log(`${(percentage * 100).toFixed()}% ${message}`)
    }),

    ...pages.map((pagePath) => {
      const page = pagePath.split('/').pop()

      return new HtmlWebpackPlugin({
        cache: process.env.NODE_ENV === 'development',
        template: `${pagesDir}/${pagePath}`,
        filename: `./${page.replace(/\.pug/, '.html')}`,
        chunks: getChunks(page),
        chunksSortMode: 'manual',
        inject: 'body',
        templateParameters: {spriteFilename},
        minify: false
      })
    }),

    new SpriteLoaderPlugin(),

    new RemovePlugin({
      after: {
        include: [`${paths.dist}/js/sprite.js`],
      },
    }),
  ],
}
