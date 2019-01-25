export class Debouncer {
    private timer:NodeJS.Timer = null

    constructor(private interval:number){}
    
    async push(fn: () => void | Promise<void>) {
        if(this.timer){
            return
        }
        await fn()
        this.timer = global.setTimeout(()=>this.timer = null, this.interval * (0.75 + 0.5 * Math.random()))
    }
}