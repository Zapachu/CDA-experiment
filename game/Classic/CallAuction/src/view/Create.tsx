import * as React from 'react'
import { Component, Group, Round } from '@extend/client'
import { Label, Lang } from '@elf/component'
import { InputNumber, Spin } from 'antd'
import { IRoundCreateParams } from '../config'
import { RoundDecorator } from '@extend/share'

function RoundCreate({
  params: { groupSize },
  roundParams: { t, buyerAmount, privatePriceMatrix },
  setRoundParams
}: Round.Round.ICreateProps<IRoundCreateParams>) {
  const LIMIT = {
    minT: 30,
    maxT: 120
  }
  const lang = Lang.extractLang({
    tradeTime: ['交易时长'],
    buyerAmount: ['买家数量'],
    buyPriceMatrix: ['买家心理价值'],
    sellPriceMatrix: ['卖家心理价值']
  })
  React.useEffect(() => {
    if (privatePriceMatrix) {
      return
    }
    setRoundParams({ privatePriceMatrix: [], buyerAmount: ~~(groupSize >> 1), t: LIMIT.minT })
  }, [])
  return privatePriceMatrix ? (
    <section>
      <>
        <Label label={lang.tradeTime} />
        <InputNumber value={t} min={LIMIT.minT} max={LIMIT.maxT} onChange={t => setRoundParams({ t })} />
        &nbsp;&nbsp;&nbsp;
        <Label label={lang.buyerAmount} />
        <InputNumber
          value={buyerAmount}
          min={1}
          max={groupSize}
          onChange={buyerAmount => setRoundParams({ buyerAmount })}
        />
      </>
      <br />
      <br />
      <>
        <Label label={lang.buyPriceMatrix} />
        <Component.PrivateValueMatrix
          groupSize={buyerAmount}
          goodAmount={1}
          preMatrix={privatePriceMatrix.slice(0, buyerAmount)}
          callback={matrix =>
            setRoundParams({ privatePriceMatrix: [...matrix, ...privatePriceMatrix.slice(buyerAmount)] })
          }
        />
      </>
      <br />
      <>
        <Label label={lang.sellPriceMatrix} />
        <Component.PrivateValueMatrix
          groupSize={groupSize - buyerAmount}
          goodAmount={1}
          preMatrix={privatePriceMatrix.slice(buyerAmount)}
          callback={matrix =>
            setRoundParams({ privatePriceMatrix: [...privatePriceMatrix.slice(0, buyerAmount), ...matrix] })
          }
        />
      </>
    </section>
  ) : (
    <Spin />
  )
}

class GroupCreate extends Round.Create<IRoundCreateParams> {
  RoundCreate = RoundCreate
}

export class Create extends Group.Create<RoundDecorator.ICreateParams<IRoundCreateParams>> {
  GroupCreate = GroupCreate
}
