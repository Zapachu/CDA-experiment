import * as pbjs from 'protobufjs/cli/pbjs'
import * as pbts from 'protobufjs/cli/pbts'

const p = '../lib/proto/V5-Elf'

pbjs.main(['-t', 'static-module', '-w', 'commonjs', '-o', `${p}.js`, `${p}.proto`], err =>
    err ? console.error(err) : pbts.main(['-o', `${p}.d.ts`, `${p}.js`])
)