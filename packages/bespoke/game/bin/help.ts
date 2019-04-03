import * as path from 'path'
import {readdirSync} from 'fs'
import {prompt} from 'inquirer'
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

(async function () {
    let namespace: string
    let namespacePath: string
    const {group} = (await prompt<{ group: string }>([
        {
            name: 'group',
            type: 'list',
            choices: readdirSync(path.resolve(__dirname, '../')).filter(name => name[0] < 'a'),
            message: 'Group/NameSpace:'
        }
    ]))
    const namespaces = readdirSync(path.resolve(__dirname, `../${group}/`)).filter(name => name[0] < 'a')
    if (!namespaces.length) {
        namespace = group
        namespacePath = namespace
    } else {
        namespace = (await prompt<{ namespace: string }>([
            {
                name: 'namespace',
                type: 'list',
                choices: namespaces,
                message: 'NameSpace:'
            }
        ])).namespace
        namespacePath = `${group}/${namespace}`
    }
    const {command} = (await prompt<{ command: Command }>([
        {
            name: 'command',
            type: 'list',
            choices: [Command.build, Command.serve],
            message: 'Command:'
        }
    ]))
    switch (command) {
        case Command.build:
            const {mode} = await prompt<{ mode: BuildMode }>([
                {
                    name: 'mode',
                    type: 'list',
                    choices: [BuildMode.dev, BuildMode.dist, BuildMode.publish],
                    message: 'Mode:'
                }
            ])
            env.BUILD_MODE = mode
            cd(path.resolve(__dirname, '..'))
            exec(`webpack --env.TS_NODE_PROJECT="tsconfig.json" --config ./${namespacePath}/script/webpack.config.ts`)
            break
        case Command.serve:
            const {port, rpcPort} = await prompt([
                {
                    name: 'port',
                    type: 'number'
                },
                {
                    name: 'rpcPort',
                    type: 'number'
                }
            ])
            env.BESPOKE_PORT = port
            env.BESPOKE_RPC_PORT = rpcPort
            env.BESPOKE_NAMESPACE = namespace
            exec(`ts-node ./${namespacePath}/src/serve.ts`)
    }
})()
