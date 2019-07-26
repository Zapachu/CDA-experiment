import {Response} from 'express'

export function sendErrorPage(res: Response, text: string) {
    return res.send(`
         <html>
             <body style="display:flex;justify-content:center;align-items:center;font-size:3rem;">
                 <div>${text}</div>
             </body>
         </html>
     `)
}