import * as React from 'react'
import * as style from './style.scss'
import { ICreateParams } from '../interface'
import { Input, Label, Lang } from '@elf/component'
import { Core } from '@bespoke/client'

interface ICreateState {}

export class Create extends Core.Create<ICreateParams, ICreateState> {
  lang = Lang.extractLang({
    exchangeRate: ['兑换比率(￥/题)', 'Exchange rate (￥/Q)'],
    timeLimit: ['答题时长(秒)', 'Time limit(s)']
  })

  render(): React.ReactNode {
    const {
      lang,
      props: { params, setParams }
    } = this
    return (
      <section className={style.create}>
        <ul className={style.baseFields}>
          <li>
            <Label label={lang.exchangeRate as string} />
            <Input
              {...{
                type: 'number',
                value: params.exchangeRate,
                onChange: ({ target: { value: exchangeRate } }) => setParams({ exchangeRate } as any)
              }}
            />
          </li>
          <li>
            <Label label={lang.timeLimit as string} />
            <Input
              {...{
                type: 'number',
                value: params.timeLimit,
                onChange: ({ target: { value: timeLimit } }) => setParams({ timeLimit } as any)
              }}
            />
          </li>
        </ul>
      </section>
    )
  }
}
