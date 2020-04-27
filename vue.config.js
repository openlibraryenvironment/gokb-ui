module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/', // base path for the application
  configureWebpack: {
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name (module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              return `npm.${packageName.replace('@', '')}`
            },
          },
        },
      },
    },
    devtool: 'source-map'
  },

  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '^/rest': {
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        // logLevel: 'debug',
      },
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
