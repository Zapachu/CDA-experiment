import * as React from 'react'
import {Core} from '@bespoke/register'
import {RANGE, Wrapper} from '@extend/share'
import {Col, Row, Slider, Spin, Tabs} from 'antd'
import {Label, Lang} from '@elf/component'
import {Group, TransProps} from './group'

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
            group: RANGE.group.max,
            groupSize: RANGE.groupSize.max,
            groupsParams: Array(RANGE.group.max).fill(null).map(() => ({} as any))
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
                    <Slider {...RANGE.group} value={params.group}
                            onChange={value => setParams({group: +value})}/>
                </Col>
                <Col span={6}>
                    <Label label={lang.groupSize}/>
                    <Slider {...RANGE.groupSize} value={params.groupSize}
                            onChange={value => setParams({groupSize: +value})}/>
                </Col>
            </Row>
            <Tabs>
                {
                    Array(params.group).fill(null).map((_, i) =>
                        <Tabs.TabPane forceRender={true} tab={lang.groupIndex(i)} key={i.toString()}>
                            <this.GroupCreate {...{
                                params: TransProps.params(params, i),
                                setParams: TransProps.setParams(setParams, i)
                            }}/>
                        </Tabs.TabPane>
                    )
                }
            </Tabs>
        </Row>
    }
}