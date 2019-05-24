import {NetworkInterfaceInfo, networkInterfaces} from 'os'
import {resolve} from 'path'
import * as fs from 'fs'
import * as chokidar from 'chokidar'
import * as pbjs from 'protobufjs/cli/pbjs'
import * as pbts from 'protobufjs/cli/pbts'
import * as webpack from 'webpack'
import * as QiniuPlugin from 'qiniu-webpack-plugin'
import * as ManifestPlugin from 'webpack-manifest-plugin'
import * as CleanWebpackPlugin from 'clean-webpack-plugin'
import {config} from 'bespoke-common'
import {elfSetting} from 'elf-setting'

interface IPaths {
    proto?: string
    entry?: string
    output?: string
}

const defaultPaths: IPaths = {
    proto: './src/interface.proto',
    entry: './src/view',
    output: './dist'
}

function getIp() {
    let ip: string = '127.0.0.1'
    Object.values<NetworkInterfaceInfo[]>(networkInterfaces()).forEach(infos => {
        infos.forEach(({family, internal, address}) => {
            if (family === 'IPv4' && !internal) {
                ip = address
            }
        })
    })
    return ip
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
    if (!fs.existsSync(`${p}.proto`)) {
        return
    }

    function build() {
        pbjs.main(['-t', 'static-module', '-w', 'commonjs', '-o', `${p}.js`, `${p}.proto`], () =>
            pbts.main(['-o', `${p}.d.ts`, `${p}.js`], () =>
                fs.unlinkSync(`${p}.js`)
            )
        )
    }

    build()
    if (watch) {
        chokidar.watch(`${p}.proto`).on('change', build)
    }
}

interface IBuildOption {
    namespace: string
    basePath: string
    paths?: IPaths
    qiNiu?: typeof elfSetting.qiNiu
}

export function geneClientBuilder(
    {
        namespace,
        basePath,
        paths,
        qiNiu
    }: IBuildOption): webpack.Configuration {
    const {proto, entry, output} = resolvePaths(basePath, paths)
    const buildMode = process.env.BUILD_MODE || 'dev',
        HMR = process.env.HMR === 'true'
    buildProtoDts(proto, buildMode === 'dev')
    return {
        devtool: buildMode === 'dev' ? 'cheap-module-eval-source-map' : false,
        devServer: {
            host: '0.0.0.0',
            port: config.devPort.client,
            proxy: {
                [`/${config.rootName}`]: {
                    target: `http://${getIp()}:${config.devPort.server}`,
                    ws: true
                }
            }
        },
        mode: buildMode === 'dev' ? 'development' : 'production',
        watch: buildMode === 'dev',
        watchOptions: {poll: true},
        entry: {[namespace]: entry},
        output: {
            path: output,
            filename: `[name]${HMR ? '' : '.[hash:4]'}.js`,
            publicPath: buildMode === 'publish' ? `${qiNiu.download.jsDomain}/${qiNiu.upload.path}/${namespace}` : `/${config.rootName}/${namespace}/static/`
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                experimentalWatchApi: true
                            }
                        }
                    ],
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
                        'sass-loader'
                    ]
                },
                {
                    type: 'javascript/auto',
                    test: /\.(svg|png|jpg|gif|json|fnt)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: `[path][name].[ext]`
                        }
                    }
                }
            ]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'bespoke-client-util': 'BespokeClientUtil'
        },
        plugins: [
            new ManifestPlugin({
                fileName: `${namespace}.json`
            })
        ].concat(buildMode === 'publish' ? [
            new QiniuPlugin(qiNiu.upload)
        ] : buildMode === 'dist' ? [
            new CleanWebpackPlugin(`${namespace}.*`, {
                root: output
            })
        ] : [
            new webpack.HotModuleReplacementPlugin()
        ])
    } as any
}
