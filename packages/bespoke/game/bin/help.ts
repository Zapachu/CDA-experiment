import * as path from 'path'
import * as fs from 'fs'
import {prompt} from 'inquirer'
import {cd, exec, env} from 'shelljs'

interface Task {
    env?: { [key: string]: string }
    command: string,
}

namespace TaskHelper {
    export const groupName = 'RecentTask'
    const logPath = path.resolve(__dirname, './help.log')

    export function getGroups(): Array<string> {
        return fs.existsSync(logPath) ? [groupName] : []
    }

    export function getLogs(): Array<Task> {
        try {
            return fs.readFileSync(logPath).toString().split('\n').map(row => JSON.parse(row))
        } catch (e) {
            return []
        }
    }

    function appendLog({command, env}: Task) {
        const logs = getLogs().map(log => JSON.stringify(log))
        const newLog = JSON.stringify({command, env})
        if (logs.includes(newLog)) {
            return
        }
        logs.unshift(newLog)
        fs.writeFileSync(logPath, logs.slice(0, 5).join('\n'))
    }

    export function execTask(task: Task) {
        appendLog(task)
        Object.assign(env, task.env)
        exec(task.command)
    }
}

enum Side {
    client = 'client',
    server = 'server'
}

enum ClientTask {
    dev = 'dev',
    dist = 'dist',
    publish = 'publish'
}

enum ServerTask {
    dev = 'dev',
    dist = 'dist',
    serve = 'serve'
}

(async function () {
    let namespace: string
    let namespacePath: string
    const {group} = (await prompt<{ group: string }>([
        {
            name: 'group',
            type: 'list',
            choices: [
                ...TaskHelper.getGroups(),
                ...fs.readdirSync(path.resolve(__dirname, '../')).filter(name => name[0] < 'a')
            ],
            message: 'Group/NameSpace:'
        }
    ]))
    if (group === TaskHelper.groupName) {
        const {taskLog} = (await prompt<{ taskLog: string }>([
            {
                name: 'taskLog',
                type: 'list',
                choices: TaskHelper.getLogs().map(log => JSON.stringify(log)),
                message: 'TaskLog:'
            }
        ]))
        TaskHelper.execTask(JSON.parse(taskLog))
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
            const {mode} = await prompt<{ mode: ClientTask }>([
                {
                    name: 'mode',
                    type: 'list',
                    choices: [ClientTask.dev, ClientTask.dist, ClientTask.publish],
                    message: 'Mode:'
                }
            ])
            cd(path.resolve(__dirname, '..'))
            TaskHelper.execTask({
                env: {BUILD_MODE: mode},
                command: `${mode === ClientTask.dev ? 'webpack-dev-server' : 'webpack'} --env.TS_NODE_PROJECT="tsconfig.json" --config ./${namespacePath}/script/webpack.config.ts`
            })
            break
        }
        case Side.server: {
            const {task} = await prompt<{ task: ServerTask }>([
                {
                    name: 'task',
                    type: 'list',
                    choices: [ServerTask.dev, ServerTask.dist, ServerTask.serve],
                    message: 'Task:'
                }
            ])
            switch (task) {
                case ServerTask.dist: {
                    TaskHelper.execTask({
                        env: {
                            namespacePath,
                            namespace
                        },
                        command: `tsc --outDir ./${namespacePath}/build --listEmittedFiles true ./${namespacePath}/src/serve.ts`
                    })
                    break
                }
                case ServerTask.dev: {
                    TaskHelper.execTask({
                        env: {
                            BESPOKE_NAMESPACE: namespace
                        },
                        command: `ts-node ./${namespacePath}/src/serve.ts`
                    })
                    break
                }
                case ServerTask.serve: {
                    const {withProxy, withLinker} = await prompt([
                        {
                            name: 'withProxy',
                            type: 'confirm'
                        },
                        {
                            name: 'withLinker',
                            type: 'confirm'
                        }
                    ])
                    TaskHelper.execTask({
                        env: {
                            BESPOKE_NAMESPACE: namespace,
                            BESPOKE_WITH_PROXY: withProxy,
                            BESPOKE_WITH_LINKER: withLinker,
                            NODE_ENV: 'production'
                        },
                        command: `node ./${namespacePath}/build/serve.js`
                    })
                    break
                }
            }
        }
    }
})()
