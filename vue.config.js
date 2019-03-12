// see https://cli.vuejs.org/config/#integrity

module.exports = {
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '^/gokb': {
        target: 'https://gokbt.gbv.de',
        changeOrigin: true,
        logLevel: 'debug',
      },
    }
  },
  lintOnSave: process.env.NODE_ENV !== 'production', // not lint in production mode
  runtimeCompiler: false, // no runtime compiler, we use .vue
  productionSourceMap: false,
  parallel: undefined,

  css: {
    sourceMap: false
  }
  // configureWebpack: {}
  // chainWebpack:
}
