import { resolve } from 'path'
import { geneClientBuilder } from '@bespoke/server/script/buildGame'
import { namespace } from '../src/config'

/**
 *  默认以 src/view 为入口， 打包至 dist/
 */
export = geneClientBuilder({
  namespace,
  basePath: resolve(__dirname, '..')
})
