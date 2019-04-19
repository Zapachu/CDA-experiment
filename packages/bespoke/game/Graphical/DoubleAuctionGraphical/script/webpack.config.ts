import {resolve} from 'path'
import {geneClientBuilder} from 'bespoke-client-util/build/buildGame'
import {namespace} from '../src/config'

export = geneClientBuilder({
    namespace,
    basePath: resolve(__dirname, '..')
})
