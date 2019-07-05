import React, {Fragment, FunctionComponent, useEffect, useState} from 'react'
import * as style from './style.scss'
import {Api, Lang} from '@client-util'
import {RouteComponentProps} from 'react-router'
import {baseEnum, IGameWithId, IUserWithId} from '@common'
import {List, Pagination} from '@antd-component'
import {Breadcrumb} from '@client-component'

const {Item: ListItem} = List, {Meta: ListItemMeta} = ListItem

export const GameList: FunctionComponent<RouteComponentProps & { user: IUserWithId }> = ({history, user}) => {
    if (user.role === baseEnum.AcademusRole.student) {
        history.push('/join')
        return null
    }
    const lang = Lang.extractLang({
        join: ['快速加入', 'Join'],
        title: ['标题', 'Title'],
        desc: ['详情', 'Description'],
        cancel: ['取消', 'Cancel'],
        submit: ['提交', 'Submit'],
        published: ['已发布', 'Published'],
        unpublished: ['未发布', 'Unpublished']
    })
    const [count, setCount] = useState(0)
    const [gameList, setGameList] = useState<Array<IGameWithId>>([])
    useEffect(() => fetchPage(0), [])

    function fetchPage(page: number) {
        Api.getGameList(page).then(({gameList, count}) => {
            setCount(count)
            setGameList(gameList)
        })
    }

    return <section className={style.gameList}>
        <Breadcrumb history={history} links={[
            {label: lang.join, to: `/join`}
        ]}/>
        <List
            grid={{gutter: 24, xl: 4, md: 3, sm: 2, xs: 1}}
            dataSource={gameList}
            renderItem={({id, title, desc, published}) => <ListItem key={id}>
                <section
                    className={style.gameItem}
                    onClick={() => history.push(id ? `/info/${id}` : '/baseInfo')}>
                    <Fragment>
                        <ListItemMeta title={title}
                                      description={desc.slice(0, 50) + (desc.length > 50 ? '...' : '')}/>
                        <label style={{color: published ? 'green' : ''}}>{
                            published ? lang.published : lang.unpublished
                        }</label>
                    </Fragment>
                </section>
            </ListItem>}>
        </List>
        <Pagination {...{
            total: count,
            pageSize: 11,
            onChange: page => fetchPage(page - 1),
            style: {
                textAlign: 'center'
            }
        }}/>
    </section>
}
