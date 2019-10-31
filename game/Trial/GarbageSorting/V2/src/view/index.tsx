import {registerOnFramework} from '@bespoke/client';
import {namespace} from '../config';
import * as React from 'react';
import {useEffect} from 'react';
import {loadScript} from '@elf/component';
import {CONST, TProps} from './Play/const';
import * as style from './style.scss';

function PlayStage() {
    useEffect(() => {
        loadScript(['https://cdnjs.cloudflare.com/ajax/libs/phaser/3.19.0/phaser.min.js'], () =>
            require('./Play/index')
        );
    }, []);
    return <div style={{fontFamily: 'raster', height: '0', overflow: 'hidden'}}>&nbsp;</div>;
}

function ResultStage({gameState: {env}}: TProps) {
    return <section className={style.result}>
        <h1>{env}</h1>
        <p>等待其它玩家，实验将在30s内结束</p>
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
