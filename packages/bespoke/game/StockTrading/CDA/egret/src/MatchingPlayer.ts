type MatchingPlayerState = 'in' | 'out'

class MatchingPlayer extends eui.ItemRenderer {
    _state: MatchingPlayerState
    data: boolean
    labelDisplay

    set state(state: MatchingPlayerState) {
        this.invalidateState()
        this._state = state
    }

    protected getCurrentState(): string {
        return this._state
    }

    protected dataChanged(): void {
        console.log(this.data)
        this.state = this.data ? "in" : "out"
    }
}