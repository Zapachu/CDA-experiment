const shell = require('shelljs')
const filePath = '../../lib/phases/common/rpc/proto/phaseManager'
shell.exec(`pbjs -t static-module -w commonjs -o ${filePath}.js ${filePath}.proto`)
shell.exec(`pbts -o ${filePath}.d.ts ${filePath}.js`)
