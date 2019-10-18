"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var webpack = require("webpack");
var QiniuPlugin = require("qiniu-webpack-plugin");
var ManifestPlugin = require("webpack-manifest-plugin");
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var share_1 = require("@bespoke/share");
var setting_1 = require("@elf/setting");
var util_1 = require("@elf/util");
var defaultPaths = {
    entry: './src/view',
    output: './dist'
};
function resolvePaths(basePath, paths) {
    var p = {};
    for (var key in paths) {
        p[key] = path_1.resolve(basePath, paths[key] || defaultPaths[key]);
    }
    return p;
}
function geneClientBuilder(_a) {
    var _b, _c;
    var namespace = _a.namespace, basePath = _a.basePath, _d = _a.paths, paths = _d === void 0 ? defaultPaths : _d, _e = _a.qiNiu, qiNiu = _e === void 0 ? setting_1.elfSetting.qiNiu : _e;
    var _f = resolvePaths(basePath, paths), entry = _f.entry, output = _f.output;
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
            filename: "[name].js",
            publicPath: buildMode === 'publish' ? qiNiu.download.jsDomain + "/" + qiNiu.upload.path + "/" : "/" + share_1.config.rootName + "/" + namespace + "/static/"
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
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.less$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        { loader: 'less-loader', options: { javascriptEnabled: true } }
                    ]
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
                    test: /\.(svg|png|jpg|gif|json|fnt|mp3|ttf)$/,
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
            '@elf/component': 'ElfComponent',
            'antd': 'antd'
        },
        plugins: [
            new ManifestPlugin({
                fileName: namespace + ".json",
                filter: function (descriptor) { return descriptor.isInitial; },
                generate: function (seed, files) {
                    return files.reduce(function (manifest, _a) {
                        var _b;
                        var name = _a.name, path = _a.path, chunk = _a.chunk;
                        return __assign(__assign({}, manifest), (_b = {}, _b[name] = path + (chunk ? "?" + chunk.hash : ''), _b));
                    }, seed);
                }
            })
        ].concat(buildMode === 'publish' ? [
            new QiniuPlugin(qiNiu.upload)
        ] : buildMode === 'dist' ? [
            new clean_webpack_plugin_1.CleanWebpackPlugin()
        ] : HMR ? [
            new webpack.HotModuleReplacementPlugin()
        ] : [])
    };
}
exports.geneClientBuilder = geneClientBuilder;
