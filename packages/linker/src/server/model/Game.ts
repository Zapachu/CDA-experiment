import {IGame} from '@common'
import {Schema, Document, model} from 'mongoose'

const {String} = Schema.Types

export interface GameDoc extends IGame, Document {
}

const GameSchema = new Schema({
    owner: String,
    title: String,
    desc: String,
    phaseConfigs: Object,
    published: {type: Boolean, default: false},
    mode: String,
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
}, {minimize: false})

export const GameModel = model<GameDoc>('ElfGame', GameSchema)