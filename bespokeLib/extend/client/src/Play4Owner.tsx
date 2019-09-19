import * as React from 'react';
import {Extractor, Wrapper} from '@extend/share';
import {Core} from '@bespoke/client';
import {Group} from './group';
import {Tabs} from 'antd';
import {Lang} from '@elf/component';

export class Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
    extends Core.Play4Owner<Wrapper.ICreateParams<ICreateParams>, Wrapper.IGameState<IGameState>, Wrapper.TPlayerState<IPlayerState>, Wrapper.MoveType<MoveType>, PushType, IMoveParams, IPushParams, S> {
    GroupPlay4Owner: React.ComponentType<Group.IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> = Group.Play4Owner;
    lang = Lang.extractLang({
        group: ['组', 'Extend.Inner.tsx'],
        groupSize: ['每组人数', 'GroupSize'],
        groupIndex: [i => `第${i + 1}组`, i => `Group ${i + 1}`]
    });

    render(): React.ReactNode {
        const {lang, props} = this,
            {game, gameState, playerStates, frameEmitter} = props;
        return <Tabs>
            {
                Array(game.params.group).fill(null).map((_, i) =>
                    <Tabs.TabPane forceRender={true} tab={lang.groupIndex(i)} key={i.toString()}>
                        <this.GroupPlay4Owner {...{
                            ...props,
                            groupParams: game.params.groupsParams[i],
                            groupGameState: gameState.groups[i].state,
                            groupPlayerStates: Object.values(playerStates).filter(s => s.groupIndex === i),
                            groupFrameEmitter: Extractor.frameEmitter(frameEmitter, i),
                        }}/>
                    </Tabs.TabPane>
                )
            }
        </Tabs>;
    }
}
