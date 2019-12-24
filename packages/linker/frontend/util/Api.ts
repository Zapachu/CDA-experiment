import { config, IGameWithId, ILinkerActor, IUserWithId } from 'linker-share'
import { BaseRequest, IHttpRes } from '@elf/component'
import { IGameThumb } from '@elf/share'

export const Api = new (class extends BaseRequest {
  buildUrl(path: string, params: {} = {}, query: {} = {}): string {
    return super.buildUrl(`/${config.rootName}/${config.apiPrefix}${path}`, params, query)
  }

  async getUser(): Promise<IHttpRes & { user: IUserWithId }> {
    return await this.get('/user')
  }

  async getBaseGame(
    gameId: string
  ): Promise<
    IHttpRes & {
      game: IGameWithId
    }
  > {
    return await this.get('/game/baseInfo/:gameId', { gameId })
  }

  async joinGame(gameId: string): Promise<IHttpRes> {
    return await this.post('/game/join/:gameId', { gameId })
  }

  async getGame(
    gameId: string
  ): Promise<
    IHttpRes & {
      game: IGameWithId
    }
  > {
    return await this.get('/game/:gameId', { gameId })
  }

  async getHistoryGames(namespace: string): Promise<IHttpRes & { historyGameThumbs: Array<IGameThumb> }> {
    return await this.get('/game/historyThumb/:namespace', { namespace })
  }

  async getJsUrl(namespace: string): Promise<IHttpRes & { jsUrl: string }> {
    return await this.get('/game/jsUrl/:namespace', { namespace })
  }

  async postNewGame(
    title: string,
    desc: string,
    namespace: string,
    params: {}
  ): Promise<
    IHttpRes & {
      gameId: string
    }
  > {
    return await this.post('/game/create', null, null, {
      title,
      desc,
      namespace,
      params
    })
  }

  async getActor(gameId: string, token: string = ''): Promise<IHttpRes & { actor: ILinkerActor }> {
    return await this.get('/game/actor/:gameId', { gameId }, { token })
  }
})()
