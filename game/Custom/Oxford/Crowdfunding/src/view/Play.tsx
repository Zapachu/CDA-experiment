import * as React from 'react';
import * as Extend from '@extend/client';
import * as style from './style.scss';
import {Button, Card, Col, Input, InputNumber, Modal, Popover, Row} from 'antd';
import {
    Arm,
    commonProjectConfig,
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IProjectConfig,
    IPushParams,
    MoveType,
    PlayerStatus,
    projectConfigs,
    PushType,
    Treatment
} from '../config';
import {Toast} from '@elf/component';

function Project({name, readMore, threshold, payoff, index, arm, treatment, yourC, totalC, contribute, fundProbability, successRate}: IProjectConfig & { index: number, arm: Arm, treatment: Treatment, yourC: number, totalC: number, contribute: (c: number) => void }) {
    const [moreInfoModal, setMoreInfoModal] = React.useState(false),
        [contributeModal, setContributeModal] = React.useState(false),
        [c, setC] = React.useState();
    const [_threshold, _payoff] = arm === Arm.Arm1 ?
        [commonProjectConfig.threshold, commonProjectConfig.payoff] : [threshold, payoff];
    return <Popover content={{
        [Treatment.Baseline]: null,
        [Treatment.Statistics]: null,
        [Treatment.Probability]: <div className={style.projectPopover}>Probability to be funded : {fundProbability}</div>,
        [Treatment.Uncertainty]: <div className={style.projectPopover}>Success rate if funded : {successRate}%</div>
    }[treatment]} placement="bottom">
        <Card className={style.project}>
            <div className={style.head}>
                <h1>Project {index + 1}</h1>
                <h1>{name}</h1>
                <a onClick={() => setMoreInfoModal(true)}>Read More</a>
            </div>
            <h1>Threshold : {_threshold}</h1>
            <h1>Payoff : {_payoff}</h1>

            <h1>Your contribution : <em>{yourC}</em></h1>
            <h1>Total contribution : <em>{totalC}</em></h1>
            <div className={style.btnContributeWrapper}>
                <Button type='primary' disabled={!!yourC} onClick={() => setContributeModal(true)}>Contribute</Button>
            </div>

            <Modal visible={moreInfoModal} closable={false} footer={
                <Button type={'primary'} onClick={() => setMoreInfoModal(false)}>OK</Button>
            }>
                <h2>{name}</h2>
                <br/>
                <p style={{fontSize: '1.2rem'}}>{readMore}</p>
                <br/>
            </Modal>
            <Modal className={style.contributeModal} visible={contributeModal} closable={false} footer={
                <div>
                    <Button type={'danger'} onClick={() => setContributeModal(false)}>CANCEL</Button>
                    <Button type={'primary'} onClick={() => {
                        contribute(c);
                        setContributeModal(false);
                    }}>CONFIRM</Button>
                </div>
            }>
                <h2>Amount you want to contribute to Project :</h2>
                <div className={style.inputWrapper}>
                    <InputNumber value={c} onChange={v => setC(v)}/>
                </div>
                <br/>
            </Modal>
        </Card>
    </Popover>;
}

function Instruction({groupFrameEmitter, playerState}: Extend.Group.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    const [username, setUsername] = React.useState('');
    return <section className={style.instruction}>
        {
            playerState.username ? <>
                    <p>Your username : {playerState.username}</p>
                    <br/>
                    <Button type='primary' onClick={() => groupFrameEmitter.emit(MoveType.toContribute)}>
                        ToContribute
                    </Button>
                </> :
                <>
                    <Input placeholder='Username' value={username}
                           onChange={({target: {value}}) => setUsername(value)}/>
                    <br/>
                    <br/>
                    <Button type='primary' onClick={() => groupFrameEmitter.emit(MoveType.username, {username})}>
                        Submit
                    </Button>
                </>
        }
    </section>;
}

function Contribute({groupFrameEmitter, groupParams: {endowment}, groupGameState: {contribution}, playerState: {index, projectSort, arm, treatment}}: Extend.Group.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    const [helpModal, setHelpModal] = React.useState(false);
    const tokenLeft = endowment - contribution[index].reduce((m, n) => m + n, 0);
    return <section className={style.contribute}>
        <div className={style.tokenInfo}>
            Your tokens : {tokenLeft}
        </div>
        <Row className={style.projects}>
            {
                projectSort.map((p, i) => <Col span={8} style={{minWidth: '18rem'}}>
                    <Project {...projectConfigs[p]} {...{
                        index: i,
                        yourC: contribution[index][p],
                        totalC: contribution.map(c => c[p]).reduce((m, n) => m + n, 0),
                        arm,
                        treatment,
                        contribute: c => {
                            if (c > tokenLeft) {
                                return Toast.warn(`Contribute failed, you have only ${tokenLeft} tokens`);
                            } else {
                                groupFrameEmitter.emit(MoveType.contribute, {c, p},
                                    () => Toast.success(`Contribute ${c} tokens to ${projectConfigs[p].name}`));
                            }
                        }
                    }}/>
                </Col>)
            }
        </Row>
        <div className={style.btnGroup}>
            <Button.Group>
                <Button onClick={() => groupFrameEmitter.emit(MoveType.toInstruction)}>INSTRUCTION</Button>
                <Button onClick={() => setHelpModal(true)}>HELP</Button>
                <Button onClick={() => {
                    console.log(document.cookie);
                }
                }>LOGOUT</Button>
            </Button.Group>
        </div>
        <Modal visible={helpModal} closable={false} onOk={() => alert('TODO')} onCancel={() => setHelpModal(false)}>
            If you have any questions or comments about the experiment, please detail them below
            and click submit.
        </Modal>
    </section>;
}

class GroupPlay extends Extend.Group.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    render(): React.ReactNode {
        const {playerState: {projectSort, status}, groupGameState: {contribution}} = this.props;
        let content: JSX.Element = null;
        switch (status) {
            case PlayerStatus.instruction:
                content = <Instruction {...this.props}/>;
                break;
            case PlayerStatus.contribute:
                content = <Contribute {...this.props}/>;
                break;
        }
        return <section className={style.play}>
            {
                content
            }
        </section>;
    }
}

export class Play extends Extend.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupPlay = GroupPlay;
}