import * as React from 'react'

interface ITimerState {
  time: number
}

export default class Timer extends React.Component<{}, ITimerState> {
  interval: number
  state: ITimerState = {
    time: 0
  }

  componentDidMount() {
    clearInterval(this.interval)
    this.interval = window.setInterval(() => {
      this.setState(({ time }) => ({
        time: time + 1
      }))
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return <em>{this.state.time}</em>
  }
}
