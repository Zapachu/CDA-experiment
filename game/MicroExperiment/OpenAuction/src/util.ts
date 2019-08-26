export class Number {
    static random(min: number, max: number, digit: number = 2): number {
        return this.format(Math.random() * (max - min) + min, digit)
    }

    static format(num: number, digit: number = 2): number {
        return +num.toFixed(digit)
    }
}