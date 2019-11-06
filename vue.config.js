// see https://cli.vuejs.org/config/#integrity

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/', // base path for the application
  configureWebpack: {
    devtool: 'source-map',
    // plugins: [new BundleAnalyzerPlugin()]
  },
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '^/gokb': {
        target: 'https://phaeton-qa.hbz-nrw.de/',
        // cookieDomainRewrite: 'localhost',
        // cookiePathRewrite: '/',
        changeOrigin: true,
        logLevel: 'debug',
      },
    }
  },
  lintOnSave: process.env.NODE_ENV !== 'production', // not lint in production mode
  runtimeCompiler: false, // no runtime compiler, we use .vue
  productionSourceMap: true,
  parallel: undefined,

  css: {
    sourceMap: true
  },
  // configureWebpack: {}
  // chainWebpack:
  transpileDependencies: [
    'resize-detector',
    'vuetify'
  ],
}
