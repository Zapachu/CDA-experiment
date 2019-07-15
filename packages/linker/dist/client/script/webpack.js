"use strict";
var path = require("path");
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var tsconfig_paths_webpack_plugin_1 = require("tsconfig-paths-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var common_1 = require("../../common");
module.exports = function () {
    var buildMode = process.env.npm_config_buildMode || 'dev';
    return {
        mode: buildMode === 'dev' ? 'development' : 'production',
        devtool: buildMode === 'dev' ? 'eval' : '',
        watch: buildMode === 'dev',
        watchOptions: {
            poll: true
        },
        entry: path.resolve(__dirname, '../../client/index.tsx'),
        output: {
            path: path.resolve(__dirname, '../../../static'),
            filename: 'ElfLinker.js',
            library: 'ElfLinker',
            libraryTarget: 'umd',
            publicPath: "/" + common_1.config.rootName + "/static/"
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
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
                        transpileOnly: true
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
        ] : [])
    };
};
//# sourceMappingURL=webpack.js.map