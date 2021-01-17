interface Listener {
    done: boolean;
    name: string;
    after: string[];
    callback: Callback;
}

const events = new Map<string, Array<Listener>>();

declare type ApplicationEvent = 'init' | 'start';
declare type Callback = (app: PIXI.Application) => void;
declare type HookArgs = { name: string, after: string[] };

export function hook(e: ApplicationEvent, name: string, callback: Callback): void
export function hook(e: ApplicationEvent, arg: HookArgs, callback: Callback): void
export function hook(e: ApplicationEvent, arg: string | HookArgs, callback: Callback) {
    let name: string, after: string[];

    if (typeof arg == 'string') {
        name = arg;
        after = [];
    } else {
        name = arg.name;
        after = arg.after;
    }

    let list = events.get(e);
    if (!list) events.set(e, list = []);

    list.push({
        done: false,
        name: name,
        after: after || [],
        callback: callback
    });
}

export function emit(e: ApplicationEvent, app: PIXI.Application) {
    let list = events.get(e);
    if (!list) return;

    for (let item of list) {
        call(list, item, app);
    }
}

function call(list: Listener[], item: Listener, app: PIXI.Application) {
    if (item.done) return;

    for (let name of item.after) {
        let dep = list.find(a => a.name == name);
        if (!dep) {
            console.error(`Dependency ${name} not found on ${item.name}`);
            continue;
        }
        call(list, dep, app);
    }

    console.debug('Applying ' + item.name);
    item.done = true;
    item.callback(app); 
}
