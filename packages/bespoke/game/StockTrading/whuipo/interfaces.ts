import { Document } from 'mongoose'
import {GameTypes, UserGameStatus} from './enums'

interface IDocument extends Document {
    updateAt: number;
    createAt: number;
}

export interface UserDoc extends IDocument {
    unionId: string,
    status: UserGameStatus,
    nowJoinedGame?: GameTypes,
    playerUrl?: string,
}