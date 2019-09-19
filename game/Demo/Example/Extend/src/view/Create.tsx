import * as React from 'react';
import * as Extend from '@extend/client';
import {InputNumber} from 'antd';
import {ICreateParams} from '../config';

class GroupCreate extends Extend.Group.Create<ICreateParams> {
    componentDidMount(): void {
        const {props: {setGroupParams}} = this;
        setGroupParams({
            goal: ~~(Math.random() * 10)
        });
    }

    render() {
        const {groupParams: {goal}, setGroupParams} = this.props;
        return <InputNumber value={goal} onChange={goal => setGroupParams({goal: +goal})}/>;
    }
}

export class Create extends Extend.Create<ICreateParams> {
    GroupCreate = GroupCreate;
}