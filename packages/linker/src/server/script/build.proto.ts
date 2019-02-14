const shell = require('shelljs')
const filePath = '../rpc/proto/phaseManager'
shell.exec(`pbjs -t static-module -w commonjs -o ${filePath}.js ${filePath}.proto`)
shell.exec(`pbts -o ${filePath}.d.ts ${filePath}.js`)