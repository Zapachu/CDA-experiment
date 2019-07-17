import * as React from 'react'
import {Core} from '@bespoke/register'
import {Extend, RANGE} from '@extend/share'
import {Col, Row, Slider, Spin, Tabs} from 'antd'
import {Label, Lang} from '@elf/component'
import {Inner} from './inner'

export class Create<ICreateParams, S = {}> extends Core.Create<Extend.ICreateParams<ICreateParams>, S> {
    InnerCreate: React.ComponentClass<Inner.ICreateProps<ICreateParams>, S>

    lang = Lang.extractLang({
        group: ['组', 'Extend.Inner.tsx'],
        groupSize: ['每组人数', 'GroupSize'],
        groupIndex: [i => `第${i + 1}组`, i => `Group ${i + 1}`]
    })

    componentDidMount(): void {
        const {props: {setParams}} = this
        const initParams: Extend.ICreateParams<ICreateParams> = {
            group: RANGE.group.max,
            groupSize: RANGE.groupSize.max,
            groupsParams: Array(RANGE.group.max).fill(null).map(() => ({} as any))
        }
        setParams(initParams)
    }

    render(): React.ReactNode {
        const {lang, props: {params: {group, groupSize, groupsParams}, setParams}} = this
        if (!groupsParams) {
            return <Spin/>
        }
        return <Row>
            <Row>
                <Col span={6} offset={6}>
                    <Label label={lang.group}/>
                    <Slider {...RANGE.group} value={group}
                            onChange={value => setParams({group: +value})}/>
                </Col>
                <Col span={6}>
                    <Label label={lang.groupSize}/>
                    <Slider {...RANGE.groupSize} value={groupSize}
                            onChange={value => setParams({groupSize: +value})}/>
                </Col>
            </Row>
            <Tabs>
                {
                    Array(group).fill(null).map((_, i) =>
                        <Tabs.TabPane forceRender={true} tab={lang.groupIndex(i)} key={i.toString()}>
                            <this.InnerCreate {...{
                                params: groupsParams[i],
                                setParams: (action: Partial<ICreateParams> | ((prevParams: ICreateParams) => Partial<ICreateParams>)) => {
                                    setParams((prevParams => {
                                        const groupsParams = prevParams.groupsParams.slice(),
                                            prevGroupParams = groupsParams[i]
                                        groupsParams[i] = {...prevGroupParams, ...typeof action === 'function' ? action(prevGroupParams) : action}
                                        return {groupsParams}
                                    }))
                                }
                            }}/>
                        </Tabs.TabPane>
                    )
                }
            </Tabs>
        </Row>
    }
}