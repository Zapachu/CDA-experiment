import * as React from 'react'
import { Group } from '@extend/client'
import { Label, Lang } from '@elf/component'
import { Col, InputNumber, Row } from 'antd'
import { awardLimit, ICreateParams } from '../config'

const riskSliderProps = {
  min: awardLimit >> 1,
  step: 5
}

class GroupCreate extends Group.Group.Create<ICreateParams> {
  lang = Lang.extractLang({
    round: ['轮次(r)', 'Round(r)'],
    t: ['每轮时长(t/秒)', 'ExchangeTime(t/s)'],
    risk: ['风险', 'Risk'],
    riskInfo: [r => `中奖则获得${r}，否则获得${awardLimit - r}`]
  })

  componentDidMount(): void {
    const {
      props: { setGroupParams }
    } = this
    setGroupParams({
      round: 3,
      t: 45,
      awardA: 90,
      awardB: 60
    })
  }

  render() {
    const {
      props: {
        groupParams: { round, t, awardA, awardB },
        setGroupParams
      },
      lang
    } = this
    return (
      <>
        <Row>
          <Col span={12} offset={6}>
            <div>
              <Label label={lang.round} />
              <InputNumber value={round} onChange={v => setGroupParams({ round: +v })} max={6} />
            </div>
            <div>
              <Label label={lang.t} />
              <InputNumber value={t} onChange={v => setGroupParams({ t: +v })} min={30} max={60} />
            </div>
          </Col>
        </Row>
        <Label label={lang.risk} />
        <Row>
          <Col offset={4} span={8}>
            <Label label={`A : ${lang.riskInfo(awardA)}`} />
            <InputNumber {...riskSliderProps} value={awardA} onChange={v => setGroupParams({ awardA: +v })} />
          </Col>
          <Col span={8}>
            <Label label={`B : ${lang.riskInfo(awardB)}`} />
            <InputNumber {...riskSliderProps} value={awardB} onChange={v => setGroupParams({ awardB: +v })} />
          </Col>
        </Row>
      </>
    )
  }
}

export class Create extends Group.Create<ICreateParams> {
  GroupCreate = GroupCreate
}
