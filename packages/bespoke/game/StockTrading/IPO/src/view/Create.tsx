import * as React from 'react'
import * as style from './style.scss'
import {Core, Input, Label, Lang, RangeInput, Select} from 'bespoke-client-util'
import {IPOType} from '../config'
import {ICreateParams} from '../interface'

const gameTypes = [
  {label: '中位数', value: IPOType.Median},
  {label: '最高价前K', value: IPOType.TopK},
]

export class Create extends Core.Create<ICreateParams> {
    lang = Lang.extractLang({
        round: ['轮次', 'Round'],
        groupSize: ['每组人数', 'Players per Group'],
        gameType: ['类型', 'Game Type'],
        total: ['发行股数', 'Issued Shares'],
    })

    componentDidMount(): void {
        const {props: {setParams}} = this
        let defaultParams: ICreateParams = {
          groupSize: 6,
          total: 10000,
          type: IPOType.Median
        }
        setParams(defaultParams)
    }

    render(): React.ReactNode {
      const {lang, props: {params, setParams}} = this
      return <section className={style.create}>
          <ul className={style.fields}>
              <li>
                  <Label label={lang.groupSize}/>
                  <RangeInput value={params.groupSize}
                              min={2}
                              max={12}
                              step={1}
                              onChange={({target: {value: groupSize}}) => setParams({groupSize: Number(groupSize)})}
                  />
              </li>
              <li>
                  <Label label={lang.total}/>
                  <Input {...{
                      type: 'number',
                      value: params.total,
                      onChange: ({target: {value}}) => setParams({total: Number(value)})
                  }}/>
              </li>
              <li>
                  <Label label={lang.gameType}/>
                  <Select value={params.type} options={gameTypes} onChange={val => setParams({type: +val})} />
              </li>
          </ul>
      </section>
    }
}