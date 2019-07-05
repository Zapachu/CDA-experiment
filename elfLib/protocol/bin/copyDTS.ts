import {readdirSync, copyFileSync} from 'fs'
import {resolve} from 'path'

readdirSync(resolve(__dirname, '../src/proto')).forEach(pathName => {
    copyFileSync(resolve(__dirname, `../src/proto/${pathName}`), resolve(__dirname, `../lib/proto/${pathName}`))
})
