import {resolve} from 'path'
import {geneClientBuilder} from 'bespoke-server/script/buildGame'
import {namespace} from '../src/config'

export = geneClientBuilder({
    namespace,
    basePath: resolve(__dirname, '..')
})
