import * as path from 'path'
import * as CleanWebpackPlugin from 'clean-webpack-plugin'
import * as QiniuPlugin from 'qiniu-webpack-plugin'
import {config} from 'bespoke-common'
import {qiNiu} from './setting'

const buildMode = process.env.npm_config_buildMode || 'dev'

export = {
    devtool: buildMode === 'dev' ? 'eval' : '',
    mode: buildMode === 'dev' ? 'development' : 'production',
    watch: buildMode === 'dev',
    watchOptions: {
        poll: true
    },
    entry: {
        [config.buildManifest.clientVendorLib]: path.resolve(__dirname, '../lib/index.ts'),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: `[name]${buildMode==='dev'?'':'.min'}.js`,
        library: '[name]',
        libraryTarget: 'umd',
        publicPath: buildMode === 'publish' ? `${qiNiu.download.jsDomain}/${qiNiu.upload.path}/` : `/${config.rootName}/static/`
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
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
                    path.resolve(__dirname, '../lib/component/Switch')
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
                            includePaths: [path.resolve(__dirname, '../lib/resource')]
                        }
                    }
                ]
            },
            {
                test: /\.(scss|sass)$/,
                exclude: [
                    /node_modules/,
                    path.resolve(__dirname, '../lib/component/Switch')
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
                            includePaths: [path.resolve(__dirname, '../lib/resource')]
                        }
                    }
                ]
            }
        ]
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'elf-linker': 'elfCore'
    },
    plugins: [
        new CleanWebpackPlugin('*', {
            root: path.resolve(__dirname, `../dist`),
            watch: true
        })
    ].concat(buildMode === 'publish' ? [
        new QiniuPlugin(qiNiu.upload)
    ] : [])
}