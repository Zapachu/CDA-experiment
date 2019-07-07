import {readdirSync, readFileSync, statSync, writeFileSync} from 'fs'
import {resolve} from 'path'
import {prompt, registerPrompt} from 'inquirer'
import {env, exec} from 'shelljs'

registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

interface Task {
    env?: { [key: string]: string }
    command: string,
}

namespace TaskHelper {
    export const projectName = 'RecentTask'
    const logPath = resolve(__dirname, './help.log')

    export function getLogs(): Array<Task> {
        try {
            return readFileSync(logPath).toString().split('\n').map(row => JSON.parse(row))
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
        writeFileSync(logPath, logs.slice(0, 5).join('\n'))
    }

    export function execTask(task: Task) {
        appendLog(task)
        Object.assign(env, task.env)
        exec(task.command)
    }
}

enum Side {
    client = 'client',
    server = 'server',
    both = 'both(dist)',
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

function getProjects(parentProject: string = '.', projectSet = new Set<string>()): Array<string> {
    readdirSync(resolve(__dirname, `../${parentProject}/`)).forEach(p => {
        if (p[0] >= 'a') {
            return
        }
        if(!statSync(resolve(__dirname, `../${parentProject}/${p}`)).isDirectory()){
            return
        }
        const childProject = `${parentProject}/${p}`
        projectSet.delete(parentProject)
        projectSet.add(childProject)
        getProjects(childProject, projectSet)
    })
    return Array.from(projectSet, p => p.slice(2))
}

(async function () {
    const projects = getProjects()
    const {project} = (await prompt<{ project: string }>([
        {
            name: 'project',
            type: 'autocomplete',
            message: `Project(${projects.length}):`,
            source: (_, input = ''): Promise<string[]> => Promise.resolve(projects.filter(
                p => input.toLowerCase().split(' ').every(s => p.toLowerCase().includes(s))
            ).concat(TaskHelper.projectName))
        } as any
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
    const {side} = (await prompt<{ side: Side }>([
        {
            name: 'side',
            type: 'list',
            choices: [Side.client, Side.server, Side.both],
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
                        command: `webpack-dev-server --hot --progress --env.TS_NODE_PROJECT="tsconfig.json" --config ./${project}/script/webpack.config.ts`
                    })
                    break
                }
            }
            TaskHelper.execTask({
                env: {BUILD_MODE: mode},
                command: `webpack --env.TS_NODE_PROJECT="tsconfig.json" --config ./${project}/script/webpack.config.ts`
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
                        command: `tsc --outDir ./${project}/build --listEmittedFiles true ./${project}/src/serve.ts`
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
                        command: `ts-node ./${project}/src/serve.ts`
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
                        command: `node ./${project}/build/serve.js`
                    })
                    break
                }
            }
            break
        }
        case Side.both: {
            TaskHelper.execTask({
                env: {BUILD_MODE: ClientTask.dist},
                command: `webpack --env.TS_NODE_PROJECT="tsconfig.json" --config ./${project}/script/webpack.config.ts`
            })
            TaskHelper.execTask({
                command: `tsc --outDir ./${project}/build --listEmittedFiles true ./${project}/src/serve.ts`
            })
        }
    }
})()