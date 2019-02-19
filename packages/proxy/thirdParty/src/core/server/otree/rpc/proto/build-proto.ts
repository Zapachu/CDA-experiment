const shell = require('shelljs')
const filePath = './otreeManager'
shell.exec(`pbjs -t static-module -w commonjs -o ${filePath}.js ${filePath}.proto`)
shell.exec(`pbts -o ${filePath}.d.ts ${filePath}.js`)