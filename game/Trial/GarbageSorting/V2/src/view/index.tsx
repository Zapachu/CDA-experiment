import {registerOnFramework} from '@bespoke/client';
import {GarbageConfig, GarbageType, namespace} from '../config';
import * as React from 'react';
import {useEffect} from 'react';
import {loadScript} from '@elf/component';
import {CONST, TProps} from './Play/const';
import * as style from './style.scss';

enum Color {
    red = '#e27b6a',
    golden = '#ffb517',
    green = '#43be42'
}

function hslToRgb(h: number, s: number, l: number) {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;

    function hue2rgb(t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    return [Math.round(hue2rgb(h + 1 / 3) * 255), Math.round(hue2rgb(h) * 255), Math.round(hue2rgb(h - 1 / 3) * 255)];
}

function PlayStage() {
    useEffect(() => {
        loadScript(['https://cdnjs.cloudflare.com/ajax/libs/phaser/3.19.0/phaser.min.js'], () =>
            require('./Play/index')
        );
    }, []);
    return <div id={CONST.phaserParent} style={{fontFamily: 'raster', position: 'fixed', top: '0'}}/>;
}

interface IRowData {
    playerIndex: number
    rightAmount: number
    skipAmount: number
    life: number
    score: number
    rank?: number
}

function ResultStage({gameState: {env, sorts}, playerState}: TProps) {
    const [showPrinciple, setShowPrinciple] = React.useState(false);
    let myData: IRowData = null;
    const rowData: IRowData[] = sorts.map((sort, playerIndex) => {
        const rightAmount = sort.filter((t, i) => t === GarbageConfig[i].type).length,
            skipAmount = sort.filter((t, i) => t === GarbageType.skip).length,
            life = CONST.maxLife - CONST.sortCost * sort.filter((t, i) => t !== undefined).length,
            envProfit = ~~(env / CONST.groupSize),
            score = life + rightAmount * CONST.rightScore + (GarbageConfig.length - rightAmount - skipAmount) * CONST.wrongScore + envProfit;
        return {
            playerIndex,
            rightAmount,
            skipAmount,
            life,
            score,
        };
    }).sort((r1, r2) => r2.score - r1.score).map((data, rank) => {
        const d = {...data, rank};
        if (data.playerIndex === playerState.index) {
            myData = d;
        }
        return d;
    });
    const [r, g, b] = hslToRgb(.12 * env / 360, .8, .43), color = `rgb(${r},${g},${b})`;
    let envLevelLabel: string = '良好';
    if (env < CONST.maxEnv / 3) {
        envLevelLabel = '严重';
    }else if (env < CONST.maxEnv * 2 / 3) {
        envLevelLabel = '较轻';
    }
    let maxLife = 0;
    rowData.forEach(({life}) => life > maxLife ? maxLife = life : null);
    const d = (CONST.maxEnv - env) / CONST.maxEnv * Math.PI, w = 16,
        time2End = ~~(maxLife / CONST.sortCost * CONST.sortSeconds);
    return <section className={style.result}>
        <div className={style.envWrapper}>
            <svg height='200' viewBox='0,0,400,200'>
                <path d="M100 150 A 100 100 0 0 1 300 150" fill="transparent" strokeWidth={w} strokeLinecap="round"
                      stroke="#d3d3d3"/>
                <path d={`M100 150 A 100 100 0 0 1 ${200 + 100 * Math.cos(d)} ${150 - 100 * Math.sin(d)}`}
                      fill="transparent" strokeWidth={w} strokeLinecap="round"
                      stroke={color}/>
                <text x="200" y="130" font-family='raster' font-size="40" fill={color} text-anchor="middle">{env}</text>
                <text x="200" y="190" fill="#666" text-anchor="middle">等待其它玩家，实验将在&nbsp;{time2End}s&nbsp;内结束</text>
            </svg>
        </div>
        <ul className={style.mainInfo}>
            <li>
                <span style={{color}}>{envLevelLabel}</span>
                <label>污染程度</label>
            </li>
            <li>
                <span style={{color: Color.golden}}>5</span>
                <label>环境排名</label>
            </li>
            <li>
                <span style={{color: Color.golden}}>{myData.score}</span>
                <label>我的得分</label>
            </li>
        </ul>
        <hr/>
        <table className={style.playerTable}>
            <tbody>
            <tr>
                <th>排名</th>
                <th>用户</th>
                <th>正确分类</th>
                <th>随手乱扔</th>
                <th>剩余体力</th>
                <th>得分</th>
            </tr>
            {
                [myData, ...rowData].map(({rank, playerIndex, rightAmount, skipAmount, life, score}) => <tr>
                    <td><span className={rank < 3 ? style.medal : null}
                              style={{backgroundPositionX: rank * -19}}>{rank + 1}</span></td>
                    <td className={style.avatar}>
                        <img src={'https://qiniu1.anlint.com/img/head.jpg'}/>
                        <span>{playerIndex === playerState.index ? '你' : `玩家${playerIndex + 1}`}</span>
                    </td>
                    <td>{rightAmount}</td>
                    <td>{skipAmount}</td>
                    <td>{life}</td>
                    <td>{score}</td>
                </tr>)
            }
            </tbody>
        </table>
        <div style={{height: '5rem'}}></div>
        <div className={style.btnWrapper}>
            <button onClick={() => setShowPrinciple(true)}>实验原理</button>
            <button>分享</button>
        </div>
        {
            showPrinciple ? <section className={style.principle}>
                <div className={style.qrCodeWrapper}>
                    <img src={require('./asset/qrCode.png')}/>
                    <p>长按识别二维码并关注公众号 可获知实验原理--<em>公地悲剧</em></p>
                </div>
                <img className={style.btnClose} src={require('./asset/close.png')}
                     onClick={() => setShowPrinciple(false)}/>
            </section> : null
        }
    </section>;
}

function Play(props: TProps) {
    const [playing, setPlaying] = React.useState(true);
    useEffect(() => {
        CONST.emitter = props.frameEmitter;
        CONST.overCallBack = () => setPlaying(false);
    }, []);
    return playing ? <PlayStage/> : <ResultStage {...props}/>;
}

registerOnFramework(namespace, {
    Play
});
