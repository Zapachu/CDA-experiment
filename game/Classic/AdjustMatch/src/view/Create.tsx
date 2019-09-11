import * as React from 'react';
import * as Extend from '@extend/client';
import {Label, Lang} from '@elf/component';
import {Col, Row, Slider} from 'antd';
import {ICreateParams} from '../config';

class GroupCreate extends Extend.Group.Create<ICreateParams> {
    lang = Lang.extractLang({
        round: ['轮次(r)', 'Round(r)'],
        oldPlayer: ['旧参与者(m)', 'OldPlayer(m)'],
        minPrivateValue: ['最低心理价值(v1)', 'MinPrivateValue(v1)'],
        maxPrivateValue: ['最高心理价值(v2)', 'MaxPrivateValue(v2)'],
    });

    componentDidMount(): void {
        const {props: {groupSize, setParams}} = this;
        setParams({
            round: 3,
            oldPlayer: ~~(groupSize >> 1),
            minPrivateValue: 25,
            maxPrivateValue: 75
        });
    }

    render() {
        const {props: {groupSize, params: {round, oldPlayer, minPrivateValue, maxPrivateValue}, setParams}, lang} = this;
        return <Row>
            <Col span={12} offset={6}>
                <div>
                    <Label label={lang.round}/>
                    <Slider value={round} onChange={v => setParams({round: +v})} max={6}/>
                </div>
                <div>
                    <Label label={lang.oldPlayer}/>
                    <Slider value={oldPlayer} onChange={v => setParams({oldPlayer: +v})} max={groupSize}/>
                </div>
                <div>
                    <Label label={lang.minPrivateValue}/>
                    <Slider value={minPrivateValue} onChange={v => setParams({minPrivateValue: +v})} max={50}/>
                </div>
                <div>
                    <Label label={lang.maxPrivateValue}/>
                    <Slider value={maxPrivateValue} onChange={v => setParams({maxPrivateValue: +v})} min={50}/>
                </div>
            </Col>
        </Row>;
    }
}

export class Create extends Extend.Create<ICreateParams> {
    GroupCreate = GroupCreate;
}