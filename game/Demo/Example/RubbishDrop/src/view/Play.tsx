import * as React from 'react'
import * as style from './style.scss'
import { Lang, MaskLoading } from '@elf/component'
import { Core } from '@bespoke/client'
import { Progress } from 'antd'
import {
  Const,
  GameStatus,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  Piece,
  PushType
} from '../config'

const harmfulWasteT = require('./static/yhljg_p@3x.png')
const harmfulWasteB = require('./static/yhlj_p@3x.png')
const kitchenWasteT = require('./static/cyljg_p@3x.png')
const kitchenWasteB = require('./static/cylj_p@3x.png')
const recyclableWasteT = require('./static/khsljg_p@3x.png')
const recyclableWasteB = require('./static/khslj_p@3x.png')
const otherWasteT = require('./static/qtljg_p@3x.png')
const otherWasteB = require('./static/qtlj_p@3x.png')

// const {matrixSize} = Const,
//     PieceNode: React.ReactNode = {
//         [Piece.null]: null,
//         [Piece.o]: <span style={{color: '#2e8b57'}}>⭕</span>,
//         [Piece.x]: <span style={{color: '#e27b6a'}}>❌</span>,
//     };

// export function Play({gameState, playerState, frameEmitter}: Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
//     console.log(gameState,'gameState')
//     console.log(playerState,'playerState')
//     const lang = Lang.extractLang({
//         matching: ['正为您匹配玩家...', 'Matching opponents for you ...'],
//         gameOver: ['游戏结束', 'GameOver'],
//         youGot: ['你执', 'You got'],
//         turnOf1: ['轮到', 'Turn of'],
//         turnOf2: ['了', ''],
//     });
//     React.useEffect(() => {
//         console.log(frameEmitter,'frameEmitter')
//         frameEmitter.emit(MoveType.getGroup);
//         console.log(MoveType.getGroup,'getGroup')
//     }, []);
//     const gameGroupState = gameState.groups[playerState.groupIndex];
//     if (!gameGroupState || gameGroupState.status === GameStatus.matching) {
//         return <MaskLoading label={lang.matching}/>;
//     }
//     const gameOver = gameGroupState.status === GameStatus.result,
//         yourTurn = gameGroupState.pieceTurn === playerState.piece,
//         pieceNodes = gameGroupState.pieces.map((piece, index) => <td {...{
//             key: index,
//             onClick: () => gameOver || !yourTurn ? null : frameEmitter.emit(MoveType.move, {index})
//         }}>{PieceNode[piece]}</td>),
//         pieceMatrix = Array(matrixSize).fill(null).map((_, i) => pieceNodes.slice(i * matrixSize, (i + 1) * matrixSize));
//     return <section className={style.play}>
//         <div className={style.tips}>
//             <label>{lang.youGot}<em>{PieceNode[playerState.piece]}</em>&nbsp;,&nbsp;
//                 {
//                     gameOver ? <>{lang.gameOver}</> : <>{lang.turnOf1}<em>{PieceNode[gameGroupState.pieceTurn]}</em>{lang.turnOf2}</>
//                 }
//             </label>
//         </div>
//         <table
//             className={`${style.pieceMatrix} ${gameOver || yourTurn ? '' : style.disable}`}>
//             <tbody>
//             {
//                 pieceMatrix.map((pieces, i) => <tr key={i}>
//                     {
//                         pieces.map(piece => piece)
//                     }
//                 </tr>)
//             }
//             </tbody>
//         </table>
//     </section>;
// }

interface TrashState {
  trashOpen: Array<boolean>
}

export class Play extends Core.Play<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  state: TrashState = {
    trashOpen: [false, false, true, false]
  }
  lang = Lang.extractLang({
    dropRubbish: ['随地乱扔', 'drop anywhere'],
    harmfulWaste: ['有害垃圾', 'harmfulWaste'],
    kitchenWaste: ['厨余垃圾', 'kitchenWaste'],
    recyclableWaste: ['可回收垃圾', 'recyclableWaste'],
    otherWaste: ['其他垃圾', 'otherWaste']
  })
  trashList = [
    { title: this.lang.harmfulWaste, imgT: harmfulWasteT, imgB: harmfulWasteB },
    { title: this.lang.kitchenWaste, imgT: kitchenWasteT, imgB: kitchenWasteB },
    {
      title: this.lang.recyclableWaste,
      imgT: recyclableWasteT,
      imgB: recyclableWasteB
    },
    { title: this.lang.otherWaste, imgT: otherWasteT, imgB: otherWasteB }
  ]
  componentDidMount() {
    console.log(this.props)
  }
  trashClick(index: number): void {
    const trashOpenCopy = this.state.trashOpen
    trashOpenCopy[index] = !trashOpenCopy[index]
    this.setState(
      {
        trashOpen: trashOpenCopy
      },
      () => {
        setTimeout(() => {
          this.setState({ trashOpen: trashOpenCopy })
        }, 1000)
      }
    )
  }
  render() {
    const { lang, trashList } = this
    const trashOpen = this.state.trashOpen
    return (
      <div className={style.outWrap}>
        <p className={style.count}>1/10</p>
        <ul className={style.trashWrap}>
          {trashList.map((val, index) => {
            return (
              <li
                onClick={() => {
                  this.trashClick(index)
                }}
              >
                <p>{val.title}</p>
                <img className={style.imgT + ' ' + (trashOpen[index] ? style.open : null)} src={val.imgT} alt="" />
                <img className={style.imgB} src={val.imgB} alt="" />
              </li>
            )
          })}
        </ul>
        <div className={style.progressWrap}>
          <Progress className={style.progress} percent={50} showInfo={false} strokeWidth={14} strokeColor="#18DF42" />
        </div>
        <div className={style.peopleWrap}>
          <div className={style.people}></div>
        </div>
        <div className={style.dashboardWrap}>
          <Progress
            type="dashboard"
            className={style.dashboard}
            percent={30}
            showInfo={true}
            strokeWidth={7}
            strokeColor="#18DF42"
            gapDegree={150}
            gapPosition="bottom"
          />
          <span>环境得分</span>
        </div>
        <div className={style.rubbishWrap}></div>
        <ul className={style.barrageWrap}>
          <li>
            xxx
            <br />
            将xx丢进垃圾桶
          </li>
          <li>
            xxx
            <br />
            将xx丢进垃圾桶
          </li>
        </ul>
      </div>
    )
  }
}
