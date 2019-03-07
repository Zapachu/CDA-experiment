import {Schema, model} from 'mongoose'

const {ObjectId, Number} = Schema.Types

const ElfPlayerSchema = new Schema({
    userId: {type: ObjectId, ref: 'User'},
    gameId: {type: ObjectId, ref: 'ElfGame'},
    reward: {type: Number, default: 0}
})

export const ElfPlayerModel = model('ElfPlayer', ElfPlayerSchema)