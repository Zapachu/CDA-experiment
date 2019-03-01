import * as fs from 'fs'
import * as path from 'path'

const clientUtilBundleName = 'bespoke-client-util.min.js'
const distDir = path.resolve(__dirname, '../dist')
if (!fs.existsSync(path.resolve(__dirname, '../dist'))) {
    fs.mkdirSync(distDir)
}
fs.copyFileSync(
    path.resolve(__dirname, `../node_modules/bespoke-client-util/dist/${clientUtilBundleName}`),
    path.resolve(__dirname, `../dist/${clientUtilBundleName}`)
)