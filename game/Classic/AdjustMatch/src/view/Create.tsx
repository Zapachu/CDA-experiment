import * as React from 'react'
import { Component, Group, Round } from '@extend/client'
import { Label, Lang } from '@elf/component'
import { InputNumber } from 'antd'
import { IRoundCreateParams } from '../config'
import { RoundDecorator } from '@extend/share'

function RoundCreate({
  params: { groupSize },
  roundParams,
  setRoundParams
}: Round.Round.ICreateProps<IRoundCreateParams>) {
  const lang = Lang.extractLang({
    oldPlayer: ['旧参与者(m)', 'OldPlayer(m)']
  })
  React.useEffect(() => setRoundParams({ oldPlayer: ~~(groupSize / 2) }), [])
  return (
    <section>
      <>
        <Label label={lang.oldPlayer} />
        <InputNumber
          value={roundParams.oldPlayer}
          min={1}
          max={groupSize}
          onChange={oldPlayer => setRoundParams({ oldPlayer })}
        />
      </>
      <Component.PrivateValueMatrix
        groupSize={groupSize}
        matrix={roundParams.privatePriceMatrix}
        setMatrix={privatePriceMatrix => setRoundParams({ privatePriceMatrix })}
        goodAmount={groupSize}
      />
    </section>
  )
}

class GroupCreate extends Round.Create<IRoundCreateParams> {
  RoundCreate = RoundCreate
}

export class Create extends Group.Create<RoundDecorator.IGroupCreateParams<IRoundCreateParams>> {
  GroupCreate = GroupCreate
}
