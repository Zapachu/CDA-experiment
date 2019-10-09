import * as React from 'react';
import * as Extend from '@extend/client';
import {Label, Lang} from '@elf/component';
import {Col, Row, Slider} from 'antd';
import {ICreateParams} from '../config';

class GroupCreate extends Extend.Group.Create<ICreateParams> {
    lang = Lang.extractLang({
        round: ['轮次(r)', 'Round(r)'],
        t: ['每轮时长(t/秒)', 'ExchangeTime(t/s)'],
        risk: ['风险', 'Risk']
    });

    componentDidMount(): void {
        const {props: {setGroupParams}} = this;
        setGroupParams({
            round: 3,
            t: 45,
            awardA: 90,
            awardB: 60
        });
    }

    render() {
        const {props: {groupParams: {round, t, awardA, awardB}, setGroupParams}, lang} = this;
        return <>
            <Row>
                <Col span={12} offset={6}>
                    <div>
                        <Label label={lang.round}/>
                        <Slider value={round} onChange={v => setGroupParams({round: +v})} max={6}
                                marks={{[round]: round}}/>
                    </div>
                    <div>
                        <Label label={lang.t}/>
                        <Slider value={t} onChange={v => setGroupParams({t: +v})} min={30} max={60} marks={{[t]: t}}/>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col offset={4} span={8}>
                    <Label label={lang.risk}/>
                    <Slider value={awardA} onChange={v => setGroupParams({awardA: +v})} marks={{[awardA]: awardA}}/>
                </Col>
                <Col span={8}>
                    <Label label={lang.risk}/>
                    <Slider value={awardB} onChange={v => setGroupParams({awardB: +v})} marks={{[awardB]: awardB}}/>
                </Col>
            </Row>
        </>;
    }
}

export class Create extends Extend.Create<ICreateParams> {
    GroupCreate = GroupCreate;
}
