import * as React from 'react'
import { Group, Round } from '@extend/client'
import { Label, Lang } from '@elf/component'
import { Col, InputNumber, Row } from 'antd'
import { IGroupCreateParams, IRoundCreateParams } from '../config'

function RoundCreate({ roundParams: { t, M, K }, setRoundParams }: Round.Round.ICreateProps<IRoundCreateParams>) {
  const LIMIT = {
      minT: 60,
      maxT: 120
    },
    lang = Lang.extractLang({
      t: ['每轮时长(t/秒)', 'ExchangeTime(t/s)'],
      M: ['捕鱼上限(M)'],
      K: ['收益参数(K)']
    })
  React.useEffect(() => {
    if (t) {
      return
    }
    setRoundParams({
      t: LIMIT.minT,
      M: 50,
      K: 2
    })
  }, [])
  const inputStyle: React.CSSProperties = {
    marginTop: '1rem'
  }
  return (
    <Row>
      <Col span={12} offset={6}>
        <div>
          <Label label={lang.t} />
          <InputNumber value={t} onChange={v => setRoundParams({ t: +v })} min={30} max={60} />
        </div>
        <div>
          <Label label={lang.M} />
          <InputNumber style={inputStyle} value={M} onChange={v => setRoundParams({ M: +v })} max={100} />
        </div>
        <div>
          <Label label={lang.K} />
          <InputNumber style={inputStyle} value={K} onChange={v => setRoundParams({ K: +v })} min={1} />
        </div>
      </Col>
    </Row>
  )
}

class GroupCreate extends Round.Create<IRoundCreateParams> {
  RoundCreate = RoundCreate
}

export class Create extends Group.Create<IGroupCreateParams> {
  GroupCreate = GroupCreate
}
