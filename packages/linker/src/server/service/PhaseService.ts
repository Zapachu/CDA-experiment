import {Log, redisClient, RedisKey} from '@server-util'
import {PhaseManager} from 'elf-protocol'
import {elfSetting} from 'elf-setting'
import {getAdminService} from '../rpc'

export class PhaseService {
    static async getPhaseTemplates(userId?: string): Promise<Array<PhaseManager.IPhaseRegInfo>> {
        const phaseTemplates: Array<PhaseManager.IPhaseRegInfo> = []
        const registeredPhases: Array<string> = await redisClient.smembers(RedisKey.registeredPhaseSet)
        for (let namespace of registeredPhases) {
            const regInfo = await redisClient.get(RedisKey.phaseRegInfo(namespace))
            if (regInfo) {
                phaseTemplates.push(JSON.parse(regInfo))
            }
        }
        if (!elfSetting.inProductEnv || !userId) {
            return phaseTemplates
        }
        return new Promise<Array<PhaseManager.IPhaseRegInfo>>(resolve => {
            getAdminService().getAuthorizedTemplates({userId}, (err, response) => {
                if (err) {
                    Log.e(err)
                    return resolve([])
                }
                resolve(phaseTemplates.filter(({namespace}) =>
                    response.namespaces.includes(namespace)
                ))
            })
        })
    }
}
