import * as _dtsGenerator from 'dts-generator'
import {resolve} from 'path'
import {readFileSync} from 'fs'

const dtsGenerator = (_dtsGenerator as any).default as typeof _dtsGenerator

const {
    compilerOptions: {
        paths
    }
} = JSON.parse(readFileSync(resolve(__dirname, '../../../tsconfig.json')).toString())

const MODULE_NAME = 'elf-linker'

dtsGenerator({
    baseDir:resolve(__dirname, '../../../'),
    name: MODULE_NAME,
    project: resolve(__dirname, '../../../'),
    out: resolve(__dirname, '../../../build/elf-linker.d.ts'),
    main: `${MODULE_NAME}/client/vendor`,
    exclude: ['node_modules/**/*',
        'src/server/**/*.ts',
        'src/client/component/**.*',
        'src/client/global.d.ts'
    ],
    resolveModuleId: ({currentModuleId}) => `${MODULE_NAME}/${currentModuleId.replace(/\/index$/, '')}`,
    resolveModuleImport: ({importedModuleId, currentModuleId}) => {
        if (paths[importedModuleId]) {
            return `${MODULE_NAME}/${paths[importedModuleId]}`
        }
        if (importedModuleId.startsWith('./') && importedModuleId.endsWith('index')) {
            const curDir = `${MODULE_NAME}/${currentModuleId.substring(0,currentModuleId.lastIndexOf('/'))}`
            if (importedModuleId === './index') {
                return curDir
            }
            const newImportedModuleId = importedModuleId.substring(2, importedModuleId.length - 6)
            return `${curDir}/${newImportedModuleId}`
        }
        return null
    }
})