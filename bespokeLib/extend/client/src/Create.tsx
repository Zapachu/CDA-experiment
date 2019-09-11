import * as React from 'react';
import {Core} from '@bespoke/client';
import {GroupRange, Wrapper} from '@extend/share';
import {Col, Row, Slider, Spin, Switch, Tabs} from 'antd';
import {Label, Lang} from '@elf/component';
import {Group} from './group';

namespace Extractor {
    export function params<P>(params: Core.TCreateParams<Wrapper.ICreateParams<P>>, groupIndex: number): Core.TCreateParams<P> {
        return params.groupsParams[groupIndex];
    }

    export function setParams<P>(setParams: Core.TSetCreateParams<Wrapper.ICreateParams<P>>, groupIndex?: number): Core.TSetCreateParams<P> {
        return (action: React.SetStateAction<P>) =>
            setParams((prevParams => {
                const i = groupIndex || 0;
                const groupsParams = prevParams.groupsParams.slice(),
                    prevGroupParams = groupsParams[i];
                groupsParams[i] = {...prevGroupParams, ...typeof action === 'function' ? (action as (prevState: P) => P)(prevGroupParams) : action};
                if (groupIndex === undefined) {
                    for (let j = 0; j < groupsParams.length; j++) {
                        groupsParams[j] = {...groupsParams[0]};
                    }
                }
                return {groupsParams};
            }));
    }
}

interface ICreateState {
    independentGroup: boolean
}

export class Create<ICreateParams, S extends ICreateState = ICreateState> extends Core.Create<Wrapper.ICreateParams<Core.TCreateParams<ICreateParams>>, S> {
    GroupCreate: React.ComponentType<Group.ICreateProps<ICreateParams>> = Group.Create;

    state: S = {
        independentGroup: false
    } as S;

    lang = Lang.extractLang({
        group: ['组', 'Extend.Inner.tsx'],
        groupSize: ['每组人数', 'GroupSize'],
        independentGroup: ['每组单独配置', 'Independent Group'],
        allGroup: ['所有组', 'AllGroup'],
        groupIndex: [i => `第${i + 1}组`, i => `Group ${i + 1}`]
    });

    componentDidMount(): void {
        const {props: {setParams}} = this;
        const initParams: Wrapper.ICreateParams<ICreateParams> = {
            group: ~~(GroupRange.group.max + GroupRange.group.min >> 1),
            groupSize: ~~(GroupRange.groupSize.max + GroupRange.groupSize.min >> 1),
            groupsParams: Array(GroupRange.group.max).fill(null).map(() => ({} as any))
        };
        setParams(initParams);
    }

    render(): React.ReactNode {
        const {lang, props: {params, setParams}, state: {independentGroup}} = this,
            {groupSize} = params;
        if (!params.groupsParams) {
            return <Spin/>;
        }
        return <div>
            <Row>
                <Col span={12} offset={6}>
                    <div>
                        <Label label={lang.group}/>
                        <Slider {...GroupRange.group} value={params.group}
                                onChange={value => setParams({group: +value})}/>
                    </div>
                    <div>
                        <Label label={lang.groupSize}/>
                        <Slider {...GroupRange.groupSize} value={params.groupSize}
                                onChange={value => setParams({groupSize: +value})}/>
                    </div>
                    <div style={{margin: '1.5rem'}}>
                        <Label label={lang.independentGroup}/>
                        <Switch checked={independentGroup}
                                onChange={independentGroup => this.setState({independentGroup})}/>
                    </div>
                </Col>
            </Row>
            <Tabs>
                {
                    independentGroup ? Array(params.group).fill(null).map((_, i) =>
                            <Tabs.TabPane forceRender={true} tab={lang.groupIndex(i)} key={i.toString()}>
                                <this.GroupCreate {...{
                                    groupSize,
                                    params: Extractor.params(params, i),
                                    setParams: Extractor.setParams(setParams, i)
                                }}/>
                            </Tabs.TabPane>
                        ) :
                        <Tabs.TabPane tab={lang.allGroup}>
                            <this.GroupCreate {...{
                                groupSize,
                                params: Extractor.params(params, 0),
                                setParams: Extractor.setParams(setParams)
                            }}/>
                        </Tabs.TabPane>
                }
            </Tabs>
        </div>;
    }
}