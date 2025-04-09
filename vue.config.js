const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    'single-spa': {
      outputSystemJS: true,
    },
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/styles/variables/_index.scss'),
        path.resolve(__dirname, './src/styles/mixins/_index.scss'),
        path.resolve(__dirname, './src/styles/functions/_index.scss'),
      ],
    },
  },
  configureWebpack: {
    output: {
      libraryTarget: 'system',
    },
    // externals: ["vue", "vue-router"],
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/styles/app.scss";',
      },
    },
  },
  devServer: {
    port: 8081, // 將開發伺服器的端口設置為 8081
  },
})
