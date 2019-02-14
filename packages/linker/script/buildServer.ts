import * as shell from 'shelljs'
import * as path from 'path'

shell.cd(path.resolve(__dirname, '../../'))
shell.exec('tsc')
shell.cp('-R', 'lib/game/server/view', 'build/game/server')
shell.cp('-R', 'lib/game/server/rpc/proto', 'build/game/server/rpc/proto')