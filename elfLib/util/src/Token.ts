import * as objHash from 'object-hash'

export class Token {
    private static geneCheckCode(chars: string[]) {
        return String.fromCharCode(chars.map(c => c.charCodeAt(0)).reduce((pre, cur) => pre + cur) % 26 + 97)
    }

    static geneToken(obj: any): string {
        const token = objHash(obj, {algorithm: 'md5'})
        return this.geneCheckCode([...token]) + token
    }

    static checkToken(token: string): boolean {
        const [checkCode, ...chars] = token
        return chars.length === 32 && checkCode === this.geneCheckCode(chars)
    }
}