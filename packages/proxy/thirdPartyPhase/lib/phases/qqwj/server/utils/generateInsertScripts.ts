'use strict'

const generateInsertScript = (nextPhaseUrl) => {
    return `
    <script>
        function Timer(fn, t) {
            var timerObj = setInterval(fn, t)
            this.stop = function() {
                if (timerObj) {
                    clearInterval(timerObj)
                    timerObj = null
                }
                return this
            }
        
            this.start = function() {
                if (!timerObj) {
                    this.stop()
                    timerObj = setInterval(fn, t)
                }
                return this
            }
        
            this.reset = function(newT) {
                t = newT
                return this.stop().start()
            }
        }
        (function () {
            Timer(() => {
                console.warn('debug: find end sign')
                if (document.getElementsByClassName('survey_suffix') && $('.survey_suffix').css('display') != 'none') {
                    window.location.href = '${nextPhaseUrl}'
                }
            }, 2000)
        })()
    </script>
    `
}

export {
    generateInsertScript
}