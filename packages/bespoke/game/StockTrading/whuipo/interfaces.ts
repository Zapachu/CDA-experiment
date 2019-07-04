import { Document } from 'mongoose'
import {Phase} from '@bespoke-game/stock-trading-config'
interface IDocument extends Document {
    updateAt: number;
    createAt: number;
}

export interface UserDoc extends IDocument {
    unionId: string,
    unblockGamePhase?: Phase
}