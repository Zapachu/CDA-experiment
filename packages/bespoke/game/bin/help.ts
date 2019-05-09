import * as path from 'path'
import * as fs from 'fs'
import {prompt} from 'inquirer'
import {cd, exec, env} from 'shelljs'

interface Task {
    env?: { [key: string]: string }
    command: string,
}

namespace TaskHelper {
    export const projectName = 'RecentTask'
    const logPath = path.resolve(__dirname, './help.log')

    export function getGroups(): Array<string> {
        return fs.existsSync(logPath) ? [projectName] : []
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
        if (logs[0] === newLog) {
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
    let projectPath: string
    const {project} = (await prompt<{ project: string }>([
        {
            name: 'project',
            type: 'list',
            choices: [
                ...TaskHelper.getGroups(),
                ...fs.readdirSync(path.resolve(__dirname, '../')).filter(name => name[0] < 'a')
            ]
        }
    ]))
    if (project === TaskHelper.projectName) {
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
    const subProjects = fs.readdirSync(path.resolve(__dirname, `../${project}/`)).filter(name => name[0] < 'a')
    if (!subProjects.length) {
        projectPath = project
    } else {
        const {subProject} = (await prompt<{ subProject: string }>([
            {
                name: 'subProject',
                type: 'list',
                choices: subProjects
            }
        ]))
        projectPath = `${project}/${subProject}`
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
            cd(path.resolve(__dirname, '..'))
            const {mode} = await prompt<{ mode: ClientTask }>([
                {
                    name: 'mode',
                    type: 'list',
                    choices: [ClientTask.dev, ClientTask.dist, ClientTask.publish],
                    message: 'Mode:'
                }
            ])
            if (mode === ClientTask.dev) {
                const {HMR} = await prompt<{ HMR: boolean }>([
                    {
                        name: 'HMR',
                        type: 'confirm'
                    }
                ])
                if (HMR) {
                    TaskHelper.execTask({
                        env: {
                            BUILD_MODE: mode,
                            HMR: HMR.toString()
                        },
                        command: `webpack-dev-server --hot --progress --env.TS_NODE_PROJECT="tsconfig.json" --config ./${projectPath}/script/webpack.config.ts`
                    })
                    break
                }
            }
            TaskHelper.execTask({
                env: {BUILD_MODE: mode},
                command: `webpack --env.TS_NODE_PROJECT="tsconfig.json" --config ./${projectPath}/script/webpack.config.ts`
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
                        command: `tsc --outDir ./${projectPath}/build --listEmittedFiles true ./${projectPath}/src/serve.ts`
                    })
                    break
                }
                case ServerTask.dev: {
                    const {HMR} = await prompt<{ HMR: boolean }>([
                        {
                            name: 'HMR',
                            type: 'confirm'
                        }
                    ])
                    TaskHelper.execTask({
                        env: {
                            BESPOKE_HMR: HMR.toString()
                        },
                        command: `ts-node ./${projectPath}/src/serve.ts`
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
                            BESPOKE_WITH_PROXY: withProxy,
                            BESPOKE_WITH_LINKER: withLinker,
                            NODE_ENV: 'production'
                        },
                        command: `node ./${projectPath}/build/serve.js`
                    })
                    break
                }
            }
        }
    }
})()
