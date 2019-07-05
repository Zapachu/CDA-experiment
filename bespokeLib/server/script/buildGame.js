"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var webpack = require("webpack");
var QiniuPlugin = require("qiniu-webpack-plugin");
var ManifestPlugin = require("webpack-manifest-plugin");
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var share_1 = require("@bespoke/share");
var util_1 = require("@elf/util");
var defaultPaths = {
    entry: './src/view',
    output: './dist'
};
function resolvePaths(basePath, paths) {
    if (paths === void 0) { paths = defaultPaths; }
    var p = {};
    for (var key in paths) {
        p[key] = path_1.resolve(basePath, paths[key] || defaultPaths[key]);
    }
    return p;
}
function geneClientBuilder(_a) {
    var _b, _c;
    var namespace = _a.namespace, basePath = _a.basePath, paths = _a.paths, qiNiu = _a.qiNiu;
    var _d = resolvePaths(basePath, paths), entry = _d.entry, output = _d.output;
    var buildMode = process.env.BUILD_MODE || 'dev', HMR = process.env.HMR === 'true';
    return {
        devtool: buildMode === 'dev' ? 'cheap-module-eval-source-map' : false,
        devServer: {
            host: '0.0.0.0',
            port: share_1.config.devPort.client,
            proxy: (_b = {},
                _b["/" + share_1.config.rootName] = {
                    target: "http://" + util_1.NetWork.getIp() + ":" + share_1.config.devPort.server,
                    ws: true
                },
                _b)
        },
        mode: buildMode === 'dev' ? 'development' : 'production',
        watch: buildMode === 'dev',
        watchOptions: { poll: true },
        entry: (_c = {}, _c[namespace] = entry, _c),
        output: {
            path: output,
            filename: "[name]" + (HMR ? '' : '.[hash:4]') + ".js",
            publicPath: buildMode === 'publish' ? qiNiu.download.jsDomain + "/" + qiNiu.upload.path + "/" + namespace : "/" + share_1.config.rootName + "/" + namespace + "/static/"
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
                                modules: {
                                    localIdentName: '[local]_[hash:base64:4]'
                                },
                                importLoaders: 1
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
                            name: "[path][name].[ext]"
                        }
                    }
                }
            ]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            '@elf/component': 'ElfComponent'
        },
        plugins: [
            new ManifestPlugin({
                fileName: namespace + ".json"
            })
        ].concat(buildMode === 'publish' ? [
            new QiniuPlugin(qiNiu.upload)
        ] : buildMode === 'dist' ? [
            new clean_webpack_plugin_1.CleanWebpackPlugin()
        ] : [
            new webpack.HotModuleReplacementPlugin()
        ])
    };
}
exports.geneClientBuilder = geneClientBuilder;
