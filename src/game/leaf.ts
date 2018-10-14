import * as pixi from 'pixi.js';

import { Vec } from '@/utils';
import { lifecycle, size } from '@/utils';
import * as input from '@/input';

import * as camera from './camera';

import leafUrl from '@/assets/leaf-1.png';
import leafSUrl from '@/assets/leaf-1-stretch.png';

let constants = {
  GRAV: 0.5,
  DRAG: 0.994,
  DRAG_MIN: 10,
  CONTROLS: 0.014,
  ROTATION: 0.002,
};

pixi.loader.add(leafUrl);
pixi.loader.add(leafSUrl);

export let vel = new Vec(12, 0);
export let pos = new Vec(size.x / 2, 500);
export let motion = new Vec(0, 0);

let upwards = new Vec(0, -1);
let rotation = 0;

export function push(off: Vec) {
  motion = Vec.add(motion, off);
}

export function wall(newPos: Vec, dir: Vec) {
  pos = newPos;
  vel = new Vec(0, 0.1);
  upwards = Vec.polar(1, dir.dir);
  rotation = -Math.PI / 2;
}

lifecycle.hook('init', 'leaf', app => {
  let basic = new pixi.Sprite(pixi.utils.TextureCache[leafUrl]);
  basic.texture.baseTexture.scaleMode = pixi.SCALE_MODES.NEAREST;
  basic.x = -8;
  basic.y = -22;
  basic.rotation = Math.PI / 8;

  let stretch = new pixi.Sprite(pixi.utils.TextureCache[leafSUrl]);
  stretch.texture.baseTexture.scaleMode = pixi.SCALE_MODES.NEAREST;
  stretch.x = -8;
  stretch.y = -22;
  stretch.rotation = Math.PI / 8;

  let texture = new pixi.Container();
  texture.scale = new pixi.Point(2, 2);
  texture.addChild(basic);
  texture.addChild(stretch);

  let leaf = new pixi.Container();
  leaf.addChild(texture);
  camera.container.addChild(leaf);

  // let debug = new pixi.Graphics();
  // app.stage.addChild(debug);

  let floor = size.y - 6;

  camera.follow(leaf);

  app.ticker.add(dT => {
    let landed = pos.y >= floor;

    if (landed) {
      pos = new Vec(pos.x, floor);
      upwards = new Vec(0, 1);
      rotation = 0;
    } else if (!input.isDown(input.SPACE)) {
      pos = Vec.add(pos, vel);
      pos = Vec.add(pos, new Vec(0, 0.5));

      pos = Vec.add(pos, motion);

      // let proj = Vec.polar(Vec.dot(motion, vel) / vel.len, vel.dir);
      // let remain = Vec.add(motion, Vec.polar(-proj.len, proj.dir));

      // vel = Vec.add(vel, proj);
      // motion = remain;

      motion = Vec.polar(motion.len * 0.86, motion.dir);

      let delta = Vec.delta(vel, upwards) / (Math.PI / 2);
      delta *= vel.len * constants.ROTATION;

      if (input.isDown(input.LEFT))
        delta -= constants.CONTROLS;
      else if (input.isDown(input.RIGHT))
        delta += constants.CONTROLS;

      vel = Vec.polar(vel.len, vel.dir + delta);
      upwards = Vec.polar(1, upwards.dir + delta);

      rotation += delta;

      if (vel.y < 0) {
        let grav = Vec.polar(-constants.GRAV, vel.dir);
        vel = Vec.add(vel, grav);
      } else {
        let grav = Vec.polar(constants.GRAV, vel.dir);
        vel = Vec.add(vel, grav);
      }

      if (vel.len < 1) {
        if (upwards.y > 0)
          upwards = Vec.polar(-upwards.len, upwards.dir);
      }

      if (vel.len > constants.DRAG_MIN)
        vel = Vec.polar(vel.len * constants.DRAG, vel.dir);
    }

    let fast = vel.len > 15;
    basic.visible = !fast;
    stretch.visible = fast;

    leaf.x = pos.x;
    leaf.y = pos.y;
    leaf.rotation = rotation;

    // debug.x = pos.x;
    // debug.y = pos.y;

    // debug.clear();
    // debug.lineStyle(2, 0xFF0000, 1);
    // debug.moveTo(0, 0);
    // debug.lineTo(motion.x * 20, motion.y * 20);
  });
});
