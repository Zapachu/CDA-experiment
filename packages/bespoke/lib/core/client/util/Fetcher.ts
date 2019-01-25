import {buildUrl} from '@common'
import {Api} from './request'

export class Fetcher<FetchType> {
    constructor(private namespace: string, private gameId?: string) {
    }

    buildGetUrl(type: FetchType, params = {}): string {
        return buildUrl('/game/pass2Game/:gameId', {gameId: this.gameId}, {type, ...params})
    }

    getFromGame(type: FetchType, params = {}) {
        return Api.getFromeGame(this.gameId, type.toString(), params)
    }

    postToGame(type: FetchType, params = {}) {
        return Api.postToGame(this.gameId, type.toString(), params)
    }

    getFromNamespace(type: FetchType, params = {}) {
        return Api.getFromNamespace(this.namespace, type.toString(), params)
    }

    postToNamespace(type: FetchType, params = {}) {
        return Api.postToNamespace(this.namespace, type.toString(), params)
    }
}
