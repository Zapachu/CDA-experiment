import * as path from 'path'
import * as fs from 'fs'
import * as chokidar from 'chokidar'
import * as pbjs from 'protobufjs/cli/pbjs'
import * as pbts from 'protobufjs/cli/pbts'
import setting from '../../lib/core/server/config/setting'
import {config} from '../../lib/core/common'
import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin'

const {qiNiu} = setting
const CleanWebpackPlugin = require('clean-webpack-plugin'),
    ManifestPlugin = require('webpack-manifest-plugin'),
    QiniuPlugin = require('qiniu-webpack-plugin')

function buildProtoDts(namespace:string, watch:boolean=false) {
    const gamePath = path.resolve(__dirname, `../../lib/game/${namespace}`)

    function build() {
        pbjs.main(['-t', 'static-module', '-w', 'commonjs', '-o', `${gamePath}/interface.js`, `${gamePath}/interface.proto`], () =>
            pbts.main(['-o', `${gamePath}/interface.d.ts`, `${gamePath}/interface.js`], () =>
                fs.unlinkSync(path.resolve(__dirname, `${gamePath}/interface.js`))
            )
        )
    }

    build()
    if(watch){
        chokidar.watch(`${gamePath}/interface.proto`).on('change', build)
    }
}

export = () => {
    const buildMode = process.env.npm_config_buildMode || 'dev',
        nspPrefix = process.env.npm_config_namespace
    if (!nspPrefix) {
        console.warn(`Missing required argument \`namespace\`, try "npm run game:build --namespace=ContinuousDoubleAuction" ?`)
        throw new Error()
    }
    const namespace = fs.readdirSync(path.resolve(__dirname, '../../lib/game'))
        .find(namespace => namespace.toLowerCase().startsWith(nspPrefix.toLowerCase()))
    if (!namespace) {
        console.warn('Game namespace not found')
        throw new Error()
    }
    buildProtoDts(namespace, buildMode === 'dev')
    return {
        devtool: buildMode === 'dev' ? 'eval' : '',
        mode: buildMode === 'dev' ? 'development' : 'production',
        watch: buildMode === 'dev',
        watchOptions: {
            poll: true
        },
        entry: {
            [namespace]: path.resolve(__dirname, `../../lib/game/${namespace}/view`)
        },
        output: {
            path: path.resolve(__dirname, `../../dist`),
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
                                includePaths: [path.resolve(__dirname, '../../lib/core/common/resource')]
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
                            name: `[path]/[name].[ext]`,
                            context:'lib/game'
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
            new ManifestPlugin({
                fileName: config.buildManifest.gameFile,
                generate: (seed, files) => {
                    const filePath = path.resolve(__dirname, `../../dist/bespokeGame.json`)
                    if (fs.existsSync(filePath)) {
                        seed = {...JSON.parse(fs.readFileSync(filePath).toString()), ...seed}
                    }
                    return files.reduce((manifest, {name, path}) => ({...manifest, [name]: path}), seed)
                }
            }),
            new CleanWebpackPlugin([`${namespace}.*.js`], {
                root: path.resolve(__dirname, `../../dist`),
                watch: true
            })
        ].concat(buildMode === 'publish' ? [
            new QiniuPlugin(qiNiu.upload)
        ] : buildMode === 'dist' ? [
        ] : [])
    }
}