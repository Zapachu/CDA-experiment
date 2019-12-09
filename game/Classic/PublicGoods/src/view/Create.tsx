import * as React from 'react'
import * as style from './style.scss'
import { Core } from '@bespoke/client'
import { Label, Lang, MaskLoading, Toast } from '@elf/component'
import { ICreateParams, IGroupParams } from '../interface'
import { Button, Collapse, InputNumber, Table, Tabs } from 'antd'
import cloneDeep = require('lodash/cloneDeep')

const RANGE = {
  group: {
    min: 1,
    max: 8
  },
  round: {
    min: 1,
    max: 8
  },
  groupSize: {
    min: 2,
    max: 8
  },
  minInitialMoney: {
    min: 10,
    max: 50,
    step: 5
  },
  maxInitialMoney: {
    min: 50,
    max: 100,
    step: 5
  }
}

interface ICreateState {
  activeGroupIndex: number
  activeRoundIndex: number
  minInitialMoney: number
  maxInitialMoney: number
}

export class Create extends Core.Create<ICreateParams, ICreateState> {
  lang = Lang.extractLang({
    edit: ['编辑', 'EDIT'],
    done: ['完成', 'DONE'],
    group: ['组', 'Group'],
    groupIndex: [i => `第${i + 1}组`, i => `Group ${i + 1}`],
    groupSize: ['每组人数', 'GroupSize'],
    round: ['轮次', 'Round'],
    roundIndex: [i => `第${i + 1}轮`, i => `Round ${i + 1}`],
    initialMoney: ['初始资金', 'Initial Money'],
    minInitialMoney: ['最低初始资金', 'Min Initial Money'],
    maxInitialMoney: ['最高初始资金', 'Max Initial Money'],
    K: ['回报率', 'Return Rate'],
    generate: ['随机生成', 'Generate'],
    player: ['玩家', 'Player'],
    configuration: ['实验参数', 'Configuration'],
    checkInitialMoneyPls: [
      (g, r, p) => `玩家心理价格有误，请检查：第${g + 1}组:第${r + 1}轮:玩家${p + 1}`,
      (g, r, p) =>
        `Private prices of players are invalid, check them please : Group${g + 1}:Round${r + 1}:Player${p + 1}`
    ],
    checkKPls: [
      (g, r) => `回报率(K)有误，请检查：第${g + 1}组:第${r + 1}轮`,
      (g, r) => `Return rate K is invalid, check it please : Group${g + 1}:Round${r + 1}`
    ]
  })
  state: ICreateState = {
    activeGroupIndex: 0,
    activeRoundIndex: 0,
    minInitialMoney: 20,
    maxInitialMoney: 80
  }

  componentDidMount(): void {
    const defaultParams: ICreateParams = {
      group: 2,
      groupSize: 3,
      round: 3
    }
    defaultParams.groupParams = this.geneGroupParams({
      group: RANGE.group.max,
      groupSize: RANGE.group.max,
      round: RANGE.group.max
    })
    this.props.setParams(defaultParams)
  }

  edit() {
    const {
      props: { setSubmitable }
    } = this
    setSubmitable(false)
  }

  done() {
    const {
      lang,
      props: {
        setSubmitable,
        params: { round, groupSize, group, groupParams },
        setParams
      }
    } = this
    let invalidIndex: {
      groupIndex: number
      roundIndex: number
      playerIndex?: number
    } = null
    const _groupParams = Array(group)
      .fill(null)
      .map((_, groupIndex) => ({
        roundParams: Array(round)
          .fill(null)
          .map((_, roundIndex) => {
            const { playerInitialMoney, K } = groupParams[groupIndex].roundParams[roundIndex]
            if (isNaN(+K)) {
              invalidIndex = { groupIndex, roundIndex }
              return null
            }
            return {
              playerInitialMoney: Array(groupSize)
                .fill(null)
                .map((_, playerIndex) => {
                  if (invalidIndex) {
                    return null
                  }
                  const price = +playerInitialMoney[playerIndex]
                  if (price <= 0 || isNaN(price)) {
                    invalidIndex = { groupIndex, roundIndex, playerIndex }
                    return null
                  }
                  return price
                }),
              K: +K
            }
          })
      }))
    if (invalidIndex) {
      const { groupIndex, roundIndex, playerIndex } = invalidIndex
      playerIndex === undefined
        ? Toast.warn(lang.checkKPls(groupIndex, roundIndex))
        : Toast.warn(lang.checkInitialMoneyPls(groupIndex, roundIndex, playerIndex))
      return
    }
    setParams({ groupParams: _groupParams })
    setSubmitable(true)
  }

  geneGroupParams({ group, groupSize, round }: Partial<ICreateParams>): Array<IGroupParams> {
    const {
      state: { minInitialMoney, maxInitialMoney }
    } = this
    return Array(RANGE.group.max)
      .fill(null)
      .map((_, groupIndex) => ({
        roundParams: Array(RANGE.round.max)
          .fill(null)
          .map((_, roundIndex) => ({
            playerInitialMoney: Array(RANGE.groupSize.max)
              .fill(null)
              .map((_, playerIndex) =>
                groupIndex < group && roundIndex < round && playerIndex < groupSize
                  ? ~~(Math.random() * (maxInitialMoney - minInitialMoney)) + minInitialMoney
                  : null
              ),
            K: 1 + +Math.random().toFixed(1)
          }))
      }))
  }

  updatePrivatePrice() {
    const { params, setParams } = this.props
    const groupParams = this.geneGroupParams(params)
    setParams({ groupParams })
  }

  renderBaseFields() {
    const {
      lang,
      props: {
        params: { group, groupSize, round },
        setParams,
        submitable
      },
      state: { activeGroupIndex, activeRoundIndex, minInitialMoney, maxInitialMoney }
    } = this
    const KEY = 'baseFields'
    return (
      <Collapse activeKey={submitable ? null : KEY}>
        <Collapse.Panel key={KEY} header={lang.configuration}>
          <section className={style.baseFields}>
            <ul className={style.configFields}>
              <li>
                <Label label={lang.group} />
                <InputNumber
                  {...RANGE.group}
                  value={group}
                  onChange={value =>
                    this.setState(
                      {
                        activeGroupIndex: value < activeGroupIndex ? +value : activeGroupIndex
                      },
                      () => setParams({ group: +value })
                    )
                  }
                />
              </li>
              <li>
                <Label label={lang.groupSize} />
                <InputNumber
                  {...RANGE.groupSize}
                  value={groupSize}
                  onChange={value =>
                    this.setState(
                      {
                        activeRoundIndex: value < activeRoundIndex ? +value : activeRoundIndex
                      },
                      () => setParams({ groupSize: +value })
                    )
                  }
                />
              </li>
              <li>
                <Label label={lang.round} />
                <InputNumber {...RANGE.round} value={round} onChange={value => setParams({ round: +value })} />
              </li>
              <li>
                <Label label={lang.minInitialMoney} />
                <InputNumber
                  {...RANGE.minInitialMoney}
                  value={minInitialMoney}
                  onChange={value => {
                    this.setState({ minInitialMoney: +value })
                    if (value > maxInitialMoney) {
                      this.setState({ maxInitialMoney: +value })
                    }
                  }}
                />
              </li>
              <li>
                <Label label={lang.maxInitialMoney} />
                <InputNumber
                  {...RANGE.maxInitialMoney}
                  value={maxInitialMoney}
                  onChange={value => {
                    this.setState({ maxInitialMoney: +value })
                    if (value < minInitialMoney) {
                      this.setState({ minInitialMoney: +value })
                    }
                  }}
                />
              </li>
            </ul>
            <div className={style.geneBtnWrapper}>
              <Button type="primary" onClick={() => this.updatePrivatePrice()}>
                {lang.generate}
              </Button>
            </div>
          </section>
        </Collapse.Panel>
      </Collapse>
    )
  }

  render(): React.ReactNode {
    const {
      lang,
      props: {
        params: { group, round, groupParams },
        submitable
      },
      state: { activeGroupIndex, activeRoundIndex }
    } = this
    if (!groupParams) {
      return <MaskLoading />
    }
    const groupIterator = Array(group).fill(null),
      roundIterator = Array(round).fill(null)
    return (
      <section className={style.create}>
        {this.renderBaseFields()}
        <Tabs
          defaultActiveKey={activeGroupIndex.toString()}
          onChange={key => this.setState({ activeGroupIndex: +key })}
        >
          {groupIterator.map((_, i) => (
            <Tabs.TabPane tab={lang.groupIndex(i)} key={i.toString()}>
              <Tabs
                tabPosition="left"
                defaultActiveKey={activeRoundIndex.toString()}
                onChange={key => this.setState({ activeRoundIndex: +key })}
              >
                {roundIterator.map((_, j) => (
                  <Tabs.TabPane tab={lang.roundIndex(j)} key={j.toString()}>
                    {this.renderGroupRound(i, j)}
                  </Tabs.TabPane>
                ))}
              </Tabs>
            </Tabs.TabPane>
          ))}
        </Tabs>
        <div className={style.btnSwitch}>
          {submitable ? <a onClick={() => this.edit()}>{lang.edit}</a> : <a onClick={() => this.done()}>{lang.done}</a>}
        </div>
      </section>
    )
  }

  renderGroupRound(groupIndex: number, roundIndex: number) {
    const {
        lang,
        props: {
          submitable,
          params: { groupParams, groupSize },
          setParams
        }
      } = this,
      { playerInitialMoney, K } = groupParams[groupIndex].roundParams[roundIndex]
    return (
      <>
        <Table
          size="small"
          key={`${groupIndex}-${roundIndex}`}
          dataSource={Array(groupSize)
            .fill(null)
            .map((_, i) => ({
              i,
              player: i + 1
            }))}
          columns={[
            {
              title: lang.player,
              dataIndex: 'player',
              key: 'player'
            },
            {
              title: lang.initialMoney,
              dataIndex: 'i',
              key: 'initialMoney',
              render: i => (
                <InputNumber
                  value={playerInitialMoney[i]}
                  onChange={value => {
                    if (submitable) {
                      return
                    }
                    const _groupParams = cloneDeep(groupParams)
                    _groupParams[groupIndex].roundParams[roundIndex].playerInitialMoney[i] = value as any
                    setParams({ groupParams: _groupParams })
                  }}
                />
              )
            }
          ]}
        />
        <label className={style.kLabel}>{lang.K}</label>
        <InputNumber
          value={K}
          onChange={value => {
            if (submitable) {
              return
            }
            const _groupParams = cloneDeep(groupParams)
            _groupParams[groupIndex].roundParams[roundIndex].K = value as any
            setParams({ groupParams: _groupParams })
          }}
        />
      </>
    )
  }
}
