import * as React from 'react'
import * as Extend from '@extend/client'
import { Label, Lang } from '@elf/component'
import { Col, InputNumber, Row, Slider } from 'antd'
import { ICreateParams } from '../config'

class GroupCreate extends Extend.Group.Create<ICreateParams> {
  lang = Lang.extractLang({
    round: ['轮次(r)', 'Round(r)'],
    t: ['每轮时长(t/秒)', 'ExchangeTime(t/s)'],
    M: ['捕鱼上限(M)'],
    K: ['收益参数(K)']
  })

  componentDidMount(): void {
    const {
      props: { setGroupParams }
    } = this
    setGroupParams({
      round: 3,
      t: 45,
      M: 50,
      K: 2
    })
  }

  render() {
    const {
      props: {
        groupParams: { round, t, M, K },
        setGroupParams
      },
      lang
    } = this
    const inputStyle: React.CSSProperties = {
      marginTop: '1rem'
    }
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
            <Label label={lang.M} />
            <InputNumber style={inputStyle} value={M} onChange={v => setGroupParams({ M: +v })} max={100} />
          </div>
          <div>
            <Label label={lang.K} />
            <InputNumber style={inputStyle} value={K} onChange={v => setGroupParams({ K: +v })} min={1} />
          </div>
        </Col>
      </Row>
    )
  }
}

export class Create extends Extend.Create<ICreateParams> {
  GroupCreate = GroupCreate
}
