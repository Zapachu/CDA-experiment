/**
 *  options: {maskCloseable, onClose }
 * **/
var Modal = function(selector, options) {
  var ele = $(selector)
  ele.hide()
  ele.addClass('modal')
  options = options || {}
  if (options.maskCloseable) {
    $(selector + ' .content').click(function(e) {
      e.stopPropagation()
    })
  }

  function handleMaskClick() {
    instance.close()
  }

  var instance = {
    isOpen: false,
    open: function(e) {
      if (ele.is(':visible')) {
        return
      }
      if (options.maskCloseable) {
        window.addEventListener('click', handleMaskClick)
      }
      instance.isOpen = true
      ele.fadeIn(600)
      if (e) {
        e.stopPropagation()
      }
    },
    close: function() {
      if (ele.is(':hidden')) {
        return
      }
      instance.isOpen = false
      window.removeEventListener('click', handleMaskClick)
      ele.fadeOut(500)
      if (options.onClose) {
        options.onClose()
      }
    }
  }
  return instance
}
