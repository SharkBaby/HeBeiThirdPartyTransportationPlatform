'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf') //引入webpack基础配置文件，然后进行dev环境的定制配置
const CopyWebpackPlugin = require('copy-webpack-plugin') //Copies individual files or entire directories to the build directory.
const HtmlWebpackPlugin = require('html-webpack-plugin') //HtmlWebpackPlugin简化了HTML文件的创建，以便为你的webpack包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // Update by : Perry
    // Update Date: 2018-04-25
    // Update Reason: cannot import css file in main.js file, based on internet , set the usePostCSS: false
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool, //此选项控制是否生成，以及如何生成 source map。

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning', //none, error, warning 或者 info（默认值）
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'app.html') },
      ],
    },
    // Update by : Perry
    // Update Date: 2018-05-15
    // Update Reason: set hot module update as false to decrease memory cost when development
    hot: true, //启用 webpack 的模块热替换特性
    contentBase: false, // since we use CopyWebpackPlugin. //告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
    compress: true, //一切服务都启用gzip 压缩(https://betterexplained.com/articles/how-to-optimize-your-site-with-gzip-compression/)
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser, //When open is enabled, the dev server will open the browser
    overlay: config.dev.errorOverlay //Shows a full-screen overlay in the browser when there are compiler errors or warnings. Disabled by default. If you want to show only compiler errors:
      ? { warnings: false, errors: true } //这里配置仅满屏显示错误的信息
      : false,
    publicPath: config.dev.assetsPublicPath, //此路径下的打包文件可在浏览器中访问。
    /**
     *
     proxy: {
       "/api": {
         target: "http://localhost:3000",
         pathRewrite: {
           "^/api": ""
         }
       }
     }
     */
    proxy: config.dev.proxyTable, //希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用：https://github.com/chimurai/http-proxy-middleware#options
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll, //ebpack 使用文件系统(file system)获取文件改动的通知
    }
  },
  plugins: [
    new webpack.DefinePlugin({ //这可能会对开发模式和发布模式的构建允许不同的行为非常有用
      'process.env': require('../config/dev.env')
    }),
    // Update by : Perry
    // Update Date: 2018-05-15
    // Update Reason: set hot module update as false to decrease memory cost when development
    new webpack.HotModuleReplacementPlugin(), //启用热替换模块(Hot Module Replacement)，也被称为 HMR
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(), //在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段
    
    // https://github.com/ampedandwired/html-webpack-plugin
    // 请参考上面github对于HtmlWebpackPlugin的各个配置项的含义
    new HtmlWebpackPlugin({
      filename: 'app.html', //The file to write the HTML to. Defaults to index.html
      template: 'app.html', //webpack require path to the template. Please see the docs(https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md) for details
      inject: true, // js插入的位置，true/'head'/'body'/false（Inject all assets into the given template or templateContent）
      hash: true, // 为静态资源生成hash值 - useful for cache busting
      chunks: ['app'], // 需要引入的chunk，不配置就会引入所有页面的资源
      minify: { //详情请参考GitHub官方配置：https://github.com/kangax/html-minifier#options-quick-reference
        // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: false // 删除空白符与换行符
      }
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
// 总结new Promise的用法
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
