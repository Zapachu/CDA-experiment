import {resolve} from 'path'
import * as fs from 'fs'
import * as chokidar from 'chokidar'
import * as pbjs from 'protobufjs/cli/pbjs'
import * as pbts from 'protobufjs/cli/pbts'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as QiniuPlugin from 'qiniu-webpack-plugin'
import * as ManifestPlugin from 'webpack-manifest-plugin'
import * as CleanWebpackPlugin from 'clean-webpack-plugin'
import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin'
import {config, IQiniuConfig} from '../../common'

interface IPaths {
    resource?: string
    proto?: string
    entry?: string
    output?: string
}

const defaultPaths: IPaths = {
    resource: './resource',
    proto: './src/interface.proto',
    entry: './src/view',
    output: './dist'
}

function resolvePaths(basePath, paths: IPaths = defaultPaths): IPaths {
    const p: IPaths = {}
    for (let key in paths) {
        p[key] = resolve(basePath, paths[key] || defaultPaths[key])
    }
    return p
}

function buildProtoDts(protoPath: string, watch: boolean = false) {
    const p = protoPath.replace('.proto', '')

    function build() {
        pbjs.main(['-t', 'static-module', '-w', 'commonjs', '-o', `${p}.js`, `${p}.proto`], () =>
            pbts.main(['-o', `${p}.d.ts`, `${p}.js`], () =>
                fs.unlinkSync(resolve(__dirname, `${p}.js`))
            )
        )
    }

    build()
    if (watch) {
        chokidar.watch(`${p}.proto`).on('change', build)
    }
}

export function geneClientBuilder(namespace: string, {
    buildMode = 'dev',
    basePath,
    paths,
    qiNiu
}: {
    buildMode?: 'dev' | 'dist' | 'publish'
    basePath: string
    paths?: IPaths
    qiNiu?: IQiniuConfig
}) {
    const {resource, proto, entry, output} = resolvePaths(basePath, paths)
    buildProtoDts(proto, buildMode === 'dev')
    return {
        devtool: buildMode === 'dev' ? 'cheap-module-eval-source-map' : '',
        mode: buildMode === 'dev' ? 'development' : 'production',
        watch: buildMode === 'dev',
        watchOptions: {poll: true},
        entry: {[namespace]: entry},
        output: {
            path: output,
            filename: '[name].[hash:4].js',
            library: '[name]',
            libraryTarget: 'umd',
            publicPath: buildMode === 'publish' ? `${qiNiu.download.jsDomain}/${qiNiu.upload.path}/` : `/${config.rootName}/${namespace}/static/`
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
            plugins: [new TsconfigPathsPlugin({//TODO core提取为package后移除此插件
                configFile: resolve(__dirname, `../../../../tsconfig.json`)
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
                                includePaths: [resolve(__dirname, '../../common/resource')]
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
                            context: resource
                        }
                    }
                }
            ]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'elf-game': 'elfCore',
            '@dev/client': config.buildManifest.clientVendorLib
        },
        plugins: [
            new ManifestPlugin({
                fileName: `${namespace}.json`
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: resolve(__dirname, '../dist/index.html')
            }),
            new CleanWebpackPlugin('*', {
                root: output,
                watch: true
            })
        ].concat(buildMode === 'publish' ? [
            new QiniuPlugin(qiNiu.upload)
        ] : buildMode === 'dist' ? [] : [])
    }
}