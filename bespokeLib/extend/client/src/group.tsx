import * as React from "react";
import { Core } from "@bespoke/client";
import { GroupDecorator } from "@extend/share";
import { Col, InputNumber, Row, Spin, Switch, Tabs, Tooltip } from "antd";
import { Label, Lang, MaskLoading } from "@elf/component";
import { FrameEmitter } from "@bespoke/share";

export namespace Group {
  export interface ICreateProps<IGroupCreateParams>
    extends Core.ICreateProps<
      GroupDecorator.ICreateParams<IGroupCreateParams>
    > {
    groupIndex?: number;
    groupParams: IGroupCreateParams;
    setGroupParams: Core.TSetCreateParams<IGroupCreateParams>;
  }

  export interface IPlayProps<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  >
    extends Core.IPlayProps<
      GroupDecorator.ICreateParams<IGroupCreateParams>,
      GroupDecorator.IGameState<IGroupGameState>,
      GroupDecorator.TPlayerState<IGroupPlayerState>,
      GroupDecorator.MoveType<MoveType>,
      PushType,
      GroupDecorator.IMoveParams<IMoveParams>,
      IPushParams
    > {
    groupParams: IGroupCreateParams;
    groupGameState: IGroupGameState;
    groupFrameEmitter: FrameEmitter<
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >;
  }

  export interface IPlay4OwnerProps<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  >
    extends Core.IPlay4OwnerProps<
      GroupDecorator.ICreateParams<IGroupCreateParams>,
      GroupDecorator.IGameState<IGroupGameState>,
      GroupDecorator.TPlayerState<IGroupPlayerState>,
      GroupDecorator.MoveType<MoveType>,
      PushType,
      IMoveParams,
      IPushParams
    > {
    groupParams: IGroupCreateParams;
    groupGameState: IGroupGameState;
    groupPlayerStates: GroupDecorator.TPlayerState<IGroupPlayerState>[];
    groupFrameEmitter: FrameEmitter<
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >;
  }

  export interface IResultProps<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState
  >
    extends Core.IResultProps<
      GroupDecorator.ICreateParams<IGroupCreateParams>,
      GroupDecorator.IGameState<IGroupGameState>,
      GroupDecorator.TPlayerState<IGroupPlayerState>
    > {
    groupParams: IGroupCreateParams;
    groupGameState: IGroupGameState;
  }

  export interface IResult4OwnerProps<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    MoveType,
    IMoveParams
  >
    extends Core.IResult4OwnerProps<
      IGroupCreateParams,
      IGroupGameState,
      IGroupPlayerState,
      MoveType,
      IMoveParams
    > {}

  export class Create<IGroupCreateParams, S = {}> extends React.Component<
    ICreateProps<IGroupCreateParams>,
    S
  > {}

  export class Play<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams,
    S = {}
  > extends React.Component<
    IPlayProps<
      IGroupCreateParams,
      IGroupGameState,
      IGroupPlayerState,
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >
  > {}

  export class Play4Owner<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams,
    S = {}
  > extends React.Component<
    IPlay4OwnerProps<
      IGroupCreateParams,
      IGroupGameState,
      IGroupPlayerState,
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >,
    S
  > {}

  export class Result<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    S = {}
  > extends React.Component<
    IResultProps<IGroupCreateParams, IGroupGameState, IGroupPlayerState>,
    S
  > {}

  export class Result4Owner<
    IGroupCreateParams,
    IGroupGameState,
    IGroupPlayerState,
    MoveType,
    IMoveParams,
    S = {}
  > extends React.Component<
    IResult4OwnerProps<
      IGroupCreateParams,
      IGroupGameState,
      IGroupPlayerState,
      MoveType,
      IMoveParams
    >
  > {}
}

interface ICreateState {
  independentGroup: boolean;
}

export class Create<
  IGroupCreateParams,
  S extends ICreateState = ICreateState
> extends Core.Create<
  GroupDecorator.ICreateParams<Core.TCreateParams<IGroupCreateParams>>,
  S
> {
  static readonly GROUP_RANGE = {
    min: 1,
    max: 12
  };
  static readonly GROUP_SIZE_RANGE = {
    min: 1,
    max: 12
  };

  GroupCreate: React.ComponentType<Group.ICreateProps<IGroupCreateParams>> =
    Group.Create;

  state: S = {
    independentGroup: false
  } as S;

  lang = Lang.extractLang({
    group: ["组", "Group"],
    groupSize: ["每组人数", "GroupSize"],
    independentGroup: ["每组单独配置", "Independent Group"],
    allGroup: ["所有组", "AllGroup"],
    groupIndex: [i => `第${i + 1}组`, i => `Group ${i + 1}`]
  });

  setParams<P>(
    setParams: Core.TSetCreateParams<GroupDecorator.ICreateParams<P>>,
    groupIndex?: number
  ): Core.TSetCreateParams<P> {
    return (action: React.SetStateAction<P>) =>
      setParams(prevParams => {
        const i = groupIndex || 0;
        const groupsParams = prevParams.groupsParams.slice(),
          prevGroupParams = groupsParams[i];
        groupsParams[i] = {
          ...prevGroupParams,
          ...(typeof action === "function"
            ? (action as (prevState: P) => P)(prevGroupParams)
            : action)
        };
        if (groupIndex === undefined) {
          for (let j = 0; j < groupsParams.length; j++) {
            groupsParams[j] = { ...groupsParams[0] };
          }
        }
        return { groupsParams };
      });
  }

  componentDidMount(): void {
    const {
      props: { setParams }
    } = this;
    const initParams: GroupDecorator.ICreateParams<IGroupCreateParams> = {
      group: ~~((Create.GROUP_RANGE.max + Create.GROUP_RANGE.min) >> 1),
      groupSize: ~~(
        (Create.GROUP_SIZE_RANGE.max + Create.GROUP_SIZE_RANGE.min) >>
        1
      ),
      groupsParams: Array(Create.GROUP_RANGE.max)
        .fill(null)
        .map(() => ({} as any))
    };
    setParams(initParams);
  }

  render(): React.ReactNode {
    const {
        lang,
        props,
        state: { independentGroup }
      } = this,
      { params, setParams } = props;
    if (!params.groupsParams) {
      return <Spin />;
    }
    return (
      <div>
        <Row>
          <Col span={12} offset={6}>
            <div>
              <Label label={lang.group} />
              <InputNumber
                {...Create.GROUP_RANGE}
                value={params.group}
                onChange={value => setParams({ group: +value })}
              />
            </div>
            <div>
              <Label label={lang.groupSize} />
              <InputNumber
                {...Create.GROUP_SIZE_RANGE}
                value={params.groupSize}
                onChange={value => setParams({ groupSize: +value })}
              />
            </div>
          </Col>
        </Row>
        <Tabs
          tabBarExtraContent={
            <Tooltip title={lang.independentGroup}>
              <Switch
                checked={independentGroup}
                onChange={independentGroup =>
                  this.setState({ independentGroup })
                }
              />
            </Tooltip>
          }
        >
          {independentGroup ? (
            Array(params.group)
              .fill(null)
              .map((_, i) => (
                <Tabs.TabPane
                  forceRender={true}
                  tab={lang.groupIndex(i)}
                  key={i.toString()}
                >
                  <this.GroupCreate
                    {...{
                      ...props,
                      groupIndex: i,
                      groupParams: params.groupsParams[i],
                      setGroupParams: this.setParams(setParams, i)
                    }}
                  />
                </Tabs.TabPane>
              ))
          ) : (
            <Tabs.TabPane tab={lang.allGroup}>
              <this.GroupCreate
                {...{
                  ...props,
                  groupParams: params.groupsParams[0],
                  setGroupParams: this.setParams(setParams)
                }}
              />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    );
  }
}

export class Play<
  IGroupCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  S = {}
> extends Core.Play<
  GroupDecorator.ICreateParams<IGroupCreateParams>,
  GroupDecorator.IGameState<IGroupGameState>,
  GroupDecorator.TPlayerState<IGroupPlayerState>,
  GroupDecorator.MoveType<MoveType>,
  PushType,
  GroupDecorator.IMoveParams<IMoveParams>,
  IPushParams,
  S
> {
  GroupPlay: React.ComponentType<
    Group.IPlayProps<
      IGroupCreateParams,
      IGroupGameState,
      IGroupPlayerState,
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >
  > = Group.Play;

  componentDidMount(): void {
    const {
      props: { frameEmitter }
    } = this;
    frameEmitter.emit(GroupDecorator.GroupMoveType.getGroup);
  }

  render(): React.ReactNode {
    const { props } = this,
      { game, playerState, gameState, frameEmitter } = props;
    if (playerState.groupIndex === undefined) {
      return <MaskLoading />;
    }
    const { groupIndex } = playerState;
    return (
      <this.GroupPlay
        {...props}
        {...{
          groupParams: game.params.groupsParams[groupIndex],
          groupGameState: gameState.groups[groupIndex].state,
          groupFrameEmitter: GroupDecorator.groupFrameEmitter(
            frameEmitter,
            groupIndex
          )
        }}
      />
    );
  }
}

export class Play4Owner<
  IGroupCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  S = {}
> extends Core.Play4Owner<
  GroupDecorator.ICreateParams<IGroupCreateParams>,
  GroupDecorator.IGameState<IGroupGameState>,
  GroupDecorator.TPlayerState<IGroupPlayerState>,
  GroupDecorator.MoveType<MoveType>,
  PushType,
  IMoveParams,
  IPushParams,
  S
> {
  GroupPlay4Owner: React.ComponentType<
    Group.IPlay4OwnerProps<
      IGroupCreateParams,
      IGroupGameState,
      IGroupPlayerState,
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >
  > = Group.Play4Owner;
  lang = Lang.extractLang({
    group: ["组", "Group"],
    groupSize: ["每组人数", "GroupSize"],
    groupIndex: [i => `第${i + 1}组`, i => `Group ${i + 1}`]
  });

  render(): React.ReactNode {
    const { lang, props } = this,
      { game, gameState, playerStates, frameEmitter } = props;
    return (
      <Tabs>
        {Array(game.params.group)
          .fill(null)
          .map((_, i) => (
            <Tabs.TabPane
              forceRender={true}
              tab={lang.groupIndex(i)}
              key={i.toString()}
            >
              <this.GroupPlay4Owner
                {...{
                  ...props,
                  groupParams: game.params.groupsParams[i],
                  groupGameState: gameState.groups[i].state,
                  groupPlayerStates: Object.values(playerStates).filter(
                    s => s.groupIndex === i
                  ),
                  groupFrameEmitter: GroupDecorator.groupFrameEmitter(
                    frameEmitter,
                    i
                  )
                }}
              />
            </Tabs.TabPane>
          ))}
      </Tabs>
    );
  }
}

export class Result<
  IGroupCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  S = {}
> extends Core.Result<
  GroupDecorator.ICreateParams<IGroupCreateParams>,
  GroupDecorator.IGameState<IGroupGameState>,
  GroupDecorator.TPlayerState<IGroupPlayerState>,
  S
> {
  GroupResult: React.ComponentType<
    Group.IResultProps<IGroupCreateParams, IGroupGameState, IGroupPlayerState>
  > = Group.Result;

  render(): React.ReactNode {
    const { props } = this,
      { game, playerState, gameState } = props;
    if (playerState.groupIndex === undefined) {
      return <MaskLoading />;
    }
    const { groupIndex } = playerState;
    return (
      <this.GroupResult
        {...{
          ...props,
          groupParams: game.params.groupsParams[groupIndex],
          groupGameState: gameState.groups[groupIndex].state
        }}
      />
    );
  }
}
