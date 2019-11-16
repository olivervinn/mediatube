var path = require('path')

module.exports = {
  devServer: {
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*'
    },
    proxy: 'https://<external host>',
    staticOptions: {}
  },
  publicPath: '/'
}
