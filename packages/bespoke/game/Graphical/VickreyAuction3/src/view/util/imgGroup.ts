function loadImg(src: string) {
    return new Promise<HTMLImageElement>(resolve => {
        const img = new Image()
        img.src = src
        img.onload = () => resolve(img)
    })
}

export async function loadImgGroup() {
    return {
        button : await loadImg(require('../../../resource/img/button.svg')),
		dialog : await loadImg(require('../../../resource/img/dialog.svg')),
		envelope_closing : await loadImg(require('../../../resource/img/envelope_closing.gif')),
		envelope_open : await loadImg(require('../../../resource/img/envelope_open.svg')),
		host : await loadImg(require('../../../resource/img/host.svg')),
		idea : await loadImg(require('../../../resource/img/idea.svg')),
		input : await loadImg(require('../../../resource/img/input.svg')),
		painting1 : await loadImg(require('../../../resource/img/painting1.svg')),
		painting2 : await loadImg(require('../../../resource/img/painting2.svg')),
		painting3 : await loadImg(require('../../../resource/img/painting3.svg')),
		painting4 : await loadImg(require('../../../resource/img/painting4.svg')),
		painting5 : await loadImg(require('../../../resource/img/painting5.svg')),
		playerL : await loadImg(require('../../../resource/img/playerL.svg')),
		playerL_dealed : await loadImg(require('../../../resource/img/playerL_dealed.svg')),
		playerR : await loadImg(require('../../../resource/img/playerR.svg')),
		playerR_dealed : await loadImg(require('../../../resource/img/playerR_dealed.svg')),
		roundSwitching : await loadImg(require('../../../resource/img/roundSwitching.gif')),
		shadow : await loadImg(require('../../../resource/img/shadow.svg')),
		shadow_player : await loadImg(require('../../../resource/img/shadow_player.gif')),
		winner : await loadImg(require('../../../resource/img/winner.gif'))
    }
}

export type TImgGroup = {
    button: HTMLImageElement,
	dialog: HTMLImageElement,
	envelope_closing: HTMLImageElement,
	envelope_open: HTMLImageElement,
	host: HTMLImageElement,
	idea: HTMLImageElement,
	input: HTMLImageElement,
	painting1: HTMLImageElement,
	painting2: HTMLImageElement,
	painting3: HTMLImageElement,
	painting4: HTMLImageElement,
	painting5: HTMLImageElement,
	playerL: HTMLImageElement,
	playerL_dealed: HTMLImageElement,
	playerR: HTMLImageElement,
	playerR_dealed: HTMLImageElement,
	roundSwitching: HTMLImageElement,
	shadow: HTMLImageElement,
	shadow_player: HTMLImageElement,
	winner: HTMLImageElement
}