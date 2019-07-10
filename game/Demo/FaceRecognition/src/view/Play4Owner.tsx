import * as React from 'react'
import {Core} from '@bespoke/register'
import {Lang} from '@elf/component'
import {Table, Tag} from './Antd'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from '../config'

export function Play4Owner({playerStates}: Core.IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    const lang = Lang.extractLang({
        age: ['年龄', 'Age'],
        gender: ['性别', 'Gender'],
        emotion: ['情绪', 'Emotion']
    })
    return <Table dataSource={Object.entries(playerStates).map(([token, {result}]) =>
        ({
            key: token,
            ...result ? result.faceAttributes : {}
        })
    )} columns={[
        {
            title: lang.age,
            dataIndex: 'age',
            key: 'age'
        },
        {
            title: lang.gender,
            dataIndex: 'gender',
            key: 'gender'
        },
        {
            title: lang.emotion,
            dataIndex: 'emotion',
            key: 'emotion',
            render: emotion => <span>{
                Object.entries(emotion).sort(([, v1], [, v2]) => +v2 - +v1).map(
                    ([tag, v]) => v > .01 ?
                        <Tag color={v > .5 ? 'green' : v > .3 ? 'blue' : ''} key={tag}>{tag}[{v}]</Tag> : null
                )}
      </span>
        }
    ]}/>
}