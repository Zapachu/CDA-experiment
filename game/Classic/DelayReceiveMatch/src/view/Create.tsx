import * as React from 'react';
import * as Extend from '@extend/client';
import {Label, Lang} from '@elf/component';
import {Col, Row, Slider} from 'antd';
import {ICreateParams} from '../config';

const maxGoodAmount = 12;

class GroupCreate extends Extend.Group.Create<ICreateParams> {
    lang = Lang.extractLang({
        round: ['轮次(r)', 'Round(r)'],
        goodAmount: ['物品数量(M)', 'OldPlayer(M)'],
        minPrivateValue: ['最低心理价值(v1)', 'MinPrivateValue(v1)'],
        maxPrivateValue: ['最高心理价值(v2)', 'MaxPrivateValue(v2)'],
    });

    componentDidMount(): void {
        const {props: {setGroupParams}} = this;
        setGroupParams({
            round: 3,
            goodAmount: ~~(maxGoodAmount >> 1),
            minPrivateValue: 25,
            maxPrivateValue: 75
        });
    }

    render() {
        const {props: {groupParams: {round, goodAmount, minPrivateValue, maxPrivateValue}, setGroupParams}, lang} = this;
        return <Row>
            <Col span={12} offset={6}>
                <div>
                    <Label label={lang.round}/>
                    <Slider value={round} onChange={v => setGroupParams({round: +v})} max={6}/>
                </div>
                <div>
                    <Label label={lang.goodAmount}/>
                    <Slider value={goodAmount} onChange={v => setGroupParams({goodAmount: +v})} max={maxGoodAmount}/>
                </div>
                <div>
                    <Label label={lang.minPrivateValue}/>
                    <Slider value={minPrivateValue} onChange={v => setGroupParams({minPrivateValue: +v})} max={50}/>
                </div>
                <div>
                    <Label label={lang.maxPrivateValue}/>
                    <Slider value={maxPrivateValue} onChange={v => setGroupParams({maxPrivateValue: +v})} min={50}/>
                </div>
            </Col>
        </Row>;
    }
}

export class Create extends Extend.Create<ICreateParams> {
    GroupCreate = GroupCreate;
}