export const namespace = 'CognitiveReaction'

export enum MoveType {
  //player
  submitSeatNumber = 'submitSeatNumber',
  answer = 'answer',
  sendBackPlayer = 'sendBackPlayer',
  //owner
  startMainTest = 'startMainTest'
}

export enum PushType {}

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum GameStage {
  seatNumber,
  mainTest
}

export enum SheetType {
  result = 'result'
}

export interface IResult {
  seatNumber: number
  answers: Array<string>
}

export enum PlayerStage {
  playing,
  over
}

export const QUESTIONS = [
  {
    title: '一副球拍和一个球一共价值1.10美元，球拍比球贵1美元，请问球的单价是多少钱?',
    unit: '美元'
  },
  {
    title: '如果5台机器5分钟可以生产5个零件，那么100台机器生产100个零件需要多长时间?',
    unit: '分钟'
  },
  {
    title:
      '湖里有一片睡莲。每一天，睡莲的覆盖面积都是原来的两倍。如果睡莲覆盖整个湖需要48天，那么睡莲覆盖半个湖需要多长时间?',
    unit: '天'
  },
  {
    title: '如果约翰6天能喝一桶水，玛丽12天能喝一桶水，他们一起喝一桶水能喝多长时间?',
    unit: '天'
  },
  {
    title: '杰里的成绩在班里是顺数第15名，也是倒数第15名。这个班有多少名学生?',
    unit: '名'
  },
  {
    title: '一个人花60美元买了一头猪，卖了70美元，又花80美元买回来，最后卖了90美元。他赚了多少钱?',
    unit: '美元'
  },
  {
    title:
      '2008年初的一天，西蒙决定在股市投资8000美元。在他投资六个月后的7月17日，他购买的股票下跌了50%。幸运的是，从7月17日到10月17日，西蒙购买的股票上涨了75%。此时，相对于最开始投资，西蒙已经:',
    options: [
      { label: 'A. 在股票市场盈亏平衡', value: 'A' },
      { label: 'B. 赚钱了', value: 'B' },
      { label: 'C. 赔钱了', value: 'C' }
    ]
  }
]
