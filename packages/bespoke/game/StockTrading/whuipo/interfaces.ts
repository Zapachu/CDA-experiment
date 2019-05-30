import { Document } from 'mongoose'
import {UserGameStatus} from './enums'
import {Phase} from 'bespoke-game-stock-trading-config'
interface IDocument extends Document {
    updateAt: number;
    createAt: number;
}

export interface UserDoc extends IDocument {
    unionId: string,
    status: UserGameStatus,
    nowJoinedGame?: Phase,
    playerUrl?: string,
    unblockGamePhase?: Phase
}