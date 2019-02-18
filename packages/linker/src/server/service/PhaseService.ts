import {IUser} from '@common'
import {redisClient, RedisKey} from '@server-util'
import {PhaseManager} from 'elf-proto'

export class PhaseService {
    static async getPhaseTemplates(user: IUser): Promise<Array<PhaseManager.IPhaseRegInfo>> {
        const phasesRegInfo: Array<PhaseManager.IPhaseRegInfo> = []
        const registeredPhases: Array<string> = await redisClient.smembers(RedisKey.registeredPhaseSet)
        for (let namespace of registeredPhases) {
            const regInfo = await redisClient.get(RedisKey.phaseRegInfo(namespace))
            if (regInfo) {
                phasesRegInfo.push(JSON.parse(regInfo))
            }
        }
        return phasesRegInfo
    }
}