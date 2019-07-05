'use strict'

const generateInsertScript = (nextPhaseUrl) => {
    return `
    <script>
        (function () {
            setInterval(() => {
                console.log('debug: find end sign')
                if (document.getElementById('EndOfSurvey')) {
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