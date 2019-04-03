import * as request from 'request'
import * as qiniu from 'qiniu'
import {BaseController, IActor, IMoveCallback, Log} from 'bespoke-server'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import {FetchType, MoveType, PushType, qiniuTokenLifetime} from './config'
import {elfSetting} from 'elf-setting'

const {qiNiu} = elfSetting

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    _qiniuUploadToken: string

    get qiniuUploadToken(): string {
        if (!this._qiniuUploadToken) {
            this._qiniuUploadToken = new qiniu.rs.PutPolicy({
                scope: qiNiu.upload.bucket,
                expires: qiniuTokenLifetime
            }).uploadToken(new qiniu.auth.digest.Mac(qiNiu.upload.ACCESS_KEY, qiNiu.upload.SECRET_KEY))
            setTimeout(() => this._qiniuUploadToken = null, (qiniuTokenLifetime - 3) * 1000)//在七牛token失效前弃用,下次请求生成新token
        }
        return this._qiniuUploadToken
    }


    protected async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        switch (type) {
            case MoveType.getQiniuConfig: {
                cb(this.qiniuUploadToken)
                break
            }
            case MoveType.recognize: {
                request.post({
                    uri: elfSetting.ocpApim.gateWay,
                    qs: {
                        returnFaceId: true,
                        returnFaceLandmarks: true,
                        returnFaceAttributes: 'age,gender,emotion'
                    },
                    body: JSON.stringify({
                        url: `${qiNiu.download.jsDomain}/${params.imageName}`
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': elfSetting.ocpApim.subscriptionKey
                    }
                }, (error, response, body) => {
                    if (error) {
                        Log.e(error)
                        return cb([])
                    }
                    cb(JSON.parse(body))
                })
                break
            }
        }
    }
}
