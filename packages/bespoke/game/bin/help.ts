import {prompt} from 'inquirer'
import {readdirSync} from 'fs'
import {resolve} from 'path'
import {cd, exec, env} from 'shelljs'

enum Command {
    build = 'build',
    serve = 'serve'
}

enum BuildMode {
    dev = 'dev',
    dist = 'dist',
    publish = 'publish'
}

prompt([
    {
        name: 'namespace',
        type: 'list',
        choices: readdirSync(resolve(__dirname, '../')).filter(name => name[0] < 'a'),
        message: 'Namespace:'
    },
    {
        name: 'command',
        type: 'list',
        choices: [Command.build, Command.serve],
        message: 'Command:'
    }
]).then(({namespace, command}: { namespace: string, command: Command }) => {
    switch (command) {
        case Command.build:
            prompt([
                {
                    name: 'mode',
                    type: 'list',
                    choices: [BuildMode.dev, BuildMode.dist, BuildMode.publish],
                    message: 'Mode:'
                }
            ]).then(({mode})=>{
                env.BUILD_MODE = mode
                cd(resolve(__dirname, '..'))
                exec(`webpack --env.TS_NODE_PROJECT="tsconfig.json" --config ./${namespace}/script/webpack.config.ts`)
            })
            break
        case Command.serve:
            prompt([
                {
                    name: 'port',
                    type: 'number'
                },
                {
                    name: 'rpcPort',
                    type: 'number'
                }
            ]).then(({port, rpcPort}) => {
                env.BESPOKE_PORT = port
                env.BESPOKE_RPC_PORT = rpcPort
                env.BESPOKE_NAMESPACE = namespace
                exec(`ts-node ./${namespace}/src/serve.ts`)
            })
    }
})
