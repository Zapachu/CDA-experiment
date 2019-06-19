import * as path from 'path'
import * as CleanWebpackPlugin from 'clean-webpack-plugin'
import * as QiniuPlugin from 'qiniu-webpack-plugin'
import {elfSetting} from 'elf-setting'

const {qiNiu} = elfSetting
const buildMode = process.env.npm_config_buildMode || 'dev'

export = {
    devtool: buildMode === 'dev' ? 'eval' : '',
    mode: buildMode === 'dev' ? 'development' : 'production',
    watch: buildMode === 'dev',
    watchOptions: {
        poll: true
    },
    entry: path.resolve(__dirname, '../lib/index.ts'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                options:{
                    compilerOptions:{
                        "emitDeclarationOnly": false,
                    }
                },
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
        'react': 'react',
        'react-dom': 'react-dom',
        'elf-linker': 'ElfLinker'
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