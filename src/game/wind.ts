import * as pixi from 'pixi.js';
import { lifecycle, Vec, size } from '@/utils';

import * as leaf from './leaf';
import * as camera from './camera';
import * as world from './world';

import windSprite from '@/assets/wind.png';

pixi.loader.add(windSprite);

let FRAME_COUNT = 23;
let FRAME = new Vec(64, 16);

export function addWind(pos: Vec, dims: Vec, force: Vec, animate = true) {
  let sprites: { anim: number, delay: number, sprite: pixi.Sprite }[] = [];
  let ratio = .0000003 * Vec.dot(dims, dims) * force.len;
  if (!animate) ratio = 0;

  let delay = 0;
  world.tick((dT) => {
    if (delay > dT) {
      delay -= dT;
    } else {
      delay = 1;
      for (let i = sprites.length - 1; i >= 0; --i) {
        let s = sprites[i];

        if (--s.delay < 0) {
          s.delay = 1;
          ++s.anim;
          if (s.anim == FRAME_COUNT) {
            camera.container.removeChild(s.sprite);
            sprites.splice(i, 1);
          } else {
            s.sprite.texture.frame = new pixi.Rectangle(0, FRAME.y * s.anim, FRAME.x, FRAME.y);
          }
        }
      }

      if (Math.random() < ratio) {
        let t = new pixi.Texture(pixi.utils.TextureCache[windSprite]);
        let s = new pixi.Sprite(t);
        s.texture.baseTexture.scaleMode = pixi.SCALE_MODES.NEAREST;
        camera.container.addChild(s);
        s.anchor.x = 0.5;
        s.anchor.y = 0.5;
        s.rotation = force.dir;
        s.x = pos.x + Math.random() * dims.x;
        s.y = pos.y + Math.random() * dims.y;
        s.scale = new pixi.Point(4, force.x < 0 ? -4 : 4);
        s.texture.frame = new pixi.Rectangle(0, 0, FRAME.x, FRAME.y);
        sprites.push({
          anim: 0,
          delay: 1,
          sprite: s,
        });
      }

      let collide = leaf.entity.position.x >= pos.x && leaf.entity.position.x < pos.x + dims.x &&
        leaf.entity.position.y >= pos.y && leaf.entity.position.y < pos.y + dims.y;

      if (!collide) return;

      if (force.y > force.x) {
        let sail1 = Vec.polar(1, leaf.entity.velocity.dir + Math.PI / 2);
        let sail2 = Vec.polar(1, leaf.entity.velocity.dir - Math.PI / 2);
        let dot1 = Vec.dot(force, sail1);
        let dot2 = Vec.dot(force, sail2);

        let sail = dot1 < 0 ? sail2 : sail1;
        let dot = dot1 < 0 ? dot2 : dot1;

        leaf.push(Vec.polar(dot, sail.dir));
      } else {
        leaf.push(force);
      }
    }
  });
}
