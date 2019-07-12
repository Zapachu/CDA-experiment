import * as React from 'react';
import { NationCode } from '@bespoke/share';
import { TPageProps } from '../util';
declare interface ILoginState {
    nationCode: NationCode;
    mobileNumber: string;
    verifyCode: string;
    counter: number;
}
export declare class Login extends React.Component<TPageProps, ILoginState> {
    lang: {
        title: string & ((...args: any[]) => string);
        mobileNumber: string & ((...args: any[]) => string);
        getVerifyCode: string & ((...args: any[]) => string);
        verifyCode: string & ((...args: any[]) => string);
        login: string & ((...args: any[]) => string);
        invalidMobileNumber: string & ((...args: any[]) => string);
        accountNotExist: string & ((...args: any[]) => string);
        failed2getVcode: string & ((...args: any[]) => string);
        loginFailed: string & ((...args: any[]) => string);
    };
    state: ILoginState;
    componentDidMount(): Promise<void>;
    readonly mobileNumberValid: boolean;
    getVerifyCode(): Promise<void>;
    login(): Promise<void>;
    countDown(): void;
    render(): React.ReactNode;
}
export {};
