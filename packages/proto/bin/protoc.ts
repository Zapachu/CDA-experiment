import * as pbjs from 'protobufjs/cli/pbjs'
import * as pbts from 'protobufjs/cli/pbts'

const p = '../lib/def/PhaseManager'

pbjs.main(['-t', 'static-module', '-w', 'commonjs', '-o', `${p}.js`, `${p}.proto`], () =>
    pbts.main(['-o', `${p}.d.ts`, `${p}.js`])
)