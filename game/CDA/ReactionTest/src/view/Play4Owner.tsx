import * as React from 'react'
import * as style from './style.scss'
import { Button, Lang } from '@elf/component'
import { Core } from '@bespoke/client'
import { GameStage, MoveType, PushType } from '../config'
import { ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams } from '../interface'

export class Play4Owner extends Core.Play4Owner<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  lang = Lang.extractLang({
    unknown: ['???', '???'],
    startAnswerStage: ['开始答题', 'Start Answer Stage'],
    seatNumber: ['座位号', 'Seat Number'],
    correctNumber: ['正确题数', 'Correct Number'],
    countDown: ['倒计时', 'Countdown']
  })

  render(): React.ReactNode {
    const {
      lang,
      props: { frameEmitter, game, gameState, playerStates }
    } = this
    const playerStatesArr = Object.values(playerStates)
    return (
      <section className={style.play4Owner}>
        <label className={style.countDown}>
          {lang.countDown}
          <em>{game.params.timeLimit - gameState.time + 1}</em>
        </label>
        <table className={style.playerStates}>
          <tbody>
            <tr>
              <td>
                {lang.seatNumber}(
                {playerStatesArr
                  .map<number>(({ seatNumber }) => (seatNumber ? 1 : 0))
                  .reduce((m, n) => m + n, 0)}
                /{playerStatesArr.length})
              </td>
              <td>{lang.correctNumber}</td>
            </tr>
            {playerStatesArr.map(({ seatNumber, correctNumber = 0 }, i) => (
              <tr key={i}>
                <td>{seatNumber || lang.unknown}</td>
                <td>{correctNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {gameState.gameStage === GameStage.seatNumber ? (
          <Button label={lang.startAnswerStage} onClick={() => frameEmitter.emit(MoveType.startMainTest)} />
        ) : null}
      </section>
    )
  }
}
