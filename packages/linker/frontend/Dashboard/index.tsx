import * as React from 'react'
import { Fragment, FunctionComponent, useEffect, useState } from 'react'
import * as style from './style.scss'
import { Api, toV5, TPageProps } from '../util'
import { Lang } from '@elf/component'
import { RouteComponentProps } from 'react-router'
import { config, IGameWithId } from 'linker-share'
import { Button, List, Pagination } from 'antd'
import { AcademusRole } from '@elf/share'

const { Item: ListItem } = List,
  { Meta: ListItemMeta } = ListItem

export const Dashboard: FunctionComponent<RouteComponentProps & TPageProps> = ({ history, user }) => {
  if (user.role === AcademusRole.student) {
    toV5(config.academus.route.join)
    return null
  }
  const lang = Lang.extractLang({
    join: ['快速加入', 'Join']
  })
  const [count, setCount] = useState(0)
  const [gameList, setGameList] = useState<Array<IGameWithId>>([])
  useEffect(() => fetchPage(0), [])

  function fetchPage(page: number) {
    Api.getGameList(page).then(({ gameList, count }) => {
      setCount(count)
      setGameList(gameList)
    })
  }

  return (
    <section className={style.gameList}>
      <Button style={{ margin: '2rem' }} type="primary" onClick={() => toV5(config.academus.route.join)}>
        {lang.join}
      </Button>
      <List
        grid={{ gutter: 24, md: 3 }}
        dataSource={gameList}
        renderItem={({ id, title, desc }) => (
          <ListItem key={id}>
            <section className={style.gameItem} onClick={() => history.push(`/info/${id}`)}>
              <Fragment>
                <ListItemMeta title={title} description={desc.slice(0, 50) + (desc.length > 50 ? '...' : '')} />
              </Fragment>
            </section>
          </ListItem>
        )}
      ></List>
      <Pagination
        {...{
          total: count,
          pageSize: 11,
          onChange: page => fetchPage(page - 1),
          style: {
            textAlign: 'center'
          }
        }}
      />
    </section>
  )
}
