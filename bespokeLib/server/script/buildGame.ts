import {resolve} from 'path'
import * as webpack from 'webpack'
import * as QiniuPlugin from 'qiniu-webpack-plugin'
import * as ManifestPlugin from 'webpack-manifest-plugin'
import {CleanWebpackPlugin} from 'clean-webpack-plugin'
import {config} from '@bespoke/share'
import {elfSetting} from '@elf/setting'
import {NetWork} from '@elf/util'

interface IPaths {
  entry?: string
  output?: string
}

const defaultPaths: IPaths = {
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
  const {entry, output} = resolvePaths(basePath, paths)
  const buildMode = process.env.BUILD_MODE || 'dev',
      HMR = process.env.HMR === 'true'
  return {
    devtool: buildMode === 'dev' ? 'cheap-module-eval-source-map' : false,
    devServer: {
      host: '0.0.0.0',
      port: config.devPort.client,
      proxy: {
        [`/${config.rootName}`]: {
          target: `http://${NetWork.getIp()}:${config.devPort.server}`,
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
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.less$/,
          use: [
            "style-loader",
            "css-loader",
            { loader: "less-loader", options: { javascriptEnabled: true } }
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
      '@elf/component': 'ElfComponent',
      'antd':'antd'
    },
    plugins: [
      new ManifestPlugin({
        fileName: `${namespace}.json`
      })
    ].concat(buildMode === 'publish' ? [
      new QiniuPlugin(qiNiu.upload)
    ] : buildMode === 'dist' ? [
      new CleanWebpackPlugin()
    ] : [
      new webpack.HotModuleReplacementPlugin()
    ])
  } as any
}
