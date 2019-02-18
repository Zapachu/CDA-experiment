import * as path from 'path'
import {register as registerTsConfigPath} from 'tsconfig-paths'

import tsconfig = require('./tsconfig.json')

const {compilerOptions: {paths, baseUrl}} = tsconfig

registerTsConfigPath({
    baseUrl: path.resolve(__dirname, `./${baseUrl}`),
    paths
})