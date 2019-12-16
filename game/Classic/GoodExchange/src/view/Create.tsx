import * as React from 'react'
import { InputNumber } from 'antd'
import { Component, Group, Round } from '@extend/client'
import { IRoundCreateParams } from '../config'
import { RoundDecorator } from '@extend/share'
import { Label, Lang } from '@elf/component'

function RoundCreate({
  params: { groupSize },
  roundParams: { t, privatePriceMatrix },
  setRoundParams
}: Round.Round.ICreateProps<IRoundCreateParams>) {
  const LIMIT = {
    minT: 60,
    maxT: 120
  }
  const lang = Lang.extractLang({
    tradeTime: ['交易时长']
  })
  React.useEffect(() => {
    if (privatePriceMatrix) {
      return
    }
    setRoundParams({ t: LIMIT.minT })
  }, [])
  return (
    <>
      <Label label={lang.tradeTime} />
      <InputNumber value={t} min={LIMIT.minT} max={LIMIT.maxT} onChange={t => setRoundParams({ t })} />
      <br />
      <Component.PrivateValueMatrix
        groupSize={groupSize}
        goodAmount={groupSize}
        matrix={privatePriceMatrix}
        setMatrix={privatePriceMatrix => setRoundParams({ privatePriceMatrix })}
      />
    </>
  )
}

class GroupCreate extends Round.Create<IRoundCreateParams> {
  RoundCreate = RoundCreate
}

export class Create extends Group.Create<RoundDecorator.IGroupCreateParams<IRoundCreateParams>> {
  GroupCreate = GroupCreate
}
