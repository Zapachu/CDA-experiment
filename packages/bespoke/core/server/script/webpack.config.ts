import * as path from 'path'
import * as CleanWebpackPlugin from 'clean-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as QiniuPlugin from 'qiniu-webpack-plugin'
import {config} from 'bespoke-common'
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
    entry: path.resolve(__dirname, '../src/frontend/index.tsx'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: `[name].[hash:4]${buildMode === 'dev' ? '' : '.min'}.js`,
        publicPath: buildMode === 'publish' ? `${qiNiu.download.jsDomain}/${qiNiu.upload.path}/` : `/${config.rootName}/static/`,
        library: 'BespokeServer',
        libraryTarget: 'umd',
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
                exclude: [
                    /node_modules/
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
        'bespoke-client-util': 'BespokeClientUtil'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            clientUtilBundlePath: `/${config.rootName}/static/bespoke-client-util.min.js`,
            template: path.resolve(__dirname, './index.html')
        }),
        new CleanWebpackPlugin('main*.js', {
            root: path.resolve(__dirname, `../dist`),
            watch: true
        })
    ].concat(buildMode === 'publish' ? [
        new QiniuPlugin(qiNiu.upload)
    ] : [])
}