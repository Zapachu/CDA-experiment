export function loadScript(list:Array<string>, callback = () => null) {
    let loaded = 0

    function loadNext() {
        loadSingleScript(list[loaded], function () {
            loaded++
            if (loaded >= list.length) {
                callback()
            }
            else {
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
    function load(){
        s.parentNode.removeChild(s)
        s.removeEventListener(EVENT_LOAD, load, false)
        callback()
    }
    s.addEventListener(EVENT_LOAD, load, false)
    document.body.appendChild(s)
}