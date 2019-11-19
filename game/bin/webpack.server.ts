import * as webpack from 'webpack'
import { resolve } from 'path'
import externals = require('externals-dependencies')

const project = process.env.PROJECT
export = {
  mode: 'production',
  entry: resolve(__dirname, `../${project}/src/serve.ts`),
  output: {
    path: resolve(__dirname, `../${project}/build`),
    filename: 'serve.js'
  },
  target: 'node',
  context: __dirname,
  node: {
    __filename: false,
    __dirname: false
  },
  externals: externals(),
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
      }
    ]
  }
} as webpack.Configuration
