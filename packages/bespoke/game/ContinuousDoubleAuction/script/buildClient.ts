require('../../../registerTsconfig')
import {resolve} from 'path'
import {buildClient} from '@dev/client/script/buildGame'
import {namespace} from '../src/config'

buildClient({
    namespace,
    buildMode: 'dist',
    basePath: resolve(__dirname, '..')
})