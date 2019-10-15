import * as React from 'react';
import * as Extend from '@extend/client';
import {Label} from '@elf/component';
import {InputNumber} from 'antd';
import {ICreateParams} from '../config';

class GroupCreate extends Extend.Group.Create<ICreateParams> {
    componentDidMount(): void {
        const {props: {setGroupParams}} = this;
        setGroupParams({
            endowment: 38
        });
    }

    render() {
        const {groupParams: {endowment}, setGroupParams} = this.props;
        return <section>
            <Label label='Endowment'/>
            <InputNumber value={endowment} onChange={v => setGroupParams({endowment: +v})}/>
        </section>;
    }
}

export class Create extends Extend.Create<ICreateParams> {
    GroupCreate = GroupCreate;
}
