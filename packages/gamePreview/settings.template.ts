export default {
    mongouri: process.env.MONGODB || 'mongodb://127.0.0.1:27017/academy',
    mongouser: '',
    mongopass: '',

    sessionId: 'academy.sid',
    cookieSecret: 'academy',
    redishost: process.env.REDIS || 'localhost',
    redisport: 6379,
    sessionSecret: process.env.SESSION_SECRET || 'sessionsecret',

    rootname: '/gametrial',
    lobbyUrl: 'http://localhost:3020', // 游戏大厅地址
    domain: 'microexperiment.cn',
    gameMatchTime:  10, // 多人模式匹配时间 s
    gameRoomSize: 10, // 多人模式每局最大人数 

    recordExpire: 3600 * 24 * 356 * 10, // redis记录用户状态时间  在dev模式下建议调短
}