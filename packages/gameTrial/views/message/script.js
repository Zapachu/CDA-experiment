
var message = (function () {
    var types = ['success', 'warn', 'error']
    var obj = {}
    var delay = 2000
    var animationDelay = 500

    var global = $('<div class="messageUtilBox"></div>')
    $('body').prepend(global)

    function addItem (item) {
        var prefix = ({
            success: '<span class="icon success"> &#10003 </span>',
            warn: '<span class="icon warn">i</span>',
            error: '<span class="icon error">&#10005</span>'
        }) [item.type]
        var label = '<span class="label">' + item.data + '</span>'
        var content = prefix + label
        var child = $('<div class="item" style="height: 0">'+ content + '</div>')

        global.append(child)
        child.animate({
            height: 40
        }, animationDelay)
        setTimeout(function () {
            child.animate({
                height: 0,
                padding: 0
            }, animationDelay)

            setTimeout(function () {
                child.remove()
            }, animationDelay)
        }, delay)
    }

    function handler (type, text) {
        addItem({
            type: type,
            data: text
        })
    }

    types.forEach(type => obj[type] = handler.bind(null, type))
    return obj
})()