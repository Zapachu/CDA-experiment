import * as React from 'react'
import * as BABYLON from 'babylonjs'
import socket from 'socket.io-client'
import {Button, Loading, MatchModal, Modal} from '@micro-experiment/component'
import {NCreateParams, NSocketParam, Phase, ResCode, SocketEvent, UserDoc} from '@micro-experiment/share'
import {BasePlayMode, TBasePlayMode} from './PlayMode'
import {Toast} from '@elf/component'
import qs from 'qs'
import {getEnumKeys, redirect, reqInitInfo} from '../util'
import BabylonScene from './BabylonScene'
import {Detail, Hall, UnLockIcon} from '../asset'
import style from './style.less'

enum Dock { first, second, third, fourth, fifth }

enum GameType {IPO_Median, IPO_TopK, IPO_FPSBA, OpenAuction, TBM, CBM, CBM_Leverage}

const GameTypeConfig: {
  [key: number]: {
    phase: Phase,
    title: string,
    desc: string,
    dock: Dock,
    video?: string,
    PlayMode?: TBasePlayMode<any>
  }
} = {
  [GameType.IPO_TopK]: {
    phase: Phase.IPO,
    title: '荷兰式拍卖',
    dock: Dock.second,
    video: 'https://qiniu0.anlint.com/video/whuipo/ipohe.mp4',
    desc: `
    您在一个基金机构工作，您所在的基金机构经过对市场信息的精密分析，现对一个即将上市的股票有一个估值A元。您的公司给您提供了竞价资金B，要您在市场上参与该股票的询价过程。企业共发行了1万股股票，您与市场上其他交易者对该股票的估值可能相同，也可能不同，您需要与其他买家共同竞争购买股票。
    
    股票的成交价格规则如下：每个股票都有一个最低的保留价格C元，即市场上股票的价格低于最低保留价格时，企业选择不发售股票，因此您的出价必需大于最低保留价格C。当所有的交易者提交自己的拟购买价格和拟购买数量后，系统根据买家的拟购买价格由大到小进行排序后，第1万股股票对应的价格即为成交价格，而拟购买价格在成交价格之上的市场交易者获得购买资格，可购买数量按照价格排序后的拟购买数量依次进行分配。如若市场上拟购买总数小于企业发行的股票数量，则成交价格为最低保留价格C.
    
    以下是一个简单的例子：
    交易者A根据自己的估值给出的拟购买价格和拟购买数量分布为98元和5000股，交易者B给出的拟购买价格和购买数量为96元和6000股，交易者C给出的拟购买价格和购买数量为104元和3000股，交易者D给出的拟购买价格和购买数量为107元和4000股，您根据自己的估值105元给出的拟购买数量和拟购买价格是101元和6000股。
    系统按照购买价格的由高到低进行排序：
    D：107元——4000股
    C:  104元——3000股
    您：101元——6000股
    A：98元——5000股
    B：96元——6000股
    
    决定成交价格: 则整个市场的拟购买总股数为24000，第10000股价格为101元，则成交价格为101元。
    
    决定购买数量：您、D和C都有购买这1万股股票的权利。按照价格排序后，D可购买的数量为4000股，C可购买的数量为3000股，市场上还剩3000股股票。虽然您的拟购买数量为6000股，但是此时您只能购买3000股。A和B未买购买到股票。
    
    您的收益（您对股票的估值-股票的成交价格）*您的购买数量
    `
  },
  [GameType.IPO_Median]: {
    phase: Phase.IPO,
    title: '中位数定价',
    dock: Dock.second,
    video: 'https://qiniu0.anlint.com/video/whuipo/ipozhong.mp4',
    desc: `
    您在一个基金机构工作，您所在的基金机构经过对市场信息的精密分析，现对一个即将上市的股票有一个估值A元。您的公司给您提供了竞价资金B，要您在市场上参与该股票的询价过程。企业共发行了1万股股票，您与市场上其他交易者对该股票的估值可能相同，也可能不同，您需要与其他买家共同竞争购买股票。

    股票的成交价格规则如下：每个股票都有一个最低的保留价格C元，即市场上股票的价格低于最低保留价格时，企业选择不发售股票，因此您的出价必需大于最低保留价格C。当所有的交易者提交自己的拟购买价格和拟购买数量后，系统根据买家的拟购买价格由大到小进行排序后，拟购买总数的中位数对应的价格即为成交价格，而拟购买价格在成交价格之上（包含成交价格）的市场交易者获得购买资格，可购买数量由系统抽签决定，您可购买到的股票数量与您的拟购买数量正相关。如若市场上拟购买总数小于企业发行的股票数量，则成交价格为最低保留价格C.
    
    以下是一个简单的例子：
    交易者A根据自己的估值给出的拟购买价格和拟购买数量分布为98元和5000股，交易者B给出的拟购买价格和购买数量为96元和6000股，交易者C给出的拟购买价格和购买数量为104元和3000股，交易者D给出的拟购买价格和购买数量为107元和4000股，您根据自己的估值105元给出的拟购买数量和拟购买价格是101元和6000股。
    系统按照购买价格的由高到低进行排序：
    D：107元——4000股
    C:  104元——3000股
    您：101元——6000股
    A：98元——5000股
    B：96元——6000股
    
    决定成交价格：则整个市场的拟购买总股数为24000，价格的中位数为按拟购买价格由高到低进行排序后第12000股所对应的价格，即为您的拟购买价格101，也即为该股票的成交价格。
    
    决定购买数量：您、D和C都有共同购买这1万股股票的权利。您们三个合起来的拟购买数量为13000，则系统随机从13000股股票中选择10000股分配购买权。，则每股股票被抽到的概率为 。简言之，当您的拟购买价格在成交价格之上时，您的预期购买数量越大，您可能购买到的数量越多。
    
    您的收益：（您对股票的估值-股票的成交价格）*您的购买数量
    `
  },
  [GameType.IPO_FPSBA]: {
    phase: Phase.IPO,
    title: '第一价格密封拍卖',
    dock: Dock.first,
    desc: `
    您在一个基金机构工作，您所在的基金机构经过对市场信息的精密分析，现对一个即将上市的股票有一个估值A元。您的公司给您提供了竞价资金B，要您在市场上参与该股票的询价过程。企业共发行了1万股股票，您与市场上其他交易者对该股票的估值可能相同，也可能不同，您需要与其他买家共同竞争购买股票。

    股票的成交价格规则如下：每个股票都有一个最低的保留价格C元，即市场上股票的价格低于最低保留价格时，企业选择不发售股票，因此你的出价必需大于最低保留价格C。当所有的交易者提交自己的拟购买价格和拟购买数量，系统根据买家的拟购买价格由大到小进行排序后，拟购买价格在第10000股购买价之上的市场交易者获得购买资格，获得购买资格的交易者的成交价格即为其拟购买价，可购买数量按照价格排序后的拟购买数量依次进行分配。如若市场上拟购买总数小于企业发行的股票数量，则成交价格为最低保留价格C.
    
    以下是一个简单的例子：
    交易者A根据自己的估值给出的拟购买价格和拟购买数量分布为98元和5000股，交易者B给出的拟购买价格和购买数量为96元和6000股，交易者C给出的拟购买价格和购买数量为104元和3000股，交易者D给出的拟购买价格和购买数量为107元和4000股，你根据自己的估值105元给出的拟购买数量和拟购买价格是101元和6000股。
    系统按照购买价格的由高到低进行排序：
    D：107元——4000股
    C:  104元——3000股
    您：101元——6000股
    A：98元——5000股
    B：96元——6000股
    
    决定成交价格：则整个市场的拟购买总股数为24000，第10000股价格为101元，则按照拟购买价格顺序排列购买在前10000股的交易者获得购买资格，即相应的成交价即为其拟购买价格，可购买数量按照价格排序后的拟购买数量依次进行分配。
    
    决定购买数量：你、D和C都有购买这1万股股票的权利。按照价格排序后，D可购买的数量为4000股，D的购买价格为107元；C可购买的数量为3000股，C的购买价格为104元。虽然你的拟购买数量为6000股，但是此时你只能购买3000股，你的购买价格为101元。
    
    您的收益：（您对股票的估值-股票的成交价格）*您的购买数量
    `
  },
  [GameType.OpenAuction]: {
    phase: Phase.OpenAuction,
    title: '公开竞价拍卖',
    dock: Dock.first,
    desc: `
    您要在市场上竞购某资产，您所在的基金机构对该资产有估值A元，该资产的起拍价格为B元，你需要和市场上其他交易者相继出价竞购，拍卖价格最高的买家可购入该资产。
    您可以不断提交您的拍卖价格，但是您的拍卖价格必须大于市场上现已有的最高购买价格。至某一价格，30秒内无人加价时，则此时市场上已有的最高拍卖价即为成交价，出此价格的买家即可购入该资产
`
  },
  [GameType.TBM]: {
    phase: Phase.TBM,
    title: '集合竞价',
    dock: Dock.third,
    video: 'https://qiniu0.anlint.com/video/whuipo/jihejinjia.mp4',
    desc: `
    您在一个基金机构工作，您所在的基金机构经过对市场信息的精密分析，现对市场上的股票有一个估值，要您在市场上进行股票交易活动。在这个市场中，您会被系统随机分配为买家或卖家。买家有初始的购买资金M，卖家有初始的股票数量S。买家和卖家对股票的估值不同，并根据自己的估值一次性进行买卖申请。系统将在有效价格范围内选取成交量最大的价位，对接受到的买卖申报一次性集中撮合，产生股票的成交价格。报价大于等于市场成交价格的买家成交；价小于等于市场成交成交价格的卖家成交。买家收益=（成交价-估值）*成交数量；卖家收益=（估值-成交价）*成交数量
    `
  },
  [GameType.CBM]: {
    phase: Phase.CBM,
    title: '连续竞价',
    dock: Dock.fourth,
    video: 'https://qiniu0.anlint.com/video/whuipo/lianxujinjia.mp4',
    desc: `
    您在一个基金机构工作，您所在的基金机构经过对市场信息的精密分析，现对市场上的股票有一个估值，要您在市场上进行股票交易活动。您需要根据您所在公司对股票的估值以及您对市场状况的判断来决定您的股票交易策略。在您提交买入申报价格/卖出申报价格和申购数量/出售数量之后，由电脑系统按照以下两种情况产生成交价：1）最高买进申报价格与最低卖出申报相同，则该价格为成交价格；2）买入申报高于卖出申报时，申报在先的价格即为成交价格。系统处理原则为价格优先和时间优先两个原则。
	举一个简单的例子：挂在市场上的最高买价是9.96，最低卖价是9.98，在这个时候（分毫不差）同时出现了买入申报价为10元的买家，和卖出申报价为9.9元的卖家，则买入申报价为10元的买家会以9.98的价格成交，卖出申报价为9.9的卖家以9.96成交。
	您会进入一个有6期交易期的市场，在第1、3、5期结束，您资产中的股票价值以当期股票收盘价计算。在第2、4、6期结束，股票发行公司会发布他们的公司财务报表，相应的股票价值会受到公司财务报表的影响，此时您资产组合中的股票价值以公司发布的财务报表价格计算。
    `,
    PlayMode: class extends BasePlayMode<NCreateParams.CBM> {
      renderParams() {
        return <section>
          TODO
        </section>
      }
    }
  },
  [GameType.CBM_Leverage]: {
    phase: Phase.CBM,
    title: '融资融券',
    dock: Dock.fifth,
    video: 'https://qiniu0.anlint.com/video/whuipo/rongzirongquan.mp4',
    desc: `
    您在一个基金机构工作，您所在的基金机构经过对市场信息的精密分析，现对市场上的股票有一个估值，要您在市场上进行股票交易活动。您需要根据您所在公司对股票的估值以及您对市场状况的判断来决定您的股票交易策略。在您提交买入申报价格/卖出申报价格和申购数量/出售数量之后，由电脑系统按照以下两种情况产生成交价：1）最高买进申报价格与最低卖出申报相同，则该价格为成交价格；2）买入申报高于卖出申报时，申报在先的价格即为成交价格。系统处理原则为价格优先和时间优先两个原则。
	举一个简单的例子：挂在市场上的最高买价是9.96，最低卖价是9.98，在这个时候（分毫不差）同时出现了买入申报价为10元的买家，和卖出申报价为9.9元的卖家，则买入申报价为10元的买家会以9.98的价格成交，卖出申报价为9.9的卖家以9.96成交。
	您会进入一个有6期交易期的市场，在第1、3、5期结束，您资产中的股票价值以当期股票收盘价计算。在第2、4、6期结束，股票发行公司会发布他们的公司财务报表，相应的股票价值会受到公司财务报表的影响，此时您资产组合中的股票价值以公司发布的财务报表价格计算。
您可以在市场上融资融券，您可融入与您资金数量相同的资金，也可融入您股票数量相同的股票。当股价变动，使您的资产低于融资或融券价值的150%时，您将会收到券商的警告；小于130%时将被强制清仓，强制清仓后剩余的资金可以继续交易。您可以在任一时间点还款还券。`
  }
}

function getGameTypes(dock: Dock): GameType[] {
  return Object.keys(GameTypeConfig).filter(key => GameTypeConfig[key].dock === dock) as any
}

const CONST = {
  zLargeDistance: 500,
  cardWidth: 120,
  cardHeight: 120 * (347 / 620)
}

interface IPoint {
  x: number,
  y: number,
  z: number
}

const DockConfig: {
  [key: number]: {
    icon: string,
    title: string,
    maskSize: {
      width: number,
      height: number
    },
    maskPosition: IPoint,
    maskRotateY: number,
    introPosition: IPoint,
    introRotateY: number,
    introContent: string,
    lockIconPosition: IPoint
  }
} = {
  [Dock.first]: {
    icon: require('../asset/dock/auction.png'),
    title: '资产拍卖',
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
    }
  },
  [Dock.second]: {
    icon: require('../asset/dock/ipo.png'),
    title: 'IPO',
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
    }
  },
  [Dock.third]: {
    icon: require('../asset/dock/tbm.png'),
    title: '集合竞价',
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
    }
  },
  [Dock.fourth]: {
    icon: require('../asset/dock/cbm.png'),
    title: '连续竞价',
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
    }
  },
  [Dock.fifth]: {
    icon: require('../asset/dock/cbm_l.png'),
    title: '融资融券',
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
    }
  },
}

enum ModalType {
  selectSubGameType,
  gameTypeDesc,
  continueGame,
  selectMode,
  preMatch,
  matching,
  matchSuccess
}

interface State {
  detailActive: boolean,
  focusDock: Dock,
  showModal: boolean
  modalType?: ModalType,
  isInitView: boolean,
  gameType?: GameType,
  matchTimer?: number,
  score: number
}

export class Hall3D extends React.Component<{}, State> {
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
    score: 0,
    isInitView: true,
    focusDock: null,
    showModal: false,
    detailActive: false,
    gameType: null,
  }

  reqInitInfo() {
    reqInitInfo().then(res => {
      if (res.code === ResCode.success) {
        this.connectSocket()
        const user: UserDoc = res.user
        this.setState({score: (user.phaseScore || []).reduce((m, n) => m + n, 0)})
        this.initView()

        const urlObj = new URL(window.location.href)
        const queryObj = qs.parse(urlObj.search.replace('?', '')) || {}
        if (queryObj.gamePhase) {
          const dock = GameTypeConfig[queryObj.gamePhase].dock
          this.handleSelectGame(dock)
          setTimeout(_ => {
            this.setState({
              showModal: true,
              modalType: ModalType.selectMode,
              gameType: queryObj.gamePhase,
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
        detailActive: true
      })
    }, 2000)
  }

  startMatch(multiPlayer: boolean, phase: Phase, params = {}) {
    this.io.emit(SocketEvent.reqStartGame, {multiPlayer, phase, params} as NSocketParam.StartGame)
    this.setState({
      modalType: ModalType.preMatch
    })
  }

  renderModalContent() {
    const {modalType, focusDock, gameType} = this.state
    const focusedGameConfig = GameTypeConfig[gameType]
    switch (modalType) {
      case ModalType.selectSubGameType:
        return <div className={style.selectSubGame}>
          {
            getGameTypes(focusDock).map((gameType: GameType) => {
              const onClick = _ => {
                this.setState({gameType: gameType, modalType: ModalType.selectMode})
              }
              return <Button key={gameType} onClick={onClick} label={GameTypeConfig[gameType].title}/>
            })
          }
        </div>
      case ModalType.gameTypeDesc:
        return <div className={style.gameDesc}>
          <div className={style.title}>
            <div className={style.label}>
              <div>{focusedGameConfig.title}</div>
            </div>
            <div className={style.splitLine}/>
          </div>
          <div className={style.detail}>
            {GameTypeConfig[gameType].desc}
          </div>
        </div>
      case ModalType.continueGame:
        return <div className={style.continueGame}>
          <div className={style.label}>您尚有实验正在进行中，继续该实验吗？</div>
          <Button onClick={_ => redirect(this.continuePlayUrl)} label="继续"/>
        </div>
      case ModalType.selectMode:
        const {PlayMode = BasePlayMode} = focusedGameConfig
        return <div className={style.selectGameMode}>
          <div className={style.baseBox}>
            <div className={style.label}>
              <div>{focusedGameConfig.title}</div>
              <div className={style.customShowGameDescBtn}
                   onClick={_ => this.setState({modalType: ModalType.gameTypeDesc})}>详细规则
              </div>
            </div>
            <div className={style.splitLine}/>
            {
              focusedGameConfig.video ? <video src={focusedGameConfig.video} controls autoPlay
                                               ref={node => this.gamePhaseVideoRefs[gameType] = node}/> : null
            }
          </div>
          <PlayMode onSubmit={(multiMode, params) => this.startMatch(multiMode, focusedGameConfig.phase, params)}/>
        </div>
      case ModalType.preMatch:
        return <div>
          <Loading label="处理中"/>
        </div>
      case ModalType.matchSuccess:
        return <div className={style.matchSuccess}>
          玩家匹配成功！
        </div>
    }
  }

  renderModal() {
    const {showModal, modalType, gameType, matchTimer} = this.state
    const handleClose = async () => {
      if (this.matchTimer) {
        clearInterval(this.matchTimer)
      }
      const videoNodeRef = this.gamePhaseVideoRefs[gameType]
      if (videoNodeRef) {
        videoNodeRef.pause()
      }
      if (modalType === ModalType.gameTypeDesc) {
        this.setState({
          modalType: ModalType.selectMode
        })
        return
      }
      this.setState({
        showModal: false
      })
      if ([ModalType.matching, ModalType.preMatch].includes(modalType)) {
        this.io.emit(SocketEvent.leaveMatchRoom, {
          gamePhase: gameType
        })
      }

    }

    if (modalType === ModalType.matching) {
      return <MatchModal visible={true} totalNum={4} matchNum={matchTimer % 5} timer={matchTimer}/>
    }
    return <Modal visible={showModal}>
      <div className={style.modalContent}>
        {
          this.renderModalContent()
        }
        <div className={style.bottom}>
          <Button onClick={handleClose} label="返回"/>
        </div>
      </div>
    </Modal>
  }

  handlePointerOver(dock: Dock) {
    return
    if (!this.state.detailActive) {
      return
    }
    if (this.hoverShowTimer[dock]) {
      return
    }
    if (this.gameIntroInstance[dock]) {
      return
    }
    this.hoverShowTimer[dock] = window.setTimeout(() => {
      this.gameIntroInstance[dock] = this.renderGameIntroCard(dock)
      this.hoverShowTimer[dock] = null
    }, 600)
  }

  handlePointerOut(dock: Dock) {
    if (!this.state.detailActive) {
      return
    }
    const timerId = this.hoverShowTimer[dock]
    if (timerId) {
      clearTimeout(timerId)
      this.hoverShowTimer[dock] = null
      return
    }
    const instance = this.gameIntroInstance[dock]
    if (instance) {
      this.scene.removeMesh(instance)
      this.gameIntroInstance[dock] = null
    }
  }

  handleSelectGame(dock: Dock) {
    const funMap = {
      [Dock.first]: () => this.handleShowLeftDetail(),
      [Dock.second]: () => this.handleShowLeftDetail(),
      [Dock.third]: () => this.handleShowCenterDetail(),
      [Dock.fourth]: () => this.handleShowRightDetail(),
      [Dock.fifth]: () => this.handleShowRightDetail()
    }
    funMap[dock]()
    setTimeout(() => {
      this.handleShowGameModal(dock)
    }, 2e3)
  }

  renderGameIntroCard(dock: Dock) {
    const {introPosition, introContent, introRotateY} = DockConfig[dock]
    const {scene} = this

    const ground = BABYLON.MeshBuilder.CreateGround(`introGround${dock}`, {
      width: CONST.cardWidth,
      height: CONST.cardHeight
    }, scene)

    const textureGround = new BABYLON.DynamicTexture(`dynamicTexture${dock}`, {
      width: CONST.cardWidth,
      height: CONST.cardHeight
    }, scene, false)
    textureGround.hasAlpha = true

    const materialGround = new BABYLON.StandardMaterial(`introMaterial${dock}`, scene)
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

      const realFontSize = CONST.cardWidth / (ratio * 1.4)
      textureContext.drawImage(this as any, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, CONST.cardWidth, CONST.cardHeight)
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

  renderHoverMaskInstance(dock: Dock) {
    return
    const {maskPosition, maskSize, maskRotateY = 0} = DockConfig[dock]
    const myGround = BABYLON.MeshBuilder.CreateGround(`hoverMask${dock}`, {
      width: maskSize.width,
      height: maskSize.height,
      subdivisions: 4
    }, this.scene)
    const myMaterial = new BABYLON.StandardMaterial(`hoverMaskMaterial${dock}`, this.scene)
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
        this.handlePointerOver.bind(this, dock)
    ))
    myGround.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnPointerOutTrigger,
        },
        this.handlePointerOut.bind(this, dock)
    ))
    myGround.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnPickDownTrigger,
        },
        this.handleShowGameModal.bind(this, dock)
    ))
    return myGround
  }

  renderLockIcon(dock: Dock) {
    new BABYLON.DirectionalLight('direct', new BABYLON.Vector3(0, 1, 1), this.scene)

    const {lockIconPosition, maskRotateY} = DockConfig[dock]
    const ground = BABYLON.Mesh.CreateGround(`lockGround${dock}`, 30, 30 * (186 / 144), 1, this.scene)
    const myMaterial = new BABYLON.StandardMaterial(`lockMat${dock}`, this.scene)
    const texture = new BABYLON.Texture(UnLockIcon, this.scene)
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
        this.handlePointerOver.bind(this, dock)
    ))
    myGround.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnPointerOutTrigger,
        },
        this.handlePointerOut.bind(this, dock)
    ))
    myGround.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnPickDownTrigger,
        },
        this.handleShowGameModal.bind(this, dock)
    ))
  }

  handleShowLeftDetail() {
    const frameRate = 20
    const movein = new BABYLON.Animation('movein', 'position', frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)

    const movein_keys = []

    movein_keys.push({
      frame: 0,
      value: new BABYLON.Vector3(0, 0, -CONST.zLargeDistance)
    })

    movein_keys.push({
      frame: 1 * frameRate,
      value: new BABYLON.Vector3(CONST.zLargeDistance / 2, 0, -CONST.zLargeDistance / 2)
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
      value: new BABYLON.Vector3(0, 0, -CONST.zLargeDistance)
    })

    movein_keys.push({
      frame: 1 * frameRate,
      value: new BABYLON.Vector3(0, -CONST.zLargeDistance / 10, -CONST.zLargeDistance / 2)
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
      value: new BABYLON.Vector3(0, 0, -CONST.zLargeDistance)
    })

    movein_keys.push({
      frame: 1 * frameRate,
      value: new BABYLON.Vector3(-CONST.zLargeDistance / 2, 0, -CONST.zLargeDistance / 2)
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
    const pos = new BABYLON.Vector3(0, 0, -CONST.zLargeDistance)
    this.camera.setPosition(pos)
    this.setState({
      detailActive: false
    })
  }

  handleShowGameModal(dock: Dock) {
    const gameType = getGameTypes(dock),
        moreThanOne = gameType.length > 1
    this.setState({
      showModal: true,
      modalType: moreThanOne ? ModalType.selectSubGameType : ModalType.selectMode,
      focusDock: dock,
      gameType: moreThanOne ? null : (gameType[0])
    })
  }

  initView() {
    const pos = new BABYLON.Vector3(0, 0, -CONST.zLargeDistance)
    this.camera.setPosition(pos)

    Object.keys(DockConfig).forEach((dock) => {
      let maskInstance = this.hoverMaskInstance[dock]
      if (!maskInstance) {
        maskInstance = this.renderHoverMaskInstance(Number(dock))
        this.hoverMaskInstance[dock] = maskInstance
      }
      this.renderLockIcon(Number(dock))
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
    io.on(SocketEvent.startMatch, () => {
      this.setState({
        modalType: ModalType.matching,
        matchTimer: 0
      })
      this.matchTimer = window.setInterval(() => {
        this.setState({
          matchTimer: this.state.matchTimer + 1
        })
      }, 1000)
    })
    io.on(SocketEvent.startGame, ({playerUrl}) => {
      if (this.matchTimer) {
        clearInterval(this.matchTimer)
      }
      this.setState({
        modalType: ModalType.matchSuccess
      })
      setTimeout(() => {
        redirect(playerUrl)
      }, 1000)
    })
    io.on(SocketEvent.continueGame, ({playerUrl}) => {
      this.setState({
        modalType: ModalType.continueGame,
      })
      this.continuePlayUrl = playerUrl
    })
    io.on(SocketEvent.handleError, (data: { eventType: SocketEvent, msg: string }) => {
      const {eventType, msg} = data
      if (eventType === SocketEvent.reqStartGame) {
        // Todo
        Toast.error(msg)
      }
      if (eventType === SocketEvent.leaveMatchRoom) {
        // TODO
        Toast.error(msg)
      }
    })
  }

  render() {
    const {detailActive, isInitView, score} = this.state
    return <div>
      <section className={style.titleBar}>
        <div className={style.logo}/>
        <div className={style.title}>
          <label>金融市场与算法交易</label><br/>
          <span className={style.subTitle}>虚拟仿真实验教学软件</span>
        </div>
        <span className={style.score}>得分: {score}</span>
      </section>
      {
        isInitView && <div className={style.loading}>
          <Loading label="加载中"/>
        </div>
      }
      {
        detailActive && <div className={style.actionBtns}>
          <Button onClick={this.handleCancelOverview.bind(this)} label="返回"/>
        </div>
      }
      {this.renderModal()}
      <BabylonScene
          style={{width: '100vw', height: '100vh'}}
          onSceneMount={this.handleSceneMount.bind(this)}
      />
      <section className={style.dock}>
        {
          getEnumKeys(Dock).map(key => Dock[key]).map((dock: Dock) => <div onClick={() => this.handleSelectGame(dock)}>
            <label>{DockConfig[dock].title}</label>
            <img src={DockConfig[dock].icon}/>
          </div>)
        }
      </section>
    </div>
  }
}

