import * as pbjs from 'protobufjs/cli/pbjs'
import * as pbts from 'protobufjs/cli/pbts'
import * as path from "path";

const filePath = path.resolve(__dirname, '../../lib/core/server/rpc/proto/AcademusBespoke')
pbjs.main(['-t', 'static-module', '-w', 'commonjs', '-o', `${filePath}.js`, `${filePath}.proto`], () =>
    pbts.main(['-o', `${filePath}.d.ts`, `${filePath}.js`])
)