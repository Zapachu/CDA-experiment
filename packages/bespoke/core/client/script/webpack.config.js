"use strict";
var path = require("path");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var QiniuPlugin = require("qiniu-webpack-plugin");
var bespoke_common_1 = require("bespoke-common");
var elf_setting_1 = require("elf-setting");
var qiNiu = elf_setting_1.elfSetting.qiNiu;
var buildMode = process.env.npm_config_buildMode || 'dev';
module.exports = {
    devtool: buildMode === 'dev' ? 'eval' : '',
    mode: buildMode === 'dev' ? 'development' : 'production',
    watch: buildMode === 'dev',
    watchOptions: {
        poll: true
    },
    entry: path.resolve(__dirname, '../lib/index.ts'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "bespoke-client-util" + (buildMode === 'dev' ? '' : '.min') + ".js",
        library: 'BespokeClientUtil',
        libraryTarget: 'umd',
        publicPath: buildMode === 'publish' ? qiNiu.download.jsDomain + "/" + qiNiu.upload.path + "/" : "/" + bespoke_common_1.config.rootName + "/static/"
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
        'react': 'React',
        'react-dom': 'ReactDOM',
        'elf-linker': 'ElfLinker'
    },
    plugins: [
        new CleanWebpackPlugin('*', {
            root: path.resolve(__dirname, "../dist"),
            watch: true
        })
    ].concat(buildMode === 'publish' ? [
        new QiniuPlugin(qiNiu.upload)
    ] : [])
};
//# sourceMappingURL=webpack.config.js.map