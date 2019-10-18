import * as React from 'react';
import * as style from './style.scss';
import {Api, GameTemplate, loadScript, TPageProps} from '../util';
import {Lang} from '@elf/component';
import {IGameConfig, ResponseCode} from '@elf/share';
import {Loading} from '../component';
import {RouteComponentProps} from 'react-router';
import {Button, Input, List, message, Modal} from 'antd';
import * as dateFormat from 'dateformat';

interface ICreateState {
    loading: boolean
    title: string
    desc: string
    params: {},
    submitable: boolean
}

export class Create extends React.Component<TPageProps & RouteComponentProps<{ namespace: string }>, ICreateState> {
    lang = Lang.extractLang({
        title: ['实验标题', 'Game Title'],
        desc: ['实验描述', 'Description'],
        invalidBaseInfo: ['请检查实验标题与描述信息', 'Check game title and description please'],
        start: ['开始', 'Start'],
        end: ['结束', 'End'],
        submit: ['提交', 'SUBMIT'],
        submitFailed: ['提交失败', 'Submit failed'],
        createSuccess: ['创建成功', 'Created successfully'],
        historyGame: ['历史实验', 'HistoryGame'],
        loadFromHistory: ['点击从历史实验加载实验配置', 'Click to load configuration from history game'],
        loadSuccess: ['加载成功', 'Load success'],
    });

    state: ICreateState = {
        loading: true,
        title: '',
        desc: '',
        params: {},
        submitable: true
    };

    get namespace(): string {
        return this.props.match.params.namespace;
    }

    async componentDidMount() {
        const {code, jsUrl} = await Api.getJsUrl(this.namespace);
        if (code !== ResponseCode.success) {
            return;
        }
        loadScript(jsUrl.split(';'), () =>
            this.setState({
                loading: false
            })
        );
    }

    async handleSubmit() {
        const {lang, props: {history}, state: {title, desc, params}} = this;
        if (!title || !desc) {
            return message.warn(lang.invalidBaseInfo);
        }
        const {code, gameId} = await Api.postNewGame(title, desc, this.namespace, params);
        if (code === ResponseCode.success) {
            message.success(lang.createSuccess);
            history.push(`/info/${gameId}`);
        } else {
            message.error(lang.submitFailed);
        }
    }

    updatePhase(action) {
        if (typeof action === 'function') {
            this.setState(({params}) => ({params: {...params, ...action(params)}}));
        } else {
            this.setState({params: {...this.state.params, ...action}});
        }
    }

    render(): React.ReactNode {
        const {lang, state: {loading, params, title, desc, submitable}} = this;
        if (loading) {
            return <Loading/>;
        }
        const {Create} = GameTemplate.getTemplate();
        return <section className={style.create}>
            <div className={style.titleWrapper}>
                <Input size='large'
                       value={title}
                       placeholder={lang.title}
                       maxLength={20}
                       onChange={({target: {value: title}}) => this.setState({title})}/>
                <br/><br/>
                <Input.TextArea value={desc}
                                maxLength={500}
                                autosize={{minRows: 4, maxRows: 8}}
                                placeholder={lang.desc}
                                onChange={({target: {value: desc}}) => this.setState({desc})}/>
            </div>
            <div className={style.historyGameBtnWrapper}>
                <a onClick={() => {
                    const modal = Modal.info({
                        width:'48rem',
                        title: lang.loadFromHistory,
                        content: <div style={{marginTop: '1rem'}}>
                            <HistoryGame {...{
                                namespace: this.namespace,
                                applyHistoryGame: ({title, desc, params}: IGameConfig<any>) => {
                                    this.setState({
                                        title, desc, params
                                    });
                                    modal.destroy();
                                    message.success(lang.loadSuccess);
                                }
                            }}/>
                        </div>
                    });
                }}>{lang.historyGame}</a>
            </div>
            <Create {...{
                submitable,
                setSubmitable: submitable => this.setState({submitable}),
                params,
                setParams: action => this.updatePhase(action)
            }}/>
            {
                submitable ?
                    <div style={{textAlign: 'center'}}>
                        <Button type='primary' onClick={() => this.handleSubmit()}>{lang.submit}</Button>
                    </div> : null
            }
        </section>;
    }
}


function HistoryGame({applyHistoryGame, namespace}: { namespace: string, applyHistoryGame: (gameCfg: IGameConfig<any>) => void }) {
    const [historyGameThumbs, setHistoryGameThumbs] = React.useState([]);
    React.useEffect(() => {
        Api.getHistoryGames(namespace).then(({historyGameThumbs}) => setHistoryGameThumbs(historyGameThumbs));
    }, []);
    return <List dataSource={historyGameThumbs} grid={{
        gutter: 16,
        md: 2
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
