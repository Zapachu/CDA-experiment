enum PrepareState {
  normal = 'normal',
  match = 'match'
}

class Prepare extends Scene<PrepareState> {
  key = GameScene.prepare
  countDown: eui.Label
  waitLabel: eui.Label
  i = 1

  protected childrenCreated(): void {
    super.childrenCreated()
    IO.emit(MoveType.getIndex)
  }

  render() {
    const {
      gameState: { prepareTime, playerIndex }
    } = IO
    this.countDown.text = (Config.PREPARE_TIME - prepareTime).toString()
    this.waitLabel.text = `等待其它玩家加入(${playerIndex}/${Config.PLAYER_NUM})${'...   '.substr(
      3 - (this.i++ % 4),
      3
    )}`
    if (IO.gameState.prepareTime) {
      this.switchState(PrepareState.match)
    }
  }
}
