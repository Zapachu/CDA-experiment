import * as path from 'path'
import {CleanWebpackPlugin} from 'clean-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import {config} from 'linker-share'

const buildMode = process.env.npm_config_buildMode || 'dev'

export = {
    devtool: buildMode === 'dev' ? 'eval' : '',
    mode: buildMode === 'dev' ? 'development' : 'production',
    watch: buildMode === 'dev',
    watchOptions: {
        poll: true
    },
    entry: path.resolve(__dirname, '../src/frontend/index.tsx'),
    output: {
        path: path.resolve(__dirname, '../static'),
        filename: 'ElfLinker.js',
        library: 'ElfLinker',
        libraryTarget: 'umd',
        publicPath: `/${config.rootName}/static/`
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                },
                exclude: /node_modules/
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
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [path.resolve(__dirname, '../src/frontend/resource')]
                        }
                    }
                ]
            }
        ]
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'antd': 'antd'
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: 'index.html',
            favicon: path.resolve(__dirname, './favicon.ico'),
            template: path.resolve(__dirname, './index.html')
        }),
        new CleanWebpackPlugin()
    ].concat(buildMode === 'dist' ? [
        // new BundleAnalyzerPlugin()
    ] : [])
}