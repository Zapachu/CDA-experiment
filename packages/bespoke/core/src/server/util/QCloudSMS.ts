import {baseEnum} from '@dev/common'
import {Log, setting} from './util'
import * as QCloudSms from 'qcloudsms_js'

export class QCloudSMS {
    private static qCloudSMS
    private static singleSender

    static init() {
        try {
            this.qCloudSMS = QCloudSms(setting.qCloudSMS.appId, setting.qCloudSMS.appKey)
            this.singleSender = QCloudSMS.qCloudSMS.SmsSingleSender()
        }catch (e) {
            Log.e('QCloudSMS初始化失败')
        }
    }

    static singleSenderWithParam(
        nationCode: baseEnum.NationCode,
        phoneNumber: string,
        templateId: string,
        params: Array<string>) {
        return new Promise<boolean>(resolve => {
            this.singleSender.sendWithParam(nationCode, phoneNumber, templateId, params, setting.qCloudSMS.smsSign, '', '', (err: Error, res, resData) => {
                resolve(!err && resData.result == 0)
            })
        })
    }
}