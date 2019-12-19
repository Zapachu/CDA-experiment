import { copySync, moveSync, readdirSync, readFileSync, removeSync, statSync, writeFileSync } from 'fs-extra'
import { resolve } from 'path'
import { prompt, registerPrompt } from 'inquirer'
import { cd, env, exec } from 'shelljs'
import * as zip from 'zip-dir'

registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

interface ITask {
  env?: { [key: string]: string }
  command: string
}

enum SpecialProject {
  RecentTask = 'RecentTask',
  DistAllGame = 'DistAllGame',
  CleanAllGame = 'CleanAllGame'
}

namespace TaskHelper {
  const logPath = resolve(__dirname, './help.log')

  export function getLogs(): Array<ITask> {
    try {
      return readFileSync(logPath)
        .toString()
        .split('\n')
        .map(row => JSON.parse(row))
    } catch (e) {
      return []
    }
  }

  function appendLog({ command, env }: ITask) {
    const logs = getLogs().map(log => JSON.stringify(log))
    const newLog = JSON.stringify({ command, env })
    if (logs[0] === newLog) {
      return
    }
    logs.unshift(newLog)
    writeFileSync(logPath, logs.slice(0, 5).join('\n'))
  }

  export function execTask(task: ITask) {
    appendLog(task)
    Object.assign(env, task.env)
    exec(task.command)
  }

  export function distServer(project: string) {
    execTask({
      env: { PROJECT: project },
      command: `webpack --env.TS_NODE_PROJECT="tsconfig.json" --config ./bin/webpack.server.ts`
    })
  }

  export function distClient(project: string) {
    execTask({
      env: { PROJECT: project, BUILD_MODE: Task.dist },
      command: `webpack --env.TS_NODE_PROJECT="tsconfig.json" --config ./bin/webpack.client.ts`
    })
  }

  export function publishClient(project: string) {
    execTask({
      env: { PROJECT: project, BUILD_MODE: Task.publish },
      command: `webpack --env.TS_NODE_PROJECT="tsconfig.json" --config ./bin/webpack.client.ts`
    })
  }

  export function pkg(project: string) {
    const rootDir = resolve(__dirname, '../../'),
      pkgDir = resolve(__dirname, `../${project}/pkg/${project.split('/').pop()}`),
      targetDirs = ['bespokeLib', 'elfLib', 'lerna.json', 'game/package.json']
    cd(rootDir)
    exec('git ls-files', { silent: true })
      .toString()
      .split('\n')
      .forEach(file => {
        if (['.ts', '.tsx', '.scss', '.md'].some(a => file.endsWith(a))) {
          return
        }
        if (targetDirs.some(dir => file.startsWith(dir))) {
          copySync(resolve(rootDir, file), resolve(pkgDir, file))
        }
      })
    //region package.json
    const packageJson = require('../../package.json')
    delete packageJson.scripts.dist
    packageJson.scripts.start = `node game/build/serve.js`
    writeFileSync(resolve(pkgDir, './package.json'), JSON.stringify(packageJson, null, 2))
    //endregion
    copySync(resolve(rootDir, 'elfLib/setting/lib/setting.sample.js'), resolve(pkgDir, 'elfLib/setting/lib/setting.js'))
    moveSync(resolve(pkgDir, `elfLib`), resolve(pkgDir, 'game/elfLib'))
    moveSync(resolve(pkgDir, `bespokeLib`), resolve(pkgDir, 'game/bespokeLib'))
    copySync(resolve(rootDir, `game/${project}/build`), resolve(pkgDir, `game/build`))
    copySync(resolve(rootDir, `game/${project}/dist`), resolve(pkgDir, `game/dist`))
    writeFileSync(resolve(pkgDir, `README.txt`), 'npm i\nnpm start')
    zip(
      pkgDir,
      {
        saveTo: `${pkgDir}.zip`
      },
      err => (err ? console.log(err) : removeSync(pkgDir))
    )
  }
}

enum Side {
  client = 'client',
  server = 'server',
  both = 'both'
}

enum Task {
  dev = 'dev',
  dist = 'dist',
  publish = 'publish',
  serve = 'serve',
  pkg = 'pkg'
}

function getProjects(parentProject = '.', projectSet = new Set<string>()): Array<string> {
  readdirSync(resolve(__dirname, `../${parentProject}/`)).forEach(p => {
    if (p[0] >= 'a') {
      return
    }
    if (!statSync(resolve(__dirname, `../${parentProject}/${p}`)).isDirectory()) {
      return
    }
    const childProject = `${parentProject}/${p}`
    projectSet.delete(parentProject)
    projectSet.add(childProject)
    getProjects(childProject, projectSet)
  })
  return Array.from(projectSet, p => p.slice(2))
}

;(async function() {
  const projects = getProjects()
  const { project } = await prompt<{ project: string }>([
    {
      name: 'project',
      type: 'autocomplete',
      message: `Project(${projects.length}):`,
      source: (_, input = ''): Promise<string[]> =>
        Promise.resolve(
          input == ' '
            ? Object.values(SpecialProject)
            : projects.filter(p =>
                input
                  .toLowerCase()
                  .split(' ')
                  .every(s => p.toLowerCase().includes(s))
              )
        )
    } as any
  ])
  if (project === SpecialProject.RecentTask) {
    const { taskLog } = await prompt<{ taskLog: string }>([
      {
        name: 'taskLog',
        type: 'list',
        choices: TaskHelper.getLogs().map(log => JSON.stringify(log)),
        message: 'TaskLog:'
      }
    ])
    TaskHelper.execTask(JSON.parse(taskLog))
    return
  }
  if (project === SpecialProject.DistAllGame) {
    projects.forEach(project => {
      if ((Object.values(SpecialProject) as string[]).includes(project)) {
        return
      }
      TaskHelper.distClient(project)
      TaskHelper.distServer(project)
    })
    return
  }
  if (project === SpecialProject.CleanAllGame) {
    projects.forEach(project => {
      if ((Object.values(SpecialProject) as string[]).includes(project)) {
        return
      }
      removeSync(resolve(__dirname, `../${project}/dist`))
      removeSync(resolve(__dirname, `../${project}/build`))
    })
    return
  }
  const { side } = await prompt<{ side: Side }>([
    {
      name: 'side',
      type: 'list',
      choices: [Side.client, Side.server, Side.both],
      message: 'Side:'
    }
  ])

  switch (side) {
    case Side.client: {
      const { mode } = await prompt<{ mode: Task }>([
        {
          name: 'mode',
          type: 'list',
          choices: [Task.dev, Task.dist, Task.publish],
          message: 'Mode:'
        }
      ])
      if (mode === Task.dev) {
        const { HMR } = await prompt<{ HMR: boolean }>([
          {
            name: 'HMR',
            type: 'confirm'
          }
        ])
        if (HMR) {
          TaskHelper.execTask({
            env: {
              PROJECT: project,
              BUILD_MODE: mode,
              HMR: HMR.toString()
            },
            command: `webpack-dev-server --hot --env.TS_NODE_PROJECT="tsconfig.json" --config ./bin/webpack.client.ts`
          })
          break
        }
      }
      TaskHelper.execTask({
        env: { PROJECT: project, BUILD_MODE: mode },
        command: `webpack --env.TS_NODE_PROJECT="tsconfig.json" --config ./bin/webpack.client.ts`
      })
      break
    }
    case Side.server: {
      const { task } = await prompt<{ task: Task }>([
        {
          name: 'task',
          type: 'list',
          choices: [Task.dev, Task.dist, Task.serve],
          message: 'Task:'
        }
      ])
      switch (task) {
        case Task.dist: {
          TaskHelper.distServer(project)
          break
        }
        case Task.dev: {
          const { HMR } = await prompt<{ HMR: boolean }>([
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
        case Task.serve: {
          const { withProxy, withLinker } = await prompt([
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
      const { mode } = await prompt<{ mode: Task }>([
        {
          name: 'mode',
          type: 'list',
          choices: [Task.dist, Task.publish, Task.pkg],
          message: 'Mode:'
        }
      ])
      switch (mode) {
        case Task.dist:
          TaskHelper.distClient(project)
          TaskHelper.distServer(project)
          break
        case Task.publish:
          TaskHelper.publishClient(project)
          TaskHelper.distServer(project)
          break
        case Task.pkg:
          TaskHelper.distClient(project)
          TaskHelper.distServer(project)
          TaskHelper.pkg(project)
          break
      }
      break
    }
  }
})()
