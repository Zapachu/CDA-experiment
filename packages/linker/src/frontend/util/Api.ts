import {config, IBaseGameWithId, IGameWithId, ILinkerActor, IUserWithId} from 'linker-share'
import {IHttpRes, BaseRequest} from '@elf/component'

export const Api = new class extends BaseRequest{
    buildUrl(path: string, params: {} = {}, query: {} = {}): string {
        return super.buildUrl(`/${config.rootName}/${config.apiPrefix}${path}`, params, query)
    }

    async getUser(): Promise<IHttpRes & { user: IUserWithId }> {
        return await this.get('/user')
    }

    async getBaseGame(gameId: string): Promise<IHttpRes & {
        game: IBaseGameWithId
    }> {
        return await this.get('/game/baseInfo/:gameId', {gameId})
    }

    async getGame(gameId: string): Promise<IHttpRes & {
        game: IGameWithId
    }> {
        return await this.get('/game/:gameId', {gameId})
    }

    async joinGameWithCode(code: string): Promise<IHttpRes & { gameId?: string }> {
        return await this.post('/game/joinWithShareCode', null, null, {code})
    }

    async joinGame(gameId: string): Promise<IHttpRes> {
        return await this.post('/game/join/:gameId', {gameId})
    }

    async getGameList(page: number = 0): Promise<IHttpRes & { gameList: Array<IGameWithId>, count: number }> {
        return await this.get('/game/list', {}, {page})
    }

    async getJsUrl(namespace:string): Promise<IHttpRes & { jsUrl: string }> {
        return await this.get('/game/jsUrl/:namespace',{namespace})
    }

    async postNewGame(title: string, desc: string, namespace: string, params: {}): Promise<IHttpRes & {
        gameId: string
    }> {
        return await this.post('/game/create', null, null, {
            title, desc, namespace, params
        })
    }

    async shareGame(gameId: string): Promise<IHttpRes & { shareCode: string, title: string }> {
        return await this.get('/game/share/:gameId', {gameId})
    }

    async getActor(gameId: string, token: string = ''): Promise<IHttpRes & { actor: ILinkerActor }> {
        return await this.get('/game/actor/:gameId', {gameId}, {token})
    }
}