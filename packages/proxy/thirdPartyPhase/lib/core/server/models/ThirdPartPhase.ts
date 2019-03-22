'use strict'

import {Schema, model} from 'mongoose'

const ThirdPartPhaseSchema = new Schema({
    groupId: String,            // elf player groupId
    namespace: String,          // elf namespace, ex: oTree, qualtrics, wjx
    param: String,              // oTree param
    playHash: [                 // third party game <=> elf player
        {
            result: String,
            hash: String,       // third party play url or hash
            player: String,     // elf player id
        }
    ],
    playUrl: String,            // play url
    ownerToken: String,         // token
})

export const ThirdPartPhase = model('ThirdPartPhase', ThirdPartPhaseSchema)
