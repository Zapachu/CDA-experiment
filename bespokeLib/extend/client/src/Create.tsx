import * as React from 'react'
import {Core} from '@bespoke/client'
import {GroupRange, Wrapper} from '@extend/share'
import {Col, Row, Slider, Spin, Tabs} from 'antd'
import {Label, Lang} from '@elf/component'
import {Group} from './group'

namespace Extractor {
    export function params<P>(params: Core.TCreateParams<Wrapper.ICreateParams<P>>, groupIndex: number): Core.TCreateParams<P> {
        return params.groupsParams[groupIndex]
    }

    export function setParams<P>(setParams: Core.TSetCreateParams<Wrapper.ICreateParams<P>>, groupIndex: number): Core.TSetCreateParams<P> {
        return (action: React.SetStateAction<P>) =>
            setParams((prevParams => {
                const groupsParams = prevParams.groupsParams.slice(),
                    prevGroupParams = groupsParams[groupIndex]
                groupsParams[groupIndex] = {...prevGroupParams, ...typeof action === 'function' ? (action as (prevState: P) => P)(prevGroupParams) : action}
                return {groupsParams}
            }))
    }
}


export class Create<ICreateParams, S = {}> extends Core.Create<Wrapper.ICreateParams<Core.TCreateParams<ICreateParams>>, S> {
    GroupCreate: React.ComponentType<Group.ICreateProps<ICreateParams>> = Group.Create

    lang = Lang.extractLang({
        group: ['组', 'Extend.Inner.tsx'],
        groupSize: ['每组人数', 'GroupSize'],
        groupIndex: [i => `第${i + 1}组`, i => `Group ${i + 1}`]
    })

    componentDidMount(): void {
        const {props: {setParams}} = this
        const initParams: Wrapper.ICreateParams<ICreateParams> = {
            group: GroupRange.group.max,
            groupSize: GroupRange.groupSize.max,
            groupsParams: Array(GroupRange.group.max).fill(null).map(() => ({} as any))
        }
        setParams(initParams)
    }

    render(): React.ReactNode {
        const {lang, props: {params, setParams}} = this
        if (!params.groupsParams) {
            return <Spin/>
        }
        return <Row>
            <Row>
                <Col span={6} offset={6}>
                    <Label label={lang.group}/>
                    <Slider {...GroupRange.group} value={params.group}
                            onChange={value => setParams({group: +value})}/>
                </Col>
                <Col span={6}>
                    <Label label={lang.groupSize}/>
                    <Slider {...GroupRange.groupSize} value={params.groupSize}
                            onChange={value => setParams({groupSize: +value})}/>
                </Col>
            </Row>
            <Tabs>
                {
                    Array(params.group).fill(null).map((_, i) =>
                        <Tabs.TabPane forceRender={true} tab={lang.groupIndex(i)} key={i.toString()}>
                            <this.GroupCreate {...{
                                params: Extractor.params(params, i),
                                setParams: Extractor.setParams(setParams, i)
                            }}/>
                        </Tabs.TabPane>
                    )
                }
            </Tabs>
        </Row>
    }
}