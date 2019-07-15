import { NationCode } from '@bespoke/share';
declare enum sendVerifyCodeRes {
    success = 0,
    countingDown = 1,
    tooManyTimes = 2,
    sendError = 3
}
export declare class UserService {
    static sendVerifyCodeResCode: typeof sendVerifyCodeRes;
    static sendVerifyCode(nationCode: NationCode, mobile: string): Promise<{
        code: sendVerifyCodeRes;
        msg?: string;
    }>;
}
export {};
