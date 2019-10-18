import {registerOnFramework} from '@bespoke/client';
import {namespace} from '../config';
import * as React from 'react';
import {useEffect} from 'react';
import {loadScript} from '@elf/component';
import {TProps} from './Play/const';
import './style.scss';

function Play(props: TProps) {
    useEffect(() => {
        loadScript(['https://cdnjs.cloudflare.com/ajax/libs/phaser/3.19.0/phaser.min.js'], () => {
            require('./Play/const').CONST.props = props;
            require('./Play/index');
        });
    }, []);
    return <div style={{fontFamily: 'ArcadeClassic', height: '0',overflow:'hidden'}}>
        Loading...
    </div>;
}

registerOnFramework(namespace, {
    Play
});
