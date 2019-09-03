const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
import {CleanWebpackPlugin} from 'clean-webpack-plugin'
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const webpack = require('webpack')

const mode = process.env.npm_config_mode || 'development'

const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './index.html')
    }),
    new ProgressBarPlugin({
        format: '  build [:bar] :percent (:elapsed seconds)',
        clear: false,
        width: 60
    }),
    new webpack.DefinePlugin({
        APP_TYPE: `'${mode}'`
    })
]

module.exports = {
    devtool: mode === 'development' ? 'eval' : '',
    mode: mode === 'development' ? 'development' : 'production',
    watch: mode === 'development',
    entry: './frontend/index.tsx',
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/static/'
    },
    plugins: plugins,
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    externals: {
        babylonjs: 'BABYLON',
        react: 'React',
        'react-dom': 'ReactDOM'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
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
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.css/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64:4]'
                            },
                            importLoaders: 1
                        }
                    }
                ]
            },
            {
                test: /\.(scss|sass)$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64:4]'
                            },
                            importLoaders: 1
                        }
                    },
                    'sass-loader'
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
                            modules: {
                                localIdentName: '[local]_[hash:base64:4]'
                            },
                            importLoaders: 1
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|mp4|obj|gltf|glb|mtl)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                exclude: /node_modules/,
                use: ['file-loader']
            }
        ]
    }
}
