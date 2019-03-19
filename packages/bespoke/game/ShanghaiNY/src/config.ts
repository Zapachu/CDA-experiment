import provinces from './provinces'

export const namespace = 'ShanghaiNY'

export enum Stage {
  Seat,
  Test,
  Main,
  Survey,
  End
}

export enum GameType {
  T1 = 1,
  T2
}

export enum Choice {
  OK = -2,
  Wait = -1,
  One = 1,
  Two = 2
}

export enum Version {
  V1 = 1,
  V2,
  V3
}

export enum MoveType {
  //player
  initPosition = 'initPosition',
  inputSeatNumber = 'inputSeatNumber',
  // advanceStageIndex = 'advanceStageIndex',
  answerTest = 'answerTest',
  answerMain = 'answerMain',
  advanceRoundIndex = 'advanceRoundIndex',
  answerSurvey = 'answerSurvey',
  // answerMain2 = 'answerMain2',
  //owner
  assignPosition = 'assignPosition',
  openMarket = 'openMarket',
  //elf
  sendBackPlayer = 'sendBackPlayer'
}

export enum PushType {
}

export enum FetchType {
  exportXls = 'exportXls'
}

export const Test1 = [
  {
    desc: '假设其他三个组员选择“2, 2, 2”',
    questions: [
      {
        title: '如果你选择“1”, 你在这一轮的收益为:',
        options: ['π11', 'π21', 'π22'],
        answer: 'π11'
      }
    ]
  },
  {
    desc: '假设其他三个组员选择“2, 2, 2”',
    questions: [
      {
        title: '如果你选择“2”, 你在这一轮的收益为:',
        options: ['π11', 'π21', 'π22'],
        answer: 'π22'
      }
    ]
  },
  {
    desc: '假设其他三个组员选择“1, 1, 2”',
    questions: [
      {
        title: '如果你选择“2”, 你在这一轮的收益为:',
        options: ['π11', 'π21', 'π22'],
        answer: 'π21'
      }
    ]
  },
]

export const Test2 = [
  {
    desc: '假设其他三个组员选择“2, 2, 2”',
    questions: [
      {
        title: '如果你选择“1”, 你在这一轮的收益为:',
        options: ['π11', 'π21', 'π22'],
        answer: 'π11'
      }
    ]
  }
]

export const Survey = [
  {
    title: '你的专业',
    options: ['人文社科(经济类除外)','理工科','经济/商科','医学','艺术','其他']
  },
  {
    title: '你的年龄',
  },
  {
    title: '你的年级',
    options: ['大一','大二','大三','大四','硕士研究生','博士研究生']
  },
  {
    title: '你现在的家庭住址所在省份',
    options: provinces.map(p => p.pname)
  },
  {
    title: '你的性别',
    options: ['男','女']
  },
]
