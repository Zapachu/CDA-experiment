import * as React from 'react'
import { Group, Round } from '@extend/client'
import { Label, Lang } from '@elf/component'
import { Col, InputNumber, Radio, Row } from 'antd'
import { IGroupCreateParams, IRoundCreateParams, Mode } from '../config'

function RoundCreate({
  roundParams: { t, M, K, mode, P },
  setRoundParams
}: Round.Round.ICreateProps<IRoundCreateParams>) {
  const LIMIT = {
      minT: 60,
      maxT: 120
    },
    lang = Lang.extractLang({
      round: ['轮次(r)', 'Round(r)'],
      t: ['每轮时长(t/秒)', 'ExchangeTime(t/s)'],
      M: ['初始实验币(M)'],
      K: ['收益参数(K)'],
      mode: ['模式'],
      P: ['奖惩参数(P)'],
      normal: ['普通'],
      reward: ['奖励'],
      punish: ['惩罚']
    })
  React.useEffect(() => {
    if (t) {
      return
    }
    setRoundParams({
      t: 45,
      M: 50,
      K: 2,
      mode: Mode.normal,
      P: 1
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
          <InputNumber value={t} onChange={v => setRoundParams({ t: +v })} min={LIMIT.minT} max={LIMIT.maxT} />
        </div>
        <div>
          <Label label={lang.M} />
          <InputNumber style={inputStyle} value={M} onChange={v => setRoundParams({ M: +v })} max={100} />
        </div>
        <div>
          <Label label={lang.K} />
          <InputNumber style={inputStyle} value={K} onChange={v => setRoundParams({ K: +v })} min={1} />
        </div>
        <div>
          <Label label={lang.mode} />
          <Radio.Group value={mode} onChange={({ target: { value } }) => setRoundParams({ mode: value })}>
            <Radio value={Mode.normal}>{lang.normal}</Radio>
            <Radio value={Mode.reward}>{lang.reward}</Radio>
            <Radio value={Mode.punish}>{lang.punish}</Radio>
          </Radio.Group>
        </div>
        {mode === Mode.normal ? null : (
          <div>
            <Label label={lang.P} />
            <InputNumber style={inputStyle} value={P} onChange={v => setRoundParams({ P: +v })} min={0} max={1} />
          </div>
        )}
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
