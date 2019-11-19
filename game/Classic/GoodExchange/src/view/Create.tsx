import * as React from 'react'
import * as Extend from '@extend/client'
import { Label, Lang } from '@elf/component'
import { Col, Row, Slider } from 'antd'
import { ICreateParams } from '../config'

class GroupCreate extends Extend.Group.Create<ICreateParams> {
  lang = Lang.extractLang({
    round: ['轮次(r)', 'Round(r)'],
    t: ['交换时长(t/秒)', 'ExchangeTime(t/s)'],
    minPrivateValue: ['最低心理价值(v1)', 'MinPrivateValue(v1)'],
    maxPrivateValue: ['最高心理价值(v2)', 'MaxPrivateValue(v2)']
  })

  componentDidMount(): void {
    const {
      props: { setGroupParams }
    } = this
    setGroupParams({
      round: 3,
      t: 45,
      minPrivateValue: 25,
      maxPrivateValue: 75
    })
  }

  render() {
    const {
      props: {
        groupParams: { round, t, minPrivateValue, maxPrivateValue },
        setGroupParams
      },
      lang
    } = this
    return (
      <Row>
        <Col span={12} offset={6}>
          <div>
            <Label label={lang.round} />
            <Slider value={round} onChange={v => setGroupParams({ round: +v })} max={6} />
          </div>
          <div>
            <Label label={lang.t} />
            <Slider value={t} onChange={v => setGroupParams({ t: +v })} min={30} max={60} />
          </div>
          <div>
            <Label label={lang.minPrivateValue} />
            <Slider value={minPrivateValue} onChange={v => setGroupParams({ minPrivateValue: +v })} max={50} />
          </div>
          <div>
            <Label label={lang.maxPrivateValue} />
            <Slider value={maxPrivateValue} onChange={v => setGroupParams({ maxPrivateValue: +v })} min={50} />
          </div>
        </Col>
      </Row>
    )
  }
}

export class Create extends Extend.Create<ICreateParams> {
  GroupCreate = GroupCreate
}
