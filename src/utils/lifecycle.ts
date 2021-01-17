import * as pixi from 'pixi.js';

interface Listener {
    done: boolean;
    name: string;
    after: string[];
    callback: any;
}

const events = new Map<string, Array<Listener>>();

interface Events {
    init: pixi.Application
    reset: void,
    start: void,
}

// declare type HookArgs = { name: string, after: string[] };

export function hook<K extends keyof Events>(e: K, arg: string, callback: (a: Events[K]) => void) {
    let name = arg;

    let list = events.get(e);
    if (!list) events.set(e, list = []);

    list.push({
        done: false,
        name: name,
        after: [],
        callback: callback
    });
}

export function emit<K extends keyof Events>(e: K, arg?: Events[K]) {
    let list = events.get(e);
    if (!list) return;

    for (let item of list) {
        item.done = false;
    }

    for (let item of list) {
        call(list, item, arg);
    }
}

function call(list: Listener[], item: Listener, arg: any) {
    if (item.done) return;

    for (let name of item.after) {
        let dep = list.find(a => a.name == name);
        if (!dep) {
            console.error(`Dependency ${name} not found on ${item.name}`);
            continue;
        }
        call(list, dep, arg);
    }

    console.debug('Applying ' + item.name);
    item.done = true;
    item.callback(arg);
}
