import {baseEnum} from 'bespoke-common'

export function loadScript(list: Array<string>, callback = () => null) {
    let loaded = 0

    function loadNext() {
        loadSingleScript(list[loaded], function () {
            loaded++
            if (loaded >= list.length) {
                callback()
            } else {
                loadNext()
            }
        })
    }

    loadNext()
}

function loadSingleScript(src: string, callback = () => null) {
    const EVENT_LOAD = 'load'
    const s = document.createElement('script')
    s.async = false
    s.src = src

    function load() {
        s.parentNode.removeChild(s)
        s.removeEventListener(EVENT_LOAD, load, false)
        callback()
    }

    s.addEventListener(EVENT_LOAD, load, false)
    document.body.appendChild(s)
}

export function loadThirdPartyLib(target: baseEnum.ThirdPartyLib, callback = ()=>null) {
    switch (target) {
        case baseEnum.ThirdPartyLib.egret: {
            loadScript([
                'https://qiniu0.anlint.com/egret/5.2.13/module/egret.min.js',
                'https://qiniu0.anlint.com/egret/5.2.13/module/egret.web.min.js',
                'https://qiniu0.anlint.com/egret/5.2.13/module/game.min.js',
                'https://qiniu0.anlint.com/egret/5.2.13/module/tween.min.js',
                'https://qiniu0.anlint.com/egret/5.2.13/module/assetsmanager.min.js',
                'https://qiniu0.anlint.com/egret/5.2.13/module/promise.min.js',
            ],callback)
            break
        }
        case baseEnum.ThirdPartyLib.phaser:{
            loadScript([
                'https://cdn.jsdelivr.net/npm/phaser@3.16.2/dist/phaser.min.js'
            ], callback)
        }
    }
}
