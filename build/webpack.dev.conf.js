'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const path = require('path')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

var program = require('commander');
program
    .version('0.0.1')
    .option('-e, --entry <n> ', '添加入口')
    .option('-op, --outpath <n> ', '输入文件路径')
    .option('-h, --htmltemplate <n> ', 'html模板路径')
    .parse(process.argv);

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = [path.resolve(__dirname, './dev-client')].concat(path.resolve(__dirname, '../src/',program.entry))
})

// Object.keys(baseWebpackConfig.entry).forEach(function (name) {
//   baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
// })

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
          filename: 'index.html',
          template: path.resolve(__dirname, '../src/',program.htmltemplate),
          inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
    // var pages = {
    //    'index': './src/mobile/jsqbProject/activity/a2/index.html'
    // } //utils.getMultiEntry('./src/view/**/*.html');
    // for (var pathname in pages) {
    // // 配置生成的html文件，定义路径等
    // var conf = {
    //     filename: pathname + '.html',
    //     template: pages[pathname], // 模板路径
    //     chunks: [pathname, 'vendors', 'manifest'], // 每个html引用的js模块
    //     inject: true              // js插入位置
    // };
    // // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
    // module.exports.plugins.push(new HtmlWebpackPlugin(conf));
//}
//http://localhost:3000/jsqbProject/activity/index.htmll