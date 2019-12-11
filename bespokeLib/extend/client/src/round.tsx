import * as React from "react";
import { RoundDecorator } from "@extend/share";
import { Group } from "./group";
import { Core } from "@bespoke/client";
import {
  Button,
  Col,
  InputNumber,
  Row,
  Spin,
  Switch,
  Tabs,
  Tooltip
} from "antd";
import { Label, Lang, MaskLoading } from "@elf/component";
import * as style from "./style.scss";

export namespace Round {
  export interface ICreateProps<IRoundCreateParams>
    extends Group.ICreateProps<
      RoundDecorator.ICreateParams<IRoundCreateParams>
    > {
    roundIndex?: number;
    roundParams: IRoundCreateParams;
    setRoundParams: Core.TSetCreateParams<IRoundCreateParams>;
  }

  export interface IPlayProps<
    IRoundCreateParams,
    IRoundGameState,
    IRoundPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  >
    extends Group.IPlayProps<
      RoundDecorator.ICreateParams<IRoundCreateParams>,
      RoundDecorator.IGameState<IRoundGameState>,
      RoundDecorator.IPlayerState<IRoundPlayerState>,
      RoundDecorator.MoveType<MoveType>,
      PushType,
      IMoveParams,
      IPushParams
    > {
    roundParams: IRoundCreateParams;
    roundGameState: IRoundGameState;
    roundPlayerState: IRoundPlayerState;
  }

  export class Create<IRoundCreateParams, S = {}> extends React.Component<
    ICreateProps<IRoundCreateParams>,
    S
  > {}

  export class Play<
    IRoundCreateParams,
    IRoundGameState,
    IRoundPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams,
    S = {}
  > extends React.Component<
    IPlayProps<
      IRoundCreateParams,
      IRoundGameState,
      IRoundPlayerState,
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >
  > {}
}

interface ICreateState {
  independentRound: boolean;
}

export class Create<
  IRoundCreateParams,
  S extends ICreateState = ICreateState
> extends Group.Create<
  RoundDecorator.ICreateParams<Core.TCreateParams<IRoundCreateParams>>,
  S
> {
  static readonly ROUND_RANGE = {
    min: 1,
    max: 12
  };
  static readonly ROUND_TIME_RANGE = {
    min: 60,
    max: 120
  };

  RoundCreate: React.ComponentType<Round.ICreateProps<IRoundCreateParams>> =
    Round.Create;

  state: S = {
    independentRound: false
  } as S;

  lang = Lang.extractLang({
    round: ["轮", "Round"],
    roundTime: ["每轮时长", "RoundTime"],
    independentRound: ["每轮单独配置", "Independent Round"],
    allRound: ["所有轮", "AllRound"],
    roundIndex: [i => `第${i + 1}轮`, i => `Round ${i + 1}`]
  });

  setParams<P>(
    setParams: Core.TSetCreateParams<RoundDecorator.ICreateParams<P>>,
    roundIndex?: number
  ): Core.TSetCreateParams<P> {
    return (action: React.SetStateAction<P>) =>
      setParams(prevParams => {
        const i = roundIndex || 0;
        const roundsParams = prevParams.roundsParams.slice(),
          prevRoundParams = roundsParams[i];
        roundsParams[i] = {
          ...prevRoundParams,
          ...(typeof action === "function"
            ? (action as (prevState: P) => P)(prevRoundParams)
            : action)
        };
        if (roundIndex === undefined) {
          for (let j = 0; j < roundsParams.length; j++) {
            roundsParams[j] = { ...roundsParams[0] };
          }
        }
        return { roundsParams };
      });
  }

  componentDidMount(): void {
    const {
      props: { groupParams, setGroupParams }
    } = this;
    if (groupParams.roundsParams) {
      return;
    }
    const initParams: RoundDecorator.ICreateParams<IRoundCreateParams> = {
      round: ~~((Create.ROUND_RANGE.max + Create.ROUND_RANGE.min) >> 1),
      roundTime: ~~(
        (Create.ROUND_TIME_RANGE.max + Create.ROUND_TIME_RANGE.min) >>
        1
      ),
      roundsParams: Array(Create.ROUND_RANGE.max)
        .fill(null)
        .map(() => ({} as any))
    };
    setGroupParams(initParams);
  }

  render(): React.ReactNode {
    const {
        lang,
        props,
        state: { independentRound }
      } = this,
      { groupParams, setGroupParams } = props;
    if (!groupParams.roundsParams) {
      return <Spin />;
    }
    return (
      <div>
        <Row>
          <Col span={12} offset={6}>
            <div>
              <Label label={lang.round} />
              <InputNumber
                {...Create.ROUND_RANGE}
                value={groupParams.round}
                onChange={value => setGroupParams({ round: +value })}
              />
            </div>
            <div>
              <Label label={lang.roundTime} />
              <InputNumber
                {...Create.ROUND_TIME_RANGE}
                value={groupParams.roundTime}
                onChange={value => setGroupParams({ roundTime: +value })}
              />
            </div>
          </Col>
        </Row>
        <Tabs
          tabPosition="left"
          tabBarExtraContent={
            <Tooltip title={lang.independentRound}>
              <Switch
                checked={independentRound}
                onChange={independentRound =>
                  this.setState({ independentRound })
                }
              />
            </Tooltip>
          }
        >
          {independentRound ? (
            Array(groupParams.round)
              .fill(null)
              .map((_, i) => (
                <Tabs.TabPane
                  forceRender={true}
                  tab={lang.roundIndex(i)}
                  key={i.toString()}
                >
                  <this.RoundCreate
                    {...{
                      ...props,
                      roundIndex: i,
                      roundParams: groupParams.roundsParams[i],
                      setRoundParams: this.setParams(setGroupParams, i)
                    }}
                  />
                </Tabs.TabPane>
              ))
          ) : (
            <Tabs.TabPane tab={lang.allRound}>
              <this.RoundCreate
                {...{
                  ...props,
                  roundParams: groupParams.roundsParams[0],
                  setRoundParams: this.setParams(setGroupParams)
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
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  S = {}
> extends Group.Play<
  RoundDecorator.ICreateParams<IRoundCreateParams>,
  RoundDecorator.IGameState<IRoundGameState>,
  RoundDecorator.IPlayerState<IRoundPlayerState>,
  RoundDecorator.MoveType<MoveType>,
  PushType,
  IMoveParams,
  IPushParams,
  S
> {
  RoundPlay: React.ComponentType<
    Round.IPlayProps<
      IRoundCreateParams,
      IRoundGameState,
      IRoundPlayerState,
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >
  > = Round.Play;

  lang = Lang.extractLang({
    round1: ["第", "Round"],
    round2: ["轮", ""],
    wait4OtherPlayers: ["等待其它玩家加入......"],
    gameOver: ["所有轮次结束，等待老师关闭实验"]
  });

  render(): React.ReactNode {
    const { lang, props } = this,
      { playerState, groupParams, groupGameState, groupFrameEmitter } = props;
    if (playerState.status === RoundDecorator.PlayerStatus.guide) {
      return (
        <section className={style.groupGuide}>
          <Button
            type="primary"
            onClick={() =>
              groupFrameEmitter.emit(RoundDecorator.RoundMoveType.guideDone)
            }
          >
            Start
          </Button>
        </section>
      );
    }
    if (playerState.status === RoundDecorator.PlayerStatus.result) {
      return <section className={style.groupResult}>{lang.gameOver}</section>;
    }
    const { round } = groupGameState,
      roundParams = groupParams.roundsParams[round],
      roundPlayerState = playerState.rounds[round],
      roundGameState = groupGameState.rounds[round];
    if (!roundPlayerState) {
      return <MaskLoading label={lang.wait4OtherPlayers} />;
    }
    return (
      <section className={style.groupPlay}>
        <h2 className={style.title}>
          {lang.round1}
          {round + 1}
          {lang.round2}
        </h2>
        <this.RoundPlay
          {...props}
          {...{
            roundParams,
            roundGameState,
            roundPlayerState
          }}
        />
      </section>
    );
  }
}
