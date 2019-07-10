import {namespace} from '../src/config'
import {resolve} from 'path'
import {geneClientBuilder} from '@bespoke/server/script/buildGame'

export = geneClientBuilder({
    namespace,
    basePath: resolve(__dirname, '..')
})
