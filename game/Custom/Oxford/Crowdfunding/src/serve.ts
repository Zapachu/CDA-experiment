import {Response, Router} from 'express';
import {resolve} from 'path';
import {elfSetting} from '@elf/setting';
import {ResponseCode, Server} from '@bespoke/server';
import {Logic} from './Logic';
import {FetchRoute, namespace} from './config';

const router = Router()
    .get(FetchRoute.logout, async (req: any, res: Response) => {
        res.clearCookie(elfSetting.sessionName);
        return res.json({
            code: ResponseCode.success
        });
    });

Server.start(namespace, Logic, resolve(__dirname, '../dist'), router);
