import {resolve} from 'path'
import {geneClientBuilder} from 'bespoke-client-util/script/buildGame'
import {namespace} from '../src/config'

export = geneClientBuilder({
    namespace,
    buildMode: 'dev',
    basePath: resolve(__dirname, '..')
})
