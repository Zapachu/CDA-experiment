import {baseEnum, config} from 'bespoke-common'
import {elfSetting} from 'elf-setting'
import {redisClient, RedisKey, QCloudSMS, Log, inProductEnv} from '../util'

const SEND_TIMES_PER_DAY = 3

enum sendVerifyCodeRes {
    success,
    countingDown,
    tooManyTimes,
    sendError
}

export default class UserService {
    static sendVerifyCodeResCode = sendVerifyCodeRes

    static async sendVerifyCode(nationCode: baseEnum.NationCode, mobile: string): Promise<{
        code: sendVerifyCodeRes,
        msg?: string
    }> {
        const date = new Date(), dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        const sentTimes = +(await redisClient.hget(RedisKey.verifyCodeSendTimes(nationCode, mobile), dateKey))
        if (sentTimes >= SEND_TIMES_PER_DAY) {
            return {
                code: this.sendVerifyCodeResCode.tooManyTimes,
                msg: `You can get verify code only ${3} times per day`
            }
        }
        if (await redisClient.get(RedisKey.verifyCode(nationCode, mobile))) {
            return {
                code: this.sendVerifyCodeResCode.countingDown,
                msg: `You've got one verify code in the last ${config.vcodeLifetime} seconds`
            }
        }
        const verifyCode = Math.random().toString().substr(2, 6)
        Log.d(verifyCode)
        const sendSuccess = !inProductEnv || await QCloudSMS.singleSenderWithParam(nationCode, mobile, elfSetting.qCloudSMS.templateId.verifyCode, [verifyCode])
        if (sendSuccess) {
            await redisClient.setex(RedisKey.verifyCode(nationCode, mobile), config.vcodeLifetime, verifyCode)
            await redisClient.hset(RedisKey.verifyCodeSendTimes(nationCode, mobile), dateKey, sentTimes + 1)
            return {
                code: this.sendVerifyCodeResCode.success
            }
        } else {
            return {
                code: this.sendVerifyCodeResCode.sendError
            }
        }
    }

    static getGameTemplateNamespaces(mobile: string): Array<string> {
        //TODO 由GO Proxy处理
        return []
    }
}
