export default {
    mongouri: process.env.MONGODB || 'mongodb://127.0.0.1:27017/whuipo',
    mongouser: '',
    mongopass: '',

    sessionId: 'whuipo.sid',
    cookieSecret: 'academy',
    redishost: process.env.REDIS || 'localhost',
    redisport: 6379,
    sessionSecret: process.env.SESSION_SECRET || 'sessionsecret',

    rootname: '',
    socketPath: '/socket'
}