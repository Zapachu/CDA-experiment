import * as React from 'react'
import { Group, Round } from '@extend/client'
import { Label, Lang } from '@elf/component'
import { Col, InputNumber, Row } from 'antd'
import { IRoundCreateParams } from '../config'
import { RoundDecorator } from '@extend/share'

const maxGoodAmount = 12

class RoundCreate extends Round.Round.Create<IRoundCreateParams> {
  lang = Lang.extractLang({
    goodAmount: ['物品数量(M)', 'OldPlayer(M)'],
    minPrivateValue: ['最低心理价值(v1)', 'MinPrivateValue(v1)'],
    maxPrivateValue: ['最高心理价值(v2)', 'MaxPrivateValue(v2)']
  })

  componentDidMount(): void {
    const {
      props: { setRoundParams }
    } = this
    setRoundParams({
      goodAmount: ~~(maxGoodAmount >> 1),
      minPrivateValue: 25,
      maxPrivateValue: 75
    })
  }

  render() {
    const {
      props: {
        roundParams: { goodAmount, minPrivateValue, maxPrivateValue },
        setRoundParams
      },
      lang
    } = this
    return (
      <Row>
        <Col span={12} offset={6}>
          <div>
            <Label label={lang.goodAmount} />
            <InputNumber value={goodAmount} onChange={v => setRoundParams({ goodAmount: +v })} max={maxGoodAmount} />
          </div>
          <div>
            <Label label={lang.minPrivateValue} />
            <InputNumber value={minPrivateValue} onChange={v => setRoundParams({ minPrivateValue: +v })} max={50} />
          </div>
          <div>
            <Label label={lang.maxPrivateValue} />
            <InputNumber value={maxPrivateValue} onChange={v => setRoundParams({ maxPrivateValue: +v })} min={50} />
          </div>
        </Col>
      </Row>
    )
  }
}

class GroupCreate extends Round.Create<IRoundCreateParams> {
  RoundCreate = RoundCreate
}

export class Create extends Group.Create<RoundDecorator.ICreateParams<IRoundCreateParams>> {
  GroupCreate = GroupCreate
}
