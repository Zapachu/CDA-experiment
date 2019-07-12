import {redisClient} from '@server-util'
import {Log} from '@elf/util'
import {elfSetting} from '@elf/setting'
import {getAdminService} from '../rpc'
import {Linker} from '@elf/protocol'
import HeartBeat = Linker.HeartBeat

export class PhaseService {
    static async getPhaseTemplates(userId?: string): Promise<Array<HeartBeat.IHeartBeat>> {
        const phaseTemplates: Array<HeartBeat.IHeartBeat> = []
        const registeredPhaseKeys: Array<string> = await redisClient.keys(HeartBeat.key('*'))
        for(let key of registeredPhaseKeys){
            phaseTemplates.push(JSON.parse(await redisClient.get(key)))
        }
        if (!elfSetting.inProductEnv || !userId) {
            return phaseTemplates
        }
        return new Promise<Array<HeartBeat.IHeartBeat>>(resolve => {
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
