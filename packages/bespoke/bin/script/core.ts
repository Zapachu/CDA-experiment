import * as path from 'path'
import setting from '../../lib/core/server/config/setting'
import {config} from '../../lib/core/common'
import * as webpack from 'webpack'
import * as CleanWebpackPlugin from 'clean-webpack-plugin'
import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as ManifestPlugin from 'webpack-manifest-plugin'
import * as QiniuPlugin from 'qiniu-webpack-plugin'

const {qiNiu} = setting

export = ({webpackHmr}: { webpackHmr: boolean }) => {
    const buildMode = process.env.npm_config_buildMode || 'dev'
    const webpackHotDevEntry = webpackHmr ? [`webpack-hot-middleware/client?path=/${config.rootName}/__webpack_hmr&reload=true`] : []
    return ({
        devtool: buildMode === 'dev' ? 'eval' : '',
        mode: buildMode === 'dev' ? 'development' : 'production',
        watch: buildMode === 'dev',
        watchOptions: {
            poll: true
        },
        entry: {
            [config.buildManifest.clientVendorLib]: [...webpackHotDevEntry, path.resolve(__dirname, '../../lib/core/client/vendor/index.ts')],
            [config.buildManifest.clientCoreLib]: [...webpackHotDevEntry, path.resolve(__dirname, '../../lib/core/client/index.tsx')]
        },
        output: {
            path: path.resolve(__dirname, '../../dist'),
            filename: '[name].[hash:4].js',
            library: '[name]',
            libraryTarget: 'umd',
            publicPath: buildMode === 'publish' ? `${qiNiu.download.jsDomain}/${qiNiu.upload.path}/` : `/${config.rootName}/static/`
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
            plugins: [new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, `../../tsconfig.json`)
            })]
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(scss|sass)$/,
                    include: [
                        path.resolve(__dirname, '../../lib/core/client/component/Switch')
                    ],
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[local]'
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [path.resolve(__dirname, '../../lib/core/common/resource')]
                            }
                        }
                    ]
                },
                {
                    test: /\.(scss|sass)$/,
                    exclude: [
                        /node_modules/,
                        path.resolve(__dirname, '../../lib/core/client/component/Switch')
                    ],
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[local]_[hash:base64:4]'
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [path.resolve(__dirname, '../../lib/core/common/resource')]
                            }
                        }
                    ]
                }
            ]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'elf-game': 'elfCore',
            'client-vendor': config.buildManifest.clientVendorLib
        },
        plugins: [
            new ManifestPlugin({
                fileName: config.buildManifest.coreFile
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.resolve(__dirname, '../../lib/core/server/view/index.html')
            }),
            new CleanWebpackPlugin([`${config.buildManifest.clientCoreLib}.*.js`, `${config.buildManifest.clientVendorLib}.*.js`], {
                root: path.resolve(__dirname, `../../dist`),
                watch: true
            })
        ].concat(buildMode === 'publish' ? [
            new QiniuPlugin(qiNiu.upload)
        ] : buildMode === 'dist' ? [
        ] : webpackHmr ? [
            new webpack.HotModuleReplacementPlugin()
        ] : [])
    })
}