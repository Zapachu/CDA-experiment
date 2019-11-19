import * as React from 'react'
import * as style from './style.scss'
import { Label, Lang, RangeInput } from '@elf/component'
import { Core } from '@bespoke/client'
import { ICreateParams } from '../interface'

interface ICreateState {}

export class Create extends Core.Create<ICreateParams, ICreateState> {
  lang = Lang.extractLang({
    round: ['轮次', 'Round'],
    player: ['玩家', 'Player'],
    groupSize: ['每组人数', 'GroupSize'],
    quota: ['总量', 'Quota'],
    edit: ['编辑', 'EDIT'],
    done: ['完成', 'DONE']
  })

  componentDidMount(): void {
    const {
      props: { setParams }
    } = this
    const defaultParams: ICreateParams = {
      round: 3,
      groupSize: 2,
      quota: 100
    }
    setParams(defaultParams)
  }

  edit() {
    const {
      props: { setSubmitable }
    } = this
    setSubmitable(false)
  }

  done() {
    const {
      props: { setSubmitable }
    } = this
    setSubmitable(true)
  }

  render() {
    const {
      lang,
      props: { submitable }
    } = this
    return (
      <section className={style.create}>
        {this.renderBaseFields()}
        <div className={style.btnSwitch}>
          {submitable ? <a onClick={() => this.edit()}>{lang.edit}</a> : <a onClick={() => this.done()}>{lang.done}</a>}
        </div>
      </section>
    )
  }

  renderBaseFields() {
    const {
      lang,
      props: {
        params: { round, groupSize, quota },
        setParams
      }
    } = this
    return (
      <ul className={style.configFields}>
        <li>
          <Label label={lang.round} />
          <RangeInput
            value={round}
            min={1}
            max={10}
            onChange={({ target: { value } }) => setParams({ round: +value })}
          />
        </li>
        <li>
          <Label label={lang.groupSize} />
          <RangeInput value={groupSize} min={2} max={2} disabled={true} />
        </li>
        <li>
          <Label label={lang.quota} />
          <RangeInput
            value={quota}
            onChange={({ target: { value } }) => {
              setParams({ quota: +value })
            }}
          />
        </li>
      </ul>
    )
  }
}
