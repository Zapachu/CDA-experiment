import {Log, redisClient} from '@server-util'
import {elfSetting} from 'elf-setting'
import {getAdminService} from '../rpc'
import {PhaseReg} from 'elf-protocol'

export class PhaseService {
    static async getPhaseTemplates(userId?: string): Promise<Array<PhaseReg.IRegInfo>> {
        const phaseTemplates: Array<PhaseReg.IRegInfo> = []
        const registeredPhaseKeys: Array<string> = await redisClient.keys(PhaseReg.key('*'))
        registeredPhaseKeys.forEach(async key => phaseTemplates.push(JSON.parse(await redisClient.get(key))))
        if (!elfSetting.inProductEnv || !userId) {
            return phaseTemplates
        }
        return new Promise<Array<PhaseReg.IRegInfo>>(resolve => {
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
