export default {
  mongouri: process.env.MONGODB || "mongodb://127.0.0.1:27017/academy",
  mongouser: "",
  mongopass: "",

  sessionId: "academy.sid",
  cookieSecret: "academy",
  redishost: process.env.REDIS || "localhost",
  redisport: 6379,
  sessionSecret: process.env.SESSION_SECRET || "sessionsecret",

  rootname: "",
  lobbyUrl: "https://www.microexperiment.cn",
  domain: "microexperiment.cn",
  gameMatchTime: 10, // 多人模式匹配时间 s
  gameRoomSize: 10, // 多人模式每局最大人数
  tokenSecret: "",
  tokenAesKey: ""
};
