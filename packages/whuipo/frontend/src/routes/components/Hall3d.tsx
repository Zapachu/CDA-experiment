import * as React from 'react'
import * as BABYLON from 'babylonjs'

import socket from 'socket.io-client'
import {Button, Loading, MatchModal, Modal, PlayMode} from '@bespoke-game/stock-trading-component'
import {Toast} from '@elf/component'
import 'pepjs'
import qs from 'qs'

import {reqInitInfo} from '../../services'
import {clientSocketListenEvnets, GameTypes, ResCode, serverSocketListenEvents, UserDoc} from '../../enums'
import gameDesc from './gameDesc'

import BabylonScene from './BabylonScene'
import Detail from './detail.png'
import Hall from './hall.jpg'
import LockIcon from './lock.png'
import UnLockIcon from './unlock.png'
import style from './style.less'

const zLargeDistance = 500

const cardWidth = 120
const cardHeight = cardWidth * (347 / 620)


const redirect = (url) => {
  if (APP_TYPE === 'production') {
    location.href = url
    return
  }
  const obj = new URL(url)
  obj.hostname = location.hostname
  location.href = obj.toString()
}

enum PlayModes {
  Single,
  Multi
}

enum GameSteps { first, second, third, fourth, fifth }

const GamePhaseToStep = {
  [GameTypes.OpenAuction]: GameSteps.first,
  [GameTypes.IPO_Median]: GameSteps.second,
  [GameTypes.IPO_TopK]: GameSteps.second,
  [GameTypes.IPO_FPSBA]: GameSteps.second,
  [GameTypes.TBM]: GameSteps.third,
  [GameTypes.CBM]: GameSteps.fifth,
  [GameTypes.CBM_Leverage]: GameSteps.fifth
}
const GameStepsToGamePhase = {
  [GameSteps.first]: GameTypes.OpenAuction,
  [GameSteps.second]: [GameTypes.IPO_TopK, GameTypes.IPO_Median, GameTypes.IPO_FPSBA],
  [GameSteps.third]: GameTypes.TBM,
  [GameSteps.fourth]: GameTypes.CBM,
  [GameSteps.fifth]: GameTypes.CBM_Leverage
}

const gamePhaseOrder = {
  [GameTypes.IPO_Median]: 1,
  [GameTypes.IPO_TopK]: 1,
  [GameTypes.IPO_FPSBA]: 1,
  [GameTypes.OpenAuction]: 1,
  [GameTypes.TBM]: 2,
  [GameTypes.CBM]: 3,
  [GameTypes.CBM_Leverage]: 3
}

const gamePhaseVideoSrc = {
  [GameTypes.IPO_TopK]: 'https://qiniu0.anlint.com/video/whuipo/ipohe.mp4',
  [GameTypes.IPO_Median]: 'https://qiniu0.anlint.com/video/whuipo/ipozhong.mp4',
  [GameTypes.TBM]: 'https://qiniu0.anlint.com/video/whuipo/jihejinjia.mp4',
  [GameTypes.CBM]: 'https://qiniu0.anlint.com/video/whuipo/lianxujinjia.mp4',
  [GameTypes.CBM_Leverage]: 'https://qiniu0.anlint.com/video/whuipo/rongzirongquan.mp4',
}

const gamePhaseLabel = {
  [GameTypes.IPO_Median]: '中位数定价',
  [GameTypes.IPO_TopK]: '荷兰式拍卖',
  [GameTypes.IPO_FPSBA]: '第一价格密封拍卖',
  [GameTypes.OpenAuction]: '公开竞价拍卖',
  [GameTypes.TBM]: '集合竞价',
  [GameTypes.CBM]: '连续竞价',
  [GameTypes.CBM_Leverage]: '融资融券'
}

const GameRenderConfigs = {
  [GameSteps.first]: {
    maskSize: {
      width: 80,
      height: 30,
    },
    maskPosition: {
      x: -364,
      y: 57,
      z: 330
    },
    maskRotateY: -Math.PI / 4,
    introPosition: {
      x: -250,
      y: 40,
      z: 400
    },
    introRotateY: -Math.PI / 4,
    introContent: 'ipo ipo test',
    lockIconPosition: {
      x: -345,
      y: 95,
      z: 320
    },
    isLock: false,
  },
  [GameSteps.second]: {
    maskSize: {
      width: 80,
      height: 30,
    },
    maskPosition: {
      x: -364,
      y: 57,
      z: 330
    },
    maskRotateY: -Math.PI / 4,
    introPosition: {
      x: -250,
      y: 40,
      z: 400
    },
    introRotateY: -Math.PI / 4,
    introContent: 'ipo ipo test',
    lockIconPosition: {
      x: -345,
      y: 95,
      z: 320
    },
    isLock: false,
  },
  [GameSteps.third]: {
    maskSize: {
      width: 100,
      height: 50
    },
    maskPosition: {
      x: 0,
      y: 119,
      z: 480
    },
    maskRotateY: 0,
    introPosition: {
      x: 120,
      y: 90,
      z: 450
    },
    introRotateY: 0,
    introContent: 'ipo ipo test',
    lockIconPosition: {
      x: 0,
      y: 165,
      z: 460
    },
    isLock: false,
  },
  [GameSteps.fourth]: {
    maskSize: {
      width: 80,
      height: 30
    },
    maskPosition: {
      x: 363,
      y: 66,
      z: 330
    },
    maskRotateY: Math.PI / 4,
    introPosition: {
      x: 250,
      y: 72,
      z: 400
    },
    introRotateY: Math.PI / 4,
    introContent: 'ipo ipo test',
    lockIconPosition: {
      x: 355,
      y: 100,
      z: 325
    },
    isLock: false,
  },
  [GameSteps.fifth]: {
    maskSize: {
      width: 80,
      height: 30
    },
    maskPosition: {
      x: 363,
      y: 66,
      z: 330
    },
    maskRotateY: Math.PI / 4,
    introPosition: {
      x: 250,
      y: 72,
      z: 400
    },
    introRotateY: Math.PI / 4,
    introContent: 'ipo ipo test',
    lockIconPosition: {
      x: 355,
      y: 100,
      z: 325
    },
    isLock: false,
  },
}

interface Props {

}

enum ModalContentTypes {
  selectSubGameType,
  gameTypeDesc,
  continueGame,
  selectMode,
  preMatch,
  waittingMatch,
  matchSuccess
}

interface State {
  isDetailView: boolean,
  focusGameStep: GameSteps,
  showPreStartModal: boolean
  modalContentType?: ModalContentTypes,
  isInitView: boolean,
  focusGameType?: GameTypes,
  matchTimer?: number,
  score:number
}

export default class Hall3D extends React.Component<Props, State> {
  camera: BABYLON.ArcRotateCamera
  scene: BABYLON.Scene
  gamePhaseVideoRefs: {
    [game: string]: HTMLVideoElement
  } = {}
  hoverShowTimer: {
    [gameStep: string]: number
  } = {}
  hoverMaskInstance: {
    [gameStep: string]: BABYLON.Mesh
  } = {}
  gameIntroInstance: {
    [gameStep: string]: BABYLON.Mesh
  } = {}
  io: SocketIOClient.Socket
  matchTimer: number
  continuePlayUrl: string
  state: State = {
    score:0,
    isInitView: true,
    focusGameStep: null,
    showPreStartModal: false,
    isDetailView: false,
    focusGameType: null,
  }

  reqInitInfo() {
    reqInitInfo().then(res => {
      if (res.code === ResCode.success) {
        this.connectSocket()
        const user: UserDoc = res.user
        const {unblockGamePhase} = user
        this.setState({score:user.phaseScore.reduce((m,n)=>m+n,0)})
        const userUnBlockGameOrder = gamePhaseOrder[unblockGamePhase] || 0
        Object.keys(GameRenderConfigs).forEach((gameStep) => {

          const gamePhase = GameStepsToGamePhase[gameStep]
          const gameStepPhaseOrder = gamePhaseOrder[gamePhase instanceof Array ? gamePhase[0] : gamePhase]
          const isLock = gameStepPhaseOrder > (userUnBlockGameOrder + 1)
          GameRenderConfigs[gameStep].isLock = isLock
        })
        this.initView()

        const urlObj = new URL(window.location.href)
        const queryObj = qs.parse(urlObj.search.replace('?', '')) || {}
        if (queryObj.gamePhase) {
          const step = GamePhaseToStep[queryObj.gamePhase]
          this.handleSelectGame(step)
          setTimeout(_ => {
            this.setState({
              showPreStartModal: true,
              modalContentType: ModalContentTypes.selectMode,
              focusGameType: queryObj.gamePhase,
            })
          }, 2000)
        }

        return
      }
      throw new Error(res.msg)
    }).catch(e => {
      console.error(e)
    })
  }

  registerShowDetailView() {
    setTimeout(() => {
      this.setState({
        isDetailView: true
      })
    }, 2000)
  }

  renderModal() {
    const {showPreStartModal, modalContentType, focusGameStep, focusGameType, matchTimer} = this.state
    const handleClose = async () => {
      if (this.matchTimer) {
        clearInterval(this.matchTimer)
      }
      const videoNodeRef = this.gamePhaseVideoRefs[focusGameType]
      if (videoNodeRef) {
        videoNodeRef.pause()
      }
      if (modalContentType === ModalContentTypes.gameTypeDesc) {
        this.setState({
          modalContentType: ModalContentTypes.selectMode
        })
        return
      }
      this.setState({
        showPreStartModal: false
      })
      if ([ModalContentTypes.waittingMatch, ModalContentTypes.preMatch].includes(modalContentType)) {
        this.io.emit(serverSocketListenEvents.leaveMatchRoom, {
          gamePhase: focusGameType
        })
      }

    }

    const handleSelectGameMode = (isGroupMode: boolean) => {
      this.io.emit(serverSocketListenEvents.reqStartGame, {isGroupMode, gamePhase: focusGameType})
      this.setState({
        modalContentType: ModalContentTypes.preMatch
      })
    }

    if (modalContentType === ModalContentTypes.waittingMatch) {
      return <MatchModal visible={true} totalNum={4} matchNum={matchTimer % 5} timer={matchTimer}></MatchModal>
    }
    const videoUrl = gamePhaseVideoSrc[focusGameType]
    return <Modal visible={showPreStartModal}>
      <div className={style.modalContent}>
        {
          modalContentType === ModalContentTypes.selectSubGameType &&
          <div className={style.selectSubGame}>
            {
              (GameStepsToGamePhase[focusGameStep] as Array<GameTypes>).map((gameType: GameTypes) => {
                const onClick = _ => {
                  this.setState({focusGameType: gameType, modalContentType: ModalContentTypes.selectMode})
                }
                return <Button key={gameType} onClick={onClick} label={gamePhaseLabel[gameType]}></Button>
              })
            }
          </div>
        }
        {
          modalContentType === ModalContentTypes.gameTypeDesc &&
          <div className={style.gameDesc}>
              <div className={style.title}>
                  <div className={style.label}>
                      <div>{gamePhaseLabel[focusGameType]}</div>
                  </div>
                  <div className={style.splitLine}></div>
              </div>
              <div className={style.detail}>
                {gameDesc[focusGameType]}
              </div>
          </div>
        }
        {
          modalContentType === ModalContentTypes.continueGame &&
          <div className={style.continueGame}>
              <div className={style.label}>您尚有实验正在进行中，继续该实验吗？</div>
              <Button onClick={_ => redirect(this.continuePlayUrl)} label="继续"></Button>
          </div>
        }
        {
          modalContentType === ModalContentTypes.selectMode &&
          <div className={style.selectGameMode}>
              <div className={style.baseBox}>
                  <div className={style.label}>
                      <div>{gamePhaseLabel[focusGameType]}</div>
                      <div className={style.customShowGameDescBtn}
                           onClick={_ => this.setState({modalContentType: ModalContentTypes.gameTypeDesc})}>详细规则
                      </div>
                  </div>
                  <div className={style.splitLine}></div>
                {
                  !!videoUrl &&
                  <video src={videoUrl} controls autoPlay ref={node => this.gamePhaseVideoRefs[focusGameType] = node}/>
                }
              </div>
              <PlayMode onPlay={(playMode: any) => handleSelectGameMode(playMode === PlayModes.Multi)}/>
          </div>
        }
        {
          modalContentType === ModalContentTypes.preMatch &&
          <div>
              <Loading label="处理中"/>
          </div>
        }
        {
          modalContentType === ModalContentTypes.matchSuccess &&
          <div className={style.matchSuccess}>
              玩家匹配成功！
          </div>
        }
        <div className={style.bottom}>
          <Button onClick={handleClose} label="返回"></Button>
        </div>
      </div>
    </Modal>
  }

  handlePointerOver(gameStep: GameSteps) {
    return
    if (!this.state.isDetailView) {
      return
    }
    if (this.hoverShowTimer[gameStep]) {
      return
    }
    if (this.gameIntroInstance[gameStep]) {
      return
    }
    this.hoverShowTimer[gameStep] = window.setTimeout(() => {
      this.gameIntroInstance[gameStep] = this.renderGameIntroCard(gameStep)
      this.hoverShowTimer[gameStep] = null
    }, 600)
  }

  handlePointerOut(gameStep: GameSteps) {
    if (!this.state.isDetailView) {
      return
    }
    const timerId = this.hoverShowTimer[gameStep]
    if (timerId) {
      clearTimeout(timerId)
      this.hoverShowTimer[gameStep] = null
      return
    }
    const instance = this.gameIntroInstance[gameStep]
    if (instance) {
      this.scene.removeMesh(instance)
      this.gameIntroInstance[gameStep] = null
    }
  }

  handleSelectGame(gameStep: GameSteps) {
    const funMap = {
      [GameSteps.first]: ()=>this.handleShowLeftDetail(),
      [GameSteps.second]: ()=>this.handleShowLeftDetail(),
      [GameSteps.third]: ()=>this.handleShowCenterDetail(),
      [GameSteps.fourth]: ()=>this.handleShowRightDetail(),
      [GameSteps.fifth]: ()=>this.handleShowRightDetail()
    }
    funMap[gameStep]()
    setTimeout(()=>{
      this.handleShowGameModal(gameStep)
    },2e3)
  }

  renderGameIntroCard(gameStep: GameSteps) {
    const {introPosition, introContent, introRotateY} = GameRenderConfigs[gameStep]
    const {scene} = this

    const ground = BABYLON.MeshBuilder.CreateGround(`introGround${gameStep}`, {
      width: cardWidth,
      height: cardHeight
    }, scene)

    const textureGround = new BABYLON.DynamicTexture(`dynamicTexture${gameStep}`, {
      width: cardWidth,
      height: cardHeight
    }, scene, false)
    textureGround.hasAlpha = true

    const materialGround = new BABYLON.StandardMaterial(`introMaterial${gameStep}`, scene)
    materialGround.diffuseTexture = textureGround
    materialGround.emissiveColor = new BABYLON.Color3(1, 1, 1)
    ground.material = materialGround

    const textureContext = textureGround.getContext()
    const img = new Image()
    img.src = Detail
    img.onload = function () {
      const fontType = 'Arial'
      const testFontSize = 12
      textureContext.font = `${testFontSize}px ${fontType}`
      const textWidth = textureContext.measureText(introContent).width
      const ratio = textWidth / testFontSize

      const realFontSize = cardWidth / (ratio * 1.4)
      textureContext.drawImage(this as any, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, cardWidth, cardHeight)
      textureGround.update()

      const font = `bold ${realFontSize}px ${fontType}`
      textureGround.drawText(introContent, null, 20, font, 'white', null)
      textureGround.update()
    }
    ground.position = new BABYLON.Vector3(introPosition.x, introPosition.y, introPosition.z)
    ground.rotation.x = -Math.PI / 2
    ground.rotation.y = introRotateY
    return ground
  }

  renderHoverMaskInstance(gameStep: GameSteps) {
    return
    const {maskPosition, maskSize, maskRotateY = 0} = GameRenderConfigs[gameStep]
    const myGround = BABYLON.MeshBuilder.CreateGround(`hoverMask${gameStep}`, {
      width: maskSize.width,
      height: maskSize.height,
      subdivisions: 4
    }, this.scene)
    const myMaterial = new BABYLON.StandardMaterial(`hoverMaskMaterial${gameStep}`, this.scene)
    myGround.position.x = maskPosition.x
    myGround.position.y = maskPosition.y
    myGround.position.z = maskPosition.z
    myGround.rotation.x = -Math.PI / 2
    myGround.rotation.y = maskRotateY
    myGround.material = myMaterial
    myGround.material.alpha = 0
    myGround.actionManager = new BABYLON.ActionManager(this.scene)
    myGround.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnPointerOverTrigger,
      },
      this.handlePointerOver.bind(this, gameStep)
    ))
    myGround.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnPointerOutTrigger,
      },
      this.handlePointerOut.bind(this, gameStep)
    ))
    myGround.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnPickDownTrigger,
      },
      this.handleShowGameModal.bind(this, gameStep)
    ))
    return myGround
  }

  renderLockIcon(gameStep: GameSteps) {
    new BABYLON.DirectionalLight('direct', new BABYLON.Vector3(0, 1, 1), this.scene)

    const {isLock, lockIconPosition, maskRotateY} = GameRenderConfigs[gameStep]
    const ground = BABYLON.Mesh.CreateGround(`lockGround${gameStep}`, 30, 30 * (186 / 144), 1, this.scene)
    const myMaterial = new BABYLON.StandardMaterial(`lockMat${gameStep}`, this.scene)
    const texture = new BABYLON.Texture(isLock ? LockIcon : UnLockIcon, this.scene)
    texture.hasAlpha = true
    myMaterial.diffuseTexture = texture
    ground.material = myMaterial
    ground.rotation.x = -Math.PI / 2
    ground.rotation.y = maskRotateY
    ground.position = new BABYLON.Vector3(lockIconPosition.x, lockIconPosition.y, lockIconPosition.z)
    const myGround = ground
    myGround.actionManager = new BABYLON.ActionManager(this.scene)
    myGround.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnPointerOverTrigger,
      },
      this.handlePointerOver.bind(this, gameStep)
    ))
    myGround.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnPointerOutTrigger,
      },
      this.handlePointerOut.bind(this, gameStep)
    ))
    myGround.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnPickDownTrigger,
      },
      this.handleShowGameModal.bind(this, gameStep)
    ))
  }

  handleShowLeftDetail() {
    const frameRate = 20
    const movein = new BABYLON.Animation('movein', 'position', frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)

    const movein_keys = []

    movein_keys.push({
      frame: 0,
      value: new BABYLON.Vector3(0, 0, -zLargeDistance)
    })

    movein_keys.push({
      frame: 1 * frameRate,
      value: new BABYLON.Vector3(zLargeDistance / 2, 0, -zLargeDistance / 2)
    })

    movein_keys.push({
      frame: 2 * frameRate,
      value: new BABYLON.Vector3(5, 0, -5)
    })
    movein.setKeys(movein_keys)
    this.scene.beginDirectAnimation(this.camera, [movein], 0, 9 * frameRate, false)
    this.registerShowDetailView()
  }

  handleShowCenterDetail() {
    const frameRate = 20
    const movein = new BABYLON.Animation('movein', 'position', frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)

    const movein_keys = []

    movein_keys.push({
      frame: 0,
      value: new BABYLON.Vector3(0, 0, -zLargeDistance)
    })

    movein_keys.push({
      frame: 1 * frameRate,
      value: new BABYLON.Vector3(0, -zLargeDistance / 10, -zLargeDistance / 2)
    })

    movein_keys.push({
      frame: 2 * frameRate,
      value: new BABYLON.Vector3(0, -1, -5)
    })
    movein.setKeys(movein_keys)
    this.scene.beginDirectAnimation(this.camera, [movein], 0, 9 * frameRate, false)
    this.registerShowDetailView()
  }

  handleShowRightDetail() {
    const frameRate = 20
    const movein = new BABYLON.Animation('movein', 'position', frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)

    const movein_keys = []

    movein_keys.push({
      frame: 0,
      value: new BABYLON.Vector3(0, 0, -zLargeDistance)
    })

    movein_keys.push({
      frame: 1 * frameRate,
      value: new BABYLON.Vector3(-zLargeDistance / 2, 0, -zLargeDistance / 2)
    })

    movein_keys.push({
      frame: 2 * frameRate,
      value: new BABYLON.Vector3(-5, 0, -5)
    })
    movein.setKeys(movein_keys)
    this.scene.beginDirectAnimation(this.camera, [movein], 0, 9 * frameRate, false)
    this.registerShowDetailView()
  }

  handleCancelOverview() {
    const pos = new BABYLON.Vector3(0, 0, -zLargeDistance)
    this.camera.setPosition(pos)
    this.setState({
      isDetailView: false
    })
  }

  handleShowGameModal(gameStep: GameSteps) {
    const {isLock} = GameRenderConfigs[gameStep]
    if (isLock) {
      Toast.warn('尚未解锁！')
      return
    }
    const gameType = GameStepsToGamePhase[gameStep]
    const isArray = gameType instanceof Array
    this.setState({
      showPreStartModal: true,
      modalContentType: isArray ? ModalContentTypes.selectSubGameType : ModalContentTypes.selectMode,
      focusGameStep: gameStep,
      focusGameType: isArray ? null : (gameType as GameTypes)
    })
  }

  initView() {
    const pos = new BABYLON.Vector3(0, 0, -zLargeDistance)
    this.camera.setPosition(pos)

    Object.keys(GameRenderConfigs).forEach((gameStep) => {
      let maskInstance = this.hoverMaskInstance[gameStep]
      if (!maskInstance) {
        maskInstance = this.renderHoverMaskInstance(Number(gameStep))
        this.hoverMaskInstance[gameStep] = maskInstance
      }
      this.renderLockIcon(Number(gameStep))
    })
    setTimeout(() => {
      this.setState({
        isInitView: false
      })
    }, 500)
  }

  handleSceneMount({engine, scene, canvas}) {
    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0, 0, 5,
      BABYLON.Vector3.Zero(),
      scene
    )
    this.scene = scene
    this.camera = camera

    camera.attachControl(canvas, true)
    camera.inputs.attached.mousewheel.detachControl(canvas)

    new BABYLON.PhotoDome(
      'hall',
      Hall,
      {
        resolution: 32,
        size: 1000
      },
      scene
    )
    this.reqInitInfo()

    scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {

        case BABYLON.PointerEventTypes.POINTERUP:
          break
        case BABYLON.PointerEventTypes.POINTERMOVE:
          break
      }
    })

    engine.runRenderLoop(() => {
      if (scene) {
        scene.render()
      }
    })
  }

  connectSocket() {
    const io = socket.connect('/')
    this.io = io
    io.on(clientSocketListenEvnets.startMatch, () => {
      this.setState({
        modalContentType: ModalContentTypes.waittingMatch,
        matchTimer: 0
      })
      this.matchTimer = window.setInterval(() => {
        this.setState({
          matchTimer: this.state.matchTimer + 1
        })
      }, 1000)
    })
    io.on(clientSocketListenEvnets.startGame, ({playerUrl}) => {
      if (this.matchTimer) {
        clearInterval(this.matchTimer)
      }
      this.setState({
        modalContentType: ModalContentTypes.matchSuccess
      })
      setTimeout(() => {
        redirect(playerUrl)
      }, 1000)
    })
    io.on(clientSocketListenEvnets.continueGame, ({playerUrl}) => {
      this.setState({
        modalContentType: ModalContentTypes.continueGame,
      })
      this.continuePlayUrl = playerUrl
    })
    io.on(clientSocketListenEvnets.handleError, (data: { eventType: serverSocketListenEvents, msg: string }) => {
      const {eventType, msg} = data
      if (eventType === serverSocketListenEvents.reqStartGame) {
        // Todo
        Toast.error(msg)
      }
      if (eventType === serverSocketListenEvents.leaveMatchRoom) {
        // TODO
        Toast.error(msg)
      }
    })
  }

  render() {
    const {isDetailView, isInitView, score} = this.state
    return <div>
      <span className={style.score}>
        Score: {score}
      </span>
      {
        isInitView && <div className={style.loading}>
            <Loading label="加载中"/>
        </div>
      }
      {
        isDetailView && <div className={style.actionBtns}>
            <Button onClick={this.handleCancelOverview.bind(this)} label="返回"/>
        </div>
      }
      {this.renderModal()}
      <BabylonScene
        style={{width: '100vw', height: '100vh'}}
        onSceneMount={this.handleSceneMount.bind(this)}
      />
      <section className={style.dock}>
        <div onClick={() => this.handleSelectGame(GameSteps.first)}>
          <label>市场拍卖</label>
          <img src={require('../../assets/dock/auction.png')}/>
        </div>
        <div onClick={() => this.handleSelectGame(GameSteps.second)}>
          <label>IPO</label>
          <img src={require('../../assets/dock/ipo.png')}/>
        </div>
        <div onClick={() => this.handleSelectGame(GameSteps.third)}>
          <label>集合竞价</label>
          <img src={require('../../assets/dock/tbm.png')}/>
        </div>
        <div onClick={() => this.handleSelectGame(GameSteps.fourth)}>
          <label>连续竞价</label>
          <img src={require('../../assets/dock/cbm.png')}/>
        </div>
        <div onClick={() => this.handleSelectGame(GameSteps.fifth)}>
          <label>融资融券</label>
          <img src={require('../../assets/dock/cbm_l.png')}/>
        </div>
      </section>
    </div>
  }
}

