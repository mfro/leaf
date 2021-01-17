import * as pixi from 'pixi.js';
import { lifecycle, Vec, size } from '@/utils';

import * as leaf from './leaf';
import * as camera from './camera';

lifecycle.hook('init', 'wall', app => {
    function toast(pos: Vec, dims: Vec) {
        let g = new pixi.Graphics();
        g.beginFill(0x00FF00, 0.2)
        g.drawRect(pos.x, pos.y, dims.x, dims.y);
        g.endFill();

        camera.container.addChild(g);

        app.ticker.add(dT => {
            let collideX = leaf.pos.x >= pos.x && leaf.pos.x < pos.x + dims.x;
            let collideY = leaf.pos.y >= pos.y && leaf.pos.y < pos.y + dims.y;
            if (!collideX || !collideY) return;

            if (leaf.vel.x > 0) {
                leaf.wall(new Vec(pos.x - 2, leaf.pos.y), new Vec(-1, 0));
            } else {
                leaf.wall(new Vec(pos.x + dims.x + 2, leaf.pos.y), new Vec(1, 0));
            }
        });
    }

    toast(new Vec(size.x - 10, 0), new Vec(100, size.y));
});
