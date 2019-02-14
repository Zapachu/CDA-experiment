import {IGame} from '@common'
import {Schema, Document, model} from 'mongoose'

const {ObjectId, String} = Schema.Types

export interface GameDoc extends IGame, Document {
}

const GameSchema = new Schema({
    owner: {type: ObjectId, ref: 'User'},
    title: String,
    desc: String
})

export const GameModel = model<GameDoc>('ElfGame', GameSchema)