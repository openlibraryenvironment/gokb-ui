process.env.VUE_APP_GIT_HASH = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString().trim()

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/', // base path for the application
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    client: {
      overlay: {
        warnings: true,
        errors: true
      }
    }
  },

  // not lint in production mode
  lintOnSave: process.env.NODE_ENV !== 'production',

  productionSourceMap: false,

  transpileDependencies: [
    'resize-detector',
    'vuetify'
  ],

  pwa: {
    name: 'GOKb'
  }
}
