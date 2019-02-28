import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang} from 'bespoke-client-util'
import {ICreateParams, IMoveParams, IPlayerState} from '../interface'
import {FetchType, SheetType, QUESTIONS} from '../config'
import GameResult from './components/GameResult'

export class Result extends Core.Result<ICreateParams, IPlayerState, IMoveParams, FetchType> {
    lang = Lang.extractLang({
        result: ['游戏结果', 'Game Result'],
        seatNumber: ['座位号', 'Seat Number'],
        point: ['成绩', 'Point'],
        emotionNum: ['情绪', 'Emotion'],
        genderNum: ['性别', 'Gender'],
        export: ['导出', 'Export'],
        unknown: ['???', '???'],
        [SheetType[SheetType.result]]: ['结果', 'Result'],
    })

    render(): React.ReactNode {
      const {props: {playerState:{correctNumber, point}}} = this
      return <section className={style.result}>
         <GameResult correctNumber={correctNumber} point={point} total={QUESTIONS.length}/>
      </section>
    }
}
