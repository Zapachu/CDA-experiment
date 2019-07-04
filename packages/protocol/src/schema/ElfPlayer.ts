import {Schema} from 'mongoose'

const {ObjectId, Number} = Schema.Types

export const ElfPlayer = new Schema({
    userId: {type: ObjectId, ref: 'User'},
    gameId: {type: ObjectId, ref: 'ElfGame'},
    reward: {type: Number, default: 0},
    createAt: {type: Date, default: Date.now}
})
