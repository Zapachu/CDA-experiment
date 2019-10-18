import * as React from 'react';
import * as style from './style.scss';
import {Lang, Toast} from '@elf/component';
import {AcademusRole, IGameConfig, ResponseCode} from '@bespoke/share';
import {Api, Button, Input, List, message, Modal, TPageProps} from '../util';
import * as dateFormat from 'dateformat';

export function Create({user, history, gameTemplate: {Create: GameCreate}}: TPageProps) {
    const lang = Lang.extractLang({
        title: ['实验标题', 'Game Title'],
        loadFromHistory: ['点击从历史实验加载实验配置', 'Click to load configuration from history game'],
        loadSuccess: ['加载成功', 'Load success'],
        Submit: ['提交', 'Submit'],
        CreateSuccess: ['实验创建成功', 'Create success'],
        CreateFailed: ['实验创建失败', 'Create Failed'],
        historyGame: ['历史实验', 'HistoryGame']
    });
    const [title, setTitle] = React.useState(''),
        [params, setParams] = React.useState({}),
        [submitable, setSubmitable] = React.useState(true);
    React.useEffect(() => {
        if (user && user.role === AcademusRole.teacher) {
            return;
        }
        history.push('/join');
    }, []);

    async function submit() {
        const {code, gameId} = await Api.newGame({title: title || '未命名', params});
        if (code === ResponseCode.success) {
            Toast.success(lang.CreateSuccess);
            setTimeout(() => history.push(`/play/${gameId}`), 1000);
        } else {
            Toast.error(lang.CreateFailed);
        }
    }

    return <section className={style.create}>
        <div className={style.titleWrapper}>
            <Input size='large' value={title} placeholder={lang.title}
                   onChange={({target: {value: title}}) => setTitle(title)}/>
        </div>
        <div className={style.historyGameBtnWrapper}>
            <a onClick={() => {
                const modal = Modal.info({
                    width:'48rem',
                    title: lang.loadFromHistory,
                    content: <div style={{marginTop: '1rem', width:'48rem'}}>
                        <HistoryGame {...{
                            applyHistoryGame: ({title, params}: IGameConfig<any>) => {
                                setTitle(title);
                                setParams(params);
                                modal.destroy();
                                message.success(lang.loadSuccess);
                            }
                        }}/>
                    </div>
                });
            }}>{lang.historyGame}</a>
        </div>
        <GameCreate {...{
            params,
            setParams: action => setParams(typeof action === 'function' ? prevParams => ({...prevParams, ...action(prevParams)}) : {...params, ...action}),
            submitable,
            setSubmitable: submitable => setSubmitable(submitable)
        }}/>
        <div className={style.submitBtnWrapper}>
            <Button type='primary' disabled={!submitable} onClick={() => submit()}>{lang.Submit}</Button>
        </div>
    </section>;

}

function HistoryGame({applyHistoryGame}: { applyHistoryGame: (gameCfg: IGameConfig<any>) => void }) {
    const [historyGameThumbs, setHistoryGameThumbs] = React.useState([]);
    React.useEffect(() => {
        Api.getHistoryGames().then(({historyGameThumbs}) => setHistoryGameThumbs(historyGameThumbs));
    }, []);

    return <List dataSource={historyGameThumbs} grid={{
        gutter: 16,
        column: 2
    }} renderItem={({id, title, createAt}) =>
        <List.Item>
            <div style={{cursor: 'pointer'}} onClick={async () => {
                const {code, game} = await Api.getGame(id);
                if (code === ResponseCode.success) {
                    applyHistoryGame(game);
                }
            }}>
                <List.Item.Meta title={title} description={dateFormat(createAt, 'yyyy-mm-dd')}/>
            </div>
        </List.Item>
    }>
    </List>;
}
