'use strict'

const ErrorPage = (res, text) => {
    return res.send(`
         <html>
             <body style="display:flex;justify-content:center;align-items:center;font-size:3rem;">
                 <div>${text}</div>
             </body>
         </html>
     `)
}

export {
    ErrorPage
}
