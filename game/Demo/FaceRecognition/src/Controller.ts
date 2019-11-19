import * as request from 'request'
import * as qiniu from 'qiniu'
import { BaseController, IActor, IMoveCallback, Log, TPlayerState } from '@bespoke/server'
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PushType,
  qiniuTokenLifetime,
  TResultItem
} from './config'
import { elfSetting } from '@elf/setting'

const { qiNiu } = elfSetting

export default class Controller extends BaseController<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  _qiniuUploadToken: string

  get qiniuUploadToken(): string {
    if (!this._qiniuUploadToken) {
      this._qiniuUploadToken = new qiniu.rs.PutPolicy({
        scope: qiNiu.upload.bucket,
        expires: qiniuTokenLifetime
      }).uploadToken(new qiniu.auth.digest.Mac(qiNiu.upload.ACCESS_KEY, qiNiu.upload.SECRET_KEY))
      setTimeout(() => (this._qiniuUploadToken = null), (qiniuTokenLifetime - 3) * 1000) //在七牛token失效前弃用,下次请求生成新token
    }
    return this._qiniuUploadToken
  }

  protected async playerMoveReducer(
    actor: IActor,
    type: MoveType,
    params: IMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    switch (type) {
      case MoveType.getQiniuConfig: {
        cb(this.qiniuUploadToken)
        break
      }
      case MoveType.recognize: {
        await request.post(
          {
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
          },
          async (error, response, body) => {
            let resultItems: TResultItem[] = []
            const result = JSON.parse(body)
            if (error || result.error) {
              Log.e(error || result.error)
            } else {
              resultItems = result
            }
            cb(resultItems)
            const playerState = await this.stateManager.getPlayerState(actor)
            playerState.result = resultItems[0]
          }
        )
        break
      }
    }
  }
}
