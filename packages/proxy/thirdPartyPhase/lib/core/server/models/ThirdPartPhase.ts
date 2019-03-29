'use strict'

import {Schema, model, Document} from 'mongoose'

interface PlayHash extends Document{
    result: string;
    hash: string;
    player: string;
    screen: string;
}

interface IThirdPartPhaseSchema extends Document{
    groupId: string;
    namespace: string;
    param: string;
    playHash: Array<PlayHash>;
    playerUrl: string;
    ownerToken: string;
}

const ThirdPartPhaseSchema = new Schema({
    groupId: String,            // elf player groupId
    namespace: String,          // elf namespace, ex: oTree, qualtrics, wjx
    param: String,              // oTree param
    playHash: [                 // third party game <=> elf player
        {
            hash: String,       // third party play url or hash
            player: String,     // elf player id
            screen: String,     // player's equipment of screen report
            result: String,     // player's score
        }
    ],
    playUrl: String,            // play url
    ownerToken: String,         // token
})

export const ThirdPartPhase = model<IThirdPartPhaseSchema>('ThirdPartPhase', ThirdPartPhaseSchema)
