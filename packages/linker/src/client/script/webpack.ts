import * as path from 'path'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin'
// import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import tsImportPluginFactory = require( 'ts-import-plugin')
import * as webpack from 'webpack'
import {config} from '../../common'

export = ({webpackHmr}: { webpackHmr: boolean }) => {
    const buildMode = process.env.npm_config_buildMode || 'dev'
    const webpackHotDevEntry = webpackHmr ? [`webpack-hot-middleware/client?path=/${config.rootName}/__webpack_hmr&reload=true`] : []
    return {
        mode: buildMode === 'dev' ? 'development' : 'production',
        devtool: buildMode === 'dev' ? 'eval' : '',
        watch: buildMode === 'dev',
        watchOptions: {
            poll: true
        },
        entry: [...webpackHotDevEntry, path.resolve(__dirname, '../../client/index.tsx')],
        output: {
            path: path.resolve(__dirname, '../../../static'),
            filename: 'ElfLinker.js',
            library: 'ElfLinker',
            libraryTarget: 'umd',
            publicPath: `/${config.rootName}/static/`
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
            alias: {
                '@ant-design/icons/lib/dist$': path.resolve(__dirname, '../component/AntDesignIcon.ts')
            },
            plugins: [new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, `../../../tsconfig.json`)
            })]
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        getCustomTransformers: () => ({
                            before: [tsImportPluginFactory()]
                        }),
                        compilerOptions: {
                            module: 'es6'
                        }
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
                                includePaths: [path.resolve(__dirname, '../../common/resource')]
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.(svg|png|jpg)$/,
                    exclude: /node_modules/,
                    use: 'url-loader?limit=1500&name=img/[name].[hash:base64:4].[ext]'
                }
            ]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'antd':'antd'
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                hash:true,
                filename: 'index.html',
                favicon:path.resolve(__dirname, './favicon.ico'),
                template: path.resolve(__dirname, './index.html')
            })
        ].concat(buildMode === 'dist' ? [
            // new BundleAnalyzerPlugin()
        ] : webpackHmr ? [
            new webpack.HotModuleReplacementPlugin()
        ] : [])
    }
}
