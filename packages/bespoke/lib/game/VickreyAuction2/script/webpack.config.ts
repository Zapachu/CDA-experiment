import {geneClientBuilder} from '../../../core/client/script/webpack.game'
import {namespace} from '../config'
import {resolve} from 'path'

export = geneClientBuilder(namespace, {
    buildMode: 'dist',
    namespacePath: resolve(__dirname, '../'),
    entryPath: resolve(__dirname, '../view'),
    outputPath: resolve(__dirname, '../dist')
})