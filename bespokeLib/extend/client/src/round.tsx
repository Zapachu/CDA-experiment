import * as React from "react";
import { GroupDecorator, RoundDecorator } from "@extend/share";
import { Group } from "./group";
import { Core } from "@bespoke/client";
import { Button, InputNumber, Modal, Radio, Row, Spin, Tabs } from "antd";
import { Label, Lang, MaskLoading } from "@elf/component";
import * as style from "./style.scss";
import { FrameEmitter } from "@bespoke/share";

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
    RoundMoveType,
    PushType,
    IRoundMoveParams,
    IPushParams
  >
    extends Group.IPlayProps<
      RoundDecorator.ICreateParams<IRoundCreateParams>,
      RoundDecorator.IGameState<IRoundGameState>,
      RoundDecorator.IPlayerState<IRoundPlayerState>,
      RoundDecorator.TMoveType<RoundMoveType>,
      PushType,
      RoundDecorator.IMoveParams<IRoundMoveParams>,
      IPushParams
    > {
    roundParams: IRoundCreateParams;
    roundGameState: IRoundGameState;
    roundPlayerState: IRoundPlayerState;
    roundFrameEmitter: FrameEmitter<
      RoundMoveType,
      PushType,
      IRoundMoveParams,
      IPushParams
    >;
  }

  export interface IHistoryProps<
    IRoundCreateParams,
    IRoundGameState,
    IRoundPlayerState,
    RoundMoveType,
    PushType,
    IRoundMoveParams,
    IPushParams
  >
    extends Group.IPlayProps<
      RoundDecorator.ICreateParams<IRoundCreateParams>,
      RoundDecorator.IGameState<IRoundGameState>,
      RoundDecorator.IPlayerState<IRoundPlayerState>,
      RoundDecorator.TMoveType<RoundMoveType>,
      PushType,
      RoundDecorator.IMoveParams<IRoundMoveParams>,
      IPushParams
    > {}
}

export class Create<IRoundCreateParams, S = {}> extends Group.Create<
  RoundDecorator.ICreateParams<Core.TCreateParams<IRoundCreateParams>>,
  S
> {
  static readonly ROUND_RANGE = {
    min: 1,
    max: 12
  };

  RoundCreate: React.ComponentType<Round.ICreateProps<IRoundCreateParams>>;

  lang = Lang.extractLang({
    round: ["轮数", "Round"],
    roundConfiguration: ["每轮参数", "RoundConfiguration"],
    configAll: ["统一设置"],
    configIndependent: ["独立设置"],
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
      independentRound: false,
      roundsParams: Array(Create.ROUND_RANGE.max)
        .fill(null)
        .map(() => ({} as any))
    };
    setGroupParams(initParams);
  }

  render(): React.ReactNode {
    const { lang, props } = this,
      { groupParams, setGroupParams } = props;
    if (!groupParams.roundsParams) {
      return <Spin />;
    }
    return (
      <div>
        <Row>
          <Label label={lang.round} />
          <InputNumber
            {...Create.ROUND_RANGE}
            value={groupParams.round}
            onChange={value => setGroupParams({ round: +value })}
          />
          &nbsp;&nbsp;&nbsp;
          <Label label={lang.roundConfiguration} />
          <Radio.Group
            value={groupParams.independentRound}
            onChange={({ target: { value } }) =>
              setGroupParams({ independentRound: value })
            }
          >
            <Radio value={false}>{lang.configAll}</Radio>
            <Radio value={true}>{lang.configIndependent}</Radio>
          </Radio.Group>
        </Row>
        <br />
        <Tabs tabPosition="left">
          {groupParams.independentRound ? (
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

interface IPlayState {
  showHistoryModal: boolean;
}

function Empty() {
  return null;
}

export class Play<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams,
  S extends IPlayState = IPlayState
> extends Group.Play<
  RoundDecorator.ICreateParams<IRoundCreateParams>,
  RoundDecorator.IGameState<IRoundGameState>,
  RoundDecorator.IPlayerState<IRoundPlayerState>,
  RoundDecorator.TMoveType<RoundMoveType>,
  PushType,
  RoundDecorator.IMoveParams<IRoundMoveParams>,
  IPushParams,
  S
> {
  state = {
    showHistoryModal: false
  } as S;
  lang = Lang.extractLang({
    round1: ["第", "Round"],
    round2: ["轮", ""],
    start: ["开始", "Start"],
    wait4OtherPlayers: ["等待其它玩家加入......"],
    gameOver: ["所有轮次结束，等待老师关闭实验"],
    history: ["历史信息", "History"]
  });

  RoundPlay: React.ComponentType<
    Round.IPlayProps<
      IRoundCreateParams,
      IRoundGameState,
      IRoundPlayerState,
      RoundMoveType,
      PushType,
      IRoundMoveParams,
      IPushParams
    >
  > = Empty;

  RoundHistory: React.ComponentType<
    Round.IHistoryProps<
      IRoundCreateParams,
      IRoundGameState,
      IRoundPlayerState,
      RoundMoveType,
      PushType,
      IRoundMoveParams,
      IPushParams
    >
  > = Empty;

  RoundGuide: React.ComponentType = Empty;

  render(): React.ReactNode {
    const {
        lang,
        props,
        state: { showHistoryModal }
      } = this,
      {
        playerState,
        groupParams,
        groupGameState,
        groupFrameEmitter,
        game: {
          params: { showHistory }
        }
      } = props;
    if (playerState.status === RoundDecorator.PlayerStatus.guide) {
      return (
        <section className={style.groupGuide}>
          <div className={style.guideWrapper}>
            <this.RoundGuide />
          </div>
          <Button
            type="primary"
            onClick={() =>
              groupFrameEmitter.emit(RoundDecorator.MoveType.guideDone)
            }
          >
            {lang.start}
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
            key: round,
            roundParams,
            roundGameState,
            roundPlayerState,
            roundFrameEmitter: RoundDecorator.roundFrameEmitter(
              groupFrameEmitter,
              round
            )
          }}
        />
        {showHistory === GroupDecorator.ShowHistory.hide ||
        round === 0 ? null : (
          <div className={style.historyWrapper}>
            <Button onClick={() => this.setState({ showHistoryModal: true })}>
              {lang.history}
            </Button>
            <Modal
              footer={null}
              visible={showHistoryModal}
              width={"64rem"}
              onCancel={() => this.setState({ showHistoryModal: false })}
            >
              <br />
              <this.RoundHistory {...props} />
            </Modal>
          </div>
        )}
      </section>
    );
  }
}
