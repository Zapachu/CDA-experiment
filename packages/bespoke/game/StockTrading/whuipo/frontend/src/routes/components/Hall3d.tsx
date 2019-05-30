import * as React from "react";
import * as BABYLON from "babylonjs";
import { Button, Modal, Spin } from 'antd'
import socket from 'socket.io-client'
import 'pepjs'

import {reqInitInfo} from '../../services/index'
import {serverSocketListenEvents, clientSocketListenEvnets, ResCode, UserDoc, UserGameStatus, GameTypes} from '../../enums'
import Line2d from './line2d'

import BabylonScene from "./BabylonScene";
import PANO from "./pano.png";
import Detail from './detail.png'
import Arrow from './arrow.png'

import 'antd/dist/antd.css';
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
  obj.host = '192.168.56.1:8081'
  location.href = obj.toString()
}

enum GameSteps { left, center, right }
const GamePhaseToStep = {
  [GameTypes.IPO_Median]: GameSteps.center,
  [GameTypes.IPO_TopK]: GameSteps.center,
  [GameTypes.CBM]: GameSteps.right,
  [GameTypes.TBM]: GameSteps.left
}
const GameStepsToGamePhase = {
  [GameSteps.left]: GameTypes.TBM,
  [GameSteps.right]: GameTypes.CBM
}

const GameRenderConfigs = {
  [GameSteps.left]: {
    maskSize: {
      width: 80,
      height: 30,
    },
    maskPosition: {
      x: -364,
      y: 57,
      z: 330
    },
    maskRotateY: - Math.PI / 4,
    introPosition: {
      x: -250,
      y: 40,
      z: 400
    },
    introRotateY: - Math.PI / 4,
    introContent: 'ipo ipo test',
    btnPosition: {
      x: -200,
      y: -80,
      z: -50
    }
  },
  [GameSteps.center]: {
    maskSize: {
      width: 100,
      height: 50
    },
    maskPosition: {
      x: 0,
      y:119,
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
    btnPosition: {
      x: 0,
      y: -80,
      z: -50
    }

  },
  [GameSteps.right]: {
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
    btnPosition: {
      x: 200,
      y: -80,
      z: -50
    }
  },
}
interface Props {

}

enum ModalContentTypes {
  selectSubGameType,
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
  focusGameType?: GameTypes
}

class Hall3D extends React.Component<Props, State> {
  camera: BABYLON.ArcRotateCamera
  scene: BABYLON.Scene
  hoverShowTimer: {
    [gameStep: string]: NodeJS.Timer
  }
  hoverMaskInstance: {
    [gameStep: string]: BABYLON.Mesh
  }
  gameIntroInstance: {
    [gameStep: string]: BABYLON.Mesh
  }
  io: SocketIOClient.Socket
  constructor(props) {
    super(props)
    this.hoverMaskInstance = {}
    this.gameIntroInstance = {}
    this.hoverShowTimer = {}
    this.state = {
      isInitView: true,
      focusGameStep: null,
      showPreStartModal: false,
      isDetailView:false,
      focusGameType: null
    }

  }
  componentDidMount () {
    console.log(APP_TYPE, 'apptype')
    this.reqInitInfo()
  }
  reqInitInfo () {
    reqInitInfo().then(res => {
      console.log(res)
      if (res.code === ResCode.success) {
        this.connectSocket()
        const user: UserDoc = res.user
        const {status, playerUrl, nowJoinedGame} = user
        if (!!nowJoinedGame) {
          if (status === UserGameStatus.end) {
            return
          } else if (status === UserGameStatus.started) {
            // location.href = playerUrl
            redirect(playerUrl)
          } else {
            const step = GamePhaseToStep[nowJoinedGame]
            this.handleSelectGame(step)
            setTimeout(_ => {
              this.setState({
                showPreStartModal: true,
                modalContentType: status === UserGameStatus.waittingMatch ? ModalContentTypes.waittingMatch : ModalContentTypes.selectMode,
                focusGameType: nowJoinedGame,
              })
            }, 2000)
          } 
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
    }, 2000);
  }
  renderModal () {
    const {showPreStartModal, modalContentType, focusGameStep, focusGameType} = this.state
    const handleClose = async () => {
      this.setState({
        showPreStartModal: false
      })
      if ([ModalContentTypes.waittingMatch, ModalContentTypes.preMatch].includes(modalContentType)) {
       this.io.emit(serverSocketListenEvents.leaveMatchRoom)
      }
    }
    const handleSelectGameMode = (isGroupMode: boolean) => {
      this.io.emit(serverSocketListenEvents.reqStartGame, {isGroupMode, gamePhase: focusGameType})
      this.setState({
        modalContentType: ModalContentTypes.preMatch
      })
    }
    return <Modal visible={showPreStartModal} onCancel={handleClose}>
       {
          modalContentType === ModalContentTypes.selectSubGameType && 
          <div>
              <Button onClick={_ => this.setState({focusGameType: GameTypes.IPO_Median, modalContentType: ModalContentTypes.selectMode})}>IPO_Median</Button>
              <Button onClick={_ => this.setState({focusGameType: GameTypes.IPO_TopK, modalContentType: ModalContentTypes.selectMode})}>IPO_TopK</Button>
          </div>
        }
        {
          modalContentType === ModalContentTypes.selectMode && 
          <div>
              <Button onClick={_ => handleSelectGameMode(false)}>单人模式</Button>
              <Button onClick={_ => handleSelectGameMode(true)}>多人模式</Button>
          </div>
        }
         {
          modalContentType === ModalContentTypes.preMatch &&
          <div>
            <Spin/>
            <div>处理中....</div>
          </div>
        }
        {
          modalContentType === ModalContentTypes.waittingMatch &&
          <div>
            <Spin/>
            <div>匹配中....</div>
          </div>
        }
        {
          modalContentType === ModalContentTypes.matchSuccess &&
          <div>
            玩家匹配成功！
          </div>
        }
    </Modal>
  }
  handlePointerOver (gameStep: GameSteps) {
    // console.log('onver', gameStep, arguments)
    if (!this.state.isDetailView) {
      return
    }
    if (this.hoverShowTimer[gameStep]) {
      return
    }
    if (this.gameIntroInstance[gameStep]) {
      return
    }
    const timerId = setTimeout(() => {
       const introInstance = this.renderGameIntroCard(gameStep)
       this.gameIntroInstance[gameStep] = introInstance
       this.hoverShowTimer[gameStep] = null
    }, 600);
    this.hoverShowTimer[gameStep] = timerId
  }
  handlePointerOut (gameStep: GameSteps) {
    // console.log('out', gameStep, arguments)
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
  handleSelectGame (gameStep: GameSteps) {
    console.log('click')
    const funMap = {
      [GameSteps.left]: this.handleShowLeftDetail.bind(this),
      [GameSteps.center]: this.handleShowCenterDetail.bind(this),
      [GameSteps.right]: this.handleShowRightDetail.bind(this)
    }
    funMap[gameStep]()
  }
  renderGameIntroCard(gameStep: GameSteps) {
    const {introPosition, introContent, introRotateY} = GameRenderConfigs[gameStep]
    const { scene } = this
    var light = new BABYLON.HemisphericLight(`light1${gameStep}`, new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.5;

    var ground = BABYLON.MeshBuilder.CreateGround(`introGround${gameStep}`, { width: cardWidth, height: cardHeight}, scene);

    var textureGround = new BABYLON.DynamicTexture(`dynamicTexture${gameStep}`, { width: cardWidth, height: cardHeight }, scene);
    var textureContext = textureGround.getContext();
    textureGround.hasAlpha = true

    var materialGround = new BABYLON.StandardMaterial(`introMaterial${gameStep}`, scene);
    materialGround.diffuseTexture = textureGround;
    materialGround.emissiveColor = new BABYLON.Color3(1, 1, 1)
    ground.material = materialGround;

    var textureContext = textureGround.getContext();
    var img = new Image();
    img.src = Detail;
    img.onload = function () {
      const fontType = 'Arial'
      const testFontSize = 12
      textureContext.font = `${testFontSize}px ${fontType}`
      const textWidth = textureContext.measureText(introContent).width
      const ratio = textWidth / testFontSize

      const realFontSize =  cardWidth / (ratio * 1.4)

      console.log(img.naturalWidth, img.naturalHeight, cardWidth, cardHeight)
      textureContext.drawImage(this, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, cardWidth, cardHeight);
      textureGround.update();

      var font = `bold ${realFontSize}px ${fontType}`;
      textureGround.drawText(introContent, null, 20, font, "white", null);
      textureGround.update();
    }
    ground.position.x = introPosition.x
    ground.position.y = introPosition.y
    ground.position.z = introPosition.z
    ground.rotation.x = - Math.PI / 2
    ground.rotation.y = introRotateY
    return ground
  }
  renderHoverMaskInstance (gameStep: GameSteps) {
    const {maskPosition, maskSize, maskRotateY = 0} = GameRenderConfigs[gameStep]
    console.log(maskPosition, maskSize, 'mask')
    const myGround = BABYLON.MeshBuilder.CreateGround(`hoverMask${gameStep}`, { width: maskSize.width, height: maskSize.height, subdivisions: 4 }, this.scene);
    const myMaterial = new BABYLON.StandardMaterial(`hoverMaskMaterial${gameStep}`, this.scene);
    myGround.position.x = maskPosition.x
    myGround.position.y = maskPosition.y
    myGround.position.z = maskPosition.z
    myGround.rotation.x = - Math.PI / 2
    myGround.rotation.y = maskRotateY
    myGround.material = myMaterial
    myGround.material.alpha = 0
    myGround.actionManager = new BABYLON.ActionManager(this.scene);
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
      this.handleStartGame.bind(this, gameStep)
    ))
    return myGround
  }
  renderGameStepBtn (gameStep: GameSteps) {
    const {btnPosition} = GameRenderConfigs[gameStep]
    console.log('render step', btnPosition, Detail)
    const myGround = BABYLON.MeshBuilder.CreateGround(`btn${gameStep}`, { width: 80, height: 30}, this.scene);
    const myMaterial = new BABYLON.StandardMaterial(`btnMat${gameStep}`, this.scene)
    const texture = new BABYLON.Texture(Arrow, this.scene)
    texture.hasAlpha = true
    myMaterial.emissiveTexture = texture
    myMaterial.alpha = 0.8
    myGround.material = myMaterial
    myGround.position.x = btnPosition.x
    myGround.position.y = btnPosition.y
    myGround.position.z = btnPosition.z
    myGround.rotation.x = - Math.PI / 4
    myGround.actionManager = new BABYLON.ActionManager(this.scene)
    myGround.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnPickDownTrigger,
      },
      this.handleSelectGame.bind(this, gameStep)
    ))
  }
  handleShowLeftDetail () {
    const frameRate = 20
    var movein = new BABYLON.Animation("movein", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var movein_keys = [];

    movein_keys.push({
      frame: 0,
      value: new BABYLON.Vector3(0, 0, -zLargeDistance)
    });

    movein_keys.push({
      frame: 1 * frameRate,
      value: new BABYLON.Vector3(zLargeDistance / 2, 0, -zLargeDistance / 2)
    });

    movein_keys.push({
      frame: 2 * frameRate,
      value: new BABYLON.Vector3(5, 0, -5)
    });
    movein.setKeys(movein_keys);
    this.scene.beginDirectAnimation(this.camera, [movein], 0, 9 * frameRate, false)
    this.registerShowDetailView()
  }
  handleShowCenterDetail () {
    const frameRate = 20
    var movein = new BABYLON.Animation("movein", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var movein_keys = [];

    movein_keys.push({
      frame: 0,
      value: new BABYLON.Vector3(0, 0, -zLargeDistance)
    });

    movein_keys.push({
      frame: 1 * frameRate,
      value: new BABYLON.Vector3(0, -zLargeDistance / 10, -zLargeDistance / 2)
    });

    movein_keys.push({
      frame: 2 * frameRate,
      value: new BABYLON.Vector3(0, -1, -5)
    });
    movein.setKeys(movein_keys);
    this.scene.beginDirectAnimation(this.camera, [movein], 0, 9 * frameRate, false)
    this.registerShowDetailView()
  }
  handleShowRightDetail () {
    const frameRate = 20
          var movein = new BABYLON.Animation("movein", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

          var movein_keys = [];

          movein_keys.push({
            frame: 0,
            value: new BABYLON.Vector3(0, 0, -zLargeDistance)
          });

          movein_keys.push({
            frame: 1 * frameRate,
            value: new BABYLON.Vector3(-zLargeDistance / 2, 0, -zLargeDistance / 2)
          });

          movein_keys.push({
            frame: 2 * frameRate,
            value: new BABYLON.Vector3(-5, 0, -5)
          });
          movein.setKeys(movein_keys);
          this.scene.beginDirectAnimation(this.camera, [movein], 0, 9 * frameRate, false)
          this.registerShowDetailView()
  }
  handleCancelOverview () {
      const pos = new BABYLON.Vector3(0, 0, -zLargeDistance)
      this.camera.setPosition(pos)
      this.setState({
        isDetailView: false
      })
  }
  handleStartGame (gameStep: GameSteps) {
    const gameType = GameStepsToGamePhase[gameStep]
    this.setState({
      showPreStartModal: true,
      modalContentType: gameType ? ModalContentTypes.selectMode : ModalContentTypes.selectSubGameType,
      focusGameStep: gameStep,
      focusGameType: gameType
    })
  }
  initView () {
    const pos = new BABYLON.Vector3(0, 0, -zLargeDistance)
    this.camera.setPosition(pos)
    
    Object.keys(GameRenderConfigs).forEach((gameStep) => {
      let maskInstance = this.hoverMaskInstance[gameStep]
      if (!maskInstance) {
        maskInstance =  this.renderHoverMaskInstance(Number(gameStep))
        this.hoverMaskInstance[gameStep] = maskInstance
      }
      this.renderGameStepBtn(Number(gameStep))
    })
    setTimeout(() => {
      this.setState({
        isInitView: false
      })
    }, 0);
  }
  handleSceneMount ({ engine, scene, canvas }) {
    // _showWorldAxis(scene, 1);
    const camera = new BABYLON.ArcRotateCamera(
      "Camera",
      0, 0, 5,
      BABYLON.Vector3.Zero(),
      scene
    );
    this.scene = scene
    this.camera = camera

    camera.attachControl(canvas, true);
    camera.inputs.attached.mousewheel.detachControl(canvas);

    const dome = new BABYLON.PhotoDome(
      "hall",
      PANO,
      {
        resolution: 32,
        size: 1000
      },
      scene
    );

    const path = [ 	
      new BABYLON.Vector3(-20, 0, 0),
          new BABYLON.Vector3(-10, 10, 0),
          new BABYLON.Vector3(0, 0, 0),
    ]
    const path2 = [ 	
        new BABYLON.Vector3(-20, -10, 0),
          new BABYLON.Vector3(-10, 0, 0),
          new BABYLON.Vector3(0, -10, 0),
    ]
    Line2d('testline', {
      path,
      width: 2,
      color: [0, 0, 1, 1]
    }, this.scene)
    Line2d('testline2', {
      path: path2,
      width: 2,
      color: [0, 0, 1, 1]
    }, this.scene)

    setTimeout(() => {
      this.initView()
    }, 500)
      
    // scene.onPointerObservable.add((pointerInfo) => {
    //   switch (pointerInfo.type) {

    //     case BABYLON.PointerEventTypes.POINTERUP:
    //       const { clientX, clientY } = pointerInfo.event
    //       const x = getRelativePageX(clientX), y = getRelativePageY(clientY)
    //       console.log(pointerInfo, x, y)
    //       break;
    //     case BABYLON.PointerEventTypes.POINTERMOVE:
    //       break;
    //   }
    // });

    engine.runRenderLoop(() => {
      if (scene) {
        scene.render();
      }
    });
  }
  connectSocket () {
    let socketUrl = APP_TYPE === 'production' ? 'localhost:3020' : '192.168.0.135:3020'
    const io = socket.connect(socketUrl)
    this.io = io
    io.on('connect', (socket) => {
        console.log('io connected')
    })
    io.on(clientSocketListenEvnets.startMatch, () => {
      console.log('recive startmatch')
      this.setState({
        modalContentType: ModalContentTypes.waittingMatch
      })
    })
    io.on(clientSocketListenEvnets.startGame, ({playerUrl}) => {
        console.log('recive start game', playerUrl)
        this.setState({
          modalContentType: ModalContentTypes.matchSuccess
        })
        setTimeout(() => {
          // location.href = playerUrl
          redirect(playerUrl)
        }, 1000)
    })       
  }
  render() {
    const {isDetailView, isInitView} = this.state
    return (
      <div>
        {/* <img src={Arrow}/> */}
        {
          isInitView && <div className={style.loading}>
            <Spin/>
          </div>
        }
        {
          isDetailView && <div className={style.actionBtns}>
            <Button onClick={this.handleCancelOverview.bind(this)}>返回</Button>
          </div>
        }
        {this.renderModal()}
        <BabylonScene
          style={{ width: "100vw", height: "100vh" }}
          onSceneMount={this.handleSceneMount.bind(this)}
        />
      </div>

    );
  }
}

export default Hall3D;

function _showWorldAxis(scene, size) {
  var makeTextPlane = function (text, color, size) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
    var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
    const planeMaterial = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    planeMaterial.backFaceCulling = false;
    planeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    planeMaterial.diffuseTexture = dynamicTexture;
    plane.material = planeMaterial;
    return plane;
  };
  var axisX = BABYLON.Mesh.CreateLines("axisX", [
    BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
    new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
  ], scene);
  axisX.color = new BABYLON.Color3(1, 0, 0);
  var xChar = makeTextPlane("X", "red", size / 10);
  xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
  var axisY = BABYLON.Mesh.CreateLines("axisY", [
    BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
    new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
  ], scene);
  axisY.color = new BABYLON.Color3(0, 1, 0);
  var yChar = makeTextPlane("Y", "green", size / 10);
  yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
  var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
    BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
    new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
  ], scene);
  axisZ.color = new BABYLON.Color3(0, 0, 1);
  var zChar = makeTextPlane("Z", "blue", size / 10);
  zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

