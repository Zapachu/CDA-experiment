import {resolve} from 'path';
import nodeXlsx from 'node-xlsx';
import {FetchRoute, namespace} from './config';
import {BaseLogic, Model, Server} from '@bespoke/server';
import {RobotServer} from '@bespoke/robot';
import {Router} from 'express';
import {Logic} from './Logic';
import {Robot} from './Robot';

const router = Router()
    .get(FetchRoute.exportXls, async (req, res) => {
        const {params: {gameId}, query: {group, round}} = req;
        const {game} = await BaseLogic.getLogic(gameId);
        if (req.user.id !== game.owner) {
            return res.end('Invalid Request');
        }
        const name = 'RoundResult';
        let data = [], option = {};
        data.push(['玩家', '优先序', '初始物品编号', '初始物品价格', '参与分配', '偏好表达', '分得物品编号', '分得物品价格']);
        const record = await Model.FreeStyleModel.findOne({
            game: game.id,
            key: `${group}_${round}`
        }) as any;
        record.data.forEach(({user, playerIndex, initGood, initGoodPrice, join, sort, good, goodPrice}) =>
            data.push([user, playerIndex, initGood, initGoodPrice, join, sort, good, goodPrice])
        );
        let buffer = nodeXlsx.build([{name, data}], option);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`);
        return res.end(buffer, 'binary');
    });

Server.start(namespace, Logic, resolve(__dirname, '../dist'), router);

RobotServer.start(namespace, Robot);