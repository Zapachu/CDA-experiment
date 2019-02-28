import {resolve} from 'path'
import {buildClient} from 'bespoke-client-util/script/buildGame'
import {namespace} from '../src/config'

buildClient({
    namespace,
    buildMode: 'dist',
    basePath: resolve(__dirname, '..')
})