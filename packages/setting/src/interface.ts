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
    }
    download: {
        jsDomain: string
    }
}

export interface IElfSetting {
    mongoUri: string
    mongoUser: string
    mongoPass: string
    redisHost: string
    redisPort: number
    sessionSecret: string
    qCloudSMS: IQCloudSMS
    qiNiu: IQiniuConfig
    mail: {
        smtpHost: string
        smtpUsername: string
        smtpPassword: string
    }
    linkerGatewayHost:string
    linkerPort:number
    linkerServiceUri: string
    host: string
    proxyService: {
        host: string
        port: number
        rpcHost: string
        rpcPort:number
    }
    adminMobileNumbers: Array<string>
    ocpApim: {
        gateWay: 'https://api.cognitive.azure.cn/face/v1.0/detect',
        subscriptionKey: '4210--------------------'
    }
    oTreePort: number
    oTreeNamespace: string
    oTreeRpc: string
    oTreeProxy: string
    oTreeServer: string
    oTreeStaticPathNamespace: string

    qualtricsPort: number
    qualtricsRpc: string
    qualtricsProxy: string
    qualtricsServer: string
    qualtricsStaticNamespace: string

    wjxPort: number
    wjxRpc: string
    wjxProxy: string
    wjxServer: string
    wjxStaticNamespace: string

    qqwjPort: number
    qqwjRpc: string
    qqwjProxy: string
    qqwjServer: string
    qqwjStaticNamespace: string

    academusServiceUri: string
    pythonRobotUri: string
}
