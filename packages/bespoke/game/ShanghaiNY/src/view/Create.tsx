import * as React from 'react'
import * as style from './style.scss'
import {Core, Input, Label, Lang, RangeInput, Toast, MaskLoading, Button} from 'bespoke-client-util'
import {FetchType, GameType, Version} from '../config'
import {ICreateParams} from '../interface'

interface ICreateState {
    readonly: boolean
    privatePriceLimit: number
}

export class Create extends Core.Create<ICreateParams, FetchType, ICreateState> {
    lang = Lang.extractLang({
        round: ['轮次', 'Round'],
        playersPerGroup: ['每组人数', 'PlayersPerGroup'],
        gameType: ['类型', 'GameType'],
        version: ['版本', 'Version'],
        params: ['参数', 'Parameters']
    })

    state: ICreateState = {
        readonly: true,
        privatePriceLimit: 100
    }

    componentDidMount(): void {
        const {props: {setParams}} = this
        let defaultParams: ICreateParams = {
          playersPerGroup: 2,
          rounds: 2,
          gameType: GameType.T1,
          version: Version.V1,
          a: 0,
          b: 0,
          c: 0,
          d: 0,
          eH: 0,
          eL: 0,
          s: 0,
          p: 0,
          b0: 0,
          b1: 0
        }
        setParams(defaultParams)
    }

    render(): React.ReactNode {
      const {lang, props: {params, setParams}} = this
      const gameParams = ['a','b','c','d','eH','eL','s','p','b0','b1'];
      return <section className={style.create}>
          <ul className={style.baseFields}>
              <li>
                  <Label label={lang.playersPerGroup}/>
                  <Input {...{
                      type: 'number',
                      value: params.playersPerGroup,
                      onChange: ({target: {value: playersPerGroup}}) => setParams({playersPerGroup: Number(playersPerGroup)})
                  }}/>
              </li>
              <li>
                  <Label label={lang.round}/>
                  <Input {...{
                      type: 'number',
                      value: params.rounds,
                      onChange: ({target: {value: rounds}}) => setParams({rounds: Number(rounds)})
                  }}/>
              </li>
              <li>
                  <Label label={lang.gameType}/>
                  <Input {...{
                      type: 'number',
                      value: params.gameType,
                      onChange: ({target: {value: gameType}}) => setParams({gameType: Number(gameType)})
                  }}/>
              </li>
              <li>
                  <Label label={lang.version}/>
                  <Input {...{
                      type: 'number',
                      value: params.version,
                      onChange: ({target: {value: version}}) => setParams({version: Number(version)})
                  }}/>
              </li>
          </ul>
          <p>{lang.params}</p>
          <ul>
            {
              gameParams.map(p => {
                if(params.version===Version.V3 && p==='b') return null;
                if(params.version!==Version.V3 && ['p','b0','b1'].includes(p)) return null;
                return <li key={p}>
                  <Label label={p}/>
                  <Input {...{
                      type: 'number',
                      value: params[p],
                      onChange: ({target: {value}}) => setParams({[p]: Number(value)})
                  }}/>
                </li>
              })
            }
          </ul>
      </section>
    }
}