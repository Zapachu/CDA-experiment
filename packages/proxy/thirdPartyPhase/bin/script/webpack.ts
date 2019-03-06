const fs = require('fs')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin'),
    ManifestPlugin = require('webpack-manifest-plugin'),
    TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

export = () => {
    const {npm_config_buildMode: buildMode = 'dev', npm_config_phase: phase = ''} = process.env
    return {
        devtool: buildMode === 'dev' ? 'eval' : '',
        mode: buildMode === 'dev' ? 'development' : 'production',
        watch: buildMode === 'dev',
        watchOptions: {
            poll: true
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
                    test: /\.(svg|png|jpg)$/,
                    exclude: /node_modules/,
                    use: 'url-loader?limit=1500&name=img/[name].[hash].[ext]'
                }
            ]
        },
        entry: {
            [phase]: path.resolve(__dirname, `../../lib/phases/${phase}/view/view.tsx`)
        },
        output: {
            path: path.resolve(__dirname, `../../dist/phase`),
            filename: `${phase}.[hash:4].js`,
            publicPath: `/${phase}Phase/static/phase/`
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'elf-linker': 'ElfLinker'
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
