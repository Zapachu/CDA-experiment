import * as React from 'react'
import * as Extend from '@extend/client'
import {Label, Lang} from '@elf/component'
import {InputNumber} from 'antd'
import {ICreateParams} from '../config'

class GroupCreate extends Extend.Group.Create<ICreateParams> {
    lang = Lang.extractLang({
        round: ['轮次(r)', 'Round(r)'],
        oldPlayer: ['旧参与者(m)', 'OldPlayer(m)'],
        newPlayer: ['新参与者(n)', 'NewPlayer(n)'],
        minPrivateValue: ['最低心理价值(v1)', 'MinPrivateValue(v1)'],
        maxPrivateValue: ['最高心理价值(v2)', 'MaxPrivateValue(v2)'],
    })

    componentDidMount(): void {
        const {props: {setParams}} = this
        setParams({
            oldPlayer: 8,
            newPlayer: 8,
            minPrivateValue: 50,
            maxPrivateValue: 100
        })
    }

    render() {
        const {props: {params: {round, oldPlayer, newPlayer, minPrivateValue, maxPrivateValue}, setParams}, lang} = this
        return <div>
            <Label label={lang.round}/>
            <InputNumber value={round} onChange={v => setParams({round: +v})}/>
            <br/><br/>
            <Label label={lang.oldPlayer}/>
            <InputNumber value={oldPlayer} onChange={v => setParams({oldPlayer: +v})}/>
            <br/><br/>
            <Label label={lang.newPlayer}/>
            <InputNumber value={newPlayer} onChange={v => setParams({newPlayer: +v})}/>
            <br/><br/>
            <Label label={lang.minPrivateValue}/>
            <InputNumber value={minPrivateValue} onChange={v => setParams({minPrivateValue: +v})}/>
            <br/><br/>
            <Label label={lang.maxPrivateValue}/>
            <InputNumber value={maxPrivateValue} onChange={v => setParams({maxPrivateValue: +v})}/>
        </div>
    }
}

export class Create extends Extend.Create<ICreateParams> {
    GroupCreate = GroupCreate
}