import * as React from 'react'
import * as style from './style.scss'
import { Lang, MaskLoading } from '@elf/component'
import { Core } from '@bespoke/client'
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

const { matrixSize } = Const,
  PieceNode: React.ReactNode = {
    [Piece.null]: null,
    [Piece.o]: <span style={{ color: '#2e8b57' }}>⭕</span>,
    [Piece.x]: <span style={{ color: '#e27b6a' }}>❌</span>
  }

export function Play({
  gameState,
  playerState,
  frameEmitter
}: Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
  const lang = Lang.extractLang({
    matching: ['正为您匹配玩家...', 'Matching opponents for you ...'],
    gameOver: ['游戏结束', 'GameOver'],
    youGot: ['你执', 'You got'],
    turnOf1: ['轮到', 'Turn of'],
    turnOf2: ['了', '']
  })
  React.useEffect(() => {
    frameEmitter.emit(MoveType.getGroup)
  }, [])
  const gameGroupState = gameState.groups[playerState.groupIndex]
  if (!gameGroupState || gameGroupState.status === GameStatus.matching) {
    return <MaskLoading label={lang.matching} />
  }
  const gameOver = gameGroupState.status === GameStatus.result,
    yourTurn = gameGroupState.pieceTurn === playerState.piece,
    pieceNodes = gameGroupState.pieces.map((piece, index) => (
      <td
        {...{
          key: index,
          onClick: () => (gameOver || !yourTurn ? null : frameEmitter.emit(MoveType.move, { index }))
        }}
      >
        {PieceNode[piece]}
      </td>
    )),
    pieceMatrix = Array(matrixSize)
      .fill(null)
      .map((_, i) => pieceNodes.slice(i * matrixSize, (i + 1) * matrixSize))
  return (
    <section className={style.play}>
      <div className={style.tips}>
        <label>
          {lang.youGot}
          <em>{PieceNode[playerState.piece]}</em>&nbsp;,&nbsp;
          {gameOver ? (
            <>{lang.gameOver}</>
          ) : (
            <>
              {lang.turnOf1}
              <em>{PieceNode[gameGroupState.pieceTurn]}</em>
              {lang.turnOf2}
            </>
          )}
        </label>
      </div>
      <table className={`${style.pieceMatrix} ${gameOver || yourTurn ? '' : style.disable}`}>
        <tbody>
          {pieceMatrix.map((pieces, i) => (
            <tr key={i}>{pieces.map(piece => piece)}</tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
