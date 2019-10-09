import * as React from 'react';
import * as Extend from '@extend/client';
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from '../config';
import {Lang} from '@elf/component';

class GroupPlay4Owner extends Extend.Group.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    lang = Lang.extractLang({
        roundIndex: [i => `第${i + 1}轮`, i => `Round ${i + 1}`],
        playerNo: ['玩家编号'],
        x: ['捕获量'],
        result: ['最终收益'],
    });

    render(): React.ReactNode {
        const {lang, props: {groupGameState}} = this;
        return null;
    }
}

export class Play4Owner extends Extend.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupPlay4Owner = GroupPlay4Owner;
}
