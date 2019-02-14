import * as React from 'react'
import * as style from './style.scss'
import {RouteComponentProps} from 'react-router'
import {baseEnum, IPhaseConfig, CorePhaseNamespace} from '@common'
import * as dagre from 'dagre'
import {Api, connCtx, genePhaseKey, loadScript, Lang} from '@client-util'
import {rootContext, TRootContext} from '@client-context'
import {phaseTemplates} from '../../../index'
import {message, Row, Col, Button, Input, Icon, Card, Modal} from '@antd-component'
import {Breadcrumb, Label, Loading, Title} from '@client-component'

const {Group: ButtonGroup} = Button, {TextArea} = Input

declare interface ICreateState {
    loading: boolean
    title: string
    desc: string
    phaseConfigs: Array<IPhaseConfig<{}>>
    activePhaseKey: string,
    highlightPhaseKeys?: Array<string>
    showSvgModal: boolean
}

@connCtx(rootContext)
export class Create extends React.Component<TRootContext & RouteComponentProps<{ gameId: string }>, ICreateState> {
    get defaultState() {
        return {
            title: '',
            desc: '',
            phaseConfigs: [],
            activePhaseKey: '',
            highlightPhaseKeys: [],
            showSvgModal: false
        }
    }

    lang = Lang.extractLang({
        goBack: ['返回', 'go back'],
        cancel: ['取消', 'Cancel'],
        submit: ['提交', 'Submit'],
        name: ['名称', 'Name'],
        groupPhases: ['实验组环节', 'Game Phases'],
        add: ['添加', 'ADD'],
        remove: ['移除', 'REMOVE'],
        clone: ['复制', 'CLONE'],
        title: ['标题', 'Title'],
        desc: ['描述', 'Description'],
        groupInfo: ['实验组信息', 'Game Info'],
        phasePointedByAnotherOne: ['尚有其它环节指向此环节,无法移除', 'This phase cannot be removed since there is another one pointing to it'],
        createSuccess: ['创建成功，即将进入实验房间', 'Create success, enter to play room now']
    })

    state: ICreateState = {
        loading: true,
        ...this.defaultState
    }

    async componentDidMount() {
        const {code, templates} = await Api.getPhaseTemplates()
        if (code === baseEnum.ResponseCode.success) {
            loadScript(templates.reduce((prev, {jsUrl}) => [...prev, ...jsUrl.split(';')], []), () => {
                this.setState({loading: false})
            })
        }
    }

    handleNewPhase(namespace: string) {
        const key = genePhaseKey(),
            seq = this.state.phaseConfigs.filter(phaseCfg => phaseCfg.namespace === namespace).length,
            title = Lang.extractLang({title: phaseTemplates[namespace].localeNames}).title + (seq ? seq + 1 : '')
        this.setState(({phaseConfigs}) => ({
            phaseConfigs: phaseConfigs.concat({
                key,
                title,
                namespace,
                param: {},
                suffixPhaseKeys: []
            })
        }))
    }

    handleUpdatePhase(i: number, newConfig: Partial<IPhaseConfig<{}>>) {
        const phaseConfigs = this.state.phaseConfigs.slice()
        phaseConfigs[i] = {...phaseConfigs[i], ...newConfig, param: {...phaseConfigs[i].param, ...newConfig.param}}
        this.setState({
            phaseConfigs
        })
    }

    handleRemovePhase(i: number) {
        const phaseConfigs = this.state.phaseConfigs.slice()
        const prePhaseConfig = phaseConfigs.find(({suffixPhaseKeys}) => suffixPhaseKeys.includes(phaseConfigs[i].key))
        if (prePhaseConfig) {
            return message.error(this.lang.phasePointedByAnotherOne)
        }
        phaseConfigs.splice(i, 1)
        this.setState({
            phaseConfigs,
            activePhaseKey: ''
        })
    }

    handleClonePhase(i: number) {
        this.setState(({phaseConfigs}) => ({
            phaseConfigs: phaseConfigs.concat({
                ...this.state.phaseConfigs[i],
                key: genePhaseKey()
            })
        }))
    }

    async handleSubmit() {
        const {lang, props: {history, match}, state: {title, desc, phaseConfigs}} = this
        const {code, groupId} = await Api.postNewGroup(match.params.gameId, title, desc, phaseConfigs)
        if (code === baseEnum.ResponseCode.success) {
            await message.success(lang.createSuccess)
            history.push(`/group/info/${groupId}`)
        }
    }

    render(): React.ReactNode {
        const {lang, props: {history, match: {params: {gameId}}}} = this
        return this.state.loading ? <Loading/> :
            <section className={style.createGroup}>
                <Breadcrumb history={history} links={[
                    {label: lang.goBack, to: `/game/info/${gameId}`}
                ]}/>
                {
                    this.renderGroupInfo()
                }
                {
                    this.renderPhases()
                }
                <div className={style.submitBtnGroup}>
                    <Button className={style.btn}
                            onClick={() => this.setState(this.defaultState)}>{lang.cancel}</Button>
                    <Button className={style.btn} type={'primary'}
                            onClick={() => this.handleSubmit()}>{lang.submit}</Button>
                </div>
            </section>
    }

    renderGroupInfo() {
        const {lang, state: {title, desc}} = this
        return <React.Fragment>
            <Title label={lang.groupInfo}/>
            <Input value={title}
                   placeholder={lang.title}
                   maxLength={20}
                   onChange={({target: {value: title}}) => this.setState({title})}/>
            <br/><br/>
            <TextArea value={desc}
                      maxLength={500}
                      autosize={{minRows: 5, maxRows: 10}}
                      placeholder={lang.desc}
                      onChange={({target: {value: desc}}) => this.setState({desc})}/>
        </React.Fragment>
    }

    renderPhases() {
        const {lang, state: {phaseConfigs, activePhaseKey, highlightPhaseKeys, showSvgModal}} = this
        const flowChart = <PhaseFlowChart {...{
            phaseConfigs,
            highlightPhaseKeys: [activePhaseKey, ...highlightPhaseKeys],
            onClickPhase: key => this.setState({activePhaseKey: key})
        }}/>
        return <section className={style.phasesSection}>
            <Title label={lang.groupPhases}/>
            <Row>
                <Col span={2}>
                    <Label label={lang.add}/>
                </Col>
                <Col span={8}>
                    <ButtonGroup>
                        {
                            Object.entries(phaseTemplates)
                                .map(([namespace, phaseTemplate]) => {
                                        return <Button key={namespace}
                                                       {...CorePhaseNamespace[namespace] &&
                                                       phaseConfigs.find(phaseCfg => phaseCfg.namespace == namespace) ? {
                                                           disabled: true
                                                       } : {
                                                           onClick: () => this.handleNewPhase(namespace)
                                                       }
                                                       }>{Lang.extractLang({name: phaseTemplate.localeNames}).name}</Button>
                                    }
                                )
                        }
                    </ButtonGroup>
                </Col>
            </Row>
            <Row>
                <Col span={7}>
                    {
                        flowChart
                    }
                </Col>
                <Col span={1}>
                    <Button icon={'eye'}
                            onClick={() => this.setState(({showSvgModal}) => ({showSvgModal: !showSvgModal}))}/>
                </Col>
                <Col span={16}>
                    {
                        this.renderPhaseEditor()
                    }
                </Col>
            </Row>
            <Modal visible={showSvgModal}
                   footer={null}
                   width={'80%'}
                   onCancel={() => this.setState(({showSvgModal}) => ({showSvgModal: !showSvgModal}))}>{
                flowChart
            }</Modal>
        </section>
    }

    renderPhaseEditor() {
        const {lang, state: {phaseConfigs, activePhaseKey}} = this
        const curPhaseIndex = phaseConfigs.findIndex(({key}) => key === activePhaseKey),
            curPhase = phaseConfigs[curPhaseIndex]
        if (!curPhase) {
            return null
        }
        const {Create} = phaseTemplates[curPhase.namespace]
        return <Card className={style.phaseCard} actions={[
            <Icon type={'delete'}
                  onClick={() => this.handleRemovePhase(curPhaseIndex)}>{lang.remove}</Icon>
        ].concat(CorePhaseNamespace[curPhase.namespace] ? [] :
            <Icon type={'copy'} onClick={() => this.handleClonePhase(curPhaseIndex)}>{lang.clone}</Icon>)}>
            <Input value={curPhase.title} placeholder={lang.title}
                   maxLength={12}
                   size={'large'}
                   onChange={({target: {value}}) => CorePhaseNamespace[curPhase.namespace] || value.length > 20 ? null :
                       this.handleUpdatePhase(curPhaseIndex, {title: value})}
            />
            <div className={style.createWrapper}>
                <Create {...{
                    key: activePhaseKey,
                    phases: phaseConfigs.map(({namespace, title, key}) => ({
                        label: title,
                        key,
                        namespace
                    })),
                    curPhase,
                    highlightPhases: highlightPhaseKeys => this.setState({
                        highlightPhaseKeys
                    }),
                    updatePhase: (suffixPhaseKeys: Array<string>, param: {}) => this.handleUpdatePhase(curPhaseIndex, {
                        suffixPhaseKeys,
                        param
                    })
                }}/>
            </div>
        </Card>
    }
}

export const PhaseFlowChart: React.SFC<{
    phaseConfigs: Array<IPhaseConfig<{}>>
    onClickPhase: (phaseKey: string) => void
    highlightPhaseKeys?: Array<string>
}> = ({phaseConfigs, onClickPhase, highlightPhaseKeys = []}) => {

    const BASE_NODE = {start: 'start', end: 'end'}
    const fontSize = 16

    function getLabelWidth(label: string) {
        let width = 0
        for (let i = 0; i < label.length; i++) {
            const charCode = label.charCodeAt(i)
            width += (charCode > 64 && charCode <= 96) || charCode > 255 ? 1 : .5
        }
        return width * fontSize
    }

    const g = new dagre.graphlib.Graph()
    g.setGraph({
        marginx: fontSize * 5,
        marginy: fontSize * 2,
        ranksep: 20,
        nodesep: fontSize * 5,
        align: 'DL'
    })
    g.setDefaultEdgeLabel(() => ({}))
    phaseConfigs.forEach(({namespace, key, title}, i) => {
        g.setNode(key, {
            key,
            label: title,
            width: getLabelWidth(title),
            height: 1.2 * fontSize
        })
    })
    phaseConfigs.forEach(({namespace, key, title, suffixPhaseKeys}) => {
        suffixPhaseKeys.sort().forEach(suffixKey => suffixKey ? g.setEdge(key, suffixKey) : null)
    })
    dagre.layout(g)
    const graph = g.graph()
    if (!Number.isFinite(graph.width) || !Number.isFinite(graph.height)) {
        graph.width = graph.height = 0
    }
    const wrapperWidth = graph.width > graph.height ? 100 : ~~(graph.width / graph.height / .05) * 5
    return <div className={style.flowChart} style={{width: `${wrapperWidth}%`}}>
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox={`${graph.width * -.1},${graph.height * -.1},${graph.width < 300 ? 300 : graph.width * 1.2},${graph.height * 1.2}`}>
            <defs>
                <marker id="markerArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6"
                        orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z"/>
                </marker>
            </defs>
            {
                g.edges().map(({v, w}) => [g.node(v), g.node(w)]).map(([from, to], i) =>
                    <polyline key={i}
                              points={`${from.x + from.width / 2},${from.y + from.height / 2} ${(from.x + from.width / 2 + to.x + to.width / 2) / 2},${(from.y + from.height / 2 + to.y + to.height / 2) / 2} ${to.x + to.width / 2},${to.y + to.height / 2}`}
                              stroke="#000"
                              markerMid="url(#markerArrow)"/>
                )
            }
            {
                g.nodes().map(key => g.node(key)).map(({key, label, x, y, width, height}) => {
                        const foreColor = highlightPhaseKeys.includes(key) ? '#58e' : '#000'
                        return <React.Fragment key={key}>
                            <rect {...{
                                x: x - fontSize,
                                y,
                                width: width + 2 * fontSize,
                                height,
                                rx: 2, ry: 2,
                                fill: '#fff',
                                stroke: foreColor
                            }}/>
                            <text {...{
                                x: x + width / 2,
                                y: y + fontSize,
                                textAnchor: 'middle',
                                fill: foreColor,
                                fontSize: fontSize
                            }}>{label}</text>
                            <rect {...{
                                x: x - fontSize,
                                y,
                                width: width + 2 * fontSize,
                                height,
                                fill: 'transparent',
                                onClick: () => [BASE_NODE.start, BASE_NODE.end].includes(key) ? null : onClickPhase(key)
                            }}/>
                        </React.Fragment>
                    }
                )
            }
        </svg>
    </div>
}