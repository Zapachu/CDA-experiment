const fs = require('fs')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin'),
    ManifestPlugin = require('webpack-manifest-plugin'),
    TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = ({phase, devMode} = {}) => ({
    mode: devMode ? 'development' : 'none',
    devtool: devMode ? 'eval' : '',
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
                    'css-loader?modules&importLoaders=1&localIdentName=[local]_[hash:base64:4]',
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [path.resolve(__dirname, '../../lib/core/common/resource')]
                        }
                    }
                ]
            },
            {
                test: /\.(svg|png|jpg)$/,
                exclude: /node_modules/,
                use: 'url-loader?limit=1500&name=img/[name].[hash].[ext]'
            }
        ]
    },
    ...(phase ? cfg4Phase(phase) : cfg4Core())
})

function cfg4Core() {
    return {
        entry: {
            'coreCommon': path.resolve(__dirname, '../../lib/core/common/index.ts'),
            'coreClient': path.resolve(__dirname, '../../lib/core/client/index.tsx')
        },
        output: {
            path: path.resolve(__dirname, '../../dist/core'),
            filename: '[name].[hash:4].js',
            library: '[name]',
            libraryTarget: 'umd',
            publicPath: '/elfPhase/static/core/'
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
        },
        plugins: [
            new CleanWebpackPlugin(['core/*.js'], {
                root: path.resolve(__dirname, `../../dist`),
                watch: true
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.resolve(__dirname, '../../lib/core/server/view/index.html')
            })
        ]
    }
}

function cfg4Phase(phase) {
    return {
        entry: {
            [phase]: path.resolve(__dirname, `../../lib/phases/${phase}/view/view`)
        },
        output: {
            path: path.resolve(__dirname, `../../dist/phase`),
            filename: `${phase}.[hash:4].js`,
            publicPath: `/${phase}Phase/static/phase/`
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            '@common': 'coreCommon',
            '@client': 'coreClient',
            'elf-game':'elfCore',
        },
        plugins: [
            new ManifestPlugin({
                fileName: '../manifest.json',
                generate: (seed, files) => {
                    const filePath = path.resolve(__dirname, `../../dist/manifest.json`)
                    if (fs.existsSync(filePath)) {
                        seed = {...JSON.parse(fs.readFileSync(filePath).toString()), ...seed}
                    }
                    return files.reduce((manifest, {name, path}) => ({...manifest, [name]: path}), seed)
                }
            }),
            new CleanWebpackPlugin([`phase/${phase}.*.js`], {
                root: path.resolve(__dirname, `../../dist`),
                watch: true
            })
        ]
    }
}
