const path = require('path')
const rimraf = require('rimraf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HappyPackPlugin = require('happypack')
const os = require('os')
const happyThreadPool = HappyPackPlugin.ThreadPool({ size: os.cpus().length })

const resolve = (src) => {
    return path.join(process.cwd(), src)
}

rimraf.sync('dist')

module.exports = {
    entry: {
        main: resolve('src/index.js'),
        vendor: [
            'lodash'
        ]
    },
    output: {
        filename: "[name].[hash].js",
        chunkFilename: "[name].bundle.js",
        path: resolve('dist')
    },
    module: {
        rules: [{
            test: /\.(less|css)$/,
            use: [
                'style-loader',
                'css-loader'
            ],
            include: resolve('src')
        }, {
            test: /\.(png|jpg|svg|jpeg)$/,
            use: [
                'file-loader'
            ]
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        }, {
            test: /.*\.(jsx|js|ts)$/,
            use: ['ts-loader'],
            exclude: /node_modules/,
            include: resolve('src')
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new HappyPackPlugin({
            id: 'babel',
            loaders: ['ts-loader'],
            threadPool: happyThreadPool,
            verbose: true
        })

    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2,
                }
            }
        }
    }
}
