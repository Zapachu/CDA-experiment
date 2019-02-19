import * as shell from 'shelljs'
const filePath = './phaseMamerger'

shell.exec(`pbjs -t static-module -w commonjs -o ${filePath}.js ${filePath}.proto`)
shell.exec(`pbts -o ${filePath}.d.ts ${filePath}.js`)