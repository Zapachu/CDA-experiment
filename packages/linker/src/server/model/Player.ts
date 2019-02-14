import {IPlayer} from '@common'
import {Schema, Document, model} from 'mongoose'

const {ObjectId} = Schema.Types

export interface PlayerDoc extends IPlayer, Document {
}

const PlayerSchema = new Schema({
    userId: {type: ObjectId, ref: 'User'},
    groupId: {type: ObjectId, ref: 'ElfGroup'}
})

export const PlayerModel = model<PlayerDoc>('ElfPlayer', PlayerSchema)