import * as pbjs from 'protobufjs/cli/pbjs'
import * as pbts from 'protobufjs/cli/pbts'
import * as path from 'path'
import * as fs from 'fs'

fs.readdirSync(path.resolve(__dirname, './proto')).forEach(fileName => {
    if(!fileName.endsWith('.proto')){
        return
    }
    const filePath = path.resolve(__dirname, `./proto/${fileName.replace('.proto','')}`)
    pbjs.main(['-t', 'static-module', '-w', 'commonjs', '-o', `${filePath}.js`, `${filePath}.proto`], () =>
        pbts.main(['-o', `${filePath}.d.ts`, `${filePath}.js`])
    )
})