const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const WorkboxPlugin = require('workbox-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const common = require('./webpack.common')

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new UglifyJSPlugin({
            sourceMap: false
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DefinePlugin({
            'progress.env.NODE_ENV': JSON.stringify('production')
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        }),
        new CompressionPlugin({
            test: /(\.js|\.css)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ],
})
