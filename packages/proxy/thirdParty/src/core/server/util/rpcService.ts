import {readFileSync} from 'fs'
import {resolve} from 'path'
import {PhaseManager as P} from 'elf-proto'
import setting from '@core/server/config/settings'

export function getGameService() {
    return P.getGameService(setting.elfGameServiceUri)
}

export function registerPhases(namespace: string, localRootUrl: string, phaseServiceUri: string) {
    const jsUrl: string = JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())[`${namespace}.js`]
    getGameService().registerPhases({
        phases: [{
            namespace,
            jsUrl: `${localRootUrl}${jsUrl}`,
            rpcUri: phaseServiceUri
        }]
    }, err => err ? console.error(err) : null)
}