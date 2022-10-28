// autoprefixer - https://github.com/postcss/autoprefixer
// cssnano      - https://github.com/cssnano/cssnano

// npm install postcss-loader autoprefixer cssnano --save-dev

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: [
        'default', {
          discardComments: {
            removeAll: true
          }
        }
      ]
    })
  ]
}
