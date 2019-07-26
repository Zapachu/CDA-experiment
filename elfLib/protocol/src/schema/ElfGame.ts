import {Schema} from 'mongoose'

export const ElfGame = new Schema({
    owner: String,
    orgCode: String,
    title: String,
    desc: String,
    namespace: String,
    params: Object,
    createAt: {type: Date, default: Date.now}
}, {minimize: false})
