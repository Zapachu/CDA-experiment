"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var path = require("path");
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var tsconfig_paths_webpack_plugin_1 = require("tsconfig-paths-webpack-plugin");
// import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
var HtmlWebpackPlugin = require("html-webpack-plugin");
var tsImportPluginFactory = require("ts-import-plugin");
var webpack = require("webpack");
var common_1 = require("../../common");
module.exports = function (_a) {
    var webpackHmr = _a.webpackHmr;
    var buildMode = process.env.npm_config_buildMode || 'dev';
    var webpackHotDevEntry = webpackHmr ? ["webpack-hot-middleware/client?path=/" + common_1.config.rootName + "/__webpack_hmr&reload=true"] : [];
    return {
        mode: buildMode === 'dev' ? 'development' : 'production',
        devtool: buildMode === 'dev' ? 'eval' : '',
        watch: buildMode === 'dev',
        watchOptions: {
            poll: true
        },
        entry: __spread(webpackHotDevEntry, [path.resolve(__dirname, '../../client/index.tsx')]),
        output: {
            path: path.resolve(__dirname, '../../../static'),
            filename: 'ElfLinker.js',
            library: 'ElfLinker',
            libraryTarget: 'umd',
            publicPath: "/" + common_1.config.rootName + "/static/"
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
            alias: {
                '@ant-design/icons/lib/dist$': path.resolve(__dirname, '../component/AntDesignIcon.ts')
            },
            plugins: [new tsconfig_paths_webpack_plugin_1.TsconfigPathsPlugin({
                    configFile: path.resolve(__dirname, "../../../tsconfig.json")
                })]
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        getCustomTransformers: function () { return ({
                            before: [tsImportPluginFactory()]
                        }); },
                        compilerOptions: {
                            module: 'es6'
                        }
                    },
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
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [path.resolve(__dirname, '../../common/resource')]
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.(svg|png|jpg)$/,
                    exclude: /node_modules/,
                    use: 'url-loader?limit=1500&name=img/[name].[hash:base64:4].[ext]'
                }
            ]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'antd': 'antd'
        },
        plugins: [
            new clean_webpack_plugin_1.CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                hash: true,
                filename: 'index.html',
                favicon: path.resolve(__dirname, './favicon.ico'),
                template: path.resolve(__dirname, './index.html')
            })
        ].concat(buildMode === 'dist' ? [
        // new BundleAnalyzerPlugin()
        ] : webpackHmr ? [
            new webpack.HotModuleReplacementPlugin()
        ] : [])
    };
};
//# sourceMappingURL=webpack.js.map