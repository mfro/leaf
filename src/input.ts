export const
    SPACE = 32,
    LEFT = 37,
    RIGHT = 39;

let down = new Set<number>();

window.addEventListener('keydown', e => {
    down.add(e.keyCode);
});

window.addEventListener('keyup', e => {
    down.delete(e.keyCode);
});

export function isDown(k: number) {
    return down.has(k);
}
