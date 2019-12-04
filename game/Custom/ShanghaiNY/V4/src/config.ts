import provinces from './provinces'

export const namespace = 'ShanghaiNYV4'

export enum Stage {
  Seat,
  Test,
  Main,
  Survey,
  End
}

export enum Mode {
  HR,
  LR,
  BR
}

export enum Min {
  A,
  B
}

export enum Choice {
  Null = -1,
  Wait,
  One,
  Two
}

export enum MainStageIndex {
  Choose = 0,
  Wait4Result,
  Result
}

export enum TestStageIndex {
  Interface = -1,
  Next = -2,
  Wait4Others = -3
}

export enum MoveType {
  //player
  initPosition = 'initPosition',
  inputSeatNumber = 'inputSeatNumber',
  answerTest = 'answerTest',
  answerMain = 'answerMain',
  advanceRoundIndex = 'advanceRoundIndex',
  answerSurvey = 'answerSurvey',
  toMain = 'toMain',
  //owner
  startTest = 'startTest',
  // assignPosition = 'assignPosition',
  // openMarket = 'openMarket',
  //elf
  sendBackPlayer = 'sendBackPlayer'
}

export enum SheetType {
  result = 'result'
}

export enum PushType {}

export enum FetchRoute {
  exportXls = '/exportXls/:gameId:',
  exportXlsPlaying = '/exportXlsPlaying/:gameId'
}

export interface Word {
  text: string
  color?: boolean
  br?: number
}

export function getTest(
  mode: Mode
): Array<{
  desc: Array<Word>
  questions: Array<{
    title: Array<Word>
    options: Array<string | { label: string; value: string }> | Function
    answer: string | Function
  }>
}> {
  switch (mode) {
    case Mode.HR:
      return [
        {
          desc: [
            { text: '如果你在第一阶段选择等待。' },
            { text: '', br: 10 },
            { text: '并且第一阶段的结果为：有1人选1。', color: true }
          ],
          questions: [
            {
              title: [
                { text: '如果你在第二阶段选择' },
                {
                  text:
                    '“第一阶段有0人、1人、2人、3人选1，则在第二阶段选1”（即无论第一阶段有几人选1，在第二阶段都选1）',
                  color: true
                },
                { text: '', br: 0 },
                { text: '你在这一轮的收益为' }
              ],
              options: (displayData, d) => [
                { label: (displayData.p11 - d).toFixed(2), value: 'a' },
                { label: displayData.p21.toFixed(2), value: 'b' },
                { label: displayData.p22.toFixed(2), value: 'c' }
              ],
              answer: 'a'
            },
            {
              title: [
                { text: '如果你选择' },
                {
                  text: '“第一阶段有0人选1，则在第二阶段选2；有1人、2人、3人选1，则在第二阶段选1”',
                  color: true
                },
                { text: '', br: 0 },
                { text: '你在这一轮的收益为' }
              ],
              options: (displayData, d) => [
                { label: (displayData.p11 - d).toFixed(2), value: 'a' },
                { label: displayData.p21.toFixed(2), value: 'b' },
                { label: displayData.p22.toFixed(2), value: 'c' }
              ],
              answer: 'a'
            },
            {
              title: [
                { text: '如果你选择' },
                {
                  text: '“第一阶段有0人、1人、2人选1，则在第二阶段选2；有3人选1，则在第二阶段选1”',
                  color: true
                },
                { text: '', br: 0 },
                { text: '你在这一轮的收益为' }
              ],
              options: (displayData, d) => [
                { label: displayData.p11.toFixed(2), value: 'a' },
                { label: displayData.p21.toFixed(2), value: 'b' },
                { label: displayData.p22.toFixed(2), value: 'c' }
              ],
              answer: 'b'
            }
          ]
        },
        {
          desc: [
            { text: '假设其他三个组员都选择' },
            { text: '“在第一阶段选1”', color: true },
            { text: '', br: 10 },
            { text: '如果你选择' },
            {
              text: '“在第一阶段选1”',
              color: true
            }
          ],
          questions: [
            {
              title: [{ text: '第一阶段的结果是：' }],
              options: [
                { label: '第一阶段有0人选1', value: 'a' },
                { label: '第一阶段有1人选1', value: 'b' },
                { label: '第一阶段有2人选1', value: 'c' },
                { label: '第一阶段有3人选1', value: 'd' },
                { label: '第一阶段有4人选1', value: 'e' }
              ],
              answer: 'e'
            },
            {
              title: [{ text: '四个组员的最终选择为：' }],
              options: [
                { label: '1,1,1,1', value: 'a' },
                { label: '1,2,2,2', value: 'b' },
                { label: '2,2,2,2', value: 'c' }
              ],
              answer: 'a'
            },
            {
              title: [{ text: '你在这一轮的收益为:' }],
              options: (displayData, d) => [
                { label: displayData.p11.toFixed(2), value: 'a' },
                { label: displayData.p21.toFixed(2), value: 'b' },
                { label: displayData.p22.toFixed(2), value: 'c' }
              ],
              answer: 'a'
            }
          ]
        },
        {
          desc: [
            { text: '假设其他三个组员都选择' },
            {
              text: '“在第一阶段选1”',
              color: true
            },
            { text: '', br: 10 },
            { text: '如果你选择' },
            {
              text: '“在第一阶段等待； 如果第一阶段有0人选1则在第二阶段选2； 如果有1，2，3人选1，则在第二阶段选1”',
              color: true
            }
          ],
          questions: [
            {
              title: [{ text: '第一阶段的结果是：' }],
              options: [
                { label: '第一阶段有0人选1', value: 'a' },
                { label: '第一阶段有1人选1', value: 'b' },
                { label: '第一阶段有2人选1', value: 'c' },
                { label: '第一阶段有3人选1', value: 'd' },
                { label: '第一阶段有4人选1', value: 'e' }
              ],
              answer: 'd'
            },
            {
              title: [{ text: '四个组员的最终选择为：' }],
              options: [
                { label: '1,1,1,1', value: 'a' },
                { label: '1,2,2,2', value: 'b' },
                { label: '2,2,2,2', value: 'c' }
              ],
              answer: 'a'
            },
            {
              title: [{ text: '你在这一轮的收益为:' }],
              options: (displayData, d) => [
                { label: (displayData.p11 - d).toFixed(2), value: 'a' },
                { label: displayData.p21.toFixed(2), value: 'b' },
                { label: displayData.p22.toFixed(2), value: 'c' }
              ],
              answer: 'a'
            }
          ]
        },
        {
          desc: [
            { text: '假设其他三个组员都选择' },
            {
              text:
                '“在第一阶段等待； 如果第一阶段有0人、1人选1则在第二阶段选2； 第一阶段有2人、3人选1则在第二阶段选1”',
              color: true
            },
            { text: '', br: 10 },
            { text: '如果你选择' },
            {
              text: '“在第一阶段选1”',
              color: true
            }
          ],
          questions: [
            {
              title: [{ text: '第一阶段的结果是：' }],
              options: [
                { label: '第一阶段有0人选1', value: 'a' },
                { label: '第一阶段有1人选1', value: 'b' },
                { label: '第一阶段有2人选1', value: 'c' },
                { label: '第一阶段有3人选1', value: 'd' },
                { label: '第一阶段有4人选1', value: 'e' }
              ],
              answer: 'b'
            },
            {
              title: [{ text: '四个组员的最终选择为：' }],
              options: [
                { label: '1,1,1,1', value: 'a' },
                { label: '1,2,2,2', value: 'b' },
                { label: '2,2,2,2', value: 'c' }
              ],
              answer: 'b'
            },
            {
              title: [{ text: '你在这一轮的收益为:' }],
              options: (displayData, d) => [
                { label: displayData.p11.toFixed(2), value: 'a' },
                { label: displayData.p21.toFixed(2), value: 'b' },
                { label: displayData.p22.toFixed(2), value: 'c' }
              ],
              answer: 'a'
            }
          ]
        },
        {
          desc: [
            { text: '假设其他三个组员都选择' },
            {
              text:
                '“在第一阶段等待； 如果第一阶段有0人选1则在第二阶段选2； 第一阶段有1人、2人、3人选1则在第二阶段选1”',
              color: true
            },
            { text: '', br: 10 },
            { text: '如果你选择' },
            {
              text:
                '“在第一阶段等待； 如果第一阶段有0人选1则在第二阶段选2； 第一阶段有1人、2人、3人选1则在第二阶段选1”',
              color: true
            }
          ],
          questions: [
            {
              title: [{ text: '第一阶段的结果是：' }],
              options: [
                { label: '第一阶段有0人选1', value: 'a' },
                { label: '第一阶段有1人选1', value: 'b' },
                { label: '第一阶段有2人选1', value: 'c' },
                { label: '第一阶段有3人选1', value: 'd' },
                { label: '第一阶段有4人选1', value: 'e' }
              ],
              answer: 'a'
            },
            {
              title: [{ text: '四个组员的最终选择为：' }],
              options: [
                { label: '1,1,1,1', value: 'a' },
                { label: '1,2,2,2', value: 'b' },
                { label: '2,2,2,2', value: 'c' }
              ],
              answer: 'c'
            },
            {
              title: [{ text: '你在这一轮的收益为:' }],
              options: (displayData, d) => [
                { label: (displayData.p11 - d).toFixed(2), value: 'a' },
                { label: displayData.p21.toFixed(2), value: 'b' },
                { label: displayData.p22.toFixed(2), value: 'c' }
              ],
              answer: 'c'
            }
          ]
        }
      ]
    case Mode.LR:
      return [
        {
          desc: [
            { text: '假设其他三个组员都选择' },
            { text: '“在第一阶段等待；在第二阶段，如果有0、1人选2，则选1；如果有2、3人选2，则选2”', color: true },
            { text: '', br: 10 },
            { text: '如果你选择' },
            { text: '“在第一阶段选2”', color: true }
          ],
          questions: [
            {
              title: [{ text: '第一阶段的结果是：' }],
              options: [
                { label: '第一阶段有0人选2', value: 'a' },
                { label: '第一阶段有1人选2', value: 'b' },
                { label: '第一阶段有2人选2', value: 'c' },
                { label: '第一阶段有3人选2', value: 'd' },
                { label: '第一阶段有4人选2', value: 'e' }
              ],
              answer: 'b'
            },
            {
              title: [{ text: '四个组员的最终选择为：' }],
              options: [
                { label: '1,1,1,1', value: 'a' },
                { label: '2,1,1,1', value: 'b' },
                { label: '2,2,2,2', value: 'c' }
              ],
              answer: 'b'
            },
            {
              title: [{ text: '你在这一轮的收益为:' }],
              options: (displayData, d) => [
                { label: displayData.p11.toFixed(2), value: 'a' },
                { label: displayData.p21.toFixed(2), value: 'b' },
                { label: displayData.p22.toFixed(2), value: 'c' }
              ],
              answer: 'b'
            }
          ]
        },
        {
          desc: [
            { text: '假设其他三个组员都选择' },
            {
              text: '“在第一阶段等待；在第二阶段，如果有0人选2，则选1；如果有1、2、3人选2，则选2”',
              color: true
            },
            { text: '', br: 10 },
            { text: '如果你选择' },
            {
              text: '“在第一阶段等待；在第二阶段，如果有0、1人选2，则选1；如果有2、3人选2，则选2”',
              color: true
            }
          ],
          questions: [
            {
              title: [{ text: '第一阶段的结果是：' }],
              options: [
                { label: '第一阶段有0人选2', value: 'a' },
                { label: '第一阶段有1人选2', value: 'b' },
                { label: '第一阶段有2人选2', value: 'c' },
                { label: '第一阶段有3人选2', value: 'd' },
                { label: '第一阶段有4人选2', value: 'e' }
              ],
              answer: 'a'
            },
            {
              title: [{ text: '四个组员的最终选择为：' }],
              options: [
                { label: '1,1,1,1', value: 'a' },
                { label: '1,2,2,2', value: 'b' },
                { label: '2,2,2,2', value: 'c' }
              ],
              answer: 'a'
            },
            {
              title: [{ text: '你在这一轮的收益为:' }],
              options: (displayData, d) => [
                { label: displayData.p11.toFixed(2), value: 'a' },
                { label: displayData.p21.toFixed(2), value: 'b' },
                { label: displayData.p22.toFixed(2), value: 'c' }
              ],
              answer: 'a'
            }
          ]
        }
      ]
    case Mode.BR:
      return [
        {
          desc: [
            { text: '假设其他三个组员都选择' },
            {
              text: '“在第一阶段选2；在第二阶段，如果第一阶段有1、2、3人选1，则选1；如果第一阶段有0人选1，则选2”',
              color: true
            },
            { text: '', br: 10 },
            { text: '如果你选择' },
            {
              text: '“在第一阶段选2；在第二阶段，如果第一阶段有1、2、3人选1，则选1；如果第一阶段有0人选1，则选2”',
              color: true
            }
          ],
          questions: [
            {
              title: [{ text: '第一阶段的结果是：' }],
              options: [
                { label: '第一阶段有0人选1', value: 'a' },
                { label: '第一阶段有1人选1', value: 'b' },
                { label: '第一阶段有2人选1', value: 'c' },
                { label: '第一阶段有3人选1', value: 'd' },
                { label: '第一阶段有4人选1', value: 'e' }
              ],
              answer: 'a'
            },
            {
              title: [{ text: '四个组员的最终选择为：' }],
              options: [
                { label: '1,1,1,1', value: 'a' },
                { label: '1,2,2,2', value: 'b' },
                { label: '2,2,2,2', value: 'c' }
              ],
              answer: 'c'
            },
            {
              title: [{ text: '你在这一轮的收益为:' }],
              options: (displayData, d) => [
                { label: displayData.p11.toFixed(2), value: 'a' },
                { label: displayData.p21.toFixed(2), value: 'b' },
                { label: displayData.p22.toFixed(2), value: 'c' }
              ],
              answer: 'c'
            }
          ]
        },
        {
          desc: [
            { text: '假设其他三个组员都选择' },
            {
              text: '“在第一阶段选1；在第二阶段，如果第一阶段有3、4人选1，则选1；如果第一阶段有1、2人选1，则选2”',
              color: true
            },
            { text: '', br: 10 },
            { text: '如果你选择' },
            {
              text: '“在第一阶段选2；在第二阶段，如果第一阶段有1、2、3人选1，则选1；如果第一阶段有0人选1，则选2”',
              color: true
            }
          ],
          questions: [
            {
              title: [{ text: '第一阶段的结果是：' }],
              options: [
                { label: '第一阶段有0人选1', value: 'a' },
                { label: '第一阶段有1人选1', value: 'b' },
                { label: '第一阶段有2人选1', value: 'c' },
                { label: '第一阶段有3人选1', value: 'd' },
                { label: '第一阶段有4人选1', value: 'e' }
              ],
              answer: 'd'
            },
            {
              title: [{ text: '四个组员的最终选择为：' }],
              options: [
                { label: '1,1,1,1', value: 'a' },
                { label: '1,2,2,2', value: 'b' },
                { label: '2,2,2,2', value: 'c' }
              ],
              answer: 'a'
            },
            {
              title: [{ text: '你在这一轮的收益为:' }],
              options: (displayData, d) => [
                { label: (displayData.p11 - d).toFixed(2), value: 'a' },
                { label: (displayData.p21 - d).toFixed(2), value: 'b' },
                { label: displayData.p22.toFixed(2), value: 'c' }
              ],
              answer: 'a'
            }
          ]
        },
        {
          desc: [
            { text: '假设其他三个组员都选择' },
            {
              text: '“在第一阶段选2；在第二阶段，如果第一阶段有1、2、3人选1，则选1；如果第一阶段有0人选1，则选2”',
              color: true
            },
            { text: '', br: 10 },
            { text: '如果你选择' },
            {
              text: '“在第一阶段选1；在第二阶段，如果第一阶段有2、3、4人选1，则选1；如果第一阶段有1人选1，则选2”',
              color: true
            }
          ],
          questions: [
            {
              title: [{ text: '第一阶段的结果是：' }],
              options: [
                { label: '第一阶段有0人选1', value: 'a' },
                { label: '第一阶段有1人选1', value: 'b' },
                { label: '第一阶段有2人选1', value: 'c' },
                { label: '第一阶段有3人选1', value: 'd' },
                { label: '第一阶段有4人选1', value: 'e' }
              ],
              answer: 'b'
            },
            {
              title: [{ text: '四个组员的最终选择为：' }],
              options: [
                { label: '1,1,1,1', value: 'a' },
                { label: '2,1,1,1', value: 'b' },
                { label: '2,2,2,2', value: 'c' }
              ],
              answer: 'b'
            },
            {
              title: [{ text: '你在这一轮的收益为:' }],
              options: (displayData, d) => [
                { label: (displayData.p11 - d).toFixed(2), value: 'a' },
                { label: (displayData.p21 - d).toFixed(2), value: 'b' },
                { label: (displayData.p22 - d).toFixed(2), value: 'c' }
              ],
              answer: 'b'
            }
          ]
        }
      ]
  }
}

export const Survey = [
  {
    title: '你的专业',
    options: ['人文社科(经济类除外)', '理工科', '经济/商科', '医学', '艺术', '其他']
  },
  {
    title: '你的年龄'
  },
  {
    title: '你的年级',
    options: ['大一', '大二', '大三', '大四', '硕士研究生', '博士研究生']
  },
  {
    title: '你现在的家庭住址所在省份',
    options: provinces.map(p => p.pname)
  },
  {
    title: '你的性别',
    options: ['男', '女']
  }
]

export interface ICreateParams {
  playersPerGroup: number
  rounds: number
  mode: Mode
  min: Min
  a: number
  b: number
  c: number
  d: number
  eH: number
  eL: number
  s: number
  p: number
  participationFee: number
}

export interface IGameState {
  groups: IGameGroupState[]
}

export interface IGameGroupState {
  playerNum: number
  rounds: {
    one1
    two1
    wait1
    x: number
    y: number
    min: number
  }[]
}

export interface IPlayerState {
  groupIndex: number
  positionIndex: number
  seatNumber: string
  stage: number
  stageIndex: number
  choices?: PlayerState.IChoice[] | null
  profits: number[]
  finalProfit: number
  surveyAnswers: string[]
  roundIndex: number
  mobile: string
}

export namespace PlayerState {
  export interface IChoice {
    c1: number
    c2: number[]
    c?: number
  }
}

export interface IMoveParams {
  seatNumber: string
  c1: number
  c2: number[]
  surveys: string[]
  nextRoundIndex: number
}

export interface IPushParams {}
