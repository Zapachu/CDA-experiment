type State = 'normal' | 'hover' | 'active'

class ButtonGameMode extends eui.Component implements eui.UIComponent {
    private _state: State

    label: eui.Label
    subLabel: eui.Label

    constructor(){
        super()
    }

    protected childrenCreated(): void {
        this.invalidateState()
    }

    protected getCurrentState(): string {
        return this._state
    }

    setLabel(label:string, subLabel:string):ButtonGameMode{
        this.label.text = label
        this.subLabel.text = subLabel
        return this
    }

    set state(state: State) {
        this.invalidateState()
        this._state = state
    }

}