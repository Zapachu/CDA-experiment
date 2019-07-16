import * as React from "react";
import { Input, Radio, Button } from "antd";
import * as style from "./style.scss";
import { Toast } from "@elf/component";
import { Core } from "@bespoke/register";
import {
  FetchRoute,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  namespace,
  PAGES,
  PushType,
  STATUS
} from "../config";

interface IPlayState {
  answer: string;
  key: string;
  name: string;
  timer: number;
}

const DURATION = 40;

export class Play extends Core.Play<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  IPlayState
> {
  private interval: NodeJS.Timer;
  constructor(props) {
    super(props);
    this.state = {
      answer: undefined,
      key: undefined,
      name: undefined,
      timer: DURATION
    };
  }

  componentDidMount = () => {
    this.ticking(this.state.timer);
  };

  ticking = (duration: number) => {
    clearInterval(this.interval);
    this.setState({ timer: duration });
    this.interval = setInterval(() => {
      if (this.state.timer > 0) {
        this.setState(({ timer }) => ({ timer: timer - 1 }));
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  renderContent = () => {
    const { playerState, frameEmitter } = this.props;
    const { answer, name, key, timer } = this.state;
    switch (playerState.status) {
      case STATUS.instruction: {
        return (
          <div className={style.stage}>
            <p>请回答以下五个情景题</p>
            <p>
              如果面对以下五个情景，你将会如何决定你自己和你未来组员的补贴方案呢？
            </p>
            <p>
              请注意：你未来的组员将会是随机匹配产生。你所遇到的情景也是随机选出，你的回答将决定你和你组员的真实补贴方案。换句话说，你的选择将可能成为现实，而你和你组员的补贴也会由此决定。
            </p>
            <p>
              同理，你未来组员也在做选择，他/她的回答也会在部分日期决定你和他/她的补贴方案。
            </p>
            <p>
              当你或者你组员的回答被用来决定小组的补贴方案，你们会被告知补贴方案不是由督导组指定、而是由你们自己的回答决定，但是不会告知因为哪位组员、哪个情景题而决定的。
            </p>
            <p>现在让我们做出选择吧！</p>
            <Button
              disabled={timer > 0}
              onClick={() => {
                frameEmitter.emit(MoveType.prepare);
                this.ticking(DURATION);
              }}
            >
              确定{timer > 0 ? `(${timer}s)` : ""}
            </Button>
          </div>
        );
      }
      case STATUS.playing: {
        const { answers } = playerState;
        const index = answers.length;
        return (
          <div className={style.stage}>
            {PAGES[index].instructions.map((word, i) => {
              return <p key={i}>{word}</p>;
            })}
            <p>
              <label>你的选择是：</label>
              <Radio.Group
                onChange={e => this.setState({ answer: e.target.value })}
                value={answer}
              >
                <Radio value={"A"}>A</Radio>
                <Radio value={"B"}>B</Radio>
              </Radio.Group>
            </p>
            <Button
              disabled={timer > 0}
              onClick={() => {
                if (!answer) {
                  return Toast.warn("请选择");
                }
                frameEmitter.emit(MoveType.shout, { answer, index }, error => {
                  Toast.warn(error);
                });
                this.setState({ answer: undefined });
                this.ticking(DURATION);
              }}
            >
              确定{timer > 0 ? `(${timer}s)` : ""}
            </Button>
          </div>
        );
      }
      case STATUS.info: {
        return (
          <div className={style.stage}>
            <div className={style.info}>
              <label>你的姓名是：</label>
              <Input
                value={name}
                onChange={e => this.setState({ name: e.target.value })}
              />
            </div>
            <div className={style.info}>
              <label>你的编号是（只填数字）：</label>
              <Input
                value={key}
                onChange={e => this.setState({ key: e.target.value })}
              />
            </div>
            <Button
              onClick={() => {
                if (!name || !key || Number.isNaN(+key)) {
                  return Toast.warn("请填写正确信息");
                }
                frameEmitter.emit(MoveType.info, { name, key }, error => {
                  Toast.warn(error);
                });
              }}
            >
              确定
            </Button>
          </div>
        );
      }
      case STATUS.end: {
        return (
          <div className={style.stage}>
            <p>
              感谢你的选择！我们将会在未来的部分日期根据你的选择安排你和你组员的补贴方案！
            </p>
          </div>
        );
      }
    }
  };

  render() {
    const content = this.renderContent();
    return <section className={style.play}>{content}</section>;
  }
}
