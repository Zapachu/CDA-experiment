import {resolve} from 'path'
import {geneClientBuilder} from '../../bin/buildGame'
import {namespace} from '../src/config'

export = geneClientBuilder({
    namespace,
    basePath: resolve(__dirname, '..')
})
