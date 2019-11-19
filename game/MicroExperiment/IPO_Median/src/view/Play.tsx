import * as React from 'react'
import * as style from './style.scss'
import { Core } from '@bespoke/client'
import { Lang, Toast } from '@elf/component'
import Joyride, { Step } from 'react-joyride'
import {
  CONFIG,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PlayerStatus,
  PushType
} from '../config'
import {
  Button,
  Input,
  ITestPageQuestion,
  Line,
  ListItem,
  Loading,
  Modal,
  StockInfo,
  STOCKS,
  TableInfo,
  TestPage
} from '@micro-experiment/component'
import { Input as AntInput, Radio } from 'antd'

enum ModalType {
  None,
  Ipo,
  Trade,
  Price
}

export interface IPOTypeConfig {
  ruleContent: React.ReactNode
  extendTitle?: string
  extendContent?: React.ReactNode
  testQuestions: Array<ITestPageQuestion>
}

export const getPlay = (IPOTypeConfig: IPOTypeConfig) => ({
  frameEmitter,
  game,
  gameState,
  playerState
}: Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) => {
  const [price, setPrice] = React.useState(''),
    [num, setNum] = React.useState(''),
    [modalType, setModalType] = React.useState(ModalType.None),
    [shoutTimer, setShoutTimer] = React.useState(0),
    gameRoundState = gameState.rounds[gameState.round],
    playerRoundState = playerState.rounds[gameState.round]
  React.useEffect(() => {
    frameEmitter.on(PushType.shoutTimer, ({ shoutTimer }) => {
      if (playerRoundState.status === PlayerStatus.prepared) {
        setShoutTimer(shoutTimer)
      }
    })
  })

  function inputNum(multiplier: number, startMoney: number) {
    if (isNaN(+price) || +price <= 0) {
      return
    }
    setNum((~~((multiplier * startMoney) / +price)).toString())
  }

  function exitGame(onceMore = false) {
    frameEmitter.emit(MoveType.nextGame, { onceMore }, lobbyUrl => (location.href = lobbyUrl))
  }

  function renderResult() {
    const dataList = [
      {
        label: '股票的成交价格',
        value: <span style={{ color: 'orange' }}>{gameRoundState.tradePrice}</span>
      },
      {
        label: '你们公司对股票的估值',
        value: <span style={{ color: 'orange' }}>{playerRoundState.privateValue}</span>
      },
      {
        label: '每股股票收益',
        value: (
          <span style={{ color: 'orange' }}>
            {(playerRoundState.privateValue - gameRoundState.tradePrice).toFixed(2)}
          </span>
        )
      },
      {
        label: '你的购买数量',
        value: <span style={{ color: 'orange' }}>{playerRoundState.actualNum || 0}</span>
      },
      {
        label: '你的总收益为',
        value: <span style={{ color: 'orange' }}>{playerRoundState.profit || 0}</span>
      },
      {
        label: '你的初始账户资金',
        value: <span style={{ color: 'orange' }}>{playerRoundState.startMoney}</span>
      },
      {
        label: '你的现有账户资金',
        value: (
          <span style={{ color: 'red' }}>
            {(playerRoundState.startMoney + (playerRoundState.profit || 0)).toFixed(2)}
          </span>
        )
      }
    ]
    return (
      <>
        <Line
          text={`交易结果 (第${gameState.round + 1}轮)`}
          style={{
            margin: 'auto',
            maxWidth: '400px',
            marginTop: '15vh',
            marginBottom: '20px'
          }}
        />
        <TableInfo dataList={dataList} style={{ margin: '30px auto' }} />
        {gameState.round < CONFIG.round - 1 ? (
          <Loading label={'即将进入下一轮'} />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              label={'再学一次'}
              color={Button.Color.Blue}
              style={{ marginRight: '20px' }}
              onClick={() => exitGame(true)}
            />
            <Button label={'返回交易大厅'} onClick={() => exitGame()} />
          </div>
        )}
        <div className={style.leftBtn}>
          <Button
            label={'IPO知识扩展'}
            size={Button.Size.Big}
            color={Button.Color.Blue}
            onClick={() => setModalType(ModalType.Ipo)}
          />
        </div>
        {IPOTypeConfig.extendTitle ? (
          <div className={style.rightBtn}>
            <Button
              label={IPOTypeConfig.extendTitle}
              size={Button.Size.Big}
              color={Button.Color.Blue}
              onClick={() => setModalType(ModalType.Price)}
            />
          </div>
        ) : null}
      </>
    )
  }

  function renderPlay(guide = false) {
    const stock = STOCKS[gameRoundState.stockIndex]
    return (
      <>
        {guide ? <Guide done={() => frameEmitter.emit(MoveType.guideDone)} /> : null}
        <Line text={`第${gameState.round + 1}轮`} style={{ marginTop: '2rem' }} />
        <table className={style.stockInfo}>
          <tbody>
            <tr>
              <td className={style.codeName}>
                <div>证券代码</div>
                <div>证券简称</div>
              </td>
              <td className={style.contractor}>主承销商</td>
              <td>初步询价起始日期</td>
              <td>初步询价截止日期</td>
            </tr>
            <tr>
              <td className={style.codeNameData}>
                <div>{stock.code}</div>
                <div>{stock.name}</div>
              </td>
              <td>{stock.contractor}</td>
              <td>{stock.startDate}</td>
              <td>{stock.endDate}</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginBottom: '10px' }}>
          *私人信息: 你们公司对该
          <span className={style.privateValue}>股票的估值</span>是
          <span style={{ color: 'orange' }}>{playerRoundState.privateValue}</span>
        </p>
        <p className={style.issuer}>
          *市场信息: 该公司共发行了
          <span style={{ color: 'orange' }}>{CONFIG.marketStockAmount}股</span>
          股票, 最低保留价格为
          <span style={{ color: 'orange' }}>{gameRoundState.minPrice}</span>
        </p>
        <div className={style.investor}>
          <div className={style.inputWrapper}>
            <div className={style.inputContainer}>
              <div>
                <Input
                  value={price}
                  placeholder={'价格'}
                  onChange={val => setPrice(val.toString())}
                  onMinus={val => setPrice((val - 1).toString())}
                  onPlus={val => setPrice((val + 1).toString())}
                />
                <p
                  style={{
                    fontSize: '12px',
                    marginTop: '5px',
                    marginLeft: '45px'
                  }}
                >
                  可买
                  <span style={{ color: 'orange' }}>
                    {+price ? Math.floor(playerRoundState.startMoney / +price) : ' '}
                  </span>
                  股
                </p>
              </div>
            </div>
            <div className={style.inputContainer}>
              <div>
                <Input
                  value={num}
                  placeholder={'数量'}
                  onChange={val => setNum(val.toString())}
                  onMinus={val => setNum((val - 1).toString())}
                  onPlus={val => setNum((val + 1).toString())}
                />
                <p
                  style={{
                    fontSize: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '5px',
                    marginLeft: '45px'
                  }}
                >
                  <span>
                    总花费
                    <span style={{ color: 'orange' }}>{+price && +num ? (+price * +num).toFixed(2) : ' '}</span>
                  </span>
                  <span>
                    <span className={style.operation} onClick={() => inputNum(0.5, playerRoundState.startMoney)}>
                      半仓
                    </span>
                    <span className={style.operation} onClick={() => inputNum(1, playerRoundState.startMoney)}>
                      全仓
                    </span>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <Button
            label={'买入'}
            style={{
              marginBottom: shoutTimer !== null ? '5px' : '30px',
              marginTop: '20px'
            }}
            onClick={() => {
              if (!+price || !+num || num.includes('.')) return
              frameEmitter.emit(MoveType.shout, { price: +price, num: +num }, err => {
                if (err) {
                  Toast.warn(err)
                } else {
                  setPrice('')
                  setNum('')
                }
              })
            }}
          />
        </div>
        <p style={{ marginBottom: '20px', textAlign: 'center' }} className={style.shoutTimer}>
          {CONFIG.tradeTime - shoutTimer} S
        </p>
        <ListItem width={200} style={{ marginBottom: '10px' }}>
          <p style={{ color: 'orange' }} className={style.startPrice}>
            初始资金: {playerRoundState.startMoney}
          </p>
        </ListItem>
        <div className={style.leftBtn}>
          <Button
            label={'交易规则回顾'}
            size={Button.Size.Big}
            color={Button.Color.Blue}
            onClick={() => setModalType(ModalType.Trade)}
          />
        </div>
      </>
    )
  }

  function ModalContent({ modalType }: { modalType: ModalType }) {
    switch (modalType) {
      case ModalType.Ipo: {
        return (
          <div className={style.modalIpo}>
            <p className={style.title}>ipo知识扩展</p>
            <p>
              首次公开募股（Initial Public
              Offerings，简称IPO）是指有限责任公司或股份有限公司第一次将它的股份向公众出售。通常，上市公司的股份是根据相应证监会出具的招股书或登记声明中约定的条款通过经纪商或做市商进行销售。
            </p>
            <Button
              style={{ marginTop: '30px' }}
              label={'关闭'}
              color={Button.Color.Blue}
              onClick={() => setModalType(ModalType.None)}
            />
          </div>
        )
      }
      case ModalType.Price: {
        return (
          <div className={style.modalIpo}>
            <p className={style.title}>{IPOTypeConfig.extendTitle}</p>
            {IPOTypeConfig.extendContent}
            <Button
              style={{ marginTop: '30px' }}
              label={'关闭'}
              color={Button.Color.Blue}
              onClick={() => setModalType(ModalType.None)}
            />
          </div>
        )
      }
      case ModalType.Trade: {
        return (
          <div className={style.modalIpo}>
            <p className={style.title}>交易规则回顾</p>
            {IPOTypeConfig.ruleContent}
            <Button
              style={{ marginTop: '30px' }}
              label={'关闭'}
              color={Button.Color.Blue}
              onClick={() => setModalType(ModalType.None)}
            />
          </div>
        )
      }
      default:
        return null
    }
  }

  let content
  switch (playerRoundState.status) {
    case PlayerStatus.test: {
      content = <TestPage done={() => frameEmitter.emit(MoveType.getIndex)} questions={IPOTypeConfig.testQuestions} />
      break
    }
    case PlayerStatus.shouted: {
      content = (
        <>
          <StockInfo stockIndex={gameRoundState.stockIndex} style={{ marginTop: '15vh', marginBottom: '100px' }} />
          <div style={{ width: '200px', margin: 'auto', textAlign: 'center' }}>
            <Loading label={'等待其他玩家'} />
          </div>
        </>
      )
      break
    }
    case PlayerStatus.result: {
      content = renderResult()
      break
    }
    case PlayerStatus.guide: {
      content = renderPlay(true)
      break
    }
    case PlayerStatus.prepared: {
      content = renderPlay()
      break
    }
  }

  return (
    <section className={style.play}>
      <div className={style.playContent} key={gameState.round}>
        {content}
        <Modal visible={modalType !== ModalType.None}>
          <ModalContent modalType={modalType} />
        </Modal>
      </div>
    </section>
  )
}

export const Play = getPlay({
  ruleContent: (
    <>
      <p>
        您在一个基金机构工作，您所在的基金机构经过对市场信息的精密分析，现对一个即将上市的股票有一个估值A元。您的公司给您提供了竞价资金B，要您在市场上参与该股票的询价过程。企业共发行了1万股股票，您与市场上其他交易者对该股票的估值可能相同，也可能不同，您需要与其他买家共同竞争购买股票。
        <br />
        股票的成交价格规则如下：每个股票都有一个最低的保留价格C元，即市场上股票的价格低于最低保留价格时，企业选择不发售股票，因此您的出价必需大于最低保留价格C。当所有的交易者提交自己的拟购买价格和拟购买数量后，系统根据买家的拟购买价格由大到小进行排序后，拟购买总数的中位数对应的价格即为成交价格，而拟购买价格在成交价格之上（包含成交价格）的市场交易者获得购买资格，可购买数量由系统抽签决定，您可购买到的股票数量与您的拟购买数量正相关。如若市场上拟购买总数小于企业发行的股票数量，则成交价格为最低保留价格C.
      </p>
      <br />
      <p>
        以下是一个简单的例子：
        <br />
        交易者A根据自己的估值给出的拟购买价格和拟购买数量分布为98元和5000股，交易者B给出的拟购买价格和购买数量为96元和6000股，交易者C给出的拟购买价格和购买数量为104元和3000股，交易者D给出的拟购买价格和购买数量为107元和4000股，您根据自己的估值105元给出的拟购买数量和拟购买价格是101元和6000股。
        系统按照购买价格的由高到低进行排序：
        <br />
        D：107元——4000股
        <br />
        C: 104元——3000股
        <br />
        您：101元——6000股
        <br />
        A：98元——5000股
        <br />
        B：96元——6000股
      </p>
      <br />
      <p>
        决定成交价格：则整个市场的拟购买总股数为24000，价格的中位数为按拟购买价格由高到低进行排序后第12000股所对应的价格，即为您的拟购买价格101，也即为该股票的成交价格。
        决定购买数量：您、D和C都有共同购买这1万股股票的权利。您们三个合起来的拟购买数量为13000，则系统随机从13000股股票中选择10000股分配购买权。，则每股股票被抽到的概率为
        。简言之，当您的拟购买价格在成交价格之上时，您的预期购买数量越大，您可能购买到的数量越多。
        您的收益：（您对股票的估值-股票的成交价格）*您的购买数量
      </p>
    </>
  ),
  extendTitle: 'IPO价格知识扩展',
  extendContent: (
    <>
      <p>
        IPO(Initial Public
        Offering)价格又称新股发行价格，是指获准发行股票上市的公司与其承销商共同确定的将股票公开发售给特定或非特定投资者的价格。在这一价格的确定程序中，相关的影响因素包括公司帐面价值、经营业绩、发展前景、股票发行数量、行业特点及市场波动状况等，而这些因素的量化过程会随着定价者选用方法的不同而出现很大差别。
      </p>
      <p>较为常用的估值方式可以分为两大类：收益折现法与类比法。</p>
      <p>
        1、收益折现法：就是通过合理的方式估计出上市公司未来的经营状况，并选择恰当的贴现率与贴现模型，计算出上市公司价值。如最常用的股利折现模型(ddm)、现金流贴现(dcf)模型等。
      </p>
      <p>
        2、类比法，就是通过选择同类上市公司的一些比率，如最常用的市盈率、市净率(p/b即股价/每股净资产)，再结合新上市公司的财务指标如每股收益、每股净资产来确定上市公司价值，一般都采用预测的指标。市盈率法的适用具有许多局限性，例如要求上市公司经营业绩要稳定，不能出现亏损等，而市净率法则没有这些问题，但同样也有缺陷，主要是过分依赖公司账面价值而不是最新的市场价值。因此对于那些流动资产比例高的公司如银行、保险公司比较适用此方法。
      </p>
    </>
  ),
  testQuestions: [
    {
      Content: ({ inputProps }) => (
        <p>
          某企业发行股票的承销金额是1亿元，则最低承销费为
          <AntInput {...inputProps()} />
          元；最高承销费为
          <AntInput {...inputProps()} />
          元。
        </p>
      ),
      Answer: () => <text>解析：100000000*1.5%=1500000；100000000*3%=3000000</text>,
      answer: [1500000, 3000000]
    },
    {
      Content: ({ inputProps }) => (
        <div>
          <p>我国目前的股票发行监管制度的核心是</p>
          <Radio.Group {...inputProps({ margin: '.5rem' })}>
            <Radio value={1}>A. 保荐制</Radio>
            <Radio value={2}>B. 核准制</Radio>
            <Radio value={3}>C. 注册制</Radio>
            <Radio value={4}>D. 审核制</Radio>
          </Radio.Group>
        </div>
      ),
      Answer: () => (
        <text>
          正确答案：B
          <br />
          解析：我国现已形成了以核准制为核心的股票发行监管制度
        </text>
      ),
      answer: [2]
    },
    {
      Content: ({ inputProps }) => (
        <p>
          外国公司、外国金融机构、外国人等不得买卖
          <AntInput {...inputProps()} />
          股；境内中资机构和个人不得买卖
          <AntInput {...inputProps()} />
          股。
        </p>
      ),
      Answer: () => <text>正确答案：A；B</text>,
      answer: ['A', 'B']
    },
    {
      Content: ({ inputProps }) => (
        <div>
          <p>
            市场上有10000股股票。您的拟购买价格和拟购买数量是105元和4000股。市场上其他参与者的拟购买价格和拟购买数量如下：交易者A给出的拟购买价格和拟购买数量分布为99元和5000股，交易者B给出的拟购买价格和购买数量为100元和6000股，交易者C给出的拟购买价格和购买数量为102元和3000股，交易者D给出的拟购买价格和购买数量为96元和3000股。
            系统按照购买价格的由高到低进行排序：
            <br />
            您：105元——4000股
            <br />
            C: 102元——3000股
            <br />
            B：100元——6000股
            <br />
            A：99元——5000股
            <br />
            D：96元——3000股
          </p>
          <p>
            整个市场的拟购买总股数为21000，中位数第10500股价格为100元，则成交价格为
            <AntInput {...inputProps()} />
            元。
            <br />
            您、C和B都有共同购买这1万股股票的权利。三个合起来的拟购买数量为13000，则系统随机从13000股股票中选择10000股分配购买权。
          </p>
        </div>
      ),
      Answer: () => (
        <text>
          整个市场的拟购买总股数为21000，中位数第10500股价格为100元，则成交价格即为第10500股股票对应的价格：100元。
          您、C和B都有共同购买这1万股股票的权利。三个合起来的拟购买数量为13000，则系统随机从13000股股票中选择10000股分配购买权。则每股股票被抽到的概率为10000/13000。简言之，当拟购买价格在成交价格之上时，预期购买数量越大，可能购买到的数量越多。
        </text>
      ),
      answer: ['100']
    },
    {
      Content: ({ inputProps }) => (
        <div>
          <p>
            市场上有10000股股票。您的拟购买价格和拟购买数量是48元和6000股。市场上其他参与者的拟购买价格和拟购买数量如下：交易者A给出的拟购买价格和拟购买数量分布为35元和5000股，交易者B给出的拟购买价格和购买数量为50元和7000股，交易者C给出的拟购买价格和购买数量为44元和3000股，交易者D给出的拟购买价格和购买数量为39元和3000股
            系统按照购买价格的由高到低进行排序：
            <br />
            B：50元——7000股
            <br />
            您: 48元——6000股
            <br />
            C：44元——3000股
            <br />
            D：39元——3000股
            <br />
            A：35元——5000股
          </p>
          <p>
            整个市场的拟购买总股数为24000，中位数第12000股价格为48元，则成交价格为
            <AntInput {...inputProps()} />
            元。
            您、B都有共同购买这1万股股票的权利。三个合起来的拟购买数量为13000，则系统随机从13000股股票中选择10000股分配购买权。
          </p>
        </div>
      ),
      Answer: () => (
        <text>
          整个市场的拟购买总股数为22000，中位数第13000股价格为48元，则成交价格即为第13000股股票对应的价格：48元。
          您和B都有共同购买这1万股股票的权利。二人合起来的拟购买数量为13000，则系统随机从13000股股票中选择10000股分配购买权。，则每股股票被抽到的概率为10000/13000。简言之，当拟购买价格在成交价格之上时，预期购买数量越大，可能购买到的数量越多。
        </text>
      ),
      answer: ['48']
    }
  ]
})

function Guide({ done }: { done: () => void }) {
  const lang = Lang.extractLang({
    gotIt: ['我知道了', 'I got it']
  })

  function GuideContent({ children }: { children: React.ReactNode }) {
    return <section className={style.guideContent}>{children}</section>
  }

  const stepProps: (tooltipStyle?: React.CSSProperties) => Partial<Step> = (tooltipStyle: React.CSSProperties) => ({
      styles: {
        spotlight: {
          border: '2px dashed #71ff7b',
          borderRadius: '1.5rem'
        },
        tooltip: {
          fontSize: '1rem',
          width: '48rem',
          maxWidth: '95vw',
          ...tooltipStyle
        }
      },
      disableBeacon: true,
      hideCloseButton: true
    }),
    steps: Array<Step> = [
      {
        target: `.${style.codeName}`,
        content: (
          <GuideContent>
            <h4>关于股票名称</h4>
            <p>
              股票名称是从公司全称中精选2至4个字。股票代码是沪深两地证券交易所给上市股票分配的数字代码，主要通过前三位数字来反应该股所属板块。一个公司的股票代码跟车牌号差不多，能够显示出这个公司的实力以及知名度。
              股票代码的分类：
              <br />
              创业板的代码是<em>300</em>打头的股票代码；
              <br />
              沪市A股的代码是以<em>600</em>、<em>601</em>或<em>603</em>打头；
              <br />
              深市A股的代码时以<em>000</em>打头；
              <br />
              中小板的代码时<em>002</em>打头；
              <br />
              沪市B股的代码是以<em>900</em>打头；
              <br />
              深圳B股的代码是以<em>200</em>打头；
            </p>
            <h4>特别提醒</h4>
            <p>
              沪市新股申购的代码是以730打头，深市新股申购的代码与深市股票买卖代码一样；配股代码，沪市以700打头，深市以080打头；权证，沪市时580打头，深市时031打头。
              股票前面的字母含义：
              <br />
              <em>XR</em>：除权，购买该股后不再享有分红权利；
              <br />
              <em>XD</em>：除息，购买该股后不再有派息权利；
              <br />
              <em>DR</em>：除权除息，购买该股票后不再有送股派息的权利；
              <br />
              <em>NEW</em>：新股上市首日；
              <br />
              <em>ST</em>：亏损股，连续两个会计年度偶读亏损的公司；
              <br />
              <em>*ST</em>：退市风险，连续三年亏损，有退市风险；
              <br />
              <em>S*ST</em>：退市预警，连续三年亏损，退市预警。
            </p>
          </GuideContent>
        ),
        ...stepProps({
          width: '48rem'
        })
      },
      {
        target: `.${style.contractor}`,
        content: (
          <GuideContent>
            <h4>关于主承销商</h4>
            <p>
              证券承销商时经营证券承销业务的中介机构。概括起来，主要有向证券发行人提出有关发行证券的类型、发行时间、发行价格、发行方式、发行条件等方向的咨询，代办一切发行事宜，以包销、代销等方式将准备发行的证券销售出去并承担相应的风险。
              <br />
              由于各国情况不同，股票承销机构再各国不完全相同，在美国为投资银行，在日本为证券公司，在我国目前为证券公司和信托投资公司。
              <br />
              目前，我国企业发行股票的承销费是按照承销金额的一定比例来计算的。根据1996年12月中国证监会发布的《关于股票发行工作若干规定的通知》，承销费用的收费标准与承销金额和发行方式挂钩，具体标准如下：
              <br />
              1、承销金额2亿元以内，收费标准为1.5%至3%。
              <br />
              2、3亿元以内，收费1.5%至2.5%。
              <br />
              3、4亿元以内，收费1.5%至2%。
              <br />
              4、4亿元以上，除特殊情况外，收费不得超过900万元(采用上网发行方式)或不得超过1000万元(采用网下发行方式)。
            </p>
          </GuideContent>
        ),
        ...stepProps()
      },
      {
        target: `.${style.issuer}`,
        content: (
          <GuideContent>
            <h4>关于发行者</h4>
            <p>
              发行者即股票发行公司，是指在股票发行市场上公开发行股票的股份公司，简称发行公司。作为发行市场的主体，它是股票发行市场的第一参加者。发行者的多少、发行规模的大小、发行股票的种类和质量决定着股票发行市场的活跃程度。
              <br />
              发行者一般分为两类：一类是只办理公开发行股票手续，却未申请上市的发行公司；另一类为公开发行股票且办理了上市手续的公司，后者亦称为上市公司。
              <br />
              随着制度建设的一步步推进，我国现已形成了以核准制为核心的股票发行监管制度，初步建立了市场化的新股发行和承销管理制度，并在加快推进股票发行注册制的改革。
            </p>
          </GuideContent>
        ),
        ...stepProps()
      },
      {
        target: `.${style.investor}`,
        content: (
          <GuideContent>
            <h4>关于投资者</h4>
            <p>
              投资者即缴纳资金购买股票的应募者，这些投资者可分为私人投资者和机构投资者两大类。
              <br />
              (1)私人投资者包括国内和国外的以个人身份购买股票的参加者。
              <br />
              (2)机构投资者的种类较多，主要有以下几种：
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;1）以法人为代表的各种企业，主要是股份公司。
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;2）各类金融机构，主要是投资银行、保险公司等各种银行或非银行金融机构。
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;3）各种非营利团体。主要是各种基金会，尽管这些团体是非营利性的，但他们可以通过购买股票达到保值或增收的目的。
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;4）外国公司，外国金融机构以及国际性的机构和团体等。
              <br />
              中国规定，县、处级以上公务员不得买卖股票;
              外国公司、外国金融机构、外国人等不得买卖A股；境内中资机构和个人不得买卖B股。
            </p>
          </GuideContent>
        ),
        ...stepProps()
      },
      {
        target: `.${style.privateValue}`,
        content: (
          <GuideContent>
            <br />
            股票估值分为绝对估值、相对估值和联合估值。
            <br />
            绝对估值是通过对上市公司历史及当前的基本面的分析和对未来反映公司经营状况的财务数据的预测获得上市公司股票的内在价值。
            <h4>绝对估值的方法</h4>
            一是现金流贴现定价模型，二是B-S期权定价模型（主要应用于期权定价、权证定价等）。现金流贴现定价模型目前使用最多的是DDM和DCF，而DCF估值模型中，最广泛应用的就是FCFE股权自由现金流模型。
            <h4>相对估值的方法</h4>
            相对估值是使用市盈率、市净率、市售率、市现率等价格指标与其它多只股票（对比系）进行对比，如果低于对比系的相应的指标值的平均值，股票价格被低估，股价将很有希望上涨，使得指标回归对比系的平均值。
            <br />
            相对估值包括PE、PB、PEG、EV/EBITDA等估值法。通常的做法是对比，一个是和该公司历史数据进行对比，二是和国内同行业企业的数据进行对比，确定它的位置，三是和国际上的（特别是香港和美国）同行业重点企业数据进行对比。
            <br />
            市盈率PE=股价/每股收益=p/e，其核心在于e的确定，e的变动往往取决于宏观经济和企业的生存周期所决定的波动周期。
            <h4>联合估值的方法</h4>
            联合估值是结合绝对估值和相对估值，寻找同时股价和相对指标都被低估的股票，这种股票的价格最有希望上涨。
          </GuideContent>
        ),
        ...stepProps()
      },
      {
        target: `.${style.inputWrapper}`,
        content: (
          <GuideContent>
            您的买入价格需在您们公司对股票的估值和股票的最低保留价格之间。当您输入您的购买价格后，系统会自动根据您的初始资金计算并显示您可购买的股票数量。当您输入购买价格点击半仓后，购买的股票数量为您最多可购买数量的一半；当您点击全仓时，购买的股票数量为您最多可购买数量。
          </GuideContent>
        ),
        styles: {
          tooltip: {
            width: '50vw',
            height: '50vh'
          }
        },
        ...stepProps()
      },
      {
        target: `.${style.leftBtn}`,
        content: <GuideContent>您可以在这里回顾交易规则</GuideContent>,
        ...stepProps()
      },
      {
        target: `.${style.shoutTimer}`,
        content: <GuideContent>您需在规定的时间内完成交易，您可以在这里查看剩余的交易时间</GuideContent>,
        ...stepProps()
      },
      {
        target: `.${style.startPrice}`,
        content: <GuideContent>您在这个询价中所能使用的资金总数，您的购买决策受到资金数量的限制</GuideContent>,
        ...stepProps()
      }
    ]
  return (
    <Joyride
      callback={({ action }) => (action === 'reset' ? done() : null)}
      continuous
      showProgress
      hideBackButton
      disableOverlayClose
      steps={steps}
      locale={{
        next: lang.gotIt,
        last: lang.gotIt
      }}
      styles={{
        options: {
          arrowColor: 'rgba(30,39,82,.8)',
          backgroundColor: 'rgba(30,39,82,.8)',
          overlayColor: 'rgba(30,39,82,.5)',
          primaryColor: '#13553e',
          textColor: '#fff'
        }
      }}
    />
  )
}
