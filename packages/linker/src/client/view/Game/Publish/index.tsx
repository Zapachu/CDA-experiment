// import * as React from 'react'
// import * as style from './style.scss'
// import {RouteComponentProps} from 'react-router'
// import {IGameWithId, baseEnum} from '@common'
// import {Api, Lang} from '@client-util'
// import {Button, Collapse, Tabs, message} from '@antd-component'
// import {Loading, Title} from '@client-component'
// import {PhaseFlowChart} from '../../Group/Create'

// interface IPublishState {
//     loading: boolean,
//     game: IGameWithId,
//     groupList: Array<IGameWithId>,
//     activeGroupKey: number,
//     btnLoading: boolean,
// }

// export class Publish extends React.Component<RouteComponentProps<{ gameId: string }>, IPublishState> {
//     lang = Lang.extractLang({
//         title: ['标题', 'Title'],
//         desc: ['详情', 'Description'],
//         publishGame: ['发布实验', 'Publish Game'],
//         publishGroup: ['发布实验组', 'Publish Group'],
//         published: ['已发布', 'Published'],
//         groupPhases: ['实验组环节', 'Game Phases'],
//         basic: ['实验描述', 'Game Description'],
//         publishGameSuccess: ['实验发布成功', 'Game published successfully'],
//         publishGroupSuccess: ['实验组发布成功', 'Group published successfully'],

//     })
//     state: IPublishState = {
//         loading: true,
//         btnLoading: false,
//         game: {
//             id: '',
//             title: '',
//             desc: '',
//             published: false
//         },
//         groupList: [],
//         activeGroupKey: 0,
//     }

//     componentDidMount() {
//         const {props: {match: {params: {gameId}}}} = this
//         const fetchGame: Promise<IGameWithId> = new Promise(async resolve => {
//             const {game} = await Api.getGame(gameId)
//             resolve(game)
//         })
//         const fetchGroupList: Promise<Array<IGroupWithId>> = new Promise(async resolve => {
//             const {groupList} = await Api.getGroupList(gameId)
//             resolve(groupList)
//         })
//         Promise.all([fetchGame, fetchGroupList]).then(([game, groupList]) => {
//             this.setState({loading: false, game, groupList})
//         })
//     }

//     async publishGame() {
//         const {lang, state: {game}} = this
//         if(game.published) return;
//         this.setState({btnLoading: true})
//         const {code, game: updatedGame} = await Api.postEditGame(game.id, {published: true})
//         if (code === baseEnum.ResponseCode.success) {
//             message.success(lang.publishGameSuccess)
//             this.setState({btnLoading: false, game: updatedGame})
//         } else {
//             this.setState({btnLoading: false})
//         }
//     }

//     async publishGroup() {
//         const {lang, state: {groupList, activeGroupKey}} = this
//         const group = groupList[activeGroupKey]
//         if(group.published) return;
//         this.setState({btnLoading: true})
//         const {code, group: updatedGroup} = await Api.postEditGroup(group.id, {published: true})
//         if (code === baseEnum.ResponseCode.success) {
//             message.success(lang.publishGroupSuccess)
//             const newGroupList = [...groupList]
//             newGroupList[activeGroupKey] = updatedGroup
//             this.setState({btnLoading: false, groupList: newGroupList})
//         } else {
//             this.setState({btnLoading: false})
//         }
//     }

//     renderBasicInfo = () => {
//         const {lang, state:{game:{title, desc}}} = this
//         return (
//             <Collapse bordered={false} defaultActiveKey={['1']}>
//                 <Collapse.Panel header={lang.basic} key="1">
//                 <label>{lang.title}</label>
//                 <p>{title}</p>
//                 <br/><br/>
//                 <label>{lang.desc}</label>
//                 <p>{desc}</p>
//                 </Collapse.Panel>
//             </Collapse>
//         )
//     }

//     renderGroupList = () => {
//         const {lang, state:{activeGroupKey, groupList, btnLoading, game}} = this
//         const group = groupList[activeGroupKey]
//         return (
//             <>
//             <Title label={lang.groupPhases}/>
//             <Tabs activeKey={activeGroupKey.toString()} 
//                 onChange={key => this.setState({activeGroupKey: Number(key)})}>
//                 {groupList.map((gl, i) => 
//                     <Tabs.TabPane 
//                         tab={gl.title}
//                         key={i.toString()}>
//                         <div className={style.groupBtnWrapper}>
//                             <Button type={'primary'}
//                                 loading={btnLoading}
//                                 disabled={!game.published}
//                                 ghost={group.published}
//                                 icon={group.published?'check':''}
//                                 onClick={() => this.publishGroup()}>{group.published?lang.published:lang.publishGroup}
//                             </Button>
//                         </div>
//                         <div className={style.flowChartContainer}>
//                             <PhaseFlowChart {...{
//                                 phaseConfigs: gl.phaseConfigs,
//                                 onClickPhase: () => {}
//                             }}/>
//                         </div>
//                     </Tabs.TabPane>
//                 )}
//             </Tabs>
//             </>
//         )
//     }

//     render(): React.ReactNode {
//         const {lang, state: {loading, btnLoading, game:{published}}} = this
//         if(!loading) {
//             return <section className={style.gamePublish}>
//             {this.renderBasicInfo()}
//             {this.renderGroupList()}
//             <div className={style.publishBtnWrapper}>
//                 <Button type={'primary'}
//                     loading={btnLoading}
//                     ghost={published}
//                     icon={published?'check':''}
//                     onClick={() => this.publishGame()}>{published?lang.published:lang.publishGame}
//                 </Button>
//             </div>
//         </section>
//         }
//         return <Loading />
//     }
// }
