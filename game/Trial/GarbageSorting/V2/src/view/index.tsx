import {registerOnFramework} from '@bespoke/client';
import {namespace} from '../config';
import * as React from 'react';
import {useEffect} from 'react';
import {loadScript} from '@elf/component';
import {TProps} from './Play/const';
import './style.scss';

function Play(props: TProps) {
    const [playing, setPlaying] = React.useState(true);
    useEffect(() => {
        loadScript(['https://cdnjs.cloudflare.com/ajax/libs/phaser/3.19.0/phaser.min.js'], () => {
            const {CONST} = require('./Play/const');
            CONST.props = props;
            CONST.overCallBack = () => setPlaying(false);
            require('./Play/index');
        });
    }, []);
    return playing ? <div style={{fontFamily: 'raster', height: '0', overflow: 'hidden'}}>
        Loading...
    </div> : <div>WAITING</div>;
}

registerOnFramework(namespace, {
    Play
});
