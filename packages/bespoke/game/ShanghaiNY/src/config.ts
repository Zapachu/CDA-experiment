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
  T2 = 2
}

export enum Choice {
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

export enum SheetType {
  result = 'result',
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
    desc: '如果你在第一阶段选择等待。并且第一阶段的结果为：有人选1。',
    questions: [
      {
        title: '如果你选择“第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选1”（无论第一阶段有没有人选1，在第二阶段都选1）你在这一轮的收益为',
        options: ['π11', 'π21', 'π22'],
        answer: 'π11'
      },
      {
        title: '如果你选择“第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2” 你在这一轮的收益为',
        options: ['π11', 'π21', 'π22'],
        answer: 'π11'
      },
      {
        title: '如果你选择“第一阶段有人选1则在第二阶段选2；第一阶段没有人选1则在第二阶段选2”（无论第一阶段有没有人选1，在第二阶段都选2）你在这一轮的收益为',
        options: ['π11', 'π21', 'π22'],
        answer: 'π21'
      },
    ]
  },
  {
    desc: '假设其他三个组员都选择“在第一阶段选1”。如果你选择“在第一阶段选1”',
    questions: [
      {
        title: '第一阶段的结果是：',
        options: ['第一阶段有人选1', '第一阶段没有人选1'],
        answer: '第一阶段有人选1'
      },
      {
        title: '四个组员的最终选择为：',
        options: ['1,1,1,1', '1,2,2,2', '2,2,2,2'],
        answer: '1,1,1,1'
      },
      {
        title: '你在这一轮的收益为:',
        options: ['π11', 'π21', 'π22'],
        answer: 'π11'
      },
    ]
  },
  {
    desc: '假设其他三个组员都选择“在第一阶段选1”。如果你选择“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”',
    questions: [
      {
        title: '第一阶段的结果是：',
        options: ['第一阶段有人选1', '第一阶段没有人选1'],
        answer: '第一阶段有人选1'
      },
      {
        title: '四个组员的最终选择为：',
        options: ['1,1,1,1', '1,2,2,2', '2,2,2,2'],
        answer: '1,1,1,1'
      },
      {
        title: '你在这一轮的收益为:',
        options: ['π11', 'π21', 'π22'],
        answer: 'π11'
      },
    ]
  },
  {
    desc: '假设其他三个组员都选择“在第一阶段等待；无论第一阶段有没有人选1，在第二阶段都选1”。如果你选择“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”',
    questions: [
      {
        title: '第一阶段的结果是：',
        options: ['第一阶段有人选1', '第一阶段没有人选1'],
        answer: '第一阶段没有人选1'
      },
      {
        title: '四个组员的最终选择为：',
        options: ['1,1,1,1', '1,1,1,2', '2,2,2,2'],
        answer: '1,1,1,2'
      },
      {
        title: '你在这一轮的收益为:',
        options: ['π11', 'π21', 'π22'],
        answer: 'π21'
      },
    ]
  },
  {
    desc: '假设其他三个组员都选择“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”。如果你选择“在第一阶段选1”',
    questions: [
      {
        title: '第一阶段的结果是：',
        options: ['第一阶段有人选1', '第一阶段没有人选1'],
        answer: '第一阶段有人选1'
      },
      {
        title: '四个组员的最终选择为：',
        options: ['1,1,1,1', '1,1,1,2', '2,2,2,2'],
        answer: '1,1,1,1'
      },
      {
        title: '你在这一轮的收益为:',
        options: ['π11', 'π21', 'π22'],
        answer: 'π11'
      },
    ]
  },
  {
    desc: '假设其他三个组员都选择“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”。如果你选择“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”',
    questions: [
      {
        title: '第一阶段的结果是：',
        options: ['第一阶段有人选1', '第一阶段没有人选1'],
        answer: '第一阶段没有人选1'
      },
      {
        title: '四个组员的最终选择为：',
        options: ['1,1,1,1', '1,2,2,2', '2,2,2,2'],
        answer: '2,2,2,2'
      },
      {
        title: '你在这一轮的收益为:',
        options: ['π11', 'π21', 'π22'],
        answer: 'π22'
      },
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