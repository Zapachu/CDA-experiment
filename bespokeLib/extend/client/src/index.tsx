export * from './group';

import * as React from 'react';
import {Core} from '@bespoke/client';
import {GroupDecorator, GroupRange} from '@extend/share';
import {Col, Row, Slider, Spin, Switch, Tabs} from 'antd';
import {Label, Lang, MaskLoading} from '@elf/component';
import {Group} from './group';

interface ICreateState {
    independentGroup: boolean
}

export class Create<ICreateParams, S extends ICreateState = ICreateState> extends Core.Create<GroupDecorator.ICreateParams<Core.TCreateParams<ICreateParams>>, S> {
    GroupCreate: React.ComponentType<Group.ICreateProps<ICreateParams>> = Group.Create;

    state: S = {
        independentGroup: false
    } as S;

    lang = Lang.extractLang({
        group: ['组', 'Group'],
        groupSize: ['每组人数', 'GroupSize'],
        independentGroup: ['每组单独配置', 'Independent Group'],
        allGroup: ['所有组', 'AllGroup'],
        groupIndex: [i => `第${i + 1}组`, i => `Group ${i + 1}`]
    });

    setParams<P>(setParams: Core.TSetCreateParams<GroupDecorator.ICreateParams<P>>, groupIndex?: number): Core.TSetCreateParams<P> {
        return (action: React.SetStateAction<P>) =>
            setParams((prevParams => {
                const i = groupIndex || 0;
                const groupsParams = prevParams.groupsParams.slice(),
                    prevGroupParams = groupsParams[i];
                groupsParams[i] = {...prevGroupParams, ...typeof action === 'function' ? (action as (prevState: P) => P)(prevGroupParams) : action};
                if (groupIndex === undefined) {
                    for (let j = 0; j < groupsParams.length; j++) {
                        groupsParams[j] = {...groupsParams[0]};
                    }
                }
                return {groupsParams};
            }));
    }

    componentDidMount(): void {
        const {props: {setParams}} = this;
        const initParams: GroupDecorator.ICreateParams<ICreateParams> = {
            group: ~~(GroupRange.group.max + GroupRange.group.min >> 1),
            groupSize: ~~(GroupRange.groupSize.max + GroupRange.groupSize.min >> 1),
            groupsParams: Array(GroupRange.group.max).fill(null).map(() => ({} as any))
        };
        setParams(initParams);
    }

    render(): React.ReactNode {
        const {lang, props, state: {independentGroup}} = this,
            {params, setParams} = props;
        if (!params.groupsParams) {
            return <Spin/>;
        }
        return <div>
            <Row>
                <Col span={12} offset={6}>
                    <div>
                        <Label label={lang.group}/>
                        <Slider {...GroupRange.group} value={params.group}
                                onChange={value => setParams({group: +value})}/>
                    </div>
                    <div>
                        <Label label={lang.groupSize}/>
                        <Slider {...GroupRange.groupSize} value={params.groupSize}
                                onChange={value => setParams({groupSize: +value})}/>
                    </div>
                    <div style={{margin: '1.5rem'}}>
                        <Label label={lang.independentGroup}/>
                        <Switch checked={independentGroup}
                                onChange={independentGroup => this.setState({independentGroup})}/>
                    </div>
                </Col>
            </Row>
            <Tabs>
                {
                    independentGroup ? Array(params.group).fill(null).map((_, i) =>
                            <Tabs.TabPane forceRender={true} tab={lang.groupIndex(i)} key={i.toString()}>
                                <this.GroupCreate {...{
                                    ...props,
                                    groupIndex: i,
                                    groupParams: params.groupsParams[i],
                                    setGroupParams: this.setParams(setParams, i)
                                }}/>
                            </Tabs.TabPane>
                        ) :
                        <Tabs.TabPane tab={lang.allGroup}>
                            <this.GroupCreate {...{
                                ...props,
                                groupParams: params.groupsParams[0],
                                setGroupParams: this.setParams(setParams)
                            }}/>
                        </Tabs.TabPane>
                }
            </Tabs>
        </div>;
    }
}

export class Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
    extends Core.Play<GroupDecorator.ICreateParams<ICreateParams>, GroupDecorator.IGameState<IGameState>, GroupDecorator.TPlayerState<IPlayerState>, GroupDecorator.MoveType<MoveType>, PushType, GroupDecorator.IMoveParams<IMoveParams>, IPushParams, S> {
    GroupPlay: React.ComponentType<Group.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> = Group.Play;

    componentDidMount(): void {
        const {props: {frameEmitter}} = this;
        frameEmitter.emit(GroupDecorator.GroupMoveType.getGroup);
    }

    render(): React.ReactNode {
        const {props} = this,
            {game, playerState, gameState, frameEmitter} = props;
        if (playerState.groupIndex === undefined) {
            return <MaskLoading/>;
        }
        const {groupIndex} = playerState;
        return <this.GroupPlay {...{
            ...props,
            groupParams: game.params.groupsParams[groupIndex],
            groupGameState: gameState.groups[groupIndex].state,
            groupFrameEmitter: GroupDecorator.groupFrameEmitter(frameEmitter, groupIndex),
        }}/>;
    }
}

export class Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
    extends Core.Play4Owner<GroupDecorator.ICreateParams<ICreateParams>, GroupDecorator.IGameState<IGameState>, GroupDecorator.TPlayerState<IPlayerState>, GroupDecorator.MoveType<MoveType>, PushType, IMoveParams, IPushParams, S> {
    GroupPlay4Owner: React.ComponentType<Group.IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> = Group.Play4Owner;
    lang = Lang.extractLang({
        group: ['组', 'Group'],
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
                            groupFrameEmitter: GroupDecorator.groupFrameEmitter(frameEmitter, i),
                        }}/>
                    </Tabs.TabPane>
                )
            }
        </Tabs>;
    }
}

export class Result<ICreateParams, IGameState, IPlayerState, S = {}>
    extends Core.Result<GroupDecorator.ICreateParams<ICreateParams>, GroupDecorator.IGameState<IGameState>, GroupDecorator.TPlayerState<IPlayerState>, S> {
    GroupResult: React.ComponentType<Group.IResultProps<ICreateParams, IGameState, IPlayerState>> = Group.Result;

    render(): React.ReactNode {
        const {props} = this,
            {game, playerState, gameState} = props;
        if (playerState.groupIndex === undefined) {
            return <MaskLoading/>;
        }
        const {groupIndex} = playerState;
        return <this.GroupResult {...{
            ...props,
            groupParams: game.params.groupsParams[groupIndex],
            groupGameState: gameState.groups[groupIndex].state,
        }}/>;
    }
}
