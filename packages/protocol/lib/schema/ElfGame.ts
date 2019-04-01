import {Schema} from 'mongoose'

export const ElfGame = new Schema({
    owner: String,
    orgCode: String,
    title: String,
    desc: String,
    phaseConfigs: Object,
    published: {type: Boolean, default: false},
    mode: String,
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
}, {minimize: false})
