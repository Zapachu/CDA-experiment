import * as React from 'react'
import * as style from './style.scss'
import { IGameWithId } from '@bespoke/share'
import { Lang } from '@elf/component'
import { Api, TPageProps } from '../util'
import { Button, Input } from 'antd'

export function Configuration({
  history,
  match: {
    params: { gameId }
  },
  gameTemplate: { Create }
}: TPageProps) {
  const lang = Lang.extractLang({
    title: ['实验标题', 'Game Title'],
    playRoom: ['返回游戏', 'BACK TO GAME']
  })
  const [game, setGame] = React.useState(null as IGameWithId<any>)
  React.useEffect(() => {
    Api.getGame(gameId).then(({ game }) => setGame(game))
  }, [])
  return game ? (
    <section className={style.configuration}>
      <div className={style.titleWrapper}>
        <Input size="large" value={game.title} placeholder={lang.title} onChange={() => null} />
      </div>
      <Create
        {...{
          submitable: true,
          params: game.params,
          setSubmitable: () => null,
          setParams: () => null
        }}
      />
      <div className={style.backBtnWrapper}>
        <Button type="primary" onClick={() => history.push(`/play/${gameId}`)}>
          {lang.playRoom}
        </Button>
      </div>
    </section>
  ) : null
}
