import {geneClientBuilder} from '../../../core/client/script/webpack.game'
import {namespace} from '../src/config'
import {resolve} from 'path'

export = geneClientBuilder(namespace, {
    buildMode: 'dist',
    basePath: resolve(__dirname, '..')
})