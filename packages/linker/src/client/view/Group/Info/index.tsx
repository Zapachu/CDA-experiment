import * as React from 'react'
import * as style from './style.scss'
import {IBaseGroupWithId, baseEnum} from '@common'
import {Api, connCtx, Lang} from '@client-util'
import {RouteComponentProps} from 'react-router'
import {Button, Card, message} from '@antd-component'
import {rootContext, TRootContext} from '@client-context'
import {Breadcrumb, Loading} from '@client-component'
import {AcademusRole} from '../../../../common/baseEnum'

declare interface IInfoState {
    loading: boolean
    group?: IBaseGroupWithId
}

@connCtx(rootContext)
export class Info extends React.Component<TRootContext & RouteComponentProps<{ groupId: string }>, IInfoState> {
    lang = Lang.extractLang({
        back2Game: ['返回实验', 'Back to game'],
        enterPlayRoom: ['进入实验', 'Enter play room'],
        joinGroup: ['加入实验', 'Join Game'],
        joinSuccess: ['加入成功，即将进入实验房间', 'Join success, enter to play room now']
    })

    state: IInfoState = {
        loading: true
    }

    async componentDidMount() {
        const {props: {match: {params: {groupId}}}} = this
        const {group} = await Api.getBaseGroup(groupId)
        this.setState({
            loading: false,
            group
        })
    }

    render(): React.ReactNode {
        const {lang, props: {history, user}, state: {loading, group}} = this
        if (loading || !user) {
            return <Loading/>
        }
        const btn4Teacher = <Button
                type={'primary'}
                onClick={() => history.push(`/group/play/${group.id}`)}>{lang.enterPlayRoom}</Button>,
            btn4Student = <Button
                type={'primary'}
                onClick={async () => {
                    const {code} = await Api.joinGroup(group.id)
                    if (code === baseEnum.ResponseCode.success) {
                        await message.success(lang.joinSuccess)
                        history.push(`/group/play/${group.id}`)
                    }
                }}>{lang.joinGroup}</Button>
        return <section className={style.groupInfo}>
            <Breadcrumb history={history} links={user.role === AcademusRole.teacher ? [
                {label: lang.back2Game, to: `/game/info/${group.gameId}`}
            ] : []}/>
            <Card title={group.title}>
                {group.desc}
            </Card>
            <div className={style.buttonWrapper}>
                {
                    user.role === AcademusRole.teacher ? btn4Teacher : btn4Student
                }
            </div>
        </section>
    }
}