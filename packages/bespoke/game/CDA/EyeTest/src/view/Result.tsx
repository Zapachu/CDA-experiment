import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState} from '../interface'
import {FetchType, SheetType, EYES} from '../config'
import GameResult from './components/GameResult'

export class Result extends Core.Result<ICreateParams, IGameState, IPlayerState, IMoveParams, FetchType> {
    lang = Lang.extractLang({
        result: ['游戏结果', 'Game Result'],
        seatNumber: ['座位号', 'Seat Number'],
        point: ['成绩', 'Point'],
        emotionNum: ['情绪', 'Emotion'],
        genderNum: ['性别', 'Gender'],
        export: ['导出', 'Export'],
        unknown: ['???', '???'],
        [SheetType[SheetType.result]]: ['结果', 'Result'],
        [SheetType[SheetType.log]]: ['日志', 'Log']
    })

    render(): React.ReactNode {
      const {props: {playerState:{result}}} = this
      return <section className={style.result}>
         <GameResult result={result} total={EYES.length}/>
      </section>
    }
}
