import * as React from 'react'
import * as Extend from '@extend/client'
import { Label, Lang } from '@elf/component'
import { Col, InputNumber, Row } from 'antd'
import { ICreateParams } from '../config'

const SliderProps = {
  marks: {
    0: 0,
    25: 25,
    50: 50,
    75: 75,
    100: 100
  },
  step: 5,
  range: true
}

class GroupCreate extends Extend.Group.Create<ICreateParams> {
  lang = Lang.extractLang({
    round: ['轮次(r)', 'Round(r)'],
    t: ['每轮时长(t/秒)', 'ExchangeTime(t/s)'],
    buyPriceRange: ['买家心理价值区间', 'Range of buyer private price'],
    sellPriceRange: ['卖家心理价值区间', 'Range of seller private price']
  })

  componentDidMount(): void {
    const {
      props: { setGroupParams }
    } = this
    setGroupParams({
      round: 3,
      t: 45,
      buyPriceRange: [50, 100],
      sellPriceRange: [50, 100]
    })
  }

  render() {
    const {
      props: {
        groupParams: { round, t, buyPriceRange = [], sellPriceRange = [] },
        setGroupParams
      },
      lang
    } = this
    return (
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
          <div>
            <Label label={lang.buyPriceRange} />
            <InputNumber
              value={buyPriceRange[0]}
              onChange={v => setGroupParams({ buyPriceRange: [+v, buyPriceRange[1]] })}
              min={0}
              max={100}
            />
            &nbsp;~&nbsp;
            <InputNumber
              value={buyPriceRange[1]}
              onChange={v => setGroupParams({ buyPriceRange: [buyPriceRange[0], +v] })}
              min={0}
              max={100}
            />
          </div>
          <div>
            <Label label={lang.sellPriceRange} />
            <InputNumber
              value={sellPriceRange[0]}
              onChange={v => setGroupParams({ sellPriceRange: [+v, sellPriceRange[1]] })}
              min={0}
              max={100}
            />
            &nbsp;~&nbsp;
            <InputNumber
              value={sellPriceRange[1]}
              onChange={v => setGroupParams({ buyPriceRange: [sellPriceRange[0], +v] })}
              min={0}
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
