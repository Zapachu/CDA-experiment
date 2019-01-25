import {baseEnum} from '@common'
import {setting} from '@server-util'
import * as QCloudSms from "qcloudsms_js"

export class QCloudSMS {
    private static qCloudSMS = QCloudSms(setting.qCloudSMS.appId, setting.qCloudSMS.appKey)
    private static singleSender = QCloudSMS.qCloudSMS.SmsSingleSender()

    static singleSenderWithParam(
        nationCode: baseEnum.NationCode,
        phoneNumber: string,
        templateId: string,
        params: Array<string>) {
        return new Promise<boolean>(resolve => {
            this.singleSender.sendWithParam(nationCode, phoneNumber, templateId, params, setting.qCloudSMS.smsSign, '', '', (err: Error, res, resData) => {
                resolve(!err && resData.result==0)
            })
        })
    }
}