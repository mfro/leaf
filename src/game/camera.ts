import * as pixi from 'pixi.js';

import { Container } from 'pixi.js';
import { lifecycle } from '@/utils';

export const container = new Container();

let app: pixi.Application;
let target: pixi.DisplayObject | null = null;

export function follow(t: pixi.DisplayObject) {
    target = t;
}

lifecycle.hook('init', 'camera', ap => {
    app = ap;
    app.renderer.on('prerender', update);

    app.stage.addChild(container);

    let count = 100;
    let confettis = [];
});

function update() {
    if (!target) return;

    console.log('test');

    container.position = new pixi.Point(
        -target.x + app.view.width / 2,
        -target.y + app.view.height / 2);
}
