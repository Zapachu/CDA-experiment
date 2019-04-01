import * as React from 'react'
import * as style from './style.scss'
import {RouteComponentProps} from 'react-router'
import {baseEnum, IPhaseConfig, CorePhaseNamespace} from '@common'
import {IPhaseTemplate} from '../../index'
import * as dagre from 'dagre'
import {Api, connCtx, genePhaseKey, loadScript, Lang} from '@client-util'
import {rootContext, TRootContext} from '@client-context'
import {phaseTemplates} from '../../index'
import {message, Row, Col, Button, Input, Icon, Card, Modal, Select, Tabs, List} from '@antd-component'
import {Loading, Title} from '@client-component'
import {Link} from 'react-router-dom'
import GameMode = baseEnum.GameMode

declare interface ICreateState {
    loading: boolean
    activePhaseKey: string
    highlightPhaseKeys?: Array<string>
    showSvgModal: boolean
    showAddPhaseModal: boolean
    phaseConfigs: Array<IPhaseConfig<{ [key: string]: string }>>
    published: boolean
    mode: string
}

@connCtx(rootContext)
export class Phase extends React.Component<TRootContext & RouteComponentProps<{ gameId: string }>, ICreateState> {
    private mode: GameMode

    get defaultState() {
        return {
            activePhaseKey: '',
            highlightPhaseKeys: [],
            showSvgModal: false,
            showAddPhaseModal: false,
            phaseConfigs: [],
            published: false,
            mode: this.mode || GameMode.easy
        }
    }

    lang = Lang.extractLang({
        addPhase: ['添加环节', 'Add Phase'],
        startPhase: ['开始环节', 'Starting Phase'],
        start: ['开始', 'Start'],
        end: ['结束', 'End'],
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
        createSuccess: ['创建成功', 'Created successfully'],
        view: ['查看', 'VIEW'],
        console: ['控制台', 'CONSOLE'],
        newGroup: ['新建组', 'New Group'],
        goPublish: ['去发布', 'Go Publish'],
        lackPhaseConfigs: ['实验环节缺失', 'Please complete phase configs'],
        lackStartPhase: ['开始环节缺失', 'Please set starting phase']
    })

    state: ICreateState = {
        loading: true,
        ...this.defaultState
    }

    componentDidMount() {
        Promise.all([this.fetchGame(), this.fetchPhaseTemplates()]).then(() => {
            this.setState({loading: false})
        })
    }

    fetchPhaseTemplates = (): Promise<null> => new Promise(async resolve => {
        const {code, templates} = await Api.getPhaseTemplates(this.props.user.orgCode)
        if (code === baseEnum.ResponseCode.success) {
            loadScript(templates.reduce((prev, {jsUrl}) => [...prev, ...jsUrl.split(';')], []), () => {
                resolve()
            })
        }
    })

    fetchGame = (): Promise<null> => new Promise(async resolve => {
        const {match: {params: {gameId}}} = this.props
        const {game: {published, mode, phaseConfigs = []}} = await Api.getGame(gameId)
        this.mode = mode as GameMode
        this.setState({
            published,
            mode,
            phaseConfigs
        })
        resolve()
    })

    handleNewPhase = (newPhase: IPhaseConfig) => {
        const {mode} = this.state
        this.setState(({phaseConfigs}) => {
            return mode === GameMode.extended
                ? {
                    phaseConfigs: phaseConfigs.concat(newPhase),
                    showAddPhaseModal: false
                }
                : {
                    phaseConfigs: [newPhase],
                    showAddPhaseModal: false
                }
        })
    }

    handleUpdatePhase(i: number, newConfig: Partial<IPhaseConfig<{}>>) {
        const phaseConfigs = this.state.phaseConfigs.slice()
        phaseConfigs[i] = {...phaseConfigs[i], ...newConfig, param: {...phaseConfigs[i].param, ...newConfig.param}}
        this.setState({
            phaseConfigs
        })
    }

    handleRemovePhase(i: number): void {
        const phaseConfigs = this.state.phaseConfigs.slice()
        const prePhaseConfig = phaseConfigs.find(({suffixPhaseKeys}) => suffixPhaseKeys.includes(phaseConfigs[i].key))
        if (prePhaseConfig) {
            message.error(this.lang.phasePointedByAnotherOne)
            return
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

    handleStartPhase(key: string) {
        const {lang} = this
        const phaseConfigs = [...this.state.phaseConfigs]
        const startPhase = phaseConfigs.find(pc => pc.namespace === CorePhaseNamespace.start)
        if (startPhase) {
            startPhase.suffixPhaseKeys = [key]
            startPhase.param.firstPhaseKey = key
            this.setState({phaseConfigs})
        } else {
            this.setState(({phaseConfigs}) => ({
                phaseConfigs: phaseConfigs.concat({
                    key: CorePhaseNamespace.start,
                    title: lang.start,
                    namespace: CorePhaseNamespace.start,
                    param: {firstPhaseKey: key},
                    suffixPhaseKeys: [key]
                })
            }))
        }
    }

    async handleSubmit() {
        const {lang, props: {history, match}, state: {phaseConfigs, mode}} = this
        if (!phaseConfigs.length) {
            return message.info(lang.lackPhaseConfigs)
        }
        const phaseConfigsToUpdate = phaseConfigs.slice()
        if (mode === GameMode.easy) {
            const startPhase = {
                key: CorePhaseNamespace.start,
                title: lang.start,
                namespace: CorePhaseNamespace.start,
                param: {firstPhaseKey: phaseConfigs[0].key},
                suffixPhaseKeys: [phaseConfigs[0].key]
            }
            phaseConfigsToUpdate.unshift(startPhase)
        }
        if (!phaseConfigsToUpdate.some(pc => pc.namespace === CorePhaseNamespace.start)) {
            return message.info(lang.lackStartPhase)
        }
        const endPhase = {
            key: CorePhaseNamespace.end,
            title: lang.end,
            namespace: CorePhaseNamespace.end,
            param: {},
            suffixPhaseKeys: []
        }
        phaseConfigsToUpdate.forEach(pc => {
            if (!pc.suffixPhaseKeys.length) {
                pc.suffixPhaseKeys = [endPhase.key]
            }
        })
        phaseConfigsToUpdate.push(endPhase)
        const {code} = await Api.postEditGame(match.params.gameId, {
            phaseConfigs: phaseConfigsToUpdate,
            published: true
        })
        if (code === baseEnum.ResponseCode.success) {
            message.success(lang.createSuccess)
            history.push(`/info/${match.params.gameId}`)
        }
    }

    renderButtons = () => {
        const {lang, state: {published}, props: {match: {params: {gameId}}}} = this
        if (!published) {
            return (
                <div className={style.submitBtnGroup}>
                    <Button className={style.btn}
                            onClick={() => this.setState(this.defaultState)}>{lang.cancel}</Button>
                    <Button className={style.btn} type={'primary'}
                            onClick={() => this.handleSubmit()}>{lang.submit}</Button>
                </div>
            )
        }
        return (
            <div className={style.submitBtnGroup}>
                <Link style={{marginRight: '50px'}} to={`/info/${gameId}`}>{lang.view}</Link>
                <Link to={`/play/${gameId}`}>{lang.console}</Link>
            </div>
        )
    }

    render(): React.ReactNode {
        const {lang, state: {showAddPhaseModal, mode}} = this
        return this.state.loading ? <Loading/> :
            <section className={style.createGroup}>
                <div className={style.addPhaseBtn}>
                    <Button onClick={() => this.setState({showAddPhaseModal: true})}>{lang.addPhase}</Button>
                </div>
                {mode === GameMode.extended
                    ? this.renderPhases()
                    : this.renderPhaseEditor(0)
                }
                {this.renderButtons()}
                <Modal visible={showAddPhaseModal}
                       footer={null}
                       bodyStyle={{minHeight: '200px'}}
                       width={700}
                       title={lang.addPhase}
                       onCancel={() => this.setState(({showAddPhaseModal}) => ({showAddPhaseModal: !showAddPhaseModal}))}>
                    <AddPhase onTagClick={this.handleNewPhase}/>
                </Modal>
            </section>
    }

    renderPhases() {
        const {lang, state: {published, phaseConfigs, activePhaseKey, highlightPhaseKeys, showSvgModal}} = this
        const flowChart = <PhaseFlowChart {...{
            phaseConfigs,
            highlightPhaseKeys: [activePhaseKey, ...highlightPhaseKeys],
            onClickPhase: published ? () => {
            } : key => this.setState({activePhaseKey: key})
        }}/>
        const curPhaseIndex = phaseConfigs.findIndex(({key}) => key === activePhaseKey)
        return <section className={style.phasesSection}>
            <Title label={lang.groupPhases}/>
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
                        this.renderPhaseEditor(curPhaseIndex)
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

    renderPhaseEditor(curPhaseIndex: number) {
        const {lang, state: {phaseConfigs, activePhaseKey, mode}} = this
        const curPhase = phaseConfigs[curPhaseIndex]
        if (!curPhase) {
            return null
        }
        const {Create} = phaseTemplates[curPhase.namespace]
        return <Card className={style.phaseCard} actions={mode === GameMode.easy ? [] : [
            <Icon type={'play-circle'}
                  onClick={() => this.handleStartPhase(curPhase.key)}>{lang.startPhase}</Icon>,
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
                    phases: phaseConfigs
                        .filter(({namespace, key}) => namespace !== CorePhaseNamespace.start && key !== curPhase.key)
                        .map(({namespace, title, key}) => ({
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


interface AddPhaseState {
    phaseType: string
    phases: Array<{
        type: string,
        nodes: Array<{ name: string, namespace: string, icon: string }>
    }>
    options: Array<string>
    searchTerm: string
}

interface AddPhaseProps {
    onTagClick: (newPhase: IPhaseConfig) => void
}

export class AddPhase extends React.Component<AddPhaseProps, AddPhaseState> {
    constructor(props) {
        super(props)
        this.state = {
            phaseType: '',
            phases: this.formatPhases(phaseTemplates),
            options: [],
            searchTerm: ''
        }
    }

    componentDidMount() {
        const {state: {phases}} = this
        if (phases.length) {
            const {type} = phases[0]
            this.onTabChange(type)
        }
    }

    lang = Lang.extractLang({
        otree: ['OTree', 'OTree'],
        bespoke: ['定制实验', 'Bespoke'],
        survey: ['问卷', 'Survey'],
        searchPhase: ['搜索环节', 'Search Phase']
    })

    formatPhases = (phaseTemplates: { [phase: string]: IPhaseTemplate }) => {
        const phases: { [type: string]: Array<{ name: string, namespace: string, icon: string }> } = {}
        Object.values(phaseTemplates).forEach(tpl => {
            if (phases[tpl.type]) {
                phases[tpl.type].push({
                    name: Lang.extractLang({name: tpl.localeNames}).name,
                    namespace: tpl.namespace,
                    icon: tpl.icon
                })
            } else {
                phases[tpl.type] = [{
                    name: Lang.extractLang({name: tpl.localeNames}).name,
                    namespace: tpl.namespace,
                    icon: tpl.icon
                }]
            }
        })
        return Object.entries(phases).map(([type, nodes]) => ({type, nodes}))
    }

    handleSearch = (term: string) => {
        if (!term) return
        const options: AddPhaseState['options'] = []
        Object.values(phaseTemplates).forEach(tpl => {
            const name = Lang.extractLang({name: tpl.localeNames}).name
            if (name.includes(term)) {
                options.push(name)
            }
        })
        this.setState({options})
    }

    handleChange = (name: string) => {
        const {options, phases, phaseType} = this.state
        if (!name) {
            this.setState({phases: this.formatPhases(phaseTemplates), options: [], searchTerm: ''})
        } else if (options.length) {
            const newPhases = phases
                .filter(phase => {
                    return phase.nodes.some(node => node.name === name)
                })
                .map(({type, nodes}) => ({
                    type,
                    nodes: nodes.filter(node => node.name === name)
                }))
            this.setState({
                phases: newPhases,
                phaseType: newPhases[0] ? newPhases[0].type : phaseType,
                searchTerm: name
            })
        }
    }

    render() {
        const {lang, state: {phaseType, phases, options, searchTerm}} = this
        return (
            <section className={style.addPhase}>
                <div className={style.searchBar}>
                    <Select
                        showSearch
                        allowClear
                        style={{width: '70%'}}
                        value={searchTerm}
                        onChange={val => this.handleChange(val.toString())}
                        onSearch={val => this.handleSearch(val)}
                        showArrow={false}
                        placeholder={lang.searchPhase}
                    >
                        {options.map(option => <Select.Option key={option}>{option}</Select.Option>)}
                    </Select>
                </div>
                <Tabs activeKey={phaseType}
                      onChange={this.onTabChange}>
                    {phases.map(({nodes, type}) =>
                        <Tabs.TabPane
                            tab={lang[type]}
                            key={type}>
                            <List dataSource={nodes}
                                  grid={{gutter: 16, column: 6}}
                                  renderItem={item =>
                                      <List.Item onClick={() => this.onTagClick(item)}>
                                          <div className={style.templateNode}>
                                              <img src={item.icon}/>
                                              <span>{item.name}</span>
                                          </div>
                                      </List.Item>
                                  }/>
                        </Tabs.TabPane>
                    )}
                </Tabs>
            </section>
        )
    }

    onTagClick = (node: { name: string, namespace: string }) => {
        const {lang, state: {phaseType}, props: {onTagClick}} = this
        onTagClick({
            key: genePhaseKey(),
            title: `${lang[phaseType]}-${node.name}`,
            namespace: node.namespace,
            param: {},
            suffixPhaseKeys: []
        })
    }

    onTabChange = (key: string) => {
        this.setState({phaseType: key})
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
                                onClick: () => {
                                    console.log('key on phase: ', key);
                                    [BASE_NODE.start, BASE_NODE.end].includes(key) ? null : onClickPhase(key)
                                }
                            }}/>
                        </React.Fragment>
                    }
                )
            }
        </svg>
    </div>
}
