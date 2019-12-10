import * as React from 'react'
import { Group } from '@extend/client'
import { Label, Lang } from '@elf/component'
import { Col, InputNumber, Radio, Row } from 'antd'
import { ICreateParams, Mode } from '../config'

class GroupCreate extends Group.Group.Create<ICreateParams> {
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

  componentDidMount(): void {
    const {
      props: { setGroupParams }
    } = this
    setGroupParams({
      round: 3,
      t: 45,
      M: 50,
      K: 2,
      mode: Mode.normal,
      P: 1
    })
  }

  render() {
    const {
      props: {
        groupParams: { round, t, M, K, P, mode },
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
            <InputNumber value={round} onChange={v => setGroupParams({ round: +v })} max={6} />
          </div>
          <div>
            <Label label={lang.t} />
            <InputNumber value={t} onChange={v => setGroupParams({ t: +v })} min={30} max={60} />
          </div>
          <div>
            <Label label={lang.M} />
            <InputNumber style={inputStyle} value={M} onChange={v => setGroupParams({ M: +v })} max={100} />
          </div>
          <div>
            <Label label={lang.K} />
            <InputNumber style={inputStyle} value={K} onChange={v => setGroupParams({ K: +v })} min={1} />
          </div>
          <div>
            <Label label={lang.mode} />
            <Radio.Group value={mode} onChange={({ target: { value } }) => setGroupParams({ mode: value })}>
              <Radio value={Mode.normal}>{lang.normal}</Radio>
              <Radio value={Mode.reward}>{lang.reward}</Radio>
              <Radio value={Mode.punish}>{lang.punish}</Radio>
            </Radio.Group>
          </div>
          {mode === Mode.normal ? null : (
            <div>
              <Label label={lang.P} />
              <InputNumber style={inputStyle} value={P} onChange={v => setGroupParams({ P: +v })} min={0} max={1} />
            </div>
          )}
        </Col>
      </Row>
    )
  }
}

export class Create extends Group.Create<ICreateParams> {
  GroupCreate = GroupCreate
}
