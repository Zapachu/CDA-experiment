import * as React from 'react'
import * as Extend from '@extend/client'
import { Label, Lang } from '@elf/component'
import { Col, Row, Slider } from 'antd'
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
        groupParams: { round, t, buyPriceRange, sellPriceRange },
        setGroupParams
      },
      lang
    } = this
    return (
      <Row>
        <Col span={12} offset={6}>
          <div>
            <Label label={lang.round} />
            <Slider value={round} onChange={v => setGroupParams({ round: +v })} max={6} marks={{ [round]: round }} />
          </div>
          <div>
            <Label label={lang.t} />
            <Slider value={t} onChange={v => setGroupParams({ t: +v })} min={30} max={60} marks={{ [t]: t }} />
          </div>
          <div>
            <Label label={lang.buyPriceRange} />
            <Slider
              {...SliderProps}
              value={buyPriceRange}
              onChange={v => setGroupParams({ buyPriceRange: v as any })}
            />
          </div>
          <div>
            <Label label={lang.sellPriceRange} />
            <Slider
              {...SliderProps}
              value={sellPriceRange}
              onChange={v => setGroupParams({ sellPriceRange: v as any })}
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
