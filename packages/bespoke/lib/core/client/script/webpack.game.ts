import * as path from 'path'
import * as fs from 'fs'
import * as chokidar from 'chokidar'
import * as pbjs from 'protobufjs/cli/pbjs'
import * as pbts from 'protobufjs/cli/pbts'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as QiniuPlugin from 'qiniu-webpack-plugin'
import * as CleanWebpackPlugin from 'clean-webpack-plugin'
import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin'
import {config, IQiniuConfig} from '../../common'

function buildProtoDts(namespace: string, namespacePath: string, watch: boolean = false) {
    function build() {
        pbjs.main(['-t', 'static-module', '-w', 'commonjs', '-o', `${namespacePath}/interface.js`, `${namespacePath}/interface.proto`], () =>
            pbts.main(['-o', `${namespacePath}/interface.d.ts`, `${namespacePath}/interface.js`], () =>
                fs.unlinkSync(path.resolve(__dirname, `${namespacePath}/interface.js`))
            )
        )
    }

    build()
    if (watch) {
        chokidar.watch(`${namespacePath}/interface.proto`).on('change', build)
    }
}

export function geneClientBuilder(namespace: string, {
    buildMode = 'dev',
    namespacePath,
    entryPath,
    outputPath,
    qiNiu
}: {
    buildMode?: 'dev' | 'dist' | 'publish'
    namespacePath: string
    entryPath: string
    outputPath: string
    qiNiu?: IQiniuConfig
}) {
    buildProtoDts(namespace, namespacePath, buildMode === 'dev')
    return {
        devtool: buildMode === 'dev' ? 'cheap-module-eval-source-map' : '',
        mode: buildMode === 'dev' ? 'development' : 'production',
        watch: buildMode === 'dev',
        watchOptions: {poll: true},
        entry: {[namespace]: entryPath},
        output: {
            path: outputPath,
            filename: '[name].[hash:4].js',
            library: '[name]',
            libraryTarget: 'umd',
            publicPath: buildMode === 'publish' ? `${qiNiu.download.jsDomain}/${qiNiu.upload.path}/` : `/${config.rootName}/${namespace}/static/`
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
            plugins: [new TsconfigPathsPlugin({//TODO core提取为package后移除此插件
                configFile: path.resolve(__dirname, `../../../../tsconfig.json`)
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
                    exclude: /node_modules/,
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
                                includePaths: [path.resolve(__dirname, '../../common/resource')]
                            }
                        }
                    ]
                },
                {
                    type: 'javascript/auto',
                    test: /\.(svg|png|jpg|json|fnt)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: `[path][name].[ext]`,
                            context: namespacePath
                        }
                    }
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
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.resolve(__dirname, '../dist/index.html')
            }),
            new CleanWebpackPlugin('*', {
                root: outputPath,
                watch: true
            })
        ].concat(buildMode === 'publish' ? [
            new QiniuPlugin(qiNiu.upload)
        ] : buildMode === 'dist' ? [] : [])
    }
}