'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    // Update by : Perry
    // Update Date: 2018-04-26
    // Update Reason: build up vue-router page
    app: './src/main.js',
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    // 注释人：向浩
    // 注释时间：2018-07-27
    // 注释原因：使用webpack的代码分离来进行分模块打包，使用[name].[chunkhash].js
    // chunkFilename: 'js/[id].chunk.js',
    chunkFilename: 'js/[name].[chunkhash].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'], //自动解析确定的扩展-能够使用户在引入模块时不带扩展
    alias: { //创建 import 或 require 的别名，来确保模块引入变得更简单
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/, //以.vue结尾的文件使用vue-loader分为很多子文件和子组件开发
        loader: 'vue-loader',
        options: vueLoaderConfig,
        // 注释人：向浩
        // 注释时间：2018-06-19
        // 注释原因：取消热更新模式
        // options: {
        //   hotReload: false // disables Hot Reload
        // }
      },
      {
        test: /\.js$/, //以.vue结尾的文件使用vue-loader分为很多子文件和子组件开发
        // Update by : Perry
        // Update Date: 2018-05-15
        // Update Reason: 1. add cacheDirectory; 2. exclude node_modules from exclude list
        loader: 'babel-loader?cacheDirectory',
        exclude: ['/node_modules/'],
        include: [resolve('src')],  // resolve('test'), resolve('node_modules/webpack-dev-server/client')
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader', //图片格式-Loads files as base64 encoded URL
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader', //视频-音频文件Loads files as base64 encoded URL
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader', //字体文件-Loads files as base64 encoded URL
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
