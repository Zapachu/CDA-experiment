import { NationCode } from '@bespoke/share';
export declare class QCloudSMS {
    private static qCloudSMS;
    private static singleSender;
    static init(): void;
    static singleSenderWithParam(nationCode: NationCode, phoneNumber: string, templateId: string, params: Array<string>): Promise<boolean>;
}
