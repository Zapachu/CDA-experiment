'use strict'

const generateInsertScript = () => {
    return `
    
    <script>
        (function () {
            var winW = 0, winH = 0;
            if (document.body && document.body.offsetWidth) {
                winW = document.body.offsetWidth;
                winH = document.body.offsetHeight;
            }
            if (document.compatMode=='CSS1Compat' &&
                document.documentElement &&
                document.documentElement.offsetWidth ) {
                winW = document.documentElement.offsetWidth;
                winH = document.documentElement.offsetHeight;
            }
            if (window.innerWidth && window.innerHeight) {
                winW = window.innerWidth;
                winH = window.innerHeight;
            }
            console.log(winW, winH);
            var myHeaders = new Headers();
            myHeaders['Content-Type'] = 'application/json; charset=utf-8'
            var init = {
                credentials: 'include',
                method: 'POST',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default',
                body: {winW, winH}
            };
            fetch('/report/screen', init).then(function (log) {
                console.log(log);
            }).catch(function (err) {
                console.log(err);
            });
        })()
    </script>
    `
}

export {
    generateInsertScript
}
