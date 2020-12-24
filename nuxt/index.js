const { resolve } = require('path')

module.exports = function nuxtVWave(moduleOptions) {
  const options = Object.assign({}, this.options.vSharedElement, moduleOptions)

  this.addPlugin({
    ssr: false,
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'v-shared-element-plugin.js',
    options
  })
}

module.exports.meta = require('../package.json')
