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
        if ((req.user as any).id !== game.owner) {
            return res.end('Invalid Request');
        }
        const name = 'RoundResult';
        let data = [], option = {};
        const rounds = await Model.FreeStyleModel.find({
            game: game.id
        }).sort({key: 1}) as Array<any>;
        rounds.forEach(round => {
            const [g, r] = round.key.split('_');
            data.push([]);
            data.push([`第${+g + 1}组`, `第${+r + 1}轮`]);
            data.push(['订单编号', '买家编号', '买家报价', '买家编号', '卖家报价']);
            round.data.forEach(({buy, sell}, i) =>
                data.push([i + 1, buy.player + 1, buy.price, sell.player + 1, sell.price])
            );
        });
        let buffer = nodeXlsx.build([{name, data}], option);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`);
        return res.end(buffer, 'binary');
    });

Server.start(namespace, Logic, resolve(__dirname, '../dist'), router);

RobotServer.start(namespace, Robot);