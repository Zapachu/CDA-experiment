function loadImg(src: string) {
    return new Promise<HTMLImageElement>(resolve => {
        const img = new Image()
        img.src = src
        img.onload = () => resolve(img)
    })
}

export async function loadImgGroup() {
    return {
        background : await loadImg(require('../../../resource/img/background.png')),
		background2 : await loadImg(require('../../../resource/img/background2.png')),
		body : await loadImg(require('../../../resource/img/body.png')),
		button : await loadImg(require('../../../resource/img/button.png')),
		cursor : await loadImg(require('../../../resource/img/cursor.png')),
		desk : await loadImg(require('../../../resource/img/desk.png')),
		envelope : await loadImg(require('../../../resource/img/envelope.png')),
		hand : await loadImg(require('../../../resource/img/hand.png')),
		handWithHammer : await loadImg(require('../../../resource/img/handWithHammer.png')),
		hat : await loadImg(require('../../../resource/img/hat.png')),
		idea : await loadImg(require('../../../resource/img/idea.png')),
		input : await loadImg(require('../../../resource/img/input.png')),
		painting1 : await loadImg(require('../../../resource/img/painting1.png')),
		painting2 : await loadImg(require('../../../resource/img/painting2.png')),
		painting3 : await loadImg(require('../../../resource/img/painting3.png')),
		painting4 : await loadImg(require('../../../resource/img/painting4.png')),
		painting5 : await loadImg(require('../../../resource/img/painting5.png')),
		winner : await loadImg(require('../../../resource/img/winner.png'))
    }
}

export type TImgGroup = {
    background: HTMLImageElement,
	background2: HTMLImageElement,
	body: HTMLImageElement,
	button: HTMLImageElement,
	cursor: HTMLImageElement,
	desk: HTMLImageElement,
	envelope: HTMLImageElement,
	hand: HTMLImageElement,
	handWithHammer: HTMLImageElement,
	hat: HTMLImageElement,
	idea: HTMLImageElement,
	input: HTMLImageElement,
	painting1: HTMLImageElement,
	painting2: HTMLImageElement,
	painting3: HTMLImageElement,
	painting4: HTMLImageElement,
	painting5: HTMLImageElement,
	winner: HTMLImageElement
}