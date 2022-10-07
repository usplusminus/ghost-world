export function point(x: number, y: number): Point {
    return {x, y}
}

export type Point = {
    x: number,
    y: number,
}


export type Velocity = {
    horizontal: number,
    vertical: number
}
