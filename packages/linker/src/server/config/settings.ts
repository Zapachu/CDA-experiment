export default {
    port: process.env.PORT || 4000,
    mongoUri: process.env.MONGODB || 'mongodb://127.0.0.1:27017/academy',
    mongoUser: '',
    mongoPass: '',
    redisHost: process.env.REDIS || '127.0.0.1',
    redisPort: 6379,
    sessionSecret: process.env.SESSION_SECRET || 'sessionsecret',
    //rpc
    academusServicesUri: '127.0.0.1:53008',
    //other
    localRootUrl: 'http://127.0.0.1'
}