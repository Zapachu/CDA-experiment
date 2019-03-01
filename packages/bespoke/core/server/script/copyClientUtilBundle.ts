import * as fs from 'fs'
import * as path from 'path'

const clientUtilBundleName = 'bespoke-client-util.min.js'
if (!fs.existsSync('../dist')) {
    fs.mkdirSync('../dist')
}
fs.copyFileSync(
    path.resolve(__dirname, `../node_modules/bespoke-client-util/dist/${clientUtilBundleName}`),
    path.resolve(__dirname, `../dist/${clientUtilBundleName}`)
)