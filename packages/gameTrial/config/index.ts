export default {
  rootname: '/gametrial',
  lobbyUrl: 'https://www.ancademy.org/gametrial', // 游戏大厅地址
  namespace: '', //主站 路由前缀  当为根目录时请置空 '' 而不是 '/'
  domain: 'microexperiment.cn',
  gameMatchTime: 10, // 多人模式匹配时间 s
  gameRoomSize: 10, // 多人模式每局最大人数

  recordExpire: 3600 * 24 * 356 * 10 // redis记录用户状态时间  在dev模式下建议调短
}
