import * as pixi from 'pixi.js';
import { lifecycle, Vec, size } from '@/utils';

import * as leaf from './leaf';
import * as camera from './camera';

lifecycle.hook('init', 'wind', app => {
  function toast(pos: Vec, dims: Vec, force: Vec) {
    let g = new pixi.Graphics();
    g.beginFill(0x0000FF, 0.2)
    g.drawRect(pos.x, pos.y, dims.x, dims.y);
    g.endFill();

    camera.container.addChild(g);

    app.ticker.add(dT => {
      let collide = leaf.pos.x >= pos.x && leaf.pos.x < pos.x + dims.x &&
        leaf.pos.y >= pos.y && leaf.pos.y < pos.y + dims.y;

      if (!collide) return;

      if (force.y > force.x) {
        let sail1 = Vec.polar(1, leaf.vel.dir + Math.PI / 2);
        let sail2 = Vec.polar(1, leaf.vel.dir - Math.PI / 2);
        let dot1 = Vec.dot(force, sail1);
        let dot2 = Vec.dot(force, sail2);

        let sail = dot1 < 0 ? sail2 : sail1;
        let dot = dot1 < 0 ? dot2 : dot1;

        leaf.push(Vec.polar(dot, sail.dir));
      } else {
        leaf.push(force);
      }
    });
  }

  toast(new Vec(0, 0), new Vec(500, size.y), new Vec(0, -2));
  // toast(new Vec(0, 0), new Vec(size.x - 500, 500), new Vec(3, 0));
});
