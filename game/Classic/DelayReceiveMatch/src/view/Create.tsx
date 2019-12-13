import * as React from 'react'
import { Component, Group, Round } from '@extend/client'
import { IRoundCreateParams } from '../config'
import { RoundDecorator } from '@extend/share'

function RoundCreate({ params: { groupSize }, setRoundParams }: Round.Round.ICreateProps<IRoundCreateParams>) {
  return (
    <Component.PrivateValueMatrix
      groupSize={groupSize}
      callback={privatePriceMatrix => setRoundParams({ privatePriceMatrix })}
    />
  )
}

class GroupCreate extends Round.Create<IRoundCreateParams> {
  RoundCreate = RoundCreate
}

export class Create extends Group.Create<RoundDecorator.ICreateParams<IRoundCreateParams>> {
  GroupCreate = GroupCreate
}
