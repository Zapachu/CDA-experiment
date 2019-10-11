enum Mode {
    HR,
    LR,
    BR
}
interface Args{
    playersPerGroup: number,
    c1: number,
    c2: Array<number>,
    mode: Mode,
}

export function regC2({playersPerGroup,c1,c2,mode}:Args):boolean {
    if(mode === Mode.BR) {
        if(c1 === 1) {
            let flag:boolean = false
            c2.forEach((val,index) => {
                if(index > 0 && val === undefined) {
                    flag = true
                }
            })
            return (!c1 || flag || c2.length !== playersPerGroup + 1)
        }else if(c1 === 2) {
            return (!c1 || c2.includes(undefined) || c2.length !== playersPerGroup)
        }else {
            return true
        }
    }else if(mode === Mode.HR || mode === Mode.LR) {
        if(c1 === 1 || c1 === 2) {
            return (!c1 || c2.includes(undefined) || c2.length !== playersPerGroup + 1)
        }else if(c1 === -1){
            return (!c1 || c2.includes(undefined) || c2.length !== playersPerGroup)
        }else {
            return true
        }
    }else {
        return true
    }
}