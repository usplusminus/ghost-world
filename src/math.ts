export function random(x = 1, b = 0) {
    return Math.random() * x + b;
}

export function randomInRange(a: number, b: number) {
    return Math.random() * (b - a) + a;
}

export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

export function noise(x: number, y: number, t = 101) {
    const w0 = Math.sin(0.3 * x + 1.4 * t + 2.0 +
        2.5 * Math.sin(0.4 * y + -1.3 * t + 1.0));
    const w1 = Math.sin(0.2 * y + 1.5 * t + 2.8 +
        2.3 * Math.sin(0.5 * x + -1.2 * t + 0.5));
    return w0 + w1;
}


export function sampleList<T>(a: T[]): T {
    return a.at(Math.round(Math.random() * a.length - 1))!
}

export function sampleString(s: string): string {
    return sampleList(s.split(""))
}
