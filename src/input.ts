export const
    ENTER = 13,
    ESC = 27,
    SPACE = 32,
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    N1 = 49,
    N2 = 50,
    N3 = 51;

let down = new Set<number>();
let listeners = new Map<number, (() => void)[]>();

window.addEventListener('keydown', e => {
    console.debug(e.keyCode);
    if (down.has(e.keyCode))
        return;

    down.add(e.keyCode);

    let list = listeners.get(e.keyCode);
    if (!list) return;

    for (let item of list) {
        item();
    }
});

window.addEventListener('keyup', e => {
    down.delete(e.keyCode);
});

export function isKeyDown(k: number) {
    return down.has(k);
}

export function onKeyDown(key: number, handler: () => void) {
    let list = listeners.get(key);
    if (!list) listeners.set(key, list = []);
    list.push(handler);
}
