import * as pixi from 'pixi.js';

import { Vec } from '@/utils';
import { lifecycle, size } from '@/utils';
import * as input from '@/input';

import * as camera from './camera';
import * as world from './world';

import leafUrl from '@/assets/leaf-1.png';
import leafSUrl from '@/assets/leaf-1-stretch.png';
import * as physics from './physics';
import { Entity, Manifold } from './physics';

class Leaf extends Entity {
  constructor() {
    super();
    this.position = new Vec(size.x / 2, 100);
    this.size = new Vec(12, 12);
  }

  onCollision(o: Entity, man: Manifold) {
    this.position = Vec.add(this.position, Vec.scale(man.normal, man.depth));

    if (man.normal.y > 0) {
      vel = new Vec(0, 0.2);
      motion = new Vec(0, 0);

      stun = 10;
      upwards = new Vec(-1, 0);
      rotation = -Math.PI / 2;
    } else if (man.normal.y < 0) {
      landed = true;
    } else {
      vel = new Vec(0, .1);
      motion = new Vec(0, 0);

      stun = 10;
      upwards = man.normal;
      rotation = -Math.PI / 2;
    }
  }
}

let constants = {
  GRAV: 0.8,
  DRAG: 0.993,
  DRAG_MIN: 0,
  CONTROLS: 0.014,
  ROTATION: 0.002,
};

pixi.loader.add(leafUrl);
pixi.loader.add(leafSUrl);

export let vel: Vec;
export let motion: Vec;
export let entity: Leaf;

let stun: number;
let upwards: Vec;
let rotation: number;
let landed: boolean;

export function push(off: Vec) {
  motion = Vec.add(motion, off);
}

lifecycle.hook('reset', 'leaf', () => {
  vel = new Vec(12, 0);
  motion = new Vec(0, 0);
  entity = new Leaf();
  stun = 0;
  upwards = new Vec(0, -1);
  rotation = 0;
  landed = false;
});

lifecycle.hook('start', 'leaf', () => {
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

  // camera.follow(leaf);

  physics.addEntity(entity);

  let delay = 0;
  world.tick(dT => {
    if (delay > dT) {
      delay -= dT;
    } else {
      delay = 1;
      if (landed) {
        entity.velocity = new Vec(0, 0);
        upwards = new Vec(0, 1);
        rotation = 0;
      } else if (!input.isKeyDown(input.SPACE)) {

        motion = Vec.polar(motion.len * 0.95, motion.dir);

        // let proj = Vec.polar(Vec.dot(motion, vel) / vel.len, vel.dir);
        // let remain = Vec.add(motion, Vec.polar(-proj.len, proj.dir));

        // vel = Vec.add(vel, proj);
        // motion = remain;

        let delta = Vec.delta(vel, upwards) / (Math.PI / 2);
        delta *= vel.len * constants.ROTATION;

        if (stun > 0)
          --stun;
        else {
          if (input.isKeyDown(input.LEFT))
            delta -= constants.CONTROLS;
          else if (input.isKeyDown(input.RIGHT))
            delta += constants.CONTROLS;
        }

        vel = Vec.polar(vel.len, vel.dir + delta);
        upwards = Vec.polar(1, upwards.dir + delta);
        rotation += delta;

        let grav = constants.GRAV * Math.abs(vel.y / vel.len)
        if (vel.y < 0)
          grav = -grav;
        vel = Vec.add(vel, Vec.polar(grav, vel.dir));

        if (vel.len < 1) {
          if (upwards.y > 0)
            upwards = Vec.polar(-upwards.len, upwards.dir);
        }

        if (vel.len > constants.DRAG_MIN)
          vel = Vec.polar(vel.len * constants.DRAG, vel.dir);

        entity.velocity = Vec.add(vel, Vec.add(motion, new Vec(0, 1)));
      }


      let fast = vel.len > 15;
      basic.visible = !fast;
      stretch.visible = fast;

      leaf.x = entity.position.x;
      leaf.y = entity.position.y;
      leaf.rotation = rotation;

      if (input.isKeyDown(input.UP)) {
        for (let i = 0; i < 100; ++i)
          camera.confetti(new Vec(entity.position.x, entity.position.y));
      }
    }
  });
});
