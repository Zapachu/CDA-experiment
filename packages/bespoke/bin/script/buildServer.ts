import * as shell from 'shelljs'
import * as path from 'path'

shell.cd(path.resolve(__dirname, '../../'))
shell.exec('tsc')
shell.cp('-R', 'lib/core/server/view', 'build/core/server')
shell.cp('-R', 'lib/core/server/rpc/proto', 'build/core/server/rpc/proto')