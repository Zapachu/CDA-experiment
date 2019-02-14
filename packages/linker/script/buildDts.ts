import * as _dtsGenerator from 'dts-generator'
import {resolve} from 'path'
import {readFileSync} from 'fs'

const dtsGenerator = (_dtsGenerator as any).default as typeof _dtsGenerator

const {
    compilerOptions: {
        baseUrl,
        paths
    }
} = JSON.parse(readFileSync(resolve(__dirname, '../../tsconfig.json')).toString())

const MODULE_NAME = 'elf-game'

dtsGenerator({
    name: MODULE_NAME,
    project: resolve(__dirname, '../../'),
    out: resolve(__dirname, '../../build/elf-game.d.ts'),
    main: `${MODULE_NAME}/lib/game/client/vendor`,
    exclude: ['node_modules/**/*.d.ts',
        './lib/game/server/**/*.ts',
        './lib/game/client/component/MaterialUI.tsx',
        './lib/game/client/global.d.ts'
    ],
    resolveModuleId: ({currentModuleId}) => `${MODULE_NAME}/${currentModuleId.replace(/\/index$/, '')}`,
    resolveModuleImport: ({importedModuleId, currentModuleId}) => {
        if (paths[importedModuleId]) {
            return `${MODULE_NAME}/lib/${paths[importedModuleId]}`
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