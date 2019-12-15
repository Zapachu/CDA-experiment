import * as React from 'react'
import { Group, Round } from '@extend/client'
import { Label, Lang } from '@elf/component'
import { Col, InputNumber, Row } from 'antd'
import { awardLimit, IGroupCreateParams, IRoundCreateParams } from '../config'

const riskAwardInputProps = {
  min: awardLimit >> 1,
  step: 5
}

function RoundCreate({
  roundParams: { t, awardA, awardB },
  setRoundParams
}: Round.Round.ICreateProps<IRoundCreateParams>) {
  const LIMIT = {
    minT: 60,
    maxT: 120
  }
  const lang = Lang.extractLang({
    t: ['操作时长', 'Time'],
    risk: ['风险', 'Risk'],
    riskInfo: [r => `中奖则获得${r}，否则获得${awardLimit - r}`]
  })
  React.useEffect(() => {
    if (t) {
      return
    }
    setRoundParams({
      t: LIMIT.minT,
      awardA: 90,
      awardB: 60
    })
  }, [])
  return (
    <>
      <Row>
        <Col span={12} offset={6}>
          <div>
            <Label label={lang.t} />
            <InputNumber value={t} min={LIMIT.minT} max={LIMIT.maxT} onChange={v => setRoundParams({ t: +v })} />
          </div>
        </Col>
      </Row>
      <br />
      <Label label={lang.risk} />
      <Row>
        <Col offset={2} span={10}>
          <Label label={`A : ${lang.riskInfo(awardA)}`} />
          <InputNumber {...riskAwardInputProps} value={awardA} onChange={v => setRoundParams({ awardA: +v })} />
        </Col>
        <Col span={10}>
          <Label label={`B : ${lang.riskInfo(awardB)}`} />
          <InputNumber {...riskAwardInputProps} value={awardB} onChange={v => setRoundParams({ awardB: +v })} />
        </Col>
      </Row>
    </>
  )
}

class GroupCreate extends Round.Create<IRoundCreateParams> {
  RoundCreate = RoundCreate
}

export class Create extends Group.Create<IGroupCreateParams> {
  GroupCreate = GroupCreate
}
