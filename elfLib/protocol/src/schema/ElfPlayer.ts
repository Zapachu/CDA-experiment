import {Schema} from 'mongoose'

const {ObjectId, Number} = Schema.Types

export const ElfPlayer = new Schema({
    userId: {type: ObjectId, ref: 'User'},
    gameId: {type: ObjectId, ref: 'ElfGame'},
    token: String,
    reward: {type: Number, default: 0},
    result: {
        type: Object, default: {
            uniKey: '',
            point: 0,
            detailIframeUrl: ''
        }
    },
    createAt: {type: Date, default: Date.now}
})
