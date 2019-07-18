import * as React from 'react'
import * as Extend from '@extend/register'
import {InputNumber} from 'antd'
import {ICreateParams} from '../config'

class GroupCreate extends Extend.Group.Create<ICreateParams> {
    componentDidMount(): void {
        const {props: {setParams}} = this
        setParams({
            goal: ~~(Math.random() * 10)
        })
    }

    render() {
        const {params: {goal}, setParams} = this.props
        return <InputNumber value={goal} onChange={goal => setParams({goal: +goal})}/>
    }
}

export class Create extends Extend.Create<ICreateParams> {
    GroupCreate = GroupCreate
}