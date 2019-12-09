import * as React from 'react'
import * as Extend from '@extend/client'
import { Label, Lang } from '@elf/component'
import { Col, InputNumber, Row } from 'antd'
import { ICreateParams } from '../config'

class GroupCreate extends Extend.Group.Create<ICreateParams> {
  lang = Lang.extractLang({
    round: ['轮次(r)', 'Round(r)'],
    oldPlayer: ['旧参与者(m)', 'OldPlayer(m)'],
    minPrivateValue: ['最低心理价值(v1)', 'MinPrivateValue(v1)'],
    maxPrivateValue: ['最高心理价值(v2)', 'MaxPrivateValue(v2)']
  })

  componentDidMount(): void {
    const {
      props: {
        params: { groupSize },
        setGroupParams
      }
    } = this
    setGroupParams({
      round: 3,
      oldPlayer: ~~(groupSize >> 1),
      minPrivateValue: 25,
      maxPrivateValue: 75
    })
  }

  render() {
    const {
      props: {
        params: { groupSize },
        groupParams: { round, oldPlayer, minPrivateValue, maxPrivateValue },
        setGroupParams
      },
      lang
    } = this
    return (
      <Row>
        <Col span={12} offset={6}>
          <div>
            <Label label={lang.round} />
            <InputNumber value={round} onChange={v => setGroupParams({ round: +v })} min={0} max={6} />
          </div>
          <div>
            <Label label={lang.oldPlayer} />
            <InputNumber value={oldPlayer} onChange={v => setGroupParams({ oldPlayer: +v })} min={0} max={groupSize} />
          </div>
          <div>
            <Label label={lang.minPrivateValue} />
            <InputNumber
              value={minPrivateValue}
              onChange={v => setGroupParams({ minPrivateValue: +v })}
              min={0}
              max={50}
            />
          </div>
          <div>
            <Label label={lang.maxPrivateValue} />
            <InputNumber
              value={maxPrivateValue}
              onChange={v => setGroupParams({ maxPrivateValue: +v })}
              min={50}
              max={100}
            />
          </div>
        </Col>
      </Row>
    )
  }
}

export class Create extends Extend.Create<ICreateParams> {
  GroupCreate = GroupCreate
}
