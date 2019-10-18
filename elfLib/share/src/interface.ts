import {Actor} from './enum';

export interface IActor {
    token: string
    type: Actor
}

export interface IGameThumb {
    id: string
    namespace: string
    title: string
    createAt: number
}
