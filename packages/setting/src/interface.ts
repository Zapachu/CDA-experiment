export interface IQCloudSMS {
    appId: string
    appKey: string
    smsSign: string
    templateId: {
        verifyCode: string
    }
}

export interface IQiniuConfig {
    upload: {
        ACCESS_KEY: string
        SECRET_KEY: string
        bucket: string
        path: string
    },
    download: {
        jsDomain: string
    }
}

export interface ICoreSetting {
    host: string
    mongoUri: string
    mongoUser: string
    mongoPass: string
    redisHost: string
    redisPort: number
    sessionSecret: string
    //region RPC
    proxyService: {
        host: string
        port: number
        rpcPort:number
    }
    academusServiceUri: string
    pythonRobotUri: string
    elfGameServiceUri: string
    //endregion
    qCloudSMS: IQCloudSMS
    qiNiu: IQiniuConfig
    mail: {
        smtpHost: string
        smtpUsername: string
        smtpPassword: string
    }
    adminMobileNumbers: Array<string>
}

export interface ISetting extends Partial<ICoreSetting> {
    namespace: string
    staticPath: string
    getClientPath?: () => string
    independent?: boolean
    port?: number
    rpcPort?: number
}