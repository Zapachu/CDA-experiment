import {readdirSync, copyFileSync} from 'fs'
import {resolve} from 'path'

readdirSync(resolve(__dirname, '../lib/proto')).forEach(pathName => {
    copyFileSync(resolve(__dirname, `../lib/proto/${pathName}`), resolve(__dirname, `../build/proto/${pathName}`))
})
