import * as path from 'path'
import * as fs from 'fs'
import {prompt} from 'inquirer'
import {cd, exec, env} from 'shelljs'

interface TaskLog {
    command: string,
    env: { [key: string]: string }
}

namespace RecentTask {
    export const groupName = 'RecentTask'
    const logPath = path.resolve(__dirname, './help.log')

    export function getGroups(): Array<string> {
        return fs.existsSync(logPath) ? [groupName] : []
    }

    export function getLogs(): Array<TaskLog> {
        try {
            return fs.readFileSync(logPath).toString().split('\n').map(row => JSON.parse(row))
        } catch (e) {
            return []
        }
    }

    export function appendLog({command, env}: TaskLog) {
        const logs = getLogs().map(log => JSON.stringify(log))
        const newLog = JSON.stringify({command, env})
        if (logs.includes(newLog)) {
            return
        }
        logs.unshift(newLog)
        fs.writeFileSync(logPath, logs.slice(0, 5).join('\n'))
    }
}

enum Side {
    client = 'client',
    server = 'server'
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
            choices: [
                ...RecentTask.getGroups(),
                ...fs.readdirSync(path.resolve(__dirname, '../')).filter(name => name[0] < 'a')
            ],
            message: 'Group/NameSpace:'
        }
    ]))
    if (group === RecentTask.groupName) {
        const {taskLog} = (await prompt<{ taskLog: string }>([
            {
                name: 'taskLog',
                type: 'list',
                choices: RecentTask.getLogs().map(log => JSON.stringify(log)),
                message: 'TaskLog:'
            }
        ]))
        const {command, env: _env}: TaskLog = JSON.parse(taskLog)
        Object.assign(env, _env)
        exec(command)
        return
    }
    const namespaces = fs.readdirSync(path.resolve(__dirname, `../${group}/`)).filter(name => name[0] < 'a')
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
    const {side} = (await prompt<{ side: Side }>([
        {
            name: 'side',
            type: 'list',
            choices: [Side.client, Side.server],
            message: 'Side:'
        }
    ]))
    switch (side) {
        case Side.client: {
            const {mode} = await prompt<{ mode: BuildMode }>([
                {
                    name: 'mode',
                    type: 'list',
                    choices: [BuildMode.dev, BuildMode.dist, BuildMode.publish],
                    message: 'Mode:'
                }
            ])
            const _env = {
                BUILD_MODE: mode
            }
            Object.assign(_env)
            cd(path.resolve(__dirname, '..'))
            const command = `${mode === BuildMode.dev ? 'webpack-dev-server' : 'webpack'} --env.TS_NODE_PROJECT="tsconfig.json" --config ./${namespacePath}/script/webpack.config.ts`
            RecentTask.appendLog({
                command,
                env: _env
            })
            exec(command)
            break
        }
        case Side.server: {
            const {dev} = await prompt([
                {
                    name: 'dev',
                    type: 'confirm'
                }
            ])
            const _env = {
                BESPOKE_NAMESPACE: namespace
            }
            if (!dev) {
                const {port, rpcPort, ip, withProxy, withLinker} = await prompt([
                    {
                        name: 'port',
                        type: 'number'
                    },
                    {
                        name: 'rpcPort',
                        type: 'number'
                    },
                    {
                        name: 'ip',
                        type: 'input',
                        message: '本机内网IP:'
                    },
                    {
                        name: 'withProxy',
                        type: 'confirm'
                    },
                    {
                        name: 'withLinker',
                        type: 'confirm'
                    }
                ])
                Object.assign(_env, {
                    BESPOKE_PORT: port,
                    BESPOKE_IP: ip,
                    BESPOKE_RPC_PORT:rpcPort,
                    BESPOKE_WITH_PROXY: withProxy,
                    BESPOKE_WITH_LINKER: withLinker,
                    NODE_ENV: 'production'
                })
            }
            Object.assign(env, _env)
            const command = `ts-node ./${namespacePath}/src/serve.ts`
            RecentTask.appendLog({
                command, env: _env
            })
            exec(command)
            break
        }
    }
})()
