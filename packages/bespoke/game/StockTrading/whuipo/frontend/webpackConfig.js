const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const webpack = require('webpack')

const mode = process.env.mode
console.log(mode)
const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
    title: 'ipo',
    template: './public/build.html'
}),
new ProgressBarPlugin({
    format: '  build [:bar] :percent (:elapsed seconds)',
    clear: false,
    width: 60
}),
new webpack.DefinePlugin({
    APP_DEV_MODE: mode
})]

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[hash].js',
        path: mode === 'development' ? path.resolve(__dirname, '../dist') : path.resolve(__dirname, './dist'),
        publicPath: '/static/'
    },
    plugins: plugins,
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all'
    //     }
    // },
    externals: {
        babylonjs: 'BABYLON',
        // antd: 'antd'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            logInfoToStdOut: true,
                            experimentalWatchApi: true
                        }
                    }
                ]
            },
            {
                test: /\.css/,
                include: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.css/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        // options: {
                        //     modules: true
                        // }
                    },
                ]
            },
            {
                test: /\.less/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                exclude: /node_modules/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                exclude: /node_modules/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    }
}