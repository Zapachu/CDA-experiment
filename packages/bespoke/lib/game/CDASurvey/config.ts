export enum MoveType {
  //player
  submitSeatNumber = 'submitSeatNumber',
  answerSurvey = 'answerSurvey',
  sendBackPlayer = 'sendBackPlayer',
  //owner
  startMainTest = 'startMainTest'
}

export enum PushType {
}

export enum FetchType {
  exportXls = 'exportXls'
}

export enum GameStage {
  seatNumber,
  mainTest,
}

export enum SheetType {
  result = 'result'
}

export interface IResult {
  seatNumber: number
  surveyBasic: Array<string>
  surveyFeedback: Array<string>
  surveyTest: Array<string>
}

export enum SURVEY_STAGE {
  basic,
  feedback,
  test,
  over,
}

export const SURVEY_BASIC = [
  {title: '您的年龄是：'},
  {title: '您的性别：', items: ['男', '女']},
  {title: '您是否是经济学相关专业？', items: ['是', '否']},
  {title: '您是否参与过类似的市场实验？', items: ['是', '否']},
  {title: '您如何评价自己对于拍卖/金融市场的了解？', items: ['非常了解', '基本了解', '不了解']}
]

export const SURVEY_FEEDBACK = [
  {title: '您认为在您刚刚参与的市场上有活跃的算法交易者吗？', items: ['有', '没有']},
  {title: '如果您认为在您刚刚参与的市场上有活跃的算法交易者，您认为市场上一共：', blanks: ['有$__$位买家，其中$__$位算法交易者；', '有$__$位卖家，其中$__$位算法交易者；']},
  {title: '如果您认为在您刚刚参与的市场上没有活跃的算法交易者，您认为该市场上一共：', blanks: ['有$__$位买家；', '有$__$位卖家；']},
  {title: '如果您认为在您刚刚参与的市场上有活跃的算法交易者，请您简要描述算法交易者的交易策略？', index: 5},
  {title: '如果如果您认为在您刚刚参与的市场上没有活跃的算法交易者，请您简要描述其他交易者的交易策略？', index: 3}
]

export const SURVEY_TEST = [
  {title: '我时常注意到其他人不会留意的小声音', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意']},
  {title: '当我在阅读故事时， 我觉得很难理解故事人物的想法或动机', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意']},
  {title: '我可以轻易地了解别人跟我说话时背后的含义', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意']},
  {title: '我常把注意力放在事物的整体多过于细节上', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意']},
  {title: '我能意识到别人对我所说的话是否感到闷了', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意']},
  {title: '我觉得同时进行多项任务是容易的', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意']},
  {title: '我可以容易地凭别人的表情来理解他人的想法和情感', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意']},
  {title: '如果我在做事时被干扰了， 可以很快地回头做原先做的事', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意']},
  {title: '我喜欢网罗或收集某种资讯（例如：车类，鸟类，火车类，植物类等）', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意']},
  {title: '我很难理解别人的动机或想法', items: ['完全同意', '稍微同意', '稍微不同意', '完全不同意']}
]
