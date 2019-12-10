import * as React from 'react'
import { Group } from '@extend/client'
import { Label } from '@elf/component'
import { InputNumber } from 'antd'
import { ICreateParams } from '../config'

class GroupCreate extends Group.Group.Create<ICreateParams> {
  componentDidMount(): void {
    const {
      props: { setGroupParams }
    } = this
    setGroupParams({
      endowment: 38
    })
  }

  render() {
    const {
      groupParams: { endowment },
      setGroupParams
    } = this.props
    return (
      <section>
        <Label label="Endowment" />
        <InputNumber value={endowment} onChange={v => setGroupParams({ endowment: +v })} />
      </section>
    )
  }
}

export class Create extends Group.Create<ICreateParams> {
  GroupCreate = GroupCreate
}
