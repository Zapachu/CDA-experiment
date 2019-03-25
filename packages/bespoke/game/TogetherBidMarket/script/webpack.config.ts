import {resolve} from 'path'
import {geneClientBuilder} from '../../bin/buildGame'
import {namespace} from '../src/config'

export = geneClientBuilder({
    namespace,
    buildMode: 'dev',
    basePath: resolve(__dirname, '..')
})
